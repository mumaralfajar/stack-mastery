# Stack Mastery

**Learn it. Prove it. Teach it.**

A free, self-paced program that takes you from beginner to expert in a complete web stack — **C#, ASP.NET Core, SQL, CSS + Tailwind, TypeScript + React** and **computer-science fundamentals** — and then prepares you for technical interviews at large tech companies.

**Use it now:** <https://mumaralfajar.github.io/stack-mastery/>

No account, no installation, no cost. It is plain HTML, CSS and JavaScript that runs entirely in your browser.

Available in **English** and **Bahasa Indonesia** — switch with the language button at the bottom of the sidebar.

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

### Six tracks, 73 lessons, four levels each

| Track | Lessons | From → to |
| --- | --- | --- |
| **C#** | 13 | Variables and classes → async, memory, concurrency, internals |
| **ASP.NET Core** | 14 | HTTP and routing → auth, EF Core, performance, architecture, production |
| **SQL** | 12 | SELECT and joins → indexes, transactions, query plans, scaling |
| **CSS + Tailwind** | 13 | HTML, the cascade, layout → Tailwind in React, architecture, rendering |
| **TypeScript + React** | 14 | JavaScript and types → hooks, performance, advanced types, internals |
| **CS Fundamentals** | 7 | Git and Big-O → data structures, graphs, dynamic programming |

Every lesson has the same three steps, and only counts as mastered when all three are done:

1. **Learn** — why it matters, key ideas, a code example, often an interactive visualization.
2. **Check** — quiz questions with explanations. They return later as spaced-repetition flashcards.
3. **Teach** — write the explanation you would give a beginner and grade it against a rubric. Each lesson includes an analogy, the misconceptions to expect, and a printable 45-minute lesson plan.

### Practice tools

- **17 interactive visualizations** — stack vs heap, async timeline, middleware pipeline, service lifetimes, JOIN explorer, index seek vs scan, flexbox and grid playgrounds, React re-renders, the event loop, sorting algorithms, Big-O growth, and more.
- **SQL playground** — a real SQLite database in the browser with 11 auto-checked challenges.
- **TypeScript playground** — a real editor with live type checking.
- **CSS + Tailwind playground** — live preview you can resize to test breakpoints.
- **Flashcard review** — 219 questions on a 1 / 2 / 4 / 8 / 16-day schedule.
- **Mock exam** — ten random questions by track and level.
- **Capstone projects** — one full-stack project per level.
- **Search** — press `/` anywhere.

### Interview preparation

- **Coding** — 21 classic problems across 12 patterns, judged in the browser against test cases, with hints, solutions in TypeScript and C#, complexity and follow-up questions.
- **System design** — a 45-minute framework, 5 worked cases, a capacity estimator and a glossary of building blocks.
- **Behavioral** — the STAR method, 32 questions in 8 themes, and a personal story bank.
- **Rapid-fire** — 42 stack questions with model answers.
- **SQL and frontend rounds** — graded SQL challenges and six "build a component" prompts.
- **Mock interviews** — timed rounds with help locked until the end and a hire / no-hire scorecard.
- **Eight-week plan** and a readiness meter.

### Teaching toolkit

Rules for teaching programmers, a question ladder for any topic, a session template, and a lesson-plan generator for every lesson in the program.

---

## How to use it

1. Open the site and read **Start here: setup** — it lists the four free tools to install (.NET SDK, Node.js, Git, VS Code) and the first commands for each track.
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

The whole program — interface, all 73 lessons, quizzes, visualizations, playgrounds and interview preparation — is available in English and Bahasa Indonesia.

- Use the **Bahasa Indonesia / English** button at the bottom of the sidebar. The choice is remembered in your browser.
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

You do not need to, but you can.

```bash
git clone https://github.com/mumaralfajar/stack-mastery.git
```

```bash
cd stack-mastery
```

Then either open `index.html` directly in a browser, or serve the folder:

```bash
python -m http.server 5173
```

and visit <http://localhost:5173>.

Progress is stored per address, so the hosted site, `localhost` and a file opened from disk each keep separate progress. Use Export / Import backup to move between them.

