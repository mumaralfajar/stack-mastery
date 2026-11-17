TRACKS.push({
  id: 'aspnet', name: 'ASP.NET Core', lang: 'cs',
  tagline: 'The backend: HTTP, APIs, dependency injection, EF Core, security and production.',
  lessons: [
    // ---------------- Beginner ----------------
    {
      id: 'http', title: 'How the web works: HTTP in 20 minutes', level: 0, mins: 25, viz: 'journey',
      terms: [
        ['Method & URL', 'Verb (`GET`, `POST`, `PUT`, `DELETE`) plus resource path (`/api/products/7`) telling the server what action to take.'],
        ['Status code', 'Three-digit verdict (`200 OK`, `201 Created`, `400 Bad Request`, `404 Not Found`, `500 Error`) telling clients if the request succeeded.'],
        ['Headers & JSON body', 'Key/value metadata (`Authorization`, `Content-Type`) wrapped around the actual JSON payload traveling over HTTP.']
      ],
      why: "ASP.NET Core is a machine that turns HTTP requests into HTTP responses. Once you can read a raw request and response, you can debug web problems in any framework. Every sample in this track is a complete `Program.cs` for .NET 10. Start from `dotnet new web`, run the `dotnet add package` lines at the top of the sample if it has any, and paste it in. Samples with a database expect SQL Server Express on your machine (`.\\SQLEXPRESS`) unless you set a `Shop` connection string.",
      points: [
        "The browser (client) sends a **request**: a method (`GET`, `POST`, `PUT`, `DELETE`), a URL, headers, and sometimes a body.",
        "The server returns a **response**: a status code, headers, and usually a body (HTML or JSON).",
        "Status families: `2xx` success, `3xx` redirect, `4xx` the client made a mistake, `5xx` the server failed.",
        "HTTP is **stateless**: each request stands alone. Identity is sent again every time, in a cookie or a token.",
        "`GET` reads and must not change data; `POST` creates; `PUT`/`PATCH` update; `DELETE` removes.",
        "`GET`, `PUT` and `DELETE` are **idempotent**: sending the same request twice leaves the same result as sending it once. `POST` isn't, so a retried `POST` can create two orders.",
        "A browser page on one origin (`http://localhost:5173`) may only read responses from another origin (`http://localhost:5000`) if the server allows it with **CORS** headers. A React app calling its API is exactly that case; the routing lesson shows the setup.",
        "The Network tab in the browser's dev tools shows every request and response. Keep it open while you work."
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
      practice: "Run `dotnet new web`, replace `Program.cs` with the sample, and call `/time` from the browser, from `curl -i`, and with the dev tools Network tab open. Find the method, status code and `Content-Type` in each.",
      teach: "Explain what happens between typing a URL and seeing a page, using the words request, response, status code and header.",
      analogy: "HTTP is ordering at a counter by letter. You send an envelope: what you want (method and URL), notes on the outside (headers) and the contents (body). The kitchen sends an envelope back, stamped with a result code. The kitchen has no memory of you, so you show your loyalty card every single time.",
      pitfalls: [
        "Thinking the server 'remembers' the user between requests. It doesn't; a cookie or token is sent each time.",
        "Using `GET` for operations that change data. Browsers, crawlers and link previews call `GET` freely.",
        "Returning `200 OK` with an error message in the body instead of a proper `4xx`/`5xx` code."
      ],
      quiz: [
        { q: "Which status code family means 'the client sent something wrong'?", a: ["2xx", "3xx", "4xx", "5xx"], c: 2, why: "4xx codes such as 400, 401 and 404 signal a problem with the request." },
        { q: "HTTP being stateless means…", a: ["The server can't store any data", "Each request carries everything needed to process it", "Responses have no body", "Cookies are not allowed"], c: 1, why: "The protocol keeps no memory between requests. Cookies are how state is sent again with each one." },
        { q: "A network error happens and the client automatically sends the same request again. For which method is that safe without extra design?", a: ["`POST /orders`", "`PUT /orders/7`", "`POST /payments`", "None of them"], c: 1, why: "`PUT` replaces the resource with the same content, so repeating it changes nothing more. Repeating a `POST` can create a second order or charge." }
      ]
    },
    {
      id: 'anatomy', title: 'Anatomy of an ASP.NET Core app', level: 0, mins: 25,
      terms: [
        ['`builder.Services` (DI container)', 'First half of `Program.cs`: registers services and database contexts *before* `builder.Build()`.'],
        ['Middleware pipeline (`app.Use*`)', 'Second half of `Program.cs`: builds the ordered chain of steps that processes each HTTP request and response.'],
        ['Minimal API endpoint', '`app.MapGet("/path", handler)` maps a route directly to a C# lambda without extra controller boilerplate.']
      ],
      why: "`Program.cs` has two halves, and most 'why is my service not found?' or 'why isn't my middleware running?' questions are answered by knowing which half something belongs in.",
      points: [
        "**Half one, the builder**: register services (things the app needs) with `builder.Services.Add…`, and read configuration.",
        "**Half two, the app**: after `builder.Build()`, build the request pipeline with `app.Use…` and map endpoints with `app.Map…`. `app.Run()` starts the server and blocks until shutdown.",
        "**Kestrel** is the built-in web server that listens on a port and hands requests to your pipeline.",
        "Configuration is layered: `appsettings.json` → `appsettings.{Environment}.json` → user secrets (Development only) → environment variables → command-line arguments. Later sources win.",
        "`ASPNETCORE_ENVIRONMENT` selects `Development`, `Staging` or `Production` behavior.",
        "This track uses **minimal APIs** (`app.MapGet`). Controllers are the other style: `AddControllers()` plus `MapControllers()`, on the same routing engine."
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
        { q: "Where must `builder.Services.AddScoped<…>()` be called?", a: ["After `app.Run()`", "Before `builder.Build()`", "Inside an endpoint handler", "Anywhere, as long as it's in `Program.cs`"], c: 1, why: "The service collection is frozen when the app is built." },
        { q: "The same key exists in `appsettings.json` and an environment variable. Which wins by default?", a: ["`appsettings.json`", "The environment variable", "Neither: the app refuses to start", "Whichever changed most recently"], c: 1, why: "Configuration sources added later override earlier ones; environment variables come after the JSON files." },
        { q: "What is Kestrel?", a: ["A database driver", "The cross-platform web server built into ASP.NET Core", "A reverse proxy you have to install separately", "The background job scheduler"], c: 1, why: "Kestrel listens for HTTP connections and feeds requests into the pipeline. A reverse proxy such as nginx or IIS can sit in front of it, but isn't required." }
      ]
    },
    {
      id: 'routing', title: 'Routing, endpoints and model binding', level: 0, mins: 35,
      terms: [
        ['Route constraint (`{id:int}`)', 'Ensures `/products/abc` rejects immediately with 404 before entering your C# handler with a broken parameter.'],
        ['Model binding', 'Automatically pulls typed values from route segments, query strings (`?page=2`), headers, and JSON request bodies.'],
        ['`TypedResults` vs `Results`', '`TypedResults.Ok(x)` bakes concrete return types (`Results<Ok<T>, NotFound>`) into signatures so OpenAPI documents every status code.']
      ],
      why: "An API is a list of endpoints. Mapping URLs to code, reading inputs safely and returning the right status codes is the daily work of a backend developer.",
      points: [
        "**Routing** matches method + URL pattern to a handler: `GET /api/products/{id}`.",
        "**Model binding** fills handler parameters from the route, query string, headers and JSON body automatically.",
        "Return the right result: `Ok` 200, `Created` 201, `NoContent` 204, `BadRequest` 400, `NotFound` 404. `TypedResults` plus `Results<…>` in the signature also documents every possible response in the OpenAPI description.",
        "REST convention: nouns in URLs (`/products/5`), HTTP methods for the verbs. Not `/getProduct?id=5`.",
        "Route constraints such as `{id:int}` decide which route matches. `/api/products/abc` simply doesn't match, so the caller gets **404**, not 400. Validate input in the handler or with validation, not with constraints.",
        "Anything the endpoints share lives as long as the app and is used by many requests at once, so it must be thread-safe: hence `ConcurrentDictionary` and `Interlocked` below.",
        "**CORS** lets your React dev server, on another origin, call the API from the browser. Name the exact origins you allow."
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
      analogy: "Routing is a hotel receptionist: 'room 204? Second floor, on the left.' Model binding is the bellhop who unpacks your suitcase into the right drawers before you even enter the room: route values here, query values there, the JSON body laid out as an object.",
      pitfalls: [
        "Returning 200 with `null` when something isn't found. Return 404.",
        "Generating ids with `list.Count + 1`. After a delete, the next id repeats an existing one.",
        "Keeping shared data in a plain `List<T>` that many requests change at once.",
        "Exposing database entities directly as request and response bodies. Use DTOs (records).",
        "Verbs in URLs (`/api/createProduct`). Let the HTTP method carry the verb."
      ],
      quiz: [
        { q: "A `POST` successfully creates a resource. Best status code?", a: ["200", "201", "204", "202"], c: 1, why: "201 Created, ideally with a `Location` header pointing at the new resource. 202 means 'accepted, not done yet'." },
        { q: "With `app.MapGet(\"/items/{id:int}\", (int id) => …)`, a request to `/items/abc` returns…", a: ["500", "404", "200 with id = 0", "400"], c: 1, why: "The `:int` constraint doesn't match, so no route is found. That's why constraints aren't a validation tool." },
        { q: "Where does a complex-type parameter like `CreateProduct input` bind from by default in a POST?", a: ["Query string", "Route", "JSON body", "Form fields"], c: 2, why: "Complex types bind from the body; simple types bind from the route or the query string." }
      ]
    },
    // ---------------- Intermediate ----------------
    {
      id: 'middleware', title: 'The middleware pipeline', level: 1, mins: 30, viz: 'middleware',
      terms: [
        ['Middleware delegate (`next()`)', 'A component wrapping every HTTP request: code before `await next()` runs on the way in; code after runs on the way out.'],
        ['Short-circuiting', 'Returning `401` or a cached response early without invoking `next()`, skipping downstream handlers safely.'],
        ['Pipeline ordering', 'Running `ExceptionHandler` first and `UseAuthentication()` before `UseAuthorization()` ensures errors are caught and identity exists before rules check it.']
      ],
      why: "Error handling, CORS, authentication and logging are all middleware. Getting their order wrong is one of the most common ASP.NET Core mistakes, and it's hard to see unless you have the pipeline pictured in your head.",
      points: [
        "A request passes through the middleware **in the order registered**, and the response travels back through them in **reverse**.",
        "Each middleware may do work before `next()`, call `next()`, do work after, or **short-circuit** by not calling `next()` at all.",
        "Order matters: exception handling first (so it wraps everything), then HTTPS, static files, CORS, authentication, authorization, endpoints.",
        "You don't have to call `UseRouting()`: `WebApplication` adds it at the start of the pipeline for you. Call it yourself only when some middleware must run before routing.",
        "`UseExceptionHandler()` needs to know how to write the error: register `AddProblemDetails()` (or an `IExceptionHandler`), or the app fails at startup.",
        "Custom middleware is just `app.Use(async (context, next) => { … })`, or a class with an `InvokeAsync` method."
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
        { q: "Middleware A is registered before B. On the response path, which runs its 'after' code first?", a: ["A", "B", "Both at once", "Whichever finishes its 'before' code first"], c: 1, why: "The pipeline unwinds in reverse: B finishes, then A." },
        { q: "What does 'short-circuiting' mean?", a: ["The app crashes", "A middleware writes a response without calling `next`", "Two middleware run in parallel", "The request skips routing but still reaches the endpoint"], c: 1, why: "Later middleware and the endpoint never run, as with a 401 or a cached response." },
        { q: "Why should exception-handling middleware be registered first?", a: ["It is the fastest", "So it wraps, and can catch exceptions from, everything after it", "It needs to read the request body first", "Only for readability"], c: 1, why: "A middleware can only catch exceptions thrown by components it calls through `next`." }
      ]
    },
    {
      id: 'di', title: 'Dependency injection and service lifetimes', level: 1, mins: 35, viz: 'di',
      terms: [
        ['`Transient`', 'A brand-new instance created every time a constructor or endpoint asks for the service.'],
        ['`Scoped`', 'One shared instance created per HTTP request (and disposed at request end) — mandatory for `DbContext` and unit-of-work state.'],
        ['Captive dependency bug', 'Injecting a short-lived `Scoped` service inside a long-lived `Singleton`, accidentally pinning stale DB connections forever.']
      ],
      why: "DI is the backbone of ASP.NET Core. Choosing the wrong lifetime gives you stale data, races on shared state, and the 'cannot consume scoped service from singleton' error.",
      points: [
        "Classes declare what they need in the constructor; the **container** creates and supplies it. Classes don't `new` their own dependencies.",
        "**Transient**: a new instance every time it's requested. For lightweight, stateless services.",
        "**Scoped**: one instance per HTTP request. The default for anything touching the database; `DbContext` is scoped.",
        "**Singleton**: one instance for the whole app. Must be thread-safe and hold no per-user state.",
        "**Captive dependency**: a singleton holding a scoped service keeps it alive forever. In Development, ASP.NET Core checks for this and throws; in Production it doesn't check, so the bug slips through.",
        "`TimeProvider` is .NET's built-in clock. Inject it instead of calling `DateTime.UtcNow`, and tests can swap in a fake one."
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
      practice: "Register a class with a `Guid Id = Guid.NewGuid()` property three times — transient, scoped and singleton — and return all three ids from an endpoint that injects each one twice. Refresh and explain the pattern. Then make `OrderService` a singleton, run in Development, and read the error.",
      teach: "Explain the three service lifetimes and why a `DbContext` must not be injected into a singleton.",
      analogy: "A hotel. **Singleton** is the lobby clock: one for everyone, forever. **Scoped** is your room key: yours for this stay, the same one each time you ask at the desk, handed back at checkout. **Transient** is a paper cup: a fresh one every time you ask.",
      pitfalls: [
        "Storing per-user data in a singleton. Every user then sees it.",
        "Injecting a scoped service into a singleton. If a singleton needs one, inject `IServiceScopeFactory` and create a scope for each unit of work.",
        "Pulling services from `IServiceProvider` all over the code instead of declaring them in the constructor (the service locator pattern)."
      ],
      quiz: [
        { q: "Within a single HTTP request, a scoped service is injected into two different classes. How many instances exist?", a: ["One", "Two", "One per thread", "Two, then merged at the end of the request"], c: 0, why: "Scoped means one instance per scope, and each request is one scope." },
        { q: "Which lifetime does `AddDbContext` use by default?", a: ["Singleton", "Scoped", "Transient", "Pooled singleton"], c: 1, why: "A `DbContext` is a unit of work for one request and is not thread-safe." },
        { q: "What is a captive dependency?", a: ["A circular reference between two services", "A shorter-lived service held by a longer-lived one", "A service registered twice", "A service that is never disposed"], c: 1, why: "For example, a singleton holding a scoped `DbContext`: it never gets released, and every request shares it." }
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
      why: "EF Core is where C#, LINQ and SQL meet. Used well, it removes boilerplate; used blindly, it generates slow queries you never see. The habit that matters most is reading the SQL it produces.",
      points: [
        "A `DbContext` is a session with the database; each `DbSet<T>` maps to a table, and each entity object to a row.",
        "LINQ on a `DbSet` is translated to SQL and runs when you enumerate it (`ToListAsync`, `FirstOrDefaultAsync`).",
        "**Migrations** version the schema in code. Install the tool once (`dotnet tool install --global dotnet-ef`), add the `Microsoft.EntityFrameworkCore.Design` package, then `dotnet ef migrations add Init` and `dotnet ef database update`.",
        "**Change tracking**: load an entity, change it, call `SaveChangesAsync`, and EF writes the `UPDATE`.",
        "Load related data by projecting with `Select`, which fetches only the columns you need, or with `Include` when you really need whole entities.",
        "Map money explicitly with `[Precision(10, 2)]`, so the column is `DECIMAL(10,2)` like in the SQL track.",
        "LINQ and `FromSql($\"…{value}\")` send values as SQL parameters. `FromSqlRaw` with a concatenated string does not, and is open to SQL injection."
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
      analogy: "EF Core is an interpreter between two people who speak different languages: you speak C# objects, the database speaks SQL tables. A good interpreter saves you a lot of work, but if you never learn the other language, you won't notice when a translation is long-winded or wrong.",
      pitfalls: [
        "Never looking at the generated SQL.",
        "Calling `ToList()` early and filtering in memory instead of in the database.",
        "Returning entities straight from the API: navigation properties cause serialization cycles and expose columns you didn't mean to.",
        "Building SQL by concatenation with `FromSqlRaw(\"… '\" + name + \"'\")`."
      ],
      quiz: [
        { q: "When does `db.Products.Where(p => p.Price < 100)` hit the database?", a: ["Immediately", "When enumerated, e.g. by `ToListAsync()`", "When the app starts", "When `SaveChanges` is called"], c: 1, why: "`IQueryable` is deferred, just like LINQ to Objects." },
        { q: "What does a migration contain?", a: ["A database backup", "Code describing a schema change, with `Up` and `Down` steps", "Seed data only", "The compiled SQL for every query"], c: 1, why: "Migrations are versioned, reviewable schema changes." },
        { q: "You loaded an entity and changed a property. What writes it to the database?", a: ["Nothing: it's saved automatically when the property changes", "`db.SaveChangesAsync()`", "`db.Update()` is always required first", "Disposing the context"], c: 1, why: "The change tracker detects the modification; `SaveChanges` sends the `UPDATE`. `Update()` is only needed for entities the context isn't tracking." }
      ]
    },
    {
      id: 'validation', title: 'DTOs, validation and error handling', level: 1, mins: 30,
      terms: [
        ['Input/Output DTOs', 'Separate `record` contracts (`CreateProductRequest`, `ProductResponse`) so clients cannot over-post hidden entity fields.'],
        ['`AddValidation()`', 'Minimal API opt-in endpoint filter enforcing `[Required]`, `[Range]`, and `[MaxLength]` data annotations before your handler executes.'],
        ['RFC 9457 `ProblemDetails`', 'Standard machine-readable JSON error payload (`title`, `status`, `errors`) returned on validation errors or unhandled exceptions.']
      ],
      why: "An API is a contract with strangers. Validating every input and returning consistent, machine-readable errors is what makes it usable by anyone other than you.",
      points: [
        "**Never trust input.** Validate at the boundary and return `400 Bad Request` with details.",
        "**DTOs** (request and response records) separate your API contract from your database entities and prevent over-posting.",
        "Data annotations (`[Required]`, `[Range]`, `[StringLength]`) express rules declaratively. In .NET 10, `AddValidation()` checks them on minimal API parameters.",
        "**ProblemDetails** (RFC 9457) is the standard JSON error shape: `type`, `title`, `status`, `detail`, `errors`.",
        "Handle unexpected exceptions centrally with `UseExceptionHandler`: log the detail, return a generic 500, never leak stack traces.",
        "Expected failures (not found, conflict, invalid input) aren't exceptions; return status codes for them.",
        "Rules like 'names are unique' belong in the database as a `UNIQUE` index. Checking first in code and then inserting races when two requests arrive together."
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
      analogy: "A DTO is the order form at a counter; the entity is the warehouse record. Customers fill in the form. They don't get to walk into the warehouse and edit the stock ledger, including columns they were never meant to see, such as cost price or `IsAdmin`.",
      pitfalls: [
        "Binding directly to entities and letting clients set fields like `IsAdmin` (over-posting).",
        "Throwing exceptions for validation failures.",
        "Checking for a duplicate with `AnyAsync` and then inserting, with no unique index behind it.",
        "Returning different error shapes from different endpoints."
      ],
      quiz: [
        { q: "A client sends a negative price. Correct response?", a: ["500", "200 with an error message", "400 with validation details", "422 with no body"], c: 2, why: "Invalid client input is a 4xx; 400 with field-level details lets the client fix it." },
        { q: "What problem do request DTOs prevent?", a: ["Slow queries", "Over-posting: clients setting properties they shouldn't control", "Duplicate rows", "CORS errors"], c: 1, why: "Only the fields on the DTO can be bound from the request." },
        { q: "Two requests create a product called 'Lamp' at the same moment. What reliably stops a duplicate?", a: ["Checking `AnyAsync` before inserting", "A `UNIQUE` index, with the duplicate-key error turned into a 409", "A `lock` around the endpoint", "Validation attributes"], c: 1, why: "Both `AnyAsync` checks can pass before either insert. A `lock` only works on one server. The database index is the one place that sees both." }
      ]
    },
    // ---------------- Advanced ----------------
    {
      id: 'auth', title: 'Authentication and authorization', level: 2, mins: 45,
      splits: [['1 · Auth & CORS setup', '// dotnet add package'], ['2 · Endpoints & ownership', 'app.MapGet("/api/products"'], ['3 · Entity & settings', '// appsettings.json']],
      terms: [
        ['Authentication vs Authorization', 'Authentication verifies *who* you are (`ClaimsPrincipal`); authorization enforces *what* you are allowed to touch.'],
        ['Resource-based auth', 'Checking ownership (`order.UserId == callerId`) per record, returning `404` rather than revealing another user’s order exists.'],
        ['CORS policy', 'Server headers telling browsers which exact frontend origin (never `*` with credentials) may read responses cross-origin.']
      ],
      why: "Security bugs are the expensive ones. You need to be able to say who the caller is, how the server knows, and how each endpoint decides what they may do.",
      points: [
        "**Authentication** = proving identity. **Authorization** = deciding permission. Two separate steps, two separate middleware.",
        "For a browser SPA such as your React app, current guidance is a **backend-for-frontend**: the browser keeps only an `HttpOnly` session cookie, and tokens stay on the server. **JWT bearer tokens** fit mobile apps and service-to-service calls.",
        "A JWT is three base64url parts: header, payload (claims), signature. It is **signed, not encrypted**: anyone can read it, but nobody can change it without breaking the signature.",
        "The server checks the signature, issuer, audience and expiry on every request. Keep access tokens short-lived.",
        "Put token settings in configuration, not in code: `appsettings.json` names your identity provider, and `dotnet user-jwts` writes local test settings into `appsettings.Development.json`.",
        "Authorize with roles, **policies**, and resource-based checks ('is this order yours?').",
        "Never store passwords yourself: use ASP.NET Core Identity (salted, slow hashes) or an identity provider over OpenID Connect."
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
      analogy: "A JWT is a festival wristband. Staff can see at a glance what it grants (the claims), it expires tonight, and the tamper-proof seal (the signature) shows the box office issued it. Anyone can read a wristband; nobody can print a convincing one.",
      pitfalls: [
        "Putting secrets or sensitive data in a JWT payload. Anyone holding the token can read it.",
        "Checking only 'is signed in' and forgetting to check that the caller owns the specific resource (IDOR).",
        "Keeping access tokens in `localStorage`, where any injected script can read them.",
        "Treating CORS as security for your API. It only tells browsers what to allow; `curl` and other servers ignore it completely."
      ],
      quiz: [
        { q: "A signed-in user without the Admin role calls an admin-only endpoint. Status?", a: ["401", "403", "404", "400"], c: 1, why: "401 means not authenticated; 403 means authenticated but not permitted." },
        { q: "What does the signature of a JWT guarantee?", a: ["The payload is secret", "The token was issued by the holder of the key and hasn't been modified", "The token hasn't expired", "The user is who they say they are, forever"], c: 1, why: "Signing gives integrity and authenticity, not confidentiality. Expiry is a separate claim that the server checks." },
        { q: "Which check stops user A from reading user B's order at `/api/orders/17`?", a: ["`RequireAuthorization()` alone", "A query that only finds orders belonging to the caller", "HTTPS", "CORS"], c: 1, why: "Being signed in isn't enough; ownership has to be checked for each resource." }
      ]
    },
    {
      id: 'config', title: 'Options, logging and environments', level: 2, mins: 30,
      terms: [
        ['Options pattern (`IOptions<T>`)', 'Binds configuration sections into strongly typed C# classes validated on startup (`ValidateDataAnnotations().ValidateOnStart()`).'],
        ['Structured logging', 'Logging templates (`"Paid {OrderId} for {Total}"`) preserve searchable named fields in Seq/OpenTelemetry instead of plain text strings.'],
        ['User Secrets / Key Vault', 'Keeps DB passwords and API keys out of Git and `appsettings.json` cleanly per environment.']
      ],
      why: "The same build has to run on a laptop, in CI and in production with different settings. When something breaks in production, logs are often all you have to go on.",
      points: [
        "The **options pattern** binds a configuration section to a typed class: `IOptions<T>` (read once), `IOptionsSnapshot<T>` (per request), `IOptionsMonitor<T>` (live reload).",
        "Validate options at startup with `ValidateDataAnnotations().ValidateOnStart()`, so a bad setting stops the deploy instead of failing the first request.",
        "**Structured logging**: `log.LogInformation(\"Order {OrderId} placed\", id)` keeps `OrderId` as a searchable field. Don't use string interpolation in log calls.",
        "Log levels: Trace, Debug, Information, Warning, Error, Critical. Configure them per category in `appsettings.json`.",
        "Secrets: user secrets in development; environment variables or a vault (Azure Key Vault, AWS Secrets Manager) in production; never in source control.",
        "Use log scopes or `Activity` to attach a correlation id, so one request can be followed across services."
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
      analogy: "Structured logs are a filing cabinet with labelled folders instead of a pile of handwritten notes: you can ask for 'everything about order 42' and get exactly that.",
      pitfalls: [
        "Injecting `IConfiguration` everywhere and reading string keys.",
        "String-interpolated log messages, which lose the structure and allocate even when that level is switched off.",
        "Logging secrets, tokens or personal data such as email addresses.",
        "Expecting `IOptions<T>` to pick up a changed setting. It's read once; use `IOptionsMonitor<T>` for live values."
      ],
      quiz: [
        { q: "What does `ValidateOnStart()` change?", a: ["Nothing", "Invalid options fail at application startup instead of first use", "Options reload automatically", "Validation is skipped in production"], c: 1, why: "Failing at startup turns a hidden runtime bug into an obvious deployment failure." },
        { q: "Which options interface reflects configuration changes without restarting?", a: ["`IOptions<T>`", "`IOptionsMonitor<T>`", "`IConfigurationRoot`", "`IOptionsFactory<T>`"], c: 1, why: "`IOptionsMonitor` observes changes; `IOptions` is computed once." },
        { q: "Where should a production database password live?", a: ["`appsettings.json`, committed to git", "An environment variable or a secret vault", "`appsettings.Production.json`, committed to git", "A constant in the code"], c: 1, why: "Secrets must stay out of source control and be supplied at deploy time." }
      ]
    },
    {
      id: 'testing', title: 'Testing APIs: unit and integration', level: 2, mins: 40,
      terms: [
        ['`WebApplicationFactory<T>`', 'Spins up your real ASP.NET Core pipeline (`routing`, `validation`, `middleware`) in memory for fast integration tests.'],
        ['In-memory `HttpClient`', 'Sends real HTTP JSON requests from tests into your `TestServer` without touching a network port.'],
        ['Test doubles & containers', 'Run integration tests against real SQL containers (Testcontainers) rather than EF’s InMemory provider whenever testing SQL semantics.']
      ],
      why: "Tests let you change code without fear. A good test is also documentation that can't go stale: it states what the code should do, and fails the moment it doesn't.",
      points: [
        "**Unit tests** check one class with its dependencies faked. Fast, many, precise.",
        "**Integration tests** run the real pipeline in memory with `WebApplicationFactory<Program>` (package `Microsoft.AspNetCore.Mvc.Testing`): routing, DI, validation and serialization, all of it.",
        "Create a test project with `dotnet new xunit` and add a reference to the API project. In .NET 10 `Program` is public automatically; on .NET 8 and 9, add `public partial class Program { }` to the end of `Program.cs`.",
        "Structure every test as **Arrange, Act, Assert**. One behavior per test, named after the behavior.",
        "For database tests, use real SQL Server in a container (Testcontainers) rather than the EF in-memory provider, which has no constraints and runs no SQL.",
        "Test behavior, not implementation: assert on outputs and visible effects, not on which private method was called."
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
      analogy: "Unit tests check that each brick is solid. Integration tests check that the wall stands up. You need both: perfect bricks can still be laid crooked, and when a wall falls you want to know quickly whether a brick was the cause.",
      pitfalls: [
        "Mocking everything until the test only checks the mocks.",
        "Tests that depend on each other or on the order they run in.",
        "Trusting the EF in-memory provider to behave like SQL Server: no constraints, no transactions, no real SQL."
      ],
      quiz: [
        { q: "What does `WebApplicationFactory<Program>` give you?", a: ["A mock of the database", "Your real app hosted in memory, with an `HttpClient` to call it", "A deployment to a test server", "A recorded copy of production traffic"], c: 1, why: "It boots the actual pipeline in the test process, so routing, DI and middleware are all exercised." },
        { q: "The three parts of a well-structured test are…", a: ["Setup, Run, Teardown", "Arrange, Act, Assert", "Given, When, Verify", "Mock, Call, Check"], c: 1, why: "Arrange the inputs, act once, assert on the outcome." },
        { q: "Why prefer real SQL Server over the EF in-memory provider in integration tests?", a: ["It's faster", "The in-memory provider doesn't enforce constraints or run real SQL", "It needs no setup", "xUnit can't use the in-memory provider"], c: 1, why: "Bugs in query translation, constraints and transactions only show up against a real engine." }
      ]
    },
    {
      id: 'efadv', title: 'EF Core in depth: tracking, N+1 and concurrency', level: 2, mins: 40,
      splits: [['1 · N+1 vs projection', '// dotnet add package'], ['2 · Optimistic concurrency', '// Optimistic concurrency'], ['3 · Entities & DbContext', 'public record OrderRow']],
      terms: [
        ['`AsNoTracking()`', 'Skips change-tracker snapshot bookkeeping on read-only queries, cutting CPU and RAM allocations.'],
        ['N+1 query bug', 'Issuing 1 query for N rows plus N hidden extra queries inside a loop — solved via `.Select(...)` projection or eager `.Include(...)`.'],
        ['Optimistic concurrency (`[Timestamp]`)', 'Detects two conflicting edits via a row-version check and returns `409 Conflict` instead of silently overwriting the first user’s change.']
      ],
      why: "Most slow ASP.NET Core apps are slow because of a handful of EF Core mistakes. Each one has a recognisable shape in the SQL log, and a small fix.",
      points: [
        "**N+1 problem**: one query for the list, then one more per row for related data. Fix it with projection (`Select`) or `Include`.",
        "Read-only queries should project to DTOs or use `AsNoTracking()`, so the change tracker does no work.",
        "`Include` on several collections multiplies rows (cartesian explosion); `AsSplitQuery()` swaps that for several smaller queries.",
        "`SaveChanges` wraps its changes in one transaction. You only need an explicit transaction to span several saves.",
        "**Optimistic concurrency**: a `[Timestamp]` (`rowversion`) column makes an update fail with `DbUpdateConcurrencyException` if the row changed. In a web API, compare against the version **the client read**, sent back with the edit; otherwise you only catch changes made in the milliseconds between your own load and save.",
        "`ExecuteUpdateAsync` and `ExecuteDeleteAsync` run one SQL statement without loading entities. They skip the change tracker and concurrency checks, so keep them for bulk changes."
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
      practice: "Create an endpoint that lists orders with customer names using a naive loop. Count the SQL statements in the log for 50 orders, fix it, and count again. Then open the same product in two browser tabs, save a price in the first, save a different price in the second, and confirm the second gets a 409.",
      teach: "Explain the N+1 query problem to someone who knows LINQ but has never looked at the generated SQL.",
      analogy: "N+1 is going to the supermarket once to fetch the shopping list, then driving back separately for each item on it. Projection is taking the whole list on one trip.",
      pitfalls: [
        "Enabling lazy loading and never noticing the storm of queries.",
        "Tracking thousands of entities for a read-only page.",
        "Adding a `[Timestamp]` column but comparing against the version you just loaded, so two users editing the same form still overwrite each other.",
        "Using `ExecuteUpdateAsync` where business rules or concurrency checks should apply."
      ],
      quiz: [
        { q: "You list 100 orders and read `order.Customer.Name` in a loop with lazy loading. How many queries?", a: ["1", "2", "Up to 101", "100"], c: 2, why: "One for the orders plus one per order for its customer: the N+1 pattern." },
        { q: "What does `AsNoTracking()` do?", a: ["Turns off SQL logging", "Skips change tracking for the returned entities, saving time and memory", "Stops EF from caching the query plan", "Reads uncommitted data"], c: 1, why: "Read-only results don't need snapshots in the change tracker." },
        { q: "A user loaded a product 5 minutes ago and now saves an edit. Which version must the `UPDATE` compare against to catch changes made in between?", a: ["The version EF just loaded in this request", "The version the client received 5 minutes ago and sent back", "No version: `[Timestamp]` handles it automatically", "The newest version in the table"], c: 1, why: "The freshly loaded version already includes everyone else's changes, so comparing against it detects nothing." }
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
      why: "Performance work is measurement plus a small set of well-understood levers. The skill is matching the lever to the symptom, and knowing what each one costs in correctness.",
      points: [
        "Measure first: load test (k6, bombardier, NBomber), then profile. Track p50, p95 and p99 latency, not the average.",
        "**Caching layers**: output caching (whole responses), `HybridCache` (objects, in memory with an optional shared second level), and a distributed cache such as Redis (shared between instances).",
        "Every cache needs answers to three questions: what is the key, when does it expire, and how is it invalidated? `HybridCache` also stops a stampede: one factory call per key, however many requests arrive.",
        "**Rate limiting** returns `429` when a client sends too much. Give each client its own allowance (partition by user or IP address), or one heavy client uses up everyone's.",
        "**Thread-pool starvation**: sync-over-async (`.Result`, `.Wait()`) blocks threads; latency climbs while CPU stays low. Fix it by going async all the way.",
        "Cheap wins: response compression, pagination everywhere, `IHttpClientFactory` for outbound calls, `IAsyncEnumerable` for streaming large results."
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
        { q: "Latency is rising, CPU is at 15%, and the code contains `.Result` calls. Likely cause?", a: ["A CPU-bound loop", "Thread-pool starvation from blocking on async work", "The garbage collector", "Slow JSON serialization"], c: 1, why: "Blocked threads wait instead of working, and queued requests can't get a thread." },
        { q: "Which status code should a rate limiter return?", a: ["401", "403", "429", "503"], c: 2, why: "429 Too Many Requests, ideally with a `Retry-After` header. 503 means the whole service is unavailable." },
        { q: "With `AddTokenBucketLimiter(\"api\", …)` and no partition, one client sends 10,000 requests. What happens to everyone else?", a: ["Nothing; each client has its own bucket", "They get 429 too: they all share the one bucket", "The server crashes", "Only that client's IP is blocked automatically"], c: 1, why: "A plain limiter is one shared bucket. Partition by user or IP to give each client its own." },
        { q: "Why must an app running on several servers use a distributed cache for shared data?", a: ["It's always faster", "In-memory caches are per instance, so the instances would disagree", "ASP.NET Core requires it", "Memory caches can't expire entries"], c: 1, why: "Each instance has its own memory; a shared store keeps them consistent." }
      ]
    },
    {
      id: 'arch', title: 'Architecture: boundaries, slices and background work', level: 3, mins: 45,
      splits: [['1 · App wiring', '// dotnet add package'], ['2 · PlaceOrder slice', '// ---------- Feature slice'], ['3 · Domain entities', '// ---------- Domain'], ['4 · Outbox & worker', '// ---------- Outbox']],
      terms: [
        ['Vertical slice', 'Organizes code by feature (`PlaceOrder.cs` holding command, validation, handler, endpoint) instead of spreading files across folders by layer.'],
        ['Rich domain entity', 'Encapsulates invariants inside factory/behavior methods (`Order.Place(...)`) so invalid states cannot be constructed anywhere.'],
        ['Transactional Outbox', 'Writes the business row and `OutboxMessage` in the *same* database transaction; a background `BackgroundService` reliably publishes them afterwards.']
      ],
      why: "Architecture is deciding what can change without breaking what. A structure is worth defending only if you can name the forces behind it, and you should be just as ready to say when it's overkill.",
      points: [
        "**Layered / Clean Architecture**: domain at the centre, infrastructure at the edge, dependencies pointing inward. It protects business rules from framework churn.",
        "**Vertical slices**: organize by feature (`PlaceOrder`) rather than by layer. Each slice owns its request, handler, validation and query.",
        "**CQRS**: separate read models from write models. Useful when reads and writes have different shapes or load; needless for simple CRUD.",
        "Put rules that must always hold in the **domain model** (an `Order` that refuses an impossible quantity), not scattered across endpoints. Validate the request too; the domain check is the last line of defence.",
        "Work that shouldn't delay the response goes to a `BackgroundService` or a queue. The **outbox pattern** saves the message in the same transaction as the data, so 'saved' and 'published' can't disagree.",
        "Since .NET 8, an unhandled exception in a `BackgroundService` **stops the whole app**. Catch and log inside the loop.",
        "Start as a **modular monolith**. Split into services only when team structure or scaling demands it: distribution adds failure modes, not simplicity."
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
      analogy: "The outbox is writing 'send this letter' in the same ledger entry as the sale. Even if the postman is late or the post office is closed, the letter can't be forgotten, because it's part of the record of the sale itself.",
      pitfalls: [
        "Applying Clean Architecture, CQRS and a mediator library to a five-endpoint CRUD app.",
        "Anemic domain models, where every rule lives in a 'service' and entities are bags of setters.",
        "Putting an identity (`INT IDENTITY`) id into an outbox message before `SaveChanges`: it's still 0. Generate the id in code, as `Order` does with a `Guid`.",
        "A `BackgroundService` loop without a `try/catch`, so one failed round stops the whole application.",
        "Splitting into microservices to fix a design problem. You get a distributed design problem."
      ],
      quiz: [
        { q: "What does the outbox pattern guarantee?", a: ["Messages are sent instantly", "The message is saved in the same transaction as the data change, so neither happens without the other", "No message is ever delivered twice", "The database is never locked"], c: 1, why: "An atomic write, then at-least-once delivery by a background publisher. Consumers must handle duplicates." },
        { q: "Why does the `BackgroundService` create a scope to use `DbContext`?", a: ["For performance", "Hosted services are singletons and `DbContext` is scoped", "Scopes are required for logging", "To open a database transaction"], c: 1, why: "Injecting a scoped service into a singleton is a captive dependency; create a scope per unit of work." },
        { q: "An exception escapes `ExecuteAsync` in a .NET 10 `BackgroundService`. By default…", a: ["It's logged and the service restarts", "It's ignored", "The whole application stops", "Only that request fails"], c: 2, why: "Since .NET 8 the host's default is to stop when a background service fails, so catch and log inside the loop." },
        { q: "When is CQRS worth its cost?", a: ["Always", "When read and write models differ a lot in shape or load", "Whenever you use EF Core", "Only with microservices"], c: 1, why: "It adds duplication and complexity; the payoff comes only when reads and writes truly diverge." }
      ]
    },
    {
      id: 'prod', title: 'Production: observability, resilience and deployment', level: 3, mins: 45,
      splits: [['1 · Telemetry & resilience', '// dotnet add package'], ['2 · Health & client', 'app.MapHealthChecks("/health/live"'], ['3 · Dockerfile & container', '// Dockerfile']],
      terms: [
        ['OpenTelemetry traces & metrics', 'Correlates logs, timings, and distributed SQL/HTTP spans across services using W3C Trace Context headers.'],
        ['Liveness vs Readiness probes', '`/health/live` asks “is the process alive?”; `/health/ready` asks “can it reach SQL and serve traffic yet?”.'],
        ['Circuit breaker + jittered retries', 'Protects failing downstream dependencies from cascading failure using standard HTTP resilience handlers and idempotency keys.']
      ],
      why: "Code is finished when it runs reliably for users, not when it compiles. That means designing for the day something fails, and in production something eventually does.",
      points: [
        "**Observability** = logs, metrics and traces. **OpenTelemetry** is the standard; a trace follows one request across services.",
        "**Health checks**: liveness ('restart me if this fails') versus readiness ('don't send me traffic yet'). They answer different questions.",
        "**Resilience** for outbound calls: always a timeout, retries with jitter for temporary faults, a circuit breaker to stop hammering a dead dependency. `AddStandardResilienceHandler()` sets all of these up.",
        "The standard handler retries **every** method, `POST` included. Only allow that when the call is idempotent, for example with an idempotency key the other side honours; otherwise turn retries off for unsafe methods.",
        "Ship as a container image: configuration comes from the environment, and the app is stateless so any instance can serve any request. Since .NET 8, the container listens on port **8080**.",
        "Deploy safely: backward-compatible database migrations, graceful shutdown, rolling or blue/green releases, and a rollback you've actually tested."
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
      practice: "Containerize your API and run it with SQL Server using Docker Compose. Add OpenTelemetry with the Aspire dashboard as a local collector, stop the database while sending requests, and describe what the health checks, logs and traces each tell you.",
      teach: "Explain the difference between a liveness check and a readiness check, with an example where they give different answers.",
      analogy: "A circuit breaker is the fuse in your house: after repeated faults it cuts the circuit so the wiring doesn't burn, then lets you try again later.",
      pitfalls: [
        "Retrying non-idempotent calls and charging a customer twice. The standard resilience handler retries `POST` unless you tell it not to.",
        "One health endpoint that checks the database: a short database blip then restarts every instance.",
        "Deploying a migration that drops a column the still-running old version reads.",
        "Mapping the container to port 80 when the app inside listens on 8080."
      ],
      quiz: [
        { q: "The database is down for 20 seconds. What should the liveness probe report?", a: ["Unhealthy, so the app restarts", "Healthy: the process itself is fine", "Unhealthy, but only after 10 seconds", "Degraded"], c: 1, why: "Restarting the app can't fix the database. Readiness should fail; liveness should not." },
        { q: "What does a circuit breaker do after repeated failures?", a: ["Retries faster", "Fails calls immediately for a while instead of contacting the failing dependency", "Restarts the server", "Switches to a backup server automatically"], c: 1, why: "It gives the dependency time to recover and protects your own threads and latency." },
        { q: "Which operation is safe to retry automatically without extra design?", a: ["`POST /payments`", "`GET /products/5`", "`POST /orders`", "Sending an email"], c: 1, why: "`GET` is idempotent; the others need an idempotency key first." }
      ]
    }
  ]
});
