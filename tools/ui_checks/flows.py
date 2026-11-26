"""End-to-end browser flows: landing, workspace, break room, labs, search, interview, pedagogy, PWA, ID, mobile."""
import json
from pathlib import Path
import re

from .common import (
    APP_GLOBALS,
    BASE_PATH,
    CURRICULUM_CHUNK_RX,
    EXPECTED_TRACKS,
    EXPECTED_VIZ,
    PAGE_READY,
    VIZ_CHUNK_RX,
    WCAG_DOM_AUDIT,
    goto,
    lang_init,
    watch_errors,
    watch_requests,
)
from .playgrounds import playground_hardening

CURRICULUM_RX = re.compile(CURRICULUM_CHUNK_RX)
VIZ_RX = re.compile(VIZ_CHUNK_RX)


def run_english_pass(browser, base, check):
    ctx = browser.new_context(viewport={"width": 1280, "height": 840}, accept_downloads=True)
    page = ctx.new_page()
    errs = []
    watch_errors(page, errs)
    page.add_init_script(lang_init("en"))

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
    page.reload(wait_until="domcontentloaded")
    page.wait_for_function(PAGE_READY, timeout=10000)
    check(page.locator(".code.hide-hints").count() == 0, "Reloading a predicted lesson must keep code hints unblurred")
    check("Hide hints" in page.inner_text("[data-static-code] [data-hints-toggle]"), "Reloaded predicted lesson hints button must say Hide hints")
    check(page.locator(".viz-eq").count() >= 3, "VIZ.ngsignals should display computed formulas (.viz-eq)")
    check(page.locator("#view a[href='/stack-mastery/plan/angular/signals/']").count() == 1, "Lesson must link to its printable plan")
    check(page.locator("#nav a.nav-link[aria-current='page'][href='/stack-mastery/track/angular/']").count() == 1, "Sidebar must mark the lesson's track as current")
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
        viz_chunks = {m.group(1) for u in lab_reqs if (m := VIZ_RX.search(u.split("?")[0]))}
        heavy = [u for u in lab_reqs if CURRICULUM_RX.search(u.split("?")[0])]
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
        viz_chunks = {m.group(1) for u in reqs if (m := VIZ_RX.search(u.split("?")[0]))}
        heavy = [u for u in reqs if CURRICULUM_RX.search(u.split("?")[0])]
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

    # SQL grading uses an isolated clean snapshot
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
    lang_href = page.locator("#nav a[data-set-lang]").get_attribute("href")
    check(lang_href == BASE_PATH + "id/play/sql/?sample=joins", f"Sidebar ID switch must keep path + query, got {lang_href}")

    # Search uses the pre-built index (no curriculum, interview or viz bundles)
    search_reqs = watch_requests(page)
    goto(page, base, "search/")
    page.locator("#view input[type='search']").fill("Outbox")
    page.wait_for_timeout(80)
    check(page.locator("#view mark").count() >= 1, "Search should highlight matches using <mark>")
    check(page.locator("#view a.row.hit").first.get_attribute("href").startswith(BASE_PATH), "Search hits must link to static pages")
    heavy = [u for u in search_reqs if CURRICULUM_RX.search(u.split("?")[0]) or VIZ_RX.search(u.split("?")[0])]
    check(not heavy and any(u.endswith("/search-index.json") for u in search_reqs), f"Search must fetch only the pre-built index, also loaded: {heavy}")
    for entity_q in ["lt", "amp"]:
        page.locator("#view input[type='search']").fill(entity_q)
        page.wait_for_timeout(80)
        hits_html = page.locator("#view .rows").inner_html()
        check(f"&<mark>{entity_q}</mark>;" not in hits_html.lower() and "&<mark>" not in hits_html.lower(), f"Search markText corrupted HTML entities for query {entity_q!r}")

    # Interview routes + coding arena + System Design cases + rapid-fire
    for ir in [
        "interview/", "interview/coding/", "interview/patterns/", "interview/design/", "interview/design/notification-system/",
        "interview/design/search-autocomplete/", "interview/behavioral/", "interview/rapid/",
    ]:
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

    # Quiz-index isolation
    q_reqs = watch_requests(page)
    for qpath in ["review/", "exam/", "id/review/", "id/exam/"]:
        start_idx = len(q_reqs)
        goto(page, base, qpath)
        seen_q = q_reqs[start_idx:]
        heavy_q = [u for u in seen_q if CURRICULUM_RX.search(u.split("?")[0])]
        check(not heavy_q and any(u.endswith("/quiz-index.json") for u in seen_q), f"/{qpath} must fetch quiz-index.json without curriculum chunks, got reqs={seen_q}")

    # Phase 6 Pedagogy: Goal onboarding, Beginner placement, SM-2 SRS, Mock Exam, Teach-Back & /notes/
    goto(page, base, "dashboard/")
    page.locator("#view [data-goal='interview']").click()
    check(page.locator("#view [data-goal='interview']").get_attribute("aria-pressed") == "true", "Selecting Interview Crunch goal must set aria-pressed=true")
    check(page.locator("#view [data-track-grid] .track-card").count() == EXPECTED_TRACKS, "Goal selection must keep all 10 tracks visible")
    check(page.locator("#view [data-track-grid] .track-card").first.get_attribute("data-track-card") == "cs", "Interview Crunch must prioritize CS Fundamentals first")
    check(page.locator("#view .goal-badge", has_text="Recommended for your goal").count() == 3, "Interview Crunch must badge its 3 recommended tracks")
    check(page.locator("#view [data-interview-cta] .goal-badge", has_text="Priority for Interview Crunch").count() == 1, "Interview Crunch must elevate Interview prep card with priority badge")
    interview_before_tracks = page.evaluate("""() => {
      const iv = document.querySelector('#view [data-interview-cta]');
      const grid = document.querySelector('#view [data-track-grid]');
      return Boolean(iv && grid && (iv.compareDocumentPosition(grid) & Node.DOCUMENT_POSITION_FOLLOWING));
    }""")
    check(interview_before_tracks, "Interview Crunch must elevate Interview prep section above Tracks grid")
    page.reload(wait_until="domcontentloaded")
    page.wait_for_function(PAGE_READY, timeout=10000)
    check(page.locator("#view [data-goal='interview']").get_attribute("aria-pressed") == "true", "Selected goal must persist across reload")
    goto(page, base, "start/")
    check(page.locator("#view [data-goal='interview']").get_attribute("aria-pressed") == "true", "/start/ must reflect saved goal from /dashboard/")
    page.locator("#view [data-goal='backend']").click()
    check("Backend Engineer" in page.inner_text("#view [data-goal-summary]"), "Switching goal on /start/ must update summary")
    goto(page, base, "dashboard/")
    check(page.locator("#view [data-goal='backend']").get_attribute("aria-pressed") == "true", "Goal selected on /start/ must persist on /dashboard/")
    check(page.locator("#view [data-track-grid] .track-card").first.get_attribute("data-track-card") == "csharp", "Backend Engineer goal must prioritize C# first")
    page.locator("#view [data-goal-clear]").click()
    check(page.locator("#view [data-goal-clear]").count() == 0, "Clear goal must remove active goal")

    # Per-track Beginner placement ("Test out of Beginner") on /track/go/
    goto(page, base, "track/go/")
    check(page.locator("#view [data-placement-open]").count() == 1, "/track/go/ must render Test out of Beginner button")
    page.locator("#view [data-placement-open]").click()
    page.wait_for_selector("#placement-panel fieldset.placement-q", timeout=5000)
    q_count = page.locator("#placement-panel fieldset.placement-q").count()
    check(5 <= q_count <= 6, f"Beginner placement quiz must sample 5-6 questions, got {q_count}")
    page.evaluate("""() => {
      const data = JSON.parse(document.getElementById('track-placement-data').textContent);
      const byQ = new Map();
      for (const bl of data.beginnerLessons) for (const q of bl.quiz) byQ.set(q.q, q.a[q.c]);
      const strip = (s) => s.replace(/`([^`]+)`/g, '$1').replace(/\\*\\*([^*]+)\\*\\*/g, '$1').trim();
      const answerMap = new Map([...byQ.entries()].map(([k, v]) => [strip(k), strip(v)]));
      for (const fs of document.querySelectorAll('#placement-panel fieldset.placement-q')) {
        const legendText = fs.querySelector('legend span')?.textContent?.trim() || '';
        const want = answerMap.get(legendText);
        for (const lbl of fs.querySelectorAll('label.placement-opt')) {
          if (lbl.querySelector('span')?.textContent?.trim() === want) {
            const r = lbl.querySelector('input[type=radio]');
            r.checked = true;
            r.dispatchEvent(new Event('change'));
            break;
          }
        }
      }
    }""")
    page.locator("#placement-panel [data-placement-submit]").click()
    check("100%" in page.inner_text("#placement-panel .placement-summary"), "Submitting all right answers must show 100% placement score")
    check(page.locator("#placement-panel .fb.good").count() == q_count, "Placement submit must grade each question with explanation feedback")
    page.locator("#placement-panel [data-placement-apply]").click()
    page.locator("dialog.sm-dialog[open] button[value='ok']").click()
    page.wait_for_timeout(120)
    check(page.inner_text("#view [data-level-pct='0']") == "67%", f"Testing out of Beginner must mark Learn+Check (67%), got {page.inner_text('#view [data-level-pct=\"0\"]')}")
    go_beg_state = page.evaluate("""() => {
      const s = JSON.parse(localStorage.getItem('stackmastery.v1') || '{}');
      return ['go/types', 'go/collections', 'go/structs'].map(k => ({ k, r: !!s.lessons?.[k]?.read, q: !!s.lessons?.[k]?.quiz, t: !!s.lessons?.[k]?.teach }));
    }""")
    check(all(x["r"] and x["q"] and not x["t"] for x in go_beg_state), f"Placement pass must set read+quiz and keep teach=false: {go_beg_state}")
    check(page.locator("#view a.row[data-k='go/types'] .dots i.on").count() == 2, "Track lesson dots must redraw immediately with 2 lit dots")

    # Adaptive SM-2 Spaced Repetition: legacy #index -> #slug migration, >16d growth, 4 buttons, Space & 1-4 shortcuts, >20 pagination
    page.evaluate("""() => {
      const s = JSON.parse(localStorage.getItem('stackmastery.v1') || '{}');
      s.lessons = {};
      s.cards = { 'csharp/types#0': { box: 5, due: '2020-01-01' } };
      localStorage.setItem('stackmastery.v1', JSON.stringify(s));
    }""")
    goto(page, base, "review/")
    check(page.locator("#view .flash [data-reveal]").count() == 1, "/review/ must show Show answer button for due card")
    page.keyboard.press("Space")
    page.wait_for_timeout(80)
    check(page.locator("#view .fc-grades button[data-grade]").count() == 4, "Space must reveal answer with 4 SM-2 grade buttons")
    good_txt = page.inner_text("#view .fc-grades button[data-grade='good']")
    check("40d" in good_txt, f"Legacy box=5 card must migrate and schedule past 16d (40d), got {good_txt!r}")
    page.keyboard.press("3")
    page.wait_for_timeout(100)
    cards_after = page.evaluate("() => JSON.parse(localStorage.getItem('stackmastery.v1') || '{}').cards || {}")
    migrated_keys = [k for k in cards_after if k.startswith("csharp/types#") and k != "csharp/types#0"]
    card_after = cards_after.get(migrated_keys[0]) if migrated_keys else None
    check(
        "csharp/types#0" not in cards_after and len(migrated_keys) == 1 and card_after and card_after.get("interval", 0) == 40 and card_after.get("reps") == 6,
        f"Key '3' (Good) must migrate legacy #0 key to stable quizId and schedule >16d, got {cards_after}",
    )
    page.evaluate("""() => {
      const s = JSON.parse(localStorage.getItem('stackmastery.v1') || '{}');
      s.lessons = {};
      const cards = {};
      const keys = ['csharp/types','csharp/flow','csharp/classes','csharp/memory','csharp/interfaces','csharp/generics','csharp/errors','csharp/linq'];
      let n = 0;
      for (const k of keys) {
        for (let i = 0; i < 3 && n < 22; i++, n++) {
          cards[k + '#' + i] = { interval: 1, ease: 2.5, reps: 0, lapses: 0, due: '2020-01-01' };
        }
      }
      s.cards = cards;
      localStorage.setItem('stackmastery.v1', JSON.stringify(s));
    }""")
    goto(page, base, "review/")
    for _ in range(20):
        page.keyboard.press("Space")
        page.keyboard.press("3")
    page.wait_for_timeout(100)
    check(page.locator("#view [data-continue-due]").count() == 1, "After 20 cards with 2 left, 'Continue next 20 due' button must appear")
    page.locator("#view [data-continue-due]").click()
    page.wait_for_timeout(80)
    check("1 / 2" in page.inner_text("#view .flash .eyebrow"), "Continue next 20 due must load remaining 2 due cards")

    # Mock Exam: missed questions route to S.cards + examHistory persists & renders
    page.evaluate("""() => {
      const s = JSON.parse(localStorage.getItem('stackmastery.v1') || '{}');
      s.lessons = {}; s.cards = {}; s.examHistory = [];
      localStorage.setItem('stackmastery.v1', JSON.stringify(s));
    }""")
    goto(page, base, "exam/")
    check("No mock exams completed yet." in page.inner_text("#view"), "Exam history must show empty note initially")
    page.locator("#view .actions select").nth(0).select_option("go")
    page.locator("#view .actions select").nth(1).select_option("0")
    page.locator("#view .actions button", has_text="Start exam").click()
    exam_qs = page.locator("#view .exam-q")
    exam_total = exam_qs.count()
    check(exam_total >= 5, f"Go Beginner mock exam must render questions, got {exam_total}")
    for qi in range(exam_total):
        exam_qs.nth(qi).locator(".opt").first.click()
    page.wait_for_timeout(100)
    exam_state = page.evaluate("""() => {
      const s = JSON.parse(localStorage.getItem('stackmastery.v1') || '{}');
      const today = new Date().toLocaleDateString('sv');
      return { history: s.examHistory || [], cards: s.cards || {}, today };
    }""")
    check(len(exam_state["history"]) == 1 and exam_state["history"][0]["track"] == "go" and exam_state["history"][0]["total"] == exam_total, f"Completed Mock exam must persist attempt in examHistory: {exam_state['history']}")
    misses = exam_total - exam_state["history"][0]["score"]
    if misses > 0:
        check(len(exam_state["cards"]) == misses and all(c["due"] == exam_state["today"] and c["lapses"] >= 1 for c in exam_state["cards"].values()), f"Missed Mock exam questions must enter S.cards due today: {exam_state['cards']}")
    check(page.locator("#view table.t tbody tr").count() == 1, "Exam history table must render the completed attempt")

    # Teach-Back word count coaching + /notes/ empty state, search, track filter & Markdown export
    page.evaluate("""() => {
      const s = JSON.parse(localStorage.getItem('stackmastery.v1') || '{}');
      s.lessons = {}; s.cards = {};
      localStorage.setItem('stackmastery.v1', JSON.stringify(s));
    }""")
    goto(page, base, "notes/")
    check("No study notes yet." in page.inner_text("#view"), "/notes/ must show empty state when no Teach-Back notes exist")
    check(page.locator("#view [data-notes-export]").is_disabled(), "Export Markdown button must be disabled when no notes exist")
    goto(page, base, "lesson/csharp/types/")
    check("0 words" in page.inner_text("#view [data-teach-count]"), "Lesson Teach-Back must show initial 0-word hint")
    page.locator("#view [data-teach-notes]").fill("Value types live inline.")
    check("4 words" in page.inner_text("#view [data-teach-count]"), "Lesson Teach-Back must update word count live")
    page.locator(".rubric input[type='checkbox']").first.click()
    check(page.locator(".rubric input[type='checkbox']").first.is_checked(), "Short valid Teach-Back note must not be blocked from checking rubric")
    page.locator("#view [data-teach-notes]").fill("Value types like int and struct copy their data directly while reference types like class store a pointer to the heap so mutations are shared.")
    check("ready for rubric" in page.inner_text("#view [data-teach-count]"), "15+ word Teach-Back note must flip hint to ready for rubric")
    page.evaluate("""() => {
      const s = JSON.parse(localStorage.getItem('stackmastery.v1') || '{}');
      s.lessons = s.lessons || {};
      s.lessons['go/types'] = { notes: 'Go zero values make uninitialized structs predictable and safe.', rubric: [true, true, false, false, false] };
      localStorage.setItem('stackmastery.v1', JSON.stringify(s));
    }""")
    goto(page, base, "notes/")
    check(page.locator("#view article.note-card").count() == 2, "/notes/ must list both saved Teach-Back notes")
    page.locator("#notes-track").select_option("go")
    check(page.locator("#view article.note-card").count() == 1 and page.locator("#view article.note-card[data-note-key='go/types']").count() == 1, "/notes/ track filter must narrow to Go")
    page.locator("#notes-track").select_option("")
    page.locator("#notes-search").fill("pointer")
    check(page.locator("#view article.note-card").count() == 1 and page.locator("#view article.note-card[data-note-key='csharp/types']").count() == 1, "/notes/ search must filter by note body")
    with page.expect_download() as md_dl:
        page.locator("#view [data-notes-export]").click()
    md_text = Path(md_dl.value.path()).read_text(encoding="utf-8")
    check("# Stack Mastery Study Guide" in md_text and "Value types like int" in md_text and "Go zero values" in md_text, "Exported Markdown Study Guide must contain heading and saved Teach-Back notes")
    check(len(page.evaluate(WCAG_DOM_AUDIT)) == 0, f"/notes/ WCAG issues: {page.evaluate(WCAG_DOM_AUDIT)}")
    page.evaluate("() => { localStorage.removeItem('stackmastery.v1'); }")

    goto(page, base, "interview/mock/")
    check(len(page.evaluate(WCAG_DOM_AUDIT)) == 0, f"Mock interview WCAG issues: {page.evaluate(WCAG_DOM_AUDIT)}")
    page.locator("#view .card", has_text="Coding round").get_by_role("button", name="Start").click()
    page.wait_for_selector("#view .play", timeout=10000)
    check(page.locator("#view .play .editor, #view .monaco-host").count() >= 1, "Mock coding session must render coding arena")

    # Cold-load directly onto a coding problem page.
    cold_page = ctx.new_page()
    cold_errs = []
    watch_errors(cold_page, cold_errs, "cold ")
    cold_page.goto(base[:-len(BASE_PATH)] + first_prob_href, wait_until="domcontentloaded")
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

    # Export backup
    with page.expect_download() as dl_info:
        page.locator("#nav .nav-foot button", has_text="Export backup").click()
    backup = json.loads(Path(dl_info.value.path()).read_text(encoding="utf-8"))
    check(backup.get("keys", {}).get("stackmastery.lang") == "en", f"Backup must include stackmastery.lang='en', got keys {list(backup.get('keys', {}))}")
    check("stackmastery.v1" in backup.get("keys", {}), "Backup must include stackmastery.v1 progress")
    check("stackmastery.study" in backup.get("keys", {}), "Backup must include stackmastery.study Pomodoro session state")

    # Legacy #/... bookmarks redirect to their static pages.
    for legacy, target in [
        ("#/lesson/go/concurrency", "lesson/go/concurrency/"),
        ("#/play/sql/joins", "play/sql/?sample=joins"),
        ("#/meadow", "break/"),
        ("#/notes", "notes/"),
        ("#/interview/problem/two-sum", "interview/problem/two-sum/"),
        ("#/lab/syshash", "lab/syshash/"),
        ("#/dashboard", "dashboard/"),
        ("#/plan/go/types", "plan/go/types/"),
    ]:
        page.goto(base + legacy, wait_until="domcontentloaded")
        page.wait_for_url(base + target, timeout=10000)
        check(page.url == base + target, f"Legacy {legacy} must redirect to {base + target}, got {page.url}")
    goto(page, base, "")
    check(page.url == base and page.locator(".lp-root").count() == 1, "Plain /stack-mastery/ must stay on the English landing page")

    check(len(errs) == 0, f"EN pass runtime/console errors: {errs}")
    ctx.close()


