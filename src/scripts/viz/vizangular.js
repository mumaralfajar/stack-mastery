// Angular visualizations: Signal dependency graph & Change detection explorer (Eager vs OnPush vs Zoneless Signals).
(() => {
  const VIZ = window.VIZ = window.VIZ || {}, T = window.t;
  const meta = { track: 'angular', trackName: 'Angular' };
  const btn = (label, onclick, cls) => h('button', { type: 'button', class: 'btn sm ' + (cls || ''), onclick }, label);
  const check = (label, on, onchange) => { const c = h('input', { type: 'checkbox', onchange }); c.checked = on; return [h('label', {}, c, label), c]; };

  // ---------- Signal dependency graph ----------
  VIZ.ngsignals = {
    ...meta, title: 'Signal dependency graph',
    desc: 'Change a source signal and watch which computed nodes recalculate, which stay cached, and why diamond graphs never glitch.',
    mount(el) {
      let price = 100, qty = 2, coupon = false;
      let subVal = 200, shipVal = 0, totalVal = 200;
      const evals = { subtotal: 1, shipping: 1, total: 1, effect: 1 };
      let states = { subtotal: 'recomputed', shipping: 'recomputed', total: 'recomputed', effect: 'ran' };
      let noteText = 'Initial evaluation: subtotal = 200, shipping = 0 (free over 200), total = 200.';

      const apply = (nextPrice, nextQty, nextCoupon, changed) => {
        const prevPrice = price, prevQty = qty, prevCoupon = coupon;
        const wasTrackingCoupon = prevQty > 0;
        price = nextPrice; qty = nextQty; coupon = nextCoupon;
        states = { subtotal: 'cached', shipping: 'cached', total: 'cached', effect: 'skipped' };

        if (changed === 'coupon' && !wasTrackingCoupon) {
          noteText = T('qty() is 0, so discount short-circuited before reading hasCoupon(). Because hasCoupon is not a live dependency, nothing recalculated.');
          draw();
          return;
        }

        const prevSub = subVal, prevShip = shipVal, prevTotal = totalVal;
        if (price !== prevPrice || qty !== prevQty) {
          evals.subtotal++;
          subVal = price * qty;
          states.subtotal = subVal === prevSub ? 'same value' : 'recomputed';

          if (subVal !== prevSub) {
            evals.shipping++;
            shipVal = (subVal === 0 || subVal >= 200) ? 0 : 20;
            states.shipping = shipVal === prevShip ? 'same value' : 'recomputed';
          }
        }

        const needTotal = states.subtotal === 'recomputed' || states.shipping === 'recomputed' || qty !== prevQty || (qty > 0 && coupon !== prevCoupon);
        if (needTotal) {
          evals.total++;
          const disc = qty > 0 && coupon ? 15 : 0;
          totalVal = subVal + shipVal - disc;
          states.total = totalVal === prevTotal ? 'same value' : 'recomputed';
        }

        if (totalVal !== prevTotal) {
          evals.effect++;
          states.effect = 'ran';
        }

        if (changed === 'price' && qty === 0) {
          noteText = T('subtotal() ran (price × 0 = 0, same value as before), so shipping(), total() and effect() stayed cached and skipped.');
        } else if (changed === 'coupon') {
          noteText = T('Only hasCoupon() changed: subtotal() and shipping() stayed cached, while total() and effect() updated once.');
        } else if (states.shipping === 'same value' && states.total === 'recomputed') {
          noteText = T('Diamond update: subtotal and shipping settled before total() ran once with no glitch, and effect() saw only the final total ({total}).', { total: totalVal });
        } else {
          noteText = T('Recalculated {n} node(s), so total is now {total}.', {
            n: ['subtotal', 'shipping', 'total'].filter(k => states[k] !== 'cached').length,
            total: totalVal
          });
        }
        draw();
      };

      const ctl = h('div', { class: 'viz-ctl' });
      const graph = h('div', { class: 'ng-graph' });
      const note = h('p', { class: 'viz-note', 'aria-live': 'polite' });

      const slot = (name, val, badge, cls, extra, eq) => h('div', { class: 'slot ' + (cls || '') },
        h('div', { class: 'slot-top' },
          h('span', {}, name, extra ? h('small', { class: 'muted' }, ' · ' + extra) : null),
          h('b', {}, String(val), ' ', h('span', { class: 'ng-tag' }, T(badge)))),
        eq ? h('code', { class: 'viz-eq' }, eq) : null);

      const draw = () => {
        const couponTracked = qty > 0;
        const p100 = h('button', { type: 'button', 'aria-pressed': String(price === 100), class: price === 100 ? 'on' : '', onclick: () => apply(100, qty, coupon, 'price') }, T('price = {n}', { n: 100 }));
        const p150 = h('button', { type: 'button', 'aria-pressed': String(price === 150), class: price === 150 ? 'on' : '', onclick: () => apply(150, qty, coupon, 'price') }, T('price = {n}', { n: 150 }));
        const qBtns = [0, 1, 2, 3].map(n => h('button', { type: 'button', 'aria-pressed': String(qty === n), class: qty === n ? 'on' : '', onclick: () => apply(price, n, coupon, 'qty') }, T('qty = {n}', { n })));
        const [cpLab] = check('hasCoupon ($15 off when qty > 0)', coupon, e => apply(price, qty, e.target.checked, 'coupon'));

        ctl.replaceChildren(
          h('div', { class: 'chips' }, p100, p150, qBtns),
          cpLab,
          btn('Reset', () => {
            price = 100; qty = 2; coupon = false; subVal = 200; shipVal = 0; totalVal = 200;
            Object.keys(evals).forEach(k => evals[k] = 1);
            states = { subtotal: 'recomputed', shipping: 'recomputed', total: 'recomputed', effect: 'ran' };
            noteText = 'Initial evaluation: subtotal = 200, shipping = 0 (free over 200), total = 200.';
            draw();
          }, 'ghost')
        );

        const tagCls = st => st === 'recomputed' || st === 'ran' ? 'tt-new' : st === 'same value' ? 'tt-upd' : 'tt-kept';
        graph.replaceChildren(
          h('div', { class: 'viz-box' },
            h('h4', {}, '1 · Source signals'),
            slot('price()', price, 'source'),
            slot('qty()', qty, 'source'),
            slot('hasCoupon()', coupon, couponTracked ? 'tracked' : 'untracked', couponTracked ? '' : 'tt-kept')),
          h('div', { class: 'viz-box' },
            h('h4', {}, '2 · Computed (lazy & memoized)'),
            slot('subtotal()', subVal, states.subtotal, tagCls(states.subtotal), T('runs:') + ' ' + evals.subtotal, '() => price() * qty()'),
            slot('shipping()', shipVal, states.shipping, tagCls(states.shipping), T('runs:') + ' ' + evals.shipping, '() => sub() === 0 || sub() >= 200 ? 0 : 20'),
            slot('total()', totalVal, states.total, tagCls(states.total), T('runs:') + ' ' + evals.total, '() => sub() + ship() - (qty() > 0 && hasCoupon() ? 15 : 0)')),
          h('div', { class: 'viz-box' },
            h('h4', {}, '3 · Effect (side effect)'),
            slot('effect()', `"total=${totalVal}"`, states.effect, tagCls(states.effect), T('runs:') + ' ' + evals.effect, 'effect(() => log(total()))'))
        );
        note.textContent = T(noteText);
      };

      el.append(ctl, graph, note);
      draw();
    }
  };

  // ---------- Change detection explorer ----------
  VIZ.ngcd = {
    ...meta, title: 'Change detection explorer',
    desc: 'Click a component to trigger an update. Compare legacy Eager (Zone.js), OnPush, and Zoneless + Signals.',
    mount(el) {
      const parentOf = { Header: 'App', ProductList: 'App', CartBadge: 'App', 'Card A': 'ProductList', 'Card B': 'ProductList', 'Card C': 'ProductList' };
      const all = ['App', 'Header', 'ProductList', 'CartBadge', 'Card A', 'Card B', 'Card C'];
      const modes = [
        ['eager', 'Eager (Zone.js)'],
        ['onpush', 'OnPush'],
        ['zoneless', 'Zoneless + Signal']
      ];
      let mode = 'zoneless';
      const checks = {}, status = {}, nodes = {};
      const sharedSubs = new Set(['Card B', 'CartBadge']);
      const note = h('p', { class: 'viz-note', 'aria-live': 'polite' }, 'Click any component.');
      const [sharedLab, shared] = check('Show shared CartSignal subscribers (Card B & CartBadge)', true, () => reset());
      const modeBtns = {};

      const label = name => {
        const subTag = shared.checked && sharedSubs.has(name) ? ' [CartSignal]' : '';
        nodes[name].lastChild.textContent = `${T('checks:')} ${checks[name]}${status[name] ? ' · ' + T(status[name]) : ''}${subTag}`;
      };

      const ancestors = name => {
        const path = new Set();
        let cur = name;
        while (cur) { path.add(cur); cur = parentOf[cur]; }
        return path;
      };

      const trigger = (name, fromSignal = false) => {
        const checked = new Set();
        if (mode === 'eager') {
          all.forEach(n => checked.add(n));
        } else if (mode === 'onpush') {
          if (fromSignal) sharedSubs.forEach(s => ancestors(s).forEach(n => checked.add(n)));
          else {
            ancestors(name).forEach(n => checked.add(n));
            if (shared.checked && sharedSubs.has(name)) ancestors('CartBadge').forEach(n => checked.add(n));
          }
        } else {
          if (fromSignal) sharedSubs.forEach(s => checked.add(s));
          else {
            checked.add(name);
            if (shared.checked && sharedSubs.has(name)) sharedSubs.forEach(s => checked.add(s));
          }
        }

        all.forEach(n => {
          const elNode = nodes[n];
          elNode.classList.remove('flash-r', 'skip');
          if (checked.has(n)) {
            checks[n]++;
            status[n] = 'checked';
            void elNode.offsetWidth;
            elNode.classList.add('flash-r');
          } else {
            status[n] = 'skipped';
            elNode.classList.add('skip');
          }
          label(n);
        });

        const count = checked.size;
        const skipped = all.length - count;
        if (mode === 'eager') {
          note.textContent = T('Eager (Zone.js): event in {name} checked all {n} components from the root down.', { name, n: count });
        } else if (mode === 'onpush') {
          note.textContent = T('OnPush: checked {n} view(s) along the ancestor path and skipped {s} other views.', { n: count, s: skipped });
        } else {
          note.textContent = T('Zoneless + Signal: refreshed only {n} view(s) reading the changed signal ({list}), skipping {s} other views.', {
            n: count, list: [...checked].join(', '), s: skipped
          });
        }
      };

      const setMode = m => {
        mode = m;
        Object.entries(modeBtns).forEach(([k, b]) => {
          const on = k === m;
          b.classList.toggle('on', on);
          b.setAttribute('aria-pressed', String(on));
        });
        reset();
      };

      const reset = () => {
        all.forEach(n => {
          checks[n] = 1; status[n] = '';
          if (nodes[n]) { nodes[n].classList.remove('skip', 'flash-r'); label(n); }
        });
        note.textContent = T('Click any component.');
      };

      const mk = name => {
        checks[name] = 1; status[name] = '';
        return nodes[name] = h('button', { type: 'button', class: 'comp', onclick: () => trigger(name) },
          name, h('small', {}, T('checks:') + ' 1'));
      };

      const modeRow = h('div', { class: 'chips' }, modes.map(([k, lbl]) => {
        const b = h('button', { type: 'button', class: k === mode ? 'on' : '', 'aria-pressed': String(k === mode), onclick: () => setMode(k) }, lbl);
        return modeBtns[k] = b;
      }));

      const treeEl = h('div', { class: 'tree' },
        h('div', { class: 'tree-r' }, mk('App')),
        h('div', { class: 'tree-r' }, ['Header', 'ProductList', 'CartBadge'].map(mk)),
        h('div', { class: 'tree-r' }, ['Card A', 'Card B', 'Card C'].map(mk)));
      window.treeWire(treeEl, [[nodes.App, [nodes.Header, nodes.ProductList, nodes.CartBadge]], [nodes.ProductList, [nodes['Card A'], nodes['Card B'], nodes['Card C']]]]);
      el.append(
        h('div', { class: 'viz-ctl' }, modeRow, sharedLab, btn('Update CartSignal', () => { shared.checked = true; trigger('CartBadge', true); }), btn('Reset counts', reset, 'ghost')),
        treeEl,
        h('p', { class: 'muted' }, 'App contains Header, ProductList and CartBadge. ProductList contains the three product cards.'),
        note
      );
    }
  };
})();
