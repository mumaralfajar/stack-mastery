// Flutter visualizations: layout constraints, rebuilds, and the widget / element / render-object trees.
import { h, tableWrap, treeWire } from '../../lib/dom.ts';
import { t as T } from '../../lib/i18n.ts';
import { VIZ } from './registry.ts';
  const meta = { track: 'flutter', trackName: 'Dart + Flutter' };
  const btn = (label: string, onclick: () => void, cls?: string): HTMLButtonElement => h('button', { type: 'button', class: 'btn sm ' + (cls || ''), onclick }, label);
  const check = (label: string, on: boolean, onchange: (e: Event) => void): [HTMLElement, HTMLInputElement] => {
    const c = h('input', { type: 'checkbox', onchange }); c.checked = on; return [h('label', {}, c, label), c];
  };

  // Back / Next / Reset driving draw(i); count() may change when options change.
  function stepper(count: () => number, draw: (i: number) => void) {
    let i = 0;
    const label = h('span', { class: 'muted' });
    const back = btn('← Back', () => { i--; upd(); }, 'ghost'), next = btn('Next →', () => { i++; upd(); });
    const upd = () => { const n = count(); i = Math.min(i, n - 1); label.textContent = T('Step {i} of {n}', { i: i + 1, n }); back.disabled = i === 0; next.disabled = i === n - 1; draw(i); };
    return { el: h('div', { class: 'viz-ctl' }, back, next, btn('Reset', () => { i = 0; upd(); }, 'ghost'), label), start: upd, reset: () => { i = 0; upd(); } };
  }

  // ---------- constraints ----------
  VIZ.constraints = {
    ...meta, title: 'Constraints go down, sizes go up',
    desc: 'Follow one layout pass through Padding → Row → three children on a 360-wide screen. Then remove Expanded and watch the overflow happen.',
    mount(el) {
      const rows = ['Screen', 'Padding(16)', 'Row', 'Icon', 'Text', 'IconButton'];
      // Each step: [row index in focus, constraints per row, sizes per row, note]
      const steps = (expanded: boolean): [number, string[], string[], string][] => [
        [1, ['', 'w = 360', '', '', '', ''], [], 'The screen gives Padding a tight constraint: be exactly 360 wide.'],
        [2, ['', 'w = 360', '0 ≤ w ≤ 328', '', '', ''], [], 'Padding keeps 16 on each side for itself and passes what is left down: Row may be up to 328 wide.'],
        [3, ['', 'w = 360', '0 ≤ w ≤ 328', '0 ≤ w ≤ ∞', '', '0 ≤ w ≤ ∞'], ['', '', '', '40 × 40', '', '48 × 48'], 'Row lays out its non-flexible children first, with unbounded width. Icon answers 40, IconButton answers 48. Sizes go up.'],
        expanded
          ? [4, ['', 'w = 360', '0 ≤ w ≤ 328', '0 ≤ w ≤ ∞', 'w = 240', '0 ≤ w ≤ ∞'], ['', '', '', '40 × 40', '240 × 40', '48 × 48'], 'Space left: 328 − 40 − 48 = 240. Expanded gives Text a tight width of exactly 240, so it wraps onto two lines and reports 240 × 40.']
          : [4, ['', 'w = 360', '0 ≤ w ≤ 328', '0 ≤ w ≤ ∞', '0 ≤ w ≤ ∞', '0 ≤ w ≤ ∞'], ['', '', '', '40 × 40', '520 × 20', '48 × 48'], 'Without Expanded, Text also gets unbounded width. It lays out on one long line at 520 × 20, which exceeds what Row has.'],
        expanded
          ? [2, ['', 'w = 360', '0 ≤ w ≤ 328', '0 ≤ w ≤ ∞', 'w = 240', '0 ≤ w ≤ ∞'], ['', '360 × 80', '328 × 48', '40 × 40', '240 × 40', '48 × 48'], 'Row reports 328 × 48 (the tallest child), Padding adds its 16 and reports 360 × 80. Finally parents set positions: Icon at x = 0, Text at x = 40, IconButton at x = 280.']
          : [2, ['', 'w = 360', '0 ≤ w ≤ 328', '0 ≤ w ≤ ∞', '0 ≤ w ≤ ∞', '0 ≤ w ≤ ∞'], ['', '360 × 80', '328 × 48', '40 × 40', '520 × 20', '48 × 48'], 'Children need 40 + 520 + 48 = 608, while the Row is only 328 wide: “RenderFlex overflowed by 280 pixels”. The Row can\'t grow because its parent set the limit, so wrap Text in Expanded or Flexible.']
      ];
      const [exLab, ex] = check(' Wrap Text in Expanded', true, () => s.reset());
      const body = h('div', {}), bar = h('div', { class: 'cx-bar' }), note = h('p', { class: 'viz-note' });
      const s = stepper(() => 5, i => {
        const [focus, cons, sizes, text] = steps(ex.checked)[i];
        body.replaceChildren(tableWrap('Widget constraints', h('table', { class: 't' },
          h('thead', {}, h('tr', {}, ['Widget', 'Constraints received ↓', 'Size reported ↑'].map(c => h('th', { scope: 'col' }, c)))),
          h('tbody', {}, rows.map((r, j) => h('tr', { class: j === focus ? 'cx-cur' : '' },
            h('td', {}, h('code', {}, (j > 2 ? '      ' : j === 2 ? '    ' : j === 1 ? '  ' : '') + r)), h('td', {}, cons[j] || '—'), h('td', {}, sizes[j] || '—')))))));
        const textW = sizes[4] ? parseInt(sizes[4], 10) : 0, over = textW > 240;
        bar.replaceChildren(...(i < 2 ? [h('span', { class: 'muted' }, T('The Row’s 328 pixels'))] : [
          h('i', { style: { width: 40 / 328 * 100 + '%' } }, '40'),
          textW ? h('i', { class: over ? 'over' : 'flex', style: { width: Math.min(textW, 240) / 328 * 100 + '%' } }, over ? '520 →' : '240') : h('i', { class: 'free', style: { width: 240 / 328 * 100 + '%' } }, '?'),
          h('i', { style: { width: 48 / 328 * 100 + '%' } }, '48')]));
        note.textContent = T(text);
      });
      el.append(h('div', { class: 'viz-ctl' }, exLab), s.el, body, bar, note);
      s.start();
    }
  };

  // ---------- rebuilds ----------
  VIZ.frebuild = {
    ...meta, title: 'Rebuild explorer',
    desc: 'Tap a widget to call setState there. Everything that flashes ran build() again. Then mark the unchanged children const and try once more.',
    mount(el) {
      const tree: Record<string, string[]> = { ProductsPage: ['AppBar', 'ProductList', 'CartBadge'], ProductList: ['Tile A', 'Tile B', 'Tile C'] };
      const count: Record<string, number> = {}, nodes: Record<string, HTMLButtonElement> = {};
      const note = h('p', { class: 'viz-note' }, 'Tap any widget.');
      const [constLab, cons] = check(' Children are const (configuration unchanged)', false, () => reset());
      const label = (name: string) => { if (nodes[name].lastChild) nodes[name].lastChild.textContent = `${T('builds:')} ${count[name]}`; };
      const build = (name: string, isRoot: boolean, hit: string[], skipped: string[]) => {
        if (!isRoot && cons.checked) { skipped.push(name); nodes[name].classList.add('skip'); return; }
        count[name]++; label(name); hit.push(name);
        const n = nodes[name]; n.classList.remove('flash-r'); void n.offsetWidth; n.classList.add('flash-r');
        (tree[name] || []).forEach(c => build(c, false, hit, skipped));
      };
      const tap = (name: string) => {
        Object.values(nodes).forEach(n => n.classList.remove('skip'));
        const hit: string[] = [], skipped: string[] = [];
        build(name, true, hit, skipped);
        note.textContent = T('setState in {name} → {n} build() call(s)', { name, n: hit.length }) +
          T(skipped.length ? ', skipping {n} unchanged const subtree(s).' : hit.length > 1 ? ': this widget and its subtree. Push state down or use BlocSelector to rebuild less.' : '. Parents and siblings never rebuild.', { n: skipped.length });
      };
      const mk = (name: string): HTMLButtonElement => { count[name] = 1; return nodes[name] = h('button', { type: 'button', class: 'comp', onclick: () => tap(name) }, name, h('small', {}, T('builds:') + ' 1')); };
      const reset = () => { Object.keys(nodes).forEach(n => { count[n] = 1; label(n); nodes[n].classList.remove('skip'); }); note.textContent = T('Tap any widget.'); };
      const treeEl = h('div', { class: 'tree' }, h('div', { class: 'tree-r' }, mk('ProductsPage')), h('div', { class: 'tree-r' }, tree.ProductsPage.map(mk)), h('div', { class: 'tree-r' }, tree.ProductList.map(mk)));
      treeWire(treeEl, [[nodes.ProductsPage, [nodes.AppBar, nodes.ProductList, nodes.CartBadge]], [nodes.ProductList, [nodes['Tile A'], nodes['Tile B'], nodes['Tile C']]]]);
      el.append(h('div', { class: 'viz-ctl' }, constLab, btn('Reset counts', reset, 'ghost')),
        treeEl,
        h('p', { class: 'muted' }, 'ProductsPage contains AppBar, ProductList and CartBadge. ProductList contains the three tiles.'), note);
    }
  };

  // ---------- three trees ----------
  VIZ.threetrees = {
    ...meta, title: 'Widget, element and render trees',
    desc: 'Five moments in the life of a small screen. Watch which of the three trees is recreated, which is updated, and where State lives.',
    mount(el) {
      // cell: [text, 'new' | 'upd' | 'gone' | '']
      type TreeTag = 'new' | 'upd' | 'gone' | '';
      type TreeCol = 'w' | 'e' | 'r';
      type TreeStep = Record<TreeCol, [string, TreeTag][]> & { note: string };
      const steps: TreeStep[] = [
        {
          w: [['Column', 'new'], ['Text("0")', 'new'], ['Counter', 'new']], e: [['ColumnElement', 'new'], ['TextElement', 'new'], ['CounterElement + State(count 0)', 'new']], r: [['RenderFlex', 'new'], ['RenderParagraph "0"', 'new'], ['RenderBox', 'new']],
          note: 'First build. Widgets are created, each is inflated into an element, and elements create render objects. The State object is created and held by its element.'
        },
        {
          w: [['Column', 'new'], ['Text("1")', 'new'], ['Counter', 'new']], e: [['ColumnElement', ''], ['TextElement', 'upd'], ['CounterElement + State(count 1)', 'upd']], r: [['RenderFlex', ''], ['RenderParagraph "1"', 'upd'], ['RenderBox', '']],
          note: 'setState: every widget is a new object, yet each element sees the same type in the same slot. It stays alive, keeps its State, and updates only the changed render object.'
        },
        {
          w: [['Column', 'new'], ['Icon(star)', 'new'], ['Counter', 'new']], e: [['ColumnElement', ''], ['IconElement', 'new'], ['CounterElement + State(count 1)', '']], r: [['RenderFlex', ''], ['RenderIcon', 'new'], ['RenderBox', '']],
          note: 'A different widget TYPE appears at position 1. The element cannot update itself to another type: the old element and render object are discarded and new ones created. Any State below that point would be lost.'
        },
        {
          w: [['Column', 'new'], ['Counter B', 'new'], ['Counter A', 'new']], e: [['ColumnElement', ''], ['Element #1 + State(A’s count)', 'gone'], ['Element #2 + State(B’s count)', 'gone']], r: [['RenderFlex', ''], ['RenderBox', ''], ['RenderBox', '']],
          note: 'Two stateful siblings swap places, WITHOUT keys. Elements match by position and type only, so each element stays where it was: B is now shown with A’s count. This is the classic reordered-list bug.'
        },
        {
          w: [['Column', 'new'], ['Counter B (key: b)', 'new'], ['Counter A (key: a)', 'new']], e: [['ColumnElement', ''], ['Element b + State(B’s count)', 'upd'], ['Element a + State(A’s count)', 'upd']], r: [['RenderFlex', ''], ['RenderBox', 'upd'], ['RenderBox', 'upd']],
          note: 'The same swap WITH keys: elements match by key, so each element moves with its widget alongside its State and render object. Keys tell Flutter which widget is which.'
        }
      ];
      const cols: [TreeCol, string, string][] = [['w', 'Widget tree', 'immutable configuration'], ['e', 'Element tree', 'long-lived, holds State'], ['r', 'Render tree', 'layout and paint']];
      const boxes: [TreeCol, HTMLElement, HTMLElement][] = cols.map(([k, title, sub]) => { const b = h('div', {}); return [k, h('div', { class: 'viz-box' }, h('h4', {}, title), h('p', { class: 'muted', style: { margin: '0 0 .5rem', fontSize: '.8rem' } }, sub), b), b]; });
      const note = h('p', { class: 'viz-note' });
      const tag: Record<TreeTag, string> = { new: 'created', upd: 'updated', gone: 'wrong State!', '': 'kept' };
      const s = stepper(() => steps.length, i => {
        boxes.forEach(([k, , b]) => b.replaceChildren(...steps[i][k].map(([text, st], j) => h('div', { class: 'slot tt-' + (st || 'kept'), style: { marginLeft: j ? '1rem' : 0 } }, h('span', {}, text), h('b', {}, tag[st])))));
        note.textContent = T(steps[i].note);
      });
      el.append(s.el, h('div', { class: 'viz-cols three' }, boxes.map(b => b[1])), note);
      s.start();
    }
  };