def run_legacy_and_pwa_pass(browser, base, check):
    ctx_pref = browser.new_context(viewport={"width": 1280, "height": 840})
    pp = ctx_pref.new_page()
    pp.add_init_script(lang_init("id"))
    pp.goto(base + "#/lab", wait_until="domcontentloaded")
    pp.wait_for_url(base + "id/lab/", timeout=10000)
    check(pp.url == base + "id/lab/", f"Legacy #/lab with saved ID preference must open /id/lab/, got {pp.url}")
    pp.goto(base + "#/lesson/go/concurrency", wait_until="domcontentloaded")
    pp.wait_for_url(base + "id/lesson/go/concurrency/", timeout=10000)
    pp.goto(base + "#/", wait_until="domcontentloaded")
    pp.wait_for_url(base + "id/", timeout=10000)
    check(pp.url == base + "id/", f"Legacy bare #/ with saved ID preference must redirect to /id/, got {pp.url}")
    goto(pp, base, "")
    check(pp.url == base and pp.evaluate("document.documentElement.lang") == "en", "Visiting / directly must keep English even with an ID preference")
    nf = pp.goto(base + "no-such-page/", wait_until="domcontentloaded")
    check(
        nf.status == 404 and pp.locator("a[href='/stack-mastery/']").count() >= 1 and pp.locator("a[href='/stack-mastery/id/']").count() >= 1,
        "404 page must return 404 and link to / and /id/",
    )
    ctx_pref.close()

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
    pw.goto(base + "dashboard/", wait_until="domcontentloaded")
    check(pw.locator("#nav").count() == 1 and pw.locator("#view h1").count() == 1, "Precached /dashboard/ shell must render offline")
    ctx_pwa.set_offline(False)
    ctx_pwa.close()


