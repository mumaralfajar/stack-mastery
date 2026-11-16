TRACKS.push({
  id: 'react', name: 'TypeScript + React', lang: 'tsx',
  tagline: 'The frontend: modern JavaScript, the type system, components, state and architecture.',
  lessons: [
    // ---------------- Beginner ----------------
    {
      id: 'js', title: 'JavaScript essentials for TypeScript', level: 0, mins: 30,
      why: "TypeScript is JavaScript with types. Every React bug that confuses beginners — stale values, mutated arrays, `this`, `undefined` — is a JavaScript concept, not a React one.",
      points: [
        "`const` cannot be reassigned, `let` can. Default to `const`. Never use `var`.",
        "Functions are values. Arrow functions `(x) => x * 2` are the everyday form.",
        "Objects and arrays are **references**: `const b = a` shares the same array. Copy with spread: `[...a]`, `{ ...obj }`.",
        "Array methods return **new** arrays: `map` transforms, `filter` selects, `find` gets one, `reduce` folds. React code is built from these.",
        "Destructuring unpacks: `const { name, age } = user;` and `const [first, ...rest] = list;`.",
        "`===` compares strictly. `?.` and `??` handle `null`/`undefined` safely. Truthy/falsy: `0`, `''`, `null`, `undefined`, `NaN` are falsy."
      ],
      code: `
const prices = [5, 12, 8];
const doubled = prices.map(p => p * 2);          // [10, 24, 16] — new array
const big = prices.filter(p => p > 6);           // [12, 8]
const total = prices.reduce((sum, p) => sum + p, 0);

const user = { name: "Ana", address: { city: "Bandung" } };
const { name, address: { city } } = user;        // destructuring

// Immutable updates — the style React requires
const older = { ...user, age: 31 };              // copy + add
const added = [...prices, 20];                   // copy + append
const without = prices.filter(p => p !== 12);    // copy without

// Safe access
const zip = user.address?.zip ?? "unknown";

// Async
async function load(): Promise<void> {
  const res = await fetch("/api/products");
  const data = await res.json();
  console.log(data);
}
`,
      practice: "In the TypeScript playground: given an array of `{ name, price, inStock }`, produce the names of in-stock items under 100, sorted by price, without mutating the original. Then prove the original is unchanged.",
      teach: "Explain why `const b = a; b.push(1);` also changes `a`, and how to avoid it.",
      analogy: "`const` on an object is a dog on a fixed leash: the leash cannot be tied to a different dog, but the dog can still get muddy. Spread (`{ ...obj }`) is a photocopy you may scribble on without touching the original.",
      pitfalls: [
        "Believing `const` makes an object immutable. It only fixes the binding.",
        "Using `push`, `sort` or `splice` on state — they mutate in place.",
        "Confusing `map` (returns a new array) with `forEach` (returns nothing)."
      ],
      quiz: [
        { q: "What does `[1, 2, 3].map(n => n * 2)` return?", a: ["`undefined`", "`[2, 4, 6]`", "It changes the original array", "`6`"], c: 1, why: "`map` returns a new array of transformed elements and leaves the original alone." },
        { q: "`const a = { n: 1 }; const b = a; b.n = 2;` What is `a.n`?", a: ["1", "2", "undefined", "An error — `a` is const"], c: 1, why: "`a` and `b` reference the same object; `const` only prevents reassigning the variable." },
        { q: "What is `null ?? 'x'`?", a: ["`null`", "`'x'`", "`false`", "An error"], c: 1, why: "`??` returns the right side when the left is `null` or `undefined`." }
      ]
    },
    {
      id: 'ts', title: 'TypeScript: types that catch bugs', level: 0, mins: 35,
      why: "TypeScript moves a whole class of bugs from 'the user found it' to 'the editor underlined it'. It is also the shared contract between a React frontend and a C# backend.",
      points: [
        "Annotate where data enters: parameters, return types, API responses. Let inference do the rest.",
        "`interface` or `type` describes an object's shape. TypeScript is **structural**: if it has the right shape, it fits.",
        "**Union types** model 'one of': `string | number`, `'idle' | 'loading' | 'error'`.",
        "**Narrowing**: after `if (typeof x === 'string')` or `if (user)`, TypeScript knows the more specific type inside the block.",
        "Optional properties `age?: number` are `number | undefined`. With `strict` mode on, you must handle the `undefined`.",
        "Avoid `any` — it switches the checker off. Use `unknown` and narrow instead. Types vanish at run time: they do not validate data from the network."
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

// Discriminated union: impossible states cannot be represented
type Result<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };

function show(r: Result<Product>) {
  if (r.ok) console.log(r.data.name);     // data exists only when ok
  else console.log(r.error);
}
`,
      practice: "In the playground, define a `Todo` type and a function `toggle(todos: Todo[], id: number): Todo[]` that returns a new array. Then model a request state as a discriminated union with `idle`, `loading`, `success` and `error` and write a function that handles all four.",
      teach: "Explain what a union type is and how TypeScript 'narrows' it inside an `if`.",
      analogy: "Types are the shape-sorter toy: the square block only fits the square hole, and you find out the moment you try, not after the box is shipped. A union is a hole that accepts a square or a circle — and narrowing is checking which one you are holding before you use it.",
      pitfalls: [
        "Reaching for `any` when the checker complains. The complaint is usually a real bug.",
        "Believing TypeScript validates API data at run time. `as Product` is a promise, not a check.",
        "Over-annotating things the compiler already infers."
      ],
      quiz: [
        { q: "What does `type Size = 'S' | 'M' | 'L'` allow?", a: ["Any string", "Exactly one of those three strings", "An array of three strings", "A number from 1 to 3"], c: 1, why: "It is a union of string literal types." },
        { q: "TypeScript types at run time are…", a: ["enforced by the browser", "erased — they exist only at compile time", "converted to classes", "stored in JSON"], c: 1, why: "The compiler removes all types; the output is plain JavaScript." },
        { q: "Safer alternative to `any` for a value of unknown shape?", a: ["`object`", "`unknown`, then narrow", "`never`", "`void`"], c: 1, why: "`unknown` forces you to check the type before using the value." }
      ]
    },
    {
      id: 'components', title: 'React: components, JSX and props', level: 0, mins: 35,
      why: "React's whole idea is one sentence: the UI is a function of data. Once a student sees a component as a function that returns a description of the screen, everything else follows.",
      points: [
        "A **component** is a function that returns JSX. Its name starts with a capital letter.",
        "**JSX** is JavaScript that looks like HTML. Curly braces `{ }` embed any expression.",
        "**Props** are a component's inputs, passed like attributes. Props are read-only — a component never modifies its props.",
        "Render lists with `map` and give each item a stable, unique `key`.",
        "Conditional rendering uses ordinary JavaScript: `cond && <X />` or `cond ? <A /> : <B />`.",
        "Compose small components into larger ones; `children` lets a component wrap arbitrary content."
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
      <h3>{name}</h3>
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
      practice: "Create a project with `npm create vite@latest shop -- --template react-ts`. Build a `ProductList` that renders `ProductCard`s from an array, shows a message when the array is empty, and highlights items over 1000.",
      teach: "Explain what a React component is and what props are, to someone who knows HTML and basic JavaScript.",
      analogy: "A component is a rubber stamp with blanks: the design is fixed, and props fill in the blanks each time you stamp. The page is built by stamping small stamps inside bigger ones. A stamp does not change the ink it is handed — it only uses it.",
      pitfalls: [
        "Using the array index as `key` for lists that reorder or change.",
        "Trying to modify props inside the child.",
        "Rendering `0` on screen with `items.length && <List />`. Use `items.length > 0 &&`."
      ],
      quiz: [
        { q: "What is a React function component?", a: ["A class that extends HTMLElement", "A function that takes props and returns JSX", "A CSS file", "An HTML template string"], c: 1, why: "Components are plain functions describing UI for the given props." },
        { q: "Why does each list item need a `key`?", a: ["For CSS styling", "So React can match items between renders", "To sort the list", "TypeScript requires it"], c: 1, why: "Keys give elements a stable identity, so React updates, moves or removes the right ones." },
        { q: "Can a child component change the props it receives?", a: ["Yes, freely", "No — props are read-only; it asks the parent via a callback", "Only numbers", "Only in development"], c: 1, why: "Data flows down; changes are requested upward through functions passed as props." }
      ]
    },
    // ---------------- Intermediate ----------------
    {
      id: 'jsdeep', title: 'JavaScript in depth: closures, this and the event loop', level: 1, mins: 40, viz: 'eventloop', lang: 'ts',
      why: "These three ideas explain almost every 'weird' JavaScript behavior — stale values in React hooks, lost `this`, and code that runs in an unexpected order. They are also the most-asked JavaScript interview topics.",
      points: [
        "A **closure** is a function plus the variables it could see when it was created. Those variables stay alive as long as the function does. Every React hook and event handler relies on this.",
        "A **stale closure** is a function that still sees old variables — the cause of React effects and timers that read outdated state.",
        "`this` is decided by **how a function is called**, not where it is written: `obj.method()` sets `this` to `obj`; a detached call loses it. **Arrow functions** have no `this` of their own and use the surrounding one.",
        "JavaScript runs on **one thread** with an **event loop**: run the current synchronous code to completion, then drain **all microtasks** (promise callbacks, `await` continuations), then take **one task** (timers, events, I/O), then repeat.",
        "So a resolved promise's `.then` always runs before a `setTimeout(…, 0)`, and long synchronous work blocks rendering and input entirely.",
        "`Promise.all` runs promises concurrently and fails fast; `Promise.allSettled` waits for every result. Always handle rejection — an unhandled one is a silent bug."
      ],
      code: `
// Closure: the returned function remembers 'count'
function makeCounter() {
  let count = 0;
  return () => ++count;
}
const next = makeCounter();
next(); next();                          // 2 — count lives on, private to the closure

// this: decided by HOW a function is called
const user = {
  name: "Ana",
  hi() { return "Hi " + this.name; },
  later() { setTimeout(() => console.log(this.name), 0); }   // arrow: keeps the outer this
};
user.hi();                               // "Hi Ana"
const loose = user.hi;
// loose();                              // TypeError: this is undefined in strict mode

// Event loop: sync code first, then ALL microtasks, then one task
console.log("1 sync");
setTimeout(() => console.log("4 timeout"), 0);
Promise.resolve().then(() => console.log("3 microtask"));
console.log("2 sync");

// Concurrency with promises
async function loadDashboard() {
  const [users, orders] = await Promise.all([fetch("/api/users"), fetch("/api/orders")]);
  const results = await Promise.allSettled([users.json(), orders.json()]);
  return results.filter(r => r.status === "fulfilled");
}
`,
      practice: "Predict the output order of the event-loop example, then step through the visualization to check. In the TypeScript playground, write a `debounce(fn, ms)` function using a closure, and explain which variable the closure keeps alive.",
      teach: "Explain why `Promise.resolve().then(...)` runs before `setTimeout(..., 0)` even though both are 'asynchronous'.",
      analogy: "A closure is a backpack a function carries: whatever was in reach when it was created goes with it wherever it is called. The event loop is a single chef with two order rails: after finishing the dish in hand, they clear the entire 'urgent' rail (microtasks) before taking just one ticket from the normal rail (tasks) — and then check the urgent rail again.",
      pitfalls: [
        "Passing `obj.method` as a callback and losing `this`. Use an arrow function or `bind`.",
        "Assuming `setTimeout(fn, 0)` runs immediately. It runs after the current code and every pending microtask.",
        "A stale closure in a React effect or interval that reads state captured on the first render."
      ],
      quiz: [
        { q: "What is logged first: a `setTimeout(…, 0)` callback or a resolved promise's `.then` callback, both scheduled in the same synchronous code?", a: ["The timeout", "The promise callback", "Whichever was written first", "It is random"], c: 1, why: "All microtasks run before the event loop takes the next task." },
        { q: "What does a closure capture?", a: ["A copy of the values at creation time", "The variables themselves, which stay alive with the function", "Only global variables", "Nothing after the outer function returns"], c: 1, why: "The function keeps a live reference to its surrounding scope." },
        { q: "`const f = user.hi; f();` fails to read `this.name` because…", a: ["`hi` was deleted", "`this` depends on the call site, and `f()` has no object before the dot", "arrow functions cannot be assigned", "`name` is private"], c: 1, why: "Detaching a method loses its receiver; `this` is undefined in strict mode." }
      ]
    },
    {
      id: 'state', title: 'State and re-rendering', level: 1, mins: 40, viz: 'rerender',
      why: "State is the heart of React and the source of most confusion. 'Why did the screen not update?' and 'why is it rendering so often?' both come from the render model.",
      points: [
        "**State** is data a component remembers between renders: `const [count, setCount] = useState(0)`.",
        "Calling the setter schedules a **re-render**: React calls your function again and updates the DOM to match the new JSX.",
        "When a component re-renders, **all its children re-render** by default — whether or not their props changed.",
        "State is a **snapshot**: inside one render, `count` never changes. Use the updater form `setCount(c => c + 1)` when the next value depends on the previous one.",
        "**Never mutate state.** Create a new array or object so React sees a new reference: `setItems([...items, x])`.",
        "Do not store what you can compute. Derive values (totals, filtered lists) during render."
      ],
      code: `
import { useState } from "react";

interface Todo { id: number; text: string; done: boolean }

export function Todos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [text, setText] = useState("");

  const remaining = todos.filter(t => !t.done).length;      // derived, not state

  function add() {
    if (!text.trim()) return;
    setTodos(prev => [...prev, { id: Date.now(), text, done: false }]);   // new array
    setText("");
  }

  function toggle(id: number) {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  }

  return (
    <section>
      <input value={text} onChange={e => setText(e.target.value)} />
      <button onClick={add}>Add</button>
      <p>{remaining} remaining</p>
      <ul>
        {todos.map(t => (
          <li key={t.id} onClick={() => toggle(t.id)}
              style={{ textDecoration: t.done ? "line-through" : "none" }}>
            {t.text}
          </li>
        ))}
      </ul>
    </section>
  );
}
`,
      practice: "Build the todo component. Then break it on purpose: replace the `add` body with `todos.push(...)` followed by `setTodos(todos)`. Observe that nothing updates and explain why in terms of references.",
      teach: "Explain what happens, step by step, between clicking a button that calls `setCount(count + 1)` and the screen showing the new number.",
      analogy: "Each render is a photograph of the component at one moment. `count` inside that photo is frozen. Calling `setCount` does not edit the photo — it asks React to take a new one. Mutating state is drawing on the old photo with a marker: React compares the two prints, sees the same sheet of paper, and changes nothing.",
      pitfalls: [
        "Calling `setCount(count + 1)` three times and expecting +3. All three read the same snapshot.",
        "Mutating arrays or objects in state.",
        "Duplicating derived data in state and letting it drift out of sync."
      ],
      quiz: [
        { q: "`count` is 0. A handler runs `setCount(count + 1); setCount(count + 1);`. What is `count` on the next render?", a: ["0", "1", "2", "It throws"], c: 1, why: "Both calls compute 0 + 1 from the same snapshot. Use `setCount(c => c + 1)` to get 2." },
        { q: "A parent's state changes. Which components re-render by default?", a: ["Only the parent", "The parent and all its descendants", "The whole app", "None until props change"], c: 1, why: "Re-rendering a component re-renders its subtree unless something like `memo` skips it." },
        { q: "Why does `items.push(x); setItems(items);` not update the UI?", a: ["`push` is async", "The array reference is unchanged, so React sees no new state", "`setItems` needs `await`", "Arrays cannot be state"], c: 1, why: "React compares by reference; the same array object means 'nothing changed'." }
      ]
    },
    {
      id: 'effects', title: 'Effects and data fetching', level: 1, mins: 40,
      why: "`useEffect` is the most misused hook in React. Teaching what it is for — synchronizing with something outside React — and what it is not for prevents infinite loops, races and half the bugs in real apps.",
      points: [
        "Rendering must be **pure**: same props and state in, same JSX out, no side effects.",
        "`useEffect` runs **after** render to synchronize with the outside world: network, timers, subscriptions, the DOM.",
        "The **dependency array** says when to re-run: `[]` once after mount, `[id]` whenever `id` changes, omitted = after every render.",
        "Return a **cleanup function** to undo the effect: unsubscribe, clear the timer, abort the request.",
        "Fetching in an effect needs three states (loading, error, data) and protection against **race conditions** — abort or ignore stale responses.",
        "You often **do not need an effect**: derived values belong in render, and responses to user actions belong in event handlers."
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
      practice: "Build the component against your ASP.NET Core API. Click quickly between products with the network throttled; remove the cleanup and watch the wrong product appear. Restore it and explain the race.",
      teach: "Explain what the dependency array of `useEffect` does and what the cleanup function is for.",
      analogy: "An effect is a standing instruction to a stage hand: 'whenever the scene changes to scene N, set up the props for N — and before the next scene, clear the old ones away.' The dependency array is the list of things that count as a scene change.",
      pitfalls: [
        "Omitting a dependency and reading a stale value; or setting state that is itself a dependency and looping forever.",
        "Using an effect to compute something from props or state — compute it during render.",
        "No cleanup: out-of-order responses overwrite newer data."
      ],
      quiz: [
        { q: "`useEffect(() => { … }, [])` runs…", a: ["On every render", "Once after the first render (mount)", "Never", "Before the first render"], c: 1, why: "An empty dependency array means nothing can change to trigger a re-run." },
        { q: "What is the returned function from an effect for?", a: ["Returning data", "Cleanup before the next run and on unmount", "Error handling", "Memoization"], c: 1, why: "It undoes the effect: unsubscribe, clear timers, abort requests." },
        { q: "You need `fullName` from `first` and `last` props. Best approach?", a: ["`useEffect` that sets state", "Compute it during render: `const fullName = first + ' ' + last`", "A global variable", "`useRef`"], c: 1, why: "Derived values need no effect and no state — extra state means extra renders and bugs." }
      ]
    },
    {
      id: 'forms', title: 'Forms, lifting state and composition', level: 1, mins: 35,
      why: "Real interfaces are forms and lists that share data. Knowing where state should live — and how siblings communicate — is the difference between a tidy app and prop spaghetti.",
      points: [
        "A **controlled input** takes its `value` from state and reports changes through `onChange`: state is the single source of truth.",
        "When two components need the same data, **lift the state** to their closest common parent and pass it down.",
        "Children change parent state by calling **callbacks** passed as props: data down, events up.",
        "Keep state as **local as possible** and lift only when sharing is needed.",
        "Handle submit with `onSubmit` on the `<form>` and `event.preventDefault()`. Show validation errors next to the field.",
        "For big forms use a library (React Hook Form) with a schema validator (Zod) so the same rules validate and type the data."
      ],
      code: `
import { useState, type FormEvent } from "react";

interface NewProduct { name: string; price: number }

function ProductForm({ onAdd }: { onAdd: (p: NewProduct) => void }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [error, setError] = useState("");

  function submit(e: FormEvent) {
    e.preventDefault();
    const value = Number(price);
    if (!name.trim() || !(value > 0)) return setError("Name and a positive price are required");
    onAdd({ name: name.trim(), price: value });     // event goes UP
    setName(""); setPrice(""); setError("");
  }

  return (
    <form onSubmit={submit}>
      <label>Name <input value={name} onChange={e => setName(e.target.value)} /></label>
      <label>Price <input value={price} onChange={e => setPrice(e.target.value)} inputMode="decimal" /></label>
      {error && <p role="alert">{error}</p>}
      <button type="submit">Add</button>
    </form>
  );
}

export function Catalog() {
  const [products, setProducts] = useState<NewProduct[]>([]);   // state lives in the parent
  return (
    <>
      <ProductForm onAdd={p => setProducts(prev => [...prev, p])} />
      <p>{products.length} products, total {products.reduce((s, p) => s + p.price, 0)}</p>
    </>
  );
}
`,
      practice: "Add a search box component and a list component as siblings. Decide where the search text state must live, wire it up, and write one sentence justifying the location.",
      teach: "Explain 'lifting state up' with two sibling components that need to show the same data.",
      analogy: "Two children share one box of crayons. If each keeps a private box, their pictures never match. Give the box to the parent, who hands crayons down and takes requests — 'may I have blue?' — back up. One box, one truth.",
      pitfalls: [
        "Copying a prop into state and then wondering why it does not update.",
        "Lifting everything to the top 'just in case', causing whole-app re-renders.",
        "Uncontrolled and controlled inputs mixed, giving the 'changing an uncontrolled input' warning."
      ],
      quiz: [
        { q: "Two sibling components must show the same value. Where should the state live?", a: ["In both siblings", "In their closest common parent", "In a global variable", "In `localStorage`"], c: 1, why: "A single owner passes the value down to both; they stay in sync automatically." },
        { q: "How does a child update state owned by its parent?", a: ["Mutates the prop", "Calls a callback function passed as a prop", "Uses `document.querySelector`", "It cannot"], c: 1, why: "The parent passes a function; the child invokes it — events flow up." },
        { q: "A 'controlled' input is one whose…", a: ["value is driven by React state", "value lives only in the DOM", "type is `password`", "changes are disabled"], c: 0, why: "State is the source of truth; `onChange` updates state and state sets `value`." }
      ]
    },
    {
      id: 'generics', title: 'TypeScript generics and utility types', level: 1, mins: 35,
      why: "Generics are how you write one reusable function, hook or component that stays fully typed. Utility types are how you derive types instead of duplicating them — and keep the frontend in step with the API.",
      points: [
        "A **generic** is a type parameter: `function first<T>(items: T[]): T | undefined`. The caller's type flows through.",
        "Constrain with `extends`: `<T extends { id: number }>` means 'any type that has an id'.",
        "`keyof T` is the union of T's property names; `T[K]` is the type of property K.",
        "Utility types derive new shapes: `Partial<T>`, `Required<T>`, `Pick<T, K>`, `Omit<T, K>`, `Record<K, V>`, `ReturnType<F>`.",
        "Generic components: `function List<T>({ items, render }: ListProps<T>)` works for any item type.",
        "Derive, do not duplicate: `type CreateProduct = Omit<Product, 'id'>` cannot drift from `Product`."
      ],
      code: `
interface Product { id: number; name: string; price: number; category: string }

type CreateProduct = Omit<Product, "id">;            // no id yet
type ProductPatch = Partial<CreateProduct>;          // all optional
type ProductSummary = Pick<Product, "id" | "name">;

// Generic function with a constraint
function byId<T extends { id: number }>(items: T[], id: number): T | undefined {
  return items.find(i => i.id === id);
}

// keyof + indexed access: the column name must exist, the result is typed
function pluck<T, K extends keyof T>(items: T[], key: K): T[K][] {
  return items.map(i => i[key]);
}
const names = pluck([] as Product[], "name");        // string[]
// pluck([] as Product[], "colour");                 // compile error

// Typed fetch helper
async function getJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error("HTTP " + res.status);
  return res.json() as Promise<T>;
}
const products = await getJson<Product[]>("/api/products");

// Generic component
interface ListProps<T> { items: T[]; render: (item: T) => React.ReactNode; keyOf: (item: T) => string | number }
function List<T>({ items, render, keyOf }: ListProps<T>) {
  return <ul>{items.map(i => <li key={keyOf(i)}>{render(i)}</li>)}</ul>;
}
`,
      practice: "In the playground, write `groupBy<T, K extends keyof T>(items: T[], key: K)` that returns a `Map<T[K], T[]>`. Then write a generic `useLocalStorage<T>(key, initial)` hook signature and say what `T` is at two different call sites.",
      teach: "Explain what the `<T>` in `function first<T>(items: T[]): T` means and why it is better than using `any`.",
      analogy: "A generic is a labelled envelope: 'whatever goes in here comes out the same'. `any` is an unlabelled envelope — you can put a cheque in and the recipient may treat it as a shopping list. `Pick` and `Omit` are cookie cutters applied to an existing type instead of baking a new one from scratch.",
      pitfalls: [
        "Adding generics that are used only once — a type parameter should relate two things.",
        "Hand-writing near-copies of a type instead of deriving them.",
        "Believing `getJson<Product[]>` checks the response. It is an unchecked assertion; validate at the boundary if it matters."
      ],
      quiz: [
        { q: "What is `Omit<Product, 'id'>`?", a: ["Product with only `id`", "Product without the `id` property", "An array of products", "A runtime function"], c: 1, why: "`Omit` builds a type with the named keys removed." },
        { q: "In `<T, K extends keyof T>`, what may `K` be?", a: ["Any string", "Only a property name of `T`", "Any type", "A number"], c: 1, why: "`keyof T` is the union of T's keys, and K must be assignable to it." },
        { q: "What does `Partial<T>` do?", a: ["Makes every property optional", "Makes every property required", "Removes all properties", "Makes T readonly"], c: 0, why: "Each property gains `?` — handy for patch/update payloads." }
      ]
    },
    // ---------------- Advanced ----------------
    {
      id: 'hooks', title: 'Custom hooks, context and reducers', level: 2, mins: 40,
      why: "As apps grow, logic must be shared without copy-paste and data must reach deep components without threading props through ten layers. These three tools are React's answer.",
      points: [
        "A **custom hook** is a function named `useX` that calls other hooks. It shares **logic**, not state — each caller gets its own state.",
        "Rules of hooks: call them at the top level of a component or hook, never in conditions or loops, so the call order is identical every render.",
        "**Context** delivers a value to any descendant without prop drilling. Suited to low-frequency global values: theme, current user, locale.",
        "Every consumer re-renders when the context value changes. Split contexts and memoize the value; context is not a state manager.",
        "`useReducer` centralizes complex state transitions: `(state, action) => newState`. Actions modelled as a discriminated union make invalid transitions a compile error.",
        "`useRef` holds a mutable value that does **not** trigger re-renders — DOM nodes, timers, previous values."
      ],
      code: `
import { createContext, useContext, useEffect, useReducer, useState, type ReactNode } from "react";

// Custom hook: reusable logic
function useDebounced<T>(value: T, ms = 300): T {
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
const CartContext = createContext<{ items: CartItem[]; dispatch: React.Dispatch<Action> } | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, dispatch] = useReducer(cartReducer, []);
  return <CartContext value={{ items, dispatch }}>{children}</CartContext>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
`,
      practice: "Extract your product-fetching logic into `useProducts(search)` with debounced search. Add a cart using the reducer and context above, and show the item count in a header component that receives no props.",
      teach: "Explain why two components calling the same custom hook do not share state.",
      analogy: "A custom hook is a recipe, not a meal: two people following the same recipe each end up with their own plate. Context is the building's PA system — everyone hears the announcement without a messenger knocking on each door, which is also why you do not use it for a conversation that changes every second.",
      pitfalls: [
        "Expecting a custom hook to act as a shared store.",
        "Putting rapidly changing state in one big context and re-rendering the whole tree.",
        "Calling a hook inside an `if`, breaking the call order."
      ],
      quiz: [
        { q: "Two components both call `useCounter()`. They…", a: ["share one counter", "each get independent state", "throw an error", "share until one unmounts"], c: 1, why: "Hooks share logic; state belongs to the component instance that calls them." },
        { q: "Why must hooks not be called inside conditions?", a: ["Performance", "React identifies hooks by call order, which must be the same every render", "TypeScript forbids it", "They would run twice"], c: 1, why: "State is stored by position in the call sequence; skipping a call shifts every later hook." },
        { q: "Changing a `useRef` value's `.current`…", a: ["re-renders the component", "does not trigger a re-render", "throws", "resets state"], c: 1, why: "Refs are mutable boxes outside the render cycle." }
      ]
    },
    {
      id: 'perf', title: 'Rendering performance', level: 2, mins: 35, viz: 'rerender',
      why: "React is fast by default, and most 'optimizations' make code slower to read without making it faster to run. Advanced developers measure, then apply the right fix to the right component.",
      points: [
        "A **render** is React calling your function; a **commit** is React touching the DOM. Renders are usually cheap; unnecessary ones only matter when they are slow or many.",
        "**Measure first** with the React DevTools Profiler: find which components render, why, and how long they take.",
        "Cheapest fixes are structural: move state **down** to the component that needs it; pass expensive subtrees as `children` so they do not re-render.",
        "`memo(Component)` skips re-rendering when props are shallowly equal. It fails silently if you pass a new object, array or function every render.",
        "`useMemo` caches a computed value; `useCallback` caches a function identity — mainly useful to keep props stable for memoized children.",
        "The **React Compiler** memoizes automatically when enabled. For long lists, **virtualize** (render only visible rows). Split bundles with `lazy` and `Suspense`."
      ],
      code: `
import { memo, useCallback, useMemo, useState } from "react";

interface Row { id: number; name: string; price: number }

const ProductRow = memo(function ProductRow({ row, onSelect }: { row: Row; onSelect: (id: number) => void }) {
  return <li onClick={() => onSelect(row.id)}>{row.name} — {row.price}</li>;
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
      <input value={query} onChange={e => setQuery(e.target.value)} />
      <p>Selected: {selected ?? "none"}</p>
      <ul>{visible.map(r => <ProductRow key={r.id} row={r} onSelect={onSelect} />)}</ul>
    </>
  );
}
`,
      practice: "Render 5,000 rows with a search box. Record a typing session in the Profiler. Apply fixes one at a time — `memo`, stable callbacks, then virtualization — and record how many components render per keystroke after each.",
      teach: "Explain why wrapping a component in `memo` sometimes has no effect at all.",
      analogy: "`memo` is a guard at the door asking 'has anything in your delivery changed since last time?' If you hand him a brand-new box every time — even with identical contents — he has to say yes. `useCallback` and `useMemo` are how you hand over the same box.",
      pitfalls: [
        "Wrapping everything in `useMemo`/`useCallback` without measuring.",
        "`memo` defeated by inline `{}` / `[]` / `() => {}` props.",
        "Optimizing renders when the real cost is a 2 MB bundle or a slow API."
      ],
      quiz: [
        { q: "A memoized child receives `onClick={() => select(id)}` from its parent. Does `memo` skip re-renders?", a: ["Yes", "No — a new function is created each render, so props differ", "Only in production", "Only for the first child"], c: 1, why: "Shallow comparison sees a different function reference every time." },
        { q: "First step when a React screen feels slow?", a: ["Add `useMemo` everywhere", "Profile to see what renders and how long it takes", "Rewrite in another framework", "Remove TypeScript"], c: 1, why: "Without measurement you cannot know which component or operation is the cost." },
        { q: "Best fix for a list of 20,000 rows?", a: ["`memo` on each row", "Virtualization: render only the visible rows", "`useCallback`", "Bigger keys"], c: 1, why: "Not creating 20,000 DOM nodes beats making their re-renders cheaper." }
      ]
    },
    {
      id: 'server', title: 'Server state, routing and talking to your API', level: 2, mins: 45,
      why: "This is where the four tracks meet: a React screen calling an ASP.NET Core endpoint that runs SQL. Getting caching, errors, auth and types right here is what makes a full-stack developer.",
      points: [
        "**Server state** (data owned by the backend) is different from **client state** (UI state). It is asynchronous, shared and can go stale.",
        "A server-state library (TanStack Query) gives caching, deduplication, background refetch, retries and loading/error states — replacing hand-written `useEffect` fetching.",
        "**Queries** read and are cached by a key; **mutations** write and then **invalidate** affected queries so they refetch.",
        "A **router** (React Router or TanStack Router) maps URLs to components. Put shareable state — page, filters, selected id — in the URL.",
        "Share the contract: generate TypeScript types or a client from the API's **OpenAPI** document instead of retyping DTOs by hand.",
        "Auth for SPAs: prefer secure, `HttpOnly`, `SameSite` cookies (a backend-for-frontend) over tokens in `localStorage`. Configure CORS for exact origins."
      ],
      code: `
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface Product { id: number; name: string; price: number }
type CreateProduct = Omit<Product, "id">;

async function api<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, { credentials: "include", headers: { "Content-Type": "application/json" }, ...init });
  if (!res.ok) {
    const problem = await res.json().catch(() => null);      // ASP.NET ProblemDetails
    throw new Error(problem?.title ?? "HTTP " + res.status);
  }
  return res.status === 204 ? (undefined as T) : res.json();
}

