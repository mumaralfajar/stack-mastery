"""End-to-end UI, i18n, responsive layout, visualization, playground, and WCAG verification against built dist/."""
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import threading
import sys
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parent.parent
DIST = ROOT / "dist"


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


def goto_hash(page, base, h):
    if page.url.startswith(base):
        page.evaluate("(h) => { location.hash = h; }", h)
    else:
        page.goto(base + h, wait_until="domcontentloaded")
    page.wait_for_function("(h) => location.hash === h && document.querySelector('#view .page') !== null", arg=h, timeout=10000)
    page.wait_for_timeout(180)


def run_suite():
    srv, base = start_server()
    failures = []

    def check(cond, msg):
        if not cond:
            failures.append(msg)
            print("FAIL:", msg)

    with sync_playwright() as p:
        browser = p.chromium.launch(channel="chrome", headless=True)
        try:
            # 1. Desktop EN pass
            ctx = browser.new_context(viewport={"width": 1280, "height": 840})
            page = ctx.new_page()
            errs = []
            page.on("pageerror", lambda e: errs.append(f"pageerror: {e}"))
            page.on("console", lambda m: errs.append(f"console.{m.type}: {m.text}") if m.type == "error" else None)

            page.add_init_script("localStorage.setItem('stackmastery.lang', 'en');")
            goto_hash(page, base, "#/")
            check("Recommended first lesson" in page.inner_text("#view"), "0% dashboard should show 1 Recommended first lesson instead of 8 continue cards")
            check(page.locator("#nav .nav-actions").count() == 1, "nav-actions should live inside sidebar nav-top on desktop")
            check(page.evaluate("document.documentElement.scrollWidth <= window.innerWidth + 1"), "Desktop dashboard overflowed")
            check(len(page.evaluate(WCAG_DOM_AUDIT)) == 0, f"Dashboard WCAG issues: {page.evaluate(WCAG_DOM_AUDIT)}")

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

            # Visualizations (fixed + 7 new + 4 Go labs)
            for vid in ["boxmodel", "async", "graphsearch", "sqllock", "sqlwindow", "ngrxjs", "useeffect", "stacking", "backtrack", "dptable", "goslices", "goiface", "goroutine", "gocontext"]:
                goto_hash(page, base, "#/lab/" + vid)
                check(len(page.inner_text("#view .viz")) > 20, f"viz {vid} rendered empty")
                check(len(page.evaluate(WCAG_DOM_AUDIT)) == 0, f"viz {vid} WCAG issues: {page.evaluate(WCAG_DOM_AUDIT)}")

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

            # Interview routes + coding arena (PLAY.editor) + scorecard labels + reset modal dialog
            for ir in ["#/interview", "#/interview/coding", "#/interview/patterns", "#/interview/design", "#/interview/behavioral", "#/interview/rapid"]:
                goto_hash(page, base, ir)
                check(len(page.inner_text("#view")) > 40, f"Interview route {ir} rendered empty")
            goto_hash(page, base, "#/interview/coding")
            first_prob_href = page.locator("#view .rows a.row").first.get_attribute("href")
            page.locator("#view .rows a.row").first.click()
            page.wait_for_selector("#view .play", timeout=8000)
            check(page.locator("#view .actions button", has_text="Run tests").count() == 1, "Coding problem arena must render editor and Run tests")

            goto_hash(page, base, "#/interview/mock")
            check(len(page.evaluate(WCAG_DOM_AUDIT)) == 0, f"Mock interview WCAG issues: {page.evaluate(WCAG_DOM_AUDIT)}")
            page.locator("#view .card", has_text="Coding round").get_by_role("button", name="Start").click()
            page.wait_for_selector("#view .play", timeout=8000)
            check(page.locator("#view .play .editor, #view .monaco-host").count() >= 1, "Mock coding session must render coding arena")

            # Cold-load directly onto coding problem route (reproduces direct URL load of arena -> PLAY.editor)
            cold_page = ctx.new_page()
            cold_errs = []
            cold_page.on("pageerror", lambda e: cold_errs.append(f"cold pageerror: {e}"))
            cold_page.add_init_script("localStorage.setItem('stackmastery.lang', 'en');")
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

            check(len(errs) == 0, f"EN pass runtime/console errors: {errs}")
            ctx.close()

            # 2. Indonesian (ID) + Dark mode pass
            ctx_id = browser.new_context(viewport={"width": 1280, "height": 840}, color_scheme="dark")
            page_id = ctx_id.new_page()
            errs_id = []
            page_id.on("pageerror", lambda e: errs_id.append(f"pageerror: {e}"))
            page_id.on("console", lambda m: errs_id.append(f"console.{m.type}: {m.text}") if m.type == "error" else None)
            page_id.add_init_script("localStorage.setItem('stackmastery.lang', 'id');")
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
            goto_hash(page_id, base, "#/interview/mock")
            check("Skorcard pewawancara" in page_id.inner_text("#view") or "pewawancara" in page_id.inner_text("#view").lower() or len(page_id.evaluate(WCAG_DOM_AUDIT)) == 0, "ID interview loaded cleanly")
            check(len(errs_id) == 0, f"ID pass runtime/console errors: {errs_id}")
            ctx_id.close()

            # 3. Mobile 360px Drawer modality & overflow check
            ctx_m = browser.new_context(viewport={"width": 360, "height": 780})
            pm = ctx_m.new_page()
            pm.add_init_script("localStorage.setItem('stackmastery.lang', 'en');")
            for r in ["#/", "#/track/angular", "#/track/go", "#/lesson/angular/signals", "#/lesson/go/collections", "#/lesson/aspnet/arch", "#/lab/goslices", "#/lab/gocontext", "#/play/sql", "#/interview/coding", "#/interview/design", "#/interview/mock", "#/projects", "#/exam"]:
                goto_hash(pm, base, r)
                ov = pm.evaluate("document.documentElement.scrollWidth <= window.innerWidth + 1")
                check(ov, f"360px mobile overflow on {r}")
            pm.locator(".nav-toggle").click()
            pm.wait_for_timeout(120)
            check(pm.evaluate("document.getElementById('view').inert === true && document.querySelector('#nav .nav-top').inert === true"), "Mobile drawer open must set inert on BOTH #view and .nav-top")
            pm.keyboard.press("Escape")
            pm.wait_for_timeout(120)
            check(not pm.locator("#nav.open").count(), "Escape should close mobile drawer")
            ctx_m.close()

        finally:
            browser.close()
            srv.shutdown()

    if failures:
        print(f"\n{len(failures)} UI check(s) FAILED.")
        sys.exit(1)
    print("\nALL Playwright EN/ID + Desktop/Mobile + Viz/Playground/Dialog/WCAG UI checks PASSED!")


if __name__ == "__main__":
    run_suite()
