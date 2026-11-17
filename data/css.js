TRACKS.push({
  id: 'css', name: 'CSS + Tailwind', lang: 'css',
  tagline: 'The look: the cascade, layout, responsive design, and Tailwind CSS at scale.',
  lessons: [
    // ---------------- Beginner ----------------
    {
      id: 'html', title: 'HTML essentials: structure and meaning', level: 0, mins: 30, lang: 'html',
      why: "CSS styles HTML, and React renders HTML. Picking the right element gives you keyboard support, accessibility and search-engine meaning for free; a `div` with a click handler gives you none of it.",
      points: [
        "HTML describes **what content is**, not how it looks: a heading, a paragraph, a list, a button, a navigation region.",
        "A page usually has one `<h1>`, with headings nested in order below it (`h2`, `h3`…). Screen-reader users jump between headings like a table of contents.",
        "**Landmarks** structure the page: `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>`.",
        "Use `<button>` for actions and `<a href>` for navigation. Both are focusable and work with the keyboard by default; a clickable `<div>` is neither. A plain `<div>` is fine as a layout wrapper that means nothing.",
        "Forms: every input needs a `<label>`; `type` (`email`, `number`, `date`) gives the right phone keyboard and built-in validation; `required`, `min` and `pattern` validate without JavaScript.",
        "Images need `alt` text describing their purpose (`alt=\"\"` if purely decorative), plus `width` and `height` so the page doesn't jump when they load."
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
      practice: "In the CSS playground, build a product page skeleton with semantic elements, using `div` only for wrappers that carry no meaning. Then navigate it with the Tab key alone: can you reach and use everything? Replace the button with a clickable `div` and try again.",
      teach: "Explain why you should use a `<button>` instead of a `<div>` with a click handler.",
      analogy: "HTML is the labelled floor plan of a building: this room is the kitchen, this is the entrance, this is the staircase. Paint and furniture (CSS) come later. A plan where every room is labelled 'room' can still be decorated, but nobody, least of all a visitor who can't see, can find the kitchen.",
      pitfalls: [
        "`div` and `span` for everything interactive, then re-creating focus, keyboard handling and roles by hand.",
        "Inputs with a placeholder but no label.",
        "Choosing heading levels for their font size instead of the document outline.",
        "A `<button>` inside a form without `type=\"button\"`: its default type is `submit`, so clicking it submits the form."
      ],
      quiz: [
        { q: "Which element should trigger an action such as 'Add to cart'?", a: ["`<div onclick>`", "`<button type=\"button\">`", "`<a href=\"#\">`", "`<span role=\"button\">`"], c: 1, why: "A button is focusable, works with Enter and Space, and is announced correctly. A link is for navigation, and a `span` with a role still needs `tabindex` and key handling written by hand." },
        { q: "What is the `alt` attribute for?", a: ["A tooltip shown on hover", "A text alternative describing the image, for people and tools that can't see it", "The caption shown below the image", "Keywords for search engines"], c: 1, why: "Screen readers read it, and it shows when the image fails to load." },
        { q: "How is a `<label>` connected to its input?", a: ["By being placed next to it", "`for` on the label matching the input's `id` (or by wrapping the input)", "By sharing a `class`", "With `aria-label` on the label"], c: 1, why: "The connection gives the input an accessible name and makes clicking the label focus the input." }
      ]
    },
    {
      id: 'cascade', title: 'Selectors, the cascade and specificity', level: 0, mins: 30, viz: 'specificity',
      why: "'Why isn't my style applying?' almost always has the same answer: another rule won. The cascade is the fixed set of rules that decides which one, and once you know it, CSS stops feeling random.",
      points: [
        "A rule is `selector { property: value; }`. Selectors target by element (`p`), class (`.card`), id (`#header`), attribute (`[type=email]`) or state (`:hover`, `:focus-visible`).",
        "Combinators express relationships: `nav a` (descendant), `ul > li` (direct child), `h2 + p` (next sibling).",
        "When several rules set the same property, the **cascade** picks a winner in this order: importance (`!important`), inline styles, cascade layers, **specificity**, and finally **source order** (last wins).",
        "Specificity is counted as (ids, classes, elements). One id beats any number of classes; one class beats any number of elements.",
        "`:where()` adds **zero** specificity, so `:where(.card) a` is as easy to override as `a`. `:is()` takes the specificity of its most specific argument.",
        "Some properties **inherit** from the parent (`color`, `font`, `line-height`); most layout properties (`margin`, `padding`, `border`, `width`) don't.",
        "Keep specificity low and flat: style with single classes. Every id or `!important` makes the next override harder."
      ],
      code: `
/* For this markup:
   <nav>
     <a href="/">Home</a>
     <a class="btn primary" id="buy" href="/buy">Buy</a>
     <a class="link" href="/help">Help</a>
   </nav>
*/

a { color: gray; }               /* (0,0,1): Home stays gray */
.btn { color: blue; }            /* (0,1,0) */
.btn.primary { color: green; }   /* (0,2,0): beats .btn */
#buy { color: red; }             /* (1,0,0): Buy ends up red, whatever its classes say */
.link { color: teal; }           /* (0,1,0): Help is teal. On an element with both
                                    .btn and .link, this would win by coming later */

/* State and relationship selectors */
.btn:hover { text-decoration: underline; }
.btn:focus-visible { outline: 2px solid currentColor; }
nav > a + a { margin-left: 1rem; }

/* Zero specificity: a default that anything can override */
:where(nav) a { padding: 0.25rem; }

/* Inherited by every descendant unless overridden */
body { font-family: system-ui, sans-serif; color: #1b2030; }
`,
      practice: "In the specificity visualizer, predict the winning colour before toggling each rule. Then open the CSS playground, write three conflicting rules for one button, and make each one win in turn without using `!important`.",
      teach: "Explain how the browser decides which of two conflicting CSS rules applies to an element.",
      analogy: "Specificity is a card game with a strict ranking. An id is an ace, a class is a king, an element is a numbered card, and no pile of kings beats one ace. When two players hold the same hand, whoever played last wins.",
      pitfalls: [
        "Thinking 11 classes beat 1 id. The columns never carry over into each other.",
        "Reaching for `!important` to win. It works once, then the next person needs `!important` too.",
        "Assuming every property inherits. `border` and `margin` on a parent don't pass to children."
      ],
      quiz: [
        { q: "Which selector has the highest specificity?", a: ["`.card .title`", "`#main`", "`div p span a`", "`.a.b.c`"], c: 1, why: "One id (1,0,0) outranks any number of classes or elements." },
        { q: "Two rules with identical specificity set `color`. Which wins?", a: ["The first in the file", "The one declared later", "The one with more declarations", "The one in the bigger file"], c: 1, why: "With equal importance, layer and specificity, source order decides: last wins." },
        { q: "Which property is inherited by default?", a: ["`margin`", "`border`", "`color`", "`width`"], c: 2, why: "Text properties such as `color` and `font` inherit; box properties don't." },
        { q: "What is the specificity of `:where(#main .card) a`?", a: ["(1,1,1)", "(0,0,1)", "(0,1,1)", "(1,0,1)"], c: 1, why: "Everything inside `:where()` counts as zero, so only the `a` is left." }
      ]
    },
    {
      id: 'box', title: 'The box model', level: 0, mins: 25, viz: 'boxmodel',
      why: "Every element is a rectangle. Most sizing bugs, such as a 100%-wide element that overflows its parent or a gap you can't explain, come from the box model, and they go away once you can see its four layers.",
      points: [
        "From the inside out: **content**, **padding** (space inside the border), **border**, **margin** (space outside, between elements).",
        "The default `box-sizing: content-box` means `width` sets only the content; padding and border are added on top. `border-box` makes `width` include padding and border, which is what most people expect.",
        "Start every project with `*, *::before, *::after { box-sizing: border-box; }`.",
        "`display: block` elements take the full width and stack; `inline` elements flow inside text and ignore `width` and `height`; `inline-block` flows inline but accepts sizes.",
        "Vertical margins of neighbouring blocks **collapse** into the larger one. Padding doesn't collapse, and neither do margins between flex or grid items.",
        "`overflow` controls content that doesn't fit: `visible`, `hidden`, `clip`, or `auto` (scroll only when needed)."
      ],
      code: `
*, *::before, *::after { box-sizing: border-box; }

.card {
  width: 300px;             /* the total width, because of border-box */
  padding: 16px;            /* space inside */
  border: 2px solid #ccc;
  margin: 24px auto;        /* space outside; auto centres a block horizontally */
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
      analogy: "A framed picture on a wall. The picture is the content, the white mat around it is padding, the frame is the border, and the empty wall before the next frame is margin. `border-box` means that when you say 'this is a 30 cm picture', you're measuring the outside of the frame.",
      pitfalls: [
        "`width: 100%` plus padding under `content-box`, overflowing the parent.",
        "Expecting `width` or vertical margin to work on an inline element such as `span`.",
        "Being surprised by collapsed margins and adding more margin to compensate. In a flex or grid container, use `gap` instead."
      ],
      quiz: [
        { q: "With `box-sizing: content-box`, `width: 200px; padding: 20px; border: 5px solid` renders how wide?", a: ["200px", "225px", "250px", "240px"], c: 2, why: "200 + 20×2 + 5×2 = 250px. Padding and border are added outside the content width." },
        { q: "Which sits between the content and the border?", a: ["Margin", "Padding", "Outline", "Gap"], c: 1, why: "Padding is inside the border; margin is outside it. An outline is drawn over the edge and takes no space." },
        { q: "Two stacked paragraphs have `margin-bottom: 20px` and `margin-top: 30px`. The gap is…", a: ["50px", "30px", "20px", "25px"], c: 1, why: "Neighbouring vertical margins collapse to the larger of the two." }
      ]
    },
    {
      id: 'units', title: 'Units, colour and typography', level: 0, mins: 25,
      why: "Readable text and consistent spacing do most of the work of making an interface look professional. Your choice of units also decides whether the design respects a user's font-size and zoom settings.",
      points: [
        "`px` is absolute. `rem` is relative to the root font size (16px by default) and follows the user's browser setting, so use it for font sizes and spacing.",
        "`em` is relative to the element's own font size (useful for padding that grows with the text). `%` is relative to the parent. `vw`, `vh` and `dvh` are viewport units; `ch` is the width of a character.",
        "`clamp(min, preferred, max)` gives fluid sizes with limits. For text, mix units in the middle value, `clamp(1.75rem, 1rem + 3vw, 2.5rem)`: the `rem` part keeps growing when the user zooms, which plain `vw` doesn't.",
        "Colours: hex `#3b47d6`, `rgb()`, `hsl()` (hue, saturation, lightness: easy to reason about) and `oklch()` (perceptually even, so equal steps look equal).",
        "Typography that reads well: body text 16px or more, `line-height` about 1.5, lines of 45–75 characters (`max-width: 65ch`), and a clear size scale for headings.",
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

/* Fluid heading: grows with the screen, and still grows when the user zooms */
h1 { font-size: clamp(1.75rem, 1rem + 3vw, 2.5rem); line-height: 1.2; letter-spacing: -0.02em; }
p  { max-width: 65ch; margin-block: 0 1rem; }

.button {
  font-size: 0.9rem;
  padding: 0.5em 1em;                    /* em: padding scales with the button's own text */
  border-radius: 0.5rem;
}
`,
      practice: "Set your browser's default font size to 20px and compare a page sized in `px` with one sized in `rem`. Then build a heading that is 1.5rem on a phone and 2.5rem on a wide screen with one `clamp()` and no media query. Zoom to 200% and check that it still grows.",
      teach: "Explain the difference between `px`, `em` and `rem`, and when you would choose each.",
      analogy: "`px` is a ruler measurement: 2 cm is 2 cm for everyone. `rem` is 'twice my normal handwriting size': it follows whatever size each reader chose as normal.",
      pitfalls: [
        "Setting `html { font-size: 10px }` or sizing text in `px`, which overrides the user's accessibility setting.",
        "Nesting `em` font sizes and watching text shrink or grow at each level, like a photocopy of a photocopy.",
        "Font sizes in pure `vw`, which hardly change when the user zooms.",
        "Light grey text on white that fails contrast."
      ],
      quiz: [
        { q: "The root font size is 16px. How big is `1.5rem`?", a: ["15px", "16px", "24px", "1.5px"], c: 2, why: "`rem` multiplies the root font size: 1.5 × 16 = 24px." },
        { q: "What does `clamp(1rem, 3vw, 2rem)` do?", a: ["Always uses 3vw", "Uses 3vw, but never below 1rem or above 2rem", "Uses the smallest of the three values", "Uses 3vw only on screens narrower than 2rem"], c: 1, why: "`clamp` keeps a fluid preferred value between a minimum and a maximum." },
        { q: "Minimum contrast ratio for normal body text under WCAG AA?", a: ["2:1", "3:1", "4.5:1", "7:1"], c: 2, why: "4.5:1 for normal text and 3:1 for large text; 7:1 is the stricter AAA level." }
      ]
    },
    // ---------------- Intermediate ----------------
    {
      id: 'flexbox', title: 'Flexbox: layout in one dimension', level: 1, mins: 35, viz: 'flexbox',
      why: "Navbars, toolbars, cards, centred content and form rows: most everyday layout is a single row or column of things, and flexbox handles all of it.",
      points: [
        "`display: flex` on a parent turns its children into flex items, laid out along a **main axis** (`flex-direction: row` or `column`).",
        "`justify-content` spreads items along the main axis; `align-items` aligns them on the cross axis.",
        "`gap` adds space between items without margin tricks.",
        "Items can grow and shrink: `flex: 1` means 'take an equal share of the free space'; `flex: 0 0 200px` means 'stay exactly 200px'.",
        "`flex-wrap: wrap` lets items flow onto new lines. `margin-left: auto` on one item pushes it, and everything after it, to the far end.",
        "Flex items won't shrink below their content by default; `min-width: 0` on the item lets long text shrink or truncate."
      ],
      code: `
/* Navbar: logo left, links right, vertically centred */
.nav {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 1rem;
}
.nav .spacer { margin-left: auto; }      /* pushes everything after it to the right */

/* Centring in both directions */
.hero {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
}

/* Fixed sidebar, flexible content */
.layout  { display: flex; gap: 2rem; }
.sidebar { flex: 0 0 240px; }
.content { flex: 1; min-width: 0; }      /* min-width: 0 lets long content shrink */

/* Cards that wrap onto new rows */
.cards { display: flex; flex-wrap: wrap; gap: 1rem; }
.cards > * { flex: 1 1 220px; }
`,
      practice: "In the flexbox visualizer, reproduce three layouts: items centred both ways; first item left and the rest right; equal-width columns. Write down the CSS and the Tailwind classes for each.",
      teach: "Explain the main axis and the cross axis, and which property controls alignment on each.",
      analogy: "Flexbox is arranging books on one shelf. `justify-content` decides how they're spread along the shelf: pushed left, centred, or spaced evenly. `align-items` decides whether short books sit at the bottom, the top, or the middle. `flex-direction: column` stands the shelf on its end, and the two properties swap what they mean on screen.",
      pitfalls: [
        "Mixing up `justify-content` and `align-items` after changing `flex-direction` to `column`.",
        "Long text or a wide table blowing out a flex layout. Fix it with `min-width: 0` on the item.",
        "Using flexbox for a true two-dimensional grid and fighting it with fixed widths."
      ],
      quiz: [
        { q: "With `flex-direction: row`, which property centres items vertically?", a: ["`justify-content`", "`align-items`", "`text-align`", "`vertical-align`"], c: 1, why: "In a row, the cross axis is vertical, and `align-items` controls the cross axis." },
        { q: "What does `flex: 1` on every child do?", a: ["Sets each child's width to 1fr", "Gives each child an equal share of the free space", "Makes each child 100% wide", "Stops the children from shrinking"], c: 1, why: "It sets grow to 1 with a zero basis, so the free space is divided equally." },
        { q: "In a flex row, how do you push only the last item to the far right?", a: ["`float: right` on that item", "`margin-left: auto` on that item", "`justify-content: flex-end` on the container", "`position: absolute` on that item"], c: 1, why: "An auto margin absorbs all the free space on that side. `justify-content: flex-end` would move every item to the right." }
      ]
    },
    {
      id: 'grid', title: 'CSS Grid: layout in two dimensions', level: 1, mins: 35, viz: 'grid',
      why: "Page shells, dashboards, galleries, and any design whose rows and columns must line up belong to Grid. Together with flexbox, it covers almost every layout without hacks.",
      points: [
        "`display: grid` plus `grid-template-columns` defines the column tracks; rows are created automatically as items flow in.",
        "The `fr` unit is a share of the leftover space: `1fr 2fr` splits it one-third and two-thirds.",
        "`repeat(3, 1fr)` is three equal columns. `repeat(auto-fit, minmax(min(220px, 100%), 1fr))` is a responsive grid with no media queries; the `min()` stops it overflowing a container narrower than 220px.",
        "Items can span tracks: `grid-column: span 2`, or `grid-column: 1 / -1` for the full width.",
        "`grid-template-areas` names regions, so the layout reads like a picture of the page.",
        "Rule of thumb: **Grid for the page and anything two-dimensional, flexbox for the contents of each cell.**"
      ],
      code: `
/* Responsive card gallery, no media queries */
.gallery {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(220px, 100%), 1fr));
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
  min-height: 100dvh;           /* dvh: the visible height on phones, unlike 100vh */
}
.app > nav    { grid-area: nav; }
.app > header { grid-area: header; }
.app > main   { grid-area: main; }
.app > footer { grid-area: footer; }

/* Centring with grid: two declarations */
.center { display: grid; place-items: center; }
`,
      practice: "In the grid visualizer, switch between the templates and resize the window while `auto-fit` is selected. Then build this app's own layout (sidebar + main) with `grid-template-areas` in the CSS playground, and make it fall back to one column on a phone.",
      teach: "Explain when to choose Grid and when to choose flexbox, with one example of each.",
      analogy: "Flexbox is a shelf; Grid is a sheet of graph paper. On graph paper you decide the columns and rows first, then place things into cells, and everything lines up both across and down.",
      pitfalls: [
        "Using `auto-fill` when you want `auto-fit`: `auto-fill` keeps empty tracks, so a few items don't stretch to fill the row.",
        "`minmax(220px, 1fr)` without `min()`, which overflows a container narrower than 220px.",
        "Hard-coding column counts per breakpoint when `minmax()` would adapt on its own.",
        "`1fr` columns overflowing with long content. Use `minmax(0, 1fr)`."
      ],
      quiz: [
        { q: "What does `grid-template-columns: 1fr 3fr` create?", a: ["Two equal columns", "Two columns sharing the free space 1:3", "Four columns", "One column of three rows"], c: 1, why: "`fr` units divide the available space proportionally." },
        { q: "Which declaration gives a responsive grid without media queries?", a: ["`repeat(3, 1fr)`", "`repeat(auto-fit, minmax(min(200px, 100%), 1fr))`", "`200px 200px 200px`", "`grid-auto-flow: column`"], c: 1, why: "The browser fits as many columns of at least 200px as it can and stretches them; `min()` handles containers narrower than that." },
        { q: "How do you make a grid item span the full width?", a: ["`width: 100vw`", "`grid-column: 1 / -1`", "`grid-column: span all`", "`justify-self: stretch`"], c: 1, why: "Line 1 to line -1 covers every column track. `span all` isn't valid CSS." }
      ]
    },
    {
      id: 'responsive', title: 'Responsive design', level: 1, mins: 35,
      why: "Most web traffic comes from phones. A layout that only works at the designer's screen width is broken for most of your users.",
      points: [
        "Include the viewport meta tag, or phones render the page zoomed out: `<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">`.",
        "**Mobile-first**: write the base styles for small screens, then add complexity with `@media (min-width: …)`, or the newer range syntax `@media (width >= 768px)`.",
        "Prefer **intrinsic** layouts that adapt on their own (flex-wrap, `auto-fit` grids, `clamp()`, `max-width`), and add breakpoints only where the design actually breaks.",
        "Images: `max-width: 100%; height: auto;`, plus `width`/`height` attributes or `aspect-ratio`, so nothing shifts while they load.",
        "**Container queries** (`@container`) style a component by the width of its container instead of the viewport, which is what a reusable component usually needs.",
        "Respect user preferences: `prefers-color-scheme`, `hover`, `pointer`, and `prefers-reduced-motion`. Write motion inside `@media (prefers-reduced-motion: no-preference)`, so it's only added for people who haven't asked for less."
      ],
      code: `
/* Mobile first: one column by default */
.page { display: grid; gap: 1rem; padding: 1rem; }

/* Wider screens add the sidebar */
@media (width >= 768px) {
  .page { grid-template-columns: 240px 1fr; padding: 2rem; }
}

img, video { max-width: 100%; height: auto; }
.thumb { aspect-ratio: 16 / 9; object-fit: cover; }

/* Container query: the card adapts to the space it's given */
.card-wrap { container-type: inline-size; }
.card { display: grid; gap: 0.75rem; }
@container (min-width: 420px) {
  .card { grid-template-columns: 120px 1fr; }
}

/* Hover effects only where there is a real hover */
@media (hover: hover) {
  .card:hover { box-shadow: 0 4px 16px rgb(0 0 0 / 0.12); }
}

/* Motion is opt-in: only for people who haven't asked for less */
@media (prefers-reduced-motion: no-preference) {
  .card { transition: box-shadow 200ms ease; }
}
`,
      practice: "Take a desktop-only page and make it work at 360px wide without horizontal scrolling. Count the media queries you needed, then try to remove one by replacing it with an intrinsic technique.",
      teach: "Explain what 'mobile-first' means in CSS and why `min-width` media queries are preferred over `max-width`.",
      analogy: "Mobile-first is packing a carry-on first: you start with only what's essential, and if you get a bigger suitcase later you add extras. Starting with the big suitcase and squeezing it into a carry-on means painful decisions about what to throw out.",
      pitfalls: [
        "Forgetting the viewport meta tag.",
        "Designing for three exact device widths instead of letting the content decide the breakpoints.",
        "Hiding content on mobile rather than reorganizing it.",
        "Adding motion everywhere and then trying to remove it for reduced-motion users with `!important`. Add it only where it's wanted instead."
      ],
      quiz: [
        { q: "In a mobile-first stylesheet, the base styles target…", a: ["Desktop screens", "Small screens, with `min-width` queries adding layout for larger ones", "Tablets, with queries both ways", "Print"], c: 1, why: "Start simple and enhance upward; larger layouts are opt-in." },
        { q: "What is a container query based on?", a: ["The viewport width", "The size of the element's container", "The device pixel ratio", "The user's font size"], c: 1, why: "Components respond to the space they're placed in, wherever that is." },
        { q: "Which rule keeps images from overflowing their parent?", a: ["`width: 100vw`", "`max-width: 100%; height: auto`", "`overflow: hidden` on the image", "`object-fit: contain`"], c: 1, why: "The image may shrink to fit but never exceeds its container, and keeps its proportions." }
      ]
    },
    // ---------------- Advanced ----------------
    {
      id: 'position', title: 'Positioning and stacking contexts', level: 2, mins: 30,
      why: "Modals, dropdowns, sticky headers, tooltips and badges all depend on positioning. 'Why does `z-index: 9999` do nothing?' has a precise answer, and knowing it saves hours.",
      points: [
        "`position: static` is the normal flow. `relative` keeps the element's space and lets you nudge it, and makes it the reference point for absolutely positioned children.",
        "`absolute` takes the element out of the flow and positions it against the nearest **positioned ancestor**.",
        "`fixed` positions against the viewport, **unless** an ancestor has a `transform`, `filter` or `will-change: transform`: then it's fixed to that ancestor instead. `sticky` scrolls normally until it reaches an offset, then sticks inside its scroll container.",
        "`z-index` only applies to positioned elements and flex/grid items, and only orders elements **within the same stacking context**.",
        "A new stacking context is created by a positioned element with a `z-index`, and also by `opacity` below 1, `transform`, `filter`, `isolation: isolate` and more. A child can never rise above its parent's context.",
        "Modern overlays: the `<dialog>` element and the Popover API render in the **top layer**, above everything, with no `z-index` and no stacking-context traps. In React, a portal is the other way out."
      ],
      code: `
/* Badge on the corner of a card */
.card  { position: relative; }
.badge { position: absolute; top: -0.5rem; right: -0.5rem; }

/* Sticky header: sticks at the top of its scroll container */
.header { position: sticky; top: 0; z-index: 10; background: white; }

/* The classic bug: a "full-screen" modal inside a transformed parent */
.sidebar { transform: translateX(0); }       /* a stacking context AND a containing block */
.sidebar .modal { position: fixed; inset: 0; z-index: 9999; }
/* 1. The modal is trapped in .sidebar's stacking context, so the header (z-index 10) covers it.
   2. 'fixed' is now relative to .sidebar, not the viewport: the modal is only sidebar-sized.
   Fix: render the modal outside .sidebar (a React portal), or use <dialog> or popover. */

/* A deliberate, contained stacking context */
.widget { isolation: isolate; }              /* z-indexes inside can't leak out */

/* Full-screen overlay */
.overlay { position: fixed; inset: 0; background: rgb(0 0 0 / 0.5); }
`,
      practice: "Reproduce the bug: put a `position: fixed; inset: 0; z-index: 9999` element inside a parent with `transform`, next to a sticky header with `z-index: 10`. Explain both things that go wrong, then fix it two different ways.",
      teach: "Explain why an element with `z-index: 9999` can still appear behind an element with `z-index: 2`.",
      analogy: "Stacking contexts are folders of transparent sheets. Inside one folder you can reorder the sheets freely with `z-index`. But the folders are stacked too, and a sheet in the bottom folder can never rise above the folder on top, however high its number is inside its own folder.",
      pitfalls: [
        "Raising z-index numbers instead of finding the ancestor that created a stacking context.",
        "`position: absolute` with no positioned ancestor, so the element flies to the corner of the page.",
        "`position: sticky` failing because an ancestor has `overflow: hidden` and has become the scroll container.",
        "A `position: fixed` element that stops being fixed because an ancestor gained a `transform`, for example from an animation library."
      ],
      quiz: [
        { q: "An absolutely positioned element is placed relative to…", a: ["The viewport, always", "Its nearest positioned ancestor", "Its parent element, always", "The `<body>`, always"], c: 1, why: "It uses the closest ancestor whose position isn't `static`, and falls back to the initial containing block." },
        { q: "Which of these creates a new stacking context?", a: ["`color: red`", "`transform: translateX(0)`", "`margin: 0`", "`display: block`"], c: 1, why: "Transforms, opacity below 1, filters and `isolation: isolate` all create stacking contexts." },
        { q: "Why might `z-index` have no effect on an element?", a: ["The number is larger than the browser allows", "The element isn't positioned, and isn't a flex or grid item", "Its parent has `overflow: hidden`", "Negative values are ignored"], c: 1, why: "`z-index` is ignored on static elements that aren't flex or grid items." },
        { q: "A `position: fixed` element suddenly scrolls with the page. Most likely cause?", a: ["A missing `z-index`", "An ancestor now has a `transform`, so `fixed` is relative to it", "The page uses flexbox", "The viewport meta tag is missing"], c: 1, why: "A transformed (or filtered) ancestor becomes the containing block for fixed descendants." }
      ]
    },
    {
      id: 'modern', title: 'Custom properties, theming and modern CSS', level: 2, mins: 35,
      why: "Design tokens, dark mode and component variants are built on custom properties. Modern CSS also does most of what preprocessors used to be needed for, so knowing it keeps your toolchain small.",
      points: [
        "**Custom properties** (`--brand: #3b47d6`) are variables that cascade and inherit, read with `var(--brand, fallback)`. Unlike Sass variables, they live on in the browser and can change at run time.",
        "Define **design tokens** on `:root` (colours, spacing, radii) and use them everywhere. Changing the theme then means redefining the tokens.",
        "Dark mode with a manual toggle needs three cases: follow the system when the user hasn't chosen, and obey `data-theme=\"light\"` or `data-theme=\"dark\"` when they have. The media query must skip pages where the user picked light.",
        "`color-scheme: light dark` makes form controls and scrollbars match the theme too. `light-dark(#fff, #0e1117)` picks a value based on it, a compact alternative for simple themes.",
        "Native **nesting** (`.card { &:hover { … } }`) and `:is()` / `:where()` shorten selectors.",
        "`:has()` is the parent selector: `.field:has(input:user-invalid)` styles a wrapper based on what's inside it.",
        "Transitions animate property changes; animate `transform` and `opacity` where you can."
      ],
      code: `
:root {
  color-scheme: light dark;              /* form controls and scrollbars follow the theme */
  --bg: #ffffff;
  --text: #1b2030;
  --accent: #3b47d6;
  --radius: 0.5rem;
  --space: 1rem;
}

/* 1. System is dark and the user hasn't chosen light */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) { --bg: #0e1117; --text: #e7eaf0; --accent: #8b95ff; }
}
/* 2. The user chose dark, whatever the system says */
:root[data-theme="dark"] { --bg: #0e1117; --text: #e7eaf0; --accent: #8b95ff; }
/* 3. The user chose light: the defaults above already apply, and rule 1 skips them */
:root[data-theme="light"] { color-scheme: light; }
:root[data-theme="dark"] { color-scheme: dark; }

body { background: var(--bg); color: var(--text); }

.button {
  --btn-bg: var(--accent);               /* component-level token */
  background: var(--btn-bg);
  color: white;
  border-radius: var(--radius);
  padding: calc(var(--space) / 2) var(--space);

  &:hover  { transform: translateY(-1px); }
  &:active { opacity: 0.85; }
  &.danger { --btn-bg: #c0362c; }        /* a variant only changes the token */
}

@media (prefers-reduced-motion: no-preference) {
  .button { transition: transform 150ms ease, opacity 150ms ease; }
}

/* Parent selector: style the field wrapper once its input is invalid */
.field:has(input:user-invalid) { color: #c0362c; }
`,
      practice: "Build a theme toggle with three states: system, light and dark. It sets `data-theme` on `<html>` (or removes it for 'system') and remembers the choice. Test all six combinations of system setting and choice. Then add a high-contrast theme by redefining only tokens; no component rule should mention a raw colour.",
      teach: "Explain how CSS custom properties make dark mode possible without rewriting every component's styles.",
      analogy: "Custom properties are the paint colours named on a decorator's chart: 'wall', 'trim', 'accent'. Every room's instructions say 'paint the trim in trim'. To redecorate the whole house, you change three entries on the chart, not the instructions for every room.",
      pitfalls: [
        "Hard-coded colours scattered through components, turning a theme change into find-and-replace.",
        "A dark-mode media query that ignores the user's choice, so 'light' can't be picked on a dark system.",
        "Forgetting `color-scheme`, leaving white form fields and scrollbars on a dark page.",
        "Animating `width`, `height` or `top`, which forces layout on every frame."
      ],
      quiz: [
        { q: "How do custom properties differ from Sass variables?", a: ["They're faster to type", "They exist in the browser, cascade and inherit, and can change per element or media query", "They can only hold colours", "They need a build step"], c: 1, why: "Sass variables are compiled away; custom properties are live values in the browser." },
        { q: "What does `.card:has(img)` select?", a: ["Images inside cards", "Cards that contain an image", "Cards without images", "The first image in each card"], c: 1, why: "`:has()` selects an element based on its descendants." },
        { q: "The system is dark, the user picks light, and the page stays dark. Most likely cause?", a: ["The browser cached the old CSS", "The `prefers-color-scheme: dark` rule doesn't exclude `[data-theme=\"light\"]`", "`color-scheme` is missing", "Custom properties can't be changed after load"], c: 1, why: "The media query still applies the dark tokens. Guard it with `:root:not([data-theme=\"light\"])`." },
        { q: "Which properties are cheapest to animate?", a: ["`width` and `height`", "`transform` and `opacity`", "`margin` and `padding`", "`top` and `left`"], c: 1, why: "The compositor can handle them without layout or paint." }
      ]
    },
    {
      id: 'tailwind', title: 'Tailwind CSS: utility-first fundamentals', level: 2, mins: 40, lang: 'html',
      why: "Tailwind is one of the most common ways to style React apps today. It replaces naming things and maintaining stylesheets with small composable classes, and every class is plain CSS you already understand.",
      points: [
        "**Utility-first**: each class does one thing (`p-4`, `flex`, `text-lg`, `bg-blue-600`). You compose them in the markup instead of inventing class names and writing separate CSS.",
        "Values come from a **design scale**: spacing (`p-4` = 1rem, in steps of 0.25rem), type `text-sm`…`text-4xl`, colours `slate-50`…`slate-950`. Constraints produce consistency. In v4 any spacing number works (`p-13`) without configuration.",
        "**Variants** prefix a utility with a condition: `hover:`, `focus-visible:`, `disabled:`, `dark:`, and breakpoints `sm:` `md:` `lg:` (mobile-first, min-width).",
        "Layout maps one-to-one to what you know: `flex items-center justify-between gap-4`, `grid grid-cols-3`, `absolute inset-0`.",
        "Escape hatches: arbitrary values `w-[37rem]`, `bg-[#1da1f2]`, and arbitrary variants. Use them sparingly; prefer the scale.",
        "Tailwind scans your files and generates **only the classes you use**, so the CSS stays small. Component libraries such as Bootstrap work the other way round: pre-styled components that you then override."
      ],
      code: `
<!-- A responsive product card -->
<article class="mx-auto max-w-sm overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm
                transition hover:shadow-md dark:border-slate-700 dark:bg-slate-900">
  <img class="aspect-video w-full object-cover" src="laptop.jpg" alt="Laptop on a desk" width="640" height="360">

  <div class="space-y-3 p-4 md:p-6">
    <div class="flex items-center justify-between gap-4">
      <h2 class="text-lg font-semibold text-slate-900 dark:text-white">Laptop Pro</h2>
      <span class="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800">In stock</span>
    </div>

    <p class="text-sm leading-6 text-slate-600 dark:text-slate-300">
      14-inch display, 16 GB memory, all-day battery.
    </p>

    <button type="button"
            class="w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white
                   hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2
                   focus-visible:outline-indigo-600 disabled:opacity-50">
      Add to cart
    </button>
  </div>
</article>

<!-- Responsive grid: 1 column on phones, 2 from md, 3 from lg -->
<div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
  <article class="rounded-xl border border-slate-200 p-4">One</article>
  <article class="rounded-xl border border-slate-200 p-4">Two</article>
  <article class="rounded-xl border border-slate-200 p-4">Three</article>
</div>
`,
      practice: "Open the CSS playground, switch on Tailwind, and rebuild the card from memory. Then translate five of its classes back into the plain CSS they generate. If you can't, revisit that CSS lesson.",
      teach: "Explain what 'utility-first' means and answer the common objection: 'isn't this just inline styles?'",
      analogy: "Traditional CSS is ordering custom furniture: name each piece, describe it, wait for it to be built. Tailwind is a box of standard building bricks in fixed sizes and colours: you snap together what you need on the spot, and because everyone uses the same bricks, everything in the house matches.",
      pitfalls: [
        "Learning Tailwind instead of CSS. Every utility is a CSS declaration; without the fundamentals you can't debug it.",
        "Building class names dynamically (`'text-' + color + '-500'`). Tailwind only finds complete class names written in your source.",
        "Calling it 'inline styles'. Utilities support hover, focus, breakpoints and dark mode, and draw from a constrained scale; inline styles do none of that.",
        "Writing your own CSS outside a cascade layer in a Tailwind v4 project: it beats every Tailwind utility, whatever the specificity. The architecture lesson explains why."
      ],
      quiz: [
        { q: "What does `md:grid-cols-2` mean?", a: ["Two columns only on medium screens", "Two columns from the `md` breakpoint upward", "Two columns below `md`", "Medium-sized columns"], c: 1, why: "Breakpoint variants are mobile-first `min-width` queries: they apply at that width and wider." },
        { q: "Why does Tailwind's CSS stay small in production?", a: ["It ships a fixed, pre-minified stylesheet", "Only the classes found in your source files are generated", "It removes unused classes in the browser at run time", "It uses inline styles"], c: 1, why: "Tailwind scans your source and generates just the utilities you actually use." },
        { q: "Why does `className={'bg-' + color + '-500'}` often not work?", a: ["React forbids string concatenation in `className`", "Tailwind can't see the full class name in the source, so it never generates it", "Colours need hex values", "Template strings are slow"], c: 1, why: "Classes are detected as whole strings at build time; map values to complete class names instead." }
      ]
    },
    {
      id: 'twreact', title: 'Tailwind in React: components, variants and theming', level: 2, mins: 40, lang: 'tsx',
      why: "Utilities in markup only scale if you remove repetition the right way. In a React codebase the unit of reuse is the component, not a CSS class, and typed variants turn a design system into an API that the compiler checks.",
      points: [
        "Remove duplication by extracting **components**, not by reaching for `@apply`. A `<Button>` owns its classes once.",
        "Setup with Vite: install `tailwindcss` and `@tailwindcss/vite`, add the plugin, and write `@import \"tailwindcss\";` in your CSS entry file.",
        "Customize the design system in CSS with `@theme`: defining `--color-brand-500` creates `bg-brand-500`, `text-brand-500` and so on.",
        "Merge classes safely with `clsx` + `tailwind-merge` (the common `cn()` helper), so a caller's `className` can override the defaults without conflicts.",
        "Model variants (size, intent) as typed props, by hand with a lookup object or with `class-variance-authority`. An invalid variant becomes a compile error.",
        "A button component should default to `type=\"button\"`. The HTML default is `submit`, so without it every button inside a form submits the form.",
        "Style state without JavaScript: `group-hover:`, `peer-invalid:`, `data-[state=open]:`, `aria-expanded:`. Dark mode uses `dark:`; switch it to a class or attribute with `@custom-variant` for a manual toggle."
      ],
      code: `
// vite.config.ts:  plugins: [react(), tailwindcss()]   (tailwindcss from "@tailwindcss/vite")
//
// app.css
//   @import "tailwindcss";
//   @theme {
//     --color-brand-500: oklch(55% 0.2 270);
//     --color-brand-600: oklch(48% 0.2 270);
//   }
//   @custom-variant dark (&:where([data-theme=dark], [data-theme=dark] *));

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

export function Button({ intent = "primary", size = "md", type = "button", className, ...props }: ButtonProps) {
  return (
    <button
      type={type}                       // "button" unless the caller asks for "submit"
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition",
        "focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50",
        intents[intent], sizes[size], className)}
      {...props}
    />
  );
}

// <Button intent="danger" size="lg" className="w-full">Delete</Button>
// <Button type="submit">Save</Button>
// <Button intent="purple" />   // compile error: not a valid intent
`,
      practice: "Build `Button`, `Input` and `Card` components with typed variants in a Vite + React + Tailwind project. Add a brand colour through `@theme` and a dark-mode toggle that sets `data-theme` on `<html>`. Put a `Button` inside a form and check that clicking it doesn't submit. No page file should contain more than layout utilities.",
      teach: "Explain why, in a React + Tailwind project, you extract a component rather than a CSS class to avoid repeating utilities.",
      analogy: "A component is a rubber stamp that already carries its ink. You don't hand everyone a list of twelve ink colours and hope they mix them the same way each time; you hand them the stamp. Variants are the dial on the stamp: small, medium, large; primary, danger.",
      pitfalls: [
        "Overusing `@apply` and rebuilding the stylesheet architecture Tailwind was meant to remove.",
        "Joining class strings so that `px-2 px-4` both apply and the result depends on CSS order. Merge them with `tailwind-merge`.",
        "Variants as free-form strings instead of a typed union.",
        "A `Button` component without a default `type`, which submits any form it's placed in."
      ],
      quiz: [
        { q: "What does defining `--color-brand-500` inside `@theme` do?", a: ["Nothing until you write CSS that uses it", "Generates utilities such as `bg-brand-500` and `text-brand-500`", "Replaces every built-in colour", "Creates a React component"], c: 1, why: "Theme variables are design tokens that decide which utility classes exist." },
        { q: "What problem does `tailwind-merge` solve?", a: ["Bundle size", "Conflicting utilities such as `px-2 px-4`: it keeps the last one", "Missing dark mode", "Slow builds"], c: 1, why: "It resolves conflicts, so a caller's `className` can reliably override the defaults." },
        { q: "A reusable `<Button>` is placed inside a `<form>`. Clicking it submits the form. Why?", a: ["React submits forms on every click", "Its `type` defaults to `submit` unless set", "`tailwind-merge` removed the type", "The form has no `action`"], c: 1, why: "HTML buttons are `type=\"submit\"` by default; the component should default to `\"button\"`." },
        { q: "Preferred way to reuse a set of utilities across a React app?", a: ["Copy and paste", "`@apply` in a global stylesheet", "Extract a component", "Inline `style` objects"], c: 2, why: "The component is the unit of reuse; it bundles structure, behavior and classes together." }
      ]
    },
    // ---------------- Expert ----------------
    {
      id: 'arch', title: 'CSS architecture and design systems', level: 3, mins: 40,
      why: "CSS is global by default, so it decays faster than other code as a team grows. The job is to choose a way of scoping it on purpose, and to be able to say why you rejected the alternatives.",
      points: [
        "The core problem is **global scope + specificity + source order**: any rule can affect any element, and overrides pile up.",
        "Scoping strategies: naming conventions (**BEM**: `.card__title--large`), **CSS Modules** (unique class names generated at build time), **utility-first** (Tailwind), CSS-in-JS, and native **`@scope`**.",
        "**Cascade layers** (`@layer reset, base, components, utilities;`) make precedence explicit: a later layer beats an earlier one regardless of specificity.",
        "CSS written **outside any layer beats every layer**. Tailwind v4 puts its own styles in layers (`theme`, `base`, `components`, `utilities`), so plain CSS you write outside a layer silently overrides Tailwind utilities. Put your own CSS in a layer too.",
        "A **design system** is tokens (colour, space, type, radius) → primitives (Button, Input) → patterns. Tokens come in tiers: raw values, semantic aliases (`--color-danger`), component tokens.",
        "Components shouldn't set their own outer margin; the parent layout owns spacing (with `gap`). That keeps components reusable anywhere.",
        "Trade-offs: utility-first gives speed and a small CSS bundle but busy markup; CSS Modules give plain CSS and isolation but more files and naming; runtime CSS-in-JS costs performance and doesn't suit React Server Components."
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

  /* Layout owns spacing; components have no outer margin */
  .stack { display: grid; gap: var(--space-4); }
}

@layer utilities {
  .hidden { display: none; }                 /* beats #app .card in components: later layer */
}

/* Careful: a rule outside every layer beats ALL of the layers above.
   This unlayered rule would override .hidden on any .card:
   .card { display: block; }                                        */

/* Native scoping: styles apply inside .card, but stop at nested .card-slot content */
@scope (.card) to (.card-slot) {
  img { border-radius: 0.5rem; }
}
`,
      practice: "Audit a stylesheet you know: count `!important`, find the highest-specificity selector, and list every raw colour value. Then write a one-page proposal for scoping and tokens for a five-person team, naming the alternative you rejected and why.",
      teach: "Explain how cascade layers settle precedence, using a utility class that must override a component style, and why unlayered CSS beats them all.",
      analogy: "Without layers, CSS precedence is a shouting match: whoever is loudest (most specific) wins, so everyone keeps raising their voice. Cascade layers are an agreed speaking order in a meeting: the chair always has the final word, however quietly they speak.",
      pitfalls: [
        "Mixing three scoping strategies in one codebase with no rule for which applies where.",
        "Tokens named after their values (`--blue`) instead of their purpose (`--color-action`), which makes a rebrand painful.",
        "Components that carry outer margins and break in every new context.",
        "Unlayered CSS in a Tailwind v4 project, quietly beating the utilities."
      ],
      quiz: [
        { q: "With `@layer components, utilities;` which rule wins: `#app .btn` in `components` or `.hidden` in `utilities`?", a: ["`#app .btn`: higher specificity", "`.hidden`: the later layer wins regardless of specificity", "Whichever is later in the file", "Neither"], c: 1, why: "Layer order is compared before specificity." },
        { q: "`.hidden { display: none }` is in `@layer utilities`; `.card { display: block }` is in no layer. On `<div class=\"card hidden\">`, which wins?", a: ["`.hidden`: utilities is the last layer", "`.card`: unlayered styles beat every layer", "Whichever comes later in the file", "Neither applies"], c: 1, why: "Normal declarations outside any layer outrank all layered ones. That's why plain CSS can override Tailwind v4 utilities." },
        { q: "What do CSS Modules provide?", a: ["Runtime theming", "Locally scoped class names generated at build time", "A utility class library", "Native `@scope` support in older browsers"], c: 1, why: "Each file's class names are made unique, so styles can't collide across components." },
        { q: "Why should a reusable component avoid setting its own outer margin?", a: ["Margins are slow to render", "Spacing depends on context, so the parent layout should own it", "Margins don't work inside grid", "It breaks dark mode"], c: 1, why: "A component with built-in margin fits only the context it was first designed for." }
      ]
    },
    {
      id: 'render', title: 'Rendering performance and accessibility', level: 3, mins: 40,
      why: "CSS decides how fast a page appears and whether everyone can use it. That means understanding the rendering pipeline well enough to find jank and layout shift, and treating accessibility as part of correctness.",
      points: [
        "The pipeline: **Style → Layout → Paint → Composite**. Changing geometry (`width`, `top`, `margin`) triggers layout; changing colour triggers paint; `transform` and `opacity` can skip straight to composite.",
        "**Layout thrashing**: reading layout (`offsetHeight`) after writing styles, in a loop, forces repeated synchronous layout. Batch the reads, then the writes.",
        "CSS is **render-blocking**: keep it small, inline the critical CSS for the first screen when needed, and avoid `@import` chains.",
        "Prevent **layout shift (CLS)**: reserve space with dimensions or `aspect-ratio`, don't insert content above what's already shown, and use `font-display: swap` with size-matched fallback fonts.",
        "`content-visibility: auto` and `contain` let the browser skip work for off-screen or isolated parts of the page.",
        "Accessibility in CSS: never remove focus outlines without a replacement (`:focus-visible`), keep contrast, don't carry meaning by colour alone, and hide things visually with an `.sr-only` pattern rather than `display: none` when screen readers should still find them.",
        "Reduced motion: add motion only under `prefers-reduced-motion: no-preference`, as the responsive lesson shows. If you also need a safety net for third-party CSS, shorten durations to `0.01ms` rather than setting `none`, so JavaScript waiting for `transitionend` still gets the event."
      ],
      code: `
/* Compositor-only animation: no layout, no paint */
.drawer {
  transform: translateX(-100%);
  will-change: transform;                 /* a hint for elements that really animate */
}
.drawer.open { transform: translateX(0); }

@media (prefers-reduced-motion: no-preference) {
  .drawer { transition: transform 200ms ease; }
}

/* Avoid: animating geometry forces layout on every frame */
/* .drawer { left: -300px; transition: left 200ms; } */

/* Reserve space to prevent layout shift */
.hero-img { aspect-ratio: 16 / 9; width: 100%; object-fit: cover; }

/* Skip rendering work for long off-screen sections */
.article-section { content-visibility: auto; contain-intrinsic-size: auto 600px; }

/* Visible, consistent keyboard focus */
:focus-visible { outline: 2px solid var(--color-action, #3b47d6); outline-offset: 2px; }

/* Available to screen readers, invisible on screen */
.sr-only {
  position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px;
  overflow: hidden; clip-path: inset(50%); white-space: nowrap; border: 0;
}

/* Safety net for animations you don't control: near-zero, not "none" */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
`,
      practice: "Record a performance trace of an animation that changes `left`, then one that changes `transform`, and compare the Layout and Paint entries. Then tab through one of your pages without touching the mouse, and fix every place where you lose track of focus.",
      teach: "Explain why animating `transform` is smoother than animating `left`, in terms of the rendering pipeline.",
      analogy: "Rendering a page is putting on a play. Layout is building the set, paint is painting the scenery, composite is sliding finished panels around on rails. Animating `left` rebuilds the set every frame; animating `transform` only slides a finished panel, which the stagehands can do sixty times a second without calling the carpenters.",
      pitfalls: [
        "`outline: none` with no replacement, which makes the page unusable by keyboard.",
        "`will-change` on everything, using memory for no gain.",
        "Images and ads without reserved space, so content jumps while they load.",
        "`transition: none !important` for reduced motion, which breaks code waiting for `transitionend`."
      ],
      quiz: [
        { q: "Which change can be handled by the compositor alone?", a: ["`width`", "`margin-top`", "`transform`", "`font-size`"], c: 2, why: "Transforms and opacity don't require layout or paint when the element is on its own layer." },
        { q: "What most directly reduces layout shift from images?", a: ["Lazy loading", "Reserving space with dimensions or `aspect-ratio`", "Smaller files", "Serving them from a CDN"], c: 1, why: "If the browser knows the size before the image loads, nothing moves when it arrives." },
        { q: "How should content be hidden visually but kept for screen readers?", a: ["`display: none`", "`visibility: hidden`", "A visually-hidden (`.sr-only`) pattern", "`aria-hidden=\"true\"`"], c: 2, why: "`display: none`, `visibility: hidden` and `aria-hidden` all remove the content from what screen readers announce." }
      ]
    }
  ]
});
