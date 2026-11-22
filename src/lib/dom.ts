// Typed DOM builder, mini-markdown, code blocks, SVG tree connectors, accessible modal dialogs, and table wrappers.
import { LANG_LABELS, esc, highlight, mdInline } from './highlight.ts';
import { t } from './i18n.ts';
import type { SplitCode } from './types.ts';

export { esc, highlight };

export type DomChild = Node | string | number | boolean | null | undefined | DomChild[];

export interface DomAttrs {
  class?: string;
  html?: string;
  style?: string | Record<string, string | number>;
  [attr: string]: unknown;
}

const T_ATTR = new Set(['placeholder', 'title', 'aria-label']);

// `code` and **bold** only.
export function md(s: string): string {
  return mdInline(t(s));
}

export function h<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  attrs?: DomAttrs | null,
  ...kids: DomChild[]
): HTMLElementTagNameMap[K];
export function h(tag: string, attrs?: DomAttrs | null, ...kids: DomChild[]): HTMLElement;
export function h(tag: string, attrs?: DomAttrs | null, ...kids: DomChild[]): HTMLElement {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs || {})) {
    if (v == null || v === false) continue;
    if (k === 'class') {
      el.className = String(v);
    } else if (k === 'html') {
      el.innerHTML = String(v);
    } else if (k === 'style' && typeof v === 'object') {
      for (const [p, x] of Object.entries(v as Record<string, string | number>)) {
        if (p.startsWith('--')) el.style.setProperty(p, String(x));
        else el.style.setProperty(p.replace(/[A-Z]/g, (m) => '-' + m.toLowerCase()), String(x));
      }
    } else if (k.startsWith('on') && typeof v === 'function') {
      el.addEventListener(k.slice(2), v as EventListener);
    } else {
      el.setAttribute(k, v === true ? '' : T_ATTR.has(k) ? t(String(v)) : String(v));
    }
  }
  const appendKids = (items: DomChild[]): void => {
    for (const kid of items) {
      if (kid == null || kid === false || kid === true) continue;
      if (Array.isArray(kid)) {
        appendKids(kid);
      } else if (typeof kid === 'object' && 'nodeType' in kid) {
        el.append(kid);
      } else {
        el.append(document.createTextNode(typeof kid === 'string' ? t(kid) : String(kid)));
      }
    }
  };
  appendKids(kids);
  return el;
}

const copyTimers = new WeakMap<HTMLElement, ReturnType<typeof setTimeout>>();
let lastCopyMsg = '';

export interface CodeBlockOptions {
  blurComments?: boolean;
  blurToggle?: boolean;
}

export function codeBlock(code: string, lang: string, opts: CodeBlockOptions = {}): HTMLDivElement {
  const cleanCode = code.replace(/^\n+|\s+$/g, '');
  const label = LANG_LABELS[lang] || lang;
  const tip = h('span', { class: 'copy-tip', role: 'status' });
  const pre = h('pre', { tabindex: '0' }, h('code', { html: highlight(cleanCode, lang === 'tsx' ? 'ts' : lang) }));
  let hidden = !!opts.blurComments;
  const wrap = h('div', { class: 'code' + (hidden ? ' hide-hints' : '') });
  const hintBtn = opts.blurToggle
    ? h(
        'button',
        {
          type: 'button',
          class: 'copy',
          onclick: () => {
            hidden = !hidden;
            wrap.classList.toggle('hide-hints', hidden);
            if (hintBtn) hintBtn.textContent = t(hidden ? 'Show hints' : 'Hide hints');
          },
        },
        hidden ? 'Show hints' : 'Hide hints',
      )
    : null;
  const btn = h(
    'button',
    {
      class: 'copy',
      type: 'button',
      onclick: async () => {
        let ok = false;
        try {
          await navigator.clipboard.writeText(cleanCode);
          ok = true;
        } catch {
          ok = false;
        }
        const prevTimer = copyTimers.get(btn);
        if (prevTimer) clearTimeout(prevTimer);
        btn.removeAttribute('data-copied');
        btn.removeAttribute('data-failed');
        let msg = t(ok ? 'Copied' : 'Copy failed');
        if (msg === lastCopyMsg) msg += '\u00A0';
        lastCopyMsg = msg;
        tip.textContent = '';
        void btn.offsetWidth;
        btn.setAttribute(ok ? 'data-copied' : 'data-failed', '');
        requestAnimationFrame(() => {
          tip.textContent = msg;
        });
        copyTimers.set(
          btn,
          setTimeout(() => {
            btn.removeAttribute('data-copied');
            btn.removeAttribute('data-failed');
            tip.textContent = '';
          }, 1800),
        );
      },
    },
    'Copy',
  );
  wrap.append(
    h('div', { class: 'code-bar' }, h('span', {}, label), h('span', { class: 'copy-wrap' }, hintBtn, tip, btn)),
    pre,
  );
  return wrap;
}

