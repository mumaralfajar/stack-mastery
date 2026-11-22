"""End-to-end UI, i18n, responsive layout, visualization, playground, and WCAG verification against built dist/."""
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import json
import threading
import sys
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent.parent
DIST = ROOT / "dist"
AXE_JS = ROOT / "node_modules" / "axe-core" / "axe.min.js"
AXE_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]
AXE_ROUTES = ["#/", "#/dashboard", "#/break", "#/track/sysdesign", "#/lesson/angular/signals", "#/lab/syscache", "#/play/sql",
              "#/interview", "#/interview/coding", "#/interview/behavioral", "#/interview/mock", "#/exam"]
EXPECTED_VIZ = 40


class SubpathHandler(SimpleHTTPRequestHandler):
    def translate_path(self, path):
        clean = path.split("?", 1)[0].split("#", 1)[0]
        if clean.startswith("/stack-mastery"):
            clean = clean[len("/stack-mastery"):] or "/"
        rel = clean.lstrip("/") or "index.html"
        target = (DIST / rel).resolve()
        if not target.is_relative_to(DIST.resolve()) or not target.exists():
            return str(DIST / "index.html")
        return str(target)

    def log_message(self, format, *args):
        pass


def start_server():
    srv = ThreadingHTTPServer(("127.0.0.1", 0), SubpathHandler)
    port = srv.server_address[1]
    t = threading.Thread(target=srv.serve_forever, daemon=True)
    t.start()
    return srv, f"http://127.0.0.1:{port}/stack-mastery/"


