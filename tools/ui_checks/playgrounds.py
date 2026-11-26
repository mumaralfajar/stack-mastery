"""Playground hardening checks: SRI, live theme sync, srcdoc sanitizing, offline fallbacks, external links, cleanups."""
import base64
import hashlib
import json
import re

from .common import APP_GLOBALS, goto, lang_init, watch_errors

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
    check(
        a.count() == 1 and a.get_attribute("href") == "https://stackblitz.com/" and a.get_attribute("target") == "_blank" and a.get_attribute("rel") == "noopener noreferrer",
        "TypeScript playground must link StackBlitz with target=_blank rel='noopener noreferrer'",
    )
    pg.wait_for_timeout(1000)
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
    pg.evaluate(SET_EDITOR, [1, 'body { color: red; }}</style><div id="injected">x</div>'])
    pg.wait_for_timeout(700)
    srcdoc = pg.evaluate("document.querySelector('#view iframe.preview').srcdoc")
    check("</style><div" not in srcdoc and srcdoc.count("</style>") == 1, "CSS preview must not let a user </style close the style element")
    frame = pg.frame_locator("#view iframe.preview")
    check(frame.locator("#injected").count() == 0, "CSS '</style><div id=injected>' must not create #injected in the preview DOM")
    pg.evaluate(SET_EDITOR, [1, '</STYLE ><div id="injected">x</div>'])
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
    for path, key, href in [
        ("lesson/go/types/", "go", "https://go.dev/play/"),
        ("lesson/csharp/types/", "csharp", "https://sharplab.io/"),
        ("lesson/angular/signals/", "stackblitz", "https://stackblitz.com/"),
    ]:
        goto(pg, base, path)
        a = pg.locator(f"#view a[data-sandbox='{key}']")
        check(
            a.count() == 1 and a.get_attribute("href") == href and a.get_attribute("target") == "_blank" and a.get_attribute("rel") == "noopener noreferrer",
            f"/{path} must link {href} with target=_blank rel='noopener noreferrer'",
        )
    goto(page=pg, base=base, path="lesson/sql/select/")
    check(pg.locator("#view a[data-sandbox]").count() == 0, "SQL lessons keep using the built-in playground only")
    cx.close()
