// @ts-check
export const track = {
  id: 'aspnet', name: 'ASP.NET Core', lang: 'cs',
  tagline: 'The backend: HTTP, APIs, dependency injection, EF Core, security, and production.',
  lessons: [
    // ---------------- Beginner ----------------
    {
      id: 'http', title: 'How the web works: HTTP in 20 minutes', level: 0, mins: 25, viz: 'journey',
      terms: [
        ['Method & URL', 'Verb (`GET`, `POST`, `PUT`, `DELETE`) plus resource path (`/api/products/7`) telling the server what action to take.'],
        ['Status code', 'Three-digit verdict (`200 OK`, `201 Created`, `400 Bad Request`, `404 Not Found`, `500 Error`) telling clients how the request turned out.'],
        ['Headers & JSON body', 'Key/value metadata (`Authorization`, `Content-Type`) wrapped around the JSON payload traveling over HTTP.']
      ],
      why: "ASP.NET Core turns HTTP requests into HTTP responses. Once you can read raw requests and responses, you can debug web issues in any framework. Every sample here is a complete `Program.cs` for .NET 10. Start with `dotnet new web`, run any `dotnet add package` lines at the top, and paste the file in. Database samples expect local SQL Server Express (`.\\SQLEXPRESS`) unless you set a `Shop` connection string.",
      points: [
        "The browser sends a **request**: a method (`GET`, `POST`, `PUT`, `DELETE`), a URL, headers, and sometimes a body.",
        "The server returns a **response**: a status code, headers, and usually an HTML or JSON body.",
        "Status families: `2xx` success, `3xx` redirect, `4xx` client error, and `5xx` server failure.",
        "HTTP is **stateless**, so each request stands alone. Identity gets sent again every time in a cookie or token.",
        "`GET` reads data without changing it, `POST` creates, `PUT` or `PATCH` updates, and `DELETE` removes.",
        "`GET`, `PUT`, and `DELETE` are **idempotent**, meaning repeating a request leaves the same result as running it once. `POST` isn't, so retrying a `POST` can create duplicate orders.",
        "A page on one origin (`http://localhost:5173`) can read responses from another (`http://localhost:5000`) only if the server sends **CORS** headers. Your React app calling this API hits that exact rule, covered in the routing lesson.",
        "Keep the browser dev tools Network tab open while working so you can inspect every request and response."
      ],
      code: `
// Program.cs: the smallest ASP.NET Core app
var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

app.MapGet("/", () => "Hello, web!");
app.MapGet("/time", () => new { now = DateTime.UtcNow });   // serialized to JSON

app.Run();

// What travels over the wire for GET /time:
//
// Request:   GET /time HTTP/1.1
//            Host: localhost:5000
//
// Response:  HTTP/1.1 200 OK
//            Content-Type: application/json; charset=utf-8
//
//            {"now":"2026-01-15T09:30:00.1234567Z"}
`,
      practice: "Run `dotnet new web`, paste the sample into `Program.cs`, and hit `/time` from the browser, `curl -i`, and the dev tools Network tab. Check the method, status code, and `Content-Type` in each.",
      teach: "Explain what happens between typing a URL and seeing a page, using the words request, response, status code, and header.",
      analogy: "HTTP works like ordering at a counter by mail. You send an envelope carrying what you want (method and URL), outer notes (headers), and the contents (body). The kitchen mails back a stamped envelope, and because it forgets you every time, you enclose your loyalty card with every order.",
      pitfalls: [
        "Thinking the server remembers the user between requests. It doesn't, so a cookie or token travels on every request.",
        "Using `GET` for actions that mutate data. Browsers, crawlers, and link previews trigger `GET` links on their own.",
        "Returning `200 OK` with an error message in the body instead of an accurate `4xx` or `5xx` code."
      ],
      quiz: [
        { id: 'status-code-family-means', q: "Which status code family means 'the client sent something wrong'?", a: ["2xx", "3xx", "4xx", "5xx"], c: 2, why: "4xx codes like 400, 401, and 404 point to a client request mistake." },
        { id: 'http-stateless-means', q: "HTTP being stateless means…", a: ["The server can't store any data", "Each request carries everything needed to process it", "Responses have no body", "Cookies are not allowed"], c: 1, why: "The protocol keeps no memory between requests. Cookies send state again with each request." },
        { id: 'network-error-happens-client', q: "A network error happens and the client automatically retries the same request. Which method is safe without extra design?", a: ["`POST /orders`", "`PUT /orders/7`", "`POST /payments`", "None of them"], c: 1, why: "`PUT` overwrites the resource with identical content, while repeating a `POST` can double an order or charge." }
      ]
    },
    {
      id: 'anatomy', title: 'Anatomy of an ASP.NET Core app', level: 0, mins: 25,
      terms: [
        ['`builder.Services` (DI container)', 'First half of `Program.cs`: registers services and database contexts *before* `builder.Build()`.'],
        ['Middleware pipeline (`app.Use*`)', 'Second half of `Program.cs`: builds the ordered chain of steps that processes each HTTP request and response.'],
        ['Minimal API endpoint', '`app.MapGet("/path", handler)` maps a route directly to a C# lambda without extra controller boilerplate.']
      ],
      predict: {
        prompt: '`appsettings.json` sets `"Greeting": "Selamat pagi"`, and the server also has the environment variable `Greeting=Hi`. What does `GET /` start with?',
        options: ['`Selamat pagi`: the JSON file is the main source of truth', '`Hi`: environment variables are loaded after `appsettings.json`, so they win', '`Hello`: the `??` fallback always applies outside Development'],
        answer: 1,
        explain: '`WebApplication.CreateBuilder` layers configuration providers in order: `appsettings.json`, `appsettings.{Environment}.json`, user secrets (Development only), environment variables, then command-line arguments. A later provider overrides an earlier one for the same key, so `Greeting=Hi` wins. The `"Hello"` fallback is used only when no provider sets the key at all.'
      },
      why: "`Program.cs` splits into two halves. Knowing which half owns a line immediately answers most 'why is my service missing?' or 'why isn't middleware running?' bugs.",
      points: [
        "In the **builder half**, register services the app depends on via `builder.Services.Add…` and wire up configuration.",
        "In the **app half** after `builder.Build()`, assemble the middleware pipeline with `app.Use…` and map endpoints with `app.Map…`. `app.Run()` starts Kestrel and waits until shutdown.",
        "**Kestrel** is the built-in web server listening on a port and passing requests into your pipeline.",
        "Configuration stacks in order: `appsettings.json` → `appsettings.{Environment}.json` → user secrets (Development only) → environment variables → CLI args. Later values override earlier ones.",
        "`ASPNETCORE_ENVIRONMENT` chooses `Development`, `Staging`, or `Production` behavior.",
        "This track uses **minimal APIs** (`app.MapGet`). Controllers (`AddControllers()` + `MapControllers()`) sit on the exact same routing engine."
      ],
      code: `
// dotnet add package Microsoft.AspNetCore.OpenApi

var builder = WebApplication.CreateBuilder(args);

// ---- 1. Services and configuration: everything the app will need ----
builder.Services.AddOpenApi();
builder.Services.AddSingleton<IGreeter, Greeter>();

string greeting = builder.Configuration["Greeting"] ?? "Hello";   // read config here, before Build()

var app = builder.Build();

// ---- 2. Pipeline: how each request is handled ----
if (app.Environment.IsDevelopment())
    app.MapOpenApi();                        // API description at /openapi/v1.json, Development only

app.UseHttpsRedirection();

app.MapGet("/", (IGreeter greeter) => greeter.Greet(greeting));

app.Run();                                   // nothing after this line runs until the app shuts down

// appsettings.json:            { "Greeting": "Selamat pagi" }
// Environment variable wins:   Greeting=Hi

public interface IGreeter { string Greet(string greeting); }

public class Greeter : IGreeter
{
    public string Greet(string greeting) => $"{greeting} from {Environment.MachineName}";
}
`,
      practice: "Create a Web API with `dotnet new webapi` and paste in the sample. Add `Greeting` to `appsettings.json`, then override it with an environment variable and confirm which value wins. Finally, move the `builder.Configuration` line below `app.Run()` and explain what happens.",
      teach: "Explain the two halves of `Program.cs`: what goes before `builder.Build()` and what goes after.",
      analogy: "Opening a restaurant has two phases. Before opening day you hire staff and stock the kitchen (register services). Once the doors open, you define the path every guest follows: host stand, coat check, table, bill (the pipeline). You can't hire a chef in the middle of serving a guest.",
      pitfalls: [
        "Registering a service after `builder.Build()`. The service collection is already read-only, and it throws.",
        "Writing code after `app.Run()` and expecting it to run at startup.",
        "Committing secrets to `appsettings.json`. Use user secrets locally and environment variables or a vault in production.",
        "Assuming `appsettings.Development.json` is used in production."
      ],
      quiz: [
        { id: 'builder-services-addscoped-calle', q: "Where must `builder.Services.AddScoped<…>()` be called?", a: ["After `app.Run()`", "Before `builder.Build()`", "Inside an endpoint handler", "Anywhere, as long as it's in `Program.cs`"], c: 1, why: "The service collection locks as soon as the app builds." },
        { id: 'same-key-exists-appsettings', q: "The same key exists in `appsettings.json` and an environment variable. Which wins by default?", a: ["`appsettings.json`", "The environment variable", "Neither: the app refuses to start", "Whichever changed most recently"], c: 1, why: "Later configuration sources override earlier ones, and environment variables load after the JSON files." },
        { id: 'what-is-kestrel', q: "What is Kestrel?", a: ["A database driver", "The cross-platform web server built into ASP.NET Core", "A reverse proxy you have to install separately", "The background job scheduler"], c: 1, why: "Kestrel listens for HTTP connections and passes requests to your pipeline. A reverse proxy like nginx or IIS can sit in front, though it's optional." }
      ]
    },
    {
      id: 'routing', title: 'Routing, endpoints and model binding', level: 0, mins: 35,
      terms: [
        ['Route constraint (`{id:int}`)', 'Ensures `/products/abc` stops immediately with 404 before entering your C# handler with a broken parameter.'],
        ['Model binding', 'Automatically pulls typed values from route segments, query strings (`?page=2`), headers, and JSON request bodies.'],
        ['`TypedResults` vs `Results`', '`TypedResults.Ok(x)` bakes concrete return types (`Results<Ok<T>, NotFound>`) into signatures so OpenAPI documents every status code.']
      ],
      predict: {
        prompt: 'With `api.MapGet("/{id:int}", ...)` registered, a client calls `GET /api/products/abc`. What comes back?',
        options: ['`400 Bad Request`: `abc` failed to bind to `int id`', '`404 Not Found`: no endpoint matched, so the handler never ran', '`500`: parsing `abc` threw inside the handler'],
        answer: 1,
        explain: 'A route constraint like `{id:int}` is part of *matching*, not validation. `abc` does not satisfy `int`, so the route never matches, and with no other endpoint for that path the app answers `404`. Without the constraint (a `/{id}` route with an `int id` parameter), the route matches but binding fails, and Minimal APIs return `400` instead.'
      },
      why: "An API is a set of endpoints. Mapping URLs to handlers, reading input safely, and returning accurate status codes are everyday backend work.",
      points: [
        "**Routing** matches an HTTP method and URL pattern like `GET /api/products/{id}` to your handler.",
        "**Model binding** pulls handler parameters from the route, query string, headers, and JSON body automatically.",
        "Return accurate results: `Ok` 200, `Created` 201, `NoContent` 204, `BadRequest` 400, and `NotFound` 404. `TypedResults` paired with `Results<…>` also documents every status in OpenAPI.",
        "Follow REST style with nouns in URLs (`/products/5`) and HTTP methods for verbs, not `/getProduct?id=5`.",
        "Route constraints like `{id:int}` decide which route matches. `/api/products/abc` never matches at all, returning **404** instead of 400, so validate input inside your handler or filter.",
        "Shared endpoint state lives for the whole app lifetime across concurrent requests, so keep it thread-safe using `ConcurrentDictionary` and `Interlocked`.",
        "**CORS** lets a frontend on another origin call the API from a browser. List the exact allowed origins."
      ],
      code: `
using System.Collections.Concurrent;
using Microsoft.AspNetCore.Http.HttpResults;

var builder = WebApplication.CreateBuilder(args);

// Allow the React dev server (another origin) to call this API from the browser
builder.Services.AddCors(o => o.AddPolicy("frontend", p =>
    p.WithOrigins("http://localhost:5173").AllowAnyHeader().AllowAnyMethod()));

var app = builder.Build();
app.UseCors("frontend");

// In-memory store, shared by every request, so it must be thread-safe
var products = new ConcurrentDictionary<int, Product>();
products[1] = new Product(1, "Laptop", 1200);
int lastId = 1;

var api = app.MapGroup("/api/products");

api.MapGet("/", (decimal? maxPrice) =>                                   // ?maxPrice=500, from the query string
    products.Values.Where(p => maxPrice is null || p.Price <= maxPrice).OrderBy(p => p.Id));

api.MapGet("/{id:int}", Results<Ok<Product>, NotFound> (int id) =>     // id, from the route
    products.TryGetValue(id, out var p) ? TypedResults.Ok(p) : TypedResults.NotFound());

api.MapPost("/", (CreateProduct input) =>                                // input, from the JSON body
{
    var product = new Product(Interlocked.Increment(ref lastId), input.Name, input.Price);
    products[product.Id] = product;
    return TypedResults.Created($"/api/products/{product.Id}", product);
});

api.MapDelete("/{id:int}", Results<NoContent, NotFound> (int id) =>
    products.TryRemove(id, out _) ? TypedResults.NoContent() : TypedResults.NotFound());

app.Run();

public record Product(int Id, string Name, decimal Price);
public record CreateProduct(string Name, decimal Price);
`,
      practice: "Add `PUT /api/products/{id}` that replaces a product and returns 404 when it doesn't exist. Test all five endpoints with an `.http` file or `curl`, and check every status code. Then call `/api/products/abc` and explain the 404.",
      teach: "Explain how ASP.NET Core knows that the `id` parameter comes from the URL and `input` comes from the request body.",
      analogy: "Routing is a hotel receptionist: 'room 204? Second floor, on the left.' Model binding is the bellhop unpacking your bag into the right drawers before you step inside. Route params go in one drawer, query params in another, and the JSON body becomes an object.",
      pitfalls: [
        "Returning 200 with `null` when nothing matches. Return 404 instead.",
        "Generating ids with `list.Count + 1`. Deleting one row makes the next id collide.",
        "Storing shared data in a plain `List<T>` mutated by concurrent requests.",
        "Exposing database entities directly in requests or responses. Map them to DTO records.",
        "Putting verbs in URLs like `/api/createProduct`. Let the HTTP method carry the verb."
      ],
      quiz: [
        { id: 'post-successfully-creates-resour', q: "A `POST` successfully creates a resource. Best status code?", a: ["200", "201", "204", "202"], c: 1, why: "201 Created, ideally with a `Location` header pointing at the new resource. 202 means 'accepted, not done yet'." },
        { id: 'app-mapget-items-id', q: "With `app.MapGet(\"/items/{id:int}\", (int id) => …)`, a request to `/items/abc` returns…", a: ["500", "404", "200 with id = 0", "400"], c: 1, why: "The `:int` constraint doesn't match, so no route is found. That's why constraints aren't a validation tool." },
        { id: 'complex-type-parameter-like', q: "Where does a complex-type parameter like `CreateProduct input` bind from by default in a POST?", a: ["Query string", "Route", "JSON body", "Form fields"], c: 2, why: "Complex types bind from the JSON body, while simple types bind from the route or query string." }
      ]
    },
    // ---------------- Intermediate ----------------
    {
      id: 'middleware', title: 'The middleware pipeline', level: 1, mins: 30, viz: 'middleware',
      terms: [
        ['Middleware delegate (`next()`)', 'Wraps each HTTP request: code before `await next()` runs on the way in, and code after runs on the way out.'],
        ['Short-circuiting', 'Returning `401` or a cached response early without invoking `next()`, skipping downstream handlers safely.'],
        ['Pipeline ordering', 'Running `ExceptionHandler` first and `UseAuthentication()` before `UseAuthorization()` keeps errors caught and identity populated first.']
      ],
      predict: {
        prompt: 'A request hits `GET /boom`, whose handler throws. Does the custom timing middleware write its `{Method} {Path} -> {Status}` log line for that request?',
        options: ['Yes, with status `500`, because `UseExceptionHandler` already handled it', 'No: the exception escapes `await next(context)`, so the log line after it never runs', 'Yes, with status `200`, because the response had not started yet'],
        answer: 1,
        explain: "Middleware nests like function calls. The handler's exception unwinds back through the timing middleware: `await next(context)` rethrows, and because there is no `try`/`finally`, the logging line is skipped. The exception keeps travelling outward to `UseExceptionHandler`, which sits *outside* the timer and turns it into a `500` ProblemDetails. Wrap the `next` call in `try`/`finally` to log every request."
      },
      why: "Error handling, CORS, authentication, and logging are all middleware. Misordering them is a classic ASP.NET Core mistake, and it's tough to spot until you picture how the pipeline flows.",
      points: [
        "Requests pass through middleware **in registration order**, and responses unwind back out in **reverse**.",
        "Each middleware can act before `next()`, await `next()`, act after it, or **short-circuit** by skipping `next()` altogether.",
        "Order matters: exception handling wraps everything first, followed by HTTPS, static files, CORS, authentication, authorization, and endpoints.",
        "You don't need `UseRouting()` unless middleware must run before route matching, because `WebApplication` wires it up automatically.",
        "`UseExceptionHandler()` needs an error formatter like `AddProblemDetails()` or an `IExceptionHandler`, or the app crashes on startup.",
        "Custom middleware can be inline with `app.Use(async (context, next) => { … })` or a class with an `InvokeAsync` method."
      ],
      code: `
// dotnet add package Microsoft.AspNetCore.Authentication.JwtBearer

using System.Diagnostics;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddProblemDetails();              // UseExceptionHandler() fails at startup without this
builder.Services.AddAuthentication().AddJwtBearer();
builder.Services.AddAuthorization();

var app = builder.Build();

app.UseExceptionHandler();        // outermost: turns any exception below into a 500 ProblemDetails
app.UseHttpsRedirection();

// Custom middleware: time every request
app.Use(async (context, next) =>
{
    var sw = Stopwatch.StartNew();
    await next(context);                                        // run the rest of the pipeline
    app.Logger.LogInformation("{Method} {Path} -> {Status} in {Ms} ms",
        context.Request.Method, context.Request.Path,
        context.Response.StatusCode, sw.ElapsedMilliseconds);  // runs on the way back out
});

app.UseAuthentication();          // who are you?
app.UseAuthorization();           // are you allowed?

app.MapGet("/", () => "public");
app.MapGet("/secret", () => "42").RequireAuthorization();       // 401 without a valid token
app.MapGet("/boom", string () => throw new InvalidOperationException("Something broke"));

app.Run();
`,
      practice: "Write middleware that rejects any request without an `X-Api-Key` header with 401, without calling `next`. Place it before and then after the timing middleware and describe what changes in the log. Call `/boom` with `ASPNETCORE_ENVIRONMENT` set to `Production` and check that no stack trace reaches the client.",
      teach: "Explain why middleware order matters, using authentication and authorization as the example.",
      analogy: "Airport departure: check-in, security, passport control, gate. Everyone passes through in that order, and any station can turn you back. You can't run passport control before anyone has checked who you are. Coming home, you pass the same kinds of stations in reverse.",
      pitfalls: [
        "Putting `UseAuthorization` before `UseAuthentication`. At that point nobody is signed in yet, so every protected endpoint returns 401.",
        "Calling `UseExceptionHandler()` without `AddProblemDetails()` and getting a startup crash.",
        "Writing to the response after `next()` when the response has already started.",
        "Forgetting that code after `await next()` runs on the way back out."
      ],
      quiz: [
        { id: 'middleware-registered-response-p', q: "Middleware A is registered before B. On the response path, which runs its 'after' code first?", a: ["A", "B", "Both at once", "Whichever finishes its 'before' code first"], c: 1, why: "The pipeline unwinds in reverse: B finishes, then A." },
        { id: 'short-circuiting-mean', q: "What does 'short-circuiting' mean?", a: ["The app crashes", "A middleware writes a response without calling `next`", "Two middleware run in parallel", "The request skips routing but still reaches the endpoint"], c: 1, why: "Later middleware and the endpoint never run, as with a 401 or a cached response." },
        { id: 'exception-handling-middleware-re', q: "Why should exception-handling middleware be registered first?", a: ["It is the fastest", "So it wraps, and can catch exceptions from, everything after it", "It needs to read the request body first", "Only for readability"], c: 1, why: "A middleware can only catch exceptions thrown by components it calls through `next`." }
      ]
    },
    {
      id: 'di', title: 'Dependency injection and service lifetimes', level: 1, mins: 35, viz: 'di',
      terms: [
        ['`Transient`', 'Creates a fresh instance every single time a constructor or endpoint requests it.'],
        ['`Scoped`', 'One instance shared per HTTP request and disposed at the end, which `DbContext` and unit-of-work state require.'],
        ['Captive dependency bug', 'Injecting a short-lived `Scoped` service inside a long-lived `Singleton`, pinning stale DB state forever.']
      ],
      predict: {
        prompt: 'You change `AddScoped<OrderService>()` to `AddSingleton<OrderService>()` while `AppDbContext` stays scoped. What happens when the app starts in Development?',
        options: ['It works, but every request shares one `DbContext`', 'Startup fails: the container refuses a singleton that depends on a scoped service', 'Each request still gets a fresh `DbContext`, because EF Core re-scopes it'],
        answer: 1,
        explain: 'In Development, the host turns on `ValidateScopes` and `ValidateOnBuild`, so `builder.Build()` throws an `InvalidOperationException` explaining that it cannot consume scoped service `AppDbContext` from singleton `OrderService`. In Production those checks are off by default, so the captive dependency would silently share one non-thread-safe `DbContext` across every request. That is why the Development check is so valuable.'
      },
      why: "DI wires the whole app together in ASP.NET Core. Picking the wrong lifetime causes stale data, race conditions on shared state, and the 'cannot consume scoped service from singleton' crash.",
      points: [
        "Classes ask for what they need in constructors, and the **container** builds and passes it in instead of classes calling `new` themselves.",
        "Pick **transient** for lightweight stateless helpers where every resolution should create a fresh instance.",
        "Pick **scoped** for one shared instance per HTTP request, the standard lifetime for database work like `DbContext`.",
        "Pick **singleton** when one instance lives for the whole app. Keep it thread-safe and free of per-user state.",
        "Watch out for a **captive dependency**, where a singleton holds a scoped service open forever. Development checks for this and throws, while Production skips the check and lets the bug slip in.",
        "`TimeProvider` is .NET's built-in clock. Inject it instead of calling `DateTime.UtcNow` so tests can substitute a fake clock."
      ],
      code: `
// dotnet add package Microsoft.EntityFrameworkCore.SqlServer

using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);
var cs = builder.Configuration.GetConnectionString("Shop")
         ?? @"Server=.\\SQLEXPRESS;Database=Shop;Trusted_Connection=True;TrustServerCertificate=True";

builder.Services.AddSingleton(TimeProvider.System);                        // stateless, thread-safe
builder.Services.AddDbContext<AppDbContext>(o => o.UseSqlServer(cs));      // scoped: one per request
builder.Services.AddScoped<OrderService>();                                // uses the DbContext, so scoped too

var app = builder.Build();

app.MapPost("/orders/{productId:int}", async (int productId, OrderService orders) =>
{
    var order = await orders.PlaceAsync(productId);
    return Results.Created($"/orders/{order.Id}", new { order.Id, order.PlacedAt });
});

app.Run();

public class OrderService(AppDbContext db, TimeProvider clock, ILogger<OrderService> log)
{
    public async Task<Order> PlaceAsync(int productId)
    {
        var order = new Order { ProductId = productId, PlacedAt = clock.GetUtcNow() };
        db.Orders.Add(order);
        await db.SaveChangesAsync();
        log.LogInformation("Order {OrderId} placed", order.Id);
        return order;
    }
}

public class Order
{
    public int Id { get; set; }
    public int ProductId { get; set; }
    public DateTimeOffset PlacedAt { get; set; }
}

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Order> Orders => Set<Order>();
}
`,
      practice: "Register a class with `Guid Id = Guid.NewGuid()` as transient, scoped, and singleton, then inject each lifetime twice into one endpoint and return all six ids. Refresh a few times and explain the pattern. Next, switch `OrderService` to singleton, start in Development, and inspect the error.",
      teach: "Explain the three service lifetimes and why a `DbContext` must not be injected into a singleton.",
      analogy: "Think of a hotel. **Singleton** is the lobby clock shared by everyone forever. **Scoped** is your room key, the same card for your whole stay and returned at checkout. **Transient** is a paper cup, fresh every single time you ask.",
      pitfalls: [
        "Storing per-user data in a singleton, letting every user read it.",
        "Injecting a scoped service into a singleton. Inject `IServiceScopeFactory` instead and create a scope per job.",
        "Pulling services from `IServiceProvider` inside methods instead of declaring constructor dependencies (the service locator anti-pattern)."
      ],
      quiz: [
        { id: 'within-single-http-request', q: "Within a single HTTP request, a scoped service is injected into two different classes. How many instances exist?", a: ["One", "Two", "One per thread", "Two, then merged at the end of the request"], c: 0, why: "Scoped creates one instance per scope, and every request gets one scope." },
        { id: 'lifetime-adddbcontext-use-defaul', q: "Which lifetime does `AddDbContext` use by default?", a: ["Singleton", "Scoped", "Transient", "Pooled singleton"], c: 1, why: "A `DbContext` tracks one request's unit of work and isn't thread-safe." },
        { id: 'captive-dependency', q: "What is a captive dependency?", a: ["A circular reference between two services", "A shorter-lived service held by a longer-lived one", "A service registered twice", "A service that is never disposed"], c: 1, why: "Think of a singleton keeping a scoped `DbContext`: it never disposes, and concurrent requests share it." }
      ]
    },
    {
      id: 'efcore', title: 'EF Core: your database in C#', level: 1, mins: 40,
      splits: [['1 · Setup & Program.cs', '// dotnet add package'], ['2 · Projection & updates', '// Read: projection'], ['3 · Entities & DbContext', 'public record ProductRow']],
      terms: [
        ['`DbContext`', 'Represents a session with the database, tracks fetched entities, and generates SQL transactions on `SaveChangesAsync()`.'],
        ['Projection (`.Select(...)`)', 'Fetches only the DTO columns you need directly in SQL instead of loading entire entity graphs into memory.'],
        ['Migration', 'Versioned C# code (`dotnet ef migrations add`) keeping database schema evolution synced in Git.']
      ],
      predict: {
        prompt: 'In the discount endpoint, imagine loading the product with `db.Products.AsNoTracking().FirstOrDefaultAsync(p => p.Id == id, ct)` instead of `FindAsync`. After `product.Price *= 0.9m;` and `SaveChangesAsync`, what happens?',
        options: ['The price is updated, exactly as before', "Nothing is saved: the entity isn't tracked, so `SaveChangesAsync` finds no changes and returns `0`", 'EF Core throws because a no-tracking entity was modified'],
        answer: 1,
        explain: '`SaveChangesAsync` only writes changes to entities the `DbContext` is tracking. `AsNoTracking()` hands back a detached object, so editing it changes memory only: no `UPDATE` is generated, no error is raised, and the call reports `0` rows affected. Use a tracked query, attach it with `db.Update(product)`, or write set-based with `ExecuteUpdateAsync`.'
      },
      why: "EF Core bridges C#, LINQ, and SQL. Used thoughtfully, it cuts boilerplate, though using it blindly hides slow queries. Checking the generated SQL is the best habit you can build here.",
      points: [
        "A `DbContext` is a session with the database, where each `DbSet<T>` maps to a table and each entity maps to a row.",
        "LINQ over a `DbSet` translates to SQL and runs only when enumerated via `ToListAsync` or `FirstOrDefaultAsync`.",
        "**Migrations** version schema changes in code. Install the CLI tool once (`dotnet tool install --global dotnet-ef`), add `Microsoft.EntityFrameworkCore.Design`, then run `dotnet ef migrations add Init` and `dotnet ef database update`.",
        "With **change tracking**, EF notices property edits on entities you loaded and generates the `UPDATE` on `SaveChangesAsync`.",
        "Load related columns by projecting with `Select`, or use `Include` when you actually need the full entities.",
        "Mark money fields with `[Precision(10, 2)]` so columns become `DECIMAL(10,2)` just like in the SQL track.",
        "LINQ and `FromSql($\"…{value}\")` parameterize inputs automatically, whereas `FromSqlRaw` with string concatenation opens SQL injection holes."
      ],
      code: `
// dotnet add package Microsoft.EntityFrameworkCore.SqlServer

using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);
var cs = builder.Configuration.GetConnectionString("Shop")
         ?? @"Server=.\\SQLEXPRESS;Database=Shop;Trusted_Connection=True;TrustServerCertificate=True";

builder.Services.AddDbContext<AppDbContext>(o => o
    .UseSqlServer(cs)
    .LogTo(Console.WriteLine, LogLevel.Information));      // print every SQL statement (development only)

var app = builder.Build();

// Read: projection selects only the columns the response needs
app.MapGet("/api/products", async (AppDbContext db, CancellationToken ct) =>
    await db.Products
        .Where(p => p.Price < 100)
        .OrderBy(p => p.Name)
        .Select(p => new ProductRow(p.Id, p.Name, p.Category.Name))
        .ToListAsync(ct));

// Update: change tracking writes the UPDATE for you
app.MapPost("/api/products/{id:int}/discount", async (int id, AppDbContext db, CancellationToken ct) =>
{
    var product = await db.Products.FindAsync([id], ct);
    if (product is null) return Results.NotFound();
    product.Price *= 0.9m;
    await db.SaveChangesAsync(ct);                     // UPDATE [Products] SET [Price] = @p0 WHERE [Id] = @p1
    return Results.NoContent();
});

// Raw SQL, safely: FromSql turns the interpolated value into a parameter
app.MapGet("/api/products/search", async (string name, AppDbContext db, CancellationToken ct) =>
    await db.Products
        .FromSql($"SELECT * FROM Products WHERE Name LIKE {name + "%"}")
        .Select(p => new ProductRow(p.Id, p.Name, p.Category.Name))
        .ToListAsync(ct));

app.Run();

public record ProductRow(int Id, string Name, string Category);

public class Product
{
    public int Id { get; set; }
    public required string Name { get; set; }
    [Precision(10, 2)] public decimal Price { get; set; }
    public int CategoryId { get; set; }
    public Category Category { get; set; } = null!;
}

public class Category
{
    public int Id { get; set; }
    public required string Name { get; set; }
}

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Product> Products => Set<Product>();
    public DbSet<Category> Categories => Set<Category>();
}
`,
      practice: "Point the sample at SQL Server Express or LocalDB (`Server=(localdb)\\MSSQLLocalDB`), add a migration and apply it, and add a few rows. Call each endpoint and read the SQL in the console. Is it what you would have written by hand?",
      teach: "Explain how a C# LINQ expression such as `db.Products.Where(p => p.Price < 100)` becomes a SQL query.",
      analogy: "EF Core translates between two languages: you speak C# objects and the database speaks SQL tables. An interpreter saves tedious work, yet without knowing SQL you won't catch bloated or wrong translations.",
      pitfalls: [
        "Never checking the generated SQL in logs.",
        "Calling `ToList()` early and filtering rows in RAM instead of SQL.",
        "Returning entities straight from endpoints: navigation properties trigger JSON cycles and leak private columns.",
        "Concatenating SQL strings inside `FromSqlRaw(\"… '\" + name + \"'\")`."
      ],
      quiz: [
        { id: 'db-products-price-100', q: "When does `db.Products.Where(p => p.Price < 100)` hit the database?", a: ["Immediately", "When enumerated, e.g. by `ToListAsync()`", "When the app starts", "When `SaveChanges` is called"], c: 1, why: "`IQueryable` stays deferred until enumerated, just like LINQ to Objects." },
        { id: 'migration-contain', q: "What does a migration contain?", a: ["A database backup", "Code describing a schema change, with `Up` and `Down` steps", "Seed data only", "The compiled SQL for every query"], c: 1, why: "Migrations are versioned, reviewable schema scripts." },
        { id: 'loaded-entity-changed-property', q: "You loaded an entity and changed a property. What writes it to the database?", a: ["Nothing: it's saved automatically when the property changes", "`db.SaveChangesAsync()`", "`db.Update()` is always required first", "Disposing the context"], c: 1, why: "Change tracking catches the edit, and `SaveChanges` sends the `UPDATE`. Call `Update()` only on untracked entities." }
      ]
    },
    {
      id: 'validation', title: 'DTOs, validation and error handling', level: 1, mins: 30,
      terms: [
        ['Input/Output DTOs', 'Separate `record` contracts (`CreateProductRequest`, `ProductResponse`) so clients cannot over-post hidden entity fields.'],
        ['`AddValidation()`', 'Minimal API opt-in endpoint filter enforcing `[Required]`, `[Range]`, and `[MaxLength]` data annotations before your handler executes.'],
        ['RFC 9457 `ProblemDetails`', 'Standard machine-readable JSON error payload (`title`, `status`, `errors`) returned on validation errors or unhandled exceptions.']
      ],
      predict: {
        prompt: 'A client posts `{ "name": "Mouse", "price": -5 }` to `/api/products`. How far does the request get?',
        options: ['The handler runs, then `SaveChangesAsync` fails and the client gets a `500`', 'Validation rejects it with a `400` before the handler body runs, so the database is never touched', 'It is saved, because `[Range]` only affects the OpenAPI document'],
        answer: 1,
        explain: '`AddValidation()` makes Minimal APIs validate parameters such as `CreateProductRequest` against their data annotations *before* the handler is invoked. `[Range(0.01, 100_000)]` fails, so the endpoint short-circuits with a `400` ValidationProblem that lists `Price` under `errors`. No `DbContext` call is made, which keeps bad input cheap to reject.'
      },
      why: "An API is a contract with strangers. Checking every input and returning consistent, predictable errors keeps other developers able to integrate without guessing.",
      points: [
        "**Never trust input.** Validate right at the boundary and answer invalid bodies with `400 Bad Request` details.",
        "**DTOs** (request and response records) keep API shapes separate from database entities and stop over-posting.",
        "Data annotations like `[Required]`, `[Range]`, and `[StringLength]` declare rules right on DTOs. In .NET 10, `AddValidation()` validates minimal API parameters automatically.",
        "**ProblemDetails** (RFC 9457) defines the standard error JSON shape: `type`, `title`, `status`, `detail`, and `errors`.",
        "Catch unexpected exceptions in one spot with `UseExceptionHandler`, logging details while returning a generic 500 without stack traces.",
        "Expected outcomes like missing rows, conflicts, or invalid inputs aren't exceptions. Return status codes for them.",
        "Enforce uniqueness like 'unique product names' with a database `UNIQUE` index. Checking in C# before inserting races whenever two requests overlap."
      ],
      code: `
// dotnet add package Microsoft.EntityFrameworkCore.SqlServer

using System.ComponentModel.DataAnnotations;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);
var cs = builder.Configuration.GetConnectionString("Shop")
         ?? @"Server=.\\SQLEXPRESS;Database=Shop;Trusted_Connection=True;TrustServerCertificate=True";

builder.Services.AddDbContext<AppDbContext>(o => o.UseSqlServer(cs));
builder.Services.AddProblemDetails();
builder.Services.AddValidation();              // validates minimal API parameters (.NET 10)

var app = builder.Build();
app.UseExceptionHandler();                     // unhandled -> 500 ProblemDetails, no stack trace

app.MapPost("/api/products", async (CreateProductRequest req, AppDbContext db) =>
{
    var entity = new Product { Name = req.Name, Price = req.Price };
    db.Products.Add(entity);
    try
    {
        await db.SaveChangesAsync();
    }
    catch (DbUpdateException ex) when (ex.InnerException is SqlException { Number: 2601 or 2627 })
    {
        // The UNIQUE index caught a duplicate, even when two requests arrive at the same moment
        return Results.Problem(statusCode: 409, title: "A product with this name already exists");
    }
    return Results.Created($"/api/products/{entity.Id}", new ProductResponse(entity.Id, entity.Name, entity.Price));
});

app.Run();

// 400 response for a negative price:
// { "title": "One or more validation errors occurred.", "status": 400,
//   "errors": { "Price": ["The field Price must be between 0.01 and 100000."] } }

public record CreateProductRequest(
    [Required, StringLength(100)] string Name,
    [Range(0.01, 100_000)] decimal Price);

public record ProductResponse(int Id, string Name, decimal Price);

public class Product
{
    public int Id { get; set; }
    [MaxLength(100)] public required string Name { get; set; }
    [Precision(10, 2)] public decimal Price { get; set; }
}

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Product> Products => Set<Product>();

    protected override void OnModelCreating(ModelBuilder b) =>
        b.Entity<Product>().HasIndex(p => p.Name).IsUnique();
}
`,
      practice: "Add validation to every write endpoint in your API. Send five different invalid requests and confirm each returns a `400` ProblemDetails naming the bad field. Send the same new product name twice in parallel and confirm one gets 201 and the other 409. Then throw an exception on purpose and confirm no stack trace reaches the client in Production.",
      teach: "Explain why an API should use separate request and response DTOs instead of accepting and returning the database entity.",
      analogy: "A DTO is the order slip at the counter, and the entity is the warehouse ledger. Customers fill out the order slip. They don't wander into the back room to edit wholesale costs or flip `IsAdmin` flags.",
      pitfalls: [
        "Binding directly to entities so callers can pass hidden fields like `IsAdmin` (over-posting).",
        "Throwing exceptions for ordinary validation failures.",
        "Checking for duplicates with `AnyAsync` before inserting without a database unique index.",
        "Returning mismatched JSON error formats across endpoints."
      ],
      quiz: [
        { id: 'client-sends-negative-price', q: "A client sends a negative price. Correct response?", a: ["500", "200 with an error message", "400 with validation details", "422 with no body"], c: 2, why: "Invalid client input belongs in 4xx, and a 400 with field errors helps callers fix it." },
        { id: 'problem-request-dtos-prevent', q: "What problem do request DTOs prevent?", a: ["Slow queries", "Over-posting: clients setting properties they shouldn't control", "Duplicate rows", "CORS errors"], c: 1, why: "Only fields defined on the DTO bind from the HTTP body." },
        { id: 'two-requests-create-product', q: "Two requests create a product called 'Lamp' at the same moment. What actually stops a duplicate?", a: ["Checking `AnyAsync` before inserting", "A `UNIQUE` index, with the duplicate-key error turned into a 409", "A `lock` around the endpoint", "Validation attributes"], c: 1, why: "Both `AnyAsync` checks can pass before either insert runs, and a `lock` fails across servers. Only a database index sees every write." }
      ]
    },
    // ---------------- Advanced ----------------
    {
      id: 'auth', title: 'Authentication and authorization', level: 2, mins: 45,
      splits: [['1 · Auth & CORS setup', '// dotnet add package'], ['2 · Endpoints & ownership', 'app.MapGet("/api/products"'], ['3 · Entity & settings', '// appsettings.json']],
      terms: [
        ['Authentication vs Authorization', 'Authentication confirms *who* you are (`ClaimsPrincipal`), while authorization checks *what* you can touch.'],
        ['Resource-based auth', 'Checking ownership (`order.UserId == callerId`) per record, returning `404` rather than revealing another user’s order exists.'],
        ['CORS policy', 'Server headers telling browsers which exact frontend origin (never `*` with credentials) may read responses cross-origin.']
      ],
      predict: {
        prompt: 'Budi signs in with a valid token (no `Admin` role) and calls `GET /api/orders/7`, an order that belongs to Ana. Which status does he get?',
        options: ['`401 Unauthorized`', '`403 Forbidden`', '`404 Not Found`'],
        answer: 2,
        explain: 'Budi is authenticated, so `RequireAuthorization()` passes and `401` is ruled out. The endpoint needs no role, so there is no `403` either. The ownership check lives in the query (`o.UserId == userId`), so nothing is found and the handler returns `404`. That is deliberate: a `403` would confirm the order exists to someone probing ids.'
      },
      why: "Security bugs are the most expensive ones to ship. Always know who is calling, how the server verifies them, and how each endpoint enforces permissions.",
      points: [
        "**Authentication** proves identity, and **authorization** enforces permissions. They are two separate steps with separate middleware.",
        "For browser SPAs like React, prefer a **backend-for-frontend** holding an `HttpOnly` session cookie while keeping tokens server-side. Reserve **JWT bearer tokens** for mobile apps and service calls.",
        "A JWT packs three base64url segments: header, payload claims, and signature. It's **signed, not encrypted**, so anyone can inspect it, though tampering breaks the signature.",
        "The server checks signature, issuer, audience, and expiry on every request. Keep access tokens short-lived.",
        "Keep token settings in config, not hardcoded: `appsettings.json` points to your identity provider, and `dotnet user-jwts` writes dev settings to `appsettings.Development.json`.",
        "Authorize with roles, **policies**, and record ownership checks ('does this order belong to the caller?').",
        "Don't roll your own password hashing: reach for ASP.NET Core Identity (salted slow hashes) or an OpenID Connect identity provider."
      ],
      code: `
// dotnet add package Microsoft.EntityFrameworkCore.SqlServer
// dotnet add package Microsoft.AspNetCore.Authentication.JwtBearer

using System.ComponentModel.DataAnnotations;
using System.Security.Claims;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);
var cs = builder.Configuration.GetConnectionString("Shop")
         ?? @"Server=.\\SQLEXPRESS;Database=Shop;Trusted_Connection=True;TrustServerCertificate=True";
builder.Services.AddDbContext<AppDbContext>(o => o.UseSqlServer(cs));

// Token settings come from configuration (see the bottom of this file)
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer();

builder.Services.AddAuthorizationBuilder()
    .AddPolicy("CanManageProducts", p => p.RequireRole("Admin"));

// The React app runs on another origin
builder.Services.AddCors(o => o.AddPolicy("frontend", p =>
    p.WithOrigins("http://localhost:5173").AllowAnyHeader().AllowAnyMethod()));

var app = builder.Build();
app.UseCors("frontend");
app.UseAuthentication();
app.UseAuthorization();

app.MapGet("/api/products", () => "public");

app.MapDelete("/api/products/{id:int}", (int id) => Results.NoContent())
   .RequireAuthorization("CanManageProducts");                 // signed in but not Admin: 403

// Resource-based: the order must belong to the caller. Someone else's order is a 404,
// so the API doesn't even confirm that it exists.
app.MapGet("/api/orders/{id:int}", async (int id, ClaimsPrincipal user, AppDbContext db) =>
{
    var userId = user.FindFirstValue(ClaimTypes.NameIdentifier);
    var order = await db.Orders
        .Where(o => o.Id == id && o.UserId == userId)
        .Select(o => new OrderResponse(o.Id, o.Total))           // a DTO, not the entity
        .FirstOrDefaultAsync();
    return order is null ? Results.NotFound() : Results.Ok(order);
}).RequireAuthorization();                                       // no token at all: 401

app.Run();

// appsettings.json (production): who issues your tokens, and for which API
// { "Authentication": { "Schemes": { "Bearer": {
//     "Authority": "https://login.example.com", "ValidAudiences": [ "shop-api" ] } } } }

public record OrderResponse(int Id, decimal Total);

public class Order
{
    public int Id { get; set; }
    [MaxLength(450)] public required string UserId { get; set; }
    [Precision(10, 2)] public decimal Total { get; set; }
}

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Order> Orders => Set<Order>();
}
`,
      practice: "Run the sample and create local tokens with `dotnet user-jwts create` (and `--role Admin` for a second one). Prove with requests that 401 (no token), 403 (signed in, not Admin) and 404 (someone else's order) each occur. Then call `/api/products` from a page on `http://localhost:5173` with and without the CORS policy and compare what the browser console says.",
      teach: "Explain the difference between 401 and 403, and why a JWT can be trusted even though anyone can read its contents.",
      analogy: "A JWT works like a festival wristband. Staff see what it allows at a glance (claims) and when it expires, and the tamper-proof seal (signature) proves the box office printed it. Anyone can read it, but nobody can forge one.",
      pitfalls: [
        "Storing secrets or sensitive data inside a JWT payload, since anyone holding the token can decode it.",
        "Checking only 'is signed in' while forgetting to verify the caller owns the requested record (IDOR).",
        "Stashing access tokens in `localStorage`, where any injected XSS script can grab them.",
        "Treating CORS like server security. It only guides browsers, while `curl` and other servers ignore it completely."
      ],
      quiz: [
        { id: 'signed-user-without-admin', q: "A signed-in user without the Admin role calls an admin-only endpoint. Status?", a: ["401", "403", "404", "400"], c: 1, why: "401 means unauthenticated, and 403 means signed in without permission." },
        { id: 'signature-jwt-guarantee', q: "What does the signature of a JWT guarantee?", a: ["The payload is secret", "The token was issued by the holder of the key and hasn't been modified", "The token hasn't expired", "The user is who they say they are, forever"], c: 1, why: "Signing gives integrity and authenticity, not secrecy. Expiry is a separate claim verified on the server." },
        { id: 'check-stops-user-reading', q: "Which check stops user A from reading user B's order at `/api/orders/17`?", a: ["`RequireAuthorization()` alone", "A query that only finds orders belonging to the caller", "HTTPS", "CORS"], c: 1, why: "Login proves identity only. Check record ownership on every private resource." }
      ]
    },
    {
      id: 'config', title: 'Options, logging and environments', level: 2, mins: 30,
      terms: [
        ['Options pattern (`IOptions<T>`)', 'Binds configuration sections into strongly typed C# classes validated on startup (`ValidateDataAnnotations().ValidateOnStart()`).'],
        ['Structured logging', 'Logging templates (`"Paid {OrderId} for {Total}"`) preserve searchable named fields in Seq/OpenTelemetry instead of plain text strings.'],
        ['User Secrets / Key Vault', 'Keeps DB passwords and API keys out of Git and `appsettings.json` per environment.']
      ],
      predict: {
        prompt: 'You deploy with no `Smtp:Host` anywhere in configuration. When does the problem surface?',
        options: ['On the first `POST /users/{userId}/welcome`, when `options.Value` is read', 'At startup: `ValidateOnStart()` runs the `[Required]` check and the host refuses to start', 'Never: `Host` defaults to `""`, which satisfies `[Required]`'],
        answer: 1,
        explain: 'Without `ValidateOnStart()`, options are validated lazily on the first `.Value` access, so a broken deployment looks healthy until a user triggers the email. `ValidateOnStart()` validates while the host starts and throws an `OptionsValidationException`, failing the deploy immediately. `[Required]` rejects empty strings by default (`AllowEmptyStrings = false`), so `""` does not slip through.'
      },
      why: "The same build runs on a laptop, in CI, and in production with different settings. When production misbehaves, logs are often all you have.",
      points: [
        "The **options pattern** binds config sections into typed classes: `IOptions<T>` reads once, `IOptionsSnapshot<T>` reloads per request, and `IOptionsMonitor<T>` reacts live.",
        "Validate options at startup with `ValidateDataAnnotations().ValidateOnStart()` so a missing key fails the deploy instead of the first request.",
        "Use **structured logging** such as `log.LogInformation(\"Order {OrderId} placed\", id)` so `OrderId` stays searchable instead of interpolating into a flat string.",
        "Log levels run Trace, Debug, Information, Warning, Error, and Critical, configured per category in `appsettings.json`.",
        "Keep secrets out of Git: use user secrets locally and environment variables or a vault like Azure Key Vault or AWS Secrets Manager in production.",
        "Attach correlation ids via log scopes or `Activity` so one request stays traceable across services."
      ],
      code: `
using System.ComponentModel.DataAnnotations;
using Microsoft.Extensions.Options;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOptions<SmtpOptions>()
    .BindConfiguration(SmtpOptions.Section)
    .ValidateDataAnnotations()
    .ValidateOnStart();                        // refuse to start if Smtp:Host is missing
builder.Services.AddSingleton<Mailer>();

var app = builder.Build();

app.MapPost("/users/{userId:int}/welcome", (int userId, Mailer mailer) =>
{
    mailer.SendWelcome(userId);
    return Results.Accepted();
});

app.Run();

// appsettings.json
// { "Smtp": { "Host": "smtp.example.com", "Port": 587 },
//   "Logging": { "LogLevel": { "Default": "Information", "Microsoft.AspNetCore": "Warning" } } }

public class SmtpOptions
{
    public const string Section = "Smtp";
    [Required] public string Host { get; init; } = "";
    [Range(1, 65535)] public int Port { get; init; } = 587;
}

public class Mailer(IOptions<SmtpOptions> options, ILogger<Mailer> log)
{
    // Structured: UserId and Host become searchable fields. The user id, not their email address.
    public void SendWelcome(int userId) =>
        log.LogInformation("Sending welcome mail to user {UserId} via {Host}", userId, options.Value.Host);
}
`,
      practice: "Move every magic string and number in your API into a validated options class. Remove `Smtp:Host` from `appsettings.json` and confirm the app refuses to start with a clear message. Then set it with the environment variable `Smtp__Host` (two underscores) and confirm it starts.",
      teach: "Explain why `log.LogInformation(\"User {Id} logged in\", id)` is better than an interpolated string.",
      analogy: "Structured logs work like a filing cabinet with labelled folders rather than loose handwritten notes. You can ask for 'everything on order 42' and pull up every event.",
      pitfalls: [
        "Injecting `IConfiguration` everywhere and reading raw string keys.",
        "Interpolating log messages with `$`, which strips named fields and still allocates even when that log level is off.",
        "Logging secrets, tokens, or personal data like user email addresses.",
        "Expecting `IOptions<T>` to reflect config edits at runtime. It reads once, so inject `IOptionsMonitor<T>` for live reloads."
      ],
      quiz: [
        { id: 'validateonstart-change', q: "What does `ValidateOnStart()` change?", a: ["Nothing", "Invalid options fail at application startup instead of first use", "Options reload automatically", "Validation is skipped in production"], c: 1, why: "Failing at startup catches config typos at deploy time instead of on a live user request." },
        { id: 'options-interface-reflects-confi', q: "Which options interface reflects configuration changes without restarting?", a: ["`IOptions<T>`", "`IOptionsMonitor<T>`", "`IConfigurationRoot`", "`IOptionsFactory<T>`"], c: 1, why: "`IOptionsMonitor` watches for config updates, while `IOptions` computes once." },
        { id: 'production-database-password-liv', q: "Where should a production database password live?", a: ["`appsettings.json`, committed to git", "An environment variable or a secret vault", "`appsettings.Production.json`, committed to git", "A constant in the code"], c: 1, why: "Keep secrets out of source control and inject them at deploy time." }
      ]
    },
    {
      id: 'testing', title: 'Testing APIs: unit and integration', level: 2, mins: 40,
      terms: [
        ['`WebApplicationFactory<T>`', 'Spins up your real ASP.NET Core pipeline (`routing`, `validation`, `middleware`) in memory for fast integration tests.'],
        ['In-memory `HttpClient`', 'Sends real HTTP JSON requests from tests into your `TestServer` without touching a network port.'],
        ['Test doubles & containers', 'Run integration tests against real SQL containers (Testcontainers) rather than EF’s InMemory provider whenever testing SQL semantics.']
      ],
      why: "Good tests let you refactor without guessing. They also double as live documentation that complains the second behavior drifts.",
      points: [
        "**Unit tests** isolate one class with fake dependencies. They're fast, plentiful, and focused.",
        "**Integration tests** boot your real HTTP pipeline in memory via `WebApplicationFactory<Program>` (`Microsoft.AspNetCore.Mvc.Testing`), exercising routing, DI, validation, and JSON serialization together.",
        "Run `dotnet new xunit` and reference the API project. `Program` is public by default in .NET 10, while .NET 8 and 9 need `public partial class Program { }` at the bottom of `Program.cs`.",
        "Write each test in **Arrange, Act, Assert** order, testing and naming one behavior per test.",
        "Back database tests with real SQL Server via Testcontainers rather than EF's in-memory provider, which skips constraints and real SQL translation.",
        "Test observable behavior rather than private internals so internal refactors don't break tests."
      ],
      code: `
// Test project: dotnet new xunit, then
// dotnet add reference ../Shop.Api
// dotnet add package Microsoft.AspNetCore.Mvc.Testing
// The API under test is the one from the validation lesson.
using System.Net;
using System.Net.Http.Json;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Testing;
using Xunit;

// Unit test: one class, no web server
public class PriceCalculatorTests
{
    [Theory]
    [InlineData(100, 0, 100)]
    [InlineData(100, 10, 90)]
    [InlineData(80, 25, 60)]
    public void Applies_percentage_discount(decimal price, int percent, decimal expected)
    {
        var calculator = new PriceCalculator();
        Assert.Equal(expected, calculator.Discount(price, percent));
    }
}

// Integration test: the real HTTP pipeline, hosted in memory
public class ProductsApiTests(WebApplicationFactory<Program> factory)
    : IClassFixture<WebApplicationFactory<Program>>
{
    [Fact]
    public async Task Post_with_negative_price_returns_400_naming_the_field()
    {
        var client = factory.CreateClient();

        var response = await client.PostAsJsonAsync("/api/products", new { name = "Bad", price = -1 });

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        var problem = await response.Content.ReadFromJsonAsync<ValidationProblemDetails>();
        Assert.Contains("Price", problem!.Errors.Keys);
    }
}

// The class under test. In a real solution it lives in the API project.
public class PriceCalculator
{
    public decimal Discount(decimal price, int percent) => price - price * percent / 100m;
}
`,
      practice: "Write integration tests for every endpoint of your products API, covering the happy path and at least one failure each. Then change a status code in the API and watch exactly one test fail with a readable message.",
      teach: "Explain the difference between a unit test and an integration test, and what each one can catch that the other can't.",
      analogy: "Unit tests verify each brick, while integration tests verify the whole wall stands. Perfect bricks can still be wired together crooked, and when the wall fails, unit tests help pinpoint which brick cracked.",
      pitfalls: [
        "Mocking so heavily that tests only verify your own mocks.",
        "Writing tests that depend on shared state or run order.",
        "Trusting EF's in-memory provider to mimic SQL Server when it ignores constraints, transactions, and real SQL."
      ],
      quiz: [
        { id: 'webapplicationfactory-program-gi', q: "What does `WebApplicationFactory<Program>` give you?", a: ["A mock of the database", "Your real app hosted in memory, with an `HttpClient` to call it", "A deployment to a test server", "A recorded copy of production traffic"], c: 1, why: "It boots your actual pipeline inside the test runner, testing routing, DI, and middleware together." },
        { id: 'three-parts-well-structured', q: "The three parts of a well-structured test are…", a: ["Setup, Run, Teardown", "Arrange, Act, Assert", "Given, When, Verify", "Mock, Call, Check"], c: 1, why: "Arrange inputs, act once, and assert the outcome." },
        { id: 'prefer-real-sql-server', q: "Why prefer real SQL Server over the EF in-memory provider in integration tests?", a: ["It's faster", "The in-memory provider doesn't enforce constraints or run real SQL", "It needs no setup", "xUnit can't use the in-memory provider"], c: 1, why: "Query translation, constraint, and transaction bugs only appear against a real database engine." }
      ]
    },
    {
      id: 'efadv', title: 'EF Core in depth: tracking, N+1 and concurrency', level: 2, mins: 40,
      splits: [['1 · N+1 vs projection', '// dotnet add package'], ['2 · Optimistic concurrency', '// Optimistic concurrency'], ['3 · Entities & DbContext', 'public record OrderRow']],
      terms: [
        ['`AsNoTracking()`', 'Skips change-tracker snapshot bookkeeping on read-only queries, cutting CPU and RAM allocations.'],
        ['N+1 query bug', 'Issuing 1 query for N rows plus N hidden queries inside a loop, solved with `.Select(...)` projection or `.Include(...)`.'],
        ['Optimistic concurrency (`[Timestamp]`)', 'Detects conflicting edits via row-version checks and returns `409 Conflict` instead of overwriting the first user’s change without warning.']
      ],
      why: "Most slow ASP.NET Core apps trace back to a handful of EF Core habits. Each one leaves an obvious pattern in the SQL log and takes just a few lines to fix.",
      points: [
        "Fix the **N+1 problem**, where one list query sparks an extra query per row, by projecting with `Select` or eager-loading with `Include`.",
        "Read-only queries should project straight to DTOs or add `AsNoTracking()` so the change tracker stays idle.",
        "Calling `Include` on multiple collections creates a Cartesian explosion of rows. `AsSplitQuery()` splits it into smaller queries.",
        "`SaveChanges` already wraps its SQL in one transaction, so add an explicit transaction only to span multiple saves.",
        "Use **optimistic concurrency** with a `[Timestamp]` (`rowversion`) column so conflicting saves throw `DbUpdateConcurrencyException`. Always send back and compare the version **the client read**, not one you just loaded.",
        "`ExecuteUpdateAsync` and `ExecuteDeleteAsync` update rows straight in SQL without loading entities, skipping tracking and concurrency checks, so save them for bulk writes."
      ],
      code: `
// dotnet add package Microsoft.EntityFrameworkCore.SqlServer

using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);
var cs = builder.Configuration.GetConnectionString("Shop")
         ?? @"Server=.\\SQLEXPRESS;Database=Shop;Trusted_Connection=True;TrustServerCertificate=True";
builder.Services.AddDbContext<AppDbContext>(o => o.UseSqlServer(cs));
var app = builder.Build();

// N+1, with lazy loading switched on: 1 query for the orders, then 1 per order for its customer
//   var orders = await db.Orders.ToListAsync();
//   foreach (var o in orders) Console.WriteLine(o.Customer.Name);

// Fixed: one query, only the columns needed, nothing tracked
app.MapGet("/api/orders", async (AppDbContext db) =>
    await db.Orders
        .Select(o => new OrderRow(o.Id, o.Customer.Name, o.Lines.Sum(l => l.Quantity * l.UnitPrice)))
        .ToListAsync());

// Optimistic concurrency across HTTP requests: the client gets the version...
app.MapGet("/api/products/{id:int}", async (int id, AppDbContext db) =>
    await db.Products.Where(p => p.Id == id)
        .Select(p => new ProductDto(p.Id, p.Price, p.Version))
        .FirstOrDefaultAsync() is { } dto ? Results.Ok(dto) : Results.NotFound());

// ...and sends it back with the edit
app.MapPut("/api/products/{id:int}", async (int id, UpdatePrice req, AppDbContext db) =>
{
    var product = await db.Products.FindAsync(id);
    if (product is null) return Results.NotFound();

    db.Entry(product).Property(p => p.Version).OriginalValue = req.Version;   // the version the user saw
    product.Price = req.Price;
    try
    {
        await db.SaveChangesAsync();                  // UPDATE … WHERE Id = @id AND Version = @seen
        return Results.NoContent();
    }
    catch (DbUpdateConcurrencyException)
    {
        return Results.Conflict(new { message = "Someone else changed this product. Reload and try again." });
    }
});

// Set-based: one UPDATE statement, nothing loaded, no concurrency check
app.MapPost("/api/categories/{id:int}/reprice", async (int id, AppDbContext db) =>
{
    int updated = await db.Products.Where(p => p.CategoryId == id)
        .ExecuteUpdateAsync(s => s.SetProperty(p => p.Price, p => p.Price * 1.1m));
    return Results.Ok(new { updated });
});

app.Run();

public record OrderRow(int Id, string Customer, decimal Total);
public record ProductDto(int Id, decimal Price, byte[] Version);
public record UpdatePrice(decimal Price, byte[] Version);

public class Customer { public int Id { get; set; } [MaxLength(100)] public required string Name { get; set; } }

public class Order
{
    public int Id { get; set; }
    public int CustomerId { get; set; }
    public Customer Customer { get; set; } = null!;
    public List<OrderLine> Lines { get; set; } = [];
}

public class OrderLine
{
    public int Id { get; set; }
    public int OrderId { get; set; }
    public int Quantity { get; set; }
    [Precision(10, 2)] public decimal UnitPrice { get; set; }
}

public class Product
{
    public int Id { get; set; }
    public int CategoryId { get; set; }
    [Precision(10, 2)] public decimal Price { get; set; }
    [Timestamp] public byte[] Version { get; set; } = [];
}

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Order> Orders => Set<Order>();
    public DbSet<Product> Products => Set<Product>();
}
`,
      practice: "Build an endpoint listing orders with customer names using a naive loop, count the SQL queries for 50 orders, then fix it and recount. Next, open one product in two tabs, save a new price in the first, save another in the second, and confirm a 409 returns.",
      teach: "Explain the N+1 query problem to someone who knows LINQ but has never looked at the generated SQL.",
      analogy: "N+1 is going to the supermarket once to fetch the shopping list, then driving back separately for each item on it. Projection is taking the whole list on one trip.",
      pitfalls: [
        "Enabling lazy loading and never noticing the storm of queries.",
        "Tracking thousands of entities for a read-only page.",
        "Adding a `[Timestamp]` column but comparing against the version you just loaded, so two users editing the same form still overwrite each other.",
        "Using `ExecuteUpdateAsync` where business rules or concurrency checks should apply."
      ],
      quiz: [
        { id: 'list-100-orders-read', q: "You list 100 orders and read `order.Customer.Name` in a loop with lazy loading. How many queries?", a: ["1", "2", "Up to 101", "100"], c: 2, why: "One for the orders plus one per order for its customer: the N+1 pattern." },
        { id: 'what-does-asnotracking-do', q: "What does `AsNoTracking()` do?", a: ["Turns off SQL logging", "Skips change tracking for the returned entities, saving time and memory", "Stops EF from caching the query plan", "Reads uncommitted data"], c: 1, why: "Read-only results don't need snapshots in the change tracker." },
        { id: 'user-loaded-product-minutes', q: "A user loaded a product 5 minutes ago and now saves an edit. Which version must the `UPDATE` compare against to catch changes made in between?", a: ["The version EF just loaded in this request", "The version the client received 5 minutes ago and sent back", "No version: `[Timestamp]` handles it automatically", "The newest version in the table"], c: 1, why: "The freshly loaded version already includes everyone else's changes, so comparing against it detects nothing." }
      ]
    },
    // ---------------- Expert ----------------
    {
      id: 'perf', title: 'Performance: caching, rate limiting and async pitfalls', level: 3, mins: 40,
      splits: [['1 · Setup & RateLimiter', '// dotnet add package'], ['2 · Cache endpoints', '// Whole response cached'], ['3 · Model & DbContext', 'public record ProductDto']],
      terms: [
        ['`OutputCache`', 'Caches the whole HTTP response bytes by route/query key so identical `GET` requests skip the endpoint completely.'],
        ['`HybridCache` (stampede protection)', 'Combines fast L1 memory + distributed L2 cache and coalesces concurrent misses so 1,000 requests trigger only 1 DB read.'],
        ['Cache invalidation', 'Evicting stale cache entries (`EvictByTagAsync` / `RemoveAsync`) on `POST`/`PUT`/`DELETE` writes.']
      ],
      why: "Tuning performance comes down to measuring first and pulling a few proven levers. Knowing which lever fits each symptom, and what staleness it trades away, makes all the difference.",
      points: [
        "Measure with load tests (k6, bombardier, NBomber) and a profiler before guessing. Track p50, p95, and p99 latency rather than averages.",
        "Pick the right **caching layer**: output caching for full HTTP responses, `HybridCache` for in-memory objects with an optional L2 store, or Redis across instances.",
        "Every cache needs a key, an expiry, and an invalidation hook. `HybridCache` also prevents stampedes by running only one factory call per cold key across concurrent requests.",
        "**Rate limiting** returns `429` when traffic spikes. Partition limits by user or IP address so one noisy client doesn't throttle everyone else.",
        "Avoid **thread-pool starvation** caused by blocking async calls with `.Result` or `.Wait()`, which spikes latency while CPU sits idle. Keep calls async top to bottom.",
        "Low-effort wins include response compression, pagination on list routes, `IHttpClientFactory` for HTTP clients, and `IAsyncEnumerable` for streaming large lists."
      ],
      code: `
// dotnet add package Microsoft.EntityFrameworkCore.SqlServer
// dotnet add package Microsoft.Extensions.Caching.Hybrid

using System.Threading.RateLimiting;
using Microsoft.AspNetCore.OutputCaching;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Hybrid;

var builder = WebApplication.CreateBuilder(args);
var cs = builder.Configuration.GetConnectionString("Shop")
         ?? @"Server=.\\SQLEXPRESS;Database=Shop;Trusted_Connection=True;TrustServerCertificate=True";
builder.Services.AddDbContext<AppDbContext>(o => o.UseSqlServer(cs));
builder.Services.AddOutputCache();
builder.Services.AddHybridCache();
builder.Services.AddRateLimiter(o =>
{
    o.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
    // One bucket PER CLIENT: a signed-in user by name, anyone else by IP address
    o.AddPolicy("api", context => RateLimitPartition.GetTokenBucketLimiter(
        context.User.Identity?.Name ?? context.Connection.RemoteIpAddress?.ToString() ?? "unknown",
        _ => new TokenBucketRateLimiterOptions
        {
            TokenLimit = 100,                              // burst size
            TokensPerPeriod = 20,                          // refill rate…
            ReplenishmentPeriod = TimeSpan.FromSeconds(1), // …per second
            QueueLimit = 0
        }));
});

var app = builder.Build();
app.UseRateLimiter();
app.UseOutputCache();

// Whole response cached for 30 s, one copy per page
app.MapGet("/api/products", async (AppDbContext db, int page = 1) =>
    await db.Products.OrderBy(p => p.Id).Skip((page - 1) * 20).Take(20)
        .Select(p => new ProductDto(p.Id, p.Name, p.Price)).ToListAsync())
   .CacheOutput(p => p.Expire(TimeSpan.FromSeconds(30)).SetVaryByQuery("page").Tag("products"))
   .RequireRateLimiting("api");

// Object cache with stampede protection: one database call per key
app.MapGet("/api/products/{id:int}", async (int id, HybridCache cache, AppDbContext db, CancellationToken ct) =>
{
    var product = await cache.GetOrCreateAsync($"product:{id}",
        async token => await db.Products.Where(p => p.Id == id)
            .Select(p => new ProductDto(p.Id, p.Name, p.Price)).FirstOrDefaultAsync(token),
        tags: ["products"],
        cancellationToken: ct);
    return product is null ? Results.NotFound() : Results.Ok(product);
}).RequireRateLimiting("api");

// Invalidate both caches on write
app.MapPost("/api/products", async (CreateProduct req, AppDbContext db, IOutputCacheStore pages,
    HybridCache cache, CancellationToken ct) =>
{
    var product = new Product { Name = req.Name, Price = req.Price };
    db.Products.Add(product);
    await db.SaveChangesAsync(ct);
    await pages.EvictByTagAsync("products", ct);
    await cache.RemoveByTagAsync("products", ct);
    return Results.Created($"/api/products/{product.Id}", new ProductDto(product.Id, product.Name, product.Price));
});

app.Run();

public record ProductDto(int Id, string Name, decimal Price);
public record CreateProduct(string Name, decimal Price);

public class Product
{
    public int Id { get; set; }
    public required string Name { get; set; }
    [Precision(10, 2)] public decimal Price { get; set; }
}

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Product> Products => Set<Product>();
}
`,
      practice: "Load test one endpoint of your API and record p95 latency and requests per second. Add output caching, test again, and write down both the gain and exactly how stale a response can now be. Then hammer the endpoint from one client and check that a second client still gets through.",
      teach: "Explain what thread-pool starvation is and why CPU usage stays low while the server stops responding.",
      analogy: "Thread-pool starvation is a call centre where every agent is on hold with a supplier: nobody is working hard, yet no customer gets through.",
      pitfalls: [
        "Caching per-user data under a shared key and showing one user another user's data.",
        "One rate-limit bucket for everybody, so a single noisy client gets everyone else a 429.",
        "Partitioning by IP address behind a load balancer without configuring forwarded headers: every request then has the balancer's IP and shares one bucket.",
        "Adding a cache before measuring where the time actually goes.",
        "Reporting average latency, which hides the slow tail that users actually feel."
      ],
      quiz: [
        { id: 'latency-rising-cpu-15', q: "Latency is rising, CPU is at 15%, and the code contains `.Result` calls. Likely cause?", a: ["A CPU-bound loop", "Thread-pool starvation from blocking on async work", "The garbage collector", "Slow JSON serialization"], c: 1, why: "Blocked threads wait instead of working, and queued requests can't get a thread." },
        { id: 'status-code-rate-limiter', q: "Which status code should a rate limiter return?", a: ["401", "403", "429", "503"], c: 2, why: "429 Too Many Requests, ideally with a `Retry-After` header. 503 means the whole service is down." },
        { id: 'addtokenbucketlimiter-api-partit', q: "With `AddTokenBucketLimiter(\"api\", …)` and no partition, one client sends 10,000 requests. What happens to everyone else?", a: ["Nothing, each client has its own bucket", "They get 429 too: they all share the one bucket", "The server crashes", "Only that client's IP is blocked automatically"], c: 1, why: "An unpartitioned limiter uses one shared bucket. Partition by user or IP to isolate clients." },
        { id: 'app-running-several-servers', q: "Why must an app running on several servers use a distributed cache for shared data?", a: ["It's always faster", "In-memory caches are per instance, so the instances would disagree", "ASP.NET Core requires it", "Memory caches can't expire entries"], c: 1, why: "Each server holds its own RAM, so a shared cache keeps them in sync." }
      ]
    },
    {
      id: 'arch', title: 'Architecture: boundaries, slices and background work', level: 3, mins: 45,
      splits: [['1 · App wiring', '// dotnet add package'], ['2 · PlaceOrder slice', '// ---------- Feature slice'], ['3 · Domain entities', '// ---------- Domain'], ['4 · Outbox & worker', '// ---------- Outbox']],
      terms: [
        ['Vertical slice', 'Organizes code by feature (`PlaceOrder.cs` holding command, validation, handler, endpoint) instead of spreading files across folders by layer.'],
        ['Rich domain entity', 'Encapsulates invariants inside factory/behavior methods (`Order.Place(...)`) so invalid states cannot be constructed anywhere.'],
        ['Transactional Outbox', 'Writes the business row and `OutboxMessage` in the *same* database transaction, then a `BackgroundService` publishes them safely.']
      ],
      why: "Architecture is deciding what can change without breaking everything else. A pattern is worth using only if you can explain the trade-off, and you should know when it's overkill.",
      points: [
        "Choose **Layered / Clean Architecture** to shield core business rules from framework changes: domain stays centered, and dependencies point inward.",
        "Choose **vertical slices** to group code by feature (`PlaceOrder`) rather than folder layer, keeping request, handler, validation, and query together.",
        "Use **CQRS** to split read and write models only when their load or shape diverges, and skip it for simple CRUD.",
        "Enforce invariants inside the **domain model** (`Order` rejecting invalid quantities) rather than copying checks across endpoints. Still validate requests at the edge, using domain checks as your final guard.",
        "Push slow work off the request thread into a `BackgroundService` or queue. With the **outbox pattern**, saving business rows and messages in one transaction ensures they stay in sync.",
        "Since .NET 8, an unhandled exception in a `BackgroundService` **stops the host**. Catch and log failures inside its loop.",
        "Begin with a **modular monolith**, splitting into services only when scaling or team boundaries force it. Distribution adds failure modes rather than simplicity."
      ],
      code: `
// dotnet add package Microsoft.EntityFrameworkCore.SqlServer
// dotnet add package Microsoft.AspNetCore.Authentication.JwtBearer

using System.ComponentModel.DataAnnotations;
using System.Security.Claims;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);
var cs = builder.Configuration.GetConnectionString("Shop")
         ?? @"Server=.\\SQLEXPRESS;Database=Shop;Trusted_Connection=True;TrustServerCertificate=True";
builder.Services.AddDbContext<AppDbContext>(o => o.UseSqlServer(cs));
builder.Services.AddAuthentication().AddJwtBearer();
builder.Services.AddAuthorization();
builder.Services.AddValidation();
builder.Services.AddSingleton<IMessageBus, LoggingBus>();     // swap for RabbitMQ, Azure Service Bus…
builder.Services.AddHostedService<OutboxPublisher>();

var app = builder.Build();
app.UseAuthentication();
app.UseAuthorization();
PlaceOrder.Map(app);
app.Run();

// ---------- Feature slice: everything for "place an order" in one place ----------
public static class PlaceOrder
{
    public record Command(int ProductId, [Range(1, 100)] int Quantity);
    public record Result(Guid OrderId, decimal Total);

    public static void Map(IEndpointRouteBuilder app) =>
        app.MapPost("/api/orders", Handle).RequireAuthorization();

    static async Task<IResult> Handle(Command cmd, AppDbContext db, ClaimsPrincipal user, CancellationToken ct)
    {
        var product = await db.Products.FindAsync([cmd.ProductId], ct);
        if (product is null) return Results.NotFound();

        var order = Order.Place(user.FindFirstValue(ClaimTypes.NameIdentifier)!, product, cmd.Quantity);
        db.Orders.Add(order);
        db.Outbox.Add(OutboxMessage.For("OrderPlaced", new { order.Id, order.Total }));   // same transaction
        await db.SaveChangesAsync(ct);
        return Results.Created($"/api/orders/{order.Id}", new Result(order.Id, order.Total));
    }
}

// ---------- Domain: the order protects its own rules ----------
public class Order
{
    public Guid Id { get; private set; }               // generated here, so it's known before saving
    [MaxLength(450)] public string UserId { get; private set; } = "";
    public int ProductId { get; private set; }
    public int Quantity { get; private set; }
    [Precision(10, 2)] public decimal Total { get; private set; }

    private Order() { }                                // for EF Core

    public static Order Place(string userId, Product product, int quantity)
    {
        if (quantity is < 1 or > 100)
            throw new ArgumentOutOfRangeException(nameof(quantity), "Quantity must be between 1 and 100");
        return new Order { Id = Guid.NewGuid(), UserId = userId, ProductId = product.Id,
                           Quantity = quantity, Total = product.Price * quantity };
    }
}

public class Product
{
    public int Id { get; set; }
    [Precision(10, 2)] public decimal Price { get; set; }
}

// ---------- Outbox: messages saved with the data, published afterwards ----------
public class OutboxMessage
{
    public long Id { get; set; }
    [MaxLength(100)] public string Type { get; set; } = "";
    public string Payload { get; set; } = "";
    public DateTime? SentAt { get; set; }

    public static OutboxMessage For(string type, object payload) =>
        new() { Type = type, Payload = JsonSerializer.Serialize(payload) };
}

public interface IMessageBus { Task PublishAsync(string type, string payload, CancellationToken ct); }

public class LoggingBus(ILogger<LoggingBus> log) : IMessageBus
{
    public Task PublishAsync(string type, string payload, CancellationToken ct)
    {
        log.LogInformation("Published {Type}: {Payload}", type, payload);
        return Task.CompletedTask;
    }
}

public class OutboxPublisher(IServiceScopeFactory scopes, IMessageBus bus, ILogger<OutboxPublisher> log)
    : BackgroundService
{
    protected override async Task ExecuteAsync(CancellationToken stop)
    {
        using var timer = new PeriodicTimer(TimeSpan.FromSeconds(2));
        while (await timer.WaitForNextTickAsync(stop))
        {
            try
            {
                using var scope = scopes.CreateScope();       // hosted services are singletons: new scope, new DbContext
                var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                var batch = await db.Outbox.Where(m => m.SentAt == null).OrderBy(m => m.Id).Take(50).ToListAsync(stop);
                foreach (var msg in batch)
                {
                    await bus.PublishAsync(msg.Type, msg.Payload, stop);
                    msg.SentAt = DateTime.UtcNow;
                }
                await db.SaveChangesAsync(stop);     // if this fails, those messages go out again: consumers must be idempotent
            }
            catch (Exception ex) when (ex is not OperationCanceledException)
            {
                log.LogError(ex, "Outbox round failed; trying again on the next tick");   // without this, the app would stop
            }
        }
    }
}

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Product> Products => Set<Product>();
    public DbSet<Order> Orders => Set<Order>();
    public DbSet<OutboxMessage> Outbox => Set<OutboxMessage>();
}
`,
      practice: "Take your CRUD API and restructure one feature as a vertical slice with a domain method that protects its rules. Then write half a page: for a three-person team building an internal tool, would you choose layers, slices or plain minimal APIs, and why?",
      teach: "Explain the outbox pattern: what failure does it prevent, and how?",
      analogy: "The outbox writes 'mail this receipt' on the same ledger line as the sale. Even if the mail truck runs late, you can't forget the letter because it's saved inside the sale record.",
      pitfalls: [
        "Adding Clean Architecture, CQRS, and a mediator library to a five-endpoint CRUD app.",
        "Building anemic domain models where rules sit in 'services' and entities hold empty setters.",
        "Saving an `INT IDENTITY` key into an outbox payload before `SaveChanges`, when it's still 0. Generate the id in C#, like `Order` does with a `Guid`.",
        "Running a `BackgroundService` loop without a `try/catch`, letting one crash kill the entire host.",
        "Breaking a tangled monolith into microservices. You end up with a tangled distributed system."
      ],
      quiz: [
        { id: 'outbox-pattern-guarantee', q: "What does the outbox pattern guarantee?", a: ["Messages are sent instantly", "The message is saved in the same transaction as the data change, so neither happens without the other", "No message is ever delivered twice", "The database is never locked"], c: 1, why: "One atomic write followed by at-least-once delivery from a worker. Receivers must still handle duplicates." },
        { id: 'backgroundservice-create-scope-u', q: "Why does the `BackgroundService` create a scope to use `DbContext`?", a: ["For performance", "Hosted services are singletons and `DbContext` is scoped", "Scopes are required for logging", "To open a database transaction"], c: 1, why: "Injecting a scoped service into a singleton causes a captive dependency, so spin up a scope per unit of work." },
        { id: 'exception-escapes-executeasync-n', q: "An exception escapes `ExecuteAsync` in a .NET 10 `BackgroundService`. By default…", a: ["It's logged and the service restarts", "It's ignored", "The whole application stops", "Only that request fails"], c: 2, why: "Since .NET 8 the host's default is to stop when a background service fails, so catch and log inside the loop." },
        { id: 'cqrs-worth-cost', q: "When is CQRS worth its cost?", a: ["Always", "When read and write models differ a lot in shape or load", "Whenever you use EF Core", "Only with microservices"], c: 1, why: "It brings extra models and mapping, so it pays off only when reads and writes truly diverge." }
      ]
    },
    {
      id: 'prod', title: 'Production: observability, resilience and deployment', level: 3, mins: 45,
      splits: [['1 · Telemetry & resilience', '// dotnet add package'], ['2 · Health & client', 'app.MapHealthChecks("/health/live"'], ['3 · Dockerfile & container', '// Dockerfile']],
      terms: [
        ['OpenTelemetry traces & metrics', 'Correlates logs, timings, and distributed SQL/HTTP spans across services using W3C Trace Context headers.'],
        ['Liveness vs Readiness probes', '`/health/live` asks “is the process alive?”, while `/health/ready` asks “can it reach SQL and take traffic?”.'],
        ['Circuit breaker + jittered retries', 'Protects failing downstream dependencies from cascading failure using standard HTTP resilience handlers and idempotency keys.']
      ],
      why: "Code isn't finished when it compiles. It's finished when it holds up for real users, which means planning for the failures that happen in production.",
      points: [
        "**Observability** combines logs, metrics, and traces. **OpenTelemetry** is the standard, letting one trace follow a request across services.",
        "Split **health checks** into liveness ('restart me if this fails') and readiness ('hold traffic for now'), since they answer two separate questions.",
        "**Resilience** for outbound HTTP needs timeouts, retries with jitter, and a circuit breaker to avoid piling on dead dependencies. `AddStandardResilienceHandler()` wires all three together.",
        "Note that the standard handler retries **every** HTTP method, including `POST`. Keep that enabled only if the callee respects idempotency keys, or disable retries on unsafe methods.",
        "Package the app as a stateless container receiving config from the environment so any replica serves any request. Since .NET 8, ASP.NET containers listen on port **8080**.",
        "Deploy carefully with backward-compatible migrations, graceful shutdown, rolling or blue/green swaps, and rollbacks you've tested."
      ],
      code: `
// dotnet add package Microsoft.EntityFrameworkCore.SqlServer
// dotnet add package Microsoft.Extensions.Diagnostics.HealthChecks.EntityFrameworkCore
// dotnet add package Microsoft.Extensions.Http.Resilience
// dotnet add package OpenTelemetry.Extensions.Hosting
// dotnet add package OpenTelemetry.Instrumentation.AspNetCore
// dotnet add package OpenTelemetry.Instrumentation.Http
// dotnet add package OpenTelemetry.Instrumentation.Runtime
// dotnet add package OpenTelemetry.Exporter.OpenTelemetryProtocol

using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;
using OpenTelemetry.Metrics;
using OpenTelemetry.Resources;
using OpenTelemetry.Trace;

var builder = WebApplication.CreateBuilder(args);
var cs = builder.Configuration.GetConnectionString("Shop")
         ?? @"Server=.\\SQLEXPRESS;Database=Shop;Trusted_Connection=True;TrustServerCertificate=True";
builder.Services.AddDbContext<AppDbContext>(o => o.UseSqlServer(cs));

builder.Services.AddOpenTelemetry()
    .ConfigureResource(r => r.AddService("shop-api"))
    .WithTracing(t => t.AddAspNetCoreInstrumentation().AddHttpClientInstrumentation().AddOtlpExporter())
    .WithMetrics(m => m.AddAspNetCoreInstrumentation().AddRuntimeInstrumentation().AddOtlpExporter());

builder.Services.AddHealthChecks()
    .AddDbContextCheck<AppDbContext>(tags: ["ready"]);

// Outbound HTTP with timeout, retries with jitter, and a circuit breaker
builder.Services.AddHttpClient<PaymentClient>(c => c.BaseAddress = new("https://pay.example.com"))
    .AddStandardResilienceHandler();

var app = builder.Build();

app.MapHealthChecks("/health/live", new() { Predicate = _ => false });     // the process is up
app.MapHealthChecks("/health/ready", new() { Predicate = c => c.Tags.Contains("ready") });

app.MapPost("/api/orders/{orderId:int}/pay", async (int orderId, PaymentRequest req, PaymentClient payments, CancellationToken ct) =>
    await payments.ChargeAsync(req, idempotencyKey: $"order-{orderId}", ct)
        ? Results.Ok()
        : Results.Problem(statusCode: 502, title: "The payment provider declined or failed"));

app.Run();

public record PaymentRequest([Range(0.01, 100_000)] decimal Amount, string Currency);

public class PaymentClient(HttpClient http)
{
    public async Task<bool> ChargeAsync(PaymentRequest req, string idempotencyKey, CancellationToken ct)
    {
        using var message = new HttpRequestMessage(HttpMethod.Post, "/charges") { Content = JsonContent.Create(req) };
        message.Headers.Add("Idempotency-Key", idempotencyKey);    // a retried POST can't charge twice
        using var response = await http.SendAsync(message, ct);
        return response.IsSuccessStatusCode;
    }
}

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options);

// Dockerfile (multi-stage)
// FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
// WORKDIR /src
// COPY *.csproj .
// RUN dotnet restore                  # cached until the project file changes
// COPY . .
// RUN dotnet publish -c Release -o /app --no-restore
// FROM mcr.microsoft.com/dotnet/aspnet:10.0
// WORKDIR /app
// COPY --from=build /app .
// USER $APP_UID                       # don't run as root
// EXPOSE 8080
// ENTRYPOINT ["dotnet", "Shop.Api.dll"]
//
// Or build an image with no Dockerfile at all:  dotnet publish -t:PublishContainer
`,
      practice: "Containerize your API and SQL Server in Docker Compose, wire up OpenTelemetry to the local Aspire dashboard, stop the DB mid-traffic, and compare what health checks, logs, and traces report.",
      teach: "Explain the difference between a liveness check and a readiness check, with an example where they give different answers.",
      analogy: "A circuit breaker works like a household fuse: after repeated faults, it trips the circuit so wires don't overheat, giving things time before allowing retries.",
      pitfalls: [
        "Retrying non-idempotent calls and double-charging users. The standard resilience handler retries `POST` unless you restrict it.",
        "Pointing a single health check at the database, causing a brief DB hiccup to restart every container.",
        "Shipping a migration that drops a column the outgoing version still reads.",
        "Forwarding port 80 in Docker when ASP.NET Core containers listen on 8080."
      ],
      quiz: [
        { id: 'database-down-20-seconds', q: "The database is down for 20 seconds. What should the liveness probe report?", a: ["Unhealthy, so the app restarts", "Healthy: the process itself is fine", "Unhealthy, but only after 10 seconds", "Degraded"], c: 1, why: "Restarting the app won't fix SQL Server, so readiness should fail while liveness stays green." },
        { id: 'circuit-breaker-repeated-failure', q: "What does a circuit breaker do after repeated failures?", a: ["Retries faster", "Fails calls immediately for a while instead of contacting the failing dependency", "Restarts the server", "Switches to a backup server automatically"], c: 1, why: "It gives the dependency time to recover and protects your own threads and latency." },
        { id: 'operation-safe-retry-automatical', q: "Which operation is safe to retry automatically without extra design?", a: ["`POST /payments`", "`GET /products/5`", "`POST /orders`", "Sending an email"], c: 1, why: "`GET` is idempotent, while the others need an idempotency key first." }
      ]
    }
  ]
};

export default track;
