// Lightweight curriculum & interview manifest (zero lesson prose).
import type { InterviewTotals, LessonIndexEntry, TrackMeta } from '../lib/types.ts';

export const LEVELS_EN: readonly [string, string, string, string] = [
  'Beginner',
  'Intermediate',
  'Advanced',
  'Expert',
];

export const LEVELS_ID: readonly [string, string, string, string] = [
  'Pemula',
  'Menengah',
  'Mahir',
  'Expert',
];

export const TRACK_META: readonly TrackMeta[] = [
  {
    "id": "csharp",
    "name": "C#",
    "lang": "cs",
    "tagline": "The language: from types and classes to async, memory, and performance.",
    "taglineId": "Bahasanya: mulai dari tipe data dan class sampai async, memori, dan performa.",
    "lessonCount": 14
  },
  {
    "id": "cs",
    "name": "CS Fundamentals",
    "lang": "cs",
    "tagline": "The foundations: Git, complexity, data structures, and algorithms behind coding interviews and everyday performance.",
    "taglineId": "Fondasinya: Git, complexity, data structure, dan algoritma di balik coding interview serta keputusan performa sehari-hari.",
    "lessonCount": 10
  },
  {
    "id": "sql",
    "name": "SQL",
    "lang": "sql",
    "tagline": "Data in SQL Server: querying, schema design, indexing, transactions, and tuning.",
    "taglineId": "Data di SQL Server: query, desain skema, indexing, transaksi, dan tuning.",
    "lessonCount": 12
  },
  {
    "id": "aspnet",
    "name": "ASP.NET Core",
    "lang": "cs",
    "tagline": "The backend: HTTP, APIs, dependency injection, EF Core, security, and production.",
    "taglineId": "Backend-nya: HTTP, API, dependency injection, EF Core, security, dan production.",
    "lessonCount": 14
  },
  {
    "id": "css",
    "name": "CSS + Tailwind",
    "lang": "css",
    "tagline": "Visual styling: the cascade, layout systems, responsive design, and Tailwind CSS.",
    "taglineId": "Tampilannya: cascade, layout, desain responsif, dan Tailwind CSS.",
    "lessonCount": 13
  },
  {
    "id": "react",
    "name": "TypeScript + React",
    "lang": "tsx",
    "tagline": "The frontend: modern JavaScript, the type system, components, state and architecture.",
    "taglineId": "Bagian frontend: JavaScript modern, type system, komponen, state, dan arsitektur.",
    "lessonCount": 14
  },
  {
    "id": "angular",
    "name": "Angular",
    "lang": "ts",
    "tagline": "Typed frontend apps with components, Signals, dependency injection, Signal Forms, HTTP, and SSR.",
    "taglineId": "Framework frontend lengkap: component, Signal, dependency injection, Signal Forms, HTTP, hingga SSR.",
    "lessonCount": 14
  },
  {
    "id": "flutter",
    "name": "Dart + Flutter",
    "lang": "dart",
    "tagline": "Mobile apps from scratch: Dart, widgets, Bloc state management, testing, and shipping to real devices.",
    "taglineId": "Aplikasi mobile-nya: bahasa Dart, widget, state dengan Bloc, testing, sampai rilis ke HP sungguhan.",
    "lessonCount": 14
  },
  {
    "id": "go",
    "name": "Go",
    "lang": "go",
    "tagline": "Typed, concurrent backend services in Go: slices, interfaces, errors, net/http, json/v2, goroutines, context, SQL, and pprof.",
    "taglineId": "Layanan backend Go yang bertipe jelas dan konkuren: slice, interface, error, net/http, json/v2, goroutine, context, SQL, dan pprof.",
    "lessonCount": 14
  },
  {
    "id": "sysdesign",
    "name": "System Design",
    "lang": "go",
    "tagline": "Architecture, caching, rate limiting, storage engines, sharding, queues, resilience, observability, and tool selection for scale.",
    "taglineId": "Arsitektur, caching, rate limiting, mesin penyimpanan, sharding, antrean pesan, ketahanan sistem, observabilitas, dan pemilihan tools berskala besar.",
    "lessonCount": 16
  }
];