export function Products() {
  const queryClient = useQueryClient();

  const { data, isPending, error } = useQuery({
    queryKey: ["products"],
    queryFn: () => api<Product[]>("/api/products"),
    staleTime: 30_000,
  });

  const create = useMutation({
    mutationFn: (p: CreateProduct) => api<Product>("/api/products", { method: "POST", body: JSON.stringify(p) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["products"] }),   // refetch the list
  });

  if (isPending) return <p>Loading…</p>;
  if (error) return <p role="alert">{error.message}</p>;

  return (
    <>
      <button disabled={create.isPending} onClick={() => create.mutate({ name: "New item", price: 10 })}>Add</button>
      {create.error && <p role="alert">{create.error.message}</p>}
      <ul>{data.map(p => <li key={p.id}>{p.name}</li>)}</ul>
    </>
  );
}
`,
      practice: "Connect your React app to your ASP.NET Core API with TanStack Query: list, create, delete. Display server validation errors from ProblemDetails beside the right fields. Generate the TypeScript types from the API's OpenAPI document and delete your hand-written copies.",
      teach: "Explain the difference between server state and client state, and what 'invalidating a query' does.",
      analogy: "Server state is a library book: you hold a copy, but the library owns the truth and someone else may have updated it. A query cache is your bookshelf of borrowed copies, each stamped with a 'check again after' date. Invalidating is saying 'I just handed in a correction — fetch me the new edition'.",
      pitfalls: [
        "Copying fetched data into `useState` and maintaining a second, stale truth.",
        "Storing access tokens in `localStorage`, readable by any injected script.",
        "Hand-maintaining TypeScript copies of C# DTOs until they drift."
      ],
      quiz: [
        { q: "After a successful 'create product' mutation, how does the product list update?", a: ["It never does", "Invalidate the list query so it refetches", "Reload the page", "Mutate the cache array with `push`"], c: 1, why: "Invalidation marks cached data stale and triggers a refetch of the source of truth." },
        { q: "Which belongs in the URL rather than in component state?", a: ["Whether a dropdown is open", "The current page number and filters of a list", "A half-typed input", "Hover state"], c: 1, why: "Shareable, bookmarkable view state should survive reload and be linkable." },
        { q: "Most robust way to keep TypeScript types in sync with a C# API?", a: ["Copy them by hand", "Generate them from the API's OpenAPI document", "Use `any`", "Write them in comments"], c: 1, why: "Generated types change when the API changes and fail the build when the frontend is out of date." }
      ]
    },
    // ---------------- Expert ----------------
    {
      id: 'tsadv', title: 'Advanced types: conditional, mapped and inferred', level: 3, mins: 45,
      why: "TypeScript's type system is a small programming language. Experts use it to make wrong code impossible to write — and know when a clever type costs more than it saves.",
      points: [
        "**Conditional types** choose a type: `T extends U ? X : Y`. Over a union they **distribute** — applied to each member.",
        "`infer` captures part of a type inside a condition: `T extends Promise<infer R> ? R : T`.",
        "**Mapped types** transform every property: `{ [K in keyof T]: … }`, with `readonly`/`?` modifiers and key remapping via `as`.",
        "**Template literal types** build string types: an event name type derived from property names.",
        "`never` is the empty type. Assigning to `never` in a `default` branch gives **exhaustiveness checking** — adding a union member breaks the build until handled.",
        "`satisfies` checks a value against a type **without widening** it. `as const` freezes literals. Prefer these to `as` casts."
      ],
      code: `
