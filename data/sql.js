TRACKS.push({
  id: 'sql', name: 'SQL', lang: 'sql',
  tagline: 'The data, in SQL Server: querying, modelling, indexing, transactions and tuning.',
  lessons: [
    // ---------------- Beginner ----------------
    {
      id: 'select', title: 'Tables, rows and SELECT', level: 0, mins: 25,
      why: "Most applications are a user interface on top of a database, and `SELECT` is how you get data back out. It reads almost like English, which makes it a good first way of talking to data. The examples in this track use SQL Server, the usual partner of ASP.NET Core.",
      points: [
        "A relational database stores data in **tables**. Each **row** is one thing (a customer); each **column** is one attribute (their city).",
        "A **primary key** uniquely identifies each row, usually an `id`.",
        "`SELECT columns FROM table` chooses columns; `WHERE` chooses rows; `ORDER BY` sorts; `TOP (n)` keeps the first n. `OFFSET … FETCH` pages through results.",
        "SQL is **declarative**: you describe the result you want, not the steps to get it. The database decides how.",
        "Text goes in single quotes: `'Jakarta'`. `LIKE 'A%'` matches patterns; `IN (...)` and `BETWEEN` shorten conditions.",
        "You'll often see `N'Jakarta'` in SQL Server code. The `N` marks Unicode text for `NVARCHAR` columns; without it, characters outside the database's code page can turn into `?`.",
        "Whether `LIKE` and `=` care about upper and lower case depends on the column's **collation**. Most SQL Server databases are case-insensitive by default.",
        "The playground runs SQLite, which writes `LIMIT 3` at the end of the query where SQL Server writes `TOP (3)` after `SELECT`."
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
      practice: "Open the SQL playground and complete the first three challenges, using `LIMIT` where these examples use `TOP`. Then write a query of your own: the five most expensive products that are not in the 'Tech' category. In the playground, `price * 1.11` shows `1332.0000000000002`, because SQLite has no exact decimal type; wrap it in `ROUND(…, 2)` there.",
      teach: "Explain what a table, a row, a column and a primary key are to someone who has only ever used spreadsheets.",
      analogy: "`SELECT … WHERE … ORDER BY` is asking a librarian: 'bring me the title and author of every book published after 2020, newest first.' You say what you want, not which shelves to walk past.",
      pitfalls: [
        "Double quotes for text. In SQL Server (with the standard `QUOTED_IDENTIFIER ON` that SSMS and .NET use) and in PostgreSQL, `\"Tech\"` means a column named Tech, and the query fails. SQLite quietly accepts it, so the playground won't warn you.",
        "Assuming rows come back in insertion order. Without `ORDER BY` the order is not guaranteed.",
        "`TOP (3)` without `ORDER BY`. You get some three rows, not the top three.",
        "Reading SQL as if it runs top to bottom like a program. The GROUP BY lesson shows the real order."
      ],
      quiz: [
        { q: "Which clause chooses which **rows** are returned?", a: ["`SELECT`", "`WHERE`", "`ORDER BY`", "`TOP`"], c: 1, why: "`WHERE` filters rows; `SELECT` chooses columns; `TOP` only cuts the list after sorting." },
        { q: "Without `ORDER BY`, the order of rows is…", a: ["by primary key", "by insertion time", "not guaranteed", "by the clustered index, always"], c: 2, why: "On a small table it often looks like primary-key order, which is why people rely on it. A parallel plan or a new index can change it at any time." },
        { q: "What does `WHERE name LIKE 'A%'` match?", a: ["Names containing the % character", "Names that start with A", "Names that end with A", "Exactly the name 'A%'"], c: 1, why: "`%` is a wildcard for any sequence of characters, including none." },
        { q: "`SELECT TOP (3) name FROM products;` with no `ORDER BY` returns…", a: ["The 3 most expensive products", "The 3 cheapest products", "Any 3 rows", "The 3 most recently added products"], c: 2, why: "`TOP` keeps the first rows of whatever order the result has, and without `ORDER BY` there is no promised order." }
      ]
    },
    {
      id: 'dml', title: 'Changing data, types and NULL', level: 0, mins: 25,
      why: "Reading data can't hurt anyone; writing it can. This lesson is about the habits that stop a bad `UPDATE` from reaching every row, and about `NULL`, which follows different rules from every other value.",
      points: [
        "`INSERT INTO t (cols) VALUES (…)` adds rows; `UPDATE t SET … WHERE …` changes rows; `DELETE FROM t WHERE …` removes rows.",
        "An `UPDATE` or `DELETE` without `WHERE` affects **every row**. Write the `WHERE` first, and run it as a `SELECT` to see what it matches.",
        "For anything risky, wrap the change in a transaction: `BEGIN TRANSACTION`, make the change, check the row count, then `COMMIT` or `ROLLBACK`.",
        "Choose precise types: `INT`, `DECIMAL(10,2)` for money, `NVARCHAR(n)` for text, `DATE` or `DATETIME2` for time, `BIT` for true/false.",
        "`NULL` means **unknown or missing**: not zero, and not an empty string.",
        "Any comparison with NULL gives unknown: `NULL = NULL` is not true. Use `IS NULL` and `IS NOT NULL`.",
        "`COALESCE(a, b)` returns the first value that isn't NULL, the standard way to supply a default."
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
      analogy: "NULL is a sealed envelope: you don't know what's inside. Is this sealed envelope equal to that one? You can't say yes or no; the honest answer is 'unknown'. SQL keeps only the rows where the answer is definitely yes.",
      pitfalls: [
        "Running `DELETE FROM orders;` and noticing the missing `WHERE` afterwards. Inside a transaction you could still roll it back.",
        "Treating NULL as zero in arithmetic: `price + NULL` is NULL.",
        "`NOT IN (subquery)` returning nothing because the subquery contains a NULL.",
        "Expecting a `DELETE` on a parent row to remove its children. A foreign key blocks it unless the relationship was created with `ON DELETE CASCADE`."
      ],
      quiz: [
        { q: "What does `UPDATE products SET price = 0;` do?", a: ["Nothing; `UPDATE` requires a `WHERE`", "Sets the price of every product to 0", "Only updates rows where price is NULL", "Updates the first row only"], c: 1, why: "With no `WHERE`, every row matches." },
        { q: "The result of `NULL = NULL` in SQL is…", a: ["true", "false", "unknown", "an error"], c: 2, why: "Comparing two unknowns is unknown; use `IS NULL`." },
        { q: "What does `COALESCE(nickname, name, 'N/A')` return?", a: ["Always 'N/A'", "The first of the three that is not NULL", "All three joined together", "NULL if any of them is NULL"], c: 1, why: "`COALESCE` scans left to right and returns the first argument that isn't NULL." }
      ]
    },
    {
      id: 'aggregate', title: 'GROUP BY, aggregates and query order', level: 0, mins: 35, viz: 'sqlorder',
      why: "Reports and dashboards are mostly aggregation: totals, counts and averages per something. It's also where you first hit 'why can't I use my alias in `WHERE`?', and the answer, the order SQL really runs in, explains a lot of later surprises.",
      points: [
        "Aggregates collapse many rows into one value: `COUNT(*)`, `SUM`, `AVG`, `MIN`, `MAX`.",
        "`GROUP BY` forms groups; each group becomes **one output row**.",
        "Every selected column must be either in `GROUP BY` or inside an aggregate.",
        "`WHERE` filters rows **before** grouping; `HAVING` filters groups **after** aggregation.",
        "Logical order: `FROM` → `WHERE` → `GROUP BY` → `HAVING` → `SELECT` → `ORDER BY` → `TOP`/`OFFSET`. That's why a `SELECT` alias works in `ORDER BY` but not in `WHERE`.",
        "`COUNT(*)` counts rows; `COUNT(col)` counts values that aren't NULL; `COUNT(DISTINCT col)` counts unique values.",
        "The playground's SQLite is more lenient than SQL Server: it accepts an alias in `WHERE` and a bare column next to an aggregate. SQL Server rejects both, and so does PostgreSQL."
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
        "Putting an aggregate condition in `WHERE`: `WHERE COUNT(*) > 2` is an error.",
        "Selecting a column that is neither grouped nor aggregated. SQL Server stops you; SQLite silently picks a value from some row, which is worse.",
        "`AVG` on an `INT` column returns an `INT` in SQL Server: the average of 1 and 2 is 1. Cast first: `AVG(CAST(quantity AS DECIMAL(10,2)))`."
      ],
      quiz: [
        { q: "Which clause can filter on `SUM(amount) > 100`?", a: ["`WHERE`", "`HAVING`", "`ORDER BY`", "`GROUP BY`"], c: 1, why: "Aggregates exist only after grouping; `HAVING` runs after `GROUP BY`." },
        { q: "Logically, which runs first?", a: ["`SELECT`", "`WHERE`", "`FROM`", "`GROUP BY`"], c: 2, why: "The engine must know the source rows before it can filter or group them." },
        { q: "A column has values 5, NULL, 7. What is `COUNT(col)`?", a: ["3", "2", "12", "NULL"], c: 1, why: "`COUNT(col)` ignores NULLs; `COUNT(*)` would be 3." },
        { q: "`quantity` is an `INT` column with values 1 and 2. What does `AVG(quantity)` return in SQL Server?", a: ["1.5", "1", "2", "NULL"], c: 1, why: "The average of integers is an integer in SQL Server, truncated. Cast to `DECIMAL` first to get 1.5." }
      ]
    },
    // ---------------- Intermediate ----------------
    {
      id: 'joins', title: 'JOINs: combining tables', level: 1, mins: 35, viz: 'joins',
      why: "Relational data is split across tables on purpose, and joins put it back together. Picking the wrong join type doesn't raise an error: it silently drops or duplicates rows, and the numbers just come out wrong.",
      points: [
        "A join pairs rows from two tables where a condition holds, usually `foreign key = primary key`.",
        "`INNER JOIN`: only pairs that match on both sides.",
        "`LEFT JOIN`: every row from the left table; unmatched right columns become NULL. Use it for 'all customers, with orders if any'.",
        "`RIGHT` and `FULL OUTER` keep unmatched rows from the right or from both sides. `CROSS JOIN` produces every combination.",
        "A join can **multiply rows**: one customer with three orders appears three times. Aggregate carefully afterwards.",
        "Find rows with **no** match using `LEFT JOIN … WHERE right.id IS NULL` or `NOT EXISTS`."
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
        "Filtering the right table in `WHERE` after a `LEFT JOIN`, which quietly turns it back into an inner join. Put that condition in `ON`.",
        "`COUNT(*)` after a left join counts the NULL row as 1; count a right-side column instead.",
        "Joining two one-to-many tables (orders and payments, say) to the same parent, then summing. Every order is paired with every payment, and the totals double."
      ],
      quiz: [
        { q: "Customers has 4 rows; 1 customer has no orders; Orders has 5 rows, all with valid customers. How many rows does `customers LEFT JOIN orders` return?", a: ["4", "5", "6", "9"], c: 2, why: "Five matched pairs plus one customer with no order, padded with NULLs." },
        { q: "How do you find customers with no orders?", a: ["`INNER JOIN … WHERE o.id IS NULL`", "`LEFT JOIN … WHERE o.id IS NULL`", "`LEFT JOIN … ON o.customer_id = c.id AND o.id IS NULL`", "`RIGHT JOIN … WHERE c.id IS NULL`"], c: 1, why: "Unmatched left rows carry NULLs on the right side, so filter for those after the join. Putting the test in `ON` keeps every customer." },
        { q: "After `LEFT JOIN orders o`, adding `WHERE o.status = 'paid'` does what?", a: ["Nothing changes", "Removes customers with no orders, acting like an inner join", "Keeps every customer but blanks their unpaid orders", "Causes an error"], c: 1, why: "NULL = 'paid' is unknown, so unmatched rows are filtered out. Blanking unpaid orders is what you get by moving the condition into `ON`." }
      ]
    },
    {
      id: 'subqueries', title: 'Subqueries and CTEs', level: 1, mins: 30,
      why: "Real questions come in steps: 'of the customers who spent more than average, which ones…'. Subqueries and CTEs let you build the answer in layers that you can read and check one at a time.",
      points: [
        "A **subquery** is a query inside another: in `WHERE` (filter by a computed value or set), in `FROM` (a derived table), or in `SELECT` (a single value).",
        "A **correlated** subquery refers to the outer row and is logically evaluated per row. `EXISTS` is the classic use.",
        "`EXISTS` asks 'is there at least one?' and stops early; `IN` compares against a list. Prefer `NOT EXISTS` over `NOT IN` because of NULLs.",
        "A **CTE** (`WITH name AS (…)`) names a subquery so the main query reads top to bottom. SQL Server doesn't store it: a CTE used twice is computed twice. Use a temporary table when you need a result reused.",
        "Chain several CTEs to build a query in steps, and run each step on its own while debugging.",
        "A **recursive** CTE refers to itself, to walk hierarchies such as category trees or org charts."
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
      analogy: "A CTE is naming an intermediate result in a recipe: 'first make the sauce; call it *sauce*. Then pour *sauce* over the pasta.' Nested subqueries are the same recipe written as one unpunctuated sentence.",
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
      why: "A bad schema can't be fixed by good code: every query has to work around it, forever. The habit that helps is asking, for each table and column, 'what could go wrong if we store it this way?'",
      points: [
        "One table per **entity**; one row per instance; one fact stored in exactly **one place**.",
        "A **foreign key** makes a relationship real: the database refuses an order that points to a customer who doesn't exist.",
        "Relationships: one-to-many (foreign key on the 'many' side), many-to-many (a junction table such as `order_items`), one-to-one (rare).",
        "**Normalization**: 1NF means atomic values, no lists in a cell. 2NF and 3NF mean every non-key column depends on the key, the whole key, and nothing but the key.",
        "Constraints are free tests that run on every write: `NOT NULL`, `UNIQUE`, `CHECK (price >= 0)`, `DEFAULT`.",
        "Decide what deleting a parent does. By default the foreign key refuses; `ON DELETE CASCADE` deletes the children too.",
        "SQL Server specifics: `IDENTITY` generates ids, `NVARCHAR(n)` is the usual text type (`TEXT` is deprecated), and foreign key columns are **not** indexed for you.",
        "Denormalize deliberately (for example, storing `unit_price` at the time of sale) and know why.",
        "**JSON columns** suit data you store and hand back whole, such as settings with no fixed shape or a payload from another system. A `CHECK (ISJSON(col) = 1)` keeps it valid, `JSON_VALUE` reads one value, and `OPENJSON` turns an array into rows. Anything you filter, join or constrain on belongs in a real column. (SQL Server 2025 also adds a native `json` type.)"
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
      practice: "Design a schema for a library: books, authors (a book may have several), members and loans. List each table's keys and constraints, and decide what deleting a member should do to their loans. Then name one fact you chose to store twice, or explain why none is needed.",
      teach: "Explain why we do not store the customer's name and address on every order row, and what goes wrong if we do.",
      analogy: "Normalization is the rule 'write each phone number in one address book, not on sticky notes around the house'. When a friend changes number you update one place. With sticky notes you fix three, miss the fourth, and now you have two truths.",
      pitfalls: [
        "Comma-separated lists in a column ('tags: red,blue'). They can't be indexed, joined or constrained.",
        "Skipping foreign keys 'for flexibility' and collecting orphan rows.",
        "Normalizing away history: an order must remember the price that was charged.",
        "Storing money in `FLOAT` or `REAL`. Use `DECIMAL`, or the cents will drift.",
        "Hiding a value you search on inside JSON. `WHERE JSON_VALUE(preferences, '$.language') = 'id'` can't use an ordinary index; promote it to a column, or index a computed column over it."
      ],
      quiz: [
        { q: "Orders and products are many-to-many. How is that modelled?", a: ["A comma-separated `product_ids` column in `orders`", "A junction table with a foreign key to each", "An `order_id` column in `products`", "One `orders` row per product, repeating the order details"], c: 1, why: "A junction table has one row per pairing and can carry attributes such as quantity." },
        { q: "What does a foreign key constraint prevent?", a: ["Slow joins", "Rows that reference a parent row that does not exist", "Duplicate values in the column", "NULL values in the column"], c: 1, why: "It enforces referential integrity on every insert, update and delete. Duplicates are what `UNIQUE` prevents, and a foreign key column can still be NULL unless it's `NOT NULL`." },
        { q: "Why is `unit_price` stored on `order_items` even though `products` has `price`?", a: ["It's a mistake; it should come from a join", "The sale must keep the price at the time of purchase", "To make the join to `products` faster", "Foreign keys require a copy"], c: 1, why: "It is a different fact: the historical price charged, not today's list price." },
        { q: "Which data fits a JSON column best?", a: ["A customer's email, which must be unique", "Notification settings whose fields differ from customer to customer", "The `customer_id` an order belongs to", "A product's price, used in reports every day"], c: 1, why: "Data with no fixed shape, read and written as a whole, is what JSON is for. Values you constrain, join or report on need real columns with types and constraints." }
      ]
    },
    // ---------------- Advanced ----------------
    {
      id: 'indexes', title: 'Indexes: how databases find rows fast', level: 2, mins: 40, viz: 'index',
      why: "The same query can take 5 ms or 50 seconds, and the difference is often one index. Indexes are the first thing to check when a page gets slower as the data grows.",
      points: [
        "Without an index the engine reads every row: a **scan**, O(n). With a B-tree index it walks a few levels: a **seek**, O(log n).",
        "An index is a sorted copy of some columns with pointers back to the rows. It speeds up reads, **slows down writes**, and takes storage.",
        "In SQL Server the **clustered index** is the table itself, stored in key order; by default it's the primary key. Other indexes are non-clustered and point back to it. (PostgreSQL has no clustered index; its tables are unordered heaps.)",
        "A **composite index** `(a, b)` helps filters on `a`, or on `a AND b`, but SQL Server can't seek on `b` alone: the leftmost-prefix rule. Put equality columns first, range columns after.",
        "A **covering index** holds every column the query needs (extra ones go in `INCLUDE`), so the engine never visits the table.",
        "An index pays off when it narrows the search a lot. On a column like `status` with three values, SQL Server will often ignore the index and scan anyway.",
        "Index the columns in the `WHERE`, `JOIN` and `ORDER BY` of your frequent queries, especially foreign keys. In EF Core, declare them with `HasIndex(o => new { o.CustomerId, o.OrderDate })` and they arrive in a migration."
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
      practice: "Run the index visualizer for several targets and record reads for scan versus seek. For 1,000,000 rows, roughly how many comparisons does each need? Then, in SQL Server Management Studio, turn on Include Actual Execution Plan (Ctrl+M) and compare a query on a large table before and after creating an index. In the playground, `EXPLAIN QUERY PLAN` shows the same idea in SQLite: `SCAN` versus `SEARCH … USING INDEX`.",
      teach: "Explain why an index makes lookups fast but inserts slower, without using the word 'B-tree'.",
      analogy: "The index at the back of a textbook: sorted keywords with page numbers. Finding 'transaction' takes seconds instead of reading every page. But each time the author adds a page, the index must be updated too, and an index of every word would be thicker than the book.",
      pitfalls: [
        "Indexing every column 'just in case' and making every write slow.",
        "Expecting an index on `(last_name, first_name)` to help a search by `first_name` only.",
        "Forgetting indexes on foreign keys, so joins and deletes on the parent scan the child table.",
        "Indexing a column with only a few distinct values and wondering why the plan still scans."
      ],
      quiz: [
        { q: "An index exists on `(country, city)`. Which filter can seek on it?", a: ["`WHERE city = 'Bandung'`", "`WHERE country = 'ID'`", "`WHERE city = 'Bandung' OR country = 'ID'`", "Both of the first two"], c: 1, why: "A composite index can be used from its leftmost column; `city` alone is not a prefix." },
        { q: "What is the main cost of adding an index?", a: ["Reads get slower", "Every insert, update and delete must also maintain it, and it takes storage", "The table can no longer be altered", "It locks the table for as long as it exists"], c: 1, why: "Indexes are extra structures kept in sync on each write." },
        { q: "A 'covering' index means…", a: ["It covers every column in the table", "It includes all the columns a query needs, so the table is not read", "It is the clustered index", "It speeds up every query on that table"], c: 1, why: "The query is answered from the index alone, with no lookups back to the table." }
      ]
    },
    {
      id: 'transactions', title: 'Transactions, ACID and isolation', level: 2, mins: 40,
      why: "Money transfers, stock decrements and placing an order have to be all-or-nothing, and stay correct when many users act at once. If your code writes to a database, you need this model.",
      points: [
        "A **transaction** groups statements into one unit: `BEGIN TRANSACTION` … `COMMIT`, or `ROLLBACK` to undo everything.",
        "**ACID**: Atomic (all or nothing), Consistent (constraints hold), Isolated (concurrent transactions don't corrupt each other), Durable (committed data survives a crash).",
        "Concurrency anomalies: **dirty read** (seeing uncommitted data), **non-repeatable read** (a row changes between two reads), **phantom** (new rows appear), **lost update** (two writers overwrite each other).",
        "**Isolation levels** trade safety for concurrency: Read Uncommitted → Read Committed → Repeatable Read → Serializable, plus Snapshot (row versions). SQL Server's default is Read Committed; MySQL's is Repeatable Read.",
        "`SET XACT_ABORT ON` makes SQL Server roll back the whole transaction on any error, instead of carrying on with the next statement.",
        "Keep transactions **short**: no waiting for the user and no HTTP calls inside one.",
        "Avoid read-then-write races with one atomic statement (`UPDATE … SET stock = stock - 1 WHERE stock > 0`), or with **optimistic concurrency**: a `rowversion` column that changes on every update, checked in the `WHERE`. EF Core does this with `[Timestamp]`."
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
      practice: "You need two query windows on the same database: two tabs in SQL Server Management Studio, or two terminals running `sqlcmd`. (The playground has a single connection, so it can't show this.) In the first, run `BEGIN TRANSACTION; UPDATE accounts SET balance = balance - 10 WHERE id = 1;` and don't commit. In the second, run `SELECT balance FROM accounts WHERE id = 1;`. Does it wait or answer? Commit in the first window and watch. Then turn on `READ_COMMITTED_SNAPSHOT` in a test database and repeat.",
      teach: "Explain what 'atomic' means in ACID using a bank transfer, and what the user would see without it.",
      analogy: "A transaction is a vending machine purchase: either you get the snack and it keeps your money, or it gives your money back and keeps the snack. There is no state where your money is gone and the snack is stuck.",
      pitfalls: [
        "Reading a value in the application, computing, and writing it back: the classic lost update. Wrapping it in a Read Committed transaction doesn't fix it.",
        "Holding a transaction open while calling an external API.",
        "Assuming the default isolation level prevents all anomalies. Read Committed allows non-repeatable reads, phantoms and lost updates.",
        "Leaving `XACT_ABORT` off. After some errors SQL Server carries on, and the half-done transaction can still be committed."
      ],
      quiz: [
        { q: "A transfer debits account A, then the server crashes before crediting B. With a transaction, what is the result after restart?", a: ["A is debited, B not credited", "Neither change is applied", "B is credited when the server restarts", "The database must be restored from a backup"], c: 1, why: "Atomicity: an uncommitted transaction is rolled back in full during recovery." },
        { q: "Which anomaly is 'reading data another transaction has not committed yet'?", a: ["Phantom", "Dirty read", "Lost update", "Non-repeatable read"], c: 1, why: "Dirty reads are only possible at Read Uncommitted, or with `NOLOCK` hints." },
        { q: "Safest way to decrement stock under concurrency?", a: ["`SELECT`, then `UPDATE` with the computed value, inside a transaction", "`UPDATE … SET stock = stock - 1 WHERE stock > 0`, then check rows affected", "Keep the stock count in application memory", "Read it with `NOLOCK` first so you don't block anyone"], c: 1, why: "Under Read Committed, two transactions can still read the same stock before either writes. A single atomic statement can't interleave with another writer." }
      ]
    },
    {
      id: 'window', title: 'Window functions', level: 2, mins: 35,
      why: "Rankings, running totals, 'compared with last month' and top-N-per-group come up in almost every report. Without window functions they need self-joins and subqueries; with them, they're one expression.",
      points: [
        "A window function computes across related rows **without collapsing them**. Unlike `GROUP BY`, every input row stays.",
        "`OVER (PARTITION BY x ORDER BY y)` defines the window: partitions are the groups, and the order sets the sequence within each.",
        "Ranking: `ROW_NUMBER()` (unique 1, 2, 3), `RANK()` (ties share, gaps follow), `DENSE_RANK()` (ties share, no gaps).",
        "Aggregates as windows: `SUM(amount) OVER (ORDER BY date)` is a running total; without `ORDER BY` it is the partition total, repeated on every row.",
        "With `ORDER BY`, the default frame includes every row **tied** with the current one, so orders on the same date share one running total. Add a tie-breaker (`ORDER BY order_date, id`) or write `ROWS UNBOUNDED PRECEDING`, which is also faster in SQL Server.",
        "`LAG` and `LEAD` read the previous and next row, for period-over-period change.",
        "Top-N per group: number the rows in a CTE with `ROW_NUMBER()`, then filter `WHERE rn <= N` outside it."
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
      analogy: "`GROUP BY` puts each class's students on a bus and reports one number per bus. A window function leaves every student at their desk and hands each one a note: 'you are 3rd tallest in your class; the class average is 160 cm'.",
      pitfalls: [
        "Trying to filter on a window function in `WHERE`. Windows are computed after `WHERE`, so wrap the query in a CTE.",
        "Using `RANK()` when exactly one row per group is needed: ties return several. Use `ROW_NUMBER()`.",
        "Forgetting `ORDER BY` in a running total and getting the grand total on every row.",
        "A running total that jumps in steps because several rows share the same date. Break ties in the `ORDER BY`."
      ],
      quiz: [
        { q: "Scores 90, 90, 80. What does `RANK()` (descending) assign?", a: ["1, 2, 3", "1, 1, 2", "1, 1, 3", "1, 2, 2"], c: 2, why: "`RANK` gives ties the same rank and then skips; `DENSE_RANK` would give 1, 1, 2." },
        { q: "How many rows does a window function return compared to its input?", a: ["One per partition", "The same number", "One per distinct `ORDER BY` value", "Fewer, if there are ties"], c: 1, why: "Window functions add columns; they don't collapse rows." },
        { q: "Which function reads the previous row's value?", a: ["`LEAD`", "`LAG`", "`FIRST_VALUE`", "`ROW_NUMBER`"], c: 1, why: "`LAG` looks backward; `LEAD` looks forward." }
      ]
    },
    // ---------------- Expert ----------------
    {
      id: 'plans', title: 'Execution plans and query tuning', level: 3, mins: 45,
      why: "Tuning isn't guessing. The execution plan shows what the engine actually did and why, so you can change one thing based on evidence and measure again.",
      points: [
        "The **optimizer** picks a plan using **statistics** about how the data is distributed. Stale statistics produce bad row estimates and bad plans.",
        "Read a plan by comparing **estimated versus actual rows** and finding the most expensive operators: scans, key lookups, sorts, hash spills.",
        "Join algorithms: **nested loops** (small outer input, indexed inner), **hash join** (large unsorted inputs), **merge join** (both inputs sorted).",
        "**Sargable** conditions can use an index seek. Wrapping the column in a function (`WHERE YEAR(order_date) = 2026`) or starting with a wildcard (`LIKE '%x'`) forces a scan.",
        "Implicit conversions silently disable seeks. The common one in .NET is a `VARCHAR` column compared with an `NVARCHAR` parameter, which is what a .NET `string` becomes unless it's mapped as `varchar` (in EF Core, `IsUnicode(false)`).",
        "**Parameter sniffing**: a plan compiled for one parameter value is reused for a very different one. Diagnose it with Query Store; treat it with a better index first, then `OPTION (RECOMPILE)` on that query, or a Query Store hint or forced plan.",
        "In the playground, `EXPLAIN QUERY PLAN` shows SQLite's plan, and there is no `YEAR()`: `strftime('%Y', order_date)` hides the column from the index in exactly the same way."
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
      analogy: "A phone book is sorted by surname. 'Everyone named Smith' is one flip (a seek). 'Everyone whose surname ends in -son' means reading every page: the sort order no longer helps, because you asked about a transformation of the key rather than the key itself.",
      pitfalls: [
        "Adding indexes by intuition instead of reading the plan.",
        "Trusting the estimated plan when actual row counts are wildly different.",
        "Deep `OFFSET` pagination that reads and discards thousands of rows per page.",
        "Fixing parameter sniffing with `OPTION (RECOMPILE)` on a query that runs thousands of times a second. Compiling every time costs CPU."
      ],
      quiz: [
        { q: "Which condition can use an index seek on `order_date`?", a: ["`WHERE YEAR(order_date) = 2026`", "`WHERE order_date >= '2026-01-01' AND order_date < '2027-01-01'`", "`WHERE CONVERT(CHAR(4), order_date, 120) = '2026'`", "`WHERE DATEADD(day, 1, order_date) > '2026-01-01'`"], c: 1, why: "Only a range on the bare column is sargable; the others apply a function to it first." },
        { q: "Estimated rows: 10. Actual rows: 900,000. Most likely cause?", a: ["Too many indexes on the table", "Stale or misleading statistics, or parameter sniffing", "The server is short of memory", "The query uses a CTE"], c: 1, why: "The optimizer chose a plan for a tiny input; fix the estimate and the plan follows." },
        { q: "Which join algorithm suits a small outer input with an index on the inner table?", a: ["Hash join", "Nested loops", "Merge join", "Whichever table is written first"], c: 1, why: "Nested loops performs one cheap index seek per outer row." }
      ]
    },
    {
      id: 'locking', title: 'Locking, deadlocks and MVCC', level: 3, mins: 40,
      why: "When an app 'randomly' times out under load, the cause is usually blocking: one transaction waiting for another. The skill is working out who is waiting on whom, then changing the access pattern so they don't.",
      points: [
        "Under SQL Server's default Read Committed, statements take **locks**: shared (S) for reads, exclusive (X) for writes. Writers block readers and readers briefly block writers.",
        "**MVCC** (row versioning) keeps old versions of rows so readers see the last committed data and **don't block writers**. Writers still block other writers. PostgreSQL always works this way; SQL Server does when `READ_COMMITTED_SNAPSHOT` is on, the default in Azure SQL Database.",
        "A **deadlock** is a cycle: T1 holds A and wants B, T2 holds B and wants A. SQL Server picks a victim, rolls it back, and raises error 1205.",
        "Prevent deadlocks: touch rows and tables in a **consistent order**, keep transactions short, add indexes so statements lock fewer rows, and retry the victim. EF Core's `EnableRetryOnFailure()` retries deadlocks automatically, as long as you don't open your own transaction outside its execution strategy.",
        "Surprise blocking: an `UPDATE … WHERE` on an unindexed column locks every row it scans, and once one statement holds about 5,000 locks SQL Server escalates to a table lock.",
        "Diagnose with the deadlock graph in the `system_health` Extended Events session, `blocking_session_id` in `sys.dm_exec_requests`, and `sys.dm_tran_locks`.",
        "An **upsert** (update the row if it exists, insert it otherwise) is a race: two sessions can both find no row and both insert. Run `UPDATE … WITH (UPDLOCK, HOLDLOCK)` and then `IF @@ROWCOUNT = 0 INSERT …` in one transaction, or `MERGE … WITH (HOLDLOCK)`, and keep a `UNIQUE` key as the last line of defence."
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
      practice: "Open two query windows in SQL Server Management Studio (or two `sqlcmd` terminals) on a test database with an `accounts` table, and play the four steps above by hand. Capture error 1205, then find the deadlock graph in the `system_health` session. Fix it with the lower-id-first version, and separately add a retry in your application (in EF Core, `EnableRetryOnFailure()`). Which fix would you ship, and why keep both?",
      teach: "Explain how a deadlock happens using two transfers between the same two accounts, and one way to prevent it.",
      analogy: "Two people meet in a narrow corridor, each holding one half of a two-part key and reaching for the other's half. Neither lets go first. The database is the manager who taps one on the shoulder: 'put yours down, go back, try again.' Agreeing to always pick up the left half first means it never happens.",
      pitfalls: [
        "Treating deadlocks as database bugs rather than access-order bugs.",
        "Scattering `NOLOCK` hints to hide blocking, and accepting dirty and inconsistent reads in return.",
        "Not retrying deadlock victims. A deadlock is an expected, temporary error.",
        "Retrying only the statement that failed. The victim's whole transaction was rolled back, so retry all of it.",
        "Upserting with `IF NOT EXISTS (SELECT …) INSERT …` and no lock hints. Two requests pass the check together, and one of them fails on the key, or stores a duplicate if there is no key."
      ],
      quiz: [
        { q: "What is the standard way to prevent deadlocks between transactions that update the same rows?", a: ["Add `WITH (NOLOCK)` to the updates", "Access the rows in a consistent order", "Raise the isolation level to Serializable", "Increase the lock timeout"], c: 1, why: "If everyone takes locks in the same order, a cycle can't form. Serializable takes more locks and makes deadlocks more likely." },
        { q: "With `READ_COMMITTED_SNAPSHOT` on, a long-running read…", a: ["blocks all writers until it finishes", "sees a consistent version and does not block writers", "sees other transactions' uncommitted changes", "takes a table lock"], c: 1, why: "Readers use row versions rather than shared locks." },
        { q: "What should application code do when it is chosen as a deadlock victim?", a: ["Show the error to the user", "Retry the whole transaction", "Retry only the statement that failed", "Nothing: the change was saved"], c: 1, why: "The whole transaction was rolled back, so retrying only the last statement would apply half a change." },
        { q: "Two 'add to cart' requests run `UPDATE …; IF @@ROWCOUNT = 0 INSERT …` for the same item at the same moment, with no lock hints. What can happen?", a: ["Nothing: each statement is atomic, so the pair is too", "Both find no row and both insert, so one fails on the primary key", "The database merges the two inserts into one row", "The second request waits automatically until the first commits"], c: 1, why: "Each statement is atomic, but the pair isn't. `UPDLOCK, HOLDLOCK` on the update keeps the range locked until the insert, so the second request waits and then updates instead." }
      ]
    },
    {
      id: 'scale', title: 'Scaling and evolving a database', level: 3, mins: 45,
      why: "Schemas change and data grows while the system stays online. The job is planning migrations that can't cause downtime, and knowing what each scaling option costs before you reach for it.",
      points: [
        "Scale in order: fix queries and indexes → cache → scale up → **read replicas** → **partitioning** → **sharding**. Each step adds operational cost.",
        "Read replicas take load off the primary but lag behind it, so 'read your own write' needs care.",
        "**Partitioning** splits one table by a key (often a date) for easier maintenance and so queries skip irrelevant partitions; **sharding** spreads data across servers and makes cross-shard queries and transactions hard.",
        "**Zero-downtime migrations** use **expand → migrate → contract**: add the new nullable column, write to both, backfill in batches, switch reads, and only later drop the old column.",
        "Every deploy must work with the schema **before and after** the migration, because old and new app versions run side by side.",
        "EF Core migrations apply your schema changes. For zero downtime, split a rename into several migrations shipped with matching app releases, instead of letting EF generate a single `RenameColumn`.",
        "Beyond rows: JSON functions (`JSON_VALUE`, `OPENJSON`), full-text search, indexed views (SQL Server's materialized views), and knowing when a cache, search index or queue is the better tool."
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
      practice: "Write the full migration plan, SQL plus the matching application releases, for splitting a `name` column into `first_name` and `last_name` on a table with 50 million rows and no maintenance window. Identify the step that is hardest to roll back.",
      teach: "Explain the expand–migrate–contract pattern and why renaming a column in one step breaks a running application.",
      analogy: "Replacing a bridge without closing the road: build the new bridge beside the old one (expand), move traffic over lane by lane (migrate), and demolish the old bridge only when nobody uses it (contract). Blowing up the old bridge first is faster, and leaves everyone in the river.",
      pitfalls: [
        "Sharding before you've used up indexes, caching and replicas.",
        "One huge `UPDATE` backfill that locks the table for minutes and fills the transaction log.",
        "Assuming replica reads are current immediately after a write.",
        "Letting EF Core generate one `RenameColumn` migration for a live system. Old app instances still running will fail the moment it applies."
      ],
      quiz: [
        { q: "First step of a zero-downtime column rename?", a: ["Drop the old column", "Add the new column alongside the old one", "Rename it in place with `sp_rename`", "Copy the table under a new name"], c: 1, why: "Expand first, so both old and new application versions keep working." },
        { q: "A user saves a profile, the next page reads from a replica and shows the old value. Why?", a: ["A bug in the SQL query", "Replication lag: the replica has not applied the write yet", "The browser cached the old page", "A deadlock rolled the save back"], c: 1, why: "Asynchronous replicas are eventually consistent; send read-your-own-write requests to the primary." },
        { q: "What makes sharding costly compared to partitioning within one server?", a: ["Indexes stop working across shards", "Cross-shard joins and transactions are hard or impossible", "Each shard needs a different schema", "Backups can no longer be taken"], c: 1, why: "Data on different servers can't be joined or committed atomically by one engine." }
      ]
    }
  ]
});
