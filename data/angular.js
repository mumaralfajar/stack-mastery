// Angular track (Angular 22+). Every code sample is checked with ngc strictTemplates by tools/verify-angular.mjs.
// Inside these template literals any TypeScript backtick must be written \` and "${" must be written \${.
TRACKS.push({
  id: 'angular', name: 'Angular', lang: 'ts',
  tagline: 'The full-featured frontend: components, Signals, dependency injection, Signal Forms, HTTP and SSR.',
  lessons: [
    // ---------------- Beginner ----------------
    {
      id: 'components', title: 'Components, templates and bindings', level: 0, mins: 35,
      why: "Angular builds interfaces out of standalone components — no `NgModule` boilerplate required. Once you see a component as a class holding reactive state paired with a declarative template, the rest of the framework clicks.",
      points: [
        "Every component is **standalone by default** (since Angular 19). List the components, directives and pipes used in its template in `imports: [...]`.",
        "Modern Angular names classes after what they **are**, without a `Component` suffix: `ProductCard`, not `ProductCardComponent`.",
        "Always use **self-closing tags** when a component has no projected children: `<app-product-card />` instead of `<app-product-card></app-product-card>`.",
        "Templates bind data four ways: `{{ expr }}` interpolation for text, `[prop]=\"expr\"` property binding for inputs/attributes, `(event)=\"handler()\"` for events, and `host: { ... }` inside `@Component` to bind to the host element itself.",
        "Avoid `@HostBinding` and `@HostListener` in new code: declare host bindings directly in the `@Component({ host: { ... } })` metadata.",
        "Start an app with `bootstrapApplication(App, appConfig)` rather than bootstrapping an `NgModule`."
      ],
      code: `
import { Component, signal } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';

@Component({
  selector: 'app-product-card',
  host: {
    'class': 'card',
    '[attr.data-selected]': 'selected()',
  },
  template: \`
    <article>
      <h2>{{ name }}</h2>
      <p>Price: {{ price }}</p>
      <button type="button" [disabled]="stock() === 0" (click)="toggle()">
        {{ selected() ? 'Selected' : 'Select' }}
      </button>
    </article>
  \`,
})
export class ProductCard {
  readonly name = 'Mechanical Keyboard';
  readonly price = 80;
  readonly stock = signal(5);
  protected readonly selected = signal(false);

  protected toggle(): void {
    this.selected.update(s => !s);
  }
}

@Component({
  selector: 'app-root',
  imports: [ProductCard],
  template: \`
    <main>
      <h1>Shop</h1>
      <app-product-card />
    </main>
  \`,
})
export class App {}

// In main.ts:
// bootstrapApplication(App);
export { bootstrapApplication };
`,
      practice: "Create a new workspace with `npx @angular/cli@latest new shop-ng`. Replace the root template with a `ProductCard` component that tracks how many times it was clicked using a `signal()`, and disable the button when `stock === 0`. Inspect the host `<app-product-card>` element in dev tools to watch `data-selected` toggle.",
      teach: "Explain the difference between `{{ value }}`, `[disabled]=\"flag\"`, and `(click)=\"save()\"` to someone who knows HTML.",
      analogy: "A component is a custom HTML element with its own private engine room. Square brackets `[ ]` push data **into** the element, parentheses `( )` send events **out**, and `host` paints rules onto the element's own outer shell.",
      pitfalls: [
        "Using a component tag in a template without adding the class to the parent's `imports` array.",
        "Writing `(click)=\"() => save()\"` in a template: that creates a function and never calls it. Write `(click)=\"save()\"`.",
        "Reaching for `@HostBinding` or `@HostListener` instead of the `host` object in `@Component`.",
        "Putting expensive array `.filter()` or `.sort()` calls directly in `{{ }}` — template expressions run on every change-detection pass."
      ],
      quiz: [
        { q: "In modern Angular, how do you make another component available inside a parent component's template?", a: ["Register both in an `NgModule`", "Add the child class to the parent's `@Component({ imports: [...] })` array", "Import the file at the top of `main.ts` only", "Extend the child class"], c: 1, why: "Components are standalone by default, so each component explicitly declares what its template uses in `imports`." },
        { q: "What happens if you write `(click)=\"() => toggle()\"` in an Angular template?", a: ["`toggle()` runs on click", "Nothing: the expression evaluates to a function without calling it", "Angular throws a syntax error", "It calls `toggle()` once on init"], c: 1, why: "Event bindings execute the expression itself on the event; call the method directly as `(click)=\"toggle()\"`." },
        { q: "Preferred way to bind a class or ARIA attribute on a component's own host element?", a: ["Inject `ElementRef` and mutate `nativeElement`", "Use the `host: { ... }` metadata property in `@Component`", "Use `@HostBinding` on a getter", "Wrap the template in an extra `<div>`"], c: 1, why: "The `host` metadata property is declarative, requires no decorator imports, and works cleanly with signals." }
      ]
    },
    {
      id: 'flow', title: 'Control flow, pipes and content projection', level: 0, mins: 35,
      why: "Real templates branch on loading states, render lists of rows, format prices and dates, and wrap arbitrary child markup inside cards or buttons. Built-in control flow and pipes keep templates fast and readable without cluttering your classes.",
      points: [
        "Built-in control flow (`@if` / `@else if` / `@else`, `@for`, `@switch`) replaces structural directives like `*ngIf` and `*ngFor` — no extra imports needed.",
        "`@for (p of products(); track p.id)` **requires** a `track` expression so Angular can reuse DOM nodes across updates; pair it with `@empty` for zero-item states.",
        "`@switch` uses strict `===` with no fallthrough. Add `@default never;` when switching on a union type so adding a new case fails the template build.",
        "Use pure `@Pipe` classes (and built-ins like `CurrencyPipe` or `DatePipe`) to format values in templates. Outside templates, never inject a pipe class — extract a plain function or use `formatCurrency` / `formatDate` from `@angular/common`.",
        "Project parent markup with `<ng-content />`, name multiple slots with `select=\"[card-badge]\"`, and put fallback content right inside `<ng-content>Default</ng-content>`."
      ],
      code: `
import { Component, Pipe, PipeTransform, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

export function truncateText(value: string, limit = 30): string {
  return value.length > limit ? value.slice(0, limit) + '…' : value;
}

@Pipe({ name: 'truncate' })
export class TruncatePipe implements PipeTransform {
  transform(value: string, limit = 30): string {
    return truncateText(value, limit);
  }
}

@Component({
  selector: 'app-badge-card',
  template: \`
    <article class="card">
      <header>
        <ng-content select="[card-title]" />
        <ng-content select="[card-badge]">In stock</ng-content>
      </header>
      <ng-content />
    </article>
  \`,
})
export class BadgeCard {}

type LoadState = 'loading' | 'ready' | 'error';

@Component({
  selector: 'app-catalog',
  imports: [CurrencyPipe, TruncatePipe, BadgeCard],
  template: \`
    @let current = status();
    @switch (current) {
      @case ('loading') { <p>Loading products…</p> }
      @case ('error') { <p role="alert">Could not load catalog.</p> }
      @case ('ready') {
        <ul>
          @for (p of products(); track p.id; let i = $index) {
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
      @default never;
    }
  \`,
})
export class Catalog {
  protected readonly status = signal<LoadState>('ready');
  protected readonly products = signal([
    { id: 1, name: 'Noise-Cancelling Headphones', price: 240, onSale: true },
    { id: 2, name: 'USB-C Hub', price: 45, onSale: false },
  ]);
}
`,
      practice: "Add a `'paused'` member to `LoadState`, leave `@switch` untouched, and watch Angular's strict template compiler catch the missing `@case` via `@default never;`. Then move `truncateText` into a shared helper and call it from both `TruncatePipe` and a TypeScript function.",
      teach: "Explain why `@for` requires `track` and what goes wrong if you always write `track $index` on a list whose items are reordered or deleted.",
      analogy: "`track` in `@for` is a luggage tag on each suitcase. When bags swap places on the belt, Angular reads the tag (`p.id`) and moves the matching DOM element instead of tearing it down and rebuilding it from scratch.",
      pitfalls: [
        "Using `track $index` on mutable lists: deleting item 0 shifts every index and forces Angular to re-bind or scramble child state.",
        "Injecting `CurrencyPipe` or custom pipes inside a service instead of using `formatCurrency()` or a shared plain function.",
        "Putting `<ng-content />` inside `@if` expecting the parent's projected children not to be created — use `<ng-template>` + `NgTemplateOutlet` when conditional creation is needed.",
        "Building impure pipes (`pure: false`) to filter arrays on every check instead of deriving a `computed()` signal."
      ],
      quiz: [
        { q: "Why does `@for` require a `track` expression?", a: ["To sort the array automatically", "So Angular can identify items across updates and reuse DOM nodes", "To validate unique keys at runtime", "To disable change detection"], c: 1, why: "A stable key lets Angular move, update, or remove only the DOM nodes that actually changed." },
        { q: "What does `@default never;` enforce inside a `@switch` block?", a: ["The default branch renders nothing", "A compile error if any member of a union type is unhandled", "Runtime throwing on unknown values", "Skipping null values"], c: 1, why: "Just like TypeScript's `never` exhaustiveness check, `@default never;` fails template type-checking if a union case is forgotten." },
        { q: "You want to reuse a custom pipe's formatting logic inside an injectable service. Best practice?", a: ["Add the pipe to `providers` and `inject()` it", "Extract a plain function that both the pipe and the service call", "Instantiate `new MyPipe()` inside a template", "Mark the pipe `pure: false`"], c: 1, why: "Pipes are template operators, not injectable services; sharing a plain function works cleanly in both places." }
      ]
    },
    {
      id: 'inputs', title: 'Inputs, outputs, model() and queries', level: 0, mins: 35,
      why: "Components communicate through a narrow public contract: data flows down through inputs, changes flow up through outputs, and two-way controls use `model()`. Because Angular models all of these as signals, a child reacts to new inputs without lifecycle hook boilerplate.",
      points: [
        "Declare inputs with `input()` (optional with default) and `input.required<T>()` (enforced at compile time). They return read-only signals, so derive from them with `computed()`.",
        "Use `transform` helpers such as `booleanAttribute` and `numberAttribute` when a parent passes static HTML attributes (`<app-btn disabled />`).",
        "Declare events with `output<T>()` and trigger them via `this.added.emit(value)`. Name outputs in `camelCase` without an `on` prefix (`selected`, not `onSelected`).",
        "Use `model()` for two-way binding (`[(quantity)]=\"qty\"`). Updating a `model` inside the child automatically updates the parent's bound signal.",
        "Query template elements with `viewChild()` / `viewChildren()` and projected elements with `contentChild()` / `contentChildren()`. Like inputs, they are signals — never `ngAfterViewInit` guesswork."
      ],
      code: `
import { Component, ElementRef, booleanAttribute, computed, input, model, output, signal, viewChild } from '@angular/core';

@Component({
  selector: 'app-qty-picker',
  template: \`
    <div class="picker">
      <button type="button" [disabled]="disabled() || quantity() <= 1" (click)="step(-1)">−</button>
      <span>{{ quantity() }} ({{ total() }})</span>
      <button type="button" [disabled]="disabled()" (click)="step(1)">+</button>
      <button type="button" (click)="addToCart.emit(quantity())">Add</button>
    </div>
  \`,
})
export class QtyPicker {
  readonly unitPrice = input.required<number>();
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly quantity = model(1);                      // supports [(quantity)]="qty"
  readonly addToCart = output<number>();             // OutputEmitterRef<number>

  protected readonly total = computed(() => this.unitPrice() * this.quantity());

  protected step(delta: number): void {
    this.quantity.update(q => Math.max(1, q + delta));
  }
}

@Component({
  selector: 'app-product-page',
  imports: [QtyPicker],
  template: \`
    <input #searchInput type="search" placeholder="Filter…" />
    <button type="button" (click)="focusSearch()">Focus search</button>
    <app-qty-picker [unitPrice]="25" [(quantity)]="qty" (addToCart)="onAdded($event)" />
    <p>Parent sees quantity: {{ qty() }} · last added: {{ lastAdded() }}</p>
  \`,
})
export class ProductPage {
  protected readonly qty = signal(2);
  protected readonly lastAdded = signal(0);
  private readonly searchInput = viewChild<ElementRef<HTMLInputElement>>('searchInput');

  protected focusSearch(): void {
    this.searchInput()?.nativeElement.focus();
  }

  protected onAdded(count: number): void {
    this.lastAdded.set(count);
  }
}
`,
      practice: "Build a `StarRating` component with `readonly rating = model(0)` and `readonly max = input(5)`. Bind it two-way from a parent signal, add a `viewChild` button that focuses the first star on reset, and verify that changing `rating` inside the child updates the parent automatically.",
      teach: "Explain when to use `input()` + `output()` versus `model()`, and why `input()` being a signal eliminates most uses of `ngOnChanges`.",
      analogy: "`input()` is a one-way mail slot from parent to child, `output()` is a doorbell the child rings back up, and `model()` is a shared whiteboard between them that either side can update while keeping the same contract.",
      pitfalls: [
        "Choosing input names that collide with native DOM properties like `title`, `id`, or `hidden`.",
        "Reading `viewChild.required()` inside the constructor or when its element sits inside a false `@if` — it throws `NG0951` until the view exists.",
        "Trying to call `.set()` on an `input()` signal. Inputs are read-only; use `model()` or `linkedSignal()` when local writes are needed.",
        "Calling `query.nativeElement` directly instead of calling the query signal first (`this.searchInput()?.nativeElement`)."
      ],
      quiz: [
        { q: "Which function creates a two-way bindable signal property (`[(value)]`) on a child component?", a: ["`input()`", "`output()`", "`model()`", "`computed()`"], c: 2, why: "`model()` returns a `ModelSignal` that acts as both an input and a corresponding `valueChange` output." },
        { q: "Why does `readonly disabled = input(false, { transform: booleanAttribute })` help callers?", a: ["It makes `disabled` writable", "Callers can write `<app-btn disabled />` without `[disabled]=\"true\"`", "It disables the entire parent", "It runs validation"], c: 1, why: "Static HTML attributes arrive as strings (`\"\"`); `booleanAttribute` coerces presence to `true`." },
        { q: "When is a `viewChild('searchInput')` signal guaranteed to be defined?", a: ["Inside the constructor", "Once Angular has rendered the view containing `#searchInput`", "Immediately before template creation", "Never, if using signals"], c: 1, why: "View queries populate after the template view is created, and reactively become `undefined` if `@if` hides the element." }
      ]
    },
    // ---------------- Intermediate ----------------
    {
      id: 'signals', title: 'Reactivity: signal, computed, linkedSignal and effect', level: 1, mins: 40, viz: 'ngsignals',
      why: "Signals are the reactive spine of modern Angular. Knowing when to use `computed()` (derived, read-only), `linkedSignal()` (derived default that stays editable), and `effect()` (external side effects only) prevents infinite loops and stale UI bugs.",
      points: [
        "**Writable signals**: `signal(initial)` holds state; change it with `.set(next)` or `.update(prev => ...)` (always return new arrays/objects, never mutate in place). Expose read-only views with `.asReadonly()`.",
        "**`computed()`**: lazy, memoized, and automatically tracks every signal read synchronously inside it — even dynamic branches (`if (a()) b()` only tracks `b` when `a()` is true).",
        "**`linkedSignal()`**: writable state that resets whenever a source signal changes (such as keeping a selected item valid when the list refreshes, without touching `effect()`).",
        "**`effect(onCleanup => ...)`** is strictly for syncing signals to non-signal external APIs (logging, `localStorage`, canvas). **Never** call `.set()` inside an `effect` to synchronize two signals.",
        "Signal tracking stops at `await`: always read every signal you depend on **before** an asynchronous boundary, and wrap non-tracked reads in `untracked()`.",
        "For DOM reads/writes after Angular renders, use `afterRenderEffect({ earlyRead, write })` instead of `effect()`."
      ],
      code: `
import { Component, computed, effect, linkedSignal, signal, untracked } from '@angular/core';

interface ShippingOption { id: string; label: string; cost: number }

@Component({
  selector: 'app-checkout-summary',
  template: \`
    <p>Subtotal: {{ subtotal() }} · Total: {{ total() }}</p>
    <button type="button" (click)="qty.update(q => q + 1)">Add one</button>
    <button type="button" (click)="toggleExpress()">Switch shipping</button>
  \`,
})
export class CheckoutSummary {
  readonly price = signal(100);
  readonly qty = signal(1);
  readonly hasCoupon = signal(false);

  readonly options = signal<ShippingOption[]>([
    { id: 'std', label: 'Standard', cost: 10 },
    { id: 'exp', label: 'Express', cost: 25 },
  ]);

  // Writable derived state: keeps previous choice if still in options, else resets to first
  readonly selectedShipping = linkedSignal<ShippingOption[], ShippingOption>({
    source: this.options,
    computation: (opts, prev) => opts.find(o => o.id === prev?.value.id) ?? opts[0],
  });

  // Lazy, memoized, glitch-free, tracks dynamic branches automatically
  readonly subtotal = computed(() => this.price() * this.qty());
  readonly discount = computed(() => (this.qty() > 0 && this.hasCoupon() ? 15 : 0));
  readonly total = computed(() => this.subtotal() + this.selectedShipping().cost - this.discount());

  constructor() {
    effect((onCleanup) => {
      const currentTotal = this.total();              // tracked
      const snapshotQty = untracked(this.qty);        // read without subscribing
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
      practice: "Open the Signal dependency graph visualization above. Set `qty = 0`, toggle the coupon, and watch `total` skip recomputing because short-circuiting (`qty() > 0 && hasCoupon()`) stopped `hasCoupon` from being tracked. Then replace `linkedSignal` in a small component with an `effect` and list two bugs that introduces.",
      teach: "Explain the difference between `computed()`, `linkedSignal()`, and `effect()`, and why setting a signal inside an `effect` is an anti-pattern.",
      analogy: "`computed` is a spreadsheet formula: you never type into that cell, and Excel recalculates it only when an input cell it actually read changes. `linkedSignal` is a pre-filled form dropdown that picks a smart default whenever the country changes, while still letting the user override it.",
      pitfalls: [
        "Using `effect()` to copy state from one signal to another instead of `computed()` or `linkedSignal()`.",
        "Reading a signal after an `await` inside `effect()` or `computed()` — reactive tracking only runs synchronously.",
        "Mutating an array in place (`items().push(x)`) and wondering why `computed()` never updates.",
        "Inspecting or measuring DOM elements inside `effect()` (which runs before DOM updates) instead of `afterRenderEffect()`."
      ],
      quiz: [
        { q: "Inside `computed(() => qty() > 0 && coupon() ? 15 : 0)`, `qty()` is `0`. What happens when `coupon` changes?", a: ["`computed` throws an error", "It does not recalculate because `coupon()` was never read during the last run", "It recalculates anyway", "It unsubscribes permanently"], c: 1, why: "Dependencies are recorded dynamically per execution; short-circuiting prevented `coupon()` from being read." },
        { q: "You want a `selectedPage` signal that defaults to `1` whenever `filterText` changes, yet lets the user click page 2 or 3. Best primitive?", a: ["`effect()` that calls `selectedPage.set(1)`", "`linkedSignal(() => (this.filterText(), 1))`", "`computed()`", "`untracked()`"], c: 1, why: "`linkedSignal` provides writable state that resets automatically when its source changes." },
        { q: "Why should DOM layout measurements live in `afterRenderEffect` instead of `effect`?", a: ["`effect` cannot run in the browser", "`effect` runs before Angular finishes updating the DOM", "`afterRenderEffect` runs on the server too", "`effect` has no cleanup hook"], c: 1, why: "`afterRenderEffect` runs after rendering in explicit read/write phases, avoiding stale measurements and layout thrashing." }
      ]
    },
    {
      id: 'di', title: 'Services and hierarchical dependency injection', level: 1, mins: 35,
      why: "Just like ASP.NET Core, Angular is built around dependency injection — except Angular's injector is a **tree** that mirrors your components and routes, and `inject()` replaces verbose constructor parameter lists.",
      points: [
        "Decorate app-wide singleton services with `@Service()` (or `@Injectable({ providedIn: 'root' })`). They are tree-shakeable and never need to be listed in a `providers` array.",
        "Use `inject(MyService)` in class field initializers, constructors, or functional guards/interceptors. Outside an injection context, `inject()` throws — pass an `Injector` to `runInInjectionContext()` if needed.",
        "Compare lifetimes with ASP.NET Core: `providedIn: 'root'` / `@Service()` behaves like **Singleton**; providing a service on a **Route** scopes it to that route subtree; providing `@Service({ autoProvided: false })` in `@Component({ providers: [...] })` creates an isolated instance per component element (destroyed when the component unmounts).",
        "Resolution walks two trees: first up the **`ElementInjector`** hierarchy (host elements), then up the **`EnvironmentInjector`** hierarchy (routes → root). Modifiers (`{ optional: true, skipSelf: true, self: true, host: true }`) customize the lookup.",
        "Inside `@Component`, `providers` exposes a service to projected children (`<ng-content />`), whereas `viewProviders` hides it from projected content.",
        "Use `InjectionToken<T>` for non-class dependencies (such as configuration objects or `DOCUMENT`), with an optional root `factory`."
      ],
      code: `
import { Component, InjectionToken, Service, inject, signal } from '@angular/core';

export interface ApiSettings { readonly baseUrl: string }

export const API_SETTINGS = new InjectionToken<ApiSettings>('api.settings', {
  providedIn: 'root',
  factory: () => ({ baseUrl: 'https://localhost:5001' }),
});

// App-wide singleton (equivalent to ASP.NET Core AddSingleton, tree-shakeable)
@Service()
export class CartStore {
  private readonly _items = signal<string[]>([]);
  readonly items = this._items.asReadonly();

  add(name: string): void {
    this._items.update(list => [...list, name]);
  }
}

// Component-scoped service: one instance per component tree that provides it
@Service({ autoProvided: false })
export class DraftBuffer {
  readonly notes = signal('');
}

@Component({
  selector: 'app-editor-panel',
  providers: [DraftBuffer],
  template: \`
    <p>Api: {{ settings.baseUrl }} · Cart: {{ cart.items().length }}</p>
    <p>Parent optional draft: {{ parentDraft ? 'found' : 'none' }}</p>
  \`,
})
export class EditorPanel {
  protected readonly settings = inject(API_SETTINGS);
  protected readonly cart = inject(CartStore);
  protected readonly localDraft = inject(DraftBuffer);
  protected readonly parentDraft = inject(DraftBuffer, { optional: true, skipSelf: true });
}
`,
      practice: "Register a service with `readonly id = crypto.randomUUID()` once with `@Service()` (singleton) and once with `@Service({ autoProvided: false })` inside two sibling `<app-panel>` components' `providers` array. Display both IDs and verify why one matches everywhere while the other differs per panel.",
      teach: "Compare Angular's `@Service()` + component `providers` + `InjectionToken` to ASP.NET Core's `AddSingleton`, `AddScoped`, and `IOptions<T>`.",
      analogy: "Looking up a dependency with `inject()` is asking for a tool at a workshop. You check your own workbench first (`ElementInjector`), then ask your team lead's parent bench up the aisle, and finally walk to the central warehouse (`EnvironmentInjector` root). A service listed in a component's `providers` is a private toolbox at that bench.",
      pitfalls: [
        "Calling `inject()` inside a click handler or `setTimeout` callback instead of capturing the reference in a field initializer.",
        "Forgetting `{ optional: true }` when probing for a parent service, causing `NullInjectorError` at runtime.",
        "Exposing a writable `signal` publicly from a `@Service()` instead of `.asReadonly()` plus explicit update methods.",
        "Confusing `providers` (shared with `<ng-content />` children) and `viewProviders` (private to the component's own template)."
      ],
      quiz: [
        { q: "Where is calling `inject(CartStore)` valid?", a: ["Inside a button's `(click)` handler method", "In a class field initializer, constructor, factory provider, or functional route guard", "After an `await` inside an `async` method", "Inside any plain utility function called at runtime"], c: 1, why: "`inject()` requires an active injection context, which Angular provides during DI construction and functional router/HTTP callbacks." },
        { q: "Two sibling components each list `DraftBuffer` in their `@Component({ providers: [DraftBuffer] })`. How many instances are created?", a: ["One shared singleton", "Two independent instances, destroyed when each component is destroyed", "One per route", "Compile error"], c: 1, why: "Component-level providers live on each element's `ElementInjector` and match that component's lifecycle." },
        { q: "What does `inject(Logger, { optional: true, skipSelf: true })` do?", a: ["Throws if `Logger` is on the current element", "Skips the current element's injector, searches ancestors, and returns `null` if absent", "Creates a new `Logger` instance", "Searches only the root injector"], c: 1, why: "`skipSelf` starts at the parent injector and `optional` prevents throwing when no provider exists." }
      ]
    },
    {
      id: 'routing', title: 'Routing, route inputs and lazy loading', level: 1, mins: 35,
      why: "A multi-page SPA should keep shareable state (selected product, page number, filters) in the URL, load heavy feature areas on demand, and pass URL parameters directly into components as clean signal inputs.",
      points: [
        "Configure routes in a `Routes` array with `provideRouter(routes, withComponentInputBinding(), withViewTransitions())` and render matched views in `<router-outlet />`.",
        "With `withComponentInputBinding()`, path parameters (`products/:id`), query params (`?sort=price`), and resolved data bind directly into `input()` signals — no manual `ActivatedRoute` subscription needed.",
        "Link declaratively with `routerLink` and `routerLinkActive` (never plain `href`, which reloads the whole page), and navigate imperatively with `Router.navigate()`.",
        "Keep the initial bundle small by lazy-loading feature routes with `loadComponent` or `loadChildren` (`() => import('./...').then(m => m.MyPage)`).",
        "Order routes from most specific to least specific: Angular uses **first-match wins**, so put the `**` wildcard not-found route last.",
        "Route `providers` create a route-level `EnvironmentInjector` shared across child routes and destroyed when the user leaves that section."
      ],
      code: `
import { Component, input } from '@angular/core';
import { Routes, RouterLink, RouterLinkActive, RouterOutlet, provideRouter, withComponentInputBinding, withViewTransitions } from '@angular/router';

@Component({
  selector: 'app-product-detail',
  template: \`
    <h2>Product #{{ id() }}</h2>
    <p>Tab: {{ tab() }}</p>
  \`,
})
export class ProductDetail {
  readonly id = input.required<string>();     // bound from /products/:id
  readonly tab = input('overview');           // bound from ?tab=reviews
}

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

export const routes: Routes = [
  { path: '', redirectTo: '/products/42', pathMatch: 'full' },
  { path: 'products/:id', loadComponent: () => import('./product-detail').then(m => m.ProductDetail), title: 'Product' },
  { path: '**', redirectTo: '/products/42' },
];

export const routerProviders = [
  provideRouter(routes, withComponentInputBinding(), withViewTransitions()),
];
`,
      practice: "Set up nested `children` routes under `products/:id` (`overview` and `reviews`), each rendered inside `ProductDetail`'s own `<router-outlet />`. Confirm in the Network tab that a lazy route's JS chunk only downloads when you click its `routerLink`.",
      teach: "Explain what `withComponentInputBinding()` changes compared to injecting `ActivatedRoute`, and why lazy `loadComponent` matters for initial load time.",
      analogy: "Routing is a building directory paired with lazy-loaded rooms. The lobby only brings in the furniture for a room (`loadComponent`) the moment a visitor opens its door, and `withComponentInputBinding()` slips the visitor's badge (`:id`) straight under the door as a signal input.",
      pitfalls: [
        "Putting the `{ path: '**', ... }` wildcard before specific routes, shadowing everything after it.",
        "Using `href=\"/products/42\"` instead of `routerLink`, triggering a full browser reload and wiping memory state.",
        "Forgetting `withComponentInputBinding()` in `provideRouter(...)`, leaving route param `input()` signals `undefined`.",
        "Adding a static import of a lazy-loaded component in the same route file — bundlers then include it in the eager chunk."
      ],
      quiz: [
        { q: "What does `withComponentInputBinding()` enable in `provideRouter`?", a: ["Two-way binding to `location.hash`", "Route params, query params, and resolved data bind directly to component `input()` signals", "Automatic authentication", "Preloading all lazy chunks"], c: 1, why: "It binds router state onto matching component inputs so components stay decoupled from `ActivatedRoute`." },
        { q: "Why prefer `loadComponent: () => import('./admin').then(m => m.Admin)` over `component: Admin` for secondary pages?", a: ["It runs on a background thread", "It splits `Admin` into a separate lazy JS chunk loaded only when visited", "It enables SSR", "It makes `Admin` a singleton"], c: 1, why: "Dynamic `import()` tells the bundler to emit a separate chunk, keeping the initial bundle smaller." },
        { q: "Where must a `{ path: '**', component: NotFound }` route be placed?", a: ["First in `routes`", "Last in `routes`, because matching is first-match wins", "Inside every child route", "Only on lazy routes"], c: 1, why: "The router stops at the first matching route; placing `**` earlier catches valid URLs." }
      ]
    },
    {
      id: 'forms', title: 'Signal Forms and validation', level: 1, mins: 40,
      why: "Most enterprise UIs are forms with conditional fields, cross-field validation, and server error mapping. Angular's Signal Forms (`@angular/forms/signals`) replace `FormGroup` boilerplate with a typed signal model and declarative validation schemas.",
      points: [
        "Start from a non-nullable `signal(...)` model (use `''`, `0`, `false`, `[]` — never `null` or `undefined`), and pass it to `form(this.model, schemaPath => ...)`.",
        "Bind inputs with `[formField]=\"myForm.name\"`. Because `[formField]` manages `disabled`, `readonly`, `hidden`, `name`, and `value`, never add conflicting attributes like `[value]`, `[disabled]`, `min`, or `max` on the input element.",
        "Read state by **calling the field as a function**: `myForm.name().touched()`, `myForm.name().errors()`, `myForm().invalid()` (only `.length` on array subtrees omits `()`).",
        "Compose rules declaratively in the schema: `required()`, `min()`, `email()`, `validate()` (returning `undefined` when valid), `applyWhen()` for conditional rules, `applyEach()` for arrays, and `validateAsync()` for server checks.",
        "Handle submission with `submit(this.myForm, async () => { ... })`: it marks all fields touched and runs your `async` callback only when valid.",
        "When working in older Angular apps, you'll still see **Reactive Forms** (`FormGroup`, `NonNullableFormBuilder`, `Validators`) — same model-driven idea, built on RxJS streams instead of signals."
      ],
      code: `
import { Component, signal } from '@angular/core';
import { FormField, applyWhen, form, min, required, submit, validate } from '@angular/forms/signals';

@Component({
  selector: 'app-product-form',
  imports: [FormField],
  template: \`
    <form (submit)="onSubmit(); $event.preventDefault()" novalidate>
      <label for="prod-name">Name</label>
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

      @if (!productForm.discount().hidden()) {
        <label for="prod-disc">Discount %</label>
        <input id="prod-disc" type="number" [formField]="productForm.discount" />
      }

      <button type="submit" [disabled]="productForm().invalid()">Save</button>
    </form>
  \`,
})
export class ProductForm {
  protected readonly model = signal({ name: '', price: 0, onSale: false, discount: 0 });

  protected readonly productForm = form(this.model, (s) => {
    required(s.name, { message: 'Name is required' });
    min(s.price, 0.01, { message: 'Price must be positive' });
    applyWhen(s.discount, ({ valueOf }) => valueOf(s.onSale), (disc) => {
      min(disc, 1, { message: 'Discount must be at least 1%' });
    });
    validate(s.name, ({ value }) =>
      value().trim().toLowerCase() === 'test' ? { kind: 'reserved', message: 'Choose a real product name' } : undefined);
  });

  protected onSubmit(): void {
    submit(this.productForm, async () => {
      console.log('Submitting', this.model());
    });
  }
}
`,
      practice: "Add a `sku` field to the form above with `pattern(s.sku, /^[A-Z]{3}-\\d{3}$/, { message: 'Use ABC-123' })` and a cross-field `validate()` rule that forbids discounts over 50% when `price < 20`. Submit with an invalid SKU and verify `submit()` marks every field touched without running the callback.",
      teach: "Explain the difference between `productForm.name` (a field node) and `productForm.name()` (its `FieldState` signals), and why Signal Forms avoid `null` in the model.",
      analogy: "Signal Forms turn your form into a typed contract backed directly by a single source-of-truth signal. `[formField]` wires the DOM input directly to that field's state, and calling `field()` is opening the live status gauge (`valid()`, `touched()`, `errors()`) for that input.",
      pitfalls: [
        "Forgetting parentheses when reading field state: writing `form.name.errors()` instead of `form.name().errors()`.",
        "Putting `null` in the initial `signal({ name: null })` model instead of `''` or `0`.",
        "Adding `[disabled]`, `[value]`, `min`, or `max` attributes on an input bound with `[formField]` — define them in the schema instead.",
        "Returning `null` from a custom `validate()` function (return `undefined` when valid) or forgetting `async` on the `submit()` callback."
      ],
      quiz: [
        { q: "How do you read whether `productForm.name` has been touched?", a: ["`productForm.name.touched()`", "`productForm.name().touched()`", "`productForm().name.touched`", "`productForm.name.get('touched')`"], c: 1, why: "Calling the field (`productForm.name()`) returns its `FieldState`, which exposes the `touched()` signal." },
        { q: "When using `[formField]` on an `<input type=\"number\">`, where should a minimum value rule live?", a: ["As `min=\"1\"` on the HTML input", "In the `form()` schema using `min(s.price, 1)`", "Inside a `(change)` handler", "In `ngOnInit`"], c: 1, why: "`[formField]` owns input state and forbids template `min`/`max`/`disabled`/`value` attributes; rules live in the schema." },
        { q: "What does `submit(this.form, async () => ...)` do automatically before checking validity?", a: ["Resets the model", "Marks every field as touched so validation errors display", "Sends a POST request", "Clears server errors"], c: 1, why: "Marking fields touched reveals errors to the user if they click Save without editing a required field, and skips the callback when invalid." }
      ]
    },
    // ---------------- Advanced ----------------
    {
      id: 'http', title: 'HTTP, httpResource and talking to ASP.NET Core', level: 2, mins: 45,
      why: "This is where Angular meets your ASP.NET Core API and SQL database. Reactive `httpResource` reads, functional interceptors, XSRF protection, and mapping RFC 9457 `ProblemDetails` keep network code clean, cancellable, and type-safe.",
      points: [
        "Use `httpResource(() => ...)` for reactive `GET` reads: whenever a signal inside its URL function changes, it cancels the in-flight request and fetches the new one. Return `undefined` to skip fetching.",
        "Always guard `httpResource.value()` with `.hasValue()` (or check `.error()` first): reading `.value()` while a resource is in `'error'` throws.",
        "Use `HttpClient` (`post`, `put`, `patch`, `delete`) inside services or handlers for **mutations** — `HttpClient` calls are cold `Observable`s, so nothing sends until subscribed (or awaited via `firstValueFrom`).",
        "Configure `provideHttpClient(withInterceptors([authInterceptor]))`: functional interceptors work like **ASP.NET Core middleware**, running on requests going out and responses coming back. Clone immutable `HttpRequest`s with `req.clone(...)`.",
        "Turn ASP.NET Core's `ProblemDetails` (`title` and `errors`) into a typed `ApiError` so field errors attach to the exact form controls.",
        "In development, proxy `/api` to your ASP.NET Core port (`proxy.conf.json`) or allow `http://localhost:4200` in CORS (`builder.Services.AddCors`). `provideHttpClient()` configures XSRF (`XSRF-TOKEN` cookie → `X-XSRF-TOKEN` header) automatically for mutating same-origin requests."
      ],
      code: `
import { Component, inject, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHandlerFn, HttpRequest, httpResource } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export interface Product { id: number; name: string; price: number }
export type CreateProduct = Omit<Product, 'id'>;

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
      <input id="new-name" [value]="name()" (input)="name.set($any($event.target).value)"
             [attr.aria-invalid]="!!fieldErrors()['Name']?.length"
             [attr.aria-describedby]="fieldErrors()['Name']?.length ? 'new-name-err' : null" />
      @if (fieldErrors()['Name']?.[0]; as msg) { <p id="new-name-err" role="alert">{{ msg }}</p> }

      <label for="new-price">Price</label>
      <input id="new-price" [value]="price()" (input)="price.set($any($event.target).value)"
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
  readonly products = httpResource<Product[]>(() => '/api/products');

  protected readonly name = signal('');
  protected readonly price = signal('');
  protected readonly saving = signal(false);
  protected readonly submitError = signal<string | null>(null);
  protected readonly fieldErrors = signal<Record<string, string[]>>({});

  protected async addProduct(e: Event): Promise<void> {
    e.preventDefault();
    this.saving.set(true);
    this.submitError.set(null);
    this.fieldErrors.set({});
    try {
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
      practice: "Wire `ProductsPage` up to your ASP.NET Core validation API using `proxy.conf.json` (or CORS with `http://localhost:4200`). Submit a negative price and confirm `ProblemDetails` maps directly to `fieldErrors()['Price']` next to the input. Also pass `parse` with a runtime schema to `httpResource` so unexpected API payloads fail cleanly.",
      teach: "Explain why `httpResource` is preferred for reads while `HttpClient` is used for writes, and how `HttpInterceptorFn` compares to ASP.NET Core middleware.",
      analogy: "`httpResource` is a live subscription desk that automatically tears up your previous request ticket if you ask for a different page before the clerk comes back. `HttpInterceptorFn` is the security checkpoint every outgoing and incoming envelope passes through in order.",
      pitfalls: [
        "Reading `products.value()` in a template without `@if (products.hasValue())` or `@if (products.error())` — `.value()` throws when in `'error'` status.",
        "Calling `this.http.post(...)` without subscribing or awaiting `firstValueFrom(...)`: cold `Observable`s send nothing until subscribed.",
        "Mutating `req.headers` in place inside an interceptor instead of `req.clone(...)`.",
        "Leaving `CORS` configured only for `:5173` on the ASP.NET Core backend while Angular serves on `:4200`."
      ],
      quiz: [
        { q: "What happens if you read `userResource.value()` directly when the HTTP request failed?", a: ["It returns `undefined`", "It throws an error because the resource is in `'error'` status", "It retries the request", "It returns the raw `HttpErrorResponse`"], c: 1, why: "Guard reads with `hasValue()` or check `error()` first." },
        { q: "Why does `this.http.delete('/api/products/1')` do nothing if you ignore its return value?", a: ["`DELETE` is blocked by default", "`HttpClient` returns a cold `Observable` that only executes when subscribed", "Interceptors cancel unawaited calls", "Angular requires `HttpHeaders`"], c: 1, why: "Cold observables wait for a subscriber (or `firstValueFrom` / `toSignal`) before opening the network request." },
        { q: "You need an auth header added to every outgoing API request. Where does that belong?", a: ["In every component template", "In a functional `HttpInterceptorFn` registered via `provideHttpClient(withInterceptors([...]))`", "Inside `httpResource`'s `parse` function", "In `router.navigate`"], c: 1, why: "Functional interceptors wrap every `HttpClient` and `httpResource` request in one central place." }
      ]
    },
    {
      id: 'rxjs', title: 'RxJS streams and Signals interop', level: 2, mins: 40,
      why: "Signals excel at synchronous state values; RxJS `Observable`s excel at coordinating **events over time** — debounced keystrokes, racing search requests, retries, and double-click protection. Knowing both and bridging them cleanly is essential in Angular.",
      points: [
        "A **Signal** always has a current value right now; an **Observable** models a sequence of asynchronous events over time (`debounceTime`, `retry`, cancellation).",
        "Higher-order flattening operators decide what happens when a new event arrives before the previous async call finishes:",
        "**`switchMap`**: cancels the previous inner request and keeps only the latest — ideal for typeahead search.",
        "**`exhaustMap`**: ignores new events while the current request is still running — ideal for Pay / Submit buttons to stop double-submits.",
        "**`concatMap`** queues in strict order (sequential writes); **`mergeMap`** runs all concurrently.",
        "Prevent memory leaks with `takeUntilDestroyed()` (inside an injection context, or pass `DestroyRef`), or convert streams to signals with `toSignal(obs$, { initialValue })` which unsubscribes automatically.",
        "Bridge the other way with `toObservable(mySignal)` when you want to apply RxJS operators like `debounceTime` + `switchMap` to a signal."
      ],
      code: `
import { Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { Subject, catchError, debounceTime, distinctUntilChanged, exhaustMap, of, switchMap } from 'rxjs';

export interface SearchApi {
  search(query: string): import('rxjs').Observable<string[]>;
  checkout(): import('rxjs').Observable<string>;
}

// Standalone RxJS demonstration (verified at runtime by verify-angular.mjs)
export function compareFlattening(
  makeRequest: (tag: string) => import('rxjs').Observable<string>,
  triggers$: import('rxjs').Observable<string>,
  mode: 'switch' | 'exhaust',
) {
  return triggers$.pipe(
    mode === 'switch' ? switchMap(makeRequest) : exhaustMap(makeRequest),
  );
}

@Component({
  selector: 'app-search-bar',
  template: \`
    <input type="search" [value]="query()" (input)="query.set($any($event.target).value)" />
    <p>{{ results().length }} matches · {{ status() }}</p>
    <button type="button" (click)="payClicks$.next()">Pay now</button>
  \`,
})
export class SearchBar {
  protected readonly query = signal('');
  protected readonly status = signal('idle');
  protected readonly payClicks$ = new Subject<void>();

  // Signal -> Observable for time-based operators -> back to Signal (auto-unsubscribed)
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
    // exhaustMap ignores extra clicks until checkout finishes
    this.payClicks$.pipe(
      exhaustMap(() => {
        this.status.set('paying');
        return of('paid').pipe(catchError(() => of('failed')));
      }),
      takeUntilDestroyed(),
    ).subscribe(res => this.status.set(res));
  }

  private fakeSearch(q: string) {
    return of([\`Result for \${q}\`]);
  }
}
`,
      practice: "Log the output of `compareFlattening` with two rapid triggers 20 ms apart against a 100 ms delayed inner observable in both `'switch'` and `'exhaust'` modes. Explain why `'switch'` prints only the second trigger while `'exhaust'` prints only the first.",
      teach: "Explain `switchMap` vs `exhaustMap` using a real UI feature for each, and why `toSignal` eliminates manual `unsubscribe()` calls.",
      analogy: "`switchMap` is a short-order cook who throws away the half-made sandwich when the customer yells 'actually, make it turkey!'. `exhaustMap` is an elevator button: pressing it five times while the doors are closing does not call five elevators.",
      pitfalls: [
        "Using `mergeMap` for typeahead search: out-of-order network responses overwrite newer results with stale ones.",
        "Calling `.subscribe()` without `takeUntilDestroyed()` or `async` pipe, leaving ghost subscriptions running after navigation.",
        "Omitting `{ initialValue }` on `toSignal` for an async observable, making the signal type `T | undefined` unexpectedly.",
        "Nesting `.subscribe()` inside another `.subscribe()` instead of composing with `switchMap` / `exhaustMap`."
      ],
      quiz: [
        { q: "Which operator cancels an in-flight search HTTP request as soon as the user types a new character?", a: ["`mergeMap`", "`concatMap`", "`switchMap`", "`exhaustMap`"], c: 2, why: "`switchMap` unsubscribes from the previous inner observable (aborting the HTTP call) whenever a new outer value arrives." },
        { q: "A user double-clicks a 'Place order' button. Which operator drops the second click until the first request finishes?", a: ["`switchMap`", "`exhaustMap`", "`mergeMap`", "`debounceTime`"], c: 1, why: "`exhaustMap` ignores new triggers while an inner observable is still active." },
        { q: "What does `takeUntilDestroyed()` automate?", a: ["Retrying failed HTTP calls", "Completing the observable subscription when the owning component or service is destroyed", "Converting signals to observables", "Throttling events"], c: 1, why: "It ties subscription lifetime to the current `DestroyRef` automatically." }
      ]
    },
    {
      id: 'guards', title: 'Route guards, resolvers and error boundaries', level: 2, mins: 40,
      why: "Protecting routes, handling redirects cleanly, and keeping a runtime template failure from blanking the whole screen turn a demo into resilient software. Remember: client guards shape UX, while your ASP.NET Core API enforces real security.",
      points: [
        "Guards are plain functions (`CanActivateFn`, `CanMatchFn`, `CanDeactivateFn`) that run in an injection context, so use `inject()` directly.",
        "Return `true` to allow, `false` to block, or a `UrlTree` / `RedirectCommand` (`router.parseUrl('/login')`) to redirect cleanly.",
        "`CanMatchFn` decides whether a route is even matched (useful for roles or feature flags, falling through to another route on `false`); `CanActivateFn` runs after matching.",
        "Guards in the same array run concurrently when async; do not expect one guard in `canActivate: [a, b]` to finish before `b` starts.",
        "**Security boundary**: client guards only hide UI routes; a user can bypass JavaScript in dev tools. Always enforce `RequireAuthorization()` and resource ownership on the ASP.NET Core API.",
        "**Error boundaries** (Angular v22.2+): wrap risky template subtrees in `@boundary { ... } @error (let err; reset = $reset) { ... }` to catch render errors locally and let users retry with `$reset()`."
      ],
      code: `
import { Component, Service, inject, input, signal } from '@angular/core';
import { CanActivateFn, CanMatchFn, RedirectCommand, ResolveFn, Router, Routes } from '@angular/router';

@Service()
export class AuthSession {
  readonly signedIn = signal(false);
  readonly role = signal<'user' | 'admin'>('user');
}

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthSession);
  const router = inject(Router);
  return auth.signedIn() ? true : new RedirectCommand(router.parseUrl('/login'));
};

export const adminMatchGuard: CanMatchFn = () => inject(AuthSession).role() === 'admin';

export const titleResolver: ResolveFn<string> = (route) =>
  \`Order #\${route.paramMap.get('id') ?? '0'}\`;

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
      practice: "Protect an `/admin` route with `canMatch` and `canActivate`, and render a `@boundary` around a chart component that throws when fed invalid input. Verify that clicking Retry calls `$reset()` and recovers without reloading the page. Then call your `/api/orders` endpoint from `curl` without a token and confirm ASP.NET Core still returns `401`.",
      teach: "Explain the difference between `CanActivateFn` and `CanMatchFn`, and why route guards alone never secure an API.",
      analogy: "A route guard is a museum floor rope: it guides visitors smoothly to the ticket desk (`RedirectCommand`). The ASP.NET Core API's `RequireAuthorization()` is the locked vault door — nobody relies on a velvet rope to protect the vault. `@boundary` is a circuit breaker on one room's lights so one blown bulb never blacks out the building.",
      pitfalls: [
        "Assuming `canActivate` prevents someone from calling `/api/admin/...` directly with `fetch` or `curl`.",
        "Putting `@boundary` inside a component around `<ng-content />` expecting it to catch errors in projected content — wrap the parent template around the component instead.",
        "Making `guardB` depend on side effects of `guardA` in `canActivate: [guardA, guardB]`, even though async guards run concurrently.",
        "Using a `ResolveFn` for slow non-critical requests without feedback: navigation stays frozen on the old page until the resolver completes."
      ],
      quiz: [
        { q: "Why must authorization still be enforced in ASP.NET Core even when Angular routes have `canActivate` guards?", a: ["Angular guards don't run on mobile", "Browser code runs on the user's machine and can be bypassed; only the server enforces access", "Guards only run in development", "Routers cache old tokens"], c: 1, why: "Client guards improve UX by redirecting unauthenticated users, while server policies protect real data." },
        { q: "How does `canMatch` differ from `canActivate` when returning `false`?", a: ["`canMatch` throws a 404 immediately", "`canMatch` skips the route definition so the router can match a later route with the same path", "`canMatch` only runs on child routes", "They behave identically"], c: 1, why: "With `canMatch`, you can define two routes for `/home` (for example admin vs member dashboards) and match the right one cleanly." },
        { q: "In an Angular v22.2+ `@boundary` block, what does calling `$reset()` inside `@error` do?", a: ["Reloads the browser tab", "Attempts to re-render the original `@boundary` block", "Clears all application signals", "Calls `Router.navigate(['/'])`"], c: 1, why: "`$reset()` resets the error state and retries rendering the protected template subtree." }
      ]
    },
    {
      id: 'testing', title: 'Zoneless testing: components, routing and HTTP', level: 2, mins: 45,
      why: "Modern Angular tests run in Vitest without Zone.js. Instead of manually calling `fixture.detectChanges()`, you update signals or click DOM buttons and `await fixture.whenStable()` — testing your app through real user behavior.",
      points: [
        "Follow **Act → `await fixture.whenStable()` → Assert**: trigger a signal change, input event, or button click, wait for Angular's zoneless scheduler to render, then assert on the DOM. For components using `httpResource`, call `TestBed.tick()` once so the resource effect dispatches its request before `HttpTestingController.expectOne()` flushes it.",
        "**Do NOT call `fixture.detectChanges()` or `markForCheck()`** in zoneless tests: manual `detectChanges()` masks missing reactive dependencies and does not refresh `OnPush` children the way real runs do.",
        "Test HTTP integration with `provideHttpClient()` + `provideHttpClientTesting()` and `HttpTestingController`: assert the exact request method/URL/body and flush realistic responses including `400` `ProblemDetails`.",
        "Test routed components with `RouterTestingHarness.create()` + `provideRouter(...)` instead of mocking `Router` — it exercises real guards, resolvers, and input bindings.",
        "Query the DOM like a user and screen reader (`getByRole`, `getByLabelText`, `role=\"alert\"`), not by private component fields or CSS utility classes.",
        "For `@angular/aria` or Material components, use CDK **Component Harnesses** (`TestbedHarnessEnvironment`) so tests don't break when internal markup changes."
      ],
      code: `
// Tests ProductsPage from the HTTP lesson with Vitest, TestBed and HttpTestingController.
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { beforeEach, afterEach, describe, expect, it } from 'vitest';
import { ProductsPage } from './products-page';

describe('ProductsPage', () => {
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ProductsPage],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('shows server validation error next to the price field', async () => {
    const fixture = TestBed.createComponent(ProductsPage);
    TestBed.tick();                        // run httpResource effect so GET /api/products is queued

    // Flush initial httpResource GET /api/products before awaiting whenStable()
    http.expectOne('/api/products').flush([{ id: 1, name: 'Laptop', price: 1200 }]);
    await fixture.whenStable();

    const root = fixture.nativeElement as HTMLElement;
    expect(root.textContent).toContain('Laptop');

    // Act: fill inputs and submit
    const nameInput = root.querySelector('#new-name') as HTMLInputElement;
    const priceInput = root.querySelector('#new-price') as HTMLInputElement;
    nameInput.value = 'Broken';
    nameInput.dispatchEvent(new Event('input'));
    priceInput.value = '-5';
    priceInput.dispatchEvent(new Event('input'));
    root.querySelector('form')!.dispatchEvent(new Event('submit'));

    // Flush 400 ProblemDetails from ASP.NET Core
    const req = http.expectOne(r => r.method === 'POST' && r.url === '/api/products');
    expect(req.request.body).toEqual({ name: 'Broken', price: -5 });
    req.flush(
      { title: 'One or more validation errors occurred.', errors: { Price: ['Must be positive'] } },
      { status: 400, statusText: 'Bad Request' },
    );

    // Wait for zoneless signal updates to render
    await fixture.whenStable();

    expect(priceInput.getAttribute('aria-invalid')).toBe('true');
    expect(root.querySelector('#new-price-err')?.textContent).toContain('Must be positive');
  });
});
`,
      practice: "Extend this test suite to verify the happy path: flush a `201` response on `POST /api/products`, verify `httpResource` reloads `GET /api/products`, and confirm the new item appears in the list. Then write a `RouterTestingHarness` test for your `ProductDetail` route.",
      teach: "Explain why zoneless tests use `await fixture.whenStable()` instead of `fixture.detectChanges()`, and what `http.verify()` catches at the end of a test.",
      analogy: "`await fixture.whenStable()` is waiting for the restaurant kitchen to finish plating after you hand over an order ticket. Reaching behind the counter with `detectChanges()` forces one dish out early, hiding whether the kitchen bell (`signal` / event) actually rang.",
      pitfalls: [
        "Calling `fixture.detectChanges()` out of habit in zoneless `OnPush` tests — it hides broken reactivity.",
        "Awaiting `fixture.whenStable()` before flushing an in-flight `httpResource` request — `whenStable()` waits for pending tasks, so flush with `TestBed.tick()` + `http.expectOne()` first.",
        "Forgetting `http.verify()` in `afterEach`, missing stray or duplicate API calls.",
        "Mocking `Router` manually instead of testing real route config and guards with `RouterTestingHarness`.",
        "Asserting on private component fields instead of rendered DOM text and ARIA states."
      ],
      quiz: [
        { q: "In zoneless Angular v22 tests, how should you wait for signal changes and DOM events to render?", a: ["Call `fixture.detectChanges()` repeatedly", "Await `await fixture.whenStable()`", "Call `tick(100)` with `fakeAsync`", "Call `fixture.changeDetectorRef.markForCheck()`"], c: 1, why: "Zoneless updates schedule asynchronously; `whenStable()` waits for pending rendering and microtasks cleanly." },
        { q: "What does `httpTesting.verify()` check in `afterEach`?", a: ["That TypeScript types match the API", "That no unexpected or un-flushed HTTP requests remain open", "That CORS headers are present", "That the real backend is running"], c: 1, why: "It fails the test if the component fired extra requests your test didn't expect." },
        { q: "Recommended tool for testing components that navigate or read route parameters?", a: ["Mock `ActivatedRoute` with a plain object", "`RouterTestingHarness` with `provideRouter(...)`", "Replace `RouterLink` in tests", "Test only in E2E"], c: 1, why: "`RouterTestingHarness` exercises real route matching, guards, resolvers, and component input binding." }
      ]
    },
    // ---------------- Expert ----------------
    {
      id: 'cd', title: 'Zoneless change detection and rendering performance', level: 3, mins: 40, viz: 'ngcd',
      why: "Earlier Angular apps leaned on Zone.js monkey-patching every browser timer and event, walking the entire component tree from top to bottom. Modern Angular defaults to `OnPush` + Signals and runs zoneless — refreshing only the exact views whose signals changed.",
      points: [
        "**How Zone.js worked (legacy `Eager`)**: every click, timer, or HTTP response notified Zone.js, which checked **every component** from root down, even untouched subtrees.",
        "**`ChangeDetectionStrategy.OnPush`** (now the default in Angular 22; `Default` is deprecated in favor of `Eager`): a view is checked only when an input reference changes, a DOM event fires inside it or a child, `markForCheck()` is called, or a **signal read in its template** updates.",
        "**Local signal change detection (zoneless)**: when a signal updates, Angular marks only the specific views that read that signal dirty — skipping unrelated parents, siblings, and other branches.",
        "Never mutate objects or arrays passed to `input()` (`items.push(x)`): `OnPush` checks inputs by reference (`Object.is`), so mutating in place skips the update.",
        "Avoid expensive work inside templates (no `[items]=\"items().filter(...)\"` or creating fresh arrays/objects inside `{{ }}`). Derive once with `computed()` so work runs only when inputs actually change.",
        "Profile with Angular DevTools (flamegraph & change-detection highlights) and virtualize very large lists (`@angular/cdk/scrolling`)."
      ],
      code: `
import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';

interface Product { readonly id: number; readonly name: string; readonly price: number }

@Component({
  selector: 'app-product-row',
  changeDetection: ChangeDetectionStrategy.OnPush,
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
    <input type="search" [value]="query()" (input)="query.set($any($event.target).value)" />
    <p>{{ visible().length }} shown</p>
    <ul>
      @for (p of visible(); track p.id) {
        <app-product-row [product]="p" />
      }
    </ul>
  \`,
})
export class CatalogView {
  readonly items = input.required<readonly Product[]>();
  protected readonly query = signal('');

  // Memoized: filters ONLY when items() or query() changes, never on unrelated checks
  protected readonly visible = computed(() => {
    const q = this.query().trim().toLowerCase();
    return q ? this.items().filter(p => p.name.toLowerCase().includes(q)) : this.items();
  });
}
`,
      practice: "Open the Change detection explorer visualization above. Trigger an update on `Card B` in all three modes (`Eager`, `OnPush`, `Zoneless + Signal`) and compare which components get checked — especially when toggling the shared Cart signal. Then run Angular DevTools profiler on a 5,000-row list.",
      teach: "Explain how Signals allow Angular to skip checking parent and sibling components without Zone.js.",
      analogy: "Legacy Zone.js change detection is a security guard walking through every room of a hotel every time any guest rings a bell. `OnPush` + Signals is a direct switchboard: only the room whose wire buzzed lights up, and nobody opens the other doors.",
      pitfalls: [
        "Calling `items.filter(...)` or building `{ ... }` literals directly in a template expression, allocating new arrays on every check and invalidating `@for` / child inputs.",
        "Mutating an array in place before passing it to an `OnPush` child (`Object.is` still sees the same reference).",
        "Switching a slow component to `ChangeDetectionStrategy.Eager` instead of fixing a broken non-signal mutation.",
        "Adding Zone.js overhead or manual `ApplicationRef.tick()` calls when signals already trigger local updates cleanly."
      ],
      quiz: [
        { q: "In Angular 22, which `ChangeDetectionStrategy` is enabled by default?", a: ["`ChangeDetectionStrategy.Eager`", "`ChangeDetectionStrategy.OnPush`", "`ChangeDetectionStrategy.Manual`", "Zone-only polling"], c: 1, why: "Modern Angular defaults to `OnPush`, and `Default` has been deprecated in favor of `Eager`." },
        { q: "A shared `cartCount` signal read only by `CartBadge` and `Card B` changes in a zoneless app. Which templates refresh?", a: ["The entire app starting from `App`", "Only `CartBadge` and `Card B` (views that read `cartCount`)", "Only `App` and `ProductList`", "None without `markForCheck()`"], c: 1, why: "Signals notify only the consumer views that actually read them during template evaluation." },
        { q: "Why should a filtered array come from `computed()` rather than `items().filter(...)` directly inside `@for`?", a: ["`@for` doesn't accept method calls", "A template call re-runs on every check and passes a fresh array reference each time", "`computed()` automatically calls the backend", "Template calls cannot read signals"], c: 1, why: "`computed()` caches the filtered array until `items()` or `query()` actually changes." }
      ]
    },
    {
      id: 'ssr', title: 'Deferrable views (@defer), SSR and hybrid rendering', level: 3, mins: 45,
      why: "Fast initial loads take two levers: splitting non-critical UI into lazy `@defer` chunks, and choosing per route between client rendering (CSR), static prerendering (SSG), and server rendering (SSR) with hydration.",
      points: [
        "**`@defer`** code-splits standalone components (not eagerly referenced elsewhere in the file) and loads them on triggers (`on viewport`, `on interaction`, `on hover`, `prefetch on idle`).",
        "Keep layout shifts (CLS) at zero: never defer above-the-fold LCP content, match `@placeholder` dimensions to the loaded block, and use `after` / `minimum` on `@loading` to prevent flicker.",
        "**Hybrid rendering (`ServerRoute`)**: pick `RenderMode.Prerender` for static/catalogue pages, `RenderMode.Server` for dynamic SEO pages, and `RenderMode.Client` for authenticated dashboards.",
        "Enable **`provideClientHydration()`** (in Angular 22+, incremental hydration and event replay are built in by default). Combine `@defer (on viewport; hydrate on interaction)` so server-rendered HTML stays light until the user interacts.",
        "Keep server code safe: never touch `window`, `document`, or `localStorage` during SSR — inject `DOCUMENT`, run browser-only DOM code in `afterNextRender()`, and treat `REQUEST` / `REQUEST_CONTEXT` as nullable (`null` in CSR/SSG).",
        "Disable HTTP transfer cache (`transferCache: false` or filter) for authenticated/user-specific API calls so private responses are never serialized into shared HTML."
      ],
      code: `
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
    @defer (on viewport; prefetch on idle; hydrate on interaction) {
      <app-product-reviews />
    } @placeholder (minimum 200ms) {
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
    // Runs only in the browser after hydration, never on the SSR server
    afterNextRender(() => {
      this.ready.set(this.doc.visibilityState === 'visible');
    });
  }
}

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
      practice: "Wrap a heavy chart component in `@defer (on viewport; prefetch on idle)` with a fixed-height `@placeholder` and watch its JS chunk appear in the Network tab only as you scroll down. Then check what happens to CLS if you omit the placeholder height.",
      teach: "Explain when to choose `RenderMode.Client`, `RenderMode.Prerender`, and `RenderMode.Server` in the same app, and why `window` cannot be read in a component constructor during SSR.",
      analogy: "SSR with incremental hydration is delivering a furnished shop window at dawn (`RenderMode.Server`) so visitors see the goods immediately, while only plugging in the heavy escalator (`hydrate on interaction`) in the basement when someone actually steps onto it.",
      pitfalls: [
        "Importing a deferred component anywhere outside `@defer` in the same file (for example in a `viewChild`), which forces it into the main bundle.",
        "Deferring above-the-fold hero content or omitting placeholder dimensions, hurting LCP and CLS.",
        "Reading `window` or `localStorage` unconditionally in constructors/field initializers, crashing SSR builds.",
        "Caching authenticated `HttpClient` responses in the SSR transfer cache without a filter, risking leaking user data into HTML."
      ],
      quiz: [
        { q: "What keeps a component inside `@defer` from being split into a separate lazy bundle?", a: ["Adding a `@placeholder` block", "Referencing that component outside the `@defer` block in the same file (e.g. a `viewChild`)", "Using `prefetch on idle`", "Making it standalone"], c: 1, why: "Any eager reference in the same file forces TypeScript/Angular to include it in the main chunk." },
        { q: "Best `RenderMode` for an authenticated account settings page that needs no SEO?", a: ["`RenderMode.Prerender`", "`RenderMode.Client`", "`RenderMode.Server` with public cache", "A static text file"], c: 1, why: "User-private dashboards gain nothing from SSR/prerendering and avoid server request cost with `RenderMode.Client`." },
        { q: "Where should browser-only DOM setup (such as reading `getBoundingClientRect` or `localStorage`) run in an SSR-capable component?", a: ["Directly in the constructor", "Inside `afterNextRender()` / `afterRenderEffect()`", "Inside `ngOnInit` unconditionally", "In a `ServerRoute` config"], c: 1, why: "`afterNextRender` runs only in the browser after rendering, never during Node SSR." }
      ]
    },
    {
      id: 'arch', title: 'Architecture, Angular Aria and accessibility', level: 3, mins: 45,
      why: "Sustainable apps separate state by ownership, follow predictable folder boundaries, share API contracts from OpenAPI, and ship accessible interactive widgets (tabs, comboboxes, accordions) rather than broken `<div>` click handlers.",
      points: [
        "Organize by **feature** with intent-based names (`core/`, `features/products/`, `shared/ui/`): keep singletons and models (`*.model.ts`) in `core/`, domain screens in `features/`, and reusable presentational components in `shared/`.",
        "Classify state before picking tools: **server state** (`httpResource`), **URL state** (router input bindings), **form state** (`form()`), **local UI state** (`signal()`), and **shared feature state** (`@Service()` exposing `.asReadonly()` signals).",
        "Pair Tailwind CSS v4 (`@import 'tailwindcss';` — no `tailwind.config.js`) with **Angular Aria** (`@angular/aria`) for complex widgets like tabs, comboboxes, listboxes, and accordions.",
        "Angular Aria directives (`ngTabs`, `ngTabList`, `ngTab`, `ngTabPanel`, `ngCombobox`) handle roving focus, keyboard arrows, and ARIA attributes (`[aria-selected]`, `[aria-expanded]`) while you own 100% of the HTML & CSS.",
        "Keep TypeScript DTOs in sync with ASP.NET Core by generating types from `/openapi/v1.json` (e.g. `openapi-typescript`) rather than copying interfaces by hand.",
        "Verify accessibility end-to-end: semantic HTML first, explicit `<label for>` + `aria-describedby` errors, keyboard navigation with no traps, and unique route `title`s."
      ],
      code: `
import { Component, signal } from '@angular/core';
import { Tab, TabContent, TabList, TabPanel, Tabs } from '@angular/aria/tabs';

@Component({
  selector: 'app-product-specs',
  imports: [Tabs, TabList, Tab, TabPanel, TabContent],
  template: \`
    <div ngTabs>
      <ul ngTabList [(selectedTab)]="activeTab" class="tab-list">
        <li ngTab value="details" class="tab-btn">Details</li>
        <li ngTab value="shipping" class="tab-btn">Shipping</li>
      </ul>

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
      practice: "Build an accessible autocomplete filter using `@angular/aria/combobox` + `@angular/aria/listbox`, style `[aria-selected='true']` and `:focus-visible`, and operate the entire page using only Tab, Arrow keys, Enter, and Escape. Then generate TypeScript types from your ASP.NET Core `/openapi/v1.json` endpoint.",
      teach: "Explain how Angular Aria separates accessible keyboard/ARIA behavior from visual styling, and how you decide whether a piece of state belongs in `httpResource`, the URL, or a `@Service()`.",
      analogy: "Angular Aria is the hidden steering and braking system inside a car: you design any dashboard and bodywork (HTML + CSS) you like, while the directive guarantees arrow keys, focus, and screen-reader signals work safely out of the box.",
      pitfalls: [
        "Putting business logic and `HttpClient` calls directly in presentational `shared/` components.",
        "Building custom tabs or dropdowns with `<div (click)=\"...\">` — unusable from keyboards and invisible to screen readers.",
        "Using legacy Tailwind v3 `tailwind.config.js` / `@tailwind` directives in a modern Angular v22 project instead of `@import 'tailwindcss';`.",
        "Hand-copying C# DTOs into TypeScript files until a backend rename breaks production."
      ],
      quiz: [
        { q: "What problem does `@angular/aria` solve that plain CSS cannot?", a: ["Bundling Tailwind v4", "Providing WAI-ARIA roles, `aria-*` state attributes, and keyboard arrow/focus behavior while staying headless", "Fetching OpenAPI schemas", "Running SSR"], c: 1, why: "Headless directives encapsulate complex keyboard/ARIA interactions so you only write the markup and CSS styling." },
        { q: "In CSS styling for an Angular Aria `ngTab`, how should you target the currently selected tab?", a: ["`.ng-tab-active`", "`.tab-btn[aria-selected='true']`", "`::ng-deep .selected`", "A separate `.active` class toggled by hand"], c: 1, why: "Angular Aria manages native `aria-selected` / `aria-expanded` attributes directly, so styling those attributes guarantees visuals and accessibility stay in sync." },
        { q: "Where should shared pagination and active search filter state live in a product catalog?", a: ["In a root `@Service()` only", "In the URL query parameters bound via `withComponentInputBinding()`", "In `localStorage`", "Inside `TabPanel`"], c: 1, why: "Putting filters and page numbers in the URL makes views shareable, bookmarkable, and resilient to browser back/refresh." }
      ]
    }
  ]
});