// Render either a single codeBlock or accessible section tabs derived from l.splits.
export function codeFiles(
  code: string,
  lang: string,
  splits?: SplitCode[],
  opts: CodeBlockOptions = {},
): HTMLDivElement {
  if (!splits || !splits.length) return codeBlock(code, lang, opts);
  const lines = code.replace(/^\n+|\s+$/g, '').split('\n');
  const idxs = splits.map(([, anchor]) => lines.findIndex((ln) => ln.includes(anchor)));
  if (idxs.some((i) => i < 0)) return codeBlock(code, lang, opts);
  const tabs: [string, string][] = splits.map(([label], i) => {
    const start = idxs[i];
    const end = i + 1 < idxs.length ? idxs[i + 1] : lines.length;
    return [label, lines.slice(start, end).join('\n').trimEnd()];
  });
  tabs.push(['Full file', lines.join('\n')]);
  const panel = h('div', { role: 'tabpanel' });
  const bar = h('div', { class: 'code-tabs', role: 'tablist', 'aria-label': 'Code sections' });
  const btns: HTMLButtonElement[] = [];
  const select = (k: number) => {
    btns.forEach((b, i) => {
      const on = i === k;
      b.classList.toggle('on', on);
      b.setAttribute('aria-selected', String(on));
      b.tabIndex = on ? 0 : -1;
    });
    panel.replaceChildren(codeBlock(tabs[k][1], lang, opts));
  };
  tabs.forEach(([label], i) => {
    const b = h(
      'button',
      {
        type: 'button',
        role: 'tab',
        'aria-selected': i === 0 ? 'true' : 'false',
        tabindex: i === 0 ? '0' : '-1',
        onclick: () => select(i),
        onkeydown: (e: KeyboardEvent) => {
          if (e.key === 'ArrowRight') {
            select((i + 1) % tabs.length);
            btns[(i + 1) % tabs.length].focus();
          }
          if (e.key === 'ArrowLeft') {
            select((i - 1 + tabs.length) % tabs.length);
            btns[(i - 1 + tabs.length) % tabs.length].focus();
          }
        },
      },
      label,
    );
    btns.push(b);
    bar.append(b);
  });
  select(0);
  return h('div', { class: 'code-tabwrap' }, bar, panel);
}

// Connect parent/child component nodes in `.tree` visualizations with crisp SVG hierarchy lines.
export function treeWire(
  treeEl: HTMLElement,
  edges: [HTMLElement | null | undefined, HTMLElement[]][],
): HTMLElement {
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('class', 'tree-wires');
  svg.setAttribute('aria-hidden', 'true');
  treeEl.prepend(svg);
  const draw = () => {
    const tr = treeEl.getBoundingClientRect();
    if (!tr.width || !tr.height) return;
    svg.setAttribute('viewBox', `0 0 ${tr.width} ${tr.height}`);
    let d = '';
    for (const [parent, children] of edges) {
      if (!parent || !children.length) continue;
      const pr = parent.getBoundingClientRect();
      const px = pr.left - tr.left + pr.width / 2;
      const py = pr.bottom - tr.top;
      const cRects = children.map((c) => c.getBoundingClientRect());
      const midY = py + (cRects[0].top - pr.bottom) / 2;
      d += `M${px} ${py}V${midY}`;
      const xs = cRects.map((cr) => cr.left - tr.left + cr.width / 2);
      d += `M${Math.min(...xs)} ${midY}H${Math.max(...xs)}`;
      for (let i = 0; i < cRects.length; i++) {
        d += `M${xs[i]} ${midY}V${cRects[i].top - tr.top}`;
      }
    }
    svg.innerHTML = `<path d="${d}"/>`;
  };
  if (typeof ResizeObserver === 'function') new ResizeObserver(draw).observe(treeEl);
  requestAnimationFrame(draw);
  return treeEl;
}

