// CSS visualizations: specificity, box model, flexbox, grid.
import { codeBlock, h } from '../../lib/dom.ts';
import { t as T } from '../../lib/i18n.ts';
import { VIZ } from './registry.ts';
  const meta = { track: 'css', trackName: 'CSS + Tailwind' };
  const select = (label, opts, onchange) => { const s = h('select', { onchange }, opts.map(o => h('option', {}, o))); return [h('label', {}, label, s), s]; };
  const range = (label, min, max, step, val, oninput) => {
    const out = h('b', {}, val), r = h('input', { type: 'range', min, max, step, oninput: e => { out.textContent = e.target.value; oninput(); } });
    r.value = val; return [h('label', {}, label, r, out), r];
  };
  const check = (label, on, onchange) => { const c = h('input', { type: 'checkbox', onchange }); c.checked = on; return [h('label', {}, c, label), c]; };
  const codeOut = () => { const el = h('div', {}); return { el, set: (css, tw) => el.replaceChildren(codeBlock(css, 'css'), h('p', { class: 'muted', style: { margin: '.6rem 0 0' } }, 'Tailwind: ', h('code', {}, tw))) }; };

  // ---------- specificity ----------
  VIZ.specificity = {
    ...meta, title: 'Cascade and specificity',
    desc: 'Several rules all try to color the same link. Toggle them on or off to see which rule wins and why.',
    mount(el) {
      const rules = [
        { sel: 'a', color: 'gray', spec: [0, 0, 1], on: true },
        { sel: '.btn', color: 'royalblue', spec: [0, 1, 0], on: true },
        { sel: '.btn.primary', color: 'seagreen', spec: [0, 2, 0], on: true },
        { sel: 'nav a.btn', color: 'purple', spec: [0, 1, 2] },
        { sel: '.primary', color: 'chocolate', spec: [0, 1, 0] },
        { sel: '#buy', color: 'crimson', spec: [1, 0, 0] },
        { sel: 'style="…" (inline)', color: 'teal', inline: true, spec: [0, 0, 0] },
        { sel: '.btn', color: 'darkorange', important: true, spec: [0, 1, 0] }
      ];
      const rank = (r, i) => [r.important ? 1 : 0, r.inline ? 1 : 0, ...r.spec, i];
      const cmp = (a, b) => { for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return a[i] - b[i]; return 0; };
      const sample = h('a', { class: 'spec-sample' }, 'Buy now'), note = h('p', { class: 'viz-note' }), list = h('div', { class: 'spec-list' });
      const draw = () => {
        const live = rules.map((r, i) => ({ r, k: rank(r, i) })).filter(x => x.r.on).sort((a, b) => cmp(b.k, a.k));
        const win = live[0], second = live[1];
        list.replaceChildren(...rules.map(r => {
          const cb = h('input', { type: 'checkbox', onchange: e => { r.on = e.target.checked; draw(); } }); cb.checked = !!r.on;
          return h('label', { class: 'spec-rule' + (win && win.r === r ? ' win' : '') }, cb,
            h('code', {}, r.inline ? `style="color: ${r.color}"` : `${r.sel} { color: ${r.color}${r.important ? ' !important' : ''}; }`),
            h('span', { class: 'id' }, r.inline ? 'inline' : `(${r.spec.join(',')})`));
        }));
        sample.style.color = win ? win.r.color : '#1b2030';
        note.textContent = !win ? T('No rule applies: the link keeps its default colour.')
          : win.r.important ? T("!important outranks everything else, even inline styles. That's why it should be a last resort.")
          : win.r.inline ? T('Inline styles beat every selector, whatever its specificity.')
          : second && !second.r.inline && cmp(win.r.spec, second.r.spec) === 0 ? T('“{a}” and “{b}” have equal specificity ({s}), so the one declared later wins.', { a: win.r.sel, b: second.r.sel, s: win.r.spec.join(',') })
          : T('“{a}” wins with specificity ({s}). Compare column by column: ids first, then classes, then elements.', { a: win.r.sel, s: win.r.spec.join(',') });
      };
      el.append(h('p', { class: 'muted' }, 'Target element: ', h('code', {}, '<nav><a id="buy" class="btn primary">Buy now</a></nav>'), ' (rules are listed in source order).'),
        h('div', { class: 'viz-cols' }, list, h('div', { class: 'viz-box spec-stage' }, h('h4', {}, 'Winning result'), sample)), note);
      draw();
    }
  };

  // ---------- box model ----------
  VIZ.boxmodel = {
    ...meta, title: 'Box model',
    desc: 'The dashed frame is a 320px-wide parent. Adjust the element and watch what `width` really means under each box-sizing.',
    mount(el) {
      const draw = () => {
        const w = +wR.value, p = +pR.value, b = +bR.value, m = +mR.value, bb = bbC.checked;
        const rendered = bb ? w : w + 2 * p + 2 * b, total = rendered + 2 * m;
        Object.assign(box.style, { width: w + 'px', padding: p + 'px', borderWidth: b + 'px', margin: m + 'px', boxSizing: bb ? 'border-box' : 'content-box' });
        content.textContent = `content ${Math.max(bb ? w - 2 * p - 2 * b : w, 0)}px`;
        note.textContent = (bb ? T('border-box: rendered width = width = {w}px (padding and border fit inside).', { w })
          : T('content-box: rendered width = {w} + 2×{p} padding + 2×{b} border = {r}px.', { w, p, b, r: rendered })) +
          T(' With margins it takes {total}px', { total }) + T(total > 320 ? '. That exceeds the 320px parent, so it OVERFLOWS.' : ', fitting inside the 320px parent.');
        out.set(`.box {\n  box-sizing: ${bb ? 'border-box' : 'content-box'};\n  width: ${w}px;\n  padding: ${p}px;\n  border: ${b}px solid;\n  margin: ${m}px;\n}`, `${bb ? 'box-border' : 'box-content'} w-[${w}px] p-[${p}px] border-[${b}px] m-[${m}px]`);
      };
      const [wL, wR] = range('width', 100, 300, 10, 280, draw), [pL, pR] = range('padding', 0, 40, 4, 16, draw), [bL, bR] = range('border', 0, 20, 2, 4, draw), [mL, mR] = range('margin', 0, 40, 4, 8, draw);
      const [bbL, bbC] = check('box-sizing: border-box', false, draw);
      const content = h('div', { class: 'bm-content' }), box = h('div', { class: 'bm-box' }, content);
      const note = h('p', { class: 'viz-note' }), out = codeOut();
      el.append(h('div', { class: 'viz-ctl' }, wL, pL, bL, mL, bbL), h('div', { class: 'bm-parent' }, h('div', { class: 'bm-margin' }, box)),
        h('p', { class: 'muted' }, 'Orange = margin · solid edge = border · green = padding · blue = content'), note, out.el);
      draw();
    }
  };

  // ---------- flexbox ----------
  VIZ.flexbox = {
    ...meta, title: 'Flexbox playground',
    desc: 'Change the container’s properties and watch the items move. The matching CSS and Tailwind classes update below.',
    mount(el) {
      const tw = { 'flex-start': 'start', 'flex-end': 'end', center: 'center', 'space-between': 'between', 'space-around': 'around', 'space-evenly': 'evenly', stretch: 'stretch' };
      const draw = () => {
        const d = dS.value, j = jS.value, a = aS.value, wr = wS.value, g = +gR.value;
        Object.assign(box.style, { flexDirection: d, justifyContent: j, alignItems: a, flexWrap: wr, gap: g + 'px' });
        items[1].style.flex = gC.checked ? '1' : '';
        out.set(`.container {\n  display: flex;\n  flex-direction: ${d};\n  justify-content: ${j};\n  align-items: ${a};\n  flex-wrap: ${wr};\n  gap: ${g}px;\n}` + (gC.checked ? '\n.item-2 { flex: 1; }' : ''),
          `flex ${d === 'row' ? 'flex-row' : 'flex-col'} justify-${tw[j]} items-${tw[a]} flex-${wr} gap-${g / 4}` + (gC.checked ? '   ·   item 2: flex-1' : ''));
        note.textContent = T(d === 'row' ? 'Main axis is horizontal: justify-content moves items left/right, align-items moves them up/down.'
          : 'Main axis is now vertical: justify-content moves items up/down, and align-items moves them left/right.');
      };
      const [dL, dS] = select('direction ', ['row', 'column'], draw), [jL, jS] = select('justify-content ', ['flex-start', 'center', 'flex-end', 'space-between', 'space-around', 'space-evenly'], draw),
        [aL, aS] = select('align-items ', ['stretch', 'flex-start', 'center', 'flex-end'], draw), [wL, wS] = select('wrap ', ['nowrap', 'wrap'], draw),
        [gL, gR] = range('gap', 0, 32, 4, 8, draw), [gcL, gC] = check('item 2: flex: 1', false, draw);
      const items = [1, 2, 3, 4, 5].map(n => h('div', { class: 'demo-item', style: { padding: `${6 + n * 3}px ${10 + n * 4}px` } }, n));
      const box = h('div', { class: 'demo-flex' }, items), out = codeOut(), note = h('p', { class: 'viz-note' });
      el.append(h('div', { class: 'viz-ctl' }, dL, jL, aL, wL, gL, gcL), box, note, out.el);
      draw();
    }
  };

  // ---------- grid ----------
  VIZ.grid = {
    ...meta, title: 'Grid playground',
    desc: 'Pick a column template, then resize the window with auto-fit selected to see a responsive grid with no media queries.',
    mount(el) {
      const templates = {
        'repeat(3, 1fr)': 'grid-cols-3',
        '200px 1fr': 'grid-cols-[200px_1fr]',
        '1fr 2fr 1fr': 'grid-cols-[1fr_2fr_1fr]',
        'repeat(auto-fit, minmax(120px, 1fr))': 'grid-cols-[repeat(auto-fit,minmax(120px,1fr))]'
      };
      const notes = {
        'repeat(3, 1fr)': 'Three equal columns: the free space is split into three fractions.',
        '200px 1fr': 'A fixed 200px sidebar column beside one flexible column filling the remaining width.',
        '1fr 2fr 1fr': 'The middle column gets twice the share of the others.',
        'repeat(auto-fit, minmax(120px, 1fr))': 'As many columns as fit, each at least 120px, stretched to fill the row. Narrow the window and columns drop away.'
      };
      const draw = () => {
        const t = tS.value, g = +gR.value;
        Object.assign(box.style, { gridTemplateColumns: t, gap: g + 'px' });
        items[0].style.gridColumn = sC.checked ? 'span 2' : ''; items[3].style.gridColumn = fC.checked ? '1 / -1' : '';
        out.set(`.container {\n  display: grid;\n  grid-template-columns: ${t};\n  gap: ${g}px;\n}` + (sC.checked ? '\n.item-1 { grid-column: span 2; }' : '') + (fC.checked ? '\n.item-4 { grid-column: 1 / -1; }' : ''),
          `grid ${templates[t]} gap-${g / 4}` + (sC.checked ? '   ·   item 1: col-span-2' : '') + (fC.checked ? '   ·   item 4: col-span-full' : ''));
        note.textContent = T(notes[t]);
      };
      const [tL, tS] = select('columns ', Object.keys(templates), draw), [gL, gR] = range('gap', 0, 32, 4, 12, draw),
        [sL, sC] = check('item 1 spans 2 columns', false, draw), [fL, fC] = check('item 4 full width', false, draw);
      const items = [1, 2, 3, 4, 5, 6, 7].map(n => h('div', { class: 'demo-item' }, n));
      const box = h('div', { class: 'demo-grid' }, items), out = codeOut(), note = h('p', { class: 'viz-note' });
      el.append(h('div', { class: 'viz-ctl' }, tL, gL, sL, fL), box, note, out.el);
      draw();
    }
  };
