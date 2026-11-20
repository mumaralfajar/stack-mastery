// System Design track: 16 lessons from back-of-the-envelope math to distributed consensus and tool selection.
// Inside JS template literals, every backslash (\) and backtick (`) inside Go/SQL/YAML/HTTP code must be escaped (\\, \`).
TRACKS.push({
  id: 'sysdesign', name: 'System Design', lang: 'go',
  tagline: 'Architecture, caching, rate limiting, storage engines, sharding, queues, resilience, observability, and tool selection for scale.',
  lessons: [
    // ---------------- Beginner ----------------
    {
      id: 'thinking', title: 'Latency, throughput, and back-of-the-envelope math', level: 0, mins: 30, lang: 'go',
      terms: [
        ['Tail latency (`p95`, `p99`)', 'The response time 95% or 99% of requests stay under. Averages hide slow outliers that hurt checkout and login flows under load.'],
        ["Little's Law (`L = λW`)", 'Average active work in progress (`L`) equals arrival rate (`λ`) times average time in the system (`W`). Rising latency multiplies open connections even when QPS stays flat.'],
        ['Vertical vs horizontal scaling', 'Vertical scaling upgrades one machine with more CPU or RAM. Horizontal scaling adds stateless nodes behind a load balancer for higher capacity at extra coordination cost.']
      ],
      why: "System design starts with orders of magnitude before box diagrams. Before adding a cache or sharding a database, estimate request rate, storage growth, bandwidth, and how tail latency multiplies concurrency under Little's Law.",
      points: [
        "Latency measures one request's duration (`ms`), while throughput measures request volume (`RPS` or `QPS`). Adding worker replicas raises throughput without speeding up a single slow query.",
        'Measure `p50`, `p95`, and `p99` because averages hide outliers. A page making 10 parallel backend calls waits for the slowest one, putting 1% tail spikes on ~10% of loads (`1 - 0.99^10`).',
        'Keep hardware latencies in mind: RAM takes ~100 ns, and NVMe SSD takes ~100 µs. A same-AZ network trip takes ~0.5 ms, while cross-region takes 50 to 150 ms.',
        'One day has `86,400` seconds (~`100,000`), so 1 million events per day averages ~12 RPS. Provision 3× to 10× higher capacity for peak traffic bursts.',
        "Check concurrency with Little's Law (`L = λW`): at `2,000 RPS` and `50 ms` (`0.05 s`) latency, the server holds `100` in-flight slots. If DB locks push latency to `500 ms`, concurrency jumps to `1,000` and drains your connection pool.",
        'Test traffic assumptions with real load generators like `k6`, `bombardier`, or `NBomber` before sizing production clusters.'
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
      practice: "Save this file as `main.go` and run `go run .`. Edit `latencies` to hold twenty 15 ms responses plus one 900 ms DB lock pause. Compare `p50` to `p99`, then size the DB pool under Little's Law at `3,000` peak RPS.",
      teach: "Explain why two APIs with the same 25 ms average latency feel different in production. Walk through `L = λW` using a slow downstream query.",
      analogy: "A highway lane counts cars passing per hour (throughput), while trip time (latency) depends on speed and tollbooths. If booths stall for 30 seconds each, cars back up onto the ramp (`L = λW`) even at the same entry rate.",
      pitfalls: [
        'Sizing a cluster from daily average RPS (`daily / 86,400`) and forgetting peak bursts during login mornings, flash sales, or payroll runs.',
        'Reporting only average latency (`mean`), which hides `p99` spikes affecting real users.',
        'Adding CPU cores to an I/O-bound service when the bottleneck is connection-pool contention or cross-region network trips.'
      ],
      quiz: [
        { q: "At 1,000 RPS, a DB slowdown raises average response time from 20 ms to 400 ms. What happens to in-flight requests (`L = λW`)?", a: ["Stays at 20 because RPS is unchanged", "Drops from 20 to 1", "Jumps from 20 to 400, risking thread or connection exhaustion", "Halves to 10"], c: 2, why: "Under Little's Law (`L = λW`), `1,000 * 0.4 s` equals `400` concurrent in-flight requests up from `20`." },
        { q: "About how many requests per second is 8.6 million events per day on average?", a: ["10 RPS", "100 RPS", "1,000 RPS", "8,600 RPS"], c: 1, why: "Dividing `8,640,000` by `86,400` seconds gives `100 RPS` on average (around 12 RPS per 1 million daily events)." },
        { q: "Why does calling 10 independent microservices in parallel amplify tail latency?", a: ["Serialization doubles payload size", "The parent request waits for the slowest of the 10 responses", "HTTP/1.1 drops every tenth packet", "DNS caches expire per hop"], c: 1, why: "When each dependency has a 1% slow tail, calling 10 in parallel exposes roughly `1 - 0.99^10 ≈ 9.6%` of requests to a slow call." }
      ]
    },
    {
      id: 'networking', title: 'DNS, CDNs, reverse proxies, and load balancers', level: 0, mins: 35, lang: 'yaml',
      splits: [
        ['NGINX Edge Proxy', '# --- 1. NGINX'],
        ['Envoy Cluster + Outlier', '# --- 2. Envoy']
      ],
      terms: [
        ['L4 vs L7 load balancer', 'L4 routes TCP/UDP packets by IP and port at high speed. L7 terminates TLS and reads HTTP headers, paths, and gRPC frames for smart routing.'],
        ['Active vs passive health checks', 'Active checks poll `/readyz` on a schedule (built into Envoy and NGINX Plus). Passive checks (Outlier Detection) eject backends after consecutive 5xx errors or timeouts.'],
        ['HTTP/3 (QUIC)', 'Multiplexes streams over UDP with 0-RTT or 1-RTT handshakes. A lost packet stalls only its own stream, avoiding TCP head-of-line blocking on mobile links.']
      ],
      why: "Every request crosses DNS, TLS termination, and at least one reverse proxy or load balancer before reaching your app. Bad edge timeouts, buffering, or health checks break streaming APIs and overload struggling instances.",
      points: [
        'Put Anycast DNS and a CDN (Cloudflare, AWS CloudFront) in front to terminate TLS near users and serve static assets from the edge.',
        'Pair L4 balancing (AWS NLB, IPVS) for raw throughput with L7 balancing (NGINX, Envoy, HAProxy, AWS ALB) for path routing and rate limiting.',
        'Match the balancing algorithm to request duration. Round Robin fits fast uniform endpoints, while Least Connections or Power of Two Random Choices (`P2C`) protects endpoints with uneven latency.',
        'Combine active `/readyz` checks with passive Outlier Detection (like ejecting a backend after 5 straight 5xx errors in Envoy). Unhealthy pods leave fast.',
        'Watch NGINX proxy defaults: open-source NGINX omits active health checks without NGINX Plus and turns `proxy_buffering on` by default, stalling SSE. Set a longer `proxy_read_timeout` so idle WebSockets stay open past 60 seconds.',
        'Enable HTTP/3 (QUIC) at the edge (NGINX `ngx_http_v3_module` with `Alt-Svc`, or Envoy QUICHE) to avoid TCP head-of-line stalls on lossy mobile links.'
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
      practice: "Compare the two blocks with your app edge. Map where TLS terminates and turn off proxy buffering on streams. Pick a `max_ejection_percent` that keeps capacity up during partial outages.",
      teach: "Compare an L4 load balancer with an L7 proxy like Envoy. Explain why combining active `/readyz` checks with passive Outlier Detection beats using only one.",
      analogy: "An L4 balancer waves trucks into lanes by license plate without looking inside. An L7 proxy reads the manifest to route priority freight, hold back broken trucks, and hand out cached flyers at the gate.",
      pitfalls: [
        'Wiring `/health` checks that miss core dependencies, or failing readiness on optional dependency blips so the balancer ejects every healthy instance.',
        'Using Round Robin when response times span 2 ms to 4 s, piling slow requests onto one overloaded server.',
        'Putting an L7 proxy with default `proxy_buffering on` in front of an SSE stream so events sit in memory until the buffer fills.'
      ],
      quiz: [
        { q: "Why does Envoy's `max_ejection_percent: 50` protect a cluster during a short network spike?", a: ["It compresses 50% of JSON bodies", "It stops Outlier Detection from ejecting every backend host at once during a brief glitch", "It caps CPU usage at 50%", "It forces an HTTP/3 downgrade"], c: 1, why: "Capping ejections keeps half of your capacity online when every instance logs brief errors at once." },
        { q: "Which default NGINX setting stalls Server-Sent Events (SSE)?", a: ["Disabled gzip compression", "`proxy_buffering on`, which batches response chunks before flushing to clients", "Least Connections routing", "TLS 1.3 resumption"], c: 1, why: "SSE clients expect immediate event chunks. Setting `proxy_buffering off` stops NGINX from holding small chunks in memory." },
        { q: "Why does HTTP/3 (QUIC) beat HTTP/2 on packet-loss-prone mobile networks?", a: ["No encryption overhead", "UDP-based streams isolate packet loss to the affected stream without stalling others", "Larger TCP congestion windows", "Stateless DNS lookups"], c: 1, why: "In HTTP/2 over TCP, one lost packet blocks every multiplexed stream until retransmitted. QUIC limits the wait to that single stream." }
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
        ['Idempotency key', 'A client-generated ID (IETF `Idempotency-Key` header) stored with the response so retried `POST` requests replay the first result without running side effects twice.'],
        ['Cursor vs offset pagination', 'Offset (`OFFSET 10000`) scans and discards rows, and page boundaries shift as new rows arrive. Cursor pagination seeks directly using `WHERE (created_at, id) < (@ts, @id)`.'],
        ['gRPC vs REST', 'gRPC pairs HTTP/2 multiplexing with binary Protocol Buffers for fast service-to-service contracts. REST/JSON prioritizes browser compatibility, HTTP caching, and readability.']
      ],
      why: "Picking the wrong communication pattern causes double-charges on retries, duplicate feed items during pagination, or servers wasting RAM on idle open sockets.",
      points: [
        'Use REST/JSON at public edges for broad client tooling and CDN caching. Use gRPC internally when typed `.proto` contracts, binary payloads, and HTTP/2 streams lower latency and CPU.',
        'Protect non-idempotent `POST` and `PATCH` calls from network retries with the IETF `Idempotency-Key` header, enforced by a unique constraint `(idempotency_key)` in storage.',
        'Use keyset cursor pagination (`?after=2026-11-19T08:00:00Z,9842`) on live feeds and ledgers. New inserts never cause skipped or duplicate items, and deep pages stay `O(log n)`.',
        'Pick Server-Sent Events (SSE) for one-way server-to-client feeds because browsers reconnect automatically with `Last-Event-ID`. Reserve WebSockets for true bidirectional traffic like chat or live collaboration.',
        'Use short polling, long polling, or webhooks when updates arrive minutes apart so you avoid keeping idle persistent sockets open.'
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
      practice: "Trace a mobile checkout retry when the client times out after commit. List all columns for `orders` or `idempotency_records` (key, request hash, HTTP status, serialized response, `expires_at`). Explain how you handle reused keys with new payloads.",
      teach: "Compare Short Polling, Long Polling, Server-Sent Events, and WebSockets across connection count, firewall compatibility, auto-reconnect, and message direction.",
      analogy: "REST is mailing tracked letters, and gRPC is a pneumatic tube between office desks. SSE is a radio broadcast resuming at `Last-Event-ID`, while WebSockets hold an open two-way phone line.",
      pitfalls: [
        'Accepting an existing `Idempotency-Key` with a different JSON payload without returning `422 Unprocessable Content`, hiding client key-reuse bugs.',
        'Using `OFFSET` pagination on an active timeline (`OFFSET 50000`), wasting DB I/O and showing duplicate rows when new items arrive.',
        'Choosing WebSockets for one-way live scoreboards or progress bars when SSE over plain HTTP/2 works with fewer proxy issues.'
      ],
      quiz: [
        { q: "You only need to stream real-time stock ticks from the server to browsers, with automatic reconnect on drops. Which protocol fits best?", a: ["WebSockets", "Server-Sent Events (SSE)", "Short polling every 50 ms", "SMTP"], c: 1, why: "SSE runs over standard HTTP, reconnects automatically, and resumes with `Last-Event-ID` without stateful bidirectional handshake overhead." },
        { q: "Why reject a retried `POST` carrying an existing `Idempotency-Key` if its request body differs from the first call?", a: ["HTTP/2 forbids duplicate keys", "Reusing one key for a different payload exposes a client bug that can return the wrong cached response", "Redis expires hashes on mismatch", "JSON parsers disallow POST retries"], c: 1, why: "Comparing a payload hash ensures one key maps to one logical operation and flags mismatches with HTTP 422." },
        { q: "Why does cursor pagination beat `OFFSET 20000` on large tables?", a: ["Offset deletes old rows", "Cursor seeks directly using an indexed predicate (`WHERE (ts, id) < ...`) in O(log n) and skips scanning discarded rows", "Cursor compresses JSON payloads", "Offset locks the entire table"], c: 1, why: "`OFFSET 20000` forces the database to read and discard 20,000 rows, while a keyset cursor jumps straight to the next key." }
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
        ['Cache-Aside (Lazy Loading)', 'The app checks the cache first. On a miss, it queries the database, populates the cache, and returns the value so only hot data uses RAM.'],
        ['Write-Through vs Write-Behind', 'Write-Through updates cache and DB synchronously for fresh reads at slower write speed. Write-Behind buffers writes in cache and flushes asynchronously for fast writes, risking data loss on a crash.'],
        ['Eviction policies (`LRU`, `LFU`)', 'LRU drops the key untouched longest. LFU tracks access frequency with a logarithmic counter in Redis so rare batch scans do not evict popular items.']
      ],
      why: "Caching cuts read latency from milliseconds to microseconds and absorbs read load off your database. Bad invalidation or eviction rules, however, serve stale data, fill RAM, or slow down writes.",
      predict: {
        prompt: "Thread A reads `sku:42` on a cache miss (DB holds price `100`). Before Thread A writes Redis, Thread B updates DB to `120` and deletes `sku:42` in Redis. Then Thread A writes `100` into Redis with a 10-minute TTL. What do readers see for the next 10 minutes?",
        options: [
          "120, because Thread B deleted the key last",
          "100 (stale value), because Thread A overwrote the deleted key with older data",
          "A Redis transaction error aborts Thread A",
          "Cache miss on every read until DB restarts"
        ],
        answer: 1,
        explain: "Thread A fetched `100` before Thread B wrote `120`, then wrote Redis afterward. That classic Cache-Aside race leaves stale data until the TTL expires, which is why keys need bounded TTLs plus versioning or CDC invalidation."
      },
      points: [
        'Layer caches closest to callers first: browser HTTP cache, CDN edge (`s-maxage`), and L1 RAM (HybridCache or `ristretto`). Add Redis or Valkey as shared L2 RAM.',
        'Set RFC 9111 HTTP headers on public reads: `Cache-Control: public, max-age=60, s-maxage=300, stale-while-revalidate=30`, `ETag` (`304 Not Modified`), and `Vary`. Never put `Cache-Control: public` on responses personalized by auth or cookies.',
        'Pick write strategies for your consistency tolerance. Cache-Aside fits read-heavy apps, Write-Through enforces immediate freshness, and Write-Behind fits high-volume analytics counters where losing buffered tail writes on a crash is acceptable.',
        'Choose Redis `maxmemory` eviction deliberately: use `allkeys-lru` for general caches, `allkeys-lfu` when batch scans pollute recency, and avoid default `noeviction` on caches.',
        'Every cache key needs three decisions upfront: a deterministic schema (`sku:42:v2`), a bounded TTL with jitter, and an invalidation path.'
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
      practice: "Run the Go sample with `go run .` and open `VIZ.syscache`. Switch eviction from `LRU` to `LFU`, read key `A` three times and `B`/`C`/`D` once, and check which key survives eviction.",
      teach: "Compare Cache-Aside, Write-Through, and Write-Behind using a product price or view counter. Explain what happens when Redis restarts under each pattern.",
      analogy: "A cache keeps fast-moving items on a front counter (`LRU` or `LFU`) so staff skip walking to the warehouse on every order. A `TTL` forces periodic shelf checks.",
      pitfalls: [
        'Setting `Cache-Control: public` or omitting `Vary: Authorization` on user-specific responses, causing a CDN to serve User A\'s profile to User B.',
        'Leaving Redis `maxmemory-policy` at `noeviction` on a cache cluster so writes fail once RAM fills.',
        'Relying only on manual cache deletes without a TTL, leaving stale entries forever after one missed delete.'
      ],
      quiz: [
        { q: "Why can `allkeys-lfu` beat `allkeys-lru` when a nightly report scans 50,000 old items?", a: ["LFU compresses keys automatically", "LFU tracks access frequency, so one-off cold scans don't evict frequently used hot keys", "LRU blocks reads during eviction", "LFU guarantees strong consistency"], c: 1, why: "A batch scan floods the recent end of an LRU list, while LFU keeps frequently hit items intact." },
        { q: "Which RFC 9111 `Cache-Control` directive lets a CDN serve slightly expired data while refreshing it in the background?", a: ["`no-store`", "`must-revalidate`", "`stale-while-revalidate`", "`private`"], c: 2, why: "`stale-while-revalidate=N` hides origin revalidation latency from visitors inside the grace window." },
        { q: "When is Write-Behind caching a risky choice?", a: ["View counters and analytics", "Immutable static thumbnails", "Account balances or inventory writes where losing buffered cache on a crash drops committed updates", "DNS records"], c: 2, why: "Write-Behind acknowledges the write before flushing to persistent storage, so a cache crash drops buffered changes." }
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
        ['Cache stampede (dog-piling)', 'Concurrent requests miss an expired hot key at the exact same moment and send duplicate queries to recompute the identical value.'],
        ['Cache penetration', 'Lookups for keys missing in both cache and DB (like invalid IDs `-1` or scan bots) skip the cache every time and overload the database.'],
        ['Cache avalanche', 'Many keys expire at once or a cache shard drops, sending sudden traffic spikes straight to the database.']
      ],
      why: "A cache that handles 50× normal load can still crush your database in seconds. That happens when a hot key expires during peak traffic, bots query missing IDs, or every TTL expires on the hour.",
      predict: {
        prompt: "Your homepage banner expires at `12:00:00`. At `12:00:00.010`, 500 concurrent requests miss Redis and call `db.GetBanner()` in parallel before updating Redis. Without coalescing, how many DB queries fire at `12:00:00`?",
        options: [
          "1 query, because Redis locks the missing key",
          "Up to 500 identical DB queries while the first fetch is still in flight",
          "0 queries, because Cache-Aside serves stale data automatically",
          "Exactly 2 queries (primary + replica)"
        ],
        answer: 1,
        explain: "All 500 cache reads see a miss before the first caller writes back to Redis, sending a 500× herd straight to the database."
      },
      points: [
        'Stop cache stampedes by coalescing concurrent misses per key with singleflight (`golang.org/x/sync/singleflight` in Go, `HybridCache` in .NET), serving stale-while-refreshing, or using XFetch early expiration.',
        'Stop cache avalanches by adding random TTL jitter (`baseTTL + rand(0, 20%)`) so keys warmed during a deploy expire at staggered times. Pair jitter with circuit breakers and multi-AZ replicas.',
        'Stop cache penetration on invalid IDs with negative caching (`""` or `__NULL__` for 30 to 60 seconds). Place a Bloom filter ahead of DB reads.',
        'Prevent viral hot keys from saturating one Redis shard. Add a 1 to 5 second L1 app cache, or salt read keys across shards (`sku:42#0..3`).',
        'Attach context timeouts to negative caches and singleflight calls so one stuck rebuild never hangs 500 waiting callers.'
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
      practice: "Run `go run .` to watch 25 concurrent callers trigger `dbCalls=1`. Remove the `SingleFlight` wrapper in a copy and run it again to observe `dbCalls=25`. Check how a Bloom filter false positive still falls back to a DB read plus a negative cache entry.",
      teach: "Draw the difference between a Cache Stampede, Cache Penetration, and a Cache Avalanche. Name one primary mitigation and one trade-off for each.",
      analogy: "Singleflight is twenty roommates noticing an empty milk carton and sending one shopper for the whole apartment. A Bloom filter is a door guest list that turns away non-members before checking the ledger.",
      pitfalls: [
        'Expecting a Bloom filter to have zero false positives or support deletes directly. Standard filters guarantee zero false negatives only, so deletes need a Counting Bloom Filter or periodic rebuild.',
        'Caching negative results without a cap on key count or a short TTL, letting random missing IDs evict valid cache keys.',
        'Running singleflight without a timeout so one stalled DB call hangs every waiting caller.'
      ],
      quiz: [
        { q: "What does a standard Bloom filter guarantee with 100% certainty?", a: ["That a key definitely exists in the DB", "If the filter returns `false`, the key definitely does NOT exist", "Zero false positives", "O(1) key deletion"], c: 1, why: "Bloom filters never produce false negatives. If any hashed bit is 0, the key was never inserted." },
        { q: "Which technique stops one flash-sale SKU from saturating a single Redis shard when hit rate is already 99.9%?", a: ["Longer Redis RDB snapshots", "Switching to Fixed Window limits", "L1 local in-memory micro-cache (1s TTL) or salting read keys (`sku:42#0..N`)", "Turning off eviction"], c: 2, why: "A hot key hits one Redis shard on every read. Absorbing reads in L1 app RAM or spreading reads across salted keys removes that single-shard bottleneck." },
        { q: "Why add 10% to 20% random jitter to cache TTLs during bulk warm-up?", a: ["To stop an entire batch of keys from expiring at the same moment (cache avalanche)", "To shrink key memory usage in Redis", "To enforce LRU ordering", "To bypass CDN Origin Shield"], c: 0, why: "Jitter spreads expiration across minutes so background rebuilds stay steady without spiking together." }
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
        ['Token Bucket', 'Refills tokens at rate `r` up to burst capacity `b`. Allows brief bursts up to `b` while enforcing long-run rate `r` in `O(1)` memory.'],
        ['Sliding Window Counter', 'Combines `prevCount * overlapWeight + currCount` across two adjacent buckets. Gives near-exact accuracy using `O(1)` memory per client.'],
        ['IETF `RateLimit` headers', 'Standardizes `RateLimit-Policy` (quota rules) and `RateLimit` (remaining quota and reset) in place of `X-RateLimit-*`, paired with `429 Too Many Requests` and `Retry-After`.']
      ],
      why: "Without rate limiting and load shedding, one buggy retry loop or scraper drains your API pool and starves real users. Each algorithm balances boundary fairness against RAM and burst smoothness.",
      predict: {
        prompt: "An API enforces a Fixed Window limit of `100` requests per minute resetting at `:00` seconds. A client sends `100` requests at `12:00:58` and `100` more at `12:01:01`. How many succeed inside that 4-second span?",
        options: [
          "100 requests total, because the rate limiter tracks the last 60 seconds",
          "200 requests succeed (2× the allowed rate across the minute boundary)",
          "101 requests succeed before backoff triggers",
          "0 requests succeed because clocks drift"
        ],
        answer: 1,
        explain: "Fixed Window resets its counter at `12:01:00`, letting a client burst `2×` the limit across the minute seam. Sliding Window Counter, Token Bucket, or GCRA closes that gap."
      },
      points: [
        'Match algorithms to needs: Fixed Window (tiny RAM, 2× edge burst) and Sliding Window Log (exact, stores every timestamp). Sliding Window Counter, Token Bucket, and Leaky Bucket (or GCRA) keep `O(1)` state without edge bursts.',
        'Across distributed API pods, never run `GET` then `SET` in app code because racing pods over-admit. Run check-and-decrement atomically inside a Redis Lua script (`EVALSHA`) or `INCR` plus `EXPIRE`.',
        'Return `429 Too Many Requests` with `Retry-After` and IETF `RateLimit-Policy` / `RateLimit` headers. Under RFC 9111, clients must ignore `RateLimit` headers on cached hits (`Age > 0`).',
        'Pick failure behavior per route: fail open on search if Redis drops, and fail closed on login or OTP checks.',
        'Pair per-client rate limits (`429`) with server-wide load shedding (`503 Service Unavailable`). Drop low-priority requests before CPU or queue saturation collapses `p99` for everyone.'
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
      practice: "Open `VIZ.sysratelimit` and run the `:09` boundary burst test (`Jump to :09` -> `Burst ×4` -> `Advance +2s` -> `Burst ×4`). Watch Fixed Window admit `2×` the limit while Sliding Window Counter, Token Bucket, and Leaky Bucket reject excess requests.",
      teach: "Explain why distributed rate limiters execute check-and-decrement inside a single Redis Lua script or atomic command. Contrast Token Bucket with Leaky Bucket.",
      analogy: "A Token Bucket is a subway fare card holding up to `b` rides refilled hourly so a small group can swipe through at once. A Leaky Bucket is a mechanical turnstile clicking at one fixed beat.",
      pitfalls: [
        'Reading a Redis counter in Go, checking `< limit`, and sending `INCR` in a second round trip. Concurrent requests pass the check together under load.',
        'Returning `429` without `Cache-Control: no-store`, or forgetting that cached `Age > 0` responses hold stale `RateLimit` headers.',
        'Partitioning strictly by IP behind corporate NAT or mobile CGNAT proxies, throttling thousands of unrelated users together.'
      ],
      quiz: [
        { q: "Which rate-limiting approach prevents a client from bursting twice the quota across `:59` and `:01` while still keeping `O(1)` memory per user?", a: ["Fixed Window Counter", "Sliding Window Counter", "No-eviction Redis log", "HTTP ETag caching"], c: 1, why: "Sliding Window Counter weights the prior window's count by overlap fraction, smoothing the window seam with two integers per user." },
        { q: "According to the IETF RateLimit headers draft and RFC 9111, how should clients treat `RateLimit` headers on a cached response (`Age > 0`)?", a: ["Double the remaining quota", "Ignore `RateLimit` headers on cached responses", "Force a retry with `Retry-After: 0`", "Store them in localStorage forever"], c: 1, why: "Cached headers reflect origin state when stored, not live quota, so clients ignore them on cache hits (`Age > 0`)." },
        { q: "What distinguishes rate limiting (`429`) from load shedding (`503`)?", a: ["429 enforces per-client quotas, while 503 drops excess total traffic to save server health", "429 is for TCP, 503 is for UDP", "503 only runs in CDNs", "429 retries automatically in browsers"], c: 0, why: "Rate limiting isolates noisy tenants. Load shedding protects global server health (CPU, RAM, or queue depth) when total capacity fills up." }
      ]
    },
    {
      id: 'storage', title: 'Storage engines and database selection: B-Tree vs LSM-Tree', level: 1, mins: 35, lang: 'go',
      splits: [
        ['Mini LSM-Tree (MemTable + WAL)', '// --- 1. LSM MemTable'],
        ['Database Selection Matrix', '// --- 2. Database Matrix']
      ],
      terms: [
        ['B-Tree storage engine', 'Mutable fixed-size pages (for example, 8 KB in Postgres and SQL Server) updated in place. Fast for reads and ranges, with page splits on random writes.'],
        ['LSM-Tree (Log-Structured Merge)', 'Appends writes sequentially to a WAL and sorted in-memory MemTable, then flushes immutable SSTables to disk. Fast for writes, reading MemTable plus Bloom filters and SSTables.'],
        ['Write vs Read amplification', 'Write amplification counts bytes written to disk per logical write (such as LSM compaction). Read amplification counts file lookups needed per key read across SSTable levels.']
      ],
      why: "Database strengths trace back to their disk engine. PostgreSQL excels at mixed transactional queries while Cassandra ingests massive write streams because B-Trees mutate pages in place while LSM-Trees append immutable SSTables.",
      points: [
        'B-Tree engines (PostgreSQL, SQL Server, MySQL InnoDB) give low-variance point reads and sorted range scans down one tree path. Heavy random inserts pay page-split and random-I/O costs.',
        'LSM-Tree engines (RocksDB, Cassandra, ScyllaDB, Pebble) turn random writes into sequential WAL and MemTable appends. They flush immutable SSTables that compact later in the background.',
        'Because LSM reads check the MemTable plus multiple SSTable levels, engines attach a Bloom filter per SSTable to skip files that definitely lack a key.',
        'Pick data stores by access pattern: relational OLTP for ACID joins, MongoDB for documents, or Redis and DynamoDB for key speed. Use ClickHouse for analytics and S3 for media.',
        'Keep large binaries like images and PDFs out of SQL tables. Store metadata and URIs in SQL, and stream files directly to object storage like S3 or MinIO.'
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
      practice: "Trace `Put(\"user:1\", \"<TOMBSTONE>\")` in the Go LSM demo. Deleting a key *adds* data until compaction merges SSTables, unlike deleting rows on an 8 KB B-Tree page.",
      teach: "Compare B-Tree and LSM-Tree storage engines across write behavior, read lookup steps, and compaction or vacuum overhead.",
      analogy: "A B-Tree is a sorted filing cabinet where new folders force drawer splits. An LSM-Tree drops notes onto a scratchpad in order and alphabetizes the stacks overnight during compaction.",
      pitfalls: [
        'Assuming NoSQL removes schema work. Denormalized documents push schema validation and migration checks into your application code.',
        'Letting background LSM compaction saturate NVMe IOPS during daytime traffic, spiking read tail latency.',
        'Picking distributed NoSQL on day one when ACID joins and 5,000 RPS fit on one PostgreSQL or SQL Server node.'
      ],
      quiz: [
        { q: "Why does an LSM-Tree handle heavier sustained write traffic than a traditional B-Tree?", a: ["It skips durability and drops the WAL", "Writes append sequentially to the WAL and MemTable, avoiding random 8 KB in-place page splits", "It stores all tables in CSS", "It avoids sorting keys forever"], c: 1, why: "Sequential WAL appends and RAM MemTable flushes avoid random read-modify-write I/O across B-Tree pages." },
        { q: "How does an LSM-Tree delete a record across immutable SSTables?", a: ["Overwrites bytes in place with zeros", "Appends a tombstone marker so older versions drop during compaction", "Rebuilds the whole database synchronously", "Uses SQL triggers"], c: 1, why: "SSTables never mutate on disk. Deletes append a tombstone marker that shadows older entries until compaction runs." },
        { q: "Where should 2 MB user-uploaded KYC PDFs live in a loan or order system?", a: ["Inside PostgreSQL BYTEA or SQL Server VARBINARY(MAX) columns", "Base64-encoded inside Redis strings", "In S3 or MinIO object storage with time-limited presigned URLs and SQL metadata", "Inside browser cookies"], c: 2, why: "Object storage handles large blobs cheaply with direct uploads, keeping SQL backups and RAM buffer pools small." }
      ]
    },
    {
      id: 'search-geo', title: 'Search engines and spatial indexing: inverted indexes, BM25, and H3', level: 1, mins: 35, lang: 'go',
      splits: [
        ['Inverted Index + BM25', '// --- 1. Inverted Index'],
        ['Geohash Proximity Encoding', '// --- 2. Geohash']
      ],
      terms: [
        ['Inverted index', 'Maps normalized tokens (`"coffee"`) to sorted posting lists of document IDs. Elasticsearch and OpenSearch use it so full-text queries avoid table scans.'],
        ['Okapi BM25', 'Relevance ranking formula combining term frequency saturation (`k1`), rarity across documents (`IDF`), and field length normalization (`b`).'],
        ['Geohash & Uber H3', 'Spatial grids turning `(lat, lon)` into sortable prefix strings (Geohash squares) or 64-bit hexagon IDs (`H3` equidistant cells).']
      ],
      why: "Relational B-Tree indexes break down on two common features: ranked substring search (`LIKE '%espresso%'`) and fast radius queries (`drivers within 2 km`). Both need specialized index layouts.",
      points: [
        "B-Trees index left-to-right prefixes, so `LIKE '%term%'` forces a full scan. Elasticsearch and OpenSearch tokenize text into an inverted index (`term -> [docIDs]`).",
        'BM25 improves on TF-IDF with diminishing gains from repeated terms (`k1`) and length normalization (`b`) so long keyword-heavy descriptions do not dominate short titles.',
        'Treat search engines as secondary read indexes, not primary storage. Sync updates from SQL through an Outbox or CDC stream and apply typos and synonyms at query time.',
        'Separate B-Tree indexes on `(lat)` and `(lon)` scan huge boxes for radius queries. Encode 2D space into 1D cells with Geohash, Quadtrees, PostGIS R-Trees (GiST), or Uber H3.',
        'Watch for Geohash boundary seams because nearby points across a grid line can share zero prefix characters. Always query the target cell plus its 8 neighbors, or use Uber H3 hexagons where all 6 neighbors sit at equal distance.'
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
      practice: "Run `go run .` and note why document `3` (`\"keyboard keycaps\"`) outranks document `2` in BM25 even though both match `'keyboard'` once. Compare `(-0.001, 0.001)` and `(0.001, -0.001)` near `(0, 0)` to observe the Geohash prefix seam.",
      teach: "Explain why Elasticsearch works best as a secondary index synced from SQL, not as primary storage. Explain why Uber H3 hexagons beat square grids for radius heatmaps.",
      analogy: "An inverted index works like a book index listing every topic page number so you skip scanning every page. Hexagonal H3 tiles are like a honeycomb where every neighbor sits at the exact same center distance.",
      pitfalls: [
        'Using Elasticsearch as primary source storage without durable backups, risking lost updates during reindexing or refresh delays.',
        'Querying only `WHERE geohash LIKE prefix%` without the 8 surrounding cells, dropping nearby points right across a grid line.',
        'Locking into overly fine spatial resolution when traffic fluctuates. Uber H3 lets you roll cells up with `cellToParent` when areas thin out.'
      ],
      quiz: [
        { q: "In BM25, why does a match inside a 2-word title score higher than a match inside a 200-word description?", a: ["Field-length normalization (`b`) rewards matches in shorter fields", "Inverted indexes skip long documents", "BM25 sorts alphabetically", "IDF deletes frequent terms"], c: 0, why: "Length normalization stops long, noisy text fields from outranking brief titles." },
        { q: "Why do Geohash queries check the target cell plus all 8 neighbors?", a: ["To sort alphabetically", "Nearby coordinates across a grid boundary can share zero Geohash prefix characters", "Geohash only encodes latitude", "SQL LIKE requires 9 patterns"], c: 1, why: "Two points 10 meters apart across the equator or prime meridian have totally different prefixes." },
        { q: "What geometric advantage made Uber pick hexagons for H3 over squares or triangles?", a: ["Hexagons require half as many bits", "All six neighbors sit equidistant from the cell center, removing diagonal distortion", "Squares cannot tessellate spheres", "PostGIS only supports hexagons"], c: 1, why: "Square grids have close edge neighbors (`1×`) and distant diagonal corners (`√2×`). Hexagons give one uniform step distance." }
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
        ['PgBouncer Transaction Mode', 'Returns a server DB connection to the pool after each `COMMIT` or `ROLLBACK`. Multiplexes thousands of idle app connections onto dozens of Postgres backends.'],
        ['Replication lag (`LSN`)', 'Delay between a primary commit and a read replica applying its WAL record. Passing a commit LSN lets reads wait or hit primary for read-your-own-writes.'],
        ['Partitioning vs Sharding', 'Partitioning splits one table into physical child tables inside one host for pruning and fast `DROP TABLE` drops. Sharding spreads data across separate DB servers.']
      ],
      why: 'Opening 5,000 Postgres connections for 500 pods stalls the OS scheduler and burns gigabytes of RAM. Scale SQL in four steps: index tuning and transaction pools, read replicas, single-host partitions, and sharding only when writes saturate.',
      points: [
        'Each PostgreSQL backend allocates local memory and contends on snapshots. Capping direct connections around 100 to 300 behind PgBouncer (`pool_mode = transaction`) or RDS Proxy often doubles throughput.',
        'In Transaction Mode, avoid session state (`SET TIME ZONE`, `PREPARE`, `LISTEN`, session advisory locks) unless you configure PgBouncer `max_prepared_statements`.',
        'Async replicas lag under heavy writes. Protect read-your-own-writes on checkouts or profile updates by checking a commit LSN cookie or pinning post-write reads to the primary for a few seconds.',
        'PostgreSQL declarative range partitioning (`PARTITION BY RANGE (created_at)`) prunes queries to one monthly table and swaps multi-hour `DELETE` vacuums for instant `DROP TABLE` calls.',
        'Pick a high-cardinality shard key (`tenant_id` or `user_id`) that matches most queries. Queries missing the shard key trigger scatter-gather scans across every shard.',
        'Cross-shard joins and `AUTO_INCREMENT` sequences fail on distributed shards. Generate time-ordered 64-bit IDs (Snowflake or UUIDv7) and build cross-shard views in read models.'
      ],
      predict: {
        prompt: "You scale horizontally from `20` to `400` API pods (`25` connections per pod = `10,000` connections) hitting one PostgreSQL primary (`max_connections = 5000`, `16 vCPU`). CPU sits at 60%, yet `p99` jumps 10× and new pods fail to connect. What fixes the root bottleneck?",
        options: [
          "Raise `max_connections = 20000` on PostgreSQL",
          "Put PgBouncer in `transaction` pooling mode in front of PostgreSQL and keep active DB backends around 50–150",
          "Drop all foreign keys and secondary indexes",
          "Shard the `users` table across 16 PostgreSQL instances immediately"
        ],
        answer: 1,
        explain: "PostgreSQL wastes CPU on context switches and snapshot locks when thousands of idle connections stay open. Transaction pooling multiplexes 10,000 app sockets onto ~100 backends, adding massive headroom before sharding becomes necessary."
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
      practice: "Open `VIZ.sysdbscale`, raise writes vs reads to watch replica lag grow, and compare Transaction Pooling vs Direct Connections. In section 3, explain why `tenant_id` comes first in `(tenant_id, order_id)`.",
      teach: "Walk through the four scaling steps before sharding Postgres: indexes, PgBouncer transaction mode, read replicas with LSN checks, and partitioning. Name when sharding becomes mandatory.",
      analogy: "Direct connections assign one private chef per diner even while reading menus. Transaction pooling lets 500 diners share 20 chefs who cook one dish and step back.",
      pitfalls: [
        'Using session commands (`SET search_path`, temp tables, or `pg_advisory_lock`) under PgBouncer `transaction` mode so the next tenant inherits stale session state.',
        'Sharding by `created_at` or `order_id`, sending 100% of new inserts to one hot rightmost shard.',
        'Running `DELETE FROM events WHERE created_at < ...` on millions of rows, causing vacuum bloat and transaction ID wraparound risk when dropping a partition finishes in milliseconds.'
      ],
      quiz: [
        { q: "Why does `PARTITION BY RANGE (created_at)` require `created_at` inside every PostgreSQL `PRIMARY KEY` and `UNIQUE` constraint?", a: ["To sort strings faster", "PostgreSQL enforces uniqueness per partition index unless the partition key sits inside the unique key", "B-Trees only index timestamps", "PgBouncer requires it"], c: 1, why: "Without checking every child partition on insert, local uniqueness only holds globally when the partition column belongs to the key." },
        { q: "How does a post-write read avoid stale data from an async read replica?", a: ["Disable WAL on primary", "Route that user's read to the primary or wait for `pg_last_wal_replay_lsn() >= commit_lsn`", "Set `LIMIT 1`", "Run `VACUUM FULL`"], c: 1, why: "Checking the primary commit LSN (or short post-write primary routing) gives monotonic read-your-own-writes without blocking everyone else." },
        { q: "Which choice creates a write hotspot on a sharded database?", a: ["Using UUIDv7 inside `(tenant_id, id)` hash sharding", "Range-sharding an append-only table by `created_at`", "Pre-splitting virtual shards into 256 buckets", "Co-locating `orders` and `order_items` on `tenant_id`"], c: 1, why: "All current timestamps land inside one active rightmost range shard while older shards stay idle." }
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
        ['Consistent hashing ring', 'Places nodes and keys on one circular `[0, 2^32)` or `2^64` hash space. Each key lands on the next clockwise node, so adding or dropping 1 node moves ~`1/N` keys.'],
        ['Virtual nodes (`vnodes`)', 'Multiple ring slots (`nodeA#0`, `nodeA#1`) per server. Using 100 to 200 vnodes shrinks partition skew below ±5% and spreads failover evenly across survivors.'],
        ['Bounded-load hashing', 'Caps any node at `ceil(avgLoad * (1 + ε))` (for example, `c = 1.25`) and probes clockwise if full, stopping hot-key overload.']
      ],
      why: 'Partitioned Redis shards and stateful Layer-7 caches drop hit rates if scaling flushes every key. Consistent hashing with virtual nodes keeps caches warm during topology changes, while bounded loads shield hosts from viral hot keys.',
      points: [
        'Modulo hashing (`hash(k) % N`) breaks when clusters resize: changing `N` from `4` to `5` remaps ~80% (`4/5`) of keys at once.',
        'On an `N`-node consistent hash ring, adding or removing one node moves only ~`1/N` keys (those between the node and its counter-clockwise neighbor).',
        'A single point per host makes uneven arc sizes. Giving each host 100 to 200 virtual nodes balances distribution and lets a `2×` RAM server take `2×` vnodes.',
        'Binary search (`slices.BinarySearchFunc`) on a sorted uint32/uint64 slice finishes lookups in `O(log(N * V))` microseconds with zero allocations.',
        'Consistent hashing still overloads one node for a viral key. Bounded-load hashing (`cap = ceil(loadRatio * c)`, `c ≈ 1.25`, used in HAProxy and Maglev) spills excess traffic to the next clockwise node.',
        'When `N` is under 100 backends, Rendezvous (Highest Random Weight) hashing picks `argmax node hash(key, node)` with the same `1/N` minimal movement and no ring state.'
      ],
      predict: {
        prompt: "A 4-node cache cluster routes keys by `fnv32(key) % N`. At peak traffic, you add Node 4 (`N` changes `4 -> 5`) across `10,000` hot keys. Roughly how many keys immediately move to a new node (cache misses)?",
        options: [
          "~2,000 keys (20%, matching `1/5` of keys)",
          "~8,000 keys (~80%), causing a massive cache stampede against the DB",
          "Exactly 2,500 keys (25%)",
          "0 keys until old TTLs expire"
        ],
        answer: 1,
        explain: "Changing the modulus from `4` to `5` changes `h % 4` vs `h % 5` for 16 of every 20 numbers (`80%`). A consistent hash ring moves only ~`1/5` (`20%`)."
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
      practice: "Open `VIZ.syshash`, drag `vnodes/server` from `1` up to `150`, and watch key distribution balance across servers. Click `+ Add Node` (`4 -> 5`) and compare the `Moved Keys` counter against Modulo Hashing.",
      teach: "Explain why adding virtual nodes improves both normal key balance and crash recovery when one cache server drops.",
      analogy: "Placing 4 people once around a clock face leaves uneven wedge slices. Giving each person 150 random seats guarantees everyone catches roughly 25% of incoming darts.",
      pitfalls: [
        'Forgetting binary-search wrap-around (`idx == len(vnodes) -> 0`), causing keys hashed past the last vnode to panic or fail.',
        'Picking `1` or `2` virtual nodes in a small cluster so one host owns 60% of the ring while another starves.',
        'Expecting consistent hashing alone to protect against hot keys. A viral key still hashes to one replica unless paired with L1 cache or bounded loads.'
      ],
      quiz: [
        { q: "Why do DynamoDB, Cassandra, and Redis proxies assign 100 to 200 virtual nodes per physical host?", a: ["To multiply RAM capacity", "To reduce partition skew and spread crash failovers evenly across remaining hosts", "To avoid hashing keys", "To guarantee strong linearizability"], c: 1, why: "Many vnodes turn random ring spacing into even fractions and stop the next clockwise neighbor from absorbing 100% of a dead host's load." },
        { q: "What does `bounded loads` (capacity factor `c ≈ 1.25`) change during a hot-key spike?", a: ["Disables virtual nodes", "Spills excess requests beyond `cap` to the next distinct physical server clockwise", "Deletes cold keys permanently", "Forces TCP retries"], c: 1, why: "Bounded-load consistent hashing caps every host at `1.25×` average load while keeping locality on normal traffic." },
        { q: "In a 10-node consistent hash ring with balanced vnodes, about what fraction of keys move when 1 new node joins?", a: ["~90%", "~50%", "~9–10% (`1 / 11`)", "0%"], c: 2, why: "Only keys inside segments claimed by the 11th node move (`1 / (N + 1)`)." }
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
        ['Dual-write problem', 'Writing to PostgreSQL and publishing to Kafka or RabbitMQ separately in one request. A crash or timeout between calls leaves ledger rows and events out of sync.'],
        ['Transactional Outbox + CDC', 'Inserts domain rows and an `outbox_events` row in the same SQL transaction. A `SKIP LOCKED` relay worker or Debezium WAL CDC ships rows to the broker.'],
        ['Dead-Letter Queue (DLQ)', 'Side channel holding poison messages that repeatedly fail parsing or retries so healthy partitions keep moving while engineers inspect them.']
      ],
      why: 'Services crash right between a SQL `COMMIT` and a broker `Publish()`. Transactional Outbox plus idempotent consumers turn risky dual writes into reliable at-least-once delivery without distributed two-phase commits.',
      points: [
        'Skip dual writes (`db.Commit()` then `kafka.Produce()`) on financial or order state. A network blip or OOM kill between those two calls drops downstream events permanently.',
        'Commit domain tables and `outbox_events` inside one ACID transaction. Ship rows using a polling worker (`FOR UPDATE SKIP LOCKED`) or Change Data Capture (Debezium) reading the Write-Ahead Log with near-zero SQL overhead.',
        'Brokers like Kafka, RabbitMQ, and SQS deliver at-least-once, so duplicates arrive on retries and rebalances. Record `event_id` in a deduplication table (`processed_events`) or run idempotent upserts.',
        'Match brokers to workload: Kafka keeps an ordered partition log for multi-team replay (`consumer_group`). RabbitMQ and SQS fit task queues with per-message ACK and delays.',
        'Prevent backlog cascades with prefetch limits, exponential retry topics, and Dead-Letter Queues (DLQ) capped by `max_attempts`.',
        'Never keep retrying a corrupt JSON payload at the front of an ordered partition. Route toxic payloads to a DLQ after max attempts so healthy events keep flowing.'
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
      practice: "Open `VIZ.sysqueue`, switch to `Dual-Write`, and inject a broker outage so DB and Queue diverge. Next, switch to `Transactional Outbox` and recover, then inject a poison pill and step through retries until it lands in `DLQ`.",
      teach: "Explain why `FOR UPDATE SKIP LOCKED` lets multiple outbox workers poll concurrently without blocking each other. Compare Polling Outbox to Debezium WAL CDC at high write volume.",
      analogy: "The outbox writes outgoing letters inside your sealed accounting ledger before closing the page. A courier reads that ledger whenever the post office reopens, so no envelope disappears when the mail van breaks down.",
      pitfalls: [
        'Publishing a Kafka event right after `COMMIT` without an outbox. A process crash or timeout drops downstream emails, inventory updates, and analytics.',
        'Assuming at-least-once consumer logic needs no deduplication. Retries and rebalances still replay batches unless side effects commit atomically with `processed_events`.',
        'Retrying a corrupt message forever at the head of an ordered partition when routing it to a DLQ would unblock healthy events.'
      ],
      quiz: [
        { q: "Why does `FOR UPDATE SKIP LOCKED` matter when polling `outbox_events` across multiple relay workers?", a: ["It drops duplicates automatically", "Each relay worker claims distinct unlocked rows without waiting behind another worker's transaction", "It bypasses PostgreSQL WAL", "It turns Kafka into RabbitMQ"], c: 1, why: "`SKIP LOCKED` hands disjoint batches to concurrent relay workers without serializing on row locks." },
        { q: "What advantage does Debezium CDC offer over SQL polling on `outbox_events` at 20,000 events/sec?", a: ["Eliminates need for any primary DB transaction", "Streams changes directly from the Postgres Write-Ahead Log without repeated `SELECT ... UPDATE` polling load", "Guarantees zero duplicate consumer reads without dedup", "Replaces all HTTP endpoints"], c: 1, why: "WAL-based CDC skips polling queries across index pages under heavy write QPS while keeping sub-second publish latency." },
        { q: "When a consumer receives an `event_id` already inside `processed_events`, what should it do?", a: ["Crash and trigger a pager alert", "Skip the business side effect and acknowledge (commit offset)", "Insert a second row into `dead_letter_events`", "Restart Kafka"], c: 1, why: "The event already committed earlier, so skipping work and committing the offset keeps at-least-once delivery idempotent." }
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
        ['Full Jitter backoff', 'AWS Builders Library formula `sleep = rand[0, min(cap, base * 2^attempt)]`. Spreads failing retries randomly so recovering services don\'t get slammed by synchronized waves.'],
        ['Circuit Breaker', 'State machine (`Closed -> Open -> Half-Open`) that fails fast once error counts cross a threshold, sparing downstream hosts from overload and callers from blocked threads.'],
        ['Bulkhead pattern', 'Bounded semaphore or separate worker pool per dependency so a slow third-party SMS gateway can\'t starve healthy checkout requests.']
      ],
      why: 'Retry loops without timeouts, jitter, or circuit breakers turn a minor slowdown into a retry storm that keeps dependencies down for hours. Production outbound clients need bounded timeouts, jittered backoff with a retry budget, a circuit breaker, and bulkheads.',
      points: [
        'Propagate strict end-to-end deadlines with `context.WithTimeout` and per-hop budgets. Without a timeout, slow downstreams tie up caller pools until upstream callers crash.',
        'Avoid fixed waits or pure `2^attempt` backoff across fleet callers. Pods failing together at `t = 0` wake together at `1s`, `2s`, and `4s`, whereas Full Jitter spreads waits across `[0, window]`.',
        'Enforce a retry budget (for example, max 20% extra RPS over baseline traffic). When 90% of calls already fail, retrying `3×` per request quadruples traffic right when capacity is lowest.',
        'Add a Circuit Breaker: `Closed` trips to `Open` (fails fast in `0 ms`) for a cooldown period, then runs canary calls in `Half-Open` before closing.',
        'Isolate slow upstreams with bulkheads using bounded semaphores or separate HTTP pools so a `/pdf-export` stall leaves `/checkout` unaffected.',
        'Retry only idempotent operations (`GET`, `HEAD`, `PUT`, `DELETE`, or `POST` with an `Idempotency-Key`) so network timeouts don\'t trigger double charges.'
      ],
      predict: {
        prompt: "Your payment gateway drops for `3` seconds while `1,000` API requests are active. Each caller retries up to `5` times using deterministic backoff (`1s`, `2s`, `4s`, `8s`, `16s`). What happens when the gateway restarts at `t = 3.1s`?",
        options: [
          "Traffic resumes smoothly at baseline QPS",
          "Synchronized retry waves (`1,000+` calls firing on exact `1s/2s/4s` ticks) crush the recovering gateway again (retry storm)",
          "The circuit breaker automatically upgrades gateway CPU",
          "Go drops retries automatically inside TCP"
        ],
        answer: 1,
        explain: "Deterministic backoff aligns thousands of callers onto identical wake-up spikes, multiplying peak load (`5×`). Full Jitter, retry budgets, and circuit breakers break up synchronized waves."
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
      practice: "Open `VIZ.sysresilience`, set downstream health to `Outage (100% fail)`, and click `Burst ×6` to trip `OPEN`. Click `Advance Cooldown (+5s)` twice to reach `HALF_OPEN` and compare `No Jitter` vs `Full Jitter` retry dispersion.",
      teach: "Explain why retrying every RPC hop in a 4-layer call tree (`A -> B -> C -> D`, each retrying `3×`) turns one glitch into `81×` traffic. State where retry logic should live.",
      analogy: "A submarine separates compartments with watertight bulkheads so one breached room doesn't sink the ship. A circuit breaker trips before overloaded wires overheat the building.",
      pitfalls: [
        'Setting retries at every microservice hop (`3 × 3 × 3 × 3 = 81×` request amplification) when retrying once near the edge with a deadline budget stays controlled.',
        'Retrying HTTP `400 Bad Request` or `401 Unauthorized` validation failures. Backoff retries help only transient network, `429`, or `503` failures.',
        'Sharing one global `http.Client` without timeouts across critical checkout calls and slow webhook deliveries.'
      ],
      quiz: [
        { q: "Why does the AWS Builders Library recommend Full Jitter over deterministic exponential backoff?", a: ["It doubles max throughput", "It spreads retry timestamps uniformly across `[0, cap]`, breaking synchronized herd spikes", "It removes the need for timeouts", "It converts 503 into 200"], c: 1, why: "Without randomness, clients failing together retry together in lockstep waves." },
        { q: "In a 3-state Circuit Breaker (`Closed`, `Open`, `Half-Open`), what happens inside `Half-Open`?", a: ["All requests bypass timeouts", "Limited probe requests run to test if the dependency recovered before switching to `Closed`", "Failures are permanently ignored", "Metrics flush to disk"], c: 1, why: "Half-Open sends small canary traffic. Success closes the breaker, while failure restarts the cooldown timer." },
        { q: "Which pattern stops a slow third-party webhook endpoint from consuming all API threads needed by `/login`?", a: ["Write-Back Cache", "Bulkhead (separate worker pools or concurrency semaphores per dependency)", "Geohashing", "Consistent Hashing"], c: 1, why: "Isolating concurrency budgets per dependency stops one stalling upstream from starving healthy routes." }
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
        ['Quorum (`W + R > N`)', 'With `N` replicas, requiring writes to ack on `W` replicas and reads on `R` replicas where `W + R > N` ensures one queried replica holds the latest `ver`.'],
        ['Idempotency-Key header', 'IETF-draft request header carrying a client ID so retried writes return the cached outcome (`409` or `422` on payload mismatch) without billing twice.'],
        ['Fencing Token', 'Monotonic sequence number issued by a lock lease (`token=34`). Storage rejects writes with older tokens (`33 <= 34`), preventing split-brain after a GC pause.']
      ],
      why: 'In distributed storage, leases expire during GC pauses, networks partition, and mobile clients double-submit timed-out requests. Quorum intersections, strict idempotency keys, sagas, and monotonic fencing tokens close those correctness gaps.',
      points: [
        'Use Dynamo-style quorums: with `N = 3`, `(W=2, R=2)` guarantees read-after-write overlap (`2 + 2 > 3`) and tolerates `1` dead replica on reads and writes.',
        'Version numbers or Lamport timestamps break ties across replicas. `Get()` queries `R` nodes, keeps the highest `version`, and triggers read repair for stale nodes.',
        'Follow PACELC: during a partition (`P`), pick availability (`A`, Dynamo) or consistency (`C`, Spanner/Raft). Else (`E`) in normal traffic, balance latency (`L`) against consistency (`C`).',
        'For HTTP writes, store `(idempotency_key, payload_sha256, status, response_body)` inside the domain DB transaction. Return `422` on payload changes and `409` on concurrent in-flight duplicates.',
        'Replace distributed two-phase commit (`2PC`) across microservices with Sagas. Use event choreography for small 2–4 step flows, and orchestration (Temporal or state machines) when workflows need explicit rollback steps like `RefundPayment` and `ReleaseStock`.',
        'Never rely on a client lease timer alone (Martin Kleppmann warning). A worker frozen in GC past lease expiry writes stale data unless storage checks a monotonic Fencing Token.'
      ],
      predict: {
        prompt: "Worker A holds a Redis lock (`TTL = 5s`, `fencing_token = 10`) and freezes for `8s` during GC. At `t = 5.1s`, Redis expires A's lock and grants Worker B `fencing_token = 11`, who writes `v2`. At `t = 8s`, Worker A wakes up and tries writing stale `v1`. What stops Worker A?",
        options: [
          "Requiring Worker A to call `TTL` in Redis before writing",
          "Requiring storage to reject any write whose `fencing_token <= lastSeenToken` (`10 <= 11` -> rejected)",
          "Extending Worker A's lease to 30 seconds",
          "Turning off GC pauses across the network"
        ],
        answer: 1,
        explain: "Martin Kleppmann showed that checking a lock timer before I/O leaves a race window between the check and the disk write. Only storage rejecting non-monotonic tokens stops zombie writers atomically."
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
      practice: "Run `go run .`, then switch Quorum `Get` to `[]int{2}` (`R=1` where `W+R = 3 <= N`) to watch stale `ver=1 ($100)` slip through. Design a 3-step checkout Saga (`ReserveStock -> ChargeCard -> ConfirmOrder`) and list its compensating actions.",
      teach: "Compare Orchestration vs Choreography Sagas. Explain Martin Kleppmann's fencing-token proof showing why time-based Redis leases cannot protect storage writes by themselves.",
      analogy: "A fencing token works like sequentially numbered court seals stamped onto paperwork. Even if a slow clerk files yesterday's stamp #10 after #11 already arrived, the receiving desk rejects any number older than #11.",
      pitfalls: [
        'Configuring `W=2, R=1` on `N=3` while expecting strong reads. Since `2 + 1 <= 3`, reads can hit the single stale replica.',
        'Ignoring payload changes on `Idempotency-Key` retries. Returning an old `$50` response when the caller changed the request body to `$500` causes silent billing bugs.',
        'Building Sagas without idempotent rollback actions (`Refund` must handle duplicate retry deliveries without double refunds).'
      ],
      quiz: [
        { q: "In an `N = 5` replica cluster where writes require `W = 3` acks, what minimum `R` guarantees at least one up-to-date replica participates in every read?", a: ["R = 1", "R = 2", "R = 3 (`3 + 3 = 6 > 5`)", "R = 5"], c: 2, why: "Quorum intersection requires `W + R > N`. With `N=5` and `W=3`, the minimum `R` is `3`." },
        { q: "What HTTP status should an idempotent `POST /payments` API return when a client reuses an existing `Idempotency-Key` with a different request payload?", a: ["200 OK", "422 Unprocessable Content (or 400/409 payload conflict)", "304 Not Modified", "503 Service Unavailable"], c: 1, why: "Reusing one key with changed parameters breaks idempotency rules, so Stripe/IETF APIs reject it with `422` or `409`." },
        { q: "Why must storage itself check a monotonic fencing token?", a: ["To compress JSON", "Because a lock holder can stall in GC or network pauses between checking lease expiry and writing to storage", "To bypass TLS", "Because Raft has no leader"], c: 1, why: "Client-side lease checks have a race window before the disk write, whereas checking `token > lastToken` inside storage blocks stale writers atomically." }
      ]
    },
    {
      id: 'observability', title: 'Observability: OpenTelemetry traces, RED/USE, and SLO burn rates', level: 3, mins: 40, lang: 'yaml',
      splits: [
        ['OpenTelemetry Collector', '# --- 1. OTel Collector'],
        ['SRE Burn-Rate Alert Rule', '# --- 2. SLO Burn-Rate Alert']
      ],
      terms: [
        ['Three Pillars + Trace Context', 'Structured JSON logs (`trace_id`), `RED` or `USE` metrics, and distributed traces linked across hops with W3C `traceparent` (`00-<trace-id>-<span-id>-<flags>`).'],
        ['High-cardinality trap', 'Putting unbounded IDs (`user_id`, `order_id`, full URLs) in Prometheus metric labels explodes TSDB memory. Put raw IDs in logs and trace spans, and use URL templates (`/orders/{id}`) in metrics.'],
        ['Multi-Window Multi-Burn-Rate', 'Google SRE alerting rule checking fast budget burn (`14.4×`) over both `1h` and `5m` windows. Outages page immediately and resolve fast.']
      ],
      why: 'Saying "CPU is 40%" misses 500 error loops on `/checkout`. Paging on `99.95%` over `1 minute` wakes engineers for brief blips, so W3C traces and burn-rate alerts tie paging to user pain.',
      points: [
        'Track USE (Utilization, Saturation, Errors) on hardware and pools (CPU, NIC queues, disk IOPS, connection wait). Track RED (Rate, Errors, Duration histogram) on every service endpoint.',
        'Aggregate latency using histograms (`le` buckets with `histogram_quantile`), never averaged client gauges. You can\'t average per-pod `p99` values into a cluster `p99`.',
        'Pass the W3C `traceparent` header from ingress proxy through APIs, brokers, and SQL spans so one trace view connects logs, slow queries, and timeouts.',
        'Sample smartly at scale: keep 100% of errors and slow tails (`status >= 500` or `latency > 500ms`) with OTel `tail_sampling`. Sample normal `200 OK` traffic at 1% to 5%.',
        'Alert on burn rate across short and long windows. For instance, `14.4×` burns 2% of a 30-day `99.9%` SLO in 1 hour (`5m` check), while `1×` opens a daytime ticket.',
        'Keep `user_id`, email addresses, and raw UUIDs out of Prometheus labels. Use parameterized route templates (`/v1/orders/{id}`) and redact PII in OpenTelemetry processors.'
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
      practice: "Trace why the PromQL alert checks both `[1h]` and `[5m]`. Calculate how long the page stays active after a 5-minute outage ends if you delete the `[5m]` clause.",
      teach: "Explain high-cardinality label explosion in Prometheus metrics compared to trace spans. Compare RED and USE dashboards.",
      analogy: "Tracking a monthly error budget by burn rate works like watching a water tank leak. A slow drip gets scheduled for tomorrow, while losing 2% of the month's water in one hour rings the alarm immediately and silences once repaired.",
      pitfalls: [
        'Attaching `user_id` or raw IDs inside URL paths to Prometheus labels, blowing up TSDB RAM with millions of time series.',
        'Averaging per-instance `p99` values in Grafana, losing tail accuracy. Aggregate raw histogram bucket counters (`sum by (le)` then `histogram_quantile`).',
        'Writing plain-text logs without a W3C `trace_id`, forcing engineers to grep timestamps across 12 services.'
      ],
      quiz: [
        { q: "Why does Google SRE combine a `1h` window and a `5m` short window in a fast-burn page alert?", a: ["To double CPU usage", "So a fixed outage clears the alert within ~5 minutes, avoiding a full-hour page", "Because Prometheus cannot compute 1h rates", "To drop 500 metrics"], c: 1, why: "Without the short window, the `1h` rolling rate stays above threshold long after a fix ships." },
        { q: "Where should high-cardinality attributes like `order_id` and `customer_id` live?", a: ["Prometheus metric labels", "Structured log fields and OpenTelemetry trace span attributes", "HTTP status codes", "DNS TXT records"], c: 1, why: "Prometheus indexes every unique label combination in RAM, while log indexes and trace spans store high-cardinality attributes well." },
        { q: "Which standard HTTP header links distributed traces across proxies and Go, C#, or Node services?", a: ["`X-Custom-Debug`", "`traceparent` (W3C Trace Context)", "`Keep-Alive`", "`ETag`"], c: 1, why: "W3C Trace Context (`traceparent`) works across Envoy, NGINX, OpenTelemetry SDKs, and cloud gateways." }
      ]
    },
    {
      id: 'containers-k8s', title: 'Containers, Kubernetes HPA, PDBs, and graceful shutdown', level: 3, mins: 40, lang: 'yaml',
      splits: [
        ['Deployment, Probes & preStop Drain', '# --- 1. Deployment + Zero-Downtime Rolling Drain'],
        ['Autoscaling (HPA) & Disruption Budget', '# --- 2. HPA v2']
      ],
      terms: [
        ['Probes (`startup`/`readiness`/`liveness`)', '`startupProbe` covers slow boots, `readinessProbe` removes warming or draining pods from Service traffic, and `livenessProbe` restarts stuck processes. Never tie liveness to external DB checks.'],
        ['`preStop` drain race', 'Kubernetes removes a terminating pod IP from kube-proxy EndpointSlices asynchronously while sending `SIGTERM`. Sleeping 5 to 10 seconds in `preStop` lets routing propagate first so rolling updates skip `502 Bad Gateway` errors.'],
        ['`PodDisruptionBudget` (`PDB`)', 'Cluster policy (`minAvailable` or `maxUnavailable`) stopping voluntary node drains from evicting too many replicas at once during maintenance.']
      ],
      why: 'Deploying containers looks easy until a rolling update drops 2% of checkout calls with `502 Bad Gateway`. A DB blip can also trigger liveness crash loops, so probes, drain hooks, HPA stabilization, and PDBs keep rolls zero-downtime.',
      points: [
        'Build minimal non-root multi-stage images (distroless or Alpine with `readOnlyRootFilesystem: true`) so image pulls stay fast and the CVE surface stays small.',
        'Separate `readinessProbe` from `livenessProbe`: fail readiness when dependencies drop, never liveness. Restarting healthy pods during a DB hiccup floods the database with cold-start connections as it recovers.',
        'Set accurate CPU `requests` for bin-packing, and avoid tight CPU `limits` on latency-sensitive APIs where CFS quotas cause 100 ms stalls. Always set memory `limits` so OOMKill catches leaks.',
        'Stop rolling-deploy `502` errors with a two-step drain. First `preStop: sleep 10` gives kube-proxy and Ingress time to drop the pod while `/readyz` turns false, then `SIGTERM` finishes active requests within `terminationGracePeriodSeconds`.',
        'Set `scaleDown.stabilizationWindowSeconds: 300` on `HorizontalPodAutoscaler` (`autoscaling/v2`) so brief traffic dips don\'t bounce replica counts up and down.',
        'Add a `PodDisruptionBudget` (`minAvailable: 2` or `maxUnavailable: 1`) to core pools before running cluster autoscaler or node upgrades.'
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
      practice: "Review the Deployment YAML above. Explain why `terminationGracePeriodSeconds: 45` pairs with `preStop: sleep 10`, and why `maxUnavailable: 0` in `rollingUpdate` matters when `PodDisruptionBudget` sets `maxUnavailable: 1`.",
      teach: "Explain the race during `kubectl rollout restart` between `SIGTERM` hitting your process and Ingress dropping that pod IP. Explain why checking `SELECT 1` inside `livenessProbe` causes cascading outages.",
      analogy: "Adding a `preStop` pause before shutdown works like flipping a restaurant's 'Closed' sign 10 minutes early. Seated guests finish their meal smoothly.",
      pitfalls: [
        'Wiring `livenessProbe` to test Redis or PostgreSQL connectivity. When Redis restarts for 15 seconds, Kubernetes kills every healthy API pod at once.',
        'Skipping a `preStop` delay or shutting down immediately on `SIGTERM` before EndpointSlice removal propagates, emitting `502` errors on every deploy.',
        'Setting `replicas: 1` with a PDB `minAvailable: 1` (or `maxUnavailable: 0`), blocking Kubernetes node upgrades forever.'
      ],
      quiz: [
        { q: "Why should `livenessProbe` avoid querying an external database or third-party API?", a: ["HTTP GET is unsupported on Kubernetes", "If the DB stalls briefly, Kubernetes restarts every healthy API pod in a crash loop even though the processes aren't deadlocked", "ReadinessProbe already restarts dead pods", "Liveness slows down Go GC"], c: 1, why: "Liveness checks only whether the process is deadlocked. Downstream hiccups belong in readiness probes or circuit breakers." },
        { q: "Why add `preStop: sleep 10` before a container acts on `SIGTERM` during a rolling deploy?", a: ["To warm CPU caches", "Because EndpointSlice and kube-proxy propagation across cluster nodes is asynchronous, so packets can arrive after termination starts", "To flush Go garbage collector", "To skip Readiness checks"], c: 1, why: "A short drain window handles in-flight traffic while load balancers drop the terminating pod IP." },
        { q: "What happens during a node upgrade if a 1-replica Deployment has `PodDisruptionBudget` set to `minAvailable: 1`?", a: ["Kubernetes doubles it automatically", "Node drain blocks because evicting the sole pod breaks the PDB", "HPA overrides the PDB", "The pod turns into a DaemonSet"], c: 1, why: "Run at least 2 replicas before adding `minAvailable: 1` or `maxUnavailable: 1`, or node drains will stall." }
      ]
    },
    {
      id: 'toolbox', title: 'Tool selection matrix and composable system building blocks', level: 3, mins: 35, lang: 'go',
      splits: [
        ['Tool Decision Engine (Go)', '// --- 1. Workload Spec'],
        ['Minimal Stack Builder', '// --- 2. Stack Recommender']
      ],
      terms: [
        ['Boring technology principle', 'Dan McKinley principle: start with proven tools your team can run (like Postgres and Redis). Add extra distributed systems only when scale demands it.'],
        ['OLTP vs OLAP separation', 'Serve customer transactions in row-oriented OLTP (PostgreSQL, SQL Server). Stream CDC events into columnar OLAP (ClickHouse, BigQuery, DuckDB) before heavy `GROUP BY` scans lock checkout tables.'],
        ['Workflow engine vs Queue', 'Queues (SQS, RabbitMQ, Kafka) fit single stateless events. Durable workflow engines (Temporal, Durable Functions) handle multi-day orchestration, timers, human approvals, and step rollbacks.']
      ],
      why: 'Start tool choices from your constraints (QPS, ACID rules, query shape, retention, and team size), not vendor hype. Pick the smallest composable stack whose failure modes your team can debug at 3 AM.',
      points: [
        'For OLTP under `20K–50K` ops/sec in one region, PostgreSQL handles joins, JSONB, partial indexes, SKIP LOCKED queues, and `pgvector`. Defer Cassandra or Spanner until needed.',
        'Pick DynamoDB or Cassandra when strict partition-key SLAs pass 100K QPS on writes and you don\'t need cross-entity joins.',
        'Use Redis or Valkey for sub-ms `LRU`/`LFU` caching, Lua rate counters, sorted-set leaderboards, and pub/sub, never as your sole durable ledger.',
        'Pick RabbitMQ or SQS for routed task queues and delayed retries. Pick Kafka or Redpanda for ordered immutable logs shared across independent consumers like billing, search indexing, ML, and ClickHouse.',
        'Use OpenSearch, Elasticsearch, or Meilisearch synced from CDC for full-text BM25 ranking and facets. Use PostGIS or Uber H3 with Redis for radius queries.',
        'Put NGINX, Envoy, or a cloud ALB at the edge for TLS, rate limits, and L7 routing. Add OpenTelemetry, Prometheus, and Grafana for observability, plus Temporal for long multi-step sagas.'
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
      practice: "Run `go run .` and note why the `5k QPS` fintech ledger skips Kafka, sharding, OpenSearch, and Temporal until bottlenecks require them. Add a third workload for your own target system (for example, a notification dispatcher or ride matcher) and justify each piece.",
      teach: "Defend keeping a lean stack (`Postgres + PgBouncer + Redis + Outbox`) up to 25K QPS before adding Kafka, Cassandra, or 12 microservices. Name the exact metric that triggers each next upgrade.",
      analogy: "A master carpenter skips hauling a CNC router onto every small job when a hand chisel works faster. Every extra distributed component adds another on-call alert, sync delay, and failure mode.",
      pitfalls: [
        'Resume-driven architecture: deploying Kafka, Cassandra, Elasticsearch, and Istio service mesh for a 50-RPS internal app built by three engineers.',
        'Picking a NoSQL store just to skip schemas on relational billing or ledger workflows that need multi-row ACID transactions.',
        'Treating tool choices as permanent. Re-measure real bottlenecks after every 2× to 5× traffic jump.'
      ],
      quiz: [
        { q: "Why keep heavy BI reporting (`GROUP BY` across 12 months of invoices) off your customer-facing PostgreSQL primary?", a: ["PostgreSQL lacks SQL `GROUP BY`", "Long analytical scans evict hot OLTP buffer pages and fight checkout queries for CPU and I/O", "JSON cannot store dates", "CDNs block analytical queries"], c: 1, why: "Moving heavy OLAP scans onto replicas or columnar stores (ClickHouse or BigQuery) protects checkout tail latency." },
        { q: "When does Temporal (or a durable workflow engine) beat raw RabbitMQ or SQS queues?", a: ["For simple 1-step thumbnail resizing", "When multi-step sagas span hours or days with timers, compensating actions, and deterministic state replay", "To cache images at the CDN edge", "To eliminate TCP handshakes"], c: 1, why: "Queues fit single async tasks, while multi-step sagas with timers and rollbacks turn into fragile ad-hoc state machines without a workflow engine." },
        { q: "Which database architecture matches an ACID financial wallet at `3,000 QPS` peak traffic with a small team?", a: ["64-shard Cassandra cluster", "PostgreSQL primary + sync/async replica + PgBouncer + Redis rate limits", "Elasticsearch primary ledger", "In-memory map only"], c: 1, why: "PostgreSQL handles ACID transactions at 3,000 QPS with much lower operational burden than distributed NoSQL sharding." }
      ]
    }
  ]
});

