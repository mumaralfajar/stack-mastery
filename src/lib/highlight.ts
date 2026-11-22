// HTML escaping and lightweight syntax highlighting for code blocks.

const ESC_MAP: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
};

export function esc(s: unknown): string {
  return String(s).replace(/[&<>"]/g, (c) => ESC_MAP[c] ?? c);
}

const KW: Record<string, string> = {
  cs: 'abstract as async await base bool break byte case catch char class const continue decimal default delegate do double else enum event false finally float for foreach get if in init int interface internal is lock long namespace new null object out override params private protected public readonly record ref required return sealed set static string struct switch this throw true try using var virtual void when where while with yield',
  sql: 'select from where group by having order limit offset insert into values update set delete create table index primary key foreign references join inner left right full outer cross on as and or not null is in exists between like distinct union all case when then else end with over partition rows begin commit rollback transaction unique check default asc desc top view constraint alter add drop include integer int text real varchar nvarchar decimal date datetime2 bit',
  dart: 'abstract as assert async await base bool break case catch class const continue default do double dynamic else enum extends extension external factory false final finally for get if implements import in int interface is late library mixin new null num on operator part required return sealed set show static super switch sync this throw true try typedef var void when while with yield',
  go: 'any append bool break byte cap case chan clear close cmp complex complex64 complex128 const continue copy default defer delete else error fallthrough false float32 float64 for func go goto if imag import int int8 int16 int32 int64 interface iota len make map max min new nil package print println range real recover return rune select string struct switch true type uint uint8 uint16 uint32 uint64 uintptr var',
  lua: 'and break do else elseif end false for function goto if in local nil not or repeat return then true until while redis call pcall tonumber tostring math table',
  ts: 'any as async await boolean break case catch class const continue default do else enum export extends false finally for from function if implements import in infer interface is keyof let never new null number of override private protected public readonly return satisfies string switch this throw true try type typeof undefined unknown var void while',
};

const RX: Record<string, RegExp> = {};

// Markup, protocol, and config languages get their own token patterns: comment, string, keyword, number, name.
const SPEC: Record<string, string[]> = {
  css: [
    '\\/\\*[\\s\\S]*?\\*\\/',
    '"[^"]*"|\'[^\']*\'',
    '@[\\w-]+|!important',
    '-?\\b\\d+(?:\\.\\d+)?(?:px|rem|em|fr|vh|vw|dvh|ch|ms|s|deg|%)?',
    '--[\\w-]+|[a-z-]+(?=\\s*:)',
  ],
  html: [
    '<!--[\\s\\S]*?-->',
    '"[^"]*"',
    '<\\/?[a-zA-Z][\\w-]*|\\/?>',
    '(?!)',
    '[a-z-]+(?==)',
  ],
  http: [
    '#[^\\n]*',
    '"[^"]*"',
    '\\b(?:GET|POST|PUT|PATCH|DELETE|HEAD|OPTIONS)\\b|HTTP\\/[123](?:\\.[01])?|\\b[1-5]\\d\\d\\b',
    '-?\\b\\d+(?:\\.\\d+)?\\b',
    '(?<![A-Za-z0-9-])[A-Za-z][A-Za-z0-9-]*(?=:(?!\\/\\/))',
  ],
  yaml: [
    '#[^\\n]*',
    '"[^"]*"|\'[^\']*\'',
    '\\b(?:true|false|null|yes|no)\\b',
    '-?\\b\\d+(?:\\.\\d+)?(?:ms|s|m|h|Mi|Gi|%)?\\b',
    '[a-zA-Z_][\\w.-]*(?=\\s*:)',
  ],
  sh: [
    '#[^\\n]*',
    '"[^"]*"|\'[^\']*\'',
    '\\b(?:dotnet|npm|npx|git|node|cd|code|docker|go|flutter|dart|bun|mkdir|curl|kubectl|redis-cli)\\b',
    '(?!)',
    '(?<=\\s)--?[a-zA-Z][\\w-]*',
  ],
};

const TPL_RX =
  /(<!--[\s\S]*?-->)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')|(@(?:if|else\s+if|else|for|empty|switch|case|default|defer|placeholder|loading|error)\b|\{\{|\}\})|(<\/?[a-zA-Z][\w-]*|\/?>)|([([]?[a-zA-Z][\w.-]*[\])]?(?==))/g;

function highlightTemplate(raw: string): string {
  const inner = raw.slice(1, -1);
  let out = '<span class="tk-s">`</span>';
  let last = 0;
  inner.replace(TPL_RX, (m, c, s, k, tag, _attr, i: number) => {
    out += esc(inner.slice(last, i));
    const cls = c ? 'c' : s ? 's' : k ? 'k' : tag ? 't' : 'n';
    out += `<span class="tk-${cls}">${esc(m)}</span>`;
    last = i + m.length;
    return m;
  });
  return out + esc(inner.slice(last)) + '<span class="tk-s">`</span>';
}

function highlightInterp(raw: string, lang: string): string {
  if (lang === 'cs' && !raw.startsWith('$"') && !raw.startsWith('@$"') && !raw.startsWith('$@"')) {
    return `<span class="tk-s">${esc(raw)}</span>`;
  }
  if (lang === 'ts' && !raw.startsWith('`')) return `<span class="tk-s">${esc(raw)}</span>`;
  if (lang !== 'cs' && lang !== 'ts' && lang !== 'dart') return `<span class="tk-s">${esc(raw)}</span>`;
  const pattern =
    lang === 'ts'
      ? /(\$\{[^}]*\})/g
      : lang === 'cs'
        ? /(\{\{|\}\}|\{[^}]*\})/g
        : /(\$\{[^}]*\}|\$[a-zA-Z_]\w*)/g;
  let out = '';
  let last = 0;
  let any = false;
  raw.replace(pattern, (m, _g, i: number) => {
    any = true;
    if (i > last) out += `<span class="tk-s">${esc(raw.slice(last, i))}</span>`;
    out += m === '{{' || m === '}}' ? `<span class="tk-s">${esc(m)}</span>` : `<span class="tk-n">${esc(m)}</span>`;
    last = i + m.length;
    return m;
  });
  if (!any) return `<span class="tk-s">${esc(raw)}</span>`;
  if (last < raw.length) out += `<span class="tk-s">${esc(raw.slice(last))}</span>`;
  return out;
}

