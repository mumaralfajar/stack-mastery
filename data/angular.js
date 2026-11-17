// Angular track (Angular 22+). Every code sample is checked with ngc strictTemplates by tools/verify-angular.mjs.
// Inside these template literals any TypeScript backtick must be written \` and "${" must be written \${.
TRACKS.push({
  id: 'angular', name: 'Angular', lang: 'ts',
  tagline: 'The full-featured frontend: components, Signals, dependency injection, Signal Forms, HTTP and SSR.',
  lessons: [
    // ---------------- Beginner ----------------
    {
      id: 'components', title: 'Components, templates and bindings', level: 0, mins: 35,
      why: "Every Angular screen is a tree of small, self-contained UI pieces called components. Once you understand how a TypeScript class holds data and an HTML template displays and updates it, the rest of the framework fits into place.",
      terms: [
        ['Component', 'One reusable UI piece: a TypeScript class (data and click logic) paired with its own HTML template.'],
        ['Decorator (`@Component`)', 'A label starting with `@` right above a class that tells Angular its HTML tag name (`selector`) and markup (`template`).'],
        ['`selector`', 'The custom HTML tag name (such as `app-product-card`) used to place a component inside another template.'],
        ['Binding', 'Connecting TypeScript values or methods in the class directly to HTML text, element properties, or user events.']
      ],
      points: [
        "An Angular **component** pairs a TypeScript `class` (holding data and actions) with an **`@Component({ ... })` decorator** specifying two core things: `selector` (the HTML tag name, e.g. `'app-product-card'`) and `template` (its HTML).",
        "To use one component inside another's template, list its class in `imports: [ProductCard]` on the parent's `@Component(...)`. When a custom tag has no inner HTML between opening and closing tags, write it self-closing: `<app-product-card />`.",
        "**Templates bind data three everyday ways**: `{{ name }}` (**interpolation**) inserts text into HTML; `[disabled]=\"outOfStock\"` (**property binding**) sets a DOM element property from TypeScript; and `(click)=\"select()\"` (**event binding**) calls a class method when the user clicks.",
        "Square brackets `[disabled]=\"outOfStock\"` matter even for attributes: in plain HTML, `disabled=\"false\"` still disables a button because the attribute exists, whereas `[disabled]=\"false\"` sets the JavaScript DOM property to boolean `false`.",
        "In Angular class syntax, **`readonly`** prevents accidentally reassigning a constant property, and **`protected`** lets the component's own `template` read a field or method while keeping it private from unrelated parent components.",
        "Every app starts in `main.ts` by calling `bootstrapApplication(App)`, which mounts the root `App` component onto the `<app-root></app-root>` tag inside `index.html`."
      ],
      code: `
// product-card.ts — one small, reusable card component
import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';

// 1. @Component marks this TypeScript class as a UI widget
@Component({
  selector: 'app-product-card',      // custom HTML tag used by other templates
  template: \`
    <article class="card">
      <!-- {{ ... }} interpolation prints class properties into HTML -->
      <h2>{{ name }}</h2>
      <p>Price: {{ price }}</p>

      <!-- [disabled] sets the DOM boolean property; (click) calls a method -->
      <button type="button" [disabled]="stock === 0" (click)="toggle()">
        {{ selected ? 'Selected' : 'Select' }}
      </button>
    </article>
  \`,
})
export class ProductCard {
  // 2. readonly fields cannot be overwritten accidentally
  readonly name = 'Mechanical Keyboard';
  readonly price = 80;
  readonly stock: number = 5;

  // 3. protected exposes state/handlers to this template, not to outside code
  protected selected = false;

  protected toggle(): void {
    this.selected = !this.selected;
  }
}

// app.ts — the root component that renders ProductCard
@Component({
  selector: 'app-root',
  imports: [ProductCard],            // required so this template recognizes <app-product-card />
  template: \`
    <main>
      <h1>Shop</h1>
      <app-product-card />
    </main>
  \`,
})
export class App {}

// main.ts normally calls: bootstrapApplication(App);
export { bootstrapApplication };
`,
      practice: "Create a workspace with `npx @angular/cli@latest new shop-ng` and replace the root component with the code above. Start the app with `npx ng serve`, open the browser, and add a `clickCount = 0` property incremented inside `toggle()`. Notice what breaks if you remove `ProductCard` from `imports: [ProductCard]` or write `(click)=\"() => toggle()\"` instead of `(click)=\"toggle()\"`.",
      teach: "Explain what `@Component`, `selector`, `imports`, `{{ value }}`, `[disabled]`, and `(click)` each do—using plain words without assuming the listener already knows Angular.",
      analogy: "A component is like a custom HTML tag you invent yourself (`<app-product-card />`), backed by a small TypeScript brain. Double curly braces `{{ }}` print data onto the page, square brackets `[ ]` push TypeScript values **into** HTML properties, and parentheses `( )` send user clicks **back** to your class.",
      pitfalls: [
        "Using `<app-product-card />` in a parent template without listing `ProductCard` in that parent's `@Component({ imports: [...] })` array.",
        "Writing `(click)=\"() => toggle()\"` inside a template: Angular runs the expression when clicked, which creates a function and never calls it. Write `(click)=\"toggle()\"`.",
        "Using `private` on a field used in the template—Angular checks templates strictly and requires `protected` or public (`readonly`) fields.",
        "In older Angular tutorials, you may see `NgModule` wrapper files instead of `imports: [...]` directly on `@Component`; modern Angular does not need `NgModule`."
      ],
      quiz: [
        { q: "What must you add so a parent component's template recognizes `<app-product-card />`?", a: ["An `NgModule` registration file", "`ProductCard` inside the parent's `@Component({ imports: [...] })` array", "An HTML `<link>` tag in `index.html`", "Extending `ProductCard` with `extends`"], c: 1, why: "Each component explicitly declares the components its template uses in its `imports` array." },
        { q: "What happens if you write `(click)=\"() => toggle()\"` in an Angular template?", a: ["`toggle()` runs on click", "Nothing: clicking evaluates to an unused arrow function without calling `toggle()`", "Angular fails to compile", "`toggle()` runs once immediately on load"], c: 1, why: "Event bindings execute the expression itself when the event fires; invoke the method directly as `(click)=\"toggle()\"`." },
        { q: "Why prefer `[disabled]=\"isOutOfStock\"` over HTML `disabled=\"{{ isOutOfStock }}\"`?", a: ["Property binding passes the actual JavaScript `true`/`false` boolean to the DOM element", "Square brackets style the button automatically", "HTML doesn't support attributes on buttons", "It runs faster only on mobile"], c: 0, why: "In HTML attributes, even `disabled=\"false\"` disables a button because the attribute name exists. `[disabled]` sets the DOM boolean property directly." }
      ]
    },
    {
      id: 'flow', title: 'Control flow, pipes and content slots', level: 0, mins: 35,
      why: "HTML on its own cannot loop over an array, show a loading spinner instead of a table, or format `240` as `$240.00`. Angular adds clean template branching (`@if`, `@for`, `@switch`), formatting filters called pipes, and wrapper slots (`<ng-content />`) so templates stay expressive and easy to read.",
      terms: [
        ['Control flow', 'Template blocks (`@if`, `@for`, `@switch`) that conditionally show, repeat, or choose HTML markup.'],
        ['`track`', 'An ID expression required by `@for` (such as `track p.id`) so Angular identifies each list row across updates instead of rebuilding the whole list.'],
        ['Pipe (`|`)', 'A template formatting operator (such as `{{ price | currency }}`) that transforms a value purely for display.'],
        ['Content projection (`<ng-content />`)', 'Leaving a placeholder slot inside a wrapper component so parent components can pass their own HTML inside its tags.']
      ],
      points: [
        "**`@if` / `@else if` / `@else`** show or remove elements cleanly based on a condition. **`@for (p of products; track p.id)`** repeats markup for every item, and its optional **`@empty`** block displays a fallback when the array has zero items.",
        "Every `@for` requires **`track`** so Angular knows which DOM node matches which data item. Using a stable unique ID (`track p.id`) means inserting or sorting an item moves existing DOM elements instead of destroying and recreating every row (and wiping text cursor focus or scroll position).",
        "**`@switch (value)`** compares using strict `===` with no fallthrough between cases. If `value` is a TypeScript union (such as `'loading' | 'ready' | 'error'`), ending with **`@default never;`** makes the compiler fail the build whenever a new state is added later without a matching `@case`.",
        "**Pipes** (`{{ p.price | currency }}`) format values inside templates without modifying the original data. Custom `@Pipe({ name: 'truncate' })` classes must be **pure** (stateless functions returning the same output for the same inputs). To reuse that formatting logic in regular TypeScript files, extract a plain function (`truncateText`) and call it from both places.",
        "**Content projection** turns a component into a reusable container (`<app-badge-card>...</app-badge-card>`): an unnamed `<ng-content />` slot catches the main children, while `select=\"[card-badge]\"` uses a standard **CSS attribute selector** to route `<span card-badge>` into its own named slot (and anything inside `<ng-content>Default</ng-content>` acts as fallback text)."
      ],
      code: `
// badge-card.ts + truncate.pipe.ts + catalog.ts
import { Component, Pipe, PipeTransform } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

export interface Product { id: number; name: string; price: number; onSale: boolean }
type LoadState = 'loading' | 'ready' | 'error';

// 1. Plain helper function shared between TypeScript code and the template pipe
export function truncateText(value: string, limit = 30): string {
  return value.length > limit ? value.slice(0, limit) + '…' : value;
}

// 2. @Pipe registers "| truncate" for templates; implements PipeTransform ensures transform() exists
@Pipe({ name: 'truncate' })
export class TruncatePipe implements PipeTransform {
  transform(value: string, limit = 30): string {
    return truncateText(value, limit);
  }
}

// 3. Wrapper component with named and fallback <ng-content /> slots
@Component({
  selector: 'app-badge-card',
  template: \`
    <article class="card">
      <header>
        <ng-content select="[card-title]" />            <!-- CSS selector matches <strong card-title> -->
        <ng-content select="[card-badge]">In stock</ng-content>
      </header>
      <ng-content />                                     <!-- catches any remaining child HTML -->
    </article>
  \`,
})
export class BadgeCard {}

// 4. Parent using @switch, @for, @if, CurrencyPipe and TruncatePipe
@Component({
  selector: 'app-catalog',
  imports: [CurrencyPipe, TruncatePipe, BadgeCard],
  template: \`
    @switch (status) {
      @case ('loading') { <p>Loading products…</p> }
      @case ('error') { <p role="alert">Could not load catalog.</p> }
      @case ('ready') {
        <ul>
          @for (p of products; track p.id; let i = $index) {
            <li>
              <app-badge-card>
                <strong card-title>{{ i + 1 }}. {{ p.name | truncate: 18 }}</strong>
                @if (p.onSale) { <span card-badge>Sale</span> }
                <span>{{ p.price | currency }}</span>
              </app-badge-card>
            </li>
          } @empty {
            <li>No products found.</li>
          }
        </ul>
      }
      @default never;   <!-- compile error if LoadState gains an unhandled member -->
    }
  \`,
})
export class Catalog {
  protected readonly status: LoadState = 'ready';
  protected readonly products: Product[] = [
    { id: 1, name: 'Noise-Cancelling Headphones', price: 240, onSale: true },
    { id: 2, name: 'USB-C Hub', price: 45, onSale: false },
  ];
}
`,
      practice: "First, predict what happens if you add `'paused'` to `type LoadState` without adding `@case ('paused')`, then add it and read the compiler error caused by `@default never;`. Next, change `products` to `[]` to see the `@empty` fallback render, and verify `truncateText('USB-C Docking Station', 10)` works both via `| truncate: 10` in the template and called directly in TypeScript.",
      teach: "Explain why `@for` needs `track p.id`, what a pipe (`|`) does, and how `<ng-content select=\"[card-badge]\" />` works to someone who knows HTML and CSS.",
      analogy: "`track` in `@for` is a numbered luggage tag on each suitcase: when suitcases swap places on the belt, Angular reads the tag (`p.id`) and moves the matching DOM element instead of unpacking and repacking everything from scratch. `<ng-content />` is a picture frame with labelled cutouts.",
      pitfalls: [
        "Writing `track $index` on lists where items are added at the top, reordered, or deleted—shifting indexes causes Angular to mismatch DOM rows.",
        "Forgetting to add `CurrencyPipe` or custom pipes (`TruncatePipe`) to `@Component({ imports: [...] })`.",
        "Trying to instantiate or reuse a `@Pipe` class directly in plain TypeScript logic instead of calling a shared helper function like `truncateText()`.",
        "In older Angular tutorials, you may see `*ngIf` and `*ngFor`; modern built-in `@if` / `@for` blocks require no extra imports and perform better."
      ],
      quiz: [
        { q: "Why does `@for` require a `track` expression like `track p.id`?", a: ["To sort items alphabetically", "So Angular can identify each item across array updates and reuse its DOM nodes", "To make keys uppercase", "To hide empty items"], c: 1, why: "A stable ID tells Angular which DOM elements moved or stayed the same so it avoids tearing down unchanged rows." },
        { q: "What does adding `@default never;` at the end of `@switch` guarantee?", a: ["Nothing renders if matched", "A compile error whenever a union type case is forgotten", "Runtime throwing in the browser", "Automatic lowercase comparison"], c: 1, why: "It uses TypeScript's `never` check to guarantee every possible value of a union type has an `@case` handler." },
        { q: "How should you share formatting logic between a template pipe and a regular TypeScript helper?", a: ["Copy and paste the body into both files", "Extract a plain TypeScript function (like `truncateText`) that both the pipe and other code call", "Wrap the whole app in `CurrencyPipe`", "Use `@for` inside the pipe"], c: 1, why: "Pipes are simple wrapper classes around pure functions—extracting the function keeps templates and TypeScript logic clean and consistent." }
      ]
    },
    {
      id: 'signals', title: 'Reactive state: signal, computed, linkedSignal and effect', level: 0, mins: 40, viz: 'ngsignals',
      why: "Real UIs change after clicks, typing, and timers. **Signals** give Angular a tiny, explicit container around any changing value so Angular knows *precisely* which text or attributes depend on that value—and updates them automatically without searching the whole page.",
      terms: [
        ['Signal (`signal(val)`)', 'A reactive box around a value. Calling it like a function (`qty()`) reads the value and subscribes the reader to future updates.'],
        ['`computed()`', 'A read-only derived signal that calculates its result lazily, caches (memoizes) it, and recalculates only when signals it actually read change.'],
        ['`linkedSignal()`', 'Writable state with an automatic default: resets whenever a source signal changes, while still allowing `.set()` overrides.'],
        ['`effect()`', 'A side-effect runner that executes automatically when signals it reads change—used solely to sync outside Angular (timers, logs, `localStorage`).']
      ],
      points: [
        "Create reactive state with **`signal(initialValue)`**. Read it by **calling it** (`this.qty()`), replace it with `.set(next)`, or compute a new value from the old one with `.update(q => q + 1)`. Always create new arrays/objects instead of mutating in place.",
        "Derive values with **`computed(() => this.price() * this.qty())`**. It is **lazy** (only computes when read) and **memoized** (cached until a tracked dependency changes). Tracking is also dynamic: in `qty() > 0 && hasCoupon()`, changing `hasCoupon` is ignored whenever `qty()` is `0` because the `&&` short-circuited before reading it.",
        "Use **`linkedSignal`** when state needs a smart derived default that the user can *also* edit directly (for example: automatically resetting `selectedShipping` when available options change, while keeping the user's pick if that option still exists).",
        "Use **`effect(onCleanup => ...)`** strictly to push changes out to external systems (logging, `localStorage`, canvas, timers), registering `onCleanup(...)` to cancel stale timers or listeners. **Never** use `effect()` to copy or sync one signal into another—use `computed()` or `linkedSignal()` instead.",
        "Signal tracking only captures synchronous reads: always read signals **before** any `await`, and wrap values you want to inspect without subscribing in **`untracked(this.qty)`**."
      ],
      code: `
// checkout-summary.ts — signals, derived state, and an external cleanup effect
import { Component, computed, effect, linkedSignal, signal, untracked } from '@angular/core';

interface ShippingOption { id: string; label: string; cost: number }

@Component({
  selector: 'app-checkout-summary',
  template: \`
    <p>Subtotal: {{ subtotal() }} · Shipping: {{ selectedShipping().label }} · Total: {{ total() }}</p>
    <button type="button" (click)="qty.update(q => q + 1)">Add one</button>
    <button type="button" (click)="hasCoupon.update(c => !c)">Toggle coupon</button>
    <button type="button" (click)="toggleExpress()">Switch shipping</button>
  \`,
})
export class CheckoutSummary {
  // 1. Source signals: call qty() to read; call .set() / .update() to change
  readonly price = signal(100);
  readonly qty = signal(1);
  readonly hasCoupon = signal(false);

  readonly options = signal<ShippingOption[]>([
    { id: 'std', label: 'Standard', cost: 10 },
    { id: 'exp', label: 'Express', cost: 25 },
  ]);

  // 2. Writable derived state: keeps user pick if still in options, otherwise defaults to first
  readonly selectedShipping = linkedSignal<ShippingOption[], ShippingOption>({
    source: this.options,
    computation: (opts, prev) => opts.find(o => o.id === prev?.value.id) ?? opts[0],
  });

  // 3. Read-only cached derivations: recalculate ONLY when tracked inputs actually change
  readonly subtotal = computed(() => this.price() * this.qty());
  readonly discount = computed(() => (this.qty() > 0 && this.hasCoupon() ? 15 : 0));
  readonly total = computed(() => this.subtotal() + this.selectedShipping().cost - this.discount());

  constructor() {
    // 4. Side effect: runs when total() changes; onCleanup cancels the previous pending timer
    effect((onCleanup) => {
      const currentTotal = this.total();              // tracked dependency
      const snapshotQty = untracked(this.qty);        // read once WITHOUT creating a subscription
      const timer = setTimeout(() => {
        console.log(\`Draft saved: qty=\${snapshotQty}, total=\${currentTotal}\`);
      }, 200);
      onCleanup(() => clearTimeout(timer));
    });
  }

  protected toggleExpress(): void {
    const opts = this.options();
    const next = this.selectedShipping().id === 'std' ? opts[1] : opts[0];
    this.selectedShipping.set(next);
  }
}
`,
      practice: "Open the **Signal dependency graph** interactive visualization above: set `qty = 0`, toggle `hasCoupon`, and watch `total()` stay cached because `qty() > 0 && hasCoupon()` short-circuited before reading `hasCoupon()`. Then open the **TypeScript playground** (`#/play/ts`), run the **Angular signals** and **Angular linkedSignal** examples, and modify `price.set(150)` to observe recomputation.",
      teach: "Explain what a `signal()` is, how `computed()` caches work and tracks dynamic branches, and why `linkedSignal()` solves cases where people accidentally reach for `effect()`.",
      analogy: "`computed` is a spreadsheet formula cell: you cannot type directly into it, and Excel recalculates it only when an input cell it actually read changes. `linkedSignal` is a smart checkout dropdown: it auto-picks Standard shipping when you change countries, yet still lets you click Express.",
      pitfalls: [
        "Using `effect()` to copy values from signal A into signal B (`effect(() => b.set(a() * 2))`) instead of writing `const b = computed(() => a() * 2)`.",
        "Mutating an array inside a signal in place (`items().push(x)`) without replacing it via `.update(list => [...list, x])`—Angular sees the same array reference and does not trigger updates.",
        "Reading a signal inside `computed` or `effect` *after* an `await`: signal tracking only observes synchronous calls.",
        "Forgetting parentheses when reading a signal in a template (`{{ total }}` prints `[Signal: 110]` instead of calling `{{ total() }}`)."
      ],
      quiz: [
        { q: "Inside `computed(() => qty() > 0 && coupon() ? 15 : 0)`, `qty()` is currently `0`. What happens when `coupon` changes?", a: ["`computed` throws an error", "It stays cached without recalculating, because short-circuiting skipped reading `coupon()`", "It recalculates anyway", "It clears `qty()`"], c: 1, why: "Dependencies are recorded dynamically per evaluation; when `qty() > 0` was false, `coupon()` was never called." },
        { q: "Which primitive gives you state that resets automatically when a filter changes, yet still lets the user override it via `.set()`?", a: ["`computed()`", "`linkedSignal()`", "`effect()`", "`untracked()`"], c: 1, why: "`linkedSignal()` creates writable derived state that recalculates a fresh default whenever its source changes." },
        { q: "When is `effect()` the right tool?", a: ["Syncing external non-Angular APIs such as `localStorage`, canvas drawing, or analytics when signals change", "Deriving a filtered array from a search box", "Initializing class constants", "Calling `.set()` on another signal every time a prop updates"], c: 0, why: "Use `computed()` / `linkedSignal()` for signal-to-signal state, and reserve `effect()` for external side effects with cleanup." }
      ]
    },
    // ---------------- Intermediate ----------------
    {
      id: 'inputs', title: 'Component API: input, output, model, queries and host', level: 1, mins: 40,
      why: "Components collaborate through clear boundaries: parents pass data down, children emit events up, custom form controls stay two-way synced, and sometimes a class needs a handle to a DOM element or its own outer wrapper tag. Because Angular models inputs, `model()`, and queries as Signals, everything you just learned applies seamlessly.",
      terms: [
        ['`input()` / `input.required()`', 'Read-only signals receiving data passed down from a parent component (`[unitPrice]="25"`).'],
        ['`output()`', 'An event emitter sending notifications up to a parent component (`(addToCart)="onAdded($event)"`).'],
        ['`model()`', 'A two-way writable signal supporting `[(quantity)]="qty"` shorthand (`[quantity]` in + `(quantityChange)` out).'],
        ['Host element', 'The component\'s own outer HTML tag rendered in the parent (e.g. `<app-qty-picker>`), configured via `host: { ... }` inside `@Component`.'],
        ['Template query (`viewChild`)', 'A signal giving TypeScript access to a labelled child element (like `<input #searchInput />`) once rendered.']
      ],
      points: [
        "**Inputs**: declare optional inputs with `input(defaultVal)` and required ones with `input.required<number>()`. Because an input **is a read-only signal**, derive values from it cleanly with `computed()`—never write `this.unitPrice.set(...)`.",
        "**HTML attributes vs DOM properties**: in `<app-qty-picker disabled />`, static HTML sends the empty string `\"\"`. Adding `{ transform: booleanAttribute }` coerces attribute presence to boolean `true` (`numberAttribute` does the same for numbers).",
        "**Outputs & Two-way `model()`**: emit custom events via `readonly addToCart = output<number>()` (use camelCase without an `on` prefix, e.g., `selected`, not `onSelected`). For shared editable state like a quantity stepper, `model(1)` creates both an input and output so parents can write the **banana-in-a-box** two-way shorthand `[(quantity)]=\"qty\"`.",
        "**Querying elements (`viewChild` / `contentChild`)**: add a `#name` marker on a template element (`<input #searchInput />`) and grab its wrapper (`ElementRef<HTMLInputElement>`) via `viewChild('searchInput')` (`contentChild` reads elements projected through `<ng-content />`). Since queries are signals, call `this.searchInput()?.nativeElement.focus()` safely after render.",
        "**Styling/binding the host element**: `<app-qty-picker>` itself is the **host element** wrapping everything in `template:`. Bind classes, attributes, or host events directly in `@Component({ host: { 'class': 'picker-host', '[attr.data-disabled]': 'disabled()' } })` using `[attr.*]` whenever targeting custom HTML attributes."
      ],
      code: `
// qty-picker.ts + product-page.ts
import { Component, ElementRef, booleanAttribute, computed, input, model, output, signal, viewChild } from '@angular/core';

@Component({
  selector: 'app-qty-picker',
  // 1. host configures attributes/classes on the <app-qty-picker> tag itself
  host: {
    'class': 'picker-host',
    '[attr.data-disabled]': 'disabled()',
  },
  template: \`
    <div class="picker">
      <button type="button" [disabled]="disabled() || quantity() <= 1" (click)="step(-1)">−</button>
      <span>{{ quantity() }} (Total: {{ total() }})</span>
      <button type="button" [disabled]="disabled()" (click)="step(1)">+</button>
      <button type="button" [disabled]="disabled()" (click)="addToCart.emit(quantity())">Add</button>
    </div>
  \`,
})
export class QtyPicker {
  // 2. Inputs arrive as read-only signals; booleanAttribute lets callers write <app-qty-picker disabled />
  readonly unitPrice = input.required<number>();
  readonly disabled = input(false, { transform: booleanAttribute });

  // 3. model() supports two-way [(quantity)]="qty"; output() fires custom events upward
  readonly quantity = model(1);
  readonly addToCart = output<number>();

  protected readonly total = computed(() => this.unitPrice() * this.quantity());

  protected step(delta: number): void {
    this.quantity.update(q => Math.max(1, q + delta));
  }
}

@Component({
  selector: 'app-product-page',
  imports: [QtyPicker],
  template: \`
    <!-- #searchInput attaches a local template reference name -->
    <input #searchInput type="search" placeholder="Filter…" />
    <button type="button" (click)="focusSearch()">Focus search</button>

    <!-- [(quantity)]="qty" keeps parent qty signal synced in both directions -->
    <app-qty-picker [unitPrice]="25" [(quantity)]="qty" (addToCart)="onAdded($event)" />
    <p>Parent sees quantity: {{ qty() }} · last added: {{ lastAdded() }}</p>
  \`,
})
export class ProductPage {
  protected readonly qty = signal(2);
  protected readonly lastAdded = signal(0);

  // 4. viewChild wraps the rendered <input> in ElementRef; reading .nativeElement gives the real DOM node
  private readonly searchInput = viewChild<ElementRef<HTMLInputElement>>('searchInput');

  protected focusSearch(): void {
    this.searchInput()?.nativeElement.focus();
  }

  protected onAdded(count: number): void {
    this.lastAdded.set(count);
  }
}
`,
      practice: "Build a `StarRating` component with `readonly max = input(5)` and `readonly rating = model(0)`. Bind it from a parent with `[(rating)]=\"score\"`, inspect `<app-star-rating>` in browser DevTools to confirm `host:` adds `data-rating` when a star is clicked, and add a `viewChild` button that focuses the first star button on Reset.",
      teach: "Explain the difference between `input()` + `output()` versus `model()`, why `<app-btn disabled />` needs `booleanAttribute`, and what the **host element** is.",
      analogy: "`input()` is a one-way mail slot from parent to child, `output()` is a doorbell the child rings up to the parent, and `model()` is a shared whiteboard they both edit. The **host element** is the outer envelope itself, styled with `host: { ... }`.",
      pitfalls: [
        "Choosing input names that collide with standard HTML attributes such as `title`, `id`, or `hidden`.",
        "Calling `viewChild.required()` in a class constructor or when its element sits inside a false `@if`—Angular throws missing-query error `NG0951` until that view exists.",
        "Trying to call `.set()` on an `input()` signal (inputs are read-only; switch to `model()` or `linkedSignal()` for local writes).",
        "In older Angular code, you may see `@HostBinding`, `@HostListener`, `ngOnChanges`, and `ngAfterViewInit`; `host:`, `computed()`, and `viewChild()` replace them cleanly."
      ],
      quiz: [
        { q: "Which function creates a two-way bindable signal (`[(value)]`) between parent and child?", a: ["`input()`", "`output()`", "`model()`", "`computed()`"], c: 2, why: "`model()` returns a writable signal that exposes both an input `[value]` and an output `(valueChange)` under one contract." },
        { q: "Why does `input(false, { transform: booleanAttribute })` let a parent write `<app-qty-picker disabled />`?", a: ["HTML passes static attributes as empty string `\"\"`, which `booleanAttribute` converts to `true`", "It disables the parent component automatically", "It skips TypeScript checking", "It creates a `Signal` out of CSS"], c: 0, why: "Without a transform, bare HTML attributes arrive as `\"\"`; `booleanAttribute` coerces presence cleanly to `true`." },
        { q: "Where should attributes or CSS classes for a component's own outer `<app-qty-picker>` wrapper tag be declared?", a: ["Inside `constructor` with `document.querySelector`", "In the `host: { ... }` section of `@Component(...)`", "Inside `index.html`", "In `main.ts`"], c: 1, why: "`host` binds classes, attributes, and DOM listeners declaratively onto the component's host element." }
      ]
    },
    {
      id: 'di', title: 'Services and dependency injection', level: 1, mins: 35,
      why: "Components focus on UI, while shared state (like a shopping cart or auth session) and API helpers belong in **services**. Angular's **Dependency Injection (DI)** lets any component ask for a shared service without creating `new CartStore()` manually—and lets tests swap fake implementations cleanly.",
      terms: [
        ['Service (`@Service()`)', 'A plain TypeScript class holding shared state or business logic that multiple components can reuse.'],
        ['Dependency Injection (DI)', 'A pattern where Angular creates and hands out class instances via `inject(...)`, instead of components instantiating `new ...` directly.'],
        ['`Injector`', 'Angular\'s lookup registry (tree) that resolves requests for `inject(...)` from component level up to app root.'],
        ['`InjectionToken`', 'A unique typed key used to inject non-class values such as configuration objects or browser `DOCUMENT`.']
      ],
      points: [
        "**Dependency Injection** solves two problems: sharing one instance (like a shopping cart) across unrelated components, and letting automated tests substitute mock objects easily. Mark app-wide singletons with **`@Service()`** (equivalent to `@Injectable({ providedIn: 'root' })`, and **tree-shakeable**—unused services are omitted from the final bundle).",
        "Ask Angular for a dependency with **`inject(CartStore)`** in a class field initializer or constructor (or inside functional router guards and HTTP interceptors). Calling `inject()` inside normal click methods throws unless wrapped in `runInInjectionContext()`.",
        "**Service lifetimes** (just like ASP.NET Core): `@Service()` creates one **app-wide singleton** (`AddSingleton`). Listing a service on a Route creates one instance for that route section. Marking `@Service({ autoProvided: false })` and putting `[DraftBuffer]` inside `@Component({ providers: [...] })` gives each component instance its own private copy, destroyed when removed from the screen.",
        "**How resolution walks two injector trees**: Angular looks first up the **`ElementInjector`** chain (this element's `providers`, then parent elements in the template), and if not found, up the **`EnvironmentInjector`** chain (route providers → app root). Options customize lookup: `{ optional: true }` returns `null` instead of crashing; `{ skipSelf: true }` starts searching at the parent component.",
        "Always protect shared service state: keep writable `signal` fields `private` (`_items`) and expose read-only `.asReadonly()` signals plus explicit methods (`add()`).",
        "For plain TypeScript interfaces or settings objects (which disappear at runtime, unlike classes), define a typed **`InjectionToken<ApiSettings>`**."
      ],
      code: `
// cart.service.ts + editor-panel.ts
import { Component, InjectionToken, Service, inject, signal } from '@angular/core';

export interface ApiSettings { readonly baseUrl: string }

// 1. InjectionToken provides a runtime lookup key for plain config objects/interfaces
export const API_SETTINGS = new InjectionToken<ApiSettings>('api.settings', {
  providedIn: 'root',
  factory: () => ({ baseUrl: 'https://localhost:5001' }),
});

// 2. App-wide singleton service shared by every component that calls inject(CartStore)
@Service()
export class CartStore {
  private readonly _items = signal<string[]>([]);
  readonly items = this._items.asReadonly();     // outside components can read, not mutate directly

  add(name: string): void {
    this._items.update(list => [...list, name]);
  }
}

// 3. Component-scoped service: autoProvided: false requires opting in via providers: [...]
@Service({ autoProvided: false })
export class DraftBuffer {
  readonly notes = signal('');
}

@Component({
  selector: 'app-editor-panel',
  providers: [DraftBuffer],                      // each <app-editor-panel /> gets its own DraftBuffer
  template: \`
    <p>Api: {{ settings.baseUrl }} · Cart items: {{ cart.items().length }}</p>
    <p>Parent panel draft: {{ parentDraft ? 'present' : 'none' }}</p>
  \`,
})
export class EditorPanel {
  // 4. inject() works cleanly in field initializers during construction
  protected readonly settings = inject(API_SETTINGS);
  protected readonly cart = inject(CartStore);
  protected readonly localDraft = inject(DraftBuffer);
  protected readonly parentDraft = inject(DraftBuffer, { optional: true, skipSelf: true });
}
`,
      practice: "Add `readonly instanceId = crypto.randomUUID()` to both `CartStore` and `DraftBuffer`, then render two `<app-editor-panel />` components side by side in `App`. Confirm `CartStore` shows the same UUID everywhere while `DraftBuffer` creates a unique UUID per panel. Remove `{ optional: true }` from `parentDraft` temporarily to observe the `NullInjectorError` it prevents.",
      teach: "Explain what Dependency Injection does, compare `@Service()` vs component `providers: [...]` to ASP.NET Core lifetimes, and explain why `InjectionToken` exists for configuration interfaces.",
      analogy: "Calling `inject(Tool)` is asking a workshop for a tool. You check your own workbench (`ElementInjector`) first, glance up at your supervisor's bench (`skipSelf`), and if it's still not there, walk to the central warehouse (`EnvironmentInjector` root).",
      pitfalls: [
        "Calling `inject(MyService)` inside a button `(click)` method or `setTimeout` instead of capturing `private readonly svc = inject(MyService)` as a class field.",
        "Forgetting `{ optional: true }` when asking if an ancestor provides a service—causing a runtime `NullInjectorError` crash when rendered standalone.",
        "Exposing writable `signal` properties publicly on a service instead of `.asReadonly()`, letting random components overwrite shared state unpredictably.",
        "Note on projection: `providers` exposes a service to projected `<ng-content />` children, whereas `viewProviders` hides it from projected children."
      ],
      quiz: [
        { q: "Where is calling `inject(CartStore)` valid?", a: ["Inside a `(click)` method handler", "In a class field initializer, constructor, factory function, or functional route guard", "Inside an `async` callback after `await`", "In any static helper function at runtime"], c: 1, why: "`inject()` requires Angular's active injection context, which runs during class instantiation and functional router/HTTP setup." },
        { q: "Two sibling `<app-editor-panel />` tags each list `DraftBuffer` in `@Component({ providers: [DraftBuffer] })`. How many `DraftBuffer` instances are created?", a: ["One shared singleton", "Two independent instances, each destroyed when its panel leaves the screen", "Zero unless added to `main.ts`", "Compile error"], c: 1, why: "Providing on `@Component` attaches one instance to each element's `ElementInjector`." },
        { q: "Why use `new InjectionToken<ApiSettings>(...)` instead of `inject(ApiSettings)` directly?", a: ["Interfaces make injection faster at runtime", "TypeScript interfaces are erased during compilation, so Angular needs a runtime token object to look up", "`@Service()` forbids interfaces", "Tokens automatically encrypt strings"], c: 1, why: "TypeScript `interface` types vanish in JavaScript output; an `InjectionToken` gives Angular a real runtime key." }
      ]
    },
    {
      id: 'routing', title: 'Routing, URL inputs and lazy loading', level: 1, mins: 35,
      why: "Real web apps have shareable URLs (`/products/42?tab=reviews`) and must keep initial downloads fast. Angular's Router turns a Single-Page Application into bookmarkable views, maps URL parameters directly into signal inputs, and downloads heavy sub-pages only when visited.",
      terms: [
        ['SPA (Single-Page Application)', 'A web app that updates the URL and swaps components in place inside the browser without reloading the entire HTML document.'],
        ['`<router-outlet />`', 'The placeholder tag where Angular renders whichever page component matches the current browser URL.'],
        ['Path vs query params', 'Required URL segments (`/products/:id`) versus optional key-value filters after `?` (`?tab=reviews`).'],
        ['Lazy loading (`loadComponent`)', 'Splitting a route into a separate JS file chunk that downloads only when the user navigates to it.']
      ],
      points: [
        "Angular configures pages as a **`Routes` array**, registered in `app.config.ts` with `provideRouter(routes, withComponentInputBinding(), withViewTransitions())`, and displays the active route component immediately below **`<router-outlet />`**.",
        "Always link internally using **`routerLink`** (and `routerLinkActive=\"on\"` to highlight the active nav link), never `<a href=\"/products/42\">`—a plain `href` forces a full browser page reload and wipes all in-memory signals!",
        "Enabling **`withComponentInputBinding()`** binds URL path parameters (`:id`), query strings (`?tab=reviews`), and route `title` / resolved data automatically into matching **`input()` signals** on the routed component—no manual route-param parsing needed.",
        "**Keep initial bundle size small**: use **`loadComponent: () => import('./product-detail').then(m => m.ProductDetail)`** (or `loadChildren`) instead of static `component: ProductDetail`. The bundler emits a separate JS file chunk downloaded only on visit.",
        "**First-match wins**: Angular walks `routes` top to bottom and stops at the first matching pattern. Put specific routes (`products/:id`) before catch-all fallbacks (`path: '**'`).",
        "Attaching `providers: [...]` on a route creates a route-level `EnvironmentInjector` shared across its child pages and cleaned up when navigating elsewhere."
      ],
      code: `
// app.routes.ts + app.config.ts + product-detail.ts
import { Component, input } from '@angular/core';
import { Routes, RouterLink, RouterLinkActive, RouterOutlet, provideRouter, withComponentInputBinding, withViewTransitions } from '@angular/router';

// 1. Lazy-loaded destination component (normally in its own file: ./product-detail.ts)
@Component({
  selector: 'app-product-detail',
  template: \`
    <h2>Product #{{ id() }}</h2>
    <p>Active tab: {{ tab() }}</p>
  \`,
})
export class ProductDetail {
  // With withComponentInputBinding(), URL :id and ?tab=... populate input() signals automatically
  readonly id = input.required<string>();     // matched from /products/:id
  readonly tab = input('overview');           // defaults to 'overview' if ?tab is absent
}

// 2. Application shell keeping navigation bar fixed while <router-outlet /> swaps pages
@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: \`
    <nav aria-label="Primary">
      <a routerLink="/products/42" [queryParams]="{ tab: 'reviews' }" routerLinkActive="on">
        Keyboard #42
      </a>
    </nav>
    <router-outlet />
  \`,
})
export class AppShell {}

// 3. Route table checked from top to bottom (wildcard '**' must come last!)
export const routes: Routes = [
  { path: '', redirectTo: '/products/42', pathMatch: 'full' },
  {
    path: 'products/:id',
    loadComponent: () => import('./product-detail').then(m => m.ProductDetail),
    title: 'Product',
  },
  { path: '**', redirectTo: '/products/42' },
];

// 4. Enable router + input binding + smooth browser view transitions in appConfig
export const routerProviders = [
  provideRouter(routes, withComponentInputBinding(), withViewTransitions()),
];
`,
      practice: "Configure `children` sub-routes under `products/:id` (`overview` and `reviews`), place a second `<router-outlet />` inside `ProductDetail`, and open the browser DevTools **Network** tab (filtered to JS). Click your `routerLink` and watch the lazy chunk download only on navigation.",
      teach: "Explain what `<a routerLink=\"...\">` avoids compared to `<a href=\"...\">`, how `withComponentInputBinding()` simplifies reading URL parameters, and why `loadComponent` speeds up initial page loads.",
      analogy: "Routing is a building directory paired with lazy-loaded rooms. The lobby never hauls furniture into Room 42 (`loadComponent`) until a visitor actually clicks the door—and `withComponentInputBinding()` slips the visitor's badge (`:id`) straight into the room as an `input()` signal.",
      pitfalls: [
        "Putting `{ path: '**', ... }` at the top of `routes`—because first-match wins, it catches every URL in the app.",
        "Writing `href=\"/products/42\"` instead of `routerLink=\"/products/42\"`, restarting the whole Angular app on every click.",
        "Forgetting `withComponentInputBinding()` in `provideRouter(...)`, leaving route param `input()` signals `undefined`.",
        "Also statically importing `ProductDetail` at the top of `app.routes.ts`: bundlers see the eager import and lose lazy code splitting."
      ],
      quiz: [
        { q: "What does `withComponentInputBinding()` automate when enabled in `provideRouter`?", a: ["Encrypts URL parameters", "Binds URL path params, query params, and resolved data directly into component `input()` signals", "Reloads CSS files on navigation", "Downloads all lazy routes at startup"], c: 1, why: "Route values flow directly into matching `input()` properties without manually reading `ActivatedRoute`." },
        { q: "Why prefer `loadComponent: () => import('./admin').then(m => m.Admin)` for secondary pages?", a: ["It runs the page in a background worker", "The compiler puts `Admin` in a separate JS file loaded only when visited", "It enables SSR automatically", "It shares one `Admin` instance everywhere"], c: 1, why: "Dynamic `import()` enables code splitting so users only download pages they actually open." },
        { q: "Where must the catch-all `{ path: '**', ... }` route be placed?", a: ["First in `routes`", "Last in `routes`, because matching stops at the first matching path", "Only inside `children`", "Before `redirectTo`"], c: 1, why: "Routes match top-to-bottom; any route listed after `**` would be unreachable." }
      ]
    },
    {
      id: 'forms', title: 'Signal Forms, validation and accessible errors', level: 1, mins: 40,
      why: "Nearly every app collects user input—sign-up forms, product editors, checkouts—with conditional rules and clear error feedback. Angular **Signal Forms** (`@angular/forms/signals`) wrap a single `signal(...)` data model in a type-safe validation schema, keeping DOM inputs, errors, and accessibility attributes automatically in sync.",
      terms: [
        ['Field vs FieldState (`f.name` vs `f.name()`)', '`productForm.name` is the binding reference passed to `[formField]`; calling `productForm.name()` returns its live status signals (`touched()`, `invalid()`, `errors()`).'],
        ['`touched()`', 'Becomes `true` once a user has visited and left an input (blur) or clicked Submit—prevents yelling "Required!" before they even start typing.'],
        ['Validation schema', 'Rules passed to `form(model, s => ...)` (`required`, `min`, conditional `applyWhen`, custom `validate`) checking correctness in one place.'],
        ['`aria-invalid` & `aria-describedby`', 'Standard HTML accessibility attributes telling screen readers when an input is in error (`aria-invalid="true"`) and which `<p id="...">` holds the error text (`aria-describedby`).']
      ],
      points: [
        "Start from a **non-nullable `signal` model** (use empty defaults like `''`, `0`, `false` instead of `null`), then wrap it with **`form(this.model, s => ...)`** and bind `<input>` controls using **`[formField]=\"productForm.name\"`**.",
        "Because `[formField]` manages `value`, `disabled`, `readonly`, `hidden`, `name`, and validation boundaries directly, never put conflicting `[value]`, `[disabled]`, `min`, or `max` attributes on the HTML `<input>` itself.",
        "Distinguish **field reference** vs **state check**: pass `productForm.name` (no `()`) into `[formField]`, and call **`productForm.name()`** (with `()`) whenever reading `.touched()`, `.invalid()`, `.hidden()`, or `.errors()`.",
        "Declare rules cleanly inside the schema callback: **`required()`**, **`min()`**, **`email()`**, **`applyWhen(s.discount, condition, rules)`** for conditional fields (`hidden()` becomes `true` when skipped!), `applyEach()` for array items, and **`validate()`** (returning `{ kind, message }` on failure or `undefined` when valid).",
        "Handle form submit with `novalidate` on `<form>` (so browser default tooltips don't clash with your UI) and **`submit(this.productForm, async () => { ... })`**: `submit()` automatically marks all fields `touched` so errors appear if invalid, and runs your `async` save callback only when valid.",
        "Wire accessible errors with `<label for=\"...\">`, `[attr.aria-invalid]`, `[attr.aria-describedby]`, and `role=\"alert\"` on error text so keyboard and screen-reader users hear validation problems immediately."
      ],
      code: `
// product-form.ts — Signal Forms schema, conditional rule, submit() and ARIA wiring
import { Component, signal } from '@angular/core';
import { FormField, applyWhen, form, min, required, submit, validate } from '@angular/forms/signals';

@Component({
  selector: 'app-product-form',
  imports: [FormField],
  template: \`
    <!-- novalidate disables inconsistent browser bubbles; we control validation UI -->
    <form (submit)="onSubmit(); $event.preventDefault()" novalidate>
      <label for="prod-name">Name</label>
      <!-- [formField] receives field node WITHOUT (); reading state WITH () -->
      <input id="prod-name" [formField]="productForm.name"
             [attr.aria-invalid]="productForm.name().touched() && productForm.name().invalid()"
             [attr.aria-describedby]="productForm.name().touched() && productForm.name().errors().length ? 'name-err' : null" />
      @if (productForm.name().touched() && productForm.name().errors().length) {
        <p id="name-err" role="alert">{{ productForm.name().errors()[0].message }}</p>
      }

      <label for="prod-price">Price</label>
      <input id="prod-price" type="number" [formField]="productForm.price"
             [attr.aria-invalid]="productForm.price().touched() && productForm.price().invalid()" />
      @if (productForm.price().touched() && productForm.price().errors().length) {
        <p role="alert">{{ productForm.price().errors()[0].message }}</p>
      }

      <label><input type="checkbox" [formField]="productForm.onSale" /> On sale</label>

      <!-- hidden() is managed declaratively by applyWhen in the schema below -->
      @if (!productForm.discount().hidden()) {
        <label for="prod-disc">Discount %</label>
        <input id="prod-disc" type="number" [formField]="productForm.discount" />
      }

      <button type="submit" [disabled]="productForm().invalid()">Save</button>
    </form>
  \`,
})
export class ProductForm {
  // 1. Single source-of-truth model using non-nullable defaults ('', 0, false)
  protected readonly model = signal({ name: '', price: 0, onSale: false, discount: 0 });

  // 2. Validation schema paired with the model
  protected readonly productForm = form(this.model, (s) => {
    required(s.name, { message: 'Name is required' });
    min(s.price, 0.01, { message: 'Price must be positive' });

    // Discount rule only applies when onSale is checked
    applyWhen(s.discount, ({ valueOf }) => valueOf(s.onSale), (disc) => {
      min(disc, 1, { message: 'Discount must be at least 1%' });
    });

    // Custom rule: return undefined when valid
    validate(s.name, ({ value }) =>
      value().trim().toLowerCase() === 'test'
        ? { kind: 'reserved', message: 'Choose a real product name' }
        : undefined);
  });

  protected onSubmit(): void {
    // 3. submit() touches every field, displays errors if invalid, else runs async callback
    submit(this.productForm, async () => {
      console.log('Submitting validated model:', this.model());
    });
  }
}
`,
      practice: "Extend `ProductForm` by adding `sku: ''` to `model`, validating it with `pattern(s.sku, /^[A-Z]{3}-\\d{3}$/, { message: 'Use format ABC-123' })`, and adding a cross-field `validate()` rule forbidding a discount above `50` when `price < 20`. Submit with invalid inputs and confirm errors display on all fields without running `console.log`.",
      teach: "Explain the difference between `productForm.name` and `productForm.name()`, why errors usually check `.touched()`, and how `aria-invalid` + `aria-describedby` help screen-reader users.",
      analogy: "Signal Forms turn your form into one live blueprint wired straight to a `signal` model. Passing `productForm.name` to `[formField]` plugs the gauge into the `<input>`, while calling `productForm.name()` reads the gauge dials (`touched()`, `invalid()`, `errors()`).",
      pitfalls: [
        "Forgetting parentheses when reading field state: writing `form.name.errors()` instead of `form.name().errors()`.",
        "Putting `null` inside the starting `signal({ name: null })` instead of `''` or `0`.",
        "Adding `[disabled]`, `[value]`, `min`, or `max` HTML attributes onto an `<input [formField]=\"...\">`—rules belong in the `form()` schema.",
        "Returning `null` instead of `undefined` when a custom `validate()` check passes, or working in an older app where you'll encounter **Reactive Forms** (`FormGroup`, `Validators`) which do the same model-driven validation over RxJS instead of Signals."
      ],
      quiz: [
        { q: "How do you read whether `productForm.name` has been touched by the user?", a: ["`productForm.name.touched()`", "`productForm.name().touched()`", "`productForm().name.touched`", "`productForm.name.get('touched')`"], c: 1, why: "Calling the field (`productForm.name()`) returns its `FieldState`, exposing `.touched()` and `.errors()` signals." },
        { q: "Where should a minimum numeric rule live for an `<input type=\"number\" [formField]=\"productForm.price\">`?", a: ["As HTML `min=\"1\"` directly on the input", "Inside the `form()` schema with `min(s.price, 1)`", "Inside `(blur)` handler", "Inside `index.html`"], c: 1, why: "`[formField]` manages input attributes directly and relies on the schema so logic and UI stay unified." },
        { q: "What does `submit(this.productForm, async () => ...)` do before running your callback?", a: ["Resets every input to empty", "Marks every field `touched` so all missing/invalid messages appear, and skips the callback unless valid", "Calls `fetch()` automatically", "Removes ARIA attributes"], c: 1, why: "Users clicking Save right away immediately see which fields need attention, and invalid forms never run the save callback." }
      ]
    },
    // ---------------- Advanced ----------------
    {
      id: 'rxjs', title: 'Async event streams: RxJS and Signals interop', level: 2, mins: 40,
      why: "Signals excel at holding *current values right now* (quantity, total, open/closed). **RxJS** excels at coordinating **events over time**—waiting 300 ms after typing stops, cancelling outdated search requests, or ignoring an accidental double-click on Pay. Understanding `Observable` streams now makes Angular's `HttpClient` and router events crystal clear.",
      terms: [
        ['`Observable`', 'A lazy stream of values arriving over time (zero, one, or many). A **cold** Observable does nothing until `.subscribe()` (or `firstValueFrom`) listens to it.'],
        ['Operator & `.pipe(...)`', 'A chainable transformation step (`debounceTime`, `switchMap`) inside `.pipe(...)` that filters, delays, or cancels stream events.'],
        ['`switchMap` vs `exhaustMap`', '`switchMap` cancels the previous unfinished async call when a new event arrives (typeahead search); `exhaustMap` ignores new clicks until the running call finishes (Pay button).'],
        ['`toSignal()` / `toObservable()`', 'Angular bridges converting an `Observable` stream into a signal (with automatic cleanup) and vice versa.']
      ],
      points: [
        "**Signals vs Observables**: a Signal always holds *one synchronous current value*. An **Observable** models *asynchronous events over time*. Angular's `HttpClient` methods return **cold Observables**—just like a blueprint, an HTTP call does not execute until subscribed to (or converted with `firstValueFrom()` / `toSignal()`).",
        "Shape event timing with **`.pipe(...)`** operators: `debounceTime(300)` waits for 300 ms of keyboard silence before emitting; `distinctUntilChanged()` drops duplicate queries.",
        "**Choosing the right async flattening operator** when a new event arrives while the previous request is still pending:",
        "**`switchMap`**: cancels the older in-flight inner observable and switches to the latest—essential for typeahead search so slow earlier replies never overwrite newer results.",
        "**`exhaustMap`**: drops new triggers while one inner observable is running—essential for Checkout / Submit buttons to block double charges.",
        "**`concatMap`** queues requests strictly in order (sequential saves); **`mergeMap`** runs all concurrently (order doesn't matter).",
        "**Clean up automatically**: calling `.subscribe()` without cleanup leaks background listeners after navigation. Always pair `.pipe(takeUntilDestroyed())` (inside constructors/field initializers) or bridge streams cleanly to signals with **`toSignal(obs$, { initialValue })`**."
      ],
      code: `
// search-bar.ts — Observable -> Signal interop, switchMap cancellation & exhaustMap lock
import { Component, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { Observable, Subject, catchError, debounceTime, distinctUntilChanged, exhaustMap, of, switchMap } from 'rxjs';

// 1. Standalone helper verified at runtime by tools/verify-angular.mjs
export function compareFlattening(
  makeRequest: (tag: string) => Observable<string>,
  triggers$: Observable<string>,
  mode: 'switch' | 'exhaust',
) {
  return triggers$.pipe(
    mode === 'switch' ? switchMap(makeRequest) : exhaustMap(makeRequest),
  );
}

@Component({
  selector: 'app-search-bar',
  template: \`
    <input type="search" [value]="query()" (input)="onQueryInput($event)" />
    <p>{{ results().length }} matches · Checkout: {{ status() }}</p>
    <!-- Subject.next() pushes each click into the Observable stream -->
    <button type="button" (click)="payClicks$.next()">Pay now</button>
  \`,
})
export class SearchBar {
  protected readonly query = signal('');
  protected readonly status = signal('idle');
  protected readonly payClicks$ = new Subject<void>();

  // 2. Signal -> Observable for debounce + switchMap -> back to Signal (auto-unsubscribed!)
  protected readonly results = toSignal(
    toObservable(this.query).pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(q => q.trim() ? this.fakeSearch(q) : of([])),
      catchError(() => of([])),
    ),
    { initialValue: [] as string[] },
  );

  constructor() {
    // 3. exhaustMap ignores rapid extra clicks until the active payment call completes
    this.payClicks$.pipe(
      exhaustMap(() => {
        this.status.set('paying');
        return of('paid').pipe(catchError(() => of('failed')));
      }),
      takeUntilDestroyed(),                // stops listening when SearchBar leaves the page
    ).subscribe(res => this.status.set(res));
  }

  protected onQueryInput(e: Event): void {
    this.query.set((e.target as HTMLInputElement).value);
  }

  private fakeSearch(q: string) {
    return of([\`Result for \${q}\`]);
  }
}
`,
      practice: "Open the **TypeScript playground** (`#/play/ts`), pick **RxJS switchMap vs exhaustMap**, and run it to compare how `switchMap` cancels `'typing ke'` while `exhaustMap` drops `'accidental double-click'`. Then swap `'switch'` and `'exhaust'` in `compareFlattening` to predict what prints.",
      teach: "Explain in plain words what makes an `Observable` different from a `Signal`, when to pick `switchMap` vs `exhaustMap`, and why `toSignal()` removes manual `.unsubscribe()` calls.",
      analogy: "`switchMap` is a short-order cook who bins a half-made sandwich the second a customer shouts 'actually, make it turkey!'. `exhaustMap` is an elevator call button: mashing it five times while the elevator is moving will not summon five elevators.",
      pitfalls: [
        "Using `mergeMap` for live search: a slower response for `'la'` arriving after `'laptop'` overwrites the screen with stale results.",
        "Calling `.subscribe(...)` without `takeUntilDestroyed()`, leaving ghost timers or listeners running after navigating away.",
        "Forgetting `{ initialValue }` on `toSignal(obs$)`: without it, the signal starts as `undefined` (`T | undefined`) until the first event emits.",
        "Nesting `.subscribe()` inside another `.subscribe()` callback instead of chaining flatly with `switchMap` or `exhaustMap`."
      ],
      quiz: [
        { q: "Which operator cancels an earlier search HTTP request the moment the user types another letter?", a: ["`mergeMap`", "`concatMap`", "`switchMap`", "`exhaustMap`"], c: 2, why: "`switchMap` unsubscribes from the previous inner observable (aborting its HTTP request) whenever a new value arrives." },
        { q: "A user double-clicks a 'Place order' button. Which operator ignores extra clicks until the first request finishes?", a: ["`switchMap`", "`exhaustMap`", "`mergeMap`", "`debounceTime`"], c: 1, why: "`exhaustMap` ignores new upstream triggers while an inner observable is still running." },
        { q: "What does `takeUntilDestroyed()` automate?", a: ["Retrying network calls three times", "Automatically unsubscribing when the component or service is destroyed", "Turning signals into JSON", "Sorting array items"], c: 1, why: "It ties observable subscription lifetime to Angular's `DestroyRef` so no manual cleanup is needed." }
      ]
    },
    {
      id: 'http', title: 'HTTP, httpResource and talking to ASP.NET Core', level: 2, mins: 45,
      why: "This is where Angular connects to your ASP.NET Core backend and database. Angular gives you **`httpResource`** for reactive `GET` data loading and **`HttpClient`** (with middleware-like interceptors and built-in XSRF safety) for `POST`/`PUT`/`DELETE` mutations and structured `ProblemDetails` error handling.",
      terms: [
        ['`httpResource()`', 'A signal-based data loader for `GET` requests: tracks signals inside its URL callback, cancels stale requests, and exposes `.isLoading()`, `.error()`, and `.value()`.'],
        ['`HttpInterceptorFn`', 'A functional middleware hook running on every outgoing request and incoming response—used to attach request IDs, auth headers, or handle errors centrally.'],
        ['CORS vs Dev Proxy', 'Browsers block `localhost:4200` from reading `localhost:5000` unless ASP.NET Core enables **CORS** (`AddCors`), OR Angular CLI proxies `/api` via `proxy.conf.json` during dev.'],
        ['`ProblemDetails` & XSRF', 'RFC 9457 `ProblemDetails` is ASP.NET Core\'s standard JSON error payload (`title` + `errors`); **XSRF** (cookie `XSRF-TOKEN` → header `X-XSRF-TOKEN`) blocks forged cross-site POST forms.']
      ],
      points: [
        "**Reactive `GET` reads with `httpResource(() => '/api/products?q=' + query())`**: whenever a signal read inside the callback changes, Angular automatically cancels the older request and fetches the new URL (return `undefined` to pause fetching).",
        "Always check `.hasValue()` or `.error()` before calling **`products.value()`**—reading `.value()` directly when a request failed throws an error.",
        "**Mutations with `HttpClient`**: call `post`, `put`, `patch`, or `delete` for writes. As you saw in the RxJS lesson, `HttpClient` returns a **cold `Observable`**, so nothing hits the network until you await `firstValueFrom(...)` or subscribe.",
        "**`HttpInterceptorFn` middleware**: pass `provideHttpClient(withInterceptors([requestIdInterceptor]))` in `appConfig`. Because `HttpRequest` objects are immutable, clone them with `req.clone({ setHeaders: ... })` before forwarding to `next(...)`.",
        "**Map ASP.NET Core `ProblemDetails`**: catch `HttpErrorResponse` and pull out `title` and `errors` (e.g. `{ Price: ['Must be positive'] }`) into a typed `ApiError` so each message renders right under its matching input field.",
        "**Local setup & security**: configure `proxy.conf.json` in Angular CLI (or allow `http://localhost:4200` in ASP.NET Core `AddCors`). TypeScript utilities like `Omit<Product, 'id'>` and `satisfies CreateProduct` ensure your payload type-checks strictly against the backend DTO without throwing away inferred literal types."
      ],
      code: `
// api-error.ts + products-page.ts
import { Component, inject, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHandlerFn, HttpRequest, httpResource } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export interface Product { id: number; name: string; price: number }
export type CreateProduct = Omit<Product, 'id'>;   // reuses Product without the server-assigned id

// 1. Typed wrapper turning ASP.NET Core RFC 9457 ProblemDetails JSON into form errors
export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly fieldErrors: Record<string, string[]> = {},
  ) {
    super(message);
  }
}

export function toApiError(err: unknown): ApiError {
  if (err instanceof HttpErrorResponse) {
    const body = err.error as { title?: string; errors?: Record<string, string[]> } | null;
    return new ApiError(body?.title ?? \`HTTP \${err.status}\`, err.status, body?.errors ?? {});
  }
  return new ApiError('Unexpected network error', 0);
}

// 2. Functional interceptor (browser equivalent of ASP.NET Core middleware)
export function requestIdInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {
  return next(req.clone({ setHeaders: { 'X-Request-Id': crypto.randomUUID() } }));
}

@Component({
  selector: 'app-products-page',
  template: \`
    @if (products.isLoading()) { <p>Loading…</p> }
    @else if (products.error()) { <p role="alert">Failed to load products.</p> }
    @else if (products.hasValue()) {
      <ul>
        @for (p of products.value(); track p.id) { <li>{{ p.name }} — {{ p.price }}</li> }
      </ul>
    }

    <form (submit)="addProduct($event)">
      <label for="new-name">Name</label>
      <input id="new-name" [value]="name()" (input)="onNameInput($event)"
             [attr.aria-invalid]="!!fieldErrors()['Name']?.length"
             [attr.aria-describedby]="fieldErrors()['Name']?.length ? 'new-name-err' : null" />
      @if (fieldErrors()['Name']?.[0]; as msg) { <p id="new-name-err" role="alert">{{ msg }}</p> }

      <label for="new-price">Price</label>
      <input id="new-price" [value]="price()" (input)="onPriceInput($event)"
             [attr.aria-invalid]="!!fieldErrors()['Price']?.length"
             [attr.aria-describedby]="fieldErrors()['Price']?.length ? 'new-price-err' : null" />
      @if (fieldErrors()['Price']?.[0]; as msg) { <p id="new-price-err" role="alert">{{ msg }}</p> }

      <button type="submit" [disabled]="saving()">Add</button>
      @if (submitError() && !fieldErrors()['Name'] && !fieldErrors()['Price']) {
        <p role="alert">{{ submitError() }}</p>
      }
    </form>
  \`,
})
export class ProductsPage {
  private readonly http = inject(HttpClient);
  // 3. Reactive GET loader (cancels stale requests automatically)
  readonly products = httpResource<Product[]>(() => '/api/products');

  protected readonly name = signal('');
  protected readonly price = signal('');
  protected readonly saving = signal(false);
  protected readonly submitError = signal<string | null>(null);
  protected readonly fieldErrors = signal<Record<string, string[]>>({});

  protected onNameInput(e: Event): void {
    this.name.set((e.target as HTMLInputElement).value);
  }

  protected onPriceInput(e: Event): void {
    this.price.set((e.target as HTMLInputElement).value);
  }

  protected async addProduct(e: Event): Promise<void> {
    e.preventDefault();
    this.saving.set(true);
    this.submitError.set(null);
    this.fieldErrors.set({});
    try {
      // 4. Cold Observable executed via firstValueFrom; 'satisfies' verifies DTO fields
      await firstValueFrom(this.http.post<Product>('/api/products', {
        name: this.name(),
        price: Number(this.price()),
      } satisfies CreateProduct));
      this.name.set('');
      this.price.set('');
      this.products.reload();
    } catch (err) {
      const apiErr = toApiError(err);
      this.submitError.set(apiErr.message);
      this.fieldErrors.set(apiErr.fieldErrors);
    } finally {
      this.saving.set(false);
    }
  }
}
`,
      practice: "Open the **TypeScript playground** (`#/play/ts`) and run **ASP.NET ProblemDetails mapper** to inspect how validation JSON maps into `fieldErrors`. Then connect `ProductsPage` to your local ASP.NET Core API via `proxy.conf.json`, submit `-5` for price, and watch `fieldErrors()['Price']` render directly next to the input.",
      teach: "Explain when to choose `httpResource` vs `HttpClient`, why calling `http.post(...)` alone sends nothing without awaiting `firstValueFrom()`, and how CORS / `proxy.conf.json` work.",
      analogy: "`httpResource` is a live order counter that rips up your old search slip the moment you ask for a different page. `HttpInterceptorFn` is the security gate every outgoing request and incoming response passes through automatically.",
      pitfalls: [
        "Calling `products.value()` in a template without `@if (products.hasValue())`—if the API failed, `.value()` throws.",
        "Calling `this.http.delete('/api/products/1')` and forgetting to await `firstValueFrom(...)` or subscribe—the cold `Observable` never fires.",
        "Mutating `req.headers` directly inside an interceptor instead of `req.clone(...)`.",
        "Allowing only Vite's port `:5173` in ASP.NET Core `AddCors()` while Angular's dev server runs on `:4200`."
      ],
      quiz: [
        { q: "What happens if you read `userResource.value()` when its HTTP request ended in error?", a: ["It returns `undefined`", "It throws an error because the resource status is `'error'`", "It retries once", "It logs a string"], c: 1, why: "Check `hasValue()` or `error()` first before reading `.value()`." },
        { q: "Why does `this.http.delete('/api/products/1')` do nothing if you ignore the returned value?", a: ["Browser blocks `DELETE`", "`HttpClient` returns a cold `Observable` that only sends when subscribed (or awaited via `firstValueFrom`)", "Interceptors block it", "CORS forbids `DELETE`"], c: 1, why: "Cold observables wait for a subscriber before issuing the HTTP call." },
        { q: "Where should an Authorization header or `X-Request-Id` be attached across every API request?", a: ["Inside every component's template", "In a functional `HttpInterceptorFn` registered via `provideHttpClient(withInterceptors([...]))`", "Inside `index.html`", "Inside `router.navigate`"], c: 1, why: "Functional interceptors handle cross-cutting headers and error logging in one place." }
      ]
    },
    {
      id: 'guards', title: 'Route guards, resolvers and @boundary recovery', level: 2, mins: 40,
      why: "Production apps need three layers of resilience: keeping unauthenticated users off private screens, preparing route metadata cleanly, and isolating unexpected widget crashes so one broken chart never blanks out an entire page. Crucially, browser route checks guide user experience—your ASP.NET Core API still enforces real security.",
      terms: [
        ['`CanActivateFn` / `CanMatchFn`', 'Functional route guards that allow (`true`), deny (`false`), or redirect (`RedirectCommand`) before displaying a route.'],
        ['`ResolveFn`', 'A function fetching small route metadata (such as a page title) before the destination component renders.'],
        ['Security boundary', 'Browser JS can always be inspected or bypassed in DevTools—only your backend server truly enforces permissions.'],
        ['`@boundary` / `@error`', 'Angular template error-boundary blocks (v22.2+) that catch render errors locally and provide `$reset()` to retry.']
      ],
      points: [
        "**Part 1 — Route Guards (`CanActivateFn` & `CanMatchFn`)**: guards are plain functions running inside an injection context, so use `inject()` directly. Return `true` to allow, `false` to block, or `new RedirectCommand(router.parseUrl('/login'))` to redirect cleanly without a full reload.",
        "`CanMatchFn` decides whether a route definition even *matches* (great for role-specific routes sharing `/home`, falling through to the next route on `false`), while `CanActivateFn` runs after matching. Notice that async guards in `canActivate: [a, b]` execute **concurrently**—never assume `a` finishes before `b` starts.",
        "**Security reality check**: route guards only shape **UI navigation**. Anyone can call `/api/admin/...` directly using `curl` or `fetch`, so your ASP.NET Core endpoints **must** enforce `RequireAuthorization()` and user ownership checks.",
        "**Part 2 — Route Resolvers (`ResolveFn`)**: preloads lightweight data (such as dynamic page titles) into route input bindings before rendering. Avoid slow blocking API calls in resolvers without loading indicators, because navigation freezes until the resolver finishes.",
        "**Part 3 — Error Boundaries (`@boundary` in Angular v22.2+)**: wrap risky third-party or data-dependent child components inside **`@boundary { ... } @error { ... }`** so a runtime throw in that widget renders a local fallback UI with a **`$reset()`** Retry button instead of breaking the whole screen."
      ],
      code: `
// protected.routes.ts + orders-shell.ts
import { Component, Service, inject, input, signal } from '@angular/core';
import { CanActivateFn, CanMatchFn, RedirectCommand, ResolveFn, Router, Routes } from '@angular/router';

@Service()
export class AuthSession {
  readonly signedIn = signal(false);
  readonly role = signal<'user' | 'admin'>('user');
}

// Part 1: Functional route guards run in an injection context (so inject() works)
export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthSession);
  const router = inject(Router);
  return auth.signedIn() ? true : new RedirectCommand(router.parseUrl('/login'));
};

export const adminMatchGuard: CanMatchFn = () => inject(AuthSession).role() === 'admin';

// Part 2: Route resolver binds its return value into 'title' route data / component input
export const titleResolver: ResolveFn<string> = (route) =>
  \`Order #\${route.paramMap.get('id') ?? '0'}\`;

// Part 3: @boundary isolates template render crashes locally and lets $reset() retry
@Component({
  selector: 'app-widget-crash',
  template: \`<p>{{ label() }}</p>\`,
})
export class RiskyWidget {
  readonly fail = input(false);
  protected label(): string {
    if (this.fail()) throw new Error('Chart plugin crashed');
    return 'Chart ready';
  }
}

@Component({
  selector: 'app-orders-shell',
  imports: [RiskyWidget],
  template: \`
    @boundary {
      <app-widget-crash [fail]="broken()" />
    } @error {
      <div role="alert">
        <p>Widget failed to render.</p>
        <button type="button" (click)="broken.set(false); $reset()">Retry</button>
      </div>
    }
  \`,
})
export class OrdersShell {
  protected readonly broken = signal(true);
}

export const protectedRoutes: Routes = [
  { path: 'orders/:id', component: OrdersShell, canActivate: [authGuard], resolve: { title: titleResolver } },
  { path: 'admin', component: OrdersShell, canMatch: [adminMatchGuard] },
];
`,
      practice: "Render `OrdersShell` with `broken` starting as `true`, watch the `@error` fallback appear instead of a white page, click Retry, and confirm `broken.set(false); $reset()` recovers the widget in place. Then test calling your protected ASP.NET Core `/api/orders` endpoint from `curl` without a token to confirm the backend still blocks unauthorized callers (`401`).",
      teach: "Explain when to pick `CanMatchFn` vs `CanActivateFn`, why route guards are UX rather than real security, and what `@boundary` + `$reset()` prevent.",
      analogy: "A route guard is a velvet rope guiding museum guests to the ticket counter (`RedirectCommand`), while ASP.NET Core `RequireAuthorization()` is the locked steel vault door. `@boundary` is a circuit breaker on one room's lights so one blown bulb never blacks out the building.",
      pitfalls: [
        "Believing `canActivate` protects server endpoints from direct `curl` or Postman calls.",
        "Placing `@boundary` inside a wrapper component around `<ng-content />` expecting it to catch errors from projected parent markup—wrap the component from the **parent** template instead.",
        "Expecting `guardB` in `canActivate: [guardA, guardB]` to wait for `guardA` to resolve first—async guards run concurrently.",
        "Putting slow, uncached database fetches inside a `ResolveFn` with zero spinner, making links feel frozen on click."
      ],
      quiz: [
        { q: "Why must ASP.NET Core still verify permissions even if Angular already guards `/admin` with `canActivate`?", a: ["Angular guards don't work on iOS", "Browser code runs on the user's machine and can be bypassed; only the backend enforces real security", "Guards only run once at build time", "Tokens expire in `<router-outlet>`"], c: 1, why: "Guards improve navigation flow for normal users; server policies stop direct API tampering." },
        { q: "How does `canMatch` returning `false` behave differently from `canActivate` returning `false`?", a: ["`canMatch` throws an immediate 404 error", "`canMatch` skips that route candidate so the router can match a later route sharing the same path", "`canMatch` disables lazy chunks", "No difference"], c: 1, why: "With `canMatch`, two routes can share `/home` (for example admin dashboard vs customer dashboard) cleanly." },
        { q: "Inside an `@boundary { ... } @error { ... }` block, what does calling `$reset()` do?", a: ["Reloads the entire browser tab", "Clears the caught error and tries rendering the `@boundary` subtree again", "Resets every service singleton", "Calls `Router.navigate(['/'])`"], c: 1, why: "`$reset()` resets the error boundary after you fix the underlying signal or state." }
      ]
    },
    {
      id: 'testing', title: 'Zoneless testing: components, routing and HTTP', level: 2, mins: 45,
      why: "Modern Angular tests run fast in **Vitest** inside **jsdom** (a simulated browser DOM in Node.js) without Zone.js. Instead of manually nudging change detection, your tests follow how real users interact: update inputs or dispatch clicks, wait for Angular's scheduler with `await fixture.whenStable()`, and assert on visible text and accessibility states.",
      terms: [
        ['Vitest & jsdom', 'Vitest is the fast test runner (`describe`/`it`/`expect`); jsdom provides simulated browser `document`/DOM elements in Node without launching Chrome.'],
        ['`TestBed`', 'Angular\'s testing sandbox for creating a component (`TestBed.createComponent`) with mocked services or test providers.'],
        ['`await fixture.whenStable()`', 'Pauses the test until Angular finishes rendering pending zoneless signal updates and microtasks cleanly.'],
        ['`HttpTestingController`', 'A test double intercepting `HttpClient` and `httpResource` calls so tests inspect exact requests and flush fake responses offline.']
      ],
      points: [
        "**Zoneless test rhythm (`Act -> await fixture.whenStable() -> Assert`)**: trigger a click, input event, or signal write, `await fixture.whenStable()` so Angular renders naturally, and assert on the DOM. Never manually force **`fixture.detectChanges()`**—manual detection masks missing signals and hides reactivity bugs.",
        "**Timing quirk with `httpResource`**: because `httpResource` queues a pending network task as soon as its effect runs, calling `await fixture.whenStable()` immediately would hang waiting for the network! Instead, call **`TestBed.tick()`** once right after `createComponent()` to send the request, flush it via **`http.expectOne(...).flush(...)`**, and *then* `await fixture.whenStable()`.",
        "**Testing HTTP APIs offline**: add `[provideHttpClient(), provideHttpClientTesting()]` to `TestBed.configureTestingModule`, assert request method/URL/body via `HttpTestingController`, flush realistic `200`/`201`/`400 ProblemDetails` responses, and always run **`http.verify()` in `afterEach`** to catch unexpected duplicate calls.",
        "**Testing routed pages**: use **`RouterTestingHarness.create()`** alongside real `provideRouter(routes, withComponentInputBinding())` rather than hand-mocking `Router`—it exercises real guards, URL parameters, and bindings together.",
        "**Assert like a user & screen reader**: query rendered text, semantic labels, and `[aria-invalid]` / `role=\"alert\"` instead of peeking into `private`/`protected` component fields. Use CDK Component Harnesses (`TestbedHarnessEnvironment`) for `@angular/aria` or Material widgets."
      ],
      code: `
// products-page.spec.ts — Vitest + TestBed + HttpTestingController against HTTP lesson
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { beforeEach, afterEach, describe, expect, it } from 'vitest';
import { ProductsPage } from './products-page';

describe('ProductsPage', () => {
  let http: HttpTestingController;

  beforeEach(() => {
    // 1. Provide testing HTTP backend so no real network calls escape
    TestBed.configureTestingModule({
      imports: [ProductsPage],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());         // fail if any unexpected/unflushed HTTP call remains

  it('shows server validation error next to the price field', async () => {
    const fixture = TestBed.createComponent(ProductsPage);
    TestBed.tick();                       // 2. Run httpResource effect to queue initial GET

    // 3. Flush initial GET BEFORE awaiting whenStable() (pending HTTP blocks stability!)
    http.expectOne('/api/products').flush([{ id: 1, name: 'Laptop', price: 1200 }]);
    await fixture.whenStable();

    const root = fixture.nativeElement as HTMLElement;
    expect(root.textContent).toContain('Laptop');

    // 4. Act: simulate user typing invalid negative price and submitting form
    const nameInput = root.querySelector('#new-name') as HTMLInputElement;
    const priceInput = root.querySelector('#new-price') as HTMLInputElement;
    nameInput.value = 'Broken';
    nameInput.dispatchEvent(new Event('input'));
    priceInput.value = '-5';
    priceInput.dispatchEvent(new Event('input'));
    root.querySelector('form')!.dispatchEvent(new Event('submit'));

    // 5. Assert exact POST payload and flush realistic ASP.NET Core 400 ProblemDetails
    const req = http.expectOne(r => r.method === 'POST' && r.url === '/api/products');
    expect(req.request.body).toEqual({ name: 'Broken', price: -5 });
    req.flush(
      { title: 'One or more validation errors occurred.', errors: { Price: ['Must be positive'] } },
      { status: 400, statusText: 'Bad Request' },
    );

    // 6. Wait for Signal updates from toApiError() to render into DOM
    await fixture.whenStable();

    expect(priceInput.getAttribute('aria-invalid')).toBe('true');
    expect(root.querySelector('#new-price-err')?.textContent).toContain('Must be positive');
  });
});
`,
      practice: "Extend this spec with a second `it(...)` verifying the happy path: flush a `201` response on `POST /api/products`, expect `httpResource.reload()` to issue a fresh `GET /api/products`, flush the updated 2-item list, and verify the new product name appears in the rendered DOM.",
      teach: "Explain why zoneless tests await `fixture.whenStable()` instead of calling `fixture.detectChanges()`, why `TestBed.tick()` precedes flushing an initial `httpResource`, and what `http.verify()` catches.",
      analogy: "`await fixture.whenStable()` is waiting at the pass until the kitchen finishes plating after you send an order. Reaching over the counter with `detectChanges()` forces one dish out manually, hiding whether the kitchen bell (`signal` / event) actually rang.",
      pitfalls: [
        "Calling `fixture.detectChanges()` in zoneless tests—it masks missing signal subscriptions that would break in production.",
        "Calling `await fixture.whenStable()` *before* flushing an in-flight `httpResource` request—the pending request deadlocks stability until `TestBed.tick()` + `.flush()` runs first.",
        "Omitting `afterEach(() => http.verify())`, missing duplicate or stray HTTP calls.",
        "Hand-mocking `Router` instead of exercising real routing and guards via `RouterTestingHarness`."
      ],
      quiz: [
        { q: "In zoneless Angular v22 tests, how should you wait for signal changes and DOM events to finish rendering?", a: ["Call `fixture.detectChanges()` in a loop", "Await `await fixture.whenStable()`", "Call `tick(100)` inside `fakeAsync`", "Replace `OnPush` with `Eager`"], c: 1, why: "`whenStable()` waits naturally for Angular's zoneless render scheduler and pending microtasks." },
        { q: "Why does `httpResource` inside a newly created component need `TestBed.tick()` + `http.expectOne().flush()` *before* `await fixture.whenStable()`?", a: ["`whenStable()` waits for pending HTTP resource tasks to settle first", "`TestBed.tick()` compiles the template", "Vitest blocks HTTP until ticked twice", "Signals don't work in `beforeEach`"], c: 0, why: "`httpResource` registers a pending task while fetching; flushing the mock response unblocks stability cleanly." },
        { q: "What does `httpTesting.verify()` check in `afterEach`?", a: ["C# DTO compatibility", "That no unexpected or un-flushed HTTP requests are still open", "That CSS animations stopped", "That CORS is disabled"], c: 1, why: "It catches accidental duplicate API calls or requests your test forgot to assert and flush." }
      ]
    },
    // ---------------- Expert ----------------
    {
      id: 'cd', title: 'Change detection and rendering performance', level: 3, mins: 45, viz: 'ngcd',
      why: "**Change detection** is how Angular checks your data and updates the browser DOM. Understanding how Angular moved from Zone.js top-down tree scans (`Eager`) to `OnPush` and **zoneless local Signal updates** explains both why modern Angular apps are fast—and what subtle mistakes still force extra work.",
      terms: [
        ['Change detection', 'The process that compares updated TypeScript state against templates and patches only changed parts of the browser DOM.'],
        ['`OnPush` vs legacy `Eager`', '`Eager` (with Zone.js) re-checks every component from root down on any event; `OnPush` (Angular 22 default) checks a component only when its inputs change, an event fires inside it, or a signal it reads changes.'],
        ['Reference equality (`Object.is`)', '`OnPush` checks whether an input points to a *new* object/array reference, ignoring in-place `.push()` mutations on the same object.'],
        ['`afterRenderEffect()`', 'Runs *after* Angular finishes updating the DOM, split into ordered `earlyRead` and `write` phases so measuring layout never causes thrashing.']
      ],
      points: [
        "**Legacy `Eager` (Zone.js)**: previously, Zone.js patched browser events (`click`, `setTimeout`, `fetch`), causing Angular to walk the entire component tree from root down—even components whose data never changed. (`ChangeDetectionStrategy.Default` is now deprecated and renamed `Eager`, while **`OnPush` is the Angular 22 default**.)",
        "**Zoneless + Signals**: when a signal updates in a zoneless app, Angular marks *only the exact template views* reading that signal as needing an update—skipping unrelated parents, siblings, and other branches completely.",
        "**Reference equality matters**: `OnPush` checks component inputs using **`Object.is`** (reference identity). Never mutate input arrays/objects in place (`items.push(x)`); produce a new copy (`[...items, x]`) so child views see the update.",
        "**Keep template expressions cheap**: never write `[items]=\"items().filter(...)\"` or inline `{ a: 1 }` object literals inside HTML bindings—they allocate a fresh array/object on *every* check! Compute once in **`computed()`**, which caches its result until `items()` or `query()` actually changes.",
        "**Safe DOM measurements (`afterRenderEffect`)**: because `effect()` runs *before* DOM updates flush, put DOM size/scroll reads and writes in `afterRenderEffect({ earlyRead, write })` so layout measurements stay accurate without forcing extra browser reflows (**layout thrashing**).",
        "Verify bottlenecks with **Angular DevTools** (flamegraph & change-detection highlights) instead of guessing, and virtualize lists of thousands of rows using **`@angular/cdk/scrolling`**."
      ],
      code: `
// catalog-view.ts — OnPush, memoized computed() filter, and safe reference updates
import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';

interface Product { readonly id: number; readonly name: string; readonly price: number }

@Component({
  selector: 'app-product-row',
  changeDetection: ChangeDetectionStrategy.OnPush,    // Angular 22 default; skips unaffected views
  template: \`<li>{{ product().name }} — {{ product().price }}</li>\`,
})
export class ProductRow {
  readonly product = input.required<Product>();
}

@Component({
  selector: 'app-catalog-view',
  imports: [ProductRow],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: \`
    <input type="search" [value]="query()" (input)="onQueryInput($event)" />
    <p>{{ visible().length }} shown</p>
    <ul>
      <!-- Binds to cached 'visible()' signal, NEVER items().filter(...) inside template -->
      @for (p of visible(); track p.id) {
        <app-product-row [product]="p" />
      }
    </ul>
  \`,
})
export class CatalogView {
  readonly items = input.required<readonly Product[]>();
  protected readonly query = signal('');

  // Re-filters ONLY when items() or query() changes
  protected readonly visible = computed(() => {
    const q = this.query().trim().toLowerCase();
    return q ? this.items().filter(p => p.name.toLowerCase().includes(q)) : this.items();
  });

  protected onQueryInput(e: Event): void {
    this.query.set((e.target as HTMLInputElement).value);
  }
}
`,
      practice: "Open the **Change detection explorer** interactive visualization above: click `Card B` in `Eager (Zone.js)`, `OnPush`, and `Zoneless + Signal`, then enable `Update shared CartSignal` and click `Card B` again. Explain why `App` and `ProductList` stay untouched only in `Zoneless + Signal` mode.",
      teach: "Explain how Signals allow Angular to refresh only `CartBadge` and `Card B` without Zone.js or walking down from `App`, and why `items.push()` breaks `OnPush` inputs.",
      analogy: "Legacy Zone.js change detection is a security guard checking every hotel room floor by floor whenever one guest rings a bell. `OnPush` + Signals is a direct switchboard: only the room whose wire buzzed lights up, and nobody knocks on any other door.",
      pitfalls: [
        "Calling `items().filter(...)` or constructing `{ ... }` inline inside templates—it creates a brand-new reference on every check and defeats `computed()` caching.",
        "Mutating an array in place before passing it to an `OnPush` child component (`Object.is` sees the exact same array reference and skips updating).",
        "Switching a slow component to `ChangeDetectionStrategy.Eager` instead of fixing a plain non-signal mutation bug.",
        "Measuring `getBoundingClientRect()` inside `effect()` (before DOM renders) instead of `afterRenderEffect()`."
      ],
      quiz: [
        { q: "Which `ChangeDetectionStrategy` is enabled by default in Angular 22?", a: ["`ChangeDetectionStrategy.Eager`", "`ChangeDetectionStrategy.OnPush`", "`ChangeDetectionStrategy.Manual`", "Zone polling"], c: 1, why: "Modern Angular defaults to `OnPush`, deprecating legacy `Default` in favor of explicit `Eager`." },
        { q: "In a zoneless app, a shared `cartCount` signal read only by `CartBadge` and `Card B` updates. Which views refresh?", a: ["Every component starting from `App`", "Only `CartBadge` and `Card B` (the views that read `cartCount`)", "Only `App` and `ProductList`", "None without `markForCheck()`"], c: 1, why: "Signals notify only consumer views that read them during rendering—skipping parents and siblings." },
        { q: "Why compute a filtered list with `computed()` rather than calling `items().filter(...)` inside `@for`?", a: ["Templates forbid calling `.filter()`", "Template calls re-run on every check and create a fresh array reference each time", "`computed()` calls the server automatically", "Loops only accept strings"], c: 1, why: "`computed()` caches the filtered array reference until `items()` or `query()` actually changes." }
      ]
    },
    {
      id: 'ssr', title: 'Deferrable views (@defer), SSR and hybrid rendering', level: 3, mins: 45,
      why: "Fast initial page loads use two tools together: breaking non-critical UI into on-demand **`@defer`** bundles, and choosing per route whether HTML renders in the browser (**CSR**), once at deploy time (**Prerender / SSG**), or per request on a Node server (**SSR**) with **hydration**.",
      terms: [
        ['CSR vs SSG vs SSR', '**CSR** builds HTML in the browser (`RenderMode.Client`); **SSG / Prerender** pre-builds static HTML at deploy (`RenderMode.Prerender`); **SSR** renders fresh HTML on Node per request (`RenderMode.Server`).'],
        ['Hydration', 'Attaching Angular click listeners and signal reactivity onto already-visible server HTML instead of deleting and redrawing the DOM.'],
        ['LCP & CLS', '**LCP** (Largest Contentful Paint) measures how fast the main above-the-fold hero appears; **CLS** (Cumulative Layout Shift) measures jarring layout jumps while chunks load.'],
        ['`@defer`', 'Template block that automatically splits standalone components into separate JS chunks and loads them on triggers (`on viewport`, `hydrate on interaction`).']
      ],
      points: [
        "**Lazy UI chunks with `@defer`**: wrap secondary below-the-fold widgets (charts, reviews) in `@defer (on viewport; prefetch on idle)`. Angular code-splits `<app-product-reviews />` into its own JS chunk automatically—as long as nothing else in the same file references `ProductReviews` outside `@defer`!",
        "**Protect LCP and CLS**: never defer above-the-fold hero content (hurts **LCP**), match **`@placeholder`** height (`min-height`) to the loaded widget to avoid **CLS** jumps, and use `(after 100ms; minimum 200ms)` on `@loading` to avoid spinner flashes.",
        "**Hybrid routing (`ServerRoute[]`)**: mix rendering modes per URL: `RenderMode.Prerender` for static catalog/marketing pages (`getPrerenderParams` lists known IDs), `RenderMode.Server` for dynamic SEO pages, and `RenderMode.Client` for user-private dashboards.",
        "**Incremental hydration (`provideClientHydration()`)**: enabled with event replay in Angular 22+. Combining **`@defer (on viewport; hydrate on interaction)`** renders HTML on the server for SEO/speed while keeping heavy JS asleep until the user clicks or scrolls to it.",
        "**Node server safety**: Node SSR has no browser `window`, `document`, or `localStorage`! Inject Angular's **`DOCUMENT`** token instead of global `document`, wrap browser-only DOM setup in **`afterNextRender()`**, and treat `REQUEST` as nullable.",
        "**Don't leak private data**: filter user-authenticated `HttpClient` endpoints out of SSR `transferCache` (`withHttpTransferCacheOptions`) so personal API JSON is never embedded into shared server HTML."
      ],
      code: `
// product-screen.ts + app.routes.server.ts
import { Component, DOCUMENT, afterNextRender, inject, signal } from '@angular/core';
import { provideClientHydration } from '@angular/platform-browser';
import { PrerenderFallback, RenderMode, ServerRoute, provideServerRendering, withRoutes } from '@angular/ssr';

@Component({
  selector: 'app-product-reviews',
  template: \`<section><h3>Customer reviews</h3><p>4.9 / 5 stars</p></section>\`,
})
export class ProductReviews {}

@Component({
  selector: 'app-product-screen',
  imports: [ProductReviews],
  template: \`
    <h1>Mechanical Keyboard</h1>

    <!-- 1. Split ProductReviews into a separate lazy JS chunk; hydrate on interaction -->
    @defer (on viewport; prefetch on idle; hydrate on interaction) {
      <app-product-reviews />
    } @placeholder (minimum 200ms) {
      <!-- Reserve vertical space to keep CLS = 0 when reviews replace placeholder -->
      <div style="min-height: 120px" aria-hidden="true">Reviews will load below…</div>
    } @loading (after 100ms; minimum 200ms) {
      <p role="status">Loading reviews…</p>
    } @error {
      <p role="alert">Could not load reviews.</p>
    }
  \`,
})
export class ProductScreen {
  private readonly doc = inject(DOCUMENT);
  protected readonly ready = signal(false);

  constructor() {
    // 2. afterNextRender runs ONLY in the browser after hydration—safe from Node SSR errors
    afterNextRender(() => {
      this.ready.set(this.doc.visibilityState === 'visible');
    });
  }
}

// 3. Per-route hybrid rendering strategy
export const serverRoutes: ServerRoute[] = [
  { path: 'account', renderMode: RenderMode.Client },
  {
    path: 'products/:id',
    renderMode: RenderMode.Prerender,
    fallback: PrerenderFallback.Server,
    getPrerenderParams: async () => [{ id: '1' }, { id: '2' }],
  },
  { path: '**', renderMode: RenderMode.Server },
];

export const hydrationProvider = provideClientHydration();
export const ssrProviders = [provideServerRendering(withRoutes(serverRoutes))];
`,
      practice: "Place a heavy chart inside `@defer (on viewport; prefetch on idle)` with a fixed `min-height` `@placeholder`, open DevTools Network (filtered to JS), and watch the chunk load only when scrolling into view. Remove `min-height` temporarily to observe the layout jump (**CLS**).",
      teach: "Explain **hydration**, contrast `RenderMode.Client`, `RenderMode.Prerender`, and `RenderMode.Server` in plain words, and explain why accessing `window` in a constructor crashes SSR.",
      analogy: "SSR with incremental hydration is setting up a lit shop window at dawn (`RenderMode.Server`) so passersby see everything right away, while only turning on the heavy basement escalator (`hydrate on interaction`) when someone steps onto it.",
      pitfalls: [
        "Referencing a `@defer`-wrapped component anywhere outside `@defer` in the same file (such as `viewChild(ProductReviews)`), forcing it back into the main bundle.",
        "Deferring above-the-fold hero headings/images (hurts LCP) or leaving `@placeholder` blank with zero height (hurts CLS).",
        "Calling `window.localStorage` or `document.title` directly in component constructors—breaking SSR in Node.",
        "Leaving authenticated user endpoints in the SSR HTTP transfer cache without filtering private requests."
      ],
      quiz: [
        { q: "What prevents a component inside `@defer` from moving into its own lazy JS chunk?", a: ["Adding an `@placeholder`", "Referencing that component class elsewhere in the same file outside `@defer` (e.g., `viewChild`)", "Adding `prefetch on idle`", "Adding styles"], c: 1, why: "Any eager reference in the same TypeScript/template scope forces the bundler to keep the component in the main chunk." },
        { q: "Which `RenderMode` best fits a logged-in account settings dashboard that needs no search-engine indexing?", a: ["`RenderMode.Prerender`", "`RenderMode.Client`", "`RenderMode.Server` with public cache", "A raw text file"], c: 1, why: "Private user dashboards gain nothing from SSR/SSG and avoid server load by rendering client-side." },
        { q: "Where should browser-only DOM work (reading scroll positions or `localStorage`) run in an SSR component?", a: ["Directly in `constructor`", "Inside `afterNextRender()` or `afterRenderEffect()`", "Inside `ServerRoute` config", "Inside `@Pipe`"], c: 1, why: "`afterNextRender()` skips Node server execution completely and runs once in the hydrated browser." }
      ]
    },
    {
      id: 'arch', title: 'Architecture, accessibility and Angular Aria', level: 3, mins: 45,
      why: "Maintainable apps organize files by business feature, match every piece of state to the right owner, keep backend/frontend types locked via OpenAPI, and build interactive widgets (tabs, dropdowns, comboboxes) with **Angular Aria** rather than inaccessible `<div>` click handlers.",
      terms: [
        ['Feature folders (`core/` / `features/` / `shared/`)', 'Grouping files by purpose: `core/` holds app singletons & models, `features/` holds business pages, and `shared/` holds dumb reusable UI widgets.'],
        ['Headless UI (`@angular/aria`)', 'Behavior-only directives providing WAI-ARIA roles, `aria-selected`/`aria-expanded` attributes, and keyboard arrow navigation while you own 100% of the HTML & CSS.'],
        ['OpenAPI codegen', 'Generating TypeScript interfaces automatically from ASP.NET Core\'s `/openapi/v1.json` contract (`openapi-typescript`) instead of hand-copying DTOs.'],
        ['Roving focus', 'Keyboard pattern (used inside toolbars and tabs) where Tab enters the widget once and Arrow Left/Right moves focus between tabs.']
      ],
      points: [
        "**Organize by feature**: keep app-wide auth/config services and domain types (`product.model.ts`) in `core/`, route sections in `features/products/`, and pure presentational components (taking `input()`, emitting `output()`, zero HTTP) in `shared/ui/`.",
        "**Match state to its owner**: **server reads** belong in `httpResource`, **shareable filters/pages** belong in the **URL** (`withComponentInputBinding()`), **user drafts** belong in **`form()`**, **widget toggles** stay local in **`signal()`**, and **shared cart/session state** lives in `@Service()` exposing `.asReadonly()`.",
        "**Keep C# and TypeScript synced via OpenAPI**: ASP.NET Core emits a schema at `/openapi/v1.json`. Tools like `openapi-typescript` regenerate TypeScript DTO types automatically so a backend rename fails Angular's build at compile time—not in production.",
        "**Styling with Tailwind CSS v4**: modern Angular uses `@import 'tailwindcss';` directly inside CSS (with no legacy `tailwind.config.js` needed).",
        "**Accessible complex widgets with `@angular/aria`**: plain HTML covers buttons and links, but tabs, accordions, and comboboxes need strict keyboard arrows, roving focus, and `aria-selected` updates. `@angular/aria` gives you **headless directives** (`ngTabs`, `ngTabList`, `ngTab`, `ngTabPanel`, `ngCombobox`) while leaving HTML and CSS styling completely in your hands.",
        "**End-to-end accessibility checklist**: semantic tags first (`<button>`, `<nav>`, `<main>`), explicit `<label for>` + `aria-describedby` form errors, visible `:focus-visible` outlines, unique route `title`s, and styling active ARIA states directly (`[aria-selected='true']`)."
      ],
      code: `
// product-specs.ts — headless @angular/aria/tabs handling keyboard arrows & ARIA automatically
import { Component, signal } from '@angular/core';
import { Tab, TabContent, TabList, TabPanel, Tabs } from '@angular/aria/tabs';

@Component({
  selector: 'app-product-specs',
  imports: [Tabs, TabList, Tab, TabPanel, TabContent],
  template: \`
    <!-- 1. ngTabs + ngTabList manage WAI-ARIA roles, arrow keys and [(selectedTab)] sync -->
    <div ngTabs>
      <ul ngTabList [(selectedTab)]="activeTab" class="tab-list">
        <li ngTab value="details" class="tab-btn">Details</li>
        <li ngTab value="shipping" class="tab-btn">Shipping</li>
      </ul>

      <!-- 2. Lazy-mount panel bodies inside <ng-template ngTabContent> -->
      <div ngTabPanel value="details" class="tab-panel">
        <ng-template ngTabContent>
          <p>Hot-swappable switches, aluminum frame.</p>
        </ng-template>
      </div>
      <div ngTabPanel value="shipping" class="tab-panel">
        <ng-template ngTabContent>
          <p>Ships within 24 hours from Jakarta.</p>
        </ng-template>
      </div>
    </div>
  \`,
  // 3. Style native [aria-selected='true'] directly so visuals and screen-reader state never drift
  styles: \`
    .tab-list { display: flex; gap: .5rem; list-style: none; padding: 0; border-bottom: 1px solid #d4d4d8; }
    .tab-btn { padding: .5rem 1rem; cursor: pointer; border-bottom: 2px solid transparent; }
    .tab-btn[aria-selected='true'] { border-bottom-color: currentColor; font-weight: 600; }
    .tab-panel { padding-block: 1rem; }
  \`,
})
export class ProductSpecs {
  protected readonly activeTab = signal<string | undefined>('details');
}
`,
      practice: "Build a searchable country picker using `@angular/aria/combobox` + `@angular/aria/listbox`, style `[aria-selected='true']` and `:focus-visible`, and verify you can open, filter, choose with Arrow keys + Enter, and close with Escape using **only the keyboard**. Then inspect your ASP.NET Core `/openapi/v1.json` output to see how schemas map to TypeScript interfaces.",
      teach: "Explain what **headless UI** (`@angular/aria`) means, why styling `[aria-selected='true']` is safer than juggling separate `.active` CSS classes, and how you decide where a piece of state lives.",
      analogy: "Angular Aria is the hidden steering column, brakes, and turn signals inside a car: you sculpt any exterior body and dashboard styling (HTML + Tailwind CSS) you want, while the directives guarantee keyboard navigation and screen-reader signals work safely out of the box.",
      pitfalls: [
        "Putting API calls (`HttpClient`) or business logic inside reusable `shared/ui/` buttons or cards.",
        "Clicking `<div>` elements for tabs or dropdowns (`<div (click)=\"...\">`)—completely unreachable with Tab or Arrow keys and silent to screen readers.",
        "Hand-copying C# DTO properties into TypeScript files instead of generating types from `/openapi/v1.json`.",
        "Adding custom `.active` CSS classes separately from `[aria-selected='true']`, allowing visual state and assistive technology state to fall out of sync."
      ],
      quiz: [
        { q: "What does `@angular/aria` handle that plain CSS cannot?", a: ["Compiling Tailwind utilities", "Managing WAI-ARIA roles, `aria-*` attributes, roving focus, and keyboard arrow interactions while letting you style freely", "Generating C# models", "Hosting SSR servers"], c: 1, why: "Headless directives encapsulate complex keyboard and screen-reader behavior while keeping HTML and CSS 100% yours." },
        { q: "How should CSS highlight the active `ngTab` in Angular Aria?", a: ["With `.ng-tab-active`", "With `.tab-btn[aria-selected='true']`", "With `::ng-deep`", "Only in JavaScript"], c: 1, why: "Angular Aria sets native `aria-selected` automatically, tying visual highlights directly to accessibility state." },
        { q: "Where should active product search filters and pagination page numbers live?", a: ["In a private service field only", "In URL query parameters bound via `withComponentInputBinding()`", "In `sessionStorage`", "Inside `ProductRow`"], c: 1, why: "URL state survives browser refresh and Back/Forward buttons and lets users share filtered links." }
      ]
    }
  ]
});
