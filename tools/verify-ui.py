"""End-to-end verification of the built static site in dist/.

Covers the SSG output structure, the landing-page JS budget, single-viz chunk isolation, legacy `#/...` redirects,
SEO metadata, the PWA manifest + offline service worker, UI behaviour (labs, playgrounds, interview prep, break room,
cross-tab sync, backups) in English and Indonesian, responsive layout, and axe-core WCAG 2.2 AA scans.
Usage: bun run build && python -u tools/verify-ui.py
"""
from html.parser import HTMLParser
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import base64
import hashlib
import json
import re
import struct
import sys
import threading
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent.parent
DIST = ROOT / "dist"
BASE_PATH = "/stack-mastery/"
SITE = "https://mumaralfajar.github.io"
AXE_JS = ROOT / "node_modules" / "axe-core" / "axe.min.js"
AXE_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]
AXE_ROUTES = ["", "dashboard/", "break/", "track/sysdesign/", "lesson/angular/signals/", "lab/syscache/", "play/sql/",
              "play/ts/", "play/css/", "play/dart/", "interview/", "interview/coding/", "interview/behavioral/", "interview/mock/", "exam/", "search/", "plan/go/types/"]
EXPECTED_VIZ = 40
EXPECTED_LESSONS = 135
EXPECTED_TRACKS = 10
EXPECTED_PROBLEMS = 21
EXPECTED_DESIGN_CASES = 8
LANDING_JS_BUDGET = 46080  # bytes, raw (uncompressed): strictly < 45 KB
VIZ_CHUNK_RX = re.compile(r"/_astro/(viz|vizcss|vizmore|vizangular|vizflutter|vizplus|vizgo|vizsys)\.[\w-]+\.js$")
# Chunks that carry lesson prose for every track (English tracks and Indonesian overlays).
CURRICULUM_CHUNK_RX = re.compile(r"/_astro/(data|tracks-core|tracks-ui|core|web)\.[\w-]+\.js$")
APP_GLOBALS = ["TRACKS", "VIZ", "I18N", "PLAY", "INTERVIEW", "IV", "PROJECTS", "LEVELS", "h", "md", "t", "esc", "codeBlock",
               "codeFiles", "confirmDialog", "alertDialog", "tableWrap", "S", "routePath", "legacyHashToPath"]


class StaticSiteHandler(SimpleHTTPRequestHandler):
    """Serve dist/ under /stack-mastery/ like GitHub Pages: directory index.html, 301 to trailing slash, 404.html."""

    def translate_path(self, path):
        clean = path.split("?", 1)[0].split("#", 1)[0]
        if clean.startswith("/stack-mastery"):
            clean = clean[len("/stack-mastery"):] or "/"
        target = (DIST / clean.lstrip("/")).resolve()
        if not target.is_relative_to(DIST.resolve()):
            return str(DIST / "__missing__")
        return str(target)

    def send_error(self, code, message=None, explain=None):
        if code == 404:
            body = (DIST / "404.html").read_bytes()
            self.send_response(404)
            self.send_header("Content-Type", "text/html; charset=utf-8")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            if self.command != "HEAD":
                self.wfile.write(body)
            return
        super().send_error(code, message, explain)

    def end_headers(self):
        # Never let the browser cache between runs; the service worker is what we are testing.
        self.send_header("Cache-Control", "no-cache")
        super().end_headers()

    def log_message(self, format, *args):
        pass


StaticSiteHandler.extensions_map.update({".webmanifest": "application/manifest+json", ".js": "text/javascript"})


class QuietServer(ThreadingHTTPServer):
    """Browsers abort in-flight requests when a page is closed or a route is blocked; that is not a test failure."""

    def handle_error(self, request, client_address):
        if isinstance(sys.exc_info()[1], ConnectionError):
            return
        super().handle_error(request, client_address)


def start_server():
    srv = QuietServer(("127.0.0.1", 0), StaticSiteHandler)
    port = srv.server_address[1]
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    return srv, f"http://127.0.0.1:{port}{BASE_PATH}"


WCAG_DOM_AUDIT = """() => {
  const issues = [];
  const ids = new Map();
  for (const el of document.querySelectorAll('[id]')) ids.set(el.id, (ids.get(el.id) || 0) + 1);
  for (const [k, n] of ids) if (n > 1) issues.push('Duplicate id: ' + k);
  for (const el of document.querySelectorAll('select, textarea, input')) {
    if (el.type === 'hidden') continue;
    if (el.closest('label') || el.getAttribute('aria-label') || el.getAttribute('aria-labelledby')) continue;
    if (el.id && document.querySelector('label[for="' + el.id + '"]')) continue;
    issues.push('Unlabelled form control: ' + el.tagName + '.' + el.className);
  }
  for (const el of document.querySelectorAll('button, a')) {
    const txt = (el.textContent || '').trim();
    const aria = el.getAttribute('aria-label') || el.getAttribute('aria-labelledby');
    if (!txt && !aria) issues.push('Empty interactive element: ' + el.outerHTML.slice(0, 80));
  }
  for (const th of document.querySelectorAll('table.t thead th')) {
    if (!th.getAttribute('scope')) issues.push('Missing th[scope]: ' + th.textContent);
  }
  for (const img of document.querySelectorAll('[role="img"]')) {
    if (!img.getAttribute('aria-label') && !img.getAttribute('aria-labelledby')) {
      issues.push('role=img missing aria-label: ' + img.outerHTML.slice(0, 80));
    }
  }
  return issues;
}"""

# A page is ready once its islands have hydrated: no busy view root, lessons marked hydrated, labs mounted.
PAGE_READY = """() => {
  const v = document.querySelector('#view');
  if (!v || !v.querySelector('.page, .lp-root')) return false;
  if (v.querySelector('[aria-busy="true"]')) return false;
  const lesson = v.querySelector('[data-lesson-root]');
  if (lesson && !lesson.hasAttribute('data-hydrated')) return false;
  for (const viz of v.querySelectorAll('.viz[data-viz]')) if (!viz.childElementCount) return false;
  return true;
}"""


def lang_init(lang):
    # Init scripts also run in sandboxed preview iframes, where touching localStorage throws.
    return f"if (window === window.top) localStorage.setItem('stackmastery.lang', '{lang}');"


def goto(page, base, path, timeout=15000):
    page.goto(base + path, wait_until="domcontentloaded")
    page.wait_for_function(PAGE_READY, timeout=timeout)
    page.wait_for_timeout(120)


def launch_browser(p):
    """Bundled Playwright Chromium first (what CI installs); fall back to a system Chrome install locally."""
    try:
        return p.chromium.launch(headless=True)
    except Exception as bundled_err:
        try:
            return p.chromium.launch(channel="chrome", headless=True)
        except Exception as chrome_err:
            raise RuntimeError(f"No Chromium available. Bundled: {bundled_err}\nChrome channel: {chrome_err}") from chrome_err


AXE_RUN = """async (tags) => {
  const r = await axe.run(document, { runOnly: { type: 'tag', values: tags }, resultTypes: ['violations'] });
  return r.violations.filter(v => v.impact === 'critical' || v.impact === 'serious').map(v => ({
    id: v.id, impact: v.impact, help: v.help,
    nodes: v.nodes.slice(0, 3).map(n => n.target.join(' ') + ' :: ' + (n.failureSummary || '').replace(/\\s+/g, ' ').slice(0, 220))
  }));
}"""


def axe_violations(page):
    """Inject the local axe-core build and return critical + serious WCAG 2.2 AA violations."""
    if not page.evaluate("typeof window.axe !== 'undefined'"):
        page.add_script_tag(content=AXE_JS.read_text(encoding="utf-8"))
    return page.evaluate(AXE_RUN, AXE_TAGS)


def watch_errors(page, sink, label=""):
    page.on("pageerror", lambda e: sink.append(f"{label}pageerror: {e}"))
    page.on("console", lambda m: sink.append(f"{label}console.{m.type}: {m.text}") if m.type == "error" else None)


def watch_requests(page):
    urls = []
    page.on("request", lambda r: urls.append(r.url))
    return urls


# ---------------------------------------------------------------------------------------------------------------
# Static output checks (no browser)
# ---------------------------------------------------------------------------------------------------------------
IMPORT_RX = re.compile(r"""(?:import|export)\s*(?:[\w*{}\s,$]+from\s*)?["'](\.{1,2}/[^"']+)["']""")


def page_js_bytes(html_rel):
    """Raw bytes of JS a page loads up front: bundled <script src> files plus their static import graph, plus
    executable inline scripts (JSON and JSON-LD data blocks are not code and are excluded)."""
    html = (DIST / html_rel).read_text(encoding="utf-8")
    srcs = re.findall(r'<script[^>]*\bsrc="([^"]+)"', html)
    inline = [body for attrs, body in re.findall(r"<script(?![^>]*\bsrc=)([^>]*)>(.*?)</script>", html, re.S)
              if "application/json" not in attrs and "application/ld+json" not in attrs]
    seen = {}
    stack = [s[len(BASE_PATH):] if s.startswith(BASE_PATH) else s for s in srcs]
    while stack:
        rel = stack.pop()
        if rel in seen:
            continue
        f = DIST / rel
        seen[rel] = f.stat().st_size
        for imp in IMPORT_RX.findall(f.read_text(encoding="utf-8")):
            stack.append((f.parent / imp).resolve().relative_to(DIST.resolve()).as_posix())
    inline_bytes = sum(len(b.encode("utf-8")) for b in inline)
    return sum(seen.values()) + inline_bytes, seen, inline_bytes


class HeadParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.html_lang = None
        self.canonical = None
        self.alternates = {}
        self.meta = {}
        self.jsonld = []
        self.title = ""
        self._in_ld = False
        self._in_title = False

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == "html":
            self.html_lang = a.get("lang")
        elif tag == "link" and a.get("rel") == "canonical":
            self.canonical = a.get("href")
        elif tag == "link" and a.get("rel") == "alternate" and a.get("hreflang"):
            self.alternates[a["hreflang"]] = a.get("href")
        elif tag == "meta" and (a.get("property") or a.get("name")):
            self.meta[a.get("property") or a.get("name")] = a.get("content")
        elif tag == "script" and a.get("type") == "application/ld+json":
            self._in_ld = True
            self.jsonld.append("")
        elif tag == "title":
            self._in_title = True

    def handle_endtag(self, tag):
        if tag == "script":
            self._in_ld = False
        elif tag == "title":
            self._in_title = False

    def handle_data(self, data):
        if self._in_ld:
            self.jsonld[-1] += data
        elif self._in_title:
            self.title += data


def head_of(rel):
    p = HeadParser()
    p.feed((DIST / rel).read_text(encoding="utf-8"))
    return p


def png_size(path):
    with open(path, "rb") as f:
        head = f.read(24)
    if head[:8] != b"\x89PNG\r\n\x1a\n":
        return None
    return struct.unpack(">II", head[16:24])


