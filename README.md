# Stack Mastery

**Learn it. Prove it. Teach it.**

A free, self-paced program covering **C#, ASP.NET Core, Go, SQL, CSS + Tailwind, TypeScript + React, Angular, Dart + Flutter, System Design**, and **CS fundamentals**. It takes you from beginner setup through technical interviews.

Open [Stack Mastery](https://mumaralfajar.github.io/stack-mastery/) in your browser.

No account, installation, or fee required. It's a static Astro site: every lesson, lab, and interview page is a real, pre-rendered URL that works offline once visited and can be installed as an app.

Available in **English** (`/stack-mastery/…`) and **Bahasa Indonesia** (`/stack-mastery/id/…`). Switch languages with the **ID / EN** button at the top of the sidebar.

## Contents

- [Your progress is private](#your-progress-is-private)
- [What is inside](#what-is-inside)
- [How to use it](#how-to-use-it)
- [Languages](#languages)
- [Saving and moving your progress](#saving-and-moving-your-progress)
- [Run it on your own computer](#run-it-on-your-own-computer)
- [Host your own copy](#host-your-own-copy)
- [What needs an internet connection](#what-needs-an-internet-connection)
- [Pages and URLs](#pages-and-urls)
- [Offline and installable app](#offline-and-installable-app)
- [Project layout](#project-layout)
- [Adding or editing content](#adding-or-editing-content)
- [Verifying the content and UI](#verifying-the-content-and-ui)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [Licence](#licence)

## Your progress is private

Everyone who opens the site gets their own separate progress. Nobody else can see it, including other learners and whoever hosts the site.

- Progress, notes, flashcard history, interview stories, and saved code live only in your browser's `localStorage` on your device.
- The site uses no backend server, database, accounts, analytics, or cookies.
- Two people opening the same link see completely independent copies of their progress.

What this means in practice:

| Situation | What happens |
| --- | --- |
| A friend opens the same link | They start at 0%. Your progress stays untouched and invisible to them. |
| You switch browser or device | You start fresh there. Use **Export backup** then **Import backup** to move your data. |
| You use a private or incognito window | Progress disappears when that window closes. |
| You clear site data in browser settings | Progress is erased. Export a backup first. |
| Multiple people share one browser profile | They share one saved state. Give each learner a separate browser profile. |

## What is inside

### Ten tracks, 135 lessons, four levels each

| Track | Lessons | Scope |
| --- | --- | --- |
| **C#** | 14 | Variables and classes through exceptions, async, GC memory, concurrency, and internals |
| **CS Fundamentals** | 10 | Git, Big-O, numbers and text through data structures, graphs, backtracking, DP, and concurrency |
| **SQL** | 12 | SELECT and joins through indexes, transactions, execution plans, and scaling (SQL Server syntax) |
| **ASP.NET Core** | 14 | HTTP and routing through auth, EF Core, performance, architecture, and production ops |
| **Go** | 14 | Packages, slices, and zero values through interfaces, errors, `net/http`, `json/v2`, goroutines, `context`, and `pprof` |
| **System Design** | 16 | Capacity math, DNS/CDN/NGINX/Envoy, caching, rate limiting, B-Tree vs LSM, sharding, consistent hashing, outbox/CDC, resilience, quorums, OTel/SLOs, and Kubernetes |
| **CSS + Tailwind** | 13 | HTML, cascade, and layout through Tailwind in React, design systems, and rendering |
| **TypeScript + React** | 14 | JavaScript and types through hooks, performance, advanced types, and reconciliation internals |
| **Angular** | 14 | Components and Signals through DI, routing, Signal Forms, HTTP, zoneless testing, SSR, and ARIA |
| **Dart + Flutter** | 14 | Dart and widgets through layout constraints, async, Bloc/Cubit, testing, rendering, and releases |

Every lesson follows three steps and counts as mastered only when all three are done:

1. Read **Learn** to study key ideas, runnable code, and interactive diagrams.
2. Answer **Check** questions with explanations. Missed items enter flashcard review immediately, and marking the lesson learned adds the rest.
3. Complete **Teach** by explaining the concept for a beginner and scoring against the rubric. Each lesson includes an analogy, common mistakes, and a printable 45-minute plan.

### Practice tools

| Tool | What it gives you |
| --- | --- |
| **Interactive diagrams** | 40 live widgets covering memory, async, ASP.NET middleware, Go concurrency, System Design caching/rate-limiting/sharding/hashing/outbox/resilience, SQL locks, CSS layout, React, Angular Signals, Flutter layout, and Big-O. |
| **SQL playground** | In-browser SQLite engine with 14 auto-checked challenges from basic `SELECT` to keyset pagination and streaks. |
| **TypeScript playground** | Monaco editor featuring live type checking and React 19 previews. |
| **Dart + Flutter playground** | Embedded DartPad preloaded with runnable lesson samples. |
| **CSS + Tailwind playground** | Resizable live preview for testing responsive breakpoints. |
| **Flashcard review** | 424 quiz questions scheduled on a 1, 2, 4, 8, and 16-day spaced-repetition loop. |
| **Mock exam** | Ten random questions filtered by track and level. |
| **Capstone projects** | Four full-stack projects, one per mastery level. |
| **Search** | Press `/` anywhere to search lessons, problems, questions, and diagrams. |
| **Break room** | A hand-drawn flower meadow at `/break/` paired with a Pomodoro study timer (`25/5`, `50/10`, or custom) synced with the workspace sidebar (`stackmastery.study`), permanent mastery & focus-cycle blooms/stars, a one-click **Resume: [Last Lesson]** CTA, and strictly opt-in audio (music, sparkles, and a gentle Lydian end-of-break chime only play after you turn audio on). |

### Interview preparation

| Section | Details |
| --- | --- |
| **Coding** | 21 classic problems across 12 patterns judged against tests, with hints, TypeScript and C# solutions, complexity notes, and follow-ups. |
| **System design** | 45-minute framework, 8 worked cases, capacity estimator, and a building-blocks glossary. |
| **Behavioral** | STAR + Reflection method, 32 questions across 8 themes, an example story, and a personal story bank. |
| **Rapid-fire** | 67 stack questions paired with short model answers. |
| **Getting hired** | Eight-week study schedule, big-tech loop advice, and tips on take-homes and remote roles. |
| **SQL and frontend rounds** | Graded SQL challenges plus 10 UI component prompts covering React, TypeScript, Angular, and Flutter. |
| **Mock interviews** | Timed rounds with hints hidden until finish plus a scorecard. |

### Teaching toolkit

Teaching rules for programmers, a four-rung question ladder, a 45-minute session template, and a printable lesson-plan generator.

## How to use it

1. Open the site and read **Start here: setup**. Install the free tools (.NET SDK, Go 1.27+, Node.js, Flutter SDK, Git, VS Code) and run starter commands.
2. Work **level by level across tracks** instead of finishing one track before starting another. Follow the order suggested on the dashboard.
3. Keep a daily routine:
   - 10 minutes of flashcard review first
   - 30 minutes on one lesson (Learn, Check, Teach)
   - 30 to 45 minutes building the lesson exercise or current capstone
4. Starting at Intermediate, add the **eight-week interview plan** for a few weekly problems.
5. Build the **capstones** in your own editor to grow your portfolio.

Sidebar percentages track your progress per stack, while the dashboard summarizes overall mastery and suggests what comes next.

## Languages

The interface, 135 lessons, quizzes, visualizations, playgrounds, capstones, and interview prep work in both English and Bahasa Indonesia.

- Click the **ID / EN** toggle in the header bar anytime. It opens the same page in the other language (keeping options such as `?sample=`) and remembers your choice.
- English pages live at `/stack-mastery/…` and Indonesian pages at `/stack-mastery/id/…`, so each language has its own shareable, search-indexed URL. Opening `/stack-mastery/` always shows English; `/stack-mastery/id/` always shows Bahasa Indonesia.
- Old `#/…` bookmarks from the previous single-page version still work: they redirect to the matching page in your remembered language.
- Both languages share the same progress storage, so switching keeps everything intact.
- Technical terms Indonesian developers normally use in English (like *middleware*, *index*, *state*, *deadlock*, *hook*, *query*) stay in English for natural reading.

## Saving and moving your progress

Back up your browser progress occasionally since it lives only on your device.

- **Export backup** (bottom of the sidebar) saves `stack-mastery-backup-YYYY-MM-DD.json`.
- **Import backup** restores that JSON file on the same or another device.
- **Reset progress** clears local state after confirmation and can't be undone.

Keep your backup files private and out of public repositories (`.gitignore` excludes them by default).

## Run it on your own computer

You can run or edit the site locally using **Astro 7.4** and **Bun** (or Node.js):

```bash
git clone https://github.com/mumaralfajar/stack-mastery.git
cd stack-mastery
bun install
bun run dev
```

Or with npm:

```bash
npm install && npm run dev
```

Visit <http://localhost:4321/stack-mastery/>. To build the static output with Astro timing stats:

```bash
bun run build:timings
bun run preview
```

Browser storage is scoped by origin, so `localhost` keeps separate progress from the hosted GitHub Pages URL.

## Host your own copy

To host an independent copy for a class or team:

1. **Fork** this repository on GitHub.
2. Open **Settings → Pages** in your fork.
3. Under **Build and deployment**, set **Source** to **GitHub Actions** (the `.github/workflows/deploy.yml` workflow deploys on every push to `main`).
4. Within a minute, your copy goes live at `https://<your-username>.github.io/stack-mastery/`.

## What needs an internet connection

All lessons, quizzes, flashcards, diagrams, and interview study content work offline once loaded. Interactive editors load libraries lazily from CDNs on demand:

| Feature | Library | Licence |
| --- | --- | --- |
| Type checking code editor | [Monaco Editor](https://github.com/microsoft/monaco-editor) | MIT |
| TypeScript playground and judge | [TypeScript](https://github.com/microsoft/TypeScript) | Apache-2.0 |
| React live preview | [React](https://github.com/facebook/react) 19.1 (`esm.sh`) | MIT |
| SQL playground | [sql.js](https://github.com/sql-js/sql.js) (SQLite WASM) | MIT |
| Tailwind browser toggle | [Tailwind CSS](https://github.com/tailwindlabs/tailwindcss) `4.3.4` | MIT |
| Dart + Flutter playground | [DartPad](https://github.com/dart-lang/dart-pad) (`dartpad.dev`) | BSD-3-Clause |

If offline or behind a blocked CDN, editors fall back to plain text areas.

## Pages and URLs

The site is a static multi-page build (`astro build` with `trailingSlash: 'always'`). Every route below exists in English and, prefixed with `/id`, in Bahasa Indonesia, so `/stack-mastery/lesson/go/types/` and `/stack-mastery/id/lesson/go/types/` are the same lesson.

| URL (under `/stack-mastery/`) | Page |
| --- | --- |
| `/` | Landing page with the Packet Reactor |
| `/dashboard/`, `/start/`, `/search/` | Dashboard, machine setup guide, and search |
| `/track/<track>/` | One track's lessons by level (10 tracks) |
| `/lesson/<track>/<lesson>/` | A lesson (135 lessons) |
| `/plan/<track>/<lesson>/` | The printable 45-minute lesson plan for a lesson |
| `/lab/`, `/lab/<viz>/` | The visual lab index and each of the 40 labs |
| `/play/sql/`, `/play/ts/`, `/play/css/`, `/play/dart/` | Browser playgrounds; `?sample=<id>` preselects a challenge or example (for example `/play/sql/?sample=joins`) |
| `/review/`, `/exam/` | Flashcard review and mock exam |
| `/interview/` and `/interview/coding/`, `/interview/problem/<id>/`, `/interview/patterns/`, `/interview/design/`, `/interview/design/<id>/`, `/interview/behavioral/`, `/interview/rapid/`, `/interview/mock/` | Interview hub and its rounds |
| `/teach/`, `/projects/`, `/break/` | Teaching toolkit, capstone projects, and the flower-meadow break room |

Each page ships its own title, description, canonical URL, `hreflang` alternates (`en`, `id`, `x-default`), Open Graph and Twitter Card tags, and JSON-LD (`Course` on the landing and track pages, `LearningResource` on lessons). `sitemap-index.xml` (with EN/ID alternates) and `robots.txt` are generated at build time.

Pages are pre-rendered HTML; only the interactive parts load JavaScript. The landing page loads under 45 KB of JavaScript in total, and a lesson or lab page imports only the one lab module it shows (never the whole curriculum).

## Offline and installable app

Stack Mastery is a Progressive Web App (`public/manifest.webmanifest`, `public/sw.js`):

- The service worker (scope `/stack-mastery/`) precaches the landing pages, dashboards, icons, and the offline page on first visit, then caches every page and build asset you open. Pages use network-first with a cache fallback, so you always get the latest version when online and the last copy when offline.
- Only same-origin requests under `/stack-mastery/` are handled. CDN runtimes for the editors and playgrounds (`cdnjs`, `esm.sh`, `jsDelivr`, DartPad) are never cached or intercepted.
- Browsers that support installation show an **Install** option; the installed app opens at `/stack-mastery/`.
- A new deployment bumps the cache version in `sw.js`, and old caches are deleted when the new worker activates.

## Project layout

| Path | Contents |
| --- | --- |
| `astro.config.mjs`, `package.json`, `bun.lock` | Astro 7.4 configuration, npm/bun scripts, and the locked dependency tree |
| `biome.json` | Biome lint rules for `src/` and `tools/` (`bun run lint`) |
| `.github/workflows/ci.yml` | Pull request quality gates: lint, type check, i18n, build, Playwright UI + axe-core, and Conventional Commits |
| `.github/workflows/deploy.yml` | GitHub Pages deployment on every push to `main` |
| `src/pages/` | English routes; `src/pages/id/` holds the same routes in Bahasa Indonesia. Each file is a thin wrapper around a template, plus `404.astro` and the `search-index.json` endpoints |
| `src/templates/` | Shared page templates (`LandingPage`, `LessonPage`, `PlanPage`, `TrackPage`, `LabPage`, `ViewPage` for client-rendered views, and others) |
| `src/layouts/BaseLayout.astro`, `WorkspaceLayout.astro` | Document shell (language, theme, SEO head, manifest, service worker) and the study workspace with sidebar |
| `src/components/SeoHead.astro`, `Sidebar.astro`, `CodeTabs.astro` | SEO tags and JSON-LD, the static bilingual sidebar, and build-time highlighted code tabs |
| `src/styles/style.css`, `landing.css`, `break.css` | Styling, light/dark themes, print rules, landing reactor, and break room |
| `src/lib/` | Strict, erasable TypeScript core (`routes.ts` URL builders and legacy hash bridge, `progress.ts` manifest-only progress, `types.ts`, `storage.ts`, `state.ts`, `theme.ts`, `dom.ts`, `highlight.ts`, `icons.ts`, `i18n.ts`, `seo.ts`, `ssr.ts`), plus modular `landing/` (`audio.ts`, `reactor-engine.ts`, `landing-island.ts`) and `break/` (`audio.ts`, `meadow-engine.ts`, `pomodoro.ts`, `break-island.ts`) engines |
| `src/scripts/workspace-shell.ts` | Sidebar hydration: progress, due badge, compact Pomodoro study-timer pill & focus-complete toast, drawer, language/theme toggles, backups (imports only the manifest and `src/lib/`) |
| `src/scripts/legacy-bridge.ts` | Legacy `#/…` bookmark redirect shared by the landing and 404 pages |
| `src/scripts/lesson-island.js`, `view-island.js` | Lesson islands (predict, quiz, teach-back, progress, last-lesson tracking, one lab) and the loader for client-rendered views |
| `src/scripts/views/` | Client views (`dashboard.js`, `practice.js` review/exam, `search.js`) |
| `src/scripts/interview.js` | Interview hub, code judge, estimator, story bank, and mocks |
| `src/scripts/playground.js` | SQL, TypeScript, CSS, and DartPad playgrounds |
| `src/scripts/viz/` | 40 interactive labs; `registry.ts` maps each lab to its module so `loadViz(id)` imports only that one (`viz.js`, `vizcss.js`, `vizmore.js`, `vizangular.js`, `vizflutter.js`, `vizplus.js`, `vizgo.js`, `vizsys.js`) |
| `src/data/` | Typed manifest (`manifest.ts`, including each lesson's `quizCount`), chunked loaders (`index.ts`, `tracks-core.ts`, `tracks-ui.ts`, `interview-data.ts`, `track-loaders.ts`), the build-time aggregator and search index (`site.ts`, `search-index.ts`), English tracks (`tracks/*.js`), `projects.js`, `interview.js`, `interview-cs.js` |
| `src/data/id/` | Bahasa Indonesia loaders (`index.ts`, `core.ts`, `web.ts`, `ui.ts`), tracks (`tracks/*.js`), UI dictionaries (`ui-*.js`), `projects.js`, and `interview.js` |
| `public/` | `manifest.webmanifest`, `sw.js`, `robots.txt`, favicons, and PNG/SVG app icons |
| `tools/check-i18n.mjs`, `extract-text.mjs` | Translation parity check (lessons, UI strings in `.js`/`.ts`/`.astro`, `h()` labels, table headers, playground chips, manifest `quizCount`, lab registry) and text extractor |
| `tools/verify*.mjs`, `tools/verify-ui.py` | Language sample compilers/runners and the Playwright UI + axe-core WCAG 2.2 AA suite |

## Adding or editing content

All curriculum content is plain ES module data inside `src/data/` so no application logic needs edits.

Add a lesson to `lessons` in a track file inside `src/data/tracks/` (and keep `src/data/manifest.ts` in sync, including `quizCount`, which must equal the number of quiz questions). The build creates its `/lesson/…/` and `/plan/…/` pages in both languages automatically:

```js
{
  id: 'my-lesson',            // unique in the track, used in URL
  title: 'My lesson',
  level: 0,                   // 0 Beginner, 1 Intermediate, 2 Advanced, 3 Expert
  mins: 30,
  why: "Why this matters in clear language.",
  points: ["Key idea with `code` and **bold**.", "Another key idea."],
  code: `// example code`,
  lang: 'cs',                 // cs, go, sql, yaml, http, ts, tsx, dart, css, html, sh
  viz: 'stackheap',           // optional VIZ key
  practice: "What the learner should build.",
  teach: "The explain-it-back prompt.",
  analogy: "An analogy for learners.",
  pitfalls: ["A common mistake."],
  quiz: [
    { q: "Question?", a: ["Wrong", "Right", "Wrong"], c: 1, why: "Why it is right." }
  ]
}
```

Quiz options shuffle at render time. Add coding problems to `problems` in `src/data/interview.js` with `[arguments, expected]` test cases and matching C# solutions in `src/data/interview-cs.js`.

When changing any English text, update the matching `src/data/id/` file and run:

```bash
bun run check:i18n
```

## Verifying the content and UI

Every stack track includes real compiler and runtime verification scripts inside `tools/`:

| Script | Command | What it checks |
| --- | --- | --- |
| **Lint** | `bun run lint` | Biome correctness and suspicious-code rules across `src/` and `tools/` |
| **Type check** | `bun run typecheck` | `astro check` diagnostics for Astro components and scripts |
| **i18n parity** | `bun run check:i18n` | Structural, key, and code-span parity across EN and ID, untranslated `h()` labels and `.astro` template strings, table headers, playground chips, manifest `quizCount`, and the lab registry |
| **UI & WCAG** | `bun run verify:ui` | On `dist/`: every static route and SEO tag, the landing JS budget (< 45 KB), single-lab chunk loading, legacy `#/…` redirects, PWA manifest and offline reload, EN/ID desktop/mobile layout, dialogs, all 40 labs, playgrounds, interview prep, cross-tab sync, and axe-core WCAG 2.2 AA (0 critical or serious) |
| **C# & CS** | `bun run verify:cs` | Runs all 96 C# problem tests, 12 pattern templates, and lesson samples (.NET 10) |
| **ASP.NET Core** | `bun run verify:aspnet` | Builds, boots, and tests all ASP.NET Core 10 samples + xUnit suite |
| **Go** | `bun run verify:go` | Runs `go vet`, `go build`, execution checks, and `go test -bench` on Go 1.27+ |
| **System Design** | `bun run verify:sysdesign` | Runs `go vet`/`go build`/execution on 10 Go 1.27 samples, parses 3 YAML configs, checks SQL/HTTP/splits/VIZ |
| **SQL** | `bun run verify:sql` | Executes every SQL Server sample against `.\SQLEXPRESS` |
| **CSS + Tailwind** | `bun run verify:css` | Validates CSS in Chrome (`CSS.supports`), checks 360px overflow, builds Tailwind 4.3.4, type-checks TSX |
| **TypeScript + React** | `bun run verify:react` | Strict `tsc` checks plus Vitest + MSW React tests and event-loop verification |
| **Angular** | `bun run verify:angular` | Compiles Angular 22 with `ngc` (`strictTemplates`), runs zoneless Vitest + RxJS checks |
| **Dart + Flutter** | `bun run verify:dart` | Runs `flutter analyze`, `flutter test`, Dart scripts, and Cubit/router behavior checks |

When upgrading Tailwind in the playground, keep the pinned version matching across `tools/verify-css.mjs` and `src/scripts/playground.js`.

`bun run verify:ui` needs `bun run build` first, Python 3.12+ with `pip install playwright`, and `playwright install chromium` (it falls back to an installed Chrome).

Every pull request to `main` runs `.github/workflows/ci.yml`. These three checks must pass before merging:

| Check | What it runs |
| --- | --- |
| **Quality & Build** | `bun install --frozen-lockfile`, `bun run lint`, `bun run typecheck`, `bun run check:i18n`, `bun run build:timings` |
| **Playwright UI & a11y** | `bun run build`, then `python -u tools/verify-ui.py` on bundled Chromium |
| **Conventional PR** | The PR title and every commit message follow Conventional Commits v1.0.0 |

## Troubleshooting

| Problem | Likely cause and fix |
| --- | --- |
| Progress disappeared | Different browser, address (`localhost` vs GitHub Pages), private window, or cleared site data. Import your backup JSON. |
| Editor is a plain text box | Offline or CDN blocked (`cdnjs`). Code editing and runs still work. |
| SQL playground fails to load | Needs internet access on first open to download `sql.js` WebAssembly. |
| "Time limit exceeded" on coding judge | Execution exceeded 4 seconds, usually from an infinite loop or exponential complexity. |
| Old content stays cached after updates | Pages are network-first, so a normal reload fetches the new version when online. If a build asset still looks stale, hard-reload (`Ctrl+F5` or `Cmd+Shift+R`), or unregister the service worker in the browser's developer tools. |
| An old `#/lesson/...` link opens the wrong language | Legacy links follow your saved language. Use the **ID / EN** toggle once and the preference is remembered. |
| C# lesson code has no Run button | C# runs locally with the .NET SDK (`dotnet new console` then `dotnet run`). |

## Contributing

Corrections and updates are welcome when frameworks or APIs evolve:

1. Fork the repo and create a topic branch. Never commit directly to `main`.
2. Update content and Indonesian translations, then verify affected stack scripts plus `bun run lint`, `bun run typecheck`, `bun run check:i18n`, `bun run build`, and `bun run verify:ui`.
3. Write the pull request title and every commit message in [Conventional Commits v1.0.0](https://www.conventionalcommits.org/en/v1.0.0/) form: `type(optional-scope): description`, where `type` is one of `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, or `revert`, and `!` marks a breaking change (for example `fix(sql): grade challenges on a clean snapshot`).
4. Open a pull request explaining what changed and what you verified. CI must be green before it can merge.

## Licence

Released under the [MIT Licence](LICENSE). You can use, copy, modify, and redistribute this project (including for your own classes or hosted copies) while keeping the copyright notice and licence text.

Third-party libraries listed above load from public CDNs and remain under their own licences.