def run_id_dark_pass(browser, base, check):
    ctx_id = browser.new_context(viewport={"width": 1280, "height": 840}, color_scheme="dark")
    page_id = ctx_id.new_page()
    errs_id = []
    watch_errors(page_id, errs_id)
    page_id.add_init_script(lang_init("id"))
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
    check(
        "Sudah ditebak" in page_id.inner_text(".predict-card")
        or "Benar" in page_id.inner_text(".predict-card")
        or "Belum tepat" in page_id.inner_text(".predict-card"),
        "Indonesian predict feedback must be translated",
    )
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
    check(page_id.locator("#view a.row.hit").count() >= 1 and page_id.locator("#view a.row.hit").first.get_attribute("href").startswith(BASE_PATH + "id/"), "Indonesian search must return hits linking to /id/ pages")
    goto(page_id, base, "id/play/ts/")
    ts_chips = page_id.inner_text("#view .chips")
    check("Method array" in ts_chips and "Komponen React" in ts_chips and "Generics" not in ts_chips, f"Indonesian TS playground chips must be translated, got: {ts_chips}")
    check(page_id.locator("#view .chips button[data-k='Generics']").count() == 1, "Translated TS chips must keep English data-k lookup keys")
    page_id.locator("#view .chips button", has_text="Komponen React").click()
    check(page_id.locator("#view .chips button.on[data-k='React component']").count() == 1, "Clicking a translated chip must select its example")
    page_id.wait_for_timeout(1200)
    goto(page_id, base, "id/play/css/")
    css_chips = page_id.inner_text("#view .chips")
    check("Navbar flexbox" in css_chips and "Grid responsif" in css_chips and "Kartu Tailwind" in css_chips, f"Indonesian CSS playground chips must be translated, got: {css_chips}")
    goto(page_id, base, "id/play/dart/")
    check(page_id.locator("#view .chips button").count() >= 3, "Indonesian Dart playground must list lesson samples")
    goto(page_id, base, "id/notes/")
    check("Catatan belajarku" in page_id.inner_text("#view h1"), "Indonesian /id/notes/ must translate page heading")
    check(len(errs_id) == 0, f"ID pass runtime/console errors: {errs_id}")
    ctx_id.close()


def run_mobile_pass(browser, base, check):
    ctx_m = browser.new_context(viewport={"width": 360, "height": 780})
    pm = ctx_m.new_page()
    pm.add_init_script(lang_init("en"))
    for r in [
        "", "break/", "dashboard/", "track/angular/", "track/go/", "track/sysdesign/", "lesson/angular/signals/", "lesson/go/collections/",
        "lesson/sysdesign/caching/", "lesson/aspnet/arch/", "lab/goslices/", "lab/gocontext/", "lab/syscache/", "lab/sysratelimit/",
        "lab/sysdbscale/", "lab/syshash/", "lab/sysqueue/", "lab/sysresilience/", "play/sql/", "play/ts/", "play/css/", "play/dart/",
        "interview/coding/", "interview/design/", "interview/design/notification-system/", "interview/mock/", "projects/", "exam/",
        "review/", "notes/", "start/", "teach/", "search/", "plan/go/types/", "id/", "id/notes/", "id/lesson/go/concurrency/",
    ]:
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
