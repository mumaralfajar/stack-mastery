// @ts-check
export const track = {
  id: 'css', name: 'CSS + Tailwind', lang: 'css',
  tagline: 'Visual styling: the cascade, layout systems, responsive design, and Tailwind CSS.',
  lessons: [
    // ---------------- Beginner ----------------
    {
      id: 'html', title: 'HTML essentials: structure and meaning', level: 0, mins: 30, lang: 'html',
      splits: [["1 · Document & Nav","<!doctype html>"],["2 · Main & Product Card","<main>"],["3 · Form & Footer","<form action=\"/subscribe\""]],
      terms: [
        ['Semantic landmarks', 'Elements like `<header>`, `<nav>`, `<main>`, and `<article>` that tell screen readers how the page is structured.'],
        ['`<button>` vs `<a>`', 'Use `<a href="...">` to navigate between URLs, and use `<button type="button">` for actions right on the page.'],
        ['`<label for="id">`', 'Links a visible text label to a form input so screen readers announce it and clicking focuses the field.']
      ],
      why: "CSS styles HTML, and React renders HTML. Using semantic tags gives you keyboard focus, screen-reader meaning, and better SEO for free, while a clickable `div` gives you none of that.",
      points: [
        "HTML defines **what content means**, not its layout: headings, paragraphs, lists, buttons, and landmarks.",
        "Keep one `<h1>` per page with nested `<h2>` and `<h3>` headings underneath. Screen readers jump between headings like a table of contents.",
        "**Landmarks** carve up the page into `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, and `<footer>`.",
        "Use `<button>` for actions and `<a href>` for links. Both get keyboard focus out of the box, whereas a clickable `<div>` doesn't. Keep `<div>` for pure layout wrappers.",
        "Always pair inputs with `<label>`. Setting `type` (`email`, `number`, `date`) picks the phone keypad, while `required`, `min`, and `pattern` validate inputs before JavaScript runs.",
        "Give content images helpful `alt` text (`alt=\"\"` for decorative images), plus `width` and `height` so images don't shift text as they load."
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
      analogy: "HTML works like a labelled building floor plan: this room is the kitchen, that's the front hall, here are the stairs. CSS adds paint and furniture later. If every room only says 'room', a visitor who can't see will never find the kitchen.",
      pitfalls: [
        "`div` and `span` for everything interactive, then re-creating focus, keyboard handling and roles by hand.",
        "Inputs with a placeholder but no label.",
        "Choosing heading levels for their font size instead of the document outline.",
        "A `<button>` inside a form without `type=\"button\"`: its default type is `submit`, so clicking it submits the form."
      ],
      quiz: [
        { id: 'element-trigger-action-such', q: "Which element should trigger an action such as 'Add to cart'?", a: ["`<div onclick>`", "`<button type=\"button\">`", "`<a href=\"#\">`", "`<span role=\"button\">`"], c: 1, why: "A button is focusable, works with Enter and Space, and is announced correctly. A link is for navigation, and a `span` with a role still needs `tabindex` and key handling written by hand." },
        { id: 'alt-attribute', q: "What is the `alt` attribute for?", a: ["A tooltip shown on hover", "A text alternative describing the image, for people and tools that can't see it", "The caption shown below the image", "Keywords for search engines"], c: 1, why: "Screen readers read it, and it shows when the image fails to load." },
        { id: 'label-connected-input', q: "How is a `<label>` connected to its input?", a: ["By being placed next to it", "`for` on the label matching the input's `id` (or by wrapping the input)", "By sharing a `class`", "With `aria-label` on the label"], c: 1, why: "The connection gives the input an accessible name and makes clicking the label focus the input." }
      ]
    },
    {
      id: 'cascade', title: 'Selectors, the cascade and specificity', level: 0, mins: 30, viz: 'specificity',
      predict: {
        prompt: "An element `<a id=\"buy\" class=\"btn primary\">` matches `.btn.primary { color: green }`, `#buy { color: red }`, and `:where(#buy) { color: purple }` in that order. What color renders?",
        options: [
          "`purple` because `:where(#buy)` comes last in the stylesheet",
          "`red` because `#buy` has specificity `(1,0,0)` while `:where(#buy)` contributes `(0,0,0)`",
          "`green` because `.btn.primary` matches two classes",
        ],
        answer: 1,
        explain: "`#buy` scores `(1,0,0)`, beating `.btn.primary` `(0,2,0)`. Even though `:where(#buy)` appears last, `:where()` always has `(0,0,0)` specificity so it cannot override `#buy`.",
      },
      terms: [
        ['Specificity (`id`, `class`, `tag`)', 'Three-part score picking the winning rule when selectors clash (`#id` beats `.class`, which beats `a`).'],
        ['Source order', 'Tie-breaker when two matching rules share equal specificity. Whichever declaration appears later in the stylesheet wins.'],
        ['Inheritance', 'Text rules (`color`, `font`) trickle down to children unless overridden, while box rules (`border`, `padding`) stay on the element.']
      ],
      why: "Whenever a CSS rule fails to show up, another rule beat it. The cascade follows clear tie-breaking rules, and once you learn that order, styling stops feeling random.",
      points: [
        "A rule writes `selector { property: value }`. Selectors match tags (`p`), classes (`.card`), IDs (`#header`), attributes (`[type=email]`), or states (`:hover`, `:focus-visible`).",
        "Combinators link elements by tree structure: `nav a` (any descendant), `ul > li` (direct child), and `h2 + p` (next sibling).",
        "When rules compete on the same property, the **cascade** checks importance (`!important`), inline styles, `@layer` order, **specificity**, and **source order** (latest wins).",
        "Specificity scores count `(ids, classes, elements)`. One ID outranks any pile of classes, and one class outranks any pile of tag selectors.",
        "`:where()` adds **zero** specificity, making `:where(.card) a` just as easy to override as `a`. `:is()` adopts its heaviest selector's score.",
        "Text properties like `color`, `font`, and `line-height` **inherit** down to children, whereas layout boxes like `margin`, `padding`, and `border` don't.",
        "Keep specificity flat with single classes. Adding an ID selector or `!important` makes every future override harder."
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
        { id: 'selector-highest-specificity', q: "Which selector has the highest specificity?", a: ["`.card .title`", "`#main`", "`div p span a`", "`.a.b.c`"], c: 1, why: "One id (1,0,0) outranks any number of classes or elements." },
        { id: 'two-rules-identical-specificity', q: "Two rules with identical specificity set `color`. Which wins?", a: ["The first in the file", "The one declared later", "The one with more declarations", "The one in the bigger file"], c: 1, why: "With equal importance, layer and specificity, source order decides: last wins." },
        { id: 'property-inherited-default', q: "Which property is inherited by default?", a: ["`margin`", "`border`", "`color`", "`width`"], c: 2, why: "Text properties such as `color` and `font` inherit automatically, while box properties don't." },
        { id: 'specificity-card', q: "What is the specificity of `:where(#main .card) a`?", a: ["(1,1,1)", "(0,0,1)", "(0,1,1)", "(1,0,1)"], c: 1, why: "Everything inside `:where()` counts as zero, so only the `a` is left." }
      ]
    },
    {
      id: 'box', title: 'The box model', level: 0, mins: 25, viz: 'boxmodel',
      predict: {
        prompt: "An `<h2>` with `margin-bottom: 24px` sits directly above a `<p>` with `margin-top: 32px` inside a plain `<div>`, then you switch the parent to `display: flex; flex-direction: column`. What is the vertical gap before vs after?",
        options: [
          "`56px` in both layouts",
          "`32px` in the block `<div>` (margins collapse), then `56px` in the flex column (flex margins never collapse)",
          "`24px` in the block `<div>`, then `32px` in the flex column",
        ],
        answer: 1,
        explain: "In normal block flow, touching vertical margins collapse to the larger value (`32px`). Once the parent becomes a flex container, child margins stop collapsing and add together (`24px + 32px = 56px`).",
      },
      terms: [
        ['`box-sizing: border-box`', 'Includes padding and border inside declared `width` rather than tacking them on top and causing overflow.'],
        ['Padding vs Margin', 'Padding creates inner breathing room inside backgrounds and borders, while margin pushes neighboring elements apart outside.'],
        ['Margin collapsing', 'Touching vertical block margins merge into the larger margin instead of adding up (never happens in flex or grid).']
      ],
      why: "Every HTML element sits inside a rectangular box. Once you picture its four layers, confusing bugs like a 100%-wide box overflowing its container stop happening.",
      points: [
        "From the center outward, each box has **content**, **padding** (inside the border), **border**, and **margin** (outside spacing).",
        "Default `content-box` applies `width` only to the inner content, then adds padding and border outside. `border-box` keeps padding and border inside `width`.",
        "Start CSS resets with `*, *::before, *::after { box-sizing: border-box; }`.",
        "`block` elements fill available width and stack vertically. `inline` elements wrap inside text ignoring `width` and `height`, while `inline-block` accepts explicit sizes.",
        "Adjacent vertical block margins **collapse** into whichever margin is bigger. Padding never collapses, and flex or grid items don't collapse either.",
        "`overflow` sets how overflowing content behaves: `visible`, `hidden`, `clip`, or `auto` (scrollbars appear only when needed)."
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
      analogy: "Think of a framed picture on a wall. Content is the art, padding is the white mat, border is the frame, and margin is the bare wall before the next frame. Setting `border-box` means measuring 30 cm from the outer frame edges.",
      pitfalls: [
        "`width: 100%` plus padding under `content-box`, overflowing the parent.",
        "Expecting `width` or vertical margin to work on an inline element such as `span`.",
        "Being surprised by collapsed margins and adding more margin to compensate. In a flex or grid container, use `gap` instead."
      ],
      quiz: [
        { id: 'box-sizing-content-box', q: "With `box-sizing: content-box`, `width: 200px; padding: 20px; border: 5px solid` renders how wide?", a: ["200px", "225px", "250px", "240px"], c: 2, why: "200 + 20×2 + 5×2 = 250px. Padding and border are added outside the content width." },
        { id: 'sits-content-border', q: "Which sits between the content and the border?", a: ["Margin", "Padding", "Outline", "Gap"], c: 1, why: "Padding lives inside the border while margin sits outside. Outlines draw over edges without adding layout size." },
        { id: 'two-stacked-paragraphs-margin', q: "Two stacked paragraphs have `margin-bottom: 20px` and `margin-top: 30px`. The gap is…", a: ["50px", "30px", "20px", "25px"], c: 1, why: "Neighbouring vertical margins collapse to the larger of the two." }
      ]
    },
    {
      id: 'units', title: 'Units, colour and typography', level: 0, mins: 25,
      terms: [
        ['`rem` vs `em` vs `px`', '`rem` scales with browser root font preferences (accessible), `em` scales with the current element, and `px` stays fixed.'],
        ['Measure (`ch`)', 'Line width counted in zero character widths. Keeping prose near `60ch–70ch` makes long text comfortable to scan.'],
        ['Contrast ratio (`4.5:1`)', 'WCAG AA minimum contrast between body text and background so screens stay readable in bright light or low vision.']
      ],
      why: "Clear typography and steady spacing do most of the work in making a UI look sharp. Your choice of CSS units also decides whether browser zoom and custom font sizes still work.",
      points: [
        "`px` uses fixed CSS pixels, while `rem` multiplies the root font size (16px by default) and respects browser accessibility settings.",
        "`em` follows the element's own font size, great for button padding that scales with text. `%` sizes from the parent, `vw`/`dvh` match viewport edges, and `ch` measures one character.",
        "`clamp(min, preferred, max)` creates smooth sizing between bounds. Mixing `rem` into text like `clamp(1.75rem, 1rem + 3vw, 2.5rem)` ensures browser zoom keeps enlarging headlines.",
        "Colours can use hex `#3b47d6`, `rgb()`, `hsl()` (hue, saturation, lightness), or `oklch()` where equal numeric steps look visually even.",
        "Good body text starts at 16px+ with `line-height: 1.5`, line widths of `45ch–75ch` (`max-width: 65ch`), and clear heading hierarchy.",
        "Body text needs at least 4.5:1 contrast against its surface (3:1 for large headings) under WCAG AA."
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
        { id: 'root-font-size-16px', q: "The root font size is 16px. How big is `1.5rem`?", a: ["15px", "16px", "24px", "1.5px"], c: 2, why: "`rem` multiplies the root font size: 1.5 × 16 = 24px." },
        { id: 'clamp-1rem-3vw-2rem', q: "What does `clamp(1rem, 3vw, 2rem)` do?", a: ["Always uses 3vw", "Uses 3vw, but never below 1rem or above 2rem", "Uses the smallest of the three values", "Uses 3vw only on screens narrower than 2rem"], c: 1, why: "`clamp` keeps a fluid preferred value between a minimum and a maximum." },
        { id: 'minimum-contrast-ratio-normal', q: "Minimum contrast ratio for normal body text under WCAG AA?", a: ["2:1", "3:1", "4.5:1", "7:1"], c: 2, why: "AA requires 4.5:1 for body text and 3:1 for large headings, whereas 7:1 targets stricter AAA." }
      ]
    },
    // ---------------- Intermediate ----------------
    {
      id: 'flexbox', title: 'Flexbox: layout in one dimension', level: 1, mins: 35, viz: 'flexbox',
      splits: [["1 · Navbar & Hero","/* Navbar:"],["2 · Sidebar & Wrapping Cards","/* Fixed sidebar,"]],
      predict: {
        prompt: "In a `display: flex` row, `.sidebar` is `flex: 0 0 240px` and `.content` is `flex: 1` (without `min-width: 0`) containing a wide `<pre>` block or long unbroken URL. What happens on a narrow screen?",
        options: [
          "`.content` shrinks smoothly to fit the remaining width and wraps the URL",
          "`.content` refuses to shrink below its content width and overflows the flex row horizontally",
          "`.sidebar` collapses to `0px` to make room",
        ],
        answer: 1,
        explain: "Flex items default to `min-width: auto`, which floors their minimum width at their intrinsic content size. Adding `min-width: 0` on `.content` lets `flex: 1` actually shrink and scroll or wrap.",
      },
      terms: [
        ['Main axis vs Cross axis', '`flex-direction: row` runs horizontally as the main axis (`justify-content`) and vertically as cross (`align-items`).'],
        ['`min-width: 0` / `min-inline-size: 0`', 'Overrides flex items’ default `min-width: auto` so long text or code wraps/truncates instead of bursting the row.'],
        ['`gap` & `flex: 1`', '`gap` spaces only *between* children (cleaner than child margins), while `flex: 1` lets items share remaining space.']
      ],
      why: "Navbars, toolbars, cards, centred content and form rows: most everyday layout is a single row or column of things, and flexbox handles all of it.",
      points: [
        "`display: flex` turns direct children into flex items arranged along a **main axis** (`row` or `column`).",
        "`justify-content` aligns items along the main axis, while `align-items` positions them across the cross axis.",
        "`gap` separates child items without messy margin hacks.",
        "Items grow and shrink with `flex`: `flex: 1` shares free space equally, while `flex: 0 0 200px` locks an item at 200px.",
        "`flex-wrap: wrap` lets items wrap across lines, and `margin-left: auto` on an item pushes it and trailing siblings to the far end.",
        "Flex children won't shrink narrower than their content by default. Add `min-width: 0` on a flex child so long text wraps or truncates."
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
      practice: "In the flexbox visualizer, build three layouts: items centered both ways, first item left with others pushed right, and equal-width columns. Write the CSS and Tailwind classes for each.",
      teach: "Explain the main axis and the cross axis, and which property controls alignment on each.",
      analogy: "Flexbox is arranging books on one shelf. `justify-content` decides how they're spread along the shelf: pushed left, centred, or spaced evenly. `align-items` decides whether short books sit at the bottom, the top, or the middle. `flex-direction: column` stands the shelf on its end, and the two properties swap what they mean on screen.",
      pitfalls: [
        "Mixing up `justify-content` and `align-items` after changing `flex-direction` to `column`.",
        "Long text or a wide table blowing out a flex layout. Fix it with `min-width: 0` on the item.",
        "Using flexbox for a true two-dimensional grid and fighting it with fixed widths."
      ],
      quiz: [
        { id: 'flex-direction-row-property', q: "With `flex-direction: row`, which property centres items vertically?", a: ["`justify-content`", "`align-items`", "`text-align`", "`vertical-align`"], c: 1, why: "In a row, the cross axis is vertical, and `align-items` controls the cross axis." },
        { id: 'flex-every-child', q: "What does `flex: 1` on every child do?", a: ["Sets each child's width to 1fr", "Gives each child an equal share of the free space", "Makes each child 100% wide", "Stops the children from shrinking"], c: 1, why: "It sets grow to 1 with a zero basis, so the free space is divided equally." },
        { id: 'flex-row-push-only', q: "In a flex row, how do you push only the last item to the far right?", a: ["`float: right` on that item", "`margin-left: auto` on that item", "`justify-content: flex-end` on the container", "`position: absolute` on that item"], c: 1, why: "An auto margin absorbs all the free space on that side. `justify-content: flex-end` would move every item to the right." }
      ]
    },
    {
      id: 'grid', title: 'CSS Grid: layout in two dimensions', level: 1, mins: 35, viz: 'grid',
      predict: {
        prompt: "A two-column grid uses `grid-template-columns: 240px 1fr` on a `900px` container, and the second column contains a `1000px` wide `<table>`. Why does the page scroll sideways, and what fixes it?",
        options: [
          "`1fr` means `minmax(auto, 1fr)` so the track expands to fit the table; changing it to `minmax(0, 1fr)` lets it shrink",
          "`240px` is too wide for a `900px` container; use `%` instead",
          "CSS Grid always ignores `overflow: auto` on children",
        ],
        answer: 0,
        explain: "A bare `1fr` track has an automatic minimum size (`minmax(auto, 1fr)`), so wide content pushes the track past the container. Switching to `minmax(0, 1fr)` caps the column at the remaining space so inner `overflow: auto` can scroll.",
      },
      terms: [
        ['`fr` unit', 'Fraction of leftover track space inside a grid container after fixed and content-sized columns are placed.'],
        ['`repeat(auto-fit, minmax(min(260px, 100%), 1fr))`', 'Zero-media-query responsive grid wrapping cards automatically without overflowing narrow phones.'],
        ['Implicit vs Explicit tracks', 'Columns/rows you declare (`grid-template-columns`) versus extra rows created automatically when items wrap.']
      ],
      why: "Page shells, dashboards, galleries, and any design whose rows and columns must line up belong to Grid. Together with flexbox, it covers almost every layout without hacks.",
      points: [
        "`display: grid` with `grid-template-columns` sets column tracks, and rows appear automatically as children fill in.",
        "The `fr` unit divides leftover grid space proportionally (`1fr 2fr` creates one-third and two-thirds columns).",
        "`repeat(3, 1fr)` builds three equal columns. `repeat(auto-fit, minmax(min(220px, 100%), 1fr))` responds automatically without media queries while stopping overflow below 220px.",
        "Children can span columns with `grid-column: span 2` or stretch edge to edge with `grid-column: 1 / -1`.",
        "`grid-template-areas` lets you map out header, sidebar, and main zones visually right inside CSS.",
        "Rule of thumb: use **Grid** for overall two-dimensional structure and **flexbox** for arranging items inside each cell."
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
      practice: "Try different templates in the grid visualizer and resize the viewport on `auto-fit`. Next, recreate a sidebar-plus-main page shell using `grid-template-areas` in the playground, stacking to one column on mobile.",
      teach: "Explain when to choose Grid versus flexbox with one concrete UI example for each.",
      analogy: "Flexbox is arranging books along a single shelf, while Grid works like graph paper. You sketch rows and columns upfront, drop cards into cells, and everything lines up both vertically and horizontally.",
      pitfalls: [
        "Picking `auto-fill` instead of `auto-fit`: `auto-fill` leaves invisible empty columns instead of expanding fewer items to fill the row.",
        "Writing `minmax(220px, 1fr)` without `min()`, causing horizontal overflow on screens under 220px.",
        "Hard-coding column counts at every breakpoint when `minmax()` adapts automatically.",
        "`1fr` tracks blowing past boundaries on wide tables or long URLs. Switch to `minmax(0, 1fr)`."
      ],
      quiz: [
        { id: 'grid-template-columns-1fr', q: "What does `grid-template-columns: 1fr 3fr` create?", a: ["Two equal columns", "Two columns sharing the free space 1:3", "Four columns", "One column of three rows"], c: 1, why: "`fr` units divide leftover track space proportionally." },
        { id: 'declaration-gives-responsive-gri', q: "Which declaration gives a responsive grid without media queries?", a: ["`repeat(3, 1fr)`", "`repeat(auto-fit, minmax(min(200px, 100%), 1fr))`", "`200px 200px 200px`", "`grid-auto-flow: column`"], c: 1, why: "The browser packs as many 200px+ columns as fit and stretches them, while `min()` shrinks safely on small screens." },
        { id: 'make-grid-item-span', q: "How do you make a grid item span the full width?", a: ["`width: 100vw`", "`grid-column: 1 / -1`", "`grid-column: span all`", "`justify-self: stretch`"], c: 1, why: "Spanning line 1 to line -1 covers every column track (`span all` is invalid CSS)." }
      ]
    },
    {
      id: 'responsive', title: 'Responsive design', level: 1, mins: 35,
      splits: [["1 · Mobile-first & Media","/* Mobile first:"],["2 · Container Queries","/* Container query:"],["3 · Hover & Reduced Motion","/* Hover effects"]],
      terms: [
        ['Mobile-first `@media`', 'Start with single-column mobile styles as default and layer `min-width` rules upward as screens widen.'],
        ['Fluid `clamp(min, pref, max)`', 'Scales typography smoothly between viewport bounds with one line instead of stepped breakpoints.'],
        ['Container query (`@container`)', 'Lets a component adapt to its parent card’s width rather than the full browser viewport.']
      ],
      why: "Most web traffic comes from phones. A layout that only works at the designer's screen width is broken for most of your users.",
      points: [
        "Always add `<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">` so phones don't zoom the whole desktop layout out.",
        "Build **mobile-first** by setting single-column defaults first, then layering wider rules with `@media (min-width: …)` or `@media (width >= 768px)`.",
        "Lean on **intrinsic sizing** (`flex-wrap`, `auto-fit` grids, `clamp()`, `max-width`) and only introduce breakpoints where content starts cramping.",
        "Keep images responsive with `max-width: 100%` and `height: auto`, plus `width`/`height` or `aspect-ratio` to stop layout jumps.",
        "**Container queries** (`@container`) adapt components based on their parent card width rather than the full browser viewport.",
        "Honor user settings like `prefers-color-scheme`, `hover`, `pointer`, and `prefers-reduced-motion`. Gate animations inside `prefers-reduced-motion: no-preference`."
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
        { id: 'mobile-first-stylesheet-base', q: "In a mobile-first stylesheet, the base styles target…", a: ["Desktop screens", "Small screens, with `min-width` queries adding layout for larger ones", "Tablets, with queries both ways", "Print"], c: 1, why: "You start with the simplest stacked styles and layer enhancements upward." },
        { id: 'container-query-based', q: "What is a container query based on?", a: ["The viewport width", "The size of the element's container", "The device pixel ratio", "The user's font size"], c: 1, why: "Components respond to the space they're placed in, wherever that is." },
        { id: 'rule-keeps-images-overflowing', q: "Which rule keeps images from overflowing their parent?", a: ["`width: 100vw`", "`max-width: 100%; height: auto`", "`overflow: hidden` on the image", "`object-fit: contain`"], c: 1, why: "The image may shrink to fit but never exceeds its container, and keeps its proportions." }
      ]
    },
    // ---------------- Advanced ----------------
    {
      id: 'position', title: 'Positioning and stacking contexts', level: 2, mins: 30, viz: 'stacking',
      predict: {
        prompt: "A sticky `.header` has `z-index: 10`. Inside `.sidebar` (which has `transform: translateX(0)`), a modal has `position: fixed; inset: 0; z-index: 9999`. Where does the modal appear?",
        options: [
          "Full-screen above `.header` because `9999 > 10`",
          "Trapped inside `.sidebar`'s box AND painted behind `.header`",
          "Centered on the viewport, but behind `.header`",
        ],
        answer: 1,
        explain: "`transform` on `.sidebar` creates both a new stacking context (trapping `z-index: 9999` inside `.sidebar`) and a new containing block (so `position: fixed` sizes against `.sidebar` instead of the viewport).",
      },
      terms: [
        ['`relative` vs `absolute`', '`position: absolute` aligns itself against the nearest ancestor whose position is not `static` (usually `relative`).'],
        ['`position: sticky`', 'Scrolls with the page until hitting its `top` offset, then sticks. Breaks if any ancestor sets `overflow: hidden`.'],
        ['Stacking context', 'An isolated paint group created by `transform`, `opacity < 1`, or `isolation: isolate` that traps child `z-index` values inside.']
      ],
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
      analogy: "Think of stacking contexts as stacked folders full of clear sheets. Within one folder you reorder sheets freely with `z-index`. Yet a sheet inside the bottom folder can't climb above the folder sitting on top.",
      pitfalls: [
        "Raising z-index numbers instead of finding the ancestor that created a stacking context.",
        "`position: absolute` with no positioned ancestor, so the element flies to the corner of the page.",
        "`position: sticky` failing because an ancestor has `overflow: hidden` and has become the scroll container.",
        "A `position: fixed` element that stops being fixed because an ancestor gained a `transform`, for example from an animation library."
      ],
      quiz: [
        { id: 'absolutely-positioned-element-pl', q: "An absolutely positioned element is placed relative to…", a: ["The viewport, always", "Its nearest positioned ancestor", "Its parent element, always", "The `<body>`, always"], c: 1, why: "It uses the closest ancestor whose position isn't `static`, and falls back to the initial containing block." },
        { id: 'creates-new-stacking-context', q: "Which of these creates a new stacking context?", a: ["`color: red`", "`transform: translateX(0)`", "`margin: 0`", "`display: block`"], c: 1, why: "Transforms, opacity below 1, filters and `isolation: isolate` all create stacking contexts." },
        { id: 'index-effect-element', q: "Why might `z-index` have no effect on an element?", a: ["The number is larger than the browser allows", "The element isn't positioned, and isn't a flex or grid item", "Its parent has `overflow: hidden`", "Negative values are ignored"], c: 1, why: "`z-index` is ignored on static elements that aren't flex or grid items." },
        { id: 'position-fixed-element-suddenly', q: "A `position: fixed` element suddenly scrolls with the page. Most likely cause?", a: ["A missing `z-index`", "An ancestor now has a `transform`, so `fixed` is relative to it", "The page uses flexbox", "The viewport meta tag is missing"], c: 1, why: "A transformed (or filtered) ancestor becomes the containing block for fixed descendants." }
      ]
    },
    {
      id: 'modern', title: 'Custom properties, theming and modern CSS', level: 2, mins: 35,
      splits: [["1 · Tokens & Theme Switch",":root {"],["2 · Component Nesting & :has()",".button {"]],
      predict: {
        prompt: "A user's OS is set to dark mode, and they click Light in your app (`<html data-theme=\"light\">`). Your CSS defines `:root { --bg: #fff; }` and `@media (prefers-color-scheme: dark) { :root { --bg: #0e1117; } }` without `:not([data-theme=\"light\"])`. What background renders?",
        options: [
          "`#fff` because `data-theme=\"light\"` automatically cancels OS media queries",
          "`#0e1117` because the `@media` rule still matches and comes later in source order",
          "Transparent because the two rules conflict",
        ],
        answer: 1,
        explain: "A `data-theme` attribute does not disable `prefers-color-scheme: dark`. Because both selectors have equal specificity and the `@media` block appears later, dark tokens win unless guarded with `:root:not([data-theme=\"light\"])`.",
      },
      terms: [
        ['CSS custom property (`--bg`)', 'A live inherited CSS variable evaluated in the browser at runtime. Flipping `data-theme="dark"` updates every theme color immediately.'],
        ['`:has()` parent selector', 'Styles a parent wrapper based on a child state (`label:has(input:invalid)`) using pure CSS.'],
        ['`@layer` cascade control', 'Sorts stylesheets into explicit priority layers so third-party CSS stops clashing with your component overrides.']
      ],
      why: "Design tokens, dark mode and component variants are built on custom properties. Modern CSS also does most of what preprocessors used to be needed for, so knowing it keeps your toolchain small.",
      points: [
        "**Custom properties** (`--brand: #3b47d6`) cascade and inherit at runtime, read via `var(--brand, fallback)`. Unlike Sass variables, you can update them live in the browser.",
        "Define **design tokens** on `:root` for colors, spacing, and radii. Switching themes only changes those variable values.",
        "Manual dark mode toggles handle three states: follow OS preference by default, or force `data-theme=\"light\"` or `data-theme=\"dark\"` when picked. Keep media queries from overriding an explicit light choice.",
        "`color-scheme: light dark` syncs native checkboxes and scrollbars with dark mode, and `light-dark(#fff, #0e1117)` flips values per theme.",
        "Native CSS **nesting** (`.card { &:hover { … } }`), `:is()`, and `:where()` trim long repetitive selectors.",
        "`:has()` styles ancestors based on descendants, like `.field:has(input:user-invalid)` highlighting invalid wrappers without JS.",
        "Transitions animate property changes over time. Favor `transform` and `opacity` so animations stay smooth."
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
      practice: "Build a three-state theme toggle (system, light, dark) toggling `data-theme` on `<html>` and saving the preference. Test all six combinations of OS setting and user pick, then add a high-contrast theme by swapping only tokens.",
      teach: "Explain how CSS custom properties make dark mode possible without rewriting every component's styles.",
      analogy: "Custom properties are the paint colours named on a decorator's chart: 'wall', 'trim', 'accent'. Every room's instructions say 'paint the trim in trim'. To redecorate the whole house, you change three entries on the chart, not the instructions for every room.",
      pitfalls: [
        "Hard-coded colours scattered through components, turning a theme change into find-and-replace.",
        "A dark-mode media query that ignores the user's choice, so 'light' can't be picked on a dark system.",
        "Forgetting `color-scheme`, leaving white form fields and scrollbars on a dark page.",
        "Animating `width`, `height` or `top`, which forces layout on every frame."
      ],
      quiz: [
        { id: 'custom-properties-differ-sass', q: "How do custom properties differ from Sass variables?", a: ["They're faster to type", "They exist in the browser, cascade and inherit, and can change per element or media query", "They can only hold colours", "They need a build step"], c: 1, why: "Sass variables vanish at build time, while CSS custom properties stay live inside the browser." },
        { id: 'card-img-select', q: "What does `.card:has(img)` select?", a: ["Images inside cards", "Cards that contain an image", "Cards without images", "The first image in each card"], c: 1, why: "`:has()` selects an element based on its descendants." },
        { id: 'system-dark-user-picks', q: "The system is dark, the user picks light, and the page stays dark. Most likely cause?", a: ["The browser cached the old CSS", "The `prefers-color-scheme: dark` rule doesn't exclude `[data-theme=\"light\"]`", "`color-scheme` is missing", "Custom properties can't be changed after load"], c: 1, why: "The media query still applies the dark tokens. Guard it with `:root:not([data-theme=\"light\"])`." },
        { id: 'properties-cheapest-animate', q: "Which properties are cheapest to animate?", a: ["`width` and `height`", "`transform` and `opacity`", "`margin` and `padding`", "`top` and `left`"], c: 1, why: "The compositor can handle them without layout or paint." }
      ]
    },
    {
      id: 'tailwind', title: 'Tailwind CSS: utility-first fundamentals', level: 2, mins: 40, lang: 'html',
      terms: [
        ['Utility class (`px-4`, `gap-3`)', 'Single-purpose atomic class mapping 1-to-1 to design tokens instead of ad-hoc `.card-wrapper` CSS files.'],
        ['`@theme` tokens', 'Tailwind v4 CSS-first token definition creating utility classes directly from CSS variables.'],
        ['Responsive / state prefixes (`md:`, `hover:`)', 'Composable modifiers scoped inline right where you read and edit the element.']
      ],
      why: "Tailwind is one of the most common ways to style React apps today. It replaces naming things and maintaining stylesheets with small composable classes, and every class is plain CSS you already understand.",
      points: [
        "With **utility-first** CSS, tiny single-purpose classes (`p-4`, `flex`, `text-lg`, `bg-blue-600`) compose directly in markup instead of inventing `.card-header` names.",
        "Spacing (`p-4` = 1rem in 0.25rem steps), typography (`text-sm`–`text-4xl`), and colors come from one **design scale**. In v4, any spacing step (`p-13`) works automatically.",
        "**Variants** prefix utilities with states or breakpoints: `hover:`, `focus-visible:`, `disabled:`, `dark:`, and `sm:`/`md:`/`lg:` (`min-width`).",
        "Layout utilities mirror standard CSS properties (`flex items-center justify-between gap-4`, `grid grid-cols-3`, `absolute inset-0`).",
        "Reach for arbitrary escapes (`w-[37rem]`, `bg-[#1da1f2]`) sparingly, keeping most spacing and colors on your scale.",
        "Tailwind scans source files and compiles **only the classes you actually use**, keeping CSS tiny compared to full UI kits you have to override."
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
      analogy: "Traditional CSS feels like ordering custom furniture: pick names, write specs, then build sheets. Tailwind gives you standardized bricks in fixed sizes so any screen teammates snap together still looks cohesive.",
      pitfalls: [
        "Memorizing Tailwind names without CSS basics. Each class maps to CSS declarations, so debugging layout still relies on CSS.",
        "Building class names dynamically (`'text-' + color + '-500'`). Tailwind's scanner only spots whole class strings written out in source.",
        "Dismissing utilities as inline styles. Utilities handle `:hover`, focus, dark mode, breakpoints, and design scales, which inline styles can't.",
        "Adding custom CSS outside `@layer` in Tailwind v4, which accidentally overrides utility classes everywhere."
      ],
      quiz: [
        { id: 'md-grid-cols-mean', q: "What does `md:grid-cols-2` mean?", a: ["Two columns only on medium screens", "Two columns from the `md` breakpoint upward", "Two columns below `md`", "Medium-sized columns"], c: 1, why: "Breakpoint prefixes use mobile-first `min-width` queries, matching from `md` upward." },
        { id: 'tailwind-css-stay-small', q: "Why does Tailwind's CSS stay small in production?", a: ["It ships a fixed, pre-minified stylesheet", "Only the classes found in your source files are generated", "It removes unused classes in the browser at run time", "It uses inline styles"], c: 1, why: "Tailwind scans your files and builds only the utility classes you used." },
        { id: 'classname-bg-color-500', q: "Why does `className={'bg-' + color + '-500'}` often not work?", a: ["React forbids string concatenation in `className`", "Tailwind can't see the full class name in the source, so it never generates it", "Colours need hex values", "Template strings are slow"], c: 1, why: "Static build scanning needs whole literal strings, so map variant values to complete utility classes." }
      ]
    },
    {
      id: 'twreact', title: 'Tailwind in React: components, variants and theming', level: 2, mins: 40, lang: 'tsx',
      splits: [["1 · Setup & @theme CSS","// vite.config.ts:"],["2 · cn() & Variant Maps","import { clsx,"],["3 · Typed <Button> Component","interface ButtonProps"]],
      predict: {
        prompt: "`<Button>` renders `className={\"px-4 \" + className}` without `twMerge`, and a caller passes `<Button className=\"px-8\" />`. Which horizontal padding wins in CSS?",
        options: [
          "Always `px-8` because it comes later in the HTML `class` attribute",
          "Whichever rule appears later in the generated CSS stylesheet, NOT the order in `className`",
          "Both add together to `px-12`",
        ],
        answer: 1,
        explain: "HTML class attribute order has zero effect on CSS cascade. Both `px-4` and `px-8` have specificity `(0,1,0)`, so stylesheet order decides—which is why `cn()` uses `tailwind-merge` to drop `px-4`.",
      },
      terms: [
        ['Component abstraction', 'Reusing `<Button variant="danger">` components instead of `@apply` CSS classes keeps bundles small and typed.'],
        ['Explicit variant map', 'Mapping keys (`primary: "bg-indigo-600..."`) instead of concatenating strings so Tailwind finds every class at build time.'],
        ['`twMerge(...)`', 'Deduplicates conflicting utility classes automatically so `twMerge("px-4", "px-8")` resolves to `px-8`.']
      ],
      why: "Utilities scale nicely once repetition stays inside components. In React, extract components holding classes once, and use typed variants so TypeScript catches invalid styles.",
      points: [
        "Eliminate repeated classes by extracting **React components** rather than writing `@apply`. Put a button's styling inside `<Button>` once.",
        "In Vite, install `tailwindcss` and `@tailwindcss/vite`, enable the plugin, and import Tailwind with `@import \"tailwindcss\";`.",
        "Extend design tokens in CSS via `@theme`: adding `--color-brand-500` unlocks `bg-brand-500`, `text-brand-500`, and matching utilities.",
        "Combine classes with `clsx` plus `tailwind-merge` (`cn()`) so caller overrides via `className` win without specificity clashes.",
        "Represent variants like `size` and `intent` with typed union props backed by a lookup map or `cva`.",
        "Default custom `<Button>` wrappers to `type=\"button\"` so placing them inside forms doesn't trigger accidental form submits.",
        "Style states without JS (`group-hover:`, `peer-invalid:`, `aria-expanded:`), and configure `@custom-variant` when driving `dark:` manually via attributes."
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
      analogy: "A UI component is a pre-inked rubber stamp. Instead of handing teammates twelve ink bottles hoping they match shades, you pass one stamp with preset dials for size and intent.",
      pitfalls: [
        "Overusing `@apply` until you end up maintaining traditional CSS stylesheets all over again.",
        "Concatenating raw class strings so `px-2 px-4` both render and compete by CSS source order instead of merging with `tailwind-merge`.",
        "Accepting unvalidated variant strings instead of typed unions.",
        "Forgetting a default `type=\"button\"` on reusable buttons, causing surprise submits inside forms."
      ],
      quiz: [
        { id: 'defining-color-brand-500', q: "What does defining `--color-brand-500` inside `@theme` do?", a: ["Nothing until you write CSS that uses it", "Generates utilities such as `bg-brand-500` and `text-brand-500`", "Replaces every built-in colour", "Creates a React component"], c: 1, why: "Theme variables are design tokens deciding which utility classes Tailwind emits." },
        { id: 'problem-tailwind-merge-solve', q: "What problem does `tailwind-merge` solve?", a: ["Bundle size", "Conflicting utilities such as `px-2 px-4`: it keeps the last one", "Missing dark mode", "Slow builds"], c: 1, why: "It deduplicates conflicting classes so a caller's `className` overrides defaults predictably." },
        { id: 'reusable-button-placed-inside', q: "A reusable `<Button>` is placed inside a `<form>`. Clicking it submits the form. Why?", a: ["React submits forms on every click", "Its `type` defaults to `submit` unless set", "`tailwind-merge` removed the type", "The form has no `action`"], c: 1, why: "Native `<button>` elements default to `submit`, so reusable components should set `type=\"button\"`." },
        { id: 'preferred-way-reuse-set', q: "Preferred way to reuse a set of utilities across a React app?", a: ["Copy and paste", "`@apply` in a global stylesheet", "Extract a component", "Inline `style` objects"], c: 2, why: "Components bundle markup, accessibility behavior, and classes into one reusable unit." }
      ]
    },
    // ---------------- Expert ----------------
    {
      id: 'arch', title: 'CSS architecture and design systems', level: 3, mins: 40,
      splits: [["1 · Layers, Reset & Tokens","/* Layer order"],["2 · Components & Utilities","@layer components {"],["3 · Unlayered Trap & @scope","/* Careful: a rule"]],
      predict: {
        prompt: "A stylesheet declares `@layer components, utilities;` with `.hidden { display: none }` inside `@layer utilities`, and an unlayered `.card { display: block }` at the top of the file. What happens to `<div class=\"card hidden\">`?",
        options: [
          "Hidden (`display: none`), because `@layer utilities` is the highest layer and appears later",
          "Visible (`display: block`), because unlayered normal CSS beats every `@layer` regardless of source order",
          "Hidden only if `.hidden` uses `#app .hidden`",
        ],
        answer: 1,
        explain: "In CSS Cascade Layers, normal rules outside any `@layer` always outrank all layered rules—even if the unlayered rule appears earlier in the file. Always wrap custom CSS in a `@layer` when using Tailwind v4.",
      },
      terms: [
        ['Semantic vs primitive tokens', 'Components reference `--surface` / `--accent` (semantic), never raw `--blue-500` (primitive), enabling painless theme changes.'],
        ['Style scoping (CSS Modules / Layers)', 'Prevents unintended cross-page leakage when multiple developers style components concurrently.'],
        ['Spacing scale', 'Constraining margins and padding to a fixed modular ladder (`4, 8, 12, 16, 24, 32px`) makes UI feel cohesive automatically.']
      ],
      why: "CSS is global by default, so it decays faster than other code as a team grows. The job is to choose a way of scoping it on purpose, and to be able to say why you rejected the alternatives.",
      points: [
        "Unscoped CSS shares one **global namespace**, so specificity wars and source-order surprises creep in as styles pile up.",
        "Common scoping options include naming rules (**BEM** `.card__title--large`), **CSS Modules** (build-hashed names), **utility-first** (Tailwind), CSS-in-JS, and `@scope`.",
        "**Cascade layers** (`@layer reset, base, components, utilities;`) set a fixed priority order where later layers beat earlier ones regardless of specificity.",
        "Styles written **outside any `@layer` beat every layer**. Because Tailwind v4 puts utilities inside `@layer utilities`, unlayered custom CSS overrides them unexpectedly unless wrapped in a layer.",
        "Build a **design system** bottom-up: tokens (color, spacing, radii) → UI primitives (`Button`, `Input`) → page patterns, split into raw and semantic aliases (`--color-danger`).",
        "Keep reusable components free of outer margins. Let the parent layout handle spacing via `gap` so components work anywhere.",
        "Weigh the trade-offs. Utility CSS ships fast and small with busier HTML. CSS Modules keep CSS clean with extra files, while runtime CSS-in-JS slows Server Components."
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
        "Mixing three scoping styles in one codebase with no rule on which layer owns what.",
        "Naming tokens by raw colors (`--blue`) instead of roles (`--color-action`), breaking rebrands later.",
        "Baking outer margins onto components so they misalign wherever reused.",
        "Writing unlayered custom CSS in Tailwind v4 and overriding utility classes by accident."
      ],
      quiz: [
        { id: 'layer-components-utilities-rule', q: "With `@layer components, utilities;` which rule wins: `#app .btn` in `components` or `.hidden` in `utilities`?", a: ["`#app .btn`: higher specificity", "`.hidden`: the later layer wins regardless of specificity", "Whichever is later in the file", "Neither"], c: 1, why: "Layer order is compared before specificity." },
        { id: 'hidden-display-none-layer', q: "`.hidden { display: none }` is in `@layer utilities`, while `.card { display: block }` sits outside layers. On `<div class=\"card hidden\">`, which wins?", a: ["`.hidden`: utilities is the last layer", "`.card`: unlayered styles beat every layer", "Whichever comes later in the file", "Neither applies"], c: 1, why: "Normal declarations outside any layer outrank all layered ones. That's why plain CSS can override Tailwind v4 utilities." },
        { id: 'css-modules-provide', q: "What do CSS Modules provide?", a: ["Runtime theming", "Locally scoped class names generated at build time", "A utility class library", "Native `@scope` support in older browsers"], c: 1, why: "Each file's class names are made unique, so styles can't collide across components." },
        { id: 'reusable-component-avoid-setting', q: "Why should a reusable component avoid setting its own outer margin?", a: ["Margins are slow to render", "Spacing depends on context, so the parent layout should own it", "Margins don't work inside grid", "It breaks dark mode"], c: 1, why: "A component with built-in margin fits only the context it was first designed for." }
      ]
    },
    {
      id: 'render', title: 'Rendering performance and accessibility', level: 3, mins: 40,
      terms: [
        ['CLS (Cumulative Layout Shift)', 'Sudden page jumping caused by late images or web fonts without reserved dimensions. Set explicit sizes or `aspect-ratio` upfront.'],
        ['Compositor-only animation (`transform`, `opacity`)', 'Runs on the GPU without re-running layout or paint, keeping motion smooth where `width` or `top` animations stutter.'],
        ['`:focus-visible` & `prefers-reduced-motion`', 'Keeps sharp keyboard focus rings visible while toning down heavy motion for users who prefer less movement.']
      ],
      why: "CSS governs how fast screens draw and whether every user can operate them. Knowing the rendering pipeline helps you fix layout shifts, cut jank, and build in accessibility.",
      points: [
        "Browsers follow **Style → Layout → Paint → Composite**. Editing size (`width`, `top`, `margin`) re-runs layout, changing color re-paints, while `transform` and `opacity` jump straight to composite.",
        "**Layout thrashing** happens when a loop alternates writing styles and reading `offsetHeight`, forcing sync layout passes. Batch reads together before writing styles.",
        "CSS is **render-blocking**. Keep stylesheets small, inline critical CSS if needed, and avoid chained `@import` waterfalls.",
        "Prevent **layout shifts (CLS)** by reserving space with `width`/`height` or `aspect-ratio`, avoiding injections above visible content, and using `font-display: swap`.",
        "`content-visibility: auto` and `contain` let browsers skip layout and paint for off-screen or self-contained sections.",
        "Keep focus rings intact with `:focus-visible`, verify contrast ratios, and don't convey status by color alone. Hide off-screen text for screen readers using `.sr-only` instead of `display: none`.",
        "Gate animations behind `prefers-reduced-motion: no-preference`. To tame third-party animations without breaking `transitionend` listeners, shorten durations to `0.01ms` instead of `none`."
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
      analogy: "Rendering a page is like staging a play. Layout builds the wooden set, paint colors the boards, and composite slides finished panels on rails. Animating `left` rebuilds the set every frame, whereas animating `transform` just glides a finished panel sixty times a second.",
      pitfalls: [
        "`outline: none` with no replacement, which makes the page unusable by keyboard.",
        "`will-change` on everything, using memory for no gain.",
        "Images and ads without reserved space, so content jumps while they load.",
        "`transition: none !important` for reduced motion, which breaks code waiting for `transitionend`."
      ],
      quiz: [
        { id: 'change-handled-compositor-alone', q: "Which change can be handled by the compositor alone?", a: ["`width`", "`margin-top`", "`transform`", "`font-size`"], c: 2, why: "Transforms and opacity don't require layout or paint when the element is on its own layer." },
        { id: 'directly-reduces-layout-shift', q: "What most directly reduces layout shift from images?", a: ["Lazy loading", "Reserving space with dimensions or `aspect-ratio`", "Smaller files", "Serving them from a CDN"], c: 1, why: "If the browser knows the size before the image loads, nothing moves when it arrives." },
        { id: 'content-hidden-visually-kept', q: "How should content be hidden visually but kept for screen readers?", a: ["`display: none`", "`visibility: hidden`", "A visually-hidden (`.sr-only`) pattern", "`aria-hidden=\"true\"`"], c: 2, why: "`display: none`, `visibility: hidden`, and `aria-hidden` all strip content out of the accessibility tree." }
      ]
    }
  ]
};

export default track;
