window.PROJECTS = [
  {
    level: 0, title: 'Capstone 1 — Product catalogue, four ways',
    brief: "Meet each technology on its own with the same tiny domain: a list of products. Nothing is connected yet; the goal is to feel what each layer does.",
    build: [
      "**C#**: a console app with a `Product` class and a `List<Product>`; add, list and total products from a menu loop.",
      "**SQL**: write the `CREATE TABLE` for products and five queries: all, filtered, sorted, counted per category, most expensive.",
      "**ASP.NET Core**: a minimal API with `GET /api/products` and `GET /api/products/{id}` over an in-memory list, returning 404 correctly.",
      "**React + TypeScript**: a typed `ProductList` component rendering hard-coded products with an empty-state message.",
      "**CSS**: style the product list with a responsive grid and a card component — no framework yet, and no horizontal scroll at 360px.",
      "Explain out loud what a request, a row, an object, a component and a CSS rule each are — one sentence each."
    ],
    stretch: ["Add `POST` to the API and call it with `curl`.", "Add a search box to the React list that filters as you type."],
    teach: "Teaching angle: run this as a first-day workshop. Which of the four parts would you show first, and what would you deliberately hide?"
  },
  {
    level: 1, title: 'Capstone 2 — Full-stack task manager',
    brief: "Your first real application: React talks to ASP.NET Core, which talks to a database through EF Core. Every layer of the stack carries one user action from click to row.",
    build: [
      "Schema with `projects` and `tasks` (one-to-many), foreign key, `NOT NULL` and `CHECK` constraints, created through an EF Core migration.",
      "REST API: list, get, create, update and delete tasks, with request/response DTOs and correct status codes.",
      "Validation on every write endpoint returning ProblemDetails; a global exception handler.",
      "Services registered with deliberate lifetimes; you can justify each one.",
      "React app: task list, create form with controlled inputs, toggle done, delete — with loading and error states.",
      "TypeScript types for every API response; no `any`.",
      "Styled with Tailwind: a responsive layout, reusable `Button` and `Input` components with typed variants, visible focus states.",
      "A JOIN query endpoint: projects with their open-task counts, written so it produces exactly one SQL statement."
    ],
    stretch: ["Filter and sort tasks via query-string parameters reflected in the URL.", "Replace hand-written fetching with TanStack Query."],
    teach: "Teaching angle: trace one 'add task' click through all four layers on a whiteboard, naming the exact line of code at each hop."
  },
  {
    level: 2, title: 'Capstone 3 — Multi-user shop with auth and tests',
    brief: "Make it safe, correct under concurrency, and provably working. This is the level at which software becomes something other people can rely on.",
    build: [
      "Authentication with JWT or cookies; users see and change only their own orders (resource-based authorization).",
      "An admin role with a policy-protected product management area.",
      "Placing an order decrements stock atomically inside a transaction; overselling is impossible under parallel requests — prove it with a test.",
      "Optimistic concurrency on product edits returning 409 on conflict, surfaced in the UI.",
      "Indexes chosen from real query plans; one before/after measurement written down.",
      "A sales report endpoint using a window function (running total or top-N per category).",
      "Integration tests with `WebApplicationFactory` against a real database for every endpoint; React Testing Library tests for the checkout flow.",
      "Cart implemented with a reducer and context; server state via a query library with invalidation.",
      "A small design system: tokens through `@theme`, dark mode, and components that own no outer margin."
    ],
    stretch: ["Options pattern with startup validation for all settings.", "Structured logging with a correlation ID visible in every log line of a request."],
    teach: "Teaching angle: pick one bug this project prevents — overselling, IDOR, lost update — and design a 15-minute demo that first shows the bug, then the fix."
  },
  {
    level: 3, title: 'Capstone 4 — Production-grade platform',
    brief: "Take Capstone 3 to production standard. The deliverable is not only code but evidence: measurements, dashboards, and decisions you can defend.",
    build: [
      "Load test with stated p95 targets; one bottleneck found by profiling and fixed, with before/after numbers.",
      "Caching (output cache or HybridCache) with an explicit invalidation strategy and a written staleness guarantee.",
      "Rate limiting, health checks split into liveness and readiness, graceful shutdown.",
      "OpenTelemetry traces, metrics and logs; one trace followed from the React click to the SQL statement.",
      "A background worker with the outbox pattern sending order confirmations exactly-once from the user's point of view.",
      "A zero-downtime schema change executed with expand → migrate → contract while the app runs.",
      "Frontend: route-based code splitting, virtualized long list, Core Web Vitals within budget, fully keyboard accessible.",
      "Containerized, deployed through CI with tests, migrations and a rollback plan you have actually exercised."
    ],
    stretch: ["Write an architecture decision record for your three most consequential choices.", "Run a game day: break the database, a dependency and a deploy, and document what the system and the dashboards did."],
    teach: "Teaching angle: present this system as a 30-minute architecture review to a senior audience. They will ask 'why not the alternative?' for every choice — prepare the answers."
  }
];