// infer: unwrap a Promise
type Awaited2<T> = T extends Promise<infer R> ? Awaited2<R> : T;
type A = Awaited2<Promise<Promise<number>>>;         // number

// Mapped type with key remapping + template literals
type Getters<T> = {
  [K in keyof T as "get" + Capitalize<string & K>]: () => T[K];
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

// satisfies: validated, but literal types are kept
const routes = {
  home: "/",
  product: "/products/:id",
} satisfies Record<string, string>;
type RouteName = keyof typeof routes;                // "home" | "product"
`,
      practice: "Write `DeepReadonly<T>` and `PathParams<'/users/:id/posts/:postId'>` that produces `{ id: string; postId: string }`. Then write one paragraph on whether you would accept `PathParams` in a team codebase, and what would change your mind.",
      teach: "Explain how assigning to a variable of type `never` in a `default` case makes the compiler catch a forgotten union member.",
      analogy: "Ordinary types are labels on boxes. Advanced types are a machine that prints labels: feed it one type and it stamps out a related one. `never` is a hole nothing fits through — if anything is left to drop into it, the compiler has found a case you did not handle.",
      pitfalls: [
        "Type gymnastics nobody on the team can maintain. Readability outranks cleverness.",
        "`as` casts that silence errors the type system was right about.",
        "Forgetting that conditional types distribute over unions, producing surprising results."
      ],
      quiz: [
        { q: "What is `T extends Promise<infer R> ? R : T` for `T = Promise<string>`?", a: ["`Promise<string>`", "`string`", "`never`", "`unknown`"], c: 1, why: "`infer R` captures the promise's resolved type." },
        { q: "What does `satisfies` do that a type annotation does not?", a: ["Runs at run time", "Checks compatibility while keeping the value's narrower inferred type", "Makes the value mutable", "Disables checking"], c: 1, why: "An annotation widens to the annotated type; `satisfies` validates and preserves literals." },
        { q: "A new member is added to a union handled by a `switch` with `const x: never = value` in `default`. Result?", a: ["Silent runtime bug", "Compile error until the new case is handled", "Nothing", "Infinite loop"], c: 1, why: "The unhandled member is not assignable to `never`, so the build fails at the right place." }
      ]
    },
    {
      id: 'internals', title: 'React internals: reconciliation and concurrency', level: 3, mins: 45,
      why: "Knowing how React decides what to change, and when, turns mysterious behavior — lost state, double effects, tearing, jank — into predictable consequences of a small set of rules.",
      points: [
        "Rendering produces a tree of **elements** (plain objects). **Reconciliation** compares it with the previous tree to find the minimal DOM changes.",
        "Two heuristics: a different **element type** at the same position replaces the whole subtree; **keys** identify children across reorders. State is tied to position + type + key.",
        "Changing a component's `key` deliberately **resets its state** — a useful technique, and a common accident.",
        "**Fiber** is React's unit of work, letting rendering be paused, resumed and prioritized. The **render phase** is interruptible and must be pure; the **commit phase** is synchronous.",
        "**Concurrent features**: `useTransition` and `useDeferredValue` mark updates as non-urgent so typing stays responsive; `Suspense` declares loading boundaries.",
        "Strict Mode double-invokes renders and effects in development to expose impure code. Server Components render on the server and send no JavaScript for themselves — a different execution model from client components."
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
      <input value={text} onChange={e => setText(e.target.value)} />

      {/* Non-urgent: can be interrupted by typing */}
      <button onClick={() => startTransition(() => setTab("chart"))}>
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
      practice: "Build a tab component that conditionally renders `<Counter />` in two branches at the same position, and observe state being preserved across the switch. Then give each a different `key` and explain the change in terms of reconciliation.",
      teach: "Explain why changing a component's `key` resets its state.",
      analogy: "Reconciliation is a theatre usher comparing tonight's seating plan to last night's. Same seat, same kind of guest: keep them and update their ticket. Different kind of guest in the seat: clear the seat entirely. A `key` is a name badge — with badges, the usher can follow a guest who moved seats instead of treating them as a stranger.",
      pitfalls: [
        "Defining a component inside another component — a new type every render, so its state resets constantly.",
        "Side effects in the render phase, which may run more than once.",
        "Treating Strict Mode's double invocation as a bug to be disabled."
      ],
      quiz: [
        { q: "At the same position, a `<div>` is replaced by a `<section>` with identical children. React will…", a: ["update the tag in place", "destroy the old subtree and build a new one, losing child state", "ignore the change", "throw an error"], c: 1, why: "A different element type means a different tree; React does not attempt to reuse it." },
        { q: "What does `useTransition` let you do?", a: ["Animate CSS", "Mark a state update as non-urgent so urgent updates can interrupt it", "Fetch data", "Skip rendering"], c: 1, why: "Transitions keep the UI responsive during expensive renders." },
        { q: "Why does Strict Mode run effects twice in development?", a: ["A known bug", "To reveal effects that lack proper cleanup", "For performance", "To warm caches"], c: 1, why: "Mount → unmount → mount simulates remounting; correct effects are unaffected." }
      ]
    },
    {
      id: 'arch', title: 'Frontend architecture, testing and accessibility', level: 3, mins: 45,
      why: "An expert frontend is one a team can change safely for years and that every user can operate. That is a matter of structure, tests that survive refactoring, and accessibility as a requirement rather than a feature.",
      points: [
        "Classify state before choosing tools: **server state** (query library), **URL state** (router), **local UI state** (`useState`), **shared client state** (context, or a store such as Zustand when it changes often).",
        "Organize by **feature** (`features/cart/…`) rather than by file type; keep shared UI primitives separate. Enforce boundaries with lint rules.",
        "Test **behavior through the UI** with React Testing Library: find elements by role and label, act like a user, assert on what they see. Mock the network (MSW), not your components.",
        "A few **end-to-end** tests (Playwright) cover the critical paths across the real frontend, API and database.",
        "**Accessibility**: semantic HTML first, every input labelled, full keyboard operation, visible focus, sufficient contrast, announcements for async changes. Test with a keyboard and a screen reader.",
        "Performance budgets: track Core Web Vitals (LCP, INP, CLS), split code by route, optimize images, and fail CI when the bundle grows past the budget."
      ],
      code: `
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { expect, test, beforeAll, afterAll } from "vitest";
import { ProductsPage } from "./ProductsPage";

const server = setupServer(
  http.get("/api/products", () => HttpResponse.json([{ id: 1, name: "Laptop", price: 1200 }])),
  http.post("/api/products", () =>
    HttpResponse.json({ title: "Validation failed", errors: { Price: ["Must be positive"] } }, { status: 400 })),
);
beforeAll(() => server.listen());
afterAll(() => server.close());

test("shows the server's validation error next to the price field", async () => {
  const user = userEvent.setup();
  render(<ProductsPage />);

  expect(await screen.findByText("Laptop")).toBeInTheDocument();

  await user.type(screen.getByLabelText("Name"), "Broken");
  await user.type(screen.getByLabelText("Price"), "-5");
  await user.click(screen.getByRole("button", { name: "Add" }));

  expect(await screen.findByRole("alert")).toHaveTextContent("Must be positive");
  expect(screen.getByLabelText("Price")).toHaveAccessibleDescription("Must be positive");
});
`,
      practice: "Write this test for your own products page, then refactor the page's internals — rename components, swap state management — without touching the test. If the test breaks, it was testing implementation. Finally operate the whole page using only the keyboard and fix what you find.",
      teach: "Explain why tests that find elements by role and label are more valuable than tests that check component internals.",
      analogy: "A good UI test is a mystery shopper: they walk in, use the shop as a customer would, and report what they experienced. They do not care how the stockroom is organized — so you can reorganize the stockroom freely. And an accessible shop has a ramp built in from the start, not a plank brought out on request.",
      pitfalls: [
        "A global store for everything, including server data and form inputs.",
        "Snapshot tests and tests of internal state that break on every refactor and catch no bugs.",
        "`div` with `onClick` instead of `button`: unreachable by keyboard and invisible to assistive technology."
      ],
      quiz: [
        { q: "Where does data fetched from the API belong?", a: ["A global Redux store, always", "A server-state cache such as TanStack Query", "`localStorage`", "Component refs"], c: 1, why: "Server state needs caching, staleness and invalidation — the job of a query library." },
        { q: "Why query by `getByRole('button', { name: 'Add' })` rather than by CSS class?", a: ["It is faster", "It tests what users and assistive tech perceive, and survives refactoring", "Classes are deprecated", "It needs no rendering"], c: 1, why: "Role and name are the public contract of the UI; class names are implementation details." },
        { q: "Most important first step for accessibility?", a: ["Add ARIA to every element", "Use semantic HTML elements with proper labels", "Increase font size", "Add a dark theme"], c: 1, why: "Native elements bring keyboard support and semantics for free; ARIA is for gaps, not a substitute." }
      ]
    }
  ]
});