export const LESSON_INDEX: readonly LessonIndexEntry[] = [
  {
    "trackId": "csharp",
    "id": "types",
    "level": 0,
    "mins": 25,
    "quizCount": 3
  },
  {
    "trackId": "csharp",
    "id": "flow",
    "level": 0,
    "mins": 30,
    "quizCount": 3
  },
  {
    "trackId": "csharp",
    "id": "classes",
    "level": 0,
    "mins": 35,
    "quizCount": 3
  },
  {
    "trackId": "csharp",
    "id": "memory",
    "level": 1,
    "mins": 30,
    "viz": "stackheap",
    "quizCount": 3
  },
  {
    "trackId": "csharp",
    "id": "interfaces",
    "level": 1,
    "mins": 35,
    "quizCount": 3
  },
  {
    "trackId": "csharp",
    "id": "generics",
    "level": 1,
    "mins": 30,
    "quizCount": 3
  },
  {
    "trackId": "csharp",
    "id": "errors",
    "level": 1,
    "mins": 30,
    "quizCount": 4
  },
  {
    "trackId": "csharp",
    "id": "linq",
    "level": 1,
    "mins": 35,
    "viz": "linq",
    "quizCount": 3
  },
  {
    "trackId": "csharp",
    "id": "delegates",
    "level": 2,
    "mins": 30,
    "quizCount": 3
  },
  {
    "trackId": "csharp",
    "id": "async",
    "level": 2,
    "mins": 40,
    "viz": "async",
    "quizCount": 4
  },
  {
    "trackId": "csharp",
    "id": "modern",
    "level": 2,
    "mins": 30,
    "quizCount": 3
  },
  {
    "trackId": "csharp",
    "id": "gc",
    "level": 3,
    "mins": 40,
    "quizCount": 3
  },
  {
    "trackId": "csharp",
    "id": "concurrency",
    "level": 3,
    "mins": 40,
    "quizCount": 3
  },
  {
    "trackId": "csharp",
    "id": "internals",
    "level": 3,
    "mins": 35,
    "quizCount": 3
  },
  {
    "trackId": "cs",
    "id": "git",
    "level": 0,
    "mins": 30,
    "quizCount": 3
  },
  {
    "trackId": "cs",
    "id": "bigo",
    "level": 0,
    "mins": 30,
    "viz": "bigo",
    "quizCount": 3
  },
  {
    "trackId": "cs",
    "id": "numbers",
    "level": 0,
    "mins": 30,
    "quizCount": 3
  },
  {
    "trackId": "cs",
    "id": "structures",
    "level": 1,
    "mins": 40,
    "quizCount": 3
  },
  {
    "trackId": "cs",
    "id": "sorting",
    "level": 1,
    "mins": 40,
    "viz": "sort",
    "quizCount": 3
  },
  {
    "trackId": "cs",
    "id": "trees",
    "level": 2,
    "mins": 40,
    "quizCount": 3
  },
  {
    "trackId": "cs",
    "id": "graphs",
    "level": 2,
    "mins": 40,
    "viz": "graphsearch",
    "quizCount": 4
  },
  {
    "trackId": "cs",
    "id": "backtracking",
    "level": 2,
    "mins": 35,
    "viz": "backtrack",
    "quizCount": 3
  },
  {
    "trackId": "cs",
    "id": "dp",
    "level": 3,
    "mins": 45,
    "viz": "dptable",
    "quizCount": 3
  },
  {
    "trackId": "cs",
    "id": "concurrency",
    "level": 3,
    "mins": 40,
    "quizCount": 3
  },
  {
    "trackId": "sql",
    "id": "select",
    "level": 0,
    "mins": 25,
    "quizCount": 4
  },
  {
    "trackId": "sql",
    "id": "dml",
    "level": 0,
    "mins": 25,
    "quizCount": 3
  },
  {
    "trackId": "sql",
    "id": "aggregate",
    "level": 0,
    "mins": 35,
    "viz": "sqlorder",
    "quizCount": 4
  },
  {
    "trackId": "sql",
    "id": "joins",
    "level": 1,
    "mins": 35,
    "viz": "joins",
    "quizCount": 3
  },
  {
    "trackId": "sql",
    "id": "subqueries",
    "level": 1,
    "mins": 30,
    "quizCount": 3
  },
  {
    "trackId": "sql",
    "id": "design",
    "level": 1,
    "mins": 40,
    "quizCount": 4
  },
  {
    "trackId": "sql",
    "id": "indexes",
    "level": 2,
    "mins": 40,
    "viz": "index",
    "quizCount": 3
  },
  {
    "trackId": "sql",
    "id": "transactions",
    "level": 2,
    "mins": 40,
    "quizCount": 3
  },
  {
    "trackId": "sql",
    "id": "window",
    "level": 2,
    "mins": 35,
    "viz": "sqlwindow",
    "quizCount": 3
  },
  {
    "trackId": "sql",
    "id": "plans",
    "level": 3,
    "mins": 45,
    "quizCount": 3
  },
  {
    "trackId": "sql",
    "id": "locking",
    "level": 3,
    "mins": 40,
    "viz": "sqllock",
    "quizCount": 4
  },
  {
    "trackId": "sql",
    "id": "scale",
    "level": 3,
    "mins": 45,
    "quizCount": 3
  },
  {
    "trackId": "aspnet",
    "id": "http",
    "level": 0,
    "mins": 25,
    "viz": "journey",
    "quizCount": 3
  },
  {
    "trackId": "aspnet",
    "id": "anatomy",
    "level": 0,
    "mins": 25,
    "quizCount": 3
  },
  {
    "trackId": "aspnet",
    "id": "routing",
    "level": 0,
    "mins": 35,
    "quizCount": 3
  },
  {
    "trackId": "aspnet",
    "id": "middleware",
    "level": 1,
    "mins": 30,
    "viz": "middleware",
    "quizCount": 3
  },
  {
    "trackId": "aspnet",
    "id": "di",
    "level": 1,
    "mins": 35,
    "viz": "di",
    "quizCount": 3
  },
  {
    "trackId": "aspnet",
    "id": "efcore",
    "level": 1,
    "mins": 40,
    "quizCount": 3
  },
  {
    "trackId": "aspnet",
    "id": "validation",
    "level": 1,
    "mins": 30,
    "quizCount": 3
  },
  {
    "trackId": "aspnet",
    "id": "auth",
    "level": 2,
    "mins": 45,
    "quizCount": 3
  },
  {
    "trackId": "aspnet",
    "id": "config",
    "level": 2,
    "mins": 30,
    "quizCount": 3
  },
  {
    "trackId": "aspnet",
    "id": "testing",
    "level": 2,
    "mins": 40,
    "quizCount": 3
  },
  {
    "trackId": "aspnet",
    "id": "efadv",
    "level": 2,
    "mins": 40,
    "quizCount": 3
  },
  {
    "trackId": "aspnet",
    "id": "perf",
    "level": 3,
    "mins": 40,
    "quizCount": 4
  },
  {
    "trackId": "aspnet",
    "id": "arch",
    "level": 3,
    "mins": 45,
    "quizCount": 4
  },
  {
    "trackId": "aspnet",
    "id": "prod",
    "level": 3,
    "mins": 45,
    "quizCount": 3
  },
  {
    "trackId": "css",
    "id": "html",
    "level": 0,
    "mins": 30,
    "quizCount": 3
  },
  {
    "trackId": "css",
    "id": "cascade",
    "level": 0,
    "mins": 30,
    "viz": "specificity",
    "quizCount": 4
  },
  {
    "trackId": "css",
    "id": "box",
    "level": 0,
    "mins": 25,
    "viz": "boxmodel",
    "quizCount": 3
  },
  {
    "trackId": "css",
    "id": "units",
    "level": 0,
    "mins": 25,
    "quizCount": 3
  },
  {
    "trackId": "css",
    "id": "flexbox",
    "level": 1,
    "mins": 35,
    "viz": "flexbox",
    "quizCount": 3
  },
  {
    "trackId": "css",
    "id": "grid",
    "level": 1,
    "mins": 35,
    "viz": "grid",
    "quizCount": 3
  },
  {
    "trackId": "css",
    "id": "responsive",
    "level": 1,
    "mins": 35,
    "quizCount": 3
  },
  {
    "trackId": "css",
    "id": "position",
    "level": 2,
    "mins": 30,
    "viz": "stacking",
    "quizCount": 4
  },
  {
    "trackId": "css",
    "id": "modern",
    "level": 2,
    "mins": 35,
    "quizCount": 4
  },
  {
    "trackId": "css",
    "id": "tailwind",
    "level": 2,
    "mins": 40,
    "quizCount": 3
  },
  {
    "trackId": "css",
    "id": "twreact",
    "level": 2,
    "mins": 40,
    "quizCount": 4
  },
  {
    "trackId": "css",
    "id": "arch",
    "level": 3,
    "mins": 40,
    "quizCount": 4
  },
  {
    "trackId": "css",
    "id": "render",
    "level": 3,
    "mins": 40,
    "quizCount": 3
  },
  {
    "trackId": "react",
    "id": "js",
    "level": 0,
    "mins": 30,
    "quizCount": 3
  },
  {
    "trackId": "react",
    "id": "ts",
    "level": 0,
    "mins": 35,
    "quizCount": 3
  },
  {
    "trackId": "react",
    "id": "components",
    "level": 0,
    "mins": 35,
    "quizCount": 3
  },
  {
    "trackId": "react",
    "id": "jsdeep",
    "level": 1,
    "mins": 40,
    "viz": "eventloop",
    "quizCount": 3
  },
  {
    "trackId": "react",
    "id": "state",
    "level": 1,
    "mins": 40,
    "viz": "rerender",
    "quizCount": 3
  },
  {
    "trackId": "react",
    "id": "effects",
    "level": 1,
    "mins": 40,
    "viz": "useeffect",
    "quizCount": 3
  },
  {
    "trackId": "react",
    "id": "forms",
    "level": 1,
    "mins": 35,
    "quizCount": 4
  },
  {
    "trackId": "react",
    "id": "generics",
    "level": 1,
    "mins": 35,
    "quizCount": 3
  },
  {
    "trackId": "react",
    "id": "hooks",
    "level": 2,
    "mins": 40,
    "quizCount": 3
  },
  {
    "trackId": "react",
    "id": "perf",
    "level": 2,
    "mins": 35,
    "viz": "rerender",
    "quizCount": 4
  },
  {
    "trackId": "react",
    "id": "server",
    "level": 2,
    "mins": 45,
    "quizCount": 4
  },
  {
    "trackId": "react",
    "id": "tsadv",
    "level": 3,
    "mins": 45,
    "quizCount": 3
  },
  {
    "trackId": "react",
    "id": "internals",
    "level": 3,
    "mins": 45,
    "quizCount": 3
  },
  {
    "trackId": "react",
    "id": "arch",
    "level": 3,
    "mins": 45,
    "quizCount": 3
  },
  {
    "trackId": "angular",
    "id": "components",
    "level": 0,
    "mins": 35,
    "quizCount": 3
  },
  {
    "trackId": "angular",
    "id": "flow",
    "level": 0,
    "mins": 35,
    "quizCount": 3
  },
  {
    "trackId": "angular",
    "id": "signals",
    "level": 0,
    "mins": 40,
    "viz": "ngsignals",
    "quizCount": 3
  },
  {
    "trackId": "angular",
    "id": "inputs",
    "level": 1,
    "mins": 40,
    "quizCount": 3
  },
  {
    "trackId": "angular",
    "id": "di",
    "level": 1,
    "mins": 35,
    "quizCount": 3
  },
  {
    "trackId": "angular",
    "id": "routing",
    "level": 1,
    "mins": 35,
    "quizCount": 3
  },
  {
    "trackId": "angular",
    "id": "forms",
    "level": 1,
    "mins": 40,
    "quizCount": 3
  },
  {
    "trackId": "angular",
    "id": "rxjs",
    "level": 2,
    "mins": 40,
    "viz": "ngrxjs",
    "quizCount": 3
  },
  {
    "trackId": "angular",
    "id": "http",
    "level": 2,
    "mins": 45,
    "quizCount": 3
  },
  {
    "trackId": "angular",
    "id": "guards",
    "level": 2,
    "mins": 40,
    "quizCount": 3
  },
  {
    "trackId": "angular",
    "id": "testing",
    "level": 2,
    "mins": 45,
    "quizCount": 3
  },
  {
    "trackId": "angular",
    "id": "cd",
    "level": 3,
    "mins": 45,
    "viz": "ngcd",
    "quizCount": 3
  },
  {
    "trackId": "angular",
    "id": "ssr",
    "level": 3,
    "mins": 45,
    "quizCount": 3
  },
  {
    "trackId": "angular",
    "id": "arch",
    "level": 3,
    "mins": 45,
    "quizCount": 3
  },
  {
    "trackId": "flutter",
    "id": "dart",
    "level": 0,
    "mins": 30,
    "quizCount": 3
  },
  {
    "trackId": "flutter",
    "id": "dartoop",
    "level": 0,
    "mins": 30,
    "quizCount": 3
  },
  {
    "trackId": "flutter",
    "id": "widgets",
    "level": 0,
    "mins": 30,
    "quizCount": 3
  },
  {
    "trackId": "flutter",
    "id": "layout",
    "level": 0,
    "mins": 35,
    "viz": "constraints",
    "quizCount": 3
  },
  {
    "trackId": "flutter",
    "id": "async",
    "level": 1,
    "mins": 35,
    "quizCount": 3
  },
  {
    "trackId": "flutter",
    "id": "state",
    "level": 1,
    "mins": 35,
    "viz": "frebuild",
    "quizCount": 3
  },
  {
    "trackId": "flutter",
    "id": "navforms",
    "level": 1,
    "mins": 35,
    "quizCount": 4
  },
  {
    "trackId": "flutter",
    "id": "network",
    "level": 1,
    "mins": 40,
    "quizCount": 3
  },
  {
    "trackId": "flutter",
    "id": "bloc",
    "level": 2,
    "mins": 45,
    "quizCount": 4
  },
  {
    "trackId": "flutter",
    "id": "dartdeep",
    "level": 2,
    "mins": 40,
    "quizCount": 3
  },
  {
    "trackId": "flutter",
    "id": "testing",
    "level": 2,
    "mins": 40,
    "quizCount": 3
  },
  {
    "trackId": "flutter",
    "id": "platform",
    "level": 2,
    "mins": 40,
    "quizCount": 3
  },
  {
    "trackId": "flutter",
    "id": "render",
    "level": 3,
    "mins": 45,
    "viz": "threetrees",
    "quizCount": 3
  },
  {
    "trackId": "flutter",
    "id": "arch",
    "level": 3,
    "mins": 45,
    "quizCount": 3
  },
  {
    "trackId": "go",
    "id": "types",
    "level": 0,
    "mins": 30,
    "quizCount": 3
  },
  {
    "trackId": "go",
    "id": "collections",
    "level": 0,
    "mins": 35,
    "viz": "goslices",
    "quizCount": 3
  },
  {
    "trackId": "go",
    "id": "structs",
    "level": 0,
    "mins": 30,
    "quizCount": 3
  },
  {
    "trackId": "go",
    "id": "interfaces",
    "level": 1,
    "mins": 35,
    "viz": "goiface",
    "quizCount": 3
  },
  {
    "trackId": "go",
    "id": "errors",
    "level": 1,
    "mins": 30,
    "quizCount": 3
  },
  {
    "trackId": "go",
    "id": "http",
    "level": 1,
    "mins": 40,
    "quizCount": 3
  },
  {
    "trackId": "go",
    "id": "testing",
    "level": 1,
    "mins": 40,
    "quizCount": 3
  },
  {
    "trackId": "go",
    "id": "generics",
    "level": 1,
    "mins": 35,
    "quizCount": 3
  },
  {
    "trackId": "go",
    "id": "goroutines",
    "level": 2,
    "mins": 40,
    "viz": "goroutine",
    "quizCount": 3
  },
  {
    "trackId": "go",
    "id": "context",
    "level": 2,
    "mins": 35,
    "viz": "gocontext",
    "quizCount": 3
  },
  {
    "trackId": "go",
    "id": "database",
    "level": 2,
    "mins": 40,
    "quizCount": 3
  },
  {
    "trackId": "go",
    "id": "concurrency",
    "level": 3,
    "mins": 40,
    "quizCount": 3
  },
  {
    "trackId": "go",
    "id": "architecture",
    "level": 3,
    "mins": 45,
    "quizCount": 3
  },
  {
    "trackId": "go",
    "id": "profiling",
    "level": 3,
    "mins": 40,
    "quizCount": 3
  },
  {
    "trackId": "sysdesign",
    "id": "thinking",
    "level": 0,
    "mins": 30,
    "quizCount": 3
  },
  {
    "trackId": "sysdesign",
    "id": "networking",
    "level": 0,
    "mins": 35,
    "quizCount": 3
  },
  {
    "trackId": "sysdesign",
    "id": "communication",
    "level": 0,
    "mins": 35,
    "quizCount": 3
  },
  {
    "trackId": "sysdesign",
    "id": "caching",
    "level": 1,
    "mins": 35,
    "viz": "syscache",
    "quizCount": 3
  },
  {
    "trackId": "sysdesign",
    "id": "cache-failures",
    "level": 1,
    "mins": 35,
    "quizCount": 3
  },
  {
    "trackId": "sysdesign",
    "id": "ratelimiting",
    "level": 1,
    "mins": 40,
    "viz": "sysratelimit",
    "quizCount": 3
  },
  {
    "trackId": "sysdesign",
    "id": "storage",
    "level": 1,
    "mins": 35,
    "quizCount": 3
  },
  {
    "trackId": "sysdesign",
    "id": "search-geo",
    "level": 1,
    "mins": 35,
    "quizCount": 3
  },
  {
    "trackId": "sysdesign",
    "id": "db-scaling",
    "level": 2,
    "mins": 45,
    "viz": "sysdbscale",
    "quizCount": 3
  },
  {
    "trackId": "sysdesign",
    "id": "hashing",
    "level": 2,
    "mins": 40,
    "viz": "syshash",
    "quizCount": 3
  },
  {
    "trackId": "sysdesign",
    "id": "messaging",
    "level": 2,
    "mins": 45,
    "viz": "sysqueue",
    "quizCount": 3
  },
  {
    "trackId": "sysdesign",
    "id": "resilience",
    "level": 2,
    "mins": 45,
    "viz": "sysresilience",
    "quizCount": 3
  },
  {
    "trackId": "sysdesign",
    "id": "consistency",
    "level": 3,
    "mins": 45,
    "quizCount": 3
  },
  {
    "trackId": "sysdesign",
    "id": "observability",
    "level": 3,
    "mins": 40,
    "quizCount": 3
  },
  {
    "trackId": "sysdesign",
    "id": "containers-k8s",
    "level": 3,
    "mins": 40,
    "quizCount": 3
  },
  {
    "trackId": "sysdesign",
    "id": "toolbox",
    "level": 3,
    "mins": 35,
    "quizCount": 3
  }
];

export const INTERVIEW_TOTALS: InterviewTotals = {
  problems: 21,
  cases: 8,
  behavioralThemes: 8,
  rapidTotal: 67,
  maxMocks: 8,
};
