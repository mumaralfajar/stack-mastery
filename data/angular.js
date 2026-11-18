// Angular track (Angular 22+). Every code sample is checked with ngc strictTemplates by tools/verify-angular.mjs.
// Inside these template literals any TypeScript backtick must be written \` and "${" must be written \${.
TRACKS.push({
  id: 'angular', name: 'Angular', lang: 'ts',
  tagline: 'Typed frontend apps with components, Signals, dependency injection, Signal Forms, HTTP, and SSR.',
  lessons: [
    // ---------------- Beginner ----------------
    {
      id: 'components', title: 'Components, templates and bindings', level: 0, mins: 35,
      why: "Every Angular screen is a tree of small UI components. Each component pairs a TypeScript class holding data and methods with an HTML template that renders and updates the page.",
      terms: [
        ['Component', 'A reusable UI unit pairing a TypeScript class (state and event handlers) with an HTML template.'],
        ['Decorator (`@Component`)', 'A `@` annotation above a class that sets the component\'s HTML tag (`selector`) and markup (`template`).'],
        ['`selector`', 'The custom HTML tag name (such as `app-product-card`) used to render a component inside another template.'],
        ['Binding', 'Syntax connecting TypeScript fields or methods to HTML text, element properties, and DOM events.']
      ],
      points: [
        "An Angular component pairs a TypeScript class (holding data and actions) with `@Component({ ... })`, which sets `selector` (for example `'app-product-card'`) and `template` (its HTML).",
        "To render a child component inside a parent template, add it to `imports: [ProductCard]` on the parent's `@Component(...)`. When the tag has no inner HTML, write it self-closing as `<app-product-card />`.",
        "Templates bind data in three ways: `{{ name }}` inserts text (interpolation), `[disabled]=\"outOfStock\"` sets a DOM property from TypeScript (property binding), and `(click)=\"select()\"` runs a class method on click (event binding).",
        "Property binding `[disabled]=\"outOfStock\"` matters for boolean attributes. In plain HTML, `disabled=\"false\"` disables a button simply because the attribute exists, whereas `[disabled]=\"false\"` sets the DOM property to boolean `false`.",
        "In Angular classes, `readonly` blocks reassigning a fixed signal or helper, and `protected` lets the component's template read a field or method while keeping it hidden from parent classes.",
        "Every app starts in `main.ts` by calling `bootstrapApplication(App)`, mounting the root `App` component onto `<app-root></app-root>` in `index.html`."
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
      teach: "Explain what `@Component`, `selector`, `imports`, `{{ value }}`, `[disabled]`, and `(click)` do in plain words without assuming the listener already knows Angular.",
      analogy: "A component works like a custom HTML tag you define yourself (`<app-product-card />`), backed by a small TypeScript class. Double curly braces `{{ }}` print data into text, square brackets `[ ]` pass values into DOM properties, and parentheses `( )` send browser events back to your class.",
      pitfalls: [
        "Using `<app-product-card />` in a parent template without listing `ProductCard` in that parent's `@Component({ imports: [...] })` array.",
        "Writing `(click)=\"() => toggle()\"` inside a template. Clicking runs the expression, which creates an unused function and never calls it. Write `(click)=\"toggle()\"`.",
        "Marking a field `private` when the template reads it. Angular checks templates strictly and requires `protected` or public (`readonly`) fields.",
        "Older Angular tutorials often use `NgModule` files instead of `imports: [...]` on `@Component`, which modern standalone components don't need."
      ],
      quiz: [
        { q: "What must you add so a parent component's template recognizes `<app-product-card />`?", a: ["An `NgModule` registration file", "`ProductCard` inside the parent's `@Component({ imports: [...] })` array", "An HTML `<link>` tag in `index.html`", "Extending `ProductCard` with `extends`"], c: 1, why: "Each component explicitly declares the components its template uses in its `imports` array." },
        { q: "What happens if you write `(click)=\"() => toggle()\"` in an Angular template?", a: ["`toggle()` runs on click", "Nothing: clicking evaluates to an unused arrow function without calling `toggle()`", "Angular fails to compile", "`toggle()` runs once immediately on load"], c: 1, why: "Event bindings execute the expression itself when the event fires; invoke the method directly as `(click)=\"toggle()\"`." },
        { q: "Why prefer `[disabled]=\"isOutOfStock\"` over HTML `disabled=\"{{ isOutOfStock }}\"`?", a: ["Property binding passes the actual JavaScript `true`/`false` boolean to the DOM element", "Square brackets style the button automatically", "HTML doesn't support attributes on buttons", "It runs faster only on mobile"], c: 0, why: "In HTML attributes, even `disabled=\"false\"` disables a button because the attribute name exists. `[disabled]` sets the DOM boolean property directly." }
      ]
    },
    {
      id: 'flow', title: 'Control flow, pipes and content slots', level: 0, mins: 35,
      why: "Plain HTML can't loop over arrays, switch to a loading spinner, or format `240` as `$240.00`. Angular adds built-in blocks (`@if`, `@for`, `@switch`), formatting filters called pipes, and wrapper slots (`<ng-content />`) to keep templates readable.",
      terms: [
        ['Control flow', 'Template blocks (`@if`, `@for`, `@switch`) that conditionally show, repeat, or branch HTML markup.'],
        ['`track`', 'An ID expression required by `@for` (such as `track p.id`) so Angular matches each list item across updates instead of rebuilding the whole DOM list.'],
        ['Pipe (`|`)', 'A template formatting operator (like `{{ price | currency }}`) that transforms a value for display without mutating data.'],
        ['Content projection (`<ng-content />`)', 'A placeholder inside a wrapper component where callers can pass their own HTML elements.']
      ],
      points: [
        "`@if`, `@else if`, and `@else` add or remove DOM blocks based on a condition. `@for (p of products; track p.id)` repeats markup for each array item, and an optional `@empty` block renders when the array has zero items.",
        "Every `@for` needs a `track` expression so Angular knows which DOM node matches which data item. Using a unique ID like `track p.id` lets Angular move existing DOM rows on sort or insert instead of destroying inputs and losing focus.",
        "`@switch (value)` checks cases with strict `===` and no fallthrough. For TypeScript unions such as `'loading' | 'ready' | 'error'`, end with `@default never;` so the compiler catches unhandled union states at build time.",
        "Pipes (`{{ p.price | currency }}`) format display values without changing stored data. Custom `@Pipe({ name: 'truncate' })` classes must stay pure, so share logic with regular TypeScript by putting the logic in a helper like `truncateText`.",
        "Use content projection to build wrapper components (`<app-badge-card>...</app-badge-card>`). An unnamed `<ng-content />` receives default children, `select=\"[card-badge]\"` matches elements via CSS selectors, and inner text like `<ng-content>Default</ng-content>` acts as a fallback."
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
      analogy: "`track` in `@for` works like a numbered luggage tag on each suitcase. When bags swap places on the belt, Angular checks the ID (`p.id`) and moves the existing DOM element instead of rebuilding everything from scratch. `<ng-content />` acts like a frame with labeled cutouts.",
      pitfalls: [
        "Using `track $index` on lists where items get added at the top, reordered, or deleted. Shifting indexes causes Angular to match state to the wrong rows.",
        "Forgetting to add `CurrencyPipe` or custom pipes (`TruncatePipe`) to `@Component({ imports: [...] })`.",
        "Trying to instantiate a `@Pipe` class directly in TypeScript instead of calling a shared helper function like `truncateText()`.",
        "Older Angular code uses `*ngIf` and `*ngFor` structural directives; built-in `@if` and `@for` blocks need no imports and handle diffing better."
      ],
      quiz: [
        { q: "Why does `@for` require a `track` expression like `track p.id`?", a: ["To sort items alphabetically", "So Angular can identify each item across array updates and reuse its DOM nodes", "To make keys uppercase", "To hide empty items"], c: 1, why: "A stable ID tells Angular which DOM elements moved or stayed the same so it avoids tearing down unchanged rows." },
        { q: "What does adding `@default never;` at the end of `@switch` guarantee?", a: ["Nothing renders if matched", "A compile error whenever a union type case is forgotten", "Runtime throwing in the browser", "Automatic lowercase comparison"], c: 1, why: "It uses TypeScript's `never` check to guarantee every possible value of a union type has an `@case` handler." },
        { q: "How should you share formatting logic between a template pipe and a regular TypeScript helper?", a: ["Copy and paste the body into both files", "Extract a plain TypeScript function (like `truncateText`) that both the pipe and other code call", "Wrap the whole app in `CurrencyPipe`", "Use `@for` inside the pipe"], c: 1, why: "Pipes are small wrappers around pure functions, so extracting the function keeps templates and TypeScript helpers consistent." }
      ]
    },
    {
      id: 'signals', title: 'Reactive state: signal, computed, linkedSignal and effect', level: 0, mins: 40, viz: 'ngsignals',
      predict: {
        prompt: 'Suppose `qty` is `0` and `discount = computed(() => qty() > 0 && hasCoupon() ? 15 : 0)`. If you call `hasCoupon.set(true)` while `qty()` stays `0`, how many times does `discount()` re-run?',
        options: ['1 time (recalculates to 0)', '0 times (`hasCoupon` is not tracked while short-circuited)', 'Throws an error on untracked read'],
        answer: 1,
        explain: 'Signal dependency tracking updates on each evaluation. Because `qty() > 0` was `false`, `&&` stopped before reading `hasCoupon()`, so changing `hasCoupon` skips recomputation until `qty` turns positive.'
      },
      why: "UI state changes on clicks, typing, and timers. Signals wrap changing values so Angular knows which DOM text and attributes read each signal, letting it refresh only those parts without scanning the whole tree.",
      terms: [
        ['Signal (`signal(val)`)', 'A reactive container around a value. Calling it like a function (`qty()`) returns the current value and subscribes the caller to updates.'],
        ['`computed()`', 'A read-only derived signal that evaluates lazily, caches its output, and updates only when signals it actually read change.'],
        ['`linkedSignal()`', 'Writable state with an automatic default that resets when a source signal changes, while still letting callers call `.set()`.'],
        ['`effect()`', 'A side-effect callback that re-runs when signals it reads change. Reserve it for syncing with outside APIs like timers, logs, or `localStorage`.']
      ],
      points: [
        "Create reactive state with `signal(initialValue)`. Read it by calling `this.qty()`, replace it with `.set(next)`, or derive a new value from the old one with `.update(q => q + 1)`. Always replace arrays or objects rather than mutating them in place.",
        "Derive values with `computed(() => this.price() * this.qty())`. It evaluates lazily when read and caches the result until a tracked signal changes. In `qty() > 0 && hasCoupon()`, changing `hasCoupon` doesn't trigger an update while `qty()` is `0`, because `&&` short-circuits before reading it.",
        "Use `linkedSignal` when state needs a computed default that a user can still override directly. For example, reset `selectedShipping` when shipping options change while keeping the user's pick if it stays valid.",
        "Use `effect(onCleanup => ...)` strictly to sync changes to external systems (`localStorage`, canvas, logging, timers), and register `onCleanup(...)` to clear stale timers or listeners. Don't use `effect()` to copy one signal into another; use `computed()` or `linkedSignal()` instead.",
        "Signal tracking records synchronous reads only. Always read signals before any `await`, and wrap reads you don't want tracked in `untracked(this.qty)`."
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
      practice: "Open the Signal dependency graph visualization above, set `qty = 0`, toggle `hasCoupon`, and watch `total()` stay cached because `qty() > 0 && hasCoupon()` short-circuits before reading `hasCoupon()`. Then open the TypeScript playground (`#/play/ts`), run the Angular signals and Angular linkedSignal examples, and change `price.set(150)` to watch recomputation.",
      teach: "Explain what a `signal()` is, how `computed()` caches results and tracks conditional branches, and why `linkedSignal()` fits cases where people otherwise reach for `effect()`.",
      analogy: "`computed` is like a spreadsheet formula cell: you can't type into it directly, and it recalculates only when an input cell it read changes. `linkedSignal` is a checkout shipping picker that resets to Standard when you switch countries, while still letting you choose Express.",
      pitfalls: [
        "Using `effect()` to copy signal A into signal B (`effect(() => b.set(a() * 2))`) instead of writing `const b = computed(() => a() * 2)`.",
        "Mutating an array inside a signal in place (`items().push(x)`) without replacing it via `.update(list => [...list, x])`. Angular sees the same array reference and skips updates.",
        "Reading a signal inside `computed` or `effect` after an `await`, because signal tracking observes synchronous calls only.",
        "Leaving off parentheses when reading a signal in a template: `{{ total }}` renders the function description instead of calling `{{ total() }}`."
      ],
      quiz: [
        { q: "Inside `computed(() => qty() > 0 && coupon() ? 15 : 0)`, `qty()` is currently `0`. What happens when `coupon` changes?", a: ["`computed` throws an error", "It stays cached without recalculating, because short-circuiting skipped reading `coupon()`", "It recalculates anyway", "It clears `qty()`"], c: 1, why: "Dependencies are recorded per evaluation; when `qty() > 0` was false, `coupon()` was never called." },
        { q: "Which primitive gives you state that resets automatically when a filter changes, yet still lets the user override it via `.set()`?", a: ["`computed()`", "`linkedSignal()`", "`effect()`", "`untracked()`"], c: 1, why: "`linkedSignal()` creates writable derived state that recalculates a default whenever its source changes." },
        { q: "When is `effect()` the right tool?", a: ["Syncing external non-Angular APIs such as `localStorage`, canvas drawing, or analytics when signals change", "Deriving a filtered array from a search box", "Initializing class constants", "Calling `.set()` on another signal every time a prop updates"], c: 0, why: "Use `computed()` or `linkedSignal()` for signal-to-signal state, and reserve `effect()` for external side effects with cleanup." }
      ]
    },
    // ---------------- Intermediate ----------------
    {
      id: 'inputs', title: 'Component API: input, output, model, queries and host', level: 1, mins: 40,
      why: "Components talk through clear contracts: parents pass data down, children emit events up, custom inputs stay two-way synced, and classes sometimes grab a DOM node or style their own outer wrapper tag. Because Angular exposes inputs, `model()`, and queries as signals, everything you learned in the previous lesson carries over directly.",
      terms: [
        ['`input()` / `input.required()`', 'Read-only signals that receive values passed from a parent component (`[unitPrice]="25"`).'],
        ['`output()`', 'An event emitter that sends payloads up to a parent component (`(addToCart)="onAdded($event)"`).'],
        ['`model()`', 'A writable two-way signal backing the `[(quantity)]="qty"` syntax (`[quantity]` in and `(quantityChange)` out).'],
        ['Host element', "The component's outer HTML tag rendered in the parent (such as `<app-qty-picker>`), configured with `host: { ... }` inside `@Component`."],
        ['Template query (`viewChild`)', 'A signal giving TypeScript access to a marked template element (such as `<input #searchInput />`) once rendered.']
      ],
      points: [
        "Declare optional inputs with `input(defaultVal)` and required ones with `input.required<number>()`. Because an input is a read-only signal, derive values with `computed()` and never call `this.unitPrice.set(...)`.",
        "In `<app-qty-picker disabled />`, plain HTML sends an empty string `\"\"` for bare attributes. Adding `{ transform: booleanAttribute }` coerces presence to boolean `true`, and `numberAttribute` converts numeric strings to numbers.",
        "Emit events with `readonly addToCart = output<number>()` using camelCase without an `on` prefix (`selected`, not `onSelected`). For shared editable state like a stepper, `model(1)` combines an input and output so parents can write `[(quantity)]=\"qty\"`.",
        "Query template elements by putting `#name` on an element (`<input #searchInput />`) and calling `viewChild('searchInput')` (`contentChild` reads elements projected inside `<ng-content />`). Since queries are signals, call `this.searchInput()?.nativeElement.focus()` safely after render.",
        "`<app-qty-picker>` is the component's host element wrapping its template. Configure classes, custom attributes (`[attr.*]`), or DOM listeners directly in `@Component({ host: { 'class': 'picker-host', '[attr.data-disabled]': 'disabled()' } })`."
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
      practice: "Build a `StarRating` component with `readonly max = input(5)` and `readonly rating = model(0)`. Bind it with `[(rating)]=\"score\"`, inspect `<app-star-rating>` in DevTools to verify `host:` sets `data-rating` on click, and focus the first star button on Reset using `viewChild`.",
      teach: "Explain how `input()` plus `output()` differs from `model()`, why `<app-btn disabled />` needs `booleanAttribute`, and what the **host element** is.",
      analogy: "`input()` is a one-way mail slot from parent to child, `output()` is a doorbell the child rings, and `model()` is a shared whiteboard they both edit. The **host element** is the outer envelope itself, styled through `host: { ... }`.",
      pitfalls: [
        "Choosing input names that clash with built-in HTML attributes like `title`, `id`, or `hidden`.",
        "Reading `viewChild.required()` in a constructor or when the element sits inside a false `@if`. Angular throws `NG0951` until that view renders.",
        "Calling `.set()` on an `input()` signal. Inputs are read-only, so switch to `model()` or `linkedSignal()` when the child needs local writes.",
        "Older Angular code uses `@HostBinding`, `@HostListener`, `ngOnChanges`, and `ngAfterViewInit`. Modern code replaces them with `host:`, `computed()`, and `viewChild()`."
      ],
      quiz: [
        { q: "Which function creates a two-way bindable signal (`[(value)]`) between parent and child?", a: ["`input()`", "`output()`", "`model()`", "`computed()`"], c: 2, why: "`model()` returns a writable signal that exposes both a `[value]` input and a `(valueChange)` output." },
        { q: "Why does `input(false, { transform: booleanAttribute })` let a parent write `<app-qty-picker disabled />`?", a: ["HTML passes bare attributes as empty string `\"\"`, and `booleanAttribute` turns that into `true`", "It disables the parent component automatically", "It skips TypeScript checks", "It turns CSS rules into a `Signal`"], c: 0, why: "Bare HTML attributes arrive as `\"\"` without a transform. `booleanAttribute` coerces presence to `true`." },
        { q: "Where should attributes or CSS classes for a component's outer `<app-qty-picker>` tag live?", a: ["Inside `constructor` via `document.querySelector`", "In the `host: { ... }` block of `@Component(...)`", "Inside `index.html`", "In `main.ts`"], c: 1, why: "`host` attaches classes, attributes, and DOM listeners to the component's host element." }
      ]
    },
    {
      id: 'di', title: 'Services and dependency injection', level: 1, mins: 35,
      why: "Components handle the UI, while shared state (like a cart or auth session) and API helpers belong in **services**. Angular's **Dependency Injection (DI)** hands out shared services without calling `new CartStore()` by hand, and lets tests swap in fakes.",
      terms: [
        ['Service (`@Service()`)', 'A plain TypeScript class that holds shared state or logic reused across components.'],
        ['Dependency Injection (DI)', 'A pattern where Angular creates and supplies class instances via `inject(...)` instead of components calling `new ...`.'],
        ['`Injector`', "Angular's lookup tree that resolves `inject(...)` calls from the component up to the app root."],
        ['`InjectionToken`', 'A typed key used to inject non-class values like config objects or browser `DOCUMENT`.']
      ],
      points: [
        "**Dependency Injection** lets unrelated components share one instance, like a cart, and makes swapping mock objects easy in tests. Mark app-wide singletons with **`@Service()`** (short for `@Injectable({ providedIn: 'root' })`). Unused services stay out of the bundle through tree-shaking.",
        "Request a service with **`inject(CartStore)`** in a class field initializer, constructor, functional route guard, or HTTP interceptor. Calling `inject()` inside click handlers fails unless wrapped in `runInInjectionContext()`.",
        "Service lifetimes mirror ASP.NET Core: `@Service()` creates one **app-wide singleton** (`AddSingleton`), while listing a service on a Route scopes it to that route tree. Adding `@Service({ autoProvided: false })` and `[DraftBuffer]` in `@Component({ providers: [...] })` gives each component instance its own copy.",
        "Resolution checks two injector trees in order. Angular walks up the **`ElementInjector`** chain (element `providers`, then parent elements) before walking the **`EnvironmentInjector`** chain (route providers to app root). Use `{ optional: true }` to return `null` instead of crashing, or `{ skipSelf: true }` to start at the parent.",
        "Protect shared service state by keeping writable `signal` fields `private` (`_items`). Expose `.asReadonly()` signals alongside explicit update methods like `add()`.",
        "TypeScript interfaces and settings objects don't exist at runtime, so define a typed **`InjectionToken<ApiSettings>`** to inject them."
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
      practice: "Add `readonly instanceId = crypto.randomUUID()` to `CartStore` and `DraftBuffer`, then render two `<app-editor-panel />` components side by side in `App`. Confirm `CartStore` keeps one UUID everywhere while each panel gets its own `DraftBuffer` UUID, then temporarily drop `{ optional: true }` on `parentDraft` to trigger `NullInjectorError`.",
      teach: "Explain what Dependency Injection solves, map `@Service()` and component `providers: [...]` to ASP.NET Core lifetimes, and explain why config interfaces need `InjectionToken`.",
      analogy: "Calling `inject(Tool)` is like asking a workshop for a tool. You check your own bench (`ElementInjector`) first, glance at your supervisor's bench (`skipSelf`), and walk to the central storeroom (`EnvironmentInjector` root) if it's still missing.",
      pitfalls: [
        "Calling `inject(MyService)` inside a button `(click)` handler or `setTimeout` instead of storing `private readonly svc = inject(MyService)` in a class field.",
        "Leaving out `{ optional: true }` when asking for an ancestor service. Angular throws `NullInjectorError` if the component renders standalone.",
        "Leaving writable `signal` fields public on a service instead of `.asReadonly()`, which lets any component mutate shared state directly.",
        "Keep `<ng-content />` visibility in mind: `providers` exposes a service to projected children, whereas `viewProviders` hides it from them."
      ],
      quiz: [
        { q: "Where is calling `inject(CartStore)` valid?", a: ["Inside a `(click)` method handler", "In a class field initializer, constructor, factory function, or functional route guard", "Inside an `async` callback after `await`", "In any static helper function"], c: 1, why: "`inject()` requires Angular's active injection context during class setup or functional router/HTTP callbacks." },
        { q: "Two sibling `<app-editor-panel />` tags each list `DraftBuffer` in `@Component({ providers: [DraftBuffer] })`. How many `DraftBuffer` instances exist?", a: ["One shared singleton", "Two separate instances, each destroyed when its panel leaves the screen", "Zero unless listed in `main.ts`", "A compile error"], c: 1, why: "Providing on `@Component` attaches one instance to each element's `ElementInjector`." },
        { q: "Why use `new InjectionToken<ApiSettings>(...)` instead of `inject(ApiSettings)` directly?", a: ["Interfaces speed up runtime lookup", "TypeScript erases interfaces at compile time, so Angular needs a runtime token object", "`@Service()` forbids interfaces", "Tokens encrypt config strings"], c: 1, why: "TypeScript `interface` types vanish in compiled JavaScript. `InjectionToken` gives Angular a real runtime key." }
      ]
    },
    {
      id: 'routing', title: 'Routing, URL inputs and lazy loading', level: 1, mins: 35,
      why: "Real apps need shareable URLs like `/products/42?tab=reviews` and fast initial loads. Angular's Router swaps views without full-page reloads, feeds URL params straight into signal inputs, and downloads heavy pages only when visited.",
      terms: [
        ['SPA (Single-Page Application)', 'A web app that updates the URL and swaps components in the browser without reloading the HTML page.'],
        ['`<router-outlet />`', 'The placeholder tag where Angular renders the component matching the current URL.'],
        ['Path vs query params', 'Required URL segments (`/products/:id`) vs optional key-value filters after `?` (`?tab=reviews`).'],
        ['Lazy loading (`loadComponent`)', 'Splitting a route into a separate JS chunk downloaded only when the user opens that route.']
      ],
      points: [
        "Configure pages as a **`Routes` array**, register them in `app.config.ts` with `provideRouter(routes, withComponentInputBinding(), withViewTransitions())`, and place **`<router-outlet />`** where the active page should appear.",
        "Use **`routerLink`** (and `routerLinkActive=\"on\"` to style the active tab) for internal links instead of `<a href=\"/products/42\">`. A plain `href` reloads the whole page and wipes in-memory signals.",
        "Turn on **`withComponentInputBinding()`** so URL path params (`:id`), query strings (`?tab=reviews`), and route `title` data flow straight into matching **`input()` signals** on the page component.",
        "Keep the initial bundle small with **`loadComponent: () => import('./product-detail').then(m => m.ProductDetail)`** (or `loadChildren`) instead of eager `component: ProductDetail`. Each lazy route downloads its JS chunk only when visited.",
        "Angular checks `routes` from top to bottom and stops at the first match. Place specific routes like `products/:id` before catch-all fallbacks like `path: '**'`.",
        "Putting `providers: [...]` on a route creates a route-level `EnvironmentInjector` shared across its child pages and cleaned up when navigating away."
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
      practice: "Nest `overview` and `reviews` under `products/:id` using `children`, place a second `<router-outlet />` in `ProductDetail`, and open the DevTools **Network** tab filtered to JS. Click your `routerLink` and watch the lazy chunk download only on navigation.",
      teach: "Explain what `<a routerLink=\"...\">` avoids compared to `<a href=\"...\">`, how `withComponentInputBinding()` exposes URL params, and why `loadComponent` speeds up startup.",
      analogy: "Routing is a building directory paired with on-demand rooms. The lobby doesn't furnish Room 42 (`loadComponent`) until a visitor walks in, and `withComponentInputBinding()` hands their visitor badge (`:id`) to the room as an `input()` signal.",
      pitfalls: [
        "Putting `{ path: '**', ... }` at the top of `routes`. Because first-match wins, it swallows every URL.",
        "Writing `href=\"/products/42\"` instead of `routerLink=\"/products/42\"`, which reloads the whole Angular app on every click.",
        "Forgetting `withComponentInputBinding()` in `provideRouter(...)`, leaving route param `input()` signals `undefined`.",
        "Importing `ProductDetail` statically at the top of `app.routes.ts`. An eager import cancels out lazy code splitting."
      ],
      quiz: [
        { q: "What does `withComponentInputBinding()` do inside `provideRouter`?", a: ["Encrypts URL parameters", "Binds URL path params, query params, and resolved data directly into component `input()` signals", "Reloads CSS files on navigation", "Preloads all lazy routes at startup"], c: 1, why: "Route values flow straight into matching `input()` signals without reading `ActivatedRoute` manually." },
        { q: "Why use `loadComponent: () => import('./admin').then(m => m.Admin)` for secondary pages?", a: ["It runs the page in a background worker", "The compiler moves `Admin` into a separate JS chunk loaded only when visited", "It turns on SSR automatically", "It shares one `Admin` instance everywhere"], c: 1, why: "Dynamic `import()` splits the route into its own chunk so users only download pages they open." },
        { q: "Where does the catch-all `{ path: '**', ... }` route belong?", a: ["First in `routes`", "Last in `routes`, since matching stops at the first hit", "Only inside `children`", "Before `redirectTo`"], c: 1, why: "Routes match top-to-bottom, so anything listed after `**` is unreachable." }
      ]
    },
    {
      id: 'forms', title: 'Signal Forms, validation and accessible errors', level: 1, mins: 40,
      splits: [['1 · Template & ARIA', '// product-form.ts'], ['2 · Schema & submit()', '// 1. Single source-of-truth']],
      why: "Almost every app handles user input, from sign-up forms to checkouts, with conditional rules and clear errors. Angular **Signal Forms** (`@angular/forms/signals`) pair a `signal(...)` model with a type-safe schema so DOM inputs, validation state, and ARIA attributes stay in sync.",
      terms: [
        ['Field vs FieldState (`f.name` vs `f.name()`)', '`productForm.name` is the binding handle passed to `[formField]`; calling `productForm.name()` returns live status signals (`touched()`, `invalid()`, `errors()`).'],
        ['`touched()`', 'Flips to `true` after the user leaves an input or hits Submit, so errors don\'t shout before they even type.'],
        ['Validation schema', 'Rules inside `form(model, s => ...)` (`required`, `min`, conditional `applyWhen`, custom `validate`) checking form validity in one spot.'],
        ['`aria-invalid` & `aria-describedby`', 'HTML accessibility attributes telling screen readers when a field fails (`aria-invalid="true"`) and which `<p id="...">` holds its message (`aria-describedby`).']
      ],
      points: [
        "Build from a **non-nullable `signal` model** (defaulting to `''`, `0`, or `false` rather than `null`), wrap it with **`form(this.model, s => ...)`**, and bind `<input>` elements with **`[formField]=\"productForm.name\"`**.",
        "Since `[formField]` owns `value`, `disabled`, `readonly`, `hidden`, `name`, and min/max constraints, don't duplicate `[value]`, `[disabled]`, `min`, or `max` on the HTML `<input>`.",
        "Keep **field references** separate from **state calls**: pass `productForm.name` (no `()`) to `[formField]`, and call **`productForm.name()`** (with `()`) to read `.touched()`, `.invalid()`, `.hidden()`, or `.errors()`.",
        "Put validation rules inside the schema callback: **`required()`**, **`min()`**, **`email()`**, **`applyWhen(s.discount, condition, rules)`** (`hidden()` becomes `true` when skipped), `applyEach()` for arrays, and **`validate()`** (returning `{ kind, message }` or `undefined`).",
        "Add `novalidate` to `<form>` so browser tooltips don't fight your error UI, and handle submission with **`submit(this.productForm, async () => { ... })`**. `submit()` marks all fields `touched` and runs your `async` callback only when valid.",
        "Wire accessible errors with `<label for=\"...\">`, `[attr.aria-invalid]`, `[attr.aria-describedby]`, and `role=\"alert\"` on error text so keyboard and screen-reader users get immediate feedback."
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
      practice: "Extend `ProductForm` with `sku: ''` in `model`. Validate it using `pattern(s.sku, /^[A-Z]{3}-\\d{3}$/, { message: 'Use format ABC-123' })` and add a cross-field `validate()` rule blocking discounts over `50` when `price < 20`. Submit invalid inputs to confirm errors show up without running `console.log`.",
      teach: "Explain the difference between `productForm.name` and `productForm.name()`, why error messages check `.touched()`, and how `aria-invalid` plus `aria-describedby` support screen readers.",
      analogy: "Signal Forms act like a live control panel wired to your `signal` model. Passing `productForm.name` to `[formField]` hooks the input up to the panel, while calling `productForm.name()` reads its gauges (`touched()`, `invalid()`, `errors()`).",
      pitfalls: [
        "Leaving off parentheses when reading state: `form.name.errors()` fails where `form.name().errors()` works.",
        "Putting `null` into the initial `signal({ name: null })` instead of `''` or `0`.",
        "Adding HTML attributes like `[disabled]`, `[value]`, `min`, or `max` onto `<input [formField]=\"...\">`. Rules belong in the `form()` schema.",
        "Returning `null` instead of `undefined` when a `validate()` check passes. Older codebases also use **Reactive Forms** (`FormGroup`, `Validators`), which run similar model-driven validation over RxJS instead of Signals."
      ],
      quiz: [
        { q: "How do you check whether `productForm.name` has been touched by the user?", a: ["`productForm.name.touched()`", "`productForm.name().touched()`", "`productForm().name.touched`", "`productForm.name.get('touched')`"], c: 1, why: "Calling `productForm.name()` returns its `FieldState`, which exposes `.touched()` and `.errors()` signals." },
        { q: "Where does a minimum number rule live for `<input type=\"number\" [formField]=\"productForm.price\">`?", a: ["Directly as HTML `min=\"1\"` on the input", "Inside the `form()` schema via `min(s.price, 1)`", "Inside a `(blur)` handler", "Inside `index.html`"], c: 1, why: "`[formField]` manages DOM attributes from the schema so validation logic and UI stay together." },
        { q: "What does `submit(this.productForm, async () => ...)` do before running your callback?", a: ["Resets every input to empty", "Marks every field `touched` so all error messages appear, and skips your callback unless the form is valid", "Calls `fetch()` automatically", "Removes ARIA attributes"], c: 1, why: "Users clicking Save right away see every invalid field immediately, and invalid forms never run the save callback." }
      ]
    },
    // ---------------- Advanced ----------------
    {
      id: 'rxjs', title: 'Async event streams: RxJS and Signals interop', level: 2, mins: 40, viz: 'ngrxjs',
      why: "Signals hold *current values right now* like quantities, totals, or open state. **RxJS** coordinates **events over time**, such as waiting 300 ms after typing stops, cancelling stale searches, or blocking double-clicks on Pay. Learning `Observable` streams also demystifies Angular's `HttpClient` and router events.",
      terms: [
        ['`Observable`', 'A lazy stream of zero, one, or many values over time. A **cold** Observable stays idle until `.subscribe()` or `firstValueFrom` runs.'],
        ['Operator & `.pipe(...)`', 'A transform step like `debounceTime` or `switchMap` inside `.pipe(...)` that filters, delays, or cancels stream events.'],
        ['`switchMap` vs `exhaustMap`', '`switchMap` cancels an unfinished async call when a new event arrives (search box); `exhaustMap` ignores new triggers until the running call ends (Pay button).'],
        ['`toSignal()` / `toObservable()`', 'Angular helpers that convert an `Observable` stream into a signal with auto-cleanup, and back again.']
      ],
      points: [
        "A Signal holds *one current value*, while an **Observable** represents *events over time*. Angular's `HttpClient` returns **cold Observables**, so an HTTP call doesn't fire until you subscribe or convert it with `firstValueFrom()` or `toSignal()`.",
        "Use **`.pipe(...)`** operators to control timing: `debounceTime(300)` waits for a 300 ms pause in typing, and `distinctUntilChanged()` drops repeated identical queries.",
        "Three flattening operators decide what happens when a new event fires while a previous async request is still running:",
        "`switchMap` cancels the older in-flight observable and keeps only the latest. Use it for typeahead search so slow earlier replies don't overwrite newer typing.",
        "`exhaustMap` ignores new triggers while an inner observable is active. Use it on Checkout or Submit buttons to prevent double charges.",
        "`concatMap` runs requests one after another in order for sequential writes, whereas `mergeMap` runs them all concurrently when order doesn't matter.",
        "Always dispose subscriptions when a component leaves the screen. Pair `.pipe(takeUntilDestroyed())` in constructors or field initializers, or convert the stream with **`toSignal(obs$, { initialValue })`**."
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
      practice: "Open the **TypeScript playground** (`#/play/ts`), pick **RxJS switchMap vs exhaustMap**, and run it to see `switchMap` cancel `'typing ke'` while `exhaustMap` drops `'accidental double-click'`. Then swap `'switch'` and `'exhaust'` in `compareFlattening` and predict the output.",
      teach: "Explain how an `Observable` differs from a `Signal`, when to pick `switchMap` over `exhaustMap`, and why `toSignal()` removes manual `.unsubscribe()` calls.",
      analogy: "`switchMap` is a short-order cook who trashes a half-made sandwich the moment a diner yells 'make it turkey instead!'. `exhaustMap` is an elevator button: pressing it five times while the cab moves won't summon five elevators.",
      pitfalls: [
        "Using `mergeMap` for live search. A slow response for `'la'` arriving after `'laptop'` overwrites the screen with old results.",
        "Calling `.subscribe(...)` without `takeUntilDestroyed()`, leaving background timers or listeners running after navigation.",
        "Omitting `{ initialValue }` on `toSignal(obs$)`, which leaves the signal typed as `T | undefined` until the first event emits.",
        "Nesting `.subscribe()` inside another `.subscribe()` callback instead of chaining flat operators like `switchMap` or `exhaustMap`."
      ],
      quiz: [
        { q: "Which operator cancels an earlier search HTTP request as soon as the user types another letter?", a: ["`mergeMap`", "`concatMap`", "`switchMap`", "`exhaustMap`"], c: 2, why: "`switchMap` unsubscribes from the previous inner observable (aborting its HTTP request) on every new emission." },
        { q: "A user double-clicks a 'Place order' button. Which operator ignores extra clicks until the first request finishes?", a: ["`switchMap`", "`exhaustMap`", "`mergeMap`", "`debounceTime`"], c: 1, why: "`exhaustMap` drops incoming upstream triggers while an inner observable is still running." },
        { q: "What does `takeUntilDestroyed()` handle for you?", a: ["Retrying network calls three times", "Unsubscribing automatically when the component or service is destroyed", "Converting signals into JSON", "Sorting emitted arrays"], c: 1, why: "It hooks subscription cleanup into Angular's `DestroyRef`." }
      ]
    },
    {
      id: 'http', title: 'HTTP, httpResource and talking to ASP.NET Core', level: 2, mins: 45,
      splits: [['1 · ApiError mapper', '// api-error.ts'], ['2 · Interceptor', '// 2. Functional interceptor'], ['3 · Component + loaders', '@Component({']],
      why: "This lesson connects Angular to your ASP.NET Core backend and database. You'll use **`httpResource`** for reactive `GET` loading and **`HttpClient`** (with interceptors and built-in XSRF protection) for writes and structured `ProblemDetails` errors.",
      terms: [
        ['`httpResource()`', 'A signal-based `GET` loader that tracks signals in its URL callback, cancels stale requests, and exposes `.isLoading()`, `.error()`, and `.value()`.'],
        ['`HttpInterceptorFn`', 'A functional middleware hook running on every outgoing request and incoming response to add auth headers, request IDs, or shared error handling.'],
        ['CORS vs Dev Proxy', 'Browsers block `localhost:4200` from calling `localhost:5000` unless ASP.NET Core enables **CORS** (`AddCors`), or Angular CLI forwards `/api` through `proxy.conf.json`.'],
        ['`ProblemDetails` & XSRF', 'RFC 9457 `ProblemDetails` is ASP.NET Core\'s JSON error shape (`title` + `errors`); **XSRF** (`XSRF-TOKEN` cookie to `X-XSRF-TOKEN` header) blocks forged cross-site POST forms.']
      ],
      points: [
        "Use **`httpResource(() => '/api/products?q=' + query())`** for reactive `GET` reads. Whenever a signal read inside that callback changes, Angular cancels the old request and fetches the new URL (return `undefined` to pause fetching).",
        "Check `.hasValue()` or `.error()` before reading **`products.value()`**, because calling `.value()` after a failed request throws an error.",
        "Use **`HttpClient`** methods (`post`, `put`, `patch`, `delete`) for mutations. Since `HttpClient` returns a **cold `Observable`**, nothing hits the network until you await `firstValueFrom(...)` or subscribe.",
        "Register middleware with `provideHttpClient(withInterceptors([requestIdInterceptor]))` in `appConfig`. `HttpRequest` objects are immutable, so call `req.clone({ setHeaders: ... })` before passing to `next(...)`.",
        "Catch `HttpErrorResponse` to map ASP.NET Core **`ProblemDetails`** (`title` and `errors` like `{ Price: ['Must be positive'] }`) into a typed `ApiError` rendered below each matching input.",
        "Forward `/api` calls locally with `proxy.conf.json` (or permit `http://localhost:4200` in ASP.NET Core `AddCors`). TypeScript utilities like `Omit<Product, 'id'>` and `satisfies CreateProduct` type-check request bodies against your backend DTO without erasing literal types."
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
      practice: "Open the **TypeScript playground** (`#/play/ts`) and run **ASP.NET ProblemDetails mapper** to inspect how validation JSON maps to `fieldErrors`. Hook `ProductsPage` up to your local ASP.NET Core API with `proxy.conf.json`, submit `-5` for price, and watch `fieldErrors()['Price']` render beside the input.",
      teach: "Explain when to pick `httpResource` vs `HttpClient`, why calling `http.post(...)` without `firstValueFrom()` sends nothing, and how CORS and `proxy.conf.json` differ.",
      analogy: "`httpResource` is a deli counter that shreds your old order slip as soon as you change your mind. `HttpInterceptorFn` is the security checkpoint every outgoing request and incoming response passes through.",
      pitfalls: [
        "Reading `products.value()` in a template without `@if (products.hasValue())`, which throws if the API fails.",
        "Calling `this.http.delete('/api/products/1')` without awaiting `firstValueFrom(...)` or subscribing. The cold `Observable` never fires.",
        "Trying to mutate `req.headers` inside an interceptor instead of returning `req.clone(...)`.",
        "Opening CORS only for Vite's port `:5173` in ASP.NET Core `AddCors()` while Angular serves on `:4200`."
      ],
      quiz: [
        { q: "What happens if you call `userResource.value()` when its HTTP request failed?", a: ["It returns `undefined`", "It throws an error because the resource status is `'error'`", "It retries once", "It logs a warning string"], c: 1, why: "Check `hasValue()` or `error()` first before calling `.value()`." },
        { q: "Why does `this.http.delete('/api/products/1')` send nothing if you ignore its return value?", a: ["Browsers block `DELETE` requests", "`HttpClient` returns a cold `Observable` that only sends when subscribed or awaited with `firstValueFrom`", "Interceptors cancel unassigned calls", "CORS rejects empty responses"], c: 1, why: "Cold observables stay idle until subscribed." },
        { q: "Where should an Authorization header or `X-Request-Id` be added across all API calls?", a: ["Inside every component template", "In a functional `HttpInterceptorFn` passed to `provideHttpClient(withInterceptors([...]))`", "Inside `index.html`", "Inside `router.navigate`"] , c: 1, why: "Functional interceptors centralize cross-cutting headers and error handling in one place." }
      ]
    },
    {
      id: 'guards', title: 'Route guards, resolvers and @boundary recovery', level: 2, mins: 40,
      why: "Production apps keep unauthorized users off private pages, preload lightweight route data, and isolate broken widgets so one bad chart doesn't blank the screen. Route checks only steer browser UX, though: your ASP.NET Core API enforces real access control.",
      terms: [
        ['`CanActivateFn` / `CanMatchFn`', 'Functional route guards that return `true`, `false`, or a `RedirectCommand` before opening a route.'],
        ['`ResolveFn`', 'A loader function fetching small route data like a page title before the target component renders.'],
        ['Security boundary', 'Users can edit or bypass browser JavaScript in DevTools at any time, so only your backend server guarantees real security.'],
        ['`@boundary` / `@error`', 'Angular v22.2+ template error boundaries that catch child render crashes locally and pass `$reset()` to retry.']
      ],
      points: [
        "Route guards (`CanActivateFn` and `CanMatchFn`) are functions running in an injection context, so they can call `inject()`. Return `true` to allow, `false` to block, or `new RedirectCommand(router.parseUrl('/login'))` to redirect without reloading the page.",
        "`CanMatchFn` decides whether a route entry even *matches*, letting multiple routes share `/home` and fall through on `false`, while `CanActivateFn` runs after a match. Async guards in `canActivate: [a, b]` run **in parallel**, so don't expect `a` to finish before `b` starts.",
        "Route guards only shape **UI navigation**. Anyone can hit `/api/admin/...` straight from `curl` or `fetch`, so ASP.NET Core endpoints still need `RequireAuthorization()` and ownership checks.",
        "Route resolvers (`ResolveFn`) preload small metadata like page titles into route input bindings. Skip heavy blocking API calls inside resolvers unless you show navigation feedback, or clicks will look frozen.",
        "Wrap risky widgets inside **`@boundary { ... } @error { ... }`** (Angular v22.2+) so a render crash shows a local fallback with a **`$reset()`** Retry button instead of taking down the whole page."
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
      practice: "Render `OrdersShell` with `broken` initially `true`, see the `@error` fallback replace a blank crash, click Retry, and confirm `broken.set(false); $reset()` restores the widget. Then hit your ASP.NET Core `/api/orders` endpoint from `curl` without a token to confirm the backend returns `401`.",
      teach: "Explain when to use `CanMatchFn` vs `CanActivateFn`, why route guards are UX rather than real security, and what `@boundary` plus `$reset()` recover from.",
      analogy: "A route guard is a velvet rope steering visitors toward the ticket desk (`RedirectCommand`), while ASP.NET Core `RequireAuthorization()` is the locked vault door. `@boundary` is a circuit breaker on one room so a blown bulb never blacks out the whole floor.",
      pitfalls: [
        "Assuming `canActivate` protects API endpoints from direct `curl` or Postman calls.",
        "Putting `@boundary` inside a wrapper around `<ng-content />` expecting it to catch errors from parent markup. Wrap the child from the parent template instead.",
        "Expecting `guardB` in `canActivate: [guardA, guardB]` to wait for `guardA` first. Async guards run concurrently.",
        "Running slow uncached queries inside a `ResolveFn` with no loading indicator, making navigation feel broken."
      ],
      quiz: [
        { q: "Why must ASP.NET Core verify permissions even when Angular guards `/admin` with `canActivate`?", a: ["Angular guards don't work on iOS", "Browser code runs on the user's machine and can be bypassed, so only the backend enforces security", "Guards run only during `ng build`", "Tokens expire inside `<router-outlet>`"], c: 1, why: "Guards streamline navigation for honest users; server checks stop direct API abuse." },
        { q: "How does `canMatch` returning `false` differ from `canActivate` returning `false`?", a: ["`canMatch` throws an immediate 404 error", "`canMatch` skips that route entry so the router can test a later route with the same path", "`canMatch` disables lazy chunks", "There is no difference"], c: 1, why: "`canMatch` lets two routes share `/home` (such as an admin dashboard and a customer dashboard)." },
        { q: "Inside an `@boundary { ... } @error { ... }` block, what does calling `$reset()` do?", a: ["Reloads the entire browser tab", "Clears the caught error and re-renders the `@boundary` block", "Resets every service singleton", "Calls `Router.navigate(['/'])`"], c: 1, why: "`$reset()` clears the boundary once you fix the underlying state." }
      ]
    },
    {
      id: 'testing', title: 'Zoneless testing: components, routing and HTTP', level: 2, mins: 45,
      why: "Modern Angular tests run in **Vitest** inside **jsdom** (a simulated Node.js DOM) without Zone.js. Instead of nudging change detection by hand, tests act like users: click or type, wait for Angular via `await fixture.whenStable()`, and check rendered text and ARIA state.",
      terms: [
        ['Vitest & jsdom', 'Vitest runs `describe`/`it`/`expect` tests fast; jsdom simulates browser DOM nodes in Node without opening Chrome.'],
        ['`TestBed`', "Angular's test sandbox for mounting a component (`TestBed.createComponent`) with mock services or providers."],
        ['`await fixture.whenStable()`', 'Pauses the test until Angular flushes pending zoneless signal updates and microtasks.'],
        ['`HttpTestingController`', 'A test double capturing `HttpClient` and `httpResource` calls so tests verify requests and flush mock responses offline.']
      ],
      points: [
        "Follow **`Act -> await fixture.whenStable() -> Assert`**: click or update a signal, `await fixture.whenStable()` so Angular renders on its own, and assert on the DOM. Skip `fixture.detectChanges()`, because manual ticks hide missing signal reads.",
        "`httpResource` registers a pending network task as soon as it runs, so calling `await fixture.whenStable()` first hangs forever. Call **`TestBed.tick()`** once after `createComponent()` to send the request, flush **`http.expectOne(...).flush(...)`**, and *then* `await fixture.whenStable()`.",
        "Test HTTP offline with `[provideHttpClient(), provideHttpClientTesting()]`. Check request methods, URLs, and bodies via `HttpTestingController`, flush `200`/`201`/`400 ProblemDetails` payloads, and call **`http.verify()` in `afterEach`** to catch stray calls.",
        "Exercise real routes, guards, and bindings together using **`RouterTestingHarness.create()`** and `provideRouter(routes, withComponentInputBinding())` rather than hand-mocking `Router`.",
        "Assert what a user or screen reader sees (visible text, `<label>` associations, `[aria-invalid]`, `role=\"alert\"`) instead of inspecting private component fields. Use `TestbedHarnessEnvironment` harnesses for `@angular/aria` or Material widgets."
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
      practice: "Add a second `it(...)` verifying the create path: flush `201` on `POST /api/products`, expect `httpResource.reload()` to send `GET /api/products`, flush a 2-item list, and assert the new product name shows up in the DOM.",
      teach: "Explain why zoneless tests await `fixture.whenStable()` instead of `fixture.detectChanges()`, why `TestBed.tick()` precedes flushing `httpResource`, and what `http.verify()` guards against.",
      analogy: "`await fixture.whenStable()` is waiting at the kitchen pass until plating finishes. Reaching over the counter with `detectChanges()` forces a dish out early and hides whether the kitchen bell (`signal` / event) ever rang.",
      pitfalls: [
        "Calling `fixture.detectChanges()` in zoneless specs, which hides missing signal tracking that fails in production.",
        "Calling `await fixture.whenStable()` *before* flushing an active `httpResource` request. The open request hangs stability unless `TestBed.tick()` and `.flush()` run first.",
        "Forgetting `afterEach(() => http.verify())`, which lets duplicate or unmocked HTTP calls pass silently.",
        "Hand-mocking `Router` instead of testing real routes and guards with `RouterTestingHarness`."
      ],
      quiz: [
        { q: "In zoneless Angular v22 tests, how do you wait for signal changes and DOM events to render?", a: ["Call `fixture.detectChanges()` in a loop", "Await `await fixture.whenStable()`", "Call `tick(100)` inside `fakeAsync`", "Switch back to `Eager`"], c: 1, why: "`whenStable()` waits for Angular's zoneless scheduler and microtasks." },
        { q: "Why does `httpResource` inside a new test component need `TestBed.tick()` + `http.expectOne().flush()` *before* `await fixture.whenStable()`?", a: ["`whenStable()` waits until pending HTTP resource requests settle", "`TestBed.tick()` compiles the HTML template", "Vitest blocks HTTP until ticked twice", "Signals ignore `beforeEach`"], c: 0, why: "Flushing the mock response unblocks the pending task tracked by `httpResource`." },
        { q: "What does `httpTesting.verify()` check inside `afterEach`?", a: ["C# DTO compatibility", "That no unexpected or un-flushed HTTP requests remain open", "That CSS transitions ended", "That CORS is off"], c: 1, why: "It catches accidental duplicate API calls or requests your test never flushed." }
      ]
    },
    // ---------------- Expert ----------------
    {
      id: 'cd', title: 'Change detection and rendering performance', level: 3, mins: 45, viz: 'ngcd',
      why: "**Change detection** is how Angular compares app state to the template and updates the DOM. Seeing how Angular evolved from top-down Zone.js scans (`Eager`) to `OnPush` and **zoneless Signal updates** shows why modern apps stay fast and what bugs still waste work.",
      terms: [
        ['Change detection', 'Checking TypeScript state against templates and updating only the DOM nodes that changed.'],
        ['`OnPush` vs legacy `Eager`', '`Eager` (with Zone.js) walks every component from root down on each event; `OnPush` (Angular 22 default) updates a component only when its inputs, local events, or read signals change.'],
        ['Reference equality (`Object.is`)', '`OnPush` checks whether an input holds a *new* object or array reference, so in-place `.push()` mutations go unseen.'],
        ['`afterRenderEffect()`', 'Runs *after* DOM updates commit, separating `earlyRead` measurements from `write` steps to avoid layout thrashing.']
      ],
      points: [
        "Legacy **`Eager` mode (Zone.js)** patched browser events (`click`, `setTimeout`, `fetch`) and walked the entire component tree from root down on every tick, even for unchanged components. `ChangeDetectionStrategy.Default` is deprecated as `Eager`, while **`OnPush` is the default in Angular 22**.",
        "With **Zoneless + Signals**, changing a signal flags *only the template views* that read it. Unrelated parent and sibling components are skipped.",
        "`OnPush` compares inputs using **`Object.is`** (reference identity). Avoid mutating arrays or objects in place (`items.push(x)`), and pass a fresh copy (`[...items, x]`) so child views refresh.",
        "Don't put `[items]=\"items().filter(...)\"` or `{ a: 1 }` object literals in templates, because they create a fresh reference on every check. Move derived lists into **`computed()`** so they only recalculate when `items()` or `query()` change.",
        "Put DOM measurements and scroll updates inside `afterRenderEffect({ earlyRead, write })` instead of `effect()`, which runs *before* DOM updates commit and causes layout thrashing.",
        "Profile slow frames in **Angular DevTools** (flamegraph and change-detection highlights) before optimizing, and virtualize huge tables with **`@angular/cdk/scrolling`**."
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
      practice: "Open the **Change detection explorer** above and click `Card B` in `Eager (Zone.js)`, `OnPush`, and `Zoneless + Signal`. Turn on `Update shared CartSignal`, click `Card B` again, and explain why `App` and `ProductList` stay untouched only in `Zoneless + Signal` mode.",
      teach: "Explain how Signals refresh just `CartBadge` and `Card B` without Zone.js walking from `App`, and why `items.push()` skips updates on `OnPush` inputs.",
      analogy: "Legacy Zone.js is a night guard checking every hotel room floor by floor whenever one guest rings a bell. `OnPush` with Signals is a direct intercom: only the room whose wire buzzed lights up.",
      pitfalls: [
        "Writing `items().filter(...)` or inline `{ ... }` literals inside templates, allocating new references every check.",
        "Mutating an array in place before passing it to an `OnPush` child (`Object.is` sees the same reference and skips re-rendering).",
        "Switching a broken component to `ChangeDetectionStrategy.Eager` instead of fixing the underlying state mutation.",
        "Calling `getBoundingClientRect()` inside `effect()` (before DOM renders) instead of `afterRenderEffect()`."
      ],
      quiz: [
        { q: "Which `ChangeDetectionStrategy` is the default in Angular 22?", a: ["`ChangeDetectionStrategy.Eager`", "`ChangeDetectionStrategy.OnPush`", "`ChangeDetectionStrategy.Manual`", "Zone polling"], c: 1, why: "Angular 22 defaults to `OnPush` and deprecates legacy `Default` in favor of explicit `Eager`." },
        { q: "In a zoneless app, a shared `cartCount` signal read only by `CartBadge` and `Card B` changes. Which views update?", a: ["Every component starting from `App`", "Only `CartBadge` and `Card B`", "Only `App` and `ProductList`", "None without `markForCheck()`"], c: 1, why: "Signals notify only the template views that read them during render, skipping parents and siblings." },
        { q: "Why compute a filtered list in `computed()` instead of calling `items().filter(...)` inside `@for`?", a: ["Templates forbid calling `.filter()`", "Template expressions re-run on every check and return a brand-new array reference each time", "`computed()` sends data to the server", "Loops accept only strings"], c: 1, why: "`computed()` caches its result until `items()` or `query()` actually changes." }
      ]
    },
    {
      id: 'ssr', title: 'Deferrable views (@defer), SSR and hybrid rendering', level: 3, mins: 45,
      why: "Fast first loads combine two tools: splitting secondary UI into on-demand **`@defer`** chunks, and choosing per route whether HTML renders in the browser (**CSR**), at build time (**Prerender / SSG**), or per request on Node (**SSR**). **Hydration** then activates the page without re-rendering from scratch.",
      terms: [
        ['CSR vs SSG vs SSR', '**CSR** builds HTML in the browser (`RenderMode.Client`); **SSG / Prerender** writes static HTML at build (`RenderMode.Prerender`); **SSR** renders fresh HTML on Node per request (`RenderMode.Server`).'],
        ['Hydration', 'Hooking Angular event listeners and signal reactivity onto server-rendered HTML without tearing down and rebuilding the DOM.'],
        ['LCP & CLS', '**LCP** (Largest Contentful Paint) measures how fast the first main viewport renders; **CLS** (Cumulative Layout Shift) measures visual jumps as lazy chunks load.'],
        ['`@defer`', 'A template block that code-splits standalone components into separate JS chunks loaded on triggers like `on viewport` or `hydrate on interaction`.']
      ],
      points: [
        "Split off-screen widgets like charts or reviews with `@defer (on viewport; prefetch on idle)`. Angular isolates `<app-product-reviews />` into its own JS chunk as long as nothing else in the same file imports `ProductReviews` eagerly outside `@defer`.",
        "Guard **LCP** and **CLS**: never wrap first-screen hero content in `@defer` because that delays LCP. Give **`@placeholder`** a matching `min-height` to prevent layout jumps, and add `(after 100ms; minimum 200ms)` on `@loading` so spinners don't flicker.",
        "Mix rendering modes per route in `ServerRoute[]`: `RenderMode.Prerender` for static marketing or catalog pages (`getPrerenderParams`), `RenderMode.Server` for dynamic SEO pages, and `RenderMode.Client` for signed-in dashboards.",
        "Enable incremental hydration with `provideClientHydration()` (on by default with event replay in Angular 22+). Combining **`@defer (on viewport; hydrate on interaction)`** ships server HTML for SEO and fast paint while keeping heavy JS asleep until the user interacts.",
        "Node SSR runs without `window`, `document`, or `localStorage`. Inject Angular's **`DOCUMENT`** token instead of global `document`, move browser-only DOM code into **`afterNextRender()`**, and treat `REQUEST` as nullable.",
        "Filter authenticated endpoints out of SSR `transferCache` (`withHttpTransferCacheOptions`) so user-specific JSON never leaks into shared server HTML."
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
      practice: "Wrap a heavy chart in `@defer (on viewport; prefetch on idle)` with a fixed `min-height` `@placeholder`, open DevTools Network (filtered to JS), and watch the chunk download only on scroll. Remove `min-height` briefly to see the **CLS** layout jump.",
      teach: "Explain **hydration**, compare `RenderMode.Client`, `RenderMode.Prerender`, and `RenderMode.Server`, and explain why touching `window` in a constructor crashes SSR.",
      analogy: "SSR with incremental hydration is like lighting a shop window at dawn (`RenderMode.Server`) so passersby see displays right away, while switching on the heavy basement escalator (`hydrate on interaction`) only when someone steps onto it.",
      pitfalls: [
        "Referencing a `@defer` component elsewhere in the same file (such as `viewChild(ProductReviews)`), which drags it back into the main bundle.",
        "Wrapping first-screen hero text or images in `@defer` (hurts LCP) or omitting `min-height` on `@placeholder` (hurts CLS).",
        "Calling `window.localStorage` or `document.title` inside component constructors, breaking SSR on Node.",
        "Leaving authenticated API calls inside the SSR HTTP transfer cache without filtering private routes."
      ],
      quiz: [
        { q: "What stops a component inside `@defer` from being split into a lazy JS chunk?", a: ["Adding an `@placeholder`", "Referencing that component class elsewhere in the same file outside `@defer` (such as `viewChild`)", "Adding `prefetch on idle`", "Adding component styles"], c: 1, why: "Any eager reference in the same TypeScript or template scope pulls the component back into the main bundle." },
        { q: "Which `RenderMode` fits a signed-in account settings dashboard that search engines don't index?", a: ["`RenderMode.Prerender`", "`RenderMode.Client`", "`RenderMode.Server` with public cache", "A raw text file"], c: 1, why: "Private dashboards get no benefit from SSR or SSG and save server cost with client rendering." },
        { q: "Where should browser-only DOM code (reading scroll offsets or `localStorage`) run in an SSR component?", a: ["Inside `constructor`", "Inside `afterNextRender()` or `afterRenderEffect()`", "Inside `ServerRoute` config", "Inside `@Pipe`"], c: 1, why: "`afterNextRender()` never runs on Node and executes once in the browser." }
      ]
    },
    {
      id: 'arch', title: 'Architecture, accessibility and Angular Aria', level: 3, mins: 45,
      why: "Healthy Angular apps group files by feature, keep state in the right home, and generate DTO types from OpenAPI. For interactive tabs and menus, **Angular Aria** gives you proper keyboard handling instead of inaccessible `<div>` click handlers.",
      terms: [
        ['Feature folders (`core/` / `features/` / `shared/`)', '`core/` holds app singletons and models, `features/` holds route pages, and `shared/` holds dumb reusable UI widgets.'],
        ['Headless UI (`@angular/aria`)', 'Behavior-only directives handling WAI-ARIA roles, `aria-*` attributes, and keyboard arrows while you own 100% of the HTML and CSS.'],
        ['OpenAPI codegen', "Generating TypeScript interfaces from ASP.NET Core's `/openapi/v1.json` schema (`openapi-typescript`) instead of copying DTOs by hand."],
        ['Roving focus', 'Keyboard navigation where Tab enters a toolbar or tab strip once and Arrow keys move focus across items.']
      ],
      points: [
        "Group code by feature: put app auth/config services and models (`product.model.ts`) in `core/`, route areas in `features/products/`, and pure UI components (`input()` + `output()`, no HTTP) in `shared/ui/`.",
        "Keep every piece of state in its right home: server reads go in `httpResource`, shareable filters and page numbers stay in the **URL** (`withComponentInputBinding()`), drafts live in **`form()`**, UI toggles stay in local **`signal()`**, and shared state lives in `@Service()` via `.asReadonly()`.",
        "Sync C# and TypeScript models with OpenAPI. ASP.NET Core exposes `/openapi/v1.json`, and tools like `openapi-typescript` generate TS types so backend schema changes break at build time instead of runtime.",
        "Style with Tailwind CSS v4 by writing `@import 'tailwindcss';` in CSS, with no legacy `tailwind.config.js` needed.",
        "Use **`@angular/aria`** (`ngTabs`, `ngTabList`, `ngTab`, `ngTabPanel`, `ngCombobox`) for tabs, accordions, and comboboxes. Plain HTML covers buttons and links, whereas complex widgets need exact arrow navigation, roving focus, and `aria-selected` attributes while leaving styling up to you.",
        "Run this accessibility check on every feature: prefer semantic HTML (`<button>`, `<nav>`, `<main>`), pair `<label for>` with `aria-describedby` errors, keep `:focus-visible` outlines clear, set unique route `title`s, and style `[aria-selected='true']` directly."
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
      practice: "Build a searchable country picker with `@angular/aria/combobox` and `@angular/aria/listbox`, style `[aria-selected='true']` plus `:focus-visible`, and confirm you can open, filter, select with Arrow keys + Enter, and dismiss with Escape using **only the keyboard**. Inspect ASP.NET Core `/openapi/v1.json` to see how schemas translate to TS interfaces.",
      teach: "Explain what **headless UI** (`@angular/aria`) means, why styling `[aria-selected='true']` beats toggling a separate `.active` class, and how you decide where state lives.",
      analogy: "Angular Aria is the hidden steering column, brakes, and blinkers inside a car. You design whatever body and dashboard styling (HTML + Tailwind CSS) you want, while the directives guarantee keyboard navigation and screen-reader signals work properly.",
      pitfalls: [
        "Putting `HttpClient` calls or business rules inside reusable `shared/ui/` buttons or cards.",
        "Turning `<div>` tags into fake tabs or dropdowns (`<div (click)=\"...\">`), making them unreachable by Tab or Arrow keys and invisible to screen readers.",
        "Copying C# DTO fields into TypeScript interfaces by hand instead of generating them from `/openapi/v1.json`.",
        "Toggling a custom `.active` class separately from `[aria-selected='true']`, which lets visual state and screen-reader state drift apart."
      ],
      quiz: [
        { q: "What does `@angular/aria` provide that plain CSS can't?", a: ["Compiling Tailwind utilities", "WAI-ARIA roles, `aria-*` attributes, roving focus, and keyboard arrow handling while you own the styling", "Generating C# models", "Running SSR servers"], c: 1, why: "Headless directives wire keyboard and screen-reader behavior while keeping markup and CSS in your control." },
        { q: "How should CSS highlight the active `ngTab` in Angular Aria?", a: ["With `.ng-tab-active`", "With `.tab-btn[aria-selected='true']`", "With `::ng-deep`", "Only in JavaScript"], c: 1, why: "Angular Aria sets `aria-selected` automatically, locking visual highlights to accessibility state." },
        { q: "Where should active search filters and pagination page numbers live?", a: ["Only in a private service field", "In URL query parameters bound through `withComponentInputBinding()`", "In `sessionStorage`", "Inside `ProductRow`"], c: 1, why: "URL params survive refreshes and Back/Forward navigation and make links shareable." }
      ]
    }
  ]
});
