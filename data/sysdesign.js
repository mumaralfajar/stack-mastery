// System Design track: 16 lessons from back-of-the-envelope math to distributed consensus and tool selection.
// Inside JS template literals, every backslash (\) and backtick (`) inside Go/SQL/YAML/HTTP code must be escaped (\\, \`).
TRACKS.push({
  id: 'sysdesign', name: 'System Design', lang: 'go',
  tagline: 'Architecture, caching, rate limiting, storage engines, sharding, queues, resilience, observability, and picking the right tools for scale.',
  lessons: [
    // ---------------- Beginner ----------------
    {
      id: 'thinking', title: 'Latency, throughput, and back-of-the-envelope math', level: 0, mins: 30, lang: 'go',
      terms: [
        ['Tail latency (`p95`, `p99`)', 'The response time 95% or 99% of requests stay under. Averages hide slow outliers that degrade checkout and login flows under load.'],
        ["Little's Law (`L = λW`)", 'Average concurrent work in progress (`L`) equals arrival rate (`λ`) times average time spent in the system (`W`). Rising latency multiplies open connections even at constant QPS.'],
        ['Vertical vs horizontal scaling', 'Vertical scaling upgrades one machine (more CPU/RAM, simple transactions, hardware ceiling). Horizontal scaling adds stateless nodes behind a balancer (higher capacity, distributed coordination cost).']
      ],
      why: "System design starts with orders of magnitude, not box diagrams. Before picking a cache or sharding a database, you need to estimate request rate, storage growth, bandwidth, and how tail latency multiplies concurrency under Little's Law.",
      points: [
        "**Latency** measures one request's duration (`ms`), while **throughput** measures volume (`RPS` / `QPS`). Adding worker replicas raises throughput without automatically cutting a slow single query's latency.",
        'Measure **p50, p95, and p99** rather than averages. If a page fans out to 10 backend calls in parallel, the page waits on the slowest one, pushing 1% tail spikes onto nearly 10% of page loads (`1 - 0.99^10`).',
        'Know hardware orders of magnitude: RAM read **~100 ns**, NVMe SSD read **~100 µs**, same-AZ network round-trip **~0.5 ms**, cross-region round-trip **50–150 ms**.',
        'Back-of-the-envelope anchor: a day has `86,400` seconds (~`100,000`), so **1 million events/day ≈ 12 RPS** average (plan **3×–10×** higher for peak traffic).',
        "Apply **Little's Law (`L = λW`)**: at `2,000 RPS` with `50 ms` (`0.05 s`) latency, the server holds `100` concurrent slots; if DB locks push latency to `500 ms`, concurrency jumps to `1,000` and exhausts connection pools.",
        'Verify assumptions with real load generators like **k6**, **bombardier**, or **NBomber** instead of trusting local laptop benchmarks.'
      ],
      code: `
package main

import (
	"fmt"
	"math"
	"slices"
)

func percentile(samples []float64, p float64) float64 {
	sorted := slices.Clone(samples)
	slices.Sort(sorted)
	idx := int(math.Ceil(p/100*float64(len(sorted)))) - 1
	idx = max(0, min(idx, len(sorted)-1))
	return sorted[idx]
}

func main() {
	// Simulated endpoint latencies in milliseconds (one slow GC/lock outlier)
	latencies := []float64{12, 14, 15, 16, 18, 19, 21, 22, 24, 28, 35, 380}
	p50 := percentile(latencies, 50)
	p95 := percentile(latencies, 95)
	p99 := percentile(latencies, 99)

	// Daily capacity sizing: 2M active users * 15 requests/day
	dailyReqs := 2_000_000.0 * 15.0
	avgRPS := dailyReqs / 86400.0
	peakRPS := avgRPS * 5.0

	// Little's Law: L = lambda * W
	inflightHealthy := peakRPS * (25.0 / 1000.0)
	inflightDegraded := peakRPS * (p99 / 1000.0)

	yearlyStorageGB := (dailyReqs * 0.2 * 600.0 * 365.0) / 1e9 // 20% writes * 600 B
	fmt.Printf("p50=%.0fms p95=%.0fms p99=%.0fms\\n", p50, p95, p99)
	fmt.Printf("avgRPS=%.1f peakRPS=%.0f\\n", avgRPS, peakRPS)
	fmt.Printf("inflight healthy=%.0f degraded(p99)=%.0f\\n", inflightHealthy, inflightDegraded)
	fmt.Printf("yearlyWriteStorage=%.1f GB\\n", yearlyStorageGB)
}
`,
      practice: "Save this as `main.go` and run `go run .`. Modify `latencies` to hold twenty 15 ms responses and one 900 ms DB lock pause: compare `p50` vs `p99`, then compute how many concurrent DB connections your pool needs under Little's Law at `3,000` peak RPS.",
      teach: "Explain why two APIs with the same average latency of 25 ms can feel completely different in production, and walk through `L = λW` using a slow downstream query example.",
      analogy: "A highway lane counts cars passing per hour (throughput), while trip duration (latency) depends on speed and tollbooths. If tollbooths stall for 30 seconds each, cars back up onto the ramp (`L = λW`) even if the entry rate never increased.",
      pitfalls: [
        'Sizing a cluster from average daily RPS (`daily / 86,400`) instead of peak load and burst factors (login mornings, flash sales, payroll runs).',
        'Reporting only average latency (`mean`), which masks `p99` tail spikes affecting active users and fan-out pages.',
        'Throwing more CPU cores at an I/O-bound system whose bottleneck is actually connection-pool contention or cross-region round trips.'
      ],
      quiz: [
        { q: "At 1,000 RPS, a downstream DB slowdown raises average response time from 20 ms to 400 ms. What happens to in-flight requests (`L = λW`)?", a: ["Stays at 20 because RPS is unchanged", "Drops from 20 to 1", "Jumps from 20 to 400, risking thread or connection exhaustion", "Halves to 10"], c: 2, why: "By Little's Law (`L = λW`), `1,000 * 0.4 s = 400` concurrent requests in flight instead of `20`." },
        { q: "Approximately how many requests per second is 8.6 million events per day on average?", a: ["10 RPS", "100 RPS", "1,000 RPS", "8,600 RPS"], c: 1, why: "`8,640,000 / 86,400 s = 100 RPS` average (remember the quick heuristic: ~1M/day ≈ 12 RPS)." },
        { q: "Why does fan-out to 10 independent microservices amplify tail latency?", a: ["Serialization doubles payload size", "The parent request waits for the slowest of the 10 responses", "HTTP/1.1 drops every tenth packet", "DNS caches expire per hop"], c: 1, why: "If each service has a 1% slow tail, calling 10 in parallel exposes roughly `1 - 0.99^10 ≈ 9.6%` of requests to a slow dependency." }
      ]
    },
    {
      id: 'networking', title: 'DNS, CDNs, reverse proxies, and load balancers', level: 0, mins: 35, lang: 'yaml',
      splits: [
        ['NGINX Edge Proxy', '# --- 1. NGINX'],
        ['Envoy Cluster + Outlier', '# --- 2. Envoy']
      ],
      terms: [
        ['L4 vs L7 load balancer', 'L4 routes packets/TCP streams by IP and port at ultra-high speed; L7 terminates TLS and parses HTTP headers, paths, cookies, and gRPC frames for smart routing.'],
        ['Active vs passive health checks', 'Active checks poll a `/readyz` endpoint periodically (supported natively in Envoy and NGINX Plus); passive checks (Outlier Detection) eject backends when live traffic hits consecutive 5xx or timeouts.'],
        ['HTTP/3 (QUIC)', 'Runs multiplexed streams over UDP with faster 0-RTT/1-RTT handshakes and no TCP head-of-line blocking when packets drop on mobile networks.']
      ],
      why: "Every request crosses DNS, TLS termination, and at least one reverse proxy or load balancer before touching your application code. Misconfigured health checks, buffering, or timeouts at the edge break streaming APIs and overload struggling instances.",
      points: [
        'Use **Anycast DNS + CDN** (**Cloudflare**, **AWS CloudFront**) to terminate TLS near the user and serve cacheable static assets and edge redirects without touching origin servers.',
        'Pair **L4 balancing** (AWS NLB, IPVS) for raw throughput or sticky TCP protocols with **L7 balancing** (**NGINX**, **Envoy**, **HAProxy**, AWS ALB) for path/header routing, TLS termination, and rate-limiting.',
        'Pick balancing algorithms to match workload duration: **Round Robin** works for uniform fast calls; **Least Connections** or **Power of Two Random Choices (P2C)** protects uneven requests.',
        'Combine **active health checks** (`/readyz`) with **passive Outlier Detection** (ejecting an upstream host after e.g. 5 consecutive 5xx errors in Envoy) so dead or degraded pods leave the pool fast.',
        'Remember reverse-proxy traps: open-source **NGINX** disables active health checks without NGINX Plus, enables `proxy_buffering on` by default (which stalls **SSE** unless disabled), and drops idle **WebSockets** after 60s without longer `proxy_read_timeout`.',
        'Enable **HTTP/3 (QUIC)** at the edge (NGINX `ngx_http_v3_module` with `Alt-Svc`, or Envoy QUICHE) to avoid TCP head-of-line stalls on lossy mobile links.'
      ],
      code: `
# --- 1. NGINX Edge Reference Config (YAML representation) ---
nginx_edge:
  tls_and_protocol:
    listen: ["443 ssl", "443 quic reuseport"]
    http2: true
    http3: true
    alt_svc_header: 'h3=":443"; ma=86400'
  upstream_orders:
    algorithm: least_conn
    keepalive: 64
    passive_health_check:
      max_fails: 3
      fail_timeout: 15s
  routes:
    - path: /api/
      proxy_pass: http://upstream_orders
      proxy_http_version: "1.1"
    - path: /events/stream
      proxy_buffering: false # Required for real-time Server-Sent Events
      proxy_read_timeout: 3600s

# --- 2. Envoy Static Cluster + Active/Passive Health Checks ---
static_resources:
  clusters:
    - name: orders_service
      type: STRICT_DNS
      lb_policy: LEAST_REQUEST # Power-of-two random least-request
      connect_timeout: 0.5s
      health_checks:
        - timeout: 1s
          interval: 5s
          unhealthy_threshold: 2
          healthy_threshold: 2
          http_health_check:
            path: /readyz
      outlier_detection:
        consecutive_5xx: 5
        interval: 10s
        base_ejection_time: 30s
        max_ejection_percent: 50
      load_assignment:
        cluster_name: orders_service
        endpoints:
          - lb_endpoints:
              - endpoint:
                  address:
                    socket_address: { address: orders-1, port_value: 8080 }
`,
      practice: "Compare the two blocks above against your app edge: map where TLS terminates, check whether your streaming endpoints bypass proxy buffering, and decide what `max_ejection_percent` prevents Outlier Detection from ejecting every node during a partial outage.",
      teach: "Contrast an L4 load balancer with an L7 reverse proxy like Envoy, and explain why combining active `/readyz` checks with passive Outlier Detection beats either check alone.",
      analogy: "An L4 balancer acts like a toll operator waving cars into lanes without looking inside; an L7 proxy opens the manifest to route VIP shipments, turn back broken trucks, and cache identical flyers at the gate.",
      pitfalls: [
        'Setting health checks to ping `/health` without verifying critical dependencies—or failing readiness whenever an optional non-critical downstream blips, causing cluster-wide ejection.',
        'Enabling Round Robin on endpoints whose response times vary from 2 ms to 4 s, piling slow requests onto one overloaded server.',
        'Putting an L7 proxy with default `proxy_buffering on` in front of an SSE endpoint so events stay stuck in memory until the buffer fills.'
      ],
      quiz: [
        { q: "Why can Envoy's `max_ejection_percent: 50` save an API cluster during a transient spike?", a: ["It compresses 50% of JSON bodies", "It prevents Outlier Detection from ejecting every backend host simultaneously during a brief glitch", "It caps CPU usage at 50%", "It forces HTTP/3 downgrade"], c: 1, why: "Capping ejections guarantees some capacity remains available instead of emptying the upstream pool when every instance logs errors together." },
        { q: "Which NGINX behavior silently breaks Server-Sent Events (SSE) if left at its default setting?", a: ["gzip compression disabled", "`proxy_buffering on`, which batches chunks before flushing to the client", "Least connections routing", "TLS 1.3 resumption"], c: 1, why: "SSE expects immediate chunk delivery; disabling with `proxy_buffering off` stops NGINX from holding small event chunks." },
        { q: "What makes HTTP/3 (QUIC) faster than HTTP/2 on packet-loss-prone cellular connections?", a: ["No encryption overhead", "UDP-based streams avoid head-of-line blocking across independent streams in one connection", "Larger TCP congestion windows", "Stateless DNS lookup"], c: 1, why: "In HTTP/2 over TCP, one lost packet stalls every multiplexed stream until retransmitted; QUIC isolates loss to the affected stream." }
      ]
    },
    {
      id: 'communication', title: 'APIs and real-time protocols: REST, gRPC, WebSockets, and SSE', level: 0, mins: 35, lang: 'http',
      splits: [
        ['Idempotent REST POST', '# --- 1. Idempotent'],
        ['Server-Sent Events', '# --- 2. Server-Sent'],
        ['WebSocket Upgrade', '# --- 3. WebSocket']
      ],
      terms: [
        ['Idempotency key', 'A unique client-generated ID (IETF `Idempotency-Key` header) stored alongside the response so retried `POST` requests replay the original outcome instead of duplicating side effects.'],
        ['Cursor vs offset pagination', 'Offset (`OFFSET 10000`) scans discarded rows and shifts as items insert; cursor pagination seeks directly via `WHERE (created_at, id) < (@ts, @id)`.'],
        ['gRPC vs REST', 'gRPC pairs HTTP/2 multiplexing with binary Protocol Buffers for fast internal service-to-service contracts; REST/JSON prioritizes browser compatibility, HTTP caching, and human readability.']
      ],
      why: "Picking the wrong communication model creates silent double-charges on retries, duplicate feed rows under pagination, or wasted server memory holding idle connections.",
      points: [
        'Use **REST/JSON** at public edges for universal tooling, proxies, and CDN cacheability; switch to **gRPC** internally where typed `.proto` schemas, binary payloads, and HTTP/2 streaming cut latency and CPU.',
        'Make non-idempotent `POST` and `PATCH` writes safe against network retries using the IETF **`Idempotency-Key`** header backed by a unique constraint `(idempotency_key)` in storage.',
        'Default to **keyset / cursor pagination** (`?after=2026-11-19T08:00:00Z,9842`) on feeds and ledgers so inserts never skip or duplicate items and deep pages stay `O(log n)`.',
        'Pick the simplest real-time transport that fits traffic direction: **Server-Sent Events (SSE)** for one-way server-to-client feeds (auto-reconnects with `Last-Event-ID`), **WebSockets** only for true full-duplex bidirectional traffic (chat, live collaboration).',
        'Prefer **short/long polling** or **webhooks** for infrequent updates (minutes apart) instead of paying RAM and load-balancer timeout complexity for persistent sockets.'
      ],
      code: `
# --- 1. Idempotent Write & Keyset Pagination (HTTP/1.1 + IETF Idempotency-Key) ---
POST /v1/orders HTTP/1.1
Host: api.shop.example
Idempotency-Key: 9b2f7c14-31a8-4b77-9e20-8a142d05c112
Content-Type: application/json

{"itemId": "sku-42", "quantity": 1}

HTTP/1.1 201 Created
Idempotency-Key: 9b2f7c14-31a8-4b77-9e20-8a142d05c112
Content-Type: application/json

{"orderId": "ord-9901", "status": "reserved"}

# Cursor pagination avoids duplicate/missing rows when new orders arrive
GET /v1/orders?limit=20&cursor=1795100400_ord-9901 HTTP/1.1
Host: api.shop.example

# --- 2. Server-Sent Events (One-Way Streaming) ---
GET /v1/orders/ord-9901/events HTTP/1.1
Accept: text/event-stream
Last-Event-ID: 42

HTTP/1.1 200 OK
Content-Type: text/event-stream
Cache-Control: no-cache
X-Accel-Buffering: no

# --- 3. WebSocket Upgrade (Full-Duplex Chat / Presence) ---
GET /v1/chat/stream HTTP/1.1
Host: ws.shop.example
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==
Sec-WebSocket-Version: 13

HTTP/1.1 101 Switching Protocols
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Accept: s3pPLMBiTxaQ9kYGzzhZRbK+xOo=
`,
      practice: "Trace a mobile checkout retry where the client times out after the server already committed an order. List every column needed in `orders` or `idempotency_records` (key, request hash, HTTP status, serialized response, `expires_at`) and explain what should happen if a client reuses the same key with a different payload.",
      teach: "Compare Short Polling, Long Polling, Server-Sent Events, and WebSockets across connection count, firewall compatibility, auto-reconnect, and message direction.",
      analogy: "REST is mailing letters, gRPC is a pneumatic tube system between office desks, SSE is listening to a radio broadcast that resumes cleanly via `Last-Event-ID`, and WebSockets are keeping an open two-way phone call.",
      pitfalls: [
        'Accepting the same `Idempotency-Key` with a different JSON payload without returning `422 Unprocessable Content`, masking client key-reuse bugs.',
        'Using `OFFSET` pagination on an active timeline or ledger (`OFFSET 50000`), burning DB I/O and showing duplicate rows when new items arrive.',
        'Picking WebSockets for one-way live scoreboards or progress bars where SSE over plain HTTP/2 works with fewer proxy headaches.'
      ],
      quiz: [
        { q: "You only need to stream real-time stock price ticks from the server to web clients, with automatic browser reconnect on network drops. Which protocol fits best?", a: ["WebSockets", "Server-Sent Events (SSE)", "Short polling every 50 ms", "SMTP"], c: 1, why: "SSE runs over standard HTTP, reconnects automatically, and resumes via `Last-Event-ID` without stateful bidirectional handshake overhead." },
        { q: "Why should a server reject a retried `POST` carrying an existing `Idempotency-Key` if its request body differs from the first call?", a: ["HTTP/2 forbids duplicate keys", "Reusing one key for different payloads indicates a client bug and risks silently returning the wrong response", "Redis expires hashes on mismatch", "JSON parsers disallow POST retries"], c: 1, why: "Comparing a fingerprint/hash of the request payload ensures a key represents one logical operation and flags mismatched retries with 422." },
        { q: "Why does cursor/keyset pagination outperform `OFFSET 20000` on large tables?", a: ["Offset deletes old rows", "Cursor seeks directly via an indexed predicate (`WHERE (ts, id) < ...`) in O(log n) without scanning skipped rows", "Cursor compresses JSON payloads", "Offset locks the entire table"], c: 1, why: "`OFFSET 20000` forces the database to read and discard 20,000 rows; a keyset cursor jumps straight to the next key." }
      ]
    },

    // ---------------- Intermediate ----------------
    {
      id: 'caching', title: 'Caching layers, strategies, and HTTP caching', level: 1, mins: 35, lang: 'go', viz: 'syscache',
      splits: [
        ['Cache-Aside + LRU', '// --- 1. Cache-Aside'],
        ['HTTP RFC 9111 Freshness', '// --- 2. HTTP RFC 9111']
      ],
      terms: [
        ['Cache-Aside (Lazy Loading)', 'Application checks cache first; on miss it queries the database, populates the cache, and returns the value. Only hot data enters RAM.'],
        ['Write-Through vs Write-Behind', 'Write-Through updates cache and DB synchronously (fresh data, slower writes); Write-Behind buffers writes in cache and flushes asynchronously (fast writes, crash-loss risk).'],
        ['Eviction policies (`LRU`, `LFU`)', 'LRU drops the key untouched longest; LFU tracks access frequency (logarithmic counter in Redis) so rare batch scans do not evict evergreen hot items.']
      ],
      why: "Caching cuts read latency from milliseconds to microseconds and absorbs read traffic away from your database—yet a bad invalidation or eviction strategy serves stale prices, overflows RAM, or adds write latency.",
      predict: {
        prompt: "Thread A reads `sku:42` on a cache miss (DB holds price `100`). Before Thread A writes Redis, Thread B updates DB to `120` and deletes `sku:42` in Redis. Then Thread A writes `100` into Redis with a 10-minute TTL. What do readers see for the next 10 minutes?",
        options: [
          "120, because Thread B deleted the key last",
          "100 (stale value), because Thread A overwrote the deleted key with older data",
          "A Redis transaction error aborts Thread A",
          "Cache miss on every read until DB restarts"
        ],
        answer: 1,
        explain: "Thread A fetched `100` before Thread B wrote `120`, then populated Redis afterward. That classic Cache-Aside race leaves stale data until the TTL expires—another reason to keep TTLs finite and pair invalidation with versioning or CDC."
      },
      points: [
        'Layer caches closest to the caller first: **Browser HTTP cache** → **CDN edge** (`s-maxage`) → **L1 local memory** (`HybridCache` / `ristretto`) → **L2 distributed memory** (**Redis / Valkey / Memcached**).',
        'Use **RFC 9111** HTTP headers on public reads: `Cache-Control: public, max-age=60, s-maxage=300, stale-while-revalidate=30`, `ETag` (`304 Not Modified`), and `Vary` (never `Cache-Control: public` on personalized cookies/auth).',
        'Choose write strategy by consistency vs latency: **Cache-Aside** fits read-heavy apps, **Write-Through** enforces immediate cache freshness, and **Write-Behind** fits high-volume analytics counters where losing the tail window on crash is acceptable.',
        'Configure **Redis `maxmemory`** eviction deliberately: **`allkeys-lru`** for general caches, **`allkeys-lfu`** when background scans might pollute recency, and never leave default `noeviction` on an unmonitored cache.',
        'Every cache key needs three decisions upfront: a deterministic **key schema** (`sku:42:v2`), a bounded **TTL** (with jitter), and an **invalidation path**.'
      ],
      code: `
package main

import (
	"container/list"
	"fmt"
	"time"
)

// --- 1. Cache-Aside with O(1) LRU Eviction ---
type cacheEntry struct {
	key       string
	val       string
	expiresAt time.Time
}

type LRUCache struct {
	cap   int
	items map[string]*list.Element
	order *list.List // front = most recently used
}

func NewLRUCache(capacity int) *LRUCache {
	return &LRUCache{cap: capacity, items: make(map[string]*list.Element, capacity), order: list.New()}
}

func (c *LRUCache) Get(key string, now time.Time) (string, bool) {
	el, ok := c.items[key]
	if !ok {
		return "", false
	}
	entry := el.Value.(*cacheEntry)
	if now.After(entry.expiresAt) {
		c.order.Remove(el)
		delete(c.items, key)
		return "", false
	}
	c.order.MoveToFront(el)
	return entry.val, true
}

func (c *LRUCache) Set(key, val string, ttl time.Duration, now time.Time) string {
	evicted := ""
	if el, ok := c.items[key]; ok {
		entry := el.Value.(*cacheEntry)
		entry.val, entry.expiresAt = val, now.Add(ttl)
		c.order.MoveToFront(el)
		return evicted
	}
	if len(c.items) >= c.cap {
		oldest := c.order.Back()
		evicted = oldest.Value.(*cacheEntry).key
		c.order.Remove(oldest)
		delete(c.items, evicted)
	}
	el := c.order.PushFront(&cacheEntry{key: key, val: val, expiresAt: now.Add(ttl)})
	c.items[key] = el
	return evicted
}

// --- 2. HTTP RFC 9111 Freshness & Revalidation Check ---
func evalHTTPCache(ageSec, maxAge, swrSec int) string {
	if ageSec <= maxAge {
		return "200 HIT (fresh)"
	}
	if ageSec <= maxAge+swrSec {
		return "200 HIT stale-while-revalidate (async refresh)"
	}
	return "MISS / REVALIDATE (send If-None-Match ETag -> 304 or 200)"
}

func main() {
	t := time.Unix(1000, 0)
	cache := NewLRUCache(2)
	cache.Set("sku:1", "Keyboard", time.Minute, t)
	cache.Set("sku:2", "Mouse", time.Minute, t)
	_, _ = cache.Get("sku:1", t) // promotes sku:1; sku:2 becomes LRU
	ev := cache.Set("sku:3", "Desk", time.Minute, t)
	v1, ok1 := cache.Get("sku:1", t)
	fmt.Printf("evicted=%s sku1=(%s,%v)\\n", ev, v1, ok1)
	fmt.Println(evalHTTPCache(40, 60, 30))
	fmt.Println(evalHTTPCache(75, 60, 30))
	fmt.Println(evalHTTPCache(120, 60, 30))
}
`,
      practice: "Run the Go sample with `go run .` and open `VIZ.syscache`. Switch eviction from `LRU` to `LFU`, read keys `A` three times and `B`/`C`/`D` once, and compare which key survives eviction.",
      teach: "Compare Cache-Aside, Write-Through, and Write-Behind using a product price or view-counter example, explaining what happens on a Redis reboot under each one.",
      analogy: "A cache is keeping top-selling items on a small front counter (`LRU`/`LFU`) instead of walking to the warehouse (database) every time. A `TTL` forces you to verify the shelf label periodically.",
      pitfalls: [
        'Setting `Cache-Control: public` or missing `Vary: Authorization` on user-specific responses, causing a CDN to serve User A’s profile to User B.',
        'Leaving Redis `maxmemory-policy` on `noeviction` for cache workloads so every subsequent write errors once RAM fills.',
        'Relying solely on manual invalidation without a finite TTL—one missed delete leaves stale data forever.'
      ],
      quiz: [
        { q: "Why might `allkeys-lfu` outperform `allkeys-lru` when a nightly report scans 50,000 old items?", a: ["LFU compresses keys automatically", "LFU remembers frequency, so one-off cold scans don't evict frequently accessed hot keys", "LRU blocks reads during eviction", "LFU guarantees strong consistency"], c: 1, why: "A one-time scan floods an LRU cache's recent end, whereas LFU keeps frequently hit items intact." },
        { q: "Which RFC 9111 `Cache-Control` directive lets a CDN serve slightly expired data immediately while updating it in the background?", a: ["`no-store`", "`must-revalidate`", "`stale-while-revalidate`", "`private`"], c: 2, why: "`stale-while-revalidate=N` hides origin revalidation latency from visitors inside the grace window." },
        { q: "When is Write-Behind caching usually a dangerous fit?", a: ["View counters and analytics", "Immutable static thumbnails", "Account balances or inventory writes where losing buffered cache on crash loses committed operations", "DNS records"], c: 2, why: "Write-Behind acks before flushing to persistent disk; an unexpected cache crash drops buffered writes." }
      ]
    },
    {
      id: 'cache-failures', title: 'Cache failure modes: stampedes, penetration, and hot keys', level: 1, mins: 35, lang: 'go',
      splits: [
        ['Singleflight Coalescer', '// --- 1. Singleflight'],
        ['Bloom Filter Guard', '// --- 2. Compact Bloom Filter'],
        ['TTL Jitter', '// --- 3. TTL Jitter']
      ],
      terms: [
        ['Cache stampede (dog-piling)', 'Many concurrent requests miss an expired hot key at the exact same instant and hammer the database simultaneously to recompute the identical value.'],
        ['Cache penetration', 'Lookups for keys that exist in neither cache nor database (e.g., invalid IDs `-1` or enumeration scans) bypass cache every time and saturate DB reads.'],
        ['Cache avalanche', 'Large batches of keys expiring together—or an entire cache shard failing—causing sudden traffic spikes that cascade through the database.']
      ],
      why: "A cache that boosts throughput 50× in normal operation can take down your database in seconds when a hot key expires under burst traffic, when attackers query non-existent IDs, or when all TTLs expire on the hour.",
      predict: {
        prompt: "Your homepage banner key expires at `12:00:00`. At `12:00:00.010`, 500 concurrent requests miss Redis and call `db.GetBanner()` cleanly in parallel. Each request populates Redis afterward. With naive Cache-Aside and no coalescing, how many DB queries fire at `12:00:00`?",
        options: [
          "1 query, because Redis locks the missing key",
          "Up to 500 identical DB queries while the first fetch is still in flight",
          "0 queries, because Cache-Aside serves stale data automatically",
          "Exactly 2 queries (primary + replica)"
        ],
        answer: 1,
        explain: "All 500 cache reads see a miss before any request finishes computing and writing back to Redis, sending a 500× thundering herd straight into the database."
      },
      points: [
        'Stop **Cache Stampedes** by coalescing misses per key (**single-flight / mutex** — built into Go `golang.org/x/sync/singleflight` and .NET `HybridCache`), serving stale-while-refreshing, or using **XFetch** probabilistic early expiration.',
        'Stop **Cache Avalanches** by adding **random TTL jitter** (`baseTTL + rand(0, 20%)`) so keys populated during a deploy or warm-up do not all expire at once, backed by a circuit breaker and multi-AZ failover.',
        'Stop **Cache Penetration** (requests for non-existent IDs) by **negative caching** (`""` or `__NULL__` with a short 30–60s TTL) and placing a compact **Bloom filter** in front of DB lookups.',
        'Handle extreme **Hot Keys** (one viral celebrity or flash-sale SKU saturating a single Redis shard) by adding a tiny **L1 in-process cache** (1–5s TTL) or salting read keys across N shard copies (`sku:42#0..3`).',
        'Always bound negative caches and single-flight waits with **contexts/timeouts** so one stuck upstream rebuild does not hang 500 waiting requests indefinitely.'
      ],
      code: `
package main

import (
	"fmt"
	"hash/fnv"
	"math/rand/v2"
	"sync"
	"sync/atomic"
	"time"
)

// --- 1. Singleflight Coalescer (1 DB load for N concurrent misses) ---
type call struct {
	wg  sync.WaitGroup
	val string
}

type SingleFlight struct {
	mu    sync.Mutex
	calls map[string]*call
}

func (g *SingleFlight) Do(key string, fn func() string) string {
	g.mu.Lock()
	if g.calls == nil {
		g.calls = make(map[string]*call)
	}
	if c, ok := g.calls[key]; ok {
		g.mu.Unlock()
		c.wg.Wait()
		return c.val
	}
	c := &call{}
	c.wg.Add(1)
	g.calls[key] = c
	g.mu.Unlock()

	c.val = fn()
	c.wg.Done()

	g.mu.Lock()
	delete(g.calls, key)
	g.mu.Unlock()
	return c.val
}

// --- 2. Compact Bloom Filter (stops Cache Penetration) ---
type BloomFilter struct{ bits []bool }

func NewBloomFilter(size int) *BloomFilter { return &BloomFilter{bits: make([]bool, size)} }

func (b *BloomFilter) hashes(key string) (uint32, uint32) {
	h1 := fnv.New32a()
	h1.Write([]byte(key))
	a := h1.Sum32()
	return a, (a >> 16) ^ (a << 3) | 1
}

func (b *BloomFilter) Add(key string) {
	h1, h2 := b.hashes(key)
	for i := range uint32(3) {
		b.bits[(h1+i*h2)%uint32(len(b.bits))] = true
	}
}

func (b *BloomFilter) MightContain(key string) bool {
	h1, h2 := b.hashes(key)
	for i := range uint32(3) {
		if !b.bits[(h1+i*h2)%uint32(len(b.bits))] {
			return false
		}
	}
	return true
}

// --- 3. TTL Jitter (spreads expiry to stop Avalanches) ---
func jitteredTTL(base time.Duration, rng *rand.Rand) time.Duration {
	spread := int64(base / 5)
	return base + time.Duration(rng.Int64N(spread+1))
}

func main() {
	var dbCalls atomic.Int32
	sf := &SingleFlight{}
	var wg sync.WaitGroup
	for range 25 {
		wg.Go(func() {
			_ = sf.Do("banner:home", func() string {
				dbCalls.Add(1)
				time.Sleep(10 * time.Millisecond)
				return "promo-2026"
			})
		})
	}
	wg.Wait()

	bf := NewBloomFilter(256)
	bf.Add("sku:42")
	rng := rand.New(rand.NewPCG(1, 2))
	fmt.Printf("singleflight 25 callers -> dbCalls=%d\\n", dbCalls.Load())
	fmt.Printf("bloom sku:42=%v missing=%v\\n", bf.MightContain("sku:42"), bf.MightContain("sku:invalid-9999"))
	fmt.Printf("jitteredTTLs=%v %v\\n", jitteredTTL(5*time.Minute, rng), jitteredTTL(5*time.Minute, rng))
}
`,
      practice: "Run `go run .` to watch 25 concurrent callers trigger `dbCalls=1`. Remove the `SingleFlight` wrapper in a copy and run it again to observe `dbCalls=25`, then verify how a Bloom filter false positive (when bits collide) still safely falls back to DB + negative cache.",
      teach: "Draw the difference between a Cache Stampede, Cache Penetration, and a Cache Avalanche, and name one primary mitigation and trade-off for each.",
      analogy: "Single-flight is twenty roommates noticing the milk is empty and sending only one person to the store while the others wait; a Bloom filter is a guest list at the door that rejects obvious non-members before anyone checks the main ledger.",
      pitfalls: [
        'Expecting a Bloom filter to return zero false positives or support key deletes natively (standard Bloom filters guarantee zero false negatives, never zero false positives; deletions require a Counting Bloom Filter or periodic rebuild).',
        'Caching negative results without an upper cap on key diversity or short TTL, allowing random invalid IDs to evict valid cache keys.',
        'Using single-flight without a timeout so one slow or failed DB lookup stalls every waiting caller.'
      ],
      quiz: [
        { q: "What can a standard Bloom filter guarantee with 100% certainty?", a: ["That a key definitely exists in the DB", "If the filter returns `false`, the key definitely does NOT exist", "Zero false positives", "O(1) key deletion"], c: 1, why: "Bloom filters have zero false negatives: if any hashed bit is 0, the key was never added." },
        { q: "Which technique directly fixes a single flash-sale SKU saturating one Redis node even though cache hit rate is 99.9%?", a: ["Longer Redis RDB snapshots", "Switching to Fixed Window limits", "L1 local in-memory micro-cache (e.g., 1s TTL) or salting read replicas (`sku:42#0..N`)", "Turning off eviction"], c: 2, why: "A hot key hits one Redis shard on every request; absorbing reads in L1 app RAM or spreading reads across salted keys removes the single-shard bottleneck." },
        { q: "Why add ±10–20% random jitter to cache TTLs during bulk warm-up?", a: ["To prevent an entire batch of keys from expiring together (cache avalanche)", "To shrink key memory usage in Redis", "To enforce LRU ordering", "To bypass CDN Origin Shield"], c: 0, why: "Jitter spreads expiration across minutes so background rebuild load stays smooth instead of spiking together." }
      ]
    },
    {
      id: 'ratelimiting', title: 'Rate limiting algorithms, headers, and load shedding', level: 1, mins: 40, lang: 'go', viz: 'sysratelimit',
      splits: [
        ['Token Bucket', '// --- 1. Token Bucket'],
        ['Sliding Window Counter', '// --- 2. Sliding Window Counter'],
        ['HTTP 429 & IETF Headers', '// --- 3. HTTP Middleware']
      ],
      terms: [
        ['Token Bucket', 'Refills tokens at rate `r` up to burst capacity `b`. Allows brief bursts within `b` while enforcing long-run average rate `r` in `O(1)` memory.'],
        ['Sliding Window Counter', 'Combines `prevCount * overlapWeight + currCount` across two adjacent buckets—nearly as accurate as a full log at `O(1)` memory per client.'],
        ['IETF `RateLimit` headers', 'Standardizes `RateLimit-Policy` (quota rules) and `RateLimit` (remaining quota/reset) instead of `X-RateLimit-*`, paired with `429 Too Many Requests` + `Retry-After`.']
      ],
      why: "Without rate limiting and load shedding, one buggy retry loop or scraper consumes your entire API pool and starves legitimate users. Different algorithms trade exact boundary fairness against RAM and burst smoothness.",
      predict: {
        prompt: "An API uses a naive **Fixed Window** limit of `100 requests per minute` resetting cleanly at `:00` seconds. A client sends `100` requests at `12:00:58` and `100` more at `12:01:01`. How many succeed inside that 4-second span?",
        options: [
          "100 requests total, because the rate limiter tracks the last 60 seconds",
          "200 requests succeed (2× the allowed rate across the minute boundary)",
          "101 requests succeed before backoff triggers",
          "0 requests succeed because clocks drift"
        ],
        answer: 1,
        explain: "Fixed Window resets its counter at `12:01:00`, letting a client burst `2× limit` across the window edge. Switching to **Sliding Window Counter**, **Token Bucket**, or **GCRA** closes that boundary gap."
      },
      points: [
        'Compare the core algorithms: **Fixed Window** (tiny RAM, 2× boundary burst), **Sliding Window Log** (exact, high RAM storing timestamps), **Sliding Window Counter** (weighted two-bucket estimate, tiny RAM), **Token Bucket** (smooth average + controlled bursts), and **Leaky Bucket / GCRA** (constant drain pace).',
        'Across distributed API replicas, never do `GET` then `SET` in app code—racing servers over-admit. Execute check-and-decrement atomically via a **Redis Lua script** (`EVALSHA`) or `INCR` + `EXPIRE`.',
        'Return **`429 Too Many Requests`** with `Retry-After` and IETF **`RateLimit-Policy` / `RateLimit`** headers; remember **RFC 9111**: intermediaries and clients must ignore `RateLimit` headers on cached hits (`Age > 0`).',
        'Decide your failure mode per endpoint: **fail open** on browse/search endpoints if Redis blips, and **fail closed** (or local in-memory fallback) on login/OTP brute-force endpoints.',
        'Pair per-client **rate limiting** (`429`) with server-wide **load shedding** (`503 Service Unavailable`): shed low-priority requests before CPU, GC, or queue saturation collapses p99 for everything.'
      ],
      code: `
package main

import (
	"fmt"
	"net/http"
	"net/http/httptest"
	"sync"
	"time"
)

// --- 1. Token Bucket (O(1) state, allows bounded bursts) ---
type TokenBucket struct {
	mu         sync.Mutex
	tokens     float64
	capacity   float64
	refillRate float64 // tokens per second
	last       time.Time
}

func NewTokenBucket(capacity, refillPerSec float64, now time.Time) *TokenBucket {
	return &TokenBucket{tokens: capacity, capacity: capacity, refillRate: refillPerSec, last: now}
}

func (tb *TokenBucket) Allow(now time.Time) (bool, int) {
	tb.mu.Lock()
	defer tb.mu.Unlock()
	elapsed := now.Sub(tb.last).Seconds()
	if elapsed > 0 {
		tb.tokens = min(tb.capacity, tb.tokens+elapsed*tb.refillRate)
		tb.last = now
	}
	if tb.tokens < 1 {
		return false, 0
	}
	tb.tokens -= 1
	return true, int(tb.tokens)
}

// --- 2. Sliding Window Counter (stops Fixed-Window 2x edge burst) ---
type SlidingCounter struct {
	limit     int
	window    time.Duration
	curStart  time.Time
	curCount  int
	prevCount int
}

func (sc *SlidingCounter) Allow(now time.Time) bool {
	if now.Sub(sc.curStart) >= sc.window {
		if now.Sub(sc.curStart) < 2*sc.window {
			sc.prevCount = sc.curCount
		} else {
			sc.prevCount = 0
		}
		sc.curCount = 0
		sc.curStart = now.Truncate(sc.window)
	}
	elapsed := now.Sub(sc.curStart).Seconds()
	weight := max(0.0, 1.0-(elapsed/sc.window.Seconds()))
	estimated := float64(sc.prevCount)*weight + float64(sc.curCount)
	if estimated >= float64(sc.limit) {
		return false
	}
	sc.curCount++
	return true
}

// --- 3. HTTP Middleware with IETF RateLimit + Retry-After Headers ---
func rateLimitHandler(tb *TokenBucket, clock *time.Time) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ok, rem := tb.Allow(*clock)
		w.Header().Set("RateLimit-Policy", \`"orders";q=3;w=60\`)
		w.Header().Set("RateLimit", fmt.Sprintf(\`"orders";r=%d;t=10\`, rem))
		w.Header().Set("Cache-Control", "no-store")
		if !ok {
			w.Header().Set("Retry-After", "1")
			http.Error(w, "too many requests", http.StatusTooManyRequests)
			return
		}
		w.WriteHeader(http.StatusOK)
	})
}

func main() {
	now := time.Unix(60, 0)
	tb := NewTokenBucket(3, 1.0, now) // burst 3, refill 1/sec
	sc := &SlidingCounter{limit: 3, window: time.Minute, curStart: now.Add(-time.Minute), prevCount: 3}
	fmt.Println("sliding counter 10s into new window (3*0.83=2.5 < 3 -> allow 1st):", sc.Allow(now.Add(10*time.Second)))
	fmt.Println("sliding counter 2nd immediately (3.5 >= 3 -> reject):", sc.Allow(now.Add(10*time.Second)))

	h := rateLimitHandler(tb, &now)
	for i := 1; i <= 4; i++ {
		rec := httptest.NewRecorder()
		h.ServeHTTP(rec, httptest.NewRequest(http.MethodPost, "/v1/orders", nil))
		fmt.Printf("req=%d status=%d RateLimit=%s Retry-After=%s\\n",
			i, rec.Code, rec.Header().Get("RateLimit"), rec.Header().Get("Retry-After"))
	}
}
`,
      practice: "Open `VIZ.sysratelimit` and run the `:09` boundary burst test (`Jump to :09` → `Burst ×4` → `Advance +2s` → `Burst ×4`). Watch Fixed Window admit `2×` the limit while Sliding Window Counter, Token Bucket, and Leaky Bucket reject excess requests.",
      teach: "Explain why distributed rate limiters execute their check-and-decrement inside a single Redis Lua script (or atomic command), and contrast Token Bucket with Leaky Bucket.",
      analogy: "A Token Bucket is a subway fare card holding up to `b` rides refilled hourly—you can sprint a whole group through while tokens remain, whereas a Leaky Bucket is a turnstile clicking at one strict constant beat.",
      pitfalls: [
        'Reading a Redis counter in Go, checking `< limit`, and sending `INCR` in a second round trip—concurrent requests pass the check together under load.',
        'Returning `429` without `Cache-Control: no-store` or forgetting that cached `Age > 0` responses carry stale `RateLimit` counters.',
        'Partitioning strictly by IP behind corporate NAT or mobile CGNAT proxies, throttling thousands of innocent users together.'
      ],
      quiz: [
        { q: "Which rate-limiting approach prevents a client from bursting twice the quota across `:59` and `:01` while still keeping `O(1)` memory per user?", a: ["Fixed Window Counter", "Sliding Window Counter", "No-eviction Redis log", "HTTP ETag caching"], c: 1, why: "Sliding Window Counter weights the prior window's count by overlap fraction, smoothing the window seam with only two integers per user." },
        { q: "According to the IETF RateLimit headers draft + RFC 9111, how should clients treat `RateLimit` headers on a response served from an intermediary cache (`Age > 0`)?", a: ["Double the remaining quota", "Ignore `RateLimit` headers on cached responses", "Force a retry with `Retry-After: 0`", "Store them in localStorage forever"], c: 1, why: "Cached headers reflect origin state at storage time, not live quota; clients ignore them on cache hits (`Age > 0`)." },
        { q: "What is the main distinction between rate limiting (`429`) and load shedding (`503`)?", a: ["429 protects per-client quotas; 503 drops excess total load to save server health", "429 is for TCP, 503 is for UDP", "503 only runs in CDNs", "429 retries automatically in browsers"], c: 0, why: "Rate limiting isolates noisy tenants; load shedding protects global server health (CPU/memory/queue depth) when total capacity saturates." }
      ]
    },
    {
      id: 'storage', title: 'Storage engines and database selection: B-Tree vs LSM-Tree', level: 1, mins: 35, lang: 'go',
      splits: [
        ['Mini LSM-Tree (MemTable + WAL)', '// --- 1. LSM MemTable'],
        ['Database Selection Matrix', '// --- 2. Database Matrix']
      ],
      terms: [
        ['B-Tree storage engine', 'Mutable fixed-size pages (e.g., 8 KB in Postgres/SQL Server) updated in place. Fast point lookups and range scans; random updates trigger page splits and write amplification.'],
        ['LSM-Tree (Log-Structured Merge)', 'Appends writes sequentially to a WAL and sorted in-memory MemTable, flushing immutable SSTables to disk. Blazing writes; reads check MemTable + Bloom filters + SSTables.'],
        ['Write vs Read amplification', 'Write amplification counts bytes written to disk per logical write (e.g., LSM compaction); read amplification counts disk/file checks per lookup (checked across SSTable levels).']
      ],
      why: "Every database trade-off—why PostgreSQL excels at mixed transactional queries while Cassandra ingests massive write streams—traces back to whether the disk engine mutates B-Tree pages in place or appends immutable LSM-Tree SSTables.",
      points: [
        '**B-Tree engines** (**PostgreSQL**, **SQL Server**, **MySQL InnoDB**) give low-variance point reads and sorted range scans via one tree path, paying random-write and page-split costs during heavy inserts.',
        '**LSM-Tree engines** (**RocksDB**, **Cassandra**, **ScyllaDB**, **Pebble**) convert random writes into sequential WAL + MemTable appends, flushing immutable **SSTables** compacted later in the background.',
        'LSM reads must merge across the MemTable and multiple SSTable levels—that is why engines attach **Bloom filters** per SSTable to skip files that definitely lack a key.',
        'Match data models to access patterns: **OLTP Relational** (ACID joins, constraints), **Document (MongoDB)** (hierarchical schemas), **KV / Wide-Column (Redis, DynamoDB, Cassandra)** (known-key scale), **Columnar OLAP (ClickHouse, BigQuery)** (billion-row aggregations), **Object Storage (S3, MinIO)** (media blobs via presigned URLs).',
        'Never store large binaries (images, PDFs) inside SQL tables; keep metadata and URI pointers in SQL while streaming blobs straight to **S3 / MinIO**.'
      ],
      code: `
package main

import (
	"fmt"
	"slices"
	"strings"
)

// --- 1. LSM MemTable: WAL + Sorted MemTable + Immutable SSTable Flush ---
type kv struct{ k, v string }

type LSMStore struct {
	wal      []string
	mem      map[string]string
	memLimit int
	sstables [][]kv // newest first
}

func (db *LSMStore) Put(k, v string) {
	db.wal = append(db.wal, "SET "+k+"="+v)
	db.mem[k] = v
	if len(db.mem) >= db.memLimit {
		db.flush()
	}
}

func (db *LSMStore) flush() {
	keys := make([]string, 0, len(db.mem))
	for k := range db.mem {
		keys = append(keys, k)
	}
	slices.Sort(keys)
	table := make([]kv, len(keys))
	for i, k := range keys {
		table[i] = kv{k, db.mem[k]}
	}
	db.sstables = append([][]kv{table}, db.sstables...)
	clear(db.mem)
}

func (db *LSMStore) Get(k string) (string, bool) {
	if v, ok := db.mem[k]; ok { // Check mutable MemTable first
		return v, v != "<TOMBSTONE>"
	}
	for _, sst := range db.sstables { // Search newest immutable SSTable to oldest
		i, found := slices.BinarySearchFunc(sst, k, func(item kv, target string) int {
			return strings.Compare(item.k, target)
		})
		if found {
			return sst[i].v, sst[i].v != "<TOMBSTONE>"
		}
	}
	return "", false
}

// --- 2. Database Matrix Selection ---
func recommendStore(workload string) string {
	switch workload {
	case "ledger-acid":
		return "PostgreSQL / SQL Server (B-Tree ACID transactions & constraints)"
	case "high-ingest-telemetry":
		return "Cassandra / RocksDB / ClickHouse (LSM sequential ingest & columnar scan)"
	case "session-counter-hot":
		return "Redis / Valkey (in-memory sub-ms counters) + DynamoDB (single-key scale)"
	case "video-or-pdf-blob":
		return "Object Storage S3/MinIO (presigned upload/download) + CDN; URI in SQL"
	default:
		return "PostgreSQL default until access patterns force specialization"
	}
}

func main() {
	lsm := &LSMStore{mem: make(map[string]string), memLimit: 2}
	lsm.Put("user:2", "Budi")
	lsm.Put("user:1", "Ani")  // triggers SSTable #1 flush
	lsm.Put("user:2", "Budi-v2")
	lsm.Put("user:1", "<TOMBSTONE>") // LSM delete writes a tombstone

	v1, ok1 := lsm.Get("user:1")
	v2, ok2 := lsm.Get("user:2")
	fmt.Printf("sstables=%d wal=%d user1=(%s,%v) user2=(%s,%v)\\n", len(lsm.sstables), len(lsm.wal), v1, ok1, v2, ok2)
	fmt.Println(recommendStore("ledger-acid"))
	fmt.Println(recommendStore("high-ingest-telemetry"))
}
`,
      practice: "Trace `Put(\"user:1\", \"<TOMBSTONE>\")` in the Go LSM demo: explain why deleting a key in an LSM-Tree temporarily *adds* data until compaction merges SSTables, and compare that with deleting a row inside a PostgreSQL 8 KB B-Tree page.",
      teach: "Contrast B-Tree and LSM-Tree storage engines across sequential vs random writes, read lookup steps, and compaction/vacuum overhead.",
      analogy: "A B-Tree is a neatly alphabetized filing cabinet where inserting a folder may force rearranging drawers (page splits); an LSM-Tree drops every new note straight onto an inbox pad and alphabetizes stacks later at night (compaction).",
      pitfalls: [
        'Assuming NoSQL means schema-less maintenance—denormalized collections shift schema consistency checks into application deploy code.',
        'Allowing background LSM compaction to saturate NVMe IOPS during peak daytime traffic, spiking read tail latency.',
        'Picking a specialized NoSQL engine on day one when relational joins, transactions, and 5,000 RPS fit cleanly on one PostgreSQL or SQL Server box.'
      ],
      quiz: [
        { q: "Why can an LSM-Tree sustain much higher sustained random write throughput than a traditional B-Tree?", a: ["It skips durability and drops the WAL", "Writes append sequentially to WAL and in-memory MemTable, avoiding random 8 KB in-place page splits", "It stores all tables in CSS", "It avoids sorting keys forever"], c: 1, why: "Sequential disk WAL writes + RAM MemTable flushes avoid random read-modify-write IOPS on B-Tree pages." },
        { q: "How does an LSM-Tree delete a record across immutable SSTables?", a: ["Overwrites bytes in place with zeros", "Appends a special tombstone marker; older versions vanish during later compaction", "Rebuilds the whole database synchronously", "Uses SQL triggers"], c: 1, why: "SSTables are immutable, so deletes write a tombstone record shadowing older versions until compaction drops them." },
        { q: "Where should user-uploaded KYC documents (2 MB PDFs) live in an order/loan platform?", a: ["Stored inside PostgreSQL BYTEA / SQL Server VARBINARY(MAX) columns", "Base64-encoded inside Redis strings", "In S3 / MinIO object storage accessed via time-limited presigned URLs, with metadata in SQL", "Inside cookies"], c: 2, why: "Object storage handles large blobs cheaply with CDN/direct uploads, keeping DB backups, RAM buffer pools, and API threads lean." }
      ]
    },
    {
      id: 'search-geo', title: 'Search engines and spatial indexing: inverted indexes, BM25, and H3', level: 1, mins: 35, lang: 'go',
      splits: [
        ['Inverted Index + BM25', '// --- 1. Inverted Index'],
        ['Geohash Proximity Encoding', '// --- 2. Geohash']
      ],
      terms: [
        ['Inverted index', 'Maps normalized tokens (`"coffee"`) to sorted posting lists of document IDs and positions—used by Elasticsearch and OpenSearch so text searches avoid table scans.'],
        ['Okapi BM25', 'Relevance ranking formula weighting term frequency saturation (`k1`), term rarity across the corpus (`IDF`), and document length normalization (`b`).'],
        ['Geohash & Uber H3', 'Space-filling spatial grids turning `(lat, lon)` into sortable prefix strings (Geohash, squares) or 64-bit hexagonal cell IDs (`H3`, equidistant neighbors).']
      ],
      why: "Relational B-Tree indexes break down on two common features: substring relevance search (`LIKE '%espresso%'`) and fast two-dimensional radius queries (`drivers within 2 km`). Both need specialized index structures.",
      points: [
        "B-Trees index prefixes left-to-right, so `LIKE '%term%'` forces a full scan; **Elasticsearch / OpenSearch** (Apache Lucene) tokenize text into an **inverted index** (`term -> [docIDs]`).",
        '**BM25** improves on naive TF-IDF with diminishing returns on repeated words (`k1`) and length normalization (`b`), preventing long keyword-stuffed descriptions from dominating results.',
        'Treat search engines as **derived secondary read indexes**, never primary truth—sync changes from SQL via the **Outbox / CDC pipeline** and keep typo tolerance and synonyms there.',
        'For proximity search (`find nearby couriers`), two single-column B-Tree indexes on `(lat)` and `(lon)` scan giant bounding boxes; instead encode 2D space onto 1D cells via **Geohash**, **Quadtrees**, **PostGIS R-Tree (GiST)**, or **Uber H3**.',
        'Beware **Geohash edge discontinuities**: two houses 20 meters apart across a grid seam have completely different prefixes—always query the target cell **plus its 8 neighbors** (or use **Uber H3** hexagons where all 6 neighbors share uniform center-to-center distance).'
      ],
      code: `
package main

import (
	"fmt"
	"math"
	"slices"
	"strings"
)

// --- 1. Inverted Index with Simplified BM25 Scoring ---
type Doc struct {
	ID   int
	Text string
}

type SearchIndex struct {
	postings map[string]map[int]int // term -> docID -> freq
	lengths  map[int]int
	avgLen   float64
	total    int
}

func BuildSearchIndex(docs []Doc) *SearchIndex {
	idx := &SearchIndex{
		postings: make(map[string]map[int]int),
		lengths:  make(map[int]int, len(docs)),
		total:    len(docs),
	}
	totalToks := 0
	for _, d := range docs {
		words := strings.Fields(strings.ToLower(d.Text))
		idx.lengths[d.ID] = len(words)
		totalToks += len(words)
		for _, w := range words {
			if idx.postings[w] == nil {
				idx.postings[w] = make(map[int]int)
			}
			idx.postings[w][d.ID]++
		}
	}
	idx.avgLen = float64(totalToks) / float64(max(1, len(docs)))
	return idx
}

func (idx *SearchIndex) SearchBM25(query string) []int {
	const k1, b = 1.2, 0.75
	scores := make(map[int]float64)
	for _, term := range strings.Fields(strings.ToLower(query)) {
		hits := idx.postings[term]
		if len(hits) == 0 {
			continue
		}
		idf := math.Log((float64(idx.total)-float64(len(hits))+0.5)/(float64(len(hits))+0.5) + 1)
		for docID, tf := range hits {
			dl := float64(idx.lengths[docID])
			tfNorm := (float64(tf) * (k1 + 1)) / (float64(tf) + k1*(1-b+b*(dl/idx.avgLen)))
			scores[docID] += idf * tfNorm
		}
	}
	ids := make([]int, 0, len(scores))
	for id := range scores {
		ids = append(ids, id)
	}
	slices.SortFunc(ids, func(x, y int) int {
		if scores[y] > scores[x] {
			return 1
		}
		if scores[y] < scores[x] {
			return -1
		}
		return x - y
	})
	return ids
}

// --- 2. Geohash Proximity Encoding (interleaved lat/lon bits) ---
const base32 = "0123456789bcdefghjkmnpqrstuvwxyz"

func encodeGeohash(lat, lon float64, precision int) string {
	minLat, maxLat := -90.0, 90.0
	minLon, maxLon := -180.0, 180.0
	var out strings.Builder
	bit, ch, even := 0, 0, true
	for out.Len() < precision {
		if even {
			mid := (minLon + maxLon) / 2
			if lon >= mid {
				ch = ch*2 + 1
				minLon = mid
			} else {
				ch *= 2
				maxLon = mid
			}
		} else {
			mid := (minLat + maxLat) / 2
			if lat >= mid {
				ch = ch*2 + 1
				minLat = mid
			} else {
				ch *= 2
				maxLat = mid
			}
		}
		even = !even
		bit++
		if bit == 5 {
			out.WriteByte(base32[ch])
			bit, ch = 0, 0
		}
	}
	return out.String()
}

func main() {
	docs := []Doc{
		{1, "mechanical keyboard switch kit"},
		{2, "wireless mouse and keyboard combo for office desk setup"},
		{3, "keyboard keycaps"},
	}
	idx := BuildSearchIndex(docs)
	fmt.Println("BM25 ranked IDs for 'keyboard':", idx.SearchBM25("keyboard")) // doc 3 shorter field -> higher BM25!

	bandung := encodeGeohash(-6.9175, 107.6191, 7)
	neighbor := encodeGeohash(-6.9180, 107.6195, 7)
	fmt.Printf("Geohash Bandung=%s nearby=%s sharePrefix=%v\\n", bandung, neighbor, bandung[:5] == neighbor[:5])
}
`,
      practice: "Run `go run .` and note why document `3` (`\"keyboard keycaps\"`) outranks document `2` in BM25 even though both match `'keyboard'` once. Next, compare two coordinates `(-0.001, 0.001)` and `(0.001, -0.001)` near `(0, 0)` to observe the Geohash prefix seam directly.",
      teach: "Explain why Elasticsearch should stay a secondary index synced from Postgres/SQL Server rather than the primary ledger, and why Uber H3 hexagons beat square grids for radius heatmaps.",
      analogy: "An inverted index is the index at the back of a textbook listing every page number per topic instead of flipping every page from page 1. Hexagonal H3 tiles are like a honeycomb where every adjacent cell sits the exact same step away from its center.",
      pitfalls: [
        'Treating Elasticsearch as the system of record without durable source storage—mapping changes or failed near-real-time refreshes risk lost updates.',
        'Querying only `WHERE geohash LIKE prefix%` without also checking the 8 surrounding cells, silently dropping nearby matches across a grid boundary.',
        'Choosing overly dense Geo precision when driver counts fluctuate rapidly—Uber H3 lets you roll up (`cellToParent`) dynamically when areas are sparse.'
      ],
      quiz: [
        { q: "In BM25, why does a match inside a 2-word product title typically score higher than one match inside a 200-word description?", a: ["Field-length normalization (`b`) rewards matches in shorter fields", "Inverted indexes skip long documents", "BM25 sorts alphabetically", "IDF deletes frequent terms"], c: 0, why: "Length normalization prevents long, noisy text fields from unfairly outranking crisp, focused matches." },
        { q: "Why do Geohash queries check the target cell plus all 8 neighbors?", a: ["To sort alphabetically", "Nearby coordinates across a grid boundary can share almost no Geohash prefix", "Geohash only encodes latitude", "SQL LIKE requires 9 patterns"], c: 1, why: "Two points separated by 10 meters across a major quadrant line (e.g., equator or prime meridian) have completely different prefixes." },
        { q: "What geometric property made Uber design H3 around hexagons instead of squares or triangles?", a: ["Hexagons require half as many bits", "All six neighbors sit equidistant from the cell center, removing diagonal distortion", "Squares cannot tessellate spheres", "PostGIS only supports hexagons"], c: 1, why: "Square grids have closer edge neighbors (1×) and farther corner neighbors (√2×); hexagons give one uniform neighbor distance." }
      ]
    },
    // ---------------- Advanced ----------------
    {
      id: 'db-scaling', title: 'Database scaling: pooling, replicas, partitioning, and sharding', level: 2, mins: 45, lang: 'sql', viz: 'sysdbscale',
      splits: [
        ['PgBouncer Transaction Pool', '-- --- 1. PgBouncer Pool'],
        ['Declarative Partitioning', '-- --- 2. Range Partitioning'],
        ['Shard Key & Resharding', '-- --- 3. Composite Shard Schema']
      ],
      terms: [
        ['PgBouncer Transaction Mode', 'Returns a server DB connection to the pool after every `COMMIT`/`ROLLBACK` instead of holding it per client socket, multiplexing thousands of idle app connections onto dozens of Postgres backends.'],
        ['Replication lag (`LSN`)', 'Delay between a primary commit and an async read replica applying its WAL record. Passing a commit Log Sequence Number (LSN) lets critical reads wait or fall back to the primary for read-your-own-writes.'],
        ['Partitioning vs Sharding', 'Partitioning splits one table into physical child tables inside one DB node (easier pruning and `DROP PARTITION` retention); sharding distributes key ranges or hash buckets across separate DB nodes.']
      ],
      why: 'Opening 5,000 Postgres connections directly for 500 microservices stalls the kernel scheduler and burns gigabytes of memory. Scaling SQL systems goes in four deliberate stages: tune indexes and transaction pools first, offload stale-tolerant reads to replicas, partition huge tables inside one host, and shard across nodes only when primary writes saturate.',
      points: [
        'Each PostgreSQL backend process allocates local work memory and competes on ProcArray snapshots; capping direct DB connections around `~100–300` behind **PgBouncer** (`pool_mode = transaction`) or **RDS Proxy** often doubles throughput.',
        'In Transaction Mode, avoid session-scoped state (`SET TIME ZONE`, `PREPARE`, `LISTEN`, session advisory locks) unless PgBouncer `max_prepared_statements` is explicitly configured.',
        'Read replicas lag under heavy writes. Guarantee **read-your-own-writes** for mutations (checkout confirmation, profile edits) by pinning a short **commit LSN / version cookie** or routing post-write reads to the primary for 2–5 seconds.',
        'PostgreSQL declarative **range partitioning** (`PARTITION BY RANGE (created_at)`) prunes cold scans to one monthly child table and turns multi-hour `DELETE` vacuum storms into an instant `DROP TABLE`.',
        'Pick a **shard key** (`tenant_id` or `user_id`, not `created_at`) that matches your dominant access pattern with high cardinality; queries without the shard key trigger expensive **scatter-gather** fan-outs across all shards.',
        'Cross-shard joins and `AUTO_INCREMENT` sequences break on distributed shards—use time-ordered 64-bit IDs (**Snowflake** / **UUIDv7**) and move cross-entity views to read models.'
      ],
      predict: {
        prompt: "You scale an app horizontally from `20` to `400` API pods (`25` DB connections per pod = `10,000` connections) hitting one PostgreSQL primary (`max_connections = 5000`, `16 vCPU`). CPU hovers at 60%, yet p99 query latency jumps 10× and new pods fail to connect. Adding a read replica only handles `SELECT` traffic. What fixes the root bottleneck first?",
        options: [
          "Raise `max_connections = 20000` on PostgreSQL",
          "Put PgBouncer in `transaction` pooling mode in front of PostgreSQL and keep active DB backends around 50–150",
          "Drop all foreign keys and secondary indexes",
          "Shard the `users` table across 16 PostgreSQL instances immediately"
        ],
        answer: 1,
        explain: "PostgreSQL suffers severe context-switching and snapshot-lock contention when thousands of idle/short-lived connections sit open. Transaction pooling multiplexes 10,000 app sockets over ~100 active DB backends—buying orders of magnitude more headroom before touching sharding."
      },
      code: `
-- --- 1. PgBouncer Pool (pgbouncer.ini reference + session verification) ---
-- [pgbouncer]
-- pool_mode = transaction      -- hand connection back on COMMIT; forbids session SET/LISTEN
-- max_client_conn = 5000       -- total sockets accepted from API pods
-- default_pool_size = 60       -- max server backends per (db, user) pair
-- reserve_pool_size = 15       -- burst connections after reserve_pool_timeout
-- max_prepared_statements = 200 -- PgBouncer >= 1.21 protocol-level prepared caching

-- Read-your-own-writes check after primary INSERT/UPDATE:
-- 1) Primary returns commit LSN:
SELECT pg_current_wal_lsn() AS commit_lsn;
-- 2) Replica verifies it has replayed up to commit_lsn (fallback to primary on timeout):
SELECT pg_last_wal_replay_lsn() >= '0/1A3F8900'::pg_lsn AS replica_caught_up;

-- --- 2. Range Partitioning (PostgreSQL 12+: instant pruning & O(1) retention) ---
CREATE TABLE ledger_entries (
    entry_id    UUID        NOT NULL,
    account_id  BIGINT      NOT NULL,
    amount_idr  BIGINT      NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL,
    PRIMARY KEY (created_at, entry_id) -- partition key must belong to PK/UNIQUE
) PARTITION BY RANGE (created_at);

CREATE TABLE ledger_entries_2026_11 PARTITION OF ledger_entries
    FOR VALUES FROM ('2026-11-01 00:00:00Z') TO ('2026-12-01 00:00:00Z');
CREATE TABLE ledger_entries_2026_12 PARTITION OF ledger_entries
    FOR VALUES FROM ('2026-12-01 00:00:00Z') TO ('2027-01-01 00:00:00Z');

CREATE INDEX idx_ledger_acct_time ON ledger_entries (account_id, created_at DESC);

-- Retiring expired cold data without autovacuum bloat:
-- ALTER TABLE ledger_entries DETACH PARTITION ledger_entries_2025_11 CONCURRENTLY;
-- DROP TABLE ledger_entries_2025_11;

-- --- 3. Composite Shard Schema (PostgreSQL / Citus co-located shard pattern) ---
-- Every child table embeds tenant_id so related joins stay on one physical shard.
CREATE TABLE tenants (
    tenant_id   BIGINT PRIMARY KEY,
    plan        TEXT NOT NULL
);

CREATE TABLE orders (
    tenant_id   BIGINT NOT NULL,
    order_id    BIGINT NOT NULL, -- UUIDv7 / Snowflake: globally unique without central sequence
    total_idr   BIGINT NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (tenant_id, order_id)
);

CREATE TABLE order_items (
    tenant_id   BIGINT NOT NULL,
    order_id    BIGINT NOT NULL,
    line_no     INT    NOT NULL,
    sku         TEXT   NOT NULL,
    PRIMARY KEY (tenant_id, order_id, line_no),
    FOREIGN KEY (tenant_id, order_id) REFERENCES orders (tenant_id, order_id)
);

-- Partition-pruned / single-shard point lookup (no cross-shard scatter-gather):
EXPLAIN (ANALYZE, BUFFERS)
SELECT o.order_id, i.sku
FROM orders o
JOIN order_items i ON i.tenant_id = o.tenant_id AND i.order_id = o.order_id
WHERE o.tenant_id = 42 AND o.order_id = 900123;
`,
      practice: "Open `VIZ.sysdbscale`, set writes vs reads and check replication lag as write load climbs, then compare how Transaction Pooling shrinks open primary backends vs Direct Connections. Inspect the composite `(tenant_id, order_id)` key in section 3 and explain why `tenant_id` comes first.",
      teach: "Walk a teammate through the exact escalation ladder before sharding a Postgres cluster—indexes, PgBouncer transaction mode, read replicas + LSN read-your-writes, declarative partitioning—and name two workloads where sharding is mandatory vs premature.",
      analogy: "Direct connections reserve one private chef per diner even while reading the menu; transaction pooling lets 500 diners share 20 chefs who step in only while cooking each dish.",
      pitfalls: [
        'Running PgBouncer in `transaction` mode while issuing session-level `SET search_path`, temporary tables, or `pg_advisory_lock`—the next unrelated tenant reuses that backend connection.',
        'Sharding by monotonically increasing `created_at` or `order_id`, concentrating 100% of new writes onto whichever shard owns the newest range (write hotspot).',
        'Deleting millions of old log rows with `DELETE FROM events WHERE created_at < ...` instead of dropping a monthly range partition, creating dead-tuple bloat and XID wraparound risk.'
      ],
      quiz: [
        { q: "Why does `PARTITION BY RANGE (created_at)` require `created_at` inside every `PRIMARY KEY` and `UNIQUE` constraint in PostgreSQL?", a: ["To sort strings faster", "PostgreSQL only guarantees uniqueness per local partition index unless the partition key is part of the unique key", "B-Trees only index timestamps", "PgBouncer requires it"], c: 1, why: "Without checking every child partition on every insert, uniqueness can only be enforced locally when the routing column is inside the index." },
        { q: "How can an API read immediately after a mutation avoid seeing stale data from an async read replica?", a: ["Disable WAL on primary", "Route the user's immediate read to the primary or wait for replica `pg_last_wal_replay_lsn() >= commit_lsn`", "Set `LIMIT 1`", "Run `VACUUM FULL`"], c: 1, why: "Tracking the primary commit LSN (or short post-write primary pinning) guarantees monotonic read-your-own-writes without stalling all readers." },
        { q: "Which mistake creates a write hotspot on a sharded database?", a: ["Using UUIDv7 inside `(tenant_id, id)` hash sharding", "Range-sharding an append-only table by `created_at`", "Pre-splitting virtual shards into 256 buckets", "Co-locating `orders` and `order_items` on `tenant_id`"], c: 1, why: "All current timestamps land inside one active rightmost range shard while older shards stay idle for writes." }
      ]
    },
    {
      id: 'hashing', title: 'Consistent hashing, virtual nodes, and bounded-load balancing', level: 2, mins: 40, lang: 'go', viz: 'syshash',
      splits: [
        ['Modulo Remapping Collapse', '// --- 1. Naive Modulo'],
        ['Hash Ring + Virtual Nodes', '// --- 2. Consistent Ring'],
        ['Bounded-Load Balancing', '// --- 3. Bounded-Load']
      ],
      terms: [
        ['Consistent hashing ring', 'Maps both physical nodes and object keys onto the same `[0, 2^32)` (or `2^64`) circular space; a key lives on the first node clockwise so adding/removing 1 of `N` nodes moves only `~1/N` keys.'],
        ['Virtual nodes (`vnodes`)', 'Multiple ring positions (`nodeA#0`, `nodeA#1`, ...) per physical machine. `100–200` vnodes shrink key-distribution skew from ±30% to under ±5% and spread failover load evenly across survivors.'],
        ['Bounded-load hashing', 'Mirrokni et al. / Google Maglev / HAProxy extension that caps any node at `ceil(avgLoad * (1 + ε))` (e.g., `c = 1.25`) and probes the next clockwise node if full, blocking hot-key cascades.']
      ],
      why: 'Partitioned Redis shards, DynamoDB-style storage engines, and stateful Layer-7 caches cannot afford global cache flushes whenever an instance scales up or crashes. Consistent hashing with virtual nodes keeps cache hits warm during topology shifts while bounded loads keep celebrity keys from overloading one lucky node.',
      points: [
        'Modulo hashing (`hash(k) % N`) works only for fixed-size static pools: resizing `N` from `4` to `5` changes the remainder for roughly **80% (`4/5`)** of every key at once.',
        'On a consistent hash ring (`N` nodes), inserting or removing one node alters only `~1/N` keys (those between the affected node and its counter-clockwise predecessor).',
        'Few physical nodes placed once on a ring yield highly uneven arc lengths—using **100–200 virtual nodes** per server turns uneven luck into smooth statistical balance and supports heterogeneous weights (give a `2×` RAM host `2×` vnodes).',
        'Lookup stays `O(log(N * V))` with binary search (`slices.BinarySearchFunc`) on a sorted uint32/uint64 slice—microseconds in Go with zero allocations.',
        'Pure consistent hashing still melts a single node under a skewed Zipfian hot key; **Consistent Hashing with Bounded Loads** (`cap = ceil(loadRatio * c)`, `c ≈ 1.25`, used in HAProxy and Vimeo/Google load balancers) overflows surplus hits cleanly to the next node clockwise.',
        'Alternative algorithm worth knowing: **Rendezvous (Highest Random Weight) hashing** picks `argmax node hash(key, node)`—simpler (no ring structure) and equally minimal-movement (`1/N`), great when `N` is small (`< 100` backends).'
      ],
      predict: {
        prompt: "You run a 4-node in-memory cache cluster routed by `fnv32(key) % N`. During peak traffic, Node 4 is added (`N` changes `4 -> 5`) across `10,000` hot keys. Roughly how many keys immediately remap to a different node (cache misses)?",
        options: [
          "~2,000 keys (20%, matching `1/5` of keys)",
          "~8,000 keys (~80%), causing a massive cache stampede against the DB",
          "Exactly 2,500 keys (25%)",
          "0 keys until old TTLs expire"
        ],
        answer: 1,
        explain: "Changing the modulus from `4` to `5` alters `h % 4 != h % 5` for almost every integer except multiples below 4 (`lcm(4,5)=20`, so `16/20 = 80%` move). A consistent hash ring limits key movement to `~1/5` (20%)."
      },
      code: `
package main

import (
	"cmp"
	"crypto/sha256"
	"encoding/binary"
	"fmt"
	"slices"
	"strconv"
)

func hash32(s string) uint32 {
	sum := sha256.Sum256([]byte(s))
	return binary.BigEndian.Uint32(sum[:4])
}

// --- 1. Naive Modulo (changing N=4 -> 5 remaps ~80% of keys) ---
func moduloRemapFraction(keys []string, n1, n2 int) float64 {
	moved := 0
	for _, k := range keys {
		h := int(hash32(k))
		if h%n1 != h%n2 {
			moved++
		}
	}
	return float64(moved) / float64(len(keys))
}

// --- 2. Consistent Ring with Virtual Nodes ---
type vnode struct {
	pos  uint32
	node string
}

type Ring struct {
	vnodes []vnode
}

func NewRing(nodes []string, vnodesPerNode int) *Ring {
	r := &Ring{vnodes: make([]vnode, 0, len(nodes)*vnodesPerNode)}
	for _, n := range nodes {
		for i := range vnodesPerNode {
			r.vnodes = append(r.vnodes, vnode{
				pos:  hash32(n + "#" + strconv.Itoa(i)),
				node: n,
			})
		}
	}
	slices.SortFunc(r.vnodes, func(a, b vnode) int { return cmp.Compare(a.pos, b.pos) })
	return r
}

func (r *Ring) startIndex(key string) int {
	h := hash32(key)
	idx, _ := slices.BinarySearchFunc(r.vnodes, h, func(v vnode, target uint32) int {
		return cmp.Compare(v.pos, target)
	})
	if idx == len(r.vnodes) {
		return 0 // wrap around clockwise to index 0
	}
	return idx
}

func (r *Ring) Lookup(key string) string { return r.vnodes[r.startIndex(key)].node }

// --- 3. Bounded-Load Extension (prevents hot-node saturation) ---
func (r *Ring) LookupBounded(key string, activeLoad map[string]int, capPerNode int) string {
	start := r.startIndex(key)
	seen := make(map[string]struct{}, 8)
	for off := range len(r.vnodes) {
		cand := r.vnodes[(start+off)%len(r.vnodes)].node
		if _, checked := seen[cand]; checked {
			continue
		}
		seen[cand] = struct{}{}
		if activeLoad[cand] < capPerNode {
			return cand
		}
	}
	return r.vnodes[start].node // fallback if every node hits cap
}

func main() {
	keys := make([]string, 2000)
	for i := range keys {
		keys[i] = "session:" + strconv.Itoa(i)
	}
	fmt.Printf("Naive modulo 4->5 moved: %.1f%%\\n", 100*moduloRemapFraction(keys, 4, 5))

	r4 := NewRing([]string{"cache-a", "cache-b", "cache-c", "cache-d"}, 150)
	r5 := NewRing([]string{"cache-a", "cache-b", "cache-c", "cache-d", "cache-e"}, 150)
	moved := 0
	for _, k := range keys {
		if r4.Lookup(k) != r5.Lookup(k) {
			moved++
		}
	}
	fmt.Printf("Consistent ring (150 vnodes) 4->5 moved: %.1f%% (ideal ~20%%)\\n", 100*float64(moved)/float64(len(keys)))

	load := map[string]int{"cache-a": 100, "cache-b": 100, "cache-c": 10, "cache-d": 20}
	primary := r4.Lookup("hot:promo")
	fmt.Printf("Hot key primary=%s bounded(cap=100)=%s\\n", primary, r4.LookupBounded("hot:promo", load, 100))
}
`,
      practice: "Open `VIZ.syshash`, drag `vnodes/server` from `1` up to `150`, and watch key distribution balance across servers. Next, click `+ Add Node` (`4 -> 5`) and inspect the `Moved Keys` counter compared to Modulo Hashing.",
      teach: "Explain why adding virtual nodes improves both initial key balance AND post-crash recovery when one cache server disappears.",
      analogy: "Placing 4 people on a round clock leaves uneven wedge slices; giving each person 150 randomly scattered seats around the clock guarantees every person captures nearly 25% of incoming darts.",
      pitfalls: [
        'Forgetting binary-search wrap-around (`idx == len(vnodes) -> 0`), causing keys hashed past the last vnode to panic or stay unrouted.',
        'Picking `1` or `2` virtual nodes in a small cluster, leaving one node owning 60% of the ring while another starves.',
        'Assuming consistent hashing alone protects against hot keys—a viral single key still hashes to the exact same replica unless paired with L1 cache or bounded loads.'
      ],
      quiz: [
        { q: "Why do systems like DynamoDB, Cassandra, and Redis-routing proxies assign 100–200 virtual nodes per physical host instead of 1?", a: ["To multiply RAM capacity", "To minimize partition-size variance and distribute failovers evenly across all remaining hosts", "To avoid hashing keys", "To guarantee strong linearizability"], c: 1, why: "Many vnodes turn random arc spacing into uniform percentages and prevent one immediate clockwise neighbor from absorbing 100% of a dead node's load." },
        { q: "What does adding `bounded loads` (capacity factor `c ≈ 1.25`) change during a hot-key spike?", a: ["Disables virtual nodes", "Spills excess requests beyond `cap` to the next distinct physical server clockwise", "Deletes cold keys permanently", "Forces TCP retries"], c: 1, why: "Bounded-load consistent hashing guarantees no node exceeds `1.25×` average load while retaining locality on normal traffic." },
        { q: "In a 10-node consistent hash ring with well-balanced vnodes, roughly what share of keys move when 1 new node joins?", a: ["~90%", "~50%", "~9–10% (`1 / 11`)", "0%"], c: 2, why: "Only keys owned by segments newly captured by the 11th node migrate (`1 / (N + 1)`)." }
      ]
    },
    {
      id: 'messaging', title: 'Async messaging, transactional outbox, CDC, and DLQs', level: 2, mins: 45, lang: 'sql', viz: 'sysqueue',
      splits: [
        ['Transactional Outbox', '-- --- 1. Outbox Table'],
        ['Relay & SKIP LOCKED', '-- --- 2. Outbox Poller'],
        ['Idempotent Consumer & DLQ', '-- --- 3. Consumer Dedup & DLQ']
      ],
      terms: [
        ['Dual-write problem', 'Writing to PostgreSQL and publishing to Kafka/RabbitMQ inside one request without atomic commitment: if the broker call fails after DB commit (or vice versa), ledger state and events diverge silently.'],
        ['Transactional Outbox + CDC', 'Insert both domain rows and an `outbox_events` row in the SAME local SQL transaction; either a `SKIP LOCKED` relay worker or Debezium WAL CDC ships rows reliably to the broker.'],
        ['Dead-Letter Queue (DLQ)', 'Side channel holding poison messages that repeatedly fail schema validation or transient retries so they stop blocking healthy partitions while engineers inspect and replay them.']
      ],
      why: 'Distributed services crash right between a SQL `COMMIT` and a message broker `Publish()`. The Transactional Outbox pattern plus idempotent consumers turn fragile dual writes into reliable at-least-once delivery—without fragile 2-phase commits across databases and brokers.',
      points: [
        'Never perform **dual writes** (`db.Commit()` followed by `kafka.Produce()`) for financial or order state: a network blip or OOM kill between the two lines drops events permanently.',
        'Writing domain data + `outbox_events` in one ACID transaction guarantees atomicity; push events either via a relay poller (`FOR UPDATE SKIP LOCKED`) or **Change Data Capture (Debezium)** reading the DB Write-Ahead Log with near-zero DB query overhead.',
        'Brokers (**Kafka**, **RabbitMQ**, **SQS**) deliver **at-least-once** in normal production, meaning duplicates ALWAYS happen on rebalance or timeout—pair outbox publishing with a unique `event_id` deduplication table (`processed_events`) or idempotent upsert.',
        'Choose broker semantics deliberately: **Kafka** keeps an ordered append-only log split across partitions (`consumer_group` reads parallel partitions while maintaining per-key order for replay/analytics), whereas **RabbitMQ / SQS** excels at competing work queues with per-message ACK/NACK and priority/delay.',
        'Prevent backlogs from collapsing downstream workers with **backpressure**, prefetch caps, exponential retry topics, and **Dead-Letter Queues (DLQ)** capped by retry count (`max_attempts`).',
        'Never block an ordered partition indefinitely on one corrupt JSON payload: park toxic payloads into a **DLQ** with error context so healthy user events keep flowing.'
      ],
      code: `
-- --- 1. Outbox Table & Atomic Business Transaction (PostgreSQL) ---
CREATE TABLE orders (
    order_id    UUID PRIMARY KEY,
    user_id     BIGINT NOT NULL,
    total_idr   BIGINT NOT NULL,
    status      TEXT   NOT NULL
);

CREATE TABLE outbox_events (
    event_id      UUID        PRIMARY KEY,
    aggregate_id  TEXT        NOT NULL, -- partition key (e.g. user_id or order_id)
    event_type    TEXT        NOT NULL,
    payload       JSONB       NOT NULL,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    published_at  TIMESTAMPTZ
);

CREATE INDEX idx_outbox_unpublished ON outbox_events (created_at)
    WHERE published_at IS NULL;

-- Atomic commit: order AND event succeed or roll back together (zero dual-write gap)
BEGIN;
INSERT INTO orders (order_id, user_id, total_idr, status)
VALUES ('01948b10-0001-7000-8000-000000000042', 77, 250000, 'CONFIRMED');

INSERT INTO outbox_events (event_id, aggregate_id, event_type, payload)
VALUES (
    '01948b10-0002-7000-8000-000000000099',
    '77',
    'order.confirmed.v1',
    '{"order_id":"01948b10-0001-7000-8000-000000000042","total_idr":250000}'::jsonb
);
COMMIT;

-- --- 2. Outbox Poller with Concurrent Competing Workers (SKIP LOCKED) ---
-- Alternative to Debezium WAL CDC when starting lean without Connect cluster.
WITH next_batch AS (
    SELECT event_id
    FROM outbox_events
    WHERE published_at IS NULL
    ORDER BY created_at
    FOR UPDATE SKIP LOCKED
    LIMIT 100
)
UPDATE outbox_events o
SET published_at = now()
FROM next_batch b
WHERE o.event_id = b.event_id
RETURNING o.event_id, o.aggregate_id, o.event_type, o.payload;

-- --- 3. Consumer Dedup & DLQ (PostgreSQL idempotent consumer inbox) ---
CREATE TABLE processed_events (
    event_id      UUID PRIMARY KEY,
    consumer_name TEXT        NOT NULL,
    processed_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Consumer executes side effect + dedup insert in ONE local DB transaction:
BEGIN;
INSERT INTO processed_events (event_id, consumer_name)
VALUES ('01948b10-0002-7000-8000-000000000099', 'loyalty-points-svc')
ON CONFLICT (event_id) DO NOTHING;
-- Application checks affected rows: if 0 rows inserted, skip duplicate & ACK broker!
-- Otherwise award loyalty points inside the same transaction, then COMMIT.
COMMIT;

CREATE TABLE dead_letter_events (
    dlq_id        BIGSERIAL PRIMARY KEY,
    event_id      UUID        NOT NULL,
    topic         TEXT        NOT NULL,
    payload       JSONB       NOT NULL,
    error_reason  TEXT        NOT NULL,
    attempts      INT         NOT NULL,
    parked_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);
`,
      practice: "Open `VIZ.sysqueue`, enable `Dual-Write` mode and inject a broker outage—watch DB and Queue diverge—then switch to `Transactional Outbox` and recover cleanly. Finally inject a poison pill and step through retries until it parks in the `DLQ`.",
      teach: "Explain why `FOR UPDATE SKIP LOCKED` lets multiple outbox workers poll concurrently without locking each other, and compare Polling Outbox vs Debezium WAL CDC at high write throughput.",
      analogy: "The outbox is writing your outgoing letters inside your sealed accounting ledger before closing the page; the mail courier reads the ledger copy whenever the post office reopens—never losing an envelope even if the mail van broke down during checkout.",
      pitfalls: [
        'Publishing a Kafka event right after `COMMIT` without an outbox—process crash or network timeout permanently loses downstream emails, inventory updates, and analytics.',
        'Assuming "exactly-once delivery" means a SQL/API consumer can skip idempotency checks—network retries and consumer group rebalances still replay batches unless side effects + `processed_events` commit atomically.',
        'Leaving failed events at the head of an ordered partition retrying infinitely instead of routing poison payloads to a DLQ.'
      ],
      quiz: [
        { q: "Why does `FOR UPDATE SKIP LOCKED` matter when polling `outbox_events` across multiple relay workers?", a: ["It drops duplicates silently", "Each relay worker claims distinct unlocked rows without blocking behind another worker's transaction", "It bypasses PostgreSQL WAL", "It turns Kafka into RabbitMQ"], c: 1, why: "`SKIP LOCKED` distributes disjoint batches across concurrent relay instances instead of serializing everyone on row locks." },
        { q: "What advantage does **Debezium CDC** offer over SQL polling on `outbox_events` at 20,000 events/sec?", a: ["Eliminates need for any primary DB transaction", "Streams changes directly from the Postgres Write-Ahead Log without repeated `SELECT ... UPDATE` polling load", "Guarantees zero duplicate consumer reads without dedup", "Replaces all HTTP endpoints"], c: 1, why: "WAL-based CDC avoids polling queries hitting index pages under heavy write QPS while keeping sub-second publish latency." },
        { q: "If a consumer receives an `event_id` already present in `processed_events`, what should it do?", a: ["Crash and trigger a pager alert", "Skip the business side effect and acknowledge (commit offset) cleanly", "Insert a second row into `dead_letter_events`", "Restart Kafka"], c: 1, why: "Because the event was already committed earlier, acknowledging and skipping guarantees at-least-once delivery yields effectively-once state." }
      ]
    },
    {
      id: 'resilience', title: 'Resilience: timeouts, jittered backoff, circuit breakers, and bulkheads', level: 2, mins: 45, lang: 'go', viz: 'sysresilience',
      splits: [
        ['Exponential Backoff + Full Jitter', '// --- 1. Full Jitter'],
        ['Circuit Breaker (Closed/Open/Half-Open)', '// --- 2. Circuit Breaker'],
        ['Semaphore Bulkhead + Timeout', '// --- 3. Bulkhead']
      ],
      terms: [
        ['Full Jitter backoff', 'AWS Builders Library formula `sleep = rand[0, min(cap, base * 2^attempt)]`. Desynchronizes thousands of failing clients instead of letting aligned retries hammer a recovering dependency in lockstep waves.'],
        ['Circuit Breaker', 'State machine (`Closed -> Open -> Half-Open`) that fails fast immediately after error rate/count passes a threshold, sparing downstream servers from overload and callers from hanging threads.'],
        ['Bulkhead pattern', 'Bounded semaphore or separate worker pool per dependency so one slow third-party SMS gateway cannot consume every goroutine/thread needed for healthy checkout paths.']
      ],
      why: 'Retry loops without timeouts, jitter, or circuit breakers amplify a minor slowdown into a full retry storm that keeps the dependency down for hours. Every production outbound client needs bounded timeouts, jittered backoff with a retry budget, a circuit breaker, and bulkhead isolation.',
      points: [
        'Always propagate a strict end-to-end deadline via `context.WithTimeout` / per-hop budget; without a timeout, slow downstreams tie up caller pools indefinitely until upstream services cascade-crash.',
        'Never use fixed intervals or pure unjittered `2^attempt` backoff across fleet callers: all pods fail at `t = 0`, sleep identically for `1s`, `2s`, `4s`, and stampede the recovering server simultaneously (**Full Jitter** spreads `[0, window]`).',
        'Enforce a **retry budget** (e.g., max `20%` extra RPS over normal traffic): if 90% of requests already fail, retrying `3×` per call quadruples load right when capacity is lowest.',
        'Pair retries with a **Circuit Breaker**: `Closed` (healthy) trips to `Open` (fail fast in `0 ms`, zero downstream calls) for a cooldown duration, then tests 1–N canary calls in `Half-Open` before closing again.',
        'Isolate slow or flaky upstreams with **Bulkheads** (weighted semaphores or separate HTTP connection pools): when `/pdf-export` stalls, `/checkout` keeps its own reserved capacity.',
        'Only **retry idempotent operations** (`GET`, `HEAD`, `PUT`, `DELETE`, or `POST` carrying an `Idempotency-Key`); retrying non-idempotent charges risks double billing.'
      ],
      predict: {
        prompt: "Your payment gateway drops for `3 seconds` while `1,000` API requests are active. Every API caller retries up to `5` times with deterministic unjittered exponential backoff (`1s`, `2s`, `4s`, `8s`, `16s`). When the payment gateway restarts at `t = 3.1s`, what happens?",
        options: [
          "Traffic resumes smoothly at baseline QPS",
          "Synchronized retry waves (`1,000+` calls firing on exact `1s/2s/4s` ticks) crush the recovering gateway again (retry storm)",
          "The circuit breaker automatically upgrades gateway CPU",
          "Go drops retries automatically inside TCP"
        ],
        answer: 1,
        explain: "Deterministic backoff aligns thousands of callers onto identical wake-up spikes, while unlimited retries multiply total load (`5×`). AWS Builders' Library showed **Full Jitter** + **retry budgets** + **circuit breakers** break synchronized waves."
      },
      code: `
package main

import (
	"context"
	"errors"
	"fmt"
	"math/rand/v2"
	"sync"
	"time"
)

var (
	errCircuitOpen  = errors.New("circuit breaker open: fail fast")
	errBulkheadFull = errors.New("bulkhead full: load shed upstream call")
)

// --- 1. Full Jitter Backoff (AWS Builders' Library recommended formula) ---
func fullJitterBackoff(attempt int, base, capDelay time.Duration, rng *rand.Rand) time.Duration {
	shift := min(attempt, 10)
	upper := min(capDelay, base<<shift)
	if upper <= 0 {
		return 0
	}
	return time.Duration(rng.Int64N(int64(upper) + 1))
}

// --- 2. Circuit Breaker (Closed -> Open -> Half-Open) ---
type cbState int

const (
	stateClosed cbState = iota
	stateOpen
	stateHalfOpen
)

func (s cbState) String() string { return [...]string{"CLOSED", "OPEN", "HALF_OPEN"}[s] }

type CircuitBreaker struct {
	mu           sync.Mutex
	state        cbState
	failures     int
	threshold    int
	cooldown     time.Duration
	openedAt     time.Time
	halfInFlight bool
}

func NewCircuitBreaker(threshold int, cooldown time.Duration) *CircuitBreaker {
	return &CircuitBreaker{threshold: threshold, cooldown: cooldown}
}

func (cb *CircuitBreaker) Execute(fn func() error) error {
	cb.mu.Lock()
	switch cb.state {
	case stateOpen:
		if time.Since(cb.openedAt) < cb.cooldown {
			cb.mu.Unlock()
			return errCircuitOpen
		}
		cb.state = stateHalfOpen
		cb.halfInFlight = false
		fallthrough
	case stateHalfOpen:
		if cb.halfInFlight {
			cb.mu.Unlock()
			return errCircuitOpen
		}
		cb.halfInFlight = true
	}
	cb.mu.Unlock()

	err := fn()

	cb.mu.Lock()
	defer cb.mu.Unlock()
	if err != nil {
		cb.failures++
		if cb.state == stateHalfOpen || cb.failures >= cb.threshold {
			cb.state = stateOpen
			cb.openedAt = time.Now()
		}
		cb.halfInFlight = false
		return err
	}
	cb.failures = 0
	cb.state = stateClosed
	cb.halfInFlight = false
	return nil
}

// --- 3. Bulkhead + Per-Attempt Timeout ---
type Bulkhead struct{ sem chan struct{} }

func NewBulkhead(maxConcurrent int) *Bulkhead { return &Bulkhead{sem: make(chan struct{}, maxConcurrent)} }

func (b *Bulkhead) Run(ctx context.Context, fn func(context.Context) error) error {
	select {
	case b.sem <- struct{}{}:
		defer func() { <-b.sem }()
	default:
		return errBulkheadFull
	}
	return fn(ctx)
}

func main() {
	rng := rand.New(rand.NewPCG(7, 9))
	for attempt := range 4 {
		fmt.Printf("attempt=%d fullJitterDelay=%v\\n", attempt,
			fullJitterBackoff(attempt, 50*time.Millisecond, 1*time.Second, rng))
	}

	cb := NewCircuitBreaker(2, 30*time.Millisecond)
	bh := NewBulkhead(1)
	down := true
	call := func() error {
		ctx, cancel := context.WithTimeout(context.Background(), 20*time.Millisecond)
		defer cancel()
		return bh.Run(ctx, func(context.Context) error {
			return cb.Execute(func() error {
				if down {
					return errors.New("503 dependency timeout")
				}
				return nil
			})
		})
	}

	for i := 1; i <= 4; i++ {
		fmt.Printf("call %d -> err=%v state=%s\\n", i, call(), cb.state)
	}
	time.Sleep(35 * time.Millisecond)
	down = false
	fmt.Printf("after cooldown probe -> err=%v state=%s\\n", call(), cb.state)
}
`,
      practice: "Open `VIZ.sysresilience`, switch downstream health to `Outage (100% fail)`, click `Burst ×6` to trip `OPEN`, click `Advance Cooldown (+5s)` twice to reach `HALF_OPEN`, and compare `No Jitter` vs `Full Jitter` retry dispersion.",
      teach: "Explain why retrying **every** RPC layer in a deep 4-hop microservice call tree (`Service A -> B -> C -> D` each retrying `3×`) amplifies a small glitch into `81×` traffic—and where retry policy should actually live.",
      analogy: "A submarine separates hull compartments with watertight bulkheads so one breached room never sinks the ship; a circuit breaker flips open before overheating wires melt the whole building.",
      pitfalls: [
        'Configuring retries at EVERY microservice hop (`3 × 3 × 3 × 3 = 81×` request amplification) instead of once near the edge with a deadline budget.',
        'Retrying HTTP `400 Bad Request` or `401 Unauthorized` validation failures—only transient network/`429`/`503` failures warrant backoff retries.',
        'Sharing one global `http.Client` timeout-less pool across critical checkout calls and slow webhook deliveries.'
      ],
      quiz: [
        { q: "Why does AWS Builders' Library recommend **Full Jitter** over deterministic exponential backoff?", a: ["It doubles max throughput", "It spreads retry timestamps uniformly across `[0, cap]`, eliminating synchronized herd spikes", "It removes the need for timeouts", "It converts 503 into 200"], c: 1, why: "Without randomness, clients failing together retry together in lockstep waves." },
        { q: "In a 3-state Circuit Breaker (`Closed`, `Open`, `Half-Open`), what happens inside `Half-Open`?", a: ["All requests bypass timeouts", "Only limited probe requests execute to test if the dependency recovered before resetting to `Closed`", "Failures are permanently ignored", "Metrics flush to disk"], c: 1, why: "Half-Open sends small canary traffic; success closes the breaker while failure re-opens the cooldown timer immediately." },
        { q: "Which pattern directly stops a slow non-critical third-party webhook endpoint from exhausting all API server threads needed by `/login`?", a: ["Write-Back Cache", "Bulkhead (separate worker pools / concurrency semaphores per dependency)", "Geohashing", "Consistent Hashing"], c: 1, why: "Isolating concurrency budgets per dependency prevents one failing upstream from starving healthy endpoints." }
      ]
    },
    // ---------------- Expert ----------------
    {
      id: 'consistency', title: 'Distributed consistency: quorums, idempotency, sagas, and fencing tokens', level: 3, mins: 45, lang: 'go',
      splits: [
        ['Quorum Overlap (W + R > N)', '// --- 1. Quorum Store'],
        ['Idempotency-Key Middleware', '// --- 2. Idempotency-Key Middleware Store'],
        ['Kleppmann Fencing Token', '// --- 3. Kleppmann Fencing Token Storage Guard']
      ],
      terms: [
        ['Quorum (`W + R > N`)', 'Given `N` replicas, requiring writes to ack on `W` replicas and reads to query `R` replicas such that `W + R > N` guarantees at least one queried replica holds the latest committed version (`ver`).'],
        ['Idempotency-Key header', 'IETF-draft HTTP request header carrying a client-generated unique key so retried mutations return the cached original result (`409` or `422` if reused with a mismatched payload) rather than charging twice.'],
        ['Fencing Token', 'Monotonically increasing number handed out by a lock service/lease (`token=34`) on every grant; storage rejects any stale write carrying an older token (`33 <= 34`), preventing split-brain after a GC pause.']
      ],
      why: 'In distributed storage, leases expire during GC pauses, networks split cleanly down the middle, and mobile clients double-submit timed-out requests. Quorum intersections, strict idempotency keys, compensating sagas, and monotonic fencing tokens close those exact correctness holes.',
      points: [
        'Use Dynamo-style quorum tuning cleanly: for `N = 3`, `(W=2, R=2)` gives strong read-after-write overlap (`2 + 2 > 3`) and tolerates `1` dead replica on both reads and writes.',
        'Remember **version numbers / Lamport timestamps** break ties when read replicas disagree: `Get()` reads from `R` replicas, takes the highest `version`, and runs **read repair** if replicas lag behind.',
        'Accept the **PACELC** tradeoff: during a **P**artition choose **A**vailability (Dynamo/Cassandra eventual) or **C**onsistency (Spanner/Raft/Postgres sync), **E**lse in normal operation trade **L**atency vs **C**onsistency.',
        'For HTTP mutations, persist `(idempotency_key, payload_sha256, status, response_body)` inside the same local transaction as the domain mutation (Stripe / IETF `Idempotency-Key` pattern); reject payload mismatch with `422` and concurrent in-flight duplicates with `409`.',
        'Replace brittle distributed `2PC` across microservices with **Sagas**: Choreography (event-driven, loose coupling for <= 4 steps) or Orchestration (Temporal / state machine controller for complex workflows with explicit compensating actions like `RefundPayment` and `ReleaseStock`).',
        'Never trust a client-side lease timer alone (Martin Kleppmann warning): a worker paused in stop-the-world GC past lease expiry still thinks it holds the lock unless **storage validates a monotonic Fencing Token**.'
      ],
      predict: {
        prompt: "Worker A acquires a Redis Redlock lease (`TTL = 5s`, `fencing_token = 10`) and pauses for `8s` during a garbage-collection/OS freeze. At `t = 5.1s`, Redis expires A's lock and grants Worker B `fencing_token = 11`. Worker B writes file `v2` cleanly. At `t = 8s`, Worker A wakes up (still believing its lock is active) and writes stale `v1` unless storage checks tokens. What rejects Worker A cleanly?",
        options: [
          "Requiring Worker A to call `TTL` in Redis before writing",
          "Requiring storage to reject any write whose `fencing_token <= lastSeenToken` (`10 <= 11` -> rejected)",
          "Extending Worker A's lease to 30 seconds",
          "Turning off GC pauses across the network"
        ],
        answer: 1,
        explain: "As Martin Kleppmann demonstrated, time-based lock checks before I/O always have a race window after the check and before the storage write. Only storage-side enforcement of monotonic fencing tokens rejects zombie writers atomically."
      },
      code: `
package main

import (
	"crypto/sha256"
	"encoding/hex"
	"errors"
	"fmt"
	"net/http"
	"net/http/httptest"
	"strings"
	"sync"
)

// --- 1. Quorum Store (W + R > N ensures >= 1 fresh replica overlap) ---
type record struct {
	val string
	ver int64
}

type QuorumCluster struct {
	replicas []map[string]record
}

func NewQuorumCluster(n int) *QuorumCluster {
	r := make([]map[string]record, n)
	for i := range n {
		r[i] = make(map[string]record)
	}
	return &QuorumCluster{replicas: r}
}

func (q *QuorumCluster) Put(key, val string, ver int64, writeNodes []int) {
	for _, id := range writeNodes {
		if cur, ok := q.replicas[id][key]; !ok || ver > cur.ver {
			q.replicas[id][key] = record{val: val, ver: ver}
		}
	}
}

func (q *QuorumCluster) Get(key string, readNodes []int) (record, bool) {
	var best record
	found := false
	for _, id := range readNodes {
		if rec, ok := q.replicas[id][key]; ok && (!found || rec.ver > best.ver) {
			best, found = rec, true
		}
	}
	return best, found
}

// --- 2. Idempotency-Key Middleware Store ---
type cachedResp struct {
	reqHash string
	code    int
	body    string
}

type IdempotencyStore struct {
	mu      sync.Mutex
	records map[string]cachedResp
	charges int
}

func (s *IdempotencyStore) HandleCharge(key, payload string) (int, string) {
	sum := sha256.Sum256([]byte(payload))
	hash := hex.EncodeToString(sum[:])

	s.mu.Lock()
	defer s.mu.Unlock()
	if prev, ok := s.records[key]; ok {
		if prev.reqHash != hash {
			return http.StatusUnprocessableEntity, "idempotency key reused with different payload"
		}
		return prev.code, prev.body + " (replayed)"
	}
	s.charges++
	resp := fmt.Sprintf("charged#%d", s.charges)
	s.records[key] = cachedResp{reqHash: hash, code: http.StatusCreated, body: resp}
	return http.StatusCreated, resp
}

// --- 3. Kleppmann Fencing Token Storage Guard ---
type FencedStorage struct {
	lastToken int64
	value     string
}

func (fs *FencedStorage) Write(token int64, v string) error {
	if token <= fs.lastToken {
		return fmt.Errorf("rejected stale fencing token %d <= %d", token, fs.lastToken)
	}
	fs.lastToken = token
	fs.value = v
	return nil
}

var _ = errors.New // standard error pattern alongside HTTP handlers

func main() {
	// 1. N=3, W=2, R=2 => overlap at replica index 1 guarantees fresh read (ver=2)
	qc := NewQuorumCluster(3)
	qc.Put("bal:42", "$100", 1, []int{0, 1, 2})
	qc.Put("bal:42", "$80", 2, []int{0, 1}) // replica 2 temporarily misses write
	got, _ := qc.Get("bal:42", []int{1, 2})
	fmt.Printf("Quorum W=2,R=2,N=3 read -> val=%s ver=%d\\n", got.val, got.ver)

	// 2. Idempotency-Key replay vs mismatched payload rejection
	store := &IdempotencyStore{records: make(map[string]cachedResp)}
	mux := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		code, msg := store.HandleCharge(r.Header.Get("Idempotency-Key"), r.URL.RawQuery)
		w.WriteHeader(code)
		_, _ = w.Write([]byte(strings.TrimSpace(msg)))
	})
	for _, tc := range []struct{ key, q string }{{"k-9", "amt=50"}, {"k-9", "amt=50"}, {"k-9", "amt=99"}} {
		rec := httptest.NewRecorder()
		req := httptest.NewRequest(http.MethodPost, "/pay?"+tc.q, nil)
		req.Header.Set("Idempotency-Key", tc.key)
		mux.ServeHTTP(rec, req)
		fmt.Printf("Idempotency key=%s query=%s -> %d %s (totalCharges=%d)\\n", tc.key, tc.q, rec.Code, rec.Body.String(), store.charges)
	}

	// 3. Stale paused worker carrying token=10 rejected after worker B commits token=11
	fs := &FencedStorage{}
	fmt.Println("Worker B token=11 write err:", fs.Write(11, "commit-B"))
	fmt.Println("Zombie Worker A token=10 err:", fs.Write(10, "stale-A"), "| final=", fs.value)
}
`,
      practice: "Run `go run .` and test changing the Quorum `Get` slice to `[]int{2}` (`R=1` where `W+R = 3 <= N`): confirm how stale `ver=1 ($100)` slips through. Next, design a 3-step checkout Saga (`ReserveStock -> ChargeCard -> ConfirmOrder`) and name the exact compensating action for each step.",
      teach: "Contrast Orchestration vs Choreography Sagas, and explain Martin Kleppmann's fencing token proof showing why time-based Redis leases alone cannot protect critical writes.",
      analogy: "A fencing token works like sequentially numbered court seals stamped onto paperwork: even if an outdated clerk wakes up and mails yesterday's stamped #10 form after #11 was already filed, the clerk desk checks the number on the paper itself and tears up #10.",
      pitfalls: [
        'Setting `W=2, R=1` on `N=3` expecting strong reads (`2 + 1 <= 3`, leaving zero overlap with the remaining stale replica).',
        'Ignoring payload mismatches on `Idempotency-Key` retries—silently returning an old `$50` confirmation when a client changed the body to `$500` causes silent billing bugs.',
        'Implementing Sagas without idempotent compensating actions (`Refund` must tolerate duplicate triggers on retry!).'
      ],
      quiz: [
        { q: "In an `N = 5` replica cluster, if writes require `W = 3` acknowledgments, what minimum `R` guarantees at least one up-to-date replica participates in every read?", a: ["R = 1", "R = 2", "R = 3 (`3 + 3 = 6 > 5`)", "R = 5"], c: 2, why: "Strict quorum intersection requires `W + R > N`; with `N=5, W=3`, minimum `R` is `3`." },
        { q: "What HTTP status code should an idempotent `POST /payments` API return if a client reuses an existing `Idempotency-Key` with a DIFFERENT request payload?", a: ["200 OK", "422 Unprocessable Content (or 400/409 payload conflict)", "304 Not Modified", "503 Service Unavailable"], c: 1, why: "Reusing a key with altered parameters violates idempotency semantics (Stripe/IETF pattern returns `422` or `409`)." },
        { q: "Why does storage itself need to verify a monotonic fencing token?", a: ["To compress JSON", "Because the lock holder can stall (GC/network pause) between checking lease expiry and writing to storage", "To bypass TLS", "Because Raft has no leader"], c: 1, why: "Client-side lease checks suffer a TOCTOU race; checking `token > lastToken` atomically inside storage defeats zombie writers." }
      ]
    },
    {
      id: 'observability', title: 'Observability: OpenTelemetry traces, RED/USE, and SLO burn rates', level: 3, mins: 40, lang: 'yaml',
      splits: [
        ['OpenTelemetry Collector', '# --- 1. OTel Collector'],
        ['SRE Burn-Rate Alert Rule', '# --- 2. SLO Burn-Rate Alert']
      ],
      terms: [
        ['Three Pillars + Trace Context', 'Structured Logs (`trace_id` JSON), Metrics (`RED`/`USE`), and Distributed Traces linked across HTTP/gRPC hops via W3C `traceparent` (`00-<trace-id>-<span-id>-<flags>`).'],
        ['High-cardinality trap', 'Putting unbounded IDs (`user_id`, `order_id`, full URL paths) as Prometheus metric labels explodes time-series memory; put high-cardinality attributes in **logs and trace spans**, and route URL templates (`/orders/{id}`) in metrics.'],
        ['Multi-Window Multi-Burn-Rate', 'Google SRE alerting rule combining a fast burn rate (e.g. `14.4×` budget consumption) over BOTH a long window (`1h`) and a short confirmation window (`5m`) to catch severe outages immediately while auto-resolving fast.']
      ],
      why: 'Saying "CPU is 40% so the site is fine" misses silent 500 loops on `/checkout`; paging at `99.95%` availability over `1 minute` wakes engineers at 3 AM for two brief blips. Correlated W3C traces plus SRE error-budget burn-rate alerts tie paging directly to user pain.',
      points: [
        'Use **USE** (**Utilization, Saturation, Errors**) for infrastructure (CPU, NIC queue, disk IOPS, connection pool wait) and **RED** (**Rate, Errors, Duration histogram**) for every request-facing microservice.',
        'Aggregate latency using **histograms** (`le` buckets -> `histogram_quantile`) rather than client-averaged gauges—you cannot validly average two percentiles (`p99` across 10 pods is NOT the mean of per-pod `p99`s!).',
        'Propagate W3C **Trace Context** (`traceparent` header) from ingress proxy -> API -> message broker -> SQL spans so clicking a failing trace shows logs, slow queries, and downstream timeouts in one timeline.',
        'Sample smartly at scale: keep **100% of error and slow tail traces** (`status >= 500` or `latency > 500ms`) with OTel `tail_sampling` while downsampling boring `200 OK` health traffic to 1–5%.',
        'Alert on **error budget burn rate** (e.g., `14.4×` burns `2%` of a 30-day `99.9%` SLO in **1 hour** -> immediate page; `1×` slow leak opens a daytime ticket) using **short + long windows** so alerts clear rapidly once mitigated.',
        'Never attach `user_id`, `email`, or UUIDs to Prometheus labels; enforce low-cardinality route names (`/v1/orders/{id}`) and redact PII in OTel pipelines.'
      ],
      code: `
# --- 1. OTel Collector (pipelines: logs + traces + tail sampling) ---
receivers:
  otlp:
    protocols:
      grpc:
        endpoint: 0.0.0.0:4317
      http:
        endpoint: 0.0.0.0:4318

processors:
  memory_limiter:
    check_interval: 2s
    limit_mib: 512
  batch:
    send_batch_size: 4096
    timeout: 5s
  # Keep 100% of errors and slow >500ms traces; downsample healthy chatter
  tail_sampling:
    decision_wait: 10s
    num_traces: 50000
    policies:
      - name: always-keep-errors
        type: status_code
        status_code: { status_codes: [ERROR] }
      - name: keep-slow-tail
        type: latency
        latency: { threshold_ms: 500 }
      - name: sample-ok
        type: probabilistic
        probabilistic: { sampling_percentage: 5 }

exporters:
  otlphttp/tempo:
    endpoint: https://traces.internal:4318
  prometheusremotewrite:
    endpoint: https://metrics.internal/api/v1/write

service:
  pipelines:
    traces:
      receivers: [otlp]
      processors: [memory_limiter, tail_sampling, batch]
      exporters: [otlphttp/tempo]
    metrics:
      receivers: [otlp]
      processors: [memory_limiter, batch]
      exporters: [prometheusremotewrite]

# --- 2. SLO Burn-Rate Alert (Google SRE Book 99.9% SLO -> error budget = 0.001) ---
# Burn rate 14.4x consumes 2% of 30-day error budget in 1h (720h * 0.02 / 14.4 = 1h).
groups:
  - name: slo-checkout-availability
    rules:
      - alert: CheckoutHighErrorBudgetBurnPage
        expr: |
          (
            sum(rate(http_server_requests_total{service="checkout",code=~"5.."}[1h]))
            /
            sum(rate(http_server_requests_total{service="checkout"}[1h]))
          ) > (14.4 * 0.001)
          and
          (
            sum(rate(http_server_requests_total{service="checkout",code=~"5.."}[5m]))
            /
            sum(rate(http_server_requests_total{service="checkout"}[5m]))
          ) > (14.4 * 0.001)
        labels:
          severity: page
        annotations:
          summary: "Checkout burning 30d error budget at >= 14.4x rate (1h + 5m windows)"
`,
      practice: "Trace why the PromQL rule above checks BOTH `[1h]` AND `[5m]` (`and`). Compute what happens if you remove the `[5m]` clause after a real 5-minute outage is already fixed (how long would the page stay active?).",
      teach: "Explain high-cardinality label explosion in Prometheus metrics vs trace spans, and contrast RED vs USE dashboards.",
      analogy: "Checking your monthly SLA budget via burn rate is like checking a water tank leak rate: a hairline drip deserves an email tomorrow, whereas losing 2% of the month's water in 60 minutes sets off the siren now—and shuts off as soon as the 5-minute flow stops.",
      pitfalls: [
        'Storing `user_id` or raw URLs containing IDs in Prometheus labels, crashing TSDB memory with millions of active time series.',
        'Averaging per-instance `p99` latencies in Grafana instead of aggregating raw histogram bucket counters first (`sum by (le)` -> `histogram_quantile`).',
        'Logging unstructured plain text lines without W3C `trace_id`, forcing engineers to grep by timestamp across 12 services.'
      ],
      quiz: [
        { q: "Why does Google SRE pair a `1h` window AND a `5m` short window in a fast-burn page alert?", a: ["To double CPU usage", "So a resolved outage clears the alert within ~5 minutes instead of keeping on-call paged for a full hour", "Because Prometheus cannot compute 1h rates", "To drop 500 metrics"], c: 1, why: "Without the short confirmation window, the 1h rate stays elevated long after the fix deploys, wasting on-call focus." },
        { q: "Where should high-cardinality attributes such as `order_id` and `customer_id` be attached?", a: ["Prometheus metric labels", "Structured log fields and OpenTelemetry trace span attributes", "HTTP status codes", "DNS TXT records"], c: 1, why: "TSDBs index every unique metric label combination in RAM; trace spans and structured log indexes handle high cardinality cleanly." },
        { q: "What standard HTTP header links distributed traces cleanly across proxies and polyglot Go/C#/Node services?", a: ["`X-Custom-Debug`", "`traceparent` (W3C Trace Context)", "`Keep-Alive`", "`ETag`"], c: 1, why: "W3C Trace Context (`traceparent`) is universally supported across Envoy, NGINX, OpenTelemetry SDKs, and cloud gateways." }
      ]
    },
    {
      id: 'containers-k8s', title: 'Containers, Kubernetes HPA, PDBs, and graceful shutdown', level: 3, mins: 40, lang: 'yaml',
      splits: [
        ['Deployment, Probes & preStop Drain', '# --- 1. Deployment + Zero-Downtime Rolling Drain'],
        ['Autoscaling (HPA) & Disruption Budget', '# --- 2. HPA v2']
      ],
      terms: [
        ['Probes (`startup`/`readiness`/`liveness`)', '`startupProbe` guards slow boots; `readinessProbe` gates Service traffic from reaching warm-up/draining pods; `livenessProbe` restarts deadlocked containers (never couple liveness to external DB health!).'],
        ['`preStop` drain race', 'Kubernetes removes a terminating pod IP from kube-proxy `iptables`/EndpointSlices asynchronously while sending `SIGTERM`. Sleeping `5–10s` in `preStop` keeps listening briefly until proxy propagation finishes, yielding zero `502 Bad Gateway` rolls.'],
        ['`PodDisruptionBudget` (`PDB`)', 'Cluster contract (`minAvailable` or `maxUnavailable`) blocking voluntary node drains/upgrades from evicting too many replicas at once during maintenance.']
      ],
      why: 'Deploying stateless containers is easy until a rolling update drops 2% of live checkout requests with `502 Bad Gateway`, or an accidental DB hiccup triggers liveness-probe crash loops across every pod at once. Correct probes, drain hooks, HPA stabilization, and PDBs keep deployments zero-downtime.',
      points: [
        'Run Go/Node/C# binaries as **non-root minimal multi-stage images** (distroless or Alpine, `readOnlyRootFilesystem: true`) so cold pulls stay fast and CVE exposure stays tiny.',
        'Distinguish **`readinessProbe`** from **`livenessProbe`**: fail `readiness` (or stop serving traffic) if dependencies stall, but NEVER fail `liveness` on an external Postgres outage—restarting every pod when the DB blips adds startup floods on top of DB recovery.',
        'Always set CPU **`requests`** accurately for scheduler bin-packing; think twice before setting tight **CPU `limits`** on latency-sensitive services (Linux CFS quota throttling causes artificial 100ms tail pauses), while always bounding **memory `limits`** to catch leaks via OOMKill cleanly.',
        'Eliminate rolling-deploy `502` drops with a **two-step drain**: `preStop: sleep 10` buys time for Ingress/kube-proxy updates while the app closes keep-alives / marks `/readyz` false, then `SIGTERM` drains active requests cleanly inside `terminationGracePeriodSeconds`.',
        'Pair **`HorizontalPodAutoscaler` (`autoscaling/v2`)** with `scaleDown.stabilizationWindowSeconds: 300` so temporary traffic dips do not thrash pods up and down.',
        'Protect stateful and HA web pools with a **`PodDisruptionBudget` (`minAvailable: 2` or `maxUnavailable: 1`)** before enabling cluster autoscaler or kernel upgrades.'
      ],
      code: `
# --- 1. Deployment + Zero-Downtime Rolling Drain ---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: orders-api
spec:
  replicas: 4
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxUnavailable: 0 # spin up new ready pod BEFORE terminating an old one
      maxSurge: 1
  selector:
    matchLabels: { app: orders-api }
  template:
    metadata:
      labels: { app: orders-api }
    spec:
      terminationGracePeriodSeconds: 45
      securityContext:
        runAsNonRoot: true
        runAsUser: 65532
      containers:
        - name: api
          image: ghcr.io/acme/orders-api:1.18.0
          ports: [{ containerPort: 8080 }]
          resources:
            requests: { cpu: "250m", memory: "256Mi" }
            limits:   { memory: "512Mi" } # memory-bounded; omit strict CPU cap to prevent CFS tail stalls
          startupProbe:
            httpGet: { path: /healthz, port: 8080 }
            failureThreshold: 12
            periodSeconds: 5
          readinessProbe:
            httpGet: { path: /readyz, port: 8080 }
            periodSeconds: 5
          livenessProbe:
            httpGet: { path: /healthz, port: 8080 } # process liveness ONLY (no DB check here!)
            periodSeconds: 15
          lifecycle:
            preStop:
              exec:
                # Let kube-proxy / Ingress stop routing new connections BEFORE app exits
                command: ["sh", "-c", "sleep 10"]

---
# --- 2. HPA v2 (scale-up reactive, scale-down damped) & PDB ---
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: orders-api-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: orders-api
  minReplicas: 4
  maxReplicas: 24
  behavior:
    scaleDown:
      stabilizationWindowSeconds: 300 # hold capacity 5m after spike to prevent flapping
      policies:
        - type: Percent
          value: 25
          periodSeconds: 60
  metrics:
    - type: Resource
      resource:
        name: cpu
        target: { type: Utilization, averageUtilization: 65 }

---
apiVersion: policy/v1
kind: PodDisruptionBudget
metadata:
  name: orders-api-pdb
spec:
  maxUnavailable: 1 # cluster node upgrades never evict >1 replica simultaneously
  selector:
    matchLabels: { app: orders-api }
`,
      practice: "Audit the Deployment YAML above: why is `terminationGracePeriodSeconds: 45` paired with `preStop: sleep 10`, and why is `maxUnavailable: 0` inside `rollingUpdate` critical for a service whose `PodDisruptionBudget` already sets `maxUnavailable: 1`?",
      teach: "Explain the race condition during `kubectl rollout restart` between `SIGTERM` reaching the Go/Node process and Ingress removing that pod IP—and why hitting `/healthz` from `livenessProbe` with a `SELECT 1` DB check creates cascading outages.",
      analogy: "Stopping incoming traffic via `preStop` before turning off the server is like turning the restaurant's 'Closed' sign around 10 minutes before locking the front door so seated guests finish their meal instead of getting locked inside.",
      pitfalls: [
        'Wiring `livenessProbe` to check Redis or PostgreSQL connectivity—when Redis restarts for 15s, Kubernetes kills every healthy API container simultaneously.',
        'Omitting a `preStop` delay (or immediate `server.Shutdown` before EndpointSlice removal propagates), emitting transient `502` / connection resets on every deploy.',
        'Setting `replicas: 1` alongside a PDB `minAvailable: 1` (or `maxUnavailable: 0`), permanently blocking Kubernetes node upgrades.'
      ],
      quiz: [
        { q: "Why should `livenessProbe` almost NEVER query an external database or third-party service?", a: ["HTTP GET is unsupported on Kubernetes", "If the DB stalls briefly, Kubernetes restarts every API pod in a cascading crash loop even though the processes aren't deadlocked", "ReadinessProbe already restarts dead pods", "Liveness slows down Go GC"], c: 1, why: "Liveness answers 'is this process stuck beyond self-recovery?'; external dependency blips belong in Readiness or circuit breakers." },
        { q: "Why add `preStop: sleep 10` before a container handles `SIGTERM` during a rolling update?", a: ["To warm CPU caches", "Because EndpointSlice/kube-proxy propagation across cluster nodes is asynchronous, so packets can arrive briefly after termination begins", "To flush Go garbage collector", "To skip Readiness checks"], c: 1, why: "A short drain pause absorbs already-routed packets while load balancers remove the terminating pod IP." },
        { q: "What happens during a cluster node upgrade if a 1-replica Deployment has `PodDisruptionBudget` set to `minAvailable: 1`?", a: ["Kubernetes double-schedules it silently", "Node drain blocks indefinitely because evicting the sole pod violates the PDB", "HPA overrides the PDB", "The pod turns into a DaemonSet"], c: 1, why: "Keep >= 2 replicas before configuring `minAvailable: 1` / `maxUnavailable: 1`, otherwise voluntary drains stall." }
      ]
    },
    {
      id: 'toolbox', title: 'Tool selection matrix and composable system building blocks', level: 3, mins: 35, lang: 'go',
      splits: [
        ['Tool Decision Engine (Go)', '// --- 1. Workload Spec'],
        ['Minimal Stack Builder', '// --- 2. Stack Recommender']
      ],
      terms: [
        ['Boring technology principle', 'Dan McKinley principle: pick proven primary storage/tools you already know how to operate (often Postgres + Redis before adding 5 distributed systems) unless an explicit scale boundary proves otherwise.'],
        ['OLTP vs OLAP separation', 'Serve customer transactions in row-oriented OLTP (PostgreSQL/SQL Server); stream CDC/events into columnar OLAP (ClickHouse, BigQuery, DuckDB) when heavy analytical `GROUP BY` scans threaten checkout locks.'],
        ['Workflow engine vs Queue', 'Plain queues (SQS/RabbitMQ/Kafka) excel at single stateless events; durable workflow engines (Temporal, Durable Functions) manage multi-day stateful orchestration, timers, human approvals, and step compensation cleanly.']
      ],
      why: 'Great system designers never recite tool logos for their own sake—they start with constraints (QPS, ACID needs, query shape, retention, team size) and pick the smallest composable stack whose failure modes the team can operate at 3 AM.',
      points: [
        '**Primary OLTP (`< 20–50K` ops/sec on one region)**: **PostgreSQL** covers relational integrity, JSONB, partial indexes, SKIP LOCKED queues, and `pgvector` before you ever need Cassandra or Spanner.',
        '**Wide-column / Massive Write Scale / Predictable Key-Value**: **DynamoDB** or **Cassandra** when strict partition-key SLAs at hundreds of thousands of QPS outgrow single-primary writes and no complex ad-hoc joins are needed.',
        '**In-memory Cache / Ephemeral Counters**: **Redis / Valkey** for sub-ms `LRU/LFU` cache, rate-limiter Lua counters, sorted-set leaderboards, and pub/sub—not as your unbacked ledger.',
        '**Messaging**: **RabbitMQ / SQS** for routed task queues and delayed retries; **Kafka / Redpanda** for ordered immutable event logs consumed independently by multiple teams (billing, search indexing, ML, ClickHouse analytics).',
        '**Search & Geo**: **OpenSearch / Elasticsearch** or **Meilisearch** for BM25 full-text/facets synced via CDC; **PostGIS** or **Uber H3 + Redis** for radius matching.',
        '**Orchestration & Load Balancing**: **NGINX / Envoy / Cloud ALB** for TLS, rate limiting, and L7 routing; **OpenTelemetry + Prometheus/Grafana** for observability; **Temporal** when multi-step sagas span hours or retries need replayable history.'
      ],
      code: `
package main

import (
	"fmt"
	"strings"
)

// --- 1. Workload Spec ---
type Workload struct {
	Name              string
	PeakQPS           int
	NeedsACID         bool
	MultiTenantSaaS   bool
	FullTextSearch    bool
	HeavyAnalytics    bool
	MultiConsumerLog  bool
	MultiStepLongSaga bool
}

// --- 2. Stack Recommender (pick simplest boring stack that clears bottlenecks) ---
func RecommendStack(w Workload) []string {
	var stack []string
	stack = append(stack, "Edge: CDN + TLS proxy (Cloudflare/NGINX/Envoy) with rate limiting")

	if w.PeakQPS > 100_000 && !w.NeedsACID {
		stack = append(stack, "Primary DB: DynamoDB / Cassandra (partition-key scale, LWT sparingly)")
	} else if w.MultiTenantSaaS && w.PeakQPS > 25_000 {
		stack = append(stack, "Primary DB: PostgreSQL + PgBouncer + Read Replicas + Sharded by tenant_id")
	} else {
		stack = append(stack, "Primary DB: PostgreSQL + PgBouncer transaction pool (single primary + replica)")
	}

	if w.PeakQPS >= 3_000 {
		stack = append(stack, "Cache & Limits: Redis / Valkey (Cache-Aside + Single-Flight + Lua Token Bucket)")
	}
	if w.MultiConsumerLog {
		stack = append(stack, "Streaming: Transactional Outbox + Debezium CDC -> Kafka / Redpanda")
	} else {
		stack = append(stack, "Jobs: Outbox + SKIP LOCKED or RabbitMQ / SQS with DLQ")
	}
	if w.FullTextSearch {
		stack = append(stack, "Search: OpenSearch / Elasticsearch synced asynchronously from Outbox/CDC")
	}
	if w.HeavyAnalytics {
		stack = append(stack, "Analytics (OLAP): ClickHouse / BigQuery fed by stream — keep BI off OLTP!")
	}
	if w.MultiStepLongSaga {
		stack = append(stack, "Orchestration: Temporal durable workflows for stateful retries & compensation")
	}
	stack = append(stack, "Ops: OpenTelemetry W3C traces + Prometheus SLO burn-rate alerts + K8s HPA/PDB")
	return stack
}

func main() {
	examples := []Workload{
		{
			Name: "Lean FinTech Ledger (5k QPS)", PeakQPS: 5000,
			NeedsACID: true, HeavyAnalytics: true,
		},
		{
			Name: "Marketplace Platform (40k QPS)", PeakQPS: 40000,
			NeedsACID: true, MultiTenantSaaS: true, FullTextSearch: true,
			HeavyAnalytics: true, MultiConsumerLog: true, MultiStepLongSaga: true,
		},
	}
	for _, w := range examples {
		fmt.Printf("=== %s ===\\n- %s\\n\\n", w.Name, strings.Join(RecommendStack(w), "\\n- "))
	}
}
`,
      practice: "Run `go run .` and inspect why the `5k QPS` fintech ledger intentionally skips Kafka, Sharding, OpenSearch, and Temporal until requirements demand them. Add a third workload for your own target system (e.g., notification dispatcher or ride-hailing matcher) and justify every added component.",
      teach: "Defend keeping a lean system (`Postgres + PgBouncer + Redis + Outbox`) up to ~10–25K QPS instead of adopting Kafka + Cassandra + 12 microservices on day one—and state the exact bottleneck metrics that trigger each next upgrade.",
      analogy: "A master carpenter does not haul a CNC router onto every job site when a chisel and saw fit cleanly—every extra distributed box you deploy adds another pager rotation, schema sync lag, and failure mode.",
      pitfalls: [
        'Resume-driven architecture: deploying Kafka, Cassandra, Elasticsearch, and Istio service mesh for a 50-RPS internal app with a 3-person team.',
        'Picking a NoSQL store solely to "avoid schemas" on highly relational financial/billing workflows that actually need ACID multi-row transactions.',
        'Treating any tool list as permanent—re-benchmark bottleneck metrics every 2×–5× growth milestone.'
      ],
      quiz: [
        { q: "Why keep heavy BI reporting (`GROUP BY` across 12 months of invoices) out of your customer-facing PostgreSQL primary?", a: ["PostgreSQL lacks SQL `GROUP BY`", "Long analytical scans evict hot OLTP buffer pool pages and compete on CPU/I/O with live checkout traffic", "JSON cannot store dates", "CDNs block analytical queries"], c: 1, why: "Isolating heavy OLAP scans onto replicas or columnar stores (ClickHouse/BigQuery) protects live checkout tail latency." },
        { q: "When does **Temporal** (or a durable workflow engine) beat raw RabbitMQ/SQS queues?", a: ["For simple 1-step thumbnail resizing", "When multi-step business sagas span hours/days with timers, compensating actions, and deterministic state replay", "To cache images at the CDN edge", "To eliminate TCP handshakes"], c: 1, why: "Plain queues handle single async tasks cleanly, while multi-step sagas with timers and compensations become fragile ad-hoc state machines without a workflow engine." },
        { q: "Which database architecture matches an ACID financial wallet + modest `3,000 QPS` peak traffic with a small team?", a: ["64-shard Cassandra cluster", "PostgreSQL primary + synchronous/async replica + PgBouncer + Redis rate limits", "Elasticsearch primary ledger", "In-memory map only"], c: 1, why: "PostgreSQL handles ACID transactions cleanly at 3k QPS with vastly lower operational overhead than distributed NoSQL sharding." }
      ]
    }
  ]
});

