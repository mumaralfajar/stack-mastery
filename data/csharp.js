TRACKS.push({
  id: 'csharp', name: 'C#', lang: 'cs',
  tagline: 'The language: from variables and classes to async, memory and performance.',
  lessons: [
    // ---------------- Beginner ----------------
    {
      id: 'types', title: 'Programs, variables and types', level: 0, mins: 25,
      why: "Every C# program is values with types moving through statements. If a student understands that the compiler checks types **before** the program runs, half of all beginner errors stop being mysterious.",
      points: [
        "C# source compiles to IL (intermediate language); the .NET runtime (CLR) turns IL into machine code as the program runs (JIT). `dotnet run` does both steps.",
        "A variable is a named box with a fixed type: `int`, `double`, `decimal` (money), `bool`, `char`, `string`. The type never changes after declaration.",
        "`var` does not mean 'any type'. The compiler infers the type from the right-hand side and then locks it in.",
        "C# is statically typed: `int x = \"hello\";` fails at compile time, not at run time. That is a feature — errors are found before users see them.",
        "String interpolation `$\"Total: {price * qty}\"` is the everyday way to build text.",
        "Integer division truncates: `7 / 2` is `3`. Make one side a `double` or `decimal` to keep the fraction."
      ],
      code: `
// Program.cs — top-level statements, no ceremony needed
string name = "Ana";
int age = 30;
decimal price = 19.99m;      // m = decimal literal, use for money
var qty = 3;                 // inferred as int, still strongly typed

Console.WriteLine($"{name} is {age}");
Console.WriteLine($"Total: {price * qty}");   // 59.97
Console.WriteLine(7 / 2);                     // 3  (integer division)
Console.WriteLine(7 / 2.0);                   // 3.5

// qty = "three";   // compile error: cannot convert string to int
`,
      practice: "Create a console app with `dotnet new console`. Declare your name, birth year and hourly rate, then print one sentence that includes your age and what you earn in a 40-hour week. Then uncomment a deliberate type error and read the compiler message carefully.",
      teach: "Explain to someone who has never programmed what a variable and a type are, and why C# refuses to run `int x = \"hello\"`.",
      analogy: "Variables are labelled containers in a kitchen: a jar marked 'flour' only takes flour. The compiler is the strict chef who checks every jar before cooking starts, so nobody discovers salt in the sugar jar halfway through the recipe.",
      pitfalls: [
        "Believing `var` makes a variable dynamic like in JavaScript. Show that `var x = 1; x = \"a\";` does not compile.",
        "Using `double` for money and being surprised by `0.1 + 0.2`. Money is `decimal`.",
        "Expecting `7 / 2` to be `3.5`. The operand types decide the operation."
      ],
      quiz: [
        { q: "What does `var total = 5;` mean in C#?", a: ["`total` can later hold any type", "`total` is an `int`, inferred by the compiler", "`total` is decided at run time", "`total` is a global variable"], c: 1, why: "`var` is compile-time type inference. The variable is an `int` forever." },
        { q: "What does `Console.WriteLine(9 / 2);` print?", a: ["4.5", "4", "5", "It does not compile"], c: 1, why: "Both operands are `int`, so C# performs integer division and truncates toward zero." },
        { q: "Which type should hold a price?", a: ["`float`", "`double`", "`decimal`", "`int`"], c: 2, why: "`decimal` is base-10 and represents values like 0.10 exactly; binary floating point does not." }
      ]
    },
    {
      id: 'flow', title: 'Control flow and methods', level: 0, mins: 30,
      why: "Decisions, repetition and named reusable steps are the entire grammar of programming logic. Everything later — LINQ, async, web requests — is built from these.",
      points: [
        "`if / else if / else` picks a branch using a `bool` expression. `==` compares, `=` assigns.",
        "`for` when you know the count, `foreach` to walk a collection, `while` to repeat until a condition changes.",
        "A method is a named block with typed parameters and a typed return value: `static int Add(int a, int b) => a + b;`.",
        "Arguments are passed **by value** by default: the method receives a copy of what the variable holds.",
        "`switch` expressions turn a value into a result in one expression and warn you about missing cases.",
        "Keep methods small and name them after what they return or do. A good name is the first documentation."
      ],
      code: `
static string Grade(int score) => score switch
{
    >= 90 => "A",
    >= 75 => "B",
    >= 60 => "C",
    _     => "F"          // discard: everything else
};

int[] scores = { 95, 72, 58, 81 };
int total = 0;

foreach (int s in scores)
{
    total += s;
    Console.WriteLine($"{s} -> {Grade(s)}");
}

double average = (double)total / scores.Length;
if (average >= 75) Console.WriteLine("Class passed");
else Console.WriteLine("Needs review");
`,
      practice: "Write FizzBuzz for 1 to 30 as a method `string FizzBuzz(int n)` plus a loop that calls it. Then rewrite the method body as a `switch` expression on the tuple `(n % 3, n % 5)`.",
      teach: "Explain the difference between a `for` loop and a `foreach` loop, and when you would pick a method instead of copying code.",
      analogy: "A method is a recipe card: it has a name, a list of ingredients (parameters) and produces a dish (return value). Calling the method is asking someone to cook the card — you do not rewrite the recipe every time you are hungry.",
      pitfalls: [
        "Off-by-one loops: `i <= array.Length` reads past the end. Arrays start at 0 and end at `Length - 1`.",
        "Writing `if (x = 5)`. In C# this is a compile error for non-bool types, which is a good moment to explain `=` versus `==`.",
        "Thinking a method can change the caller's `int` argument. It gets a copy unless `ref` or `out` is used."
      ],
      quiz: [
        { q: "Which loop is the best fit for visiting every item of a `List<string>` in order?", a: ["`while`", "`foreach`", "`do … while`", "`goto`"], c: 1, why: "`foreach` expresses 'every element' directly and cannot go out of bounds." },
        { q: "A method `void Reset(int n) { n = 0; }` is called as `Reset(count)`. What is `count` afterwards?", a: ["0", "Unchanged", "null", "A compile error"], c: 1, why: "`int` is passed by value: the method zeroes its own copy." },
        { q: "What does `_` mean in a `switch` expression arm?", a: ["A syntax error", "A variable named underscore", "The default case that matches anything", "It repeats the previous arm"], c: 2, why: "`_` is the discard pattern — it matches any value not matched earlier." }
      ]
    },
    {
      id: 'classes', title: 'Classes, objects and properties', level: 0, mins: 35,
      why: "C# is object-oriented at its core. ASP.NET controllers, EF entities and DTOs are all classes; a student who cannot read a class cannot read any real codebase.",
      points: [
        "A **class** is a blueprint; an **object** is one instance built with `new`.",
        "State lives in properties (`public string Name { get; set; }`), behavior lives in methods.",
        "A constructor guarantees an object starts in a valid state. Required data goes in the constructor or `required` properties.",
        "**Encapsulation**: keep fields `private` and expose only what callers need. A `private set` lets the class protect its own rules.",
        "`static` members belong to the class itself, not to any instance.",
        "`this` refers to the current object. Most of the time it is implied."
      ],
      code: `
var acct = new BankAccount("Ana", 100);
acct.Deposit(50);
Console.WriteLine(acct.Balance);   // 150
// acct.Balance = 1_000_000;       // compile error: setter is private

// In Program.cs, type declarations come after the top-level statements
public class BankAccount
{
    public string Owner { get; }
    public decimal Balance { get; private set; }   // only the class can change it

    public BankAccount(string owner, decimal opening = 0)
    {
        Owner = owner;
        Balance = opening;
    }

    public void Deposit(decimal amount)
    {
        if (amount <= 0) throw new ArgumentException("Amount must be positive");
        Balance += amount;
    }
}
`,
      practice: "Add a `Withdraw` method that refuses to overdraw. Then add a `Transfer(BankAccount to, decimal amount)` method. Which rule lives in which method, and why should `Balance` stay privately settable?",
      teach: "Explain the difference between a class and an object, and why `Balance` has a private setter instead of being freely writable.",
      analogy: "A class is the architect's drawing of a house; objects are the actual houses built from it. Encapsulation is the front door: visitors use the doorbell (public methods) rather than climbing through a window and rearranging the wiring (private fields).",
      pitfalls: [
        "Confusing the class with the instance — trying to call `BankAccount.Deposit(5)` without an object.",
        "Making everything `public` 'to keep it simple'. Show a bug where outside code sets a negative balance.",
        "Thinking properties are just fields. A property is a pair of methods and can validate or compute."
      ],
      quiz: [
        { q: "What does `public decimal Balance { get; private set; }` allow?", a: ["Anyone can read and write", "Anyone can read; only the class can write", "Only the class can read", "Nobody can write, ever"], c: 1, why: "The getter is public and the setter is private, so the class controls every change." },
        { q: "What is the job of a constructor?", a: ["To destroy the object", "To put a new object into a valid starting state", "To make the class static", "To copy the object"], c: 1, why: "Constructors run once at creation and establish the object's invariants." },
        { q: "A `static` method…", a: ["belongs to each object separately", "belongs to the class and needs no instance", "cannot return a value", "runs automatically at startup"], c: 1, why: "Static members are called on the type itself, for example `Math.Max(1, 2)`." }
      ]
    },
    // ---------------- Intermediate ----------------
    {
      id: 'memory', title: 'Value types vs reference types', level: 1, mins: 30, viz: 'stackheap',
      why: "'Why did changing one variable change the other?' is the most common intermediate bug in C#. The answer is always value versus reference semantics.",
      points: [
        "**Value types** (`int`, `bool`, `decimal`, `struct`, `enum`): the variable holds the data itself. Assignment copies the data.",
        "**Reference types** (`class`, `string`, arrays, `List<T>`): the variable holds a reference to an object on the heap. Assignment copies the reference — two variables, one object.",
        "Locals live in the method's stack frame; objects created with `new` on a class live on the managed heap and are cleaned up by the garbage collector.",
        "`string` is a reference type that is **immutable**, so it behaves like a value in practice: 'changing' a string creates a new one.",
        "`==` on classes compares references by default; on value types and records it compares contents.",
        "`null` means a reference points to nothing. Value types cannot be null unless written as `int?`."
      ],
      code: `
int a = 5;
int b = a;          // copies the value
b = 9;              // a is still 5

var p1 = new Person { Name = "Ana" };
var p2 = p1;        // copies the REFERENCE
p2.Name = "Budi";
Console.WriteLine(p1.Name);   // Budi — same object

void Rename(Person p) => p.Name = "Citra";   // mutates the caller's object
void Replace(Person p) => p = new Person();  // only rebinds the local copy

class Person { public string Name { get; set; } = ""; }
`,
      practice: "Predict, then run: create a `struct Point { public int X; }` and a `class PointC { public int X; }`. Assign each to a second variable, change `X` on the second, and print both. Explain the two different results.",
      teach: "Explain why `p2.Name = \"Budi\"` also changed `p1.Name`, but `b = 9` did not change `a`.",
      analogy: "A value type is a sheet of paper: photocopy it and scribbling on the copy leaves the original untouched. A reference type is a link to a shared online document: giving a friend the link means their edits appear on your screen too.",
      pitfalls: [
        "'Value types live on the stack, reference types on the heap' is a simplification. A struct inside a class lives on the heap. Teach semantics (copy vs share) first, location second.",
        "Believing passing a class to a method copies the object. It copies the reference.",
        "Expecting `Replace(p)` to change the caller's variable. Without `ref`, only the method's local reference is rebound."
      ],
      quiz: [
        { q: "After `var x = new List<int>{1}; var y = x; y.Add(2);` how many items does `x` have?", a: ["1", "2", "0", "It throws"], c: 1, why: "`List<T>` is a reference type; `x` and `y` point to the same list." },
        { q: "Which of these is a value type?", a: ["`string`", "`int[]`", "`struct DateOnly`", "`class Order`"], c: 2, why: "Structs are value types. Strings and arrays are reference types." },
        { q: "Why does `string` feel like a value type?", a: ["It is stored on the stack", "It is immutable and `==` compares content", "It is a struct", "It cannot be null"], c: 1, why: "Strings are heap objects, but they can never change and equality is overloaded to compare characters." }
      ]
    },
    {
      id: 'interfaces', title: 'Interfaces, inheritance and polymorphism', level: 1, mins: 35,
      why: "ASP.NET Core is built on interfaces — `ILogger`, `IServiceCollection`, `DbContext` abstractions. Dependency injection and unit testing only make sense once interfaces do.",
      points: [
        "An **interface** is a contract: a list of members with no state. A class that implements it promises to provide them.",
        "**Polymorphism**: code written against `IShape` works with any shape, including ones written next year.",
        "Inheritance (`class Dog : Animal`) shares implementation. `virtual` marks a method that subclasses may `override`.",
        "A class can inherit from one base class but implement many interfaces.",
        "Prefer **composition and interfaces** over deep inheritance trees. Inheritance couples you to the parent's implementation.",
        "`abstract` classes sit in between: shared code plus members that subclasses must fill in."
      ],
      code: `
new OrderService(new SmsNotifier()).Place("Ana");     // SMS to Ana: Order received
new OrderService(new EmailNotifier()).Place("Budi");  // same service, different behavior

public interface INotifier
{
    void Send(string to, string message);
}

public class EmailNotifier : INotifier
{
    public void Send(string to, string message) => Console.WriteLine($"Email to {to}: {message}");
}

public class SmsNotifier : INotifier
{
    public void Send(string to, string message) => Console.WriteLine($"SMS to {to}: {message}");
}

// Depends on the contract, not on a concrete class
public class OrderService(INotifier notifier)
{
    public void Place(string customer) => notifier.Send(customer, "Order received");
}
`,
      practice: "Add a `FakeNotifier` that records messages in a `List<string>` instead of sending them. Use it to check that `OrderService.Place` sends exactly one message. You have just written a unit test double.",
      teach: "Explain what an interface is and why `OrderService` asks for an `INotifier` instead of creating an `EmailNotifier` itself.",
      analogy: "An interface is a wall socket. The lamp does not care whether the power comes from coal, solar or a generator — it only needs the socket shape. Swap the power plant and the lamp keeps working.",
      pitfalls: [
        "Creating an interface for every class by reflex. An interface earns its place when there are, or will be, multiple implementations or a test double.",
        "Confusing `override` with `new` (hiding). Only `override` participates in polymorphism.",
        "Using inheritance for code reuse between unrelated things: 'is-a' must be true for every use."
      ],
      quiz: [
        { q: "How many interfaces can one C# class implement?", a: ["One", "Two", "Any number", "None if it has a base class"], c: 2, why: "Single inheritance of classes, multiple implementation of interfaces." },
        { q: "What must a base method be marked with for `override` to work?", a: ["`static`", "`virtual` or `abstract`", "`sealed`", "`private`"], c: 1, why: "Only virtual, abstract or already-overridden members can be overridden." },
        { q: "The main benefit of `OrderService(INotifier n)` over `new EmailNotifier()` inside the class is…", a: ["It runs faster", "The dependency can be swapped or faked without changing `OrderService`", "It uses less memory", "It avoids needing a constructor"], c: 1, why: "Depending on an abstraction decouples the class from a concrete implementation — the basis of DI and testing." }
      ]
    },
    {
      id: 'generics', title: 'Collections and generics', level: 1, mins: 30,
      why: "Real programs are mostly collections of things. Choosing between `List`, `Dictionary` and `HashSet` is the first performance decision a developer ever makes.",
      points: [
        "`List<T>`: ordered, indexable, grows automatically. Lookup by value is O(n).",
        "`Dictionary<TKey, TValue>`: key to value in O(1) average. Use `TryGetValue` instead of catching exceptions.",
        "`HashSet<T>`: unique items with fast `Contains`. `Queue<T>` and `Stack<T>` for FIFO and LIFO.",
        "**Generics** let one class work for any type while staying type-safe: `List<int>` cannot hold a string, and no casting is needed.",
        "Constraints narrow what `T` may be: `where T : IComparable<T>`, `where T : class, new()`.",
        "Accept the most general type you need (`IEnumerable<T>`, `IReadOnlyList<T>`) and return the most specific useful one."
      ],
      code: `
var stock = new Dictionary<string, int>
{
    ["apple"] = 10,
    ["pear"] = 0
};

if (stock.TryGetValue("apple", out int count))
    Console.WriteLine($"apples: {count}");

var seen = new HashSet<string>();
foreach (var word in new[] { "a", "b", "a" })
    if (!seen.Add(word)) Console.WriteLine($"duplicate: {word}");

// A generic method with a constraint
static T Max<T>(IEnumerable<T> items) where T : IComparable<T>
{
    T best = items.First();
    foreach (var item in items)
        if (item.CompareTo(best) > 0) best = item;
    return best;
}

Console.WriteLine(Max(new[] { 3, 9, 4 }));        // 9
Console.WriteLine(Max(new[] { "kiwi", "fig" }));  // kiwi
`,
      practice: "Count word frequencies in a paragraph using `Dictionary<string, int>`, then print the top three. Then write a generic `Result<T>` class holding either a value or an error message.",
      teach: "Explain why finding an item in a `Dictionary` is faster than in a `List`, and what the `<T>` in `List<T>` buys you.",
      analogy: "A `List` is a queue of people: to find Budi you ask each person in turn. A `Dictionary` is a coat check: you hand over ticket 42 and the attendant walks straight to hook 42. Generics are a label maker — one box design, stamped 'shoes only' or 'books only'.",
      pitfalls: [
        "Using `list.Contains()` inside a loop over another list — accidental O(n²). Convert one side to a `HashSet`.",
        "Calling `dict[key]` on a missing key and getting `KeyNotFoundException`.",
        "Modifying a collection while iterating it with `foreach`."
      ],
      quiz: [
        { q: "You need to check thousands of times whether an ID has been seen. Best choice?", a: ["`List<int>`", "`int[]`", "`HashSet<int>`", "`Queue<int>`"], c: 2, why: "`HashSet.Contains` is O(1) on average; a list scan is O(n)." },
        { q: "What does `where T : new()` require?", a: ["T is a value type", "T has a public parameterless constructor", "T is newly declared", "T implements `ICloneable`"], c: 1, why: "The `new()` constraint lets generic code write `new T()`." },
        { q: "Safest way to read a possibly missing dictionary key?", a: ["`dict[key]` in a try/catch", "`dict.TryGetValue(key, out var v)`", "`dict.First()`", "`dict.Keys[key]`"], c: 1, why: "`TryGetValue` performs one lookup and reports success without exceptions." }
      ]
    },
    {
      id: 'linq', title: 'LINQ: querying anything', level: 1, mins: 35, viz: 'linq',
      why: "LINQ is how C# developers filter, transform and aggregate data — in memory and, through EF Core, in SQL. It is the bridge between the C# and SQL tracks.",
      points: [
        "LINQ methods are extension methods on `IEnumerable<T>`: `Where` filters, `Select` transforms, `OrderBy` sorts, `GroupBy` groups.",
        "Lambdas such as `x => x.Price > 10` are tiny inline functions passed as arguments.",
        "**Deferred execution**: building a query does nothing. It runs when you enumerate it (`foreach`, `ToList()`, `Count()`, `First()`).",
        "Each enumeration re-runs the query. Call `ToList()` once if you will use the results several times.",
        "`First()` throws on empty, `FirstOrDefault()` returns `null`/default, `Single()` insists on exactly one.",
        "On `IQueryable<T>` (EF Core) the same methods are translated to SQL instead of running in memory."
      ],
      code: `
var products = new List<Product>
{
    new("Laptop", "Tech", 1200), new("Mouse", "Tech", 25),
    new("Desk", "Home", 300),    new("Lamp", "Home", 40)
};

var cheapTech = products
    .Where(p => p.Category == "Tech" && p.Price < 100)
    .OrderBy(p => p.Price)
    .Select(p => p.Name);          // nothing has run yet

foreach (var name in cheapTech) Console.WriteLine(name);   // runs here

var byCategory = products
    .GroupBy(p => p.Category)
    .Select(g => new { Category = g.Key, Total = g.Sum(p => p.Price), Count = g.Count() });

foreach (var c in byCategory) Console.WriteLine($"{c.Category}: {c.Count} items, {c.Total}");

record Product(string Name, string Category, decimal Price);
`,
      practice: "From a list of orders (customer, amount, date), use LINQ to find each customer's total spend, sorted high to low, top three only. Then put a `Console.WriteLine` inside a `Where` lambda and observe exactly when it prints.",
      teach: "Explain deferred execution: why does a LINQ query with `Where` and `Select` do no work until `foreach` or `ToList()`?",
      analogy: "A LINQ query is a set of instructions pinned above an assembly line: 'keep the red ones, paint them, box the first three'. Writing the instructions moves no boxes. The line only starts when someone stands at the end and asks for a product.",
      pitfalls: [
        "Enumerating the same query twice and running an expensive operation (or a database call) twice.",
        "Using `Count() > 0` instead of `Any()` — one counts everything, the other stops at the first match.",
        "Calling `ToList()` in the middle of an EF Core query and silently pulling the whole table into memory."
      ],
      quiz: [
        { q: "When does `var q = items.Where(x => x > 5);` filter the items?", a: ["Immediately", "When `q` is enumerated", "At compile time", "Never"], c: 1, why: "LINQ operators are lazy; work happens on enumeration." },
        { q: "Which call throws if the sequence is empty?", a: ["`FirstOrDefault()`", "`Any()`", "`First()`", "`ToList()`"], c: 2, why: "`First()` requires at least one element." },
        { q: "Best way to ask 'is there at least one match?'", a: ["`Count() > 0`", "`Any()`", "`ToList().Count > 0`", "`First() != null`"], c: 1, why: "`Any()` short-circuits as soon as one element matches." }
      ]
    },
    // ---------------- Advanced ----------------
    {
      id: 'delegates', title: 'Delegates, lambdas and events', level: 2, mins: 30,
      why: "Functions as values power LINQ, middleware, minimal API handlers and every callback in .NET. This is the idea that makes the framework feel like magic until you see it.",
      points: [
        "A **delegate** is a type that holds a method: 'something that takes an `int` and returns a `bool`'.",
        "`Func<T, TResult>` returns a value, `Action<T>` returns nothing, `Predicate<T>` returns `bool`. You rarely need custom delegate types.",
        "A **lambda** `x => x * 2` is an inline method. If it uses outer variables it becomes a **closure** and captures the variable itself, not a snapshot.",
        "An **event** is a delegate with restricted access: outsiders may only subscribe (`+=`) and unsubscribe (`-=`).",
        "Forgetting to unsubscribe keeps the subscriber alive — a classic memory leak.",
        "`app.MapGet(\"/\", () => \"hi\")` is simply passing a delegate to the framework."
      ],
      code: `
Func<int, int> twice = x => x * 2;
Action<string> log = msg => Console.WriteLine($"[log] {msg}");
log(twice(21).ToString());                       // [log] 42

// Higher-order function: behavior passed in
static List<T> Filter<T>(IEnumerable<T> items, Func<T, bool> keep)
{
    var result = new List<T>();
    foreach (var i in items) if (keep(i)) result.Add(i);
    return result;
}
var evens = Filter(new[] { 1, 2, 3, 4 }, n => n % 2 == 0);

// Closure: the lambda captures the variable 'count'
int count = 0;
Action bump = () => count++;
bump(); bump();
Console.WriteLine(count);                        // 2

public class Thermostat
{
    public event Action<double>? TooHot;
    public void Read(double c) { if (c > 30) TooHot?.Invoke(c); }
}
`,
      practice: "Write your own `MyWhere` and `MySelect` extension methods using `Func` and `yield return`. Then chain them. You have just re-implemented the core of LINQ.",
      teach: "Explain what it means that a lambda 'captures' a variable, using the `count` example.",
      analogy: "A delegate is a phone number written on a card. You can hand the card to someone else and they can call it later without knowing who answers. An event is a mailing list: anyone may sign up or leave, but only the owner can send the newsletter.",
      pitfalls: [
        "Thinking a closure copies the value. It shares the variable, so later changes are visible to the lambda.",
        "Long-lived publishers holding references to short-lived subscribers through events.",
        "Declaring custom delegate types where `Func` or `Action` would do."
      ],
      quiz: [
        { q: "Which type describes a method taking a `string` and returning an `int`?", a: ["`Action<string, int>`", "`Func<string, int>`", "`Func<int, string>`", "`Predicate<string>`"], c: 1, why: "In `Func`, the last type argument is the return type." },
        { q: "`int n = 1; Func<int> f = () => n; n = 5;` What does `f()` return?", a: ["1", "5", "0", "It throws"], c: 1, why: "The closure captured the variable `n`, not its value at creation time." },
        { q: "What can code outside a class do with its public `event`?", a: ["Invoke it", "Assign `null` to it", "Subscribe and unsubscribe only", "Read its subscriber list"], c: 2, why: "Events restrict outsiders to `+=` and `-=`." }
      ]
    },
    {
      id: 'async', title: 'async, await and Tasks', level: 2, mins: 40, viz: 'async',
      why: "Every ASP.NET Core request handler should be async. Misunderstanding it causes the two worst production bugs in .NET: thread-pool starvation and deadlocks.",
      points: [
        "A `Task` represents work that will finish later; `Task<T>` also carries a result.",
        "`await` does **not** block. It registers 'continue here when the task finishes' and returns the thread to do other work.",
        "Async is about **not wasting threads while waiting** for I/O (database, HTTP, disk). It does not make a single operation faster.",
        "Async all the way: never call `.Result` or `.Wait()` on a task — that blocks a thread and can deadlock.",
        "Start independent operations first, then `await Task.WhenAll(...)` to run them concurrently.",
        "`async void` is only for event handlers; exceptions in it cannot be caught by the caller. Pass a `CancellationToken` through every async call chain."
      ],
      code: `
static async Task<string> FetchAsync(HttpClient http, string url, CancellationToken ct)
{
    using var response = await http.GetAsync(url, ct);   // thread is free while waiting
    response.EnsureSuccessStatusCode();
    return await response.Content.ReadAsStringAsync(ct);
}

var http = new HttpClient();
var ct = CancellationToken.None;

// Sequential: total time = a + b
var a = await FetchAsync(http, "https://example.com/a", ct);
var b = await FetchAsync(http, "https://example.com/b", ct);

// Concurrent: total time = max(a, b)
Task<string> ta = FetchAsync(http, "https://example.com/a", ct);
Task<string> tb = FetchAsync(http, "https://example.com/b", ct);
string[] both = await Task.WhenAll(ta, tb);

// Never: var s = FetchAsync(http, url, ct).Result;   // blocks a thread
`,
      practice: "Write three methods that each `await Task.Delay(1000)` and return a number. Time awaiting them one by one versus with `Task.WhenAll` using `Stopwatch`. Then explain the difference in your own words.",
      teach: "Explain what happens to the thread when code reaches `await`, and why that lets a web server handle more requests.",
      analogy: "A waiter takes your order to the kitchen and does not stand at the stove until the food is cooked — they serve other tables and return when the bell rings. `await` is the bell. Blocking with `.Result` is the waiter who stands and stares at the stove while the restaurant fills up.",
      pitfalls: [
        "'Async makes code run in parallel on another thread.' No — for I/O there is no thread at all while waiting.",
        "Wrapping synchronous CPU work in `Task.Run` inside ASP.NET and calling it 'async'. That just moves the work to another pool thread.",
        "Forgetting `await` — the method continues immediately and exceptions vanish."
      ],
      quiz: [
        { q: "What happens to the current thread at `await http.GetAsync(url)` while the network call is in flight?", a: ["It sleeps until the response arrives", "It is released to do other work", "It spins in a loop", "It is destroyed"], c: 1, why: "`await` yields the thread; a continuation resumes the method later." },
        { q: "Three independent 1-second I/O calls. Fastest correct approach?", a: ["Await each in turn", "Start all three, then `await Task.WhenAll`", "Call `.Result` on each", "`Thread.Sleep(1000)`"], c: 1, why: "Starting the tasks before awaiting lets the waits overlap: about 1 second total instead of 3." },
        { q: "Why avoid `.Result` in ASP.NET Core?", a: ["It is slower to type", "It blocks a thread-pool thread and can starve the pool", "It returns the wrong value", "It is not supported"], c: 1, why: "Blocked threads cannot serve other requests; under load the pool runs dry." }
      ]
    },
    {
      id: 'modern', title: 'Errors, null safety, records and patterns', level: 2, mins: 35,
      why: "Modern C# lets the compiler prevent whole categories of bugs: null references, forgotten cleanup and unhandled cases. Senior code is recognizable by how it uses these features.",
      points: [
        "Exceptions are for **exceptional** situations. Throw specific types, catch only what you can handle, and never swallow with an empty `catch`.",
        "`using` guarantees `Dispose()` runs — files, connections and HTTP responses must be released deterministically.",
        "**Nullable reference types**: `string` means never null, `string?` means maybe null. The compiler warns when you dereference a maybe-null value.",
        "`?.` (null-conditional), `??` (fallback) and `??=` (assign if null) make null handling explicit and short.",
        "**Records** give value-based equality, immutability and `with` copies — ideal for DTOs and messages.",
        "**Pattern matching** (`is`, `switch` with type, property and relational patterns) replaces chains of casts and ifs."
      ],
      code: `
static string Describe(Payment p) => p switch
{
    Card { Last4: var d }        => $"Card ending {d}",
    Transfer t when t.Iban.StartsWith("ID") => "Domestic transfer",
    Transfer                     => "International transfer",
    _ => throw new ArgumentOutOfRangeException(nameof(p))
};

var price = new Money(10, "USD");
var sale = price with { Amount = 8 };          // non-destructive copy
Console.WriteLine(price == new Money(10, "USD"));   // True: value equality

string? nickname = null;
int length = nickname?.Length ?? 0;            // no NullReferenceException

using var file = File.OpenText("data.txt");    // disposed at end of scope

public record Money(decimal Amount, string Currency);

public abstract record Payment;
public record Card(string Last4) : Payment;
public record Transfer(string Iban) : Payment;
`,
      practice: "Model a `Shape` hierarchy with records (`Circle`, `Rect`, `Triangle`) and write one `Area` method using a `switch` expression. Enable `<Nullable>enable</Nullable>` and fix every warning without using the `!` operator.",
      teach: "Explain the difference between `string` and `string?` and how that changes what the compiler checks for you.",
      analogy: "Nullable annotations are labels on boxes: 'always contains something' or 'might be empty — look before reaching in'. `using` is a hotel key card that deactivates automatically at checkout, so you cannot forget to return it.",
      pitfalls: [
        "Using exceptions for normal control flow such as 'user not found'. Return `null`, a `bool`, or a result type instead.",
        "Silencing nullable warnings with `!` instead of fixing the cause.",
        "Thinking `record` only means 'shorter class'. The important part is value equality and immutability."
      ],
      quiz: [
        { q: "What does `a?.B ?? c` evaluate to when `a` is null?", a: ["It throws", "`null`", "`c`", "`a`"], c: 2, why: "`a?.B` yields null, and `??` supplies the fallback `c`." },
        { q: "Two records with identical property values compared with `==` are…", a: ["never equal", "equal", "equal only if the same instance", "a compile error"], c: 1, why: "Records implement value-based equality." },
        { q: "What does `using var conn = new SqlConnection(cs);` guarantee?", a: ["The connection is faster", "`Dispose()` is called when the scope ends, even on exceptions", "The connection is never closed", "The variable is static"], c: 1, why: "`using` compiles to try/finally with `Dispose()` in the finally block." }
      ]
    },
    // ---------------- Expert ----------------
    {
      id: 'gc', title: 'Memory, the garbage collector and Span', level: 3, mins: 40,
      why: "At scale, allocation rate is latency. Experts read a profiler, know what the GC is doing, and can remove allocations from a hot path without making the code unreadable.",
      points: [
        "The GC is **generational**: new objects start in Gen 0; survivors are promoted to Gen 1, then Gen 2. Most objects die young, so Gen 0 collections are cheap.",
        "Objects of roughly 85 KB or more go to the **Large Object Heap**, collected with Gen 2 and not compacted by default — large temporary buffers are expensive.",
        "A Gen 2 collection can pause the app. Reduce garbage in hot paths: reuse buffers (`ArrayPool<T>`), avoid needless LINQ and string concatenation in tight loops.",
        "`Span<T>` and `ReadOnlySpan<T>` are views over existing memory — slice arrays and strings with **zero allocation**. They are `ref struct`s and cannot live on the heap or cross an `await`.",
        "`Memory<T>` is the heap-friendly cousin of `Span<T>` for async code.",
        "Measure first: `dotnet-counters`, `dotnet-trace`, and BenchmarkDotNet with `[MemoryDiagnoser]`. Never optimize from intuition."
      ],
      code: `
using System.Buffers;

// Allocates a new string per field
static int SumSlow(string csv) => csv.Split(',').Sum(int.Parse);

// Zero allocations: slices the original string
static int SumFast(ReadOnlySpan<char> csv)
{
    int sum = 0;
    while (!csv.IsEmpty)
    {
        int comma = csv.IndexOf(',');
        var field = comma < 0 ? csv : csv[..comma];
        sum += int.Parse(field);
        csv = comma < 0 ? default : csv[(comma + 1)..];
    }
    return sum;
}

// Rent instead of allocate
byte[] buffer = ArrayPool<byte>.Shared.Rent(64 * 1024);
try { /* use buffer */ }
finally { ArrayPool<byte>.Shared.Return(buffer); }
`,
      practice: "Benchmark `SumSlow` and `SumFast` with BenchmarkDotNet and `[MemoryDiagnoser]`. Report the allocated bytes per call for each and explain where every allocation in the slow version comes from.",
      teach: "Explain why most .NET garbage collections are fast, and what kind of code makes them slow.",
      analogy: "Gen 0 is your desk: you clear scrap paper off it many times a day in seconds. Gen 2 is the attic: cleaning it means stopping everything for an afternoon. Good code keeps short-lived paper on the desk and avoids hauling it to the attic. `Span` is a window frame held over part of a page — you read through it without photocopying.",
      pitfalls: [
        "Calling `GC.Collect()` to 'help'. It promotes objects prematurely and usually hurts.",
        "Converting everything to structs to avoid allocation and paying more in copying.",
        "Optimizing code that is not on the hot path. Profile first."
      ],
      quiz: [
        { q: "Why is a Gen 0 collection usually cheap?", a: ["It runs on the GPU", "Most new objects are already dead, so little needs to be traced or copied", "It only runs at shutdown", "It skips the stack"], c: 1, why: "The generational hypothesis: young objects die young, so Gen 0 has few survivors." },
        { q: "Why can a `Span<T>` not be a field of a class?", a: ["It is too large", "It is a `ref struct` and must stay on the stack", "It is obsolete", "Classes cannot hold structs"], c: 1, why: "Spans may point to stack memory, so the compiler forbids them from escaping to the heap." },
        { q: "First step before optimizing memory use?", a: ["Rewrite with structs", "Call `GC.Collect()`", "Measure with a profiler or benchmark", "Remove all LINQ"], c: 2, why: "Without measurement you do not know where allocations happen or whether they matter." }
      ]
    },
    {
      id: 'concurrency', title: 'Concurrency and thread safety', level: 3, mins: 40,
      why: "A web server runs many requests at once. Any shared state — a static field, a singleton service, a cache — is touched by several threads simultaneously, and bugs here are rare, random and disastrous.",
      points: [
        "A **race condition** occurs when the result depends on thread timing. `count++` is read-modify-write and is **not atomic**.",
        "Protect shared mutable state: `lock` for short critical sections, `Interlocked` for single counters, `SemaphoreSlim` for async code (`lock` cannot span `await`).",
        "Prefer not sharing: immutable data, per-request (scoped) objects, or message passing with `Channel<T>`.",
        "`ConcurrentDictionary` is safe per operation, but check-then-act sequences still race. Use `GetOrAdd` and `AddOrUpdate`.",
        "**Deadlock**: two threads each hold a lock the other needs. Always acquire locks in a consistent order and hold them briefly.",
        "`Parallel.ForEachAsync` and `Task.WhenAll` for throughput; channels for producer/consumer pipelines with back-pressure."
      ],
      code: `
using System.Threading.Channels;

int unsafeCount = 0, safeCount = 0;

Parallel.For(0, 100_000, _ =>
{
    unsafeCount++;                          // lost updates
    Interlocked.Increment(ref safeCount);   // atomic
});
Console.WriteLine($"{unsafeCount} vs {safeCount}");   // e.g. 73412 vs 100000

// Async-friendly mutual exclusion
var gate = new SemaphoreSlim(1, 1);
async Task UpdateAsync()
{
    await gate.WaitAsync();
    try { await Task.Delay(10); /* critical section */ }
    finally { gate.Release(); }
}

// Producer / consumer with back-pressure
var channel = Channel.CreateBounded<int>(capacity: 100);
var consumer = Task.Run(async () =>
{
    await foreach (var item in channel.Reader.ReadAllAsync())
        Console.WriteLine(item);
});
for (int i = 0; i < 5; i++) await channel.Writer.WriteAsync(i);
channel.Writer.Complete();
await consumer;
`,
      practice: "Build a tiny in-memory rate limiter (max N calls per second per key) that is correct under `Parallel.For`. Write a test that fails for a naive `Dictionary` version and passes for yours.",
      teach: "Explain why `count++` on a shared variable gives wrong totals with many threads, step by step.",
      analogy: "Two cashiers share one paper tally. Both read '41', both add one in their heads, both write '42' — one sale is lost. A lock is a rule that only the person holding the pen may read and write the tally.",
      pitfalls: [
        "'It works on my machine' — races depend on timing and core count. Passing tests prove nothing here.",
        "Assuming a singleton service with a `List` field is safe in ASP.NET Core.",
        "Using `lock` around `await` (not allowed) or locking on `this` or a string."
      ],
      quiz: [
        { q: "Why is `count++` unsafe across threads?", a: ["It is slow", "It is three steps (read, add, write) that can interleave", "`int` is a reference type", "The compiler removes it"], c: 1, why: "Two threads can read the same old value and both write old + 1, losing an update." },
        { q: "Which primitive gives mutual exclusion across an `await`?", a: ["`lock`", "`SemaphoreSlim`", "`volatile`", "`Monitor.Enter`"], c: 1, why: "`SemaphoreSlim.WaitAsync` is awaitable; `lock` cannot contain `await`." },
        { q: "Best strategy for thread safety overall?", a: ["Lock everything", "Avoid shared mutable state where possible", "Use more threads", "Use `static` fields"], c: 1, why: "State that is not shared, or cannot change, cannot race." }
      ]
    },
    {
      id: 'internals', title: 'Variance, reflection, source generators and performance', level: 3, mins: 40,
      why: "This is the layer frameworks are written in. Understanding it explains how DI containers, serializers and EF Core work — and lets you answer the 'how does it actually do that?' questions students eventually ask.",
      points: [
        "**Covariance** (`out T`): an `IEnumerable<Dog>` can be used as `IEnumerable<Animal>` because values only come out. **Contravariance** (`in T`): an `Action<Animal>` can be used as `Action<Dog>` because values only go in.",
        "**Reflection** inspects types at run time — how DI finds constructors and serializers find properties. Flexible but slow, and hostile to trimming and Native AOT.",
        "**Source generators** write code at compile time instead: `System.Text.Json` contexts, `[GeneratedRegex]`, `LoggerMessage`. Same convenience, no run-time reflection.",
        "**Expression trees** represent code as data — how EF Core turns `x => x.Age > 18` into `WHERE Age > 18`.",
        "JIT tiered compilation, inlining and devirtualization mean micro-benchmarks lie unless you use BenchmarkDotNet.",
        "Performance order of operations: algorithm and I/O first, allocations second, micro-optimizations last."
      ],
      code: `
using System.Linq.Expressions;
using System.Text.RegularExpressions;

// Covariance: reading only
IEnumerable<string> names = new List<string> { "a" };
IEnumerable<object> objects = names;          // OK: IEnumerable<out T>

// Contravariance: consuming only
Action<object> printAny = o => Console.WriteLine(o);
Action<string> printString = printAny;        // OK: Action<in T>

// Expression tree: code as data (what EF Core inspects)
Expression<Func<int, bool>> isAdult = age => age >= 18;
Console.WriteLine(isAdult.Body);              // (age >= 18)
Func<int, bool> compiled = isAdult.Compile();

// Source-generated regex: built at compile time, no startup cost
public static partial class Patterns
{
    [GeneratedRegex(@"^\\d{4}-\\d{2}-\\d{2}$")]
    public static partial Regex IsoDate();
}
`,
      practice: "Write a minimal DI container (`Register<TInterface, TImpl>()`, `Resolve<T>()`) using reflection to find constructors and resolve parameters recursively. Then explain what a source-generated container would do differently.",
      teach: "Explain why `IEnumerable<Dog>` can be treated as `IEnumerable<Animal>` but `List<Dog>` cannot be treated as `List<Animal>`.",
      analogy: "A vending machine that only dispenses apples can stand in wherever a 'fruit dispenser' is needed (covariance: output). A bin that accepts any fruit can stand in wherever an 'apple bin' is needed (contravariance: input). A box that both takes and gives must match exactly — otherwise someone puts a banana in the apple box.",
      pitfalls: [
        "Assuming generics are always covariant. `List<T>` is invariant because it both reads and writes `T`.",
        "Using reflection in a hot path without caching.",
        "Trusting a `Stopwatch` loop as a benchmark."
      ],
      quiz: [
        { q: "Why is `List<Dog>` not assignable to `List<Animal>`?", a: ["Lists are sealed", "Someone could then `Add(new Cat())` to a list of dogs", "Dogs are value types", "It is assignable"], c: 1, why: "`List<T>` both produces and consumes `T`, so it must be invariant to stay type-safe." },
        { q: "How does EF Core translate `p => p.Price > 10` to SQL?", a: ["It runs the lambda on every row", "It receives an expression tree and inspects its structure", "It parses the source file", "It uses string matching"], c: 1, why: "`IQueryable` methods take `Expression<Func<…>>`, which is data describing the code." },
        { q: "Main advantage of source generators over reflection?", a: ["They work at run time", "Work moves to compile time: faster startup and AOT-friendly", "They need no compiler", "They allow dynamic typing"], c: 1, why: "Generated code is ordinary compiled code with no run-time discovery cost." }
      ]
    }
  ]
});
