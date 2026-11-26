// Shared UI widgets: progress bars/rings/dots, sections, route links, quiz renderer, and collapsible control dock.
import { type DomChild, h, md } from './dom.ts';
import { getLang, t } from './i18n.ts';
import { routePath } from './routes.ts';
import { peek } from './state.ts';
import type { QuizItem } from './types.ts';

export function chip(text: string, cls = ''): HTMLSpanElement {
  return h('span', { class: 'chip ' + cls }, text);
}

export function dots(k: string): HTMLSpanElement {
  const s = peek(k);
  const fields: ('read' | 'quiz' | 'teach')[] = ['read', 'quiz', 'teach'];
  return h(
    'span',
    { class: 'dots', title: 'Learn · Check · Teach' },
    fields.map((f) => h('i', { class: s[f] ? 'on' : '' })),
  );
}

export function bar(p: number, label?: string): HTMLDivElement {
  return h(
    'div',
    { class: 'bar', role: 'img', 'aria-label': t(label || 'Progress') + ' ' + p + '%' },
    h('i', { style: { width: p + '%' } }),
  );
}

export interface RingOptions {
  ariaLabel?: string;
  caption?: string;
}

export function ring(p: number, { ariaLabel = 'Overall mastery', caption = 'mastery' }: RingOptions = {}): HTMLDivElement {
  const r = 52;
  const c = 2 * Math.PI * r;
  return h('div', {
    class: 'ring',
    html: `<svg viewBox="0 0 120 120" role="img" aria-label="${t(ariaLabel)} ${p}%"><circle cx="60" cy="60" r="${r}" class="ring-bg"/><circle cx="60" cy="60" r="${r}" class="ring-fg" stroke-dasharray="${c}" stroke-dashoffset="${c * (1 - p / 100)}" transform="rotate(-90 60 60)"/><text x="60" y="58" text-anchor="middle" class="ring-n">${p}%</text><text x="60" y="76" text-anchor="middle" class="ring-l">${t(caption)}</text></svg>`,
  });
}

export function shuffle<T>(items: readonly T[]): T[] {
  const a = items.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function section(title: DomChild, ...kids: DomChild[]): HTMLElement {
  return h('section', { class: 'sec' }, h('h2', {}, title), ...kids);
}

// Site URL for a route path in the current page language, e.g. href('/lab/') -> '/stack-mastery/id/lab/'.
export function href(path: string): string {
  return routePath(getLang(), path);
}

export function lessonHref(tr: { id: string }, l: { id: string }): string {
  return href(`/lesson/${tr.id}/${l.id}/`);
}

export interface QuizItemOptions {
  once?: boolean;
  solved?: boolean;
  onResult?: (firstTryRight: boolean) => void;
  onMiss?: () => void;
}

// One multiple-choice question. once=true locks after the first answer (exam mode).
// onMiss runs on the first wrong answer to the question.
export function quizItem(
  q: QuizItem,
  { once, solved, onResult, onMiss }: QuizItemOptions,
): HTMLDivElement {
  const order = shuffle(q.a.map((text, i) => ({ text, ok: i === q.c })));
  const fb = h('p', { class: 'fb', 'aria-live': 'polite' });
  let done = !!solved;
  let first = true;
  const btns = order.map((o) =>
    h('button', {
      type: 'button',
      class: 'opt' + (solved && o.ok ? ' right' : ''),
      disabled: !!solved,
      html: md(o.text),
      onclick: (e: MouseEvent) => {
        if (done) return;
        const b = e.currentTarget as HTMLButtonElement;
        if (o.ok) {
          done = true;
          b.classList.add('right');
          fb.className = 'fb good';
          fb.innerHTML = '<strong>' + t('Correct.') + '</strong> ' + md(q.why);
        } else {
          b.classList.add('wrong');
          if (first && onMiss) onMiss();
          if (once) {
            done = true;
            btns[order.findIndex((x) => x.ok)].classList.add('right');
            fb.className = 'fb bad';
            fb.innerHTML = '<strong>' + t('Not quite.') + '</strong> ' + md(q.why);
          } else {
            fb.className = 'fb bad';
            fb.textContent = t('Not quite. Think about why, then try another.');
          }
        }
        if (done || once) {
          for (const x of btns) x.disabled = done;
          if (onResult) onResult(o.ok && first);
        }
        first = false;
      },
    }),
  );
  if (solved) {
    fb.className = 'fb good';
    fb.innerHTML = '<strong>' + t('Correct.') + '</strong> ' + md(q.why);
  }
  return h('div', { class: 'q' }, h('p', { class: 'q-text', html: md(q.q) }), h('div', { class: 'opts' }, btns), fb);
}

export const DOCK_ICON_SVG =
  '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M2 14h4M10 8h4M18 16h4"/></svg>';
export const DOCK_CHEV_SVG =
  '<svg class="lp-dock-chev" viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>';

// Shared collapsible floating control dock used by the Landing reactor and Break Room meadow.
export function dockControlBar(ariaLabel: string, extraClass: string, ...items: DomChild[]): HTMLDivElement {
  let collapsed = true;
  const dockItems = h('div', { class: 'lp-dock-items' }, ...items);
  dockItems.inert = true;
  const toggleLabel = h('span', {}, t('Show'));
  const toggleBtn = h(
    'button',
    {
      type: 'button',
      class: 'lp-dock-toggle',
      'aria-expanded': 'false',
      'aria-label': t('Show controls'),
      title: t('Show controls'),
      onclick: () => {
        collapsed = !collapsed;
        dock.setAttribute('data-collapsed', String(collapsed));
        dockItems.inert = collapsed;
        toggleBtn.setAttribute('aria-expanded', String(!collapsed));
        const lbl = collapsed ? t('Show controls') : t('Hide controls');
        toggleBtn.setAttribute('aria-label', lbl);
        toggleBtn.setAttribute('title', lbl);
        toggleLabel.textContent = collapsed ? t('Show') : t('Hide');
      },
    },
    h('span', { html: DOCK_ICON_SVG }),
    toggleLabel,
    h('span', { html: DOCK_CHEV_SVG }),
  );

  const dock = h(
    'div',
    {
      class: 'lp-dock' + (extraClass ? ' ' + extraClass : ''),
      'data-collapsed': 'true',
      role: 'group',
      'aria-label': ariaLabel,
    },
    dockItems,
    toggleBtn,
  );
  return dock;
}
