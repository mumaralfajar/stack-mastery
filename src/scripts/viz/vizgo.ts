// Interactive Go visualizations: slices/aliasing, interface nil trap, goroutines/channels, context tree.
import { codeBlock, h, tableWrap } from '../../lib/dom.ts';
import { t as T } from '../../lib/i18n.ts';
import { VIZ } from './registry.ts';
  const meta = { track: 'go', trackName: 'Go' };
  const btn = (label: string, onclick: () => void, cls?: string): HTMLButtonElement => h('button', { type: 'button', class: 'btn sm ' + (cls || ''), onclick }, label);
  const pills = <T extends string>(opts: [T, string][], cur: T, onPick: (k: T) => void): HTMLElement => {
    const row = h('div', { class: 'chips' });
    const btns = {} as Record<T, HTMLButtonElement>;
    for (const [k, lbl] of opts) {
      btns[k] = h('button', {
        type: 'button', class: k === cur ? 'on' : '', 'aria-pressed': String(k === cur),
        onclick: () => {
          (Object.entries(btns) as [T, HTMLButtonElement][]).forEach(([x, b]) => { b.classList.toggle('on', x === k); b.setAttribute('aria-pressed', String(x === k)); });
          onPick(k);
        }
      }, lbl);
      row.append(btns[k]);
    }
    return row;
  };
  function stepper(countFn: () => number, draw: (i: number) => void) {
    let i = 0;
    const lbl = h('span', { class: 'muted' });
    const back = btn('← Back', () => { i--; upd(); }, 'ghost');
    const next = btn('Next →', () => { i++; upd(); });
    const reset = () => { i = 0; upd(); };
    const upd = () => {
      const n = countFn();
      i = Math.min(i, n - 1);
      lbl.textContent = T('Step {i} of {n}', { i: i + 1, n });
      back.disabled = i <= 0;
      next.disabled = i >= n - 1;
      draw(i);
    };
    return { el: h('div', { class: 'viz-ctl' }, back, next, btn('Reset', reset, 'ghost'), lbl), reset, start: upd };
  }

  // ---------- 1. Slice header, capacity & append aliasing ----------
  VIZ.goslices = {
    ...meta,
    title: 'Slice header, capacity, and aliasing',
    desc: 'Compare a[0:2] (keeps cap = 4 and overwrites a[2]) with a full-slice expression a[0:2:2] so append allocates a new array.',
    mount(el) {
      type SliceMode = 'alias' | 'safe';
      interface SliceStep { line: string; aHdr: string; subHdr: string; arrA: string[]; arrB: string[] | null; hotIdx: number; badIdx: number; note: string; }
      let mode: SliceMode = 'alias';
      const box = h('div', {}), note = h('p', { class: 'viz-note', 'aria-live': 'polite' });
      const steps: Record<SliceMode, SliceStep[]> = {
        alias: [
          { line: 'a := []int{10, 20, 30, 40}', aHdr: 'ptr=#A, len=4, cap=4', subHdr: '—', arrA: ['10', '20', '30', '40'], arrB: null, hotIdx: -1, badIdx: -1, note: 'a points to backing array #A of 4 ints. A slice header holds 3 words: pointer, len, cap.' },
          { line: 'sub := a[0:2]', aHdr: 'ptr=#A, len=4, cap=4', subHdr: 'ptr=#A, len=2, cap=4', arrA: ['10', '20', '30', '40'], arrB: null, hotIdx: 1, badIdx: -1, note: 'sub shares array #A. Its len is 2, while cap is still 4, so two spare slots remain inside a.' },
          { line: 'sub = append(sub, 99)', aHdr: 'ptr=#A, len=4, cap=4', subHdr: 'ptr=#A, len=3, cap=4', arrA: ['10', '20', '99!', '40'], arrB: null, hotIdx: -1, badIdx: 2, note: 'Because sub has len (2) < cap (4), append reuses #A and overwrites a[2] with 99.' }
        ],
        safe: [
          { line: 'a := []int{10, 20, 30, 40}', aHdr: 'ptr=#A, len=4, cap=4', subHdr: '—', arrA: ['10', '20', '30', '40'], arrB: null, hotIdx: -1, badIdx: -1, note: 'a owns backing array #A with 4 elements.' },
          { line: 'sub := a[0:2:2]', aHdr: 'ptr=#A, len=4, cap=4', subHdr: 'ptr=#A, len=2, cap=2', arrA: ['10', '20', '30', '40'], arrB: null, hotIdx: 1, badIdx: -1, note: 'Full-slice expression [low:high:max] sets cap = max - low = 2, leaving no spare capacity on sub.' },
          { line: 'sub = append(sub, 99)', aHdr: 'ptr=#A, len=4, cap=4', subHdr: 'ptr=#B, len=3, cap=4', arrA: ['10', '20', '30', '40'], arrB: ['10', '20', '99', '—'], hotIdx: 2, badIdx: -1, note: 'Now len == cap, so append allocates a new backing array #B and keeps a[2] at 30.' }
        ]
      };
      const s = stepper(() => steps[mode].length, i => {
        const st = steps[mode][i];
        box.replaceChildren(
          codeBlock(st.line, 'go'),
          h('div', { class: 'viz-cols', style: { marginTop: '.7rem' } },
            h('div', { class: 'viz-box' },
              h('h4', {}, 'Slice headers (stack)'),
              h('div', { class: 'slot' }, h('span', {}, 'a'), h('b', {}, st.aHdr)),
              h('div', { class: 'slot ' + (st.badIdx >= 0 ? 'tt-gone' : st.arrB ? 'tt-new' : 'tt-upd') }, h('span', {}, 'sub'), h('b', {}, st.subHdr))),
            h('div', { class: 'viz-box' },
              h('h4', {}, 'Backing arrays (memory)'),
              h('p', { class: 'muted', style: { marginBottom: '.3rem' } }, '#A (a)'),
              h('div', { class: 'cells' }, st.arrA.map((v, j) => h('span', { class: 'cell' + (j === st.badIdx ? ' hit' : j <= st.hotIdx ? ' look' : '') }, `[${j}] ${v}`))),
              st.arrB ? [
                h('p', { class: 'muted', style: { margin: '.4rem 0 .3rem' } }, '#B (sub new allocation)'),
                h('div', { class: 'cells' }, st.arrB.map((v, j) => h('span', { class: 'cell' + (j === 2 ? ' hit' : v === '—' ? ' out' : '') }, `[${j}] ${v}`)))
              ] : null)));
        note.textContent = T(st.note);
      });
      const ctl = pills<SliceMode>([['alias', 'Normal slice a[0:2] (aliasing bug)'], ['safe', 'Full slice a[0:2:2] (safe copy)']], mode, m => { mode = m; s.reset(); });
      el.append(ctl, s.el, box, note);
      s.start();
    }
  };

  // ---------- 2. Interface fat pointer & typed-nil trap ----------
  VIZ.goiface = {
    ...meta,
    title: 'Interfaces and the typed-nil trap',
    desc: 'Each interface value holds two words (dynamic type, data pointer). Compare returning a typed nil *ValidationError pointer against returning nil.',
    mount(el) {
      type NilMode = 'typednil' | 'truenil';
      interface NilStep { code: string; typeWord: string; valWord: string; eqNil: string; cls: string; note: string; }
      let mode: NilMode = 'typednil';
      const box = h('div', {}), note = h('p', { class: 'viz-note', 'aria-live': 'polite' });
      const steps: Record<NilMode, NilStep[]> = {
        typednil: [
          { code: 'var err *ValidationError = nil\nreturn err   // signature returns `error` interface', typeWord: '*ValidationError', valWord: 'nil (0x0)', eqNil: 'false', cls: 'tt-gone', note: 'Go wraps err into an `error` interface box: the type word becomes *ValidationError and the data word is nil.' },
          { code: 'if err := validate(input); err != nil {\n    return err   // BUG: enters even when valid!\n}', typeWord: '*ValidationError', valWord: 'nil (0x0)', eqNil: 'false (!= nil)', cls: 'tt-gone', note: 'An interface equals nil only when both words are nil. Here type != nil, so err != nil is true and err.Error() panics on the nil pointer.' }
        ],
        truenil: [
          { code: 'var err *ValidationError = nil\nif err == nil {\n    return nil   // return untyped nil directly\n}', typeWord: 'nil', valWord: 'nil (0x0)', eqNil: 'true', cls: 'tt-new', note: 'Returning untyped `nil` leaves both words empty: type = nil and data = nil.' },
          { code: 'if err := validate(input); err != nil {\n    return err   // skipped\n}', typeWord: 'nil', valWord: 'nil (0x0)', eqNil: 'true (== nil)', cls: 'tt-new', note: 'Because both words of the interface are nil, err != nil evaluates to false.' }
        ]
      };
      const s = stepper(() => steps[mode].length, i => {
        const st = steps[mode][i];
        box.replaceChildren(
          codeBlock(st.code, 'go'),
          h('div', { class: 'viz-cols', style: { marginTop: '.7rem' } },
            h('div', { class: 'viz-box' },
              h('h4', {}, 'Interface value (2 words)'),
              h('div', { class: 'slot ' + st.cls }, h('span', {}, 'Word 1 · dynamic type'), h('b', {}, st.typeWord)),
              h('div', { class: 'slot' }, h('span', {}, 'Word 2 · data pointer'), h('b', {}, st.valWord))),
            h('div', { class: 'viz-box' },
              h('h4', {}, 'Caller check'),
              h('div', { class: 'slot ' + st.cls }, h('span', {}, 'err == nil'), h('b', {}, st.eqNil)))));
        note.textContent = T(st.note);
      });
      const ctl = pills<NilMode>([['typednil', 'Typed nil pointer (trap)'], ['truenil', 'Untyped nil (correct)']], mode, m => { mode = m; s.reset(); });
      el.append(ctl, s.el, box, note);
      s.start();
    }
  };

  // ---------- 3. Goroutines, channels & select ----------
  VIZ.goroutine = {
    ...meta,
    title: 'Goroutines, channels, and select',
    desc: 'Step through unbuffered handoffs, buffered queues, and select waiting on ctx.Done() timeouts.',
    mount(el) {
      type ChanMode = 'unbuf' | 'buf' | 'select';
      interface ChanStep { prod: string; ch: string; cons: string; pCls: string; cCls: string; note: string; }
      let mode: ChanMode = 'unbuf';
      const box = h('div', {}), note = h('p', { class: 'viz-note', 'aria-live': 'polite' });
      const steps: Record<ChanMode, ChanStep[]> = {
        unbuf: [
          { prod: 'Running: prepares "order-1"', ch: 'Empty (cap 0)', cons: 'Idle', pCls: 'tt-upd', cCls: '', note: 'Unbuffered make(chan string) holds zero items, so sender and receiver must meet at the same time.' },
          { prod: 'BLOCKED on ch <- "order-1"', ch: 'Waiting for receiver', cons: 'Preparing…', pCls: 'tt-gone', cCls: '', note: 'The sender pauses at ch <- because no goroutine is reading yet.' },
          { prod: 'Unblocked! Both sync', ch: 'Direct handoff: "order-1"', cons: 'Receiving v := <-ch', pCls: 'tt-new', cCls: 'tt-new', note: 'When the consumer reaches <-ch, the value transfers directly and both goroutines continue.' }
        ],
        buf: [
          { prod: 'Sends "job-1" -> continues', ch: 'Buffer [job-1, _] (1/2)', cons: 'Busy processing previous', pCls: 'tt-new', cCls: '', note: 'With buffer capacity 2, the sender deposits job-1 without waiting for the consumer.' },
          { prod: 'Sends "job-2" -> continues', ch: 'Buffer [job-1, job-2] (2/2 full)', cons: 'Busy', pCls: 'tt-upd', cCls: '', note: 'The buffer is now full (2/2). Another send will block until a slot opens.' },
          { prod: 'BLOCKED on ch <- "job-3"', ch: 'Drains "job-1" -> [job-2, _]', cons: 'Receives "job-1"', pCls: 'tt-gone', cCls: 'tt-new', note: 'A bounded buffer absorbs short bursts and applies backpressure once every slot is full.' }
        ],
        select: [
          { prod: 'Slow worker needs 800 ms…', ch: 'ch empty · ctx timeout 200 ms', cons: 'Waiting inside select { ... }', pCls: 'tt-upd', cCls: 'tt-upd', note: 'select blocks until either ch delivers a value or ctx.Done() closes.' },
          { prod: 'Still waiting on slow RPC', ch: '200 ms elapsed -> ctx.Done() closes', cons: 'select picks case <-ctx.Done()', pCls: 'tt-gone', cCls: 'tt-new', note: 'At 200 ms the context deadline expires, select chooses ctx.Done(), and the handler returns 504 instead of hanging.' }
        ]
      };
      const s = stepper(() => steps[mode].length, i => {
        const st = steps[mode][i];
        box.replaceChildren(h('div', { class: 'rxjs-board' },
          h('div', { class: 'slot ' + st.pCls }, h('span', {}, 'Sender goroutine'), h('b', {}, T(st.prod))),
          h('div', { class: 'slot' }, h('span', {}, 'Channel state'), h('b', {}, T(st.ch))),
          h('div', { class: 'slot ' + st.cCls }, h('span', {}, 'Receiver / select'), h('b', {}, T(st.cons)))));
        note.textContent = T(st.note);
      });
      const ctl = pills<ChanMode>([['unbuf', 'Unbuffered (sync handoff)'], ['buf', 'Buffered (cap = 2)'], ['select', 'select + ctx.Done()']], mode, m => { mode = m; s.reset(); });
      el.append(ctl, s.el, box, note);
      s.start();
    }
  };

  // ---------- 4. context.Context cancellation tree ----------
  VIZ.gocontext = {
    ...meta,
    title: 'context.Context cancellation tree',
    desc: 'Compare passing r.Context() into child goroutines and db.QueryContext with breaking the chain using context.Background().',
    mount(el) {
      type CtxMode = 'prop' | 'leak';
      interface CtxStep { req: string; work: string; db: string; rC: string; wC: string; dC: string; note: string; }
      let mode: CtxMode = 'prop';
      const box = h('div', {}), note = h('p', { class: 'viz-note', 'aria-live': 'polite' });
      const steps: Record<CtxMode, CtxStep[]> = {
        prop: [
          { req: 'Active (GET /orders)', work: 'Running with timeout ctx (200 ms)', db: 'db.QueryContext(ctx, ...)', rC: 'tt-upd', wC: 'tt-upd', dC: 'tt-upd', note: 'The handler wraps r.Context() with WithTimeout and passes it as the first argument to every layer.' },
          { req: 'Client closes connection', work: '<-ctx.Done() signal received', db: 'QueryContext aborts SQL query', rC: 'tt-gone', wC: 'tt-new', dC: 'tt-new', note: 'When the client disconnects, Go closes ctx.Done(). Both the worker and database driver stop their work.' },
          { req: 'Returned · defer cancel()', work: 'Exited (0 leaked goroutines)', db: 'Connection returned to pool', rC: 'tt-new', wC: 'tt-new', dC: 'tt-new', note: 'Every spawned goroutine exited and defer cancel() freed the timeout timer.' }
        ],
        leak: [
          { req: 'Active (GET /orders)', work: 'Uses context.Background() (detached)', db: 'db.QueryContext(bg, ...)', rC: 'tt-upd', wC: 'tt-gone', dC: 'tt-gone', note: "Calling context.Background() mid-request cuts the cancellation tree, so child calls don't see client disconnects." },
          { req: 'Client closes connection', work: 'Still running (ignores r.Context())', db: 'Slow query keeps DB conn busy', rC: 'tt-gone', wC: 'tt-gone', dC: 'tt-gone', note: 'Even after the HTTP handler exits, the worker and SQL query keep holding CPU time and a pool connection.' },
          { req: '1000 timeouts -> pool exhausted', work: 'Goroutines leaked in memory', db: 'max_conns saturated', rC: 'tt-gone', wC: 'tt-gone', dC: 'tt-gone', note: 'Under load, detached contexts leave leaked goroutines running and exhaust the database connection pool.' }
        ]
      };
      const s = stepper(() => steps[mode].length, i => {
        const st = steps[mode][i];
        box.replaceChildren(tableWrap('Context propagation chain', h('table', { class: 't' },
          h('thead', {}, h('tr', {}, ['Layer', 'State'].map(c => h('th', { scope: 'col' }, c)))),
          h('tbody', {}, [
            ['HTTP handler (r.Context)', st.req, st.rC],
            ['Service worker', st.work, st.wC],
            ['Database call', st.db, st.dC]
          ].map(([layer, val, cls]) => h('tr', { class: cls === 'tt-gone' ? 'dim' : cls === 'tt-upd' ? 'hl' : '' },
            h('td', {}, h('code', {}, layer)), h('td', {}, T(val))))))));
        note.textContent = T(st.note);
      });
      const ctl = pills<CtxMode>([['prop', 'Propagates r.Context() (safe)'], ['leak', 'Uses context.Background() (leaks)']], mode, m => { mode = m; s.reset(); });
      el.append(ctl, s.el, box, note);
      s.start();
    }
  };
