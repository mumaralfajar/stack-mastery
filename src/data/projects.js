// @ts-check
export const projects = [
  {
    level: 0, title: 'Capstone 1: Product catalogue across the stack',
    brief: "Meet each layer on its own using one small domain: a product list. Nothing connects yet, so you can focus on what each tool does.",
    build: [
      "Build a **C#** console app with a `Product` class and a `List<Product>` menu loop that adds, lists, and totals products.",
      "Write a **SQL** `CREATE TABLE` for products and five queries: all items, filtered, sorted, counted by category, and most expensive.",
      "Create an **ASP.NET Core** minimal API with `GET /api/products` and `GET /api/products/{id}` over an in-memory list that returns 404 when missing.",
      "Build a **React + TypeScript** `ProductList` component displaying typed products with an empty-state message.",
      "Style the list with plain **CSS** using a responsive grid and card component, with no horizontal overflow at 360px wide.",
      "Explain out loud what a request, a row, an object, a component, and a CSS rule each do in one clear sentence.",
      "Build the same product list in **Angular** using standalone components, `@for (...; track p.id)`, an empty state, and typed interfaces.",
      "Build that same product screen in **Dart + Flutter** out of `StatelessWidget` building blocks and run it on Chrome."
    ],
    stretch: ["Add `POST` to the API and call it with `curl`.", "Add a search box to the React list that filters as you type."],
    teach: "Teaching angle: run this as a first-day workshop. Decide which layer to show first and what details to hide for now."
  },
  {
    level: 1, title: 'Capstone 2: Full-stack task manager',
    brief: "Your first connected app: the UI calls ASP.NET Core, which talks to SQL through EF Core. One user click flows from browser to table row.",
    build: [
      "Design a `projects` and `tasks` schema (one-to-many) with foreign keys, `NOT NULL`, and `CHECK` constraints via an EF Core migration.",
      "Build a REST API to list, get, create, update, and delete tasks using typed request/response DTOs and proper status codes.",
      "Validate every write endpoint with ProblemDetails errors and wire a global exception handler.",
      "Register DI services with intentional lifetimes you can justify for each dependency.",
      "Build a React client with controlled inputs, task creation, toggle done, delete, loading indicators, and error banners.",
      "Define TypeScript types for every API payload with zero `any` escape hatches.",
      "Style the UI with Tailwind using a responsive layout, typed `Button` and `Input` variants, and clear keyboard focus rings.",
      "Add a JOIN summary endpoint returning projects with open-task counts in a single SQL query.",
      "Build an Angular client for the same API with `httpResource`, Signal Forms validation, toggle, delete, and loading/error states.",
      "Build a Flutter client for that API with validated task creation, completion toggles, and loading, empty, and error views."
    ],
    stretch: ["Filter and sort tasks via query-string parameters kept in the URL.", "Swap manual fetching for TanStack Query."],
    teach: "Teaching angle: trace one 'add task' click across every layer on a whiteboard, naming the exact code at each stop."
  },
  {
    level: 2, title: 'Capstone 3: Multi-user shop with auth and tests',
    brief: "Make the app safe, concurrent-correct, and backed by tests. This is the stage where other engineers can depend on your software.",
    build: [
      "Add JWT or cookie authentication so users only read and update their own orders via resource-based checks.",
      "Protect admin product management routes behind an explicit authorization policy.",
      "Decrement stock inside a transaction when ordering so parallel checkouts can't oversell, and prove it with a concurrency test.",
      "Add optimistic concurrency on product updates that returns 409 Conflict and shows it in the UI.",
      "Pick indexes using real query plans and record one before/after execution measurement.",
      "Add a sales report endpoint powered by a window function for running totals or top items per category.",
      "Write `WebApplicationFactory` integration tests against a real DB alongside React Testing Library tests for checkout.",
      "Manage cart state with a reducer and context while caching server reads with invalidation.",
      "Build a small design system using `@theme` tokens, dark mode, and components without outer margin leaks.",
      "Build an Angular storefront with route guards, a `ProblemDetails` auth interceptor, `@Service()` cart signals, and Vitest HTTP tests.",
      "Have the Flutter app sign in via secure storage and manage cart/orders with Bloc/Cubit plus cubit and widget tests."
    ],
    stretch: ["Use the Options pattern with startup validation for configuration.", "Emit structured logs carrying a correlation ID on every log line."],
    teach: "Teaching angle: pick one bug this project stops (overselling, IDOR, or lost updates) and run a 15-minute bug-then-fix demo."
  },
  {
    level: 3, title: 'Capstone 4: Production-grade platform',
    brief: "Push Capstone 3 to production standards. Ship measured evidence alongside code: latency numbers, telemetry, and clear design trade-offs.",
    build: [
      "Run load tests against stated p95 goals, profile one bottleneck, and document before/after timings.",
      "Add output caching or HybridCache with a documented invalidation plan and staleness window.",
      "Wire rate limiting, split liveness/readiness health checks, and clean graceful shutdown.",
      "Capture OpenTelemetry traces, metrics, and logs, following one user click all the way down to its SQL query.",
      "Move order confirmations into a background worker using the outbox pattern so delivery stays reliable under crashes.",
      "Execute a zero-downtime database migration using expand, migrate, and contract while traffic stays live.",
      "Keep the frontend fast with route splitting, virtualized lists, Core Web Vitals targets, and full keyboard navigation.",
      "Containerize services and deploy through CI/CD with automated tests, migrations, and a practiced rollback.",
      "Configure Angular with `@defer` chunks, hybrid SSR (`ServerRoute`), and runtime verification for OpenAPI types.",
      "Build signed Flutter releases in CI with dev/prod flavors, crash reporting, and a tested upgrade path."
    ],
    stretch: ["Write short Architecture Decision Records (ADRs) for your top three technical choices.", "Run a game day breaking the database, a dependency, and a deploy to verify dashboards and recovery."],
    teach: "Teaching angle: present the architecture in 30 minutes to senior engineers and defend why you rejected each alternative."
  }
];

export default projects;
