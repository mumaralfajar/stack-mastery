// Runs every SQL lesson sample against a real SQL Server.
// Each lesson gets a fresh scratch database seeded with the same data as the SQL playground,
// and any error fails the check. The scratch database is dropped at the end.
// Usage: node tools/verify-sql.mjs [--server .\SQLEXPRESS] [--show]
//   Requires sqlcmd and a SQL Server you can reach with Windows authentication.
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const arg = name => { const i = process.argv.indexOf(name); return i > 0 ? process.argv[i + 1] : null; };
const server = arg('--server') || '.\\SQLEXPRESS';
const show = process.argv.includes('--show');
const DB = 'StackMasteryVerify';

globalThis.window = globalThis;
globalThis.TRACKS = [];
(0, eval)(readFileSync(join(root, 'data/sql.js'), 'utf8'));
const track = TRACKS.find(t => t.id === 'sql');

// Same rows as the playground seed in src/scripts/playground.js, in SQL Server types.
const SEED = `
CREATE TABLE customers (id INT IDENTITY PRIMARY KEY, name NVARCHAR(100) NOT NULL, city NVARCHAR(100) NULL);
CREATE TABLE products (id INT IDENTITY PRIMARY KEY, name NVARCHAR(100) NOT NULL, category NVARCHAR(50) NOT NULL,
  price DECIMAL(10,2) NOT NULL CHECK (price >= 0), stock INT NOT NULL DEFAULT 10 CHECK (stock >= 0));
CREATE TABLE orders (id INT IDENTITY PRIMARY KEY, customer_id INT NOT NULL REFERENCES customers(id),
  order_date DATE NOT NULL, status NVARCHAR(20) NOT NULL DEFAULT 'new');
CREATE TABLE order_items (order_id INT NOT NULL REFERENCES orders(id), product_id INT NOT NULL REFERENCES products(id),
  quantity INT NOT NULL, unit_price DECIMAL(10,2) NOT NULL, PRIMARY KEY (order_id, product_id));
CREATE TABLE accounts (id INT PRIMARY KEY, owner NVARCHAR(100) NOT NULL, balance DECIMAL(10,2) NOT NULL CHECK (balance >= 0));
SET IDENTITY_INSERT customers ON;
INSERT INTO customers (id, name, city) VALUES (1,'Ana','Jakarta'),(2,'Budi','Bandung'),(3,'Citra','Surabaya'),(4,'Dewi','Jakarta'),(5,'Eko',NULL),(6,'Fitri','Bandung');
SET IDENTITY_INSERT customers OFF;
SET IDENTITY_INSERT products ON;
INSERT INTO products (id, name, category, price) VALUES (1,'Laptop','Tech',1200),(2,'Mouse','Tech',25),(3,'Keyboard','Tech',80),(4,'Monitor','Tech',320),(5,'Desk','Home',300),(6,'Lamp','Home',40),(7,'Chair','Home',150),(8,'Notebook','Office',5),(9,'Pen','Office',2),(10,'Backpack','Office',60);
SET IDENTITY_INSERT products OFF;
UPDATE products SET stock = 1 WHERE id = 7;
SET IDENTITY_INSERT orders ON;
INSERT INTO orders (id, customer_id, order_date, status) VALUES (1,1,'2026-01-05','paid'),(2,1,'2026-02-11','paid'),(3,2,'2026-02-14','paid'),(4,3,'2026-03-01','cancelled'),(5,3,'2026-03-09','paid'),(6,4,'2026-03-15','new'),(7,2,'2026-04-02','paid'),(8,5,'2026-04-20','paid');
SET IDENTITY_INSERT orders OFF;
INSERT INTO order_items VALUES (1,1,1,1200),(1,2,2,25),(2,5,1,300),(2,6,2,40),(3,3,1,80),(3,8,10,5),(4,4,1,320),(5,7,1,150),(5,9,20,2),(6,10,1,60),(7,2,1,25),(7,4,1,320),(8,8,4,5),(8,6,1,40);
INSERT INTO accounts VALUES (1,'Ana',500),(2,'Budi',200);
`;

const dir = join(tmpdir(), 'stackmastery-sql');
mkdirSync(dir, { recursive: true });
const sqlcmd = (file, db = 'master') =>
  // -I turns QUOTED_IDENTIFIER on, as SSMS and .NET connections do.
  execFileSync('sqlcmd', ['-S', server, '-E', '-C', '-b', '-I', '-d', db, '-W', '-i', file], { encoding: 'utf8', stdio: 'pipe' });
const runText = (name, text, db) => { const f = join(dir, name); writeFileSync(f, text); return sqlcmd(f, db); };
const reset = () => runText('reset.sql', `IF DB_ID('${DB}') IS NOT NULL BEGIN ALTER DATABASE [${DB}] SET SINGLE_USER WITH ROLLBACK IMMEDIATE; DROP DATABASE [${DB}]; END;\nCREATE DATABASE [${DB}];`);

let ok = 0, failures = 0;
for (const l of track.lessons) {
  try {
    reset();
    // A lesson that creates the shop tables itself starts from an empty database.
    if (!/CREATE TABLE customers/.test(l.code)) runText('seed.sql', SEED, DB);
    const out = runText('lesson.sql', l.code, DB);
    if (show) console.log(`--- ${l.id} ---\n${out.trim()}\n`);
    ok++;
  } catch (e) {
    failures++;
    console.log(`\nLESSON sql/${l.id} fails on SQL Server:\n  ` + String((e.stdout || '') + (e.stderr || '') || e.message).trim().split('\n').slice(-6).join('\n  '));
  }
}
try { runText('drop.sql', `IF DB_ID('${DB}') IS NOT NULL BEGIN ALTER DATABASE [${DB}] SET SINGLE_USER WITH ROLLBACK IMMEDIATE; DROP DATABASE [${DB}]; END;`); } catch { /* best effort */ }
console.log(`${ok} / ${track.lessons.length} SQL lesson samples run cleanly on SQL Server (${server})`);
process.exit(failures ? 1 : 0);
