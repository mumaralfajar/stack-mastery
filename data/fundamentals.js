TRACKS.push({
  id: 'cs', name: 'CS Fundamentals', lang: 'cs',
  tagline: 'The foundations: Git, complexity, data structures and algorithms — the basis of every coding interview.',
  lessons: [
    // ---------------- Beginner ----------------
    {
      id: 'git', title: 'Git and the developer workflow', level: 0, mins: 30, lang: 'sh',
      why: "Every professional team uses Git every day. It is your undo button, your collaboration tool, and — as a public history of real work — the first thing that gives a new developer credibility.",
      points: [
        "A **repository** is a project plus its full history. A **commit** is a snapshot with a message explaining why it changed.",
        "Three areas: the **working directory** (your files), the **staging area** (`git add` — what the next commit will contain) and the **history** (`git commit`).",
        "A **branch** is a movable pointer to a commit. Create one per feature so `main` always works: `git switch -c feature/cart`.",
        "`git merge` combines histories; a **conflict** just means Git needs you to choose between two edits to the same lines.",
        "A **remote** (GitHub, GitLab) is a shared copy: `git push` uploads your commits, `git pull` downloads others'. A **pull request** asks teammates to review a branch before it is merged.",
        "Commit small and often with messages in the imperative: 'Add stock check to checkout'. Never commit secrets — use `.gitignore`."
      ],
      code: `
# Start tracking a project
git init
git add .
git commit -m "Add product list endpoint"

# Work on a feature without touching main
git switch -c feature/search
git status                      # what changed?
git diff                        # exactly which lines?
git add src/Search.cs
git commit -m "Add search by product name"

# Share it and open a pull request
git push -u origin feature/search

# Bring main up to date, then merge the finished feature
git switch main
git pull
git merge feature/search

# Undo safely
git restore src/Search.cs       # discard uncommitted edits to one file
git revert HEAD                 # new commit that undoes the last one
git log --oneline --graph       # read the history
`,
      practice: "Put your current practice project under Git. Make three small commits with clear messages, create a branch, change the same line on both branches, merge, and resolve the conflict by hand. Then push it to a free GitHub repository.",
      teach: "Explain the difference between the working directory, the staging area and a commit, and why branches make teamwork safe.",
      analogy: "Git is a save-game system for code. A commit is a save point with a note about what you just achieved. A branch is a second save slot where you can try something risky; if it works you merge it back, and if it does not, your main save is untouched.",
      pitfalls: [
        "One giant commit called 'changes' at the end of the day — impossible to review or undo in part.",
        "Fear of merge conflicts. A conflict is a question, not an error.",
        "Committing passwords or connection strings. Removing them later does not remove them from history."
      ],
      quiz: [
        { q: "What does `git add` do?", a: ["Creates a commit", "Stages changes for the next commit", "Uploads to the remote", "Creates a branch"], c: 1, why: "It moves changes into the staging area; `git commit` then records them." },
        { q: "Why work on a feature branch instead of `main`?", a: ["It is faster", "Unfinished work stays isolated, and `main` stays working and reviewable", "Branches use less disk", "Git requires it"], c: 1, why: "Branches isolate changes until they have been reviewed and are ready to merge." },
        { q: "What is a merge conflict?", a: ["A corrupted repository", "Two branches changed the same lines and Git needs you to choose", "A failed push", "A deleted branch"], c: 1, why: "Git merges automatically when it can, and asks a human when two edits overlap." }
      ]
    },
    {
      id: 'bigo', title: 'Big-O: how code scales', level: 0, mins: 30, viz: 'bigo',
      why: "Every coding interview ends with 'what is the time and space complexity?'. More importantly, Big-O is how engineers predict whether code that works on 100 rows will survive 10 million.",
      points: [
        "Big-O describes how the **number of steps grows** as the input size n grows. It ignores constants and small terms: 3n + 10 is O(n).",
        "The common classes, best to worst: **O(1)** constant, **O(log n)** logarithmic, **O(n)** linear, **O(n log n)**, **O(n²)** quadratic, **O(2ⁿ)** exponential.",
        "Rules of thumb: one loop over the input is O(n); a loop inside a loop is O(n²); halving the problem each step is O(log n); sorting is O(n log n).",
        "**Space complexity** counts extra memory the same way. Many optimizations trade space for time — a hash set turns an O(n²) duplicate check into O(n).",
        "Unless told otherwise, analyze the **worst case**. 'Amortized O(1)' means occasionally expensive but cheap on average, like `List.Add`.",
        "At n = 1,000,000: O(log n) is about 20 steps, O(n) is a million, O(n²) is a trillion. That difference is the whole point."
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
Console.WriteLine(First(data));
Console.WriteLine(BinarySearch(data, 765_432));    // about 20 steps, not 765,432
Console.WriteLine(HasDuplicateFast(data));         // instant; the slow version takes minutes
`,
      practice: "Use the visualization to compare the classes at n = 1,000 and n = 1,000,000. Then time `HasDuplicateSlow` and `HasDuplicateFast` with `Stopwatch` for 10,000, 20,000 and 40,000 items. When n doubles, what happens to each time?",
      teach: "Explain what O(n) and O(n²) mean to someone who has never seen the notation, using a real-life example.",
      analogy: "Finding a name in a phone book. Reading every page is O(n). Opening in the middle and halving each time is O(log n). Checking whether any two people in a room share a birthday by having everyone shake hands with everyone else is O(n²) — fine for 10 people, hopeless for a stadium.",
      pitfalls: [
        "Counting lines of code instead of how the work grows. A single line calling `list.Contains` inside a loop is O(n²).",
        "Forgetting hidden costs: sorting, `string` concatenation in a loop, `Insert(0, x)` on a list.",
        "Stating time complexity and forgetting space."
      ],
      quiz: [
        { q: "What is the complexity of a loop over n items that calls `list.Contains(x)` on a list of n items each time?", a: ["O(n)", "O(n log n)", "O(n²)", "O(1)"], c: 2, why: "`Contains` on a list is itself O(n), and it runs n times." },
        { q: "Binary search on 1,000,000 sorted items needs about how many steps?", a: ["20", "1,000", "500,000", "1,000,000"], c: 0, why: "log₂(1,000,000) ≈ 20: each step halves what is left." },
        { q: "5n² + 3n + 100 simplifies to…", a: ["O(n)", "O(5n²)", "O(n²)", "O(n³)"], c: 2, why: "Drop constants and lower-order terms: the n² term dominates as n grows." }
      ]
    },
    // ---------------- Intermediate ----------------
    {
      id: 'structures', title: 'Arrays, hash tables, stacks, queues and linked lists', level: 1, mins: 40,
      why: "Choosing the right data structure is usually the whole solution. Most interview problems become easy the moment the right structure is named — and most real performance bugs are the wrong one.",
      points: [
        "**Array / List**: contiguous memory. O(1) access by index, O(1) amortized append, O(n) insert or remove in the middle, O(n) search.",
        "**Hash table** (`Dictionary`, `HashSet`): a hash function maps a key to a bucket. O(1) average lookup, insert and delete; no ordering. The first tool to reach for.",
        "**Stack** (LIFO): push and pop at one end. Undo, recursion, matching brackets, depth-first search.",
        "**Queue** (FIFO): add at the back, remove from the front. Work in arrival order, breadth-first search.",
        "**Linked list**: nodes pointing to the next. O(1) insert or remove at a known node, but O(n) to reach it and poor cache locality — rarely the right choice in practice, but a favourite interview subject.",
        "Ask three questions: what operations do I need, how often, and on how much data? The answer picks the structure."
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

// Linked list: O(1) at the ends or at a node you already hold
var linked = new LinkedList<int>([1, 2, 3]);
linked.AddFirst(0);
linked.Remove(linked.Last!);

Console.WriteLine($"{third} {known} {back} {nextJob} {linked.Count}");
`,
      practice: "Solve three interview problems, naming the structure before you write any code: 'Pair with target sum' (hash map), 'Valid brackets' (stack), 'Reverse a linked list' (pointers). For each, say why the obvious alternative is worse.",
      teach: "Explain why looking up a key in a hash table is O(1) while searching a list is O(n).",
      analogy: "A list is a row of numbered lockers: instant if you know the number, a long walk if you only know what is inside. A hash table is a cloakroom where the ticket number is computed from your name — you go straight to the right hook. A stack is a pile of plates; a queue is a line at a shop.",
      pitfalls: [
        "Using a list where a set or dictionary is needed, then searching it in a loop.",
        "Assuming a dictionary keeps insertion or sorted order.",
        "Reaching for a linked list for 'fast inserts' when the search to find the position is O(n) anyway."
      ],
      quiz: [
        { q: "Which structure gives O(1) average lookup by key?", a: ["List", "Linked list", "Hash table", "Queue"], c: 2, why: "The hash of the key leads directly to its bucket." },
        { q: "Which structure fits 'undo the most recent action'?", a: ["Queue", "Stack", "Dictionary", "Array"], c: 1, why: "Undo is last in, first out." },
        { q: "What is the cost of `list.Insert(0, x)` on a List of n items?", a: ["O(1)", "O(log n)", "O(n)", "O(n²)"], c: 2, why: "Every existing element must shift one position." }
      ]
    },
    {
      id: 'sorting', title: 'Recursion and sorting', level: 1, mins: 40, viz: 'sort',
      why: "Recursion is the thinking tool behind trees, graphs, backtracking and dynamic programming. Sorting is the most common preprocessing step in interviews — and knowing why it is O(n log n) explains half of algorithm analysis.",
      points: [
        "A recursive function solves a problem by solving a **smaller version of the same problem**. It needs a **base case** that stops and a step that moves toward it.",
        "Each call gets its own frame on the call stack. Very deep recursion overflows the stack; any recursion can be rewritten with an explicit stack.",
        "**Divide and conquer**: split the problem, solve the halves, combine. Merge sort does exactly this and is always O(n log n).",
        "Bubble and insertion sort are O(n²) — simple, and fine for tiny or nearly sorted input. Quick sort is O(n log n) on average, O(n²) in the worst case.",
        "Comparison sorting cannot beat O(n log n) in general. A **stable** sort keeps equal items in their original order.",
        "In real code use the built-ins (`Array.Sort`, `OrderBy`). In interviews, say 'sort first' and then exploit the order with two pointers or binary search."
      ],
      code: `
static int Factorial(int n) => n <= 1 ? 1 : n * Factorial(n - 1);   // base case, then a smaller problem

// Merge sort: divide, conquer, combine
static int[] MergeSort(int[] a)
{
    if (a.Length <= 1) return a;                        // base case
    int mid = a.Length / 2;
    int[] left = MergeSort(a[..mid]), right = MergeSort(a[mid..]);

    var merged = new int[a.Length];
    int i = 0, j = 0, k = 0;
    while (i < left.Length && j < right.Length)
        merged[k++] = left[i] <= right[j] ? left[i++] : right[j++];
    while (i < left.Length) merged[k++] = left[i++];
    while (j < right.Length) merged[k++] = right[j++];
    return merged;
}

Console.WriteLine(Factorial(5));                                    // 120
Console.WriteLine(string.Join(", ", MergeSort([5, 2, 9, 1, 7])));    // 1, 2, 5, 7, 9

// In practice: the built-ins
int[] nums = [5, 2, 9, 1, 7];
Array.Sort(nums);                                                   // in place, O(n log n)
var byLength = new[] { "pear", "fig", "banana" }.OrderBy(s => s.Length).ThenBy(s => s);
Console.WriteLine(string.Join(", ", byLength));                     // fig, pear, banana
`,
      practice: "Run each algorithm in the sorting visualization and note the comparison counts. Then write a recursive function that sums a nested list of integers, and trace its call stack on paper for a three-level input.",
      teach: "Explain recursion using merge sort: what is the base case, what is the smaller problem, and how are the results combined?",
      analogy: "Sorting a deck by merge sort: split the deck in half, hand each half to a friend with the same instruction, and when two sorted halves come back, merge them by repeatedly taking the smaller top card. The instruction is the same at every level, and a single card is already sorted — that is the base case.",
      pitfalls: [
        "A missing or unreachable base case — infinite recursion and a stack overflow.",
        "Believing recursion is always slower or always more elegant. It is a tool for problems with recursive structure.",
        "Re-implementing a sort in production code instead of using the library."
      ],
      quiz: [
        { q: "What two things must every recursive function have?", a: ["A loop and a counter", "A base case and a step toward it", "Two parameters", "A return type of int"], c: 1, why: "Without a base case it never stops; without progress it never reaches the base case." },
        { q: "What is the time complexity of merge sort?", a: ["O(n)", "O(n log n)", "O(n²)", "O(log n)"], c: 1, why: "log n levels of splitting, with O(n) merging work on each level." },
        { q: "A 'stable' sort guarantees that…", a: ["it never crashes", "equal elements keep their original relative order", "it uses no extra memory", "it runs in O(n)"], c: 1, why: "Stability matters when sorting by one key after another." }
      ]
    },
    // ---------------- Advanced ----------------
    {
      id: 'trees', title: 'Trees, heaps and binary search', level: 2, mins: 40,
      why: "Trees are everywhere: the DOM, JSON, file systems, database indexes, React's component tree. Heaps power every 'top K' and scheduling problem. Together they account for a large share of interview questions.",
      points: [
        "A **tree** is nodes with children and no cycles. A **binary tree** has at most two children per node. Depth of a balanced tree with n nodes is about log₂ n.",
        "A **binary search tree** keeps left < node < right, giving O(log n) search, insert and delete when balanced — and O(n) when it degenerates into a list. Self-balancing trees (red-black, B-trees) prevent that.",
        "Traversals: **in-order** (left, node, right — sorted order for a BST), **pre-order**, **post-order** (depth-first) and **level-order** (breadth-first with a queue).",
        "Most tree problems are solved by one recursive question: 'if I knew the answer for my left and right subtrees, what is my answer?'",
        "A **heap** is a tree where each parent is smaller (min-heap) than its children. Peek the minimum in O(1); insert and remove in O(log n). In .NET: `PriorityQueue<TElement, TPriority>`.",
        "**Binary search** is more than finding a value: whenever a condition flips from false to true exactly once across a sorted range, you can binary search for the flip point."
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

// Built-in balanced trees
var sortedSet = new SortedSet<int> { 5, 1, 3 };         // O(log n) add, remove, contains — kept in order
Console.WriteLine(sortedSet.Min);                       // 1

class Node(int value)
{
    public int Value = value;
    public Node? Left, Right;
}
`,
      practice: "Solve 'Maximum depth of a binary tree', 'Level-order traversal' and 'Top K frequent elements' in the interview section. For each tree problem, write down the recursive question before coding.",
      teach: "Explain why a balanced binary search tree finds a value in O(log n), and what goes wrong if values are inserted in sorted order.",
      analogy: "A binary search tree is the game of 'guess my number': each question — higher or lower? — removes half of what is left. If the tree is lopsided, every question removes only one possibility, and the game is no faster than counting. A heap is a hospital triage desk: whoever is most urgent is always seen next, whatever order people arrived in.",
      pitfalls: [
        "Assuming any binary tree is a search tree, or that any BST is balanced.",
        "Using a sorted list and re-sorting after every insert where a heap is needed.",
        "Forgetting the null case at the top of a recursive tree function."
      ],
      quiz: [
        { q: "Which traversal visits a binary search tree's values in sorted order?", a: ["Pre-order", "In-order", "Post-order", "Level-order"], c: 1, why: "Left subtree (smaller), node, right subtree (larger)." },
        { q: "What does a min-heap guarantee?", a: ["All values are sorted", "The smallest element is at the root", "Lookup by key is O(1)", "It is balanced by value"], c: 1, why: "Only the parent-child order is maintained, which is enough to find the minimum instantly." },
        { q: "Inserting 1, 2, 3, 4, 5 in order into a plain BST produces…", a: ["A balanced tree", "A chain of right children with O(n) search", "A heap", "An error"], c: 1, why: "Each value is larger than the last, so the tree degenerates into a linked list." }
      ]
    },
    {
      id: 'graphs', title: 'Graphs: BFS, DFS and topological order', level: 2, mins: 40,
      why: "Social networks, maps, dependency resolution, build systems, state machines and grids are all graphs. Interviewers love them because recognizing the hidden graph is the hard part.",
      points: [
        "A **graph** is nodes (vertices) connected by edges, directed or undirected, weighted or not. Trees and linked lists are special cases.",
        "Store it as an **adjacency list** (node → neighbours): compact and fast to iterate. A grid is an implicit graph where neighbours are the adjacent cells.",
        "**BFS** (queue) explores in rings outward and finds the **shortest path in an unweighted graph**.",
        "**DFS** (recursion or a stack) explores as deep as possible first: reachability, connected components, cycle detection.",
        "Always track **visited** nodes, or cycles make the search loop forever. Both searches run in O(V + E).",
        "**Topological sort** orders a directed acyclic graph so every dependency comes first — course prerequisites, build order, migrations. If no such order exists, the graph has a cycle."
      ],
      code: `
// Adjacency list: node -> neighbours
var graph = new Dictionary<string, string[]>
{
    ["A"] = ["B", "C"], ["B"] = ["D"], ["C"] = ["D"], ["D"] = ["E"], ["E"] = []
};

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

// DFS: go deep first
static void Dfs(Dictionary<string, string[]> g, string node, HashSet<string> visited)
{
    if (!visited.Add(node)) return;
    foreach (string next in g[node]) Dfs(g, next, visited);
}

Console.WriteLine(ShortestPath(graph, "A", "E"));       // 3
var seen = new HashSet<string>();
Dfs(graph, "A", seen);
Console.WriteLine(string.Join(" ", seen));              // A B D E C
`,
      practice: "Solve 'Number of islands' (grid DFS) and 'Course schedule' (topological sort) in the interview section. Before coding each, draw the graph: what is a node, and what is an edge?",
      teach: "Explain why BFS finds the shortest path in an unweighted graph and DFS does not.",
      analogy: "BFS is a ripple spreading from a stone dropped in a pond: it reaches everything one step away, then two steps, then three — so whatever it touches first, it touched by the shortest route. DFS is exploring a maze by always taking the first unexplored corridor and backing up only at dead ends: you will find the exit, but not necessarily by the shortest way.",
      pitfalls: [
        "Forgetting the visited set and looping forever on a cycle.",
        "Using DFS when the question asks for the fewest steps.",
        "Not recognizing a graph: 'word ladder', 'course prerequisites' and 'rotting oranges' never say the word."
      ],
      quiz: [
        { q: "Which algorithm finds the shortest path in an unweighted graph?", a: ["DFS", "BFS", "Binary search", "Merge sort"], c: 1, why: "BFS reaches nodes in order of distance from the start." },
        { q: "What is the time complexity of BFS or DFS with an adjacency list?", a: ["O(V)", "O(V + E)", "O(V²)", "O(E log V)"], c: 1, why: "Each vertex is visited once and each edge examined once." },
        { q: "A topological order exists only if the directed graph…", a: ["is connected", "has no cycles", "is a tree", "has weights"], c: 1, why: "A cycle means some node would have to come before itself." }
      ]
    },
    // ---------------- Expert ----------------
    {
      id: 'dp', title: 'Dynamic programming and problem-solving strategy', level: 3, mins: 45,
      why: "Dynamic programming is the most feared interview topic and the most learnable: it is a fixed procedure, not a flash of insight. Beyond DP, experts carry a strategy for any unfamiliar problem.",
      points: [
        "DP applies when a problem has **overlapping subproblems** (the same smaller question is asked repeatedly) and **optimal substructure** (the best answer is built from best answers to subproblems).",
        "The procedure: (1) define the **state** — what does `dp[i]` mean in words? (2) write the **recurrence**; (3) set the **base cases**; (4) decide the fill order; (5) optimize space last.",
        "**Top-down** (recursion + memo) is the easiest to derive. **Bottom-up** (a table filled in order) avoids recursion depth and often allows O(1) space.",
        "Classic families: 1D (climbing stairs, house robber), unbounded choice (coin change), two sequences (longest common subsequence, edit distance), grid paths, knapsack.",
        "**Greedy** — take the locally best choice — is simpler but only correct for some problems. If you can find a counter-example, you need DP.",
        "For any unknown problem: brute force first; look for repeated work; try sorting, a hash map, two pointers or a heap; solve a smaller instance by hand and generalize."
      ],
      code: `
// 1. Plain recursion: correct but exponential — the same subproblems are solved again and again
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

// Two sequences — longest common subsequence.
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

Console.WriteLine(FibSlow(25));                 // fine; FibSlow(80) would take years
Console.WriteLine(FibMemo(80, new()));          // instant
Console.WriteLine(FibTable(80));
Console.WriteLine(Lcs("kitten", "sitting"));    // 4
`,
      practice: "Solve 'Climbing stairs' and 'Coin change' in the interview section, writing the state definition as a comment before any code. Then show with a concrete example why the greedy approach fails for coins [1, 3, 4] and amount 6.",
      teach: "Explain dynamic programming as 'recursion plus remembering', using Fibonacci, and state the five steps for designing a DP solution.",
      analogy: "Dynamic programming is doing a long calculation on paper and writing each intermediate result in the margin. The next time you need 37 × 12 you look at the margin instead of working it out again. The whole technique is noticing that you keep needing the same intermediate results — and deciding what to write in the margin.",
      pitfalls: [
        "Starting to code before stating in words what `dp[i]` means.",
        "Trying greedy on a DP problem without testing a counter-example.",
        "Memorizing solutions instead of the five-step procedure."
      ],
      quiz: [
        { q: "Which two properties make a problem suitable for dynamic programming?", a: ["Sorted input and unique values", "Overlapping subproblems and optimal substructure", "A graph and a queue", "Small input and recursion"], c: 1, why: "Repeated subproblems make caching worthwhile; optimal substructure makes combining cached answers correct." },
        { q: "What is the first step in designing a DP solution?", a: ["Optimize space", "Define precisely what the state means", "Write the loops", "Pick a language"], c: 1, why: "Without a clear state definition the recurrence cannot be written or checked." },
        { q: "Greedy fails for coin change with coins [1, 3, 4] and amount 6 because…", a: ["greedy is slower", "taking 4 first gives 4+1+1 (3 coins) while 3+3 uses 2", "there is no solution", "the coins are unsorted"], c: 1, why: "A locally best choice does not lead to the global optimum here." }
      ]
    }
  ]
});
