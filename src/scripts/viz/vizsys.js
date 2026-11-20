// Interactive visualizers for the System Design track.
(() => {
  const VIZ = window.VIZ = window.VIZ || {}, T = window.t;
  const meta = { track: 'sysdesign', trackName: 'System Design' };

  function pills(items, active, onPick, ariaLabel) {
    const row = h('div', { class: 'viz-ctl', role: 'group', 'aria-label': ariaLabel });
    const btns = items.map(([k, label]) => {
      const b = h('button', {
        type: 'button',
        class: 'pill' + (k === active ? ' active' : ''),
        'aria-pressed': k === active ? 'true' : 'false'
      }, label);
      b.onclick = () => {
        btns.forEach(x => {
          x.classList.remove('active');
          x.setAttribute('aria-pressed', 'false');
        });
        b.classList.add('active');
        b.setAttribute('aria-pressed', 'true');
        onPick(k);
      };
      return b;
    });
    row.append(...btns);
    return row;
  }

  // ---------- 1. Caching strategies & eviction lab ----------
  VIZ.syscache = {
    ...meta,
    title: 'Caching strategies and eviction lab',
    desc: 'Exercise Cache-Aside, Read-Through, Write-Through, and Write-Back across a 3-slot cache while comparing LRU and LFU eviction.',
    mount(el) {
      const CAP = 3;
      let strategy = 'aside', eviction = 'lru';
      let tick = 0, hits = 0, misses = 0, dbReads = 0, dbWrites = 0;
      let db = { A: 1, B: 1, C: 1, D: 1 };
      let slots = []; // [{ key, ver, freq, lastUsed, dirty }]
      let lastMsg = '';

      const board = h('div', { class: 'sd-slots' });
      const stats = h('div', { class: 'sd-grid' });
      const note = h('p', { class: 'viz-note', 'aria-live': 'polite' });

      const evictOne = () => {
        if (slots.length < CAP) return null;
        let idx = 0;
        for (let i = 1; i < slots.length; i++) {
          if (eviction === 'lfu') {
            if (slots[i].freq < slots[idx].freq || (slots[i].freq === slots[idx].freq && slots[i].lastUsed < slots[idx].lastUsed)) idx = i;
          } else if (slots[i].lastUsed < slots[idx].lastUsed) {
            idx = i;
          }
        }
        const [victim] = slots.splice(idx, 1);
        if (victim.dirty) {
          db[victim.key] = victim.ver;
          dbWrites++;
        }
        return victim;
      };

      const render = () => {
        const cards = [];
        for (let i = 0; i < CAP; i++) {
          const s = slots[i];
          if (!s) {
            cards.push(h('div', { class: 'slot' }, h('span', {}, T('Slot #{n}', { n: i + 1 })), h('b', {}, T('Empty slot'))));
          } else {
            const cls = s.dirty ? 'tt-upd' : 'tt-new';
            cards.push(h('div', { class: 'slot ' + cls },
              h('span', {}, `${s.key} · v${s.ver} · ${s.freq}x`),
              h('b', {}, s.dirty ? T('dirty (queued)') : T('clean (synced)'))));
          }
        }
        board.replaceChildren(...cards);

        const dirtyCount = slots.filter(s => s.dirty).length;
        const inconsistency = dirtyCount > 0 ? T('{n} dirty key pending', { n: dirtyCount }) : T('In sync with DB');
        stats.replaceChildren(
          h('div', { class: 'sd-card' }, h('h4', {}, T('Cache Hits / Misses'), h('span', { class: 'sd-badge ok' }, `${hits} / ${misses}`))),
          h('div', { class: 'sd-card' }, h('h4', {}, T('DB Reads / Writes'), h('span', { class: 'sd-badge warn' }, `${dbReads} / ${dbWrites}`))),
          h('div', { class: 'sd-card' }, h('h4', {}, T('Persistence status'), h('span', { class: 'sd-badge ' + (dirtyCount ? 'warn' : 'ok') }, inconsistency)))
        );
        note.textContent = lastMsg;
      };

      const readKey = k => {
        tick++;
        const hit = slots.find(s => s.key === k);
        if (hit) {
          hits++;
          hit.freq++;
          hit.lastUsed = tick;
          lastMsg = T('Cache HIT on {k} (v{v}): served immediately, DB reads unchanged.', { k, v: hit.ver });
          render();
          return;
        }
        misses++;
        dbReads++;
        const victim = evictOne();
        const ver = db[k];
        slots.push({ key: k, ver, freq: 1, lastUsed: tick, dirty: false });
        const pathDesc = strategy === 'readthrough'
          ? T('Read-Through miss on {k}: cache provider fetched v{v} from DB.', { k, v: ver })
          : T('Cache-Aside miss on {k}: app queried DB (v{v}) and populated Redis.', { k, v: ver });
        const evictNote = victim
          ? ' ' + T('Evicted {v} ({pol}).', { v: victim.key + (victim.dirty ? '*' : ''), pol: eviction.toUpperCase() })
          : '';
        lastMsg = pathDesc + evictNote;
        render();
      };

      const writeB = () => {
        tick++;
        db.B++;
        const newVer = db.B;
        const idx = slots.findIndex(s => s.key === 'B');
        if (strategy === 'writethrough') {
          dbWrites++;
          if (idx >= 0) {
            slots[idx].ver = newVer; slots[idx].freq++; slots[idx].lastUsed = tick; slots[idx].dirty = false;
          } else {
            evictOne();
            slots.push({ key: 'B', ver: newVer, freq: 1, lastUsed: tick, dirty: false });
          }
          lastMsg = T('Write-Through B=v{v}: updated cache and DB synchronously (zero stale window).', { v: newVer });
        } else if (strategy === 'writeback') {
          db.B--; // DB has not received the asynchronous flush yet
          if (idx >= 0) {
            slots[idx].ver++; slots[idx].freq++; slots[idx].lastUsed = tick; slots[idx].dirty = true;
            lastMsg = T('Write-Back B=v{v}: updated cache only in 1 ms and marked slot dirty.', { v: slots[idx].ver });
          } else {
            evictOne();
            const v = db.B + 1;
            slots.push({ key: 'B', ver: v, freq: 1, lastUsed: tick, dirty: true });
            lastMsg = T('Write-Back B=v{v}: buffered dirty write in cache. DB write waits for flush.', { v });
          }
        } else {
          // Cache-Aside / Read-Through standard invalidation on write
          dbWrites++;
          if (idx >= 0) slots.splice(idx, 1);
          lastMsg = T('{s} write B=v{v}: wrote DB first, then deleted stale cache entry.', { s: strategy === 'aside' ? 'Cache-Aside' : 'Read-Through', v: newVer });
        }
        render();
      };

      const flushDirty = () => {
        let flushed = 0;
        for (const s of slots) {
          if (s.dirty) {
            db[s.key] = s.ver;
            s.dirty = false;
            dbWrites++;
            flushed++;
          }
        }
        lastMsg = flushed ? T('Flushed {n} dirty slots asynchronously to primary DB.', { n: flushed }) : T('No dirty slots waiting to flush.');
        render();
      };

      const reset = () => {
        tick = hits = misses = dbReads = dbWrites = 0;
        db = { A: 1, B: 1, C: 1, D: 1 };
        slots = [];
        lastMsg = T('Cache reset. Read A/B/C/D or Write B to observe hits, evictions, and DB writes.');
        render();
      };

      const ctlStrategy = pills([
        ['aside', 'Cache-Aside'],
        ['readthrough', 'Read-Through'],
        ['writethrough', 'Write-Through'],
        ['writeback', 'Write-Back']
      ], strategy, m => { strategy = m; reset(); }, T('Caching strategy'));

      const ctlEvict = pills([['lru', 'LRU'], ['lfu', 'LFU']], eviction, m => { eviction = m; lastMsg = T('Switched eviction policy to {p}.', { p: m.toUpperCase() }); render(); }, T('Eviction policy'));

      const actions = h('div', { class: 'viz-ctl' },
        ...['A', 'B', 'C', 'D'].map(k => {
          const btn = h('button', { type: 'button', class: 'btn' }, T('Read {k}', { k }));
          btn.onclick = () => readKey(k);
          return btn;
        }),
        (() => { const b = h('button', { type: 'button', class: 'btn' }, T('Write B')); b.onclick = writeB; return b; })(),
        (() => { const b = h('button', { type: 'button', class: 'btn' }, T('Flush dirty')); b.onclick = flushDirty; return b; })(),
        (() => { const b = h('button', { type: 'button', class: 'btn' }, T('Reset')); b.onclick = reset; return b; })()
      );

      el.append(ctlStrategy, ctlEvict, actions, board, stats, note);
      reset();
    }
  };

  // ---------- 2. Rate limiting boundary burst comparison ----------
  VIZ.sysratelimit = {
    ...meta,
    title: 'Rate limiting algorithms and boundary burst lab',
    desc: 'Compare Fixed Window, Sliding Window Counter, Token Bucket, and Leaky Bucket (limit: 4 req / 10s) right across the window edge at :09.',
    mount(el) {
      const LIMIT = 4, WIN = 10;
      let sec = 0;
      let state = {};
      let lastMsg = '';
      const clockBadge = h('div', { class: 'viz-ctl' });
      const grid = h('div', { class: 'sd-grid' });
      const note = h('p', { class: 'viz-note', 'aria-live': 'polite' });

      const initState = () => {
        sec = 0;
        state = {
          fw: { winStart: 0, count: 0, ok: 0, drop: 0 },
          sw: { winStart: 0, prevCount: 0, curCount: 0, ok: 0, drop: 0 },
          tb: { tokens: LIMIT, lastSec: 0, ok: 0, drop: 0 },
          lb: { queue: 0, leakBank: 0, lastSec: 0, ok: 0, drop: 0 }
        };
        lastMsg = T('Limit = 4 req per 10s window. Try Jump to :09 -> Burst ×4 -> Advance +2s -> Burst ×4.');
      };

      const syncTime = newSec => {
        const dt = Math.max(0, newSec - state.tb.lastSec);
        sec = newSec;
        // Fixed & Sliding windows track 10s bucket boundaries
        const curBucket = Math.floor(sec / WIN) * WIN;
        if (curBucket > state.fw.winStart) {
          state.fw.count = 0;
          state.fw.winStart = curBucket;
        }
        if (curBucket > state.sw.winStart) {
          state.sw.prevCount = (curBucket - state.sw.winStart === WIN) ? state.sw.curCount : 0;
          state.sw.curCount = 0;
          state.sw.winStart = curBucket;
        }
        // Token Bucket refills 0.4 req/s
        state.tb.tokens = Math.min(LIMIT, state.tb.tokens + dt * (LIMIT / WIN));
        state.tb.lastSec = sec;
        // Leaky Bucket drains at constant 0.4 req/s
        state.lb.leakBank += dt * (LIMIT / WIN);
        const drained = Math.floor(state.lb.leakBank + 1e-9);
        if (drained > 0) {
          state.lb.queue = Math.max(0, state.lb.queue - drained);
          state.lb.leakBank -= drained;
        }
        state.lb.lastSec = sec;
      };

      const sendOne = () => {
        syncTime(sec);
        // 1. Fixed Window
        if (state.fw.count < LIMIT) { state.fw.count++; state.fw.ok++; } else { state.fw.drop++; }
        // 2. Sliding Window Counter
        const elapsed = sec - state.sw.winStart;
        const weight = Math.max(0, 1 - elapsed / WIN);
        const est = state.sw.prevCount * weight + state.sw.curCount;
        if (est < LIMIT) { state.sw.curCount++; state.sw.ok++; } else { state.sw.drop++; }
        // 3. Token Bucket
        if (state.tb.tokens >= 1) { state.tb.tokens -= 1; state.tb.ok++; } else { state.tb.drop++; }
        // 4. Leaky Bucket
        if (state.lb.queue < LIMIT) { state.lb.queue++; state.lb.ok++; } else { state.lb.drop++; }
      };

      const render = () => {
        clockBadge.replaceChildren(
          h('span', { class: 'sd-badge warn' }, T('Clock: :{s}', { s: String(sec).padStart(2, '0') })),
          h('span', { class: 'muted' }, T('Window [{a}..{b}s]', { a: String(Math.floor(sec / WIN) * WIN).padStart(2, '0'), b: String(Math.floor(sec / WIN) * WIN + WIN - 1).padStart(2, '0') }))
        );
        const elapsed = sec - state.sw.winStart;
        const swEst = (state.sw.prevCount * Math.max(0, 1 - elapsed / WIN) + state.sw.curCount).toFixed(1);
        const cards = [
          {
            name: T('Fixed Window'),
            badge: state.fw.ok > LIMIT && sec <= 12 ? T('Seam 2× risk') : T('Counter: {c}/4', { c: state.fw.count }),
            cls: state.fw.ok > LIMIT && sec <= 12 ? 'bad' : 'ok',
            ok: state.fw.ok, drop: state.fw.drop,
            detail: T('Resets at :10, letting 8 pass across :09..:11')
          },
          {
            name: T('Sliding Window Counter'),
            badge: T('Est: {e}/4', { e: swEst }),
            cls: Number(swEst) >= LIMIT ? 'warn' : 'ok',
            ok: state.sw.ok, drop: state.sw.drop,
            detail: T('Weights prior window ({p}) + current ({c})', { p: state.sw.prevCount, c: state.sw.curCount })
          },
          {
            name: T('Token Bucket'),
            badge: T('{t} tokens', { t: state.tb.tokens.toFixed(1) }),
            cls: state.tb.tokens < 1 ? 'warn' : 'ok',
            ok: state.tb.ok, drop: state.tb.drop,
            detail: T('Allows burst of 4, refills at 0.4 req/s')
          },
          {
            name: T('Leaky Bucket'),
            badge: T('Queue: {q}/4', { q: state.lb.queue }),
            cls: state.lb.queue >= LIMIT ? 'warn' : 'ok',
            ok: state.lb.ok, drop: state.lb.drop,
            detail: T('Drains out smoothly at 1 req per 2.5s')
          }
        ];
        grid.replaceChildren(...cards.map(c => h('div', { class: 'sd-card' },
          h('h4', {}, c.name, h('span', { class: 'sd-badge ' + c.cls }, c.badge)),
          h('div', { class: 'sd-slots' },
            h('div', { class: 'slot tt-new' }, h('span', {}, T('Allowed (200)')), h('b', {}, String(c.ok))),
            h('div', { class: 'slot ' + (c.drop ? 'tt-gone' : '') }, h('span', {}, T('Blocked (429)')), h('b', {}, String(c.drop)))),
          h('p', { class: 'muted', style: { margin: 0, fontSize: '.8rem' } }, c.detail)
        )));
        note.textContent = lastMsg;
      };

      const act = (fn, msg) => () => { fn(); lastMsg = msg(); render(); };
      const ctl = h('div', { class: 'viz-ctl' },
        (() => { const b = h('button', { type: 'button', class: 'btn' }, T('Send request')); b.onclick = act(sendOne, () => T('Sent 1 request at :{s}.', { s: String(sec).padStart(2, '0') })); return b; })(),
        (() => { const b = h('button', { type: 'button', class: 'btn' }, T('Burst ×4')); b.onclick = act(() => { for (let i = 0; i < 4; i++) sendOne(); }, () => T('Fired burst of 4 requests at :{s}. Look at Fixed vs Sliding counts!', { s: String(sec).padStart(2, '0') })); return b; })(),
        (() => { const b = h('button', { type: 'button', class: 'btn' }, T('Jump to :09')); b.onclick = act(() => { if (sec < 9) syncTime(9); }, () => T('Jumped clock to :09 (1 second before boundary reset at :10).')); return b; })(),
        (() => { const b = h('button', { type: 'button', class: 'btn' }, T('Advance +2s')); b.onclick = act(() => { syncTime(sec + 2); }, () => T('Advanced clock +2s to :{s}. Token & Leaky buckets refilled/drained slightly.', { s: String(sec).padStart(2, '0') })); return b; })(),
        (() => { const b = h('button', { type: 'button', class: 'btn' }, T('Reset')); b.onclick = act(initState, () => lastMsg); return b; })()
      );

      el.append(ctl, clockBadge, grid, note);
      initState();
      render();
    }
  };

  // ---------- 3. Database pooling, replication lag & read-your-own-writes ----------
  VIZ.sysdbscale = {
    ...meta,
    title: 'Database pooling and replication lag lab',
    desc: 'See how PgBouncer Transaction Mode slashes backend connections as pods scale, and watch replication lag break naive replica reads without LSN tracking.',
    mount(el) {
      let pods = 24, poolMode = 'direct', writeLoad = 'low', checkLSN = false;
      const POD_CONNS = 25;
      const grid = h('div', { class: 'sd-grid' });
      const rwBox = h('div', {});
      const note = h('p', { class: 'viz-note', 'aria-live': 'polite' });

      const sliderId = 'sd-pods-range';
      const sliderVal = h('strong', {}, `${pods}`);
      const slider = h('input', { id: sliderId, type: 'range', min: '4', max: '60', step: '4', value: String(pods), style: { width: 'min(220px, 100%)' } });
      slider.oninput = () => { pods = Number(slider.value); sliderVal.textContent = String(pods); render(); };

      const rowRange = h('div', { class: 'viz-ctl' },
        h('label', { for: sliderId }, T('App pods (25 conns each): ')),
        slider,
        sliderVal
      );

      const render = () => {
        const appConns = pods * POD_CONNS;
        const dbBackends = poolMode === 'direct' ? appConns : Math.min(60, Math.ceil(pods * 1.4));
        const saturated = dbBackends > 300;
        const lagMs = writeLoad === 'high' ? 420 : 12;
        const cpuPct = Math.min(99, Math.round(dbBackends * 0.14 + (writeLoad === 'high' ? 36 : 14)));

        grid.replaceChildren(
          h('div', { class: 'sd-card' },
            h('h4', {}, T('Open App Sockets'), h('span', { class: 'sd-badge' }, String(appConns))),
            h('p', { class: 'muted', style: { margin: 0, fontSize: '.82rem' } }, T('{p} pods × 25 idle/active pool slots', { p: pods }))),
          h('div', { class: 'sd-card' },
            h('h4', {}, T('Postgres Backends'), h('span', { class: 'sd-badge ' + (saturated ? 'bad' : 'ok') }, String(dbBackends))),
            h('p', { class: 'muted', style: { margin: 0, fontSize: '.82rem' } },
              poolMode === 'direct'
                ? (saturated ? T('Saturated! Context switches spike tail latency.') : T('Direct connections held open per pod.'))
                : T('Multiplexed over transaction pool (`max = 60`).'))),
          h('div', { class: 'sd-card' },
            h('h4', {}, T('Primary CPU / Replica Lag'), h('span', { class: 'sd-badge ' + (lagMs > 100 ? 'bad' : 'ok') }, `${cpuPct}% / ${lagMs} ms`)),
            h('p', { class: 'muted', style: { margin: 0, fontSize: '.82rem' } },
              writeLoad === 'high' ? T('Heavy writes queue WAL replay on replicas.') : T('Replicas stay closely caught up.')))
        );

        const commitLSN = '0/1A409C00';
        const replicaLSN = writeLoad === 'high' ? '0/1A401100' : '0/1A409C00';
        const stale = writeLoad === 'high' && !checkLSN;
        const rowClass = stale ? 'tt-gone' : 'tt-new';
        const outcome = stale
          ? T('STALE READ: Replica still at {r}, missed write {w} (returned old profile).', { r: replicaLSN, w: commitLSN })
          : (checkLSN && writeLoad === 'high'
            ? T('FRESH READ: Replica lag exceeded commit LSN {w}, so the read went to primary.', { w: commitLSN })
            : T('FRESH READ: Replica replayed up to {w}. User sees latest profile.', { w: commitLSN }));

        rwBox.replaceChildren(
          h('div', { class: 'slot ' + rowClass },
            h('span', {}, T('Post-Write Read-Your-Own-Writes Check')),
            h('b', {}, outcome))
        );

        note.textContent = saturated
          ? T('Warning: {n} direct PostgreSQL backends starve worker RAM and snapshot locks. Switch to PgBouncer Transaction Mode!', { n: dbBackends })
          : T('Postgres backends healthy ({n}). Toggle High write load and compare naive replica reads against LSN pinning.', { n: dbBackends });
      };

      const ctlPool = pills([
        ['direct', 'Direct connections'],
        ['pgbouncer', 'PgBouncer Transaction']
      ], poolMode, m => { poolMode = m; render(); }, T('Connection pooling mode'));

      const ctlWrite = pills([
        ['low', 'Low write load'],
        ['high', 'High write load']
      ], writeLoad, m => { writeLoad = m; render(); }, T('Write load level'));

      const lsnBtn = h('button', { type: 'button', class: 'btn', 'aria-pressed': 'false' }, T('Verify Commit LSN (Read-Your-Own-Writes): OFF'));
      lsnBtn.onclick = () => {
        checkLSN = !checkLSN;
        lsnBtn.setAttribute('aria-pressed', checkLSN ? 'true' : 'false');
        lsnBtn.textContent = checkLSN ? T('Verify Commit LSN (Read-Your-Own-Writes): ON') : T('Verify Commit LSN (Read-Your-Own-Writes): OFF');
        render();
      };

      el.append(ctlPool, ctlWrite, h('div', { class: 'viz-ctl' }, lsnBtn), rowRange, grid, rwBox, note);
      render();
    }
  };

  // ---------- 4. Consistent hashing ring, vnodes & bounded loads ----------
  VIZ.syshash = {
    ...meta,
    title: 'Consistent hashing ring and bounded-load lab',
    desc: 'Compare key churn when scaling from 4 to 5 cache nodes, inspect how virtual nodes eliminate hot spots, and enable 1.25× bounded-load overflow.',
    mount(el) {
      const N_KEYS = 40;
      let hasNodeE = false, vnodesPerNode = 10, bounded = false;

      const fnv32 = str => {
        let hval = 0x811c9dc5;
        for (let i = 0; i < str.length; i++) {
          hval ^= str.charCodeAt(i);
          hval = Math.imul(hval, 0x01000193);
        }
        return hval >>> 0;
      };

      const keys = Array.from({ length: N_KEYS }, (_, i) => {
        const k = i < 12 ? `hot:promo:${i % 3}` : `session:${i}`;
        return { name: k, id: `k${i}`, pos: fnv32(k + '#' + i) };
      });

      const buildRing = (nodes, vPer) => {
        const arr = [];
        for (const n of nodes) {
          for (let v = 0; v < vPer; v++) {
            arr.push({ node: n, pos: fnv32(`${n}#v${v}`) });
          }
        }
        arr.sort((a, b) => a.pos - b.pos);
        return arr;
      };

      const assignKeys = (ring, nodes) => {
        const load = Object.fromEntries(nodes.map(n => [n, 0]));
        const cap = Math.ceil((N_KEYS / nodes.length) * 1.25);
        const owner = {};
        for (const k of keys) {
          let idx = ring.findIndex(v => v.pos >= k.pos);
          if (idx < 0) idx = 0;
          let picked = ring[idx].node;
          if (bounded) {
            const seen = new Set();
            for (let off = 0; off < ring.length; off++) {
              const cand = ring[(idx + off) % ring.length].node;
              if (seen.has(cand)) continue;
              seen.add(cand);
              if (load[cand] < cap) { picked = cand; break; }
            }
          }
          load[picked]++;
          owner[k.id] = picked;
        }
        return { owner, load, cap };
      };

      const ringHost = h('div', { class: 'sd-ring' });
      const statsGrid = h('div', { class: 'sd-grid' });
      const tblHost = h('div', {});
      const note = h('p', { class: 'viz-note', 'aria-live': 'polite' });

      const ns = 'http://www.w3.org/2000/svg';
      const mkSvg = (tag, attrs) => {
        const e = document.createElementNS(ns, tag);
        for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, String(v));
        return e;
      };

      const render = () => {
        const baseNodes = ['A', 'B', 'C', 'D'];
        const curNodes = hasNodeE ? ['A', 'B', 'C', 'D', 'E'] : baseNodes;
        const rBase = buildRing(baseNodes, vnodesPerNode);
        const rCur = buildRing(curNodes, vnodesPerNode);
        const resBase = assignKeys(rBase, baseNodes);
        const resCur = assignKeys(rCur, curNodes);

        let ringMoved = 0, modMoved = 0;
        const movedIds = new Set();
        for (const k of keys) {
          if (hasNodeE && resBase.owner[k.id] !== resCur.owner[k.id]) {
            ringMoved++;
            movedIds.add(k.id);
          }
          if (hasNodeE && (k.pos % 4) !== (k.pos % 5)) modMoved++;
        }
        const ringPct = Math.round((ringMoved / N_KEYS) * 100);
        const modPct = Math.round((modMoved / N_KEYS) * 100);

        const svg = mkSvg('svg', { viewBox: '0 0 260 260', role: 'img', 'aria-label': T('Consistent hash ring with {n} servers and {v} vnodes each', { n: curNodes.length, v: vnodesPerNode }) });
        const cx = 130, cy = 130, R = 95;
        svg.appendChild(mkSvg('circle', { cx, cy, r: R, class: 'ring-track' }));

        const deg = p => (p / 0x100000000) * Math.PI * 2 - Math.PI / 2;
        const pt = (p, rad) => {
          const a = deg(p);
          return [cx + Math.cos(a) * rad, cy + Math.sin(a) * rad];
        };

        // Plot key dots on inner circumference
        for (const k of keys) {
          const [kx, ky] = pt(k.pos, R - 13);
          svg.appendChild(mkSvg('circle', {
            cx: kx.toFixed(1), cy: ky.toFixed(1), r: movedIds.has(k.id) ? 4 : 2.8,
            class: 'ring-key' + (movedIds.has(k.id) ? ' moved' : '')
          }));
        }

        // Plot primary node & vnode ticks
        for (const vn of rCur) {
          const [vx, vy] = pt(vn.pos, R);
          const isPrimary = vn.pos === fnv32(`${vn.node}#v0`);
          if (isPrimary) {
            svg.appendChild(mkSvg('circle', { cx: vx.toFixed(1), cy: vy.toFixed(1), r: 7, class: 'ring-node' }));
            const [lx, ly] = pt(vn.pos, R + 17);
            const tEl = mkSvg('text', { x: lx.toFixed(1), y: (ly + 4).toFixed(1), 'text-anchor': 'middle' });
            tEl.textContent = vn.node;
            svg.appendChild(tEl);
          } else {
            svg.appendChild(mkSvg('circle', { cx: vx.toFixed(1), cy: vy.toFixed(1), r: 2.2, class: 'ring-vnode' }));
          }
        }
        ringHost.replaceChildren(svg);

        statsGrid.replaceChildren(
          h('div', { class: 'sd-card' },
            h('h4', {}, T('Consistent Ring Churn'), h('span', { class: 'sd-badge ok' }, hasNodeE ? `${ringPct}% (${ringMoved}/${N_KEYS})` : '0%')),
            h('p', { class: 'muted', style: { margin: 0, fontSize: '.8rem' } }, hasNodeE ? T('Only keys owned by Node E migrated.') : T('Click Add Node E to measure churn.'))),
          h('div', { class: 'sd-card' },
            h('h4', {}, T('Naive Modulo (% N) Churn'), h('span', { class: 'sd-badge ' + (hasNodeE ? 'bad' : 'ok') }, hasNodeE ? `${modPct}% (${modMoved}/${N_KEYS})` : '0%')),
            h('p', { class: 'muted', style: { margin: 0, fontSize: '.8rem' } }, T('Adding 1 node breaks ~80% of modulo keys.')))
        );

        const maxLoad = Math.max(...Object.values(resCur.load));
        const minLoad = Math.min(...Object.values(resCur.load));
        tblHost.replaceChildren(window.tableWrap(T('Per-server key distribution'), h('table', { class: 't' },
          h('thead', {}, h('tr', {}, [T('Server'), T('Assigned Keys'), T('Share %'), T('Cap Status')].map(c => h('th', { scope: 'col' }, c)))),
          h('tbody', {}, curNodes.map(n => {
            const cnt = resCur.load[n];
            const over = cnt > resCur.cap;
            return h('tr', { class: over ? 'dim' : '' },
              h('td', {}, h('code', {}, `Node ${n}`)),
              h('td', {}, `${cnt} / ${N_KEYS}`),
              h('td', {}, `${Math.round((cnt / N_KEYS) * 100)}%`),
              h('td', {}, bounded ? T('Bounded <= {cap}', { cap: resCur.cap }) : (cnt >= maxLoad && maxLoad - minLoad >= 8 ? T('Skewed hot arc') : T('Balanced'))));
          })))));

        note.textContent = bounded
          ? T('Bounded Load (cap = {cap} keys/node) spilled excess hot keys clockwise so every server stayed within 1.25× average.', { cap: resCur.cap })
          : T('Spread across {v} vnodes/server: key counts range from {min} to {max} keys per server.', { v: vnodesPerNode, min: minLoad, max: maxLoad });
      };

      const vnodeCtl = pills([
        ['1', '1 vnode'],
        ['10', '10 vnodes'],
        ['50', '50 vnodes'],
        ['150', '150 vnodes']
      ], String(vnodesPerNode), v => { vnodesPerNode = Number(v); render(); }, T('Virtual nodes per server'));

      const nodeBtn = h('button', { type: 'button', class: 'btn', 'aria-pressed': 'false' }, T('+ Add Node E (4 -> 5)'));
      nodeBtn.onclick = () => {
        hasNodeE = !hasNodeE;
        nodeBtn.setAttribute('aria-pressed', hasNodeE ? 'true' : 'false');
        nodeBtn.textContent = hasNodeE ? T('- Remove Node E (5 -> 4)') : T('+ Add Node E (4 -> 5)');
        render();
      };

      const boundBtn = h('button', { type: 'button', class: 'btn', 'aria-pressed': 'false' }, T('Bounded Load (1.25×): OFF'));
      boundBtn.onclick = () => {
        bounded = !bounded;
        boundBtn.setAttribute('aria-pressed', bounded ? 'true' : 'false');
        boundBtn.textContent = bounded ? T('Bounded Load (1.25×): ON') : T('Bounded Load (1.25×): OFF');
        render();
      };

      el.append(vnodeCtl, h('div', { class: 'viz-ctl' }, nodeBtn, boundBtn), ringHost, statsGrid, tblHost, note);
      render();
    }
  };

  // ---------- 5. Transactional Outbox, CDC relay, retries & DLQ ----------
  VIZ.sysqueue = {
    ...meta,
    title: 'Transactional outbox, CDC relay, and DLQ lab',
    desc: 'Trigger a broker outage mid-checkout to contrast brittle Dual-Write loss against atomic Outbox + CDC and inspect Dead-Letter Queue parking.',
    mount(el) {
      let mode = 'outbox', brokerUp = true, nextId = 1;
      let orders = [], outbox = [], broker = [], consumerOk = [], dlq = [], lostEvents = 0;
      let lastMsg = '';

      const statusBar = h('div', { class: 'viz-ctl' });
      const panels = h('div', { class: 'sd-grid' });
      const note = h('p', { class: 'viz-note', 'aria-live': 'polite' });

      const render = () => {
        const cls = lostEvents > 0 ? 'bad' : (outbox.length || dlq.length ? 'warn' : 'ok');
        const verdict = lostEvents > 0
          ? T('DIVERGED: {n} committed orders missing events!', { n: lostEvents })
          : (outbox.length > 0
            ? T('SAFE IN OUTBOX: {n} events waiting for broker recovery', { n: outbox.length })
            : T('CONSISTENT: Zero lost orders'));

        statusBar.replaceChildren(
          h('span', { class: 'sd-badge ' + (brokerUp ? 'ok' : 'bad') }, brokerUp ? T('Broker: ONLINE') : T('Broker: DOWN')),
          h('span', { class: 'sd-badge ' + cls }, verdict)
        );

        const mkList = (title, arr, emptyTxt, badgeCls) => h('div', { class: 'sd-card' },
          h('h4', {}, title, h('span', { class: 'sd-badge ' + (arr.length ? badgeCls : '') }, String(arr.length))),
          arr.length
            ? h('div', { class: 'cells' }, arr.slice(-6).map(x => h('span', { class: 'cell ' + (x.poison ? 'hit' : '') }, x.label)))
            : h('p', { class: 'muted', style: { margin: 0, fontSize: '.8rem' } }, emptyTxt));

        panels.replaceChildren(
          mkList(T('1. Postgres Orders'), orders, T('No orders committed'), 'ok'),
          mkList(T('2. Outbox Table'), outbox, T('Outbox clean'), 'warn'),
          mkList(T('3. Broker Queue'), broker, T('Queue empty'), 'warn'),
          mkList(T('4. Processed / DLQ'), [...consumerOk, ...dlq], T('Nothing consumed yet'), dlq.length ? 'bad' : 'ok')
        );
        note.textContent = lastMsg;
      };

      const reset = () => {
        nextId = 1; brokerUp = true;
        orders = []; outbox = []; broker = []; consumerOk = []; dlq = []; lostEvents = 0;
        lastMsg = T('Ready. Toggle Broker Outage ON, Commit Order, and compare Dual-Write vs Transactional Outbox.');
        render();
      };

      const commitOrder = () => {
        const id = `ord-${nextId++}`;
        orders.push({ id, label: id });
        if (mode === 'dual') {
          if (brokerUp) {
            broker.push({ id, label: id, attempts: 0, poison: false });
            lastMsg = T('Dual-Write committed {id} and published to broker (succeeded only because broker happened to be up).', { id });
          } else {
            lostEvents++;
            lastMsg = T('BUG in Dual-Write! {id} committed to Postgres, then broker publish threw timeout -> EVENT LOST PERMANENTLY.', { id });
          }
        } else {
          outbox.push({ id, label: `${id} (pending)`, poison: false });
          lastMsg = brokerUp
            ? T('Outbox committed {id} + outbox row inside ONE atomic transaction. Click Relay / Consume to ship.', { id })
            : T('Broker is DOWN, yet {id} and its outbox row committed atomically. The event stays on disk until the broker recovers.', { id });
        }
        render();
      };

      const poison = () => {
        const id = `bad-json-${nextId++}`;
        if (!brokerUp) {
          lastMsg = T('Bring Broker ONLINE first so a poison message enters the consumer pipeline.');
          render();
          return;
        }
        broker.push({ id, label: `${id} (try 0/3)`, attempts: 0, poison: true });
        lastMsg = T('Enqueued corrupt poison payload {id}. Click Relay / Consume to trace retries -> DLQ.', { id });
        render();
      };

      const relay = () => {
        if (!brokerUp) {
          lastMsg = T('Broker is still DOWN. The outbox keeps every pending event on disk.');
          render();
          return;
        }
        let shipped = 0;
        if (outbox.length) {
          while (outbox.length) {
            const ev = outbox.shift();
            broker.push({ id: ev.id, label: ev.id, attempts: 0, poison: false });
            shipped++;
          }
        }
        if (broker.length) {
          const item = broker.shift();
          if (item.poison) {
            item.attempts++;
            if (item.attempts >= 3) {
              dlq.push({ id: item.id, label: `${item.id} [DLQ]`, poison: true });
              lastMsg = T('{id} exceeded max 3 retries and moved to Dead-Letter Queue (DLQ) so healthy messages keep flowing.', { id: item.id });
            } else {
              item.label = `${item.id} (try ${item.attempts}/3)`;
              broker.push(item); // requeue to back
              lastMsg = T('{id} failed schema parse (attempt {n}/3) -> requeued with backoff.', { id: item.id, n: item.attempts });
            }
          } else {
            consumerOk.push({ id: item.id, label: `${item.id} ✓` });
            lastMsg = shipped
              ? T('CDC relayed {n} outbox events and consumer processed {id} idempotently.', { n: shipped, id: item.id })
              : T('Consumer processed {id} idempotently (recorded event_id in processed_events).', { id: item.id });
          }
        } else if (shipped) {
          lastMsg = T('CDC / SKIP LOCKED relay published {n} queued outbox events to broker!', { n: shipped });
        } else {
          lastMsg = T('Nothing pending in Outbox or Broker Queue.');
        }
        render();
      };

      const modeCtl = pills([
        ['dual', 'Dual-Write (fragile)'],
        ['outbox', 'Transactional Outbox (atomic)']
      ], mode, m => { mode = m; reset(); }, T('Event publishing strategy'));

      const actCtl = h('div', { class: 'viz-ctl' },
        (() => { const b = h('button', { type: 'button', class: 'btn' }, T('Commit Order')); b.onclick = commitOrder; return b; })(),
        (() => {
          const b = h('button', { type: 'button', class: 'btn' }, T('Toggle Broker Outage'));
          b.onclick = () => {
            brokerUp = !brokerUp;
            lastMsg = brokerUp ? T('Broker came back ONLINE. Run Relay / Consume to drain waiting outbox rows.') : T('Broker went OFFLINE! Commit an order to see Dual-Write vs Outbox.');
            render();
          };
          return b;
        })(),
        (() => { const b = h('button', { type: 'button', class: 'btn' }, T('Relay / Consume')); b.onclick = relay; return b; })(),
        (() => { const b = h('button', { type: 'button', class: 'btn' }, T('Inject Poison Pill')); b.onclick = poison; return b; })(),
        (() => { const b = h('button', { type: 'button', class: 'btn' }, T('Reset')); b.onclick = reset; return b; })()
      );

      el.append(modeCtl, actCtl, statusBar, panels, note);
      reset();
    }
  };

  // ---------- 6. Circuit breaker, bulkhead & Full Jitter backoff ----------
  VIZ.sysresilience = {
    ...meta,
    title: 'Circuit breaker, bulkhead, and Full Jitter backoff lab',
    desc: 'Saturate a failing dependency to watch Closed -> Open -> Half-Open transitions, bulkhead isolation, and Full Jitter retry spreading.',
    mount(el) {
      const THRESH = 3, BULK_CAP = 3;
      let health = 'healthy', jitter = 'full';
      let cbState = 'CLOSED', failStreak = 0, cooldownLeft = 0;
      let completed = 0, failed = 0, fastFailed = 0, bulkheadShed = 0, callSeq = 0;
      let buckets = [0, 0, 0, 0, 0, 0];
      let rngState = 42;
      let lastMsg = '';

      const grid = h('div', { class: 'sd-grid' });
      const waveBox = h('div', {});
      const note = h('p', { class: 'viz-note', 'aria-live': 'polite' });

      const nextRand = () => {
        rngState = (rngState * 1664525 + 1013904223) >>> 0;
        return rngState / 0x100000000;
      };

      const render = () => {
        const badgeCls = cbState === 'CLOSED' ? 'ok' : cbState === 'OPEN' ? 'bad' : 'warn';
        grid.replaceChildren(
          h('div', { class: 'sd-card' },
            h('h4', {}, T('Circuit Breaker'), h('span', { class: 'sd-badge ' + badgeCls }, cbState)),
            h('p', { class: 'muted', style: { margin: 0, fontSize: '.8rem' } },
              T('Fail streak: {f}/{t} · Cooldown: {c}s', { f: failStreak, t: THRESH, c: cooldownLeft }))),
          h('div', { class: 'sd-card' },
            h('h4', {}, T('Call Outcomes'), h('span', { class: 'sd-badge' }, `${completed} OK / ${failed} Err`)),
            h('p', { class: 'muted', style: { margin: 0, fontSize: '.8rem' } },
              T('Fast-failed (OPEN): {o} · Bulkhead shed: {s}', { o: fastFailed, s: bulkheadShed }))),
          h('div', { class: 'sd-card' },
            h('h4', {}, T('Bulkhead Isolation'), h('span', { class: 'sd-badge ok' }, T('Cap {c} / svc', { c: BULK_CAP }))),
            h('p', { class: 'muted', style: { margin: 0, fontSize: '.8rem' } }, T('Separate semaphore protects /checkout from slow webhooks.')))
        );

        const labels = ['0–160ms', '160–330ms', '330–500ms', '500–660ms', '660–830ms', '830–1000ms'];
        waveBox.replaceChildren(
          h('p', { class: 'muted', style: { margin: '.4rem 0 .25rem', fontSize: '.82rem' } }, T('Retry wakeup distribution across a 1-second backoff window:')),
          h('div', { class: 'sd-slots' }, labels.map((lbl, idx) =>
            h('div', { class: 'slot ' + (buckets[idx] > 3 ? 'tt-gone' : buckets[idx] > 0 ? 'tt-new' : '') },
              h('span', {}, lbl),
              h('b', {}, T('{n} retries', { n: buckets[idx] })))))
        );
        note.textContent = lastMsg;
      };

      const reset = () => {
        cbState = 'CLOSED'; failStreak = 0; cooldownLeft = 0;
        completed = failed = fastFailed = bulkheadShed = callSeq = 0;
        buckets = [0, 0, 0, 0, 0, 0];
        rngState = 42;
        lastMsg = T('Healthy dependency. Switch downstream to Outage (100%) and Burst ×6 to trip the Circuit Breaker.');
        render();
      };

      const runBurst = count => {
        if (count > BULK_CAP && health !== 'healthy' && cbState === 'CLOSED') {
          const overflow = count - BULK_CAP;
          bulkheadShed += overflow;
          count = BULK_CAP;
        }
        for (let i = 0; i < count; i++) {
          callSeq++;
          if (cbState === 'OPEN') {
            fastFailed++;
            continue;
          }
          const willFail = health === 'outage' || (health === 'degraded' && (callSeq % 5) < 3);
          if (willFail) {
            failed++;
            failStreak++;
            const slotIdx = jitter === 'full' ? Math.floor(nextRand() * 6) : 5;
            buckets[slotIdx]++;
            if (cbState === 'HALF_OPEN' || failStreak >= THRESH) {
              cbState = 'OPEN';
              cooldownLeft = 10;
            }
          } else {
            completed++;
            failStreak = 0;
            cbState = 'CLOSED';
            cooldownLeft = 0;
          }
        }
        if (cbState === 'OPEN') {
          lastMsg = jitter === 'unjittered'
            ? T('Circuit OPEN after {n} failures! Notice retries clumping at 830–1000ms without jitter.', { n: THRESH })
            : T('Circuit OPEN after {n} failures (sparing downstream), while Full Jitter spread retries smoothly. Advance Cooldown to probe Half-Open.', { n: THRESH });
        } else {
          lastMsg = T('Completed batch under {h} downstream ({b} backoff).', { h: health, b: jitter === 'full' ? 'Full Jitter' : 'No Jitter' });
        }
        render();
      };

      const advanceCooldown = () => {
        if (cbState !== 'OPEN') {
          lastMsg = T('Circuit is not OPEN, so no cooldown timer is pending.');
          render();
          return;
        }
        cooldownLeft = Math.max(0, cooldownLeft - 5);
        if (cooldownLeft === 0) {
          cbState = 'HALF_OPEN';
          lastMsg = T('Cooldown elapsed -> state moved to HALF_OPEN. Next request sends a single canary probe!');
        } else {
          lastMsg = T('Cooldown ticking down: {c}s remaining before HALF_OPEN probe.', { c: cooldownLeft });
        }
        render();
      };

      const hCtl = pills([
        ['healthy', 'Healthy (0% fail)'],
        ['degraded', 'Degraded (60% fail)'],
        ['outage', 'Outage (100% fail)']
      ], health, m => { health = m; lastMsg = T('Downstream health set to {h}.', { h: m }); render(); }, T('Downstream health'));

      const jCtl = pills([
        ['unjittered', 'No Jitter (synchronized)'],
        ['full', 'Full Jitter (spread)']
      ], jitter, m => { jitter = m; buckets = [0, 0, 0, 0, 0, 0]; lastMsg = T('Switched backoff mode to {m}.', { m }); render(); }, T('Backoff jitter mode'));

      const acts = h('div', { class: 'viz-ctl' },
        (() => { const b = h('button', { type: 'button', class: 'btn' }, T('Send request')); b.onclick = () => runBurst(1); return b; })(),
        (() => { const b = h('button', { type: 'button', class: 'btn' }, T('Burst ×6')); b.onclick = () => runBurst(6); return b; })(),
        (() => { const b = h('button', { type: 'button', class: 'btn' }, T('Advance Cooldown (+5s)')); b.onclick = advanceCooldown; return b; })(),
        (() => { const b = h('button', { type: 'button', class: 'btn' }, T('Reset')); b.onclick = reset; return b; })()
      );

      el.append(hCtl, jCtl, acts, grid, waveBox, note);
      reset();
    }
  };
})();
