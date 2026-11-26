// My Study Notes view: search, filter, review, and export Teach-Back notes as a Markdown study guide.
// Uses the compact pre-rendered localized catalog from #view-data (never downloads curriculum prose).
import { h } from '../../lib/dom.ts';
import { getLevels, t as T } from '../../lib/i18n.ts';
import { dots, href, lessonHref } from '../../lib/ui.ts';
import { day, key, peek } from '../../lib/state.ts';
import type { CatalogLesson, CatalogTrack, TrackCatalog } from '../../lib/types.ts';

const RUBRIC_TOTAL = 5;

interface NoteEntry {
  k: string;
  track: CatalogTrack;
  lesson: CatalogLesson;
  text: string;
  rubricDone: number;
  teachDone: boolean;
}

function collectNotes(catalog: TrackCatalog): NoteEntry[] {
  const entries: NoteEntry[] = [];
  for (const track of catalog.tracks || []) {
    for (const lesson of track.lessons || []) {
      const k = key(track, lesson);
      const st = peek(k);
      const text = typeof st.notes === 'string' ? st.notes.trim() : '';
      if (!text) continue;
      const rubricDone = Array.isArray(st.rubric) ? st.rubric.filter(Boolean).length : 0;
      entries.push({
        k,
        track,
        lesson,
        text,
        rubricDone,
        teachDone: Boolean(st.teach),
      });
    }
  }
  return entries;
}

function buildMarkdownGuide(entries: NoteEntry[], levels: readonly [string, string, string, string]): string {
  const today = day();
  const lines = [
    '# Stack Mastery Study Guide',
    '',
    `Exported: ${today}`,
    '',
  ];
  let currentTrack = '';
  for (const e of entries) {
    if (e.track.id !== currentTrack) {
      currentTrack = e.track.id;
      lines.push(`## ${e.track.name}`, '');
    }
    const levelName = levels[e.lesson.level] || '';
    const status = `${e.rubricDone}/${RUBRIC_TOTAL}`;
    lines.push(`### ${e.lesson.title} (${levelName})`, '');
    lines.push(`- Rubric: ${status}`, '');
    lines.push(e.text, '');
  }
  return lines.join('\n');
}

export function notes(catalog: TrackCatalog, onCleanup?: (fn: () => void) => void): HTMLDivElement {
  const tracks = catalog.tracks || [];
  const levels = getLevels();
  const activeUrls = new Set<string>();

  const revokeAll = () => {
    for (const u of activeUrls) {
      try {
        URL.revokeObjectURL(u);
      } catch {
        /* ignore */
      }
    }
    activeUrls.clear();
  };
  onCleanup?.(revokeAll);

  const searchInput = h('input', {
    id: 'notes-search',
    type: 'search',
    class: 'notes-search',
    placeholder: 'Search your Teach-Back notes…',
  });
  const trackSel = h(
    'select',
    { id: 'notes-track' },
    [['', 'All tracks'], ...tracks.map((tr) => [tr.id, tr.name])].map(([v, label]) => h('option', { value: v }, label)),
  );
  const exportBtn = h(
    'button',
    {
      type: 'button',
      class: 'btn',
      'data-notes-export': '',
      onclick: () => {
        const all = collectNotes(catalog);
        if (!all.length) return;
        const mdText = buildMarkdownGuide(all, levels);
        const blob = new Blob([mdText], { type: 'text/markdown;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        activeUrls.add(url);
        const a = h('a', {
          href: url,
          download: `stack-mastery-study-guide-${day()}.md`,
        });
        document.body.append(a);
        a.click();
        a.remove();
        setTimeout(() => {
          if (activeUrls.has(url)) {
            URL.revokeObjectURL(url);
            activeUrls.delete(url);
          }
        }, 1000);
      },
    },
    'Export Markdown Study Guide',
  );

  const countEl = h('p', { class: 'muted', 'aria-live': 'polite' });
  const listEl = h('div', { class: 'notes-list', 'data-notes-list': '' });

  const renderList = () => {
    const all = collectNotes(catalog);
    exportBtn.disabled = all.length === 0;

    if (!all.length) {
      countEl.textContent = '';
      listEl.replaceChildren(
        h(
          'div',
          { class: 'empty' },
          h('strong', {}, 'No study notes yet.'),
          h(
            'p',
            {},
            'Write a Teach-Back explanation at the bottom of any lesson and it will appear here for review and export.',
          ),
          h('a', { class: 'btn', href: href('/dashboard/') }, 'Explore tracks on dashboard'),
        ),
      );
      return;
    }

    const q = searchInput.value.trim().toLowerCase();
    const tid = trackSel.value;
    const filtered = all.filter((e) => {
      if (tid && e.track.id !== tid) return false;
      if (!q) return true;
      return (
        e.text.toLowerCase().includes(q) ||
        e.lesson.title.toLowerCase().includes(q) ||
        e.track.name.toLowerCase().includes(q)
      );
    });

    countEl.textContent = T('Showing {shown} of {total} study notes.', { shown: filtered.length, total: all.length });

    if (!filtered.length) {
      listEl.replaceChildren(
        h(
          'div',
          { class: 'empty' },
          h('strong', {}, 'No notes match your filter.'),
          h('p', {}, 'Try clearing the search box or switching to All tracks.'),
        ),
      );
      return;
    }

    listEl.replaceChildren(
      ...filtered.map((e) =>
        h(
          'article',
          { class: 'note-card', style: { '--tc': `var(--${e.track.id})` }, 'data-note-key': e.k },
          h(
            'header',
            { class: 'note-head' },
            h(
              'div',
              {},
              h('p', { class: 'eyebrow' }, `${e.track.name} · ${levels[e.lesson.level]}`),
              h('h2', {}, h('a', { href: lessonHref(e.track, e.lesson) }, e.lesson.title)),
            ),
            h(
              'div',
              { class: 'note-meta' },
              h('span', { class: 'chip' }, T('Rubric {done}/{total}', { done: e.rubricDone, total: RUBRIC_TOTAL })),
              dots(e.k),
            ),
          ),
          h('div', { class: 'note-body' }, e.text),
        ),
      ),
    );
  };

  searchInput.addEventListener('input', renderList);
  trackSel.addEventListener('change', renderList);
  renderList();

  return h(
    'div',
    { class: 'page' },
    h(
      'header',
      { class: 'head' },
      h('p', { class: 'eyebrow' }, 'Become the teacher'),
      h('h1', {}, 'My study notes'),
      h(
        'p',
        { class: 'lede' },
        'Every Teach-Back explanation you write across lessons gathers here. Search, filter by track, or export your personal Markdown study guide.',
      ),
    ),
    h(
      'div',
      { class: 'notes-controls' },
      h('div', { class: 'notes-field' }, h('label', { for: 'notes-search' }, 'Search notes'), searchInput),
      h('div', { class: 'notes-field' }, h('label', { for: 'notes-track' }, 'Filter by track'), trackSel),
      h('div', { class: 'notes-export-wrap' }, exportBtn),
    ),
    countEl,
    listEl,
  );
}
