TRACKS.push({
  id: 'sql', name: 'SQL', lang: 'sql',
  tagline: 'The data: querying, modelling, indexing, transactions and tuning.',
  lessons: [
    // ---------------- Beginner ----------------
    {
      id: 'select', title: 'Tables, rows and SELECT', level: 0, mins: 25,
      why: "Almost every application is a user interface on top of a database. `SELECT` is the single most valuable statement a developer can learn, and it is readable enough to teach on day one.",
      points: [
        "A relational database stores data in **tables**. Each **row** is one thing (a customer); each **column** is one attribute (their city).",
        "A **primary key** uniquely identifies each row — usually an `id`.",
        "`SELECT columns FROM table` chooses columns; `WHERE` chooses rows; `ORDER BY` sorts; `LIMIT` (or `TOP` / `OFFSET FETCH` in SQL Server) caps the count.",
        "SQL is **declarative**: you describe the result you want, not the steps to get it. The database decides how.",
        "Text goes in single quotes: `'Jakarta'`. `LIKE 'A%'` matches patterns. `IN (...)` and `BETWEEN` shorten conditions.",
        "Avoid `SELECT *` in application code: name the columns you need."
      ],
      code: `
-- All customers
SELECT id, name, city FROM customers;

-- Filter rows, sort, and limit
SELECT name, price
FROM products
WHERE category = 'Tech' AND price < 500
ORDER BY price DESC
LIMIT 3;

-- Pattern matching and lists
SELECT name FROM customers WHERE name LIKE 'A%';
SELECT name FROM customers WHERE city IN ('Jakarta', 'Bandung');

-- Computed columns with an alias
SELECT name, price, price * 1.11 AS price_with_tax
FROM products;
`,
      practice: "Open the SQL playground and complete the first three challenges. Then write a query of your own: the five most expensive products that are not in the 'Tech' category.",
      teach: "Explain what a table, a row, a column and a primary key are to someone who has only ever used spreadsheets.",
      analogy: "A table is a spreadsheet with strict rules: every column has one type and every row has a unique ID. `SELECT … WHERE` is asking a librarian 'bring me the title and author of every book published after 2020, newest first' — you say what you want, not which shelves to walk past.",
      pitfalls: [
        "Double quotes for text. Strings use single quotes; double quotes mean identifiers.",
        "Assuming rows come back in insertion order. Without `ORDER BY` the order is not guaranteed.",
        "Thinking SQL is executed top to bottom like a program."
      ],
      quiz: [
        { q: "Which clause chooses which **rows** are returned?", a: ["`SELECT`", "`WHERE`", "`ORDER BY`", "`FROM`"], c: 1, why: "`WHERE` filters rows; `SELECT` chooses columns." },
        { q: "Without `ORDER BY`, the order of rows is…", a: ["by primary key", "by insertion time", "not guaranteed", "alphabetical"], c: 2, why: "The engine may return rows in whatever order is cheapest." },
        { q: "What does `WHERE name LIKE 'A%'` match?", a: ["Names containing %", "Names that start with A", "Names that end with A", "Exactly the name 'A%'"], c: 1, why: "`%` is a wildcard for any sequence of characters." }
      ]
    },
    {
      id: 'dml', title: 'Changing data, types and NULL', level: 0, mins: 25,
      why: "`UPDATE` without `WHERE` has ended careers. Teaching safe habits for writes — and the strange logic of NULL — prevents the mistakes that cannot be undone.",
      points: [
        "`INSERT INTO t (cols) VALUES (…)` adds rows; `UPDATE t SET … WHERE …` changes rows; `DELETE FROM t WHERE …` removes rows.",
        "An `UPDATE` or `DELETE` without `WHERE` affects **every row**. Write the `WHERE` first, and test it as a `SELECT`.",
        "Choose precise types: `INT`, `DECIMAL(10,2)` for money, `VARCHAR/NVARCHAR(n)` for text, `DATE`/`DATETIME2`, `BIT`/`BOOLEAN`.",
        "`NULL` means **unknown / missing**, not zero and not empty string.",
        "Any comparison with NULL yields unknown: `NULL = NULL` is not true. Use `IS NULL` / `IS NOT NULL`.",
        "`COALESCE(a, b)` returns the first non-null value — the standard way to supply defaults."
      ],
      code: `
INSERT INTO customers (name, city) VALUES ('Dewi', 'Surabaya');

-- Safe habit: run the SELECT first, then turn it into the UPDATE
SELECT * FROM products WHERE category = 'Home';
UPDATE products SET price = price * 0.9 WHERE category = 'Home';

DELETE FROM orders WHERE status = 'cancelled';

-- NULL logic
SELECT name FROM customers WHERE city = NULL;      -- returns nothing, always
SELECT name FROM customers WHERE city IS NULL;     -- correct

SELECT name, COALESCE(city, 'Unknown') AS city FROM customers;
`,
      practice: "In the playground, insert yourself as a customer, give yourself an order, then delete only that order. Before each write, run the matching `SELECT` and note how many rows it will touch.",
      teach: "Explain why `WHERE city = NULL` returns no rows, and what to write instead.",
      analogy: "NULL is a sealed envelope: you do not know what is inside. Is this sealed envelope equal to that sealed envelope? You cannot say yes or no — the honest answer is 'unknown'. SQL keeps only rows where the answer is definitely yes.",
      pitfalls: [
        "Running `DELETE FROM orders;` and discovering the missing `WHERE` afterwards.",
        "Treating NULL as zero in arithmetic: `price + NULL` is NULL.",
        "`NOT IN (subquery)` returning nothing because the subquery contains a NULL."
      ],
      quiz: [
        { q: "What does `UPDATE products SET price = 0;` do?", a: ["Nothing without a WHERE", "Sets the price of every product to 0", "Asks for confirmation", "Updates the first row only"], c: 1, why: "With no `WHERE`, every row matches." },
        { q: "The result of `NULL = NULL` in SQL is…", a: ["true", "false", "unknown", "an error"], c: 2, why: "Comparing two unknowns is unknown; use `IS NULL`." },
        { q: "What does `COALESCE(nickname, name, 'N/A')` return?", a: ["Always 'N/A'", "The first of the three that is not NULL", "All three joined", "NULL if any is NULL"], c: 1, why: "`COALESCE` scans left to right and returns the first non-null argument." }
      ]
    },
    {
      id: 'aggregate', title: 'GROUP BY, aggregates and query order', level: 0, mins: 35, viz: 'sqlorder',
      why: "Reports, dashboards and analytics are all aggregation. It is also where students first hit the question 'why can I not use my alias in WHERE?' — answered by the logical order of execution.",
      points: [
        "Aggregates collapse many rows into one value: `COUNT(*)`, `SUM`, `AVG`, `MIN`, `MAX`.",
        "`GROUP BY` forms groups; each group becomes **one output row**.",
        "Every selected column must be either in `GROUP BY` or inside an aggregate.",
        "`WHERE` filters rows **before** grouping; `HAVING` filters groups **after** aggregation.",
        "Logical order: `FROM` → `WHERE` → `GROUP BY` → `HAVING` → `SELECT` → `ORDER BY` → `LIMIT`. That is why a `SELECT` alias works in `ORDER BY` but not in `WHERE`.",
        "`COUNT(*)` counts rows; `COUNT(col)` counts non-null values; `COUNT(DISTINCT col)` counts unique values."
      ],
      code: `
-- How many products and what average price per category?
SELECT category,
       COUNT(*)          AS products,
       ROUND(AVG(price)) AS avg_price
FROM products
GROUP BY category;

-- WHERE filters rows first; HAVING filters the groups afterwards
SELECT customer_id, COUNT(*) AS orders
FROM orders
WHERE status = 'paid'
GROUP BY customer_id
HAVING COUNT(*) >= 2
ORDER BY orders DESC;
`,
      practice: "Using the playground, find the total quantity sold per product, only for products that sold more than 3 units, highest first. Then step through the visualization and say out loud what each clause does to the rows.",
      teach: "Explain the difference between `WHERE` and `HAVING`, and why SQL does not run in the order it is written.",
      analogy: "Sorting coins. First throw out the foreign coins (`WHERE`). Then make piles by denomination (`GROUP BY`). Then keep only piles taller than ten coins (`HAVING`). Then write down each pile's label and total (`SELECT`). Finally arrange the notes by total (`ORDER BY`).",
      pitfalls: [
        "Putting an aggregate condition in `WHERE`: `WHERE COUNT(*) > 2` is an error.",
        "Selecting a column that is neither grouped nor aggregated.",
        "Believing `SELECT` runs first because it is written first."
      ],
      quiz: [
        { q: "Which clause can filter on `SUM(amount) > 100`?", a: ["`WHERE`", "`HAVING`", "`ORDER BY`", "`FROM`"], c: 1, why: "Aggregates exist only after grouping; `HAVING` runs after `GROUP BY`." },
        { q: "Logically, which runs first?", a: ["`SELECT`", "`ORDER BY`", "`FROM`", "`HAVING`"], c: 2, why: "The engine must know the source rows before anything else." },
        { q: "A column has values 5, NULL, 7. What is `COUNT(col)`?", a: ["3", "2", "12", "NULL"], c: 1, why: "`COUNT(col)` ignores NULLs; `COUNT(*)` would be 3." }
      ]
    },
    // ---------------- Intermediate ----------------
    {
      id: 'joins', title: 'JOINs: combining tables', level: 1, mins: 35, viz: 'joins',
      why: "Relational data is split across tables on purpose. JOINs put it back together, and choosing the wrong join type silently drops or duplicates rows — the hardest kind of bug to notice.",
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
WHERE o.id IS NULL;

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
      analogy: "Two guest lists for a wedding: people invited and people who replied. INNER JOIN is 'invited and replied'. LEFT JOIN is 'everyone invited, with their reply if they sent one — blank if not'. The blanks are the people you still need to phone.",
      pitfalls: [
        "Filtering the right table in `WHERE` after a `LEFT JOIN`, which quietly turns it back into an inner join. Put that condition in `ON`.",
        "`COUNT(*)` after a left join counts the NULL row as 1; count a right-side column instead.",
        "Summing after joining two one-to-many tables and double counting."
      ],
      quiz: [
        { q: "Customers has 4 rows; 1 customer has no orders; Orders has 5 rows, all with valid customers. How many rows does `customers LEFT JOIN orders` return?", a: ["4", "5", "6", "9"], c: 2, why: "Five matched pairs plus one customer with no order, padded with NULLs." },
        { q: "How do you find customers with no orders?", a: ["`INNER JOIN … WHERE o.id = 0`", "`LEFT JOIN … WHERE o.id IS NULL`", "`CROSS JOIN`", "`WHERE orders = NULL`"], c: 1, why: "Unmatched left rows carry NULLs on the right side; filter for those." },
        { q: "After `LEFT JOIN orders o`, adding `WHERE o.status = 'paid'` does what?", a: ["Nothing", "Removes customers with no orders, acting like an inner join", "Adds NULL rows", "Causes an error"], c: 1, why: "NULL = 'paid' is unknown, so unmatched rows are filtered out. Move the condition into `ON`." }
      ]
    },
    {
      id: 'subqueries', title: 'Subqueries and CTEs', level: 1, mins: 30,
      why: "Real questions come in steps: 'of the customers who spent above average, which…'. Subqueries and CTEs let you build an answer in layers that can be read, tested and taught one layer at a time.",
      points: [
        "A **subquery** is a query inside another: in `WHERE` (filter by a computed value or set), in `FROM` (a derived table), or in `SELECT` (a scalar).",
        "A **correlated** subquery refers to the outer row and is logically evaluated per row. `EXISTS` is the classic use.",
        "`EXISTS` asks 'is there at least one?' and stops early; `IN` compares against a list. Prefer `NOT EXISTS` over `NOT IN` because of NULLs.",
        "A **CTE** (`WITH name AS (…)`) names a subquery so the main query reads top to bottom. It is about readability; it does not by itself cache results.",
        "Chain several CTEs to build a query in steps — and run each step alone while debugging.",
        "Recursive CTEs walk hierarchies such as org charts and category trees."
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
`,
      practice: "In the playground, find the customers whose total spend is above the average customer's total spend. Write it with CTEs, and run each CTE on its own first to check the intermediate rows.",
      teach: "Explain what a CTE is and why you would use one instead of nesting subqueries.",
      analogy: "A CTE is naming an intermediate result in a recipe: 'first make the sauce; call it *sauce*. Then pour *sauce* over the pasta.' Nested subqueries are the same recipe written as one unpunctuated sentence.",
      pitfalls: [
        "`NOT IN` with a subquery that returns a NULL — the whole predicate becomes unknown and nothing is returned.",
        "Assuming a CTE referenced twice is computed once. In many engines it is expanded each time.",
        "Scalar subqueries in `SELECT` that run per row when a join would do."
      ],
      quiz: [
        { q: "What is a correlated subquery?", a: ["One that returns multiple columns", "One that references a column from the outer query", "One inside a CTE", "One with a JOIN"], c: 1, why: "It depends on the current outer row, so logically it is evaluated for each." },
        { q: "Why prefer `NOT EXISTS` to `NOT IN (subquery)`?", a: ["It is shorter", "`NOT IN` returns no rows if the subquery yields any NULL", "`NOT IN` is not standard SQL", "`EXISTS` sorts results"], c: 1, why: "`x NOT IN (1, NULL)` is unknown for every x, so no row passes." },
        { q: "The main purpose of a CTE is…", a: ["Faster execution, always", "Readability: naming a step of the query", "Creating a permanent table", "Locking rows"], c: 1, why: "A CTE is a named, query-scoped expression. Performance depends on the engine." }
      ]
    },
    {
      id: 'design', title: 'Schema design: keys, constraints and normalization', level: 1, mins: 40,
      why: "A bad schema cannot be fixed by good code. Design is the highest-leverage database skill, and it must be taught with the question 'what could go wrong if we store it this way?'",
      points: [
        "One table per **entity**; one row per instance; one fact stored in exactly **one place**.",
        "A **foreign key** makes a relationship real: the database refuses an order that points to a non-existent customer.",
        "Relationships: one-to-many (FK on the 'many' side), many-to-many (a junction table such as `order_items`), one-to-one (rare).",
        "**Normalization**: 1NF — atomic values, no lists in a cell. 2NF/3NF — every non-key column depends on the key, the whole key, and nothing but the key.",
        "Constraints are free tests that run on every write: `NOT NULL`, `UNIQUE`, `CHECK (price >= 0)`, `DEFAULT`.",
        "Denormalize deliberately (for example, storing `unit_price` at the time of sale) and know why."
      ],
      code: `
CREATE TABLE customers (
    id    INTEGER PRIMARY KEY,
    name  TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE
);

CREATE TABLE products (
    id    INTEGER PRIMARY KEY,
    name  TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL CHECK (price >= 0)
);

CREATE TABLE orders (
    id          INTEGER PRIMARY KEY,
    customer_id INTEGER NOT NULL REFERENCES customers(id),
    order_date  DATE NOT NULL,
    status      TEXT NOT NULL DEFAULT 'new'
                CHECK (status IN ('new', 'paid', 'cancelled'))
);

-- Junction table for the many-to-many between orders and products
CREATE TABLE order_items (
    order_id   INTEGER NOT NULL REFERENCES orders(id),
    product_id INTEGER NOT NULL REFERENCES products(id),
    quantity   INTEGER NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(10,2) NOT NULL,    -- price at time of sale: deliberate copy
    PRIMARY KEY (order_id, product_id)
);
`,
      practice: "Design a schema for a library: books, authors (a book may have several), members and loans. List each table's keys and constraints. Then name one fact you chose to store twice, or explain why none is needed.",
      teach: "Explain why we do not store the customer's name and address on every order row, and what goes wrong if we do.",
      analogy: "Normalization is the rule 'write each phone number in one address book, not on sticky notes around the house'. When a friend changes number you update one place. With sticky notes, you fix three and miss the fourth — and now you have two truths.",
      pitfalls: [
        "Comma-separated lists in a column ('tags: red,blue'). They cannot be indexed, joined or constrained.",
        "Skipping foreign keys 'for flexibility' and accumulating orphan rows.",
        "Normalizing away history: an order must remember the price that was charged."
      ],
      quiz: [
        { q: "Orders and products are many-to-many. How is that modelled?", a: ["A list column in `orders`", "A junction table with a foreign key to each", "Duplicate product rows", "A `product_ids` text field"], c: 1, why: "A junction table has one row per pairing and can carry attributes such as quantity." },
        { q: "What does a foreign key constraint prevent?", a: ["Slow queries", "Rows that reference a parent row that does not exist", "Duplicate primary keys", "NULL values"], c: 1, why: "It enforces referential integrity on every insert, update and delete." },
        { q: "Why is `unit_price` stored on `order_items` even though `products` has `price`?", a: ["A design mistake", "The sale must keep the price at the time of purchase", "To avoid a join", "Foreign keys require it"], c: 1, why: "It is a different fact: historical price charged, not current list price." }
      ]
    },
    // ---------------- Advanced ----------------
    {
      id: 'indexes', title: 'Indexes: how databases find rows fast', level: 2, mins: 40, viz: 'index',
      why: "The difference between a 5 ms query and a 50 s query is usually one index. This is the most valuable performance concept in the whole stack.",
      points: [
        "Without an index the engine reads every row — a **scan**, O(n). With a B-tree index it walks a few levels — a **seek**, O(log n).",
        "An index is a sorted copy of some columns with pointers back to the rows. It speeds reads and **slows writes**, and costs storage.",
        "The **clustered index** (the primary key by default in SQL Server) is the table itself, stored in key order. Other indexes are non-clustered.",
        "**Composite index** `(a, b)` helps filters on `a` or on `a AND b`, but not on `b` alone — the leftmost-prefix rule. Put equality columns first, range columns after.",
        "A **covering index** contains every column the query needs (`INCLUDE` columns), so the engine never visits the table.",
        "Index the columns in `WHERE`, `JOIN` and `ORDER BY` of your frequent queries — especially foreign keys. Do not index everything."
      ],
      code: `
-- Slow on a large table: every row is read
SELECT id, order_date FROM orders WHERE customer_id = 42;

-- Seek instead of scan
CREATE INDEX ix_orders_customer ON orders (customer_id);

-- Composite: equality column first, then the range/sort column
CREATE INDEX ix_orders_customer_date ON orders (customer_id, order_date);

-- Uses the index (leftmost prefix)
SELECT id FROM orders WHERE customer_id = 42 AND order_date >= '2026-01-01';

-- Cannot seek on this index: customer_id is not constrained
SELECT id FROM orders WHERE order_date >= '2026-01-01';

-- SQL Server: covering index, no lookup back to the table
-- CREATE INDEX ix_orders_cover ON orders (customer_id, order_date) INCLUDE (status);
`,
      practice: "Run the index visualizer for several targets and record reads for scan versus seek. Then estimate: for 1,000,000 rows, roughly how many comparisons does each need? In the playground, use `EXPLAIN QUERY PLAN` before and after creating an index.",
      teach: "Explain why an index makes lookups fast but inserts slower, without using the word 'B-tree'.",
      analogy: "The index at the back of a textbook: sorted keywords with page numbers. Finding 'transaction' takes seconds instead of reading every page. But each time the author adds a page, the index must be updated too — and an index on every word would be thicker than the book.",
      pitfalls: [
        "Indexing every column 'just in case' and making every write slow.",
        "Expecting an index on `(last_name, first_name)` to help a search by `first_name` only.",
        "Forgetting indexes on foreign keys, making joins and cascading deletes scan."
      ],
      quiz: [
        { q: "An index exists on `(country, city)`. Which filter can seek on it?", a: ["`WHERE city = 'Bandung'`", "`WHERE country = 'ID'`", "Neither", "`WHERE population > 1000`"], c: 1, why: "A composite index is usable from its leftmost column; `city` alone is not a prefix." },
        { q: "What is the main cost of adding an index?", a: ["Reads get slower", "Every insert, update and delete must also maintain the index", "Queries return fewer rows", "It disables constraints"], c: 1, why: "Indexes are extra structures kept in sync on each write, plus storage." },
        { q: "A 'covering' index means…", a: ["It covers every column in the table", "It includes all columns a query needs, so the table is not read", "It is encrypted", "It is the clustered index"], c: 1, why: "The query is answered from the index alone, avoiding lookups." }
      ]
    },
    {
      id: 'transactions', title: 'Transactions, ACID and isolation', level: 2, mins: 40,
      why: "Money transfers, stock decrements and order placement must be all-or-nothing and correct under concurrency. Every developer who writes to a database needs this model.",
      points: [
        "A **transaction** groups statements into one unit: `BEGIN` … `COMMIT`, or `ROLLBACK` to undo everything.",
        "**ACID**: Atomic (all or nothing), Consistent (constraints hold), Isolated (concurrent transactions do not corrupt each other), Durable (committed data survives a crash).",
        "Concurrency anomalies: **dirty read** (seeing uncommitted data), **non-repeatable read** (a row changes between two reads), **phantom** (new rows appear), **lost update** (two writers overwrite each other).",
        "**Isolation levels** trade safety for concurrency: Read Uncommitted → Read Committed (the usual default) → Repeatable Read → Serializable; plus Snapshot (row versioning).",
        "Keep transactions **short**: no user think-time and no HTTP calls inside one.",
        "Avoid read-then-write races with atomic statements (`UPDATE … SET stock = stock - 1 WHERE stock > 0`) or optimistic concurrency."
      ],
      code: `
-- All or nothing: move 100 from account 1 to account 2
BEGIN TRANSACTION;

UPDATE accounts SET balance = balance - 100 WHERE id = 1 AND balance >= 100;
-- if 0 rows were affected: ROLLBACK and report insufficient funds
UPDATE accounts SET balance = balance + 100 WHERE id = 2;

COMMIT;

-- Lost update: two sessions both read stock = 1, both write 0
--   SELECT stock FROM products WHERE id = 7;      -- app subtracts in code
--   UPDATE products SET stock = 0 WHERE id = 7;

-- Safe: one atomic statement, the database serializes the writers
UPDATE products SET stock = stock - 1 WHERE id = 7 AND stock > 0;
-- rows affected = 0 means sold out
`,
      practice: "Open two database sessions. In the first, begin a transaction and update a row without committing. In the second, try to read and then update the same row. Record what happens under your engine's default isolation level, then commit and observe.",
      teach: "Explain what 'atomic' means in ACID using a bank transfer, and what the user would see without it.",
      analogy: "A transaction is a vending machine purchase: either you get the snack and it keeps your money, or it returns your money and keeps the snack. There is no state where your money is gone and the snack is stuck. Isolation is the rule that two people cannot both buy the last snack.",
      pitfalls: [
        "Read value in the application, compute, write it back — the classic lost update.",
        "Holding a transaction open while calling an external API.",
        "Assuming the default isolation level prevents all anomalies. Read Committed allows non-repeatable reads and phantoms."
      ],
      quiz: [
        { q: "A transfer debits account A, then the server crashes before crediting B. With a transaction, what is the result after restart?", a: ["A is debited, B not credited", "Neither change is applied", "B is credited twice", "The database is corrupted"], c: 1, why: "Atomicity: an uncommitted transaction is rolled back in full during recovery." },
        { q: "Which anomaly is 'reading data another transaction has not committed yet'?", a: ["Phantom", "Dirty read", "Lost update", "Deadlock"], c: 1, why: "Dirty reads are only possible at Read Uncommitted." },
        { q: "Safest way to decrement stock under concurrency?", a: ["`SELECT` then `UPDATE` with the computed value", "`UPDATE … SET stock = stock - 1 WHERE stock > 0` and check rows affected", "Cache stock in memory", "Use `SELECT *`"], c: 1, why: "A single atomic statement cannot interleave with another writer's read-modify-write." }
      ]
    },
    {
      id: 'window', title: 'Window functions', level: 2, mins: 35,
      why: "Ranking, running totals, 'previous row' comparisons and top-N-per-group are everyday reporting needs that are painful without window functions and one line with them.",
      points: [
        "A window function computes across related rows **without collapsing them** — unlike `GROUP BY`, every input row stays.",
        "`OVER (PARTITION BY x ORDER BY y)` defines the window: partitions are the groups, order defines sequence within each.",
        "Ranking: `ROW_NUMBER()` (unique 1, 2, 3), `RANK()` (ties share, gaps follow), `DENSE_RANK()` (ties share, no gaps).",
        "Aggregates as windows: `SUM(amount) OVER (ORDER BY date)` is a running total; without `ORDER BY` it is the partition total on every row.",
        "`LAG` and `LEAD` read the previous and next row — ideal for period-over-period change.",
        "Top-N per group: number rows in a CTE with `ROW_NUMBER()`, then filter `WHERE rn <= N` outside."
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
       SUM(total) OVER (ORDER BY order_date, id) AS running_total,
       total - LAG(total) OVER (ORDER BY order_date, id) AS change_vs_previous
FROM totals;

-- Most recent order per customer (top-1 per group)
WITH ranked AS (
    SELECT o.*, ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY order_date DESC) AS rn
    FROM orders AS o
)
SELECT id, customer_id, order_date FROM ranked WHERE rn = 1;
`,
      practice: "In the playground, show the two most expensive products in each category. Then add a column showing each product's price as a percentage of its category total.",
      teach: "Explain how `SUM(x) OVER (PARTITION BY c)` differs from `SUM(x) … GROUP BY c`.",
      analogy: "`GROUP BY` puts each class's students into a bus and reports one number per bus. A window function leaves every student at their desk and hands each one a note: 'you are 3rd tallest in your class; class average is 160 cm'.",
      pitfalls: [
        "Trying to filter on a window function in `WHERE`. Windows are computed after `WHERE`; wrap in a CTE.",
        "Using `RANK()` when exactly one row per group is needed — ties return several. Use `ROW_NUMBER()`.",
        "Forgetting `ORDER BY` in a running total, getting the grand total on every row."
      ],
      quiz: [
        { q: "Scores 90, 90, 80. What does `RANK()` (descending) assign?", a: ["1, 2, 3", "1, 1, 2", "1, 1, 3", "1, 2, 2"], c: 2, why: "`RANK` gives ties the same rank and then skips; `DENSE_RANK` would give 1, 1, 2." },
        { q: "How many rows does a window function return compared to its input?", a: ["One per partition", "The same number", "One", "Twice as many"], c: 1, why: "Window functions add columns; they do not collapse rows." },
        { q: "Which function reads the previous row's value?", a: ["`LEAD`", "`LAG`", "`FIRST_VALUE`", "`NTILE`"], c: 1, why: "`LAG` looks backward; `LEAD` looks forward." }
      ]
    },
    // ---------------- Expert ----------------
    {
      id: 'plans', title: 'Execution plans and query tuning', level: 3, mins: 45,
      why: "Tuning is not guessing: the execution plan tells you exactly what the engine did and why. An expert reads a plan the way a doctor reads an X-ray.",
      points: [
        "The **optimizer** picks a plan using **statistics** about data distribution. Stale statistics produce bad row estimates and bad plans.",
        "Read plans by comparing **estimated versus actual rows** and finding the most expensive operators: scans, key lookups, sorts, hash spills.",
        "Join algorithms: **nested loops** (small outer input, indexed inner), **hash join** (large unsorted inputs), **merge join** (both inputs sorted).",
        "**Sargable** predicates can use an index seek. Wrapping the column in a function (`WHERE YEAR(order_date) = 2026`) or a leading wildcard (`LIKE '%x'`) forces a scan.",
        "Implicit conversions (comparing `VARCHAR` column to `NVARCHAR` parameter) silently disable seeks.",
        "**Parameter sniffing**: a plan compiled for one parameter value is reused for a very different one. Diagnose with Query Store; treat with better indexes, `OPTION (RECOMPILE)` or plan guides — in that order."
      ],
      code: `
-- Not sargable: the function hides the column from the index
SELECT id FROM orders WHERE YEAR(order_date) = 2026;

-- Sargable rewrite: a range on the bare column
SELECT id FROM orders
WHERE order_date >= '2026-01-01' AND order_date < '2027-01-01';

-- Not sargable: leading wildcard
SELECT id FROM customers WHERE name LIKE '%son';
-- Sargable: prefix search
SELECT id FROM customers WHERE name LIKE 'John%';

-- See what the engine does
-- SQLite:      EXPLAIN QUERY PLAN SELECT …;
-- PostgreSQL:  EXPLAIN (ANALYZE, BUFFERS) SELECT …;
-- SQL Server:  SET STATISTICS IO, TIME ON;  + "Include Actual Execution Plan"

-- Keyset pagination: stable and fast at any depth (OFFSET gets slower page by page)
SELECT id, order_date FROM orders
WHERE (order_date, id) < ('2026-03-01', 5000)
ORDER BY order_date DESC, id DESC
LIMIT 20;
`,
      practice: "Take the slowest query in one of your projects. Capture its actual plan and I/O statistics, write down your hypothesis, change exactly one thing (an index or a rewrite), and measure again. Present it as before / change / after.",
      teach: "Explain what 'sargable' means and why `WHERE YEAR(order_date) = 2026` cannot use an index on `order_date`.",
      analogy: "A phone book is sorted by surname. 'Everyone named Smith' is one flip (seek). 'Everyone whose surname ends in -son' or 'everyone whose surname, when reversed, starts with N' means reading every page — the sort order no longer helps, because you asked about a transformation of the key rather than the key.",
      pitfalls: [
        "Adding indexes by intuition instead of reading the plan.",
        "Trusting estimated plans when actual row counts are wildly different.",
        "Deep `OFFSET` pagination that reads and discards thousands of rows per page."
      ],
      quiz: [
        { q: "Which predicate can use an index seek on `order_date`?", a: ["`WHERE YEAR(order_date) = 2026`", "`WHERE order_date >= '2026-01-01' AND order_date < '2027-01-01'`", "`WHERE CAST(order_date AS TEXT) LIKE '2026%'`", "`WHERE order_date + 1 > '2026-01-01'`"], c: 1, why: "Only a range on the bare column is sargable; the others apply a function or expression to it." },
        { q: "Estimated rows: 10. Actual rows: 900,000. Most likely cause?", a: ["Too many indexes", "Stale or misleading statistics, or parameter sniffing", "Network latency", "Too much RAM"], c: 1, why: "The optimizer chose a plan for a tiny input; fix the estimate and the plan follows." },
        { q: "Which join algorithm suits a small outer input with an index on the inner table?", a: ["Hash join", "Nested loops", "Merge join", "Cross join"], c: 1, why: "Nested loops performs one cheap index seek per outer row." }
      ]
    },
    {
      id: 'locking', title: 'Locking, deadlocks and MVCC', level: 3, mins: 40,
      why: "When an application 'randomly' times out under load, the cause is usually blocking. Experts can explain who is waiting on whom, and redesign the access pattern so they do not.",
      points: [
        "Pessimistic engines use **locks**: shared (S) for reads, exclusive (X) for writes. Writers block readers and readers block writers, at row, page or table level.",
        "**MVCC** (multi-version concurrency control) keeps old row versions so readers see a consistent snapshot and **never block writers**. PostgreSQL always works this way; SQL Server does with `READ_COMMITTED_SNAPSHOT` on.",
        "A **deadlock** is a cycle: T1 holds A and wants B, T2 holds B and wants A. The engine kills one as the victim (error 1205 in SQL Server).",
        "Prevent deadlocks: touch tables and rows in a **consistent order**, keep transactions short, add indexes so statements lock fewer rows, and retry the victim.",
        "Lock escalation and scans cause surprise blocking: an unindexed `UPDATE … WHERE` may lock far more than it changes.",
        "Diagnose with the deadlock graph, blocked-process reports, `sys.dm_tran_locks` / `pg_locks`."
      ],
      code: `
-- Classic deadlock: two sessions, opposite order

-- Session 1                               -- Session 2
BEGIN;                                     -- BEGIN;
UPDATE accounts SET balance = balance - 10 -- UPDATE accounts SET balance = balance - 5
  WHERE id = 1;                            --   WHERE id = 2;
UPDATE accounts SET balance = balance + 10 -- UPDATE accounts SET balance = balance + 5
  WHERE id = 2;   -- waits for session 2   --   WHERE id = 1;   -- waits for session 1
                                           -- => deadlock: one is rolled back

-- Fix: always lock in the same order (lowest id first)
BEGIN;
UPDATE accounts SET balance = balance - 10 WHERE id = 1;
UPDATE accounts SET balance = balance + 10 WHERE id = 2;
COMMIT;

-- SQL Server: let readers use row versions instead of shared locks
-- ALTER DATABASE Shop SET READ_COMMITTED_SNAPSHOT ON;
`,
      practice: "Reproduce the deadlock above with two sessions. Capture the error and the deadlock graph. Then fix it by ordering, and separately by adding a retry in application code. Which fix would you ship, and why both?",
      teach: "Explain how a deadlock happens using two transfers between the same two accounts, and one way to prevent it.",
      analogy: "Two people meet in a narrow corridor, each carrying one half of a two-part key and reaching for the other's half. Neither will let go first. The database is the manager who taps one on the shoulder: 'put yours down, go back, try again.' Agreeing to always pick up the left half first means it never happens.",
      pitfalls: [
        "Treating deadlocks as database bugs rather than access-order bugs.",
        "Scattering `NOLOCK` hints to hide blocking, accepting dirty and inconsistent reads.",
        "Not retrying deadlock victims — a deadlock is an expected, transient error."
      ],
      quiz: [
        { q: "What is the standard way to prevent deadlocks between transactions that update the same rows?", a: ["Use `NOLOCK`", "Access the rows in a consistent order", "Use longer transactions", "Remove indexes"], c: 1, why: "If everyone acquires locks in the same order, a cycle cannot form." },
        { q: "Under MVCC / snapshot-based read committed, a long-running read…", a: ["blocks all writers", "sees a consistent version and does not block writers", "sees uncommitted data", "locks the table"], c: 1, why: "Readers use row versions rather than shared locks." },
        { q: "What should application code do when it is chosen as a deadlock victim?", a: ["Crash", "Retry the whole transaction", "Ignore the error", "Switch database"], c: 1, why: "The transaction was rolled back cleanly; retrying is safe and expected." }
      ]
    },
    {
      id: 'scale', title: 'Scaling and evolving a database', level: 3, mins: 45,
      why: "Schemas change and data grows while the system stays online. Experts plan migrations that cannot cause downtime and can explain the trade-offs of each scaling option before reaching for it.",
      points: [
        "Scale in order: fix queries and indexes → cache → scale up → **read replicas** → **partitioning** → **sharding**. Each step adds operational cost.",
        "Read replicas offload reads but lag behind: read-your-own-writes needs care.",
        "**Partitioning** splits one table by key (often date) for manageability and partition elimination; **sharding** spreads data across servers and makes cross-shard queries and transactions hard.",
        "**Zero-downtime migrations** use **expand → migrate → contract**: add the new nullable column, write to both, backfill in batches, switch reads, and only later drop the old column.",
        "Every deploy must work with the schema **before and after** the migration, because old and new app versions run side by side.",
        "Know your tools beyond rows: JSON columns, full-text search, materialized views, and when a different store (cache, search index, queue) is the right answer."
      ],
      code: `
-- Goal: rename customers.name to full_name with no downtime

-- 1. EXPAND: add the new column (nullable, instant)
ALTER TABLE customers ADD full_name TEXT NULL;

-- 2. App v2 writes BOTH columns, still reads the old one

-- 3. MIGRATE: backfill in small batches to avoid long locks
UPDATE customers SET full_name = name
WHERE id IN (SELECT id FROM customers WHERE full_name IS NULL LIMIT 1000);
-- repeat until 0 rows affected

-- 4. App v3 reads full_name; v4 stops writing name

-- 5. CONTRACT: only now remove the old column
ALTER TABLE customers DROP COLUMN name;

-- Partitioned table (PostgreSQL syntax)
-- CREATE TABLE events (id BIGINT, at TIMESTAMP, payload JSONB) PARTITION BY RANGE (at);
-- CREATE TABLE events_2026_11 PARTITION OF events
--   FOR VALUES FROM ('2026-11-01') TO ('2026-12-01');
`,
      practice: "Write the full migration plan — SQL plus the matching application releases — for splitting a `name` column into `first_name` and `last_name` on a table with 50 million rows and no maintenance window. Identify the step that is hardest to roll back.",
      teach: "Explain the expand–migrate–contract pattern and why renaming a column in one step breaks a running application.",
      analogy: "Replacing a bridge without closing the road: build the new bridge beside the old one (expand), move traffic lane by lane (migrate), and demolish the old bridge only when nobody uses it (contract). Blowing up the old bridge first is faster and leaves everyone in the river.",
      pitfalls: [
        "Sharding before exhausting indexes, caching and replicas.",
        "A single huge `UPDATE` backfill that locks the table for minutes and bloats the log.",
        "Assuming replica reads are current immediately after a write."
      ],
      quiz: [
        { q: "First step of a zero-downtime column rename?", a: ["Drop the old column", "Add the new column alongside the old one", "Rename in place", "Stop the application"], c: 1, why: "Expand first so both old and new application versions keep working." },
        { q: "A user saves a profile, the next page reads from a replica and shows the old value. Why?", a: ["A bug in SQL", "Replication lag: the replica has not applied the write yet", "The cache is full", "A deadlock"], c: 1, why: "Asynchronous replicas are eventually consistent; route read-your-writes to the primary." },
        { q: "What makes sharding costly compared to partitioning within one server?", a: ["Indexes stop working", "Cross-shard joins and transactions are hard or impossible", "It needs more RAM", "Backups are forbidden"], c: 1, why: "Data on different servers cannot be joined or committed atomically by the engine." }
      ]
    }
  ]
});
