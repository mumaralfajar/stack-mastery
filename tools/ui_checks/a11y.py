"""axe-core WCAG 2.2 AA matrix across EN/ID, light/dark, and desktop/mobile."""
from .common import AXE_ROUTES, axe_violations, goto, lang_init


def run_axe_matrix(browser, base, check):
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
