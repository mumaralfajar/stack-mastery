"""Shared constants, local HTTP static server, browser launch, navigation, and axe helpers."""
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import sys
import threading

ROOT = Path(__file__).resolve().parent.parent.parent
DIST = ROOT / "dist"
BASE_PATH = "/stack-mastery/"
SITE = "https://mumaralfajar.github.io"
AXE_JS = ROOT / "node_modules" / "axe-core" / "axe.min.js"
AXE_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]
AXE_ROUTES = [
    "", "dashboard/", "break/", "track/sysdesign/", "lesson/angular/signals/", "lab/syscache/", "play/sql/",
    "play/ts/", "play/css/", "play/dart/", "interview/", "interview/coding/", "interview/behavioral/",
    "interview/mock/", "exam/", "review/", "notes/", "search/", "plan/go/types/",
]
EXPECTED_VIZ = 40
EXPECTED_LESSONS = 135
EXPECTED_TRACKS = 10
EXPECTED_PROBLEMS = 21
EXPECTED_DESIGN_CASES = 8
LANDING_JS_BUDGET = 46080  # bytes, raw (uncompressed): strictly < 45 KB
VIZ_CHUNK_RX = r"/_astro/(viz|vizcss|vizmore|vizangular|vizflutter|vizplus|vizgo|vizsys)\.[\w-]+\.js$"
CURRICULUM_CHUNK_RX = r"/_astro/(data|tracks-core|tracks-ui|core|web)\.[\w-]+\.js$"
APP_GLOBALS = [
    "TRACKS", "VIZ", "I18N", "PLAY", "INTERVIEW", "IV", "PROJECTS", "LEVELS", "h", "md", "t", "esc",
    "codeBlock", "codeFiles", "confirmDialog", "alertDialog", "tableWrap", "S", "routePath", "legacyHashToPath",
]


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
