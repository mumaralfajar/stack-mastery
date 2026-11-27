// @ts-check
export const track = {
  id: 'react', name: 'TypeScript + React', lang: 'tsx',
  tagline: 'The frontend: modern JavaScript, the type system, components, state and architecture.',
  verifiedAgainst: 'TypeScript 6 / React 19.1',
  verifiedDate: '2026-11-26',
  lessons: [
    // ---------------- Beginner ----------------
    {
      id: 'js', title: 'JavaScript essentials for TypeScript', level: 0, mins: 30,
      terms: [
        ['`const` vs `let`', '`const` stops you from rebinding a variable name (use it by default). Object fields still need a copy (`{ ...x }`) to stay immutable.'],
        ['`===` vs `==`', '`===` checks both value and type with no hidden conversions (`0 == ""` is a famous `==` trap).'],
        ['Array `.map()` / `.filter()`', 'Creates a new transformed or filtered array without mutating the original list, which React relies on for state updates.']
      ],
      why: "TypeScript is JavaScript with types on top. Most React bugs that trip beginners up, such as stale values, mutated arrays, or `undefined`, are really JavaScript problems.",
      points: [
        "`const` can't be reassigned, while `let` can. Default to `const` and avoid `var`.",
        "Functions are regular values. Arrow functions like `(x) => x * 2` are what you'll write most often.",
        "Objects and arrays pass by **reference**, so `const b = a` shares the same array. Copy them with spread (`[...a]`, `{ ...obj }`).",
        "`map`, `filter`, and `reduce` return **new** arrays and leave the original alone. `sort`, `reverse`, and `splice` mutate in place, so use `toSorted`, `toReversed`, and `toSpliced` instead.",
        "Destructuring pulls values straight out of objects and arrays: `const { name, age } = user` and `const [first, ...rest] = list`.",
        "`===` checks exact value and type. `?.` stops at `null` or `undefined`, and `??` only falls back on those two. `||` falls back on any falsy value (`0`, `''`, `null`, `undefined`, `NaN`, `false`)."
      ],
      code: `
type User = { name: string; age?: number; address?: { city: string; zip?: string } };

const prices = [5, 12, 8];
const doubled = prices.map(p => p * 2);              // [10, 24, 16], a new array
const big = prices.filter(p => p > 6);               // [12, 8]
const total = prices.reduce((sum, p) => sum + p, 0); // 25
const cheapFirst = prices.toSorted((a, b) => a - b); // [5, 8, 12]; prices is unchanged

const user: User = { name: "Ana", address: { city: "Bandung" } };
const { name, address } = user;                      // destructuring

// Immutable updates: the style React needs
const older = { ...user, age: 31 };                  // copy + add
const added = [...prices, 20];                       // copy + append
const without = prices.filter(p => p !== 12);        // copy without

// Safe access: address might be missing, and so might zip
const zip = user.address?.zip ?? "unknown";          // "unknown"
const discount = 0;
const shown = discount ?? 10;                        // 0: ?? only replaces null/undefined
const wrong = discount || 10;                        // 10: || replaces any falsy value

// Async
async function load(): Promise<void> {
  const res = await fetch("/api/products");
  const data: unknown = await res.json();
  console.log(data);
}
`,
      practice: "In the TypeScript playground, take an array of `{ name, price, inStock }` and return the names of in-stock items under 100, sorted by price. Use `toSorted`, then log the original array to prove it didn't change.",
      teach: "Explain why `const b = a` followed by `b.push(1)` also changes `a`, and how to avoid that.",
      analogy: "`const` on an object is like putting a dog on a fixed leash. You can't tie the leash to a different dog, though the dog can still get muddy.",
      pitfalls: [
        "Believing `const` makes an object immutable. It only locks which object the variable name points to.",
        "Calling `sort` or `splice` on state changes the array in place. Use `toSorted` and `toSpliced` instead.",
        "Writing `count || 10` when `0` is a valid count. Use `??`.",
        "Confusing `map` (returns a new array) with `forEach` (returns nothing)."
      ],
      quiz: [
        { id: 'map-return', q: "What does `[1, 2, 3].map(n => n * 2)` return?", a: ["`undefined`", "`[2, 4, 6]`, and the original becomes `[2, 4, 6]` too", "`[2, 4, 6]`, leaving the original alone", "`6`"], c: 2, why: "`map` returns a new array of transformed elements and doesn't touch the original." },
        { id: 'const-const', q: "With `const a = { n: 1 }`, `const b = a`, and `b.n = 2`, what is `a.n`?", a: ["1", "2", "undefined", "An error: `a` is const"], c: 1, why: "`a` and `b` point to the same object. `const` only stops you from reassigning the variable." },
        { id: 'what-is-0-10', q: "What is `0 ?? 10`?", a: ["`0`", "`10`", "`null`", "`false`"], c: 0, why: "`??` only replaces `null` and `undefined`. `0 || 10` would give `10`, because `0` is falsy." }
      ]
    },
    {
      id: 'ts', title: 'TypeScript: types that catch bugs', level: 0, mins: 35,
      predict: {
        prompt: "Given `type Result<T> = { ok: true; data: T } | { ok: false; error: string }`, you write `function show(r: Result<Product>) { console.log(r.data.name); }` without checking `if (r.ok)`. What happens?",
        options: [
          "Compiles cleanly and prints `undefined` at runtime when `ok` is `false`",
          "TypeScript compile error: `Property \"data\" does not exist on type \"{ ok: false; error: string }\"`",
          "TypeScript inserts a runtime `if (r.ok)` guard automatically",
        ],
        answer: 1,
        explain: "Before narrowing on the discriminant `r.ok`, `r` could be the error branch where `data` does not exist. Checking `if (r.ok)` narrows `r` to `{ ok: true; data: Product }` inside that branch.",
      },
      terms: [
        ['Discriminated union', 'Object shapes sharing a literal tag (`ok: true` with `data: T`, or `ok: false` with `error: string`) narrowed in `if` blocks.'],
        ['Type narrowing', 'TypeScript tracks checks like `typeof x === "string"`, `in`, and `switch` so it knows the exact subtype inside each branch.'],
        ['`unknown` vs `any`', '`unknown` forces you to verify the runtime shape before reading properties, while `any` turns off the checker.']
      ],
      why: "TypeScript turns whole classes of bugs from runtime surprises into editor squiggles. It also acts as the contract between your React frontend and your backend API.",
      points: [
        "Annotate where data enters, such as parameters, return types, and API responses. Let inference figure out the rest.",
        "`interface` or `type` describes an object's shape. TypeScript uses **structural** typing, so any value with the right shape fits.",
        "**Union types** express 'one of several options', like `string | number` or `'idle' | 'loading' | 'error'`.",
        "Type **narrowing** happens after checks like `if (typeof x === 'string')` or `if (user)`, so TypeScript knows the narrower type inside that block.",
        "Optional properties like `age?: number` mean `number | undefined`. With `strict` turned on (as Vite does), you have to handle `undefined`.",
        "Skip `any` because it turns checking off. Reach for `unknown` and narrow it first. Remember types vanish at runtime, so TypeScript won't validate network responses for you."
      ],
      code: `
interface Product {
  id: number;
  name: string;
  price: number;
  tags?: string[];                    // optional
}

type Status = "idle" | "loading" | "success" | "error";   // union of literals

function label(p: Product): string {
  const tags = p.tags?.join(", ") ?? "no tags";
  return p.name + " (" + tags + ")";
}

// Narrowing
function format(value: string | number): string {
  if (typeof value === "number") return value.toFixed(2);  // number here
  return value.trim();                                      // string here
}

// Discriminated union: impossible states can't be represented
type Result<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };

function show(r: Result<Product>) {
  if (r.ok) console.log(r.data.name);     // data exists only when ok
  else console.log(r.error);
}
`,
      practice: "In the playground, define a `Todo` type and `toggle(todos: Todo[], id: string): Todo[]` returning a new array. Next, model request state as a discriminated union (`idle`, `loading`, `success`, `error`) and write a handler for all four.",
      teach: "Explain what a union type is and how TypeScript narrows it inside an `if`.",
      analogy: "Types work like a shape-sorter toy. The square block only fits the square hole, and you spot mistakes immediately rather than after shipping. A union accepts a square or a circle, and narrowing checks which one you picked up before using it.",
      pitfalls: [
        "Reaching for `any` when the checker complains. Most of the time, the complaint points to a real bug.",
        "Believing TypeScript validates API responses at runtime. Writing `as Product` is a promise from you, not a runtime check.",
        "Annotating every local variable when the compiler already infers it."
      ],
      quiz: [
        { id: 'type-size-allow', q: "What does `type Size = 'S' | 'M' | 'L'` allow?", a: ["Any string", "Exactly one of those three strings", "An array of those three strings", "Any string starting with S, M or L"], c: 1, why: "It's a union of string literal types." },
        { id: 'typescript-types-runtime', q: "TypeScript types at runtime are…", a: ["checked by the JavaScript engine", "erased: they exist only at compile time", "converted into classes", "kept as comments in the output"], c: 1, why: "The compiler erases all types, so the emitted output is plain JavaScript." },
        { id: 'safer-alternative-any-value', q: "Safer alternative to `any` for a value of unknown shape?", a: ["`object`", "`unknown`, then narrow", "`never`", "`{}`"], c: 1, why: "`unknown` makes you verify the type before using the value." }
      ]
    },
    {
      id: 'components', title: 'React: components, JSX and props', level: 0, mins: 35,
      predict: {
        prompt: "A component renders `{products.length && <ProductList items={products} />}` when `products` is `[]`. What actually appears in the DOM?",
        options: [
          "Nothing (empty DOM)",
          "The digit `0` rendered as text on the page",
          "A runtime error because `&&` requires a boolean",
        ],
        answer: 1,
        explain: "In JavaScript, `0 && <ProductList />` evaluates to `0`, and React renders the number `0` into the DOM (unlike `false`, `null`, or `undefined`). Write `products.length > 0 && ...` instead.",
      },
      terms: [
        ['JSX expression', 'JavaScript syntax like `<Card price={p.price} />` that compiles into `jsx(...)` function calls, rather than a separate HTML template parser.'],
        ['Props (one-way down)', 'Read-only inputs flowing from parent to child. Changing a child never mutates the parent props directly.'],
        ['Stable `key` prop', 'Lets React track list rows by database ID across inserts and sorts. Using array index causes state bugs when rows move.']
      ],
      why: "React boils down to one core idea: UI is a function of your data. Once you treat a component as a function describing the screen for today's data, everything else clicks. This track targets React 19, what a fresh Vite setup installs.",
      points: [
        "A **component** is a function returning JSX, and its name always starts with an uppercase letter.",
        "**JSX** is JavaScript dressed up like HTML. Curly braces `{ }` drop any JS expression straight in.",
        "**Props** are a component's read-only inputs, written like attributes. A component shouldn't mutate the props it receives.",
        "Render lists with `map` and pass a stable, unique `key` on each item.",
        "Conditional UI uses everyday JavaScript like `cond && <X />` or `cond ? <A /> : <B />`.",
        "Build bigger views out of small components. The `children` prop lets a component wrap whatever content goes inside it."
      ],
      code: `
interface ProductCardProps {
  name: string;
  price: number;
  onSale?: boolean;
}

function ProductCard({ name, price, onSale = false }: ProductCardProps) {
  return (
    <article className="card">
      <h2>{name}</h2>
      <p>{price.toFixed(2)}</p>
      {onSale && <span className="badge">Sale</span>}
    </article>
  );
}

const products = [
  { id: 1, name: "Laptop", price: 1200 },
  { id: 2, name: "Mouse", price: 25, onSale: true },
];

export default function App() {
  return (
    <main>
      <h1>Shop</h1>
      {products.length === 0
        ? <p>No products</p>
        : products.map(p => <ProductCard key={p.id} {...p} />)}
    </main>
  );
}
`,
      practice: "Spin up a Vite project with `npm create vite@latest shop -- --template react-ts`. Build a `ProductList` showing `ProductCard` rows, display an empty message for `[]`, and highlight items over 1000.",
      teach: "Explain what a React component and props are to someone who knows HTML and basic JS.",
      analogy: "A component works like a rubber stamp with blanks. The design stays fixed, while props fill in those blanks on each stamp. You build pages by stamping small stamps inside bigger ones.",
      pitfalls: [
        "Using the array index as `key` on lists that can add, remove, or reorder rows.",
        "Trying to modify props directly inside the child component.",
        "Accidentally printing a stray `0` on screen with `items.length && <List />`. Write `items.length > 0 &&`."
      ],
      quiz: [
        { id: 'react-function-component', q: "What is a React function component?", a: ["A class that extends `HTMLElement`", "A function that takes props and returns JSX", "A template string of HTML", "A JSON description of the page"], c: 1, why: "Components are plain functions describing UI for the props they receive." },
        { id: 'each-list-item-need', q: "Why does each list item need a `key`?", a: ["For CSS styling", "So React can match items between renders", "To sort the list", "So React can skip rendering the list"], c: 1, why: "Keys give elements a stable identity, so React updates, moves, or removes the right rows." },
        { id: 'child-component-change-props', q: "Can a child component change the props it receives?", a: ["Yes, freely", "No, props are read-only. It asks the parent through a callback", "Only if the prop is an object", "Yes, but only with `useState`"], c: 1, why: "Data flows down, and children ask for updates upward through callback props." }
      ]
    },
    // ---------------- Intermediate ----------------
    {
      id: 'jsdeep', title: 'JavaScript in depth: closures, this and the event loop', level: 1, mins: 40, viz: 'eventloop', lang: 'ts',
      terms: [
        ['Lexical closure', 'A function bundled with the outer variables visible when it was created, which is how React hooks hold onto state between renders.'],
        ['Microtask queue (`Promise.then`)', 'Empties completely right after the call stack clears, before the browser runs the next `setTimeout` task or repaints.'],
        ['Value vs Reference equality (`===`)', 'Objects like `{ a: 1 } === { a: 1 }` evaluate to `false` unless both refer to the exact same object in memory.']
      ],
      predict: {
        prompt: 'What order logs for: `console.log(1)`, `setTimeout(() => console.log(2), 0)`, `Promise.resolve().then(() => console.log(3))`, `console.log(4)`?',
        options: ['`1, 2, 3, 4`', '`1, 4, 3, 2` (microtasks flush before timers)', '`1, 4, 2, 3` (timers run before promises)'],
        answer: 1,
        explain: 'Synchronous calls (`1`, `4`) run first on the call stack. Next, all microtasks drain (`3`), and only then does `setTimeout` (`2`) execute.'
      },
      why: "These three rules explain most weird JavaScript bugs: stale values inside hooks, a `this` turning `undefined`, and async callbacks firing out of order.",
      points: [
        "A **closure** keeps a function paired with the variables around it when it was created. As long as the function exists, those variables stay alive. Hooks and handlers run on this.",
        "A **stale closure** holds onto older variables, which makes timers or effects read outdated state.",
        "`this` comes from **how you call a function**, not where you wrote it. Writing `obj.method()` binds `this` to `obj`, while detaching it drops `this`. **Arrow functions** borrow `this` from their surrounding scope.",
        "JavaScript runs on **one thread** with an **event loop**. It finishes synchronous code, clears **all microtasks** (`Promise.then`, code after `await`), picks **one task** (timers, clicks, responses), then repeats. Repaints happen between tasks.",
        "That's why `.then` beats `setTimeout(..., 0)` every time, and why heavy synchronous loops freeze scrolling and clicks.",
        "`Promise.all` rejects as soon as one running promise fails, while `Promise.allSettled` waits for every outcome. Always handle rejections so errors don't vanish quietly."
      ],
      code: `
// Closure: the returned function remembers 'count'
function makeCounter() {
  let count = 0;
  return () => ++count;
}
const next = makeCounter();
next();
console.log("counter:", next());          // counter: 2 (count lives on, private to the closure)

// this: decided by HOW a function is called
const user = {
  name: "Ana",
  hi() { return "Hi " + this.name; },
  later() { setTimeout(() => console.log(this.name), 0); }   // arrow: keeps the outer this
};
console.log(user.hi());                   // Hi Ana
const loose = user.hi;
// loose();                               // TypeError: this is undefined in strict mode

// Event loop: sync code first, then ALL microtasks, then one task
console.log("1 sync");
setTimeout(() => console.log("4 timeout"), 0);
Promise.resolve().then(() => console.log("3 microtask"));
console.log("2 sync");

// Waiting for several requests that run at the same time
async function loadDashboard() {
  const [users, orders] = await Promise.all([fetch("/api/users"), fetch("/api/orders")]);
  if (!users.ok || !orders.ok) throw new Error("A dashboard request failed");
  return { users: await users.json(), orders: await orders.json() };
}
`,
      practice: "Predict the event-loop output order first, then step through the visualization to check. Next, write `debounce(fn, ms)` with a closure and explain which timer variable stays alive.",
      teach: "Explain why `Promise.resolve().then(...)` beats `setTimeout(..., 0)` even though both look asynchronous.",
      analogy: "Think of the event loop as one chef working two ticket rails. After finishing a dish, the chef clears the entire priority rail (microtasks), cooks one regular ticket (tasks), then re-checks priority.",
      pitfalls: [
        "Passing `obj.method` directly as a callback and losing `this`. Wrap it in an arrow function or `bind` it.",
        "Assuming `setTimeout(fn, 0)` runs immediately. It still waits for current code and every queued microtask.",
        "A stale closure inside an effect or `setInterval` reading state from the very first render.",
        "Blocking the main thread with a slow synchronous loop so clicks and frames stall until it exits."
      ],
      quiz: [
        { id: 'both-settimeout-resolved-then', q: "Both a `setTimeout(…, 0)` and a resolved `.then` are queued in synchronous code. Which logs first?", a: ["The timeout", "The promise callback", "Whichever was written first", "It depends on the browser"], c: 1, why: "All microtasks drain before the event loop pulls the next task." },
        { id: 'closure-capture', q: "What does a closure capture?", a: ["A copy of the values at creation time", "The variables themselves, which stay alive with the function", "Only global variables", "Nothing once the outer function returns"], c: 1, why: "The inner function holds live references to its surrounding scope." },
        { id: 'assigning-const-user-hi', q: "Assigning `const f = user.hi` and calling `f()` fails to read `this.name` because…", a: ["`hi` was deleted", "`this` depends on the call, and `f()` has no object before the dot", "`hi` is an arrow function", "`name` is private"], c: 1, why: "Detaching a method loses its receiver, leaving `this` as `undefined` in strict mode." }
      ]
    },
    {
      id: 'state', title: 'State and re-rendering', level: 1, mins: 40, viz: 'rerender',
      predict: {
        prompt: "With `count` currently `0`, a single click handler calls `setCount(count + 1); setCount(count + 1); setCount(c => c + 1);`. What is `count` on the next render?",
        options: [
          "`1` (React ignores duplicate `setCount` calls in one handler)",
          "`2` (both `count + 1` calls queue `1`, then `c => c + 1` adds `1` to `1`)",
          "`3` (all three increments add up)",
        ],
        answer: 1,
        explain: "Inside one render, `count` is frozen at `0`, so both `setCount(count + 1)` calls replace the queued value with `1`. The functional updater `c => c + 1` then receives that queued `1` and returns `2`.",
      },
      terms: [
        ['Render snapshot', 'State like `count` stays fixed inside one render pass. Passing `c => c + 1` reads the latest queued state safely.'],
        ['Immutable state update', 'Creating a fresh array or object (`setItems([...items, x])`) so `Object.is(prev, next)` detects a new reference and triggers a render.'],
        ['Derived state', 'Computing totals or filtered lists straight during render instead of storing duplicate `useState` copies that drift out of sync.']
      ],
      why: "State lets a component remember values and tells React when to redraw the screen. Understanding how updates work answers why screens fail to update or re-render too much.",
      points: [
        "**State** holds data across renders: `const [count, setCount] = useState(0)`.",
        "Calling the setter queues a **re-render**, calling your component function again and updating any DOM differences.",
        "By default, re-rendering a parent **re-renders all its children** too, even when their props didn't change.",
        "State acts like a **snapshot**. Inside one render, `count` won't move, so pass an updater (`c => c + 1`) when computing from previous state.",
        "**Never mutate state directly.** Pass a fresh copy (`setItems([...items, x])`) so React spots a new object reference.",
        "Skip state for values you can compute. Derive totals and filtered arrays right inside render."
      ],
      code: `
import { useState } from "react";

interface Todo { id: string; text: string; done: boolean }

export function Todos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [text, setText] = useState("");

  const remaining = todos.filter(t => !t.done).length;      // derived, not state

  function add() {
    if (!text.trim()) return;
    setTodos(prev => [...prev, { id: crypto.randomUUID(), text, done: false }]);   // a new array
    setText("");
  }

  function toggle(id: string) {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  }

  return (
    <section>
      <label>New todo <input value={text} onChange={e => setText(e.target.value)} /></label>
      <button type="button" onClick={add}>Add</button>
      <p>{remaining} remaining</p>
      <ul>
        {todos.map(t => (
          <li key={t.id}>
            <button type="button" aria-pressed={t.done} onClick={() => toggle(t.id)}
                    style={{ textDecoration: t.done ? "line-through" : "none" }}>
              {t.text}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
`,
      practice: "Build the todo component. Then break it on purpose: replace the `add` body with `todos.push(...)` followed by `setTodos(todos)`. Watch nothing update and explain why, in terms of references.",
      teach: "Explain what happens, step by step, between clicking a button that calls `setCount(count + 1)` and the screen showing the new number.",
      analogy: "Think of each render as a snapshot photo where `count` is frozen in place. Calling `setCount` asks React to take a new picture instead of editing the old one. Mutating state is like doodling on the existing photo with a marker: React checks both prints, sees the same sheet, and skips updating.",
      pitfalls: [
        "Calling `setCount(count + 1)` three times in one handler and expecting +3. All three read the same snapshot.",
        "Mutating arrays or objects stored inside state.",
        "Storing derived values in extra state hooks and letting them fall out of sync.",
        "Generating IDs with `Date.now()`, which collides in fast loops. Use `crypto.randomUUID()`."
      ],
      quiz: [
        { id: 'count-click-handler-calls', q: "`count` is 0, and a click handler calls `setCount(count + 1)` twice in a row. What is `count` next render?", a: ["0", "1", "2", "It throws"], c: 1, why: "Both calls read 0 + 1 from the same render snapshot. Use `setCount(c => c + 1)` to get 2." },
        { id: 'parent-state-changes-components', q: "A parent's state changes. Which components re-render by default?", a: ["Only the parent", "The parent and all its descendants", "The whole app", "Only children whose props changed"], c: 1, why: "Re-rendering a component renders its entire subtree unless `memo` or React Compiler skips unchanged children." },
        { id: 'won-items-push-followed', q: "Why won't `items.push(x)` followed by `setItems(items)` refresh the screen?", a: ["`push` doesn't change the array", "The array reference is unchanged, so React sees no new state", "`setItems` must be awaited", "React only tracks objects, not arrays"], c: 1, why: "React compares state by object reference, so passing back the same array looks unchanged." }
      ]
    },
    {
      id: 'effects', title: 'Effects and data fetching', level: 1, mins: 40, viz: 'useeffect',
      terms: [
        ['Dependency array (`[userId]`)', 'List every reactive value read inside `useEffect` so React re-runs it whenever those inputs change.'],
        ['Cleanup function (`return () => ...`)', 'Runs before the next effect and on unmount, which lets you clear timers, abort requests, or ignore stale async results.'],
        ['Synchronization, not event logic', '`useEffect` syncs React with external systems like networks, WebSockets, or DOM APIs. Button-click saves belong in event handlers.']
      ],
      predict: {
        prompt: 'With no cleanup in `useEffect`, a user switches fast from `userId = 1` (700 ms request) to `userId = 2` (100 ms). What shows at t = 700 ms?',
        options: ['User #2 stays on screen', 'User #1 overwrites User #2 (race condition)', 'React automatically cancels `fetch` calls without `AbortController`'],
        answer: 1,
        explain: "React doesn't cancel in-flight `fetch()` promises on its own. Without an abort or ignore flag in cleanup, slow request #1 finishes late and overwrites User #2."
      },
      why: "`useEffect` trips developers up more than any other hook. Knowing when it's meant to sync with outside systems and when it's the wrong tool saves you from infinite loops and race conditions.",
      points: [
        "Rendering needs to stay **pure**, meaning the same props and state give the same JSX with zero side effects.",
        "`useEffect` runs **after** render to sync with outside systems like timers, sockets, network fetches, or manual DOM work.",
        "The **dependency array** controls re-runs: `[]` runs once on mount, `[id]` runs whenever `id` changes, and omitting it runs after every render.",
        "Return a **cleanup function** to tear down the previous run, such as clearing timers, unsubscribing, or aborting a fetch.",
        "Fetching inside an effect takes loading, error, and data states plus a guard against **race conditions**. In real apps, reach for TanStack Query instead of hand-rolled fetches.",
        "Often you **don't need an effect**. Calculate derived values during render, and handle clicks in event handlers."
      ],
      code: `
import { useEffect, useState } from "react";

interface Product { id: number; name: string; price: number }

export function ProductDetails({ id }: { id: number }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    setProduct(null);
    setError(null);

    fetch("/api/products/" + id, { signal: controller.signal })
      .then(res => {
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.json() as Promise<Product>;
      })
      .then(setProduct)
      .catch(e => { if (e.name !== "AbortError") setError(e.message); });

    return () => controller.abort();     // cleanup: cancel the stale request
  }, [id]);                              // re-run when id changes

  if (error) return <p role="alert">Failed: {error}</p>;
  if (!product) return <p>Loading…</p>;
  return <h2>{product.name} — {product.price}</h2>;
}
`,
      practice: "Wire the component up to your ASP.NET Core API and throttle the network in dev tools. Click quickly between products, drop the cleanup to trigger the bug, then restore it and explain why it happened.",
      teach: "Explain what a `useEffect` dependency array controls and what the cleanup function prevents.",
      analogy: "An effect works like an instruction for a stagehand. Whenever the scene switches to N, set up N's props, and clear the old ones out before the next scene. The dependency array lists everything that counts as a scene change.",
      pitfalls: [
        "Skipping a dependency and reading stale state, or updating a state variable listed in dependencies and spinning forever.",
        "Using `useEffect` to derive data from props or state instead of computing it during render.",
        "Missing cleanup lets slow earlier responses overwrite newer data on screen."
      ],
      quiz: [
        { id: 'useeffect-runs', q: "`useEffect(() => { … }, [])` runs…", a: ["On every render", "Once after the first render (mount)", "Never", "Before the first render"], c: 1, why: "With an empty dependency array, nothing changes to trigger re-runs (in dev, Strict Mode double-runs it on purpose)." },
        { id: 'function-returned-effect', q: "What is the function returned from an effect for?", a: ["Returning data to the component", "Cleanup before the next run and on unmount", "Handling errors", "Memoizing the effect"], c: 1, why: "It tears down the previous run: unsubscribe listeners, clear timers, or abort fetches." },
        { id: 'need-fullname-first-last', q: "You need `fullName` from `first` and `last` props. Best approach?", a: ["A `useEffect` that sets state", "Compute it during render: `const fullName = first + ' ' + last`", "A `useRef` updated on each render", "`useMemo` around the string"], c: 1, why: "Derived values don't need effects or extra state, which only add unnecessary renders. `useMemo` adds noise for cheap string joining." }
      ]
    },
    {
      id: 'forms', title: 'Forms, lifting state and composition', level: 1, mins: 35,
      splits: [["1 · ProductForm & useActionState","import { useActionState"],["2 · Catalog (Lifted State)","export function Catalog()"]],
      terms: [
        ['Controlled input', 'An `<input value={val} onChange={...} />` driven by React state rather than reading values from the DOM on submit.'],
        ['Lifting state up', 'Moving shared state up to the closest common parent so sibling components stay synced through props.'],
        ['Composition (`children`)', 'Passing JSX via `<Modal>{content}</Modal>` instead of piling up config props keeps parent components decoupled.']
      ],
      why: "Real apps revolve around forms and lists sharing state. Knowing where state belongs and how siblings stay synced keeps your components simple instead of tangled.",
      points: [
        "React 19 forms support **Actions** with `<form action={…}>`. Calling `useActionState` gives you returned errors and an `isPending` flag, while fields arrive as `FormData`.",
        "React resets uncontrolled inputs after an action completes. Return the submitted values and set them as `defaultValue` so validation errors don't erase what the user typed.",
        "A **controlled input** gets its `value` from state and sends updates via `onChange`. Reach for it when you react to every keystroke, like live filtering.",
        "When siblings share data, **lift the state** to their nearest common parent. Children ask for updates via callback props (data down, events up).",
        "Wire each error directly to its input with `aria-invalid` and `aria-describedby` so screen readers announce the mistake with the field.",
        "For large forms, pair React Hook Form with a schema library like Zod so one set of rules covers both validation and TypeScript types."
      ],
      code: `
import { useActionState, useState } from "react";

interface NewProduct { name: string; price: number }
interface FormState { values: { name: string; price: string }; errors: { name?: string; price?: string } }

const empty: FormState = { values: { name: "", price: "" }, errors: {} };

function ProductForm({ onAdd }: { onAdd: (p: NewProduct) => void }) {
  const [state, formAction, isPending] = useActionState(
    async (_previous: FormState, data: FormData): Promise<FormState> => {
      const values = { name: String(data.get("name") ?? "").trim(), price: String(data.get("price") ?? "") };
      const price = Number(values.price);
      const errors: FormState["errors"] = {};
      if (!values.name) errors.name = "Name is required";
      if (!(price > 0)) errors.price = "Price must be a positive number";
      if (errors.name || errors.price) return { values, errors };   // keep what the user typed

      onAdd({ name: values.name, price });                         // the event goes UP
      return empty;
    },
    empty);

  return (
    <form action={formAction} noValidate>
      <label htmlFor="name">Name</label>
      <input id="name" name="name" defaultValue={state.values.name}
             aria-invalid={!!state.errors.name} aria-describedby={state.errors.name ? "name-error" : undefined} />
      {state.errors.name && <p id="name-error" role="alert">{state.errors.name}</p>}

      <label htmlFor="price">Price</label>
      <input id="price" name="price" inputMode="decimal" defaultValue={state.values.price}
             aria-invalid={!!state.errors.price} aria-describedby={state.errors.price ? "price-error" : undefined} />
      {state.errors.price && <p id="price-error" role="alert">{state.errors.price}</p>}

      <button type="submit" disabled={isPending}>{isPending ? "Adding…" : "Add"}</button>
    </form>
  );
}

export function Catalog() {
  const [products, setProducts] = useState<NewProduct[]>([]);     // state lives in the parent
  return (
    <>
      <ProductForm onAdd={p => setProducts(prev => [...prev, p])} />
      <p>{products.length} products, total {products.reduce((s, p) => s + p.price, 0)}</p>
    </>
  );
}
`,
      practice: "Add a search box and a list as sibling components. Decide where the search text must live, wire it up with a controlled input, and write one sentence justifying the location. Then submit the product form with an empty name and check that the price you typed is still there.",
      teach: "Explain 'lifting state up' with two sibling components that need to show the same data.",
      analogy: "Two children share one box of crayons. If each keeps a private box, their pictures never match. Give the box to the parent, who hands crayons down and takes requests ('may I have blue?') back up. One box, one truth.",
      pitfalls: [
        "Copying a prop into `useState` and wondering why later parent updates don't show up.",
        "Lifting every piece of state to the root 'just in case', forcing the whole app to re-render on each keystroke.",
        "Flipping between `value={undefined}` and a string on one input, which fires React's controlled/uncontrolled warning.",
        "Displaying an error near an input without linking `aria-describedby`, hiding it from screen-reader users."
      ],
      quiz: [
        { id: 'two-sibling-components-show', q: "Two sibling components must show the same value. Where should the state live?", a: ["In both siblings", "In their closest common parent", "In a module-level variable", "In `localStorage`"], c: 1, why: "One owner sends the value down to both, keeping them in sync automatically." },
        { id: 'child-update-state-owned', q: "How does a child update state owned by its parent?", a: ["It changes the prop", "It calls a callback function passed as a prop", "It reads the parent's state with `useContext`", "It can't"], c: 1, why: "The parent hands down a callback and the child invokes it, sending events upward." },
        { id: 'form-action-returns-validation', q: "A form action returns validation errors, and the fields come back empty. Why?", a: ["The action threw an error", "React resets uncontrolled fields after an action, so return submitted values and pass `defaultValue`", "`useActionState` only keeps the last field", "The form needs `method=\"post\"`"], c: 1, why: "Automatic resets read each input's `defaultValue`, so passing the submitted values keeps the user's typing intact." },
        { id: 'controlled-input-one-whose', q: "A 'controlled' input is one whose…", a: ["value comes from React state", "value lives only in the DOM", "type is `password`", "changes are disabled"], c: 0, why: "State acts as the source of truth: `onChange` writes to state, and state drives `value`." }
      ]
    },
    {
      id: 'generics', title: 'TypeScript generics and utility types', level: 1, mins: 35,
      terms: [
        ['Generic constraint (`<T extends { id: number }>`)', 'Requires a generic type parameter to support at least a minimum shape while preserving the full subtype on return.'],
        ['`Pick` / `Omit` / `Partial`', 'Built-in utility types deriving `CreateProduct` (`Omit<Product, "id">`) or `UpdateProduct` directly from one canonical interface.'],
        ['`keyof T` & Indexed access (`T[K]`)', 'Lets helper functions (`groupBy(items, key)`) ensure keys actually exist and know the exact property type returned.']
      ],
      why: "Generics let you write one reusable function, hook or component that stays fully typed. Utility types let you derive types instead of copying them, which keeps the frontend in step with the API.",
      points: [
        "A **generic** is a type parameter like `function first<T>(items: T[]): T | undefined`. The caller's concrete type carries straight through.",
        "Add constraints with `extends`: `<T extends { id: number }>` accepts any type that includes a numeric `id`.",
        "`keyof T` gives a union of `T`'s property names, and `T[K]` looks up the type at property `K`.",
        "Utility types derive shapes from existing ones: `Partial<T>`, `Required<T>`, `Pick<T, K>`, `Omit<T, K>`, `Record<K, V>`, `ReturnType<F>`, and `Awaited<T>`.",
        "Generic components like `function List<T>({ items, render }: ListProps<T>)` work with any item shape.",
        "Derive types instead of copying them: `type CreateProduct = Omit<Product, 'id'>` never drifts out of sync with `Product`."
      ],
      code: `
import type { ReactNode } from "react";

interface Product { id: number; name: string; price: number; category: string }

type CreateProduct = Omit<Product, "id">;            // no id yet
type ProductPatch = Partial<CreateProduct>;          // all optional
type ProductSummary = Pick<Product, "id" | "name">;

// Generic function with a constraint
function byId<T extends { id: number }>(items: T[], id: number): T | undefined {
  return items.find(i => i.id === id);
}

// keyof + indexed access: the column must exist, and the result is typed
function pluck<T, K extends keyof T>(items: T[], key: K): T[K][] {
  return items.map(i => i[key]);
}
const names = pluck([] as Product[], "name");        // string[]
// pluck([] as Product[], "colour");                 // compile error

// Typed fetch helper. The <T> is a promise, not a check.
async function getJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error("HTTP " + res.status);
  return res.json() as Promise<T>;
}
const products = await getJson<Product[]>("/api/products");

// Generic component
interface ListProps<T> { items: T[]; render: (item: T) => ReactNode; keyOf: (item: T) => string | number }
export function List<T>({ items, render, keyOf }: ListProps<T>) {
  return <ul>{items.map(i => <li key={keyOf(i)}>{render(i)}</li>)}</ul>;
}
`,
      practice: "In the playground, write `groupBy<T, K extends keyof T>(items: T[], key: K)` that returns a `Map<T[K], T[]>`. Then write the signature of a generic `useLocalStorage<T>(key, initial)` hook and say what `T` is at two different call sites.",
      teach: "Explain what the `<T>` in `function first<T>(items: T[]): T` means and why it's better than `any`.",
      analogy: "A generic is a labelled envelope: 'whatever goes in comes out the same'. `any` is an unlabelled envelope: you put a cheque in, and the recipient may treat it as a shopping list.",
      pitfalls: [
        "Adding a type parameter you only use once. A generic earns its keep by connecting two things, like an input and its return value.",
        "Hand-writing near-identical types instead of deriving them with `Pick`, `Omit`, or `Partial`.",
        "Thinking `getJson<Product[]>` validates the API payload. It's only a type assertion, so parse untrusted responses at runtime with Zod."
      ],
      quiz: [
        { id: 'omit-product-id', q: "What is `Omit<Product, 'id'>`?", a: ["Product with only `id`", "Product without the `id` property", "Product with `id` made optional", "A function that deletes `id` at runtime"], c: 1, why: "`Omit` builds a type without the named keys. Types don't exist at runtime, so nothing changes on real objects." },
        { id: 'extends-keyof', q: "In `<T, K extends keyof T>`, what may `K` be?", a: ["Any string", "Only a property name of `T`", "Any type", "The type of one of T's values"], c: 1, why: "`keyof T` is the union of `T`'s keys, and `K` has to belong to it." },
        { id: 'what-does-partial-t', q: "What does `Partial<T>` do?", a: ["Makes every property optional", "Makes every property required", "Makes every property nullable", "Makes `T` readonly"], c: 0, why: "Each property gains `?`, which fits patch or update payloads." }
      ]
    },
    // ---------------- Advanced ----------------
    {
      id: 'hooks', title: 'Custom hooks, context and reducers', level: 2, mins: 40,
      splits: [["1 · useDebounced Hook","import { createContext"],["2 · Typed cartReducer","// Reducer with typed actions"],["3 · CartContext & Provider","// Context + provider"]],
      predict: {
        prompt: "Components `<Header />` and `<Sidebar />` both call `useDebounced(query, 300)` from the same module. When `<Header />` updates its input, what happens to `<Sidebar />`'s debounced state?",
        options: [
          "`<Sidebar />` updates too because both call the same custom hook",
          "`<Sidebar />` is unaffected because each component call site gets its own independent hook state",
          "React throws an error for calling a custom hook in two components",
        ],
        answer: 1,
        explain: "Custom hooks share stateful *logic*, not state itself. Each call to `useDebounced()` registers separate `useState` and `useEffect` slots on that component's own Fiber.",
      },
      terms: [
        ['Custom hook (`useX`)', 'A plain TypeScript function extracting stateful hook logic so components reuse behavior without adding extra DOM wrappers.'],
        ['`useReducer`', 'Groups complex state transitions into one `switch (action.type)` function outside your JSX component.'],
        ['Context (`createContext`)', 'Passes shared theme or auth data down a deep component tree without threading props through every layer.']
      ],
      why: "As apps grow, you need ways to share logic without copy-pasting and pass data deep without ten levels of props. React gives you custom hooks, context, and reducers for this.",
      points: [
        "A **custom hook** is any `useX` function that calls built-in hooks. It reuses **logic**, not state, so each component gets its own independent state.",
        "Call hooks only at the top level of a component or custom hook, never inside `if` blocks or loops. React needs the same call order on every render.",
        "**Context** hands data down the tree without prop drilling, great for low-churn values like theme, user, or locale. React 19 lets you render `<MyContext value={…}>` directly.",
        "Every context consumer re-renders when the value changes, so keep that value stable (`useMemo` if needed) and split unrelated data into separate contexts.",
        "`useReducer` moves multi-step updates into one `(state, action) => newState` function. Writing actions as a discriminated union turns typos into compile errors.",
        "`useRef` keeps a mutable `.current` box without triggering re-renders, useful for DOM elements, timer IDs, or previous values."
      ],
      code: `
import { createContext, useContext, useEffect, useMemo, useReducer, useState, type Dispatch, type ReactNode } from "react";

// Custom hook: reusable logic
export function useDebounced<T>(value: T, ms = 300): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), ms);
    return () => clearTimeout(t);
  }, [value, ms]);
  return debounced;
}

// Reducer with typed actions
interface CartItem { id: number; qty: number }
type Action =
  | { type: "add"; id: number }
  | { type: "remove"; id: number }
  | { type: "clear" };

function cartReducer(state: CartItem[], action: Action): CartItem[] {
  switch (action.type) {
    case "add": {
      const found = state.some(i => i.id === action.id);
      return found
        ? state.map(i => i.id === action.id ? { ...i, qty: i.qty + 1 } : i)
        : [...state, { id: action.id, qty: 1 }];
    }
    case "remove": return state.filter(i => i.id !== action.id);
    case "clear": return [];
  }
}

// Context + provider + safe accessor
interface CartContextValue { items: CartItem[]; dispatch: Dispatch<Action> }
const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, dispatch] = useReducer(cartReducer, []);
  const value = useMemo(() => ({ items, dispatch }), [items]);   // same object until items change
  return <CartContext value={value}>{children}</CartContext>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
`,
      practice: "Extract your product-fetching logic into `useProducts(search)` with a debounced search. Add a cart using the reducer and context above, and show the item count in a header component that receives no props.",
      teach: "Explain why two components calling the same custom hook don't share state.",
      analogy: "A custom hook is a recipe, not a meal: two people following the same recipe each end up with their own plate.",
      pitfalls: [
        "Expecting a custom hook to act as a shared store.",
        "Putting fast-changing state in one big context and re-rendering the whole tree.",
        "Passing a new `{ … }` object as the context value on every render, so every consumer re-renders every time.",
        "Calling a hook inside an `if`, which breaks the call order."
      ],
      quiz: [
        { id: 'two-components-both-call', q: "Two components both call `useCounter()`. They…", a: ["share one counter", "each get independent state", "throw an error", "share until one unmounts"], c: 1, why: "Custom hooks reuse logic, while each caller owns its own state." },
        { id: 'hooks-called-inside-conditions', q: "Why must hooks not be called inside conditions?", a: ["It's slower", "React identifies hooks by call order, which must match on every render", "TypeScript forbids it", "The hook would run twice"], c: 1, why: "React matches hook state by call index, so skipping one hook shifts every call after it." },
        { id: 'changing-useref-value-current', q: "Changing a `useRef` value's `.current`…", a: ["re-renders the component", "doesn't trigger a re-render", "throws in Strict Mode", "resets the component's state"], c: 1, why: "Refs are mutable boxes outside the render cycle." }
      ]
    },
    {
      id: 'perf', title: 'Rendering performance', level: 2, mins: 35, viz: 'rerender',
      predict: {
        prompt: "Without React Compiler, `<ProductRow>` is wrapped in `memo`, and `<Catalog>` renders `<ProductRow key={r.id} row={r} onSelect={(id) => setSelected(id)} />`. When the user types in the search box, do unchanged rows skip re-rendering?",
        options: [
          "Yes, because `r` is the same object and `memo` ignores function props",
          "No, because `(id) => setSelected(id)` creates a new function reference on every `<Catalog>` render",
          "Only the first row re-renders",
        ],
        answer: 1,
        explain: "`memo` compares every prop with `Object.is`. An inline arrow function produces a brand-new reference on each parent render (`prevOnSelect !== nextOnSelect`), defeating `memo` unless stabilized with `useCallback` (or React Compiler).",
      },
      terms: [
        ['`React.memo`', 'Skips re-rendering a child when props match shallowly via `Object.is`. Fresh inline objects or callbacks defeat it unless stabilized.'],
        ['`useCallback` & `useMemo`', 'Keeps object or function references stable across renders, worth adding only when profiling proves a slow child or calculation needs it.'],
        ['`useTransition` / state colocation', 'Pushes fast-changing state down to the child that needs it and marks heavy filter updates non-urgent so typing stays smooth.']
      ],
      why: "React is already quick by default, and premature optimization clutters code without making screens faster. Measure with a profiler first, then fix the actual bottleneck.",
      points: [
        "A **render** runs your component function, while a **commit** updates the DOM. Renders are usually cheap unless a component does heavy work or runs too often.",
        "**Measure first** with the React DevTools Profiler to see which components render, why they triggered, and how long they took.",
        "The **React Compiler** memoizes components, values, and callbacks at build time. When enabled, you rarely write `memo` or `useCallback` by hand, provided your renders stay pure.",
        "Structural fixes cost nothing. Move state **down** to the child that needs it, or pass slow subtrees as `children` so parent updates skip them.",
        "When you don't use the compiler, wrap hot children in `memo` and stabilize props with `useCallback` or `useMemo`. Creating a new inline function or object each render breaks `memo` without warning.",
        "For long lists, **virtualize** rows so only visible items mount in the DOM. Split big routes with `lazy` and `Suspense`."
      ],
      code: `
// With the React Compiler (vite.config.ts):
//   react({ babel: { plugins: ["babel-plugin-react-compiler"] } })
// you would write this component WITHOUT memo, useMemo or useCallback,
// and the compiler would add the equivalent for you. By hand, it looks like this:
import { memo, useCallback, useMemo, useState } from "react";

interface Row { id: number; name: string; price: number }

const ProductRow = memo(function ProductRow({ row, onSelect }: { row: Row; onSelect: (id: number) => void }) {
  return (
    <li>
      <button type="button" onClick={() => onSelect(row.id)}>{row.name} — {row.price}</button>
    </li>
  );
});

export function Catalog({ rows }: { rows: Row[] }) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<number | null>(null);

  // Recomputed only when rows or query change
  const visible = useMemo(
    () => rows.filter(r => r.name.toLowerCase().includes(query.toLowerCase())),
    [rows, query]);

  // Stable identity, so memo(ProductRow) can actually skip
  const onSelect = useCallback((id: number) => setSelected(id), []);

  return (
    <>
      <label>Search <input value={query} onChange={e => setQuery(e.target.value)} /></label>
      <p>Selected: {selected ?? "none"}</p>
      <ul>{visible.map(r => <ProductRow key={r.id} row={r} onSelect={onSelect} />)}</ul>
    </>
  );
}
`,
      practice: "Render 5,000 rows with a search box and record typing in the Profiler. Add `memo` plus stable callbacks, then row virtualization, noting renders per keystroke each time. Finally remove manual hooks, enable React Compiler, and measure again.",
      teach: "Explain why wrapping a component in `memo` can have zero effect on render count.",
      analogy: "`memo` works like a guard asking if your delivery changed since last time. If you hand over a brand-new box every render, the guard says yes even when the contents match. `useCallback` and `useMemo` reuse the same box, and React Compiler automates that.",
      pitfalls: [
        "Wrapping everything in `useMemo`/`useCallback` without measuring.",
        "`memo` defeated by inline `{}` / `[]` / `() => {}` props.",
        "Optimizing renders when the real cost is a 2 MB bundle or a slow API.",
        "Code that mutates during render, which the React Compiler can't safely memoize."
      ],
      quiz: [
        { id: 'memoized-child-receives-onclick', q: "A memoized child receives `onClick={() => select(id)}` from its parent, with no React Compiler. Does `memo` skip re-renders?", a: ["Yes", "No: a new function is created each render, so the props differ", "Only in production", "Only for the first child"], c: 1, why: "Shallow comparison sees a different function reference every time." },
        { id: 'react-compiler-enabled-still', q: "The React Compiler is enabled. Do you still need `useCallback` around event handlers?", a: ["Yes, everywhere", "Usually not: the compiler memoizes them automatically", "Only for handlers that call `setState`", "Only inside class components"], c: 1, why: "The compiler adds the memoization at build time, as long as the code follows the rules of React." },
        { id: 'first-step-react-screen', q: "First step when a React screen feels slow?", a: ["Wrap everything in `useMemo`", "Profile to see what renders and how long it takes", "Move all state into context", "Replace `useState` with `useReducer`"], c: 1, why: "Without measuring you can't know which component or operation is the cost." },
        { id: 'fix-list-20-000', q: "Best fix for a list of 20,000 rows?", a: ["`memo` on each row", "Virtualization: render only the visible rows", "`useCallback` for every handler", "Using the index as `key`"], c: 1, why: "Not creating 20,000 DOM nodes beats making their re-renders cheaper." }
      ]
    },
    {
      id: 'server', title: 'Server state, routing and talking to your API', level: 2, mins: 45,
      splits: [['1 · ApiError & api() helper', 'import { useState }'], ['2 · ProductsPage Query & Mutation', 'export function ProductsPage()']],
      terms: [
        ['Server state vs Client state', 'Backend data is asynchronous, shared across users, and cacheable. Keeping it in TanStack Query removes stale local copies.'],
        ['`useQuery` & `invalidateQueries`', '`useQuery` caches data by `queryKey`. After `useMutation` saves changes, invalidation refreshes matching screens automatically.'],
        ['`ProblemDetails` field error map', 'Maps ASP.NET Core `400` validation JSON (`errors.Name[0]`) directly to accessible form errors linked via `aria-describedby`.']
      ],
      why: "Here the whole stack comes together: React talking to an ASP.NET Core endpoint backed by SQL. Getting caching, validation errors, auth, and shared types right matters in every real app.",
      points: [
        "**Server state** lives on the backend, unlike local **client state**. It loads asynchronously, changes behind your back, and can go stale.",
        "TanStack Query adds caching, deduplication, retries, and loading states so you don't hand-roll fetches in `useEffect`. Wrap your app once in `<QueryClientProvider>`.",
        "**Queries** read and cache by key, while **mutations** save writes and then **invalidate** matching queries so lists refresh.",
        "Map ASP.NET's `ProblemDetails` straight into the UI: show `title` for general failures and `errors` next to matching form inputs.",
        "A **router** like React Router or TanStack Router links URLs to views. Keep shareable state like page number, filters, and selected IDs in the URL.",
        "Share your API contract by generating TypeScript types from **OpenAPI** rather than retyping C# DTOs manually.",
        "For SPA auth, favor `HttpOnly`, `Secure`, `SameSite` cookies via a BFF over tokens in `localStorage`. Since browsers send cookies automatically, protect writes against CSRF using antiforgery tokens or a custom header."
      ],
      code: `
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface Product { id: number; name: string; price: number }
type CreateProduct = Omit<Product, "id">;

// An error that keeps ASP.NET's ProblemDetails field errors
export class ApiError extends Error {
  status: number;
  fieldErrors: Record<string, string[]>;
  constructor(message: string, status: number, fieldErrors: Record<string, string[]> = {}) {
    super(message);
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

async function api<T>(url: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);                  // keeps any headers the caller passed
  if (init.body) headers.set("Content-Type", "application/json");   // only when sending JSON
  const res = await fetch(url, { ...init, headers, credentials: "include" });
  if (!res.ok) {
    const problem = await res.json().catch(() => null);      // ASP.NET ProblemDetails
    throw new ApiError(problem?.title ?? "HTTP " + res.status, res.status, problem?.errors);
  }
  return (res.status === 204 ? undefined : await res.json()) as T;
}

export function ProductsPage() {
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

  const { data, isPending, error } = useQuery({
    queryKey: ["products"],
    queryFn: () => api<Product[]>("/api/products"),
    staleTime: 30_000,
  });

  const create = useMutation({
    mutationFn: (p: CreateProduct) => api<Product>("/api/products", { method: "POST", body: JSON.stringify(p) }),
    onSuccess: () => {
      setName(""); setPrice("");
      return queryClient.invalidateQueries({ queryKey: ["products"] });   // refetch the list
    },
  });

  const fieldErrors = create.error instanceof ApiError ? create.error.fieldErrors : {};
  const priceError = fieldErrors.Price?.[0];
  const nameError = fieldErrors.Name?.[0];

  if (isPending) return <p>Loading…</p>;
  if (error) return <p role="alert">{error.message}</p>;

  return (
    <>
      <ul>{data.map(p => <li key={p.id}>{p.name}</li>)}</ul>

      <form onSubmit={e => { e.preventDefault(); create.mutate({ name, price: Number(price) }); }}>
        <label htmlFor="new-name">Name</label>
        <input id="new-name" value={name} onChange={e => setName(e.target.value)}
               aria-invalid={!!nameError} aria-describedby={nameError ? "new-name-error" : undefined} />
        {nameError && <p id="new-name-error" role="alert">{nameError}</p>}

        <label htmlFor="new-price">Price</label>
        <input id="new-price" value={price} onChange={e => setPrice(e.target.value)} inputMode="decimal"
               aria-invalid={!!priceError} aria-describedby={priceError ? "new-price-error" : undefined} />
        {priceError && <p id="new-price-error" role="alert">{priceError}</p>}

        <button type="submit" disabled={create.isPending}>Add</button>
        {create.error && !nameError && !priceError && <p role="alert">{create.error.message}</p>}
      </form>
    </>
  );
}
`,
      practice: "Connect your React app to your ASP.NET Core API with TanStack Query: list, create, delete. Send an invalid product and check that the server's validation message appears next to the right field. Generate the TypeScript types from the API's OpenAPI document and delete your hand-written copies.",
      teach: "Explain the difference between server state and client state, and what 'invalidating a query' does.",
      analogy: "Server state is like a library book. You hold a copy, yet the library owns the master edition someone else could update. Your query cache is a shelf of borrowed copies stamped with an expiry date. Invalidating tells the library you filed a change and need the new print.",
      pitfalls: [
        "Copying fetched data into `useState` and leaving yourself with a stale second copy.",
        "Saving access tokens in `localStorage`, where any XSS script can steal them.",
        "Attaching `Content-Type: application/json` to GET requests, triggering unnecessary CORS preflights.",
        "Spreading caller options after default `headers`, causing custom headers to accidentally overwrite `Content-Type`.",
        "Updating TypeScript DTOs by hand alongside C# classes until they drift apart."
      ],
      quiz: [
        { id: 'successful-create-product-mutati', q: "After a successful 'create product' mutation, how should the product list update?", a: ["It updates by itself", "Invalidate the list query so it refetches", "Reload the page", "`push` the new item into the cached array"], c: 1, why: "Invalidation marks the cached data stale and refetches it from the source of truth. Mutating the cache in place bypasses change detection." },
        { id: 'belongs-url-than-component', q: "Which belongs in the URL rather than in component state?", a: ["Whether a dropdown is open", "The current page number and filters of a list", "A half-typed input", "Hover state"], c: 1, why: "Shareable, bookmarkable view state should survive a reload and be linkable." },
        { id: 'spa-signs-httponly-cookie', q: "Your SPA signs in with an `HttpOnly` cookie. What else do writes need?", a: ["Nothing: `HttpOnly` blocks every attack", "CSRF protection, such as an antiforgery token or a required custom header", "A token in `localStorage` as well", "`credentials: \"omit\"` on every request"], c: 1, why: "The browser sends cookies with every request to your API, including requests triggered by another site. That's what CSRF protection guards against." },
        { id: 'robust-way-keep-typescript', q: "Most robust way to keep TypeScript types in step with a C# API?", a: ["Copy them by hand", "Generate them from the API's OpenAPI document", "Use `any` for API responses", "Share a `.d.ts` file in Slack"], c: 1, why: "Generated types change when the API changes, and fail the build when the frontend is out of date." }
      ]
    },
    // ---------------- Expert ----------------
    {
      id: 'tsadv', title: 'Advanced types: conditional, mapped and inferred', level: 3, mins: 45,
      terms: [
        ['Conditional type (`T extends U ? X : Y`)', 'Picks a result type based on an input type, the way `Awaited<T>` and `ReturnType<F>` work under the hood.'],
        ['Mapped type (`{ [K in keyof T]: ... }`)', 'Transforms each property in an interface systematically, useful for typed form error dictionaries.'],
        ['`infer` & Template literals', 'Pulls out inner types with `infer R` and validates string patterns like `\`/api/${string}\`` at compile time.']
      ],
      why: "TypeScript's type system acts like a small compile-time language. Used wisely, it blocks whole bugs before you run anything. Overdone, it leaves code your teammates can't read or maintain.",
      points: [
        "**Conditional types** branch on shape (`T extends U ? X : Y`). Applied to a union, they distribute across every member automatically.",
        "`infer` grabs a nested type inside a condition, like `T extends Promise<infer R> ? R : T` (which powers built-in `Awaited<T>`).",
        "**Mapped types** walk every property (`{ [K in keyof T]: … }`), adding `readonly`, toggling `?`, or renaming keys with `as`.",
        "**Template literal types** assemble string types using backticks, letting you derive event names or route patterns from existing keys.",
        "`never` holds zero values. Assigning a variable to `never` in a `default` branch enables **exhaustiveness checks**, breaking builds if a new union option isn't handled.",
        "`satisfies` validates a literal against a type **without widening** it, while `as const` freezes literal values. Favor both over `as` casts."
      ],
      code: `
// infer: unwrap a Promise (TypeScript ships this as Awaited<T>)
type UnwrapPromise<T> = T extends Promise<infer R> ? UnwrapPromise<R> : T;
type A = UnwrapPromise<Promise<Promise<number>>>;    // number

// Mapped type with key remapping + a template literal type
type Getters<T> = {
  [K in keyof T as \`get\${Capitalize<string & K>}\`]: () => T[K];
};
type UserGetters = Getters<{ name: string; age: number }>;
// { getName: () => string; getAge: () => number }

// Distributive conditional type
type NonNullish<T> = T extends null | undefined ? never : T;
type B = NonNullish<string | null | undefined>;      // string

// Exhaustiveness checking with never
type Shape =
  | { kind: "circle"; r: number }
  | { kind: "rect"; w: number; h: number };

function area(s: Shape): number {
  switch (s.kind) {
    case "circle": return Math.PI * s.r ** 2;
    case "rect": return s.w * s.h;
    default: { const unreachable: never = s; return unreachable; }
  }
}

// satisfies: checked, but the literal types are kept
const routes = {
  home: "/",
  product: "/products/:id",
} satisfies Record<string, string>;
type RouteName = keyof typeof routes;                // "home" | "product"
`,
      practice: "Write `DeepReadonly<T>`, plus `PathParams<'/users/:id/posts/:postId'>` producing `{ id: string, postId: string }`. Then explain in one paragraph whether you'd merge `PathParams` into a team repo and why.",
      teach: "Explain how assigning to a `never` variable in `default` catches missed union cases at build time.",
      analogy: "Basic types are labels stuck on boxes. Advanced types are label-printing machines that read one type and stamp out another. `never` is a slot nothing fits through, so anything left unhandled trips the compiler.",
      pitfalls: [
        "Writing clever type puzzles nobody else on the team can debug. Clear code beats clever types.",
        "Slapping `as` casts onto real compiler warnings instead of fixing the bug.",
        "Forgetting conditional types distribute across unions and getting unexpected union results.",
        "Rebuilding built-in helpers like `Awaited`, `NonNullable`, or `ReturnType`."
      ],
      quiz: [
        { id: 'extends-promise-infer-promise', q: "What is `T extends Promise<infer R> ? R : T` for `T = Promise<string>`?", a: ["`Promise<string>`", "`string`", "`never`", "`unknown`"], c: 1, why: "`infer R` captures the resolved value type inside the promise." },
        { id: 'satisfies-type-annotation-doesn', q: "What does `satisfies` do that a type annotation doesn't?", a: ["Checks the value at runtime", "Checks compatibility while keeping the value's narrower inferred type", "Makes the value mutable", "Turns off checking for that value"], c: 1, why: "Regular annotations widen types, whereas `satisfies` checks the shape and preserves literal types." },
        { id: 'new-member-added-union', q: "A new member is added to a union handled by a `switch` with `const x: never = value` in `default`. Result?", a: ["A silent bug at runtime", "A compile error until the new case is handled", "Nothing", "The new case falls through to the first case"], c: 1, why: "The missing branch isn't assignable to `never`, so the build breaks right where you forgot it." }
      ]
    },
    {
      id: 'internals', title: 'React internals: reconciliation and concurrency', level: 3, mins: 45,
      predict: {
        prompt: "A parent renders `{isAdmin ? <EditForm user={admin} /> : <EditForm user={guest} />}` with no `key` prop. When `isAdmin` flips from `true` to `false`, what happens to draft text stored in `EditForm`'s `useState`?",
        options: [
          "It resets to empty because it is in a different ternary branch",
          "It stays intact with the admin's old draft because the same component type sits in the same tree position",
          "React throws a reconciliation warning",
        ],
        answer: 1,
        explain: "React reconciles by tree position, element type, and `key`—not by which branch of `?:` returned the JSX. Same slot + same `EditForm` type means React keeps the existing Fiber state unless you pass `key={user.id}`.",
      },
      terms: [
        ['Fiber tree (work unit)', "React's internal linked tree storing component state and hooks so renders can pause, resume, or abort low-priority work."],
        ['Reconciliation (render vs commit)', 'Render computes the next UI diff in JavaScript. Commit applies the minimal DOM updates in one pass so screens never tear.'],
        ['`StrictMode` double invocation', 'Development-only check running renders and effects twice to expose side effects during render or missing cleanups early.']
      ],
      why: "Lost state, double-running effects, and input lag look random until you understand how React schedules work. A handful of internal rules explains all of it.",
      points: [
        "Rendering builds a tree of plain **element** objects. **Reconciliation** diffs that against the previous tree to pick the smallest set of DOM edits.",
        "Two core rules apply: swapping **element types** at the same slot tears down the subtree, and **keys** match siblings across moves. State follows position + type + key.",
        "Giving a component a new `key` intentionally **resets its state**, which is handy on purpose and sneaky by accident.",
        "**Fiber** breaks rendering into units React can pause, resume, or drop. The **render phase** stays pure and interruptible, while the **commit phase** updates the DOM atomically.",
        "`useTransition` and `useDeferredValue` mark updates non-urgent so typing stays fast. `Suspense` wraps loading fallbacks, and `use(promise)` reads async data inside them.",
        "In development, Strict Mode double-runs renders and remounts effects to catch impure code. Server Components execute only on the server and ship zero component JS to the browser."
      ],
      code: `
import { Suspense, lazy, useDeferredValue, useState, useTransition } from "react";

const Chart = lazy(() => import("./Chart"));      // code-split, loaded on demand

export function Search({ items }: { items: string[] }) {
  const [text, setText] = useState("");
  const deferred = useDeferredValue(text);        // lags behind during heavy renders
  const [tab, setTab] = useState("list");
  const [isPending, startTransition] = useTransition();

  const results = items.filter(i => i.includes(deferred));   // expensive for big lists

  return (
    <>
      {/* Urgent: the input updates immediately */}
      <label>Search <input value={text} onChange={e => setText(e.target.value)} /></label>

      {/* Non-urgent: can be interrupted by typing */}
      <button type="button" onClick={() => startTransition(() => setTab("chart"))}>
        {isPending ? "Loading…" : "Show chart"}
      </button>

      {tab === "chart"
        ? <Suspense fallback={<p>Loading chart…</p>}><Chart data={results} /></Suspense>
        : <ul style={{ opacity: text !== deferred ? 0.5 : 1 }}>
            {results.map(r => <li key={r}>{r}</li>)}
          </ul>}

      {/* key resets state: a new product gets a fresh form */}
      {/* <EditForm key={product.id} product={product} /> */}
    </>
  );
}
`,
      practice: "Build a tab component that renders `<Counter />` in two branches at the same position, and watch the state survive the switch. Then give each a different `key` and explain the change in terms of reconciliation.",
      teach: "Explain why changing a component's `key` resets its state.",
      analogy: "Reconciliation is a theatre usher comparing tonight's seating plan with last night's. Same seat, same kind of guest: keep them and update their ticket. A different kind of guest in the seat: clear it entirely. A `key` is a name badge, so the usher can follow a guest who moved seats instead of treating them as a stranger.",
      pitfalls: [
        "Defining a component inside another component: it's a new type every render, so its state resets constantly.",
        "Side effects in the render phase, which may run more than once.",
        "Treating Strict Mode's double run as a bug and switching it off."
      ],
      quiz: [
        { id: 'same-position-div-replaced', q: "At the same position, a `<div>` is replaced by a `<section>` with identical children. React will…", a: ["change the tag in place", "destroy the old subtree and build a new one, losing child state", "ignore the change", "throw an error"], c: 1, why: "A different element type signals a new tree, so React tears down the old subtree instead of reusing it." },
        { id: 'usetransition-let', q: "What does `useTransition` let you do?", a: ["Animate CSS", "Mark a state update as non-urgent so urgent updates can interrupt it", "Fetch data in the background", "Skip rendering a component"], c: 1, why: "Transitions keep typing and clicks smooth while heavy updates prepare in the background." },
        { id: 'strict-mode-run-effects', q: "Why does Strict Mode run effects twice in development?", a: ["It's a bug in development builds", "To reveal effects that lack proper cleanup", "To load data twice for speed", "Because Strict Mode also renders on the server"], c: 1, why: "Running mount, unmount, and mount again tests cleanup logic early." }
      ]
    },
    {
      id: 'arch', title: 'Frontend architecture, testing and accessibility', level: 3, mins: 45,
      splits: [["1 · MSW Server Setup","// ProductsPage is the component"],["2 · Query Helper & User Test","// The same provider"]],
      terms: [
        ['Query-level test (`render` + `userEvent`)', "Tests components from the user's side via roles and labels (`getByRole(\"button\")`) rather than reading internal component state."],
        ['API mocking (`MSW`)', 'Intercepts `fetch` at the network boundary so tests run real serialization, validation, and HTTP error paths.'],
        ['Core a11y gates (`axe-core`)', 'Checks semantic landmarks, keyboard navigation, form labels, and `role="alert"` error messages automatically per feature.']
      ],
      why: "A solid frontend lets a team refactor confidently for years while staying usable for everyone. That calls for clear boundaries, tests that survive rewrites, and baked-in accessibility.",
      points: [
        "Sort state before picking libraries: **server state** in a query cache, **URL state** in the router, and **local UI state** in `useState`. Put fast-changing shared client state in Zustand or context.",
        "Group files by **feature** (`features/cart/…`) instead of file type, keep shared UI separate, and lock those boundaries with lint rules.",
        "Test **real user flows** with React Testing Library by querying roles and labels, clicking via `userEvent`, and mocking `fetch` at the network layer with MSW.",
        "Vitest needs the `jsdom` environment, `@testing-library/jest-dom/vitest` for matchers like `toBeInTheDocument`, and your real providers such as `QueryClientProvider`.",
        "Add a handful of **end-to-end** Playwright tests across key flows hitting the actual frontend, API, and database.",
        "Bake in **accessibility** from semantic HTML up: label every input, support full keyboard focus, keep contrast readable, and verify with a keyboard and screen reader.",
        "Watch Core Web Vitals (LCP, INP, CLS), split routes lazily, optimize images, and gate CI on bundle-size budgets."
      ],
      code: `
// ProductsPage is the component from the server-state lesson.
// vitest.config.ts: test: { environment: "jsdom" }
import "@testing-library/jest-dom/vitest";
import type { ReactNode } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { afterAll, afterEach, beforeAll, expect, test } from "vitest";
import { ProductsPage } from "./ProductsPage";

const server = setupServer(
  http.get("*/api/products", () => HttpResponse.json([{ id: 1, name: "Laptop", price: 1200 }])),
  http.post("*/api/products", () =>
    HttpResponse.json({ title: "One or more validation errors occurred.", errors: { Price: ["Must be positive"] } },
                      { status: 400 })),
);
beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// The same provider the app uses, with retries off so failures show at once
function renderWithQuery(ui: ReactNode) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } });
  return render(<QueryClientProvider client={client}>{ui}</QueryClientProvider>);
}

test("shows the server's validation error next to the price field", async () => {
  const user = userEvent.setup();
  renderWithQuery(<ProductsPage />);

  expect(await screen.findByText("Laptop")).toBeInTheDocument();

  await user.type(screen.getByLabelText("Name"), "Broken");
  await user.type(screen.getByLabelText("Price"), "-5");
  await user.click(screen.getByRole("button", { name: "Add" }));

  expect(await screen.findByRole("alert")).toHaveTextContent("Must be positive");
  expect(screen.getByLabelText("Price")).toHaveAccessibleDescription("Must be positive");
});
`,
      practice: "Write this test for your products page, then rename components or change internal state hooks without editing the test. If it breaks, it tested implementation details. Finish by navigating the whole page with only the keyboard.",
      teach: "Explain why role-and-label UI tests survive refactors better than tests reading internal state.",
      analogy: "A great UI test behaves like a mystery shopper. They walk in, buy an item like any customer, and report what broke without caring how you rearrange the stockroom.",
      pitfalls: [
        "Dumping API responses and form fields into one giant global store.",
        "Relying on brittle snapshot tests or internal hook assertions that snap on harmless refactors.",
        "Putting `onClick` on a `div` or `li` instead of a real `button`, breaking keyboard navigation and screen readers.",
        "Rendering components in tests without their required providers and chasing cryptic errors."
      ],
      quiz: [
        { id: 'data-fetched-api-belong', q: "Where does data fetched from the API belong?", a: ["A global Redux store, always", "A server-state cache such as TanStack Query", "`localStorage`", "A `useRef` in the root component"], c: 1, why: "Server data needs caching, staleness rules, and invalidation, which TanStack Query handles." },
        { id: 'query-getbyrole-button-name', q: "Why query by `getByRole('button', { name: 'Add' })` rather than by CSS class?", a: ["It's faster", "It tests what users and assistive technology perceive, and survives refactoring", "Classes don't exist in jsdom", "It needs no rendering"], c: 1, why: "Role and accessible name form the UI's real contract, whereas CSS classes are internal details." },
        { id: 'important-first-step-accessibili', q: "Most important first step for accessibility?", a: ["Add ARIA attributes to every element", "Use semantic HTML elements with proper labels", "Pick a high-contrast colour palette", "Install an accessibility overlay widget"], c: 1, why: "Semantic HTML gives keyboard focus and meaning out of the box. ARIA fills gaps, and overlay widgets never fix broken markup." }
      ]
    }
  ]
};

export default track;
