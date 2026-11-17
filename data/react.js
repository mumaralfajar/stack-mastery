TRACKS.push({
  id: 'react', name: 'TypeScript + React', lang: 'tsx',
  tagline: 'The frontend: modern JavaScript, the type system, components, state and architecture.',
  lessons: [
    // ---------------- Beginner ----------------
    {
      id: 'js', title: 'JavaScript essentials for TypeScript', level: 0, mins: 30,
      why: "TypeScript is JavaScript with types. Most React bugs that confuse beginners — stale values, mutated arrays, `undefined` — are JavaScript problems, not React ones.",
      points: [
        "`const` can't be reassigned, `let` can. Default to `const`, and don't use `var`.",
        "Functions are values. Arrow functions `(x) => x * 2` are the everyday form.",
        "Objects and arrays are **references**: `const b = a` shares the same array. Copy with spread: `[...a]`, `{ ...obj }`.",
        "`map`, `filter` and `reduce` return **new** values and leave the array alone. `sort`, `reverse` and `splice` change it in place; their copying versions are `toSorted`, `toReversed` and `toSpliced`.",
        "Destructuring unpacks: `const { name, age } = user;` and `const [first, ...rest] = list;`.",
        "`===` compares strictly. `?.` stops at `null`/`undefined`, and `??` supplies a fallback only for `null`/`undefined`. `||` falls back on any falsy value: `0`, `''`, `null`, `undefined`, `NaN`, `false`."
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
      practice: "In the TypeScript playground: given an array of `{ name, price, inStock }`, produce the names of in-stock items under 100, sorted by price, without changing the original array. Use `toSorted`, then log the original to prove it's unchanged.",
      teach: "Explain why `const b = a; b.push(1);` also changes `a`, and how to avoid it.",
      analogy: "`const` on an object is a dog on a fixed leash: the leash can't be tied to a different dog, but the dog can still get muddy.",
      pitfalls: [
        "Believing `const` makes an object immutable. It only fixes which object the name points to.",
        "Calling `sort` or `splice` on state; they change the array in place. Use `toSorted` and `toSpliced`.",
        "Writing `count || 10` when `0` is a valid count. Use `??`.",
        "Confusing `map` (returns a new array) with `forEach` (returns nothing)."
      ],
      quiz: [
        { q: "What does `[1, 2, 3].map(n => n * 2)` return?", a: ["`undefined`", "`[2, 4, 6]`, and the original becomes `[2, 4, 6]` too", "`[2, 4, 6]`, leaving the original alone", "`6`"], c: 2, why: "`map` returns a new array of transformed elements and doesn't touch the original." },
        { q: "`const a = { n: 1 }; const b = a; b.n = 2;` What is `a.n`?", a: ["1", "2", "undefined", "An error: `a` is const"], c: 1, why: "`a` and `b` reference the same object; `const` only stops the variable being reassigned." },
        { q: "What is `0 ?? 10`?", a: ["`0`", "`10`", "`null`", "`false`"], c: 0, why: "`??` only replaces `null` and `undefined`. `0 || 10` would give `10`, because `0` is falsy." }
      ]
    },
    {
      id: 'ts', title: 'TypeScript: types that catch bugs', level: 0, mins: 35,
      why: "TypeScript moves a whole class of bugs from 'a user found it' to 'the editor underlined it'. It is also the contract between your React frontend and your C# backend.",
      points: [
        "Annotate where data enters: parameters, return types, API responses. Let inference do the rest.",
        "`interface` or `type` describes an object's shape. TypeScript is **structural**: if it has the right shape, it fits.",
        "**Union types** model 'one of': `string | number`, `'idle' | 'loading' | 'error'`.",
        "**Narrowing**: after `if (typeof x === 'string')` or `if (user)`, TypeScript knows the more specific type inside the block.",
        "Optional properties `age?: number` are `number | undefined`. With `strict` on, which the Vite template does, you must handle the `undefined`.",
        "Avoid `any`: it switches the checker off. Use `unknown` and narrow instead. Types disappear at run time, so they don't check data arriving from the network."
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
      practice: "In the playground, define a `Todo` type and a function `toggle(todos: Todo[], id: string): Todo[]` that returns a new array. Then model a request state as a discriminated union of `idle`, `loading`, `success` and `error`, and write a function that handles all four.",
      teach: "Explain what a union type is and how TypeScript 'narrows' it inside an `if`.",
      analogy: "Types are a shape-sorter toy: the square block only fits the square hole, and you find out the moment you try, not after the box has shipped. A union is a hole that takes a square or a circle, and narrowing is checking which one you're holding before you use it.",
      pitfalls: [
        "Reaching for `any` when the checker complains. The complaint is usually a real bug.",
        "Believing TypeScript checks API data at run time. `as Product` is a promise you make, not a check.",
        "Annotating things the compiler already infers."
      ],
      quiz: [
        { q: "What does `type Size = 'S' | 'M' | 'L'` allow?", a: ["Any string", "Exactly one of those three strings", "An array of those three strings", "Any string starting with S, M or L"], c: 1, why: "It's a union of string literal types." },
        { q: "TypeScript types at run time are…", a: ["checked by the JavaScript engine", "erased: they exist only at compile time", "converted into classes", "kept as comments in the output"], c: 1, why: "The compiler removes all types; the output is plain JavaScript." },
        { q: "Safer alternative to `any` for a value of unknown shape?", a: ["`object`", "`unknown`, then narrow", "`never`", "`{}`"], c: 1, why: "`unknown` makes you check the type before using the value." }
      ]
    },
    {
      id: 'components', title: 'React: components, JSX and props', level: 0, mins: 35,
      why: "React's main idea fits in one sentence: the UI is a function of data. Once you see a component as a function that returns a description of the screen, the rest follows. This track uses React 19, which is what a new Vite project installs.",
      points: [
        "A **component** is a function that returns JSX. Its name starts with a capital letter.",
        "**JSX** is JavaScript that looks like HTML. Curly braces `{ }` embed any expression.",
        "**Props** are a component's inputs, passed like attributes. They're read-only: a component never changes its own props.",
        "Render lists with `map` and give each item a stable, unique `key`.",
        "Conditional rendering is ordinary JavaScript: `cond && <X />` or `cond ? <A /> : <B />`.",
        "Compose small components into bigger ones; `children` lets a component wrap any content."
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
      practice: "Create a project with `npm create vite@latest shop -- --template react-ts`. Build a `ProductList` that renders `ProductCard`s from an array, shows a message when the array is empty, and highlights items over 1000.",
      teach: "Explain what a React component is and what props are, to someone who knows HTML and basic JavaScript.",
      analogy: "A component is a rubber stamp with blanks: the design is fixed, and props fill in the blanks each time you stamp. The page is built by stamping small stamps inside bigger ones.",
      pitfalls: [
        "Using the array index as `key` for lists that reorder or change.",
        "Trying to change props inside the child.",
        "Rendering a stray `0` with `items.length && <List />`. Use `items.length > 0 &&`."
      ],
      quiz: [
        { q: "What is a React function component?", a: ["A class that extends `HTMLElement`", "A function that takes props and returns JSX", "A template string of HTML", "A JSON description of the page"], c: 1, why: "Components are plain functions that describe the UI for the props they're given." },
        { q: "Why does each list item need a `key`?", a: ["For CSS styling", "So React can match items between renders", "To sort the list", "So React can skip rendering the list"], c: 1, why: "Keys give elements a stable identity, so React updates, moves or removes the right ones." },
        { q: "Can a child component change the props it receives?", a: ["Yes, freely", "No: props are read-only; it asks the parent through a callback", "Only if the prop is an object", "Yes, but only with `useState`"], c: 1, why: "Data flows down; changes are requested upward through functions passed as props." }
      ]
    },
    // ---------------- Intermediate ----------------
    {
      id: 'jsdeep', title: 'JavaScript in depth: closures, this and the event loop', level: 1, mins: 40, viz: 'eventloop', lang: 'ts',
      why: "These three ideas explain most 'weird' JavaScript behavior: stale values in React hooks, a `this` that goes missing, and code that runs in an unexpected order.",
      points: [
        "A **closure** is a function plus the variables it could see when it was created. Those variables stay alive as long as the function does. Every React hook and event handler relies on this.",
        "A **stale closure** is a function that still sees old variables: the cause of React effects and timers that read outdated state.",
        "`this` is decided by **how a function is called**, not where it's written: `obj.method()` sets `this` to `obj`; a detached call loses it. **Arrow functions** have no `this` of their own and use the surrounding one.",
        "JavaScript runs on **one thread** with an **event loop**: finish the current synchronous code, then run **all microtasks** (promise callbacks, code after `await`), then take **one task** (a timer, an event, a network response), and repeat. The browser can repaint between tasks, never in the middle of one.",
        "So a resolved promise's `.then` always runs before a `setTimeout(…, 0)`, and long synchronous work blocks rendering and input entirely.",
        "`Promise.all` waits for several promises that are already running, and rejects as soon as one fails; `Promise.allSettled` waits for every result. Always handle rejection: an unhandled one is a silent bug."
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
      practice: "Predict the output order of the event-loop example, then step through the visualization to check. In the TypeScript playground, write a `debounce(fn, ms)` function using a closure, and explain which variable the closure keeps alive.",
      teach: "Explain why `Promise.resolve().then(...)` runs before `setTimeout(..., 0)` even though both are 'asynchronous'.",
      analogy: "The event loop is a single chef with two order rails. After finishing the dish in hand, the chef clears the whole 'urgent' rail (microtasks) before taking just one ticket from the normal rail (tasks), then checks the urgent rail again.",
      pitfalls: [
        "Passing `obj.method` as a callback and losing `this`. Use an arrow function or `bind`.",
        "Assuming `setTimeout(fn, 0)` runs immediately. It runs after the current code and every pending microtask.",
        "A stale closure in a React effect or interval that reads state captured on the first render.",
        "A `while` loop that takes 300 ms: the page can't repaint or respond to clicks until it finishes."
      ],
      quiz: [
        { q: "Which logs first: a `setTimeout(…, 0)` callback or a resolved promise's `.then` callback, both scheduled in the same synchronous code?", a: ["The timeout", "The promise callback", "Whichever was written first", "It depends on the browser"], c: 1, why: "All microtasks run before the event loop takes the next task." },
        { q: "What does a closure capture?", a: ["A copy of the values at creation time", "The variables themselves, which stay alive with the function", "Only global variables", "Nothing once the outer function returns"], c: 1, why: "The function keeps a live reference to its surrounding scope." },
        { q: "`const f = user.hi; f();` fails to read `this.name` because…", a: ["`hi` was deleted", "`this` depends on the call, and `f()` has no object before the dot", "`hi` is an arrow function", "`name` is private"], c: 1, why: "Detaching a method loses its receiver; `this` is `undefined` in strict mode." }
      ]
    },
    {
      id: 'state', title: 'State and re-rendering', level: 1, mins: 40, viz: 'rerender',
      why: "State is how a component remembers things, and how React knows the screen must change. 'Why didn't the screen update?' and 'why does it render so often?' both come from how this works.",
      points: [
        "**State** is data a component remembers between renders: `const [count, setCount] = useState(0)`.",
        "Calling the setter schedules a **re-render**: React calls your function again and updates the DOM to match the new JSX.",
        "When a component re-renders, **all its children re-render** by default, whether or not their props changed.",
        "State is a **snapshot**: inside one render, `count` never changes. Use the updater form `setCount(c => c + 1)` when the next value depends on the previous one.",
        "**Never mutate state.** Create a new array or object so React sees a new reference: `setItems([...items, x])`.",
        "Don't store what you can compute. Work out totals and filtered lists during render."
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
      analogy: "Each render is a photograph of the component at one moment, and `count` inside that photo is frozen. Calling `setCount` doesn't edit the photo; it asks React to take a new one. Mutating state is drawing on the old photo with a marker: React compares the two prints, sees the same sheet of paper, and changes nothing.",
      pitfalls: [
        "Calling `setCount(count + 1)` three times and expecting +3. All three read the same snapshot.",
        "Mutating arrays or objects in state.",
        "Keeping derived data in state as well, and letting it drift out of sync.",
        "Ids from `Date.now()`, which repeat when two items are added in the same millisecond. Use `crypto.randomUUID()`."
      ],
      quiz: [
        { q: "`count` is 0. A handler runs `setCount(count + 1); setCount(count + 1);`. What is `count` on the next render?", a: ["0", "1", "2", "It throws"], c: 1, why: "Both calls compute 0 + 1 from the same snapshot. Use `setCount(c => c + 1)` to get 2." },
        { q: "A parent's state changes. Which components re-render by default?", a: ["Only the parent", "The parent and all its descendants", "The whole app", "Only children whose props changed"], c: 1, why: "Re-rendering a component re-renders its subtree, unless something such as `memo` or the React Compiler skips it." },
        { q: "Why does `items.push(x); setItems(items);` not update the UI?", a: ["`push` doesn't change the array", "The array reference is unchanged, so React sees no new state", "`setItems` must be awaited", "React only tracks objects, not arrays"], c: 1, why: "React compares by reference; the same array object means 'nothing changed'." }
      ]
    },
    {
      id: 'effects', title: 'Effects and data fetching', level: 1, mins: 40,
      why: "`useEffect` causes more confusion than any other hook. Knowing what it's for (keeping in step with something outside React) and what it isn't for prevents infinite loops, races, and a lot of hard-to-trace bugs.",
      points: [
        "Rendering must be **pure**: same props and state in, same JSX out, no side effects.",
        "`useEffect` runs **after** render to stay in step with the outside world: the network, timers, subscriptions, the DOM.",
        "The **dependency array** says when to re-run: `[]` once after mount, `[id]` whenever `id` changes, no array at all after every render.",
        "Return a **cleanup function** to undo the effect: unsubscribe, clear the timer, abort the request.",
        "Fetching in an effect needs three states (loading, error, data) and protection against **race conditions**: abort or ignore stale responses. In real apps, a data library does this for you; the server-state lesson uses TanStack Query.",
        "You often **don't need an effect**: derived values belong in render, and responses to user actions belong in event handlers."
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
      practice: "Build the component against your ASP.NET Core API. With the network throttled in dev tools, click quickly between products; remove the cleanup and watch the wrong product appear. Put it back and explain the race.",
      teach: "Explain what the dependency array of `useEffect` does and what the cleanup function is for.",
      analogy: "An effect is a standing instruction to a stagehand: 'whenever the scene changes to scene N, set up the props for N, and before the next scene, clear the old ones away.' The dependency array is the list of things that count as a scene change.",
      pitfalls: [
        "Leaving out a dependency and reading a stale value; or setting state that is itself a dependency and looping forever.",
        "Using an effect to compute something from props or state. Compute it during render.",
        "No cleanup: out-of-order responses overwrite newer data."
      ],
      quiz: [
        { q: "`useEffect(() => { … }, [])` runs…", a: ["On every render", "Once after the first render (mount)", "Never", "Before the first render"], c: 1, why: "An empty dependency array means nothing can change to trigger a re-run. (In development, Strict Mode runs it twice on purpose.)" },
        { q: "What is the function returned from an effect for?", a: ["Returning data to the component", "Cleanup before the next run and on unmount", "Handling errors", "Memoizing the effect"], c: 1, why: "It undoes the effect: unsubscribe, clear timers, abort requests." },
        { q: "You need `fullName` from `first` and `last` props. Best approach?", a: ["A `useEffect` that sets state", "Compute it during render: `const fullName = first + ' ' + last`", "A `useRef` updated on each render", "`useMemo` around the string"], c: 1, why: "Derived values need no effect and no state; extra state means extra renders and bugs. `useMemo` is pointless for something this cheap." }
      ]
    },
    {
      id: 'forms', title: 'Forms, lifting state and composition', level: 1, mins: 35,
      why: "Real interfaces are forms and lists that share data. Knowing where state should live, and how sibling components talk to each other, keeps an app tidy instead of tangled.",
      points: [
        "React 19 forms can use **Actions**: pass a function to `<form action={…}>` and `useActionState` gives you the returned state (such as errors) and an `isPending` flag. The values arrive as `FormData`.",
        "After an action, React resets the form's uncontrolled fields. Return the submitted values in the state and use them as `defaultValue`, so a failed submit doesn't wipe what the user typed.",
        "A **controlled input** takes its `value` from state and reports changes through `onChange`. Use one when you need the value on every keystroke, such as a live search.",
        "When two components need the same data, **lift the state** to their closest common parent and pass it down. Children change it by calling **callbacks** passed as props: data down, events up.",
        "Link each error to its field: `aria-invalid` on the input, and `aria-describedby` pointing at the message, so screen readers announce it with the field.",
        "For big forms, use a library (React Hook Form) with a schema validator (Zod), so the same rules validate and type the data."
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
        "Copying a prop into state and then wondering why it doesn't update.",
        "Lifting everything to the top 'just in case', so the whole app re-renders on every keystroke.",
        "Mixing controlled and uncontrolled on one input (`value` sometimes `undefined`), which triggers React's 'changing an uncontrolled input' warning.",
        "An error message shown near the field but not linked with `aria-describedby`, so screen-reader users never hear it."
      ],
      quiz: [
        { q: "Two sibling components must show the same value. Where should the state live?", a: ["In both siblings", "In their closest common parent", "In a module-level variable", "In `localStorage`"], c: 1, why: "A single owner passes the value down to both, so they stay in sync automatically." },
        { q: "How does a child update state owned by its parent?", a: ["It changes the prop", "It calls a callback function passed as a prop", "It reads the parent's state with `useContext`", "It can't"], c: 1, why: "The parent passes a function and the child calls it: events flow up." },
        { q: "A form action returns validation errors, and the fields come back empty. Why?", a: ["The action threw an error", "React resets uncontrolled fields after an action; return the values and use them as `defaultValue`", "`useActionState` only keeps the last field", "The form needs `method=\"post\"`"], c: 1, why: "The automatic reset uses each field's `defaultValue`, so feeding it the submitted values keeps the user's input." },
        { q: "A 'controlled' input is one whose…", a: ["value comes from React state", "value lives only in the DOM", "type is `password`", "changes are disabled"], c: 0, why: "State is the source of truth: `onChange` updates the state, and the state sets `value`." }
      ]
    },
    {
      id: 'generics', title: 'TypeScript generics and utility types', level: 1, mins: 35,
      why: "Generics let you write one reusable function, hook or component that stays fully typed. Utility types let you derive types instead of copying them, which keeps the frontend in step with the API.",
      points: [
        "A **generic** is a type parameter: `function first<T>(items: T[]): T | undefined`. The caller's type flows through.",
        "Constrain it with `extends`: `<T extends { id: number }>` means 'any type that has an id'.",
        "`keyof T` is the union of T's property names; `T[K]` is the type of property K.",
        "Utility types derive new shapes: `Partial<T>`, `Required<T>`, `Pick<T, K>`, `Omit<T, K>`, `Record<K, V>`, `ReturnType<F>`, `Awaited<T>`.",
        "Generic components: `function List<T>({ items, render }: ListProps<T>)` works for any item type.",
        "Derive, don't duplicate: `type CreateProduct = Omit<Product, 'id'>` can't drift away from `Product`."
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
        "Adding a type parameter that's used only once. A generic should connect two things, such as an input and an output.",
        "Hand-writing near-copies of a type instead of deriving them.",
        "Believing `getJson<Product[]>` checks the response. It's an unchecked assertion; validate at the boundary (for example with Zod) when it matters."
      ],
      quiz: [
        { q: "What is `Omit<Product, 'id'>`?", a: ["Product with only `id`", "Product without the `id` property", "Product with `id` made optional", "A function that deletes `id` at run time"], c: 1, why: "`Omit` builds a type with the named keys removed. Types never run, so nothing is deleted from real objects." },
        { q: "In `<T, K extends keyof T>`, what may `K` be?", a: ["Any string", "Only a property name of `T`", "Any type", "The type of one of T's values"], c: 1, why: "`keyof T` is the union of T's keys, and `K` must fit inside it." },
        { q: "What does `Partial<T>` do?", a: ["Makes every property optional", "Makes every property required", "Makes every property nullable", "Makes `T` readonly"], c: 0, why: "Each property gains `?`, which suits patch or update payloads." }
      ]
    },
    // ---------------- Advanced ----------------
    {
      id: 'hooks', title: 'Custom hooks, context and reducers', level: 2, mins: 40,
      why: "As apps grow, logic has to be shared without copy-paste, and data has to reach deep components without passing props through ten layers. These three tools are React's answer.",
      points: [
        "A **custom hook** is a function named `useX` that calls other hooks. It shares **logic**, not state: each caller gets its own state.",
        "Rules of hooks: call them at the top level of a component or hook, never inside conditions or loops, so the call order is the same every render.",
        "**Context** delivers a value to any descendant without prop drilling. It suits values that change rarely: theme, current user, locale. In React 19, render `<MyContext value={…}>` directly and read it with `useContext` or `use`.",
        "Every consumer re-renders when the context value changes, so keep the value stable (`useMemo`, unless the React Compiler does it for you) and split unrelated values into separate contexts. Context is not a state manager.",
        "`useReducer` centralizes complex state changes: `(state, action) => newState`. Actions written as a discriminated union make an invalid action a compile error.",
        "`useRef` holds a mutable value that does **not** trigger re-renders: DOM nodes, timer ids, previous values."
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
        { q: "Two components both call `useCounter()`. They…", a: ["share one counter", "each get independent state", "throw an error", "share until one unmounts"], c: 1, why: "Hooks share logic; state belongs to the component that calls them." },
        { q: "Why must hooks not be called inside conditions?", a: ["It's slower", "React identifies hooks by call order, which must be the same every render", "TypeScript forbids it", "The hook would run twice"], c: 1, why: "State is stored by position in the call sequence; skipping a call shifts every later hook." },
        { q: "Changing a `useRef` value's `.current`…", a: ["re-renders the component", "doesn't trigger a re-render", "throws in Strict Mode", "resets the component's state"], c: 1, why: "Refs are mutable boxes outside the render cycle." }
      ]
    },
    {
      id: 'perf', title: 'Rendering performance', level: 2, mins: 35, viz: 'rerender',
      why: "React is fast by default, and most hand-made 'optimizations' make code harder to read without making it faster. Measure first, then apply the right fix to the right component.",
      points: [
        "A **render** is React calling your function; a **commit** is React touching the DOM. Renders are usually cheap; extra ones only matter when they're slow or very many.",
        "**Measure first** with the React DevTools Profiler: which components render, why, and for how long.",
        "The **React Compiler** (stable since October 2025) memoizes components, values and callbacks automatically at build time. With it on, you rarely write `memo`, `useMemo` or `useCallback` yourself. It relies on your code following the rules of React (pure renders, no mutation).",
        "The cheapest fixes are structural: move state **down** to the component that needs it, and pass expensive subtrees as `children` so they don't re-render.",
        "Without the compiler, or for one hot spot: `memo(Component)` skips a render when props are shallowly equal, and `useCallback`/`useMemo` keep those props stable. A new object, array or function prop on every render defeats `memo` silently.",
        "For long lists, **virtualize** (render only the visible rows). Split bundles with `lazy` and `Suspense`."
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
      practice: "Render 5,000 rows with a search box and record a typing session in the Profiler. Apply fixes one at a time — `memo` with stable callbacks, then virtualization — and record how many components render per keystroke after each. Then remove the manual memoization, switch on the React Compiler, and record again.",
      teach: "Explain why wrapping a component in `memo` sometimes has no effect at all.",
      analogy: "`memo` is a guard at the door asking 'has anything in your delivery changed since last time?' If you hand over a brand-new box every time, even with identical contents, the guard has to say yes. `useCallback` and `useMemo` are how you hand over the same box, and the React Compiler is a colleague who does that for you.",
      pitfalls: [
        "Wrapping everything in `useMemo`/`useCallback` without measuring.",
        "`memo` defeated by inline `{}` / `[]` / `() => {}` props.",
        "Optimizing renders when the real cost is a 2 MB bundle or a slow API.",
        "Code that mutates during render, which the React Compiler can't safely memoize."
      ],
      quiz: [
        { q: "A memoized child receives `onClick={() => select(id)}` from its parent, with no React Compiler. Does `memo` skip re-renders?", a: ["Yes", "No: a new function is created each render, so the props differ", "Only in production", "Only for the first child"], c: 1, why: "Shallow comparison sees a different function reference every time." },
        { q: "The React Compiler is enabled. Do you still need `useCallback` around event handlers?", a: ["Yes, everywhere", "Usually not: the compiler memoizes them automatically", "Only for handlers that call `setState`", "Only inside class components"], c: 1, why: "The compiler adds the memoization at build time, as long as the code follows the rules of React." },
        { q: "First step when a React screen feels slow?", a: ["Wrap everything in `useMemo`", "Profile to see what renders and how long it takes", "Move all state into context", "Replace `useState` with `useReducer`"], c: 1, why: "Without measuring you can't know which component or operation is the cost." },
        { q: "Best fix for a list of 20,000 rows?", a: ["`memo` on each row", "Virtualization: render only the visible rows", "`useCallback` for every handler", "Using the index as `key`"], c: 1, why: "Not creating 20,000 DOM nodes beats making their re-renders cheaper." }
      ]
    },
    {
      id: 'server', title: 'Server state, routing and talking to your API', level: 2, mins: 45,
      why: "This is where the tracks meet: a React screen calling an ASP.NET Core endpoint that runs SQL. Getting caching, errors, auth and types right here is the core of full-stack work.",
      points: [
        "**Server state** (data owned by the backend) is different from **client state** (UI state). It's asynchronous, shared, and can go stale.",
        "A server-state library (TanStack Query) gives caching, deduplication, background refetching, retries and loading/error states, replacing hand-written `useEffect` fetching. Wrap the app once in `<QueryClientProvider>`.",
        "**Queries** read and are cached by a key; **mutations** write and then **invalidate** the affected queries so they refetch.",
        "Turn ASP.NET's ProblemDetails into something the UI can use: the `title` for a general message, and `errors` for messages next to each field.",
        "A **router** (React Router or TanStack Router) maps URLs to components. Put shareable state — page, filters, selected id — in the URL.",
        "Share the contract: generate TypeScript types from the API's **OpenAPI** document instead of retyping DTOs by hand.",
        "Auth for SPAs: prefer `HttpOnly`, `Secure`, `SameSite` cookies through a backend-for-frontend over tokens in `localStorage`. Cookies are sent automatically, so protect writes against CSRF with ASP.NET Core's antiforgery token or a required custom header."
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
      analogy: "Server state is a library book: you hold a copy, but the library owns the truth, and someone else may have updated it. The query cache is your shelf of borrowed copies, each stamped with a 'check again after' date. Invalidating is saying 'I just handed in a correction; fetch me the new edition'.",
      pitfalls: [
        "Copying fetched data into `useState` and keeping a second, stale copy of the truth.",
        "Storing access tokens in `localStorage`, where any injected script can read them.",
        "Setting `Content-Type: application/json` on every request, including GETs, which forces an extra CORS preflight request each time.",
        "Spreading the caller's options after your own `headers`, so passing any header silently drops `Content-Type`.",
        "Hand-maintaining TypeScript copies of C# DTOs until they drift."
      ],
      quiz: [
        { q: "After a successful 'create product' mutation, how should the product list update?", a: ["It updates by itself", "Invalidate the list query so it refetches", "Reload the page", "`push` the new item into the cached array"], c: 1, why: "Invalidation marks the cached data stale and refetches it from the source of truth. Mutating the cache in place bypasses change detection." },
        { q: "Which belongs in the URL rather than in component state?", a: ["Whether a dropdown is open", "The current page number and filters of a list", "A half-typed input", "Hover state"], c: 1, why: "Shareable, bookmarkable view state should survive a reload and be linkable." },
        { q: "Your SPA signs in with an `HttpOnly` cookie. What else do writes need?", a: ["Nothing: `HttpOnly` blocks every attack", "CSRF protection, such as an antiforgery token or a required custom header", "A token in `localStorage` as well", "`credentials: \"omit\"` on every request"], c: 1, why: "The browser sends cookies with every request to your API, including requests triggered by another site. That's what CSRF protection guards against." },
        { q: "Most robust way to keep TypeScript types in step with a C# API?", a: ["Copy them by hand", "Generate them from the API's OpenAPI document", "Use `any` for API responses", "Share a `.d.ts` file in Slack"], c: 1, why: "Generated types change when the API changes, and fail the build when the frontend is out of date." }
      ]
    },
    // ---------------- Expert ----------------
    {
      id: 'tsadv', title: 'Advanced types: conditional, mapped and inferred', level: 3, mins: 45,
      why: "TypeScript's type system is a small programming language. Used well, it makes wrong code impossible to write; used too cleverly, it makes code nobody else can change. The skill is telling the two apart.",
      points: [
        "**Conditional types** choose a type: `T extends U ? X : Y`. Over a union they **distribute**: they're applied to each member.",
        "`infer` captures part of a type inside a condition: `T extends Promise<infer R> ? R : T`. TypeScript's built-in `Awaited<T>` works this way.",
        "**Mapped types** transform every property: `{ [K in keyof T]: … }`, with `readonly`/`?` modifiers and key renaming via `as`.",
        "**Template literal types** build string types, written with backticks like JavaScript template strings: an event-name type derived from property names.",
        "`never` is the empty type. Assigning to `never` in a `default` branch gives **exhaustiveness checking**: adding a union member breaks the build until it's handled.",
        "`satisfies` checks a value against a type **without widening** it. `as const` freezes literals. Prefer both to `as` casts."
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
      practice: "Write `DeepReadonly<T>`, and `PathParams<'/users/:id/posts/:postId'>` that produces `{ id: string; postId: string }`. Then write one paragraph on whether you'd accept `PathParams` in a team codebase, and what would change your mind.",
      teach: "Explain how assigning to a variable of type `never` in a `default` case makes the compiler catch a forgotten union member.",
      analogy: "Ordinary types are labels on boxes. Advanced types are a machine that prints labels: feed it one type and it stamps out a related one. `never` is a slot nothing fits through: if anything is left over to drop into it, the compiler has found a case you didn't handle.",
      pitfalls: [
        "Type gymnastics nobody on the team can maintain. Readability beats cleverness.",
        "`as` casts that silence errors the type system was right about.",
        "Forgetting that conditional types distribute over unions, and getting surprising results.",
        "Re-implementing utility types TypeScript already ships, such as `Awaited`, `NonNullable` or `ReturnType`."
      ],
      quiz: [
        { q: "What is `T extends Promise<infer R> ? R : T` for `T = Promise<string>`?", a: ["`Promise<string>`", "`string`", "`never`", "`unknown`"], c: 1, why: "`infer R` captures the type the promise resolves to." },
        { q: "What does `satisfies` do that a type annotation doesn't?", a: ["Checks the value at run time", "Checks compatibility while keeping the value's narrower inferred type", "Makes the value mutable", "Turns off checking for that value"], c: 1, why: "An annotation widens to the annotated type; `satisfies` checks and keeps the literals." },
        { q: "A new member is added to a union handled by a `switch` with `const x: never = value` in `default`. Result?", a: ["A silent bug at run time", "A compile error until the new case is handled", "Nothing", "The new case falls through to the first case"], c: 1, why: "The unhandled member isn't assignable to `never`, so the build fails at exactly the right place." }
      ]
    },
    {
      id: 'internals', title: 'React internals: reconciliation and concurrency', level: 3, mins: 45,
      why: "Knowing how React decides what to change, and when, turns puzzling behavior — lost state, effects running twice, jank — into predictable results of a small set of rules.",
      points: [
        "Rendering produces a tree of **elements** (plain objects). **Reconciliation** compares it with the previous tree to find the smallest set of DOM changes.",
        "Two rules: a different **element type** at the same position replaces the whole subtree; **keys** identify children across reorders. State is tied to position + type + key.",
        "Changing a component's `key` on purpose **resets its state**: a useful technique, and a common accident.",
        "**Fiber** is React's unit of work, which lets rendering be paused, resumed and prioritized. The **render phase** can be interrupted and must be pure; the **commit phase** runs in one go.",
        "**Concurrent features**: `useTransition` and `useDeferredValue` mark updates as non-urgent so typing stays responsive; `Suspense` declares loading boundaries; `use(promise)` reads a promise inside a Suspense boundary.",
        "Strict Mode renders twice and mounts, unmounts and remounts effects in development, to expose impure code. Server Components render on the server and send no JavaScript for themselves: a different execution model from client components."
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
        { q: "At the same position, a `<div>` is replaced by a `<section>` with identical children. React will…", a: ["change the tag in place", "destroy the old subtree and build a new one, losing child state", "ignore the change", "throw an error"], c: 1, why: "A different element type means a different tree; React doesn't try to reuse it." },
        { q: "What does `useTransition` let you do?", a: ["Animate CSS", "Mark a state update as non-urgent so urgent updates can interrupt it", "Fetch data in the background", "Skip rendering a component"], c: 1, why: "Transitions keep the UI responsive during expensive renders." },
        { q: "Why does Strict Mode run effects twice in development?", a: ["It's a bug in development builds", "To reveal effects that lack proper cleanup", "To load data twice for speed", "Because Strict Mode also renders on the server"], c: 1, why: "Mount → unmount → mount simulates remounting; effects with correct cleanup aren't affected." }
      ]
    },
    {
      id: 'arch', title: 'Frontend architecture, testing and accessibility', level: 3, mins: 45,
      why: "A good frontend is one a team can change safely for years and that every user can operate. That takes structure, tests that survive refactoring, and accessibility treated as a requirement rather than a feature.",
      points: [
        "Classify state before choosing tools: **server state** (query library), **URL state** (router), **local UI state** (`useState`), **shared client state** (context, or a store such as Zustand when it changes often).",
        "Organize by **feature** (`features/cart/…`) rather than by file type, and keep shared UI pieces separate. Enforce the boundaries with lint rules.",
        "Test **behavior through the UI** with React Testing Library: find elements by role and label, act like a user, and assert on what they see. Mock the network (MSW), not your components.",
        "Test setup for Vitest: the `jsdom` environment, `import \"@testing-library/jest-dom/vitest\"` for matchers such as `toBeInTheDocument`, and the same providers the app uses (here a `QueryClientProvider`).",
        "A few **end-to-end** tests (Playwright) cover the critical paths across the real frontend, API and database.",
        "**Accessibility**: semantic HTML first, every input labelled, full keyboard operation, visible focus, enough contrast, announcements for async changes. Test with a keyboard and a screen reader.",
        "Performance budgets: track Core Web Vitals (LCP, INP, CLS), split code by route, optimize images, and fail CI when the bundle grows past the budget."
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
      practice: "Write this test for your own products page, then refactor the page's internals — rename components, change how state is managed — without touching the test. If the test breaks, it was testing implementation. Finally operate the whole page using only the keyboard and fix what you find.",
      teach: "Explain why tests that find elements by role and label are more valuable than tests that check component internals.",
      analogy: "A good UI test is a mystery shopper: they walk in, use the shop as a customer would, and report what they experienced. They don't care how the stockroom is organized, so you can reorganize the stockroom freely.",
      pitfalls: [
        "A global store for everything, including server data and form inputs.",
        "Snapshot tests and tests of internal state that break on every refactor and catch no bugs.",
        "`div` or `li` with `onClick` instead of a `button`: unreachable by keyboard and invisible to assistive technology.",
        "Rendering a component in a test without the providers it needs, then fighting confusing errors."
      ],
      quiz: [
        { q: "Where does data fetched from the API belong?", a: ["A global Redux store, always", "A server-state cache such as TanStack Query", "`localStorage`", "A `useRef` in the root component"], c: 1, why: "Server state needs caching, staleness and invalidation, which is a query library's job." },
        { q: "Why query by `getByRole('button', { name: 'Add' })` rather than by CSS class?", a: ["It's faster", "It tests what users and assistive technology perceive, and survives refactoring", "Classes don't exist in jsdom", "It needs no rendering"], c: 1, why: "Role and name are the public contract of the UI; class names are implementation details." },
        { q: "Most important first step for accessibility?", a: ["Add ARIA attributes to every element", "Use semantic HTML elements with proper labels", "Pick a high-contrast colour palette", "Install an accessibility overlay widget"], c: 1, why: "Native elements bring keyboard support and meaning for free; ARIA fills gaps, it doesn't replace them. Overlay widgets don't fix the underlying markup." }
      ]
    }
  ]
});
