// Dart + Flutter track. Every code sample is a complete file checked by tools/verify-dart.mjs.
// Inside these template literals a Dart "${" must be written "\${".
TRACKS.push({
  id: 'flutter', name: 'Dart + Flutter', lang: 'dart',
  tagline: 'Mobile apps from scratch: Dart, widgets, Bloc state management, testing, and shipping to real devices.',
  lessons: [
    // ---------------- Beginner ----------------
    {
      id: 'dart', title: 'Dart essentials: types, null safety and functions', level: 0, mins: 30,
      terms: [
        ['Sound null safety (`String` vs `String?`)', 'Non-nullable types guarantee a real value. Nullable types (`String?`) require handling `null` (`??`, `?.`) before use.'],
        ['`final` vs `const`', '`final` is assigned once at run time, while `const` is fixed at compile time so Flutter can reuse widget instances.'],
        ['Named parameters (`{required String id}`)', 'Readable configuration arguments wrapped in `{}` used across Flutter widget constructors.']
      ],
      why: "Flutter apps are written in Dart. If you know C# or TypeScript, most of the syntax will feel familiar. The main differences you'll see in every Flutter file are sound null safety, named parameters, and `final` versus `const`.",
      points: [
        "Dart is statically typed with inference, so `var age = 30` stays an `int` forever. Core types are `int`, `double`, `num`, `bool`, `String`, `List`, `Map`, and `Set`.",
        "Assign `final` variables once at run time and use `const` for compile-time constants. Default to `final`; Flutter relies on `const` widgets to skip extra rebuild work.",
        "Under **sound null safety**, `String` can never be null while `String?` might be. The compiler blocks using a nullable value until you handle the null case.",
        "Null-aware operators include `a ?? b` (fallback), `a?.length` (read if non-null), and `a ??= b` (assign if null). Avoid `a!`, because it crashes at run time if the value is null.",
        "Functions are first-class values. **Named parameters** inside `{}` are optional unless marked `required`, which is how widgets take options like `Text('Hi', maxLines: 2)`.",
        "String interpolation uses `$name` and `\${expression}`. Division with `/` always returns a `double`, so use `~/` for integer division."
      ],
      code: `
String? findNickname(String name) => name == 'Budi' ? 'Bud' : null;

int add(int a, int b) => a + b;

String greet(String who, {String greeting = 'Hello', bool shout = false}) {
  final text = '$greeting, $who!';
  return shout ? text.toUpperCase() : text;
}

void main() {
  final name = 'Ana';          // inferred as String; cannot be reassigned
  var age = 30;                // int
  const taxRate = 0.11;        // compile-time constant
  double price = 19.99;

  String? nickname = findNickname(name);        // may be null
  final shown = nickname ?? name;               // fallback when null
  final length = nickname?.length ?? 0;         // null-aware access

  age = add(age, 1);
  print(greet(shown, shout: true));
  print('Total: \${(price * (1 + taxRate)).toStringAsFixed(2)}, age $age, nickname length $length');
  print(7 / 2);     // 3.5 — "/" always returns a double
  print(7 ~/ 2);    // 3   — integer division
}`,
      practice: "Open DartPad and write `String describe(String name, {int? age, String city = 'unknown'})` that returns a sentence, handling a missing age without `!`. Call it three ways, then try storing `null` in a `String` variable and read the compiler error.",
      teach: "Explain the difference between `String` and `String?`, and why Dart refuses to compile `nickname.length` when `nickname` is a `String?`.",
      analogy: "A non-nullable type is a parking space guaranteed to hold a car. A nullable type is a space that might be empty, so the compiler won't let you open the door until you check that a car is there.",
      pitfalls: [
        "Adding `!` everywhere to silence the compiler. Each one is a potential crash; handle null with `??`, `?.`, or an `if` check.",
        "Mixing up `final` and `const`: `final now = DateTime.now()` works, but `const now = DateTime.now()` fails because the value isn't known at compile time.",
        "Expecting `7 / 2` to equal `3` like in C#. In Dart, `/` always returns a `double`."
      ],
      quiz: [
        { q: "What is the type of `x` in `var x = 5;`?", a: ["`dynamic`", "`int`, inferred and fixed", "`num`", "`Object?`"], c: 1, why: "Dart infers `int` from the initial value, and the variable can't hold another type later." },
        { q: "What does `name ?? 'Guest'` evaluate to when `name` is null?", a: ["null", "`'Guest'`", "It throws", "`name`"], c: 1, why: "`??` returns the right side when the left side is null." },
        { q: "Which declaration is a compile-time constant?", a: ["`final a = DateTime.now();`", "`var a = 3;`", "`const a = 3;`", "`late int a;`"], c: 2, why: "`const` values must be known at compile time and are canonicalized." }
      ]
    },
    {
      id: 'dartoop', title: 'Classes, collections and immutability', level: 0, mins: 30,
      terms: [
        ['Constructor initializers & `required`', 'Shaping valid objects in one expression (`const Product({required this.id, required this.name})`).'],
        ['Collection `if` / `for` & Spread (`...`)', 'Building conditional widget lists right inside `[ ... ]` instead of calling `.add()` step by step.'],
        ['Immutable value copy (`copyWith`)', 'Returning a modified copy of state instead of mutating fields in place so Bloc and Riverpod spot changes.']
      ],
      why: "Every Flutter widget is a class, and every screen builds from lists and maps of data. Immutable model classes with value equality make state management, especially Bloc, predictable.",
      points: [
        "A class has `final` fields and a constructor. Initializing formals (`this.name`) and named `required` parameters keep constructors short and call sites readable.",
        "A `const` constructor lets instances be built at compile time. Dart doesn't have `public` or `private` keywords; a leading underscore (`_count`) marks a member private to its library.",
        "Keep model objects **immutable** by marking fields `final` and creating updated copies with `copyWith`.",
        "Dart compares objects by identity unless you override `==` and `hashCode`. State comparison depends on value equality, which packages like `equatable` or code generation automate.",
        "Core collections are `List` (ordered), `Set` (unique), and `Map` (key to value). Like LINQ, `where` and `map` return a lazy `Iterable` until you iterate or call `toList()`, while `fold`, `any`, and `firstWhere` run right away.",
        "**Collection `if` and `for`** build lists inline (`[for (final p in items) if (p.inStock) p.name]`), which is how Flutter code constructs conditional widget lists."
      ],
      code: `
class Product {
  const Product({required this.id, required this.name, required this.price});
  final int id;
  final String name;
  final double price;

  Product copyWith({String? name, double? price}) =>
      Product(id: id, name: name ?? this.name, price: price ?? this.price);

  @override
  bool operator ==(Object other) =>
      other is Product && other.id == id && other.name == name && other.price == price;
  @override
  int get hashCode => Object.hash(id, name, price);
  @override
  String toString() => 'Product($id, $name, $price)';
}

void main() {
  final products = [
    const Product(id: 1, name: 'Laptop', price: 1200),
    const Product(id: 2, name: 'Mouse', price: 25),
    const Product(id: 3, name: 'Desk', price: 300),
  ];

  final cheapNames = products.where((p) => p.price < 500).map((p) => p.name).toList();
  final total = products.fold<double>(0, (sum, p) => sum + p.price);
  final byId = {for (final p in products) p.id: p};        // Map<int, Product>
  final tags = <String>{'tech', 'home'}..add('tech');       // Set ignores duplicates: {tech, home}
  final discounted = [
    for (final p in products)
      if (p.price > 100) p.copyWith(price: p.price * 0.9),
  ];

  print(cheapNames);
  print(total);
  print(byId[2]);
  print(tags);
  print(discounted);
  print(products[1] == const Product(id: 2, name: 'Mouse', price: 25));   // true: value equality
}`,
      practice: "Write an immutable `CartItem` (`product`, `quantity`) with `copyWith` and value equality, plus a function returning a new list with one item's quantity incremented. Verify the original list stays unchanged and two equal items satisfy `==`.",
      teach: "Explain why two `Product` objects with matching field values aren't equal by default, and what you need to write to change that.",
      analogy: "An immutable object is a printed receipt: nobody edits it in place; they issue a corrected copy. Because the old receipt never changes, any widget, test, or log holding it can trust its contents, and `copyWith` prints the updated receipt.",
      pitfalls: [
        "Overriding `==` without overriding `hashCode`. Equal objects must share hash codes or sets and maps break.",
        "Mutating a state list in place (`items.add(x)`) instead of creating a new list, so code comparing old and new state misses the change.",
        "Forgetting that `where` and `map` are lazy: looping over the result twice runs the work twice unless you call `toList()` once."
      ],
      quiz: [
        { q: "How do you make a member private in Dart?", a: ["The `private` keyword", "Start its name with an underscore", "Put it in a `#region`", "Mark it `@hidden`"], c: 1, why: "Privacy is scoped per library and marked by a leading underscore." },
        { q: "Two instances of a class with identical fields, created with `new`-style calls (not `const`), are compared with `==`. By default the result is…", a: ["true", "false, unless they are the same instance", "a compile error", "true if the class has a `toString`"], c: 1, why: "Default equality checks identity. Override `==` and `hashCode` for value equality (identical `const` expressions reuse one instance, so they compare equal without an override)." },
        { q: "What does `[for (final n in [1, 2, 3]) if (n.isOdd) n * 10]` produce?", a: ["`[10, 20, 30]`", "`[10, 30]`", "`[1, 3]`", "A syntax error"], c: 1, why: "Collection `for` and `if` collect and transform only the odd items." }
      ]
    },
    {
      id: 'widgets', title: 'Flutter: widgets and the widget tree', level: 0, mins: 30,
      terms: [
        ['`StatelessWidget` vs `StatefulWidget`', 'Immutable configuration blueprints rebuilt often (`build(context)`), paired with long-lived `State` objects when needed.'],
        ['`BuildContext`', 'A handle marking your widget\'s spot in the tree so it can look up `Theme.of(context)` or `Navigator.of(context)`.'],
        ['Composition over monolithic widgets', 'Splitting small named widgets out instead of helper methods gives Flutter clear rebuild boundaries and `const` reuse.']
      ],
      why: "Everything on a Flutter screen is a widget, arranged in a tree in code. Once you view `build` as a function turning data into a UI description, much like a React component, the framework makes sense right away.",
      points: [
        "A **widget** is an immutable description of part of the UI. Flutter turns that widget tree into pixels; you never mutate the screen directly.",
        "A `StatelessWidget` holds `final` inputs and a `build` method returning child widgets, similar to a React function component with props.",
        "`runApp` mounts the root widget. `MaterialApp` handles theming and navigation, while `Scaffold` gives a page its app bar, body, and floating button.",
        "Flutter favors **composition over inheritance**, so you nest small widgets like `Padding`, `Center`, `Text`, and `Icon` rather than subclassing large ones.",
        "Mark widgets `const` wherever you can. A `const` widget is created once and Flutter skips rebuilding it.",
        "`BuildContext` tracks where a widget sits in the tree so you can read ancestors via `Theme.of(context)`, `MediaQuery.sizeOf(context)`, or `Navigator.of(context)`."
      ],
      code: `
import 'package:flutter/material.dart';

void main() => runApp(const ShopApp());

class ShopApp extends StatelessWidget {
  const ShopApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Shop',
      theme: ThemeData(colorSchemeSeed: Colors.indigo),
      home: Scaffold(
        appBar: AppBar(title: const Text('Products')),
        body: ListView(
          children: const [
            ProductTile(name: 'Laptop', price: 1200),
            ProductTile(name: 'Mouse', price: 25),
          ],
        ),
      ),
    );
  }
}

class ProductTile extends StatelessWidget {
  const ProductTile({super.key, required this.name, required this.price});
  final String name;      // inputs, like props
  final double price;

  @override
  Widget build(BuildContext context) {
    final expensive = price > 1000;
    return ListTile(
      leading: Icon(expensive ? Icons.star : Icons.shopping_bag_outlined),
      title: Text(name),
      subtitle: Text('Price: \${price.toStringAsFixed(2)}'),
      trailing: expensive ? const Chip(label: Text('Premium')) : null,
    );
  }
}`,
      practice: "Run `flutter create shop` and replace `lib/main.dart` with this code. Add a third product, extract the price text into a `PriceLabel` widget, and use hot reload after each edit to see what stays intact.",
      teach: "Explain what a widget is and what `build` returns to someone who already knows HTML or React.",
      analogy: "A widget is a blueprint, not the building itself. Whenever data changes, you hand Flutter fresh blueprints; Flutter diffs them against the previous set and updates only the parts that changed. Blueprints are cheap to redraw.",
      pitfalls: [
        "Trying to mutate a widget after creating it. Widgets are immutable, so you return a new tree instead.",
        "Writing one huge `build` method. Extract small widget classes for clearer code and smaller rebuild scopes.",
        "Extracting UI into helper *methods* instead of widgets: helper methods can't be `const` and always rebuild with the parent."
      ],
      quiz: [
        { q: "What does a `StatelessWidget`'s `build` method return?", a: ["A `RenderObject` that paints itself", "A widget (a description of UI)", "A `State` object", "An `Element`"], c: 1, why: "`build` returns a widget tree describing this part of the UI, and Flutter manages the elements and render objects." },
        { q: "Why add `const` to a widget constructor call?", a: ["It makes the widget immutable", "The instance is canonical, so Flutter can skip rebuilding it", "It's required for widgets with no fields", "It keeps the widget's State across hot reload"], c: 1, why: "Identical `const` instances refer to the same object, letting Flutter skip diffs on that subtree." },
        { q: "What is `BuildContext`?", a: ["The app's global state", "A handle to the widget's position in the tree", "The device screen", "A network client"], c: 1, why: "It lets a widget look up ancestors like the theme, media query, and navigator." }
      ]
    },
    {
      id: 'layout', title: 'Layout: rows, columns and constraints', level: 0, mins: 35, viz: 'constraints',
      terms: [
        ['Constraints go down, sizes go up', 'Parent passes min and max bounds down, the child picks a fitting size, and the parent sets the child\'s final x/y position.'],
        ['Unbounded constraint (`∞`)', 'Happens on scroll axes or bare `Row`/`Column` children; nesting `Expanded` or an unbounded `ListView` inside triggers overflow errors.'],
        ['`Expanded` vs `Flexible`', '`Expanded` forces a child to fill remaining axis space (`flex`), while `Flexible` lets a child grow up to that remaining limit.']
      ],
      why: "Most Flutter layout bugs, including yellow-and-black overflow stripes, 'unbounded height' errors, and widgets ignoring size hints, come from one rule. Learn that rule and layout errors become easy to read.",
      points: [
        "One rule drives layout: **constraints go down, sizes go up, parent sets position**. Parents pass min and max bounds down, each child picks a size inside those bounds, and the parent places it.",
        "`Row` lays out children horizontally and `Column` lays them out vertically. Just like flexbox, `mainAxisAlignment` aligns along that axis and `crossAxisAlignment` aligns across it.",
        "`Expanded` forces a child to fill remaining main-axis space, while `Flexible` lets it take up to that amount. Without either, oversized children overflow.",
        "Use `SizedBox` for fixed dimensions or gaps, `Padding` for inner spacing, and `Container` when you need size, padding, decoration, and alignment together.",
        "`ListView` and `GridView` scroll and build lazily with `.builder`. Inside a `Column`, give them bounded height by wrapping them in `Expanded`.",
        "Build responsive layouts with `LayoutBuilder` (bounds given to this widget) or `MediaQuery.sizeOf(context)` (full screen size)."
      ],
      code: `
import 'package:flutter/material.dart';

class ProductCard extends StatelessWidget {
  const ProductCard({super.key, required this.name, required this.description});
  final String name;
  final String description;

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.all(12),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const SizedBox(width: 56, height: 56, child: ColoredBox(color: Colors.indigo)),
            const SizedBox(width: 12),
            Expanded(                                   // takes the remaining width
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(name, style: Theme.of(context).textTheme.titleMedium),
                  Text(description, maxLines: 2, overflow: TextOverflow.ellipsis),
                ],
              ),
            ),
            IconButton(
              onPressed: () {},
              tooltip: 'Add to cart',                   // also what screen readers announce
              icon: const Icon(Icons.add_shopping_cart),
            ),
          ],
        ),
      ),
    );
  }
}

class ResponsiveGrid extends StatelessWidget {
  const ResponsiveGrid({super.key, required this.children});
  final List<Widget> children;

  @override
  Widget build(BuildContext context) {
    return LayoutBuilder(
      builder: (context, constraints) {
        final columns = constraints.maxWidth >= 900 ? 3 : constraints.maxWidth >= 600 ? 2 : 1;
        return GridView.count(crossAxisCount: columns, childAspectRatio: 3, children: children);
      },
    );
  }
}`,
      practice: "Remove `Expanded` around the `Column`, add a very long card description, and read the overflow error before putting `Expanded` back. Then put a `ListView` straight inside a `Column`, read the 'unbounded height' error, and fix it with `Expanded`.",
      teach: "Explain 'constraints go down, sizes go up, parent sets position' using a `Row` holding a `Text` inside `Expanded`.",
      analogy: "Layout is like packing a suitcase for a picky traveler. The parent says 'you can be between 0 and 300 wide', the child replies 'I'll take 120', and the parent decides where to put it. Children never pick their own coordinates or exceed offered bounds.",
      pitfalls: [
        "Putting a long `Text` inside a `Row` without `Expanded` or `Flexible`. The text gets infinite width and overflows.",
        "Nesting a scrollable (`ListView`) inside a `Column` without `Expanded`: the column gives unbounded height, so the list can't size itself.",
        "Hardcoding pixel dimensions everywhere instead of letting flexible widgets adapt to different screens.",
        "Adding an `IconButton` without a `tooltip`: screen readers announce only 'button', and hover or long-press shows no hint."
      ],
      quiz: [
        { q: "In a `Row`, which property aligns children vertically?", a: ["`mainAxisAlignment`", "`crossAxisAlignment`", "`textAlign`", "`alignment`"], c: 1, why: "A `Row`'s main axis is horizontal, so `crossAxisAlignment` controls vertical alignment." },
        { q: "What does `Expanded` do inside a `Row`?", a: ["Makes the child scroll", "Makes the child fill the remaining main-axis space", "Adds padding", "Centers the child"], c: 1, why: "It passes a tight constraint equal to the remaining width." },
        { q: "Which statement describes Flutter layout?", a: ["Children choose their own position", "Constraints go down, sizes go up, the parent sets the position", "Sizes go down, constraints go up", "Everything is absolutely positioned"], c: 1, why: "Constraints travel down and sizes travel back up in one pass; the parent places each child." }
      ]
    },

    // ---------------- Intermediate ----------------
    {
      id: 'async', title: 'Async Dart: Future, Stream and the event loop', level: 1, mins: 35,
      terms: [
        ['`Future<T>` & `async`/`await`', 'Holds one async value or error arriving later without stalling Flutter\'s 60/120 fps UI isolate.'],
        ['`Stream<T>`', 'Emits zero or more values over time (WebSocket frames, scroll positions, Bloc states) until cancelled.'],
        ['Microtask vs Event queue', 'Dart\'s single-threaded event loop drains the entire microtask queue before pulling the next UI or timer event.']
      ],
      why: "Network calls, file access, user input, and Bloc all run asynchronously. A `Future` produces one value later, while a `Stream` emits values over time and powers state management.",
      points: [
        "A `Future<T>` represents a value arriving later. `await` pauses an `async` function without blocking the UI thread, just like in C# and TypeScript.",
        "Start independent calls before awaiting them with `Future.wait([...])`, or keep per-item types using record syntax `await (fetchUser(1), fetchOrders()).wait`. Catch failures with `try`/`catch`, and note that `.timeout(...)` stops you waiting without aborting the underlying HTTP call.",
        "A `Stream<T>` delivers values over time such as taps, WebSocket frames, or state updates. Read them with `await for` or `listen`, and produce them with `async*` + `yield` or a `StreamController`.",
        "Always cancel every `StreamSubscription` and close every `StreamController` when done, or leaked subscriptions keep running in memory.",
        "Dart executes code on **one thread with an event loop**: finish the active synchronous block, empty the **microtask queue**, then pull one **event** (timer, I/O, or tap).",
        "Long synchronous loops freeze the UI. Move heavy CPU tasks onto another **isolate**, covered in the rendering lesson."
      ],
      code: `
import 'dart:async';

Future<String> fetchUser(int id) async {
  await Future.delayed(const Duration(milliseconds: 300));    // stands in for a network call
  if (id < 0) throw ArgumentError('id must be positive');
  return 'user-$id';
}

Stream<int> countdown(int from) async* {
  for (var i = from; i > 0; i--) {
    await Future.delayed(const Duration(milliseconds: 100));
    yield i;
  }
}

Future<void> main() async {
  final watch = Stopwatch()..start();
  final a = await fetchUser(1);
  final b = await fetchUser(2);
  print('sequential: $a $b \${watch.elapsedMilliseconds} ms');   // about 600 ms

  watch.reset();
  final both = await Future.wait([fetchUser(1), fetchUser(2)]);
  print('concurrent: $both \${watch.elapsedMilliseconds} ms');    // about 300 ms

  final (first, second) = await (fetchUser(3), fetchUser(4)).wait;   // a record: each result keeps its type
  print('record: $first $second');

  try {
    await fetchUser(-1).timeout(const Duration(seconds: 2));
  } on ArgumentError catch (e) {
    print('failed: \${e.message}');
  }

  await for (final n in countdown(3)) {
    print('tick $n');
  }

  print('1 sync');
  Timer.run(() => print('4 event'));
  scheduleMicrotask(() => print('3 microtask'));
  print('2 sync');
}`,
      practice: "Predict the last four output lines before running the sample in DartPad. Then build a debounced `Stream<String>` using a `StreamController` and `Timer` that emits only after 300 ms of typing silence.",
      teach: "Explain the difference between a `Future` and a `Stream`, giving one mobile app example of each.",
      analogy: "A `Future` is a single parcel delivery that arrives once with an item or a failure slip. A `Stream` is a magazine subscription that keeps delivering issues until you cancel, and forgetting to cancel leaves them piling up at the door.",
      pitfalls: [
        "Leaving out `await`, which lets the function continue right away and swallows async errors.",
        "Awaiting independent calls sequentially instead of overlapping them with `Future.wait`.",
        "Subscribing to a stream and forgetting to cancel the subscription on widget dispose.",
        "Assuming `.timeout()` aborts the remote request. It only stops your `await`; the request keeps running in the background."
      ],
      quiz: [
        { q: "A `Future` completes ___; a `Stream` can emit ___.", a: ["many times; once", "once; many values over time", "once; one value, but later than a future", "once per listener; once per listener"], c: 1, why: "A `Future` resolves once, whereas a `Stream` delivers zero or more values over time." },
        { q: "In what order do `scheduleMicrotask` and `Timer.run` callbacks execute after the current synchronous code?", a: ["Timer first", "Microtask first", "Whichever was scheduled first", "In parallel"], c: 1, why: "Dart drains the microtask queue completely before pulling the next timer or I/O event." },
        { q: "Two independent 300 ms calls. Fastest correct approach?", a: ["`await` each in turn", "`await Future.wait([a(), b()])`", "Call them without `await` and hope they finish", "`await` each one inside a `for` loop"], c: 1, why: "Both futures start before awaiting so waits overlap; omitting `await` altogether hides results and errors." }
      ]
    },
    {
      id: 'state', title: 'State: StatefulWidget, setState and lifecycle', level: 1, mins: 35, viz: 'frebuild',
      terms: [
        ['`mounted` check', 'Guards against calling `setState()` after a widget leaves the tree while an async `Future` was still running.'],
        ['`initState()` & `dispose()`', 'One-time setup at mount (controllers and listeners) paired with cleanup (`controller.dispose()`) on unmount.'],
        ['Pushing state down', 'Keeping local input or hover state in leaf widgets alongside `const` siblings limits `build()` calls to the changing subtree.']
      ],
      why: "State is anything that changes while your app runs. `setState` is the simplest way to update it and sits underneath every state library, so you'll understand Bloc rebuilds much better once you know how `State` works.",
      points: [
        "A `StatefulWidget` stays immutable while its mutable data lives in a separate **`State` object** that persists across rebuilds.",
        "Calling `setState(() { ... })` updates state and marks the widget dirty, prompting Flutter to re-run `build` for that widget **and its subtree**.",
        "Key lifecycle hooks are `initState` (runs once at mount), `didUpdateWidget` (parent passed new arguments), and `dispose` (runs once to clean up controllers, timers, and subscriptions).",
        "**Lift state up** when two widgets share the same data: their common parent holds the value, passes it down, and takes updates via callbacks (`ValueChanged<T>`).",
        "Keep state as low in the tree as possible so changes trigger minimal rebuilds, extracting changing pieces into small widgets.",
        "Give items a **`Key`** (`ValueKey`) when stateful siblings can reorder or be removed, so Flutter matches each `State` to the right item."
      ],
      code: `
import 'package:flutter/material.dart';

class CartCounter extends StatefulWidget {
  const CartCounter({super.key, this.initial = 0});
  final int initial;

  @override
  State<CartCounter> createState() => _CartCounterState();
}

class _CartCounterState extends State<CartCounter> {
  late int _count;
  final _note = TextEditingController();

  @override
  void initState() {
    super.initState();
    _count = widget.initial;          // runs once, when the State is created
  }

  @override
  void dispose() {
    _note.dispose();                  // release controllers, timers, subscriptions
    super.dispose();
  }

  void _add() => setState(() => _count++);      // mark dirty → build() runs again

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        Text('In cart: $_count', style: Theme.of(context).textTheme.headlineSmall),
        TextField(controller: _note, decoration: const InputDecoration(labelText: 'Note')),
        FilledButton.icon(onPressed: _add, icon: const Icon(Icons.add), label: const Text('Add')),
        if (_count >= 5) const Text('Bulk discount unlocked'),
      ],
    );
  }
}

// Lifting state up: the parent owns the value, the child reports events.
class Quantity extends StatelessWidget {
  const Quantity({super.key, required this.value, required this.onChanged});
  final int value;
  final ValueChanged<int> onChanged;

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        IconButton(onPressed: value > 0 ? () => onChanged(value - 1) : null, icon: const Icon(Icons.remove)),
        Text('$value'),
        IconButton(onPressed: () => onChanged(value + 1), icon: const Icon(Icons.add)),
      ],
    );
  }
}`,
      practice: "Build a screen with two `Quantity` widgets and a total. Decide where those counts should live and wire them up, then move `_count++` outside `setState` and explain why the UI stops updating.",
      teach: "Explain why mutable data lives in a `State` object instead of inside the `StatefulWidget` itself.",
      analogy: "The widget is a job description, while `State` is the employee doing the work. Management keeps handing out fresh job descriptions with updated notes, yet the same employee stays at the desk with everything they remember. When `dispose` runs, it's the employee's last day: hand back the keys.",
      pitfalls: [
        "Changing a field without calling `setState`: the field changes, but Flutter never rebuilds.",
        "Forgetting `dispose` for controllers, animation controllers, and stream subscriptions.",
        "Calling `setState` after a widget leaves the screen (after an `await`). Check `mounted` first."
      ],
      quiz: [
        { q: "What does calling `setState` cause?", a: ["The whole app restarts", "`build` runs again for that widget and its subtree", "Only the changed `Text` is redrawn by hand", "`initState` runs again"], c: 1, why: "The element is marked dirty and rebuilt on the next frame; Flutter then updates only what differs." },
        { q: "Where should a `TextEditingController` be disposed?", a: ["In `build`", "In `dispose` of the State", "Never", "In `initState`"], c: 1, why: "`dispose` runs once when `State` is permanently unmounted, so release resources there." },
        { q: "Why give list items a `ValueKey`?", a: ["For styling", "So Flutter matches each State to the right item when the list is reordered", "To make them `const`", "It is required by `ListView`"], c: 1, why: "Without keys, state is matched by position and sticks to the wrong item after a reorder." }
      ]
    },
    {
      id: 'navforms', title: 'Navigation and forms', level: 1, mins: 35,
      splits: [['1 · GoRouter setup', "import 'package:flutter/material.dart';"], ['2 · Home & Product pages', 'class HomePage'], ['3 · NewProductPage form', 'class NewProductPage']],
      terms: [
        ['Declarative routing (`GoRouter`)', 'Maps URL paths (`/products/:id`) directly to screen stacks with browser deep linking and typed parameters.'],
        ['`GlobalKey<FormState>`', 'Coordinates `validator` callbacks across all `TextFormField` descendants in one `.validate()` pass.'],
        ['Controller disposal', 'Every `TextEditingController` holds listeners and must be released in `dispose()` to avoid memory leaks.']
      ],
      why: "Most apps span several screens and collect user input along the way. Declarative routing handles deep links and working Back buttons, while validated forms catch bad input early.",
      points: [
        "Flutter keeps screens on a **stack**: `push` places a new route on top and `pop` removes it. The low-level call is `Navigator.of(context).push(MaterialPageRoute(...))`.",
        "For apps with more than a couple of screens, use **go_router** to map URL-like paths to screens with path parameters, deep links, redirects, and browser history on web.",
        "`context.go('/products/42')` replaces the stack to match that location, `context.push(...)` layers a screen on top, and `context.pop(result)` returns a value to the caller.",
        "**Nesting decides what sits underneath.** Declaring `products/:id` inside `/` makes `go('/products/42')` stack Home underneath the product page so Back works. Defining it as a top-level sibling puts it alone on the stack, so Back exits the app.",
        "A `Form` paired with `GlobalKey<FormState>` groups several `TextFormField` widgets. Calling `validate()` runs each field's `validator`: returning a string displays an error, while returning null marks it valid.",
        "`save()` triggers each `onSaved` callback. Pick `keyboardType`, `textInputAction`, and `autofillHints` so mobile keyboards match the field, using `TextInputType.numberWithOptions(decimal: true)` for prices since plain `number` lacks a decimal key on iOS.",
        "Client validation helps users spot typos early and should match your backend rules (here a minimum price of 0.01). Always validate again on the API server rather than trusting client checks."
      ],
      code: `
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

final router = GoRouter(
  routes: [
    GoRoute(
      path: '/',
      builder: (context, state) => const HomePage(),
      routes: [                                       // nested: these pages sit on top of Home
        GoRoute(
          path: 'products/:id',
          builder: (context, state) => ProductPage(id: int.parse(state.pathParameters['id']!)),
        ),
        GoRoute(path: 'new', builder: (context, state) => const NewProductPage()),
      ],
    ),
  ],
);

void main() => runApp(MaterialApp.router(routerConfig: router));

class HomePage extends StatelessWidget {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Shop')),
      body: Center(
        child: FilledButton(onPressed: () => context.go('/products/42'), child: const Text('Open product 42')),
      ),
      floatingActionButton: FloatingActionButton(onPressed: () => context.push('/new'), child: const Icon(Icons.add)),
    );
  }
}

class ProductPage extends StatelessWidget {
  const ProductPage({super.key, required this.id});
  final int id;

  @override
  Widget build(BuildContext context) => Scaffold(appBar: AppBar(title: Text('Product $id')));
}

class NewProductPage extends StatefulWidget {
  const NewProductPage({super.key});

  @override
  State<NewProductPage> createState() => _NewProductPageState();
}

class _NewProductPageState extends State<NewProductPage> {
  final _formKey = GlobalKey<FormState>();
  String _name = '';
  double _price = 0;

  // Many keyboards (Indonesian ones included) type a comma as the decimal separator
  static double? _parsePrice(String? input) => double.tryParse((input ?? '').trim().replaceAll(',', '.'));

  void _submit() {
    if (!_formKey.currentState!.validate()) return;     // shows the error texts
    _formKey.currentState!.save();
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Saved $_name at $_price')));
    context.pop();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('New product')),
      body: Form(
        key: _formKey,
        child: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            TextFormField(
              decoration: const InputDecoration(labelText: 'Name'),
              validator: (v) => (v == null || v.trim().length < 2) ? 'At least 2 characters' : null,
              onSaved: (v) => _name = v!.trim(),
            ),
            TextFormField(
              decoration: const InputDecoration(labelText: 'Price'),
              keyboardType: const TextInputType.numberWithOptions(decimal: true),   // has a decimal key on iOS
              validator: (v) => (_parsePrice(v) ?? 0) < 0.01 ? 'Enter a price of at least 0.01' : null,
              onSaved: (v) => _price = _parsePrice(v)!,
            ),
            const SizedBox(height: 16),
            FilledButton(onPressed: _submit, child: const Text('Save')),
          ],
        ),
      ),
    );
  }
}`,
      practice: "Add an edit route `/products/:id/edit` reusing the form with initial values, and pass the saved product back with `context.pop(product)`. Run it on web and verify both browser Back and a pasted URL work.",
      teach: "Explain the navigation stack and what `push`, `pop`, and `go` each do to it.",
      analogy: "Navigation works like a deck of cards on a table. `push` puts a card on top, and `pop` lifts the top card to show the one underneath. `go` clears the table and deals the exact stack described by a URL, so a pasted link opens the target page with the right screens below it.",
      pitfalls: [
        "Passing whole objects between routes, which breaks deep links. Put the ID in the path and load from there.",
        "Using `context` after an `await` without checking `mounted`, because the user might have left that screen.",
        "Defining every route at top level, which makes `go` leave the destination screen alone on the stack with no Back button.",
        "Running `double.parse` straight on typed text: `19,99` throws on comma locales, so normalize the decimal separator first.",
        "Validating only on the device or using different limits than the backend. Enforce the same rules on the server."
      ],
      quiz: [
        { q: "What does a `validator` return when the input is valid?", a: ["`true`", "An empty string", "`null`", "The value"], c: 2, why: "A non-null string displays as the error; null means the field passed." },
        { q: "What is the difference between `context.go` and `context.push` in go_router?", a: ["None", "`go` replaces the stack to match the location; `push` adds a screen on top", "`push` is for the web only", "`go` cannot take parameters"], c: 1, why: "`go` swaps the stack declaratively for a URL, whereas `push` pushes one route on top." },
        { q: "Why prefer a path parameter such as `/products/42` over passing a `Product` object?", a: ["It is faster", "The location can be restored from a link or a restart", "Objects cannot be passed", "It avoids rebuilds"], c: 1, why: "A URL can be serialized; an in-memory object disappears if the app opens from a link." },
        { q: "`/products/:id` is a top-level route, a sibling of `/`. After `context.go('/products/42')`, what is under the product page?", a: ["The home page", "Nothing: it's alone on the stack, so there's no back button", "Whatever page was open before", "A copy of the product page"], c: 1, why: "`go` builds the stack from the route tree, so nest the route under `/` to keep Home underneath." }
      ]
    },
    {
      id: 'network', title: 'Networking: HTTP, JSON and your ASP.NET Core API', level: 1, mins: 40,
      splits: [['1 · Model & ApiException', "import 'dart:convert';"], ['2 · ProductApi client', 'class ProductApi'], ['3 · ProductList screen', 'class ProductList']],
      terms: [
        ['Typed `fromJson` factory', 'Turns dynamic decoded JSON into typed Dart classes right at the HTTP boundary.'],
        ['`ApiException` & `ProblemDetails`', 'Parses RFC 9457 error responses from the server so the UI never displays raw HTML or stack traces.'],
        ['Async snapshot / loading states', 'Tracks loading, empty, error-retry, and data states directly rather than assuming requests succeed.']
      ],
      why: "Here the mobile app talks to the same ASP.NET Core endpoints as the web frontend. Typed models, complete loading and error states, and an injectable HTTP client keep networking testable.",
      points: [
        "Use the `http` package (or `dio`) with an injected `http.Client` instead of a global client, so tests can pass in a fake.",
        "JSON arrives as `Map<String, dynamic>`. Convert it at the boundary with a `fromJson` factory, or generate that code with `json_serializable` when you have many models.",
        "JSON numbers decode as either `int` or `double`, so cast them as `num` first before calling `.toDouble()`. Like TypeScript, Dart types don't validate runtime JSON shapes on their own.",
        "Check `statusCode`, throw a typed exception on failures, and set timeouts. Map ASP.NET Core `ProblemDetails` into a safe `title` message and per-field `errors` instead of showing the raw response body.",
        "Android and iOS block plain `http://` traffic by default. Connect over HTTPS locally, or whitelist your dev host in a debug-only network-security config, keeping production apps HTTPS-only.",
        "Handle at least four screen states: **loading, data, empty, and error**. For simple reads with `FutureBuilder`, create the future once outside `build`.",
        "Keep networking out of widgets via `widget -> repository -> API client`. Attach auth tokens in one place, and store tokens in `flutter_secure_storage` instead of plain preferences."
      ],
      code: `
import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;

class Product {
  const Product({required this.id, required this.name, required this.price});
  final int id;
  final String name;
  final double price;

  factory Product.fromJson(Map<String, dynamic> json) => Product(
        id: json['id'] as int,
        name: json['name'] as String,
        price: (json['price'] as num).toDouble(),
      );

  Map<String, dynamic> toJson() => {'id': id, 'name': name, 'price': price};
}

class ApiException implements Exception {
  ApiException(this.statusCode, this.message, [this.fieldErrors = const {}]);
  final int statusCode;
  final String message;                            // safe to show to the user
  final Map<String, List<String>> fieldErrors;     // from ProblemDetails "errors"

  // Reads ASP.NET Core's ProblemDetails; never shows the raw body to the user.
  factory ApiException.fromResponse(http.Response res) {
    try {
      final Object? body = res.body.isEmpty ? null : jsonDecode(res.body);
      if (body case {'title': String title}) {
        return ApiException(res.statusCode, title, {
          if (body case {'errors': Map<String, dynamic> errors})
            for (final MapEntry(:key, :value) in errors.entries)
              key: [for (final message in value as List<dynamic>) '$message'],
        });
      }
    } on FormatException {
      // Not JSON: fall through to the generic message
    }
    return ApiException(res.statusCode, 'Something went wrong (\${res.statusCode}). Please try again.');
  }

  @override
  String toString() => 'ApiException($statusCode): $message';
}

class ProductApi {
  ProductApi(this._client, this._baseUrl);
  final http.Client _client;       // injected, so tests can pass a fake
  final String _baseUrl;

  Future<List<Product>> getAll() async {
    final res = await _client.get(Uri.parse('$_baseUrl/api/products')).timeout(const Duration(seconds: 10));
    if (res.statusCode != 200) throw ApiException.fromResponse(res);
    final list = jsonDecode(res.body) as List<dynamic>;
    return [for (final item in list) Product.fromJson(item as Map<String, dynamic>)];
  }
}

class ProductList extends StatefulWidget {
  const ProductList({super.key, required this.api});
  final ProductApi api;

  @override
  State<ProductList> createState() => _ProductListState();
}

class _ProductListState extends State<ProductList> {
  late Future<List<Product>> _products = widget.api.getAll();     // started once, not in build()

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<List<Product>>(
      future: _products,
      builder: (context, snapshot) {
        if (snapshot.connectionState != ConnectionState.done) {
          return const Center(child: CircularProgressIndicator());
        }
        if (snapshot.hasError) {
          return Center(
            child: TextButton(
              onPressed: () => setState(() => _products = widget.api.getAll()),
              child: const Text('Could not load — tap to retry'),
            ),
          );
        }
        final items = snapshot.data!;
        if (items.isEmpty) return const Center(child: Text('No products yet'));
        return ListView(
          children: [for (final p in items) ListTile(title: Text(p.name), trailing: Text('\${p.price}'))],
        );
      },
    );
  }
}`,
      practice: "Point `ProductApi` at your local ASP.NET Core products API (`10.0.2.2` on the Android emulator). Add `create(Product)` via POST, show `ProblemDetails` field errors beside form inputs, and stop the API server to confirm the error state shows up.",
      teach: "Explain why `http.Client` is passed into `ProductApi` rather than created inside it.",
      analogy: "`fromJson` acts like customs at the border: untyped cargo (`Map<String, dynamic>`) comes in, gets checked and labeled once, and travels through your app as a `Product` with known fields instead of forcing every widget to guess.",
      pitfalls: [
        "Creating the `Future` inside `build`, which fires a fresh HTTP request on every rebuild.",
        "Casting JSON numbers straight to `double`: a whole number like `25` arrives as an `int` and fails the cast.",
        "Leaving a spinner stuck forever because errors and timeouts aren't handled.",
        "Calling `http://10.0.2.2:5000` from an Android emulator and hitting a cleartext block before the call leaves the device."
      ],
      quiz: [
        { q: "Why inject `http.Client` into the API class?", a: ["One client per class is faster", "Tests can pass a fake client and no real network is needed", "The `http` package requires it", "It makes the client a singleton"], c: 1, why: "Injected dependencies can be swapped with fakes in tests." },
        { q: "JSON contains `\"price\": 25`. Safest way to read it as a double?", a: ["`json['price'] as double`", "`(json['price'] as num).toDouble()`", "`double(json['price'])`", "`json.price`"], c: 1, why: "`25` decodes as an `int`; `num` accepts both and `toDouble` converts." },
        { q: "Where should the `Future` used by a `FutureBuilder` be created?", a: ["Inside `build`", "Once, in the State (a field or `initState`)", "In `dispose`", "In `main`"], c: 1, why: "`build` can run many times; creating the future there restarts the request each time." }
      ]
    },

    // ---------------- Advanced ----------------
    {
      id: 'bloc', title: 'State management with Bloc and Cubit', level: 2, mins: 45,
      splits: [['1 · Sealed ProductsState', "import 'package:flutter/foundation.dart';"], ['2 · ProductsCubit', '// ---- Cubit'], ['3 · CartBloc events', '// ---- Bloc'], ['4 · ProductsPage UI', 'class ProductsPage']],
      terms: [
        ['`Cubit` vs `Bloc`', '`Cubit` exposes methods like `load()`; `Bloc` uses an explicit `Event` stream for debouncing, cancelling, and logging.'],
        ['Sealed state classes', 'Models mutually exclusive states (`Loading | Loaded | Failed`) so `switch (state)` checks every screen state at compile time.'],
        ['`BlocSelector`', 'Rebuilds UI only when the selected field of state changes, skipping unrelated updates.']
      ],
      why: "Once multiple screens share data or you want to unit-test business logic without UI, `setState` becomes hard to maintain. Bloc keeps state transitions in their own testable layer with traceable outputs, and it helps to understand how it compares to Provider and Riverpod.",
      points: [
        "UI widgets send user **intents in** and receive **immutable states out** from a stream, keeping business logic outside widgets with no `BuildContext`.",
        "A **Cubit** exposes plain methods that call `emit(newState)` and fits most screens. A **Bloc** takes **events** in `on<Event>` handlers, adding boilerplate while giving you named logs and transformers to debounce, drop, or restart requests.",
        "Model states as a **sealed class** (`loading`, `loaded`, `failed`) or one class with `copyWith` and value equality. If an emitted state equals the previous one, nothing rebuilds, and mutating a list in place hides the change. Write `==` yourself or use `equatable`.",
        "A user can leave a screen before an async fetch finishes and `BlocProvider` closes the cubit. Calling `emit` after `close` throws, so check `isClosed` after every `await`.",
        "Event transformers from `bloc_concurrency` tune concurrency per event type: `restartable()` for live search, `droppable()` to ignore double-taps while busy, and `sequential()` to queue writes in order.",
        "`BlocProvider` creates and closes a bloc for a subtree. `BlocBuilder` rebuilds widgets, `BlocListener` runs one-off effects like snackbars or navigation, and `BlocSelector` plus `buildWhen` narrow rebuild scope.",
        "Call `context.read<T>()` inside callbacks to dispatch actions, and `context.watch<T>()` inside `build` to subscribe to updates. Blocs take injected **repositories** through their constructor.",
        "For comparison: **Provider** pairs dependency injection with mutable `ChangeNotifier` objects and less code. **Riverpod** avoids `BuildContext` with compile-safe dependencies and less boilerplate. **Bloc** writes more code up front in exchange for predictable transitions, dev tooling, and consistent conventions."
      ],
      code: `
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

// ---- State: immutable, one class per situation ----
sealed class ProductsState {
  const ProductsState();
}

class ProductsLoading extends ProductsState {
  const ProductsLoading();
}

class ProductsLoaded extends ProductsState {
  const ProductsLoaded(this.items);
  final List<String> items;

  // Value equality, so emitting the same list twice doesn't rebuild (the equatable package does this for you)
  @override
  bool operator ==(Object other) => other is ProductsLoaded && listEquals(other.items, items);
  @override
  int get hashCode => Object.hashAll(items);
}

class ProductsFailed extends ProductsState {
  const ProductsFailed(this.message);
  final String message;
}

abstract interface class ProductRepository {
  Future<List<String>> fetch();
}

// ---- Cubit: methods in, states out ----
class ProductsCubit extends Cubit<ProductsState> {
  ProductsCubit(this._repo) : super(const ProductsLoading());
  final ProductRepository _repo;

  Future<void> load() async {
    emit(const ProductsLoading());
    try {
      final items = await _repo.fetch();
      if (isClosed) return;                    // the screen was closed while we waited
      emit(ProductsLoaded(items));
    } catch (e) {
      if (isClosed) return;
      emit(const ProductsFailed('Could not load products. Please try again.'));   // not the raw exception
    }
  }
}

// ---- Bloc: events in, states out ----
sealed class CartEvent {
  const CartEvent();
}

class CartItemAdded extends CartEvent {
  const CartItemAdded(this.name);
  final String name;
}

class CartCleared extends CartEvent {
  const CartCleared();
}

class CartBloc extends Bloc<CartEvent, List<String>> {
  CartBloc() : super(const []) {
    on<CartItemAdded>((event, emit) => emit([...state, event.name]));     // a NEW list, never state.add()
    on<CartCleared>((event, emit) => emit(const []));
  }
}

class ProductsPage extends StatelessWidget {
  const ProductsPage({super.key, required this.repo});
  final ProductRepository repo;

  @override
  Widget build(BuildContext context) {
    return MultiBlocProvider(
      providers: [
        BlocProvider(create: (_) => ProductsCubit(repo)..load()),
        BlocProvider(create: (_) => CartBloc()),
      ],
      child: Scaffold(
        appBar: AppBar(
          title: const Text('Products'),
          actions: [
            BlocSelector<CartBloc, List<String>, int>(         // rebuilds only when the count changes
              selector: (cart) => cart.length,
              builder: (context, count) => Padding(
                padding: const EdgeInsets.all(16),
                child: Center(child: Text('Cart: $count')),
              ),
            ),
          ],
        ),
        body: BlocBuilder<ProductsCubit, ProductsState>(
          builder: (context, state) => switch (state) {
            ProductsLoading() => const Center(child: CircularProgressIndicator()),
            ProductsFailed(:final message) => Center(child: Text(message)),
            ProductsLoaded(:final items) => ListView(
                children: [
                  for (final name in items)
                    ListTile(
                      title: Text(name),
                      onTap: () => context.read<CartBloc>().add(CartItemAdded(name)),
                    ),
                ],
              ),
          },
        ),
      ),
    );
  }
}`,
      practice: "Rebuild the product list using `ProductsCubit` backed by `ProductApi`. Add a search field debounced by an event transformer in `SearchBloc`, display failures with `BlocListener`, and check which widgets rebuild when adding an item to the cart.",
      teach: "Explain the difference between a Cubit and a Bloc, and when the extra event layer pays off.",
      analogy: "A Cubit is a vending machine: press a button and get an output. A Bloc is a kitchen with paper order tickets: every request is written down before cooking starts, so you can log history, pause tickets, or replace an older search ticket when a newer one arrives.",
      pitfalls: [
        "Mutating state in place (`state.add(x); emit(state)`) because Bloc treats the identical reference as unchanged and skips rebuilding.",
        "Using `context.watch` inside a callback (subscribes unnecessarily) or `context.read` inside `build` (never updates when state changes).",
        "Putting navigation or snackbars in `BlocBuilder`. Builders run on every frame rebuild; one-off effects belong in `BlocListener`.",
        "Calling `emit` after `await` without checking `isClosed`, causing 'Cannot emit new states after calling close' when a user navigates back early.",
        "Displaying raw `'$e'` exception text in the UI. Keep raw exceptions in logs and store user-friendly messages in state."
      ],
      quiz: [
        { q: "What is the difference between a Cubit and a Bloc?", a: ["A Cubit can't be unit tested", "A Cubit exposes methods; a Bloc receives events and maps them to states", "A Bloc can only hold one state type", "A Cubit rebuilds the whole screen on every change"], c: 1, why: "Both emit states; a Bloc adds an event layer that makes every change traceable and transformable." },
        { q: "A cubit runs `state.items.add(x); emit(state);`. Why does the UI not update?", a: ["`emit` is async", "The emitted state is the same object as before, so it is considered unchanged", "Lists cannot be state", "The cubit is closed"], c: 1, why: "Bloc skips states equal to the current one; mutate nothing and emit a new object." },
        { q: "Where should a snackbar be shown in response to a state change?", a: ["`BlocBuilder`", "`BlocListener`", "`initState`", "Inside the cubit"], c: 1, why: "A listener runs once per state change and is designed for side effects." },
        { q: "A user opens a screen and leaves before the data arrives. The app logs 'Cannot emit new states after calling close'. Fix?", a: ["Never close the cubit", "Check `isClosed` after the `await`, before calling `emit`", "Wrap `emit` in `Future.delayed`", "Use a Bloc instead of a Cubit"], c: 1, why: "`BlocProvider` closes the cubit when the screen goes away; the late response must then be ignored." }
      ]
    },
    {
      id: 'dartdeep', title: 'Dart in depth: generics, mixins, records and patterns', level: 2, mins: 40,
      splits: [['1 · Generics, extensions & mixins', '// Generics with a bound'], ['2 · Sealed Result pattern', '// Sealed classes + patterns'], ['3 · Records & main()', '// Records: lightweight']],
      terms: [
        ['Extension methods & Mixins (`with`)', 'Extensions add helper methods like `context.theme` onto existing types, while mixins share behavior across unrelated classes without inheritance.'],
        ['Sealed Result pattern', 'Encodes `Success<T> | Failure<T>` exhaustively at compile time so callers handle failures without unchecked exceptions.'],
        ['Records & destructuring', 'Lightweight typed tuples (`(double lat, double lng)`) that return multiple named values without extra wrapper classes.']
      ],
      why: "Modern Dart includes sealed classes, pattern matching, records, and extensions. They make state handling exhaustive at compile time and JSON parsing safe without excessive boilerplate.",
      points: [
        "**Generics** keep helpers reusable and type-safe, such as `T largest<T extends Comparable<T>>(List<T> items)`. Bounds (`extends`) declare what operations the function can use.",
        "**Extension methods** add getters and methods to types you don't own, like `'flutter'.capitalized`, resolved statically with zero runtime overhead.",
        "**Mixins** (`with`) reuse behavior across unrelated classes without inheritance, such as `SingleTickerProviderStateMixin` or `ChangeNotifier`.",
        "**Sealed classes** restrict all subtypes to one file, so `switch` expressions check **exhaustiveness**. Add a new state subtype and every unhandled `switch` breaks the build until updated.",
        "**Patterns** match shapes and unpack values in one step: `Success(:final value)`, `when` guards, list and map patterns, and `if (json case {...})` for checking decoded JSON.",
        "**Records** like `(double, double)` or `({int x, int y})` are immutable typed tuples with value equality, letting functions return several values without defining a class."
      ],
      code: `
// Generics with a bound
T largest<T extends Comparable<T>>(List<T> items) => items.reduce((a, b) => a.compareTo(b) >= 0 ? a : b);

// Extension methods add members to existing types
extension StringX on String {
  String get capitalized => isEmpty ? this : this[0].toUpperCase() + substring(1);
}

// Mixins share behavior without inheritance
mixin Logging {
  final List<String> logs = [];
  void log(String message) => logs.add('$runtimeType: $message');
}

class OrderService with Logging {
  void place(int id) => log('placed order $id');
}

// Sealed classes + patterns: the compiler checks that every case is handled
sealed class Result<T> {
  const Result();
}

class Success<T> extends Result<T> {
  const Success(this.value);
  final T value;
}

class Failure<T> extends Result<T> {
  const Failure(this.error);
  final String error;
}

Result<int> parseAge(String input) {
  final n = int.tryParse(input);
  return n != null && n >= 0 ? Success(n) : Failure('not a valid age: $input');
}

String describe(Result<int> result) => switch (result) {
      Success(value: final age) when age >= 18 => 'adult ($age)',
      Success(:final value) => 'minor ($value)',
      Failure(:final error) => 'error: $error',
    };

// Records: lightweight, typed, multiple return values
(double, double) range(List<double> xs) =>
    (xs.reduce((a, b) => a < b ? a : b), xs.reduce((a, b) => a > b ? a : b));

void main() {
  print(largest(['pear', 'apple', 'fig']));        // T is inferred as String
  print('flutter'.capitalized);

  final service = OrderService()..place(7);
  print(service.logs);

  for (final input in ['42', '7', 'abc']) {
    print(describe(parseAge(input)));
  }

  final (low, high) = range([4.5, 1.0, 9.2]);      // destructuring a record
  print('$low..$high');

  final point = (x: 3, y: 4);                      // named fields
  print(point.x + point.y);

  final Object json = {'name': 'Ana', 'tags': ['a', 'b']};
  if (json case {'name': String name, 'tags': [String first, ...]}) {
    print('$name, first tag $first');              // shape and types checked in one step
  }
}`,
      practice: "Model a request state as a sealed class with `Idle`, `Loading`, `Loaded<T>`, and `Failed`, and write a `switch` expression covering all four. Add a fifth subtype so the compiler flags every `switch` to update, then parse nested JSON with one `case` pattern.",
      teach: "Explain how a `sealed` class makes a `switch` exhaustive and what happens at compile time when you add a new subtype.",
      analogy: "A sealed class is a printed menu with a fixed dish list. Because the kitchen knows the full menu, it checks every item has a recipe, and adding a new dish flags missing recipes before opening instead of when a customer orders.",
      pitfalls: [
        "Adding a `default` or wildcard `_` branch to a `switch` over a sealed class, which hides the exact compiler errors that protect you when new states appear.",
        "Using records for domain models that deserve real class names. Records work best for small local groups.",
        "Expecting extension methods to dispatch at run time: Dart picks them from the static type, so they don't work on `dynamic` values."
      ],
      quiz: [
        { q: "What does marking a class `sealed` enable?", a: ["Faster instantiation", "Exhaustive `switch` over its direct subtypes", "Private fields", "Multiple inheritance"], c: 1, why: "All direct subtypes must be in the same library, so the compiler knows the complete set." },
        { q: "What is `(int, String)` in Dart?", a: ["A function type", "A record type: an immutable pair with value equality", "A list", "A syntax error"], c: 1, why: "Records are anonymous, immutable, structurally typed aggregates." },
        { q: "In `Success(:final value) => ...`, what does `:final value` do?", a: ["Declares a constant", "Matches the `value` getter and binds it to a new variable `value`", "Calls a constructor", "Checks for null"], c: 1, why: "It is shorthand for `value: final value` in an object pattern." }
      ]
    },
    {
      id: 'testing', title: 'Testing: unit, widget and integration tests', level: 2, mins: 40,
      terms: [
        ['Unit vs Widget test (`WidgetTester`)', 'Unit tests verify plain Dart and Cubit logic without UI; widget tests run frames fast in a headless VM without an emulator.'],
        ['`pump()` vs `pumpAndSettle()`', '`pump()` advances one frame (useful for inspecting spinners); `pumpAndSettle()` ticks until animations finish.'],
        ['Fake repository injection', 'Replaces real HTTP clients with deterministic fakes returning canned fixtures or errors offline.']
      ],
      why: "Widget tests render a live Flutter tree in milliseconds without spinning up an emulator or phone. Moving logic into Blocs with injected repositories lets you test business rules straight from unit tests.",
      points: [
        "**Unit tests** (`test`) verify pure Dart code such as models, repositories, and cubits, so you can run lots of them fast.",
        "**Widget tests** (`testWidgets`) mount a widget in memory, locate elements, simulate taps, and assert on what renders with no emulator needed.",
        "Use `pumpWidget` to mount, `pump()` to advance one frame, and `pumpAndSettle()` to wait for finite animations. Forgetting to pump after a tap is the most common mistake.",
        "Locate elements the way users find them: `find.text`, `find.byTooltip`, `find.bySemanticsLabel`, or a `Key` when labels don't apply.",
        "Test cubits and blocs via their **state stream** using `expectLater(cubit.stream, emitsInOrder([...]))` or `bloc_test`, passing hand-written fake repositories or `mocktail` mocks.",
        "**Integration tests** (`integration_test`) run the full app on a device or emulator for critical journeys. Golden tests diff rendered pixels against saved reference screenshots."
      ],
      code: `
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_test/flutter_test.dart';

class CounterCubit extends Cubit<int> {
  CounterCubit() : super(0);
  void increment() => emit(state + 1);
}

class CounterView extends StatelessWidget {
  const CounterView({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: BlocBuilder<CounterCubit, int>(builder: (context, count) => Text('Count: $count')),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => context.read<CounterCubit>().increment(),
        tooltip: 'Add',
        child: const Icon(Icons.add),
      ),
    );
  }
}

void main() {
  group('CounterCubit', () {
    test('starts at 0', () {
      expect(CounterCubit().state, 0);
    });

    test('emits 1 then 2 when incremented twice', () async {
      final cubit = CounterCubit();
      final states = expectLater(cubit.stream, emitsInOrder([1, 2]));
      cubit
        ..increment()
        ..increment();
      await states;
      await cubit.close();
    });
  });

  testWidgets('tapping Add shows the new count', (tester) async {
    await tester.pumpWidget(
      MaterialApp(home: BlocProvider(create: (_) => CounterCubit(), child: const CounterView())),
    );
    expect(find.text('Count: 0'), findsOneWidget);

    await tester.tap(find.byTooltip('Add'));
    await tester.pump();                          // let the rebuild happen

    expect(find.text('Count: 1'), findsOneWidget);
    expect(find.text('Count: 0'), findsNothing);
  });
}`,
      practice: "Save this as `test/counter_test.dart` and run `flutter test`. Next, test `ProductsCubit` with a fake repository across success, empty, and error cases, and write a widget test that verifies the error UI and taps Retry.",
      teach: "Explain what `pump()` does in a widget test and why a test fails if you skip it after tapping a button.",
      analogy: "A widget test is a stage rehearsal with a remote control for frames. Actors stay frozen until you press 'next frame' (`pump`), letting you inspect the UI right after a tap or mid-animation.",
      pitfalls: [
        "Asserting right after `tap` without calling `pump()`, before the rebuild has run.",
        "Calling `pumpAndSettle` while an infinite loading spinner is spinning, which hangs until the test times out.",
        "Querying widgets by internal types or deep nesting, so minor UI refactors break tests. Query by visible text or semantics instead."
      ],
      quiz: [
        { q: "What does `await tester.pump()` do?", a: ["Starts the app", "Advances the test clock by one frame so pending rebuilds happen", "Takes a screenshot", "Waits for the network"], c: 1, why: "Test time moves only when you pump frames." },
        { q: "How do you test what a cubit emits?", a: ["Read private fields", "Assert on its `stream` of states, for example with `emitsInOrder`", "Use a widget test only", "It cannot be tested"], c: 1, why: "A cubit's public output is its state stream, which can be asserted directly." },
        { q: "Which test type needs a device or emulator?", a: ["Unit test", "Widget test", "Integration test", "Golden test"], c: 2, why: "Integration tests run the real app; unit and widget tests run in the Dart VM test environment." }
      ]
    },
    {
      id: 'platform', title: 'Persistence, platform channels and adaptive UI', level: 2, mins: 40,
      splits: [['1 · Storage adapter', "import 'package:flutter/foundation.dart';"], ['2 · MethodChannel Battery', '// Talking to native code'], ['3 · AdaptiveShell', 'class AdaptiveShell']],
      terms: [
        ['Repository wrapper over plugins', 'Hides plugins behind your own `SettingsStore` interface so replacing `shared_preferences` or secure storage touches one file.'],
        ['`MethodChannel`', 'Typed async bridge sending serialized messages between Dart and native Kotlin/Swift code.'],
        ['Adaptive breakpoints (`LayoutBuilder`)', 'Renders a bottom `NavigationBar` on narrow phones and a side `NavigationRail` on wider screens from the same widget tree.']
      ],
      why: "Real apps persist data between launches, talk to device features Flutter doesn't include by default, and adjust their layout for phones, tablets, and web browsers.",
      points: [
        "Pick storage for the job: `shared_preferences` (`SharedPreferencesAsync` API, since legacy `SharedPreferences` is deprecated) for small settings, `flutter_secure_storage` (Keychain/Keystore) for tokens, and `sqflite` or `drift` for structured offline data.",
        "Secure storage depends on platform hardware. Web builds lack a native keystore and fall back to browser storage, so avoid keeping long-lived secrets in web clients.",
        "Wrap storage plugins inside your own class so UI and cubit code depend on *your* interface rather than third-party plugin APIs.",
        "**Platform channels** send messages between Dart and native Kotlin or Swift code. Calling `MethodChannel.invokeMethod` is async and can fail, so catch `PlatformException` and `MissingPluginException` and check pub.dev before writing custom channels.",
        "**Adaptive layouts** switch based on available width rather than OS checks, pairing `NavigationBar` on narrow screens with `NavigationRail` on wider ones and wrapping screens in `SafeArea` to clear notches and system bars.",
        "Check `defaultTargetPlatform` and `kIsWeb` for platform-specific behavior, and read text scaling and dark mode from `MediaQuery` and `ThemeData`.",
        "Operating systems pause and resume mobile apps. Use `AppLifecycleListener` to flush unsaved state, pause streams, and refresh stale data on resume, and request permissions only when the feature needs them."
      ],
      code: `
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:shared_preferences/shared_preferences.dart';

// Your own interface over the plugin: the rest of the app never imports shared_preferences.
class SettingsStore {
  SettingsStore(this._prefs);
  final SharedPreferencesAsync _prefs;            // the current API; reads go to the platform each time
  static const _darkKey = 'dark_mode';

  Future<bool> darkMode() async => await _prefs.getBool(_darkKey) ?? false;
  Future<void> setDarkMode(bool value) => _prefs.setBool(_darkKey, value);
}

// Talking to native code (Kotlin / Swift) over a platform channel.
class Battery {
  static const _channel = MethodChannel('shop.example/battery');

  Future<int?> level() async {
    try {
      return await _channel.invokeMethod<int>('getBatteryLevel');
    } on PlatformException {
      return null;                 // the native side reported an error
    } on MissingPluginException {
      return null;                 // not implemented on this platform
    }
  }
}

class AdaptiveShell extends StatelessWidget {
  const AdaptiveShell({super.key, required this.index, required this.onSelect, required this.child});
  final int index;
  final ValueChanged<int> onSelect;
  final Widget child;

  static const _items = [(Icons.store, 'Shop'), (Icons.shopping_cart, 'Cart'), (Icons.person, 'Account')];

  @override
  Widget build(BuildContext context) {
    final wide = MediaQuery.sizeOf(context).width >= 600;       // decide by space, not by device
    if (wide) {
      return Scaffold(
        body: SafeArea(                                 // landscape phones have notches too
          child: Row(
            children: [
              NavigationRail(
                selectedIndex: index,
                onDestinationSelected: onSelect,
                labelType: NavigationRailLabelType.all,
                destinations: [
                  for (final (icon, label) in _items) NavigationRailDestination(icon: Icon(icon), label: Text(label)),
                ],
              ),
              Expanded(child: child),
            ],
          ),
        ),
      );
    }
    return Scaffold(
      body: SafeArea(child: child),
      bottomNavigationBar: NavigationBar(
        selectedIndex: index,
        onDestinationSelected: onSelect,
        destinations: [
          for (final (icon, label) in _items) NavigationDestination(icon: Icon(icon), label: label),
        ],
      ),
    );
  }
}

String platformName() => kIsWeb
    ? 'web'
    : switch (defaultTargetPlatform) {
        TargetPlatform.iOS || TargetPlatform.macOS => 'apple',
        TargetPlatform.android => 'android',
        _ => 'desktop',
      };`,
      practice: "Persist dark mode and cart items across app restarts. Switch navigation between a bottom bar and a side rail at 600 px width and test by resizing the web build, then inspect a camera or location plugin on pub.dev to see its iOS and Android permission setup.",
      teach: "Explain what a platform channel is and why calling one is asynchronous and can fail.",
      analogy: "A platform channel is a courier between two offices speaking different languages. You hand over a note asking for battery level, wait asynchronously for a reply, or get a note back saying nobody handles that request.",
      pitfalls: [
        "Saving access tokens in `shared_preferences`, which stores plain text on disk. Use secure storage on mobile (and avoid storing long-lived secrets on web).",
        "Choosing layouts from `Platform.isAndroid` instead of available width, which breaks tablets, foldables, and resized desktop windows.",
        "Prompting for every device permission at startup instead of asking in context and handling denial."
      ],
      quiz: [
        { q: "Where should an auth token be stored on the device?", a: ["`shared_preferences`", "Secure storage backed by Keychain / Keystore", "A global variable", "A text file in documents"], c: 1, why: "Preferences are unencrypted; the platform keystores are designed for secrets." },
        { q: "What should decide between a bottom navigation bar and a navigation rail?", a: ["The operating system", "The available width", "The Flutter version", "The device brand"], c: 1, why: "Layout should respond to space; the same device can be narrow or wide." },
        { q: "What does a `MethodChannel` call return?", a: ["A value, synchronously", "A `Future` that may complete with an error", "A `Stream` always", "Nothing"], c: 1, why: "Messages cross to native code asynchronously and the native side can fail or be missing." }
      ]
    },

    // ---------------- Expert ----------------
    {
      id: 'render', title: 'Rendering internals, performance and isolates', level: 3, mins: 45, viz: 'threetrees',
      splits: [['1 · Isolate worker', "import 'package:flutter/foundation.dart';"], ['2 · CustomPainter Sparkline', '// Custom painting'], ['3 · Feed & Keys', 'class Feed']],
      terms: [
        ['Three trees (Widget / Element / RenderObject)', 'Widgets are disposable configs, Elements hold tree identity and `State`, and RenderObjects compute layout and paint pixels.'],
        ['Isolate (`Isolate.run(...)`)', 'Runs heavy JSON parsing or cryptography in separate worker memory so the UI isolate stays under its 8–16 ms frame budget.'],
        ['`Key` identity (`ValueKey(id)`)', 'Keeps stateful elements tied to their matching data item when list rows reorder, insert, or get dismissed.']
      ],
      predict: {
        prompt: 'A `StatefulWidget` list shows items `[A, B, C]` without `Key`s, and you insert `X` at index 0 (`[X, A, B, C]`). Which `State` object does `A` end up paired with?',
        options: ['`A` keeps its own `State` automatically by text value', '`A` inherits `B`\'s old slot/State (`index` shifted without keys)', 'Flutter throws an error unless `UniqueKey` is present'],
        answer: 1,
        explain: 'Without keys, Flutter matches Element slots by widget type and index (`[0, 1, 2]`). Inserting at index 0 shifts old slot state down the list unless each row carries `ValueKey(item.id)`.'
      },
      why: "Smooth scrolling demands finishing each frame in 16 ms on 60 Hz screens, or 8 ms at 120 Hz. Knowing what runs inside a frame, how to read DevTools, and which of the three trees owns a bug helps you fix frame drops.",
      points: [
        "Flutter manages **three trees**: **widgets** (cheap immutable configs rebuilt often), **elements** (long-lived nodes holding `State` and pairing old widgets to new ones), and **render objects** (layout and painting).",
        "On rebuild, an element compares `runtimeType` and `key` between the old and new widget. When both match, it updates in place; otherwise Flutter discards that subtree and its `State`.",
        "Each frame runs **build -> layout -> paint -> composite** on the UI thread, then the raster thread draws it using **Impeller** (default on iOS and Android), which precompiles shaders to avoid first-frame stutter. Frames missing the deadline on either thread cause jank.",
        "Cut rebuilds with `const` constructors, pushing state down, `BlocSelector`/`buildWhen`, and lazy `ListView.builder`. Use `RepaintBoundary` only around fast-changing custom areas (list builders already wrap each item).",
        "Dart isolates don't share memory and talk by message passing. Move heavy parsing or image work onto a background isolate with `compute` or `Isolate.run`, passing only the payload it needs rather than whole app state.",
        "Browsers don't have Dart isolates: `Isolate.run` throws on web, whereas `compute` falls back to the main thread so the app keeps working (though heavy work still blocks UI frames during it).",
        "Always profile in **profile mode** on real hardware, never debug mode, using Flutter DevTools' performance overlay, frame chart, 'Track widget rebuilds', and memory tab."
      ],
      code: `
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';

// CPU-bound work: must not run on the UI isolate.
int slowChecksum(List<int> data) {
  var sum = 0;
  for (var round = 0; round < 200; round++) {
    for (final n in data) {
      sum = (sum * 31 + n) & 0x7fffffff;
    }
  }
  return sum;
}

class ChecksumButton extends StatefulWidget {
  const ChecksumButton({super.key});

  @override
  State<ChecksumButton> createState() => _ChecksumButtonState();
}

class _ChecksumButtonState extends State<ChecksumButton> {
  int? _result;
  bool _busy = false;

  Future<void> _run() async {
    setState(() => _busy = true);
    final data = List<int>.generate(500000, (i) => i);
    final value = await compute(slowChecksum, data);    // another isolate on mobile and desktop; main thread on the web
    if (!mounted) return;
    setState(() {
      _busy = false;
      _result = value;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        if (_busy) const CircularProgressIndicator() else Text('Checksum: \${_result ?? '—'}'),
        FilledButton(onPressed: _busy ? null : _run, child: const Text('Compute')),
      ],
    );
  }
}

// Custom painting: repaint only when the data actually changed.
class Sparkline extends CustomPainter {
  Sparkline(this.values);
  final List<double> values;

  @override
  void paint(Canvas canvas, Size size) {
    if (values.length < 2) return;
    final max = values.reduce((a, b) => a > b ? a : b);
    final step = size.width / (values.length - 1);
    final path = Path()..moveTo(0, size.height * (1 - values.first / max));
    for (var i = 1; i < values.length; i++) {
      path.lineTo(i * step, size.height * (1 - values[i] / max));
    }
    canvas.drawPath(path, Paint()..style = PaintingStyle.stroke..strokeWidth = 2);
  }

  @override
  bool shouldRepaint(Sparkline oldDelegate) => oldDelegate.values != values;
}

class Feed extends StatelessWidget {
  const Feed({super.key, required this.items});
  final List<String> items;

  @override
  Widget build(BuildContext context) {
    return ListView.builder(                    // builds only the rows on screen, each with its own RepaintBoundary
      itemCount: items.length,
      itemExtent: 72,                           // fixed height: layout does not measure each row
      itemBuilder: (context, i) => ListTile(key: ValueKey(items[i]), title: Text(items[i])),
    );
  }
}`,
      practice: "On an Android emulator or desktop build, run `slowChecksum` straight on the UI isolate while a spinner animates and watch it freeze, then move it to `compute` and compare with a web build. Open DevTools in profile mode, toggle 'Track widget rebuilds', scroll a long list, and eliminate one redundant rebuild.",
      teach: "Explain the roles of the widget, element, and render object trees, and identify which one holds `State`.",
      analogy: "Widgets are architect drawings redrawn after every edit. Elements are site supervisors who stay on site comparing new drawings to old ones and keeping state intact. Render objects are concrete walls, touched only when a supervisor finds a real change.",
      pitfalls: [
        "Benchmarking performance in debug mode, which runs much slower than profile or release builds.",
        "Running heavy JSON parsing or image work inside `build` or on the UI isolate while sprinkling `const` around to compensate.",
        "Wrapping every widget in `RepaintBoundary`. Each boundary adds a GPU layer and memory, so place them only where the profiler flags repaint hotspots.",
        "Using `Isolate.run` in an app targeting web, where it throws. Use `compute` or branch on `kIsWeb`."
      ],
      quiz: [
        { q: "Which tree holds a `StatefulWidget`'s `State` across rebuilds?", a: ["The widget tree", "The element tree", "The render tree", "None (State is global)"], c: 1, why: "Elements outlive individual rebuilds and own `State`, whereas widgets are recreated often." },
        { q: "When does an element reuse its State for a new widget?", a: ["Always", "When the new widget has the same runtime type and key", "Never", "Only for `const` widgets"], c: 1, why: "Matching type and key means update in place; otherwise the old subtree is unmounted." },
        { q: "Why use `compute` for a large JSON parse?", a: ["It parses on the GPU", "It runs on another isolate, so the UI isolate keeps rendering frames", "It caches the parsed result for next time", "It streams the JSON instead of parsing it"], c: 1, why: "Isolates don't share memory or a thread, so the UI stays responsive while the work runs (except on the web, where `compute` runs on the main thread)." }
      ]
    },
    {
      id: 'arch', title: 'Architecture, flavors and release', level: 3, mins: 45,
      splits: [['1 · Config & Domain', "import 'package:flutter/foundation.dart';"], ['2 · Data & Cubit layers', '// Data: one implementation'], ['3 · Error boundary & main()', 'void main()']],
      terms: [
        ['`--dart-define` environment config', 'Passes staging or production API URLs into `const String.fromEnvironment(...)` at compile time instead of putting secrets in git.'],
        ['Feature-first layered boundary', 'Separates pure Dart Domain entities from Data API clients and Presentation Cubits within each feature folder.'],
        ['Zone / `PlatformDispatcher.onError`', 'Global error hook forwarding uncaught async and framework exceptions to crash reporting services.']
      ],
      why: "Mobile releases work differently from web deploys. You can't push a hotfix in seconds, users stay on older app versions for months, and app stores review every binary. Clear layering, build flavors, and release checks matter much more.",
      points: [
        "Layer each feature as **presentation** (widgets and blocs) -> **domain** (plain Dart models and repository interfaces) -> **data** (API clients and databases). Dependencies point inward, and domain imports zero Flutter packages.",
        "Group code by **feature** (`features/cart/...`) containing those layers. Wire concrete implementations once in your composition root using `RepositoryProvider` or `get_it`.",
        "Configure environments via `--dart-define` or **flavors** (`dev`, `staging`, `prod`) with distinct app IDs, icons, and API URLs. Never embed secrets inside the binary, because shipped binaries can be unpacked.",
        "Catch uncaught crashes globally: wire both `FlutterError.onError` (framework errors) and `PlatformDispatcher.instance.onError` (async errors) to your crash reporting service.",
        "For release builds, sign `flutter build appbundle` or `flutter build ipa` in CI after tests and analysis pass, bump build numbers, ship in staged rollouts, and save symbol files when using `--obfuscate --split-debug-info`.",
        "Design for older installed versions with backward-compatible APIs, minimum-version gates, and remote feature flags. Verify accessibility labels, contrast, and text scaling before marking a feature finished."
      ],
      code: `
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

// Build-time configuration: flutter run --dart-define=API_URL=https://staging.example.com
class AppConfig {
  const AppConfig({required this.apiUrl, required this.flavor});
  final String apiUrl;
  final String flavor;

  static const fromEnvironment = AppConfig(
    apiUrl: String.fromEnvironment('API_URL', defaultValue: 'http://localhost:5000'),
    flavor: String.fromEnvironment('FLAVOR', defaultValue: 'dev'),
  );
}

// Domain: plain Dart, nothing here depends on Flutter.
class Order {
  const Order(this.id, this.total);
  final int id;
  final double total;
}

abstract interface class OrderRepository {
  Future<List<Order>> recent();
}

// Data: one implementation per source (HTTP, database, fake).
class FakeOrderRepository implements OrderRepository {
  @override
  Future<List<Order>> recent() async => const [Order(1, 120), Order(2, 45.5)];
}

// Presentation: the cubit depends on the abstraction only.
class OrdersCubit extends Cubit<List<Order>> {
  OrdersCubit(this._orders) : super(const []);
  final OrderRepository _orders;

  Future<void> load() async => emit(await _orders.recent());
}

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  // Report everything that escapes to a crash service in a real app.
  FlutterError.onError = (details) => debugPrint('framework error: \${details.exceptionAsString()}');
  PlatformDispatcher.instance.onError = (error, stack) {
    debugPrint('uncaught: $error');
    return true;
  };

  const config = AppConfig.fromEnvironment;
  runApp(
    RepositoryProvider<OrderRepository>(
      create: (_) => FakeOrderRepository(),            // composition root: the one place that picks implementations
      child: BlocProvider(
        create: (context) => OrdersCubit(context.read<OrderRepository>())..load(),
        child: MaterialApp(
          debugShowCheckedModeBanner: config.flavor != 'prod',
          home: Scaffold(
            appBar: AppBar(title: Text('Orders (\${config.flavor})')),
            body: BlocBuilder<OrdersCubit, List<Order>>(
              builder: (context, orders) => ListView(
                children: [
                  for (final order in orders)
                    Semantics(
                      label: 'Order \${order.id}, total \${order.total.toStringAsFixed(2)}',
                      child: ListTile(
                        title: Text('Order \${order.id}'),
                        trailing: Text(order.total.toStringAsFixed(2)),
                      ),
                    ),
                ],
              ),
            ),
          ),
        ),
      ),
    ),
  );
}`,
      practice: "Reorganize your app into `features/<name>/{data,domain,presentation}` and wire dev and prod configs with separate API URLs and app names. Add CI steps running `flutter analyze`, `flutter test`, and a release build, then write a rollout checklist for shipping v1.0.1 with a schema change.",
      teach: "Explain why a mobile app must remain compatible with older versions of itself when a website doesn't have to.",
      analogy: "A website is a restaurant menu you can swap before dinner service. A mobile app is a printed cookbook already sitting in thousands of kitchens: you can publish a second edition, but readers keep cooking from the first, so your API has to keep serving older editions.",
      pitfalls: [
        "Compiling API secrets into client binaries. Anyone can extract constants from a shipped bundle, so keep secrets on the server.",
        "Shipping breaking backend changes that crash older app versions still installed on users' phones.",
        "Misplacing debug symbol files for obfuscated builds, leaving production crash logs unreadable."
      ],
      quiz: [
        { q: "In a layered Flutter app, what may the domain layer import?", a: ["Flutter widgets", "The HTTP client", "Only plain Dart (no Flutter, no data sources)", "Everything"], c: 2, why: "Dependencies point inward; the domain defines models and interfaces that outer layers implement." },
        { q: "Why must secrets not be placed in `--dart-define` values for a release build?", a: ["They slow the app down", "They are compiled into the binary and can be extracted", "The stores scan for them and reject the app", "They're only available in debug builds"], c: 1, why: "Client binaries are public; real secrets belong on the server. Obfuscation makes them harder to find, not hidden." },
        { q: "What does `PlatformDispatcher.instance.onError` catch?", a: ["Layout overflow only", "Uncaught asynchronous errors outside the Flutter framework's callbacks", "Compile errors", "HTTP 500 responses"], c: 1, why: "`FlutterError.onError` covers framework-caught errors; the dispatcher hook covers the rest." }
      ]
    }
  ]
});