def static_checks(check):
    count = lambda pattern: len(list(DIST.glob(pattern)))
    for rel in ["index.html", "id/index.html", "404.html", "robots.txt", "sitemap-index.xml", "manifest.webmanifest", "sw.js",
                "favicon.svg", "icons/icon-192.png", "icons/icon-512.png", "icons/icon.svg", "search-index.json", "id/search-index.json"]:
        check((DIST / rel).is_file(), f"dist/{rel} must exist")
    for prefix, label in [("", "EN"), ("id/", "ID")]:
        check(count(f"{prefix}lesson/*/*/index.html") == EXPECTED_LESSONS, f"{label}: expected {EXPECTED_LESSONS} lesson pages, found {count(f'{prefix}lesson/*/*/index.html')}")
        check(count(f"{prefix}plan/*/*/index.html") == EXPECTED_LESSONS, f"{label}: expected {EXPECTED_LESSONS} plan pages")
        check(count(f"{prefix}track/*/index.html") == EXPECTED_TRACKS, f"{label}: expected {EXPECTED_TRACKS} track pages")
        check(count(f"{prefix}lab/*/index.html") == EXPECTED_VIZ, f"{label}: expected {EXPECTED_VIZ} lab pages, found {count(f'{prefix}lab/*/index.html')}")
        check((DIST / prefix / "lab/index.html").is_file(), f"{label}: lab index page missing")
        for kind in ["sql", "ts", "css", "dart"]:
            check((DIST / prefix / f"play/{kind}/index.html").is_file(), f"{label}: /play/{kind}/ missing")
        for sub in ["", "coding/", "patterns/", "design/", "behavioral/", "rapid/", "mock/"]:
            check((DIST / prefix / f"interview/{sub}index.html").is_file(), f"{label}: /interview/{sub} missing")
        check(count(f"{prefix}interview/problem/*/index.html") == EXPECTED_PROBLEMS, f"{label}: expected {EXPECTED_PROBLEMS} problem pages")
        check(count(f"{prefix}interview/design/*/index.html") == EXPECTED_DESIGN_CASES, f"{label}: expected {EXPECTED_DESIGN_CASES} design case pages")
        for page in ["dashboard", "start", "search", "review", "exam", "projects", "teach", "break"]:
            check((DIST / prefix / f"{page}/index.html").is_file(), f"{label}: /{page}/ missing")
    total_lessons = count("lesson/*/*/index.html") + count("id/lesson/*/*/index.html")
    total_plans = count("plan/*/*/index.html") + count("id/plan/*/*/index.html")
    total_labs = count("lab/*/index.html") + count("id/lab/*/index.html")
    total_tracks = count("track/*/index.html") + count("id/track/*/index.html")
    print(f"Static pages: {total_lessons} lessons, {total_plans} plans, {total_labs} labs, {total_tracks} tracks.")
    check(total_lessons == 270 and total_plans == 270 and total_labs == 80 and total_tracks == 20,
          "Expected 270 lesson, 270 plan, 80 lab and 20 track pages")

    robots = (DIST / "robots.txt").read_text(encoding="utf-8")
    check("User-agent: *" in robots and f"Sitemap: {SITE}/stack-mastery/sitemap-index.xml" in robots, f"robots.txt must allow all and list the sitemap: {robots!r}")
    sm_index = (DIST / "sitemap-index.xml").read_text(encoding="utf-8")
    check("sitemap-0.xml" in sm_index, "sitemap-index.xml must reference sitemap-0.xml")
    sm = "".join(p.read_text(encoding="utf-8") for p in DIST.glob("sitemap-*.xml") if p.name != "sitemap-index.xml")
    check(f"{SITE}/stack-mastery/lesson/go/concurrency/" in sm and f"{SITE}/stack-mastery/id/lesson/go/concurrency/" in sm,
          "Sitemap must list EN and ID lesson URLs")
    check('hreflang="id"' in sm, "Sitemap must carry hreflang alternates for EN/ID")
    check("/404" not in sm, "Sitemap must not list the 404 page")

    manifest = json.loads((DIST / "manifest.webmanifest").read_text(encoding="utf-8"))
    for k, v in {"name": "Stack Mastery", "short_name": "Stack Mastery", "start_url": "/stack-mastery/",
                 "scope": "/stack-mastery/", "display": "standalone"}.items():
        check(manifest.get(k) == v, f"manifest.webmanifest {k} must be {v!r}, got {manifest.get(k)!r}")
    check(bool(manifest.get("background_color")) and bool(manifest.get("theme_color")), "manifest needs background_color and theme_color")
    icons = {i["src"]: i for i in manifest.get("icons", [])}
    for src, size in [("/stack-mastery/icons/icon-192.png", (192, 192)), ("/stack-mastery/icons/icon-512.png", (512, 512))]:
        check(src in icons and icons[src].get("type") == "image/png", f"manifest must declare {src} as image/png")
        check(png_size(DIST / src[len(BASE_PATH):]) == size, f"{src} must be a valid {size[0]}x{size[1]} PNG")
    check(any(i.get("type") == "image/svg+xml" for i in icons.values()), "manifest must declare an SVG icon")

    sw = (DIST / "sw.js").read_text(encoding="utf-8")
    check(re.search(r"const VERSION = 'stack-mastery-v\d+'", sw) is not None, "sw.js must use a versioned cache name")
    for url in ["/stack-mastery/", "/stack-mastery/id/", "/stack-mastery/dashboard/", "/stack-mastery/id/dashboard/",
                "/stack-mastery/manifest.webmanifest", "/stack-mastery/favicon.svg", "/stack-mastery/404.html"]:
        check(f"'{url}'" in sw, f"sw.js must precache {url}")

    # Landing performance gate: raw JS referenced by both landing pages stays strictly under 45 KB.
    for rel in ["index.html", "id/index.html"]:
        total, files, inline = page_js_bytes(rel)
        print(f"Landing JS budget {rel}: {total} bytes raw ({len(files)} files + {inline} bytes inline) of {LANDING_JS_BUDGET}.")
        check(total < LANDING_JS_BUDGET, f"{rel} loads {total} raw JS bytes (budget < {LANDING_JS_BUDGET}): {files}")
        check(not any(CURRICULUM_CHUNK_RX.search("/" + f) or VIZ_CHUNK_RX.search("/" + f) for f in files),
              f"{rel} must not load curriculum or viz chunks: {sorted(files)}")
    # Lesson and lab pages must not statically import the curriculum or any lab module.
    for rel in ["lesson/go/concurrency/index.html", "lab/sqllock/index.html", "dashboard/index.html", "search/index.html"]:
        _, files, _ = page_js_bytes(rel)
        bad = [f for f in files if CURRICULUM_CHUNK_RX.search("/" + f) or VIZ_CHUNK_RX.search("/" + f)]
        check(not bad, f"{rel} statically imports heavy chunks: {bad}")

    # SEO metadata on sampled EN and ID routes.
    seo_routes = [("", "Course"), ("track/go/", "Course"), ("lesson/go/concurrency/", "LearningResource"),
                  ("lab/sqllock/", None), ("interview/design/notification-system/", None), ("play/sql/", None)]
    for path, ld_type in seo_routes:
        for lang in ["en", "id"]:
            rel_path = path if lang == "en" else "id/" + path
            h = head_of(rel_path + "index.html")
            en_url = f"{SITE}/stack-mastery/{path}"
            id_url = f"{SITE}/stack-mastery/id/{path}"
            want = en_url if lang == "en" else id_url
            where = f"/{rel_path}"
            check(h.html_lang == lang, f"{where}: <html lang> must be {lang}, got {h.html_lang}")
            check(h.canonical == want, f"{where}: canonical must be {want}, got {h.canonical}")
            check(h.alternates.get("en") == en_url and h.alternates.get("id") == id_url and h.alternates.get("x-default") == en_url,
                  f"{where}: hreflang en/id/x-default alternates wrong: {h.alternates}")
            check(bool(h.meta.get("description")) and len(h.title.strip()) > 5, f"{where}: needs a title and meta description")
            check(h.meta.get("og:url") == want and h.meta.get("og:locale") == ("id_ID" if lang == "id" else "en_US"),
                  f"{where}: Open Graph url/locale wrong: {h.meta.get('og:url')} {h.meta.get('og:locale')}")
            check(h.meta.get("twitter:card") == "summary", f"{where}: needs a Twitter card")
            if ld_type:
                types = []
                for raw in h.jsonld:
                    data = json.loads(raw)
                    types += [d.get("@type") for d in (data if isinstance(data, list) else [data])]
                check(ld_type in types, f"{where}: JSON-LD must include {ld_type}, got {types}")
    titles = {head_of(p.relative_to(DIST).as_posix()).title for p in list(DIST.glob("lesson/*/*/index.html"))[:40]}
    check(len(titles) == 40, "Lesson pages must have unique <title>s")

    # 404 SEO hygiene: noindex page must not emit canonical or hreflang alternates.
    h404 = head_of("404.html")
    check(h404.meta.get("robots") == "noindex", f"404.html must declare robots=noindex, got {h404.meta.get('robots')!r}")
    check(h404.canonical is None, f"404.html must not emit <link rel='canonical'>, got {h404.canonical!r}")
    check(not h404.alternates, f"404.html must not emit hreflang alternates, got {h404.alternates}")



# ---------------------------------------------------------------------------------------------------------------
# Playground hardening: SRI, live theme sync, srcdoc sanitizing, offline fallbacks, external links, cleanups
# ---------------------------------------------------------------------------------------------------------------
# Wraps ResizeObserver / Blob URLs so the suite can see what a playground creates and what it releases.
LEAK_PROBES = """
(() => {
  if (window !== window.top) return;
  const RO = window.ResizeObserver;
  window.__roTargets = new Set();
  window.ResizeObserver = class extends RO {
    observe(el, ...a) { (this.__t ||= new Set()).add(el); window.__roTargets.add(el); return super.observe(el, ...a); }
    unobserve(el) { this.__t?.delete(el); window.__roTargets.delete(el); return super.unobserve(el); }
    disconnect() { for (const el of this.__t || []) window.__roTargets.delete(el); this.__t?.clear(); return super.disconnect(); }
  };
  window.__blobs = { created: [], revoked: [] };
  const create = URL.createObjectURL.bind(URL), revoke = URL.revokeObjectURL.bind(URL);
  URL.createObjectURL = b => { const u = create(b); window.__blobs.created.push({ url: u, type: b.type, size: b.size }); return u; };
  URL.revokeObjectURL = u => { window.__blobs.revoked.push(u); return revoke(u); };
  window.__dartReady = 0;
  addEventListener('message', e => { if (e.origin === 'https://dartpad.dev' && e.data && e.data.type === 'ready') window.__dartReady++; });
})();
"""
CDN_SCRIPTS = """() => [...document.scripts].filter(s => /cdnjs\\.cloudflare\\.com|cdn\\.jsdelivr\\.net/.test(s.src)).map(s => ({ src: s.src, integrity: s.integrity, cross: s.crossOrigin }))"""
MONACO_CLASS = "document.querySelector('#view .monaco-editor')?.className.split(/\\s+/).filter(c => c === 'vs' || c === 'vs-dark').join('')"
SET_EDITOR = "([i, v]) => { const ta = document.querySelectorAll('#view textarea.editor')[i]; ta.value = v; ta.oninput && ta.oninput(); }"
THEME_TOGGLE = "#nav [data-theme-toggle]"


def sri_of(body):
    return "sha384-" + base64.b64encode(hashlib.sha384(body).digest()).decode()