---

## Host your own copy

For a class, a team or yourself:

1. **Fork** this repository on GitHub.
2. In your fork, open **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**, branch `main`, folder `/ (root)`, and save.
4. After a minute your copy is live at `https://<your-username>.github.io/stack-mastery/`.

There is no build step and nothing to configure. Every visitor to your copy also gets their own private progress.

---

## What needs an internet connection

The lessons, quizzes, flashcards, visualizations and interview content work offline once the page has loaded. A few tools load an open-source library on demand:

| Feature | Library | Licence |
| --- | --- | --- |
| Code editor with TypeScript type checking | [Monaco Editor](https://github.com/microsoft/monaco-editor) | MIT |
| TypeScript playground and coding-problem judge | [TypeScript](https://github.com/microsoft/TypeScript) | Apache-2.0 |
| SQL playground | [sql.js](https://github.com/sql-js/sql.js) (SQLite as WebAssembly) | MIT |
| Tailwind toggle in the CSS playground | [Tailwind CSS](https://github.com/tailwindlabs/tailwindcss) browser build | MIT |

These are downloaded from public CDNs (cdnjs and jsDelivr). Loading them sends an ordinary web request to the CDN, as with any website; none of your progress or code is sent. If the editor library cannot load, the editors fall back to plain text boxes.

---

## Project layout

| Path | Contents |
| --- | --- |
| `index.html` | The single page that loads everything |
| `css/style.css` | All styling, light and dark themes |
| `data/csharp.js`, `aspnet.js`, `sql.js`, `css.js`, `react.js`, `fundamentals.js` | Lesson content, one file per track |
| `data/projects.js` | Capstone projects |
| `data/interview.js` | Coding problems, patterns, system design, behavioral, rapid-fire, plan |
| `data/interview-cs.js` | C# solutions and the frontend-round prompts |
| `js/app.js` | Router, dashboard, lessons, flashcards, exam, search, backup, setup guide |
| `js/interview.js` | Interview section: code judge, design, story bank, mocks |
| `js/playground.js` | SQL, TypeScript and CSS playgrounds; editor integration |
| `js/viz.js`, `vizcss.js`, `vizmore.js` | Interactive visualizations |
| `js/util.js` | Small shared helpers, syntax highlighting, language selection and the `t()` translate helper |
| `js/i18n.js` | Lays the selected language's content over the English data |
| `data/id/ui-*.js` | Indonesian interface text (English string → Indonesian string) |
| `data/id/<track>.js`, `projects.js`, `interview.js` | Indonesian lesson, capstone and interview content |
| `tools/verify.mjs` | Compiles and tests the C# content |
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

**Add a track** by creating a new file in `data/` that calls `TRACKS.push({ id, name, lang, tagline, lessons })`, adding a `<script>` tag for it in `index.html`, and defining a colour variable `--<id>` in `css/style.css`.

**Keep the translation in step.** English is the source. When you add or change a lesson, add the same lesson id to the matching file in `data/id/` with `title`, `why`, `points`, `practice`, `teach`, `analogy`, `pitfalls` and `quiz` (each quiz entry is `[question, [answers…], explanation]`, in the same order as the English one). New interface text is translated by adding an `'English string': 'Indonesian string'` pair to a `data/id/ui-*.js` file; text that is not found simply stays in English. Then run:

```bash
node tools/check-i18n.mjs
```

It reports any lesson, question, answer list, problem or Q&A whose translation is missing or has a different shape.

**Add another language** by copying `data/id/` to a new folder, translating it, and extending the language list in `js/util.js` and the loader in `index.html`.

---

## Verifying the C# content

```bash
node tools/verify.mjs
```

Requires Node.js and the .NET SDK. It:

1. runs every C# interview solution against the same test cases the in-browser TypeScript judge uses;
2. compiles every C# pattern template;
3. compiles every lesson snippet in the C# and CS Fundamentals tracks as a `Program.cs`.

Run it after changing any C# content. ASP.NET Core snippets that depend on NuGet packages (EF Core, JWT bearer, OpenTelemetry) are not covered by this script.

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