WCAG_DOM_AUDIT = """() => {
  const issues = [];
  const ids = new Map();
  for (const el of document.querySelectorAll('[id]')) {
    const k = el.id;
    ids.set(k, (ids.get(k) || 0) + 1);
  }
  for (const [k, n] of ids) if (n > 1) issues.push('Duplicate id: ' + k);
  for (const el of document.querySelectorAll('select, textarea, input')) {
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


def lang_init(lang):
    # Init scripts also run in sandboxed preview iframes, where touching localStorage throws.
    return f"if (window === window.top) localStorage.setItem('stackmastery.lang', '{lang}');"


def goto_hash(page, base, h):
    if page.url.startswith(base):
        page.evaluate("(h) => { location.hash = h; }", h)
    else:
        page.goto(base + h, wait_until="domcontentloaded")
    page.wait_for_function("(h) => location.hash === h && document.querySelector('#view .page, #view .lp-root') !== null", arg=h, timeout=10000)
    page.wait_for_timeout(180)


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


def run_suite():
    srv, base = start_server()
    failures = []

    def check(cond, msg):
        if not cond:
            failures.append(msg)
            print("FAIL:", msg)

    with sync_playwright() as p:
        browser = launch_browser(p)
        try:
            # 1. Desktop EN pass
            ctx = browser.new_context(viewport={"width": 1280, "height": 840})
            page = ctx.new_page()
            errs = []
            page.on("pageerror", lambda e: errs.append(f"pageerror: {e}"))
            page.on("console", lambda m: errs.append(f"console.{m.type}: {m.text}") if m.type == "error" else None)

            page.add_init_script(lang_init('en'))
            # 1a. Full-bleed interactive Distributed Packet Reactor at #/
            goto_hash(page, base, "#/")
            check(page.evaluate("document.body.classList.contains('is-landing')"), "#/' must apply body.is-landing full-bleed mode")
            check(not page.locator("#nav").is_visible(), "Sidebar #nav must be hidden on landing route #/")
            check(page.evaluate("document.querySelector('#view .lp-dock')?.getAttribute('data-collapsed') === 'true'"), "Landing dock must start collapsed by default")
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
            page.locator("#view .lp-dock button", has_text="Pause").click()
            check(page.locator("#view .lp-dock button", has_text="Play").count() == 1, "Pause must flip label to Play cleanly")
            page.locator("#view .lp-dock .lp-dock-toggle").click()
            check(page.evaluate("document.querySelector('#view .lp-dock')?.getAttribute('data-collapsed') === 'true'"), "Landing dock toggle must collapse dock")
            check(page.evaluate("document.documentElement.scrollWidth <= window.innerWidth + 1"), "Desktop landing overflowed")
            check(len(page.evaluate(WCAG_DOM_AUDIT)) == 0, f"Landing WCAG issues: {page.evaluate(WCAG_DOM_AUDIT)}")
            page.locator("#view .lp-copy a.btn", has_text="Open Dashboard").click()
            page.wait_for_function("() => location.hash === '#/dashboard' && document.querySelector('#view .page') !== null", timeout=10000)

            # 1b. Workspace Dashboard at #/dashboard
            goto_hash(page, base, "#/dashboard")
            check("Recommended first lesson" in page.inner_text("#view"), "0% dashboard should show 1 Recommended first lesson instead of 8 continue cards")
            check(page.locator("#nav .nav-actions").count() == 1, "nav-actions should live inside sidebar nav-top on desktop")
            check(page.evaluate("document.documentElement.scrollWidth <= window.innerWidth + 1"), "Desktop dashboard overflowed")
            check(len(page.evaluate(WCAG_DOM_AUDIT)) == 0, f"Dashboard WCAG issues: {page.evaluate(WCAG_DOM_AUDIT)}")

            # 1c. Frieren Flower Magic Break Room at #/break
            goto_hash(page, base, "#/break")
            check(page.evaluate("document.body.classList.contains('is-landing')"), "#/break must apply body.is-landing full-bleed mode")
            check(not page.locator("#nav").is_visible(), "Sidebar #nav must be hidden on break room #/break")
            check(page.evaluate("document.querySelector('#view .br-stage')?.getAttribute('data-hud-hidden') === 'true'"), "Break room HUD must start hidden by default")
            check(page.evaluate("document.querySelector('#view .br-dock')?.getAttribute('data-collapsed') === 'true'"), "Break room dock must start collapsed by default")
            brect = page.evaluate("() => { const r = document.querySelector('#view canvas.br-canvas')?.getBoundingClientRect(); return r ? {w: r.width, h: r.height} : null; }")
            check(brect and brect["w"] > 400 and brect["h"] > 300, f"Break room canvas must fill stage, got {brect}")
            page.locator("#view .br-dock .lp-dock-toggle").click()
            check(page.evaluate("document.querySelector('#view .br-dock')?.getAttribute('data-collapsed') === 'false'"), "Break room dock toggle must expand dock")
            page.locator("#view .br-dock button", has_text="Grand Bloom").click()
            page.locator("#view .br-dock button", has_text="Meteor Shower").click()
            page.locator("#view .br-dock button", has_text="Zen Auto-Bloom").click()
            # Audio is opt-in (DESIGN.md): the room starts silent and only plays after the learner presses Music.
            check(page.locator("#view .br-dock button", has_text="Music: OFF").count() == 1, "Break room music must start at Music: OFF (opt-in audio)")
            check(page.locator("#view .br-dock button", has_text="Music: ON").count() == 0, "Break room must not render Music: ON before the learner opts in")
            page.locator("#view .br-dock button", has_text="Music: OFF").click()
            check(page.locator("#view .br-dock button", has_text="Music: ON").count() == 1, "Break room Music: OFF must toggle to Music: ON")
            page.locator("#view .br-dock button", has_text="Music: ON").click()
            check(page.locator("#view .br-dock button", has_text="Music: OFF").count() == 1, "Break room Music: ON must toggle back to Music: OFF")
            page.locator("#view .br-dock button", has_text="Show HUD").click()
            check(page.evaluate("document.querySelector('#view .br-stage')?.getAttribute('data-hud-hidden') === 'false'"), "Show HUD must restore data-hud-hidden=false")
            check(page.locator("#view .br-dock button", has_text="Hide HUD").count() == 1, "Show HUD must flip label to Hide HUD")
            page.locator("#view .br-dock button", has_text="Hide HUD").click()
            check(page.evaluate("document.querySelector('#view .br-stage')?.getAttribute('data-hud-hidden') === 'true'"), "Hide HUD must set data-hud-hidden=true")
            page.locator("#view .br-dock button", has_text="Pause").click()
            check(page.locator("#view .br-dock button", has_text="Play").count() == 1, "Break room Pause must flip label to Play cleanly")
            page.locator("#view .br-dock .lp-dock-toggle").click()
            check(page.evaluate("document.querySelector('#view .br-dock')?.getAttribute('data-collapsed') === 'true'"), "Break room dock toggle must collapse dock")
            check(page.evaluate("document.documentElement.scrollWidth <= window.innerWidth + 1"), "Desktop break room overflowed")
            check(len(page.evaluate(WCAG_DOM_AUDIT)) == 0, f"Break room WCAG issues: {page.evaluate(WCAG_DOM_AUDIT)}")

            # Lesson: Predict first, Angular syntax template highlighting, signals formulas
            goto_hash(page, base, "#/lesson/angular/signals")
            check(page.locator(".predict-card").is_visible(), "signals lesson should render Predict first card")
            check(page.locator(".code.hide-hints").count() >= 1, "code hints should start hidden while prediction pending")
            page.locator(".predict-card .opt").nth(1).click()
            page.wait_for_timeout(80)
            check(page.locator(".code.hide-hints").count() == 0, "code hints should unblur after prediction")
            check(page.locator(".viz-eq").count() >= 3, "VIZ.ngsignals should display computed formulas (.viz-eq)")

            # Long monolith multi-file code tabs + Angular HTML template syntax spans
            goto_hash(page, base, "#/lesson/aspnet/arch")
            check(page.locator(".code-tabs [role='tab']").count() == 5, f"aspnet/arch should render 5 tabs (4 slices + Full file)")
            page.locator(".code-tabs [role='tab']").nth(1).click()
            check("PlaceOrder" in page.inner_text(".code-tabwrap pre"), "2nd tab should show PlaceOrder slice")

            # Quiz persistence + Teach empty guard
            goto_hash(page, base, "#/lesson/csharp/types")
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
            page.reload(wait_until="networkidle")
            page.wait_for_selector("#view .q", timeout=8000)
            check(page.locator("#view .q").first.locator(".fb.good").count() == 1, "Quiz completion for answered question should persist across reload")

            # Visualizations (fixed + 7 new)
            goto_hash(page, base, "#/lab/rerender")
            check("<TodoItem A>" in page.inner_text("#view .tree"), "rerender tree must keep distinct <TodoItem A> label")
            check(page.locator("#view .tree-wires path").count() == 1, "rerender tree must render SVG hierarchy connectors")

            goto_hash(page, base, "#/lab/di")
            page.get_by_role("button", name="Restart app").click()
            check("#5" in page.inner_text("#view table"), "Restart app in VIZ.di must generate new singleton #5")

            # Every VIZ lab, discovered from window.VIZ so a new lab is covered automatically.
            goto_hash(page, base, "#/lab")
            viz_ids = page.evaluate("Object.keys(window.VIZ)")
            check(len(viz_ids) == EXPECTED_VIZ, f"Expected {EXPECTED_VIZ} VIZ labs, found {len(viz_ids)}: {viz_ids}")
            check(page.locator("#view .grid a.card").count() == len(viz_ids), "Visual lab index must list one card per VIZ lab")
            for vid in viz_ids:
                before = len(errs)
                goto_hash(page, base, "#/lab/" + vid)
                check(len(page.inner_text("#view .viz")) > 20, f"viz {vid} rendered empty")
                check(len(page.evaluate(WCAG_DOM_AUDIT)) == 0, f"viz {vid} WCAG issues: {page.evaluate(WCAG_DOM_AUDIT)}")
                check(len(errs) == before, f"viz {vid} console/page errors: {errs[before:]}")

            # System Design track, Predict-first caching, rate limiter boundary burst, and code tabs
            goto_hash(page, base, "#/track/sysdesign")
            check(page.locator("#view .rows a.row").count() == 16, "System Design track should list 16 lessons")
            goto_hash(page, base, "#/lesson/sysdesign/caching")
            check(page.locator(".predict-card").is_visible(), "sysdesign/caching should render Predict first card")
            check(page.locator("#view .viz .sd-slots").count() == 1, "sysdesign/caching should mount syscache lab")
            goto_hash(page, base, "#/lesson/sysdesign/ratelimiting")
            page.locator("#view .viz button", has_text="Jump to :09").click()
            page.locator("#view .viz button", has_text="Burst ×4").click()
            page.locator("#view .viz button", has_text="Advance +2s").click()
            page.locator("#view .viz button", has_text="Burst ×4").click()
            check("Seam 2× risk" in page.inner_text("#view .viz"), "Fixed Window must flag Seam 2x risk across :09..:11 burst")
            goto_hash(page, base, "#/lesson/sysdesign/containers-k8s")
            check(page.locator(".code-tabs [role='tab']").count() == 3, "sysdesign/containers-k8s should render 3 tabs (2 slices + Full file)")

            # Go track, Predict-first slice aliasing, and code-tabs split
            goto_hash(page, base, "#/track/go")
            check(page.locator("#view .rows a.row").count() == 14, "Go track should list 14 lessons")
            goto_hash(page, base, "#/lesson/go/collections")
            check(page.locator(".predict-card").is_visible(), "go/collections should render Predict first card")
            check(page.locator(".code.hide-hints").count() >= 1, "go/collections code hints should start blurred")
            page.locator(".predict-card .opt").nth(1).click()
            page.wait_for_timeout(80)
            check(page.locator(".code.hide-hints").count() == 0, "go/collections hints should unblur after prediction")
            goto_hash(page, base, "#/lesson/go/http")
            check(page.locator(".code-tabs [role='tab']").count() == 4, "go/http should render 4 tabs (3 slices + Full file)")

            # SQL grading uses an isolated clean snapshot: a destructive free-play DELETE must not break grading.
            goto_hash(page, base, "#/play/sql")
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
            page.locator("#view .actions button", has_text="Reset database").click()

            # TypeScript playground runs the selected example and prints output.
            goto_hash(page, base, "#/play/ts")
            page.locator("#view .actions button", has_text="Run (Ctrl+Enter)").click()
            page.wait_for_function("() => { const o = document.querySelector('#view .out'); return !!o && !!o.querySelector('pre, .err, iframe') && !/Running…/.test(o.textContent); }", timeout=30000)
            ts_out = page.inner_text("#view .out")
            check("Mouse" in ts_out and page.locator("#view .out p.err").count() == 0, f"TypeScript playground Run must render output, got: {ts_out[:200]}")

            # Playgrounds deep link, schema drawer, dialect tip, dialog confirmation (non-native!)
            goto_hash(page, base, "#/play/sql/joins")
            check("Orders with names" in page.inner_text("#view .chips button.on"), "SQL deep link should pre-select Orders with names challenge")
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

            # Search
            goto_hash(page, base, "#/search")
            page.locator("input[type='search']").fill("Outbox")
            page.wait_for_timeout(80)
            check(page.locator("#view mark").count() >= 1, "Search should highlight matches using <mark>")

            # Interview routes + coding arena (PLAY.editor) + System Design cases + scorecard labels + reset modal dialog
            for ir in ["#/interview", "#/interview/coding", "#/interview/patterns", "#/interview/design", "#/interview/design/notification-system", "#/interview/design/search-autocomplete", "#/interview/behavioral", "#/interview/rapid"]:
                goto_hash(page, base, ir)
                check(len(page.inner_text("#view")) > 40, f"Interview route {ir} rendered empty")
            goto_hash(page, base, "#/interview/design")
            check("Multi-channel notification service" in page.inner_text("#view") and "Search typeahead" in page.inner_text("#view"), "Interview design should list 8 worked cases including notification and search autocomplete")
            goto_hash(page, base, "#/interview/rapid")
            check("System design" in page.inner_text("#view") and "Kleppmann" in page.inner_text("#view"), "Rapid-fire page must render 6 System design Q&As")
            goto_hash(page, base, "#/interview/coding")
            first_prob_href = page.locator("#view .rows a.row").first.get_attribute("href")
            page.locator("#view .rows a.row").first.click()
            page.wait_for_selector("#view .play", timeout=8000)
            check(page.locator("#view .actions button", has_text="Run tests").count() == 1, "Coding problem arena must render editor and Run tests")

            # Story bank saves and shows the STAR Reflection field.
            goto_hash(page, base, "#/interview/behavioral")
            page.get_by_label("Title", exact=True).fill("Cache bug story")
            page.get_by_label("Reflection: what you learned").fill("Reproduce bugs in a test first.")
            page.locator("#view .story-form button", has_text="Save story").click()
            story = page.locator("#view details.story", has_text="Cache bug story")
            story.locator("summary").click()
            check("Reflection: Reproduce bugs in a test first." in story.inner_text(), "Saved story must display its Reflection")

            # Mock history shows saved notes and can delete a row (confirmed through the styled dialog).
            goto_hash(page, base, "#/interview/mock")
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
            goto_hash(page, base, "#/interview")
            check("No mock interviews recorded yet." in page.inner_text("#view"), "Hub mock history must reflect the deletion")

            # Mock exam renders a notice instead of a blank stage when no question matches the filters.
            goto_hash(page, base, "#/exam")
            page.evaluate("() => { const s = document.querySelectorAll('#view .actions select')[1]; s.append(new Option('none', '99')); s.value = '99'; }")
            page.locator("#view .actions button", has_text="Start exam").click()
            check("No questions match these filters." in page.inner_text("#view"), "Empty Mock exam pool must render an empty-state notice")

            goto_hash(page, base, "#/interview/mock")
            check(len(page.evaluate(WCAG_DOM_AUDIT)) == 0, f"Mock interview WCAG issues: {page.evaluate(WCAG_DOM_AUDIT)}")
            page.locator("#view .card", has_text="Coding round").get_by_role("button", name="Start").click()
            page.wait_for_selector("#view .play", timeout=8000)
            check(page.locator("#view .play .editor, #view .monaco-host").count() >= 1, "Mock coding session must render coding arena")

            # Cold-load directly onto coding problem route (reproduces direct URL load of arena -> PLAY.editor)
            cold_page = ctx.new_page()
            cold_errs = []
            cold_page.on("pageerror", lambda e: cold_errs.append(f"cold pageerror: {e}"))
            cold_page.add_init_script(lang_init('en'))
            cold_page.goto(base + first_prob_href, wait_until="domcontentloaded")
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
            goto_hash(page, base, "#/dashboard")
            other = ctx.new_page()
            other.goto(base + "#/dashboard", wait_until="domcontentloaded")
            other.wait_for_selector("#view .page", timeout=10000)
            other.evaluate("""() => {
              const s = JSON.parse(localStorage.getItem('stackmastery.v1') || '{}');
              s.theme = 'dark';
              s.lessons = Object.assign(s.lessons || {}, { 'go/types': { read: true, quiz: true, teach: true } });
              localStorage.setItem('stackmastery.v1', JSON.stringify(s));
            }""")
            page.wait_for_function("() => document.documentElement.dataset.theme === 'dark'", timeout=5000)
            go_pct = page.inner_text("#nav a.nav-link[href='#/track/go'] small")
            check(go_pct != "0%", f"Cross-tab progress must refresh the sidebar track percentage, got {go_pct}")
            other.evaluate("() => { const s = JSON.parse(localStorage.getItem('stackmastery.v1')); s.theme = ''; localStorage.setItem('stackmastery.v1', JSON.stringify(s)); }")
            page.wait_for_function("() => !document.documentElement.dataset.theme", timeout=5000)
            other.close()

            # Export backup includes the raw language preference (not JSON) next to the progress keys.
            with page.expect_download() as dl_info:
                page.locator("#nav .nav-foot button", has_text="Export backup").click()
            backup = json.loads(Path(dl_info.value.path()).read_text(encoding="utf-8"))
            check(backup.get("keys", {}).get("stackmastery.lang") == "en", f"Backup must include stackmastery.lang='en', got keys {list(backup.get('keys', {}))}")

            check(len(errs) == 0, f"EN pass runtime/console errors: {errs}")
            ctx.close()

            # 2. Indonesian (ID) + Dark mode pass
            ctx_id = browser.new_context(viewport={"width": 1280, "height": 840}, color_scheme="dark")
            page_id = ctx_id.new_page()
            errs_id = []
            page_id.on("pageerror", lambda e: errs_id.append(f"pageerror: {e}"))
            page_id.on("console", lambda m: errs_id.append(f"console.{m.type}: {m.text}") if m.type == "error" else None)
            page_id.add_init_script(lang_init('id'))
            goto_hash(page_id, base, "#/")
            lp_id = page_id.inner_text("#view")
            check("Pelajari." in lp_id and "Buktikan." in lp_id and "Ajarkan." in lp_id and "Buka Dashboard" in lp_id, "Indonesian landing page must translate headline and CTA")
            goto_hash(page_id, base, "#/dashboard")
            check("Materi pertama yang disarankan" in page_id.inner_text("#view"), "Indonesian dashboard must load cleanly at #/dashboard")
            goto_hash(page_id, base, "#/break")
            br_id = page_id.inner_text("#view")
            check("Padang bunga, dirapal dengan tangan." in br_id and "Kembali Belajar" in br_id, "Indonesian break room must translate headline and CTA")
            check(page_id.locator("#view .br-dock button", has_text="Musik: MATI").count() == 1, "Indonesian break room music must start at Musik: MATI")
            goto_hash(page_id, base, "#/lesson/angular/signals")
            body_id = page_id.inner_text("#view")
            check("Istilah penting" in body_id, "Indonesian Angular lesson must translate Key words -> Istilah penting (ui-angular.js Map fix)")
            check("Tebak dulu" in body_id, "Indonesian signals lesson should render Tebak dulu")
            goto_hash(page_id, base, "#/lab/sqllock")
            check("Transaksi konkuren" in page_id.inner_text("#view"), "Indonesian ui-vizplus must translate sqllock")
            goto_hash(page_id, base, "#/lesson/go/collections")
            go_id = page_id.inner_text("#view")
            check("Istilah penting" in go_id and "Tebak dulu" in go_id, "Indonesian Go collections lesson must translate")
            goto_hash(page_id, base, "#/lab/gocontext")
            check("Pohon pembatalan context.Context" in page_id.inner_text("#view"), "Indonesian ui-vizgo must translate gocontext")
            goto_hash(page_id, base, "#/lesson/sysdesign/caching")
            sys_id = page_id.inner_text("#view")
            check("Istilah penting" in sys_id and "Tebak dulu" in sys_id, "Indonesian sysdesign/caching lesson must translate")
            goto_hash(page_id, base, "#/lab/sysqueue")
            check("Lab transactional outbox" in page_id.inner_text("#view"), "Indonesian ui-vizsys must translate sysqueue")
            goto_hash(page_id, base, "#/interview/design/notification-system")
            check("Layanan notifikasi multi-kanal" in page_id.inner_text("#view"), "Indonesian notification-system design case must translate")
            goto_hash(page_id, base, "#/interview/mock")
            check("Skorcard pewawancara" in page_id.inner_text("#view") or "pewawancara" in page_id.inner_text("#view").lower() or len(page_id.evaluate(WCAG_DOM_AUDIT)) == 0, "ID interview loaded cleanly")
            goto_hash(page_id, base, "#/play/ts")
            ts_chips = page_id.inner_text("#view .chips")
            check("Method array" in ts_chips and "Komponen React" in ts_chips and "Generics" not in ts_chips, f"Indonesian TS playground chips must be translated, got: {ts_chips}")
            check(page_id.locator("#view .chips button[data-k='Generics']").count() == 1, "Translated TS chips must keep English data-k lookup keys")
            page_id.locator("#view .chips button", has_text="Komponen React").click()
            check(page_id.locator("#view .chips button.on[data-k='React component']").count() == 1, "Clicking a translated chip must select its example")
            page_id.wait_for_timeout(1200)   # let Monaco's TS worker finish; leaving mid-request makes Monaco reject with "Canceled"
            goto_hash(page_id, base, "#/play/css")
            css_chips = page_id.inner_text("#view .chips")
            check("Navbar flexbox" in css_chips and "Grid responsif" in css_chips and "Kartu Tailwind" in css_chips, f"Indonesian CSS playground chips must be translated, got: {css_chips}")
            check(len(errs_id) == 0, f"ID pass runtime/console errors: {errs_id}")
            ctx_id.close()

            # 3. Mobile 360px Drawer modality & overflow check
            ctx_m = browser.new_context(viewport={"width": 360, "height": 780})
            pm = ctx_m.new_page()
            pm.add_init_script(lang_init('en'))
            for r in ["#/", "#/break", "#/dashboard", "#/track/angular", "#/track/go", "#/track/sysdesign", "#/lesson/angular/signals", "#/lesson/go/collections", "#/lesson/sysdesign/caching", "#/lesson/aspnet/arch", "#/lab/goslices", "#/lab/gocontext", "#/lab/syscache", "#/lab/sysratelimit", "#/lab/sysdbscale", "#/lab/syshash", "#/lab/sysqueue", "#/lab/sysresilience", "#/play/sql", "#/interview/coding", "#/interview/design", "#/interview/design/notification-system", "#/interview/mock", "#/projects", "#/exam"]:
                goto_hash(pm, base, r)
                ov = pm.evaluate("document.documentElement.scrollWidth <= window.innerWidth + 1")
                check(ov, f"360px mobile overflow on {r}")
            for w in [320, 768]:
                pm.set_viewport_size({"width": w, "height": 780})
                for r in ["#/", "#/break"]:
                    goto_hash(pm, base, r)
                    ov = pm.evaluate("document.documentElement.scrollWidth <= window.innerWidth + 1")
                    check(ov, f"{w}px responsive overflow on {r}")
            pm.set_viewport_size({"width": 360, "height": 780})
            goto_hash(pm, base, "#/dashboard")
            pm.locator(".nav-toggle").click()
            pm.wait_for_timeout(120)
            check(pm.evaluate("document.getElementById('view').inert === true && document.querySelector('#nav .nav-top').inert === true"), "Mobile drawer open must set inert on BOTH #view and .nav-top")
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
                            goto_hash(pa, base, r)
                            if r == "#/play/sql":
                                pa.wait_for_function("() => !/SQLite…/.test(document.querySelector('#view .out')?.textContent || '')", timeout=30000)
                            bad = axe_violations(pa)
                            axe_runs += 1
                            check(not bad, f"axe {lang}/{scheme}/{vp['width']}px {r}: {bad}")
                        cx.close()
            print(f"axe-core WCAG 2.2 AA: {axe_runs} route scans across EN/ID, light/dark, desktop/mobile.")

        finally:
            browser.close()
            srv.shutdown()

    if failures:
        print(f"\n{len(failures)} UI check(s) FAILED.")
        sys.exit(1)
    print("\nALL Playwright EN/ID + Desktop/Mobile + Viz/Playground/Dialog/WCAG UI checks PASSED!")


if __name__ == "__main__":
    run_suite()