def playground_hardening(browser, base, check):
    def new_page(lang="en", scheme="light"):
        cx = browser.new_context(viewport={"width": 1280, "height": 840}, color_scheme=scheme)
        pg = cx.new_page()
        sink = []
        watch_errors(pg, sink)
        pg.add_init_script(lang_init(lang))
        pg.add_init_script(LEAK_PROBES)
        return cx, pg, sink

    ready_sql = "() => /Ready\\./.test(document.querySelector('#view .out')?.textContent || '')"
    ts_done = "() => { const o = document.querySelector('#view .out'); return !!o && !!o.querySelector('pre, .err, iframe') && !/Running…/.test(o.textContent); }"
    monaco_is = lambda cls: f"() => ({MONACO_CLASS}) === '{cls}'"

    # --- SQL: real SRI hashes, crossorigin, no global define.amd mutation, Monaco follows the theme live ---
    cx, pg, errs = new_page()
    goto(pg, base, "play/sql/")
    pg.wait_for_function(ready_sql, timeout=30000)
    pg.wait_for_selector("#view .monaco-editor", timeout=30000)
    scripts = pg.evaluate(CDN_SCRIPTS)
    by_name = {s["src"].rsplit("/", 1)[-1]: s for s in scripts}
    check({"sql-wasm.js", "loader.js"} <= set(by_name), f"SQL page must load sql-wasm.js and Monaco loader.js from CDN, saw {list(by_name)}")
    for name, s in by_name.items():
        if name not in ("sql-wasm.js", "loader.js"):
            continue
        check(s["integrity"].startswith("sha384-") and s["cross"] == "anonymous", f"CDN script {name} needs sha384 SRI + crossorigin=anonymous, got {s}")
        served = cx.request.get(s["src"]).body()
        check(s["integrity"] == sri_of(served), f"SRI for {s['src']} does not match the bytes the CDN serves ({s['integrity']} vs {sri_of(served)})")
    check(pg.evaluate("typeof window.initSqlJs === 'function'"), "sql.js must attach window.initSqlJs even though Monaco's AMD loader is present")
    check(pg.evaluate("typeof window.define === 'function' && !!window.define.amd"), "The playground must not permanently delete window.define.amd")
    check(pg.evaluate(f"() => {MONACO_CLASS}") == "vs", "Monaco must start in the light theme when the OS is light")
    pg.evaluate(SET_EDITOR, [0, "SELECT 'keep me' AS buffer;"])
    pg.locator(THEME_TOGGLE).click()
    pg.wait_for_function("() => document.documentElement.dataset.theme === 'dark'")
    pg.wait_for_function(monaco_is("vs-dark"), timeout=5000)
    check(pg.evaluate("document.querySelector('#view textarea.editor').value") == "SELECT 'keep me' AS buffer;", "Switching the Monaco theme must keep the editor buffer")
    pg.locator(THEME_TOGGLE).click()
    pg.wait_for_function(monaco_is("vs"), timeout=5000)
    pg.evaluate("delete document.documentElement.dataset.theme")
    pg.emulate_media(color_scheme="dark")
    pg.wait_for_function(monaco_is("vs-dark"), timeout=5000)
    check(True, "Monaco follows the OS color scheme")
    pg.emulate_media(color_scheme="light")
    pg.wait_for_function(monaco_is("vs"), timeout=5000)
    leaked = pg.evaluate(f"{json.dumps(APP_GLOBALS)}.filter(k => k in window)")
    check(not leaked, f"Playground leaked app globals: {leaked}")
    # The Monaco worker Blob URL is created once and revoked when the page is hidden.
    pg.evaluate("window.dispatchEvent(new Event('pagehide'))")
    blobs = pg.evaluate("window.__blobs")
    workers = [b for b in blobs["created"] if b["type"] == "text/javascript"]
    check(len(workers) <= 1, f"Monaco worker Blob URL must be created once and cached, created {len(workers)}")
    check(all(b["url"] in blobs["revoked"] for b in workers), "Monaco worker Blob URL must be revoked on pagehide")
    check(not errs, f"SQL playground hardening produced errors: {errs}")
    cx.close()

    # --- SRI is enforced: a tampered sql.js is refused, the banner offers Retry, and Retry recovers ---
    cx, pg, errs = new_page()
    tampered = "**/sql.js/1.8.0/sql-wasm.js"
    pg.route(tampered, lambda r: r.fulfill(status=200, content_type="application/javascript", headers={"access-control-allow-origin": "*"}, body="window.__pwned = true;"))
    goto(pg, base, "play/sql/")
    pg.wait_for_selector("#view .out .load-fail", timeout=30000)
    check(pg.evaluate("window.__pwned === undefined"), "A script whose bytes do not match its SRI hash must not run")
    check(pg.locator("#view .out .load-fail button", has_text="Retry").count() == 1, "SQL load failure must offer a Retry button")
    check(pg.locator("#view textarea.editor, #view .monaco-host").count() >= 1, "The SQL editor must stay usable when SQLite fails to load")
    pg.unroute(tampered)
    pg.locator("#view .out .load-fail button", has_text="Retry").click()
    pg.wait_for_function(ready_sql, timeout=30000)
    check(pg.locator("#view .load-fail").count() == 0, "Retry must clear the failure banner once SQLite loads")
    pg.wait_for_timeout(500)
    cx.close()

    # --- TypeScript 5.8.x: SRI, runs, blocked compiler shows Retry (EN + ID) ---
    cx, pg, errs = new_page()
    goto(pg, base, "play/ts/")
    pg.locator("#view .actions button", has_text="Run (Ctrl+Enter)").click()
    pg.wait_for_function(ts_done, timeout=30000)
    check("Mouse" in pg.inner_text("#view .out"), "TypeScript 5.8.x playground Run must print the example output in #view .out")
    ts_version = pg.evaluate("window.ts && window.ts.version")
    check(str(ts_version).startswith("5.8."), f"Browser TypeScript compiler must be 5.8.x, got {ts_version}")
    ts_script = [s for s in pg.evaluate(CDN_SCRIPTS) if "typescript.min.js" in s["src"]]
    check(len(ts_script) == 1 and "/5.8." in ts_script[0]["src"] and ts_script[0]["cross"] == "anonymous", f"TypeScript script must be the pinned 5.8.x with crossorigin, got {ts_script}")
    if ts_script:
        check(ts_script[0]["integrity"] == sri_of(cx.request.get(ts_script[0]["src"]).body()), "TypeScript SRI must match the served bytes")
    check(pg.evaluate("typeof window.define === 'function' && !!window.define.amd"), "Loading TypeScript must leave window.define.amd intact")
    a = pg.locator("#view a[data-sandbox='stackblitz']")
    check(a.count() == 1 and a.get_attribute("href") == "https://stackblitz.com/" and a.get_attribute("target") == "_blank" and a.get_attribute("rel") == "noopener noreferrer",
          "TypeScript playground must link StackBlitz with target=_blank rel='noopener noreferrer'")
    pg.wait_for_timeout(1000)   # let the Monaco TS worker settle before leaving the page
    cx.close()

    blocked_ts = "**/typescript/5.8.3/typescript.min.js"
    for lang, retry_label in [("en", "Retry"), ("id", "Coba lagi")]:
        cx, pg, errs = new_page(lang)
        pg.route(blocked_ts, lambda r: r.abort())
        goto(pg, base, ("id/" if lang == "id" else "") + "play/ts/")
        pg.locator("#view .actions button").first.click()
        pg.wait_for_selector("#view .out .load-fail", timeout=30000)
        check(pg.locator("#view .out .load-fail button", has_text=retry_label).count() == 1, f"{lang}: blocked TypeScript compiler must show a '{retry_label}' button")
        check(pg.locator("#view textarea.editor, #view .monaco-host").count() >= 1, f"{lang}: the TS editor must stay usable offline")
        pg.unroute(blocked_ts)
        pg.locator("#view .out .load-fail button", has_text=retry_label).click()
        pg.wait_for_function(ts_done, timeout=30000)
        check(pg.locator("#view .out .load-fail").count() == 0 and pg.locator("#view .out pre").count() >= 1, f"{lang}: Retry must run the code once the compiler loads")
        pg.wait_for_timeout(1000)
        cx.close()

    # --- CSS: </style breakout is neutralised, Tailwind loads with SRI, ResizeObserver is released ---
    cx, pg, errs = new_page()
    goto(pg, base, "play/css/")
    pg.wait_for_selector("#view .monaco-editor", timeout=30000)
    pg.evaluate(SET_EDITOR, [1, "body { color: red; }}</style><div id=\"injected\">x</div>"])
    pg.wait_for_timeout(700)
    srcdoc = pg.evaluate("document.querySelector('#view iframe.preview').srcdoc")
    check("</style><div" not in srcdoc and srcdoc.count("</style>") == 1, "CSS preview must not let a user </style close the style element")
    frame = pg.frame_locator("#view iframe.preview")
    check(frame.locator("#injected").count() == 0, "CSS '</style><div id=injected>' must not create #injected in the preview DOM")
    pg.evaluate(SET_EDITOR, [1, "</STYLE ><div id=\"injected\">x</div>"])
    pg.wait_for_timeout(700)
    check(frame.locator("#injected").count() == 0, "Case-insensitive </STYLE breakout must be neutralised too")
    pg.locator("#view .chips button[data-k='Tailwind card']").click()
    pg.wait_for_timeout(500)
    srcdoc = pg.evaluate("document.querySelector('#view iframe.preview').srcdoc")
    m = re.search(r'<script src="([^"]+)" integrity="(sha384-[^"]+)" crossorigin="anonymous">', srcdoc)
    check(bool(m), "Tailwind <script> in the preview srcdoc needs integrity sha384 + crossorigin=anonymous")
    if m:
        check(m.group(2) == sri_of(cx.request.get(m.group(1)).body()), "Tailwind SRI must match the bytes jsDelivr serves")
        check("@tailwindcss/browser@4.3.4" in m.group(1), f"Tailwind browser build must stay pinned, got {m.group(1)}")
    frame.locator("button").first.wait_for(timeout=15000)
    pad = None
    for _ in range(40):
        pad = frame.locator("button").first.evaluate("e => getComputedStyle(e).paddingLeft")
        if pad == "16px":
            break
        pg.wait_for_timeout(250)
    check(pad == "16px", f"Tailwind must execute under SRI in Chromium (button px-4 => 16px), got {pad}")
    check(not any("integrity" in e.lower() for e in errs), f"No SRI errors expected on the CSS playground: {errs}")
    # ResizeObserver: the preview observer disconnects on pagehide and a restored page observes a fresh one.
    live = "() => [...window.__roTargets].some(el => el.matches && el.matches('iframe.preview'))"
    check(pg.evaluate(live), "CSS playground must observe its preview iframe")
    pg.evaluate("window.dispatchEvent(new Event('pagehide'))")
    check(not pg.evaluate(live), "CSS playground must disconnect its ResizeObserver on pagehide")
    pg.evaluate("window.dispatchEvent(new PageTransitionEvent('pageshow', { persisted: true }))")
    pg.wait_for_function(live, timeout=5000)
    a = pg.locator("#view a[data-sandbox='stackblitz']")
    check(a.count() == 1 and a.get_attribute("target") == "_blank" and a.get_attribute("rel") == "noopener noreferrer", "CSS playground must link StackBlitz safely")
    pg.wait_for_timeout(1000)
    cx.close()

    # --- DartPad: theme query follows the site theme live, ready re-fires, blocked embed shows Retry ---
    cx, pg, errs = new_page()
    goto(pg, base, "play/dart/")
    src = lambda: pg.evaluate("document.querySelector('#view iframe.dartpad').getAttribute('src')")
    check("embed=true" in src() and "theme=light" in src(), f"DartPad must start with the resolved light theme, got {src()}")
    pg.wait_for_function("window.__dartReady >= 1", timeout=45000)
    pg.locator(THEME_TOGGLE).click()
    pg.wait_for_function("() => document.querySelector('#view iframe.dartpad').getAttribute('src').includes('theme=dark')", timeout=5000)
    pg.wait_for_function("window.__dartReady >= 2", timeout=45000)
    check("theme=dark" in src(), "Toggling the site theme must switch DartPad to theme=dark")
    pg.locator(THEME_TOGGLE).click()
    pg.wait_for_function("() => document.querySelector('#view iframe.dartpad').getAttribute('src').includes('theme=light')", timeout=5000)
    pg.wait_for_function("window.__dartReady >= 3", timeout=45000)
    check("theme=light" in src(), "Toggling the site theme back must switch DartPad to theme=light")
    a_attrs = pg.evaluate("[...document.querySelectorAll('#view a[data-sandbox]')].map(a => [a.target, a.rel, a.href])")
    check(a_attrs == [["_blank", "noopener noreferrer", "https://dartpad.dev/"]], f"DartPad page must offer a safe external DartPad link, got {a_attrs}")
    check(not errs, f"DartPad page produced errors: {errs}")
    cx.close()

    cx, pg, errs = new_page()
    pg.route("https://dartpad.dev/**", lambda r: r.abort())
    goto(pg, base, "play/dart/")
    pg.wait_for_selector("#view .load-fail", timeout=25000)
    check(pg.locator("#view .load-fail button", has_text="Retry").count() == 1, "Blocked DartPad must show a Retry button")
    check(pg.locator("#view .chips button").count() >= 3 and pg.locator("#view pre").count() >= 1, "The lesson sample must stay visible when DartPad is blocked")
    pg.unroute("https://dartpad.dev/**")
    pg.locator("#view .load-fail button", has_text="Retry").click()
    pg.wait_for_function("window.__dartReady >= 1", timeout=45000)
    pg.wait_for_function("() => !document.querySelector('#view .load-fail')", timeout=5000)
    cx.close()

    # --- tree wires: the ResizeObserver stops when the tree leaves the page or the page is hidden, and resumes from bfcache ---
    cx, pg, errs = new_page()
    goto(pg, base, "lab/rerender/")
    pg.wait_for_selector("#view .tree-wires path", timeout=10000)
    tree_live = "() => [...window.__roTargets].some(el => el.matches && el.matches('.tree'))"
    check(pg.evaluate(tree_live), "treeWire must observe its tree")
    pg.evaluate("window.dispatchEvent(new Event('pagehide'))")
    check(not pg.evaluate(tree_live), "treeWire must disconnect its ResizeObserver on pagehide")
    pg.evaluate("window.dispatchEvent(new PageTransitionEvent('pageshow', { persisted: true }))")
    check(pg.evaluate(tree_live), "treeWire must observe its tree again after a bfcache restore")
    pg.evaluate("document.querySelector('#view .tree').remove()")
    pg.wait_for_function("() => ![...window.__roTargets].some(el => el.matches && el.matches('.tree'))", timeout=5000)
    check(True, "treeWire disconnects once its tree is removed from the document")
    check(not errs, f"Tree viz produced errors: {errs}")
    cx.close()

    # --- external sandbox links on lessons ---
    cx, pg, errs = new_page()
    for path, key, href in [("lesson/go/types/", "go", "https://go.dev/play/"), ("lesson/csharp/types/", "csharp", "https://sharplab.io/"),
                            ("lesson/angular/signals/", "stackblitz", "https://stackblitz.com/")]:
        goto(pg, base, path)
        a = pg.locator(f"#view a[data-sandbox='{key}']")
        check(a.count() == 1 and a.get_attribute("href") == href and a.get_attribute("target") == "_blank" and a.get_attribute("rel") == "noopener noreferrer",
              f"/{path} must link {href} with target=_blank rel='noopener noreferrer'")
    goto(pg, base, "lesson/sql/select/")
    check(pg.locator("#view a[data-sandbox]").count() == 0, "SQL lessons keep using the built-in playground only")
    cx.close()

