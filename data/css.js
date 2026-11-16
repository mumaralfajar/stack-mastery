TRACKS.push({
  id: 'css', name: 'CSS + Tailwind', lang: 'css',
  tagline: 'The look: the cascade, layout, responsive design, and Tailwind CSS at scale.',
  lessons: [
    // ---------------- Beginner ----------------
    {
      id: 'html', title: 'HTML essentials: structure and meaning', level: 0, mins: 30, lang: 'html',
      why: "CSS styles HTML and React renders HTML. Choosing the right element gives you keyboard support, accessibility and search-engine meaning for free — and choosing `div` for everything throws all of it away.",
      points: [
        "HTML describes **what content is**, not how it looks: a heading, a paragraph, a list, a button, a navigation region.",
        "A page has one `<h1>` and headings that nest in order (`h2`, `h3`…). Screen-reader users navigate by them like a table of contents.",
        "**Landmarks** structure the page: `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>`.",
        "Use `<button>` for actions and `<a href>` for navigation. Both are focusable and keyboard-operable by default; a clickable `<div>` is neither.",
        "Forms: every input needs a `<label>`; `type` (`email`, `number`, `date`) gives the right keyboard and built-in validation; `required`, `min`, `pattern` validate without JavaScript.",
        "Images need `alt` text describing their purpose (empty `alt=\"\"` if purely decorative). `class` and `id` are hooks for CSS and JavaScript."
      ],
      code: `
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Shop — Products</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <header>
    <nav aria-label="Main">
      <a href="/">Home</a>
      <a href="/products" aria-current="page">Products</a>
    </nav>
  </header>

  <main>
    <h1>Products</h1>

    <article class="card">
      <img src="laptop.jpg" alt="Silver laptop, open on a desk" width="400" height="225">
      <h2>Laptop Pro</h2>
      <p>14-inch display, 16 GB memory.</p>
      <button type="button">Add to cart</button>
    </article>

    <form action="/subscribe" method="post">
      <label for="email">Email address</label>
      <input id="email" name="email" type="email" required autocomplete="email">
      <button type="submit">Subscribe</button>
    </form>
  </main>

  <footer><small>© 2026 Shop</small></footer>
</body>
</html>
`,
      practice: "In the CSS playground, build a product page skeleton using only semantic elements — no `div`. Then navigate it with the Tab key alone: can you reach and activate everything? Replace the button with a clickable `div` and try again.",
      teach: "Explain why you should use a `<button>` instead of a `<div>` with a click handler.",
      analogy: "HTML is the labelled floor plan of a building: this room is the kitchen, this is the entrance, this is a staircase. Paint and furniture (CSS) come later. A plan where every room is labelled 'room' can still be decorated — but nobody, least of all a visitor who cannot see, can find the kitchen.",
      pitfalls: [
        "`div` and `span` for everything, then re-implementing focus, keyboard and roles by hand.",
        "Inputs with a placeholder but no label.",
        "Choosing heading levels for their font size instead of the document outline."
      ],
      quiz: [
        { q: "Which element should trigger an action such as 'Add to cart'?", a: ["`<div onclick>`", "`<button>`", "`<a>` without href", "`<span>`"], c: 1, why: "A button is focusable, keyboard-operable and announced correctly with no extra work." },
        { q: "What is the `alt` attribute for?", a: ["A tooltip", "A text alternative describing the image for people and tools that cannot see it", "The image's file name", "SEO keywords"], c: 1, why: "Screen readers read it, and it shows when the image fails to load." },
        { q: "How is a `<label>` connected to its input?", a: ["By being nearby", "`for` on the label matching the input's `id` (or by wrapping the input)", "By `class`", "It is automatic"], c: 1, why: "The association gives the input an accessible name and makes the label clickable." }
      ]
    },
    {
      id: 'cascade', title: 'Selectors, the cascade and specificity', level: 0, mins: 30, viz: 'specificity',
      why: "'Why is my style not applying?' is the first and most frequent CSS question. The answer is always the cascade: a fixed set of rules that decides which declaration wins.",
      points: [
        "A rule is `selector { property: value; }`. Selectors target by element (`p`), class (`.card`), id (`#header`), attribute (`[type=email]`) or state (`:hover`, `:focus-visible`).",
        "Combinators express relationships: `nav a` (descendant), `ul > li` (direct child), `h2 + p` (next sibling).",
        "When several rules set the same property, the **cascade** picks a winner: importance, then origin and layer, then **specificity**, then **source order** (last wins).",
        "Specificity is counted as (ids, classes, elements). One id beats any number of classes; one class beats any number of elements. Inline styles beat all selectors; `!important` beats inline.",
        "Some properties **inherit** from the parent (color, font, line-height); most layout properties (margin, padding, border, width) do not.",
        "Keep specificity low and flat: style with single classes. Avoid ids and `!important` in stylesheets — every escalation makes the next override harder."
      ],
      code: `
/* (0,0,1) element */
a { color: gray; }

/* (0,1,0) class — beats the element rule */
.btn { color: blue; }

/* (0,2,0) two classes — beats one class */
.btn.primary { color: green; }

/* (1,0,0) id — beats any number of classes */
#buy { color: red; }

/* Same specificity as .btn: the LATER rule wins */
.link { color: teal; }

/* State and relationship selectors */
.btn:hover { text-decoration: underline; }
.btn:focus-visible { outline: 2px solid currentColor; }
nav > a + a { margin-left: 1rem; }

/* Inherited by every descendant unless overridden */
body { font-family: system-ui, sans-serif; color: #1b2030; }
`,
      practice: "In the specificity visualizer, predict the winning colour before toggling each rule. Then open the CSS playground, write three conflicting rules for one button, and make each win in turn without using `!important`.",
      teach: "Explain how the browser decides which of two conflicting CSS rules applies to an element.",
      analogy: "The cascade is a card game with a strict ranking. An id is an ace, a class is a king, an element is a numbered card — and no pile of kings beats one ace. When two players hold the same hand, whoever played last wins. `!important` is flipping the table: it works once, and then everyone else starts flipping tables too.",
      pitfalls: [
        "Thinking 11 classes beat 1 id. Specificity columns never overflow into each other.",
        "Reaching for `!important` to win, which starts an arms race.",
        "Assuming every property inherits. `border` and `margin` on a parent do not pass to children."
      ],
      quiz: [
        { q: "Which selector has the highest specificity?", a: ["`.card .title`", "`#main`", "`div p span a`", "`.a.b.c`"], c: 1, why: "One id (1,0,0) outranks any number of classes or elements." },
        { q: "Two rules with identical specificity set `color`. Which wins?", a: ["The first in the file", "The one declared later", "Neither", "The longer one"], c: 1, why: "With equal importance, origin and specificity, source order decides: last wins." },
        { q: "Which property is inherited by default?", a: ["`margin`", "`border`", "`color`", "`width`"], c: 2, why: "Text properties such as `color` and `font` inherit; box properties do not." }
      ]
    },
    {
      id: 'box', title: 'The box model', level: 0, mins: 25, viz: 'boxmodel',
      why: "Every element is a rectangle. Sizing bugs — a 100% wide element overflowing its parent, mysterious gaps — are box-model misunderstandings, and they vanish once the four layers are visible.",
      points: [
        "From inside out: **content**, **padding** (space inside the border), **border**, **margin** (space outside, between elements).",
        "Default `box-sizing: content-box` means `width` sets only the content; padding and border are added on top. `border-box` makes `width` include padding and border — what everyone expects.",
        "Start every project with `*, *::before, *::after { box-sizing: border-box; }`.",
        "`display: block` elements take the full width and stack; `inline` elements flow in text and ignore width/height; `inline-block` flows inline but accepts sizes.",
        "Vertical margins of adjacent blocks **collapse** into the larger one. Padding and flex/grid `gap` do not collapse.",
        "`overflow` controls content that does not fit: `visible`, `hidden`, `auto` (scroll when needed)."
      ],
      code: `
*, *::before, *::after { box-sizing: border-box; }

.card {
  width: 300px;             /* total width, because of border-box */
  padding: 16px;            /* space inside */
  border: 2px solid #ccc;
  margin: 24px auto;        /* space outside; auto centers a block horizontally */
  overflow: auto;
}

/* content-box (the default): rendered width = 300 + 2*16 + 2*2 = 336px */
.legacy { box-sizing: content-box; width: 300px; padding: 16px; border: 2px solid; }

/* Margin collapse: the gap between these is 32px, not 56px */
h2 { margin-bottom: 24px; }
p  { margin-top: 32px; }
`,
      practice: "Use the box model visualizer to make a 300px `content-box` element overflow a 320px parent, then fix it by switching to `border-box`. In dev tools, inspect any element on this page and read its box diagram.",
      teach: "Explain the difference between padding and margin, and what `box-sizing: border-box` changes.",
      analogy: "A framed picture on a wall. The picture is the content; the white mat around it is padding; the frame is the border; the empty wall between this frame and the next is margin. `border-box` means that when you say 'this is a 30 cm picture', you are measuring the outside of the frame.",
      pitfalls: [
        "Setting `width: 100%` plus padding under `content-box` and overflowing the parent.",
        "Expecting `width` or vertical margin to work on an inline element such as `span`.",
        "Being surprised by collapsed margins and adding more margin to compensate."
      ],
      quiz: [
        { q: "With `box-sizing: content-box`, `width: 200px; padding: 20px; border: 5px solid` renders how wide?", a: ["200px", "225px", "250px", "240px"], c: 2, why: "200 + 20×2 + 5×2 = 250px. Padding and border are added outside the content width." },
        { q: "Which sits between the content and the border?", a: ["Margin", "Padding", "Outline", "Gap"], c: 1, why: "Padding is inside the border; margin is outside it." },
        { q: "Two stacked paragraphs have `margin-bottom: 20px` and `margin-top: 30px`. The gap is…", a: ["50px", "30px", "20px", "10px"], c: 1, why: "Adjacent vertical margins collapse to the larger of the two." }
      ]
    },
    {
      id: 'units', title: 'Units, colour and typography', level: 0, mins: 25,
      why: "Readable text and consistent spacing are most of what makes an interface look professional. Choosing relative units also decides whether the design respects a user's font-size settings.",
      points: [
        "`px` is absolute. `rem` is relative to the root font size (16px by default) and scales with the user's browser setting — use it for font sizes and spacing.",
        "`em` is relative to the element's own font size (useful for padding that scales with text). `%` is relative to the parent. `vw`/`vh`/`dvh` are viewport units; `ch` is the width of a character.",
        "`clamp(min, preferred, max)` gives fluid sizes with limits: `font-size: clamp(1.5rem, 4vw, 2.5rem)`.",
        "Colours: hex `#3b47d6`, `rgb()`, `hsl()` (hue, saturation, lightness — easy to reason about) and `oklch()` (perceptually even, the modern choice).",
        "Typography that reads well: body 16px or more, `line-height` about 1.5, line length 45–75 characters (`max-width: 65ch`), a clear size scale for headings.",
        "Text contrast must reach 4.5:1 against its background (3:1 for large text) to meet WCAG AA."
      ],
      code: `
:root {
  font-size: 100%;                       /* respect the user's setting (usually 16px) */
  --text: hsl(225 28% 15%);
  --muted: hsl(220 12% 42%);
  --accent: oklch(55% 0.2 270);
}

body {
  font-family: system-ui, -apple-system, "Segoe UI", sans-serif;
  font-size: 1rem;
  line-height: 1.6;
  color: var(--text);
}

h1 { font-size: clamp(1.75rem, 4vw, 2.5rem); line-height: 1.2; letter-spacing: -0.02em; }
p  { max-width: 65ch; margin-block: 0 1rem; }

.button {
  font-size: 0.9rem;
  padding: 0.5em 1em;                    /* em: padding scales with the button's text */
  border-radius: 0.5rem;
}
`,
      practice: "Set your browser's default font size to 20px and compare a page sized in `px` with one sized in `rem`. Then build a heading that is 1.5rem on a phone and 2.5rem on a wide screen using one `clamp()` and no media query.",
      teach: "Explain the difference between `px`, `em` and `rem`, and when you would choose each.",
      analogy: "`px` is a ruler measurement: 2 cm is 2 cm for everyone. `rem` is 'twice my normal handwriting size' — it follows whatever size each reader chose as normal. `em` is 'twice the size of the text right here', so it compounds when nested, like a photocopy of a photocopy.",
      pitfalls: [
        "Setting `html { font-size: 10px }` or sizing text in `px`, which overrides the user's accessibility setting.",
        "Nesting `em` font sizes and watching text shrink or grow at each level.",
        "Light grey text on white that fails contrast."
      ],
      quiz: [
        { q: "The root font size is 16px. How big is `1.5rem`?", a: ["15px", "16px", "24px", "1.5px"], c: 2, why: "`rem` multiplies the root font size: 1.5 × 16 = 24px." },
        { q: "What does `clamp(1rem, 3vw, 2rem)` do?", a: ["Always 3vw", "Uses 3vw but never below 1rem or above 2rem", "Picks the smallest", "Throws on small screens"], c: 1, why: "`clamp` bounds a preferred fluid value between a minimum and a maximum." },
        { q: "Minimum contrast ratio for normal body text under WCAG AA?", a: ["2:1", "3:1", "4.5:1", "7:1"], c: 2, why: "4.5:1 for normal text; 3:1 for large text; 7:1 is the stricter AAA level." }
      ]
    },
    // ---------------- Intermediate ----------------
    {
      id: 'flexbox', title: 'Flexbox: layout in one dimension', level: 1, mins: 35, viz: 'flexbox',
      why: "Navbars, toolbars, cards, centered content, form rows — most everyday layout is a single row or column of things. Flexbox handles all of it, and 'how do I center a div' has been a one-liner since it arrived.",
      points: [
        "`display: flex` on a parent makes its children flex items laid out along a **main axis** (`flex-direction: row` or `column`).",
        "`justify-content` distributes items along the main axis; `align-items` aligns them on the cross axis.",
        "`gap` adds space between items without margin tricks.",
        "Items can grow and shrink: `flex: 1` means 'take an equal share of the free space'; `flex: 0 0 200px` means 'stay exactly 200px'.",
        "`flex-wrap: wrap` lets items flow onto new lines. `margin-left: auto` on one item pushes it to the far end.",
        "Flex items refuse to shrink below their content by default; `min-width: 0` on the item allows long text to truncate."
      ],
      code: `
/* Navbar: logo left, links right, vertically centered */
.nav {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 1rem;
}
.nav .spacer { margin-left: auto; }      /* pushes everything after it to the right */

/* Perfect centering in both directions */
.hero {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
}

/* Sidebar fixed, content flexible */
.layout  { display: flex; gap: 2rem; }
.sidebar { flex: 0 0 240px; }
.content { flex: 1; min-width: 0; }      /* min-width: 0 lets long content shrink */

/* Cards that wrap onto new rows */
.cards { display: flex; flex-wrap: wrap; gap: 1rem; }
.cards > * { flex: 1 1 220px; }
`,
      practice: "In the flexbox visualizer, reproduce three layouts: items centered both ways; first item left and the rest right; equal-width columns. Write down the CSS and the Tailwind classes for each.",
      teach: "Explain the main axis and the cross axis, and which property controls alignment on each.",
      analogy: "Flexbox is arranging books on one shelf. `justify-content` decides how they are spread along the shelf — pushed left, centered, or spaced evenly. `align-items` decides whether short books sit at the bottom, the top, or the middle. Switching `flex-direction` to column stands the shelf on its end, and the two properties swap what they mean on screen.",
      pitfalls: [
        "Mixing up `justify-content` and `align-items` after changing `flex-direction` to `column`.",
        "Long text or a wide table blowing out a flex layout — fix with `min-width: 0`.",
        "Using flexbox for a true two-dimensional grid and fighting it with fixed widths."
      ],
      quiz: [
        { q: "With `flex-direction: row`, which property centers items vertically?", a: ["`justify-content`", "`align-items`", "`text-align`", "`vertical-align`"], c: 1, why: "In a row, the cross axis is vertical, and `align-items` controls the cross axis." },
        { q: "What does `flex: 1` on every child do?", a: ["Hides overflow", "Gives each child an equal share of the available space", "Makes them 1px wide", "Stacks them"], c: 1, why: "It sets grow to 1 with a zero basis, so free space is divided equally." },
        { q: "In a flex row, how do you push the last item to the far right?", a: ["`float: right`", "`margin-left: auto` on that item", "`text-align: right`", "`position: absolute`"], c: 1, why: "An auto margin absorbs all free space on that side." }
      ]
    },
    {
      id: 'grid', title: 'CSS Grid: layout in two dimensions', level: 1, mins: 35, viz: 'grid',
      why: "Page shells, dashboards, galleries and any design with rows and columns that must line up belong to Grid. Used together with flexbox, it removes the need for layout hacks entirely.",
      points: [
        "`display: grid` plus `grid-template-columns` defines column tracks; rows are created automatically as items flow in.",
        "The `fr` unit is a fraction of the leftover space: `1fr 2fr` splits it one-third / two-thirds.",
        "`repeat(3, 1fr)` is three equal columns. `repeat(auto-fit, minmax(220px, 1fr))` is a **responsive grid with no media queries**.",
        "Items can span tracks: `grid-column: span 2` or `grid-column: 1 / -1` (full width).",
        "`grid-template-areas` names regions so the layout reads like a picture of the page.",
        "Rule of thumb: **Grid for the page and two-dimensional structure, flexbox for the contents of each cell.**"
      ],
      code: `
/* Responsive card gallery — no media queries */
.gallery {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
}
.gallery .featured { grid-column: span 2; }

/* App shell with named areas */
.app {
  display: grid;
  grid-template-columns: 240px 1fr;
  grid-template-rows: auto 1fr auto;
  grid-template-areas:
    "nav  header"
    "nav  main"
    "nav  footer";
  min-height: 100vh;
}
.app > nav    { grid-area: nav; }
.app > header { grid-area: header; }
.app > main   { grid-area: main; }
.app > footer { grid-area: footer; }

/* Centering with grid: two lines */
.center { display: grid; place-items: center; }
`,
      practice: "In the grid visualizer, switch between the templates and resize the window while `auto-fit` is selected. Then build this app's own layout (sidebar + main) with `grid-template-areas` in the CSS playground.",
      teach: "Explain when to choose Grid and when to choose flexbox, with one example of each.",
      analogy: "Flexbox is a shelf; Grid is a sheet of graph paper. On graph paper you decide the columns and rows first and then place things into cells — and everything lines up both across and down. You plan a floor of a building with graph paper (Grid) and arrange the furniture in each room along a wall (flexbox).",
      pitfalls: [
        "Using `auto-fill` when `auto-fit` is wanted: `auto-fill` keeps empty tracks, so few items do not stretch.",
        "Hard-coding column counts per breakpoint when `minmax()` would adapt on its own.",
        "`1fr` columns overflowing with long content — use `minmax(0, 1fr)`."
      ],
      quiz: [
        { q: "What does `grid-template-columns: 1fr 3fr` create?", a: ["Two equal columns", "Two columns sharing free space 1:3", "Four columns", "One column of 3 rows"], c: 1, why: "`fr` units divide the available space proportionally." },
        { q: "Which declaration gives a responsive grid without media queries?", a: ["`repeat(3, 1fr)`", "`repeat(auto-fit, minmax(200px, 1fr))`", "`200px 200px 200px`", "`grid-auto-flow: column`"], c: 1, why: "The browser fits as many 200px-minimum columns as will fit and stretches them." },
        { q: "How do you make a grid item span the full width?", a: ["`width: 100vw`", "`grid-column: 1 / -1`", "`flex: 1`", "`float: none`"], c: 1, why: "Line 1 to line -1 covers every column track." }
      ]
    },
    {
      id: 'responsive', title: 'Responsive design', level: 1, mins: 35,
      why: "More than half of web traffic is on phones. A layout that only works at the designer's screen width is broken for most users — and responsive thinking is expected of anyone who touches frontend code.",
      points: [
        "Include the viewport meta tag, or phones render the page zoomed out: `<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">`.",
        "**Mobile-first**: write the base styles for small screens, then add complexity with `@media (min-width: …)`.",
        "Prefer **intrinsic** layouts that adapt on their own — flex-wrap, `auto-fit` grids, `clamp()`, `max-width` — and add breakpoints only where the design actually breaks.",
        "Images: `max-width: 100%; height: auto;` and set `width`/`height` attributes or `aspect-ratio` to prevent layout shift.",
        "**Container queries** (`@container`) style a component by the width of its container rather than the viewport — the right tool for reusable components.",
        "Respect user preferences with media features: `prefers-color-scheme`, `prefers-reduced-motion`, `hover`, `pointer`."
      ],
      code: `
/* Mobile first: one column by default */
.page { display: grid; gap: 1rem; padding: 1rem; }

/* Wider screens add the sidebar */
@media (min-width: 768px) {
  .page { grid-template-columns: 240px 1fr; padding: 2rem; }
}

img, video { max-width: 100%; height: auto; }
.thumb { aspect-ratio: 16 / 9; object-fit: cover; }

/* Container query: the card adapts to the space it is given */
.card-wrap { container-type: inline-size; }
.card { display: grid; gap: 0.75rem; }
@container (min-width: 420px) {
  .card { grid-template-columns: 120px 1fr; }
}

/* User preferences */
@media (prefers-reduced-motion: reduce) {
  * { animation: none !important; transition: none !important; }
}
@media (hover: hover) {
  .card:hover { box-shadow: 0 4px 16px rgb(0 0 0 / 0.12); }
}
`,
      practice: "Take a desktop-only page and make it work at 360px wide without horizontal scrolling. Count the media queries you needed, then try to remove one by replacing it with an intrinsic technique.",
      teach: "Explain what 'mobile-first' means in CSS and why `min-width` media queries are preferred over `max-width`.",
      analogy: "Mobile-first is packing for a trip with a carry-on first: you start with only what is essential, and if you later get a bigger suitcase you add extras. Starting with the big suitcase and trying to squeeze it into a carry-on means painful decisions about what to throw out. A container query is furniture that folds to fit whatever room it is put in, not whatever house it is in.",
      pitfalls: [
        "Forgetting the viewport meta tag.",
        "Designing for three exact device widths instead of letting content decide the breakpoints.",
        "Hiding content on mobile rather than reorganizing it."
      ],
      quiz: [
        { q: "In a mobile-first stylesheet, base styles target…", a: ["Desktop screens", "Small screens, with `min-width` queries adding layout for larger ones", "Print", "Tablets only"], c: 1, why: "Start simple and enhance upward; larger layouts are opt-in." },
        { q: "What is a container query based on?", a: ["The viewport width", "The size of the element's container", "The device pixel ratio", "The user's font size"], c: 1, why: "Components respond to the space they are placed in, wherever that is." },
        { q: "Which rule keeps images from overflowing their parent?", a: ["`width: 100vw`", "`max-width: 100%; height: auto`", "`overflow: scroll`", "`float: left`"], c: 1, why: "The image may shrink to fit but never exceeds its container, and keeps its ratio." }
      ]
    },
    // ---------------- Advanced ----------------
    {
      id: 'position', title: 'Positioning and stacking contexts', level: 2, mins: 30,
      why: "Modals, dropdowns, sticky headers, tooltips and badges all depend on positioning — and 'z-index: 9999 does nothing' is a classic interview question with a precise answer.",
      points: [
        "`position: static` is the default flow. `relative` keeps the element's space and lets you offset it — and makes it the reference for absolutely positioned children.",
        "`absolute` removes the element from flow and positions it against the nearest **positioned ancestor**.",
        "`fixed` positions against the viewport. `sticky` scrolls normally until it reaches an offset, then sticks within its scroll container.",
        "`z-index` only applies to positioned elements and flex/grid items, and only orders elements **within the same stacking context**.",
        "A new stacking context is created by `z-index` on a positioned element, and also by `opacity < 1`, `transform`, `filter`, `isolation: isolate` and more. A child can never escape its parent's context.",
        "Modern overlays: the `<dialog>` element and the Popover API render in the **top layer**, above everything, with no z-index needed."
      ],
      code: `
/* Badge on the corner of a card */
.card  { position: relative; }
.badge { position: absolute; top: -0.5rem; right: -0.5rem; }

/* Sticky header: sticks at the top of its scroll container */
.header { position: sticky; top: 0; z-index: 10; background: white; }

/* The classic bug: this modal sits BEHIND the header even with z-index 9999 */
.sidebar { transform: translateX(0); }        /* creates a stacking context */
.sidebar .modal { position: fixed; z-index: 9999; }
/* Fix: render the modal outside .sidebar, or use <dialog> / popover */

/* A deliberate, contained stacking context */
.widget { isolation: isolate; }               /* inner z-indexes cannot leak out */

/* Full-bleed overlay */
.overlay { position: fixed; inset: 0; background: rgb(0 0 0 / 0.5); }
`,
      practice: "Reproduce the stacking bug: put a `z-index: 9999` element inside a parent with `transform`, next to a sibling with `z-index: 2`. Explain why it loses, then fix it two different ways.",
      teach: "Explain why an element with `z-index: 9999` can still appear behind an element with `z-index: 2`.",
      analogy: "Stacking contexts are folders of transparent sheets. Inside one folder you can reorder sheets freely with `z-index`. But the folders themselves are stacked too — and a sheet in the bottom folder can never rise above the folder on top of it, no matter how high its number is inside its own folder.",
      pitfalls: [
        "Escalating z-index numbers instead of finding which ancestor created a stacking context.",
        "`position: absolute` with no positioned ancestor, so the element flies to the page corner.",
        "`position: sticky` failing because an ancestor has `overflow: hidden`."
      ],
      quiz: [
        { q: "An absolutely positioned element is placed relative to…", a: ["The viewport, always", "Its nearest positioned ancestor", "Its previous sibling", "The `<body>` always"], c: 1, why: "It uses the closest ancestor whose position is not `static`, falling back to the initial containing block." },
        { q: "Which of these creates a new stacking context?", a: ["`color: red`", "`transform: translateX(0)`", "`margin: 0`", "`display: block`"], c: 1, why: "Transforms, opacity below 1, filters and `isolation: isolate` all create stacking contexts." },
        { q: "Why might `z-index` have no effect on an element?", a: ["It is too large", "The element is not positioned (and is not a flex/grid item)", "The browser is old", "It needs `!important`"], c: 1, why: "`z-index` is ignored on static, non-flex/grid elements." }
      ]
    },
    {
      id: 'modern', title: 'Custom properties, theming and modern CSS', level: 2, mins: 35,
      why: "Design tokens, dark mode and component variants are built on custom properties. Modern CSS has also absorbed most of what preprocessors were needed for — knowing it keeps your toolchain small.",
      points: [
        "**Custom properties** (`--brand: #3b47d6`) are variables that cascade and inherit, read with `var(--brand, fallback)`. Unlike Sass variables they are live at run time.",
        "Define **design tokens** on `:root` — colours, spacing, radii — and reference them everywhere. Changing a theme is redefining the tokens.",
        "Dark mode: redefine tokens under `@media (prefers-color-scheme: dark)` and/or a `[data-theme=\"dark\"]` attribute for a manual toggle.",
        "Native **nesting** (`.card { &:hover { … } .title { … } }`) and `:is()` / `:where()` shorten selectors; `:where()` has zero specificity.",
        "`:has()` is the parent selector: `.field:has(input:invalid)` styles a wrapper based on its content.",
        "Transitions animate property changes; prefer animating `transform` and `opacity`. Always honour `prefers-reduced-motion`."
      ],
      code: `
:root {
  --bg: #ffffff;
  --text: #1b2030;
  --accent: #3b47d6;
  --radius: 0.5rem;
  --space: 1rem;
}

@media (prefers-color-scheme: dark) {
  :root { --bg: #0e1117; --text: #e7eaf0; --accent: #8b95ff; }
}
[data-theme="dark"] { --bg: #0e1117; --text: #e7eaf0; --accent: #8b95ff; }

body { background: var(--bg); color: var(--text); }

.button {
  --btn-bg: var(--accent);                 /* component-level token */
  background: var(--btn-bg);
  border-radius: var(--radius);
  padding: calc(var(--space) / 2) var(--space);
  transition: transform 150ms ease, opacity 150ms ease;

  &:hover  { transform: translateY(-1px); }
  &:active { opacity: 0.85; }
  &.danger { --btn-bg: #c0362c; }          /* a variant only changes the token */
}

/* Parent selector: style the label wrapper when its input is invalid */
.field:has(input:user-invalid) { color: #c0362c; }
`,
      practice: "Add a second theme to this pattern (for example high-contrast) by redefining only tokens. Then build a toggle that sets `data-theme` on `<html>` and remembers the choice. No component rule should mention a raw colour.",
      teach: "Explain how CSS custom properties make dark mode possible without rewriting every component's styles.",
      analogy: "Custom properties are the paint colours named on a decorator's chart: 'wall', 'trim', 'accent'. Every room's instructions say 'paint the trim in trim'. To redecorate the whole house you change three entries on the chart, not the instructions for every room.",
      pitfalls: [
        "Hard-coded colours scattered through components, making theming a find-and-replace job.",
        "Animating `width`, `height` or `top`, which forces layout on every frame.",
        "A theme toggle that ignores the system preference on first visit."
      ],
      quiz: [
        { q: "How do custom properties differ from Sass variables?", a: ["They are faster to type", "They exist at run time, cascade and inherit, and can change per element or media query", "They only hold colours", "They need a build step"], c: 1, why: "Sass variables are compiled away; custom properties are live values in the browser." },
        { q: "What does `.card:has(img)` select?", a: ["Images inside cards", "Cards that contain an image", "Cards without images", "Nothing — invalid"], c: 1, why: "`:has()` selects an element based on its descendants." },
        { q: "Which properties are cheapest to animate?", a: ["`width` and `height`", "`transform` and `opacity`", "`margin` and `padding`", "`top` and `left`"], c: 1, why: "They can be handled by the compositor without layout or paint." }
      ]
    },
    {
      id: 'tailwind', title: 'Tailwind CSS: utility-first fundamentals', level: 2, mins: 40, lang: 'html',
      why: "Tailwind is the most widely adopted CSS framework in modern React projects. It replaces naming and stylesheet maintenance with small composable classes — and every class is plain CSS you already understand.",
      points: [
        "**Utility-first**: each class does one thing (`p-4`, `flex`, `text-lg`, `bg-blue-600`). You compose them in the markup instead of inventing class names and writing separate CSS.",
        "Values come from a **design scale**: spacing `p-4` = 1rem, type `text-sm`…`text-4xl`, colours `slate-50`…`slate-950`. Constraints produce consistency.",
        "**Variants** prefix a utility with a condition: `hover:`, `focus-visible:`, `disabled:`, `dark:`, and breakpoints `sm:` `md:` `lg:` (mobile-first, min-width).",
        "Layout maps one-to-one to what you know: `flex items-center justify-between gap-4`, `grid grid-cols-3`, `absolute inset-0`.",
        "Escape hatches: arbitrary values `w-[37rem]`, `bg-[#1da1f2]`, and arbitrary variants. Use them sparingly; prefer the scale.",
        "The compiler scans your files and emits **only the classes you use**, so the CSS bundle stays small. Component libraries such as Bootstrap take the opposite approach: pre-styled components you then override."
      ],
      code: `
<!-- A responsive product card -->
<article class="mx-auto max-w-sm overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm
                transition hover:shadow-md dark:border-slate-700 dark:bg-slate-900">
  <img class="aspect-video w-full object-cover" src="laptop.jpg" alt="Laptop on a desk">

  <div class="space-y-3 p-4 md:p-6">
    <div class="flex items-center justify-between gap-4">
      <h3 class="text-lg font-semibold text-slate-900 dark:text-white">Laptop Pro</h3>
      <span class="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800">In stock</span>
    </div>

    <p class="text-sm leading-6 text-slate-600 dark:text-slate-300">
      14-inch display, 16 GB memory, all-day battery.
    </p>

    <button class="w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white
                   hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2
                   focus-visible:outline-indigo-600 disabled:opacity-50">
      Add to cart
    </button>
  </div>
</article>

<!-- Responsive grid: 1 column on phones, 2 from md, 3 from lg -->
<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"> … </div>
`,
      practice: "Open the CSS playground, switch on Tailwind, and rebuild the card from memory. Then translate five of its classes back into the plain CSS they generate — if you cannot, revisit that CSS lesson.",
      teach: "Explain what 'utility-first' means and answer the common objection: 'isn't this just inline styles?'",
      analogy: "Traditional CSS is ordering custom furniture: name each piece, describe it, wait for it to be built. Tailwind is a box of standard building bricks in fixed sizes and colours — you snap together what you need on the spot, and because everyone uses the same bricks, everything built in the house matches.",
      pitfalls: [
        "Learning Tailwind instead of CSS. Every utility is a CSS declaration; without the fundamentals you cannot debug it.",
        "Building class names dynamically (`'text-' + color + '-500'`). The compiler only finds complete class strings in your source.",
        "Calling it 'inline styles'. Utilities support hover, focus, breakpoints and dark mode, and draw from a constrained scale — inline styles do none of that."
      ],
      quiz: [
        { q: "What does `md:grid-cols-2` mean?", a: ["Two columns only on medium screens", "Two columns from the `md` breakpoint upward", "Two columns below `md`", "Medium-sized columns"], c: 1, why: "Breakpoint variants are mobile-first `min-width` queries: they apply at that width and wider." },
        { q: "Why does Tailwind's CSS output stay small in production?", a: ["It is gzipped twice", "Only classes found in your source files are generated", "It ships no CSS", "It uses inline styles"], c: 1, why: "The compiler scans your templates and emits just the utilities you actually use." },
        { q: "Why does `className={'bg-' + color + '-500'}` often not work?", a: ["React forbids it", "The compiler cannot see the full class name in the source, so it is never generated", "Colours need hex values", "Template strings are slow"], c: 1, why: "Classes are detected as whole strings at build time; map values to complete class names instead." }
      ]
    },
    {
      id: 'twreact', title: 'Tailwind in React: components, variants and theming', level: 2, mins: 40, lang: 'tsx',
      why: "Utilities in markup only scale if repetition is removed the right way. In a React codebase the unit of reuse is the component, not a CSS class — and typed variants turn a design system into an API.",
      points: [
        "Remove duplication by extracting **components**, not by reaching for `@apply`. A `<Button>` owns its classes once.",
        "Setup with Vite: install `tailwindcss` and `@tailwindcss/vite`, add the plugin, and write `@import \"tailwindcss\";` in your CSS entry file.",
        "Customize the design system in CSS with `@theme`: defining `--color-brand-500` creates `bg-brand-500`, `text-brand-500` and so on.",
        "Merge classes safely with `clsx` + `tailwind-merge` (the common `cn()` helper) so a caller's `className` can override defaults without conflicts.",
        "Model variants (size, intent) as typed props — by hand with a lookup object or with `class-variance-authority`. Invalid variants become compile errors.",
        "State styling without JavaScript: `group-hover:`, `peer-invalid:`, `data-[state=open]:`, `aria-expanded:`. Dark mode uses `dark:`; switch it to a class strategy with `@custom-variant` for a manual toggle."
      ],
      code: `
// vite.config.ts:  plugins: [react(), tailwindcss()]   (from "@tailwindcss/vite")
//
// app.css
//   @import "tailwindcss";
//   @theme {
//     --color-brand-500: oklch(55% 0.2 270);
//     --color-brand-600: oklch(48% 0.2 270);
//   }
//   @custom-variant dark (&:where(.dark, .dark *));

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { ButtonHTMLAttributes } from "react";

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

const intents = {
  primary: "bg-brand-500 text-white hover:bg-brand-600",
  secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-slate-800 dark:text-white",
  danger: "bg-red-600 text-white hover:bg-red-500",
} as const;

const sizes = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-sm",
  lg: "px-5 py-3 text-base",
} as const;

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  intent?: keyof typeof intents;
  size?: keyof typeof sizes;
}

export function Button({ intent = "primary", size = "md", className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition",
        "focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50",
        intents[intent], sizes[size], className)}
      {...props}
    />
  );
}

// <Button intent="danger" size="lg" className="w-full">Delete</Button>
// <Button intent="purple" />   // compile error: not a valid intent
`,
      practice: "Build `Button`, `Input` and `Card` components with typed variants in a Vite + React + Tailwind project. Add a brand colour through `@theme` and a dark-mode toggle. No page file should contain more than layout utilities.",
      teach: "Explain why, in a React + Tailwind project, you extract a component rather than a CSS class to avoid repeating utilities.",
      analogy: "A component is a rubber stamp that already carries its ink. You do not hand everyone the list of twelve ink colours and hope they mix them the same way each time — you hand them the stamp. Variants are the dial on the stamp: small, medium, large; primary, danger.",
      pitfalls: [
        "Overusing `@apply` and rebuilding the stylesheet architecture Tailwind was meant to remove.",
        "Concatenating class strings so that `px-2 px-4` both apply unpredictably — merge with `tailwind-merge`.",
        "Variants as free-form strings instead of a typed union."
      ],
      quiz: [
        { q: "What does defining `--color-brand-500` inside `@theme` do?", a: ["Nothing until you write CSS for it", "Generates utilities such as `bg-brand-500` and `text-brand-500`", "Overrides all colours", "Creates a React component"], c: 1, why: "Theme variables are design tokens that drive which utility classes exist." },
        { q: "What problem does `tailwind-merge` solve?", a: ["Bundle size", "Conflicting utilities such as `px-2 px-4` — it keeps the last one", "Missing dark mode", "Slow builds"], c: 1, why: "It resolves conflicts so a consumer's `className` can reliably override defaults." },
        { q: "Preferred way to reuse a set of utilities across a React app?", a: ["Copy and paste", "`@apply` in a global stylesheet", "Extract a component", "Inline `style` objects"], c: 2, why: "The component is the unit of reuse; it bundles structure, behavior and classes together." }
      ]
    },
    // ---------------- Expert ----------------
    {
      id: 'arch', title: 'CSS architecture and design systems', level: 3, mins: 40,
      why: "CSS is global by default, so it decays faster than any other code in a growing team. An expert chooses a scoping strategy on purpose and can defend it against the alternatives.",
      points: [
        "The core problem is **global scope + specificity + source order**: any rule can affect any element, and overrides accumulate.",
        "Scoping strategies: naming conventions (**BEM**: `.card__title--large`), **CSS Modules** (build-time unique class names), **utility-first** (Tailwind), CSS-in-JS, and native **`@scope`**.",
        "**Cascade layers** (`@layer reset, base, components, utilities;`) make precedence explicit: a later layer beats an earlier one regardless of specificity. This ends specificity wars.",
        "A **design system** is tokens (colour, space, type, radius) → primitives (Button, Input) → patterns. Tokens come in tiers: raw values, semantic aliases (`--color-danger`), component tokens.",
        "Components should not set their own outer margin; the parent layout owns spacing (via `gap`). This keeps components reusable anywhere.",
        "Trade-offs to articulate: utility-first gives speed and a small CSS bundle but noisy markup; CSS Modules give plain CSS and isolation but more files and naming; runtime CSS-in-JS costs performance."
      ],
      code: `
/* Layer order is declared once; later layers win regardless of specificity */
@layer reset, tokens, base, components, utilities;

@layer reset {
  *, *::before, *::after { box-sizing: border-box; margin: 0; }
}

@layer tokens {
  :root {
    --blue-600: oklch(55% 0.2 270);          /* raw */
    --color-action: var(--blue-600);         /* semantic */
    --space-2: 0.5rem; --space-4: 1rem;
  }
}

@layer components {
  /* BEM: block__element--modifier, flat specificity (0,1,0) throughout */
  .card { padding: var(--space-4); border-radius: 0.75rem; }
  .card__title { font-weight: 600; }
  .card--featured { border: 2px solid var(--color-action); }
}

@layer utilities {
  .hidden { display: none; }                 /* beats #any .component rule above */
}

/* Native scoping: styles apply inside .card, but stop at nested .card-slot content */
@scope (.card) to (.card-slot) {
  img { border-radius: 0.5rem; }
}

/* Layout owns spacing; components have no outer margin */
.stack { display: grid; gap: var(--space-4); }
`,
      practice: "Audit a stylesheet you know: count `!important`, find the highest-specificity selector, and list every raw colour value. Then write a one-page proposal for scoping and tokens for a five-person team, naming the alternative you rejected and why.",
      teach: "Explain how cascade layers end 'specificity wars', using a utility class that must override a component style.",
      analogy: "Without layers, CSS precedence is a shouting match: whoever is loudest (most specific) wins, so everyone keeps raising their voice. Cascade layers are an agreed speaking order in a meeting: the chair always has the final word, however quietly they speak.",
      pitfalls: [
        "Mixing three scoping strategies in one codebase with no rule for which applies where.",
        "Tokens named after values (`--blue`) instead of purpose (`--color-action`), making rebrands painful.",
        "Components that carry outer margins and break in every new context."
      ],
      quiz: [
        { q: "With `@layer components, utilities;` which rule wins: `#app .btn` in `components` or `.hidden` in `utilities`?", a: ["`#app .btn` — higher specificity", "`.hidden` — later layer wins regardless of specificity", "Whichever is last in the file", "Neither"], c: 1, why: "Layer order is compared before specificity." },
        { q: "What do CSS Modules provide?", a: ["Runtime theming", "Locally scoped class names generated at build time", "A utility class library", "Browser support for old CSS"], c: 1, why: "Each file's class names are made unique, so styles cannot collide across components." },
        { q: "Why should a reusable component avoid setting its own outer margin?", a: ["Margins are slow", "Spacing depends on context, so the parent layout should own it", "Margins are deprecated", "It breaks dark mode"], c: 1, why: "A component with built-in margin fits only the context it was first designed in." }
      ]
    },
    {
      id: 'render', title: 'Rendering performance and accessibility', level: 3, mins: 40,
      why: "CSS decides how fast a page appears and whether everyone can use it. Experts can explain the rendering pipeline, diagnose jank and layout shift, and treat accessibility as a correctness requirement.",
      points: [
        "The pipeline: **Style → Layout → Paint → Composite**. Changing geometry (width, top, margin) triggers layout; changing colour triggers paint; `transform` and `opacity` can skip straight to composite.",
        "**Layout thrashing**: reading layout (`offsetHeight`) after writing styles in a loop forces repeated synchronous layout. Batch reads, then writes.",
        "CSS is **render-blocking**: keep it small, inline critical CSS for the first view when needed, and avoid `@import` chains.",
        "Prevent **layout shift (CLS)**: reserve space with `aspect-ratio` / dimensions, avoid inserting content above existing content, use `font-display: swap` with size-matched fallbacks.",
        "`content-visibility: auto` and `contain` let the browser skip work for off-screen or isolated subtrees.",
        "Accessibility in CSS: never remove focus outlines without a replacement (`:focus-visible`), keep contrast, honour `prefers-reduced-motion`, do not convey meaning by colour alone, and hide visually with a `.sr-only` pattern rather than `display: none` when content must stay available to screen readers."
      ],
      code: `
/* Compositor-only animation: no layout, no paint */
.drawer {
  transform: translateX(-100%);
  transition: transform 200ms ease;
  will-change: transform;                 /* a hint — use sparingly */
}
.drawer.open { transform: translateX(0); }

/* Avoid: animating geometry forces layout every frame */
/* .drawer { left: -300px; transition: left 200ms; } */

/* Reserve space to prevent layout shift */
.hero-img { aspect-ratio: 16 / 9; width: 100%; object-fit: cover; }

/* Skip rendering work for long off-screen sections */
.article-section { content-visibility: auto; contain-intrinsic-size: auto 600px; }

/* Visible, consistent keyboard focus */
:focus-visible { outline: 2px solid var(--color-action); outline-offset: 2px; }

/* Available to screen readers, invisible on screen */
.sr-only {
  position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px;
  overflow: hidden; clip-path: inset(50%); white-space: nowrap; border: 0;
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
}
`,
      practice: "Record a performance trace of an animation that changes `left`, then one that changes `transform`. Compare the Layout and Paint entries. Then tab through one of your pages with the mouse unplugged and fix every place where you lose track of focus.",
      teach: "Explain why animating `transform` is smoother than animating `left`, in terms of the rendering pipeline.",
      analogy: "Rendering a page is producing a stage play. Layout is building the set, paint is painting the scenery, composite is sliding finished panels around on rails. Animating `left` rebuilds the set every frame. Animating `transform` only slides a finished panel — the stagehands can do that sixty times a second without calling the carpenters.",
      pitfalls: [
        "`outline: none` with no replacement, making the page unusable by keyboard.",
        "`will-change` on everything, consuming memory for no gain.",
        "Images and ads without reserved dimensions, causing content to jump while loading."
      ],
      quiz: [
        { q: "Which change can be handled by the compositor alone?", a: ["`width`", "`margin-top`", "`transform`", "`font-size`"], c: 2, why: "Transforms and opacity do not require layout or paint when the element is on its own layer." },
        { q: "What most directly reduces cumulative layout shift from images?", a: ["Lazy loading", "Reserving space with dimensions or `aspect-ratio`", "Smaller file size", "A CDN"], c: 1, why: "If the browser knows the size before the image loads, nothing moves when it arrives." },
        { q: "How should content be hidden visually but kept for screen readers?", a: ["`display: none`", "`visibility: hidden`", "A visually-hidden (`.sr-only`) pattern", "`opacity: 0` on the body"], c: 2, why: "`display: none` and `visibility: hidden` remove content from the accessibility tree as well." }
      ]
    }
  ]
});
