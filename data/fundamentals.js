TRACKS.push({
  id: 'cs', name: 'CS Fundamentals', lang: 'cs',
  tagline: 'The foundations: Git, complexity, data structures and algorithms — behind coding interviews and everyday performance decisions.',
  lessons: [
    // ---------------- Beginner ----------------
    {
      id: 'git', title: 'Git and the developer workflow', level: 0, mins: 30, lang: 'sh',
      terms: [
        ['Staging area (`git add`)', 'Sandbox holding the exact snapshot changes you want inside your next commit — separate from working-directory edits.'],
        ['Branch & PR merge', 'Isolated pointer letting features grow independently before code review and squash/merge back to `main`.'],
        ['`.gitignore`', 'Prevents secrets, `node_modules/`, `bin/`, and `.env` files from ever leaving your machine cleanly.']
      ],
      why: "Professional teams use Git every day. It is your undo button and your collaboration tool, and a public history of real work is one of the first things that gives a new developer credibility.",
      points: [
        "A **repository** is a project plus its full history. A **commit** is a snapshot with a message explaining why it changed.",
        "Three areas: the **working directory** (your files), the **staging area** (`git add` — what the next commit will contain) and the **history** (`git commit`).",
        "A **branch** is a movable pointer to a commit. Create one per feature so `main` always works: `git switch -c feature/cart`.",
        "A **remote** (GitHub, GitLab) is a shared copy: `git push` uploads your commits, `git pull` downloads others'.",
        "On a team, you push a branch and open a **pull request**; teammates review it and it is merged on GitHub. Working alone without a host, `git merge feature/cart` on `main` does the same merge locally.",
        "A **conflict** just means two edits touched the same lines and Git needs you to choose.",
        "Commit small and often, with messages in the imperative: 'Add stock check to checkout'. Keep build output and secrets out with `.gitignore`."
      ],
      code: `
# Once per computer
git config --global user.name "Your Name"
git config --global user.email "you@example.com"   # GitHub can give you a private no-reply address

# Start tracking a project; -b main names the first branch "main"
git init -b main
echo "bin/" >> .gitignore       # build output stays out of the repository
echo "obj/" >> .gitignore
git add .
git commit -m "Add product list endpoint"

# Connect to an empty GitHub repository you created (once)
git remote add origin https://github.com/your-name/shop.git
git push -u origin main

# Work on a feature without touching main
git switch -c feature/search
# ...edit files...
git status                      # what changed?
git diff                        # exactly which lines?
git add .
git commit -m "Add search by product name"
git push -u origin feature/search   # now open a pull request on GitHub

# After the pull request is merged on GitHub
git switch main
git pull                        # bring the merged work down
git branch -d feature/search    # the branch has done its job

# Undo
git restore Program.cs          # discard uncommitted edits to a tracked file
git revert HEAD                 # new commit that undoes the last one, safe on shared history
git log --oneline --graph       # read the history
`,
      practice: "Put your current practice project under Git with `git init -b main` and a `.gitignore`. Make three small commits with clear messages. Create a branch, change the same line on both branches, merge it into `main` locally, and resolve the conflict by hand. Then push to a new GitHub repository and repeat the feature flow with a pull request.",
      teach: "Explain the difference between the working directory, the staging area and a commit, and why branches make teamwork safe.",
      analogy: "Git is a save-game system for code. A commit is a save point with a note about what you just achieved. A branch is a second save slot where you can try something risky; if it works you merge it back, and if it doesn't, your main save is untouched.",
      pitfalls: [
        "One giant commit called 'changes' at the end of the day. Nobody can review it, and you can't undo part of it.",
        "Treating a merge conflict as an error. It is a question: which of these two edits do you want?",
        "Committing a password or connection string. Deleting it in a later commit doesn't remove it from history, so treat it as leaked: change the password or revoke the key, then remove it.",
        "Running plain `git init` and finding the branch is called `master`, so tutorials that say `main` stop working. Use `git init -b main`, or rename with `git branch -m main`."
      ],
      quiz: [
        { q: "What does `git add` do?", a: ["Creates a commit", "Stages changes for the next commit", "Uploads to the remote", "Starts tracking the whole repository"], c: 1, why: "It moves changes into the staging area; `git commit` then records them." },
        { q: "Why work on a feature branch instead of `main`?", a: ["Commits on a branch can't conflict", "Unfinished work stays isolated, and `main` stays working and reviewable", "Branches are backed up to GitHub automatically", "Only branches can be pushed"], c: 1, why: "Branches isolate changes until they have been reviewed and are ready to merge. They can still conflict, and nothing is uploaded until you push." },
        { q: "You pushed a commit containing an API key, then deleted the key in the next commit. What now?", a: ["Nothing; it's gone", "Revoke or rotate the key: it is still in the history", "Run `git revert` on the first commit", "Make the repository private again"], c: 1, why: "Every clone keeps the old commit. Once a secret has been pushed, assume someone has it." }
      ]
    },
    {
      id: 'bigo', title: 'Big-O: how code scales', level: 0, mins: 30, viz: 'bigo',
      terms: [
        ['Time complexity (`O(n)`, `O(log n)`)', 'Measures how operations grow relative to input size `n` rather than wall-clock milliseconds on one laptop.'],
        ['Nested loop `O(n²)` trap', 'Looking inside a whole array for every element scales quadratically (`1,000` items -> `1,000,000` steps) — a `HashSet` cuts it to `O(n)`.'],
        ['Space–time trade-off', 'Spending `O(n)` extra RAM for a hash table or memo table to turn `O(n²)` or `O(2ⁿ)` work into fast linear time.']
      ],
      why: "Interviews nearly always ask for the time and space complexity of your answer. The everyday reason to learn Big-O is bigger: it lets you predict whether code that works on 100 rows will survive 10 million.",
      points: [
        "Big-O describes how the **number of steps grows** as the input size n grows. It ignores constants and small terms: 3n + 10 is O(n).",
        "The common classes, best to worst: **O(1)** constant, **O(log n)** logarithmic, **O(n)** linear, **O(n log n)**, **O(n²)** quadratic, **O(2ⁿ)** exponential.",
        "Rules of thumb: one loop over the input is O(n); a loop inside a loop is O(n²); halving the problem each step is O(log n); sorting is O(n log n).",
        "**Space complexity** counts extra memory the same way. Many optimisations trade space for time: a hash set turns an O(n²) duplicate check into O(n).",
        "Unless told otherwise, analyse the **worst case**. 'Amortized O(1)' means occasionally expensive but cheap on average, like `List.Add`.",
        "At n = 1,000,000: O(log n) is about 20 steps, O(n) is a million, O(n²) is a trillion."
      ],
      code: `
// O(1): one step regardless of size
static int First(int[] a) => a[0];

// O(log n): halve the search space each step
static int BinarySearch(int[] sorted, int target)
{
    int lo = 0, hi = sorted.Length - 1;
    while (lo <= hi)
    {
        int mid = lo + (hi - lo) / 2;
        if (sorted[mid] == target) return mid;
        if (sorted[mid] < target) lo = mid + 1; else hi = mid - 1;
    }
    return -1;
}

// O(n²): compares every pair
static bool HasDuplicateSlow(int[] a)
{
    for (int i = 0; i < a.Length; i++)
        for (int j = i + 1; j < a.Length; j++)
            if (a[i] == a[j]) return true;
    return false;
}

// O(n) time, by spending O(n) space
static bool HasDuplicateFast(int[] a)
{
    var seen = new HashSet<int>();
    foreach (int x in a) if (!seen.Add(x)) return true;
    return false;
}

var data = Enumerable.Range(0, 1_000_000).ToArray();
Console.WriteLine(First(data));                    // 0
Console.WriteLine(BinarySearch(data, 765_432));    // 765432, found in about 20 steps
Console.WriteLine(HasDuplicateFast(data));         // False, in milliseconds; the slow version takes minutes
`,
      practice: "Use the visualization to compare the classes at n = 1,000 and n = 1,000,000. Then time `HasDuplicateSlow` and `HasDuplicateFast` with `Stopwatch` for 10,000, 20,000 and 40,000 items, running each size twice and keeping the second time (the first includes JIT warm-up). When n doubles, what happens to each time?",
      teach: "Explain what O(n) and O(n²) mean to someone who has never seen the notation, using a real-life example.",
      analogy: "Finding a name in a phone book. Reading every page is O(n). Opening in the middle and halving each time is O(log n). Having everyone in a room shake hands with everyone else to find a shared birthday is O(n²): fine for 10 people, hopeless for a stadium.",
      pitfalls: [
        "Counting lines of code instead of how the work grows. A single line calling `list.Contains` inside a loop is O(n²).",
        "Forgetting hidden costs: sorting, `string` concatenation in a loop, `Insert(0, x)` on a list.",
        "Stating the time complexity and forgetting space."
      ],
      quiz: [
        { q: "What is the complexity of a loop over n items that calls `list.Contains(x)` on a list of n items each time?", a: ["O(n)", "O(n log n)", "O(n²)", "O(1), because `Contains` is built in"], c: 2, why: "`Contains` on a list is itself O(n), and it runs n times. Built-in doesn't mean free." },
        { q: "Binary search on 1,000,000 sorted items needs about how many steps?", a: ["20", "1,000", "500,000", "1,000,000"], c: 0, why: "log₂(1,000,000) ≈ 20: each step halves what is left." },
        { q: "5n² + 3n + 100 simplifies to…", a: ["O(n)", "O(5n²)", "O(n²)", "O(n² + n)"], c: 2, why: "Drop constants and lower-order terms: the n² term dominates as n grows." }
      ]
    },
    {
      id: 'numbers', title: "Numbers and text: binary, floating point and Unicode", level: 0, mins: 30,
      terms: [
        ['IEEE-754 binary float (`double`)', 'Stores base-2 fractions efficiently for graphics/physics, so exact base-10 decimals like `0.1` repeat infinitely and round slightly.'],
        ['Integer overflow', 'Exceeding 32-bit `int` max (`~2.14B`) wraps silently unless checked or promoted to `long` / `Int64`.'],
        ['UTF-8 code unit vs grapheme cluster', 'Emoji like `"👍🏽"` take multiple UTF-8 bytes and UTF-16 `char`s — measure characters safely with `StringInfo` / `Intl.Segmenter`.']
      ],
      predict: {
        prompt: 'In C# (`double`), JavaScript (`number`), or Dart (`double`), what does `0.1 + 0.2 === 0.3` evaluate to?',
        options: ['`true` (`0.3` exact)', '`false` (equals `0.30000000000000004` in binary IEEE-754)', 'Throws an overflow warning'],
        answer: 1,
        explain: '`1/10` and `1/5` cannot terminate cleanly in base-2 binary fractions (`0.000110011...`), so binary floating point rounds both inputs slightly; use `decimal` or integer cents for money.'
      },
      why: "Money that ends up a cent off, a name that shows up as 'Ã©', an id that breaks past 2.1 billion: these bugs come from how computers store numbers and text, and they turn up in every track — `DECIMAL` in SQL, `decimal` in C#, `NVARCHAR`, and JavaScript's single number type.",
      points: [
        "Everything is stored in **binary**. An `int` is 32 bits, so it holds about ±2.1 billion; a `long` (64 bits) holds about ±9.2 × 10¹⁸. Go past the limit and the value **overflows**: in C# it silently wraps around unless the code runs in a `checked` context.",
        "`double` (and every JavaScript `number`) is binary **floating point**. Most decimal fractions, such as 0.1, have no exact binary form, so `0.1 + 0.2` is `0.30000000000000004`.",
        "For money, use an exact decimal type: `decimal` in C#, `DECIMAL(19,4)` in SQL Server, or whole rupiah or cents in an integer. Never compare floating-point results with `==`; compare with a small tolerance.",
        "JavaScript has one number type, and its integers are exact only up to 2⁵³ − 1 (`Number.MAX_SAFE_INTEGER`). A 64-bit database id beyond that loses digits in the browser, so send large ids as strings, or use `BigInt`.",
        "Text is a sequence of **Unicode code points**, encoded into bytes. **UTF-8**, the web's default, uses 1 to 4 bytes per character; C#, JavaScript and Java strings use **UTF-16**, where an emoji takes two 16-bit units.",
        "So 'length' depends on what you count: `\"👍\".Length` is 2 in C# and JavaScript, though a person sees one character. Garbled text such as 'Ã©' means bytes were written in one encoding and read in another.",
        "In SQL Server, `NVARCHAR` stores Unicode. `VARCHAR` stores text in a single code page unless the column uses a UTF-8 collation, so names in other scripts can come back as '?'."
      ],
      code: `
// Integers have a fixed size and wrap around silently
int big = int.MaxValue;
Console.WriteLine(big + 1);                       // -2147483648
try { checked { big += 1; } }
catch (OverflowException) { Console.WriteLine("checked: overflow caught"); }

// Binary floating point can't hold 0.1 exactly
double d = 0.1 + 0.2;
Console.WriteLine(d == 0.3);                      // False
Console.WriteLine(d);                             // 0.30000000000000004
Console.WriteLine(Math.Abs(d - 0.3) < 1e-9);      // True: compare with a tolerance

// decimal counts in base 10, so it is exact for money
double sumD = 0;
decimal sumM = 0;
for (int i = 0; i < 10; i++) { sumD += 0.1; sumM += 0.1m; }
Console.WriteLine($"{sumD == 1.0} {sumM == 1.0m}");   // False True

// Text: "length" depends on what you count
string s = "café 👍";
Console.WriteLine(s.Length);                                   // 7: UTF-16 units (the emoji takes two)
Console.WriteLine(System.Text.Encoding.UTF8.GetByteCount(s));  // 10: bytes in UTF-8
Console.WriteLine(s.EnumerateRunes().Count());                 // 6: Unicode code points
`,
      practice: "In the browser console, run `0.1 + 0.2`, `9007199254740993` and `\"👍\".length`, and explain each result. Then, in C#, add up the prices of a 1,000-line order with `double` and again with `decimal`, and print the difference. Finally, in SQL Server, insert `N'Đặng Thị Hà'` into a `VARCHAR(50)` column and an `NVARCHAR(50)` column and compare what comes back.",
      teach: "Explain why `0.1 + 0.2` is not exactly `0.3`, and which type you would use for a savings balance instead.",
      analogy: "Write 1/3 as a decimal: 0.3333… never ends, so any fixed number of digits is slightly wrong. Binary has the same problem with 1/10. A decimal type counts in tenths and hundredths, like a cashier counting coins, so 0.10 stays exactly 0.10.",
      pitfalls: [
        "Storing money in `double`, `float`, or SQL `REAL` or `FLOAT`. Each error is tiny, but they add up over thousands of operations.",
        "Sending a 64-bit id to JavaScript as a number. Above 2⁵³ its last digits silently change.",
        "Cutting a string at a fixed number of `char`s, which can split an emoji in half.",
        "Declaring names as `VARCHAR` and getting '?' for anything outside the code page."
      ],
      quiz: [
        { q: "Why is `0.1 + 0.2 == 0.3` false for `double` in C#?", a: ["The compiler rounds the right-hand side", "0.1 and 0.2 have no exact binary form, so the sum is slightly off", "`==` compares references for doubles", "A double keeps only two decimal places"], c: 1, why: "Binary floating point stores the nearest binary fraction, and the tiny errors make the sum 0.30000000000000004. Use `decimal` for exact decimal values." },
        { q: "Which type fits an account balance in SQL Server?", a: ["`FLOAT`", "`REAL`", "`DECIMAL(19,4)`", "`NVARCHAR(20)`"], c: 2, why: "`DECIMAL` is exact in base 10. `FLOAT` and `REAL` are binary floating point, and text can't be summed or checked as a number." },
        { q: "`\"👍\".Length` is 2 in C#. Why?", a: ["C# strings are UTF-16, and this emoji needs two 16-bit units", "Windows stores every emoji as two characters", "`Length` counts bytes in UTF-8", "It's a bug in .NET"], c: 0, why: "Characters outside the first 65,536 code points take a surrogate pair in UTF-16. Use `EnumerateRunes()` to count code points." }
      ]
    },
    // ---------------- Intermediate ----------------
    {
      id: 'structures', title: 'Arrays, hash tables, stacks, queues and linked lists', level: 1, mins: 40,
      terms: [
        ['Array vs Linked List', 'Arrays sit contiguous in RAM (fast CPU cache + `O(1)` index); linked lists chase scattered pointers (`O(n)` scan) and rarely beat arrays.'],
        ['Hash table (`Dictionary` / `Map`)', 'Hashes keys to array buckets for `O(1)` average lookup — core tool in 80% of coding interview optimizations.'],
        ['Stack (LIFO) vs Queue (FIFO)', 'Stacks serve undo history and DFS recursion; Queues preserve arrival order for BFS and task workers.']
      ],
      why: "Choosing the right data structure is often most of the solution. `Dictionary` behind a cache, a queue behind background jobs, a stack behind undo: the same few structures show up in the codebase and in interviews.",
      points: [
        "**Array / List**: contiguous memory. O(1) access by index, amortized O(1) append, O(n) insert or remove in the middle, O(n) search.",
        "**Hash table** (`Dictionary`, `HashSet`): a hash function maps each key to a bucket. O(1) lookup, insert and delete **on average**; no ordering.",
        "A hash table is only as good as its keys: if many keys land in one bucket, lookups slow towards O(n), and a key that changes while stored can no longer be found.",
        "**Stack** (last in, first out): push and pop at one end. Undo, matching brackets, depth-first search, and the call stack itself.",
        "**Queue** (first in, first out): add at the back, remove from the front. Work in arrival order, breadth-first search.",
        "**Linked list**: nodes that each point to the next. O(1) insert or remove at a node you already hold, but O(n) to reach it and poor cache locality. .NET has `LinkedList<T>`, but interview problems use your own node class with a `Next` pointer.",
        "Ask three questions: what operations do I need, how often, and on how much data? The answers pick the structure."
      ],
      code: `
// Dynamic array
var list = new List<int> { 3, 1, 4 };
list.Add(1);                         // amortized O(1)
list.Insert(0, 9);                   // O(n): everything shifts
int third = list[2];                 // O(1)

// Hash table
var ages = new Dictionary<string, int> { ["Ana"] = 30 };
ages["Budi"] = 25;                   // O(1) average
bool known = ages.ContainsKey("Citra");

// Stack: last in, first out
var history = new Stack<string>();
history.Push("page1"); history.Push("page2");
string back = history.Pop();         // page2

// Queue: first in, first out
var jobs = new Queue<string>();
jobs.Enqueue("job1"); jobs.Enqueue("job2");
string nextJob = jobs.Dequeue();     // job1

Console.WriteLine($"{third} {known} {back} {nextJob}");   // 1 False page2 job1

// Linked list, interview style: your own nodes and pointers
var head = new ListNode(1, new ListNode(2, new ListNode(3)));
RemoveAfter(head);                   // unlink the node after 1
Console.WriteLine(Describe(head));   // 1 -> 3

static void RemoveAfter(ListNode node)
{
    if (node.Next is not null) node.Next = node.Next.Next;   // O(1): just move one pointer
}

static string Describe(ListNode? node)
{
    var parts = new List<string>();
    for (; node is not null; node = node.Next) parts.Add(node.Val.ToString());   // O(n): walk the chain
    return string.Join(" -> ", parts);
}

class ListNode(int val, ListNode? next = null)
{
    public int Val = val;
    public ListNode? Next = next;
}
`,
      practice: "Solve three interview problems, naming the structure before you write any code: 'Pair with target sum' (hash map), 'Valid brackets' (stack), 'Reverse a linked list' (pointers, using a `ListNode` like the one above). For each, say why the obvious alternative is worse.",
      teach: "Explain why looking up a key in a hash table is O(1) on average while searching a list is O(n).",
      analogy: "A list is a row of numbered lockers: instant if you know the number, a long walk if you only know what's inside. A hash table is a cloakroom where your ticket number is worked out from your name, so the attendant goes straight to the right hook.",
      pitfalls: [
        "Using a list where a set or dictionary is needed, then searching it in a loop.",
        "Assuming a dictionary keeps insertion order or sorted order. Use `SortedDictionary` or sort when you need order.",
        "Reaching for a linked list for 'fast inserts' when finding the position is O(n) anyway.",
        "Losing the rest of a linked list by overwriting `Next` before saving it. Draw the boxes and arrows first."
      ],
      quiz: [
        { q: "Which structure gives O(1) average lookup by key?", a: ["`List<T>` kept sorted", "`LinkedList<T>`", "Hash table", "`Queue<T>`"], c: 2, why: "The hash of the key leads directly to its bucket. A sorted list gives O(log n) with binary search." },
        { q: "Which structure fits 'undo the most recent action'?", a: ["Queue", "Stack", "Dictionary", "Sorted list"], c: 1, why: "Undo is last in, first out." },
        { q: "What is the cost of `list.Insert(0, x)` on a List of n items?", a: ["O(1)", "O(log n)", "O(n)", "Amortized O(1), like `Add`"], c: 2, why: "Every existing element must shift one position. Only appending at the end is amortized O(1)." }
      ]
    },
    {
      id: 'sorting', title: 'Recursion and sorting', level: 1, mins: 40, viz: 'sort',
      terms: [
        ['Base case & call stack frame', 'Every recursive function needs a termination branch or local parameters stack up until a `StackOverflowException` crashes it.'],
        ['Divide-and-conquer (`O(n log n)`)', 'Merge sort and Quick sort halve the array repeatedly (`log n` levels × `n` work per level) instead of `O(n²)` adjacent swaps.'],
        ['Stable sort', 'Preserves original relative order when two items tie (`sort` in C#/JS `.toSorted()` by `key`).']
      ],
      why: "Recursion is the thinking tool behind trees, graphs, backtracking and dynamic programming. Sorting is the most common first step in algorithm problems, and understanding why it costs O(n log n) teaches most of what you need for analysing algorithms.",
      points: [
        "A recursive function solves a problem by solving a **smaller version of the same problem**. It needs a **base case** that stops and a step that moves towards it.",
        "Each call gets its own frame on the call stack. Very deep recursion overflows the stack; any recursion can be rewritten with an explicit stack.",
        "**Divide and conquer**: split the problem, solve the halves, combine. Merge sort does exactly this and is always O(n log n).",
        "Bubble and insertion sort are O(n²): simple, and fine for tiny or nearly sorted input. Quick sort is O(n log n) on average, O(n²) in the worst case.",
        "Comparison sorting cannot beat O(n log n) in general. A **stable** sort keeps equal items in their original order. In .NET, LINQ's `OrderBy` is stable; `Array.Sort` and `List.Sort` are not.",
        "In real code use the built-ins. In interviews, say 'sort first' and then use the order with two pointers or binary search."
      ],
      code: `
static long Factorial(int n) => n <= 1 ? 1 : n * Factorial(n - 1);   // base case, then a smaller problem

// Merge sort: divide, conquer, combine
static int[] MergeSort(int[] a)
{
    if (a.Length <= 1) return a;                        // base case
    int mid = a.Length / 2;
    int[] left = MergeSort(a[..mid]), right = MergeSort(a[mid..]);

    var merged = new int[a.Length];
    int i = 0, j = 0, k = 0;
    while (i < left.Length && j < right.Length)
        merged[k++] = left[i] <= right[j] ? left[i++] : right[j++];   // <= keeps it stable
    while (i < left.Length) merged[k++] = left[i++];
    while (j < right.Length) merged[k++] = right[j++];
    return merged;
}

Console.WriteLine(Factorial(5));                                    // 120
Console.WriteLine(string.Join(", ", MergeSort([5, 2, 9, 1, 7])));    // 1, 2, 5, 7, 9

// In practice: the built-ins
int[] nums = [5, 2, 9, 1, 7];
Array.Sort(nums);                                                   // in place, O(n log n), not stable

var people = new[] { ("Ana", 30), ("Budi", 25), ("Citra", 30) };
var byAge = people.OrderBy(p => p.Item2);                           // stable: Ana stays before Citra
Console.WriteLine(string.Join(", ", byAge.Select(p => p.Item1)));   // Budi, Ana, Citra
`,
      practice: "Run each algorithm in the sorting visualization and note the comparison counts. Then write a recursive `Sum(object[] items)` for nested lists such as `[1, new object[] { 2, new object[] { 3, 4 } }, 5]` (the answer is 15): use `item is int n` and `item is object[] inner` to tell the cases apart. Trace its call stack on paper.",
      teach: "Explain recursion using merge sort: what is the base case, what is the smaller problem, and how are the results combined?",
      analogy: "Sorting a deck by merge sort: split the deck in half, hand each half to a friend with the same instruction, and when two sorted halves come back, merge them by repeatedly taking the smaller top card. The instruction is the same at every level, and a single card is already sorted: that is the base case.",
      pitfalls: [
        "A missing or unreachable base case: infinite recursion and a `StackOverflowException`, which cannot be caught.",
        "Overflow in recursive maths. With `int`, `Factorial(13)` silently gives a wrong answer; `long` lasts until 20!, and a `checked` block makes overflow throw instead of lying.",
        "Sorting by one key after another with `Array.Sort` and expecting the earlier order to survive. Use `OrderBy(...).ThenBy(...)`.",
        "Writing your own sort in production code instead of using the library."
      ],
      quiz: [
        { q: "What two things must every recursive function have?", a: ["A loop and a counter", "A base case and a step towards it", "A memo and a return value", "Two recursive calls"], c: 1, why: "Without a base case it never stops; without progress it never reaches the base case." },
        { q: "What is the time complexity of merge sort?", a: ["O(n)", "O(n log n)", "O(n²) in the worst case", "O(log n)"], c: 1, why: "log n levels of splitting, with O(n) merging work on each level, whatever the input. It is quick sort that has an O(n²) worst case." },
        { q: "You sort orders by date, then sort the result by customer with `Array.Sort`. Are each customer's orders still in date order?", a: ["Yes, always", "Not guaranteed: `Array.Sort` is not stable", "Only for small arrays", "Yes, if dates are unique"], c: 1, why: "An unstable sort may reorder equal keys. `OrderBy(o => o.Customer).ThenBy(o => o.Date)` says what you mean." }
      ]
    },
    // ---------------- Advanced ----------------
    {
      id: 'trees', title: 'Trees, heaps and binary search', level: 2, mins: 40,
      terms: [
        ['Binary search invariant (`lo <= hi`)', 'Halves any monotonic sorted range in `O(log n)` steps — also applies to “search on answer” capacity problems.'],
        ['Heap (`PriorityQueue`)', 'Partially ordered tree pulling minimum or maximum items in `O(log n)` — powers Top-K, timers, and Dijkstra.'],
        ['Tree traversals (`DFS` pre/in/post vs `BFS`)', 'DFS drills root-to-leaf recursively; BFS processes level by level with a queue.']
      ],
      why: "Trees show up all over the stack: the DOM, JSON, the file system, React's component tree, and the B-tree behind every SQL index. Heaps answer 'what's next?' questions such as top K and scheduling, and binary search reaches far beyond finding a number in an array.",
      points: [
        "A **tree** is nodes with children and no cycles. A **binary tree** has at most two children per node. A balanced tree with n nodes is about log₂ n levels deep.",
        "A **binary search tree** keeps left < node < right, giving O(log n) search, insert and delete when balanced, and O(n) when it degenerates into a chain. Self-balancing trees (red-black trees, and the B-trees databases use) prevent that.",
        "Traversals: **in-order** (left, node, right: sorted order for a BST), **pre-order** and **post-order** (all depth-first), and **level-order** (breadth-first, with a queue).",
        "Most tree problems come down to one recursive question: 'if I knew the answer for my left and right subtrees, what is my answer?'",
        "A **heap** is a tree where each parent is smaller than or equal to its children (a min-heap). Peek at the minimum in O(1); insert and remove in O(log n). In .NET: `PriorityQueue<TElement, TPriority>`.",
        "**Binary search** works on any condition that flips from false to true exactly once across a range: search for the flip point instead of a value."
      ],
      code: `
// Binary search tree: left < node < right
static Node? Insert(Node? node, int value)
{
    if (node is null) return new Node(value);
    if (value < node.Value) node.Left = Insert(node.Left, value);
    else node.Right = Insert(node.Right, value);
    return node;
}

static void InOrder(Node? node, List<int> output)        // visits a BST in sorted order
{
    if (node is null) return;
    InOrder(node.Left, output);
    output.Add(node.Value);
    InOrder(node.Right, output);
}

static int Height(Node? node) => node is null ? 0 : 1 + Math.Max(Height(node.Left), Height(node.Right));

Node? root = null;
foreach (int v in new[] { 8, 3, 10, 1, 6 }) root = Insert(root, v);
var sorted = new List<int>();
InOrder(root, sorted);
Console.WriteLine(string.Join(" ", sorted));            // 1 3 6 8 10
Console.WriteLine(Height(root));                        // 3

// Heap: always hands back the smallest priority
var heap = new PriorityQueue<string, int>();
heap.Enqueue("low priority", 5);
heap.Enqueue("urgent", 1);
heap.Enqueue("normal", 3);
Console.WriteLine(heap.Dequeue());                      // urgent

// Binary search on a condition: the first day a product is out of stock
int[] stockByDay = [50, 41, 30, 22, 9, 0, 0, 0];        // never goes up again
Console.WriteLine(FirstTrue(0, stockByDay.Length - 1, day => stockByDay[day] == 0));   // 5

// Returns the first index where 'ok' is true; 'ok' must flip from false to true exactly once
static int FirstTrue(int lo, int hi, Func<int, bool> ok)
{
    while (lo < hi)
    {
        int mid = lo + (hi - lo) / 2;
        if (ok(mid)) hi = mid;          // mid might be the answer: keep it
        else lo = mid + 1;              // mid is too early: discard it
    }
    return lo;
}

class Node(int value)
{
    public int Value = value;
    public Node? Left, Right;
}
`,
      practice: "Solve 'Maximum depth of a binary tree', 'Level-order traversal' and 'Top K frequent elements' in the interview section. For each tree problem, write down the recursive question before coding. Then use `FirstTrue` to find the smallest daily delivery capacity that ships 10 orders of sizes [3, 5, 2, 8, 4, 1, 7, 6, 2, 3], in that order, within 5 days. (You should get 11.)",
      teach: "Explain why a balanced binary search tree finds a value in O(log n), and what goes wrong if values are inserted in sorted order.",
      analogy: "A binary search tree is the game of 'guess my number': each question, higher or lower, removes half of what's left. If the tree is lopsided, every question removes only one possibility, and the game is no faster than counting.",
      pitfalls: [
        "Assuming any binary tree is a search tree, or that any BST is balanced.",
        "Keeping a sorted list and re-sorting after every insert where a heap is what you need.",
        "Forgetting the null case at the top of a recursive tree function.",
        "Expecting `PriorityQueue` to return items with equal priority in the order you added them. It doesn't promise that.",
        "Binary search loops that never end: with `lo < hi`, always move `lo` to `mid + 1` or `hi` to `mid`, never `lo = mid`."
      ],
      quiz: [
        { q: "Which traversal visits a binary search tree's values in sorted order?", a: ["Pre-order", "In-order", "Post-order", "Level-order"], c: 1, why: "Left subtree (smaller), node, right subtree (larger)." },
        { q: "What does a min-heap guarantee?", a: ["Every level is sorted left to right", "The smallest element is at the root", "Searching for any value is O(log n)", "Equal priorities come out in insertion order"], c: 1, why: "Only the parent-child order is maintained, which is enough to find the minimum instantly. Searching for an arbitrary value is still O(n)." },
        { q: "Inserting 1, 2, 3, 4, 5 in order into a plain BST produces…", a: ["A balanced tree", "A chain of right children with O(n) search", "A tree of height 3", "A min-heap"], c: 1, why: "Each value is larger than the last, so the tree degenerates into a linked list." }
      ]
    },
    {
      id: 'graphs', title: 'Graphs: BFS, DFS and topological order', level: 2, mins: 40, viz: 'graphsearch',
      terms: [
        ['Visited set (`seen`)', 'Tracks already-explored vertices *as you enqueue* so cycles never loop infinitely or visit nodes twice.'],
        ['BFS shortest path (unweighted)', 'Explores distance rings strictly in order `0, 1, 2...`, guaranteeing the first path to reach a target is shortest.'],
        ['Topological sort (`in-degree`)', 'Orders directed acyclic dependency tasks (`DAG` — build pipelines, migrations, package installers) cleanly before dependents run.']
      ],
      why: "Maps, social networks, build systems and grids are graphs, and so is your own code: a DI container resolving constructor dependencies and EF Core ordering migrations are both walking a graph. In problems, the hard part is noticing the graph at all.",
      points: [
        "A **graph** is nodes (vertices) connected by edges, directed or undirected, weighted or not. Trees and linked lists are special cases.",
        "Store it as an **adjacency list** (node → neighbours): compact and fast to iterate. A grid is an implicit graph where the neighbours are the adjacent cells.",
        "**BFS** (with a queue) explores in rings outward and finds the **shortest path when every edge costs the same**. With different costs, like road distances, use Dijkstra's algorithm: BFS with a priority queue.",
        "**DFS** (recursion or a stack) goes as deep as possible first: reachability and connected components.",
        "Always track **visited** nodes, or a cycle makes the search loop forever. Both searches run in O(V + E).",
        "Finding a cycle in a **directed** graph needs more than `visited`: you also track the nodes on the current path. Reaching one of those again is a cycle; reaching a node finished earlier is not.",
        "**Topological sort** orders a directed graph so every dependency comes first: course prerequisites, build order, migrations. If no such order exists, the graph has a cycle."
      ],
      code: `
// Adjacency list: node -> neighbours (A must come before B and C, and so on)
var graph = new Dictionary<string, string[]>
{
    ["A"] = ["B", "C"], ["B"] = ["D"], ["C"] = ["D"], ["D"] = ["E"], ["E"] = []
};

Console.WriteLine(ShortestPath(graph, "A", "E"));       // 3
var seen = new HashSet<string>();
Dfs(graph, "A", seen);
Console.WriteLine(string.Join(" ", seen));              // A B D E C
Console.WriteLine(string.Join(" ", TopoOrder(graph)));  // A B C D E

var cyclic = new Dictionary<string, string[]> { ["X"] = ["Y"], ["Y"] = ["X"] };
try { TopoOrder(cyclic); }
catch (InvalidOperationException ex) { Console.WriteLine(ex.Message); }   // cycle: no valid order

// BFS: level by level, so the first time we reach a node is by a shortest path
static int ShortestPath(Dictionary<string, string[]> g, string start, string goal)
{
    var distance = new Dictionary<string, int> { [start] = 0 };
    var queue = new Queue<string>([start]);
    while (queue.Count > 0)
    {
        string node = queue.Dequeue();
        if (node == goal) return distance[node];
        foreach (string next in g[node])
            if (distance.TryAdd(next, distance[node] + 1)) queue.Enqueue(next);   // TryAdd doubles as "visited"
    }
    return -1;
}

// DFS: go deep first. D is reached twice here (via B and via C), and that is not a cycle.
static void Dfs(Dictionary<string, string[]> g, string node, HashSet<string> visited)
{
    if (!visited.Add(node)) return;
    foreach (string next in g[node]) Dfs(g, next, visited);
}

// Topological order (Kahn's algorithm): repeatedly take a node that nothing still points to
static List<string> TopoOrder(Dictionary<string, string[]> g)
{
    var waitingOn = g.Keys.ToDictionary(k => k, _ => 0);
    foreach (var targets in g.Values)
        foreach (var t in targets) waitingOn[t]++;

    var ready = new Queue<string>(waitingOn.Where(kv => kv.Value == 0).Select(kv => kv.Key));
    var order = new List<string>();
    while (ready.Count > 0)
    {
        string node = ready.Dequeue();
        order.Add(node);
        foreach (string next in g[node])
            if (--waitingOn[next] == 0) ready.Enqueue(next);
    }
    // Nodes stuck waiting are on a cycle
    return order.Count == g.Count ? order : throw new InvalidOperationException("cycle: no valid order");
}
`,
      practice: "Solve 'Number of islands' (grid search) and 'Course schedule' (topological order) in the interview section. Before coding each, draw the graph: what is a node, and what is an edge? Then solve 'Number of islands' a second time with an explicit `Stack<(int, int)>` instead of recursion.",
      teach: "Explain why BFS finds the shortest path when every edge costs the same, and why DFS does not.",
      analogy: "BFS is a ripple spreading from a stone dropped in a pond: it reaches everything one step away, then two steps, then three, so whatever it touches first, it touched by the shortest route. DFS is exploring a maze by always taking the first unexplored corridor and backing up only at dead ends: you'll find the exit, but not necessarily by the shortest way.",
      pitfalls: [
        "Forgetting the visited set and looping forever on a cycle.",
        "Using DFS when the question asks for the fewest steps.",
        "Treating 'already visited' as 'found a cycle' in a directed graph. Two paths meeting at the same node is not a cycle.",
        "Recursive DFS on a large grid. A million cells can overflow the call stack; use an explicit stack or BFS.",
        "Not recognising a graph: 'word ladder', 'course prerequisites' and 'rotting oranges' never say the word."
      ],
      quiz: [
        { q: "Which algorithm finds the shortest path when every edge costs the same?", a: ["DFS", "BFS", "Topological sort", "Dijkstra is required"], c: 1, why: "BFS reaches nodes in order of distance from the start. Dijkstra is needed only when edges have different costs." },
        { q: "What is the time complexity of BFS or DFS with an adjacency list?", a: ["O(V)", "O(V + E)", "O(V²)", "O(E log V)"], c: 1, why: "Each vertex is visited once and each edge examined once. O(E log V) is Dijkstra with a heap." },
        { q: "A topological order exists only if the directed graph…", a: ["is connected", "has no cycles", "is a tree", "has a single starting node"], c: 1, why: "A cycle means some node would have to come before itself. Several starting nodes are fine." },
        { q: "In a directed graph, DFS reaches node D a second time. What does that tell you?", a: ["There is a cycle", "Nothing on its own: check whether D is still on the current path", "The graph is undirected", "The visited set is broken"], c: 1, why: "Only reaching a node that is on the current path means a cycle. Reaching a finished node just means two paths meet." }
      ]
    },
    {
      id: 'backtracking', title: "Backtracking: exploring every choice", level: 2, mins: 35, viz: 'backtrack',
      terms: [
        ['Decision tree', 'Maps all partial candidates where each tree edge picks one valid choice (`include`, `skip`, or next valid digit).'],
        ['Choose → Explore → Un-choose', 'Push one candidate onto `path`, recurse deeper, then `pop()` (`undo`) so sibling branches share zero leaked state.'],
        ['Pruning', 'Dropping impossible branches immediately (`remaining < 0`) cuts exponential search work dramatically.']
      ],
      why: "When a problem asks for 'all combinations', 'every arrangement' or 'any way to fill this', there is usually no clever formula: you try a choice, explore what follows, then undo it. Backtracking is that idea written carefully, and pruning is what keeps it fast enough to use.",
      points: [
        "Backtracking builds a solution **one choice at a time**. At each step: **choose** an option, **explore** recursively, then **un-choose** it, so the next option starts from the same state.",
        "The choices form a **decision tree**, and backtracking is a depth-first search of it. The recursion stack holds the current partial solution.",
        "When you reach a solution, record a **copy** of the path. The path keeps changing after you return, so storing the list itself leaves you with empty or wrong results.",
        "**Pruning** stops a branch as soon as it can't lead to a valid answer: the sum is already too big, or the square is already attacked. The worst case stays the same, but in practice pruning removes most of the tree.",
        "Three shapes cover most problems: **subsets** (include or skip each item), **combinations** (pass a start index so earlier items aren't reused), and **permutations** (track which items are already used).",
        "The cost is exponential by nature: 2ⁿ subsets, n! permutations. That is expected; say so in an interview, then show how pruning or sorting cuts the work down.",
        "If the same sub-question comes up again and again with the same inputs, you are looking at dynamic programming instead: cache the answer rather than exploring it again."
      ],
      code: `
// Subsets: each item is either in or out
var subsets = new List<List<int>>();
Subsets([1, 2, 3], 0, [], subsets);
Console.WriteLine(Show(subsets));     // [] [1] [1,2] [1,2,3] [1,3] [2] [2,3] [3]

// Combination sum with pruning: sorted candidates, so stop once one is too big
var sums = new List<List<int>>();
CombinationSum([2, 3, 5], 8, 0, [], sums);
Console.WriteLine(Show(sums));        // [2,2,2,2] [2,3,3] [3,5]

// Permutations: track which items are already used
var perms = new List<string>();
Permute("abc", new bool[3], new System.Text.StringBuilder(), perms);
Console.WriteLine(string.Join(" ", perms));   // abc acb bac bca cab cba

static void Subsets(int[] items, int start, List<int> path, List<List<int>> result)
{
    result.Add(new List<int>(path));                  // record a COPY of the path
    for (int i = start; i < items.Length; i++)
    {
        path.Add(items[i]);                           // choose
        Subsets(items, i + 1, path, result);          // explore
        path.RemoveAt(path.Count - 1);                // un-choose
    }
}

static void CombinationSum(int[] sorted, int remaining, int start, List<int> path, List<List<int>> result)
{
    if (remaining == 0) { result.Add(new List<int>(path)); return; }
    for (int i = start; i < sorted.Length; i++)
    {
        if (sorted[i] > remaining) break;             // prune: every later candidate is bigger too
        path.Add(sorted[i]);
        CombinationSum(sorted, remaining - sorted[i], i, path, result);   // i, not i + 1: a number may repeat
        path.RemoveAt(path.Count - 1);
    }
}

static void Permute(string items, bool[] used, System.Text.StringBuilder path, List<string> result)
{
    if (path.Length == items.Length) { result.Add(path.ToString()); return; }
    for (int i = 0; i < items.Length; i++)
    {
        if (used[i]) continue;
        used[i] = true; path.Append(items[i]);        // choose
        Permute(items, used, path, result);           // explore
        used[i] = false; path.Length--;               // un-choose
    }
}

static string Show(List<List<int>> lists) => string.Join(" ", lists.Select(l => "[" + string.Join(",", l) + "]"));
`,
      practice: "Solve 'All subsets' in the interview section, then change it to return only the subsets of size k, pruning as soon as the path can no longer reach size k. Finally, solve N-Queens for n = 6 and count the solutions (there are 4).",
      teach: "Explain choose, explore and un-choose using the subsets of [1, 2, 3], and why the code saves a copy of the path.",
      analogy: "Finding your way through a maze with a ball of string. At each junction you pick a corridor and unroll string as you go; at a dead end you wind the string back to the last junction and try the next corridor. The string is your path, and winding it back is the un-choose step.",
      pitfalls: [
        "Adding `path` itself to the results instead of a copy. Every saved result then points at the same list, which ends up empty.",
        "Forgetting to undo a choice, so state from one branch leaks into the next.",
        "Passing `i + 1` when items may repeat, or `i` when they may not. The start index decides whether repeats are allowed.",
        "Generating everything and filtering at the end, when a check during the search would have cut most of the branches."
      ],
      quiz: [
        { q: "Why remove the last item from `path` after the recursive call?", a: ["To save memory", "So the next choice starts from the same state this one did", "Because a C# list can't hold duplicates", "To make the recursion stop"], c: 1, why: "Un-choosing restores the state, so each sibling branch starts from exactly the same point." },
        { q: "The candidates are sorted, and the next one is already bigger than the remaining sum. What should the loop do?", a: ["Skip it and try the next candidate", "Break: every later candidate is bigger too", "Add it anyway and check at the end", "Start again from the first candidate"], c: 1, why: "That is pruning. Sorting makes it safe to stop the whole loop, not just skip one item." },
        { q: "How many subsets does a set of 20 distinct items have?", a: ["400", "20!", "2²⁰, about a million", "190"], c: 2, why: "Each item is either in or out, so there are 2ⁿ subsets. 2²⁰ is 1,048,576, still fine to generate; 2⁴⁰ is not." }
      ]
    },
    // ---------------- Expert ----------------
    {
      id: 'dp', title: 'Dynamic programming and problem-solving strategy', level: 3, mins: 45, viz: 'dptable',
      terms: [
        ['Overlapping subproblems', 'Subtrees computed repeatedly (`dp[3]` needed many times) cached by input key so each distinct state evaluates only once.'],
        ['State & Transition recurrence', 'The exact parameters defining a subproblem (`dp[amount]`) plus the formula linking it to smaller solved answers.'],
        ['Memoization (top-down) vs Tabulation (bottom-up)', 'Top-down caches recursive calls cleanly; bottom-up fills a flat array `0..n` without call-stack depth overhead.']
      ],
      predict: {
        prompt: 'You want to make change for `amount = 6` using coins `[1, 3, 4]`. How many coins does Greedy (pick largest coin first) use vs optimal DP?',
        options: ['Both use 2 coins', 'Greedy uses 3 coins (`4 + 1 + 1`), while DP finds 2 coins (`3 + 3`)', 'Greedy fails to make 6 cleanly'],
        answer: 1,
        explain: 'Picking the biggest coin (`4`) traps Greedy into `4 + 1 + 1` (3 coins). DP evaluates `min(dp[5], dp[3], dp[2]) + 1` and discovers `3 + 3 = 2` coins.'
      },
      why: "Dynamic programming has a reputation for needing a flash of insight. It doesn't: it is a procedure you can learn. And the habits behind it — try a small case, spot repeated work, pick the right structure — work on any problem you haven't seen before.",
      points: [
        "DP applies when a problem has **overlapping subproblems** (the same smaller question is asked repeatedly) and **optimal substructure** (the best answer is built from best answers to subproblems).",
        "Signs you're looking at DP: 'how many ways…', 'the minimum or maximum cost…', 'can you reach…', where each choice affects the choices left later.",
        "The procedure: (1) define the **state**, what `dp[i]` means in words; (2) write the **recurrence**; (3) set the **base cases**; (4) decide the fill order; (5) optimise space last.",
        "**Top-down** (recursion plus a memo) is the easiest to derive. **Bottom-up** (a table filled in order) avoids deep recursion and sometimes needs only O(1) space.",
        "Classic families: 1D (climbing stairs, house robber), unbounded choice (coin change), two sequences (longest common subsequence, edit distance), grid paths, knapsack.",
        "**Greedy**, taking the locally best choice, is simpler but only correct for some problems. One counter-example is enough to rule it out.",
        "For any unfamiliar problem: work a small example by hand; write the brute force and its complexity; look for wasted work (repeated subproblems → memo, repeated scans → hash map or sorting, 'next smallest' → heap); then check the edge cases: empty input, one item, duplicates, huge n."
      ],
      code: `
// 1. Plain recursion: correct but exponential, because the same subproblems are solved again and again
static long FibSlow(int n) => n < 2 ? n : FibSlow(n - 1) + FibSlow(n - 2);

// 2. Top-down: the same recursion plus a memo. O(n).
static long FibMemo(int n, Dictionary<int, long> memo)
{
    if (n < 2) return n;
    if (memo.TryGetValue(n, out long cached)) return cached;
    return memo[n] = FibMemo(n - 1, memo) + FibMemo(n - 2, memo);
}

// 3. Bottom-up: fill from the smallest subproblem. O(n) time, O(1) space.
static long FibTable(int n)
{
    long prev = 0, cur = 1;
    for (int i = 2; i <= n; i++) (prev, cur) = (cur, prev + cur);
    return n == 0 ? 0 : cur;
}

// Two sequences: longest common subsequence.
// State: dp[i, j] = LCS length of the first i characters of a and the first j of b.
static int Lcs(string a, string b)
{
    var dp = new int[a.Length + 1, b.Length + 1];       // row 0 and column 0 are the base cases
    for (int i = 1; i <= a.Length; i++)
        for (int j = 1; j <= b.Length; j++)
            dp[i, j] = a[i - 1] == b[j - 1]
                ? dp[i - 1, j - 1] + 1
                : Math.Max(dp[i - 1, j], dp[i, j - 1]);
    return dp[a.Length, b.Length];
}

Console.WriteLine(FibSlow(25));                 // 75025: fine. FibSlow(80) would take years
Console.WriteLine(FibMemo(80, new()));          // 23416728348467685, instantly
Console.WriteLine(FibTable(80));                // 23416728348467685
Console.WriteLine(Lcs("kitten", "sitting"));    // 4 ("ittn")
`,
      practice: "Solve 'Climbing stairs' and 'Coin change' in the interview section, writing the state definition as a comment before any code. Then find coins and an amount where always taking the largest coin first gives a worse answer than your DP. Finally, pick a problem you haven't seen in the interview section and write down the strategy steps before writing any code.",
      teach: "Explain dynamic programming as 'recursion plus remembering', using Fibonacci, and state the five steps for designing a DP solution.",
      analogy: "Dynamic programming is doing a long calculation on paper and writing each intermediate result in the margin. The next time you need 37 × 12 you look at the margin instead of working it out again. The technique is noticing which intermediate results you keep needing, and deciding what to write in the margin.",
      pitfalls: [
        "Starting to code before stating in words what `dp[i]` means.",
        "Trying greedy on a DP problem without looking for a counter-example.",
        "Memorising solutions instead of the five-step procedure.",
        "Deep top-down recursion on a large input (n in the hundreds of thousands) overflowing the stack. Switch to bottom-up."
      ],
      quiz: [
        { q: "Which two properties make a problem suitable for dynamic programming?", a: ["Sorted input and unique values", "Overlapping subproblems and optimal substructure", "A recursive solution and small input", "A greedy solution that fails"], c: 1, why: "Repeated subproblems make caching worthwhile; optimal substructure makes combining cached answers correct." },
        { q: "What is the first step in designing a DP solution?", a: ["Optimise space", "Define precisely what the state means", "Write the nested loops", "Write the memo dictionary"], c: 1, why: "Without a clear state definition the recurrence cannot be written or checked." },
        { q: "When is a greedy algorithm safe to use?", a: ["Whenever it is faster than DP", "When you can argue the locally best choice never blocks the best overall answer", "Whenever the input is sorted", "Never in interviews"], c: 1, why: "Greedy needs a reason it is always right. Without one, a single counter-example sends you back to DP." }
      ]
    },
    {
      id: 'concurrency', title: "Concurrency: threads, locks and event loops", level: 3, mins: 40,
      terms: [
        ['Concurrency vs Parallelism', 'Concurrency interleaves independent tasks logically (even on 1 core); parallelism executes instructions physically at once across cores.'],
        ['Mutex / Mutual exclusion lock', 'Allows one thread into a critical section at a time — misordered locks create deadlocks across threads just like SQL.'],
        ['Single-threaded event loop', 'Avoids lock contention on shared JS/Dart memory by running one JS/UI turn at a time while offloading I/O and CPU pools cleanly.']
      ],
      why: "A lost update in SQL, thread-pool starvation in ASP.NET Core, a frozen Flutter screen and a React state update that 'didn't happen' are one subject seen from different tracks: more than one thing in progress at once, touching shared state. Seeing the common model makes each of them easier to reason about.",
      points: [
        "A **process** has its own memory; its **threads** share it. Sharing is what makes threads fast to coordinate, and easy to get wrong.",
        "**Concurrency** means several tasks are in progress at once; **parallelism** means they run at the same moment on different cores. An event loop gives concurrency on a single thread.",
        "A **race condition** is a result that depends on timing. `count++` is read, add, write: two threads can both read 5 and both write 6, and one increment is lost.",
        "Fixes, simplest first: **don't share** (give each task its own data and combine at the end), make the operation **atomic** (`Interlocked.Increment`, or one SQL `UPDATE … SET x = x + 1`), or protect it with a **lock** so only one thread runs that section at a time.",
        "Locks bring **deadlocks** when two threads take the same locks in different orders. The cure is the one from SQL: always take them in the same order, and hold them briefly.",
        "**Event loops** (JavaScript, Dart, a UI thread) run one callback at a time, so synchronous code between two `await`s is never interrupted. But other code can run at each `await`, so anything you checked before it may have changed after: the same reason a Cubit checks `isClosed`.",
        "Heavy CPU work blocks an event loop completely. Move it off that thread: a Web Worker, `compute` in Flutter, `Task.Run` in a desktop app. In ASP.NET Core, keep request code async and let the thread pool do its job."
      ],
      code: `
// A race: four threads each add 100,000 to shared counters
int unsafeCount = 0, atomicCount = 0, lockedCount = 0;
var gate = new object();

Parallel.For(0, 4, _ =>
{
    for (int i = 0; i < 100_000; i++)
    {
        unsafeCount++;                                // read, add, write: not atomic
        Interlocked.Increment(ref atomicCount);       // one atomic CPU instruction
        lock (gate) { lockedCount++; }                // one thread at a time
    }
});
Console.WriteLine(unsafeCount < 400_000);             // usually True: increments were lost
Console.WriteLine($"{atomicCount} {lockedCount}");    // 400000 400000

// Often better: don't share at all. Each task sums its own range; combine at the end.
long[] parts = await Task.WhenAll(Enumerable.Range(0, 4).Select(p => Task.Run(() =>
{
    long sum = 0;
    for (int i = p * 250_000; i < (p + 1) * 250_000; i++) sum += i;
    return sum;
})));
Console.WriteLine(parts.Sum());                       // 499999500000

// Check, await, act: another call can run at the await. lock can't contain an await,
// so SemaphoreSlim(1, 1) is the async lock that holds the check and the change together.
var stock = new Dictionary<string, int> { ["Chair"] = 1 };
var oneAtATime = new SemaphoreSlim(1, 1);
async Task<string> BuyAsync(string item)
{
    await oneAtATime.WaitAsync();
    try
    {
        if (stock[item] == 0) return "sold out";
        await Task.Delay(10);                         // a payment call, say
        stock[item]--;
        return "bought";
    }
    finally { oneAtATime.Release(); }
}
Console.WriteLine(string.Join(", ", await Task.WhenAll(BuyAsync("Chair"), BuyAsync("Chair"))));   // bought, sold out
`,
      practice: "Run the counter example several times and note how many increments are lost each time. Then write an in-memory 'add to cart' in C# with a `Dictionary<int, int>`, call it from 1,000 parallel tasks, and make it safe twice: once with a lock, once with `ConcurrentDictionary.AddOrUpdate`. Finally, remove the `SemaphoreSlim` from `BuyAsync` and see both purchases succeed.",
      teach: "Explain why `count++` on two threads can lose an update, and three ways to prevent it.",
      analogy: "Two cashiers updating the same paper ledger. Both read the balance 500, both add their own sale, both write down their total, and one sale disappears. A lock is a rule that only the person holding the pen may write; an atomic operation is a till that adds the sale in a single press.",
      pitfalls: [
        "Assuming `count++` or `List<T>.Add` is safe from several threads. Neither is; use `Interlocked`, a concurrent collection, or a lock.",
        "Trying to `await` inside a `lock`. The compiler forbids it; use `SemaphoreSlim.WaitAsync` instead.",
        "Checking a condition, awaiting, then acting as if it still holds. Check again after the `await`, or hold an async lock across both.",
        "Blocking on async code with `.Result` while holding a lock or on a UI thread: a classic way to deadlock."
      ],
      quiz: [
        { q: "Two threads each run `count++` 1,000 times on a shared `int` that starts at 0. What is the final value?", a: ["Always 2,000", "Anything up to 2,000: increments can be lost", "Always 1,000", "The program throws an exception"], c: 1, why: "`count++` is a read, an add and a write. Two threads can read the same value and both write the same result." },
        { q: "Why is synchronous JavaScript code never interrupted by another callback?", a: ["The browser locks every variable", "The event loop runs one callback at a time, on one thread", "`await` copies all the variables", "JavaScript has no concurrency at all"], c: 1, why: "Other callbacks run only when the current one returns or reaches an `await`. That is why state can change across an `await`, but not in the middle of synchronous code." },
        { q: "In C#, you need to protect a section that contains an `await`. What do you use?", a: ["`lock (gate) { … }`", "`SemaphoreSlim` with `await WaitAsync()` and `Release()`", "`Thread.Sleep` before the section", "`volatile` on the fields"], c: 1, why: "`lock` can't contain an `await`. `SemaphoreSlim(1, 1)` works as an async lock; release it in a `finally` block." }
      ]
    }
  ]
});