# ---------------------------------------------------------------------------------------------------------------
# Browser suite
# ---------------------------------------------------------------------------------------------------------------
def run_suite():
    failures = []
    checks = [0]

    def check(cond, msg):
        checks[0] += 1
        if not cond:
            failures.append(msg)
            print("FAIL:", msg)

    static_checks(check)
    srv, base = start_server()

    with sync_playwright() as p:
        browser = launch_browser(p)
        try:
            # 1. Desktop EN pass
            ctx = browser.new_context(viewport={"width": 1280, "height": 840}, accept_downloads=True)
            page = ctx.new_page()
            errs = []
            watch_errors(page, errs)
            page.add_init_script(lang_init('en'))

            # 1a. Full-bleed interactive Distributed Packet Reactor at /stack-mastery/ (pre-rendered, no sidebar)
            goto(page, base, "")
            check(page.evaluate("document.body.classList.contains('is-landing')"), "Landing must apply body.is-landing full-bleed mode")
            check(page.locator("#nav").count() == 0, "Landing must not render the study sidebar")
            check(page.evaluate("document.querySelector('#view .lp-dock')?.getAttribute('data-collapsed') === 'true'"), "Landing dock must start collapsed by default")
            check(page.evaluate("document.querySelector('#view .lp-dock-items').inert === true"), "Collapsed dock items must be inert")
            rect = page.evaluate("() => { const r = document.querySelector('#view canvas.lp-canvas')?.getBoundingClientRect(); return r ? {w: r.width, h: r.height} : null; }")
            check(rect and rect["w"] > 400 and rect["h"] > 300, f"Reactor canvas must fill landing stage, got {rect}")
            page.locator("#view .lp-dock .lp-dock-toggle").click()
            check(page.evaluate("document.querySelector('#view .lp-dock')?.getAttribute('data-collapsed') === 'false'"), "Landing dock toggle must expand dock")
            page.locator("#view .lp-dock button", has_text="50× Spike").click()
            page.locator("#view .lp-dock button", has_text="Kill Cache").click()
            check("Circuit OPEN" in page.inner_text("#view .lp-telemetry"), "Kill Cache must flip telemetry to Circuit OPEN")
            page.locator("#view .lp-dock button", has_text="Restore Cache").click()
            page.locator("#view .lp-dock button", has_text="Gravity Well").click()
            page.locator("#view .lp-dock button", has_text="Slow-Mo").click()
            page.locator("#view .lp-dock button", has_text="Sound: OFF").click()
            check(page.locator("#view .lp-dock button", has_text="Sound: ON").count() == 1, "Sound toggle is opt-in and must flip to Sound: ON")
            page.locator("#view .lp-dock button", has_text="Sound: ON").click()
            page.locator("#view .lp-dock button", has_text="Pause").click()
            check(page.locator("#view .lp-dock button", has_text="Play").count() == 1, "Pause must flip label to Play cleanly")
            page.locator("#view .lp-dock .lp-dock-toggle").click()
            check(page.evaluate("document.querySelector('#view .lp-dock')?.getAttribute('data-collapsed') === 'true'"), "Landing dock toggle must collapse dock")
            page.locator("#view .lp-bar [data-theme-toggle]").click()
            check(page.evaluate("!!document.documentElement.dataset.theme"), "Landing theme switcher must set a theme")
            page.locator("#view .lp-bar [data-theme-toggle]").click()
            check(page.evaluate("document.documentElement.scrollWidth <= window.innerWidth + 1"), "Desktop landing overflowed")
            check(len(page.evaluate(WCAG_DOM_AUDIT)) == 0, f"Landing WCAG issues: {page.evaluate(WCAG_DOM_AUDIT)}")
            check(page.locator("#view .lp-bar a[data-set-lang]").get_attribute("href") == BASE_PATH + "id/", "Landing language switch must link to /id/")
            check(page.locator("#view .lp-nav a[href*='/break/']").count() == 0, "Landing primary navbar must not link to Flower Meadow /break/")
            check("Flower Meadow" not in page.inner_text("#view .lp-nav"), "Landing primary navbar must not display Flower Meadow")
            page.locator("#view .lp-copy a.btn", has_text="Open Dashboard").click()
            page.wait_for_url(base + "dashboard/", timeout=10000)

            # 1b. Workspace Dashboard + Sidebar Pomodoro timer pill
            goto(page, base, "dashboard/")
            check("Recommended first lesson" in page.inner_text("#view"), "0% dashboard should show 1 Recommended first lesson instead of 8 continue cards")
            check(page.locator("#nav .nav-top .nav-actions").count() == 1, "nav-actions should live inside sidebar nav-top on desktop")
            check(page.locator("#nav a.nav-link[aria-current='page']", has_text="Dashboard").count() == 1, "Sidebar must mark Dashboard with aria-current=page")
            check(page.evaluate("document.documentElement.scrollWidth <= window.innerWidth + 1"), "Desktop dashboard overflowed")
            check(len(page.evaluate(WCAG_DOM_AUDIT)) == 0, f"Dashboard WCAG issues: {page.evaluate(WCAG_DOM_AUDIT)}")

            # Sidebar Pomodoro pill: presets, custom, start, reload persistence, pause, reset, focus-complete toast -> /break/
            check(page.locator("#nav [data-pomo-root]").count() == 1, "Sidebar must render Pomodoro timer pill")
            check(page.inner_text("#nav [data-pomo-clock]") == "25:00", "Sidebar Pomodoro must default to 25:00")
            page.locator("#nav [data-pomo-preset='50/10']").click()
            check(page.inner_text("#nav [data-pomo-clock]") == "50:00", "50/10 preset must set Pomodoro clock to 50:00")
            page.locator("#nav [data-pomo-preset='custom']").click()
            check(page.locator("#nav [data-pomo-custom]").is_visible(), "Custom preset must reveal focus/break minute inputs")
            page.locator("#nav [data-pomo-focus-min]").fill("30")
            page.locator("#nav [data-pomo-focus-min]").dispatch_event("change")
            check(page.inner_text("#nav [data-pomo-clock]") == "30:00", "Custom focus minutes must update Pomodoro clock to 30:00")
            page.locator("#nav [data-pomo-preset='25/5']").click()
            check(page.inner_text("#nav [data-pomo-clock]") == "25:00", "Switching back to 25/5 must restore 25:00")
            page.locator("#nav [data-pomo-toggle]").click()
            check(page.inner_text("#nav [data-pomo-phase]").upper() == "FOCUS", "Starting Pomodoro must set phase badge to Focus")
            check(page.inner_text("#nav [data-pomo-toggle]") == "Pause", "Running Pomodoro must flip button to Pause")
            page.wait_for_timeout(1200)
            clock_running = page.inner_text("#nav [data-pomo-clock]")
            check(clock_running != "25:00", f"Running Pomodoro must tick down from 25:00, got {clock_running}")
            page.reload(wait_until="domcontentloaded")
            page.wait_for_function(PAGE_READY, timeout=10000)
            check(page.inner_text("#nav [data-pomo-toggle]") == "Pause", "Reloading while running must keep Pomodoro running via endsAtMs")
            check(page.inner_text("#nav [data-pomo-clock]") != "25:00", "Reloading must preserve elapsed Pomodoro countdown")
            page.locator("#nav [data-pomo-toggle]").click()
            check(page.inner_text("#nav [data-pomo-toggle]") == "Start", "Pausing Pomodoro must flip button back to Start")
            page.locator("#nav [data-pomo-reset]").click()
            check(page.inner_text("#nav [data-pomo-clock]") == "25:00" and page.inner_text("#nav [data-pomo-phase]").upper() == "READY", "Reset must restore 25:00 Ready state")
            # Focus block hitting 00:00 increments daily cycles and shows accessible toast linking to /break/.
            page.evaluate("""() => {
              const cur = JSON.parse(localStorage.getItem('stackmastery.study') || '{}');
              cur.preset = '25/5'; cur.focusMin = 25; cur.breakMin = 5;
              cur.phase = 'focus'; cur.running = true; cur.remainingSec = 1;
              cur.endsAtMs = Date.now() + 350;
              localStorage.setItem('stackmastery.study', JSON.stringify(cur));
            }""")
            page.reload(wait_until="domcontentloaded")
            page.wait_for_function(PAGE_READY, timeout=10000)
            page.wait_for_selector("[data-pomo-toast]", timeout=5000)
            check(page.locator("[data-pomo-toast][role='status'][aria-live='polite']").count() == 1, "Focus-complete toast must have role=status and aria-live=polite")
            check("1 cycles today" in page.inner_text("#nav [data-pomo-cycles]"), f"Completing focus block must increment daily cycles, got: {page.inner_text('#nav [data-pomo-cycles]')}")
            page.locator("[data-pomo-toast-break]").click()
            page.wait_for_url(base + "break/", timeout=10000)
            page.wait_for_function(PAGE_READY, timeout=10000)

            # 1c. Flower Meadow Break Room (Pomodoro ring, milestones, opt-in audio, spells)
            check(page.evaluate("document.body.classList.contains('is-landing')"), "/break/ must apply body.is-landing full-bleed mode")
            check(page.locator("#nav").count() == 0, "Break room must not render the study sidebar")
            check(page.locator("#view .br-timer-panel .br-ring-svg").count() == 1, "Break room must render circular countdown SVG ring")
            check("1 cycles today" in page.inner_text("#view [data-break-cycles]"), "Break room must sync daily focus cycles from stackmastery.study")
            check("1 focus cycles today" in page.inner_text("#view [data-break-milestones]"), "Break room milestone summary must reflect completed focus cycles")
            check(page.locator("#view [data-break-resume]").get_attribute("href") == BASE_PATH + "dashboard/", "Before visiting a lesson, Break room Resume CTA must fall back to /dashboard/")
            # Security regression: crafted javascript: URL in stackmastery.study lastLesson must be rejected.
            page.evaluate("""() => {
              const s = JSON.parse(localStorage.getItem('stackmastery.study') || '{}');
              s.lastLesson = { trackId: 'go', lessonId: 'types', title: 'XSS', url: 'javascript:alert(1)' };
              localStorage.setItem('stackmastery.study', JSON.stringify(s));
            }""")
            page.reload(wait_until="domcontentloaded")
            page.wait_for_function(PAGE_READY, timeout=10000)
            bad_href = page.locator("#view [data-break-resume]").get_attribute("href")
            check(bad_href == BASE_PATH + "dashboard/" and not (bad_href or "").startswith("javascript:"), f"Break room Resume CTA must reject unsafe lastLesson URL, got {bad_href!r}")
            page.locator("#view [data-break-toggle]").click()
            check(page.inner_text("#view [data-break-toggle]") == "Pause", "Break room Start break must start break countdown")
            page.locator("#view [data-break-skip]").click()
            check(page.inner_text("#view [data-break-phase]").upper() == "READY", "Skip break must return Break timer to Ready state")
            page.locator("#view [data-break-preset='50/10']").click()
            check(page.text_content("#view .br-ring-time") == "10:00", "Break room 50/10 preset must show 10:00 break countdown")
            page.locator("#view [data-break-preset='25/5']").click()
            check(page.text_content("#view .br-ring-time") == "05:00", "Break room 25/5 preset must show 05:00 break countdown")
            check(page.evaluate("document.querySelector('#view .br-stage')?.getAttribute('data-hud-hidden') === 'true'"), "Break room HUD must start hidden by default")
            check(page.evaluate("document.querySelector('#view .br-dock')?.getAttribute('data-collapsed') === 'true'"), "Break room dock must start collapsed by default")
            brect = page.evaluate("() => { const r = document.querySelector('#view canvas.br-canvas')?.getBoundingClientRect(); return r ? {w: r.width, h: r.height} : null; }")
            check(brect and brect["w"] > 400 and brect["h"] > 300, f"Break room canvas must fill stage, got {brect}")
            page.locator("#view .br-dock .lp-dock-toggle").click()
            check(page.evaluate("document.querySelector('#view .br-dock')?.getAttribute('data-collapsed') === 'false'"), "Break room dock toggle must expand dock")
            page.locator("#view .br-dock button", has_text="Grand Bloom").click()
            page.locator("#view .br-dock button", has_text="Meteor Shower").click()
            page.locator("#view .br-dock button", has_text="Zen Auto-Bloom").click()
            # Audio is opt-in: the room starts silent and only plays after the learner presses Music.
            check(page.locator("#view .br-dock button", has_text="Music: OFF").count() == 1, "Break room music must start at Music: OFF (opt-in audio)")
            check(page.locator("#view .br-dock button", has_text="Music: ON").count() == 0, "Break room must not render Music: ON before the learner opts in")
            page.locator("#view .br-dock button", has_text="Music: OFF").click()
            check(page.locator("#view .br-dock button", has_text="Music: ON").count() == 1, "Break room Music: OFF must toggle to Music: ON")
            page.locator("#view .br-dock button", has_text="Music: ON").click()
            check(page.locator("#view .br-dock button", has_text="Music: OFF").count() == 1, "Break room Music: ON must toggle back to Music: OFF")
            page.locator("#view .br-dock button", has_text="Show HUD").click()
            check(page.evaluate("document.querySelector('#view .br-stage')?.getAttribute('data-hud-hidden') === 'false'"), "Show HUD must restore data-hud-hidden=false")
            page.locator("#view .br-dock button", has_text="Hide HUD").click()
            check(page.evaluate("document.querySelector('#view .br-stage')?.getAttribute('data-hud-hidden') === 'true'"), "Hide HUD must set data-hud-hidden=true")
            page.locator("#view .br-dock button", has_text="Pause").click()
            check(page.locator("#view .br-dock button", has_text="Play").count() == 1, "Break room Pause must flip label to Play cleanly")
            page.locator("#view .br-dock .lp-dock-toggle").click()
            check(page.evaluate("document.documentElement.scrollWidth <= window.innerWidth + 1"), "Desktop break room overflowed")
            check(len(page.evaluate(WCAG_DOM_AUDIT)) == 0, f"Break room WCAG issues: {page.evaluate(WCAG_DOM_AUDIT)}")

            # Lesson: pre-rendered sections, Predict first, blurred hints, reload persistence, signals formulas, last-lesson Resume CTA
            goto(page, base, "lesson/angular/signals/")
            check(page.locator(".predict-card").is_visible(), "signals lesson should render Predict first card")
            check(page.locator(".code.hide-hints").count() >= 1, "code hints should start hidden while prediction pending")
            page.locator(".predict-card .opt").nth(1).click()
            page.wait_for_timeout(80)
            check(page.locator(".code.hide-hints").count() == 0, "code hints should unblur after prediction")
            # PR #4 polish regression: reloading a previously-predicted lesson must keep code hints unblurred.
            page.reload(wait_until="domcontentloaded")
            page.wait_for_function(PAGE_READY, timeout=10000)
            check(page.locator(".code.hide-hints").count() == 0, "Reloading a predicted lesson must keep code hints unblurred")
            check("Hide hints" in page.inner_text("[data-static-code] [data-hints-toggle]"), "Reloaded predicted lesson hints button must say Hide hints")
            check(page.locator(".viz-eq").count() >= 3, "VIZ.ngsignals should display computed formulas (.viz-eq)")
            check(page.locator("#view a[href='/stack-mastery/plan/angular/signals/']").count() == 1, "Lesson must link to its printable plan")
            check(page.locator("#nav a.nav-link[aria-current='page'][href='/stack-mastery/track/angular/']").count() == 1, "Sidebar must mark the lesson's track as current")
            # Break Room Resume CTA now links straight back to the last visited lesson.
            goto(page, base, "break/")
            resume_link = page.locator("#view [data-break-resume]")
            check(resume_link.get_attribute("href") == BASE_PATH + "lesson/angular/signals/", f"Break room Resume CTA must link to last visited lesson, got {resume_link.get_attribute('href')}")
            check("Resume:" in resume_link.inner_text(), f"Break room Resume CTA must show Resume: label, got {resume_link.inner_text()!r}")

            # Multi-file code tabs (pre-rendered CodeTabs + tiny hydration)
            goto(page, base, "lesson/aspnet/arch/")
            check(page.locator(".code-tabs [role='tab']").count() == 5, "aspnet/arch should render 5 tabs (4 slices + Full file)")
            page.locator(".code-tabs [role='tab']").nth(1).click()
            check("PlaceOrder" in page.inner_text(".code-tabwrap [role='tabpanel']:not([hidden]) pre"), "2nd tab should show PlaceOrder slice")
            check(page.locator(".code-tabs [role='tab']").nth(1).get_attribute("aria-selected") == "true", "Selected code tab must set aria-selected")
            page.locator(".code-tabs [role='tab']").nth(1).press("ArrowRight")
            check(page.locator(".code-tabs [role='tab']").nth(2).get_attribute("aria-selected") == "true", "ArrowRight must move to the next code tab")

            # Quiz persistence + Teach empty guard + Learn toggle
            goto(page, base, "lesson/csharp/types/")
            first_rubric = page.locator(".rubric input[type='checkbox']").first
            first_rubric.click()
            check(not first_rubric.is_checked(), "Teach rubric checkbox must block empty textarea")
            check(page.locator(".teach .fb.bad[role='alert']").is_visible(), "Teach guard alert should become visible")
            for idx in range(4):
                if page.locator("#view .q").first.locator(".fb.good").count() > 0:
                    break
                opt = page.locator("#view .q").first.locator(".opt").nth(idx)
                if opt.is_enabled():
                    opt.click()
            page.locator("#view [data-read-toggle]").click()
            check("Learned" in page.inner_text("#view [data-read-toggle]"), "Mark as learned must flip to Learned")
            check(page.locator("#view .tracker .tstep.on").count() >= 1, "Tracker must tick Learn")
            page.reload(wait_until="domcontentloaded")
            page.wait_for_function(PAGE_READY, timeout=10000)
            check(page.locator("#view .q").first.locator(".fb.good").count() == 1, "Quiz completion for answered question should persist across reload")
            check(page.inner_text("#nav a.nav-link[href='/stack-mastery/track/csharp/'] small") != "0%", "Sidebar track % must reflect lesson progress")
            page.locator("#view [data-read-toggle]").click()

            # Visualizations
            goto(page, base, "lab/rerender/")
            check("<TodoItem A>" in page.inner_text("#view .tree"), "rerender tree must keep distinct <TodoItem A> label")
            check(page.locator("#view .tree-wires path").count() == 1, "rerender tree must render SVG hierarchy connectors")
            goto(page, base, "lab/di/")
            page.get_by_role("button", name="Restart app").click()
            check("#5" in page.inner_text("#view table"), "Restart app in VIZ.di must generate new singleton #5")

            # Every lab, discovered from the static /lab/ cards. Each lab page must load exactly its own module.
            goto(page, base, "lab/")
            leaked = page.evaluate(f"{json.dumps(APP_GLOBALS)}.filter(k => k in window)")
            check(len(leaked) == 0, f"Unexpected app globals leaked onto window: {leaked}")
            viz_ids = page.evaluate("[...document.querySelectorAll('#view .grid a.card[data-viz-id]')].map(a => a.dataset.vizId)")
            check(len(viz_ids) == EXPECTED_VIZ, f"Expected {EXPECTED_VIZ} labs on /lab/, found {len(viz_ids)}: {viz_ids}")
            hrefs_ok = page.evaluate("[...document.querySelectorAll('#view .grid a.card')].every(a => /^\\/stack-mastery\\/lab\\/[\\w-]+\\/$/.test(a.getAttribute('href')))")
            check(hrefs_ok, "Lab cards must link to /stack-mastery/lab/<viz>/")
            lab_page = ctx.new_page()
            watch_errors(lab_page, errs, "lab ")
            lab_reqs = watch_requests(lab_page)
            for vid in viz_ids:
                before = len(errs)
                lab_reqs.clear()
                goto(lab_page, base, f"lab/{vid}/")
                check(len(lab_page.inner_text("#view .viz")) > 20, f"viz {vid} rendered empty")
                check(len(lab_page.evaluate(WCAG_DOM_AUDIT)) == 0, f"viz {vid} WCAG issues: {lab_page.evaluate(WCAG_DOM_AUDIT)}")
                check(len(errs) == before, f"viz {vid} console/page errors: {errs[before:]}")
                viz_chunks = {m.group(1) for u in lab_reqs if (m := VIZ_CHUNK_RX.search(u.split('?')[0]))}
                heavy = [u for u in lab_reqs if CURRICULUM_CHUNK_RX.search(u.split('?')[0])]
                check(len(viz_chunks) == 1, f"/lab/{vid}/ must load exactly one viz module, loaded {sorted(viz_chunks)}")
                check(not heavy, f"/lab/{vid}/ must not load curriculum chunks: {heavy}")
            lab_page.close()

            # Single-viz chunk isolation on a lesson and a lab, checked with fresh pages and network capture.
            for path, expect_viz in [("lab/sqllock/", {"vizplus"}), ("lesson/go/concurrency/", set()), ("lesson/sysdesign/caching/", {"vizsys"})]:
                iso = ctx.new_page()
                iso_errs = []
                watch_errors(iso, iso_errs)
                reqs = watch_requests(iso)
                goto(iso, base, path)
                iso.wait_for_load_state("networkidle")
                viz_chunks = {m.group(1) for u in reqs if (m := VIZ_CHUNK_RX.search(u.split('?')[0]))}
                heavy = [u for u in reqs if CURRICULUM_CHUNK_RX.search(u.split('?')[0])]
                check(viz_chunks == expect_viz, f"/{path} must load only viz modules {expect_viz}, loaded {sorted(viz_chunks)}")
                check(not heavy, f"/{path} must not load all curriculum data: {heavy}")
                check(not iso_errs, f"/{path} console/page errors: {iso_errs}")
                check(len(iso.evaluate(f"{json.dumps(APP_GLOBALS)}.filter(k => k in window)")) == 0, f"/{path} leaked app globals")
                iso.close()

            # System Design track, Predict-first caching, rate limiter boundary burst, and code tabs
            goto(page, base, "track/sysdesign/")
            check(page.locator("#view .rows a.row").count() == 16, "System Design track should list 16 lessons")
            goto(page, base, "lesson/sysdesign/caching/")
            check(page.locator(".predict-card").is_visible(), "sysdesign/caching should render Predict first card")
            check(page.locator("#view .viz .sd-slots").count() == 1, "sysdesign/caching should mount syscache lab")
            goto(page, base, "lesson/sysdesign/ratelimiting/")
            page.locator("#view .viz button", has_text="Jump to :09").click()
            page.locator("#view .viz button", has_text="Burst ×4").click()
            page.locator("#view .viz button", has_text="Advance +2s").click()
            page.locator("#view .viz button", has_text="Burst ×4").click()
            check("Seam 2× risk" in page.inner_text("#view .viz"), "Fixed Window must flag Seam 2x risk across :09..:11 burst")
            goto(page, base, "lesson/sysdesign/containers-k8s/")
            check(page.locator(".code-tabs [role='tab']").count() == 3, "sysdesign/containers-k8s should render 3 tabs (2 slices + Full file)")

            # Go track, Predict-first slice aliasing, and code-tabs split
            goto(page, base, "track/go/")
            check(page.locator("#view .rows a.row").count() == 14, "Go track should list 14 lessons")
            check(page.locator("#view .rows a.row").first.get_attribute("href") == "/stack-mastery/lesson/go/types/", "Track rows must link to static lesson pages")
            goto(page, base, "lesson/go/collections/")
            check(page.locator(".predict-card").is_visible(), "go/collections should render Predict first card")
            check(page.locator(".code.hide-hints").count() >= 1, "go/collections code hints should start blurred")
            page.locator(".predict-card .opt").nth(1).click()
            page.wait_for_timeout(80)
            check(page.locator(".code.hide-hints").count() == 0, "go/collections hints should unblur after prediction")
            goto(page, base, "lesson/go/http/")
            check(page.locator(".code-tabs [role='tab']").count() == 4, "go/http should render 4 tabs (3 slices + Full file)")

            # Printable plan + teaching toolkit picker
            goto(page, base, "plan/go/types/")
            check(page.locator("#view .plan-b").count() >= 6 and page.locator("#view button", has_text="Print").count() == 1, "Plan page must render its blocks and a Print button")
            goto(page, base, "teach/")
            page.locator("#view [data-plan-track]").select_option("sql")
            check(page.locator("#view [data-plan-lesson] option").count() == 12, "Teach picker must list the SQL track's 12 lessons")
            page.locator("#view [data-plan-picker] button[type='submit']").click()
            page.wait_for_url(re.compile(r".*/stack-mastery/plan/sql/[\w-]+/$"), timeout=10000)

            # SQL grading uses an isolated clean snapshot: a destructive free-play DELETE or DROP TABLE must not break grading.
            goto(page, base, "play/sql/")
            page.wait_for_function("() => /Ready\\./.test(document.querySelector('#view .out')?.textContent || '')", timeout=30000)
            set_sql = "(v) => { const ta = document.querySelector('#view textarea.editor'); ta.value = v; ta.oninput && ta.oninput(); }"
            page.evaluate(set_sql, "DELETE FROM order_items; DELETE FROM products;")
            page.locator("#view .actions button", has_text="Run (Ctrl+Enter)").click()
            check("row(s) changed" in page.inner_text("#view .out"), f"Free-play DELETE should report changed rows, got: {page.inner_text('#view .out')[:160]}")
            page.locator("#view .chips button", has_text="Cheap tech").click()
            page.evaluate(set_sql, "SELECT name, price FROM products WHERE category = 'Tech' AND price < 500 ORDER BY price;")
            page.locator("#view .actions button", has_text="Check answer").click()
            check("✓ Correct" in page.inner_text("#view .out"), "SQL Check answer must grade on a clean snapshot even after DELETE FROM products")
            check(page.locator("#view .chips button.solved", has_text="Cheap tech").count() == 1, "Solved SQL challenge chip should be marked solved")
            page.evaluate(set_sql, "DROP TABLE order_items; DROP TABLE products;")
            page.locator("#view .actions button", has_text="Run (Ctrl+Enter)").click()
            page.locator("#view .chips button", has_text="Cheap tech").click()
            page.evaluate(set_sql, "SELECT name, price FROM products WHERE category = 'Tech' AND price < 500 ORDER BY price;")
            page.locator("#view .actions button", has_text="Check answer").click()
            check("✓ Correct" in page.inner_text("#view .out"), "SQL Check answer must grade on a clean snapshot even after DROP TABLE products")
            page.locator("#view .actions button", has_text="Reset database").click()

            # TypeScript playground runs the selected example and prints output.
            goto(page, base, "play/ts/")
            page.locator("#view .actions button", has_text="Run (Ctrl+Enter)").click()
            page.wait_for_function("() => { const o = document.querySelector('#view .out'); return !!o && !!o.querySelector('pre, .err, iframe') && !/Running…/.test(o.textContent); }", timeout=30000)
            ts_out = page.inner_text("#view .out")
            check("Mouse" in ts_out and page.locator("#view .out p.err").count() == 0, f"TypeScript playground Run must render output, got: {ts_out[:200]}")

            # Hardened playgrounds: SRI, live theme sync, srcdoc sanitizing, offline fallbacks, external links, cleanups.
            playground_hardening(browser, base, check)

            # Playground ?sample= deep link (legacy #/play/sql/joins), schema drawer, dialect tip, styled dialog
            goto(page, base, "play/sql/?sample=joins")
            check("Orders with names" in page.inner_text("#view .chips button.on"), "SQL ?sample=joins should pre-select Orders with names challenge")
            check(page.locator(".schema-drawer").count() == 1, "SQL playground should show collapsible schema drawer")
            page.evaluate("""() => {
              const ta = document.querySelector('#view textarea.editor');
              if (ta) { ta.value = 'SELECT TOP (3) name FROM products'; ta.oninput && ta.oninput(); }
            }""")
            page.wait_for_timeout(80)
            check("LIMIT n" in page.inner_text("#view .fb"), "SQLite dialect tip should appear for SQL Server TOP(n)")
            page.get_by_role("button", name="Show solution").click()
            page.wait_for_timeout(80)
            check(page.locator("dialog.sm-dialog[open]").count() == 1, "Show solution should open native accessible modal <dialog>")
            page.locator("dialog.sm-dialog button[value='cancel']").click()
            # Language switch keeps the sub-path and the ?sample= query string, and remembers the preference.
            lang_href = page.locator("#nav a[data-set-lang]").get_attribute("href")
            check(lang_href == BASE_PATH + "id/play/sql/?sample=joins", f"Sidebar ID switch must keep path + query, got {lang_href}")

            # Search uses the pre-built index (no curriculum, interview or viz bundles)
            search_reqs = watch_requests(page)
            goto(page, base, "search/")
            page.locator("#view input[type='search']").fill("Outbox")
            page.wait_for_timeout(80)
            check(page.locator("#view mark").count() >= 1, "Search should highlight matches using <mark>")
            check(page.locator("#view a.row.hit").first.get_attribute("href").startswith(BASE_PATH), "Search hits must link to static pages")
            heavy = [u for u in search_reqs if CURRICULUM_CHUNK_RX.search(u.split('?')[0]) or VIZ_CHUNK_RX.search(u.split('?')[0])]
            check(not heavy and any(u.endswith("/search-index.json") for u in search_reqs), f"Search must fetch only the pre-built index, also loaded: {heavy}")
            # PR #4 polish regression: searching for HTML entity names (lt, amp) must never corrupt escaped HTML entities.
            for entity_q in ["lt", "amp"]:
                page.locator("#view input[type='search']").fill(entity_q)
                page.wait_for_timeout(80)
                hits_html = page.locator("#view .rows").inner_html()
                check(f"&<mark>{entity_q}</mark>;" not in hits_html.lower() and f"&<mark>" not in hits_html.lower(),
                      f"Search markText corrupted HTML entities for query {entity_q!r}")

            # Interview routes + coding arena + System Design cases + rapid-fire
            for ir in ["interview/", "interview/coding/", "interview/patterns/", "interview/design/", "interview/design/notification-system/",
                       "interview/design/search-autocomplete/", "interview/behavioral/", "interview/rapid/"]:
                goto(page, base, ir)
                check(len(page.inner_text("#view")) > 40, f"Interview route /{ir} rendered empty")
            goto(page, base, "interview/design/")
            check("Multi-channel notification service" in page.inner_text("#view") and "Search typeahead" in page.inner_text("#view"), "Interview design should list 8 worked cases including notification and search autocomplete")
            goto(page, base, "interview/rapid/")
            check("System design" in page.inner_text("#view") and "Kleppmann" in page.inner_text("#view"), "Rapid-fire page must render 6 System design Q&As")
            goto(page, base, "interview/coding/")
            first_prob_href = page.locator("#view .rows a.row").first.get_attribute("href")
            check(first_prob_href.startswith(BASE_PATH + "interview/problem/"), f"Coding rows must link to static problem pages, got {first_prob_href}")
            page.locator("#view .rows a.row").first.click()
            page.wait_for_selector("#view .play", timeout=10000)
            check(page.locator("#view .actions button", has_text="Run tests").count() == 1, "Coding problem arena must render editor and Run tests")

            # Story bank saves and shows the STAR Reflection field.
            goto(page, base, "interview/behavioral/")
            page.get_by_label("Title", exact=True).fill("Cache bug story")
            page.get_by_label("Reflection: what you learned").fill("Reproduce bugs in a test first.")
            page.locator("#view .story-form button", has_text="Save story").click()
            story = page.locator("#view details.story", has_text="Cache bug story")
            story.locator("summary").click()
            check("Reflection: Reproduce bugs in a test first." in story.inner_text(), "Saved story must display its Reflection")

            # Mock history shows saved notes and can delete a row (confirmed through the styled dialog).
            goto(page, base, "interview/mock/")
            page.locator("#view .card", has_text="Behavioral round").get_by_role("button", name="Start").click()
            for sel in page.locator("#view .score-grid select").all():
                sel.select_option("3")
            page.get_by_label("Mock interview notes").fill("Shorten the Situation part.")
            page.locator("#view .actions button", has_text="Save result").click()
            hist = page.locator("#view section.sec", has=page.locator("h2", has_text="History"))
            hist.locator("summary", has_text="Show notes").click()
            check("Shorten the Situation part." in hist.inner_text(), "Mock history must show saved interview notes")
            hist.get_by_role("button", name="Delete mock result").first.click()
            page.locator("dialog.sm-dialog[open] button[value='ok']").click()
            page.wait_for_timeout(120)
            check("No mock interviews recorded yet." in hist.inner_text(), "Deleting the only mock result must empty the history table")
            # Save a mock, visit Hub, and confirm deleting it on Hub immediately refreshes readiness ring, meters, and sidebar %.
            page.locator("#view .actions button", has_text="Save result").click()
            goto(page, base, "interview/")
            iv_nav = "#nav a.nav-link[href='/stack-mastery/interview/'] small"
            ring_before = page.text_content("#view .ring-n")
            nav_iv_before = page.inner_text(iv_nav)
            hub_hist = page.locator("#view section.sec", has=page.locator("h2", has_text="Mock history"))
            hub_hist.get_by_role("button", name="Delete mock result").first.click()
            page.locator("dialog.sm-dialog[open] button[value='ok']").click()
            page.wait_for_timeout(120)
            check("No mock interviews recorded yet." in page.inner_text("#view"), "Hub mock history must reflect the deletion")
            check(page.text_content("#view .ring-n") != ring_before, "Deleting mock on Hub must refresh readiness ring immediately")
            check(page.inner_text(iv_nav) != nav_iv_before, "Deleting mock on Hub must refresh sidebar readiness % immediately")

            # Mock exam renders a notice instead of a blank stage when no question matches the filters.
            goto(page, base, "exam/")
            page.evaluate("() => { const s = document.querySelectorAll('#view .actions select')[1]; s.append(new Option('none', '99')); s.value = '99'; }")
            page.locator("#view .actions button", has_text="Start exam").click()
            check("No questions match these filters." in page.inner_text("#view"), "Empty Mock exam pool must render an empty-state notice")

            goto(page, base, "interview/mock/")
            check(len(page.evaluate(WCAG_DOM_AUDIT)) == 0, f"Mock interview WCAG issues: {page.evaluate(WCAG_DOM_AUDIT)}")
            page.locator("#view .card", has_text="Coding round").get_by_role("button", name="Start").click()
            page.wait_for_selector("#view .play", timeout=10000)
            check(page.locator("#view .play .editor, #view .monaco-host").count() >= 1, "Mock coding session must render coding arena")

            # Cold-load directly onto a coding problem page.
            cold_page = ctx.new_page()
            cold_errs = []
            watch_errors(cold_page, cold_errs, "cold ")
            cold_page.goto(base[: -len(BASE_PATH)] + first_prob_href, wait_until="domcontentloaded")
            cold_page.wait_for_selector("#view .play", timeout=10000)
            check(len(cold_errs) == 0, f"Cold load to {first_prob_href} errors: {cold_errs}")
            cold_page.close()
            page.locator("#nav .nav-foot button", has_text="Reset progress").click()
            page.wait_for_timeout(80)
            check(page.locator("dialog.sm-dialog[open]").count() == 1, "Reset progress must open styled modal <dialog>")
            page.keyboard.press("Escape")
            page.wait_for_timeout(80)
            check(page.locator("dialog.sm-dialog[open]").count() == 0, "Escape must dismiss modal <dialog>")

            # Cross-tab sync: progress saved in another tab updates this tab's theme and sidebar without a reload.
            goto(page, base, "dashboard/")
            other = ctx.new_page()
            other.goto(base + "dashboard/", wait_until="domcontentloaded")
            other.wait_for_function(PAGE_READY, timeout=10000)
            other.evaluate("""() => {
              const s = JSON.parse(localStorage.getItem('stackmastery.v1') || '{}');
              s.theme = 'dark';
              s.lessons = Object.assign(s.lessons || {}, { 'go/types': { read: true, quiz: true, teach: true } });
              localStorage.setItem('stackmastery.v1', JSON.stringify(s));
            }""")
            page.wait_for_function("() => document.documentElement.dataset.theme === 'dark'", timeout=5000)
            go_pct = page.inner_text("#nav a.nav-link[href='/stack-mastery/track/go/'] small")
            check(go_pct != "0%", f"Cross-tab stackmastery.v1 progress must refresh the sidebar track percentage, got {go_pct}")
            mastered = page.evaluate("() => [...document.querySelectorAll('#view .stat')].find(s => /mastered/.test(s.textContent))?.querySelector('b')?.textContent")
            check(mastered == "1", f"Cross-tab progress must redraw the dashboard's lessons mastered stat, got {mastered}")
            other.evaluate("() => { const s = JSON.parse(localStorage.getItem('stackmastery.v1')); s.theme = ''; localStorage.setItem('stackmastery.v1', JSON.stringify(s)); }")
            page.wait_for_function("() => !document.documentElement.dataset.theme", timeout=5000)
            # Cross-tab interview sync: saving a mock in another tab updates Interview Hub readiness & sidebar %.
            goto(page, base, "interview/")
            iv_nav_before = page.inner_text(iv_nav)
            other.evaluate("""() => {
              const d = JSON.parse(localStorage.getItem('stackmastery.interview') || '{}');
              d.mocks = [{ date: '2026-11-23', type: 'coding', title: 'Two Sum', scores: [4,4,4,4], avg: 4, notes: 'Clean' }];
              localStorage.setItem('stackmastery.interview', JSON.stringify(d));
            }""")
            page.wait_for_function("(prev) => document.querySelector(\"#nav a.nav-link[href='/stack-mastery/interview/'] small\")?.textContent !== prev", arg=iv_nav_before, timeout=5000)
            page.wait_for_function("() => { const n = document.querySelector('#view .ring-n'); return n && n.textContent !== '0%'; }", timeout=5000)
            check(page.text_content("#view .ring-n") != "0%", "Cross-tab stackmastery.interview update must refresh Interview Hub readiness ring")
            other.evaluate("() => { localStorage.removeItem('stackmastery.interview'); }")
            # Cross-tab study timer sync: updating stackmastery.study in another tab updates the sidebar Pomodoro pill in place.
            other.evaluate("""() => {
              const cur = JSON.parse(localStorage.getItem('stackmastery.study') || '{}');
              const today = new Date().toLocaleDateString('sv');
              cur.preset = '50/10'; cur.focusMin = 50; cur.breakMin = 10;
              cur.phase = 'idle'; cur.running = false; cur.remainingSec = 3000; cur.endsAtMs = null;
              cur.cycles = { date: today, todayCount: 3, totalCount: 3 };
              localStorage.setItem('stackmastery.study', JSON.stringify(cur));
            }""")
            page.wait_for_function("() => document.querySelector('#nav [data-pomo-clock]')?.textContent === '50:00'", timeout=5000)
            check("3 cycles today" in page.inner_text("#nav [data-pomo-cycles]"), "Cross-tab stackmastery.study sync must update sidebar Pomodoro cycles")
            page.wait_for_timeout(150)
            other.close()

            # Export backup includes the raw language preference (not JSON) and stackmastery.study next to the progress keys.
            with page.expect_download() as dl_info:
                page.locator("#nav .nav-foot button", has_text="Export backup").click()
            backup = json.loads(Path(dl_info.value.path()).read_text(encoding="utf-8"))
            check(backup.get("keys", {}).get("stackmastery.lang") == "en", f"Backup must include stackmastery.lang='en', got keys {list(backup.get('keys', {}))}")
            check("stackmastery.v1" in backup.get("keys", {}), "Backup must include stackmastery.v1 progress")
            check("stackmastery.study" in backup.get("keys", {}), "Backup must include stackmastery.study Pomodoro session state")

            # Legacy #/... bookmarks redirect to their static pages.
            for legacy, target in [("#/lesson/go/concurrency", "lesson/go/concurrency/"), ("#/play/sql/joins", "play/sql/?sample=joins"),
                                   ("#/meadow", "break/"), ("#/interview/problem/two-sum", "interview/problem/two-sum/"),
                                   ("#/lab/syshash", "lab/syshash/"), ("#/dashboard", "dashboard/"), ("#/plan/go/types", "plan/go/types/")]:
                page.goto(base + legacy, wait_until="domcontentloaded")
                page.wait_for_url(base + target, timeout=10000)
                check(page.url == base + target, f"Legacy {legacy} must redirect to {base + target}, got {page.url}")
            goto(page, base, "")
            check(page.url == base and page.locator(".lp-root").count() == 1, "Plain /stack-mastery/ must stay on the English landing page")

            check(len(errs) == 0, f"EN pass runtime/console errors: {errs}")
            ctx.close()

            # Saved ID preference is honoured for legacy hash links on the English root; plain / stays English.
            ctx_pref = browser.new_context(viewport={"width": 1280, "height": 840})
            pp = ctx_pref.new_page()
            pp.add_init_script(lang_init('id'))
            pp.goto(base + "#/lab", wait_until="domcontentloaded")
            pp.wait_for_url(base + "id/lab/", timeout=10000)
            check(pp.url == base + "id/lab/", f"Legacy #/lab with saved ID preference must open /id/lab/, got {pp.url}")
            pp.goto(base + "#/lesson/go/concurrency", wait_until="domcontentloaded")
            pp.wait_for_url(base + "id/lesson/go/concurrency/", timeout=10000)
            # PR #4 polish regression: bare #/ bookmark with saved ID preference must redirect to /id/.
            pp.goto(base + "#/", wait_until="domcontentloaded")
            pp.wait_for_url(base + "id/", timeout=10000)
            check(pp.url == base + "id/", f"Legacy bare #/ with saved ID preference must redirect to /id/, got {pp.url}")
            goto(pp, base, "")
            check(pp.url == base and pp.evaluate("document.documentElement.lang") == "en", "Visiting / directly must keep English even with an ID preference")
            nf = pp.goto(base + "no-such-page/", wait_until="domcontentloaded")
            check(nf.status == 404 and pp.locator("a[href='/stack-mastery/']").count() >= 1 and pp.locator("a[href='/stack-mastery/id/']").count() >= 1,
                  "404 page must return 404 and link to / and /id/")
            ctx_pref.close()

            # PWA: service worker takes control, then a visited lesson reloads offline.
            ctx_pwa = browser.new_context(viewport={"width": 1280, "height": 840})
            pw = ctx_pwa.new_page()
            pwa_errs = []
            watch_errors(pw, pwa_errs)
            goto(pw, base, "lesson/go/concurrency/")
            check(pw.evaluate("document.querySelector('link[rel=manifest]')?.getAttribute('href')") == "/stack-mastery/manifest.webmanifest", "Pages must link the web manifest")
            pw.wait_for_function("() => !!navigator.serviceWorker.controller", timeout=15000)
            scope = pw.evaluate("navigator.serviceWorker.getRegistration().then(r => r && r.scope)")
            check(scope == base, f"Service worker scope must be {base}, got {scope}")
            pw.wait_for_function("() => caches.match(location.href).then(Boolean)", timeout=15000)
            pw.wait_for_function("() => caches.match('/stack-mastery/').then(Boolean)", timeout=15000)
            pw.wait_for_timeout(500)
            ctx_pwa.set_offline(True)
            failed = []
            pw.on("requestfailed", lambda r: failed.append(r.url) if r.url.startswith(base) else None)
            pw.reload(wait_until="domcontentloaded")
            pw.wait_for_function(PAGE_READY, timeout=15000)
            check("Concurrency" in pw.inner_text("#view h1") or len(pw.inner_text("#view h1")) > 3, "Offline reload must render the lesson heading")
            check(pw.locator("#view [data-quiz] .q").count() >= 1, "Offline reload must hydrate the quiz island")
            check(not failed, f"Offline reload must not fail same-origin requests: {failed}")
            check(len(pwa_errs) == 0, f"PWA pass page/console errors: {pwa_errs}")
            # The precached shell pages still render their static HTML offline (islands may need assets not yet cached).
            pw.goto(base + "dashboard/", wait_until="domcontentloaded")
            check(pw.locator("#nav").count() == 1 and pw.locator("#view h1").count() == 1, "Precached /dashboard/ shell must render offline")
            ctx_pwa.set_offline(False)
            ctx_pwa.close()

            # 2. Indonesian (ID) + Dark mode pass
            ctx_id = browser.new_context(viewport={"width": 1280, "height": 840}, color_scheme="dark")
            page_id = ctx_id.new_page()
            errs_id = []
            watch_errors(page_id, errs_id)
            page_id.add_init_script(lang_init('id'))
            goto(page_id, base, "id/")
            lp_id = page_id.inner_text("#view")
            check("Pelajari." in lp_id and "Buktikan." in lp_id and "Ajarkan." in lp_id and "Buka Dashboard" in lp_id, "Indonesian landing page must translate headline and CTA")
            check(page_id.evaluate("document.documentElement.lang") == "id", "/id/ must declare <html lang=id>")
            goto(page_id, base, "id/dashboard/")
            check("Materi pertama yang disarankan" in page_id.inner_text("#view"), "Indonesian dashboard must load cleanly at /id/dashboard/")
            check(page_id.locator("#nav a[data-set-lang]").get_attribute("href") == BASE_PATH + "dashboard/", "ID sidebar EN switch must link to the English page")
            goto(page_id, base, "id/break/")
            br_id = page_id.inner_text("#view")
            check("Padang bunga, dirapal dengan tangan." in br_id and "Kembali Belajar" in br_id, "Indonesian break room must translate headline and CTA")
            check(page_id.locator("#view .br-dock button", has_text="Musik: MATI").count() == 1, "Indonesian break room music must start at Musik: MATI")
            goto(page_id, base, "id/lesson/angular/signals/")
            body_id = page_id.inner_text("#view")
            check("Istilah penting" in body_id, "Indonesian Angular lesson must translate Key words -> Istilah penting")
            check("Tebak dulu" in body_id, "Indonesian signals lesson should render Tebak dulu")
            page_id.locator(".predict-card .opt").nth(1).click()
            check("Sudah ditebak" in page_id.inner_text(".predict-card") or "Benar" in page_id.inner_text(".predict-card") or "Belum tepat" in page_id.inner_text(".predict-card"),
                  "Indonesian predict feedback must be translated")
            goto(page_id, base, "id/lab/sqllock/")
            check("Transaksi konkuren" in page_id.inner_text("#view"), "Indonesian ui-vizplus must translate sqllock")
            goto(page_id, base, "id/lesson/go/collections/")
            go_id = page_id.inner_text("#view")
            check("Istilah penting" in go_id and "Tebak dulu" in go_id, "Indonesian Go collections lesson must translate")
            goto(page_id, base, "id/lab/gocontext/")
            check("Pohon pembatalan context.Context" in page_id.inner_text("#view"), "Indonesian ui-vizgo must translate gocontext")
            goto(page_id, base, "id/lesson/sysdesign/caching/")
            sys_id = page_id.inner_text("#view")
            check("Istilah penting" in sys_id and "Tebak dulu" in sys_id, "Indonesian sysdesign/caching lesson must translate")
            goto(page_id, base, "id/lab/sysqueue/")
            check("Lab transactional outbox" in page_id.inner_text("#view"), "Indonesian ui-vizsys must translate sysqueue")
            goto(page_id, base, "id/interview/design/notification-system/")
            check("Layanan notifikasi multi-kanal" in page_id.inner_text("#view"), "Indonesian notification-system design case must translate")
            goto(page_id, base, "id/interview/mock/")
            check(len(page_id.evaluate(WCAG_DOM_AUDIT)) == 0, f"ID mock interview WCAG issues: {page_id.evaluate(WCAG_DOM_AUDIT)}")
            goto(page_id, base, "id/search/")
            page_id.locator("#view input[type='search']").fill("outbox")
            page_id.wait_for_timeout(80)
            check(page_id.locator("#view a.row.hit").count() >= 1 and page_id.locator("#view a.row.hit").first.get_attribute("href").startswith(BASE_PATH + "id/"),
                  "Indonesian search must return hits linking to /id/ pages")
            goto(page_id, base, "id/play/ts/")
            ts_chips = page_id.inner_text("#view .chips")
            check("Method array" in ts_chips and "Komponen React" in ts_chips and "Generics" not in ts_chips, f"Indonesian TS playground chips must be translated, got: {ts_chips}")
            check(page_id.locator("#view .chips button[data-k='Generics']").count() == 1, "Translated TS chips must keep English data-k lookup keys")
            page_id.locator("#view .chips button", has_text="Komponen React").click()
            check(page_id.locator("#view .chips button.on[data-k='React component']").count() == 1, "Clicking a translated chip must select its example")
            page_id.wait_for_timeout(1200)   # let Monaco's TS worker finish; leaving mid-request makes Monaco reject with "Canceled"
            goto(page_id, base, "id/play/css/")
            css_chips = page_id.inner_text("#view .chips")
            check("Navbar flexbox" in css_chips and "Grid responsif" in css_chips and "Kartu Tailwind" in css_chips, f"Indonesian CSS playground chips must be translated, got: {css_chips}")
            goto(page_id, base, "id/play/dart/")
            check(page_id.locator("#view .chips button").count() >= 3, "Indonesian Dart playground must list lesson samples")
            check(len(errs_id) == 0, f"ID pass runtime/console errors: {errs_id}")
            ctx_id.close()

            # 3. Mobile 360px drawer modality & overflow check
            ctx_m = browser.new_context(viewport={"width": 360, "height": 780})
            pm = ctx_m.new_page()
            pm.add_init_script(lang_init('en'))
            for r in ["", "break/", "dashboard/", "track/angular/", "track/go/", "track/sysdesign/", "lesson/angular/signals/", "lesson/go/collections/",
                      "lesson/sysdesign/caching/", "lesson/aspnet/arch/", "lab/goslices/", "lab/gocontext/", "lab/syscache/", "lab/sysratelimit/",
                      "lab/sysdbscale/", "lab/syshash/", "lab/sysqueue/", "lab/sysresilience/", "play/sql/", "play/ts/", "play/css/", "play/dart/", "interview/coding/", "interview/design/",
                      "interview/design/notification-system/", "interview/mock/", "projects/", "exam/", "start/", "teach/", "search/", "plan/go/types/",
                      "id/", "id/lesson/go/concurrency/"]:
                goto(pm, base, r)
                check(pm.evaluate("document.documentElement.scrollWidth <= window.innerWidth + 1"), f"360px mobile overflow on /{r}")
            for w in [320, 768]:
                pm.set_viewport_size({"width": w, "height": 780})
                for r in ["", "break/"]:
                    goto(pm, base, r)
                    check(pm.evaluate("document.documentElement.scrollWidth <= window.innerWidth + 1"), f"{w}px responsive overflow on /{r}")
            pm.set_viewport_size({"width": 360, "height": 780})
            goto(pm, base, "dashboard/")
            pm.locator(".nav-toggle").click()
            pm.wait_for_timeout(120)
            check(pm.evaluate("document.getElementById('view').inert === true && document.querySelector('#nav .nav-top').inert === true"), "Mobile drawer open must set inert on BOTH #view and .nav-top")
            check(pm.evaluate("document.querySelector('#nav .nav-drawer').getAttribute('role') === 'dialog'"), "Open mobile drawer must be a modal dialog")
            pm.keyboard.press("Escape")
            pm.wait_for_timeout(120)
            check(not pm.locator("#nav.open").count(), "Escape should close mobile drawer")
            ctx_m.close()

            # 4. axe-core WCAG 2.2 AA: 0 critical / serious violations, EN + ID, light + dark, desktop + mobile.
            axe_runs = 0
            for lang in ["en", "id"]:
                for scheme in ["light", "dark"]:
                    for vp in [{"width": 1280, "height": 840}, {"width": 360, "height": 780}]:
                        cx = browser.new_context(viewport=vp, color_scheme=scheme, reduced_motion="reduce")
                        pa = cx.new_page()
                        pa.add_init_script(lang_init(lang))
                        for r in AXE_ROUTES:
                            path = r if lang == "en" else "id/" + r
                            goto(pa, base, path)
                            if r == "play/sql/":
                                pa.wait_for_function("() => !/SQLite…/.test(document.querySelector('#view .out')?.textContent || '')", timeout=30000)
                            if r in ("play/sql/", "play/ts/", "play/css/"):
                                pa.wait_for_selector("#view .monaco-editor", timeout=30000)
                            bad = axe_violations(pa)
                            axe_runs += 1
                            check(not bad, f"axe {lang}/{scheme}/{vp['width']}px /{path}: {bad}")
                        cx.close()
            print(f"axe-core WCAG 2.2 AA: {axe_runs} route scans across EN/ID, light/dark, desktop/mobile.")
            check(axe_runs >= 96, f"Expected at least 96 axe scans, ran {axe_runs}")

        finally:
            browser.close()
            srv.shutdown()

    if failures:
        print(f"\n{len(failures)} of {checks[0]} UI check(s) FAILED.")
        sys.exit(1)
    print(f"\n{checks[0]} checks: ALL static SSG + JS budget + SEO + PWA + EN/ID + Desktop/Mobile + Viz/Playground/Dialog/WCAG checks PASSED!")


if __name__ == "__main__":
    run_suite()
