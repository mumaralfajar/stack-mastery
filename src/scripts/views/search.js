// Search over a pre-built index (generated at build time as /search-index.json), so this page never loads
// lesson prose, interview data or lab modules. Each entry: { cat, kind, title, href, text }.
import { esc, h } from '../../lib/dom.ts';
import { t as T } from '../../lib/i18n.ts';

export function searchView(index) {
  const plain = (s) => s.replace(/[`*]/g, '');
  const markText = (str, terms) => {
    if (!terms.length) return esc(str);
    const uniq = [...new Set(terms.filter(Boolean))].sort((a, b) => b.length - a.length);
    if (!uniq.length) return esc(str);
    const pat = new RegExp(uniq.map((term) => term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|'), 'gi');
    let out = '';
    let last = 0;
    for (const m of str.matchAll(pat)) {
      const idx = m.index ?? 0;
      if (idx > last) out += esc(str.slice(last, idx));
      out += '<mark>' + esc(m[0]) + '</mark>';
      last = idx + m[0].length;
    }
    if (last < str.length) out += esc(str.slice(last));
    return out;
  };
  let cat = 'all';
  const results = h('div', { class: 'rows', 'aria-live': 'polite' });
  const cats = [
    ['all', 'All'],
    ['lesson', 'Lessons'],
    ['interview', 'Interview'],
    ['viz', 'Visualizations'],
  ];
  const catBtns = {};
  const catBar = h(
    'div',
    { class: 'chips', style: { marginTop: '.6rem' } },
    cats.map(([k, lbl]) => {
      const b = h(
        'button',
        {
          type: 'button',
          class: k === 'all' ? 'on' : '',
          'aria-pressed': String(k === 'all'),
          onclick: () => {
            cat = k;
            Object.entries(catBtns).forEach(([x, btn]) => {
              btn.classList.toggle('on', x === k);
              btn.setAttribute('aria-pressed', String(x === k));
            });
            draw();
          },
        },
        lbl,
      );
      return (catBtns[k] = b);
    }),
  );
  const draw = () => {
    const terms = input.value.toLowerCase().split(/\s+/).filter(Boolean);
    const pool = cat === 'all' ? index : index.filter((it) => it.cat === cat);
    if (!terms.length) {
      return results.replaceChildren(
        h(
          'p',
          { class: 'muted' },
          T('{n} lessons, problems, questions and visualizations indexed. Try “index”, “async”, “flexbox” or “deadlock”.', {
            n: pool.length,
          }),
        ),
      );
    }
    const hits = pool
      .map((it) => {
        const title = it.title.toLowerCase();
        const text = it.text.toLowerCase();
        if (!terms.every((term) => title.includes(term) || text.includes(term))) return null;
        return {
          it,
          score: terms.reduce((s, term) => s + (title.includes(term) ? 5 : 0) + Math.min(text.split(term).length - 1, 3), 0),
        };
      })
      .filter(Boolean)
      .sort((x, y) => y.score - x.score)
      .slice(0, 40);
    results.replaceChildren(
      ...(hits.length
        ? hits.map(({ it }) => {
            const cleanTxt = plain(it.text);
            const low = cleanTxt.toLowerCase();
            const firstPos = terms.map((term) => low.indexOf(term)).filter((p) => p >= 0).sort((a, b) => a - b)[0] ?? -1;
            const from = firstPos >= 0 ? Math.max(firstPos - 50, 0) : 0;
            const snip = (from ? '…' : '') + cleanTxt.slice(from, from + 150) + (cleanTxt.length > from + 150 ? '…' : '');
            return h(
              'a',
              { class: 'row hit', href: it.href },
              h(
                'span',
                { class: 'row-t' },
                h('small', {}, it.kind),
                h('br'),
                h('b', { html: markText(plain(it.title), terms) }),
                h('br'),
                h('span', { class: 'muted', html: markText(snip, terms) }),
              ),
            );
          })
        : [h('p', { class: 'muted' }, 'Nothing found. Try a shorter or different word.')]),
    );
  };
  const input = h('input', {
    type: 'search',
    class: 'search',
    placeholder: 'Search lessons, problems, interview questions…',
    'aria-label': 'Search',
    oninput: draw,
    onkeydown: (e) => {
      if (e.key === 'Escape' && input.value) {
        input.value = '';
        draw();
      }
    },
  });
  draw();
  setTimeout(() => input.focus());
  return h(
    'div',
    { class: 'page' },
    h('header', { class: 'head' }, h('p', { class: 'eyebrow' }, 'Find anything'), h('h1', {}, 'Search'), input, catBar),
    results,
  );
}
