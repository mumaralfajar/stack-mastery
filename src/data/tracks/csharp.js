export const track = {
  id: 'csharp', name: 'C#', lang: 'cs',
  tagline: 'The language: from types and classes to async, memory, and performance.',
  lessons: [
    // ---------------- Beginner ----------------
    {
      id: 'types', title: 'Programs, variables and types', level: 0, mins: 25,
      terms: [
        ['Static typing', 'Every variable has a known type (`int`, `string`, `decimal`) checked at build time before the program runs.'],
        ['`var` (type inference)', 'Lets the compiler infer the exact variable type from the right-hand expression rather than making it dynamic.'],
        ['`decimal` vs `double`', '`decimal` (`0.1m`) uses base-10 arithmetic for money, while `double` uses binary floating point and can round `0.1 + 0.2`.']
      ],
      why: "Every C# program passes typed values through statements. Once you see that the compiler checks types **before** running anything, most beginner errors stop looking random. They're just early warnings that two types don't match.",
      points: [
        "C# compiles to IL (intermediate language), and the .NET runtime (CLR) turns IL into machine code at run time via JIT. `dotnet run` handles both steps.",
        "A variable is a named box with a fixed type: `int`, `double`, `decimal` (money), `bool`, `char`, `string`. The type never changes after declaration.",
        "`var` does not mean 'any type'. The compiler infers the type from the right-hand side and then locks it in.",
        "C# is statically typed: `int x = \"hello\";` fails when you build, not when a user runs the program.",
        "String interpolation `$\"Total: {price * qty}\"` is the everyday way to build text.",
        "Numbers are formatted with your computer's regional settings. On a PC set to Indonesian, `59.97` prints as `59,97`. Use `CultureInfo.InvariantCulture` when text must look the same everywhere: files, APIs, logs.",
        "Integer division truncates: `7 / 2` is `3`. Make one side a `double` or `decimal` to keep the fraction."
      ],
      code: `
// Program.cs — top-level statements, no ceremony needed
using System.Globalization;

string name = "Ana";
int age = 30;
decimal price = 19.99m;      // m = decimal literal, use for money
var qty = 3;                 // inferred as int, still strongly typed

Console.WriteLine($"{name} is {age}");
Console.WriteLine($"Total: {price * qty}");                       // 59.97 (59,97 on an Indonesian PC)
Console.WriteLine((price * qty).ToString(CultureInfo.InvariantCulture));   // always 59.97
Console.WriteLine(7 / 2);                                         // 3  (integer division)
Console.WriteLine(7 / 2.0);                                       // 3.5

// qty = "three";   // compile error: cannot convert string to int
`,
      practice: "Create a console app with `dotnet new console`. Declare your name, birth year and hourly rate, then print one sentence that includes your age and what you earn in a 40-hour week. Then assign some text to your number variable, build, and read the compiler message slowly: it names the line, both types, and what it expected.",
      teach: "Explain to someone who has never programmed what a variable and a type are, and why C# refuses to run `int x = \"hello\"`.",
      analogy: "Variables are labelled jars in a kitchen: a jar marked 'flour' only takes flour. The compiler is the strict chef who checks every jar before cooking starts, so nobody discovers salt in the sugar jar halfway through the recipe.",
      pitfalls: [
        "Treating `var` like JavaScript's `let`. `var x = 1; x = \"a\";` won't compile because `x` stays an `int`.",
        "Using `double` for money. `0.1 + 0.2` prints `0.30000000000000004`, whereas `decimal` (`0.1m + 0.2m`) gives `0.3`.",
        "Expecting `7 / 2` to give `3.5`. Operand types pick integer division before assignment, so `double d = 7 / 2` still yields `3`.",
        "Comparing output with a tutorial and seeing `59,97` instead of `59.97`. That's regional number formatting, not a bug."
      ],
      quiz: [
        { q: "What does `var total = 5;` mean in C#?", a: ["`total` is `dynamic`, so it can hold any type later", "`total` is an `int`, inferred by the compiler", "`total` is an `object` until it is first used", "`total` is a `long`, because `var` picks the largest integer type"], c: 1, why: "`var` is compile-time type inference, so the variable stays an `int` forever." },
        { q: "What does `double d = 9 / 2; Console.WriteLine(d);` print?", a: ["4.5", "4", "5", "It does not compile"], c: 1, why: "`9 / 2` runs integer division before assignment, turning `4` into `4.0`, which prints `4`." },
        { q: "Which type should hold a price?", a: ["`float`", "`double`", "`decimal`", "`string`, to avoid rounding"], c: 2, why: "`decimal` uses base-10 arithmetic so values like 0.10 stay exact, unlike binary floats or unmathable strings." }
      ]
    },
    {
      id: 'flow', title: 'Control flow and methods', level: 0, mins: 30,
      terms: [
        ['Guard clause (early `return`)', 'Handles invalid cases at the top of a method so the main flow stays flat instead of deeply nested.'],
        ['Switch expression', 'Compact form (`score switch { >= 90 => "A", _ => "B" }`) ensuring every branch returns a value.'],
        ['Method signature', "A method's name, return type, and parameter types. Changing any of those spots breaking API changes right away."]
      ],
      why: "Branching, looping, and named methods form the core building blocks of logic. Later topics like LINQ, async, and HTTP handlers are built straight from these pieces.",
      points: [
        "`if / else if / else` branches on a `bool` check (`==` compares values while `=` assigns).",
        "Use `for` when you need the index, `foreach` to iterate a collection, and `while` until a condition stops holding.",
        "Methods group steps with typed parameters and return types (`static int Add(int a, int b) => a + b`).",
        "C# passes arguments **by value** by default, copying numbers directly or copying references to objects. We'll see why that matters next.",
        "`switch` expressions map a value directly to a result in one concise expression.",
        "Keep methods small and name them for what they return or do. Clear naming is your best first documentation."
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
      analogy: "A method is a recipe card: it has a name, a list of ingredients (parameters) and produces a dish (return value). Calling the method is asking someone to cook from the card. You don't rewrite the recipe every time you're hungry.",
      pitfalls: [
        "Off-by-one loops: `i <= array.Length` reads past the end. Arrays start at 0 and end at `Length - 1`.",
        "Typing `if (x = 5)`. C# refuses to compile it unless `x` is a `bool`, which saves you from a classic C bug: `=` assigns, `==` compares.",
        "Expecting a method to change your `int` argument. It changes its own copy unless the parameter is `ref` or `out`."
      ],
      quiz: [
        { q: "Which loop is the best fit for visiting every item of a `List<string>` in order?", a: ["`for (int i = 0; i <= list.Count; i++)`", "`foreach`", "`while (list.Any())`", "`do … while`"], c: 1, why: "`foreach` expresses 'every element' directly and cannot go out of bounds. The `for` loop shown reads one item past the end." },
        { q: "A method `void Reset(int n) { n = 0; }` is called as `Reset(count)`. What is `count` afterwards?", a: ["0", "Unchanged", "It depends on whether `count` was declared with `var`", "A compile error"], c: 1, why: "`int` is passed by value: the method zeroes its own copy." },
        { q: "What does `_` mean in a `switch` expression arm?", a: ["A variable you can read inside the arm", "It matches only `null`", "The default arm that matches anything left", "It repeats the previous arm's result"], c: 2, why: "`_` is the discard pattern. It matches any value not matched by an earlier arm." }
      ]
    },
    {
      id: 'classes', title: 'Classes, objects and properties', level: 0, mins: 35,
      terms: [
        ['Class vs Object', 'A `class` defines the blueprint (`Product`), while an object is one real instance in memory created via `new Product(...)`.'],
        ['Constructor', 'Runs when `new` builds the object so required fields start valid (using primary constructors or `init`).'],
        ['Invariant', 'A rule an object enforces for life, such as rejecting negative prices in its constructor or setter.']
      ],
      why: "C# revolves around objects. ASP.NET Core controllers, EF Core entities, and DTOs are all classes, so reading class definitions fluently unlocks real codebases.",
      points: [
        "A **class** defines a blueprint, and an **object** is one live instance built with `new`.",
        "Properties (`public string Name { get; set; }`) store state, while methods hold behavior.",
        "Constructors make sure objects start valid. Put must-have values in constructor parameters or `required` properties.",
        "**Encapsulation** hides fields as `private` and exposes only safe operations. Using `private set` lets the class guard its own rules.",
        "`static` members belong to the class itself rather than any single instance.",
        "`this` points to the current instance, though C# lets you omit it most of the time."
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
      analogy: "A class is the architectural plan of a house, and objects are houses built from it. Encapsulation works like a front door: visitors ring the bell (public methods) instead of climbing through a window to touch the wiring (private fields).",
      pitfalls: [
        "Calling `BankAccount.Deposit(50)` on the class itself. `Deposit` needs an object: `acct.Deposit(50)`.",
        "Making everything `public` to keep it simple. Then any code anywhere can write `acct.Balance = -500`, and the rule in `Deposit` protects nothing.",
        "Thinking properties are just fields. A property is a pair of methods and can validate or compute."
      ],
      quiz: [
        { q: "What does `public decimal Balance { get; private set; }` allow?", a: ["Anyone can read and write", "Anyone can read, while only code inside the class can write", "Only derived classes can write", "It can be written once, in the constructor only"], c: 1, why: "The getter is public and the setter is private, letting the class guard changes (`{ get; }` alone sets once in the constructor)." },
        { q: "What is the job of a constructor?", a: ["To free the object's memory later", "To put a new object into a valid starting state", "To run every time a property is read", "To copy an existing object"], c: 1, why: "Constructors run once at creation and establish the object's rules from the start." },
        { q: "A `static` method…", a: ["belongs to each object separately", "belongs to the class and needs no instance", "can only be called once", "runs automatically at startup"], c: 1, why: "Static members are called on the type itself, for example `Math.Max(1, 2)`." }
      ]
    },
    // ---------------- Intermediate ----------------
    {
      id: 'memory', title: 'Value types vs reference types', level: 1, mins: 30, viz: 'stackheap',
      terms: [
        ['Value type (`struct`, `int`)', 'Assignment copies the entire value (`b = a`), so modifying `b` leaves `a` untouched.'],
        ['Reference type (`class`)', 'The variable holds a memory address pointing to the heap object, so copying it copies the pointer rather than cloning the object.'],
        ['Immutability', 'Marking properties `init`-only or creating new copies (`with`) so shared references can never mutate by surprise.']
      ],
      predict: {
        prompt: 'Suppose `p1 = new Person("Ana")`, `p2 = p1`, and then `p2.Name = "Budi"`. What does `Console.WriteLine(p1.Name)` print?',
        options: ['`Ana` (`p2` received a separate copy)', '`Budi` (both variables point to the same heap object)', 'Compiler error on re-assignment'],
        answer: 1,
        explain: 'Because `Person` is a `class` (reference type), `p2 = p1` copied the reference address, not the object. Mutating `p2.Name` mutates the single shared instance.'
      },
      why: "'I changed one variable and the other one changed too' is one of the first confusing bugs you will hit in C#. The answer is value versus reference semantics, and once it clicks it stays clicked.",
      points: [
        "**Value types** (`int`, `bool`, `decimal`, `DateTime`, structs, enums) store data directly, so assignment copies the value.",
        "**Reference types** (`class`, `string`, arrays, `List<T>`) store a reference to a heap object, so assignment gives two variables pointing to one object.",
        "Local variables sit in a method's stack frame, while `new` class instances sit on the managed heap until the garbage collector frees them.",
        "`string` is an **immutable** reference type, so in everyday code it behaves like a value: changing text returns a brand-new string.",
        "`==` compares references on classes unless overridden (like `string` and `record`). Custom structs lack `==` until you define it, though `Equals` compares fields.",
        "`null` means a reference points nowhere. Value types can't be null unless marked nullable like `int?`."
      ],
      code: `
int a = 5;
int b = a;          // copies the value
b = 9;
Console.WriteLine($"a = {a}, b = {b}");   // a = 5, b = 9

var p1 = new Person { Name = "Ana" };
var p2 = p1;        // copies the REFERENCE
p2.Name = "Budi";
Console.WriteLine(p1.Name);               // Budi — same object

Rename(p1);
Console.WriteLine(p1.Name);               // Citra — the method changed the shared object
Replace(p1);
Console.WriteLine(p1.Name);               // still Citra — only the method's copy was rebound

static void Rename(Person p) => p.Name = "Citra";
static void Replace(Person p) => p = new Person { Name = "Dewi" };

class Person { public string Name { get; set; } = ""; }
`,
      practice: "Predict, then run: create a `struct Point { public int X; }` and a `class PointC { public int X; }`. Assign each to a second variable, change `X` on the second, and print both. Explain the two different results.",
      teach: "Explain why `p2.Name = \"Budi\"` also changed `p1.Name`, but `b = 9` did not change `a`.",
      analogy: "A value type is a sheet of paper: photocopy it and scribbling on the copy leaves the original untouched. A reference type is a link to a shared online document: giving a friend the link means their edits appear on your screen too.",
      pitfalls: [
        "'Value types on stack, reference types on heap' is only a rough rule, since a struct inside a class sits on the heap. Think copy versus share first.",
        "Thinking passing a class instance into a method clones it. Only the reference is copied.",
        "Expecting `Replace(p1)` to swap the caller's variable. Without `ref`, only the parameter's local reference changes."
      ],
      quiz: [
        { q: "After `var x = new List<int>{1}; var y = x; y.Add(2);` how many items does `x` have?", a: ["1, because `y` is a copy", "2", "0", "It does not compile"], c: 1, why: "`List<T>` is a reference type, so `x` and `y` point to the exact same list." },
        { q: "Which of these is a value type?", a: ["`string`", "`int[]`", "`DateTime`", "`List<int>`"], c: 2, why: "`DateTime` is a struct, while `string`, `List<T>`, and even `int[]` arrays are reference types." },
        { q: "Why does `string` feel like a value type?", a: ["It is stored on the stack", "It is immutable and `==` compares characters", "It is a struct", "The compiler copies it on every assignment"], c: 1, why: "Strings live on the heap, yet immutability plus value-based `==` makes them act like values." }
      ]
    },
    {
      id: 'interfaces', title: 'Interfaces, inheritance and polymorphism', level: 1, mins: 35,
      terms: [
        ['Interface (`IPayment`)', 'A contract listing *what* a type supports without dictating *how*, letting unit tests swap live calls for fakes.'],
        ['Polymorphism', 'Calling `.Charge(...)` through an `IPayment` reference so each concrete class runs its own implementation.'],
        ['Composition over inheritance', 'Holding helper dependencies (`class OrderService(IPayment pay)`) instead of building brittle base-class trees.']
      ],
      why: "ASP.NET Core relies on interfaces everywhere (`ILogger<T>`, `IServiceCollection`, `IConfiguration`). Dependency injection and testable architecture click once interfaces make sense.",
      points: [
        "An **interface** acts as a pure contract of methods and properties with no instance state.",
        "**Polymorphism** lets code written for `INotifier` work automatically with any future implementation.",
        "Inheritance (`class Dog : Animal`) shares base code. Mark methods `virtual` when subclasses may `override` them, or `abstract` when they must.",
        "A class can inherit from one base class while implementing as many interfaces as needed.",
        "Favor **composition and small interfaces** over deep inheritance trees that lock subclasses to parent details."
      ],
      code: `
// Interfaces: one service, any notifier
INotifier[] channels = [new EmailNotifier(), new SmsNotifier()];
foreach (var channel in channels)
    new OrderService(channel).Place("Ana");      // Email to Ana: … / SMS to Ana: …

// Inheritance: shared code in the base class, specifics in subclasses
Animal[] pets = [new Dog(), new Cat()];
foreach (var pet in pets)
    Console.WriteLine($"{pet.Name} {pet.Move()} and says {pet.Speak()}");
// Dog walks and says Woof
// Cat sneaks and says Meow

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

public abstract class Animal
{
    public string Name => GetType().Name;        // shared by every animal
    public abstract string Speak();              // every subclass must provide this
    public virtual string Move() => "walks";     // subclasses may change this
}

public class Dog : Animal
{
    public override string Speak() => "Woof";
}

public class Cat : Animal
{
    public override string Speak() => "Meow";
    public override string Move() => "sneaks";
}
`,
      practice: "Add a `FakeNotifier` that records messages in a `List<string>` instead of sending them. Use it to check that `OrderService.Place` sends exactly one message. That fake is a test double, the basis of unit testing. Then add a `Bird` that overrides `Move`, and try writing `new` instead of `override` to see what changes.",
      teach: "Explain what an interface is and why `OrderService` asks for an `INotifier` instead of creating an `EmailNotifier` itself.",
      analogy: "An interface works like a wall socket. A lamp doesn't care if power comes from solar panels or a turbine as long as the plug fits. Swap the power plant and the lamp stays lit.",
      pitfalls: [
        "Creating an interface for every class by reflex. An interface earns its place when there are, or will be, several implementations or a test double.",
        "Writing `new` instead of `override` on a method. It compiles (with a warning), but code holding an `Animal` reference still calls the base version.",
        "Using inheritance just to reuse code between unrelated things. 'Is-a' must be true everywhere the base type is used."
      ],
      quiz: [
        { q: "How many interfaces can one C# class implement?", a: ["One", "Up to two", "Any number", "None, if it already has a base class"], c: 2, why: "A class has at most one base class, but can implement any number of interfaces." },
        { q: "What must a base method be marked with for `override` to work?", a: ["`static`", "`virtual` or `abstract`", "`sealed`", "`public` is enough"], c: 1, why: "Only virtual, abstract or already-overridden members can be overridden. Being public is not enough." },
        { q: "The main benefit of `OrderService(INotifier notifier)` over `new EmailNotifier()` inside the class is…", a: ["It makes calls faster", "The dependency can be swapped or faked without changing `OrderService`", "`OrderService` no longer needs a constructor", "It stops `OrderService` from being inherited"], c: 1, why: "Depending on an abstraction decouples the class from a concrete implementation. That is the basis of DI and testing." }
      ]
    },
    {
      id: 'generics', title: 'Collections and generics', level: 1, mins: 30,
      terms: [
        ['`List<T>` vs `Dictionary<K,V>` vs `HashSet<T>`', '`List` looks up by index, while `Dictionary` and `HashSet` use hashes for fast O(1) key lookups and uniqueness checks.'],
        ['Generic parameter `<T>`', 'A type placeholder resolved at compile time so `Repository<Product>` stays strongly typed with zero boxing.'],
        ['`IEnumerable<T>`', 'A forward-only sequence supporting loops and LINQ queries without forcing callers to pass a `List`.']
      ],
      why: "Most of a real program is collections of things. Choosing between `List`, `Dictionary` and `HashSet` is usually the first performance decision you make, often without noticing.",
      points: [
        "`List<T>`: ordered, indexable, grows automatically. Finding an item by value is O(n).",
        "`Dictionary<TKey, TValue>`: key to value in O(1) on average. Use `TryGetValue` instead of catching exceptions.",
        "`HashSet<T>`: unique items with fast `Contains`. `Queue<T>` and `Stack<T>` for first-in-first-out and last-in-first-out.",
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
    Console.WriteLine($"apples: {count}");        // apples: 10

var seen = new HashSet<string>();
foreach (var word in new[] { "a", "b", "a" })
    if (!seen.Add(word)) Console.WriteLine($"duplicate: {word}");   // duplicate: a

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
      analogy: "A `List` is a queue of people: to find Budi you ask each person in turn. A `Dictionary` is a coat check: you hand over ticket 42 and the attendant walks straight to hook 42.",
      pitfalls: [
        "Calling `list.Contains()` inside an outer loop creates hidden O(n²) scans. Convert one side to a `HashSet` first.",
        "Reading `dict[key]` on a missing key and hitting a `KeyNotFoundException`.",
        "Modifying a list during `foreach` throws `InvalidOperationException`. Iterate over a copy (`list.ToList()`) or queue edits until the loop finishes."
      ],
      quiz: [
        { q: "You need to check thousands of times whether an ID has been seen. Best choice?", a: ["`List<int>` with `Contains`", "`int[]` searched with a loop", "`HashSet<int>`", "`Queue<int>`"], c: 2, why: "`HashSet.Contains` runs in O(1) average time, while scanning lists or arrays takes O(n)." },
        { q: "What does `where T : new()` require?", a: ["T is a value type", "T has a public parameterless constructor", "T was created with `new` before being passed in", "T implements `ICloneable`"], c: 1, why: "The `new()` constraint lets generic methods instantiate `new T()`." },
        { q: "Best way to read a dictionary key that may be missing?", a: ["`dict[key]` inside a try/catch", "`dict.TryGetValue(key, out var v)`", "`dict.ContainsKey(key)`, then `dict[key]`", "`dict.Keys.First(k => k == key)`"], c: 1, why: "`TryGetValue` performs a single lookup. Checking `ContainsKey` first searches twice, and try/catch hides control flow." }
      ]
    },
    {
      id: 'errors', title: 'Exceptions and cleanup', level: 1, mins: 30,
      terms: [
        ['`using` / `IDisposable`', 'Closes files, sockets, and database connections deterministically even if an exception fires mid-method.'],
        ['Exception filter / catch order', 'Catch specific exceptions (`FileNotFoundException`) where you can recover rather than swallowing bare `Exception` everywhere.'],
        ['Result pattern vs Exceptions', 'Return validation errors as normal values (`Result` or 400/404), saving exceptions for unexpected failures.']
      ],
      why: "Files go missing, sockets break, and users submit bad text. Good error handling decides whether failures produce clear logs or leave half-written state behind.",
      points: [
        "Throwing unwinds the call stack until a matching `catch` stops it. Uncaught exceptions terminate the process with a stack trace.",
        "Catch only where you can act (retry, fall back, or translate errors). In ASP.NET Core, unhandled exceptions become logged 500 responses.",
        "Order specific exceptions (`FileNotFoundException`, `FormatException`) ahead of general ones, and avoid empty `catch { }` blocks.",
        "Use `throw` inside `catch` to preserve the original stack trace. Writing `throw ex` overwrites where the error actually started.",
        "`finally` always runs after normal returns or exceptions. `using` compiles down to `finally { resource.Dispose(); }` automatically.",
        "Save exceptions for unexpected errors. Use `TryParse` or `Result` return values for predictable validation issues."
      ],
      code: `
Console.WriteLine(ReadFirstLine("missing.txt"));   // (no file: missing.txt)

File.WriteAllText("notes.txt", "first line\\nsecond line");
Console.WriteLine(ReadFirstLine("notes.txt"));     // first line
File.Delete("notes.txt");

// An expected failure needs no exception
Console.WriteLine(int.TryParse("12a", out int n) ? n : -1);   // -1

try
{
    ParseAge("abc");
}
catch (ArgumentException ex)
{
    Console.WriteLine($"Rejected: {ex.Message}");       // Rejected: 'abc' is not an age
    Console.WriteLine(ex.InnerException?.GetType().Name);   // FormatException
}

static string ReadFirstLine(string path)
{
    try
    {
        using var reader = File.OpenText(path);   // Dispose() runs even if ReadLine throws
        return reader.ReadLine() ?? "(empty file)";
    }
    catch (FileNotFoundException)
    {
        return $"(no file: {path})";
    }
    // Other IO errors are not handled here, so they travel up to the caller
}

static int ParseAge(string text)
{
    try
    {
        return int.Parse(text);
    }
    catch (FormatException ex)
    {
        // Add meaning, and keep the original as InnerException
        throw new ArgumentException($"'{text}' is not an age", ex);
    }
}
`,
      practice: "Read integers line by line from a text file and sum them. Decide how a missing file, a blank line, and `12a` should behave, then force a read failure to verify `Dispose()` still executes.",
      teach: "Explain when to catch an exception versus letting it bubble up, using `ReadFirstLine` and `ParseAge`.",
      analogy: "An exception acts like a fire alarm ringing up the building until someone trained answers it (`catch`). Swallowing it with an empty `catch` is like pulling the alarm's battery out.",
      pitfalls: [
        "Writing an empty `catch (Exception) { }`, leaving state corrupted with zero trace in logs.",
        "Rethrowing `throw ex` instead of `throw`, wiping out the original failing line from the stack trace.",
        "Wrapping every helper method in `try/catch` 'just to be safe' instead of letting callers or global handlers catch.",
        "Throwing exceptions for expected outcomes like invalid form text or missing records."
      ],
      quiz: [
        { q: "Inside a `catch`, how does `throw;` differ from `throw ex;`?", a: ["They are the same", "`throw;` rethrows and keeps the original stack trace", "`throw;` swallows the exception", "`throw;` throws a new `Exception` with no message"], c: 1, why: "`throw ex;` resets the stack trace to the catch block, whereas `throw;` preserves the real origin." },
        { q: "When does a `finally` block run?", a: ["Only when an exception was thrown", "Only when no exception was thrown", "Always: on success, on an exception, and after `return`", "Only if there is no `catch` block"], c: 2, why: "That guarantee is what makes `finally`, and `using`, safe for cleanup." },
        { q: "A user types `12a` into an age field. Better way to handle it?", a: ["`int.Parse` inside a try/catch", "`int.TryParse`, then show a validation message if it returns `false`", "Let the exception reach the global error handler", "`Convert.ToInt32` inside an empty catch"], c: 1, why: "Bad input is expected, not exceptional. `TryParse` reports it without the cost and noise of an exception." },
        { q: "What does `using var conn = new SqlConnection(cs);` guarantee?", a: ["The connection stays open until the program exits", "`Dispose()` is called when the scope ends, even on an exception", "The connection opens automatically", "The connection is shared by every thread"], c: 1, why: "`using` compiles to try/finally with `Dispose()` in the `finally` block." }
      ]
    },
    {
      id: 'linq', title: 'LINQ: querying anything', level: 1, mins: 35, viz: 'linq',
      terms: [
        ['Deferred execution', 'Operators like `Where` and `Select` only build a recipe. Nothing executes until `.ToList()`, `.First()`, or `foreach` iterates it.'],
        ['`IEnumerable<T>` vs `IQueryable<T>`', '`IEnumerable` runs lambdas over objects in memory, whereas `IQueryable` keeps an expression tree EF Core translates into SQL.'],
        ['`Any()` vs `Count() > 0`', '`Any()` stops on the first matching item (`EXISTS` in SQL), while `Count()` may count every row unnecessarily.']
      ],
      why: "LINQ is how C# code filters, transforms and summarises data: in memory and, through EF Core, in SQL. It is the bridge between this track and the SQL track.",
      points: [
        "LINQ provides extension methods on `IEnumerable<T>` like `Where` (filter), `Select` (map), `OrderBy` (sort), and `GroupBy` (group).",
        "Lambdas such as `x => x.Price > 10` act as compact inline functions passed right into operators.",
        "With **deferred execution**, defining a query moves zero items. It runs only when enumerated via `foreach`, `ToList()`, `Count()`, or `First()`.",
        "Enumerating a query twice runs it twice, so materialize once with `ToList()` if you'll read the items multiple times.",
        "`First()` throws on empty sequences, `FirstOrDefault()` returns `null` or `default`, and `Single()` insists on one exact match.",
        "On EF Core's `IQueryable<T>`, those same operators compile into SQL queries rather than C# loops."
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

foreach (var name in cheapTech) Console.WriteLine(name);   // runs here: Mouse

var byCategory = products
    .GroupBy(p => p.Category)
    .Select(g => new { Category = g.Key, Total = g.Sum(p => p.Price), Count = g.Count() });

foreach (var c in byCategory) Console.WriteLine($"{c.Category}: {c.Count} items, {c.Total}");
// Tech: 2 items, 1225
// Home: 2 items, 340

record Product(string Name, string Category, decimal Price);
`,
      practice: "From a list of orders (customer, amount, date), use LINQ to find each customer's total spend, sorted high to low, top three only. Then put a `Console.WriteLine` inside a `Where` lambda and watch exactly when it prints.",
      teach: "Explain deferred execution: why does a LINQ query with `Where` and `Select` do no work until `foreach` or `ToList()`?",
      analogy: "A LINQ query is a set of instructions pinned above an assembly line: 'keep the red ones, paint them, box the first three'. Writing the instructions moves no boxes. The line only starts when someone stands at the end and asks for a product.",
      pitfalls: [
        "Enumerating the same query twice and running an expensive step, or a database call, twice.",
        "Writing `Count() > 0` to ask 'is there any?'. On a plain sequence `Count()` walks everything while `Any()` stops at the first item. On a `List` it barely matters, but `Any()` says what you mean, and in EF Core it becomes a cheaper `EXISTS` query.",
        "Calling `ToList()` in the middle of an EF Core query and quietly pulling the whole table into memory."
      ],
      quiz: [
        { q: "When does `var q = items.Where(x => x > 5);` filter the items?", a: ["Immediately, when the line runs", "When `q` is enumerated", "When the method returns", "The first time `q` is assigned to another variable"], c: 1, why: "LINQ queries evaluate lazily when you enumerate them." },
        { q: "Which call throws if the sequence is empty?", a: ["`FirstOrDefault()`", "`Any()`", "`First()`", "`Where()`"], c: 2, why: "`First()` requires at least one element." },
        { q: "Best way to ask 'is there at least one match?'", a: ["`Count() > 0`", "`Any()`", "`ToList().Count > 0`", "`FirstOrDefault() != null`"], c: 1, why: "`Any()` stops at the first match. `FirstOrDefault() != null` is wrong for value types, where the default is `0`, not `null`." }
      ]
    },
    // ---------------- Advanced ----------------
    {
      id: 'delegates', title: 'Delegates, lambdas and events', level: 2, mins: 30,
      terms: [
        ['Delegate (`Func<>` / `Action<>`)', 'A strongly typed function reference (`Func<int, bool>` takes an `int` and returns `bool`, while `Action` returns void).'],
        ['Lambda (`x => x * 2`)', 'An inline anonymous function passed straight into LINQ, middleware, or event handlers.'],
        ['Closure capture', 'A lambda keeping live access to outer variables. Watch out for mutated loop counters or objects kept alive in memory.']
      ],
      why: "Passing functions as arguments powers LINQ, middleware, and Minimal APIs. Once signatures like `Func<T, bool>` feel natural, framework code becomes easy to read.",
      points: [
        "A **delegate** defines a typed slot for a method, like 'takes an `int` and returns a `bool`'.",
        "`Func<T, TResult>` returns a value, `Action<T>` returns nothing, and `Predicate<T>` returns `bool`. You rarely need custom delegate types.",
        "A **lambda** (`x => x * 2`) writes a function inline. Using outer variables turns it into a **closure** holding live references, not copied snapshots.",
        "**Extension methods** (`this` on the first parameter) attach helpers to existing types, and `yield return` streams results lazily like LINQ does.",
        "An **event** wraps a delegate so callers can only attach (`+=`) or detach (`-=`). Failing to unsubscribe leaks short-lived listeners on long-lived publishers.",
        "`app.MapGet(\"/\", () => \"hi\")` passes a lambda straight into ASP.NET Core's router."
      ],
      code: `
Func<int, int> twice = x => x * 2;
Action<string> log = msg => Console.WriteLine($"[log] {msg}");
log(twice(21).ToString());                      // [log] 42

// Behavior passed in: KeepIf decides nothing, the lambda does
int[] numbers = [1, 2, 3, 4, 5, 6];
foreach (var even in numbers.KeepIf(x => x % 2 == 0))
    Console.Write($"{even} ");                  // 2 4 6
Console.WriteLine();

// Closure: the lambda captures the variable itself
int count = 0;
Action bump = () => count++;
bump(); bump();
Console.WriteLine(count);                       // 2

// Event: subscribe with +=, unsubscribe with -=
var thermostat = new Thermostat();
Action<double> alert = c => Console.WriteLine($"Too hot: {c}");
thermostat.TooHot += alert;
thermostat.Read(25);                            // (nothing)
thermostat.Read(34);                            // Too hot: 34
thermostat.TooHot -= alert;
thermostat.Read(40);                            // (nothing: unsubscribed)

public static class SequenceExtensions
{
    // 'this' makes it an extension method; 'yield return' produces items lazily, one at a time
    public static IEnumerable<T> KeepIf<T>(this IEnumerable<T> items, Func<T, bool> keep)
    {
        foreach (var item in items)
            if (keep(item)) yield return item;
    }
}

public class Thermostat
{
    public event Action<double>? TooHot;
    public void Read(double celsius) { if (celsius > 30) TooHot?.Invoke(celsius); }
}
`,
      practice: "Add a `Transform` extension method next to `KeepIf` (your own `Select`, using `Func<T, TResult>` and `yield return`) and chain the two. Put a `Console.WriteLine` inside each one and watch items flow through one at a time. You have rebuilt the core of LINQ.",
      teach: "Explain what it means that a lambda 'captures' a variable, using the `count` example.",
      analogy: "A delegate is a phone number written on a card. You can hand the card to someone else and they can call it later without knowing who answers. An event is a mailing list: anyone may sign up or leave, but only the owner sends the newsletter.",
      pitfalls: [
        "Thinking a closure copies the value. It shares the variable, so later changes are visible to the lambda.",
        "A long-lived publisher holding short-lived subscribers through events they never left. They can't be garbage-collected.",
        "Declaring custom delegate types where `Func` or `Action` would do."
      ],
      quiz: [
        { q: "Which type describes a method taking a `string` and returning an `int`?", a: ["`Action<string, int>`", "`Func<string, int>`", "`Func<int, string>`", "`Predicate<string>`"], c: 1, why: "In `Func`, the last type argument is the return type." },
        { q: "`int n = 1; Func<int> f = () => n; n = 5;` What does `f()` return?", a: ["1", "5", "0", "It throws"], c: 1, why: "The closure captured the variable `n`, not its value at the time the lambda was created." },
        { q: "What can code outside a class do with its public `event`?", a: ["Invoke it", "Replace all subscribers with `=`", "Subscribe and unsubscribe only", "Read its subscriber list"], c: 2, why: "Events restrict outsiders to `+=` and `-=`. Only the owning class can raise the event." }
      ]
    },
    {
      id: 'async', title: 'async, await and Tasks', level: 2, mins: 40, viz: 'async',
      terms: [
        ['Non-blocking I/O (`await`)', 'Hands the thread back to ASP.NET Core while waiting for SQL/HTTP, letting one thread pool serve thousands of concurrent requests.'],
        ['`Task.WhenAll(...)`', 'Awaits multiple independent async operations concurrently instead of running them one-by-one.'],
        ['`CancellationToken`', 'Propagates client disconnects or timeouts so abandoned DB queries stop wasting server work.']
      ],
      predict: {
        prompt: 'An endpoint calls two independent 200 ms queries: `await db.GetUserAsync(); await db.GetOrdersAsync();` versus starting both and awaiting `Task.WhenAll(u, o)`. Roughly how fast is the sequential vs parallel version?',
        options: ['Both take ~200 ms because both use `await`', 'Sequential takes ~400 ms, while `Task.WhenAll` takes ~200 ms', 'Parallel fails unless you open two processes'],
        answer: 1,
        explain: 'Writing two `await` calls back to back pauses for the first query before starting the second (~400 ms total). Launching both tasks first with `Task.WhenAll` overlaps both waits (~200 ms).'
      },
      why: "Web servers spend most of their time waiting on databases, APIs, or disks. Async code frees threads to handle other requests during those waits instead of starving the pool and timing out under load.",
      points: [
        "A `Task` represents an ongoing operation, while `Task<T>` produces a result when it completes.",
        "`await` doesn't block a thread. It attaches a continuation for later and frees the thread right away.",
        "Async keeps threads from idling on I/O (SQL, HTTP, disk), though one query won't finish faster on its own.",
        "Go async end-to-end and avoid `.Result` or `.Wait()`, which tie up ASP.NET Core pool threads and cause thread-pool starvation (or deadlocks on UI threads).",
        "Kick off independent tasks first and await `Task.WhenAll(...)` so their waits overlap without extra threads.",
        "Save `async void` only for UI event handlers, since callers can't await it or catch its exceptions.",
        "Thread `CancellationToken` through async methods so canceled HTTP requests abort DB queries immediately.",
        "`IAsyncEnumerable<T>` yields items asynchronously with `yield return` and reads them with `await foreach`, streaming big EF Core results without buffering everything in RAM."
      ],
      code: `
using System.Diagnostics;
using System.Runtime.CompilerServices;

var cts = new CancellationTokenSource();
var sw = Stopwatch.StartNew();

// Sequential: about 1 + 1 = 2 seconds
var orders = await LoadAsync("orders", cts.Token);
var customers = await LoadAsync("customers", cts.Token);
Console.WriteLine($"one by one: {sw.ElapsedMilliseconds} ms");   // ~2000 ms

// Concurrent: start both, then wait for both — about 1 second
sw.Restart();
Task<string> ta = LoadAsync("orders", cts.Token);
Task<string> tb = LoadAsync("customers", cts.Token);
string[] both = await Task.WhenAll(ta, tb);
Console.WriteLine($"together: {sw.ElapsedMilliseconds} ms");     // ~1000 ms

// Cancellation: stop work nobody needs any more
cts.CancelAfter(200);
try { await LoadAsync("reports", cts.Token); }
catch (OperationCanceledException) { Console.WriteLine("reports: cancelled"); }

// Don't: var s = LoadAsync("orders", cts.Token).Result;   // blocks a thread for the whole wait

// Streaming: each page is printed as soon as it arrives, not after all of them
await foreach (string page in LoadPagesAsync(3))
    Console.WriteLine(page);                                   // page 1, page 2, page 3

// Stands in for a database query or an HTTP call. With HttpClient it would be
// await http.GetStringAsync(url, ct): same shape, same rules.
static async Task<string> LoadAsync(string what, CancellationToken ct)
{
    await Task.Delay(1000, ct);    // no thread is used while waiting
    return $"{what} loaded";
}

// async + yield return = an async stream. [EnumeratorCancellation] lets
// await foreach (... in LoadPagesAsync(3).WithCancellation(ct)) pass a token in.
static async IAsyncEnumerable<string> LoadPagesAsync(int count, [EnumeratorCancellation] CancellationToken ct = default)
{
    for (int i = 1; i <= count; i++)
    {
        await Task.Delay(100, ct);    // fetch the next page
        yield return $"page {i}";
    }
}
`,
      practice: "Change the code to load five things concurrently with `Task.WhenAll` and print the total time. Then cancel after 500 ms and check that every unfinished load stops. Finally, replace `Task.Delay` with a real `HttpClient.GetStringAsync` call to a public URL and check that the timings behave the same way.",
      teach: "Explain what happens to the thread when code reaches `await`, and why that lets a web server handle more requests.",
      analogy: "Think of a waiter handing your ticket to the kitchen. Instead of staring at the stove until cooked, the waiter serves other tables until the bell rings (`await`). Blocking with `.Result` stalls that waiter at the stove while the dining room backs up.",
      pitfalls: [
        "Believing async magically runs I/O on extra threads. While waiting on a socket or database, no thread is needed.",
        "Wrapping CPU loops in `Task.Run` inside ASP.NET Core, which only moves blocking work onto another pool thread.",
        "Forgetting `await` lets the caller continue early and drops unhandled exceptions. Fix every CS4014 compiler warning.",
        "Calling `ToListAsync()` on huge exports just to loop once instead of streaming rows via `AsAsyncEnumerable()`."
      ],
      quiz: [
        { q: "What happens to the current thread at `await http.GetAsync(url)` while the network call is in flight?", a: ["It sleeps until the response arrives", "It is released to do other work", "It polls the network in a loop", "It hands the request to a new thread it creates"], c: 1, why: "`await` returns the thread to the pool and resumes the method via a continuation once data arrives." },
        { q: "Three independent 1-second I/O calls. Fastest correct approach?", a: ["Await each in turn", "Start all three, then `await Task.WhenAll`", "Wrap each in `Task.Run` and read `.Result`", "`Parallel.For` with `.Wait()` on each"], c: 1, why: "Starting the tasks before awaiting lets the waits overlap: about 1 second in total instead of 3, without blocking any thread." },
        { q: "Why avoid `.Result` in ASP.NET Core?", a: ["It returns a different value from `await`", "It blocks a thread-pool thread for the whole wait, and under load the pool runs out", "It always deadlocks", "It is not allowed inside controllers"], c: 1, why: "ASP.NET Core has no synchronization context, so the classic deadlock doesn't happen there. But every blocked thread is one that can't serve another request." },
        { q: "A method returns `IAsyncEnumerable<Order>`. How do you consume it?", a: ["`foreach (var o in GetOrders())`", "`await foreach (var o in GetOrders())`", "`GetOrders().Result`", "`await Task.WhenAll(GetOrders())`"], c: 1, why: "`await foreach` awaits each next item, so the loop can start before the last item exists. A plain `foreach` doesn't compile against an async stream." }
      ]
    },
    {
      id: 'modern', title: 'Null safety, records and patterns', level: 2, mins: 30,
      terms: [
        ['Nullable reference types (`string?`)', 'Compiler flow analysis warns before you dereference a variable that might be `null`.'],
        ['`record`', 'Compact immutable data class with automatic value-based equality (`a == b` compares fields, not references) and `with` copying.'],
        ['Pattern matching', 'Declarative branching on type and shape (`is Order { Total: > 100 } o`) checked for exhaustiveness by the compiler.']
      ],
      why: "Modern C# lets the compiler catch whole categories of bugs before you run anything: null references, unhandled shapes of data, accidental mutation. Code that uses these features well is shorter and harder to break.",
      points: [
        "New projects turn on **nullable reference types** by default. `string` expects non-null values, while `string?` warns you to check before dereferencing.",
        "`?.` (null-conditional), `??` (fallback), and `??=` (assign if null) handle optional values concisely.",
        "`!` (null-forgiving) silences compiler warnings without adding runtime guards. Avoid it unless you know a value can't be null, or `NullReferenceException` waits right there.",
        "**Records** provide built-in value equality, immutability, and `with` expressions, ideal for DTOs and events.",
        "**Pattern matching** (`is` and `switch` with property or relational checks) replaces clumsy cast chains and pairs nicely with record hierarchies."
      ],
      code: `
Console.WriteLine(Describe(new Card("4242")));            // Card ending 4242
Console.WriteLine(Describe(new Transfer("ID12BANK")));    // Domestic transfer
Console.WriteLine(Describe(new Transfer("DE89BANK")));    // International transfer

var price = new Money(10, "USD");
var sale = price with { Amount = 8 };                      // non-destructive copy
Console.WriteLine(sale);                                   // Money { Amount = 8, Currency = USD }
Console.WriteLine(price == new Money(10, "USD"));          // True: value equality

string? nickname = null;
Console.WriteLine(nickname?.Length ?? 0);                  // 0, no NullReferenceException
nickname ??= "Ana";
Console.WriteLine(nickname.Length);                        // 3: the compiler knows it isn't null now

static string Describe(Payment p) => p switch
{
    Card { Last4: var digits }              => $"Card ending {digits}",
    Transfer t when t.Iban.StartsWith("ID") => "Domestic transfer",
    Transfer                                => "International transfer",
    _ => throw new ArgumentOutOfRangeException(nameof(p))
};

public record Money(decimal Amount, string Currency);

public abstract record Payment;
public record Card(string Last4) : Payment;
public record Transfer(string Iban) : Payment;
`,
      practice: "Model a `Shape` hierarchy with records (`Circle`, `Rect`, `Triangle`) and write one `Area` method using a `switch` expression. Then build your project and fix every nullable warning without using the `!` operator.",
      teach: "Explain the difference between `string` and `string?` and how that changes what the compiler checks for you.",
      analogy: "Nullable annotations are labels on boxes: 'always contains something' or 'might be empty, look before reaching in'. The compiler reads the labels and stops you reaching into a box you haven't checked.",
      pitfalls: [
        "Silencing nullable warnings with `!` instead of fixing the cause.",
        "Thinking `record` only means 'shorter class'. The point is value equality and immutability.",
        "Giving a record `{ get; set; }` properties and changing it while it is a dictionary key or in a `HashSet`. Its hash changes and lookups stop finding it."
      ],
      quiz: [
        { q: "What does `a?.B ?? c` evaluate to when `a` is null?", a: ["It throws a `NullReferenceException`", "`null`", "`c`", "`default(B)`"], c: 2, why: "`a?.B` gives null, and `??` supplies the fallback `c`." },
        { q: "Two records with identical property values compared with `==` are…", a: ["never equal unless they are the same instance", "equal", "equal only if one was created with `with`", "a compile error"], c: 1, why: "Records implement value-based equality." },
        { q: "What does `string? name` tell the compiler?", a: ["`name` is optional and can be left out of a call", "`name` might be null, so warn me before I use it unchecked", "`name` is a nullable value type", "`name` will be checked for null at run time automatically"], c: 1, why: "Nullable annotations are compile-time only. They change the warnings you get, not what happens at run time." }
      ]
    },
    // ---------------- Expert ----------------
    {
      id: 'gc', title: 'Memory, the GC and performance', level: 3, mins: 40,
      terms: [
        ['Generations (Gen 0 / 1 / 2)', 'Short-lived objects clear cheaply in Gen 0, while survivors move to heavier Gen 2 / LOH collections.'],
        ['`Span<T>`', 'A stack-only view over contiguous memory (array, slice, or string) allowing parsing with zero heap allocations.'],
        ['Boxing', 'Wrapping a value type (`int`) inside an `object` on the heap, creating hidden allocations in non-generic collections or `string.Format`.']
      ],
      why: "Under heavy load, high allocation rates directly add tail latency. Learn how the garbage collector works, spot costly hot-path allocations, and trim them without hurting code clarity.",
      points: [
        ".NET's GC is **generational**. New allocations start in Gen 0 where short-lived objects clear cheaply, while survivors move up to Gen 1 and Gen 2.",
        "Allocations over ~85 KB land on the **Large Object Heap**, which collects only alongside Gen 2 without compaction by default, making large temporary buffers costly.",
        "Avoid Gen 2 pauses on hot loops by renting buffers (`ArrayPool<T>`) and cutting string concatenation or LINQ churn.",
        "`Span<T>` and `ReadOnlySpan<T>` slice arrays and strings with **zero allocations**. As `ref struct` types, they stay off the heap and can't cross an `await`.",
        "`Memory<T>` provides the heap-safe equivalent of `Span<T>` when passing buffers through async calls.",
        "Fix performance in order: algorithms and database I/O first (cutting N+1 queries beats everything), allocations next, micro-tweaks last.",
        "Measure with `dotnet-counters`, `dotnet-trace`, and BenchmarkDotNet's `[MemoryDiagnoser]`. Avoid naive `Stopwatch` loops, which tiered JIT compilation skews."
      ],
      code: `
using System.Buffers;

Console.WriteLine(SumSlow("1,2,3,40"));   // 46
Console.WriteLine(SumFast("1,2,3,40"));   // 46: same result, no new strings

// Allocates an array plus a new string per field
static int SumSlow(string csv) => csv.Split(',').Sum(int.Parse);

// Zero allocations: Split on a span (.NET 9+) yields ranges into the original string
static int SumFast(ReadOnlySpan<char> csv)
{
    int sum = 0;
    foreach (Range field in csv.Split(','))
        sum += int.Parse(csv[field]);
    return sum;
}
// Both behave the same on bad input: "1,2," has an empty last field, and both throw FormatException.

// Rent instead of allocate
byte[] buffer = ArrayPool<byte>.Shared.Rent(64 * 1024);
try { Console.WriteLine(buffer.Length >= 64 * 1024); }   // True: you may get a bigger one
finally { ArrayPool<byte>.Shared.Return(buffer); }
`,
      practice: "Benchmark `SumSlow` and `SumFast` with BenchmarkDotNet and `[MemoryDiagnoser]`. Report the allocated bytes per call for each and explain where every allocation in the slow version comes from.",
      teach: "Explain why most .NET garbage collections are fast, and what kind of code makes them slow.",
      analogy: "Gen 0 is your desk: you clear scrap paper off it many times a day, in seconds. Gen 2 is the attic: cleaning it means stopping everything for an afternoon. Good code keeps short-lived paper on the desk and avoids hauling it up to the attic.",
      pitfalls: [
        "Calling `GC.Collect()` to 'help'. It promotes live objects to older generations early and usually makes things worse.",
        "Turning everything into structs to avoid allocation, then paying more in copying.",
        "Optimising code that is not on the hot path. Profile first.",
        "Trusting a `Stopwatch` loop as a benchmark."
      ],
      quiz: [
        { q: "Why is a Gen 0 collection usually cheap?", a: ["It runs on a background thread, so it costs nothing", "Most new objects are already dead, so little needs to be traced or copied", "It only looks at objects larger than 85 KB", "It skips objects referenced from the stack"], c: 1, why: "Young objects tend to die young, so Gen 0 has few survivors to deal with." },
        { q: "Why can a `Span<T>` not be a field of a class?", a: ["It is too large for a class", "It is a `ref struct` that may point at stack memory, so it must not escape to the heap", "Spans are always read-only", "Classes cannot hold structs"], c: 1, why: "A span can point into a stack frame that disappears when the method returns, so the compiler stops it from reaching the heap." },
        { q: "First step before optimising memory use?", a: ["Rewrite hot types as structs", "Call `GC.Collect()` after big operations", "Measure with a profiler or benchmark", "Replace LINQ with loops everywhere"], c: 2, why: "Without measuring you don't know where allocations happen or whether they matter." }
      ]
    },
    {
      id: 'concurrency', title: 'Concurrency and thread safety', level: 3, mins: 40,
      terms: [
        ['Race condition', 'Two threads reading and writing shared state without coordination so outcomes depend on lucky thread timing.'],
        ['`ConcurrentDictionary` vs `lock`', '`ConcurrentDictionary` makes map calls thread-safe, while `SemaphoreSlim(1, 1)` guards async sections (never `lock` across `await`).'],
        ['`Channel<T>`', 'Fast async producer/consumer queue for offloading background jobs from HTTP endpoints to worker loops.']
      ],
      why: "Web APIs process many concurrent requests at once. Any shared static field, singleton collection, or cache gets hit from multiple threads simultaneously, creating rare and painful bugs.",
      points: [
        "A **race condition** makes correctness depend on thread timing. Even `count++` runs read, add, and write separately, so it isn't atomic.",
        "Guard mutable state with `lock` (sync only), `Interlocked` for single counters, or `SemaphoreSlim.WaitAsync` when guarding an `await`.",
        "Even better, share nothing mutable: prefer immutable records, scoped per-request state, or `Channel<T>` message queues.",
        "`ConcurrentDictionary` protects single calls, yet check-then-act pairs still race. Use atomic methods like `GetOrAdd` or `AddOrUpdate`.",
        "A **deadlock** occurs when two threads wait on each other's locks. Always grab locks in one consistent order and release fast.",
        "Reach for `Parallel.ForEachAsync` or `Task.WhenAll` for parallel I/O, and `Channel<T>` for bounded producer/consumer pipelines."
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

// Async-friendly mutual exclusion: one caller inside at a time
var gate = new SemaphoreSlim(1, 1);
int balance = 0;
await Task.WhenAll(Enumerable.Range(0, 10).Select(_ => DepositAsync(10)));
Console.WriteLine(balance);                 // 100, every time

async Task DepositAsync(int amount)
{
    await gate.WaitAsync();
    try
    {
        int current = balance;
        await Task.Delay(5);                // e.g. a database call in the middle
        balance = current + amount;
    }
    finally { gate.Release(); }
}

// Producer / consumer with back-pressure
var channel = Channel.CreateBounded<int>(capacity: 100);
var consumer = Task.Run(async () =>
{
    await foreach (var item in channel.Reader.ReadAllAsync())
        Console.WriteLine($"consumed {item}");
});
for (int i = 0; i < 5; i++) await channel.Writer.WriteAsync(i);
channel.Writer.Complete();
await consumer;
`,
      practice: "Build a small in-memory rate limiter (at most N calls per second per key) that stays correct under `Parallel.For`. Run a naive `Dictionary` version and yours with many threads, several times, and compare the counts. The naive one fails on some runs, not all, which is exactly why you reason about thread safety instead of trusting one green test.",
      teach: "Explain why `count++` on a shared variable gives wrong totals with many threads, step by step.",
      analogy: "Two cashiers share one paper tally. Both read '41', both add one in their heads, both write '42', and one sale is lost. A lock is a rule that only the person holding the pen may read and write the tally.",
      pitfalls: [
        "'It works on my machine.' Races depend on timing and core count, so a passing run proves very little.",
        "Assuming a singleton service with a `List` field is safe in ASP.NET Core. Every request shares that list.",
        "Trying to `await` inside a `lock` (it won't compile), or locking on `this` or a string, which other code can lock on too."
      ],
      quiz: [
        { q: "Why is `count++` unsafe across threads?", a: ["`++` is slow on shared memory", "It is three steps (read, add, write) that can interleave", "`int` is a reference type", "The JIT moves it to the end of the method"], c: 1, why: "Two threads can read the same old value and both write old + 1, losing an update." },
        { q: "Which primitive gives mutual exclusion across an `await`?", a: ["`lock`", "`SemaphoreSlim`", "`volatile`", "`Interlocked.Increment`"], c: 1, why: "`SemaphoreSlim.WaitAsync` works with `await`, whereas `lock` rejects `await` inside its body." },
        { q: "Best strategy for thread safety overall?", a: ["Wrap every method in `lock`", "Avoid shared mutable state where possible", "Use `ConcurrentDictionary` for everything", "Mark shared fields `volatile`"], c: 1, why: "State that is not shared, or cannot change, cannot race." }
      ]
    },
    {
      id: 'internals', title: 'How frameworks work: variance, reflection and generated code', level: 3, mins: 35,
      terms: [
        ['Covariance / Contravariance (`out` / `in`)', 'Lets `IEnumerable<Dog>` pass where `IEnumerable<Animal>` is expected (`out`) and `IComparer<Animal>` pass for `Dog` (`in`).'],
        ['Reflection vs Source Generators', 'Reflection inspects types at runtime (slower and hurts AOT trimming), while Source Generators emit C# at build time.'],
        ['Expression tree (`Expression<Func<>>`)', 'Stores a lambda as an abstract syntax tree instead of compiled IL so EF Core can convert it into parameterized SQL.']
      ],
      why: "This is the layer frameworks are written in. It explains how a DI container finds constructors, how a JSON serializer finds properties, and how EF Core turns a lambda into SQL.",
      points: [
        "**Covariance** (`out T`): an `IEnumerable<Dog>` can be used as an `IEnumerable<Animal>` because values only come out. **Contravariance** (`in T`): an `Action<Animal>` can be used as an `Action<Dog>` because values only go in.",
        "**Reflection** inspects types at run time. It is how DI containers find constructors and serializers find properties. It is flexible but slow, and it skips the compiler's checks.",
        "**Source generators** write that code at compile time instead: `System.Text.Json` contexts, `[GeneratedRegex]`, `LoggerMessage`. Same convenience, no run-time discovery.",
        "Trimming and Native AOT remove code nothing seems to reference, so reflection-heavy libraries can break there. Generated code keeps working.",
        "**Expression trees** represent code as data. That is how EF Core turns `x => x.Age > 18` into `WHERE Age > 18`."
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
printString("hello");                         // hello

// Reflection: discovering members at run time, as a serializer does
foreach (var prop in typeof(Order).GetProperties())
    Console.WriteLine($"{prop.Name}: {prop.PropertyType.Name}");   // Id: Int32, Customer: String

// Expression tree: code as data (what EF Core inspects)
Expression<Func<int, bool>> isAdult = age => age >= 18;
Console.WriteLine(isAdult.Body);              // (age >= 18)
Func<int, bool> compiled = isAdult.Compile();
Console.WriteLine(compiled(20));              // True

// Source-generated regex: built at compile time, no startup cost
Console.WriteLine(Patterns.IsoDate().IsMatch("2026-11-17"));   // True

public record Order(int Id, string Customer);

public static partial class Patterns
{
    [GeneratedRegex(@"^\\d{4}-\\d{2}-\\d{2}$")]
    public static partial Regex IsoDate();
}
`,
      practice: "Write a minimal DI container (`Register<TInterface, TImpl>()`, `Resolve<T>()`) that uses reflection to find constructors and resolve their parameters recursively. Then explain what a source-generated container would do differently.",
      teach: "Explain why `IEnumerable<Dog>` can be treated as `IEnumerable<Animal>` but `List<Dog>` cannot be treated as `List<Animal>`.",
      analogy: "A vending machine that only dispenses apples can stand in wherever a 'fruit dispenser' is needed (covariance: output). A bin that accepts any fruit can stand in wherever an 'apple bin' is needed (contravariance: input). A box that both takes and gives must match exactly, or someone puts a banana in the apple box.",
      pitfalls: [
        "Assuming generics are always covariant. `List<T>` is invariant because it both reads and writes `T`.",
        "Using reflection on a hot path without caching what it finds.",
        "Reaching for reflection when a generic or an interface would do. A renamed property then breaks at run time instead of at build time."
      ],
      quiz: [
        { q: "Why is `List<Dog>` not assignable to `List<Animal>`?", a: ["`List<T>` is sealed", "Someone could then `Add(new Cat())` to a list of dogs", "`Dog` would need to be a struct", "It is assignable with an implicit cast"], c: 1, why: "`List<T>` both produces and consumes `T`, so it must be invariant to stay type-safe." },
        { q: "How does EF Core translate `p => p.Price > 10` to SQL?", a: ["It runs the lambda on every row in memory", "It receives an expression tree and translates its structure", "It decompiles the lambda's IL", "It matches the lambda's source text"], c: 1, why: "`IQueryable` methods take `Expression<Func<…>>`, which is data describing the code." },
        { q: "Main advantage of source generators over reflection?", a: ["They let code change at run time", "The work moves to compile time: faster startup, and it works with Native AOT", "They remove the need for a compiler", "They make code dynamically typed"], c: 1, why: "Generated code is ordinary compiled code with no run-time discovery cost." }
      ]
    }
  ]
};

export default track;
