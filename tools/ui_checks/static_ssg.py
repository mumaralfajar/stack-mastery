"""Static SSG build checks: routes, SEO metadata, JS size budget, PWA manifest and service worker."""
from html.parser import HTMLParser
import json
import re
import struct

from .common import (
    BASE_PATH,
    CURRICULUM_CHUNK_RX,
    DIST,
    EXPECTED_DESIGN_CASES,
    EXPECTED_LESSONS,
    EXPECTED_PROBLEMS,
    EXPECTED_TRACKS,
    EXPECTED_VIZ,
    LANDING_JS_BUDGET,
    SITE,
    VIZ_CHUNK_RX,
)

IMPORT_RX = re.compile(r"""(?:import|export)\s*(?:[\w*{}\s,$]+from\s*)?["'](\.{1,2}/[^"']+)["']""")
CURRICULUM_RX = re.compile(CURRICULUM_CHUNK_RX)
VIZ_RX = re.compile(VIZ_CHUNK_RX)


def page_js_bytes(html_rel):
    """Raw bytes of JS a page loads up front: bundled <script src> files plus their static import graph, plus
    executable inline scripts (JSON and JSON-LD data blocks are not code and are excluded)."""
    html = (DIST / html_rel).read_text(encoding="utf-8")
    srcs = re.findall(r'<script[^>]*\bsrc="([^"]+)"', html)
    inline = [
        body
        for attrs, body in re.findall(r"<script(?![^>]*\bsrc=)([^>]*)>(.*?)</script>", html, re.S)
        if "application/json" not in attrs and "application/ld+json" not in attrs
    ]
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
    for rel in [
        "index.html", "id/index.html", "404.html", "robots.txt", "sitemap-index.xml", "manifest.webmanifest", "sw.js",
        "favicon.svg", "icons/icon-192.png", "icons/icon-512.png", "icons/icon.svg",
        "search-index.json", "id/search-index.json", "quiz-index.json", "id/quiz-index.json",
    ]:
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
        for page in ["dashboard", "start", "search", "review", "exam", "projects", "teach", "notes", "break"]:
            check((DIST / prefix / f"{page}/index.html").is_file(), f"{label}: /{page}/ missing")
    total_lessons = count("lesson/*/*/index.html") + count("id/lesson/*/*/index.html")
    total_plans = count("plan/*/*/index.html") + count("id/plan/*/*/index.html")
    total_labs = count("lab/*/index.html") + count("id/lab/*/index.html")
    total_tracks = count("track/*/index.html") + count("id/track/*/index.html")
    print(f"Static pages: {total_lessons} lessons, {total_plans} plans, {total_labs} labs, {total_tracks} tracks.")
    check(
        total_lessons == 270 and total_plans == 270 and total_labs == 80 and total_tracks == 20,
        "Expected 270 lesson, 270 plan, 80 lab and 20 track pages",
    )

    robots = (DIST / "robots.txt").read_text(encoding="utf-8")
    check("User-agent: *" in robots and f"Sitemap: {SITE}/stack-mastery/sitemap-index.xml" in robots, f"robots.txt must allow all and list the sitemap: {robots!r}")
    sm_index = (DIST / "sitemap-index.xml").read_text(encoding="utf-8")
    check("sitemap-0.xml" in sm_index, "sitemap-index.xml must reference sitemap-0.xml")
    sm = "".join(p.read_text(encoding="utf-8") for p in DIST.glob("sitemap-*.xml") if p.name != "sitemap-index.xml")
    check(f"{SITE}/stack-mastery/lesson/go/concurrency/" in sm and f"{SITE}/stack-mastery/id/lesson/go/concurrency/" in sm, "Sitemap must list EN and ID lesson URLs")
    check('hreflang="id"' in sm, "Sitemap must carry hreflang alternates for EN/ID")
    check("/404" not in sm, "Sitemap must not list the 404 page")

    manifest = json.loads((DIST / "manifest.webmanifest").read_text(encoding="utf-8"))
    for k, v in {"name": "Stack Mastery", "short_name": "Stack Mastery", "start_url": "/stack-mastery/", "scope": "/stack-mastery/", "display": "standalone"}.items():
        check(manifest.get(k) == v, f"manifest.webmanifest {k} must be {v!r}, got {manifest.get(k)!r}")
    check(bool(manifest.get("background_color")) and bool(manifest.get("theme_color")), "manifest needs background_color and theme_color")
    icons = {i["src"]: i for i in manifest.get("icons", [])}
    for src, size in [("/stack-mastery/icons/icon-192.png", (192, 192)), ("/stack-mastery/icons/icon-512.png", (512, 512))]:
        check(src in icons and icons[src].get("type") == "image/png", f"manifest must declare {src} as image/png")
        check(png_size(DIST / src[len(BASE_PATH):]) == size, f"{src} must be a valid {size[0]}x{size[1]} PNG")
    check(any(i.get("type") == "image/svg+xml" for i in icons.values()), "manifest must declare an SVG icon")

    sw = (DIST / "sw.js").read_text(encoding="utf-8")
    check(re.search(r"const VERSION = 'stack-mastery-v\d+'", sw) is not None, "sw.js must use a versioned cache name")
    css_assets = [p.name for p in (DIST / "_astro").glob("*.css")]
    check(any(n.startswith("styles.") for n in css_assets) and not any(n.startswith("icons.") for n in css_assets),
          f"Shared CSS bundle must be named styles.*.css instead of icons.*.css, got {css_assets}")
    for url in [
        "/stack-mastery/", "/stack-mastery/id/", "/stack-mastery/dashboard/", "/stack-mastery/id/dashboard/",
        "/stack-mastery/notes/", "/stack-mastery/id/notes/",
        "/stack-mastery/manifest.webmanifest", "/stack-mastery/favicon.svg", "/stack-mastery/404.html",
    ]:
        check(f"'{url}'" in sw, f"sw.js must precache {url}")

    # Landing performance gate: raw JS referenced by both landing pages stays strictly under 45 KB.
    for rel in ["index.html", "id/index.html"]:
        total, files, inline = page_js_bytes(rel)
        print(f"Landing JS budget {rel}: {total} bytes raw ({len(files)} files + {inline} bytes inline) of {LANDING_JS_BUDGET}.")
        check(total < LANDING_JS_BUDGET, f"{rel} loads {total} raw JS bytes (budget < {LANDING_JS_BUDGET}): {files}")
        check(not any(CURRICULUM_RX.search("/" + f) or VIZ_RX.search("/" + f) for f in files), f"{rel} must not load curriculum or viz chunks: {sorted(files)}")
    # Lesson, lab, dashboard, notes, and search pages must not statically import the curriculum or any lab module.
    for rel in ["lesson/go/concurrency/index.html", "lab/sqllock/index.html", "dashboard/index.html", "notes/index.html", "search/index.html"]:
        _, files, _ = page_js_bytes(rel)
        bad = [f for f in files if CURRICULUM_RX.search("/" + f) or VIZ_RX.search("/" + f)]
        check(not bad, f"{rel} statically imports heavy chunks: {bad}")

    # SEO metadata on sampled EN and ID routes.
    seo_routes = [
        ("", "Course"), ("track/go/", "Course"), ("lesson/go/concurrency/", "LearningResource"),
        ("lab/sqllock/", None), ("interview/design/notification-system/", None), ("play/sql/", None),
    ]
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
            check(
                h.alternates.get("en") == en_url and h.alternates.get("id") == id_url and h.alternates.get("x-default") == en_url,
                f"{where}: hreflang en/id/x-default alternates wrong: {h.alternates}",
            )
            check(bool(h.meta.get("description")) and len(h.title.strip()) > 5, f"{where}: needs a title and meta description")
            check(
                h.meta.get("og:url") == want and h.meta.get("og:locale") == ("id_ID" if lang == "id" else "en_US"),
                f"{where}: Open Graph url/locale wrong: {h.meta.get('og:url')} {h.meta.get('og:locale')}",
            )
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
