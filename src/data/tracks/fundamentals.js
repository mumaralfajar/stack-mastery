export const track = {
  id: 'cs', name: 'CS Fundamentals', lang: 'cs',
  tagline: 'The foundations: Git, complexity, data structures, and algorithms behind coding interviews and everyday performance.',
  lessons: [
    // ---------------- Beginner ----------------
    {
      id: 'git', title: 'Git and the developer workflow', level: 0, mins: 30, lang: 'sh',
      terms: [
        ['Staging area (`git add`)', 'Holds the exact edits queued for your next commit, separate from changes in your working directory.'],
        ['Branch & PR merge', 'Isolated pointer letting you build a feature safely before review and merging back into `main`.'],
        ['`.gitignore`', 'Stops secrets, `node_modules/`, `bin/`, and `.env` files from ever reaching Git.']
      ],
      why: "Teams use Git every day. It's your undo button and collaboration hub, and a public history of real work gives a new developer instant credibility.",
      points: [
        "A **repository** is a project plus its full history. A **commit** is a saved snapshot with a message explaining why it changed.",
        "You work across three areas: the **working directory** (files on disk), the **staging area** (`git add` picks what goes into the next commit), and **history** (`git commit`).",
        "A **branch** is a movable pointer to a commit. Create one per feature so `main` keeps working: `git switch -c feature/cart`.",
        "A **remote** (GitHub, GitLab) is a shared copy. Run `git push` to upload your commits and `git pull` to fetch others'.",
        "On a team, push a branch and open a **pull request** so teammates review it before merging on GitHub. Working solo without a host, `git merge feature/cart` on `main` merges it locally.",
        "A **conflict** only means two commits edited the same lines and Git wants you to pick one.",
        "Commit small steps often with imperative messages like 'Add stock check to checkout'. Keep build artifacts and secrets out using `.gitignore`."
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
      practice: "Put your current practice project under Git with `git init -b main` and a `.gitignore`. Make three small commits with clear messages. Then branch off, edit the same line on both branches, merge into `main` locally, and fix the conflict by hand. Push to a new GitHub repo and repeat that feature flow with a pull request.",
      teach: "Explain how the working directory, staging area, and a commit differ, and why branches make teamwork safe.",
      analogy: "Git works like a save-game system for code. A commit is a save point with a note about what changed. A branch is a second save slot for risky work. If it pans out, merge it back, and if not, your main save stays untouched.",
      pitfalls: [
        "Lumping a day's work into one commit named 'changes'. Nobody can review it, and you can't undo part of it.",
        "Treating a merge conflict as an error. It's a prompt asking which of the two edits you want to keep.",
        "Committing a password or connection string. Deleting it later leaves it in Git history, so change or revoke the credential right away.",
        "Running plain `git init` and landing on `master`, which breaks tutorials expecting `main`. Use `git init -b main`, or rename with `git branch -m main`."
      ],
      quiz: [
        { q: "What does `git add` do?", a: ["Creates a commit", "Stages changes for the next commit", "Uploads to the remote", "Starts tracking the whole repository"], c: 1, why: "It moves changes into the staging area, then `git commit` records them." },
        { q: "Why work on a feature branch instead of `main`?", a: ["Commits on a branch can't conflict", "Unfinished work stays isolated, and `main` keeps working and reviewable", "Branches are backed up to GitHub automatically", "Only branches can be pushed"], c: 1, why: "Branches isolate half-done work until it's reviewed and ready to merge. They can still conflict, and nothing uploads until you push." },
        { q: "You pushed a commit containing an API key, then deleted the key in the next commit. What now?", a: ["Nothing, it's gone", "Revoke or rotate the key because it's still in history", "Run `git revert` on the first commit", "Make the repository private again"], c: 1, why: "Every clone keeps the old commit. Once a secret is pushed, assume someone has it." }
      ]
    },
    {
      id: 'bigo', title: 'Big-O: how code scales', level: 0, mins: 30, viz: 'bigo',
      terms: [
        ['Time complexity (`O(n)`, `O(log n)`)', 'Measures how operations grow relative to input size `n` rather than wall-clock milliseconds on one laptop.'],
        ['Nested loop `O(n²)` trap', 'Scanning an array inside a loop turns `1,000` items into `1,000,000` steps. A `HashSet` cuts it to `O(n)`.'],
        ['Space-time trade-off', 'Spending `O(n)` extra RAM for a hash table or memo table turns `O(n²)` or `O(2ⁿ)` work into fast linear time.']
      ],
      predict: {
        prompt: '`BinarySearch` finds a value among 1,000,000 sorted items in about 20 steps. Roughly how many steps does it need once the array grows to 2,000,000 items?',
        options: ['About `40`: twice the data, twice the work', 'About `21`: doubling `n` adds a single halving step', 'About `400`: binary search is `O(n²)` in the worst case'],
        answer: 1,
        explain: 'Binary search is `O(log n)`: each comparison halves the remaining range. `log₂(1,000,000)` is about `20` and `log₂(2,000,000)` is about `21`, so doubling the input costs one extra step. Compare `HasDuplicateSlow`, which is `O(n²)`: doubling `n` there roughly quadruples the comparisons.'
      },
      why: "Interviews almost always ask for the time and space complexity of your answer. Big-O matters even more day to day: it tells you whether code that survives 100 rows will choke on 10 million.",
      points: [
        "Big-O describes how the **number of steps grows** as input size n grows. It drops constants and smaller terms, so 3n + 10 simplifies to O(n).",
        "Common classes from fastest to slowest: **O(1)** constant, **O(log n)** logarithmic, **O(n)** linear, **O(n log n)**, **O(n²)** quadratic, and **O(2ⁿ)** exponential.",
        "Quick rules of thumb: a single loop is O(n), and nested loops are O(n²). Halving the work each step gives O(log n), while sorting takes O(n log n).",
        "**Space complexity** counts extra memory the same way. Many speedups trade space for time, such as using a hash set to turn an O(n²) duplicate check into O(n).",
        "Unless told otherwise, analyse the **worst case**. 'Amortized O(1)' means a rare slow step is cheap on average, like `List.Add`.",
        "At n = 1,000,000, O(log n) takes about 20 steps, O(n) takes a million, and O(n²) hits a trillion."
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
      practice: "Use the visualization to compare the classes at n = 1,000 and n = 1,000,000. Next, time `HasDuplicateSlow` and `HasDuplicateFast` with `Stopwatch` on 10,000, 20,000, and 40,000 items. Run each size twice and record the second run to skip JIT warm-up. What happens to each runtime when n doubles?",
      teach: "Explain what O(n) and O(n²) mean to someone who hasn't seen the notation, using an everyday example.",
      analogy: "Think of looking up a name in a phone book. Reading every page is O(n), and opening in the middle to halve the pile each time is O(log n). Having everyone in a room shake hands to match birthdays is O(n²): fine for 10 people, hopeless for a stadium.",
      pitfalls: [
        "Counting lines of code instead of how work scales. One line calling `list.Contains` inside a loop is still O(n²).",
        "Forgetting hidden costs like sorting, `string` concatenation in a loop, or `Insert(0, x)` on a list.",
        "Stating the time complexity and forgetting space."
      ],
      quiz: [
        { q: "What is the complexity of a loop over n items that calls `list.Contains(x)` on a list of n items each time?", a: ["O(n)", "O(n log n)", "O(n²)", "O(1), because `Contains` is built in"], c: 2, why: "`Contains` on a list is O(n) itself, and it runs n times. Built-in doesn't mean free." },
        { q: "Binary search on 1,000,000 sorted items needs about how many steps?", a: ["20", "1,000", "500,000", "1,000,000"], c: 0, why: "log₂(1,000,000) ≈ 20 because each step cuts the remaining items in half." },
        { q: "5n² + 3n + 100 simplifies to…", a: ["O(n)", "O(5n²)", "O(n²)", "O(n² + n)"], c: 2, why: "Drop constants and lower-order terms. The n² term dominates as n grows." }
      ]
    },
    {
      id: 'numbers', title: "Numbers and text: binary, floating point and Unicode", level: 0, mins: 30,
      terms: [
        ['IEEE-754 binary float (`double`)', 'Stores base-2 fractions fast for graphics and physics, so base-10 decimals like `0.1` repeat and round slightly.'],
        ['Integer overflow', 'Exceeding 32-bit `int` max (`~2.14B`) wraps back around without error unless checked or promoted to `long` / `Int64`.'],
        ['UTF-8 code unit vs grapheme cluster', 'Emoji like `"👍🏽"` take multiple UTF-8 bytes and UTF-16 `char`s. Measure real characters with `StringInfo` / `Intl.Segmenter`.']
      ],
      predict: {
        prompt: 'In C# (`double`), JavaScript (`number`), or Dart (`double`), what does `0.1 + 0.2 === 0.3` evaluate to?',
        options: ['`true` (`0.3` exact)', '`false` (equals `0.30000000000000004` in binary IEEE-754)', 'Throws an overflow warning'],
        answer: 1,
        explain: "`1/10` and `1/5` don't terminate in base-2 binary fractions (`0.000110011...`), so binary floats round both inputs slightly. Use `decimal` or integer cents for money."
      },
      why: "Money a cent off, a name displaying as 'Ã©', or an id breaking past 2.1 billion all stem from how computers store numbers and text. These same details show up everywhere: `DECIMAL` in SQL, `decimal` in C#, `NVARCHAR`, and JavaScript's single number type.",
      points: [
        "Everything is stored in **binary**. A 32-bit `int` holds about ±2.1 billion, while a 64-bit `long` holds ±9.2 × 10¹⁸. Go past the limit and it **overflows**: in C# it wraps around without warning unless you're in a `checked` block.",
        "`double` (and every JavaScript `number`) is binary **floating point**. Most decimal fractions, like 0.1, have no exact binary form, so `0.1 + 0.2` equals `0.30000000000000004`.",
        "For money, use an exact decimal type like `decimal` in C#, `DECIMAL(19,4)` in SQL Server, or integer rupiah/cents. Never check floats with `==`, compare with a small tolerance instead.",
        "JavaScript has one number type, and its integers stay exact only up to 2⁵³ − 1 (`Number.MAX_SAFE_INTEGER`). A 64-bit database id past that loses digits in the browser, so send large ids as strings or use `BigInt`.",
        "Text is a sequence of **Unicode code points** encoded into bytes. **UTF-8**, the web default, uses 1 to 4 bytes per character, while C#, JavaScript, and Java strings use **UTF-16**, where an emoji takes two 16-bit units.",
        "So 'length' depends on what you count: `\"👍\".Length` is 2 in C# and JavaScript, even though you see one character. Garbled text like 'Ã©' means bytes were written in one encoding and decoded in another.",
        "In SQL Server, `NVARCHAR` stores Unicode. `VARCHAR` uses a single code page unless the column uses a UTF-8 collation, so names in other scripts can turn into '?'."
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
        "Storing money in `double`, `float`, or SQL `REAL` or `FLOAT`. Tiny rounding errors stack up over thousands of rows.",
        "Sending a 64-bit id to JavaScript as a number. Past 2⁵³, its low digits change without warning.",
        "Cutting a string at a fixed number of `char`s, which can slice an emoji in half.",
        "Declaring names as `VARCHAR` and getting '?' for anything outside the code page."
      ],
      quiz: [
        { q: "Why is `0.1 + 0.2 == 0.3` false for `double` in C#?", a: ["The compiler rounds the right-hand side", "0.1 and 0.2 have no exact binary form, so the sum is slightly off", "`==` compares references for doubles", "A double keeps only two decimal places"], c: 1, why: "Binary floating point stores the nearest binary fraction, making the sum 0.30000000000000004. Use `decimal` for exact decimals." },
        { q: "Which type fits an account balance in SQL Server?", a: ["`FLOAT`", "`REAL`", "`DECIMAL(19,4)`", "`NVARCHAR(20)`"], c: 2, why: "`DECIMAL` is exact in base 10. `FLOAT` and `REAL` are binary floats, and text can't be summed or checked as numbers." },
        { q: "`\"👍\".Length` is 2 in C#. Why?", a: ["C# strings are UTF-16, and this emoji needs two 16-bit units", "Windows stores every emoji as two characters", "`Length` counts bytes in UTF-8", "It's a bug in .NET"], c: 0, why: "Characters past the first 65,536 code points use a surrogate pair in UTF-16. Use `EnumerateRunes()` to count code points." }
      ]
    },
    // ---------------- Intermediate ----------------
    {
      id: 'structures', title: 'Arrays, hash tables, stacks, queues and linked lists', level: 1, mins: 40,
      terms: [
        ['Array vs Linked List', 'Arrays sit side by side in RAM (fast CPU cache + `O(1)` index), while linked lists chase scattered pointers (`O(n)` scan) and rarely win.'],
        ['Hash table (`Dictionary` / `Map`)', 'Hashes keys to array buckets for `O(1)` average lookup, powering roughly 80% of coding interview speedups.'],
        ['Stack (LIFO) vs Queue (FIFO)', 'Stacks handle undo history and DFS recursion, while Queues preserve arrival order for BFS and task workers.']
      ],
      why: "Picking the right data structure is often half the solution. Think `Dictionary` behind a cache, a queue behind background jobs, and a stack behind undo: the same few pieces keep showing up.",
      points: [
        "An **array** or **list** uses contiguous memory. Index access is O(1) and appending is amortized O(1), while middle inserts and searches cost O(n).",
        "A **hash table** (`Dictionary`, `HashSet`) hashes keys into buckets for O(1) **average** lookup, insert, and delete with no ordering.",
        "A hash table is only as good as its keys. If too many keys hit one bucket, lookups slow toward O(n), and mutating a stored key hides it forever.",
        "A **stack** works last in, first out, pushing and popping at one end. It powers undo, bracket matching, depth-first search, and the call stack itself.",
        "A **queue** works first in, first out: push at the back, pop from the front, used for work queues and breadth-first search.",
        "A **linked list** connects nodes via pointers. Inserting or deleting a node you already hold is O(1), though reaching it takes O(n) with poor CPU cache locality. Interview problems use a custom node class with a `Next` pointer rather than .NET's `LinkedList<T>`.",
        "Ask three questions: which operations do I need, how often do they run, and how big is the data? Your answers choose the structure."
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
      practice: "Solve three interview problems and name the structure before coding: 'Pair with target sum' (hash map), 'Valid brackets' (stack), and 'Reverse a linked list' (`ListNode` pointers). For each one, explain why the obvious alternative runs slower.",
      teach: "Explain why looking up a key in a hash table is O(1) on average while searching a list is O(n).",
      analogy: "A list is a row of numbered lockers: instant if you know the number, a long walk if you only know what's inside. A hash table is a coat check where your ticket number comes straight from your name, so the attendant walks to the right hook.",
      pitfalls: [
        "Using a list where you need a set or dictionary, then scanning it inside a loop.",
        "Assuming a dictionary preserves insertion or sorted order. Use `SortedDictionary` or sort when order matters.",
        "Reaching for a linked list for 'fast inserts' when finding the spot is O(n) anyway.",
        "Losing the rest of a linked list by overwriting `Next` before saving it. Sketch the boxes and arrows first."
      ],
      quiz: [
        { q: "Which structure gives O(1) average lookup by key?", a: ["`List<T>` kept sorted", "`LinkedList<T>`", "Hash table", "`Queue<T>`"], c: 2, why: "The key's hash jumps straight to its bucket. A sorted list gives O(log n) via binary search." },
        { q: "Which structure fits 'undo the most recent action'?", a: ["Queue", "Stack", "Dictionary", "Sorted list"], c: 1, why: "Undo is last in, first out." },
        { q: "What is the cost of `list.Insert(0, x)` on a List of n items?", a: ["O(1)", "O(log n)", "O(n)", "Amortized O(1), like `Add`"], c: 2, why: "Every existing element shifts right by one spot. Only appending at the end is amortized O(1)." }
      ]
    },
    {
      id: 'sorting', title: 'Recursion and sorting', level: 1, mins: 40, viz: 'sort',
      terms: [
        ['Base case & call stack frame', 'Every recursive function needs a stopping branch, or frames pile up until `StackOverflowException` crashes the app.'],
        ['Divide-and-conquer (`O(n log n)`)', 'Merge sort and Quick sort split the array repeatedly (`log n` levels × `n` work per level) instead of `O(n²)` neighbor swaps.'],
        ['Stable sort', 'Preserves original relative order when two items tie (`sort` in C#/JS `.toSorted()` by `key`).']
      ],
      why: "Recursion is the tool behind trees, graphs, backtracking, and dynamic programming. Sorting is often step one in algorithm problems, and seeing why it costs O(n log n) helps you analyse other algorithms.",
      points: [
        "A recursive function tackles a problem by solving a **smaller version of the same problem**. It needs a **base case** to stop and a step moving toward it.",
        "Each call pushes a frame onto the call stack. Very deep recursion overflows the stack, though any recursion can be rewritten with an explicit stack.",
        "Merge sort uses **divide and conquer**: split the array in two, sort each half, and combine them. That always keeps it at O(n log n).",
        "Bubble and insertion sort run in O(n²) time, which works fine on tiny or nearly sorted arrays. Quick sort averages O(n log n), with an O(n²) worst case.",
        "Comparison sorting can't beat O(n log n) in general. A **stable** sort keeps tied items in their original order, like LINQ's `OrderBy`, whereas `Array.Sort` and `List.Sort` aren't.",
        "In production, call the built-ins. In interviews, try 'sort first', then exploit that order with two pointers or binary search."
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
      practice: "Run all four algorithms in the sorting visualization and note the comparison counts. Next, write a recursive `Sum(object[] items)` for nested arrays like `[1, new object[] { 2, new object[] { 3, 4 } }, 5]` returning 15, using `item is int n` and `item is object[] inner`. Trace its call stack on paper.",
      teach: "Explain recursion using merge sort: what is the base case, what is the smaller problem, and how do the results combine?",
      analogy: "To merge sort a deck of cards, split it in half and hand each pile to a friend with the same rule. When both sorted halves return, merge them by always taking the smaller top card. That same rule repeats at every level down to one card, which is your base case.",
      pitfalls: [
        "Missing or unreachable base case: infinite recursion causes an uncatchable `StackOverflowException`.",
        "Integer overflow in recursion. With `int`, `Factorial(13)` gives garbage without error, while `long` reaches 20! and `checked` makes overflow throw.",
        "Sorting by one key after another with `Array.Sort` expecting the first order to stick. Use `OrderBy(...).ThenBy(...)`.",
        "Writing your own sort in production code instead of using the standard library."
      ],
      quiz: [
        { q: "What two things must every recursive function have?", a: ["A loop and a counter", "A base case and a step towards it", "A memo and a return value", "Two recursive calls"], c: 1, why: "Without a base case it never stops, and without progress it never reaches the base case." },
        { q: "What is the time complexity of merge sort?", a: ["O(n)", "O(n log n)", "O(n²) in the worst case", "O(log n)"], c: 1, why: "You get log n splitting levels with O(n) merge work on each level regardless of input. Quick sort is the one with an O(n²) worst case." },
        { q: "You sort orders by date, then sort the result by customer with `Array.Sort`. Are each customer's orders still in date order?", a: ["Yes, always", "Not guaranteed: `Array.Sort` is not stable", "Only for small arrays", "Yes, if dates are unique"], c: 1, why: "An unstable sort can shuffle equal keys. `OrderBy(o => o.Customer).ThenBy(o => o.Date)` makes your intent clear." }
      ]
    },
    // ---------------- Advanced ----------------
    {
      id: 'trees', title: 'Trees, heaps and binary search', level: 2, mins: 40,
      splits: [['1 · BST insert & traversal', '// Binary search tree'], ['2 · Build & heap', 'Node? root = null;'], ['3 · Binary search on a condition', '// Binary search on a condition'], ['4 · Node class', 'class Node(int value)']],
      terms: [
        ['Binary search invariant (`lo <= hi`)', 'Halves any sorted monotonic range in `O(log n)` steps, including binary search on answers.'],
        ['Heap (`PriorityQueue`)', 'Partially ordered tree pulling the min or max item in `O(log n)`, powering Top-K, timers, and Dijkstra.'],
        ['Tree traversals (`DFS` pre/in/post vs `BFS`)', 'DFS drills root-to-leaf recursively, while BFS visits level by level with a queue.']
      ],
      predict: {
        prompt: 'The code inserts `8, 3, 10, 1, 6` and `Height(root)` prints `3`. What would `Height(root)` print if you inserted the already sorted `1, 3, 6, 8, 10` into an empty tree instead?',
        options: ['`3`: the same values always build the same tree', '`5`: every value becomes a right child, so the tree turns into a linked list', '`1`: sorted input produces a perfectly flat tree'],
        answer: 1,
        explain: 'This BST never rebalances. Each new value is larger than everything before it, so it goes right every time and the tree degenerates into a chain of height `5`. Search then costs `O(n)` instead of `O(log n)`. Self-balancing trees (red-black or AVL) rotate nodes to keep the height logarithmic; `SortedDictionary` is built on a red-black tree for exactly this reason.'
      },
      why: "Trees show up everywhere in the stack: the DOM, JSON, filesystems, React's component tree, and SQL B-tree indexes. Heaps handle 'what comes next?' problems like top K and scheduling, and binary search works on far more than arrays.",
      points: [
        "A **tree** is nodes with children and no cycles, and a **binary tree** caps each node at two children. A balanced tree with n nodes is around log₂ n levels deep.",
        "A **binary search tree** keeps left < node < right. When balanced, search, insert, and delete take O(log n), though a skewed tree drops to O(n). Red-black trees and SQL B-trees stay balanced automatically.",
        "Traversals come in four flavors: **in-order** (left, node, right: sorted for a BST), **pre-order** and **post-order** (depth-first), and **level-order** (breadth-first with a queue).",
        "Most tree problems boil down to one recursive question: 'if I knew the answer for my left and right subtrees, what's my answer?'",
        "A **heap** is a tree where every parent is at most its children (min-heap). You peek the minimum in O(1) and insert or pop in O(log n), via `PriorityQueue<TElement, TPriority>` in .NET.",
        "**Binary search** applies to any condition flipping from false to true once across a range. Search for that flip point instead of a target value."
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
      practice: "Solve 'Maximum depth of a binary tree', 'Level-order traversal', and 'Top K frequent elements' in the interview tab, writing the recursive question first. Then use `FirstTrue` to find the smallest daily capacity shipping 10 orders sized [3, 5, 2, 8, 4, 1, 7, 6, 2, 3] in order within 5 days (answer: 11).",
      teach: "Explain why a balanced binary search tree finds a value in O(log n), and what breaks when values are inserted in sorted order.",
      analogy: "A binary search tree works like guessing a number: each higher-or-lower answer removes half the possibilities. If the tree is lopsided, each step cuts just one option, and the search slows down to linear counting.",
      pitfalls: [
        "Assuming any binary tree is a search tree, or that any BST is balanced.",
        "Keeping a sorted list and re-sorting on every insert when a heap fits better.",
        "Forgetting the null check at the top of a recursive tree function.",
        "Expecting `PriorityQueue` to return ties in insertion order. It doesn't promise that.",
        "Infinite binary search loops: with `lo < hi`, always move `lo` to `mid + 1` or `hi` to `mid`, never `lo = mid`."
      ],
      quiz: [
        { q: "Which traversal visits a binary search tree's values in sorted order?", a: ["Pre-order", "In-order", "Post-order", "Level-order"], c: 1, why: "Left subtree (smaller), node, right subtree (larger)." },
        { q: "What does a min-heap guarantee?", a: ["Every level is sorted left to right", "The smallest element is at the root", "Searching for any value is O(log n)", "Equal priorities come out in insertion order"], c: 1, why: "Only parent-child order holds, keeping the minimum at the root. Searching for an arbitrary value still takes O(n)." },
        { q: "Inserting 1, 2, 3, 4, 5 in order into a plain BST produces…", a: ["A balanced tree", "A chain of right children with O(n) search", "A tree of height 3", "A min-heap"], c: 1, why: "Each value exceeds the last, turning the tree into a linked list." }
      ]
    },
    {
      id: 'graphs', title: 'Graphs: BFS, DFS and topological order', level: 2, mins: 40, viz: 'graphsearch',
      splits: [['1 · Adjacency list & driver', '// Adjacency list'], ['2 · BFS shortest path', '// BFS: level by level'], ['3 · DFS', '// DFS: go deep first'], ['4 · Topological order', '// Topological order']],
      terms: [
        ['Visited set (`seen`)', 'Tracks explored vertices *as you enqueue* so cycles never loop forever or visit nodes twice.'],
        ['BFS shortest path (unweighted)', 'Explores distance rings `0, 1, 2...` in order, ensuring the first path reaching a target is shortest.'],
        ['Topological sort (`in-degree`)', 'Orders directed acyclic tasks (`DAG`: build pipelines, migrations, installers) before anything depending on them runs.']
      ],
      predict: {
        prompt: 'Starting from `A`, in what order does `Dfs` add nodes to `seen`?',
        options: ['`A B C D E`', '`A B D E C`', '`A B D E C D E`'],
        answer: 1,
        explain: 'DFS follows one branch as deep as it can before backtracking: `A`, `B`, `D`, `E`, then back up to `A` to try `C`. When `C` looks at `D`, `visited.Add` returns false, so `D` is not visited twice and no cycle is involved. `A B C D E` is the level-by-level order BFS would produce from `A`.'
      },
      why: "Maps, social networks, build tools, and grids are graphs, and so is your app code. A DI container wiring constructors and EF Core ordering migrations both walk a graph, so the hard part is spotting the graph in a problem.",
      points: [
        "A **graph** connects nodes (vertices) with edges that can be directed or weighted. Trees and linked lists are special cases.",
        "Store it as an **adjacency list** (node → neighbours), which stays compact and fast to loop over. A grid is an implicit graph whose neighbours are adjacent cells.",
        "**BFS** uses a queue to scan outward in rings and finds the **shortest path when every edge has equal cost**. When edge weights vary, like road distances, use Dijkstra's algorithm.",
        "**DFS** (recursion or a stack) explores one branch as deep as possible first, ideal for reachability and connected components.",
        "Always track **visited** nodes, or a cycle loops forever. Both searches run in O(V + E).",
        "Finding a cycle in a **directed** graph takes more than `visited`: track nodes on the active path too. Hitting an active-path node is a cycle, while hitting a finished node isn't.",
        "**Topological sort** orders a directed graph so every prerequisite comes first, like course schedules, builds, or migrations. If no valid order exists, the graph has a cycle."
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
      practice: "Solve 'Number of islands' and 'Course schedule' in the interview section. Sketch the nodes and edges before coding, then solve 'Number of islands' a second time with a `Stack<(int, int)>` instead of recursion.",
      teach: "Explain why BFS finds the shortest path when every edge costs the same, and why DFS does not.",
      analogy: "Think of BFS like ripples spreading from a stone dropped in a pond. It reaches everything one step away, then two, then three, so its first hit is always shortest. DFS walks a maze by taking the first new turn and only backing up at dead ends, finding an exit but not always the shortest route.",
      pitfalls: [
        "Forgetting the visited set and looping forever on a cycle.",
        "Using DFS when the question asks for the fewest steps.",
        "Treating 'already visited' as 'found a cycle' in a directed graph. Two paths meeting at one node isn't a cycle.",
        "Recursive DFS on a large grid. A million cells can blow the call stack, so use an explicit stack or BFS.",
        "Missing hidden graphs: 'word ladder', 'course prerequisites', and 'rotting oranges' never say the word."
      ],
      quiz: [
        { q: "Which algorithm finds the shortest path when every edge costs the same?", a: ["DFS", "BFS", "Topological sort", "Dijkstra is required"], c: 1, why: "BFS reaches nodes in order of distance from the start. Dijkstra is needed only when edges have different costs." },
        { q: "What is the time complexity of BFS or DFS with an adjacency list?", a: ["O(V)", "O(V + E)", "O(V²)", "O(E log V)"], c: 1, why: "Each vertex is visited once and each edge examined once. O(E log V) is Dijkstra with a heap." },
        { q: "A topological order exists only if the directed graph…", a: ["is connected", "has no cycles", "is a tree", "has a single starting node"], c: 1, why: "A cycle means some node would have to come before itself. Multiple starting nodes are fine." },
        { q: "In a directed graph, DFS reaches node D a second time. What does that tell you?", a: ["There is a cycle", "Nothing on its own: check whether D is still on the current path", "The graph is undirected", "The visited set is broken"], c: 1, why: "Only reaching a node on the current path means a cycle. Reaching a finished node just means two paths meet." }
      ]
    },
    {
      id: 'backtracking', title: "Backtracking: exploring every choice", level: 2, mins: 35, viz: 'backtrack',
      splits: [['1 · Driver', '// Subsets: each item'], ['2 · Subsets', 'static void Subsets('], ['3 · Combination sum', 'static void CombinationSum('], ['4 · Permutations & Show', 'static void Permute(']],
      terms: [
        ['Decision tree', 'Maps partial candidates where each branch picks one valid option (`include`, `skip`, or next valid digit).'],
        ['Choose → Explore → Un-choose', 'Push one candidate onto `path`, recurse deeper, then `pop()` (`undo`) so sibling branches share zero leaked state.'],
        ['Pruning', 'Dropping impossible branches immediately (`remaining < 0`) shrinks exponential search dramatically.']
      ],
      why: "Problems asking for 'all combinations' or 'every valid arrangement' rarely have a clever formula. You try a choice, explore what follows, and undo it. Backtracking packages that pattern up, and pruning keeps it fast.",
      points: [
        "Backtracking builds a solution **one choice at a time**. At each step, **choose** an option, **explore** recursively, and **un-choose** it so the next branch starts clean.",
        "The choices form a **decision tree**, and backtracking runs a depth-first search over it. The recursion stack holds the active partial solution.",
        "When you hit a solution, save a **copy** of the path. The path keeps mutating as you unwind, so appending the list itself gives empty or broken results.",
        "**Pruning** cuts a branch as soon as it can't succeed, like a sum already too large or a queen under attack. Worst-case Big-O stays exponential, though pruning skips most of the tree.",
        "Three shapes cover most questions. Use **subsets** to include or skip items, **combinations** with a start index to skip earlier items, and **permutations** with a used tracker.",
        "The cost is exponential: 2ⁿ subsets, n! permutations. Say that upfront in an interview, then show how pruning or sorting cuts the work.",
        "If the same sub-question repeats with the same inputs, reach for dynamic programming instead and cache the answer."
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
      practice: "Solve 'All subsets' in the interview tab, then return only size-k subsets and prune branches that can't reach size k. Next, solve N-Queens for n = 6 and count the 4 solutions.",
      teach: "Explain choose, explore, and un-choose using the subsets of [1, 2, 3], and why the code saves a copy of the path.",
      analogy: "Picture walking a maze with a ball of string. At each fork, unroll string down a corridor. At dead ends, wind it back to the last fork and try the next turn: the string is your path, and winding it back is un-choosing.",
      pitfalls: [
        "Adding `path` itself to the results instead of a copy. Every saved item ends up pointing at the same empty list.",
        "Forgetting to undo a choice, letting state from one branch leak into the next.",
        "Passing `i + 1` when items may repeat, or `i` when they shouldn't. The start index controls reuse.",
        "Generating everything and filtering at the end when checking early would prune most branches."
      ],
      quiz: [
        { q: "Why remove the last item from `path` after the recursive call?", a: ["To save memory", "So the next choice starts from the same state this one did", "Because a C# list can't hold duplicates", "To make the recursion stop"], c: 1, why: "Un-choosing restores the state so every sibling branch starts from the exact same point." },
        { q: "The candidates are sorted, and the next one is already bigger than the remaining sum. What should the loop do?", a: ["Skip it and try the next candidate", "Break: every later candidate is bigger too", "Add it anyway and check at the end", "Start again from the first candidate"], c: 1, why: "That's pruning. Sorting makes it safe to break out of the whole loop instead of skipping one item." },
        { q: "How many subsets does a set of 20 distinct items have?", a: ["400", "20!", "2²⁰, about a million", "190"], c: 2, why: "Each item is either in or out, giving 2ⁿ subsets. 2²⁰ is 1,048,576, still small enough to build, while 2⁴⁰ isn't." }
      ]
    },
    // ---------------- Expert ----------------
    {
      id: 'dp', title: 'Dynamic programming and problem-solving strategy', level: 3, mins: 45, viz: 'dptable',
      terms: [
        ['Overlapping subproblems', 'Subtrees computed repeatedly (`dp[3]` needed many times) cached by input key so each state runs once.'],
        ['State & Transition recurrence', 'Exact parameters defining a subproblem (`dp[amount]`) plus the formula linking it to smaller solved answers.'],
        ['Memoization (top-down) vs Tabulation (bottom-up)', 'Top-down caches recursive calls as you go, while bottom-up fills a flat array `0..n` with no call-stack limit.']
      ],
      predict: {
        prompt: 'You want to make change for `amount = 6` using coins `[1, 3, 4]`. How many coins does Greedy (pick largest coin first) use vs optimal DP?',
        options: ['Both use 2 coins', 'Greedy uses 3 coins (`4 + 1 + 1`), while DP finds 2 coins (`3 + 3`)', "Greedy can't make 6 at all"],
        answer: 1,
        explain: 'Picking the biggest coin (`4`) traps Greedy into `4 + 1 + 1` (3 coins). DP evaluates `min(dp[5], dp[3], dp[2]) + 1` and discovers `3 + 3 = 2` coins.'
      },
      why: "Dynamic programming isn't about waiting for a flash of insight. It's a repeatable procedure. Trying a small case, spotting repeated work, and picking the right structure work on any unfamiliar problem.",
      points: [
        "DP applies when smaller questions repeat (**overlapping subproblems**) and combine into the final best answer (**optimal substructure**).",
        "Signs you're facing DP: 'how many ways…', 'minimum or maximum cost…', or 'can you reach…', where each choice shapes later choices.",
        "Follow five steps: (1) define what `dp[i]` means in words, (2) write the **recurrence**, and (3) set **base cases**. Pick the fill order next, and optimize space last.",
        "**Top-down** (recursion plus a memo) is easiest to derive. **Bottom-up** (filling a table in order) avoids deep recursion and sometimes needs just O(1) space.",
        "Classic families: 1D (climbing stairs, house robber), unbounded choice (coin change), two sequences (LCS, edit distance), grid paths, and knapsack.",
        "**Greedy**, taking the locally best choice, is simpler but only holds for certain problems. One counter-example rules it out.",
        "For any unfamiliar problem, work a tiny example by hand and write the brute-force version first. Next, cut wasted work by memoizing repeated subproblems, swapping slow scans for hash maps or sorting, or using a heap. Check edge cases last: empty input, one item, duplicates, and huge n."
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
      practice: "Solve 'Climbing stairs' and 'Coin change' in the interview tab, writing the state meaning in a comment first. Next, find coins and an amount where greedy loses to DP. Pick an unseen interview problem and write out the strategy steps before coding.",
      teach: "Explain dynamic programming as 'recursion plus remembering', using Fibonacci, and list the five steps for building a DP solution.",
      analogy: "Dynamic programming is doing long math on paper and jotting intermediate totals in the margin. When you need 37 × 12 again, you check the margin instead of redoing it: the skill lies in picking which results to write down.",
      pitfalls: [
        "Jumping into code before stating in plain words what `dp[i]` represents.",
        "Assuming greedy works on a DP problem without checking for a counter-example.",
        "Memorising answers instead of the five-step procedure.",
        "Deep top-down recursion on huge inputs (hundreds of thousands) overflowing the stack. Switch to bottom-up."
      ],
      quiz: [
        { q: "Which two properties make a problem suitable for dynamic programming?", a: ["Sorted input and unique values", "Overlapping subproblems and optimal substructure", "A recursive solution and small input", "A greedy solution that fails"], c: 1, why: "Repeated subproblems make caching pay off, while optimal substructure makes combining cached answers valid." },
        { q: "What is the first step in designing a DP solution?", a: ["Optimise space", "Define precisely what the state means", "Write the nested loops", "Write the memo dictionary"], c: 1, why: "Without a clear state definition, you can't write or verify the recurrence." },
        { q: "When is a greedy algorithm safe to use?", a: ["Whenever it is faster than DP", "When you can argue the locally best choice never blocks the best overall answer", "Whenever the input is sorted", "Never in interviews"], c: 1, why: "Greedy needs proof that it stays optimal. Without one, a single counter-example sends you back to DP." }
      ]
    },
    {
      id: 'concurrency', title: "Concurrency: threads, locks and event loops", level: 3, mins: 40,
      terms: [
        ['Concurrency vs Parallelism', 'Concurrency interleaves tasks logically (even on 1 core), while parallelism executes instructions simultaneously across cores.'],
        ['Mutex / Mutual exclusion lock', 'Lets one thread into a critical section at a time, and misordered locks cause deadlocks just like in SQL.'],
        ['Single-threaded event loop', 'Avoids lock contention on shared JS/Dart memory by running one turn at a time while offloading I/O and CPU work.']
      ],
      why: "Lost SQL updates, ASP.NET Core thread-pool starvation, frozen Flutter UIs, and missing React updates all share one root cause. Overlapping tasks touch shared state, so learning this single model helps everywhere.",
      points: [
        "A **process** owns separate memory, while its **threads** share that memory. Sharing makes coordination fast and bugs easy.",
        "**Concurrency** means multiple tasks are in flight together, while **parallelism** runs them at the exact same instant across CPU cores. An event loop gives concurrency on one thread.",
        "A **race condition** makes results depend on timing. `count++` reads, adds, and writes: two threads can both read 5 and write 6, losing an update.",
        "Fixes, simplest first: **don't share** state by letting each task keep its own copy and merge at the end. Otherwise make it **atomic** (`Interlocked.Increment`, or SQL `UPDATE … SET x = x + 1`) or guard it with a **lock**.",
        "Locks bring **deadlocks** when two threads grab the same locks in opposite orders. Always acquire locks in a fixed order and hold them briefly.",
        "**Event loops** (JavaScript, Dart, UI threads) run one callback at a time, so synchronous code between two `await`s never gets interrupted. Other code can run at each `await`, though, which is why a Cubit re-checks `isClosed` afterward.",
        "Heavy CPU work freezes an event loop completely. Move it off to a Web Worker, Flutter's `compute`, or `Task.Run`, and keep ASP.NET Core handlers async for the thread pool."
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
      practice: "Run the counter example several times and see how many increments vanish. Next, build an in-memory `Dictionary<int, int>` cart handler in C#, fire 1,000 parallel tasks at it, and fix it twice with a lock and `ConcurrentDictionary.AddOrUpdate`. Remove `SemaphoreSlim` from `BuyAsync` to watch both purchases slip through.",
      teach: "Explain why `count++` on two threads can lose an update, and three ways to prevent it.",
      analogy: "Picture two cashiers updating one paper ledger. Both read 500, add their sale, and write their total, wiping out the other sale. A lock means only the pen holder writes, while an atomic op is a till adding sales in one press.",
      pitfalls: [
        "Assuming `count++` or `List<T>.Add` is thread-safe. Neither is, so use `Interlocked`, a concurrent collection, or a lock.",
        "Trying to `await` inside a `lock`. The compiler blocks it, so reach for `SemaphoreSlim.WaitAsync` instead.",
        "Checking a condition, awaiting, then assuming it still holds. Re-check after the `await`, or wrap both in an async lock.",
        "Blocking async code with `.Result` under a lock or on a UI thread, which is a classic deadlock setup."
      ],
      quiz: [
        { q: "Two threads each run `count++` 1,000 times on a shared `int` that starts at 0. What is the final value?", a: ["Always 2,000", "Anything up to 2,000: increments can be lost", "Always 1,000", "The program throws an exception"], c: 1, why: "`count++` reads, adds, and writes. Two threads can read the same value and write back the same total." },
        { q: "Why is synchronous JavaScript code never interrupted by another callback?", a: ["The browser locks every variable", "The event loop runs one callback at a time, on one thread", "`await` copies all the variables", "JavaScript has no concurrency at all"], c: 1, why: "Other callbacks wait until the active one returns or hits `await`. State can change across an `await`, never mid-sync block." },
        { q: "In C#, you need to protect a section that contains an `await`. What do you use?", a: ["`lock (gate) { … }`", "`SemaphoreSlim` with `await WaitAsync()` and `Release()`", "`Thread.Sleep` before the section", "`volatile` on the fields"], c: 1, why: "`lock` can't hold an `await`. Use `SemaphoreSlim(1, 1)` as an async lock and release it inside `finally`." }
      ]
    }
  ]
};

export default track;