function rx(lang: string): RegExp {
  if (RX[lang]) return RX[lang];
  if (SPEC[lang]) {
    RX[lang] = new RegExp(SPEC[lang].map((p) => `(${p})`).join('|'), 'g');
    return RX[lang];
  }
  const sql = lang === 'sql';
  const comment = sql ? '--[^\\n]*' : '\\/\\/[^\\n]*|\\/\\*[\\s\\S]*?\\*\\/';
  const prefix = lang === 'cs' ? '(?:\\$@?|@\\$)?' : '';
  const str = sql ? "'[^']*'" : `${prefix}"(?:[^"\\\\\\n]|\\\\.)*"|'(?:[^'\\\\\\n]|\\\\.)*'|\`[^\`]*\``;
  const kw = (KW[lang] || KW.cs).split(' ').join('|');
  RX[lang] = new RegExp(
    `(${comment})|(${str})|\\b(${kw})\\b|\\b(\\d+(?:\\.\\d+)?)\\b|\\b([A-Z][A-Za-z0-9]*)\\b`,
    sql ? 'gi' : 'g',
  );
  return RX[lang];
}

export function highlight(code: string, lang: string): string {
  let out = '';
  let last = 0;
  code.replace(rx(lang), (m, c, s, k, n, _t, i: number) => {
    out += esc(code.slice(last, i));
    if (s) {
      if (lang === 'ts' && m.startsWith('`') && /(?:\n|<[a-zA-Z/]|@(?:if|for|switch|defer)\b|\{\{)/.test(m)) {
        out += highlightTemplate(m);
      } else {
        out += highlightInterp(m, lang);
      }
    } else {
      const cls = c ? 'c' : k ? 'k' : n ? 'n' : lang === 'sql' ? '' : 't';
      out += cls ? `<span class="tk-${cls}">${esc(m)}</span>` : esc(m);
    }
    last = i + m.length;
    return m;
  });
  return out + esc(code.slice(last));
}
