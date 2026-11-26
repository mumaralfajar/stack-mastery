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
    "quizIds": ["var-total-mean","double-console-writeline-print","type-hold-price"]
  },
  {
    "trackId": "csharp",
    "id": "flow",
    "level": 0,
    "mins": 30,
    "quizIds": ["loop-fit-visiting-every","method-void-reset-int","mean-switch-expression-arm"]
  },
  {
    "trackId": "csharp",
    "id": "classes",
    "level": 0,
    "mins": 35,
    "quizIds": ["public-decimal-balance-get","job-constructor","static-method"]
  },
  {
    "trackId": "csharp",
    "id": "memory",
    "level": 1,
    "mins": 30,
    "viz": "stackheap",
    "quizIds": ["var-new-list-int","value-type","string-feel-like-value"]
  },
  {
    "trackId": "csharp",
    "id": "interfaces",
    "level": 1,
    "mins": 35,
    "quizIds": ["many-interfaces-one-class","base-method-marked-override","benefit-orderservice-inotifier-n"]
  },
  {
    "trackId": "csharp",
    "id": "generics",
    "level": 1,
    "mins": 30,
    "quizIds": ["need-check-thousands-times","new-require","way-read-dictionary-key"]
  },
  {
    "trackId": "csharp",
    "id": "errors",
    "level": 1,
    "mins": 30,
    "quizIds": ["inside-catch-throw-differ","finally-block-run","user-types-12a-age","using-var-conn-new"]
  },
  {
    "trackId": "csharp",
    "id": "linq",
    "level": 1,
    "mins": 35,
    "viz": "linq",
    "quizIds": ["var-items-filter-items","call-throws-sequence-empty","way-ask-there-least"]
  },
  {
    "trackId": "csharp",
    "id": "delegates",
    "level": 2,
    "mins": 30,
    "quizIds": ["type-describes-method-taking","int-func-int-return","code-outside-class-public"]
  },
  {
    "trackId": "csharp",
    "id": "async",
    "level": 2,
    "mins": 40,
    "viz": "async",
    "quizIds": ["happens-current-thread-await","three-independent-second-calls","avoid-result-asp-net","method-returns-iasyncenumerable"]
  },
  {
    "trackId": "csharp",
    "id": "modern",
    "level": 2,
    "mins": 30,
    "quizIds": ["evaluate-null","two-records-identical-property","string-name-tell-compiler"]
  },
  {
    "trackId": "csharp",
    "id": "gc",
    "level": 3,
    "mins": 40,
    "quizIds": ["gen-collection-cheap","span-field-class","first-step-optimising-memory"]
  },
  {
    "trackId": "csharp",
    "id": "concurrency",
    "level": 3,
    "mins": 40,
    "quizIds": ["count-unsafe-across-threads","primitive-gives-mutual-exclusion","strategy-thread-safety-overall"]
  },
  {
    "trackId": "csharp",
    "id": "internals",
    "level": 3,
    "mins": 35,
    "quizIds": ["list-dog-assignable-list","ef-core-translate-price","advantage-source-generators-refl"]
  },
  {
    "trackId": "cs",
    "id": "git",
    "level": 0,
    "mins": 30,
    "quizIds": ["git-add","work-feature-branch","pushed-commit-containing-api"]
  },
  {
    "trackId": "cs",
    "id": "bigo",
    "level": 0,
    "mins": 30,
    "viz": "bigo",
    "quizIds": ["complexity-loop-items-calls","binary-search-000-000","5n-3n-100-simplifies"]
  },
  {
    "trackId": "cs",
    "id": "numbers",
    "level": 0,
    "mins": 30,
    "quizIds": ["false-double","type-fits-account-balance","length-is-2-in"]
  },
  {
    "trackId": "cs",
    "id": "structures",
    "level": 1,
    "mins": 40,
    "quizIds": ["structure-gives-average-lookup","structure-fits-undo-recent","cost-list-insert-list"]
  },
  {
    "trackId": "cs",
    "id": "sorting",
    "level": 1,
    "mins": 40,
    "viz": "sort",
    "quizIds": ["two-things-every-recursive","time-complexity-merge-sort","sort-orders-date-then"]
  },
  {
    "trackId": "cs",
    "id": "trees",
    "level": 2,
    "mins": 40,
    "quizIds": ["traversal-visits-binary-search","min-heap-guarantee","inserting-order-plain-bst"]
  },
  {
    "trackId": "cs",
    "id": "graphs",
    "level": 2,
    "mins": 40,
    "viz": "graphsearch",
    "quizIds": ["algorithm-finds-shortest-path","time-complexity-bfs-dfs","topological-order-exists-only","directed-graph-dfs-reaches"]
  },
  {
    "trackId": "cs",
    "id": "backtracking",
    "level": 2,
    "mins": 35,
    "viz": "backtrack",
    "quizIds": ["remove-last-item-path","candidates-sorted-next-one","many-subsets-set-20"]
  },
  {
    "trackId": "cs",
    "id": "dp",
    "level": 3,
    "mins": 45,
    "viz": "dptable",
    "quizIds": ["two-properties-make-problem","first-step-designing-dp","greedy-algorithm-safe-use"]
  },
  {
    "trackId": "cs",
    "id": "concurrency",
    "level": 3,
    "mins": 40,
    "quizIds": ["two-threads-each-run","synchronous-javascript-code-neve","need-protect-section-contains"]
  },
  {
    "trackId": "sql",
    "id": "select",
    "level": 0,
    "mins": 25,
    "quizIds": ["clause-chooses-rows-returned","without-order-order-rows","name-like-match","select-top-name-products"]
  },
  {
    "trackId": "sql",
    "id": "dml",
    "level": 0,
    "mins": 25,
    "quizIds": ["update-products-set-price","result-null-null-sql","coalesce-nickname-name-return"]
  },
  {
    "trackId": "sql",
    "id": "aggregate",
    "level": 0,
    "mins": 35,
    "viz": "sqlorder",
    "quizIds": ["clause-filter-sum-amount","logically-runs-first","column-values-null-count","quantity-int-column-values"]
  },
  {
    "trackId": "sql",
    "id": "joins",
    "level": 1,
    "mins": 35,
    "viz": "joins",
    "quizIds": ["customers-rows-orders-orders","find-customers-orders","left-join-orders-adding"]
  },
  {
    "trackId": "sql",
    "id": "subqueries",
    "level": 1,
    "mins": 30,
    "quizIds": ["correlated-subquery","prefer-exists-subquery","purpose-cte"]
  },
  {
    "trackId": "sql",
    "id": "design",
    "level": 1,
    "mins": 40,
    "quizIds": ["orders-products-many-many","foreign-key-constraint-prevent","unit-price-stored-order","data-fits-json-column"]
  },
  {
    "trackId": "sql",
    "id": "indexes",
    "level": 2,
    "mins": 40,
    "viz": "index",
    "quizIds": ["index-exists-country-city","cost-adding-index","covering-index-means"]
  },
  {
    "trackId": "sql",
    "id": "transactions",
    "level": 2,
    "mins": 40,
    "quizIds": ["transfer-debits-account-then","anomaly-reading-data-another","safest-way-decrement-stock"]
  },
  {
    "trackId": "sql",
    "id": "window",
    "level": 2,
    "mins": 35,
    "viz": "sqlwindow",
    "quizIds": ["scores-90-90-80","many-rows-window-function","function-reads-previous-row"]
  },
  {
    "trackId": "sql",
    "id": "plans",
    "level": 3,
    "mins": 45,
    "quizIds": ["condition-use-index-seek","estimated-rows-10-actual","join-algorithm-suits-small"]
  },
  {
    "trackId": "sql",
    "id": "locking",
    "level": 3,
    "mins": 40,
    "viz": "sqllock",
    "quizIds": ["standard-way-prevent-deadlocks","read-committed-snapshot-long","application-code-chosen-deadlock","two-requests-run-update"]
  },
  {
    "trackId": "sql",
    "id": "scale",
    "level": 3,
    "mins": 45,
    "quizIds": ["first-step-zero-downtime","user-saves-profile-next","makes-sharding-costly-compared"]
  },
  {
    "trackId": "aspnet",
    "id": "http",
    "level": 0,
    "mins": 25,
    "viz": "journey",
    "quizIds": ["status-code-family-means","http-stateless-means","network-error-happens-client"]
  },
  {
    "trackId": "aspnet",
    "id": "anatomy",
    "level": 0,
    "mins": 25,
    "quizIds": ["builder-services-addscoped-calle","same-key-exists-appsettings","what-is-kestrel"]
  },
  {
    "trackId": "aspnet",
    "id": "routing",
    "level": 0,
    "mins": 35,
    "quizIds": ["post-successfully-creates-resour","app-mapget-items-id","complex-type-parameter-like"]
  },
  {
    "trackId": "aspnet",
    "id": "middleware",
    "level": 1,
    "mins": 30,
    "viz": "middleware",
    "quizIds": ["middleware-registered-response-p","short-circuiting-mean","exception-handling-middleware-re"]
  },
  {
    "trackId": "aspnet",
    "id": "di",
    "level": 1,
    "mins": 35,
    "viz": "di",
    "quizIds": ["within-single-http-request","lifetime-adddbcontext-use-defaul","captive-dependency"]
  },
  {
    "trackId": "aspnet",
    "id": "efcore",
    "level": 1,
    "mins": 40,
    "quizIds": ["db-products-price-100","migration-contain","loaded-entity-changed-property"]
  },
  {
    "trackId": "aspnet",
    "id": "validation",
    "level": 1,
    "mins": 30,
    "quizIds": ["client-sends-negative-price","problem-request-dtos-prevent","two-requests-create-product"]
  },
  {
    "trackId": "aspnet",
    "id": "auth",
    "level": 2,
    "mins": 45,
    "quizIds": ["signed-user-without-admin","signature-jwt-guarantee","check-stops-user-reading"]
  },
  {
    "trackId": "aspnet",
    "id": "config",
    "level": 2,
    "mins": 30,
    "quizIds": ["validateonstart-change","options-interface-reflects-confi","production-database-password-liv"]
  },
  {
    "trackId": "aspnet",
    "id": "testing",
    "level": 2,
    "mins": 40,
    "quizIds": ["webapplicationfactory-program-gi","three-parts-well-structured","prefer-real-sql-server"]
  },
  {
    "trackId": "aspnet",
    "id": "efadv",
    "level": 2,
    "mins": 40,
    "quizIds": ["list-100-orders-read","what-does-asnotracking-do","user-loaded-product-minutes"]
  },
  {
    "trackId": "aspnet",
    "id": "perf",
    "level": 3,
    "mins": 40,
    "quizIds": ["latency-rising-cpu-15","status-code-rate-limiter","addtokenbucketlimiter-api-partit","app-running-several-servers"]
  },
  {
    "trackId": "aspnet",
    "id": "arch",
    "level": 3,
    "mins": 45,
    "quizIds": ["outbox-pattern-guarantee","backgroundservice-create-scope-u","exception-escapes-executeasync-n","cqrs-worth-cost"]
  },
  {
    "trackId": "aspnet",
    "id": "prod",
    "level": 3,
    "mins": 45,
    "quizIds": ["database-down-20-seconds","circuit-breaker-repeated-failure","operation-safe-retry-automatical"]
  },
  {
    "trackId": "css",
    "id": "html",
    "level": 0,
    "mins": 30,
    "quizIds": ["element-trigger-action-such","alt-attribute","label-connected-input"]
  },
  {
    "trackId": "css",
    "id": "cascade",
    "level": 0,
    "mins": 30,
    "viz": "specificity",
    "quizIds": ["selector-highest-specificity","two-rules-identical-specificity","property-inherited-default","specificity-card"]
  },
  {
    "trackId": "css",
    "id": "box",
    "level": 0,
    "mins": 25,
    "viz": "boxmodel",
    "quizIds": ["box-sizing-content-box","sits-content-border","two-stacked-paragraphs-margin"]
  },
  {
    "trackId": "css",
    "id": "units",
    "level": 0,
    "mins": 25,
    "quizIds": ["root-font-size-16px","clamp-1rem-3vw-2rem","minimum-contrast-ratio-normal"]
  },
  {
    "trackId": "css",
    "id": "flexbox",
    "level": 1,
    "mins": 35,
    "viz": "flexbox",
    "quizIds": ["flex-direction-row-property","flex-every-child","flex-row-push-only"]
  },
  {
    "trackId": "css",
    "id": "grid",
    "level": 1,
    "mins": 35,
    "viz": "grid",
    "quizIds": ["grid-template-columns-1fr","declaration-gives-responsive-gri","make-grid-item-span"]
  },
  {
    "trackId": "css",
    "id": "responsive",
    "level": 1,
    "mins": 35,
    "quizIds": ["mobile-first-stylesheet-base","container-query-based","rule-keeps-images-overflowing"]
  },
  {
    "trackId": "css",
    "id": "position",
    "level": 2,
    "mins": 30,
    "viz": "stacking",
    "quizIds": ["absolutely-positioned-element-pl","creates-new-stacking-context","index-effect-element","position-fixed-element-suddenly"]
  },
  {
    "trackId": "css",
    "id": "modern",
    "level": 2,
    "mins": 35,
    "quizIds": ["custom-properties-differ-sass","card-img-select","system-dark-user-picks","properties-cheapest-animate"]
  },
  {
    "trackId": "css",
    "id": "tailwind",
    "level": 2,
    "mins": 40,
    "quizIds": ["md-grid-cols-mean","tailwind-css-stay-small","classname-bg-color-500"]
  },
  {
    "trackId": "css",
    "id": "twreact",
    "level": 2,
    "mins": 40,
    "quizIds": ["defining-color-brand-500","problem-tailwind-merge-solve","reusable-button-placed-inside","preferred-way-reuse-set"]
  },
  {
    "trackId": "css",
    "id": "arch",
    "level": 3,
    "mins": 40,
    "quizIds": ["layer-components-utilities-rule","hidden-display-none-layer","css-modules-provide","reusable-component-avoid-setting"]
  },
  {
    "trackId": "css",
    "id": "render",
    "level": 3,
    "mins": 40,
    "quizIds": ["change-handled-compositor-alone","directly-reduces-layout-shift","content-hidden-visually-kept"]
  },
  {
    "trackId": "react",
    "id": "js",
    "level": 0,
    "mins": 30,
    "quizIds": ["map-return","const-const","what-is-0-10"]
  },
  {
    "trackId": "react",
    "id": "ts",
    "level": 0,
    "mins": 35,
    "quizIds": ["type-size-allow","typescript-types-runtime","safer-alternative-any-value"]
  },
  {
    "trackId": "react",
    "id": "components",
    "level": 0,
    "mins": 35,
    "quizIds": ["react-function-component","each-list-item-need","child-component-change-props"]
  },
  {
    "trackId": "react",
    "id": "jsdeep",
    "level": 1,
    "mins": 40,
    "viz": "eventloop",
    "quizIds": ["both-settimeout-resolved-then","closure-capture","assigning-const-user-hi"]
  },
  {
    "trackId": "react",
    "id": "state",
    "level": 1,
    "mins": 40,
    "viz": "rerender",
    "quizIds": ["count-click-handler-calls","parent-state-changes-components","won-items-push-followed"]
  },
  {
    "trackId": "react",
    "id": "effects",
    "level": 1,
    "mins": 40,
    "viz": "useeffect",
    "quizIds": ["useeffect-runs","function-returned-effect","need-fullname-first-last"]
  },
  {
    "trackId": "react",
    "id": "forms",
    "level": 1,
    "mins": 35,
    "quizIds": ["two-sibling-components-show","child-update-state-owned","form-action-returns-validation","controlled-input-one-whose"]
  },
  {
    "trackId": "react",
    "id": "generics",
    "level": 1,
    "mins": 35,
    "quizIds": ["omit-product-id","extends-keyof","what-does-partial-t"]
  },
  {
    "trackId": "react",
    "id": "hooks",
    "level": 2,
    "mins": 40,
    "quizIds": ["two-components-both-call","hooks-called-inside-conditions","changing-useref-value-current"]
  },
  {
    "trackId": "react",
    "id": "perf",
    "level": 2,
    "mins": 35,
    "viz": "rerender",
    "quizIds": ["memoized-child-receives-onclick","react-compiler-enabled-still","first-step-react-screen","fix-list-20-000"]
  },
  {
    "trackId": "react",
    "id": "server",
    "level": 2,
    "mins": 45,
    "quizIds": ["successful-create-product-mutati","belongs-url-than-component","spa-signs-httponly-cookie","robust-way-keep-typescript"]
  },
  {
    "trackId": "react",
    "id": "tsadv",
    "level": 3,
    "mins": 45,
    "quizIds": ["extends-promise-infer-promise","satisfies-type-annotation-doesn","new-member-added-union"]
  },
  {
    "trackId": "react",
    "id": "internals",
    "level": 3,
    "mins": 45,
    "quizIds": ["same-position-div-replaced","usetransition-let","strict-mode-run-effects"]
  },
  {
    "trackId": "react",
    "id": "arch",
    "level": 3,
    "mins": 45,
    "quizIds": ["data-fetched-api-belong","query-getbyrole-button-name","important-first-step-accessibili"]
  },
  {
    "trackId": "angular",
    "id": "components",
    "level": 0,
    "mins": 35,
    "quizIds": ["add-so-parent-component","happens-write-click-toggle","prefer-disabled-isoutofstock-htm"]
  },
  {
    "trackId": "angular",
    "id": "flow",
    "level": 0,
    "mins": 35,
    "quizIds": ["require-track-expression-like","adding-default-never-end","share-formatting-logic-template"]
  },
  {
    "trackId": "angular",
    "id": "signals",
    "level": 0,
    "mins": 40,
    "viz": "ngsignals",
    "quizIds": ["inside-computed-qty-coupon","primitive-gives-state-resets","effect-right-tool"]
  },
  {
    "trackId": "angular",
    "id": "inputs",
    "level": 1,
    "mins": 40,
    "quizIds": ["function-creates-two-way","input-false-transform-booleanatt","attributes-css-classes-component"]
  },
  {
    "trackId": "angular",
    "id": "di",
    "level": 1,
    "mins": 35,
    "quizIds": ["calling-inject-cartstore-valid","two-sibling-app-editor","use-new-injectiontoken-apisettin"]
  },
  {
    "trackId": "angular",
    "id": "routing",
    "level": 1,
    "mins": 35,
    "quizIds": ["withcomponentinputbinding-inside","use-loadcomponent-import-admin","catch-all-path-route"]
  },
  {
    "trackId": "angular",
    "id": "forms",
    "level": 1,
    "mins": 40,
    "quizIds": ["check-whether-productform-name","minimum-number-rule-live","submit-productform-async-running"]
  },
  {
    "trackId": "angular",
    "id": "rxjs",
    "level": 2,
    "mins": 40,
    "viz": "ngrxjs",
    "quizIds": ["operator-cancels-earlier-search","user-double-clicks-place","takeuntildestroyed-handle"]
  },
  {
    "trackId": "angular",
    "id": "http",
    "level": 2,
    "mins": 45,
    "quizIds": ["happens-call-userresource-value","http-delete-api-products","authorization-header-request-id"]
  },
  {
    "trackId": "angular",
    "id": "guards",
    "level": 2,
    "mins": 40,
    "quizIds": ["asp-net-core-verify","canmatch-returning-false-differ","inside-boundary-error-block"]
  },
  {
    "trackId": "angular",
    "id": "testing",
    "level": 2,
    "mins": 45,
    "quizIds": ["zoneless-angular-v22-tests","httpresource-inside-new-test","httptesting-verify-check-inside"]
  },
  {
    "trackId": "angular",
    "id": "cd",
    "level": 3,
    "mins": 45,
    "viz": "ngcd",
    "quizIds": ["changedetectionstrategy-default","zoneless-app-shared-cartcount","compute-filtered-list-computed"]
  },
  {
    "trackId": "angular",
    "id": "ssr",
    "level": 3,
    "mins": 45,
    "quizIds": ["stops-component-inside-defer","rendermode-fits-signed-account","browser-only-dom-code"]
  },
  {
    "trackId": "angular",
    "id": "arch",
    "level": 3,
    "mins": 45,
    "quizIds": ["angular-aria-provide-plain","css-highlight-active-ngtab","active-search-filters-pagination"]
  },
  {
    "trackId": "flutter",
    "id": "dart",
    "level": 0,
    "mins": 30,
    "quizIds": ["type-var","name-guest-evaluate-name","declaration-compile-time-constan"]
  },
  {
    "trackId": "flutter",
    "id": "dartoop",
    "level": 0,
    "mins": 30,
    "quizIds": ["make-member-private-dart","two-instances-class-identical","final-isodd-10-produce"]
  },
  {
    "trackId": "flutter",
    "id": "widgets",
    "level": 0,
    "mins": 30,
    "quizIds": ["statelesswidget-build-method-ret","add-const-widget-constructor","what-is-buildcontext"]
  },
  {
    "trackId": "flutter",
    "id": "layout",
    "level": 0,
    "mins": 35,
    "viz": "constraints",
    "quizIds": ["row-property-aligns-children","expanded-inside-row","statement-describes-flutter-layo"]
  },
  {
    "trackId": "flutter",
    "id": "async",
    "level": 1,
    "mins": 35,
    "quizIds": ["future-completes-stream-emit","order-schedulemicrotask-timer-ru","two-independent-300-ms"]
  },
  {
    "trackId": "flutter",
    "id": "state",
    "level": 1,
    "mins": 35,
    "viz": "frebuild",
    "quizIds": ["calling-setstate-cause","texteditingcontroller-disposed","give-list-items-valuekey"]
  },
  {
    "trackId": "flutter",
    "id": "navforms",
    "level": 1,
    "mins": 35,
    "quizIds": ["validator-return-input-valid","difference-context-go-context","prefer-path-parameter-such","products-id-top-level"]
  },
  {
    "trackId": "flutter",
    "id": "network",
    "level": 1,
    "mins": 40,
    "quizIds": ["inject-http-client-api","json-contains-price-25","future-used-futurebuilder-create"]
  },
  {
    "trackId": "flutter",
    "id": "bloc",
    "level": 2,
    "mins": 45,
    "quizIds": ["difference-cubit-bloc","cubit-runs-state-items","snackbar-shown-response-state","user-opens-screen-leaves"]
  },
  {
    "trackId": "flutter",
    "id": "dartdeep",
    "level": 2,
    "mins": 40,
    "quizIds": ["marking-class-sealed-enable","int-string-dart","success-final-value-final"]
  },
  {
    "trackId": "flutter",
    "id": "testing",
    "level": 2,
    "mins": 40,
    "quizIds": ["await-tester-pump","test-cubit-emits","test-type-needs-device"]
  },
  {
    "trackId": "flutter",
    "id": "platform",
    "level": 2,
    "mins": 40,
    "quizIds": ["auth-token-stored-device","decide-bottom-navigation-bar","methodchannel-call-return"]
  },
  {
    "trackId": "flutter",
    "id": "render",
    "level": 3,
    "mins": 45,
    "viz": "threetrees",
    "quizIds": ["tree-holds-statefulwidget-state","element-reuse-state-new","use-compute-large-json"]
  },
  {
    "trackId": "flutter",
    "id": "arch",
    "level": 3,
    "mins": 45,
    "quizIds": ["layered-flutter-app-domain","secrets-placed-dart-define","platformdispatcher-instance-oner"]
  },
  {
    "trackId": "go",
    "id": "types",
    "level": 0,
    "mins": 30,
    "quizIds": ["export-type-function-go","len-caf-return","happens-declare-var-buf"]
  },
  {
    "trackId": "go",
    "id": "collections",
    "level": 0,
    "mins": 35,
    "viz": "goslices",
    "quizIds": ["happens-write-nil-map","protect-calling-append","go-22-change-range"]
  },
  {
    "trackId": "go",
    "id": "structs",
    "level": 0,
    "mins": 30,
    "quizIds": ["method-use-pointer-receiver","timeout-new-30-go","prefer-named-field-store"]
  },
  {
    "trackId": "go",
    "id": "interfaces",
    "level": 1,
    "mins": 35,
    "viz": "goiface",
    "quizIds": ["go-interface-normally-defined","var-io-writer-auditlog","interface-variable-equal-nil"]
  },
  {
    "trackId": "go",
    "id": "errors",
    "level": 1,
    "mins": 30,
    "quizIds": ["prefer-errors-err-errnotfound","according-go-single-handling","errors-astype-quotaerror-err"]
  },
  {
    "trackId": "go",
    "id": "http",
    "level": 1,
    "mins": 40,
    "quizIds": ["go-22-happens-someone","wrap-body-http-maxbytesreader","os-openroot-dir-go"]
  },
  {
    "trackId": "go",
    "id": "testing",
    "level": 1,
    "mins": 40,
    "quizIds": ["mark-helper-functions-inside","key-benefit-testing-synctest","prefer-loop-go-24"]
  },
  {
    "trackId": "go",
    "id": "generics",
    "level": 1,
    "mins": 35,
    "quizIds": ["int-mean-inside-go","inside-iter-seq-iterator","go-27-generic-methods"]
  },
  {
    "trackId": "go",
    "id": "goroutines",
    "level": 2,
    "mins": 40,
    "viz": "goroutine",
    "quizIds": ["call-close-ch-go","ch-make-chan-result","wg-go-fn-go"]
  },
  {
    "trackId": "go",
    "id": "context",
    "level": 2,
    "mins": 35,
    "viz": "gocontext",
    "quizIds": ["ctx-never-stored-inside","http-handler-starts-quick","declare-context-keys-unexported"]
  },
  {
    "trackId": "go",
    "id": "database",
    "level": 2,
    "mins": 40,
    "quizIds": ["check-rows-err-rows","defer-func-tx-rollback","uuid-newv7-go-27"]
  },
  {
    "trackId": "go",
    "id": "concurrency",
    "level": 3,
    "mins": 40,
    "quizIds": ["happens-go-two-goroutines","cap-concurrency-worker-pool","pprof-lookup-goroutineleak-ga"]
  },
  {
    "trackId": "go",
    "id": "architecture",
    "level": 3,
    "mins": 45,
    "quizIds": ["pass-fresh-context-withtimeout","order-resources-shut-down","avoid-init-functions-reading"]
  },
  {
    "trackId": "go",
    "id": "profiling",
    "level": 3,
    "mins": 40,
    "quizIds": ["go-build-gcflags-show","call-grow-estimatedbytes-strings","re-run-baseline-benchmark"]
  },
  {
    "trackId": "sysdesign",
    "id": "thinking",
    "level": 0,
    "mins": 30,
    "quizIds": ["000-rps-db-slowdown","many-requests-per-second","calling-10-independent-microserv"]
  },
  {
    "trackId": "sysdesign",
    "id": "networking",
    "level": 0,
    "mins": 35,
    "quizIds": ["envoy-max-ejection-percent","default-nginx-setting-stalls","http-quic-beat-http"]
  },
  {
    "trackId": "sysdesign",
    "id": "communication",
    "level": 0,
    "mins": 35,
    "quizIds": ["only-need-stream-real","reject-retried-post-carrying","cursor-pagination-beat-offset"]
  },
  {
    "trackId": "sysdesign",
    "id": "caching",
    "level": 1,
    "mins": 35,
    "viz": "syscache",
    "quizIds": ["allkeys-lfu-beat-allkeys","rfc-9111-cache-control","write-behind-caching-risky"]
  },
  {
    "trackId": "sysdesign",
    "id": "cache-failures",
    "level": 1,
    "mins": 35,
    "quizIds": ["standard-bloom-filter-guarantee","technique-stops-one-flash","add-10-20-random"]
  },
  {
    "trackId": "sysdesign",
    "id": "ratelimiting",
    "level": 1,
    "mins": 40,
    "viz": "sysratelimit",
    "quizIds": ["rate-limiting-approach-prevents","according-ietf-ratelimit-headers","distinguishes-rate-limiting-429"]
  },
  {
    "trackId": "sysdesign",
    "id": "storage",
    "level": 1,
    "mins": 35,
    "quizIds": ["lsm-tree-handle-heavier","lsm-tree-delete-record","mb-user-uploaded-kyc"]
  },
  {
    "trackId": "sysdesign",
    "id": "search-geo",
    "level": 1,
    "mins": 35,
    "quizIds": ["bm25-match-inside-word","geohash-queries-check-target","geometric-advantage-made-uber"]
  },
  {
    "trackId": "sysdesign",
    "id": "db-scaling",
    "level": 2,
    "mins": 45,
    "viz": "sysdbscale",
    "quizIds": ["partition-range-created-require","post-write-read-avoid","choice-creates-write-hotspot"]
  },
  {
    "trackId": "sysdesign",
    "id": "hashing",
    "level": 2,
    "mins": 40,
    "viz": "syshash",
    "quizIds": ["dynamodb-cassandra-redis-proxies","bounded-loads-capacity-factor","10-node-consistent-hash"]
  },
  {
    "trackId": "sysdesign",
    "id": "messaging",
    "level": 2,
    "mins": 45,
    "viz": "sysqueue",
    "quizIds": ["update-skip-locked-matter","advantage-debezium-cdc-offer","consumer-receives-event-id"]
  },
  {
    "trackId": "sysdesign",
    "id": "resilience",
    "level": 2,
    "mins": 45,
    "viz": "sysresilience",
    "quizIds": ["aws-builders-library-recommend","state-circuit-breaker-closed","pattern-stops-slow-third"]
  },
  {
    "trackId": "sysdesign",
    "id": "consistency",
    "level": 3,
    "mins": 45,
    "quizIds": ["replica-cluster-writes-require","http-status-idempotent-post","storage-itself-check-monotonic"]
  },
  {
    "trackId": "sysdesign",
    "id": "observability",
    "level": 3,
    "mins": 40,
    "quizIds": ["google-sre-combine-1h","high-cardinality-attributes-like","standard-http-header-links"]
  },
  {
    "trackId": "sysdesign",
    "id": "containers-k8s",
    "level": 3,
    "mins": 40,
    "quizIds": ["livenessprobe-avoid-querying-ext","add-prestop-sleep-10","happens-during-node-upgrade"]
  },
  {
    "trackId": "sysdesign",
    "id": "toolbox",
    "level": 3,
    "mins": 35,
    "quizIds": ["keep-heavy-bi-reporting","temporal-durable-workflow-engine","database-architecture-matches-ac"]
  }
];

export const INTERVIEW_TOTALS: InterviewTotals = {
  problems: 21,
  cases: 8,
  behavioralThemes: 8,
  rapidTotal: 67,
  maxMocks: 8,
};
