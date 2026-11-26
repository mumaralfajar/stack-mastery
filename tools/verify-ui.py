"""End-to-end verification of the built static site in dist/.

Usage: bun run build && python -u tools/verify-ui.py
"""
import sys
from playwright.sync_api import sync_playwright

from ui_checks.a11y import run_axe_matrix
from ui_checks.common import launch_browser, start_server
from ui_checks.flows import run_english_pass, run_id_dark_pass, run_legacy_and_pwa_pass, run_mobile_pass
from ui_checks.static_ssg import static_checks


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
            run_english_pass(browser, base, check)
            run_legacy_and_pwa_pass(browser, base, check)
            run_id_dark_pass(browser, base, check)
            run_mobile_pass(browser, base, check)
            run_axe_matrix(browser, base, check)
        finally:
            browser.close()
            srv.shutdown()

    if failures:
        print(f"\n{len(failures)} of {checks[0]} UI check(s) FAILED.")
        sys.exit(1)
    print(f"\n{checks[0]} checks: ALL static SSG + JS budget + SEO + PWA + EN/ID + Desktop/Mobile + Viz/Playground/Dialog/WCAG checks PASSED!")


if __name__ == "__main__":
    run_suite()
