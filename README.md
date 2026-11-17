# Stack Mastery

**Learn it. Prove it. Teach it.**

A free, self-paced program that takes you from beginner to expert in a complete stack — **C#, ASP.NET Core, SQL, CSS + Tailwind, TypeScript + React, Dart + Flutter** and **computer-science fundamentals** — and then prepares you for technical interviews at large tech companies.

**Use it now:** <https://mumaralfajar.github.io/stack-mastery/>

No account, no installation, no cost. It is a static site built with Astro that runs entirely in your browser.

Available in **English** and **Bahasa Indonesia** — switch with the **ID / EN** language button at the top-right of the screen.

---

## Contents

- [Your progress is private](#your-progress-is-private)
- [What is inside](#what-is-inside)
- [How to use it](#how-to-use-it)
- [Languages](#languages)
- [Saving and moving your progress](#saving-and-moving-your-progress)
- [Run it on your own computer](#run-it-on-your-own-computer)
- [Host your own copy](#host-your-own-copy)
- [What needs an internet connection](#what-needs-an-internet-connection)
- [Project layout](#project-layout)
- [Adding or editing content](#adding-or-editing-content)
- [Verifying the C# content](#verifying-the-c-content)
- [Verifying the Dart + Flutter content](#verifying-the-dart--flutter-content)
- [Verifying the SQL content](#verifying-the-sql-content)
- [Verifying the ASP.NET Core content](#verifying-the-aspnet-core-content)
- [Verifying the CSS + Tailwind content](#verifying-the-css--tailwind-content)
- [Verifying the TypeScript + React content](#verifying-the-typescript--react-content)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [Licence](#licence)

---

## Your progress is private

Everyone who opens the site gets their **own, separate progress**. Nobody else can see it — not other learners, and not the person hosting the site.

- Progress, notes, flashcard history, interview stories and saved code are stored in **your browser's local storage, on your device only**.
- The site has **no server, no database, no accounts, no analytics and no cookies**. Nothing you do is uploaded anywhere.
- Two people using the same link see two completely independent copies of their own progress.

What this means in practice:

| Situation | What happens |
| --- | --- |
| A friend opens the same link | They start at 0%. Your progress is untouched and invisible to them. |
| You switch browser or device | You start fresh there. Use **Export backup** → **Import backup** to bring your progress along. |
| You use a private / incognito window | Progress disappears when the window closes. |
| You clear your browser's site data | Progress is erased. Export a backup first. |
| Several people share one computer **and** one browser profile | They would share one set of progress. Give each person their own browser profile. |

---

## What is inside

### Seven tracks, 88 lessons, four levels each

| Track | Lessons | From → to |
| --- | --- | --- |
| **C#** | 14 | Variables and classes → exceptions, async, memory, concurrency, internals |
| **CS Fundamentals** | 7 | Git and Big-O → data structures, graphs, dynamic programming |
| **SQL** | 12 | SELECT and joins → indexes, transactions, query plans, scaling (SQL Server syntax) |
| **ASP.NET Core** | 14 | HTTP and routing → auth, EF Core, performance, architecture, production |
| **CSS + Tailwind** | 13 | HTML, the cascade, layout → Tailwind in React, architecture, rendering |
| **TypeScript + React** | 14 | JavaScript and types → hooks, performance, advanced types, internals |
| **Dart + Flutter** | 14 | Dart and widgets → layout, async, state with Bloc/Cubit, testing, rendering, release |

Every lesson has the same three steps, and only counts as mastered when all three are done:

1. **Learn** — why it matters, key ideas, a code example, often an interactive visualization.
2. **Check** — quiz questions with explanations. They return later as spaced-repetition flashcards.
3. **Teach** — write the explanation you would give a beginner and grade it against a rubric. Each lesson includes an analogy, the misconceptions to expect, and a printable 45-minute lesson plan.

### Practice tools

- **20 interactive visualizations** — stack vs heap, async timeline, middleware pipeline, service lifetimes, JOIN explorer, index seek vs scan, flexbox and grid playgrounds, React re-renders, Flutter layout constraints and its three trees, the event loop, sorting algorithms, Big-O growth, and more.
- **SQL playground** — a real SQLite database in the browser with 11 auto-checked challenges.
- **TypeScript playground** — a real editor with live type checking.
- **Dart + Flutter playground** — the official DartPad embedded, loaded with each lesson's runnable sample.
- **CSS + Tailwind playground** — live preview you can resize to test breakpoints.
- **Flashcard review** — 278 questions on a 1 / 2 / 4 / 8 / 16-day schedule.
- **Mock exam** — ten random questions by track and level.
- **Capstone projects** — one full-stack project per level.
- **Search** — press `/` anywhere.

### Interview preparation

- **Coding** — 21 classic problems across 12 patterns, judged in the browser against test cases, with hints, solutions in TypeScript and C#, complexity and follow-up questions.
- **System design** — a 45-minute framework, 5 worked cases, a capacity estimator and a glossary of building blocks.
- **Behavioral** — the STAR method, 32 questions in 8 themes, and a personal story bank.
- **Rapid-fire** — 48 stack questions with model answers.
- **SQL and frontend rounds** — graded SQL challenges and eight "build a component" prompts, two of them in Flutter.
- **Mock interviews** — timed rounds with help locked until the end and a hire / no-hire scorecard.
- **Eight-week plan** and a readiness meter.

### Teaching toolkit

Rules for teaching programmers, a question ladder for any topic, a session template, and a lesson-plan generator for every lesson in the program.

---

## How to use it

1. Open the site and read **Start here: setup** — it lists the free tools to install (.NET SDK, Node.js, Flutter SDK, Git, VS Code) and the first commands for each track.
2. Work **level by level across the tracks** rather than finishing one track first. The dashboard suggests the order.
3. Follow a daily routine:
   - 10 minutes of flashcard review, first;
   - 30 minutes on one lesson — learn, check, teach;
   - 30–45 minutes building the lesson's exercise or the current capstone.
4. From the Intermediate level, add the **eight-week interview plan**: a few coding problems every week.
5. Build the **capstones** in your own editor. They are your portfolio.

The percentages in the sidebar show your progress per track; the dashboard shows the overall picture and what to do next.

---

## Languages

The whole program — interface, all 88 lessons, quizzes, visualizations, playgrounds and interview preparation — is available in English and Bahasa Indonesia.

- Use the **ID / EN** button at the top-right of the screen. The choice is remembered in your browser.
- On a first visit, a browser set to Indonesian starts in Indonesian; every other browser starts in English.
- Progress is shared between the two languages: switching does not reset anything.
- The Indonesian text is written the way Indonesian developers actually talk. Technical terms that are normally used in English — *middleware*, *index*, *state*, *deadlock*, *hook*, *query* — are deliberately left in English. Code samples, problem titles and the names of playground examples are also left as they are.

---

## Saving and moving your progress

Because progress lives only in your browser, back it up now and then.

- **Export backup** (bottom of the sidebar) downloads a file named `stack-mastery-backup-YYYY-MM-DD.json`.
- **Import backup** restores that file — in the same browser, another browser, or another device.
- **Reset progress** erases everything in the current browser. It cannot be undone.

A backup file contains only your own progress. Keep it for yourself; do not add it to a public repository (the included `.gitignore` already excludes these files).

---

## Run it on your own computer

You do not need to, but you can. The project is built with **Astro 7.4** and **Bun** (or Node.js):

```bash
git clone https://github.com/mumaralfajar/stack-mastery.git
cd stack-mastery
bun install
bun run dev
```

*(Or with npm: `npm install && npm run dev`.)*

Then visit <http://localhost:4321/stack-mastery/>. To build the production static bundle with Astro 7.4 build timing metrics:

```bash
bun run build:timings
bun run preview
```

Progress is stored per address, so the hosted site and `localhost` each keep separate progress. Use **Export backup** → **Import backup** to move progress between them.

---

## Host your own copy

For a class, a team or yourself:

1. **Fork** this repository on GitHub.
2. In your fork, open **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to **GitHub Actions** (the included `.github/workflows/deploy.yml` workflow builds and deploys the Astro site automatically on every push to `main`).
4. After a minute your copy is live at `https://<your-username>.github.io/stack-mastery/`.

Every visitor to your copy also gets their own private progress.

---

## What needs an internet connection

The lessons, quizzes, flashcards, visualizations and interview content work offline once the page has loaded. A few tools load an open-source library on demand:

| Feature | Library | Licence |
| --- | --- | --- |
| Code editor with TypeScript type checking | [Monaco Editor](https://github.com/microsoft/monaco-editor) | MIT |
| TypeScript playground and coding-problem judge | [TypeScript](https://github.com/microsoft/TypeScript) | Apache-2.0 |
| SQL playground | [sql.js](https://github.com/sql-js/sql.js) (SQLite as WebAssembly) | MIT |
| Tailwind toggle in the CSS playground | [Tailwind CSS](https://github.com/tailwindlabs/tailwindcss) browser build, pinned to 4.3.4 | MIT |
| Dart + Flutter playground | [DartPad](https://github.com/dart-lang/dart-pad), embedded from dartpad.dev | BSD-3-Clause |

These are downloaded from public CDNs (cdnjs and jsDelivr). Loading them sends an ordinary web request to the CDN, as with any website; none of your progress or code is sent. If the editor library cannot load, the editors fall back to plain text boxes.

---

## Project layout

| Path | Contents |
| --- | --- |
| `astro.config.mjs`, `package.json` | Astro 7.4 configuration and scripts |
| `src/pages/index.astro` | Main application page |
| `src/layouts/Layout.astro`, `src/components/Sidebar.astro` | Document layout shell and navigation container |
| `src/styles/style.css` | All styling, light and dark themes |
| `src/scripts/main.js` | Bundled client entrypoint and hash router |
| `src/scripts/state.js`, `nav.js`, `icons.js`, `util.js` | State management, navigation drawer, SVG tech icons and shared helpers |
| `src/scripts/views/` | Modular views (`dashboard.js`, `track.js`, `practice.js`, `teach.js`) |
| `src/scripts/interview.js` | Interview section: code judge, design, story bank, mocks |
| `src/scripts/playground.js` | SQL, TypeScript, CSS and DartPad playgrounds; editor integration |
| `src/scripts/viz/` | Interactive visualizations (`viz.js`, `vizcss.js`, `vizmore.js`, `vizflutter.js`) |
| `src/scripts/i18n.js`, `load-id.js` | Lazy-loads and overlays the selected language's content |
| `data/csharp.js`, `aspnet.js`, `sql.js`, `css.js`, `react.js`, `flutter.js`, `fundamentals.js` | Lesson content, one file per track |
| `data/projects.js` | Capstone projects |
| `data/interview.js` | Coding problems, patterns, system design, behavioral, rapid-fire, plan |
| `data/interview-cs.js` | C# solutions and the frontend-round prompts |
| `data/id/ui-*.js` | Indonesian interface text (English string → Indonesian string) |
| `data/id/<track>.js`, `projects.js`, `interview.js` | Indonesian lesson, capstone and interview content |
| `tools/verify.mjs` | Compiles and tests the C# content |
| `tools/verify-dart.mjs` | Analyzes, runs and tests the Dart + Flutter samples |
| `tools/verify-sql.mjs` | Runs every SQL lesson sample on a real SQL Server |
| `tools/verify-aspnet.mjs` | Builds and starts every ASP.NET Core sample, and runs the testing lesson's tests |
| `tools/verify-css.mjs` | Checks the CSS samples in Chrome, compiles the Tailwind classes, and type-checks the React sample |
| `tools/verify-react.mjs` | Type-checks every TypeScript + React sample, runs the testing lesson's test, and checks the event-loop output |
| `tools/check-i18n.mjs` | Checks that the Indonesian content matches the English structure |
| `tools/extract-text.mjs` | Prints the translatable text of a track, for translators |

---

## Adding or editing content

All content is data; no application code needs to change.

**Add a lesson** by adding an object to the `lessons` array of a track file in `data/`:

```js
{
  id: 'my-lesson',            // unique within the track; used in the URL
  title: 'My lesson',
  level: 0,                   // 0 Beginner, 1 Intermediate, 2 Advanced, 3 Expert
  mins: 30,
  why: "Why this matters, in two sentences.",
  points: ["Key idea with `code` and **bold**.", "Another key idea."],
  code: `// example code`,
  lang: 'cs',                 // optional: cs, sql, ts, tsx, css, html, sh
  viz: 'stackheap',           // optional: a key from the VIZ object
  practice: "What the learner should build.",
  teach: "The explain-it-back prompt.",
  analogy: "An analogy a teacher can use.",
  pitfalls: ["A common misconception."],
  quiz: [
    { q: "Question?", a: ["Wrong", "Right", "Wrong"], c: 1, why: "Why it is right." }
  ]
}
```

Answer order is shuffled when shown, so the position of the correct answer does not matter.

**Add a coding problem** by adding an object to `problems` in `data/interview.js` (see the existing ones for the shape) and its C# solution to `data/interview-cs.js`. Tests are `[arguments, expected]` pairs.

**Add a track** by creating a new file in `data/` that calls `TRACKS.push({ id, name, lang, tagline, lessons })`, importing it in `src/scripts/main.js`, and defining a colour variable `--<id>` in `src/styles/style.css`.

**Keep the translation in step.** English is the source. When you add or change a lesson, add the same lesson id to the matching file in `data/id/` with `title`, `why`, `points`, `practice`, `teach`, `analogy`, `pitfalls` and `quiz` (each quiz entry is `[question, [answers…], explanation]`, in the same order as the English one). New interface text is translated by adding an `'English string': 'Indonesian string'` pair to a `data/id/ui-*.js` file; text that is not found simply stays in English. Then run:

```bash
bun tools/check-i18n.mjs
```

It reports any lesson, question, answer list, problem or Q&A whose translation is missing or has a different shape.

**Add another language** by copying `data/id/` to a new folder, translating it, and extending the language list in `src/scripts/util.js` and the loader in `src/scripts/main.js`.

---

## Verifying the C# content

```bash
node tools/verify.mjs
```

Requires Node.js and the .NET SDK. It:

1. runs every C# interview solution against the same test cases the in-browser TypeScript judge uses;
2. compiles every C# pattern template;
3. compiles every lesson snippet in the C# and CS Fundamentals tracks as a `Program.cs` and runs it, failing on any unhandled exception (add `--show` to print each lesson's output).

Run it after changing any C# content. ASP.NET Core samples have their own script; see the next sections.

---

## Verifying the Dart + Flutter content

```bash
node tools/verify-dart.mjs
```

Requires Node.js and the Flutter SDK. On first run it creates a scratch Flutter project in your temp folder with the packages the lessons use (`flutter_bloc`, `go_router`, `http`, `shared_preferences`). Then it:

1. writes every Dart + Flutter lesson sample into that project and runs `flutter analyze` — any error or warning fails;
2. runs the samples that are plain Dart programs and prints their output;
3. runs the samples that are tests with `flutter test`.

Every sample is a complete file, so what a learner copies into a fresh `flutter create` project compiles as shown. Inside the lesson data, a Dart `${` must be written `\${` because the samples live in JavaScript template strings.

---

## Verifying the SQL content

```bash
node tools/verify-sql.mjs
```

The SQL lessons are written for SQL Server. The script needs `sqlcmd` and a SQL Server you can reach with Windows authentication; it uses `.\SQLEXPRESS` unless you pass `--server <name>`. For each lesson it creates a scratch database called `StackMasteryVerify`, loads the same shop data the playground uses, and runs the lesson's sample; any error fails the check. The scratch database is dropped at the end. Add `--show` to print each lesson's output.

The playground itself runs SQLite, so a few things differ there (`LIMIT` instead of `TOP`, no `YEAR()`, no exact `DECIMAL`); the playground page lists them.


---

## Verifying the ASP.NET Core content

```bash
node tools/verify-aspnet.mjs
```

Every ASP.NET Core lesson sample is a complete `Program.cs` for .NET 10. The script needs the .NET 10 SDK and internet access the first time, to download the NuGet packages the samples use (EF Core for SQL Server, JWT bearer, OpenAPI, HybridCache, resilience, health checks and OpenTelemetry, pinned to the .NET 10 versions). In a scratch web project in your temp folder it:

1. builds each sample as `Program.cs`, failing on any compile error;
2. starts each app in Development and fails if it crashes before "Application started";
3. runs the testing lesson's xUnit tests with `dotnet test`, against the validation lesson's API.

No database is needed: the samples only connect to SQL Server when an endpoint is called. Add `--show` to print each app's startup log.

---

## Verifying the CSS + Tailwind content

```bash
node tools/verify-css.mjs
```

Needs Google Chrome (or Edge) and, the first time, internet access to install Tailwind, TypeScript and the React types into a scratch folder. It:

1. checks every declaration and selector in the CSS samples with Chrome's own `CSS.supports`, so a typo or an unsupported value fails;
2. renders the HTML samples in Chrome at 360px wide and fails if the page scrolls sideways (the Tailwind sample with its CSS compiled first);
3. compiles the Tailwind samples with Tailwind 4.3.4, the version the playground loads, and fails on any class Tailwind doesn't generate;
4. type-checks the React `Button` with TypeScript, and checks that an invalid variant such as `intent="purple"` really fails to compile.

When you upgrade Tailwind, change the version in both `tools/verify-css.mjs` and `src/scripts/playground.js`. Add `--show` for a line per lesson.

---

## Verifying the TypeScript + React content

```bash
node tools/verify-react.mjs
```

Needs internet access the first time, to install TypeScript, React 19, TanStack Query, Testing Library, MSW and Vitest into a scratch folder. It:

1. type-checks every lesson sample with the same strict settings as the Vite `react-ts` template, each lesson as its own module;
2. runs the testing lesson's test with Vitest, jsdom and MSW against the server-state lesson's `ProductsPage`, so the page, the API helper and the test have to agree;
3. runs the event-loop example and checks that it prints `1 sync`, `2 sync`, `3 microtask`, `4 timeout`, as its comments say.

Add `--show` to print the event-loop output.
---

## Troubleshooting

| Problem | Likely cause and fix |
| --- | --- |
| My progress is gone | You are in a different browser, device, address or a private window — or site data was cleared. Import your last backup. |
| The code editor is a plain text box | The editor library could not load (offline, or a blocked CDN). Everything still works; reconnect and reload for the full editor. |
| The SQL playground says it cannot load | It needs an internet connection the first time it is opened. |
| "Time limit exceeded" on a coding problem | Your code ran longer than four seconds — usually an infinite loop. |
| I see an old version after an update | Hard-reload the page (Ctrl+F5, or Cmd+Shift+R on a Mac). |
| C# code will not run on the site | C# cannot run in the browser here. Use the .NET SDK on your machine: `dotnet new console`, then `dotnet run`. |

---

## Contributing

Corrections and improvements are welcome — technology moves, and content goes stale.

1. Fork the repository and create a branch.
2. Make your change. For C# content, run `node tools/verify.mjs`; for any content change, run `node tools/check-i18n.mjs`.
3. Open the site locally and check the page you changed.
4. Open a pull request describing what changed and why.

Found a mistake but do not want to fix it yourself? Open an issue with the lesson name and what is wrong.

---

## Licence

Released under the [MIT Licence](LICENSE). You may use, copy, modify and redistribute this project — including for your own classes or a hosted copy — as long as the copyright notice and licence text are kept.

The third-party libraries listed above are loaded from CDNs, are not included in this repository, and keep their own licences.
