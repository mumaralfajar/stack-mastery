// Dart + Flutter track. Every code sample is a complete file checked by tools/verify-dart.mjs.
// Inside these template literals a Dart "${" must be written "\${".
TRACKS.push({
  id: 'flutter', name: 'Dart + Flutter', lang: 'dart',
  tagline: 'The mobile app: the Dart language, widgets, state with Bloc, testing and shipping to real devices.',
  lessons: [
    // ---------------- Beginner ----------------
    {
      id: 'dart', title: 'Dart essentials: types, null safety and functions', level: 0, mins: 30,
      why: "Flutter apps are written in Dart, and Dart was designed for exactly that job. If you know C# or TypeScript, most of it will look familiar — the parts that differ (sound null safety, named parameters, `final` versus `const`) are the parts every Flutter file uses.",
      points: [
        "Dart is statically typed with inference: `var age = 30` is an `int` forever. Core types are `int`, `double`, `num`, `bool`, `String`, `List`, `Map`, `Set`.",
        "`final` can be assigned once at run time; `const` is a compile-time constant. Default to `final`; Flutter uses `const` widgets heavily to skip work.",
        "**Sound null safety**: `String` can never be null; `String?` may be. The compiler refuses to use a nullable value until you have handled the null case.",
        "Null-aware operators: `a ?? b` (fallback), `a?.length` (access if not null), `a ??= b` (assign if null). Avoid `a!` — it throws at run time if you were wrong.",
        "Functions are values. **Named parameters** in `{}` are optional unless marked `required`, and they are how every Flutter widget is configured: `Text('Hi', maxLines: 2)`.",
        "String interpolation uses `$name` and `\${expression}`. `/` always returns a `double`; use `~/` for integer division."
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
      practice: "Open DartPad (the Dart playground in this program). Write `String describe(String name, {int? age, String city = 'unknown'})` that returns a sentence, handling a missing age without using `!`. Call it three ways. Then change a `String` variable to hold `null` and read the compiler's message.",
      teach: "Explain the difference between `String` and `String?`, and why Dart refuses to compile `nickname.length` when `nickname` is a `String?`.",
      analogy: "A non-nullable type is a parking space that is guaranteed to hold a car. A nullable type is a space that might be empty — and the attendant (the compiler) will not let you open the car door until you have looked and confirmed a car is actually there.",
      pitfalls: [
        "Scattering `!` to silence the compiler. Each one is a possible crash; handle the null case with `??`, `?.` or an `if`.",
        "Confusing `final` and `const`: `final now = DateTime.now()` is fine, `const now = DateTime.now()` is not — the value is not known at compile time.",
        "Expecting `7 / 2` to be `3` as in C#. In Dart `/` always produces a `double`."
      ],
      quiz: [
        { q: "What is the type of `x` in `var x = 5;`?", a: ["`dynamic`", "`int`, inferred and fixed", "`num`", "`Object?`"], c: 1, why: "Dart infers `int` from the initializer; the variable can never hold another type." },
        { q: "What does `name ?? 'Guest'` evaluate to when `name` is null?", a: ["null", "`'Guest'`", "It throws", "`name`"], c: 1, why: "`??` returns its right side when the left side is null." },
        { q: "Which declaration is a compile-time constant?", a: ["`final a = DateTime.now();`", "`var a = 3;`", "`const a = 3;`", "`late int a;`"], c: 2, why: "`const` values must be known at compile time and are canonicalized." }
      ]
    },
    {
      id: 'dartoop', title: 'Classes, collections and immutability', level: 0, mins: 30,
      why: "Every Flutter widget is a class and every screen is built from lists and maps of data. Immutable model classes with value equality are also what make state management — and Bloc in particular — predictable.",
      points: [
        "A class has `final` fields and a constructor. **Initializing formals** (`this.name`) and **named, required parameters** keep constructors short and call sites readable.",
        "A `const` constructor lets instances be created at compile time. There is no `public`/`private` keyword: a leading underscore (`_count`) makes a member private to its library.",
        "Model objects should be **immutable**: all fields `final`, changes made by creating a copy with `copyWith`.",
        "Dart compares objects by identity unless you override `==` and `hashCode`. Value equality is required for state comparison; the `equatable` package or code generation removes the boilerplate.",
        "Collections: `List` (ordered), `Set` (unique), `Map` (key → value). `where` and `map` are lazy like LINQ: they return an `Iterable` that does nothing until you loop over it or call `toList()`. `fold`, `any` and `firstWhere` run straight away and return a value.",
        "**Collection `if` and `for`** build lists declaratively — `[for (final p in items) if (p.inStock) p.name]` — and are the idiomatic way to build widget lists."
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
      practice: "Write an immutable `CartItem` (product, quantity) with `copyWith` and value equality, and a function that returns a new list with one item's quantity increased. Prove the original list is unchanged, and that two equal items are `==`.",
      teach: "Explain why two `Product` objects with the same field values are not equal by default, and what you must write to change that.",
      analogy: "An immutable object is a printed receipt: nobody edits it, they issue a corrected copy. Because the old receipt never changes, anyone holding it — a widget, a test, a log — can trust what it says. `copyWith` is the till printing that corrected copy.",
      pitfalls: [
        "Overriding `==` without `hashCode`. Equal objects must have equal hash codes or they misbehave in sets and maps.",
        "Mutating a list that is part of state (`items.add(x)`) instead of creating a new one — nothing that compares old and new state can see the change.",
        "Forgetting that `where` and `map` are lazy: the work is repeated every time you loop over the result, unless you call `toList()` once."
      ],
      quiz: [
        { q: "How do you make a member private in Dart?", a: ["The `private` keyword", "Start its name with an underscore", "Put it in a `#region`", "Mark it `@hidden`"], c: 1, why: "Privacy is per library and is signalled by a leading underscore." },
        { q: "Two instances of a class with identical fields, created with `new`-style calls (not `const`), are compared with `==`. By default the result is…", a: ["true", "false, unless they are the same instance", "a compile error", "true if the class has a `toString`"], c: 1, why: "Default equality is identity. Override `==` and `hashCode` for value equality. (Two identical `const` expressions are the same instance, so they would compare equal even without an override.)" },
        { q: "What does `[for (final n in [1, 2, 3]) if (n.isOdd) n * 10]` produce?", a: ["`[10, 20, 30]`", "`[10, 30]`", "`[1, 3]`", "A syntax error"], c: 1, why: "Collection `for` and `if` build the list from the odd elements, transformed." }
      ]
    },
    {
      id: 'widgets', title: 'Flutter: widgets and the widget tree', level: 0, mins: 30,
      why: "In Flutter everything on screen is a widget, and the UI is a tree of them described in code. Once you see `build` as a function from data to a description of the screen — the same idea as a React component — the framework stops being mysterious.",
      points: [
        "A **widget** is an immutable description of part of the UI. Flutter turns the tree of widgets into pixels; you never modify the screen directly.",
        "A `StatelessWidget` has final fields (its inputs) and a `build` method that returns more widgets. It is the equivalent of a React function component with props.",
        "`runApp` attaches the root widget. `MaterialApp` provides theming and navigation; `Scaffold` provides the page skeleton: app bar, body, floating button.",
        "**Composition over inheritance**: you build UIs by nesting small widgets — `Padding`, `Center`, `Text`, `Icon` — not by subclassing big ones.",
        "Mark widgets `const` wherever possible. A `const` widget is created once and Flutter can skip rebuilding it.",
        "`BuildContext` is a widget's location in the tree. It is how you look things up from above: `Theme.of(context)`, `MediaQuery.sizeOf(context)`, `Navigator.of(context)`."
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
      practice: "Run `flutter create shop` and replace `lib/main.dart` with this code. Add a third product, then extract the price text into its own `PriceLabel` widget. Use hot reload after each change and note what is preserved.",
      teach: "Explain what a widget is and what `build` returns, to someone who knows HTML or React.",
      analogy: "A widget is a blueprint, not a building. Every time something changes you hand Flutter a fresh set of blueprints; Flutter compares them with the previous set and only rebuilds the rooms that actually differ. Blueprints are cheap, which is why you can redraw them constantly.",
      pitfalls: [
        "Trying to change a widget after creating it. Widgets are immutable; you describe a new tree instead.",
        "One enormous `build` method. Extract small widget classes — it is clearer and lets Flutter rebuild less.",
        "Extracting UI into helper *methods* instead of widgets: methods cannot be `const` and always rebuild with their parent."
      ],
      quiz: [
        { q: "What does a `StatelessWidget`'s `build` method return?", a: ["A `RenderObject` that paints itself", "A widget (a description of UI)", "A `State` object", "An `Element`"], c: 1, why: "`build` returns another widget tree that describes this part of the screen. Flutter creates the elements and render objects from it." },
        { q: "Why add `const` to a widget constructor call?", a: ["It makes the widget immutable", "The instance is canonical, so Flutter can skip rebuilding it", "It's required for widgets with no fields", "It keeps the widget's State across hot reload"], c: 1, why: "Identical `const` widgets are the same object, so the framework knows nothing changed. Widgets are immutable either way." },
        { q: "What is `BuildContext`?", a: ["The app's global state", "A handle to the widget's position in the tree", "The device screen", "A network client"], c: 1, why: "It lets a widget look up ancestors such as the theme, media query and navigator." }
      ]
    },
    {
      id: 'layout', title: 'Layout: rows, columns and constraints', level: 0, mins: 35, viz: 'constraints',
      why: "Almost every Flutter layout bug — the yellow-and-black overflow stripes, 'unbounded height', a widget that ignores its size — is one rule misunderstood. Once you know the rule, the error messages start to make sense.",
      points: [
        "The one rule: **constraints go down, sizes go up, the parent sets the position**. A parent tells each child its minimum and maximum size; the child picks a size within them; the parent places it.",
        "`Row` lays children out horizontally, `Column` vertically. `mainAxisAlignment` works along that direction, `crossAxisAlignment` across it — the same model as flexbox.",
        "`Expanded` makes a child fill the remaining space on the main axis; `Flexible` lets it take up to that much. Without one, a too-wide child overflows.",
        "`SizedBox` gives a fixed size or a gap, `Padding` adds space inside, `Container` combines size, padding, decoration and alignment.",
        "`ListView` and `GridView` scroll and build lazily with `.builder`. Inside a `Column` they need bounded height — wrap them in `Expanded`.",
        "Responsive layouts use `LayoutBuilder` (the space this widget was given) or `MediaQuery.sizeOf(context)` (the whole screen) to choose a layout."
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
      practice: "Remove the `Expanded` around the `Column` and give the card a very long description: read the overflow error. Put it back. Then place a `ListView` directly inside a `Column`, read the 'unbounded height' error, and fix it with `Expanded`.",
      teach: "Explain 'constraints go down, sizes go up, parent sets position' using a `Row` that contains a `Text` wrapped in `Expanded`.",
      analogy: "Layout is packing a suitcase with a fussy traveller. The parent says 'you may be between 0 and 300 wide'. The child answers 'I will be 120'. The parent then decides where in the suitcase to put it. A child never chooses its own position, and never gets more room than it was offered.",
      pitfalls: [
        "A `Row` with a long `Text` and no `Expanded` or `Flexible` — the text is given infinite width and overflows.",
        "A scrollable (`ListView`) inside a `Column` without `Expanded`: the column offers unbounded height and the list cannot size itself.",
        "Reaching for fixed pixel sizes everywhere instead of letting flexible widgets adapt to the screen.",
        "An `IconButton` with no `tooltip`: screen readers just say 'button', and there's no hint on long-press or hover."
      ],
      quiz: [
        { q: "In a `Row`, which property aligns children vertically?", a: ["`mainAxisAlignment`", "`crossAxisAlignment`", "`textAlign`", "`alignment`"], c: 1, why: "A row's main axis is horizontal, so the cross axis is vertical." },
        { q: "What does `Expanded` do inside a `Row`?", a: ["Makes the child scroll", "Makes the child fill the remaining main-axis space", "Adds padding", "Centers the child"], c: 1, why: "It gives the child a tight constraint equal to the leftover space." },
        { q: "Which statement describes Flutter layout?", a: ["Children choose their own position", "Constraints go down, sizes go up, the parent sets the position", "Sizes go down, constraints go up", "Everything is absolutely positioned"], c: 1, why: "A single pass passes constraints down and sizes back up; parents position children." }
      ]
    },

    // ---------------- Intermediate ----------------
    {
      id: 'async', title: 'Async Dart: Future, Stream and the event loop', level: 1, mins: 35,
      why: "Network calls, file access, user input and Bloc itself are all asynchronous in Flutter. `Future` is one value later; `Stream` is many values over time — and state management is built on streams.",
      points: [
        "A `Future<T>` is a value that arrives later. `await` pauses the `async` function without blocking the UI thread, exactly like C# and TypeScript.",
        "Start independent work first, then await it together: `Future.wait([...])` for a list, or a record, `await (fetchUser(1), fetchOrders()).wait`, which keeps each result's own type. Handle failures with `try`/`catch`, and give network calls a `.timeout(...)`: it stops you *waiting*, though the request itself carries on.",
        "A `Stream<T>` delivers a sequence of values over time: taps, WebSocket messages, state changes. Consume with `await for` or `listen`; produce with `async*` and `yield` or a `StreamController`.",
        "Always cancel a `StreamSubscription` and close a `StreamController` when you are done — a forgotten subscription is a memory leak.",
        "Dart runs your code on **one thread with an event loop**: finish the current synchronous code, drain the **microtask queue**, then take one **event** (timer, I/O, tap).",
        "Long synchronous work therefore freezes the UI. CPU-heavy work belongs in another **isolate** — covered in the rendering lesson."
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
      practice: "Predict the last four lines of output before running this in DartPad. Then write a `Stream<String>` that emits a search query only after the user has stopped typing for 300 ms (a debounce), using a `StreamController` and a `Timer`.",
      teach: "Explain the difference between a `Future` and a `Stream`, with one real example of each from a mobile app.",
      analogy: "A `Future` is a parcel delivery: one box, arriving once, possibly with a failure notice instead. A `Stream` is a magazine subscription: issues keep arriving until someone cancels — and if you move house without cancelling, they pile up on a doorstep forever.",
      pitfalls: [
        "Forgetting `await`: the function continues immediately and errors are lost.",
        "Awaiting independent calls one after another when `Future.wait` would overlap them.",
        "Listening to a stream and never cancelling the subscription when the widget is disposed.",
        "Expecting `.timeout()` to cancel the work. It only stops the waiting; the HTTP request still runs to the end in the background."
      ],
      quiz: [
        { q: "A `Future` completes ___; a `Stream` can emit ___.", a: ["many times; once", "once; many values over time", "once; one value, but later than a future", "once per listener; once per listener"], c: 1, why: "A future is a single asynchronous result; a stream is a sequence of them." },
        { q: "In what order do `scheduleMicrotask` and `Timer.run` callbacks execute after the current synchronous code?", a: ["Timer first", "Microtask first", "Whichever was scheduled first", "In parallel"], c: 1, why: "The microtask queue is drained completely before the next event is taken." },
        { q: "Two independent 300 ms calls. Fastest correct approach?", a: ["`await` each in turn", "`await Future.wait([a(), b()])`", "Call them without `await` and hope they finish", "`await` each one inside a `for` loop"], c: 1, why: "Both futures are started before awaiting, so the waits overlap. Without `await` at all, you never see the results or the errors." }
      ]
    },
    {
      id: 'state', title: 'State: StatefulWidget, setState and lifecycle', level: 1, mins: 35, viz: 'frebuild',
      why: "State is what changes while the app runs. `setState` is the simplest tool and the foundation every state management library is built on — you cannot understand Bloc's rebuilds without understanding these.",
      points: [
        "A `StatefulWidget` is still immutable; the mutable data lives in a separate **`State` object** that survives rebuilds.",
        "`setState(() { ... })` changes the data and marks the widget dirty; Flutter calls `build` again for that widget **and its whole subtree**.",
        "Lifecycle: `initState` (once, set up), `didUpdateWidget` (the parent passed new inputs), `dispose` (once, clean up controllers, timers and subscriptions).",
        "**Lifting state up**: when two widgets need the same data, the common parent owns it, passes the value down and receives changes through a callback (`ValueChanged<T>`).",
        "Keep state as low in the tree as possible so a change rebuilds as little as possible. Extract the changing part into its own small widget.",
        "A **`Key`** tells Flutter which State belongs to which widget when siblings are reordered or removed. Lists of stateful items need a `ValueKey`."
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
      practice: "Build a screen with two `Quantity` widgets and a total. Decide where the two values must live and wire them up. Then change `_count++` to run outside `setState` and explain why the screen stops updating.",
      teach: "Explain why the mutable data lives in a `State` object rather than in the `StatefulWidget` itself.",
      analogy: "The widget is a job description; the State is the employee doing the job. Management reissues the job description constantly — new title, new instructions — but the same employee stays at the desk with everything they remember. `dispose` is the employee's last day: hand back the keys.",
      pitfalls: [
        "Changing a field without calling `setState` — the data changes but nothing rebuilds.",
        "Forgetting `dispose` for controllers, animation controllers and stream subscriptions.",
        "Calling `setState` after the widget is gone (after an `await`). Check `mounted` first."
      ],
      quiz: [
        { q: "What does calling `setState` cause?", a: ["The whole app restarts", "`build` runs again for that widget and its subtree", "Only the changed `Text` is redrawn by hand", "`initState` runs again"], c: 1, why: "The element is marked dirty and rebuilt on the next frame; Flutter then updates only what differs." },
        { q: "Where should a `TextEditingController` be disposed?", a: ["In `build`", "In `dispose` of the State", "Never", "In `initState`"], c: 1, why: "`dispose` runs once when the State is removed permanently — the place to release resources." },
        { q: "Why give list items a `ValueKey`?", a: ["For styling", "So Flutter matches each State to the right item when the list is reordered", "To make them `const`", "It is required by `ListView`"], c: 1, why: "Without keys, state is matched by position and sticks to the wrong item after a reorder." }
      ]
    },
    {
      id: 'navforms', title: 'Navigation and forms', level: 1, mins: 35,
      why: "Real apps are several screens with data entered on some of them. Declarative routing gives you deep links and a working back button; validated forms are where data quality starts.",
      points: [
        "Flutter keeps screens on a **stack**: `push` puts a new one on top, `pop` removes it. The basic API is `Navigator.of(context).push(MaterialPageRoute(...))`.",
        "For anything beyond a few screens use a declarative router — **go_router** maps URL-like paths to screens, handles path parameters, deep links, redirects and browser history on the web.",
        "`context.go('/products/42')` replaces the stack to match the location; `context.push(...)` adds on top; `context.pop(result)` returns a value to the caller.",
        "**Nesting decides what sits underneath.** With `products/:id` declared inside the `/` route, `go('/products/42')` builds Home with the product on top, so there's a back button. As a separate top-level route, the product page would be alone on the stack, and Back would close the app.",
        "A `Form` with a `GlobalKey<FormState>` groups `TextFormField`s. `validate()` runs each field's `validator` — returning a string shows the error, returning null means valid.",
        "`save()` runs each `onSaved`. Choose `keyboardType`, `textInputAction` and `autofillHints` so the right keyboard appears. For prices, `TextInputType.numberWithOptions(decimal: true)`: plain `number` has no decimal point on iOS.",
        "Validation on the client is for the user's convenience, and should match the API's rules (here, a price of at least 0.01, as in the ASP.NET Core validation lesson). The API must validate again — never trust the app."
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
      practice: "Add an edit route `/products/:id/edit` that reuses the form with initial values, and return the saved product to the previous screen with `context.pop(product)`. Run the app on the web target and check that the browser's back button and a pasted URL both work.",
      teach: "Explain the navigation stack: what do `push`, `pop` and `go` each do to it?",
      analogy: "Navigation is a stack of cards on a table. `push` lays a new card on top, `pop` takes the top card off to reveal the one beneath. `go` is clearing the table and dealing exactly the cards that a given address describes — which is why a pasted link can open the right screen with the right screens underneath it.",
      pitfalls: [
        "Passing whole objects between routes and breaking deep links: pass an id in the path and load the data.",
        "Using `context` after an `await` without checking `mounted` — the screen may be gone.",
        "Declaring every route at the top level. `go` then leaves the new page alone on the stack, with no back button.",
        "`double.parse` on what the user typed: `19,99` throws on a keyboard that uses a comma. Normalize it first.",
        "Validating only on the device, or with different rules from the server. The server must enforce the same rules."
      ],
      quiz: [
        { q: "What does a `validator` return when the input is valid?", a: ["`true`", "An empty string", "`null`", "The value"], c: 2, why: "A non-null string is shown as the error; null means the field passed." },
        { q: "What is the difference between `context.go` and `context.push` in go_router?", a: ["None", "`go` replaces the stack to match the location; `push` adds a screen on top", "`push` is for the web only", "`go` cannot take parameters"], c: 1, why: "`go` is declarative navigation to a location; `push` is imperative stacking." },
        { q: "Why prefer a path parameter such as `/products/42` over passing a `Product` object?", a: ["It is faster", "The location can be restored from a link or a restart", "Objects cannot be passed", "It avoids rebuilds"], c: 1, why: "A URL is serializable; an in-memory object is lost when the app is opened from a link." },
        { q: "`/products/:id` is a top-level route, a sibling of `/`. After `context.go('/products/42')`, what is under the product page?", a: ["The home page", "Nothing: it's alone on the stack, so there's no back button", "Whatever page was open before", "A copy of the product page"], c: 1, why: "`go` builds the stack from the route hierarchy. Nest the route under `/` to get Home underneath." }
      ]
    },
    {
      id: 'network', title: 'Networking: HTTP, JSON and your ASP.NET Core API', level: 1, mins: 40,
      why: "This is where the mobile app meets the rest of the stack: a Flutter screen calling the same ASP.NET Core endpoints as the React app. Typed models, honest loading and error states, and an injectable client are what make it testable.",
      points: [
        "Use the `http` package (or `dio`) with an `http.Client` you **inject** — never a global — so tests can substitute a fake.",
        "JSON arrives as `Map<String, dynamic>`. Convert it at the boundary into a typed model with a `fromJson` factory; for many models, generate the code with `json_serializable`.",
        "JSON numbers may be `int` or `double`: read them as `num` and convert. Dart types, like TypeScript types, do not validate data at run time.",
        "Check `statusCode`, throw a typed exception for failures, and always set a timeout. Turn ASP.NET Core's ProblemDetails into a message that's safe to show (`title`) and per-field errors (`errors`), never the raw response body.",
        "Android blocks plain `http://` by default, and iOS does too. For a local API, use its HTTPS address, or allow cleartext for your dev host only in a debug network-security config. Shipped apps should only talk HTTPS.",
        "A screen has at least four states: **loading, data, empty, error**. `FutureBuilder` handles the simple case; create the future once, not inside `build`.",
        "Keep networking out of widgets: widget → repository → API client. Send the auth token in a header from one place, and store tokens with `flutter_secure_storage`, not plain preferences."
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
      practice: "Point this at your ASP.NET Core products API (on the Android emulator the host machine is `10.0.2.2`). Add `create(Product)` with a POST and show validation errors from the ProblemDetails response next to the form fields. Turn the API off and confirm the error state appears.",
      teach: "Explain why the `http.Client` is passed into `ProductApi` instead of being created inside it.",
      analogy: "`fromJson` is the customs desk at a border: loosely described cargo (`Map<String, dynamic>`) arrives, gets inspected and relabelled once, and from then on travels through the country as a properly documented `Product`. Without the desk, every part of the app has to open the crates and guess.",
      pitfalls: [
        "Creating the future inside `build`, which fires a new request on every rebuild.",
        "Casting a JSON number straight to `double` — a value such as `25` arrives as an `int` and the cast throws.",
        "Showing a spinner forever because errors and timeouts were never handled.",
        "Calling `http://10.0.2.2:5000` from the Android emulator and getting a cleartext error before the request ever reaches your API."
      ],
      quiz: [
        { q: "Why inject `http.Client` into the API class?", a: ["One client per class is faster", "Tests can pass a fake client and no real network is needed", "The `http` package requires it", "It makes the client a singleton"], c: 1, why: "Dependencies passed in from outside can be replaced — the basis of testable code." },
        { q: "JSON contains `\"price\": 25`. Safest way to read it as a double?", a: ["`json['price'] as double`", "`(json['price'] as num).toDouble()`", "`double(json['price'])`", "`json.price`"], c: 1, why: "`25` decodes as an `int`; `num` accepts both and `toDouble` converts." },
        { q: "Where should the `Future` used by a `FutureBuilder` be created?", a: ["Inside `build`", "Once, in the State (a field or `initState`)", "In `dispose`", "In `main`"], c: 1, why: "`build` can run many times; creating the future there restarts the request each time." }
      ]
    },

    // ---------------- Advanced ----------------
    {
      id: 'bloc', title: 'State management with Bloc and Cubit', level: 2, mins: 45,
      why: "`setState` stops scaling the moment several screens share data or logic needs testing without a UI. Bloc is one of the most common answers in professional Flutter teams: state changes become explicit, traceable and unit-testable, and it's worth being able to say how it compares with the alternatives.",
      points: [
        "The idea: UI sends **intent in**, receives **immutable states out** through a stream. Business logic lives outside widgets and has no `BuildContext`.",
        "A **Cubit** exposes methods that call `emit(newState)` — the simplest form, right for most features. A **Bloc** receives **events** and maps them to states with `on<Event>` handlers: more ceremony, but every change is a named, loggable event and events can be transformed (debounce, drop, restart).",
        "Model state as a **sealed class** (loading / loaded / failed) or one class with `copyWith`. States must be immutable with value equality: emitting an equal state does nothing, and mutating a list in place means no rebuild. Write `==` by hand as below, or use the `equatable` package.",
        "A cubit can outlive its request: the user leaves, the screen closes the cubit, and then the response arrives. Calling `emit` after `close` throws, so check `isClosed` after every `await`.",
        "Event transformers come from the `bloc_concurrency` package: `restartable()` for search-as-you-type, `droppable()` to ignore taps while busy, `sequential()` for one-at-a-time.",
        "`BlocProvider` creates and disposes a bloc and exposes it to the subtree. `BlocBuilder` rebuilds UI, `BlocListener` runs one-off side effects (snackbar, navigation), `BlocSelector` and `buildWhen` narrow rebuilds.",
        "`context.read<T>()` gets the bloc to call it (in callbacks); `context.watch<T>()` also subscribes (in `build`). Blocs depend on **repositories**, injected through the constructor.",
        "By comparison: **Provider** is plain dependency injection plus `ChangeNotifier` — little code, but mutable and implicit. **Riverpod** is compile-safe providers with no `BuildContext` and fine-grained dependencies — less boilerplate, different mental model. **Bloc** costs more code and buys predictability, tooling and team-wide consistency."
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
      practice: "Rebuild your product list with a `ProductsCubit` backed by the API class from the networking lesson. Add a search box whose events are debounced with an event transformer in a `SearchBloc`. Show a snackbar on failure with `BlocListener`, and write down which widgets rebuild when one item is added to the cart.",
      teach: "Explain the difference between a Cubit and a Bloc, and when the extra ceremony of events is worth it.",
      analogy: "A Cubit is a vending machine: you press a labelled button and a result comes out. A Bloc is a restaurant with written order tickets: every request is recorded on a ticket before the kitchen acts, so you can read back exactly what was asked and in what order, hold tickets, or cancel a ticket when a newer one replaces it. More paperwork; a complete audit trail.",
      pitfalls: [
        "Mutating state and emitting the same object (`state.add(x); emit(state)`) — it is equal to the previous state, so nothing rebuilds.",
        "Using `context.watch` in a callback or `context.read` in `build` to drive UI: the first subscribes pointlessly, the second never updates.",
        "Putting navigation and snackbars in `BlocBuilder`. Builders may run many times; one-off effects belong in `BlocListener`.",
        "`emit` after an `await` with no `isClosed` check: 'Cannot emit new states after calling close' the first time a user leaves mid-request.",
        "Showing `'$e'` to the user. Exception text is for logs; the state should carry a message written for people."
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
      why: "Modern Dart has sealed classes, pattern matching, records and extensions — the features that make state modelling exhaustive and JSON handling safe. They are also what separates code written by someone who knows Dart from code translated out of another language.",
      points: [
        "**Generics** keep code reusable and typed: `T largest<T extends Comparable<T>>(List<T> items)`. Bounds (`extends`) say what the body may rely on.",
        "**Extension methods** add members to types you do not own — `'flutter'.capitalized` — resolved statically, with no runtime cost.",
        "**Mixins** (`with`) share behavior across unrelated classes without inheritance. Flutter uses them constantly: `SingleTickerProviderStateMixin`, `ChangeNotifier`.",
        "**Sealed classes** have a closed set of subtypes, so a `switch` over them is checked for **exhaustiveness** — add a state and every unhandled `switch` fails to compile.",
        "**Patterns** destructure and test in one step: `Success(:final value)`, guards with `when`, list and map patterns, and `if (json case {...})` for validating decoded JSON.",
        "**Records** `(double, double)` or `({int x, int y})` are immutable, typed tuples with value equality — ideal for returning several values without a class."
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
      practice: "Model a request state as a sealed class with `Idle`, `Loading`, `Loaded<T>` and `Failed`, and write a `switch` expression that handles all four. Add a fifth subtype and watch the compiler find every `switch` you must update. Then parse a nested JSON map with a single `case` pattern.",
      teach: "Explain how a sealed class makes a `switch` exhaustive, and what happens at compile time when you add a new subtype.",
      analogy: "A sealed class is a menu with a fixed list of dishes printed on it. Because the kitchen knows the list is complete, it can check that there is a recipe for every dish — and if the owner adds a dish, the missing recipe is noticed before opening time rather than when a customer orders it.",
      pitfalls: [
        "Adding a `default` / wildcard `_` branch to a `switch` over a sealed class — it silences exactly the exhaustiveness error you wanted.",
        "Using records for domain concepts that deserve a name. A record is for a small, local grouping.",
        "Expecting extension methods to be dynamic: they are chosen by the static type, so they do not apply to a `dynamic` value."
      ],
      quiz: [
        { q: "What does marking a class `sealed` enable?", a: ["Faster instantiation", "Exhaustive `switch` over its direct subtypes", "Private fields", "Multiple inheritance"], c: 1, why: "All direct subtypes must be in the same library, so the compiler knows the complete set." },
        { q: "What is `(int, String)` in Dart?", a: ["A function type", "A record type: an immutable pair with value equality", "A list", "A syntax error"], c: 1, why: "Records are anonymous, immutable, structurally typed aggregates." },
        { q: "In `Success(:final value) => ...`, what does `:final value` do?", a: ["Declares a constant", "Matches the `value` getter and binds it to a new variable `value`", "Calls a constructor", "Checks for null"], c: 1, why: "It is shorthand for `value: final value` in an object pattern." }
      ]
    },
    {
      id: 'testing', title: 'Testing: unit, widget and integration tests', level: 2, mins: 40,
      why: "Flutter's test tools are strong: widget tests run a real widget tree in milliseconds, without a device. Blocs with injected repositories make the business logic easy to test, which is the practical payoff of the architecture.",
      points: [
        "**Unit tests** (`test`) check plain Dart: models, repositories, cubits. Fast and numerous.",
        "**Widget tests** (`testWidgets`) pump a widget into a test environment, find elements, tap, and assert on what is shown — no emulator.",
        "`pumpWidget` builds, `pump()` advances one frame, `pumpAndSettle()` runs until animations finish. Forgetting to pump after an action is the classic mistake.",
        "Find the way a user would: `find.text`, `find.byTooltip`, `find.bySemanticsLabel`, or a `Key` when nothing better exists.",
        "Test blocs through their **stream of states**: `expectLater(cubit.stream, emitsInOrder([...]))`, or the `bloc_test` package. Replace repositories with hand-written fakes or `mocktail`.",
        "**Integration tests** (`integration_test`) drive the whole app on a device or emulator — few, slow, for critical flows. Golden tests compare rendered pixels to a reference image."
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
      practice: "Save this as `test/counter_test.dart` and run `flutter test`. Then test your `ProductsCubit` with a fake repository for three cases — success, empty and failure — and write one widget test that shows the error state and taps retry.",
      teach: "Explain what `pump` does in a widget test and why a test fails if you forget it after a tap.",
      analogy: "A widget test is a stage rehearsal with a remote control for time. Nothing moves unless you press 'next frame' (`pump`). Tap a button and the actors stay frozen in their old positions until you advance the clock — which is exactly why you can inspect every moment precisely.",
      pitfalls: [
        "Asserting immediately after `tap` without `pump` — the rebuild has not happened yet.",
        "`pumpAndSettle` with an endless animation (a spinner): it never settles and the test times out.",
        "Finding widgets by type or deep structure, so tests break on every refactor. Find by what the user sees."
      ],
      quiz: [
        { q: "What does `await tester.pump()` do?", a: ["Starts the app", "Advances the test clock by one frame so pending rebuilds happen", "Takes a screenshot", "Waits for the network"], c: 1, why: "Test time is manual; a frame is only processed when you pump." },
        { q: "How do you test what a cubit emits?", a: ["Read private fields", "Assert on its `stream` of states, for example with `emitsInOrder`", "Use a widget test only", "It cannot be tested"], c: 1, why: "A cubit's public output is its state stream, which can be asserted directly." },
        { q: "Which test type needs a device or emulator?", a: ["Unit test", "Widget test", "Integration test", "Golden test"], c: 2, why: "Integration tests run the real app; unit and widget tests run in the Dart VM test environment." }
      ]
    },
    {
      id: 'platform', title: 'Persistence, platform channels and adaptive UI', level: 2, mins: 40,
      why: "A real app remembers things between launches, talks to device features that Flutter does not cover, and looks right on a phone, a tablet and a browser. This is the gap between a demo and something you can put in a store.",
      points: [
        "Storage by purpose: `shared_preferences` for small settings (use its `SharedPreferencesAsync` API; the older `SharedPreferences` API is being phased out), `flutter_secure_storage` (Keychain / Keystore) for tokens, a local database (`sqflite`, `drift`) for structured offline data.",
        "Secure storage is only as secure as the platform: on the web there is no keystore, so it ends up in browser storage. Don't keep long-lived tokens in a web build.",
        "Wrap storage in your own class so the rest of the app depends on *your* interface, not on a plugin.",
        "**Platform channels** send messages between Dart and native Kotlin/Swift. `MethodChannel.invokeMethod` is asynchronous and can fail — catch `PlatformException` and `MissingPluginException`. Prefer an existing plugin on pub.dev before writing your own.",
        "**Adaptive layout**: branch on available width, not on device type — a bottom `NavigationBar` on narrow screens, a `NavigationRail` on wide ones. `SafeArea` avoids notches and system bars.",
        "Respect the platform: `defaultTargetPlatform` and `kIsWeb` for behavior differences, text scaling and dark mode from `MediaQuery` and `ThemeData`.",
        "Apps are paused and resumed by the OS. Use `AppLifecycleListener` to save work, pause streams and refresh stale data on resume. Request permissions only at the moment they are needed."
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
      practice: "Persist a dark-mode setting and the cart between launches. Make the app's navigation switch between a bottom bar and a rail at 600 px, and test it by resizing the web build. Then find a plugin on pub.dev for one device feature (camera, location) and read how it declares permissions on each platform.",
      teach: "Explain what a platform channel is and why calling one is asynchronous and can fail.",
      analogy: "A platform channel is an interpreter between two offices that speak different languages. You hand over a short written request ('battery level?'), the interpreter carries it next door, and an answer comes back a moment later — or a note saying nobody in that office handles that request. You never walk into the other office yourself.",
      pitfalls: [
        "Storing access tokens in `shared_preferences`, which is plain text on disk. Use secure storage (and remember the web has none).",
        "Choosing layouts by `Platform.isAndroid` instead of available width — tablets, foldables and resizable windows break it.",
        "Asking for every permission at first launch. Ask in context, and handle refusal."
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
      why: "Smooth means a frame every 16 ms — or 8 ms on a 120 Hz screen. This lesson is about what happens inside a frame, reading DevTools, and knowing which of the three trees a problem lives in.",
      points: [
        "Flutter keeps **three trees**: **widgets** (immutable configuration, rebuilt freely), **elements** (the long-lived instances that hold State and match old widgets to new ones) and **render objects** (layout and paint).",
        "On rebuild, an element compares the new widget with the old one: same `runtimeType` and `key` means **update in place**, otherwise the subtree is discarded and its State lost. This is why keys and `const` matter.",
        "A frame runs **build → layout → paint → composite** on the UI thread, then the raster thread draws it with **Impeller**, the default engine on iOS and Android, which compiles its shaders ahead of time so first-run animations no longer stutter. Jank is a frame that misses its deadline on either thread.",
        "Rebuild less: `const` constructors, state pushed down, `BlocSelector` / `buildWhen`, and `ListView.builder` so only visible items are built. `RepaintBoundary` isolates an area that repaints often; list builders already add one per item.",
        "Dart isolates have **separate memory** and communicate by messages. `compute` (or `Isolate.run`) moves CPU-heavy work — parsing large JSON, image processing — off the UI isolate so animations keep running. The input is copied to the other isolate, so send what it needs, not your whole app state.",
        "The web has no isolates: `Isolate.run` throws there, while `compute` falls back to running on the main thread (it works, but blocks while it does).",
        "Measure in **profile mode** on a real device, never in debug. Use DevTools: the performance overlay, the frame chart, 'Track widget rebuilds' and the memory view."
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
      practice: "On an Android emulator or a desktop build, run the checksum on the UI isolate first (call `slowChecksum` directly) while a spinner is animating, and watch it freeze; then move it to `compute`. Try the same on the web build and explain the difference. Open DevTools in profile mode, enable 'Track widget rebuilds', scroll a long list, and remove one unnecessary rebuild.",
      teach: "Explain the widget, element and render object trees: what each one is for, and which one holds the State.",
      analogy: "Widgets are the architect's drawings, redrawn every time anything changes. Elements are the site managers who stay on site, compare each new drawing with the last one and decide what really has to change. Render objects are the actual walls: expensive, so they are only touched when a manager says the drawing genuinely differs.",
      pitfalls: [
        "Judging performance in debug mode, which is many times slower than profile or release.",
        "Doing heavy parsing or image work in `build` or on the UI isolate, then adding `const` everywhere to compensate.",
        "Wrapping everything in `RepaintBoundary` — each one costs a layer and memory. Add them where the profiler shows repaint cost; list items already have one.",
        "Using `Isolate.run` in an app that also targets the web, where it throws. Use `compute`, or check `kIsWeb`."
      ],
      quiz: [
        { q: "Which tree holds a `StatefulWidget`'s State across rebuilds?", a: ["The widget tree", "The element tree", "The render tree", "None — State is global"], c: 1, why: "Elements are long-lived and own the State; widgets are thrown away and recreated." },
        { q: "When does an element reuse its State for a new widget?", a: ["Always", "When the new widget has the same runtime type and key", "Never", "Only for `const` widgets"], c: 1, why: "Matching type and key means update in place; otherwise the old subtree is unmounted." },
        { q: "Why use `compute` for a large JSON parse?", a: ["It parses on the GPU", "It runs on another isolate, so the UI isolate keeps rendering frames", "It caches the parsed result for next time", "It streams the JSON instead of parsing it"], c: 1, why: "Isolates don't share memory or a thread, so the UI stays responsive while the work runs (except on the web, where `compute` runs on the main thread)." }
      ]
    },
    {
      id: 'arch', title: 'Architecture, flavors and release', level: 3, mins: 45,
      why: "Shipping a mobile app is different from shipping a website: you cannot fix a bug with a redeploy, users keep old versions for months, and stores review your binary. So structure, configuration and release discipline matter more here than on the web.",
      points: [
        "Layer the app: **presentation** (widgets + blocs) → **domain** (plain Dart models and repository interfaces) → **data** (API clients, databases). Dependencies point inward; the domain imports no Flutter.",
        "Organize by **feature** (`features/cart/…`) with the layers inside each. Choose implementations in one place — the composition root — with `RepositoryProvider` or a locator such as `get_it`.",
        "Configuration per environment: `--dart-define` values or **flavors** (dev / staging / prod) with separate app ids, icons and API URLs. No secrets in the binary — anything shipped can be extracted.",
        "Catch what escapes: `FlutterError.onError` for framework errors and `PlatformDispatcher.instance.onError` for uncaught async errors, both reporting to a crash service.",
        "Release: build signed release artifacts (`flutter build appbundle`, `flutter build ipa`) in CI, run tests and analysis, version every build, and roll out in stages. Obfuscate with `--obfuscate --split-debug-info` and keep the symbols.",
        "Plan for old versions: keep the API backward compatible, add a minimum-version check, and gate risky features with remote flags. Accessibility — semantics labels, contrast, text scaling — is part of done."
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
      practice: "Restructure your app into `features/<name>/{data,domain,presentation}`. Add dev and prod configurations with different API URLs and app names. Set up a CI job that runs `flutter analyze`, `flutter test` and a release build. Then write the checklist you would follow to ship version 1.0.1 with a database schema change.",
      teach: "Explain why a mobile app must stay compatible with old versions of itself in a way a website does not.",
      analogy: "A website is a restaurant: change the menu tonight and every guest sees it. A mobile app is a printed cookbook already in thousands of kitchens: you can publish a second edition, but the first edition is still on the shelf and people will keep cooking from it — so the ingredients the shop sells (your API) must still work for both.",
      pitfalls: [
        "API keys or secrets compiled into the app. Anything in the binary can be read; keep secrets on the server.",
        "A backend change that breaks app versions still installed on users' phones.",
        "Losing the debug symbols for an obfuscated build, making production stack traces unreadable."
      ],
      quiz: [
        { q: "In a layered Flutter app, what may the domain layer import?", a: ["Flutter widgets", "The HTTP client", "Only plain Dart — no Flutter, no data sources", "Everything"], c: 2, why: "Dependencies point inward; the domain defines models and interfaces that the outer layers implement." },
        { q: "Why must secrets not be placed in `--dart-define` values for a release build?", a: ["They slow the app down", "They are compiled into the binary and can be extracted", "The stores scan for them and reject the app", "They're only available in debug builds"], c: 1, why: "Client binaries are public; real secrets belong on the server. Obfuscation makes them harder to find, not hidden." },
        { q: "What does `PlatformDispatcher.instance.onError` catch?", a: ["Layout overflow only", "Uncaught asynchronous errors outside the Flutter framework's callbacks", "Compile errors", "HTTP 500 responses"], c: 1, why: "`FlutterError.onError` covers framework-caught errors; the dispatcher hook covers the rest." }
      ]
    }
  ]
});
