export const track = {
  id: 'sql', name: 'SQL', lang: 'sql',
  tagline: 'Data in SQL Server: querying, schema design, indexing, transactions, and tuning.',
  lessons: [
    // ---------------- Beginner ----------------
    {
      id: 'select', title: 'Tables, rows and SELECT', level: 0, mins: 25,
      terms: [
        ['Primary key (`id`)', "Column (or pair of columns) uniquely identifying each row in a table. Other tables point to it with foreign keys."],
        ['Projection vs Filter (`SELECT` vs `WHERE`)', '`WHERE` chooses which *rows* survive, while `SELECT` chooses which *columns* appear in the result set.'],
        ['Clause execution order', 'SQL runs clauses logically in `FROM → WHERE → ORDER BY → SELECT → TOP/LIMIT` order, even though `SELECT` appears first.']
      ],
      why: "Most apps sit in front of a database, and `SELECT` is how you read data out. Because queries read almost like English, it's a comfortable way to inspect data. These examples use SQL Server, ASP.NET Core's usual database.",
      points: [
        "Relational databases store data in **tables**. Each **row** represents one record (like a customer), and each **column** holds one field (their city).",
        "A **primary key** uniquely identifies every row, usually as `id`.",
        "`SELECT` picks columns, `WHERE` filters rows, `ORDER BY` sorts them, and `TOP (n)` keeps the first n. `OFFSET … FETCH` handles paging.",
        "SQL uses a **declarative** model where you describe the result you want, and the engine chooses the steps.",
        "Text literals use single quotes (`'Jakarta'`). `LIKE 'A%'` matches text patterns, while `IN (...)` and `BETWEEN` shorten common filters.",
        "SQL Server often prefixes strings as `N'Jakarta'` for Unicode `NVARCHAR` columns. Without `N`, characters outside the database code page can turn into `?`.",
        "Whether `LIKE` and `=` care about letter case depends on the column's **collation**. Most SQL Server databases ignore case by default.",
        "The playground runs SQLite, which puts `LIMIT 3` at the end instead of SQL Server's `TOP (3)` right after `SELECT`."
      ],
      code: `
-- All customers
SELECT id, name, city FROM customers;

-- Filter rows, sort, and keep the top 3
SELECT TOP (3) name, price
FROM products
WHERE category = 'Tech' AND price < 500
ORDER BY price DESC;

-- Pattern matching and lists
SELECT name FROM customers WHERE name LIKE 'A%';
SELECT name FROM customers WHERE city IN ('Jakarta', 'Bandung');

-- Computed column with an alias. price is DECIMAL, so the result is exact: 1332.0000
SELECT name, price, price * 1.11 AS price_with_tax
FROM products;

-- Page 2, three products per page
SELECT name, price
FROM products
ORDER BY price DESC
OFFSET 3 ROWS FETCH NEXT 3 ROWS ONLY;
`,
      practice: "Open the SQL playground and solve the first three challenges using `LIMIT` instead of `TOP`. Next, list the five priciest non-'Tech' products. In SQLite, `price * 1.11` shows float drift (`1332.0000000000002`), so wrap it in `ROUND(…, 2)`.",
      teach: "Explain tables, rows, columns, and primary keys to someone who only knows spreadsheets.",
      analogy: "Think of `SELECT … WHERE … ORDER BY` like asking a librarian for the title and author of books published after 2020, newest first. You specify what you want, not which aisles to walk down.",
      pitfalls: [
        "Double quotes around text. With `QUOTED_IDENTIFIER ON` in SQL Server (and in PostgreSQL), `\"Tech\"` looks for a column named Tech and fails. SQLite accepts it without warning.",
        "Assuming rows come back in insertion order. Without `ORDER BY`, SQL makes no order guarantee.",
        "Writing `TOP (3)` with no `ORDER BY`, which returns any three rows rather than the true top three.",
        "Reading SQL top-to-bottom like imperative code. Check the GROUP BY lesson for the actual order."
      ],
      quiz: [
        { q: "Which clause chooses which **rows** are returned?", a: ["`SELECT`", "`WHERE`", "`ORDER BY`", "`TOP`"], c: 1, why: "`WHERE` filters rows, `SELECT` picks columns, and `TOP` trims the sorted list." },
        { q: "Without `ORDER BY`, the order of rows is…", a: ["by primary key", "by insertion time", "not guaranteed", "by the clustered index, always"], c: 2, why: "Small tables often look key-ordered by chance, yet a parallel plan or new index can shuffle rows anytime." },
        { q: "What does `WHERE name LIKE 'A%'` match?", a: ["Names containing the % character", "Names that start with A", "Names that end with A", "Exactly the name 'A%'"], c: 1, why: "`%` acts as a wildcard matching zero or more characters." },
        { q: "`SELECT TOP (3) name FROM products;` with no `ORDER BY` returns…", a: ["The 3 most expensive products", "The 3 cheapest products", "Any 3 rows", "The 3 most recently added products"], c: 2, why: "`TOP` keeps the first rows in whatever order arrives, and without `ORDER BY` none is guaranteed." }
      ]
    },
    {
      id: 'dml', title: 'Changing data, types and NULL', level: 0, mins: 25,
      terms: [
        ['Three-valued `NULL`', '`NULL` represents an *unknown* value rather than zero or `""`. Because `city = NULL` evaluates to unknown, always write `IS NULL`.'],
        ['`DECIMAL(p, s)` vs `FLOAT`', 'Base-10 fixed types like `DECIMAL(10,2)` avoid binary floating-point rounding drift on prices and money.'],
        ['Parameterized DML', 'Binding input via parameters (`@price`) in `INSERT`, `UPDATE`, and `DELETE` blocks SQL injection completely.']
      ],
      predict: {
        prompt: "Before the `INSERT`, the table has 6 customers: Ana and Dewi live in Jakarta and Eko has `city = NULL`. How many rows does `SELECT name FROM customers WHERE city <> 'Jakarta';` return?",
        options: ['`4`: Budi, Citra, Eko and Fitri', '`3`: Eko is left out', '`0`: one NULL in the column makes every comparison unknown'],
        answer: 1,
        explain: "SQL uses three-valued logic. `NULL <> 'Jakarta'` is not true but *unknown*, and `WHERE` keeps only rows where the condition is true, so Eko disappears along with Ana and Dewi. Other rows are compared independently, so Budi, Citra and Fitri remain. To include unknown cities, say so explicitly: `WHERE city <> 'Jakarta' OR city IS NULL`."
      },
      why: "Reads don't break data, while writes can wipe a table fast. Here are the habits that keep bad writes contained, plus how `NULL` breaks normal equality checks.",
      points: [
        "`INSERT INTO t (cols) VALUES (…)` adds rows. `UPDATE t SET … WHERE …` edits matching rows, and `DELETE FROM t WHERE …` removes them.",
        "Leaving off `WHERE` on `UPDATE` or `DELETE` hits **every row** in the table. Test your `WHERE` clause with a `SELECT` first.",
        "Wrap risky updates inside `BEGIN TRANSACTION`, verify the affected row count, then choose `COMMIT` or `ROLLBACK`.",
        "Pick fitting types: `INT` for counts, `DECIMAL(10,2)` for money, `NVARCHAR(n)` for Unicode text, `DATE` or `DATETIME2` for timestamps, and `BIT` for booleans.",
        "`NULL` means **unknown or missing**, never zero or an empty string.",
        "Comparing anything to `NULL` yields unknown, so `NULL = NULL` isn't true. Filter with `IS NULL` and `IS NOT NULL`.",
        "`COALESCE(a, b)` picks the first non-NULL value, which is handy for fallback defaults."
      ],
      code: `
INSERT INTO customers (name, city) VALUES ('Gita', 'Surabaya');   -- id is generated by IDENTITY

-- Safe habit: run the SELECT first, then make the change inside a transaction
SELECT id, name, price FROM products WHERE category = 'Home';     -- 3 rows

BEGIN TRANSACTION;
UPDATE products SET price = price * 0.9 WHERE category = 'Home';
SELECT @@ROWCOUNT AS rows_changed;                                -- 3, as expected
COMMIT;                                                           -- or ROLLBACK if the number surprised you

-- A foreign key protects related rows: order 4 still has items
-- DELETE FROM orders WHERE id = 4;    -- fails: conflicts with the REFERENCE constraint on order_items
DELETE FROM order_items WHERE order_id = 4;
DELETE FROM orders WHERE id = 4;

-- NULL logic
SELECT name FROM customers WHERE city = NULL;      -- returns nothing, always
SELECT name FROM customers WHERE city IS NULL;     -- Eko

SELECT name, COALESCE(city, 'Unknown') AS city FROM customers;
`,
      practice: "In the playground, insert yourself as a customer, give yourself an order with one item, then delete that order. Before each write, run the matching `SELECT` and note how many rows it will touch. You'll have to delete the item before the order: that's the foreign key doing its job.",
      teach: "Explain why `WHERE city = NULL` returns no rows, and what to write instead.",
      analogy: "NULL works like a sealed envelope whose contents nobody can see. Ask if two sealed envelopes match and the honest answer is unknown, never yes or no. SQL `WHERE` keeps only rows that answer yes.",
      pitfalls: [
        "Running `DELETE FROM orders;` without `WHERE` and spotting the mistake too late. Transactions let you roll it back beforehand.",
        "Treating NULL like zero in math: `price + NULL` stays NULL.",
        "Writing `NOT IN (subquery)` and getting zero rows back whenever the subquery holds a NULL.",
        "Expecting `DELETE` on a parent row to wipe children automatically. Foreign keys reject it unless defined with `ON DELETE CASCADE`."
      ],
      quiz: [
        { q: "What does `UPDATE products SET price = 0;` do?", a: ["Nothing, because `UPDATE` requires a `WHERE`", "Sets the price of every product to 0", "Only updates rows where price is NULL", "Updates the first row only"], c: 1, why: "With no `WHERE` filter, every row in the table matches." },
        { q: "The result of `NULL = NULL` in SQL is…", a: ["true", "false", "unknown", "an error"], c: 2, why: "Comparing two unknowns stays unknown, so write `IS NULL`." },
        { q: "What does `COALESCE(nickname, name, 'N/A')` return?", a: ["Always 'N/A'", "The first of the three that is not NULL", "All three joined together", "NULL if any of them is NULL"], c: 1, why: "`COALESCE` checks arguments left to right and returns the first non-NULL value." }
      ]
    },
    {
      id: 'aggregate', title: 'GROUP BY, aggregates and query order', level: 0, mins: 35, viz: 'sqlorder',
      terms: [
        ['Aggregate (`COUNT`, `SUM`, `AVG`)', 'Rolls grouped rows into one summary number. `COUNT(*)` counts `NULL` rows, while `COUNT(col)` skips `NULL` values.'],
        ['`WHERE` vs `HAVING`', '`WHERE` filters raw rows *before* `GROUP BY` makes buckets, and `HAVING` filters groups *after* aggregation runs.'],
        ['Logical SQL pipeline', "Since `SELECT` evaluates after `WHERE`, `WHERE` can't read column aliases (`AS total`) in SQL Server or PostgreSQL."]
      ],
      predict: {
        prompt: 'A `customers` table has 5 rows, and 1 customer has `city = NULL`. What do `COUNT(*)` and `COUNT(city)` return?',
        options: ['Both return `5`', '`COUNT(*)` returns `5`, while `COUNT(city)` returns `4`', '`COUNT(*)` returns `5`, while `COUNT(city)` returns `NULL`'],
        answer: 1,
        explain: "`COUNT(*)` counts all rows including nulls (`5`), whereas `COUNT(col)` only counts non-`NULL` entries (`4`)."
      },
      why: "Dashboards and reports rely on aggregates for totals, counts, and averages. They're also where you first wonder why `WHERE` rejects `SELECT` aliases, which comes straight from SQL's real execution order.",
      points: [
        "Aggregates shrink many rows down to one value (`COUNT(*)`, `SUM`, `AVG`, `MIN`, `MAX`).",
        "`GROUP BY` sorts rows into buckets, turning each bucket into **one output row**.",
        "Every column you list in `SELECT` must either be in `GROUP BY` or sit inside an aggregate.",
        "`WHERE` drops rows **before** grouping, while `HAVING` drops buckets **after** aggregation.",
        "Logical order runs `FROM` → `WHERE` → `GROUP BY` → `HAVING` → `SELECT` → `ORDER BY` → `TOP`/`OFFSET`. That's why `ORDER BY` sees `SELECT` aliases while `WHERE` doesn't.",
        "`COUNT(*)` counts rows, `COUNT(col)` counts non-NULL values, and `COUNT(DISTINCT col)` counts unique values.",
        "SQLite in the playground is permissive: it allows `WHERE` aliases and ungrouped columns. Both SQL Server and PostgreSQL reject them."
      ],
      code: `
-- How many products, and what average price, per category?
SELECT category,
       COUNT(*)                          AS products,
       CAST(AVG(price) AS DECIMAL(10,2)) AS avg_price
FROM products
GROUP BY category;

-- WHERE filters rows first; HAVING filters the groups afterwards
SELECT customer_id, COUNT(*) AS paid_orders
FROM orders
WHERE status = 'paid'
GROUP BY customer_id
HAVING COUNT(*) >= 2
ORDER BY paid_orders DESC;     -- the alias works here: ORDER BY runs after SELECT

-- ...WHERE paid_orders >= 2   would fail: "Invalid column name". WHERE runs before SELECT.
`,
      practice: "Using the playground, find the total quantity sold per product, only for products that sold more than 3 units, highest first. Then step through the visualization and say out loud what each clause does to the rows.",
      teach: "Explain the difference between `WHERE` and `HAVING`, and why SQL does not run in the order it is written.",
      analogy: "Sorting coins. First throw out the foreign coins (`WHERE`). Then make piles by denomination (`GROUP BY`). Then keep only piles taller than ten coins (`HAVING`). Then write down each pile's label and total (`SELECT`). Finally arrange the notes by total (`ORDER BY`).",
      pitfalls: [
        "Putting an aggregate inside `WHERE`, like `WHERE COUNT(*) > 2`, which throws a syntax error.",
        "Selecting an ungrouped column next to an aggregate. SQL Server stops you, while SQLite grabs an arbitrary value without warning.",
        "`AVG` on an `INT` column returns an `INT` in SQL Server, so averaging 1 and 2 returns 1. Cast first with `AVG(CAST(quantity AS DECIMAL(10,2)))`."
      ],
      quiz: [
        { q: "Which clause can filter on `SUM(amount) > 100`?", a: ["`WHERE`", "`HAVING`", "`ORDER BY`", "`GROUP BY`"], c: 1, why: "Aggregates aren't calculated until grouping finishes, and `HAVING` runs after `GROUP BY`." },
        { q: "Logically, which runs first?", a: ["`SELECT`", "`WHERE`", "`FROM`", "`GROUP BY`"], c: 2, why: "SQL must identify the source table first before filtering or grouping its rows." },
        { q: "A column has values 5, NULL, 7. What is `COUNT(col)`?", a: ["3", "2", "12", "NULL"], c: 1, why: "`COUNT(col)` skips NULL values, whereas `COUNT(*)` would return 3." },
        { q: "`quantity` is an `INT` column with values 1 and 2. What does `AVG(quantity)` return in SQL Server?", a: ["1.5", "1", "2", "NULL"], c: 1, why: "In SQL Server, averaging integers truncates to an integer. Cast to `DECIMAL` first to get 1.5." }
      ]
    },
    // ---------------- Intermediate ----------------
    {
      id: 'joins', title: 'JOINs: combining tables', level: 1, mins: 35, viz: 'joins',
      terms: [
        ['`INNER JOIN` vs `LEFT JOIN`', '`INNER JOIN` keeps only matching pairs. `LEFT JOIN` preserves every left-table row and pads unmatched right columns with `NULL`.'],
        ['Foreign key (`customer_id`)', "Column linking child rows (`orders`) to a parent table's primary key (`customers.id`) so orphan records can't slip in."],
        ['Anti-join (`IS NULL`)', '`LEFT JOIN ... WHERE o.id IS NULL` finds parent rows with zero matching children, such as customers with no orders.']
      ],
      predict: {
        prompt: 'You run `customers c LEFT JOIN orders o ON o.customer_id = c.id WHERE o.status = \'paid\'`. What happens to Dewi, who has 0 orders?',
        options: ['Dewi stays in the output with `NULL` order columns', 'Dewi disappears (`LEFT JOIN` behaves like an `INNER JOIN`)', 'SQL returns a syntax error'],
        answer: 1,
        explain: "For Dewi, `o.status` is `NULL`, and `NULL = 'paid'` evaluates to unknown, so `WHERE` filters her out after the join. Move `o.status = 'paid'` into `ON` to keep Dewi."
      },
      why: "Normalized schemas split tables apart on purpose, and joins recombine them. The danger with picking the wrong join is there's no error message: rows disappear or duplicate without warning, throwing totals off.",
      points: [
        "Joins match rows across two tables using a key condition, usually `foreign key = primary key`.",
        "`INNER JOIN` keeps only pairs that match on both sides.",
        "`LEFT JOIN` keeps every row on the left and fills missing right columns with NULL. Reach for it when showing all customers even with zero orders.",
        "`RIGHT` and `FULL OUTER` preserve unmatched rows on the right or both sides, while `CROSS JOIN` builds every possible pair.",
        "Joins can **multiply rows**, so one customer with three orders appears three times. Check grain carefully before summing.",
        "Find rows with **no match** using `LEFT JOIN … WHERE right.id IS NULL` or `NOT EXISTS`."
      ],
      code: `
-- Orders with the customer's name
SELECT o.id, c.name, o.order_date
FROM orders AS o
INNER JOIN customers AS c ON c.id = o.customer_id;

-- Every customer and how many orders they have (including zero)
SELECT c.name, COUNT(o.id) AS orders
FROM customers AS c
LEFT JOIN orders AS o ON o.customer_id = c.id
GROUP BY c.id, c.name;

-- Customers who have never ordered
SELECT c.name
FROM customers AS c
LEFT JOIN orders AS o ON o.customer_id = c.id
WHERE o.id IS NULL;                               -- Fitri

-- Three tables: revenue per product
SELECT p.name, SUM(i.quantity * i.unit_price) AS revenue
FROM order_items AS i
JOIN products AS p ON p.id = i.product_id
JOIN orders   AS o ON o.id = i.order_id
WHERE o.status = 'paid'
GROUP BY p.id, p.name
ORDER BY revenue DESC;
`,
      practice: "Use the join visualizer to predict the row count for each join type before switching to it. Then, in the playground, list every customer with their total spend, showing 0 for customers with no paid orders.",
      teach: "Explain the difference between `INNER JOIN` and `LEFT JOIN` using customers and orders, including what happens to a customer with no orders.",
      analogy: "Two guest lists for a wedding: people invited and people who replied. INNER JOIN is 'invited and replied'. LEFT JOIN is 'everyone invited, with their reply if they sent one, blank if not'. The blanks are the people you still need to phone.",
      pitfalls: [
        "Putting a right-table filter inside `WHERE` after `LEFT JOIN`, which turns it back into an inner join. Put that condition in `ON` instead.",
        "Calling `COUNT(*)` after a left join counts NULL-padded unmatched rows as 1. Count a right-side column like `o.id` instead.",
        "Joining two separate one-to-many tables (such as orders and payments) directly to one parent and summing, which multiplies totals."
      ],
      quiz: [
        { q: "Customers has 4 rows (1 with no orders), and Orders has 5 rows matching valid customers. How many rows does `customers LEFT JOIN orders` return?", a: ["4", "5", "6", "9"], c: 2, why: "Five matched pairs plus one customer with no order, padded with NULLs." },
        { q: "How do you find customers with no orders?", a: ["`INNER JOIN … WHERE o.id IS NULL`", "`LEFT JOIN … WHERE o.id IS NULL`", "`LEFT JOIN … ON o.customer_id = c.id AND o.id IS NULL`", "`RIGHT JOIN … WHERE c.id IS NULL`"], c: 1, why: "Unmatched left rows carry NULLs on the right side, so filter for those after the join. Putting the test in `ON` keeps every customer." },
        { q: "After `LEFT JOIN orders o`, adding `WHERE o.status = 'paid'` does what?", a: ["Nothing changes", "Removes customers with no orders, acting like an inner join", "Keeps every customer but blanks their unpaid orders", "Causes an error"], c: 1, why: "NULL = 'paid' is unknown, so unmatched rows are filtered out. Blanking unpaid orders is what you get by moving the condition into `ON`." }
      ]
    },
    {
      id: 'subqueries', title: 'Subqueries and CTEs', level: 1, mins: 30,
      splits: [['1 · Scalar & EXISTS', '-- Products priced above the average'], ['2 · Chained CTEs', '-- CTEs: build the answer'], ['3 · Recursive CTE', '-- Recursive CTE']],
      terms: [
        ['CTE (`WITH ... AS`)', 'A named subquery at the top of a query so multi-step logic reads clearly from top to bottom.'],
        ['Correlated subquery / `EXISTS`', 'References the outer row inside a subquery. `EXISTS` stops as soon as it finds one match without multiplying rows.'],
        ['Scalar subquery', 'Returns one value (1 row, 1 column) for comparisons like `WHERE price > (SELECT AVG(price) FROM products)`.']
      ],
      predict: {
        prompt: "You find customers with no paid orders using `WHERE c.id NOT IN (SELECT o.customer_id FROM orders AS o WHERE o.status = 'paid')`. Then a bug inserts a paid order whose `customer_id` is NULL (assume the column allowed it). How many customers does the query return now?",
        options: ['The same customers as before: `IN` ignores NULLs', 'None: `NOT IN` against a list that contains NULL is never true', 'Every customer: a NULL matches nothing, so they all pass'],
        answer: 1,
        explain: '`x NOT IN (a, b, NULL)` expands to `x <> a AND x <> b AND x <> NULL`. The last comparison is unknown, so the whole `AND` can never be true and every row is filtered out. `NOT EXISTS` with `o.customer_id = c.id` has no such trap: a NULL `customer_id` simply never matches any customer.'
      },
      why: "Complex reporting questions build up in steps, like finding customers who beat the average spend and seeing what they bought. Subqueries and CTEs split that work into stages you can verify independently.",
      points: [
        "A **subquery** sits inside another query: inside `WHERE` (filtering against sets), `FROM` (derived tables), or `SELECT` (scalar values).",
        "A **correlated** subquery reads a column from the outer row and runs per row logically, which pairs naturally with `EXISTS`.",
        "`EXISTS` stops as soon as it spots one match, while `IN` compares against a list. Favor `NOT EXISTS` over `NOT IN` to stay safe from NULLs.",
        "A **CTE** (`WITH name AS (…)`) gives a subquery a name so queries read top to bottom. SQL Server recomputes a CTE each time it's used, so put reused results in a `#temp` table.",
        "Chain multiple CTEs to build transformations step by step and test each step on its own while debugging.",
        "A **recursive** CTE references itself to walk trees like nested categories or reporting lines."
      ],
      code: `
-- Products priced above the average
SELECT name, price
FROM products
WHERE price > (SELECT AVG(price) FROM products);

-- Customers with at least one paid order (correlated EXISTS)
SELECT c.name
FROM customers AS c
WHERE EXISTS (SELECT 1 FROM orders AS o
              WHERE o.customer_id = c.id AND o.status = 'paid');

-- CTEs: build the answer in named steps
WITH order_totals AS (
    SELECT o.id, o.customer_id, SUM(i.quantity * i.unit_price) AS total
    FROM orders AS o
    JOIN order_items AS i ON i.order_id = o.id
    GROUP BY o.id, o.customer_id
),
customer_spend AS (
    SELECT customer_id, SUM(total) AS spend, COUNT(*) AS orders
    FROM order_totals
    GROUP BY customer_id
)
SELECT c.name, s.orders, s.spend
FROM customer_spend AS s
JOIN customers AS c ON c.id = s.customer_id
ORDER BY s.spend DESC;

-- Recursive CTE: walk a category tree from the top down
DECLARE @categories TABLE (id INT, name NVARCHAR(50), parent_id INT NULL);
INSERT INTO @categories VALUES (1, 'All', NULL), (2, 'Tech', 1), (3, 'Laptops', 2), (4, 'Home', 1);

WITH tree AS (
    SELECT id, name, 0 AS depth FROM @categories WHERE parent_id IS NULL    -- anchor: the root
    UNION ALL
    SELECT c.id, c.name, t.depth + 1                                       -- step: children of rows found so far
    FROM @categories AS c
    JOIN tree AS t ON c.parent_id = t.id
)
SELECT REPLICATE('  ', depth) + name AS category, depth FROM tree ORDER BY depth;
`,
      practice: "In the playground, find the customers whose total spend is above the average customer's total spend. Write it with CTEs, and run each CTE on its own first to check the intermediate rows.",
      teach: "Explain what a CTE is and why you would use one instead of nesting subqueries.",
      analogy: "A CTE works like naming a step in a recipe. First make the pasta sauce and call it *sauce*, then pour *sauce* on top. Nested subqueries cram the whole recipe into one long sentence.",
      pitfalls: [
        "`NOT IN` with a subquery that returns a NULL. The whole condition becomes unknown and nothing is returned.",
        "Expecting a CTE used twice to be computed once. In SQL Server it runs each time it's referenced.",
        "Forgetting that in SQL Server the statement **before** `WITH` must end with a semicolon. Without it you get 'Incorrect syntax near the keyword with'.",
        "A subquery in `SELECT` that runs once per row when a join would do."
      ],
      quiz: [
        { q: "What is a correlated subquery?", a: ["One that returns multiple columns", "One that references a column from the outer query", "One that uses `IN`", "One that appears in `FROM`"], c: 1, why: "It depends on the current outer row, so logically it is evaluated for each one." },
        { q: "Why prefer `NOT EXISTS` to `NOT IN (subquery)`?", a: ["`NOT EXISTS` is always faster", "`NOT IN` returns no rows if the subquery yields any NULL", "`NOT IN` is not supported in SQL Server", "`NOT IN` can't use an index"], c: 1, why: "`x NOT IN (1, NULL)` is unknown for every x, so no row passes." },
        { q: "The main purpose of a CTE is…", a: ["Faster execution, always", "Readability: naming a step of the query", "Creating a temporary table that lasts for the session", "Caching a result so it is computed only once"], c: 1, why: "A CTE is a named expression that exists only for one statement. SQL Server doesn't cache it." }
      ]
    },
    {
      id: 'design', title: 'Schema design: keys, constraints and normalization', level: 1, mins: 40,
      splits: [['1 · Core tables', 'CREATE TABLE customers ('], ['2 · Junction table & indexes', '-- Junction table'], ['3 · JSON columns', '-- JSON: preferences']],
      terms: [
        ['Constraint (`CHECK`, `UNIQUE`, `NOT NULL`)', "Rules enforced by the database engine so invalid data can't slip in, even via ad-hoc scripts bypassing your API."],
        ['Normalization (1NF–3NF)', 'Keeping each fact in one place rather than duplicating names or addresses across orders so updates stay consistent.'],
        ['Surrogate vs Natural key', "Integer or GUID surrogate keys don't break foreign keys if a customer changes email or SKU later."]
      ],
      why: "Good application code can't rescue a bad schema, because every future query has to bend around it. Before finalizing a column, always ask what breaks if someone stores bad data there.",
      points: [
        "Give each **entity** its own table, store one instance per row, and keep each fact in **one place**.",
        "A **foreign key** guarantees real links: the database blocks an order pointing to a customer ID that doesn't exist.",
        "Model one-to-many with a foreign key on the child side, many-to-many with a join table like `order_items`, and use one-to-one sparingly.",
        "**Normalization** prevents duplicate data. 1NF bans lists packed in one cell, while 2NF and 3NF tie every non-key column solely to the key.",
        "Constraints validate writes for free (`NOT NULL`, `UNIQUE`, `CHECK (price >= 0)`, `DEFAULT`).",
        "Decide how parent deletes behave. Foreign keys block them by default, whereas `ON DELETE CASCADE` deletes child rows too.",
        "Watch SQL Server quirks: `IDENTITY` generates IDs, `NVARCHAR(n)` handles Unicode text (`TEXT` is deprecated), and foreign keys aren't auto-indexed.",
        "Only denormalize on purpose with a clear reason, like saving `unit_price` on an order item so catalog changes don't rewrite history.",
        "**JSON columns** work well for flexible settings or raw payloads you load as a blob. Validate them with `CHECK (ISJSON(col) = 1)`, query pieces with `JSON_VALUE` or `OPENJSON`, and promote anything you filter or join on to real columns."
      ],
      code: `
CREATE TABLE customers (
    id    INT IDENTITY PRIMARY KEY,
    name  NVARCHAR(100) NOT NULL,
    email NVARCHAR(254) NOT NULL UNIQUE
);

CREATE TABLE products (
    id    INT IDENTITY PRIMARY KEY,
    name  NVARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL CHECK (price >= 0)
);

CREATE TABLE orders (
    id          INT IDENTITY PRIMARY KEY,
    customer_id INT NOT NULL REFERENCES customers(id),
    order_date  DATE NOT NULL DEFAULT CAST(SYSDATETIME() AS DATE),
    status      NVARCHAR(20) NOT NULL DEFAULT 'new'
                CHECK (status IN ('new', 'paid', 'cancelled'))
);

-- Junction table for the many-to-many between orders and products
CREATE TABLE order_items (
    order_id   INT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,   -- items go with their order
    product_id INT NOT NULL REFERENCES products(id),                   -- a product that has sold can't be deleted
    quantity   INT NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(10,2) NOT NULL,     -- price at time of sale: a deliberate copy
    PRIMARY KEY (order_id, product_id)
);

-- SQL Server doesn't index foreign keys for you
CREATE INDEX ix_orders_customer ON orders (customer_id);
CREATE INDEX ix_order_items_product ON order_items (product_id);

-- JSON: preferences with no fixed shape, kept valid by a CHECK
ALTER TABLE customers ADD preferences NVARCHAR(MAX) NULL CHECK (ISJSON(preferences) = 1);
GO
INSERT INTO customers (name, email, preferences)
VALUES (N'Ana', N'ana@example.com', N'{"language": "id", "newsletter": true}');
SELECT name, JSON_VALUE(preferences, '$.language') AS language FROM customers;   -- Ana, id

-- OPENJSON turns a JSON array, such as order lines posted by the app, into rows
DECLARE @lines NVARCHAR(MAX) = N'[{"productId": 1, "quantity": 2}, {"productId": 3, "quantity": 1}]';
SELECT productId, quantity FROM OPENJSON(@lines) WITH (productId INT, quantity INT);
`,
      practice: "Design a library schema for books, multiple authors per book, members, and loans. List every key and constraint, and decide how deleting a member affects loan history. Pick one fact worth duplicating or explain why none is needed.",
      teach: "Explain why customer names and addresses don't belong on order rows, and what goes wrong if you copy them there.",
      analogy: "Normalization is writing each friend's phone number in one address book instead of on sticky notes around the house. If someone switches numbers, you edit one spot instead of missing a sticky note and ending up with two conflicting numbers.",
      pitfalls: [
        "Comma-separated tags in one column (`'red,blue'`), which breaks normal indexing, joins, and foreign keys.",
        "Dropping foreign keys 'for flexibility' and piling up orphan rows you can't clean up later.",
        "Over-normalizing history away: past invoices must keep the price charged at checkout.",
        "Storing money in `FLOAT` or `REAL`. Use `DECIMAL`, or cents will drift.",
        "Filtering frequently on `JSON_VALUE(preferences, '$.language') = 'id'`, which can't hit normal indexes. Extract it to a column or index a computed column."
      ],
      quiz: [
        { q: "Orders and products are many-to-many. How is that modelled?", a: ["A comma-separated `product_ids` column in `orders`", "A junction table with a foreign key to each", "An `order_id` column in `products`", "One `orders` row per product, repeating the order details"], c: 1, why: "A junction table holds one row per link and stores relationship attributes like quantity." },
        { q: "What does a foreign key constraint prevent?", a: ["Slow joins", "Rows that reference a parent row that does not exist", "Duplicate values in the column", "NULL values in the column"], c: 1, why: "It enforces parent-child links on writes. `UNIQUE` handles duplicates, and foreign key columns still allow NULL unless marked `NOT NULL`." },
        { q: "Why is `unit_price` stored on `order_items` even though `products` has `price`?", a: ["It was added by mistake and should come from a join", "The sale must keep the price at the time of purchase", "To make the join to `products` faster", "Foreign keys require a copy"], c: 1, why: "They're two separate facts: today's catalog price versus what the buyer paid at checkout." },
        { q: "Which data fits a JSON column best?", a: ["A customer's email, which must be unique", "Notification settings whose fields differ from customer to customer", "The `customer_id` an order belongs to", "A product's price, used in reports every day"], c: 1, why: "Flexible data read and saved as one unit suits JSON. Fields you constrain, join, or aggregate need real typed columns." }
      ]
    },
    // ---------------- Advanced ----------------
    {
      id: 'indexes', title: 'Indexes: how databases find rows fast', level: 2, mins: 40, viz: 'index',
      terms: [
        ['B-Tree seek vs Table scan', 'Indexes let SQL Server jump down sorted B-tree keys in O(log n) reads instead of scanning every table page in O(n).'],
        ['Clustered vs Covering index (`INCLUDE`)', 'Clustered indexes sort the table rows themselves. Adding `INCLUDE (col)` lets a non-clustered index answer queries without key lookups.'],
        ['Sargable predicate', 'Filters comparing bare indexed columns directly (`created_at >= ...`) allow seeks, while wrapping them (`YEAR(created_at)`) forces full scans.']
      ],
      predict: {
        prompt: 'Only `ix_orders_customer_date` on `(customer_id, order_date)` exists. Which filter can use an index **seek** on it?',
        options: ["`WHERE order_date >= '2026-02-01'`", "`WHERE customer_id = 2 AND order_date >= '2026-02-01'`", 'Both, because the index contains both columns'],
        answer: 1,
        explain: 'A composite index is sorted by `customer_id` first, and by `order_date` only *within* each customer, like a phone book sorted by surname and then first name. Constraining the leading column lets SQL Server jump straight to customer 2 and range-scan its dates. A filter on `order_date` alone must scan the whole index (or table), because matching dates are scattered across every customer.'
      },
      why: "The exact same query can finish in 5 ms or stall for 50 seconds depending on one missing index. Indexes are the first place to look whenever a page slows down as tables grow.",
      points: [
        "With no index, SQL scans every row in O(n) time. A B-tree index lets it walk a few sorted tree levels in O(log n) time (a **seek**).",
        "Each index maintains a sorted copy of chosen columns pointing back to rows. Reads get faster, while **writes slow down** and disk usage grows.",
        "In SQL Server, the **clustered index** stores the physical table sorted by key (usually the primary key), and non-clustered indexes point back to it. PostgreSQL uses unordered heaps instead.",
        "A **composite index** on `(a, b)` speeds up queries on `a` or `a AND b`, never `b` by itself (the leftmost-prefix rule). Put equality columns before range columns.",
        "A **covering index** includes extra columns via `INCLUDE (...)` so the engine satisfies the entire query from the index alone.",
        "Indexes help most on selective columns. On a `status` column holding only three values, SQL Server will often ignore it and scan.",
        "Index hot `WHERE`, `JOIN`, and `ORDER BY` columns plus foreign keys. In EF Core, `HasIndex(o => new { o.CustomerId, o.OrderDate })` generates them in migrations."
      ],
      code: `
-- On a large table this reads every row (a scan)
SELECT id, order_date FROM orders WHERE customer_id = 2;

-- Seek instead of scan
CREATE INDEX ix_orders_customer ON orders (customer_id);

-- Composite: equality column first, then the range/sort column
CREATE INDEX ix_orders_customer_date ON orders (customer_id, order_date);

-- Can seek: the leftmost column is constrained
SELECT id FROM orders WHERE customer_id = 2 AND order_date >= '2026-02-01';

-- Can't seek on that index: customer_id isn't constrained
SELECT id FROM orders WHERE order_date >= '2026-02-01';

-- Covering: status rides along in the index, so the table is never touched
CREATE INDEX ix_orders_cover ON orders (customer_id, order_date) INCLUDE (status);
SELECT order_date, status FROM orders WHERE customer_id = 2;
`,
      practice: "Try several targets in the index visualizer and estimate scan vs seek reads at 1,000,000 rows. Then turn on Include Actual Execution Plan (Ctrl+M) in SSMS to compare before and after indexing. Notice `EXPLAIN QUERY PLAN` shows `SCAN` vs `SEARCH` in SQLite too.",
      teach: "Explain why an index makes lookups fast but slows inserts down without using the term 'B-tree'.",
      analogy: "An index works like the index at the back of a textbook: sorted terms pointing to page numbers. Finding a topic takes seconds instead of reading the whole book, though adding new pages means updating the index too.",
      pitfalls: [
        "Indexing every column 'just in case' and dragging down write throughput.",
        "Expecting `(last_name, first_name)` to help filters on `first_name` alone.",
        "Skipping indexes on foreign keys, making parent deletes and joins scan the child table.",
        "Indexing low-cardinality flags like `is_active` and wondering why the optimizer still scans."
      ],
      quiz: [
        { q: "An index exists on `(country, city)`. Which filter can seek on it?", a: ["`WHERE city = 'Bandung'`", "`WHERE country = 'ID'`", "`WHERE city = 'Bandung' OR country = 'ID'`", "Both of the first two"], c: 1, why: "Composite indexes start matching from the leftmost column, so `city` alone isn't a prefix." },
        { q: "What is the main cost of adding an index?", a: ["Reads get slower", "Every insert, update and delete must also maintain it, and it takes storage", "The table can no longer be altered", "It locks the table for as long as it exists"], c: 1, why: "Every write has to keep those extra sorted structures in sync, plus they take storage." },
        { q: "A 'covering' index means…", a: ["It covers every column in the table", "It includes all the columns a query needs, so the table is not read", "It is the clustered index", "It speeds up every query on that table"], c: 1, why: "SQL Server answers the entire query straight from the index with zero key lookups." }
      ]
    },
    {
      id: 'transactions', title: 'Transactions, ACID and isolation', level: 2, mins: 40,
      splits: [['1 · All-or-nothing transfer', '-- All or nothing'], ['2 · Lost update vs atomic', '-- Lost update'], ['3 · Optimistic concurrency', '-- Optimistic concurrency']],
      terms: [
        ['ACID', 'Atomicity (all or nothing), Consistency (valid constraints), Isolation (concurrent safety), and Durability (survives crashes after `COMMIT`).'],
        ['Isolation level', 'Balances lock waiting against concurrency bugs across `Read Committed`, `Repeatable Read`, `Serializable`, and snapshot RCSI.'],
        ['Atomic conditional `UPDATE`', '`UPDATE Products SET Stock = Stock - @qty WHERE Id = @id AND Stock >= @qty` checks and lowers stock in one atomic step.']
      ],
      predict: {
        prompt: 'The Chair (`id = 7`) has `stock = 1`. Two buyers run `UPDATE products SET stock = stock - 1 WHERE id = 7 AND stock > 0;` at the same moment. What happens?',
        options: ['Both succeed and `stock` ends up at `-1`', 'One gets `@@ROWCOUNT = 1`; the other waits for the lock, re-checks `stock > 0`, and gets `0`', 'Both read `1` and both write `0`: a lost update'],
        answer: 1,
        explain: 'A single `UPDATE` reads and writes the row atomically while holding an exclusive lock. The second statement blocks on that lock until the first commits, then evaluates `stock > 0` against the new value `0`, matches nothing, and reports `@@ROWCOUNT = 0`. The lost update only happens when the app reads with a `SELECT`, subtracts in code, and writes the result back.'
      },
      why: "Bank transfers, stock updates, and checkout writes need to happen all at once or not at all, even under heavy traffic. Any code modifying database rows needs transactions.",
      points: [
        "A **transaction** wraps statements into one unit with `BEGIN TRANSACTION` … `COMMIT`, or `ROLLBACK` to undo everything.",
        "**ACID** stands for Atomic (all or nothing), Consistent (constraints pass), Isolated (concurrent work stays safe), and Durable (committed writes survive crashes).",
        "Watch four anomalies: **dirty reads** (uncommitted data), **non-repeatable reads** (changed rows mid-transaction), **phantoms** (new matching rows), and **lost updates**.",
        "**Isolation levels** trade throughput for protection: Read Uncommitted → Read Committed → Repeatable Read → Serializable, plus Snapshot. SQL Server defaults to Read Committed, while MySQL uses Repeatable Read.",
        "Add `SET XACT_ABORT ON` so SQL Server rolls back the entire transaction on errors instead of continuing halfway.",
        "Keep transactions **brief**, with zero HTTP calls or user pauses held open inside them.",
        "Prevent read-then-write races with one atomic `UPDATE … WHERE stock > 0`, or use **optimistic concurrency** via a `rowversion` column (`[Timestamp]` in EF Core)."
      ],
      code: `
-- All or nothing: move 100 from account 1 to account 2
SET XACT_ABORT ON;            -- any error rolls the whole transaction back
BEGIN TRANSACTION;

UPDATE accounts SET balance = balance - 100 WHERE id = 1 AND balance >= 100;
IF @@ROWCOUNT = 0
BEGIN
    ROLLBACK;
    THROW 50001, 'Insufficient funds', 1;    -- stop here: nothing was changed
END;

UPDATE accounts SET balance = balance + 100 WHERE id = 2;
COMMIT;

-- Lost update: two sessions both read stock = 1, both write 0
--   SELECT stock FROM products WHERE id = 7;      -- the app subtracts in code
--   UPDATE products SET stock = 0 WHERE id = 7;

-- Safe: one atomic statement; SQL Server makes the second writer wait for the first
UPDATE products SET stock = stock - 1 WHERE id = 7 AND stock > 0;
SELECT @@ROWCOUNT AS sold;    -- 1; a second buyer would get 0: sold out

-- Optimistic concurrency: refuse to overwrite a change you haven't seen
ALTER TABLE products ADD version ROWVERSION;
GO   -- end the batch so the new column can be used below

DECLARE @seen BINARY(8) = (SELECT version FROM products WHERE id = 3);
-- ...the user edits the form; someone else might save in the meantime...
UPDATE products SET price = 85 WHERE id = 3 AND version = @seen;
SELECT @@ROWCOUNT AS saved;   -- 1 here; 0 would mean someone changed the row after we read it
`,
      practice: "Open two tabs in SSMS or two `sqlcmd` terminals on one database (the single-connection playground can't demonstrate blocking). Run `BEGIN TRANSACTION` and deduct from account 1 without committing in tab A, then query account 1 in tab B to watch it wait. Next, commit tab A and repeat with `READ_COMMITTED_SNAPSHOT` turned on.",
      teach: "Explain what 'atomic' means in ACID using a bank transfer, and what users notice if it breaks.",
      analogy: "A transaction behaves like a vending machine. Either it takes your money and drops the snack, or it hands your cash back and keeps the snack. Nothing gets left stuck halfway.",
      pitfalls: [
        "Loading a balance into app memory, modifying it, and writing it back creates a lost update. Wrapping it in Read Committed won't prevent it.",
        "Holding a database transaction open while waiting on slow external HTTP APIs.",
        "Assuming default isolation blocks every race. Read Committed still permits non-repeatable reads, phantoms, and lost updates.",
        "Leaving `XACT_ABORT` off, allowing SQL Server to ignore certain errors and commit a partial transaction."
      ],
      quiz: [
        { q: "A transfer debits account A, then the server crashes before crediting B. With a transaction, what is the result after restart?", a: ["A is debited, B not credited", "Neither change is applied", "B is credited when the server restarts", "The database must be restored from a backup"], c: 1, why: "Atomicity: an uncommitted transaction is rolled back in full during recovery." },
        { q: "Which anomaly is 'reading data another transaction has not committed yet'?", a: ["Phantom", "Dirty read", "Lost update", "Non-repeatable read"], c: 1, why: "Dirty reads are only possible at Read Uncommitted, or with `NOLOCK` hints." },
        { q: "Safest way to decrement stock under concurrency?", a: ["`SELECT`, then `UPDATE` with the computed value, inside a transaction", "`UPDATE … SET stock = stock - 1 WHERE stock > 0`, then check rows affected", "Keep the stock count in application memory", "Read it with `NOLOCK` first so you don't block anyone"], c: 1, why: "Under Read Committed, two transactions can still read the same stock before either writes. A single atomic statement can't interleave with another writer." }
      ]
    },
    {
      id: 'window', title: 'Window functions', level: 2, mins: 35, viz: 'sqlwindow',
      terms: [
        ['`OVER (PARTITION BY ...)`', 'Splits rows into calculation windows without collapsing them, so every original row stays in the output.'],
        ['`ROW_NUMBER()` vs `DENSE_RANK()`', '`ROW_NUMBER` gives unique sequential numbers (1, 2, 3), while `DENSE_RANK` keeps ties equal without skipping numbers (1, 1, 2).'],
        ['Frame / Running total (`ORDER BY`)', 'Putting `ORDER BY` inside `OVER (...)` turns a group sum into a row-by-row running total.']
      ],
      predict: {
        prompt: 'Suppose the two most expensive Tech products had the same price. With `RANK() OVER (PARTITION BY category ORDER BY price DESC)`, which `price_rank` values would the first three Tech rows get?',
        options: ['`1, 2, 3`', '`1, 1, 3`', '`1, 1, 2`'],
        answer: 1,
        explain: '`RANK()` gives tied rows the same rank and then skips, so the next row is `3`. `DENSE_RANK()` would give `1, 1, 2`, and `ROW_NUMBER()` gives `1, 2, 3` with an arbitrary order between the tied rows. That last point matters for top-1-per-group queries: add a tiebreaker column to the `ORDER BY` so `rn = 1` is deterministic.'
      },
      why: "Leaderboards, running balances, month-over-month deltas, and top-N per group show up in almost every report. Window functions turn ugly self-joins into one clear expression.",
      points: [
        "Window functions calculate across related rows **without collapsing them**. Unlike `GROUP BY`, every row remains visible.",
        "`OVER (PARTITION BY x ORDER BY y)` picks how rows are grouped into partitions and ordered within each partition.",
        "Rank with `ROW_NUMBER()` for unique integers (1, 2, 3), `RANK()` for gapped ties, or `DENSE_RANK()` for gapless ties.",
        "`SUM(amount) OVER (ORDER BY date)` gives a running total. Dropping `ORDER BY` repeats the full partition total on every row.",
        "With `ORDER BY`, tied dates share one running total by default. Add a tie-breaker (`ORDER BY order_date, id`) or specify `ROWS UNBOUNDED PRECEDING` (which also runs faster).",
        "Use `LAG` and `LEAD` to pull values from the previous or next row for period comparisons.",
        "To grab top-N per group, rank rows inside a CTE with `ROW_NUMBER()`, then filter `WHERE rn <= N` outside it."
      ],
      code: `
-- Rank products by price within each category
SELECT name, category, price,
       RANK() OVER (PARTITION BY category ORDER BY price DESC) AS price_rank
FROM products;

-- Running total of order value by date
WITH totals AS (
    SELECT o.id, o.order_date, SUM(i.quantity * i.unit_price) AS total
    FROM orders AS o JOIN order_items AS i ON i.order_id = o.id
    GROUP BY o.id, o.order_date
)
SELECT order_date, total,
       SUM(total) OVER (ORDER BY order_date, id ROWS UNBOUNDED PRECEDING) AS running_total,
       total - LAG(total) OVER (ORDER BY order_date, id) AS change_vs_previous
FROM totals;

-- Most recent order per customer (top 1 per group)
WITH ranked AS (
    SELECT o.*, ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY order_date DESC) AS rn
    FROM orders AS o
)
SELECT id, customer_id, order_date FROM ranked WHERE rn = 1;
`,
      practice: "In the playground, show the two most expensive products in each category. Then add a column showing each product's price as a percentage of its category total.",
      teach: "Explain how `SUM(x) OVER (PARTITION BY c)` differs from `SUM(x) … GROUP BY c`.",
      analogy: "`GROUP BY` puts each class on a bus and reports one summary per bus. A window function keeps every student at their desk with a personal note showing their class rank and class average height.",
      pitfalls: [
        "Trying to filter on a window function in `WHERE`. Windows are computed after `WHERE`, so wrap the query in a CTE.",
        "Using `RANK()` when exactly one row per group is needed: ties return several. Use `ROW_NUMBER()`.",
        "Forgetting `ORDER BY` in a running total and getting the grand total on every row.",
        "A running total that jumps in steps because several rows share the same date. Break ties in the `ORDER BY`."
      ],
      quiz: [
        { q: "Scores 90, 90, 80. What does `RANK()` (descending) assign?", a: ["1, 2, 3", "1, 1, 2", "1, 1, 3", "1, 2, 2"], c: 2, why: "`RANK` gives ties the same rank and skips numbers, whereas `DENSE_RANK` gives 1, 1, 2." },
        { q: "How many rows does a window function return compared to its input?", a: ["One per partition", "The same number", "One per distinct `ORDER BY` value", "Fewer, if there are ties"], c: 1, why: "Window functions add computed columns without collapsing rows." },
        { q: "Which function reads the previous row's value?", a: ["`LEAD`", "`LAG`", "`FIRST_VALUE`", "`ROW_NUMBER`"], c: 1, why: "`LAG` looks backward, and `LEAD` looks forward." }
      ]
    },
    // ---------------- Expert ----------------
    {
      id: 'plans', title: 'Execution plans and query tuning', level: 3, mins: 45,
      splits: [['1 · Sargable filters', '-- Not sargable: the function'], ['2 · Measure with STATISTICS', '-- See what the engine does'], ['3 · Keyset pagination', '-- Keyset pagination']],
      terms: [
        ['Seek vs Scan & Key Lookup', 'Plan operators revealing if SQL used an index seek, scanned the table, or fell back to random key lookups per row.'],
        ['Logical reads (`STATISTICS IO`)', 'Exact count of 8 KB pages read, giving a far steadier benchmark than noisy wall-clock milliseconds when tuning queries.'],
        ['Keyset pagination (`WHERE id > @last`)', 'Jumps straight to the next page in O(log n) reads rather than skipping millions of rows with large `OFFSET`.']
      ],
      why: "Query tuning isn't guesswork. Execution plans expose what the engine really did and why, letting you make one targeted fix and verify the drop in reads.",
      points: [
        "SQL Server's **optimizer** chooses plans from **statistics** describing value distribution. Stale statistics mislead row estimates and pick slow plans.",
        "Inspect plans by comparing **estimated vs actual rows** and spotting heavy operators like table scans, key lookups, sorts, and spills.",
        "Match the join algorithm: **nested loops** for small indexed inputs, **hash join** for large unsorted tables, and **merge join** for pre-sorted inputs.",
        "**Sargable** filters let indexes seek. Wrapping columns (`YEAR(order_date) = 2026`) or leading wildcards (`LIKE '%x'`) force scans.",
        "Implicit type conversions block seeks without warning. In .NET, passing a default `NVARCHAR` string parameter against a `VARCHAR` column triggers this unless mapped with `IsUnicode(false)`.",
        "**Parameter sniffing** happens when a cached plan tuned for one parameter performs poorly on another. Check Query Store first, fix indexes, then consider `OPTION (RECOMPILE)` or Query Store hints.",
        "In the playground, `EXPLAIN QUERY PLAN` prints SQLite's plan. Calling `strftime('%Y', order_date)` defeats indexes just like `YEAR()` does."
      ],
      code: `
-- Not sargable: the function hides the column from the index
SELECT id FROM orders WHERE YEAR(order_date) = 2026;

-- Sargable rewrite: a range on the bare column
SELECT id FROM orders
WHERE order_date >= '2026-01-01' AND order_date < '2027-01-01';

-- Not sargable: leading wildcard
SELECT id FROM customers WHERE name LIKE '%a';
-- Sargable: prefix search
SELECT id FROM customers WHERE name LIKE 'A%';

-- See what the engine does: reads and CPU time per statement, in the Messages tab
SET STATISTICS IO, TIME ON;
SELECT id FROM orders WHERE customer_id = 2;
SET STATISTICS IO, TIME OFF;
-- In SSMS, Query > Include Actual Execution Plan (Ctrl+M) shows the plan itself

-- Keyset pagination: page 1,000 is as fast as page 1 (OFFSET reads and throws away every earlier row)
DECLARE @lastDate DATE = '2026-03-01', @lastId INT = 5;   -- the last row of the previous page
SELECT TOP (20) id, order_date
FROM orders
WHERE order_date < @lastDate
   OR (order_date = @lastDate AND id < @lastId)
ORDER BY order_date DESC, id DESC;
`,
      practice: "Take the slowest query in one of your projects. Capture its actual plan and `STATISTICS IO` output, write down your hypothesis, change exactly one thing (an index or a rewrite), and measure again. Present it as before / change / after.",
      teach: "Explain what 'sargable' means and why `WHERE YEAR(order_date) = 2026` cannot use an index on `order_date`.",
      analogy: "A phone book sorts by surname. Looking up 'Smith' takes one flip (a seek). Finding names ending in '-son' means scanning every page since the prefix doesn't match.",
      pitfalls: [
        "Adding indexes by intuition instead of reading the plan.",
        "Trusting the estimated plan when actual row counts are wildly different.",
        "Deep `OFFSET` pagination that reads and discards thousands of rows per page.",
        "Fixing parameter sniffing with `OPTION (RECOMPILE)` on a query that runs thousands of times a second. Compiling every time costs CPU."
      ],
      quiz: [
        { q: "Which condition can use an index seek on `order_date`?", a: ["`WHERE YEAR(order_date) = 2026`", "`WHERE order_date >= '2026-01-01' AND order_date < '2027-01-01'`", "`WHERE CONVERT(CHAR(4), order_date, 120) = '2026'`", "`WHERE DATEADD(day, 1, order_date) > '2026-01-01'`"], c: 1, why: "Only a range filter on the bare column is sargable. The others run a function on it first." },
        { q: "Estimated rows: 10. Actual rows: 900,000. Most likely cause?", a: ["Too many indexes on the table", "Stale or misleading statistics, or parameter sniffing", "The server is short of memory", "The query uses a CTE"], c: 1, why: "The optimizer planned for 10 rows instead of 900,000. Fix the estimate and the plan changes." },
        { q: "Which join algorithm suits a small outer input with an index on the inner table?", a: ["Hash join", "Nested loops", "Merge join", "Whichever table is written first"], c: 1, why: "Nested loops performs one cheap index seek per outer row." }
      ]
    },
    {
      id: 'locking', title: 'Locking, deadlocks and MVCC', level: 3, mins: 40, viz: 'sqllock',
      splits: [['1 · Deadlock & lock order', '-- Classic deadlock'], ['2 · Row versions & upsert', '-- Let readers use row versions'], ['3 · MERGE variant', '-- The same with MERGE']],
      terms: [
        ['Shared (S) vs Exclusive (X) lock', 'Readers share S locks together, while writers take X locks that block other readers and writers under classic `Read Committed`.'],
        ['Deadlock (`Error 1205`)', 'Cycle where Tx A waits on Tx B while Tx B waits on Tx A. Acquiring resources in one fixed order prevents it.'],
        ['MVCC / RCSI', 'Keeps older committed row versions in `tempdb` so readers and writers stop blocking each other.']
      ],
      why: "Random timeouts under traffic usually point to blocking, where transactions queue behind each other. Knowing how locks stack lets you trace blockers and change access order so queries move freely.",
      points: [
        "Under SQL Server's classic Read Committed, queries take shared (S) read locks and exclusive (X) write locks. Writers block readers, and readers briefly block writers.",
        "**MVCC** keeps old row versions so readers see committed snapshots and **never block writers** (writers still wait on writers). PostgreSQL does this always, and SQL Server does with `READ_COMMITTED_SNAPSHOT` (default in Azure SQL).",
        "A **deadlock** is a lock cycle: T1 holds A waiting for B, while T2 holds B waiting for A. SQL Server cancels one victim with error 1205.",
        "Prevent deadlocks by updating tables and rows in a **consistent order**, keeping transactions brief, indexing `WHERE` filters, and retrying with EF Core's `EnableRetryOnFailure()`.",
        "Watch for hidden blocking: an `UPDATE` scanning an unindexed filter locks every row it reads. Past ~5,000 locks, SQL Server escalates to a whole-table lock.",
        "Inspect live blockers via `blocking_session_id` in `sys.dm_exec_requests`, locks in `sys.dm_tran_locks`, and deadlock graphs in `system_health`.",
        "Naive upserts race when two sessions insert simultaneously. Guard them with `UPDATE … WITH (UPDLOCK, HOLDLOCK)` followed by `IF @@ROWCOUNT = 0 INSERT …` and a backing `UNIQUE` key."
      ],
      code: `
-- Classic deadlock: two transfers between the same two accounts, in opposite order
-- 1. Session A: UPDATE accounts SET balance = balance - 10 WHERE id = 1;  -- A locks row 1
-- 2. Session B: UPDATE accounts SET balance = balance - 5  WHERE id = 2;  -- B locks row 2
-- 3. Session A: UPDATE accounts SET balance = balance + 10 WHERE id = 2;  -- A waits for B
-- 4. Session B: UPDATE accounts SET balance = balance + 5  WHERE id = 1;  -- B waits for A
--    Deadlock: SQL Server rolls one back with error 1205.

-- Fix: whichever way the money moves, lock the lower id first.
-- Session B's transfer (2 -> 1) now also starts with row 1, so it waits instead of deadlocking.
DECLARE @from INT = 2, @to INT = 1, @amount DECIMAL(10,2) = 5;
DECLARE @first INT = IIF(@from < @to, @from, @to),
        @second INT = IIF(@from < @to, @to, @from);

SET XACT_ABORT ON;     -- the CHECK (balance >= 0) constraint stops an overdraft and rolls back both
BEGIN TRANSACTION;
UPDATE accounts SET balance = balance + IIF(id = @from, -@amount, @amount) WHERE id = @first;
UPDATE accounts SET balance = balance + IIF(id = @from, -@amount, @amount) WHERE id = @second;
COMMIT;

SELECT id, balance FROM accounts;   -- Ana 505.00, Budi 195.00

-- Let readers use row versions instead of shared locks (needs no other connections open)
-- ALTER DATABASE CURRENT SET READ_COMMITTED_SNAPSHOT ON;

-- Upsert "add to cart". Without the hints, two clicks at once can both insert.
CREATE TABLE cart_items (
    customer_id INT NOT NULL, product_id INT NOT NULL, quantity INT NOT NULL CHECK (quantity > 0),
    PRIMARY KEY (customer_id, product_id)
);
GO
DECLARE @customer INT = 1, @product INT = 2, @qty INT = 1;
SET XACT_ABORT ON;
BEGIN TRANSACTION;
UPDATE cart_items WITH (UPDLOCK, HOLDLOCK)          -- holds the key range, even when no row exists yet
SET quantity = quantity + @qty
WHERE customer_id = @customer AND product_id = @product;
IF @@ROWCOUNT = 0
    INSERT INTO cart_items (customer_id, product_id, quantity) VALUES (@customer, @product, @qty);
COMMIT;

-- The same with MERGE, which needs HOLDLOCK for the same reason
MERGE cart_items WITH (HOLDLOCK) AS t
USING (VALUES (@customer, @product, @qty)) AS s (customer_id, product_id, quantity)
   ON t.customer_id = s.customer_id AND t.product_id = s.product_id
WHEN MATCHED THEN UPDATE SET quantity = t.quantity + s.quantity
WHEN NOT MATCHED THEN INSERT (customer_id, product_id, quantity) VALUES (s.customer_id, s.product_id, s.quantity);

SELECT quantity FROM cart_items WHERE customer_id = 1 AND product_id = 2;   -- 2
`,
      practice: "Open two SSMS windows or `sqlcmd` shells on a test `accounts` table and trigger error 1205 by hand. Pull the deadlock graph from `system_health`, apply the ordered-ID fix, and wire up EF Core `EnableRetryOnFailure()`. Explain why teams ship both.",
      teach: "Explain how two simultaneous transfers between the same accounts cause a deadlock and how to avoid it.",
      analogy: "Two coworkers meet in a narrow hall, each holding half of a split key and reaching for the other's half. The database taps one on the shoulder to drop theirs and try again. Always picking up the left half first prevents the standoff.",
      pitfalls: [
        "Blaming the database engine for deadlocks instead of fixing inconsistent lock ordering.",
        "Sprinkling `NOLOCK` hints to dodge blocking while tolerating torn and dirty reads.",
        "Letting deadlock errors crash requests instead of treating them as normal transient retries.",
        "Retrying just the failed SQL line when SQL Server rolled back the entire transaction.",
        "Upserting with `IF NOT EXISTS … INSERT` and zero lock hints, causing duplicate-key errors under concurrent hits."
      ],
      quiz: [
        { q: "What is the standard way to prevent deadlocks between transactions that update the same rows?", a: ["Add `WITH (NOLOCK)` to the updates", "Access the rows in a consistent order", "Raise the isolation level to Serializable", "Increase the lock timeout"], c: 1, why: "Shared lock order breaks cycles before they form, while Serializable grabs extra locks and invites deadlocks." },
        { q: "With `READ_COMMITTED_SNAPSHOT` on, a long-running read…", a: ["blocks all writers until it finishes", "sees a consistent version and does not block writers", "sees other transactions' uncommitted changes", "takes a table lock"], c: 1, why: "Readers read committed row snapshots instead of taking shared locks." },
        { q: "What should application code do when it is chosen as a deadlock victim?", a: ["Show the error to the user", "Retry the whole transaction", "Retry only the statement that failed", "Nothing: the change was saved"], c: 1, why: "The entire transaction rolled back, so retrying just the final statement applies partial writes." },
        { q: "Two requests run `UPDATE …` then `IF @@ROWCOUNT = 0 INSERT …` concurrently without lock hints. What happens?", a: ["Nothing, since both statements run atomically", "Both find no row and both insert, so one fails on the primary key", "The database merges the two inserts into one row", "The second request waits automatically until the first commits"], c: 1, why: "Each query is atomic alone, yet the pair can interleave. `UPDLOCK, HOLDLOCK` locks the slot until commit." }
      ]
    },
    {
      id: 'scale', title: 'Scaling and evolving a database', level: 3, mins: 45,
      terms: [
        ['Expand-and-contract migration', 'Safe multi-step schema change: add nullable column → dual-write → backfill batches → enforce `NOT NULL` → drop old column.'],
        ['Read replica & lag', 'Takes read and analytics load asynchronously. Replicas lag slightly behind primary, so immediate post-write reads belong on primary.'],
        ['Connection pooling', 'Reuses open TCP and auth connections across HTTP requests instead of paying handshake cost every time.']
      ],
      why: "Tables grow and requirements evolve while apps must stay online. Good database scaling means evolving schemas without downtime and picking the cheapest tool that fixes each bottleneck.",
      points: [
        "Scale step by step: tune indexes and queries → cache → scale up → **read replicas** → **partitioning** → **sharding**. Each step adds ops overhead.",
        "Read replicas offload primary reads, yet async replication lag means users shouldn't read their own fresh writes from a replica.",
        "**Partitioning** splits one table by date or key so old slices drop easily, while **sharding** spreads data across servers and breaks single-engine joins.",
        "For **zero-downtime migrations** (**expand → migrate → contract**), add the nullable column, dual-write, backfill in batches, switch reads, then drop the old column.",
        "Deploy code that handles both old and new schemas while rolling updates run side by side.",
        "Rather than letting EF Core ship a single breaking `RenameColumn`, split column renames across expand and contract migrations paired with releases.",
        "Know when relational tables aren't enough: JSON tools (`JSON_VALUE`), full-text search, indexed views, Redis caches, search engines, or queues."
      ],
      code: `
-- Goal: rename customers.name to full_name with no downtime

-- 1. EXPAND: add the new column. Nullable, so it's instant even on a huge table
ALTER TABLE customers ADD full_name NVARCHAR(100) NULL;
GO   -- new batch, so the statements below can see the column

-- 2. App v2 writes BOTH columns, and still reads the old one

-- 3. MIGRATE: backfill in small batches to keep locks short
WHILE 1 = 1
BEGIN
    UPDATE TOP (1000) customers SET full_name = name WHERE full_name IS NULL;
    IF @@ROWCOUNT = 0 BREAK;
END;

-- 4. App v3 reads full_name; v4 stops writing name

-- 5. CONTRACT: only now remove the old column
ALTER TABLE customers DROP COLUMN name;

-- Partitioning by month: a function that splits, a scheme that places, a table that uses it
CREATE PARTITION FUNCTION pf_month (DATE) AS RANGE RIGHT FOR VALUES ('2026-10-01', '2026-11-01', '2026-12-01');
CREATE PARTITION SCHEME ps_month AS PARTITION pf_month ALL TO ([PRIMARY]);
CREATE TABLE events (id BIGINT NOT NULL, at DATE NOT NULL, payload NVARCHAR(MAX)) ON ps_month (at);
`,
      practice: "Draft the SQL and deploy steps to split `name` into `first_name` and `last_name` across 50 million rows with zero downtime. Flag which step hurts most to roll back.",
      teach: "Explain expand–migrate–contract and why a single-step column rename breaks live traffic.",
      analogy: "Think of swapping a bridge while cars keep rolling. Build the new span beside the old one (expand), move lanes over (migrate), then tear down the old span (contract).",
      pitfalls: [
        "Jumping straight to sharding before exhausting query tuning, indexes, caching, and read replicas.",
        "Backfilling millions of rows in one giant `UPDATE`, locking tables and blowing out the transaction log.",
        "Assuming replica reads immediately reflect a write that just committed on primary.",
        "Running one EF Core `RenameColumn` migration on a live cluster while older app nodes still query the old name."
      ],
      quiz: [
        { q: "First step of a zero-downtime column rename?", a: ["Drop the old column", "Add the new column alongside the old one", "Rename it in place with `sp_rename`", "Copy the table under a new name"], c: 1, why: "Expand first so running old and new app instances stay compatible." },
        { q: "A user saves a profile, the next page reads from a replica and shows the old value. Why?", a: ["A bug in the SQL query", "Replication lag: the replica hasn't applied the write yet", "The browser cached the old page", "A deadlock rolled the save back"], c: 1, why: "Async replicas trail slightly behind, so read-your-own-write requests belong on the primary." },
        { q: "What makes sharding costly compared to partitioning within one server?", a: ["Indexes stop working across shards", "Cross-shard joins and transactions are hard or impossible", "Each shard needs a different schema", "Backups can no longer be taken"], c: 1, why: "Splitting tables across servers breaks single-engine joins and atomic multi-row commits." }
      ]
    }
  ]
};

export default track;