function attachBackdropDismiss(dlg: HTMLDialogElement): void {
  if ('closedBy' in HTMLDialogElement.prototype) return;
  let downOut = false;
  const out = (e: MouseEvent) => {
    const r = dlg.getBoundingClientRect();
    return e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom;
  };
  dlg.addEventListener('pointerdown', (e) => {
    downOut = out(e);
  });
  dlg.addEventListener('click', (e) => {
    if (downOut && out(e)) dlg.close('');
  });
}

export interface ConfirmDialogOptions {
  title?: string;
  confirmText?: string;
  cancelText?: string;
  danger?: boolean;
}

// Accessible native modal dialog helper (showModal + safe autofocus + closedby fallback).
export function confirmDialog(
  message: string,
  { title = 'Confirm', confirmText = 'Continue', cancelText = 'Cancel', danger = false }: ConfirmDialogOptions = {},
): Promise<boolean> {
  return new Promise((resolve) => {
    const id = 'dlg-' + Math.random().toString(36).slice(2, 8);
    const dlg = h('dialog', { class: 'sm-dialog', closedby: 'any', 'aria-labelledby': id });
    const cancelBtn = h(
      'button',
      { type: 'submit', value: 'cancel', class: 'btn ghost', autofocus: danger },
      cancelText,
    );
    const okBtn = h(
      'button',
      { type: 'submit', value: 'ok', class: 'btn' + (danger ? ' danger' : ''), autofocus: !danger },
      confirmText,
    );
    const form = h(
      'form',
      { method: 'dialog' },
      h('h2', { id }, title),
      h('p', {}, message),
      h('div', { class: 'dlg-actions' }, cancelBtn, okBtn),
    );
    dlg.append(form);
    attachBackdropDismiss(dlg);
    dlg.addEventListener('close', () => {
      const ok = dlg.returnValue === 'ok';
      dlg.returnValue = '';
      dlg.remove();
      resolve(ok);
    });
    document.body.append(dlg);
    dlg.showModal();
  });
}

export interface AlertDialogOptions {
  title?: string;
  okText?: string;
}

export function alertDialog(
  message: string,
  { title = 'Notice', okText = 'OK' }: AlertDialogOptions = {},
): Promise<void> {
  return new Promise((resolve) => {
    const id = 'dlg-' + Math.random().toString(36).slice(2, 8);
    const dlg = h('dialog', { class: 'sm-dialog', closedby: 'any', 'aria-labelledby': id });
    dlg.append(
      h(
        'form',
        { method: 'dialog' },
        h('h2', { id }, title),
        h('p', {}, message),
        h('div', { class: 'dlg-actions' }, h('button', { type: 'submit', value: 'ok', class: 'btn', autofocus: true }, okText)),
      ),
    );
    attachBackdropDismiss(dlg);
    dlg.addEventListener('close', () => {
      dlg.returnValue = '';
      dlg.remove();
      resolve();
    });
    document.body.append(dlg);
    dlg.showModal();
  });
}

// Wrap tables in a keyboard-scrollable landmark with an accessible caption.
export function tableWrap(caption: string, tbl: HTMLTableElement): HTMLDivElement {
  if (caption && !tbl.querySelector('caption')) {
    tbl.prepend(h('caption', { class: 'sr-only' }, caption));
  }
  return h('div', { class: 'table-wrap', role: 'region', tabindex: 0, 'aria-label': caption || 'Data table' }, tbl);
}
