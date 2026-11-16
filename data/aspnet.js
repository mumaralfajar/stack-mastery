TRACKS.push({
  id: 'aspnet', name: 'ASP.NET Core', lang: 'cs',
  tagline: 'The backend: HTTP, APIs, dependency injection, EF Core, security and production.',
  lessons: [
    // ---------------- Beginner ----------------
    {
      id: 'http', title: 'How the web works: HTTP in 20 minutes', level: 0, mins: 25,
      why: "ASP.NET Core is a machine that turns HTTP requests into HTTP responses. A student who can read a raw request and response can debug any web problem, in any framework.",
      points: [
        "The browser (client) sends a **request**: a method (`GET`, `POST`, `PUT`, `DELETE`), a URL, headers, and sometimes a body.",
        "The server returns a **response**: a status code, headers, and usually a body (HTML or JSON).",
        "Status families: `2xx` success, `3xx` redirect, `4xx` the client made a mistake, `5xx` the server failed.",
        "HTTP is **stateless**: each request stands alone. Identity is re-sent every time through a cookie or token.",
        "`GET` reads and must not change data; `POST` creates; `PUT`/`PATCH` update; `DELETE` removes.",
        "JSON is the usual body format for APIs. The browser dev tools Network tab shows every request — teach from it."
      ],
      code: `
// The smallest ASP.NET Core app: Program.cs
var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

app.MapGet("/", () => "Hello, web!");
app.MapGet("/time", () => new { now = DateTime.UtcNow });   // serialized to JSON

app.Run();

// Request:   GET /time HTTP/1.1
//            Host: localhost:5000
//
// Response:  HTTP/1.1 200 OK
//            Content-Type: application/json
//
//            {"now":"2026-01-15T09:30:00Z"}
`,
      practice: "Run `dotnet new web`, add the `/time` endpoint, and call it from the browser, from `curl -i`, and from the dev tools Network tab. Identify the method, status code and `Content-Type` in each.",
      teach: "Explain what happens between typing a URL and seeing a page, using the words request, response, status code and header.",
      analogy: "HTTP is ordering at a counter by letter. You send an envelope: what you want (method and URL), notes on the outside (headers) and contents (body). The kitchen sends an envelope back, stamped with a result code. The kitchen has no memory of you, so you show your loyalty card every single time.",
      pitfalls: [
        "Thinking the server 'remembers' the user between requests. It does not; a cookie or token is sent each time.",
        "Using `GET` for operations that change data.",
        "Returning `200 OK` with an error message in the body instead of a proper `4xx`/`5xx` code."
      ],
      quiz: [
        { q: "Which status code family means 'the client sent something wrong'?", a: ["2xx", "3xx", "4xx", "5xx"], c: 2, why: "4xx codes such as 400, 401, 404 signal a problem with the request." },
        { q: "HTTP being stateless means…", a: ["The server cannot store data", "Each request carries everything needed to process it", "Responses have no body", "Only GET is allowed"], c: 1, why: "The protocol keeps no memory between requests; state is re-sent or looked up." },
        { q: "Which method should create a new order?", a: ["`GET`", "`POST`", "`DELETE`", "`HEAD`"], c: 1, why: "`POST` submits data to create a resource; `GET` must be safe and read-only." }
      ]
    },
    {
      id: 'anatomy', title: 'Anatomy of an ASP.NET Core app', level: 0, mins: 25,
      why: "`Program.cs` has two halves, and nearly every 'why is my service not found / my middleware not running' question is answered by knowing which half something belongs in.",
      points: [
        "**Half one — the builder**: register services (things the app needs) with `builder.Services.Add…`.",
        "**Half two — the app**: build the request pipeline with `app.Use…` and map endpoints with `app.Map…`.",
        "**Kestrel** is the built-in web server that listens on a port and hands requests to your pipeline.",
        "Configuration is layered: `appsettings.json` → `appsettings.{Environment}.json` → user secrets → environment variables. Later sources win.",
        "`ASPNETCORE_ENVIRONMENT` selects `Development`, `Staging` or `Production` behavior.",
        "The `.csproj` lists the target framework and NuGet packages; `dotnet run`, `dotnet watch` and `dotnet build` are your daily commands."
      ],
      code: `
var builder = WebApplication.CreateBuilder(args);

// ---- 1. Services: what the app can use ----
builder.Services.AddControllers();
builder.Services.AddOpenApi();
builder.Services.AddScoped<IOrderService, OrderService>();

var app = builder.Build();

// ---- 2. Pipeline: how each request is handled ----
if (app.Environment.IsDevelopment())
    app.MapOpenApi();

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();

// appsettings.json
// { "ConnectionStrings": { "Default": "Server=.;Database=Shop;Trusted_Connection=True" } }
var cs = builder.Configuration.GetConnectionString("Default");
`,
      practice: "Create a Web API with `dotnet new webapi`. Add a setting `Greeting` to `appsettings.json`, read it in an endpoint, then override it with an environment variable and confirm which value wins.",
      teach: "Explain the two halves of `Program.cs`: what goes before `builder.Build()` and what goes after.",
      analogy: "Opening a restaurant has two phases. Before opening day you hire staff and stock the kitchen (register services). Once doors open, you define the path every guest follows: host stand, coat check, table, bill (the pipeline). You cannot hire a chef in the middle of serving a guest.",
      pitfalls: [
        "Registering a service after `builder.Build()` — it is too late.",
        "Committing secrets to `appsettings.json`. Use user secrets locally and environment variables or a vault in production.",
        "Assuming `appsettings.Development.json` is used in production."
      ],
      quiz: [
        { q: "Where must `builder.Services.AddScoped<…>()` be called?", a: ["After `app.Run()`", "Before `builder.Build()`", "Inside a controller", "In `appsettings.json`"], c: 1, why: "The service collection is frozen when the app is built." },
        { q: "The same key exists in `appsettings.json` and an environment variable. Which wins by default?", a: ["`appsettings.json`", "The environment variable", "Whichever is longer", "It throws"], c: 1, why: "Configuration providers added later override earlier ones; environment variables come after JSON files." },
        { q: "What is Kestrel?", a: ["A database", "The cross-platform web server built into ASP.NET Core", "A JavaScript bundler", "A logging library"], c: 1, why: "Kestrel listens for HTTP connections and feeds requests to the middleware pipeline." }
      ]
    },
    {
      id: 'routing', title: 'Routing, endpoints and model binding', level: 0, mins: 35,
      why: "An API is a list of endpoints. Mapping URLs to code, reading inputs safely and returning correct status codes is the daily work of a backend developer.",
      points: [
        "**Routing** matches method + URL pattern to a handler: `GET /api/products/{id}`.",
        "**Model binding** fills handler parameters from the route, query string, headers and JSON body automatically.",
        "Return the right result: `Ok(value)` 200, `Created…` 201, `NoContent()` 204, `BadRequest()` 400, `NotFound()` 404.",
        "**Minimal APIs** (`app.MapGet`) are concise; **controllers** group related endpoints in a class. Both sit on the same routing engine.",
        "REST convention: nouns for URLs (`/products/5`), HTTP methods for verbs. Not `/getProduct?id=5`.",
        "Route constraints such as `{id:int}` reject bad input before your code runs."
      ],
      code: `
public record Product(int Id, string Name, decimal Price);
public record CreateProduct(string Name, decimal Price);

var products = new List<Product> { new(1, "Laptop", 1200) };
var api = app.MapGroup("/api/products");

api.MapGet("/", (decimal? maxPrice) =>                       // ?maxPrice=500 from query
    products.Where(p => maxPrice is null || p.Price <= maxPrice));

api.MapGet("/{id:int}", (int id) =>                           // id from route
    products.FirstOrDefault(p => p.Id == id) is { } p
        ? Results.Ok(p)
        : Results.NotFound());

api.MapPost("/", (CreateProduct input) =>                     // input from JSON body
{
    var product = new Product(products.Count + 1, input.Name, input.Price);
    products.Add(product);
    return Results.Created($"/api/products/{product.Id}", product);
});

api.MapDelete("/{id:int}", (int id) =>
    products.RemoveAll(p => p.Id == id) > 0 ? Results.NoContent() : Results.NotFound());
`,
      practice: "Add `PUT /api/products/{id}` that replaces a product and returns 404 when it does not exist. Test all five endpoints with an `.http` file or `curl`, and verify every status code.",
      teach: "Explain how ASP.NET Core knows that the `id` parameter comes from the URL and `input` comes from the request body.",
      analogy: "Routing is a hotel receptionist: 'room 204? second floor, left.' Model binding is the bellhop who unpacks your suitcase into the right drawers — route values here, query values there, the JSON body laid out as an object — before you even enter the room.",
      pitfalls: [
        "Returning 200 with `null` when something is not found. Return 404.",
        "Exposing database entities directly as request and response bodies. Use DTOs/records.",
        "Verbs in URLs (`/api/createProduct`). Let the HTTP method carry the verb."
      ],
      quiz: [
        { q: "A `POST` successfully creates a resource. Best status code?", a: ["200", "201", "204", "302"], c: 1, why: "201 Created, ideally with a `Location` header pointing at the new resource." },
        { q: "In `app.MapGet(\"/items/{id:int}\", (int id) => …)`, a request to `/items/abc` returns…", a: ["500", "404", "200 with id = 0", "400"], c: 1, why: "The `:int` constraint does not match, so no route is found." },
        { q: "Where does a complex-type parameter like `CreateProduct input` bind from by default in a POST?", a: ["Query string", "Route", "JSON body", "Cookies"], c: 2, why: "Complex types bind from the body; simple types bind from route or query." }
      ]
    },
    // ---------------- Intermediate ----------------
    {
      id: 'middleware', title: 'The middleware pipeline', level: 1, mins: 30, viz: 'middleware',
      why: "Authentication, CORS, error handling, logging and routing are all middleware. Order bugs here are among the most common ASP.NET Core mistakes, and they are invisible unless you hold the picture in your head.",
      points: [
        "A request passes through a chain of middleware **in the order registered**, and the response travels back through them in **reverse**.",
        "Each middleware may do work before `next()`, call `next()`, do work after — or **short-circuit** by not calling `next()` at all.",
        "Order matters: exception handling first (so it wraps everything), then HTTPS, static files, routing, CORS, authentication, authorization, endpoints.",
        "`UseAuthentication` answers 'who are you?'; `UseAuthorization` answers 'may you do this?'. Authorization before authentication can never succeed.",
        "Custom middleware is just `app.Use(async (context, next) => { … })` or a class with `InvokeAsync`.",
        "Endpoint filters and action filters are finer-grained hooks that run inside the endpoint stage."
      ],
      code: `
var app = builder.Build();

app.UseExceptionHandler();        // outermost: catches everything below
app.UseHttpsRedirection();

// Custom timing middleware
app.Use(async (context, next) =>
{
    var sw = Stopwatch.StartNew();
    await next(context);                                  // run the rest of the pipeline
    app.Logger.LogInformation("{Method} {Path} -> {Status} in {Ms} ms",
        context.Request.Method, context.Request.Path,
        context.Response.StatusCode, sw.ElapsedMilliseconds);
});

app.UseAuthentication();          // who are you?
app.UseAuthorization();           // are you allowed?

app.MapGet("/secret", () => "42").RequireAuthorization();
app.Run();
`,
      practice: "Write middleware that rejects any request without an `X-Api-Key` header with 401, without calling `next`. Place it before and then after `UseExceptionHandler` and describe what changes.",
      teach: "Explain why middleware order matters, using authentication and authorization as the example.",
      analogy: "Airport departure: check-in, security, passport control, gate. Everyone passes through in that order, and any station can turn you back. You cannot run passport control before anyone has checked who you are. On the way back in, you pass the same stations in reverse.",
      pitfalls: [
        "Putting `UseAuthorization` before `UseAuthentication` and wondering why every request is 401.",
        "Writing to the response after calling `next()` when the response has already started.",
        "Forgetting that code after `await next()` runs on the way back out."
      ],
      quiz: [
        { q: "Middleware A is registered before B. On the response path, which runs its 'after' code first?", a: ["A", "B", "Both at once", "Neither"], c: 1, why: "The pipeline unwinds in reverse: B finishes, then A." },
        { q: "What does 'short-circuiting' mean?", a: ["The app crashes", "A middleware returns a response without calling `next`", "Two middleware run in parallel", "The request is retried"], c: 1, why: "Later middleware and the endpoint never run — as with a 401 or a cached response." },
        { q: "Why should exception handling middleware be registered first?", a: ["It is the fastest", "So it wraps and catches exceptions from everything after it", "It needs the request body", "Convention only"], c: 1, why: "A middleware can only catch exceptions thrown by components it calls via `next`." }
      ]
    },
    {
      id: 'di', title: 'Dependency injection and service lifetimes', level: 1, mins: 35, viz: 'di',
      why: "DI is the backbone of ASP.NET Core. Choosing the wrong lifetime causes stale data, shared-state races and the infamous 'cannot consume scoped service from singleton' error.",
      points: [
        "Classes declare what they need in the constructor; the **container** creates and supplies it. Classes do not `new` their own dependencies.",
        "**Transient**: a new instance every time it is requested. For lightweight, stateless services.",
        "**Scoped**: one instance per HTTP request. The default for anything touching the database — `DbContext` is scoped.",
        "**Singleton**: one instance for the whole app lifetime. Must be thread-safe and hold no per-user state.",
        "**Captive dependency**: a singleton that holds a scoped service keeps it alive forever. Never inject shorter lifetimes into longer ones.",
        "DI gives testability (swap in fakes), single configuration point, and automatic disposal."
      ],
      code: `
public interface IClock { DateTime UtcNow { get; } }
public class SystemClock : IClock { public DateTime UtcNow => DateTime.UtcNow; }

public class OrderService(AppDbContext db, IClock clock, ILogger<OrderService> log)
{
    public async Task<Order> PlaceAsync(int productId)
    {
        var order = new Order { ProductId = productId, PlacedAt = clock.UtcNow };
        db.Orders.Add(order);
        await db.SaveChangesAsync();
        log.LogInformation("Order {Id} placed", order.Id);
        return order;
    }
}

// Program.cs
builder.Services.AddSingleton<IClock, SystemClock>();        // stateless, thread-safe
builder.Services.AddScoped<OrderService>();                  // per request
builder.Services.AddDbContext<AppDbContext>(o => o.UseSqlServer(cs));  // scoped
builder.Services.AddTransient<IEmailBuilder, EmailBuilder>();

app.MapPost("/orders/{productId:int}", (int productId, OrderService svc) => svc.PlaceAsync(productId));
`,
      practice: "Register a service with a `Guid Id = Guid.NewGuid()` property three times — transient, scoped and singleton — and return all three IDs from an endpoint that injects each twice. Refresh and explain the pattern.",
      teach: "Explain the three service lifetimes and why a `DbContext` must not be injected into a singleton.",
      analogy: "A hotel. **Singleton** is the lobby clock: one for everyone, forever. **Scoped** is your room key: yours for this stay, the same one each time you ask at the desk, returned at checkout. **Transient** is a paper cup: a fresh one every time you ask.",
      pitfalls: [
        "Storing per-user data in a singleton — every user then sees it.",
        "Injecting a scoped service into a singleton (captive dependency). Use `IServiceScopeFactory` instead.",
        "Service locator: pulling services from `IServiceProvider` everywhere instead of declaring them in the constructor."
      ],
      quiz: [
        { q: "Within a single HTTP request, a scoped service is injected into two different classes. How many instances exist?", a: ["One", "Two", "One per thread", "Zero until first use, then two"], c: 0, why: "Scoped means one instance per scope, and each request is one scope." },
        { q: "Which lifetime does `AddDbContext` use by default?", a: ["Singleton", "Scoped", "Transient", "Static"], c: 1, why: "A `DbContext` is a unit of work for one request and is not thread-safe." },
        { q: "What is a captive dependency?", a: ["A circular reference", "A shorter-lived service held by a longer-lived one", "A service with no interface", "A disposed service"], c: 1, why: "For example, a singleton holding a scoped `DbContext` — it never gets released." }
      ]
    },
    {
      id: 'efcore', title: 'EF Core: your database in C#', level: 1, mins: 40,
      why: "EF Core is where C#, LINQ and SQL meet. Used well it removes boilerplate; used blindly it generates slow queries you cannot see. Teach students to always look at the SQL.",
      points: [
        "A `DbContext` is a session with the database; each `DbSet<T>` maps to a table and each entity class to a row.",
        "LINQ on a `DbSet` is translated to SQL and executed when enumerated (`ToListAsync`, `FirstOrDefaultAsync`).",
        "**Migrations** version the schema in code: `dotnet ef migrations add Init`, `dotnet ef database update`.",
        "**Change tracking**: load an entity, modify it, call `SaveChangesAsync` — EF generates the `UPDATE`.",
        "Relationships use navigation properties; load related data explicitly with `Include`, or better, project with `Select`.",
        "Parameters are always sent as SQL parameters — LINQ queries are safe from SQL injection."
      ],
      code: `
public class Product
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public decimal Price { get; set; }
    public int CategoryId { get; set; }
    public Category Category { get; set; } = null!;
}

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Product> Products => Set<Product>();
    public DbSet<Category> Categories => Set<Category>();
}

// Read: projection means only the needed columns are selected
var list = await db.Products
    .Where(p => p.Price < 100)
    .OrderBy(p => p.Name)
    .Select(p => new { p.Id, p.Name, Category = p.Category.Name })
    .ToListAsync(ct);

// Update: change tracking writes the UPDATE for you
var product = await db.Products.FindAsync([id], ct);
if (product is null) return Results.NotFound();
product.Price *= 0.9m;
await db.SaveChangesAsync(ct);
`,
      practice: "Add EF Core with SQLite to your products API, create a migration, and replace the in-memory list. Turn on `LogTo(Console.WriteLine)` and read the SQL for each endpoint. Is it what you would have written by hand?",
      teach: "Explain how a C# LINQ expression such as `db.Products.Where(p => p.Price < 100)` becomes a SQL query.",
      analogy: "EF Core is an interpreter between two people who speak different languages. You speak C# objects; the database speaks SQL tables. A good interpreter is a gift — but if you never learn the other language, you will not notice when the translation is long-winded or wrong.",
      pitfalls: [
        "Never looking at the generated SQL.",
        "Calling `ToList()` early and filtering in memory instead of in the database.",
        "Returning tracked entities straight from the API, causing serialization cycles and over-exposure."
      ],
      quiz: [
        { q: "When does `db.Products.Where(p => p.Price < 100)` hit the database?", a: ["Immediately", "When enumerated, e.g. by `ToListAsync()`", "When the app starts", "When `SaveChanges` is called"], c: 1, why: "`IQueryable` is deferred just like LINQ to Objects." },
        { q: "What does a migration contain?", a: ["A database backup", "Code describing a schema change, with up and down steps", "Seed data only", "Compiled SQL Server binaries"], c: 1, why: "Migrations are versioned, reviewable schema changes." },
        { q: "You loaded an entity and changed a property. What writes it to the database?", a: ["Nothing, it is automatic on change", "`db.SaveChangesAsync()`", "`db.Update()` is always required", "Disposing the context"], c: 1, why: "The change tracker detects the modification; `SaveChanges` sends the UPDATE." }
      ]
    },
    {
      id: 'validation', title: 'DTOs, validation and error handling', level: 1, mins: 30,
      why: "An API is a contract with strangers. Validating every input and returning consistent, machine-readable errors is what separates a demo from a product.",
      points: [
        "**Never trust input.** Validate at the boundary and return `400 Bad Request` with details.",
        "**DTOs** (request and response records) decouple your API contract from your database entities and prevent over-posting.",
        "Data annotations (`[Required]`, `[Range]`, `[StringLength]`) or FluentValidation express rules declaratively.",
        "**ProblemDetails** (RFC 9457) is the standard JSON error shape: `type`, `title`, `status`, `detail`, `errors`.",
        "Handle unexpected exceptions centrally with `UseExceptionHandler` / `IExceptionHandler` — log the detail, return a generic 500. Never leak stack traces.",
        "Expected failures (not found, conflict, validation) are not exceptions; return result codes for them."
      ],
      code: `
public record CreateProductRequest(
    [Required, StringLength(100)] string Name,
    [Range(0.01, 100_000)] decimal Price);

public record ProductResponse(int Id, string Name, decimal Price);

builder.Services.AddProblemDetails();
builder.Services.AddValidation();            // validates minimal API parameters

app.UseExceptionHandler();                   // unhandled -> ProblemDetails 500

app.MapPost("/api/products", async (CreateProductRequest req, AppDbContext db) =>
{
    if (await db.Products.AnyAsync(p => p.Name == req.Name))
        return Results.Problem(statusCode: 409, title: "A product with this name exists");

    var entity = new Product { Name = req.Name, Price = req.Price };
    db.Products.Add(entity);
    await db.SaveChangesAsync();
    return Results.Created($"/api/products/{entity.Id}",
        new ProductResponse(entity.Id, entity.Name, entity.Price));
});

// 400 response body:
// { "title": "One or more validation errors occurred.", "status": 400,
//   "errors": { "Price": ["The field Price must be between 0.01 and 100000."] } }
`,
      practice: "Add validation to every write endpoint in your API. Send five different invalid requests and confirm each returns a `400` ProblemDetails naming the bad field. Then throw an exception on purpose and confirm no stack trace reaches the client in Production mode.",
      teach: "Explain why an API should use separate request/response DTOs instead of accepting and returning the database entity.",
      analogy: "A DTO is the order form at a counter; the entity is the warehouse record. Customers fill in the form — they do not get to walk into the warehouse and edit the stock ledger, including the columns they were never meant to see such as cost price or `IsAdmin`.",
      pitfalls: [
        "Binding directly to entities and letting clients set fields like `IsAdmin` (over-posting).",
        "Using exceptions for validation failures.",
        "Returning different error shapes from different endpoints."
      ],
      quiz: [
        { q: "A client sends a negative price. Correct response?", a: ["500", "200 with an error string", "400 with validation details", "404"], c: 2, why: "Invalid client input is a 4xx; 400 with field-level details lets the client fix it." },
        { q: "What problem do request DTOs prevent?", a: ["Slow queries", "Over-posting: clients setting properties they should not control", "Memory leaks", "CORS errors"], c: 1, why: "Only the fields on the DTO can be bound from the request." },
        { q: "What should an unhandled exception return in production?", a: ["The stack trace, for debugging", "A generic 500 ProblemDetails, with details logged server-side", "200", "The SQL that failed"], c: 1, why: "Internal details help attackers; logs are for you, the response is for the client." }
      ]
    },
    // ---------------- Advanced ----------------
    {
      id: 'auth', title: 'Authentication and authorization', level: 2, mins: 45,
      why: "Security bugs are the expensive ones. Every backend developer must be able to explain who the caller is, how the server knows, and how each endpoint decides what they may do.",
      points: [
        "**Authentication** = proving identity. **Authorization** = deciding permission. Two separate steps, two separate middleware.",
        "**Cookies** suit browser apps on the same site; **JWT bearer tokens** suit APIs called by SPAs, mobile apps and other services.",
        "A JWT is three base64 parts: header, payload (claims), signature. It is **signed, not encrypted** — anyone can read it; nobody can alter it undetected.",
        "The server validates signature, issuer, audience and expiry on every request. Keep access tokens short-lived and use refresh tokens.",
        "Authorize with roles, **policies** (`RequireClaim`, custom requirements) and resource-based checks ('is this order yours?').",
        "Never store passwords: store a salted slow hash (ASP.NET Core Identity does this) or delegate to an identity provider via OpenID Connect. Configure CORS explicitly for SPA origins."
      ],
      code: `
builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(o =>
    {
        o.Authority = "https://login.example.com";   // identity provider
        o.Audience = "shop-api";
    });

builder.Services.AddAuthorizationBuilder()
    .AddPolicy("CanManageProducts", p => p.RequireRole("Admin"))
    .AddPolicy("Adult", p => p.RequireAssertion(ctx =>
        int.TryParse(ctx.User.FindFirst("age")?.Value, out var age) && age >= 18));

app.UseAuthentication();
app.UseAuthorization();

app.MapGet("/api/products", () => "public");
app.MapDelete("/api/products/{id:int}", (int id) => Results.NoContent())
   .RequireAuthorization("CanManageProducts");

// Resource-based: the order must belong to the caller
app.MapGet("/api/orders/{id:int}", async (int id, ClaimsPrincipal user, AppDbContext db) =>
{
    var userId = user.FindFirstValue(ClaimTypes.NameIdentifier);
    var order = await db.Orders.FirstOrDefaultAsync(o => o.Id == id && o.UserId == userId);
    return order is null ? Results.NotFound() : Results.Ok(order);
}).RequireAuthorization();
`,
      practice: "Secure your API with JWT using `dotnet user-jwts create` for local tokens. Add one admin-only endpoint and one 'own data only' endpoint. Prove with requests that 401 (no token), 403 (wrong role) and 404 (someone else's order) each occur.",
      teach: "Explain the difference between 401 and 403, and why a JWT can be trusted even though anyone can read its contents.",
      analogy: "Authentication is showing your passport at the border; authorization is the visa inside saying what you may do. A JWT is a festival wristband: staff can see at a glance what it grants, it expires tonight, and the tamper-proof seal (signature) shows it was issued by the box office.",
      pitfalls: [
        "Putting secrets or sensitive data in a JWT payload — it is readable by anyone.",
        "Checking only 'is logged in' and forgetting to check ownership of the specific resource (IDOR).",
        "Long-lived access tokens with no revocation plan; storing tokens in `localStorage` where any XSS can read them."
      ],
      quiz: [
        { q: "A logged-in user without the Admin role calls an admin endpoint. Status?", a: ["401", "403", "404", "500"], c: 1, why: "401 means not authenticated; 403 means authenticated but not permitted." },
        { q: "What does the signature of a JWT guarantee?", a: ["The payload is secret", "The token was issued by the holder of the key and not modified", "The token never expires", "The user is an admin"], c: 1, why: "Signing provides integrity and authenticity, not confidentiality." },
        { q: "Which check prevents user A reading user B's order at `/orders/17`?", a: ["`[Authorize]` alone", "A resource-based check that the order belongs to the caller", "HTTPS", "CORS"], c: 1, why: "Being authenticated is not enough; ownership must be verified per resource." }
      ]
    },
    {
      id: 'config', title: 'Options, logging and environments', level: 2, mins: 30,
      why: "The same build must run on a laptop, in CI and in production with different settings — and when it breaks at 3 a.m., logs are the only witness.",
      points: [
        "The **options pattern** binds a config section to a typed class: `IOptions<T>` (fixed), `IOptionsSnapshot<T>` (per request), `IOptionsMonitor<T>` (live reload).",
        "Validate options at startup with `ValidateDataAnnotations().ValidateOnStart()` — fail fast, not on the first request.",
        "**Structured logging**: `log.LogInformation(\"Order {OrderId} placed\", id)` keeps `OrderId` as a searchable field. Never use string interpolation in log calls.",
        "Log levels: Trace, Debug, Information, Warning, Error, Critical. Configure per category in `appsettings`.",
        "Secrets: user secrets in development, environment variables or a vault (Azure Key Vault, AWS Secrets Manager) in production — never in source control.",
        "Use scopes or `Activity` to attach a correlation ID so one request can be followed across services."
      ],
      code: `
public class SmtpOptions
{
    public const string Section = "Smtp";
    [Required] public string Host { get; init; } = "";
    [Range(1, 65535)] public int Port { get; init; } = 587;
}

builder.Services.AddOptions<SmtpOptions>()
    .BindConfiguration(SmtpOptions.Section)
    .ValidateDataAnnotations()
    .ValidateOnStart();                       // crash at startup if misconfigured

public class Mailer(IOptions<SmtpOptions> options, ILogger<Mailer> log)
{
    private readonly SmtpOptions _smtp = options.Value;

    public void Send(string to)
    {
        // Structured: To and Host become queryable properties
        log.LogInformation("Sending mail to {To} via {Host}", to, _smtp.Host);
    }
}

// appsettings.json
// { "Smtp": { "Host": "smtp.example.com", "Port": 587 },
//   "Logging": { "LogLevel": { "Default": "Information", "Microsoft.AspNetCore": "Warning" } } }
`,
      practice: "Move every magic string and number in your API into a validated options class. Break one setting on purpose and confirm the app refuses to start with a clear message.",
      teach: "Explain why `log.LogInformation(\"User {Id} logged in\", id)` is better than using an interpolated string.",
      analogy: "Options are the settings panel of an appliance: one clearly labelled place, checked when you plug it in rather than discovered broken mid-wash. Structured logs are a filing cabinet with labelled folders instead of a pile of handwritten notes — you can ask for 'everything about order 42'.",
      pitfalls: [
        "Injecting `IConfiguration` everywhere and reading string keys.",
        "String-interpolated log messages, which destroy structure and allocate even when the level is disabled.",
        "Logging secrets, tokens or personal data."
      ],
      quiz: [
        { q: "What does `ValidateOnStart()` change?", a: ["Nothing", "Invalid options fail at application startup instead of first use", "Options reload automatically", "Validation is skipped in production"], c: 1, why: "Failing fast at startup turns a hidden runtime bug into an obvious deployment failure." },
        { q: "Which option interface reflects configuration changes without restarting?", a: ["`IOptions<T>`", "`IOptionsMonitor<T>`", "`IConfigurationRoot`", "`IOptionsFactory<T>` only"], c: 1, why: "`IOptionsMonitor` is a singleton that observes changes; `IOptions` is computed once." },
        { q: "Where should a production database password live?", a: ["`appsettings.json` in git", "An environment variable or secret vault", "A code constant", "The README"], c: 1, why: "Secrets must be kept out of source control and injected at deploy time." }
      ]
    },
    {
      id: 'testing', title: 'Testing APIs: unit and integration', level: 2, mins: 40,
      why: "Tests are how you change code without fear. They are also the best teaching tool there is: a test is an executable statement of what the code should do.",
      points: [
        "**Unit tests** check one class with dependencies faked. Fast, many, precise.",
        "**Integration tests** run the real pipeline in memory with `WebApplicationFactory<Program>` — routing, DI, filters, serialization and all.",
        "Structure every test as **Arrange, Act, Assert**. One behavior per test, named for the behavior.",
        "Prefer a real database in tests (Testcontainers or SQLite) over the EF in-memory provider, which behaves differently from a real one.",
        "Test behavior, not implementation: assert on outputs and observable effects, not on which private method was called.",
        "The test pyramid: many unit tests, fewer integration tests, a handful of end-to-end tests."
      ],
      code: `
// Unit test (xUnit)
public class PriceCalculatorTests
{
    [Theory]
    [InlineData(100, 0, 100)]
    [InlineData(100, 10, 90)]
    public void Applies_percentage_discount(decimal price, int percent, decimal expected)
    {
        var sut = new PriceCalculator();
        Assert.Equal(expected, sut.Discount(price, percent));
    }
}

// Integration test: real HTTP pipeline, in memory
public class ProductsApiTests(WebApplicationFactory<Program> factory)
    : IClassFixture<WebApplicationFactory<Program>>
{
    [Fact]
    public async Task Post_with_negative_price_returns_400()
    {
        var client = factory.CreateClient();

        var response = await client.PostAsJsonAsync("/api/products",
            new { name = "Bad", price = -1 });

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        var problem = await response.Content.ReadFromJsonAsync<ValidationProblemDetails>();
        Assert.Contains("Price", problem!.Errors.Keys);
    }
}
`,
      practice: "Write integration tests for every endpoint of your products API covering the happy path and at least one failure each. Then change a status code in the API and watch exactly one test fail with a readable message.",
      teach: "Explain the difference between a unit test and an integration test, and what each one can catch that the other cannot.",
      analogy: "Unit tests check each brick is solid. Integration tests check the wall stands up. You need both: perfect bricks can still be laid crooked, and when a wall falls, you want to know quickly whether a brick was the cause.",
      pitfalls: [
        "Mocking everything until the test only verifies the mocks.",
        "Tests that depend on each other or on execution order.",
        "Trusting the EF in-memory provider to behave like SQL Server (no constraints, no real SQL)."
      ],
      quiz: [
        { q: "What does `WebApplicationFactory<Program>` give you?", a: ["A mock of the database", "Your real app hosted in memory with an `HttpClient` to call it", "A production deployment", "A browser"], c: 1, why: "It boots the actual pipeline in the test process, so routing, DI and middleware are exercised." },
        { q: "The three parts of a well-structured test are…", a: ["Build, Run, Deploy", "Arrange, Act, Assert", "Given, Then, Finally", "Setup, Loop, Exit"], c: 1, why: "Arrange the inputs, act once, assert on the outcome." },
        { q: "Why prefer a real database over the EF in-memory provider in integration tests?", a: ["It is faster", "The in-memory provider does not enforce constraints or run real SQL", "It needs no setup", "xUnit requires it"], c: 1, why: "Bugs in translation, constraints and transactions only show up against a real engine." }
      ]
    },
    {
      id: 'efadv', title: 'EF Core in depth: tracking, N+1 and concurrency', level: 2, mins: 40,
      why: "Most slow ASP.NET Core apps are slow because of a handful of EF Core mistakes. Each has a recognizable shape in the SQL log, and each has a one-line fix.",
      points: [
        "**N+1 problem**: one query for the list, then one more per row for related data. Fix with projection (`Select`) or `Include`.",
        "Read-only queries should use `AsNoTracking()` or project to DTOs — no change-tracker overhead.",
        "`Include` of several collections multiplies rows (cartesian explosion); `AsSplitQuery()` trades it for multiple queries.",
        "`SaveChanges` wraps its changes in one transaction. Use an explicit transaction only to span multiple saves.",
        "**Optimistic concurrency**: a `rowversion`/concurrency token makes an update fail with `DbUpdateConcurrencyException` if someone else changed the row first.",
        "Bulk work: `ExecuteUpdateAsync` and `ExecuteDeleteAsync` run a single SQL statement without loading entities."
      ],
      code: `
// N+1: 1 query for orders + 1 per order for its customer
var orders = await db.Orders.ToListAsync();
foreach (var o in orders)
    Console.WriteLine(o.Customer.Name);        // lazy load each time (or null!)

// Fixed: one query, only the columns needed, no tracking
var rows = await db.Orders
    .Select(o => new OrderRow(o.Id, o.Customer.Name, o.Lines.Sum(l => l.Quantity * l.UnitPrice)))
    .ToListAsync();

// Optimistic concurrency
public class Product
{
    public int Id { get; set; }
    public decimal Price { get; set; }
    [Timestamp] public byte[] RowVersion { get; set; } = [];
}

try { await db.SaveChangesAsync(); }
catch (DbUpdateConcurrencyException)
{
    return Results.Conflict("Someone else changed this product. Reload and retry.");
}

// Set-based update: one UPDATE statement, nothing loaded
await db.Products.Where(p => p.CategoryId == 3)
    .ExecuteUpdateAsync(s => s.SetProperty(p => p.Price, p => p.Price * 1.1m));
`,
      practice: "Create an endpoint that lists orders with customer names using a naive loop. Count the SQL statements in the log for 50 orders. Fix it and count again. Then simulate two users editing one product and return a 409 to the second.",
      teach: "Explain the N+1 query problem to someone who knows LINQ but has never looked at the generated SQL.",
      analogy: "N+1 is going to the supermarket once for the shopping list, then driving back separately for each item on it. Projection is taking the whole list on one trip. Optimistic concurrency is editing a shared document that warns 'this was changed since you opened it' instead of silently overwriting a colleague's work.",
      pitfalls: [
        "Enabling lazy loading and never noticing the query storm.",
        "Tracking thousands of entities for a read-only page.",
        "Last-write-wins updates that silently discard another user's change."
      ],
      quiz: [
        { q: "You list 100 orders and access `order.Customer.Name` in a loop with lazy loading. How many queries?", a: ["1", "2", "Up to 101", "100,000"], c: 2, why: "One for the orders plus one per order for its customer — the N+1 pattern." },
        { q: "What does `AsNoTracking()` do?", a: ["Disables logging", "Skips change tracking for returned entities, saving time and memory", "Prevents SQL injection", "Opens a transaction"], c: 1, why: "Read-only results do not need snapshots in the change tracker." },
        { q: "How does a `[Timestamp]` column protect updates?", a: ["It locks the row for reading", "The UPDATE includes the old version in its WHERE, so it affects 0 rows if someone else changed it", "It encrypts the row", "It retries automatically"], c: 1, why: "Zero affected rows becomes `DbUpdateConcurrencyException`, which you can turn into a 409." }
      ]
    },
    // ---------------- Expert ----------------
    {
      id: 'perf', title: 'Performance: caching, rate limiting and async pitfalls', level: 3, mins: 40,
      why: "Performance work is measurement plus a small number of well-understood levers. Experts know which lever matches which symptom and what each one costs in correctness.",
      points: [
        "Measure first: load test (k6, bombardier, NBomber), then profile. Track p50, p95 and p99 latency, not the average.",
        "**Caching layers**: response/output caching (whole responses), `HybridCache`/`IMemoryCache` (objects in-process), distributed cache such as Redis (shared between instances).",
        "Every cache needs an answer to three questions: what is the key, when does it expire, and how is it invalidated? Guard against stampedes when a hot key expires.",
        "**Rate limiting** middleware (fixed window, sliding window, token bucket, concurrency) protects the service from abuse and overload; return `429`.",
        "**Thread-pool starvation**: sync-over-async (`.Result`, `.Wait()`) blocks threads; latency climbs while CPU stays low. Fix by going async end to end.",
        "Cheap wins: response compression, pagination everywhere, `HttpClientFactory` for outbound calls, streaming large results with `IAsyncEnumerable`."
      ],
      code: `
builder.Services.AddOutputCache();
builder.Services.AddHybridCache();
builder.Services.AddRateLimiter(o =>
{
    o.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
    o.AddTokenBucketLimiter("api", b =>
    {
        b.TokenLimit = 100;                                   // burst size
        b.TokensPerPeriod = 20;                               // refill rate
        b.ReplenishmentPeriod = TimeSpan.FromSeconds(1);
    });
});

app.UseRateLimiter();
app.UseOutputCache();

// Whole response cached for 30 s, varied by query string
app.MapGet("/api/products", GetProducts)
   .CacheOutput(p => p.Expire(TimeSpan.FromSeconds(30)).SetVaryByQuery("page", "category").Tag("products"))
   .RequireRateLimiting("api");

// Object cache with stampede protection: one factory call per key
app.MapGet("/api/products/{id:int}", async (int id, HybridCache cache, AppDbContext db, CancellationToken ct) =>
    await cache.GetOrCreateAsync($"product:{id}",
        async token => await db.Products.AsNoTracking().FirstOrDefaultAsync(p => p.Id == id, token),
        cancellationToken: ct));

// Invalidate on write
app.MapPost("/api/products", async (IOutputCacheStore store, CancellationToken ct) =>
{
    /* save… */
    await store.EvictByTagAsync("products", ct);
});
`,
      practice: "Load test one endpoint of your API and record p95 latency and requests per second. Add output caching, test again, and write down both the gain and exactly how stale a response can now be.",
      teach: "Explain what thread-pool starvation is and why CPU usage stays low while the server becomes unresponsive.",
      analogy: "A cache is a whiteboard with yesterday's answers: instant to read, possibly out of date. Rate limiting is a nightclub door policy. Thread-pool starvation is a call center where every agent is on hold with a supplier — nobody is working hard, yet no customer gets through.",
      pitfalls: [
        "Caching per-user data under a shared key and showing one user another's data.",
        "Adding a cache before measuring where time actually goes.",
        "Reporting average latency, which hides the slow tail users actually feel."
      ],
      quiz: [
        { q: "Latency is rising, CPU is at 15%, and the code contains `.Result` calls. Likely cause?", a: ["CPU-bound loop", "Thread-pool starvation from blocking on async work", "Too little RAM", "Slow JSON serialization"], c: 1, why: "Blocked threads wait instead of working; queued requests cannot get a thread." },
        { q: "Which status code should a rate limiter return?", a: ["401", "403", "429", "503"], c: 2, why: "429 Too Many Requests, ideally with a `Retry-After` header." },
        { q: "Why must an app on several servers use a distributed cache for shared data?", a: ["It is always faster", "In-memory caches are per-instance, so instances would disagree", "ASP.NET requires it", "Memory caches cannot expire"], c: 1, why: "Each instance has its own memory; a shared store keeps them consistent." }
      ]
    },
    {
      id: 'arch', title: 'Architecture: boundaries, slices and background work', level: 3, mins: 45,
      why: "Architecture is deciding what can change without breaking what. An expert can defend a structure by naming the forces behind it — and can also say when it is overkill.",
      points: [
        "**Layered / Clean Architecture**: domain at the center, infrastructure at the edge, dependencies point inward. Protects business rules from framework churn.",
        "**Vertical slices**: organize by feature (`Orders/PlaceOrder`) rather than by layer. Each slice owns its request, handler, validation and query. Less ceremony, high cohesion.",
        "**CQRS**: separate read models from write models. Useful when reads and writes have different shapes or scale; needless for simple CRUD.",
        "Put invariants in the **domain model** (an `Order` that refuses invalid state), not scattered across controllers.",
        "Work that should not delay the response goes to a `BackgroundService` or queue. Use the **outbox pattern** so 'save to DB' and 'publish message' cannot disagree.",
        "Start as a **modular monolith**. Split into services only when team structure or scaling demands it — distribution adds failure modes, not simplicity."
      ],
      code: `
// Vertical slice: everything for one use case in one place
public static class PlaceOrder
{
    public record Command(int ProductId, int Quantity);
    public record Result(int OrderId, decimal Total);

    public static void Map(IEndpointRouteBuilder app) =>
        app.MapPost("/api/orders", Handle).RequireAuthorization();

    static async Task<IResult> Handle(Command cmd, AppDbContext db, ClaimsPrincipal user, CancellationToken ct)
    {
        var product = await db.Products.FindAsync([cmd.ProductId], ct);
        if (product is null) return Results.NotFound();

        var order = Order.Place(user.GetUserId(), product, cmd.Quantity);   // domain rule inside
        db.Orders.Add(order);
        db.Outbox.Add(OutboxMessage.From(new OrderPlaced(order.Id)));       // same transaction
        await db.SaveChangesAsync(ct);
        return Results.Created($"/api/orders/{order.Id}", new Result(order.Id, order.Total));
    }
}

// Background worker publishes outbox messages reliably
public class OutboxPublisher(IServiceScopeFactory scopes, IBus bus) : BackgroundService
{
    protected override async Task ExecuteAsync(CancellationToken stop)
    {
        while (!stop.IsCancellationRequested)
        {
            using var scope = scopes.CreateScope();          // scoped DbContext per iteration
            var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
            foreach (var msg in await db.Outbox.Where(m => m.SentAt == null).Take(50).ToListAsync(stop))
            {
                await bus.PublishAsync(msg, stop);
                msg.SentAt = DateTime.UtcNow;
            }
            await db.SaveChangesAsync(stop);
            await Task.Delay(TimeSpan.FromSeconds(2), stop);
        }
    }
}
`,
      practice: "Take your CRUD API and restructure one feature as a vertical slice with a rich domain method. Then write half a page: for a three-person team building an internal tool, would you choose layers, slices or plain minimal APIs — and why?",
      teach: "Explain the outbox pattern: what failure does it prevent, and how?",
      analogy: "Layers are a building organized by trade: all plumbers on floor 1, all electricians on floor 2. Slices are organized by apartment: everything one family needs is behind one door. The outbox is writing 'send this letter' in the same ledger entry as the sale, so the letter is never forgotten even if the postman is late.",
      pitfalls: [
        "Applying Clean Architecture, CQRS and MediatR to a five-endpoint CRUD app.",
        "Anemic domain models where every rule lives in a 'service' and entities are bags of setters.",
        "Splitting into microservices to fix a design problem — you get a distributed design problem."
      ],
      quiz: [
        { q: "What does the outbox pattern guarantee?", a: ["Messages are sent instantly", "A message is recorded in the same transaction as the data change, so neither happens without the other", "No duplicates are ever delivered", "The database is never locked"], c: 1, why: "Atomic write, then at-least-once delivery by a background publisher. Consumers must be idempotent." },
        { q: "Why does a `BackgroundService` create a scope to use `DbContext`?", a: ["For performance", "Hosted services are singletons and `DbContext` is scoped", "Scopes enable logging", "It is optional"], c: 1, why: "Injecting a scoped service into a singleton is a captive dependency; create a scope per unit of work." },
        { q: "When is CQRS worth its cost?", a: ["Always", "When read and write models differ significantly in shape or load", "Never", "Only with microservices"], c: 1, why: "It adds duplication and complexity; the payoff comes only when reads and writes truly diverge." }
      ]
    },
    {
      id: 'prod', title: 'Production: observability, resilience and deployment', level: 3, mins: 45,
      why: "Code is finished when it runs reliably for users, not when it compiles. Experts design for the day something fails — because something always does.",
      points: [
        "**Observability** = logs, metrics and traces. **OpenTelemetry** is the standard; a trace follows one request across services.",
        "**Health checks**: liveness ('restart me if this fails') versus readiness ('do not send me traffic yet'). They answer different questions.",
        "**Resilience** for outbound calls: timeouts always; retries with jitter for transient faults; circuit breakers to stop hammering a dead dependency. `Microsoft.Extensions.Http.Resilience` provides a standard pipeline.",
        "Only retry **idempotent** operations, or make them idempotent with an idempotency key.",
        "Ship as a container image; configuration comes from the environment; the app is stateless so any instance can serve any request.",
        "Deploy safely: database migrations that are backward compatible, graceful shutdown, rolling or blue/green releases, and a tested rollback."
      ],
      code: `
builder.Services.AddOpenTelemetry()
    .ConfigureResource(r => r.AddService("shop-api"))
    .WithTracing(t => t.AddAspNetCoreInstrumentation().AddHttpClientInstrumentation().AddOtlpExporter())
    .WithMetrics(m => m.AddAspNetCoreInstrumentation().AddRuntimeInstrumentation().AddOtlpExporter());

builder.Services.AddHealthChecks()
    .AddDbContextCheck<AppDbContext>(tags: ["ready"]);

// Outbound HTTP with timeout, retry (with jitter) and circuit breaker
builder.Services.AddHttpClient<PaymentClient>(c => c.BaseAddress = new("https://pay.example.com"))
    .AddStandardResilienceHandler();

app.MapHealthChecks("/health/live", new() { Predicate = _ => false });          // process is up
app.MapHealthChecks("/health/ready", new() { Predicate = c => c.Tags.Contains("ready") });

// Dockerfile (multi-stage)
// FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
// WORKDIR /src
// COPY . .
// RUN dotnet publish -c Release -o /app
// FROM mcr.microsoft.com/dotnet/aspnet:10.0
// WORKDIR /app
// COPY --from=build /app .
// ENTRYPOINT ["dotnet", "Shop.Api.dll"]
`,
      practice: "Containerize your API and run it with a database using Docker Compose. Add OpenTelemetry with a local collector (the .NET Aspire dashboard works well), stop the database while sending requests, and describe what the health checks, logs and traces each tell you.",
      teach: "Explain the difference between a liveness check and a readiness check, with an example where they give different answers.",
      analogy: "Logs are a diary, metrics are the car dashboard, traces are a parcel-tracking page showing every depot the package visited. A circuit breaker is the fuse in your house: after repeated faults it cuts the circuit so the wiring does not burn, then lets you try again later.",
      pitfalls: [
        "Retrying non-idempotent calls and charging a customer twice.",
        "One health endpoint that checks the database — a brief DB blip then restarts every instance.",
        "Deploying a migration that drops a column the still-running old version reads."
      ],
      quiz: [
        { q: "The database is down for 20 seconds. What should the liveness probe report?", a: ["Unhealthy, so the app restarts", "Healthy — the process itself is fine", "It should hang", "404"], c: 1, why: "Restarting the app cannot fix the database. Readiness should fail; liveness should not." },
        { q: "What does a circuit breaker do after repeated failures?", a: ["Retries faster", "Fails calls immediately for a period instead of contacting the failing dependency", "Restarts the server", "Clears the cache"], c: 1, why: "It gives the dependency time to recover and protects your own threads and latency." },
        { q: "Which operation is safe to retry automatically without extra design?", a: ["`POST /payments`", "`GET /products/5`", "`POST /orders`", "Sending an email"], c: 1, why: "`GET` is idempotent; non-idempotent operations need an idempotency key first." }
      ]
    }
  ]
});
