// Interview preparation content: coding patterns and problems, system design, behavioral, rapid-fire.
(() => {
  const T = (val, left = null, right = null) => ({ val, left, right });
  const LL = (...v) => v.reduceRight((next, val) => ({ val, next }), null);
  const G = (...rows) => rows.map(r => r.split(''));
  const tree = T(3, T(9), T(20, T(15), T(7)));

  const method = [
    ['Clarify', 'Restate the problem. Ask about input size, value ranges, duplicates, empty input, and what to return when there is no answer.'],
    ['Examples', 'Work one normal example and one edge case by hand, out loud. This is where most misunderstandings surface.'],
    ['Brute force', 'State the obvious solution and its complexity in one sentence. It proves you understand the problem and gives a baseline.'],
    ['Optimize', 'Name the bottleneck, then the pattern that removes it (hash map, two pointers, sorting, heap…). Agree on the approach before coding.'],
    ['Code', 'Write clean code while narrating. Meaningful names, small helper functions, no silent stretches longer than a minute.'],
    ['Test', 'Trace your code with the example, then edge cases, line by line like a reviewer. Fix bugs calmly.'],
    ['Analyze', 'State time and space complexity and one trade-off or follow-up improvement.']
  ];

  const patterns = [
    { id: 'hashing', name: 'Hash map / set', signal: 'You need to know “have I seen this before?” or count things, and a nested loop would be O(n²).', cost: 'O(n) time, O(n) space', code: `
var seen = new Dictionary<int, int>();           // value -> index
for (int i = 0; i < nums.Length; i++)
{
    if (seen.TryGetValue(target - nums[i], out int j)) return [j, i];
    seen[nums[i]] = i;
}` },
    { id: 'two-pointers', name: 'Two pointers', signal: 'The input is sorted (or can be), or you compare elements from both ends moving inward.', cost: 'O(n) time, O(1) space', code: `
int left = 0, right = nums.Length - 1;
while (left < right)
{
    int sum = nums[left] + nums[right];
    if (sum == target) return [left, right];
    if (sum < target) left++; else right--;
}` },
    { id: 'sliding-window', name: 'Sliding window', signal: 'The question asks for the longest / shortest / best contiguous subarray or substring.', cost: 'O(n) time, since each element enters and leaves the window once', code: `
var count = new Dictionary<char, int>();
int left = 0, best = 0;
for (int right = 0; right < s.Length; right++)
{
    count[s[right]] = count.GetValueOrDefault(s[right]) + 1;
    while (count[s[right]] > 1)               // window invalid: shrink from the left
    {
        count[s[left]]--;
        left++;
    }
    best = Math.Max(best, right - left + 1);
}` },
    { id: 'stack', name: 'Stack / monotonic stack', signal: 'Matching pairs, undo, or “next greater / smaller element” for each position.', cost: 'O(n) time, O(n) space', code: `
var stack = new Stack<int>();                  // indices still waiting for an answer
var answer = new int[temps.Length];
for (int i = 0; i < temps.Length; i++)
{
    while (stack.Count > 0 && temps[i] > temps[stack.Peek()])
    {
        int j = stack.Pop();
        answer[j] = i - j;
    }
    stack.Push(i);
}` },
    { id: 'binary-search', name: 'Binary search', signal: 'Sorted data, or a yes/no question whose answer flips exactly once as a value grows (“search on the answer”).', cost: 'O(log n) time', code: `
int lo = 0, hi = nums.Length - 1;
while (lo <= hi)
{
    int mid = lo + (hi - lo) / 2;              // avoids integer overflow
    if (nums[mid] == target) return mid;
    if (nums[mid] < target) lo = mid + 1; else hi = mid - 1;
}
return -1;` },
    { id: 'linked-list', name: 'Linked list pointers', signal: 'Reversal, finding the middle, cycle detection, and merging with O(1) extra space.', cost: 'O(n) time, O(1) space', code: `
ListNode? prev = null, cur = head;
while (cur != null)
{
    var next = cur.Next;                       // save before overwriting
    cur.Next = prev;
    prev = cur;
    cur = next;
}
return prev;

// Fast / slow pointers: middle of the list, or cycle detection
var slow = head; var fast = head;
while (fast?.Next != null) { slow = slow!.Next; fast = fast.Next.Next; }` },
    { id: 'trees', name: 'Trees: DFS and BFS', signal: 'Hierarchical data. Use DFS recursion for depth and paths, or a BFS queue for levels and shortest steps.', cost: 'O(n) time, plus O(height) DFS space or O(width) BFS space', code: `
int Depth(TreeNode? node) =>
    node is null ? 0 : 1 + Math.Max(Depth(node.Left), Depth(node.Right));

var queue = new Queue<TreeNode>();
if (root != null) queue.Enqueue(root);
while (queue.Count > 0)
{
    int size = queue.Count;                    // number of nodes on this level
    for (int i = 0; i < size; i++)
    {
        var node = queue.Dequeue();
        if (node.Left != null) queue.Enqueue(node.Left);
        if (node.Right != null) queue.Enqueue(node.Right);
    }
}` },
    { id: 'heap', name: 'Heap / top-K', signal: '“K largest”, “K most frequent”, “next smallest” repeatedly, or merging sorted streams.', cost: 'O(n log k) time, O(k) space', code: `
var heap = new PriorityQueue<int, int>();      // min-heap ordered by priority
foreach (var (value, freq) in counts)
{
    heap.Enqueue(value, freq);
    if (heap.Count > k) heap.Dequeue();        // evict the least frequent
}` },
    { id: 'graphs', name: 'Graphs: BFS, DFS, topological sort', signal: 'Connections, grids, dependencies, “can I reach”, “how many groups”, “in what order”.', cost: 'O(V + E) time', code: `
var visited = new HashSet<int>();
var queue = new Queue<int>();
queue.Enqueue(start); visited.Add(start);
while (queue.Count > 0)
{
    int node = queue.Dequeue();
    foreach (int next in graph[node])
        if (visited.Add(next)) queue.Enqueue(next);    // Add returns false if already seen
}` },
    { id: 'intervals', name: 'Intervals', signal: 'Ranges that may overlap: meetings, bookings, merges. Almost always: sort by start first.', cost: 'O(n log n) time for the sort', code: `
Array.Sort(intervals, (a, b) => a[0].CompareTo(b[0]));
var merged = new List<int[]>();
foreach (var cur in intervals)
{
    if (merged.Count > 0 && cur[0] <= merged[^1][1])
        merged[^1][1] = Math.Max(merged[^1][1], cur[1]);
    else merged.Add(cur);
}` },
    { id: 'backtracking', name: 'Backtracking', signal: '“All combinations / permutations / subsets”, or a puzzle solved by trying choices and undoing them.', cost: 'Exponential, O(2ⁿ) or O(n!), which is expected here', code: `
var result = new List<IList<int>>();
var path = new List<int>();
void Explore(int start)
{
    result.Add(new List<int>(path));           // record a copy
    for (int i = start; i < nums.Length; i++)
    {
        path.Add(nums[i]);                     // choose
        Explore(i + 1);                        // explore
        path.RemoveAt(path.Count - 1);         // un-choose
    }
}
Explore(0);` },
    { id: 'dp', name: 'Dynamic programming', signal: 'Optimal value or count of ways, where the answer is built from answers to smaller overlapping subproblems.', cost: 'Usually O(states × transitions)', code: `
var dp = new int[amount + 1];
Array.Fill(dp, amount + 1);                    // stands for "infinity"
dp[0] = 0;
for (int a = 1; a <= amount; a++)
    foreach (int coin in coins)
        if (coin <= a) dp[a] = Math.Min(dp[a], dp[a - coin] + 1);
return dp[amount] > amount ? -1 : dp[amount];` }
  ];

  const problems = [
    { id: 'two-sum', title: 'Pair with target sum', diff: 0, pattern: 'hashing', fn: 'twoSum',
      prompt: 'Given an integer array and a target, return indices [i, j] (i < j) of two numbers summing to target. Exactly one valid pair exists.',
      examples: ['twoSum([2, 7, 11, 15], 9) → [0, 1]', 'twoSum([3, 2, 4], 6) → [1, 2]'],
      starter: 'function twoSum(nums: number[], target: number): number[] {\n  \n}',
      tests: [[[[2, 7, 11, 15], 9], [0, 1]], [[[3, 2, 4], 6], [1, 2]], [[[3, 3], 6], [0, 1]], [[[-1, -2, -3, -4, -5], -8], [2, 4]]],
      hints: ['For each number x, what other number are you looking for?', 'Store every number you have passed in a map from value to index, and look up target − x.'],
      solution: 'function twoSum(nums: number[], target: number): number[] {\n  const seen = new Map<number, number>();\n  for (let i = 0; i < nums.length; i++) {\n    const j = seen.get(target - nums[i]);\n    if (j !== undefined) return [j, i];\n    seen.set(nums[i], i);\n  }\n  return [];\n}',
      complexity: 'O(n) time, O(n) space. The brute force of checking every pair is O(n²).',
      follow: ['What if the array is sorted? (Two pointers, O(1) space.)', 'What if there may be several pairs and you must return all of them?'] },
    { id: 'group-anagrams', title: 'Group anagrams', diff: 1, pattern: 'hashing', fn: 'groupAnagrams', mode: 'nested',
      prompt: 'Group the words that are anagrams of each other. Groups and the words inside them may be returned in any order.',
      examples: ['groupAnagrams(["eat","tea","tan","ate","nat","bat"]) → [["eat","tea","ate"],["tan","nat"],["bat"]]'],
      starter: 'function groupAnagrams(words: string[]): string[][] {\n  \n}',
      tests: [[[['eat', 'tea', 'tan', 'ate', 'nat', 'bat']], [['eat', 'tea', 'ate'], ['tan', 'nat'], ['bat']]], [[['']], [['']]], [[['a']], [['a']]], [[['ab', 'ba', 'abc', 'cab', 'x']], [['ab', 'ba'], ['abc', 'cab'], ['x']]]],
      hints: ['Two words are anagrams when some canonical form of them is identical.', 'Use the sorted letters (or a letter-count signature) as a map key.'],
      solution: 'function groupAnagrams(words: string[]): string[][] {\n  const groups = new Map<string, string[]>();\n  for (const w of words) {\n    const key = w.split("").sort().join("");\n    if (!groups.has(key)) groups.set(key, []);\n    groups.get(key)!.push(w);\n  }\n  return [...groups.values()];\n}',
      complexity: 'O(n · k log k) time for n words of length k, and O(n · k) space.',
      follow: ['How would you avoid sorting each word? (26-slot count as the key: O(n · k).)', 'What if the words do not fit in memory?'] },
    { id: 'top-k-frequent', title: 'Top K frequent elements', diff: 1, pattern: 'heap', fn: 'topKFrequent', mode: 'set',
      prompt: 'Return the k most frequent values in the array, in any order. The answer is guaranteed to be unique.',
      examples: ['topKFrequent([1,1,1,2,2,3], 2) → [1, 2]'],
      starter: 'function topKFrequent(nums: number[], k: number): number[] {\n  \n}',
      tests: [[[[1, 1, 1, 2, 2, 3], 2], [1, 2]], [[[4], 1], [4]], [[[5, 5, 6, 6, 6, 7], 1], [6]], [[[1, 2, 2, 3, 3, 3, 4, 4, 4, 4], 3], [4, 3, 2]]],
      hints: ['Count first. Then you need the k largest counts.', 'A frequency never exceeds n, so counts can index an array of buckets.'],
      solution: 'function topKFrequent(nums: number[], k: number): number[] {\n  const count = new Map<number, number>();\n  for (const n of nums) count.set(n, (count.get(n) ?? 0) + 1);\n  const buckets: number[][] = Array.from({ length: nums.length + 1 }, () => []);\n  for (const [n, c] of count) buckets[c].push(n);\n  const result: number[] = [];\n  for (let c = buckets.length - 1; c > 0 && result.length < k; c--) result.push(...buckets[c]);\n  return result.slice(0, k);\n}',
      complexity: 'O(n) time and space with bucket sort. A size-k min-heap gives O(n log k).',
      follow: ['When is the heap solution better than buckets? (Streaming data, or k much smaller than n.)', 'How would this work across many machines?'] },
    { id: 'valid-palindrome', title: 'Valid palindrome', diff: 0, pattern: 'two-pointers', fn: 'isPalindrome',
      prompt: 'Return true if the string reads the same forwards and backwards, considering only letters and digits and ignoring case.',
      examples: ['isPalindrome("A man, a plan, a canal: Panama") → true', 'isPalindrome("race a car") → false'],
      starter: 'function isPalindrome(s: string): boolean {\n  \n}',
      tests: [[['A man, a plan, a canal: Panama'], true], [['race a car'], false], [[' '], true], [['0P'], false], [['ab_a'], true]],
      hints: ['Compare characters from both ends moving inward.', 'Skip a pointer forward whenever it is on a character that is not a letter or digit.'],
      solution: 'function isPalindrome(s: string): boolean {\n  const ok = (c: string) => /[a-z0-9]/i.test(c);\n  let l = 0, r = s.length - 1;\n  while (l < r) {\n    if (!ok(s[l])) l++;\n    else if (!ok(s[r])) r--;\n    else if (s[l++].toLowerCase() !== s[r--].toLowerCase()) return false;\n  }\n  return true;\n}',
      complexity: 'O(n) time and O(1) space, with no cleaned string copy needed.',
      follow: ['What if you may delete at most one character?', 'How does Unicode change your definition of “letter”?'] },
    { id: 'container-water', title: 'Container with most water', diff: 1, pattern: 'two-pointers', fn: 'maxArea',
      prompt: 'Each array value is the height of a vertical line at that index. Choose two lines that, with the x-axis, hold the most water. Return that area.',
      examples: ['maxArea([1,8,6,2,5,4,8,3,7]) → 49'],
      starter: 'function maxArea(heights: number[]): number {\n  \n}',
      tests: [[[[1, 8, 6, 2, 5, 4, 8, 3, 7]], 49], [[[1, 1]], 1], [[[4, 3, 2, 1, 4]], 16], [[[1, 2, 1]], 2]],
      hints: ['Start with the widest container: one pointer at each end.', 'Moving the taller line inward can never help. Move the shorter one.'],
      solution: 'function maxArea(heights: number[]): number {\n  let l = 0, r = heights.length - 1, best = 0;\n  while (l < r) {\n    best = Math.max(best, Math.min(heights[l], heights[r]) * (r - l));\n    if (heights[l] < heights[r]) l++; else r--;\n  }\n  return best;\n}',
      complexity: 'O(n) time, O(1) space.',
      follow: ['Prove why moving the shorter side is safe.', 'How does this differ from the trapping-rain-water problem?'] },
    { id: 'longest-substring', title: 'Longest substring without repeats', diff: 1, pattern: 'sliding-window', fn: 'lengthOfLongestSubstring',
      prompt: 'Return the length of the longest substring that contains no repeated character.',
      examples: ['lengthOfLongestSubstring("abcabcbb") → 3', 'lengthOfLongestSubstring("pwwkew") → 3'],
      starter: 'function lengthOfLongestSubstring(s: string): number {\n  \n}',
      tests: [[['abcabcbb'], 3], [['bbbbb'], 1], [['pwwkew'], 3], [[''], 0], [['abba'], 2], [['dvdf'], 3]],
      hints: ['Keep a window [left, right] that never contains a duplicate.', 'Track each character’s last index, then jump left past repeats already inside the window.'],
      solution: 'function lengthOfLongestSubstring(s: string): number {\n  const last = new Map<string, number>();\n  let left = 0, best = 0;\n  for (let right = 0; right < s.length; right++) {\n    const prev = last.get(s[right]);\n    if (prev !== undefined && prev >= left) left = prev + 1;\n    last.set(s[right], right);\n    best = Math.max(best, right - left + 1);\n  }\n  return best;\n}',
      complexity: 'O(n) time, O(min(n, alphabet)) space.',
      follow: ['Return the substring itself, not just its length.', 'Allow at most k distinct characters.'] },
    { id: 'best-trade', title: 'Best time to buy and sell', diff: 0, pattern: 'sliding-window', fn: 'maxProfit',
      prompt: 'prices[i] is the price on day i. Buy on one day and sell on a later day. Return the maximum profit, or 0 if no profit is possible.',
      examples: ['maxProfit([7,1,5,3,6,4]) → 5', 'maxProfit([7,6,4,3,1]) → 0'],
      starter: 'function maxProfit(prices: number[]): number {\n  \n}',
      tests: [[[[7, 1, 5, 3, 6, 4]], 5], [[[7, 6, 4, 3, 1]], 0], [[[2, 4, 1]], 2], [[[1]], 0]],
      hints: ['For each day, the best sale uses the lowest price seen before it.', 'Track the running minimum in one pass.'],
      solution: 'function maxProfit(prices: number[]): number {\n  let low = Infinity, best = 0;\n  for (const p of prices) {\n    low = Math.min(low, p);\n    best = Math.max(best, p - low);\n  }\n  return best;\n}',
      complexity: 'O(n) time, O(1) space.',
      follow: ['Unlimited transactions allowed.', 'At most two transactions.'] },
    { id: 'valid-brackets', title: 'Valid brackets', diff: 0, pattern: 'stack', fn: 'isValid',
      prompt: 'Given a string of ( ) [ ] { } brackets, return true when every opener closes with the same type in order.',
      examples: ['isValid("()[]{}") → true', 'isValid("([)]") → false'],
      starter: 'function isValid(s: string): boolean {\n  \n}',
      tests: [[['()'], true], [['()[]{}'], true], [['(]'], false], [['([)]'], false], [['{[]}'], true], [['('], false], [[']'], false]],
      hints: ['The most recently opened bracket must be the first one closed.', 'Push openers onto a stack, then check that each closer matches the top element.'],
      solution: 'function isValid(s: string): boolean {\n  const pair: Record<string, string> = { ")": "(", "]": "[", "}": "{" };\n  const stack: string[] = [];\n  for (const c of s) {\n    if (c in pair) {\n      if (stack.pop() !== pair[c]) return false;\n    } else stack.push(c);\n  }\n  return stack.length === 0;\n}',
      complexity: 'O(n) time, O(n) space.',
      follow: ['Return the index of the first invalid character.', 'Minimum number of removals to make it valid.'] },
    { id: 'daily-temperatures', title: 'Days until warmer', diff: 1, pattern: 'stack', fn: 'dailyTemperatures',
      prompt: 'For each day, return how many days you must wait for a warmer temperature, or 0 if none comes.',
      examples: ['dailyTemperatures([73,74,75,71,69,72,76,73]) → [1,1,4,2,1,1,0,0]'],
      starter: 'function dailyTemperatures(temps: number[]): number[] {\n  \n}',
      tests: [[[[73, 74, 75, 71, 69, 72, 76, 73]], [1, 1, 4, 2, 1, 1, 0, 0]], [[[30, 40, 50, 60]], [1, 1, 1, 0]], [[[30, 60, 90]], [1, 1, 0]], [[[90, 80, 70]], [0, 0, 0]]],
      hints: ['Days that have not found a warmer day yet are “waiting”. Which waiting day gets resolved first?', 'Keep a stack of indices in decreasing temperature order so warmer days pop cooler ones.'],
      solution: 'function dailyTemperatures(temps: number[]): number[] {\n  const answer = new Array(temps.length).fill(0);\n  const stack: number[] = [];\n  for (let i = 0; i < temps.length; i++) {\n    while (stack.length && temps[i] > temps[stack[stack.length - 1]]) {\n      const j = stack.pop()!;\n      answer[j] = i - j;\n    }\n    stack.push(i);\n  }\n  return answer;\n}',
      complexity: 'O(n) time since each index pushes and pops at most once, with O(n) space.',
      follow: ['Why is this O(n) despite the nested loop?', 'Solve it scanning from right to left.'] },
    { id: 'search-rotated', title: 'Search in a rotated sorted array', diff: 1, pattern: 'binary-search', fn: 'searchRotated',
      prompt: 'A sorted array of distinct integers has been rotated at an unknown pivot. Return the index of the target, or -1. Aim for O(log n).',
      examples: ['searchRotated([4,5,6,7,0,1,2], 0) → 4', 'searchRotated([4,5,6,7,0,1,2], 3) → -1'],
      starter: 'function searchRotated(nums: number[], target: number): number {\n  \n}',
      tests: [[[[4, 5, 6, 7, 0, 1, 2], 0], 4], [[[4, 5, 6, 7, 0, 1, 2], 3], -1], [[[1], 0], -1], [[[1], 1], 0], [[[5, 1, 3], 3], 2], [[[3, 1], 1], 1]],
      hints: ['At any midpoint, at least one half is still perfectly sorted.', 'Identify the sorted half, check whether the target lies inside its range, and discard the other half.'],
      solution: 'function searchRotated(nums: number[], target: number): number {\n  let lo = 0, hi = nums.length - 1;\n  while (lo <= hi) {\n    const mid = (lo + hi) >> 1;\n    if (nums[mid] === target) return mid;\n    if (nums[lo] <= nums[mid]) {\n      if (nums[lo] <= target && target < nums[mid]) hi = mid - 1; else lo = mid + 1;\n    } else {\n      if (nums[mid] < target && target <= nums[hi]) lo = mid + 1; else hi = mid - 1;\n    }\n  }\n  return -1;\n}',
      complexity: 'O(log n) time, O(1) space.',
      follow: ['What changes if duplicates are allowed?', 'Find the rotation pivot itself.'] },
    { id: 'reverse-list', title: 'Reverse a linked list', diff: 0, pattern: 'linked-list', fn: 'reverseList',
      prompt: 'Reverse a singly linked list and return its new head. A node is { val, next }.',
      examples: ['1 → 2 → 3   becomes   3 → 2 → 1'],
      starter: 'interface ListNode { val: number; next: ListNode | null }\n\nfunction reverseList(head: ListNode | null): ListNode | null {\n  \n}',
      tests: [[[LL(1, 2, 3)], LL(3, 2, 1)], [[null], null], [[LL(7)], LL(7)], [[LL(1, 2)], LL(2, 1)]],
      hints: ['Walk the list once, turning each arrow around.', 'You need three references: previous, current, and next (saved before you overwrite it).'],
      solution: 'interface ListNode { val: number; next: ListNode | null }\n\nfunction reverseList(head: ListNode | null): ListNode | null {\n  let prev: ListNode | null = null, cur = head;\n  while (cur) {\n    const next = cur.next;\n    cur.next = prev;\n    prev = cur;\n    cur = next;\n  }\n  return prev;\n}',
      complexity: 'O(n) time, O(1) space.',
      follow: ['Do it recursively. What is the space cost?', 'Reverse only the nodes between positions m and n.'] },
    { id: 'merge-intervals', title: 'Merge overlapping intervals', diff: 1, pattern: 'intervals', fn: 'mergeIntervals',
      prompt: 'Given intervals [start, end], merge all that overlap (touching intervals count as overlapping) and return them sorted by start.',
      examples: ['mergeIntervals([[1,3],[2,6],[8,10],[15,18]]) → [[1,6],[8,10],[15,18]]'],
      starter: 'function mergeIntervals(intervals: number[][]): number[][] {\n  \n}',
      tests: [[[[[1, 3], [2, 6], [8, 10], [15, 18]]], [[1, 6], [8, 10], [15, 18]]], [[[[1, 4], [4, 5]]], [[1, 5]]], [[[[1, 4], [0, 4]]], [[0, 4]]], [[[[1, 4], [2, 3]]], [[1, 4]]], [[[]], []]],
      hints: ['Once sorted by start, an interval can only overlap the one just before it.', 'Compare each interval’s start with the end of the last merged interval.'],
      solution: 'function mergeIntervals(intervals: number[][]): number[][] {\n  const sorted = intervals.map(i => [...i]).sort((a, b) => a[0] - b[0]);\n  const merged: number[][] = [];\n  for (const cur of sorted) {\n    const last = merged[merged.length - 1];\n    if (last && cur[0] <= last[1]) last[1] = Math.max(last[1], cur[1]);\n    else merged.push(cur);\n  }\n  return merged;\n}',
      complexity: 'O(n log n) time for the sort, O(n) space.',
      follow: ['Insert one new interval into an already-merged list in O(n).', 'Minimum number of meeting rooms required.'] },
    { id: 'tree-depth', title: 'Maximum depth of a binary tree', diff: 0, pattern: 'trees', fn: 'maxDepth',
      prompt: 'Return the number of nodes on the longest path from the root down to a leaf. A node is { val, left, right }.',
      examples: ['A root with two children, one of which has two children → 3'],
      starter: 'interface TreeNode { val: number; left: TreeNode | null; right: TreeNode | null }\n\nfunction maxDepth(root: TreeNode | null): number {\n  \n}',
      tests: [[[tree], 3], [[null], 0], [[T(1, null, T(2))], 2], [[T(1)], 1]],
      hints: ['What is the depth of an empty tree?', 'The depth of a node is one more than the deeper of its two subtrees.'],
      solution: 'interface TreeNode { val: number; left: TreeNode | null; right: TreeNode | null }\n\nfunction maxDepth(root: TreeNode | null): number {\n  if (!root) return 0;\n  return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));\n}',
      complexity: 'O(n) time, O(height) space for the recursion stack.',
      follow: ['Do it without recursion.', 'Is the tree height-balanced?'] },
    { id: 'level-order', title: 'Level-order traversal', diff: 1, pattern: 'trees', fn: 'levelOrder',
      prompt: 'Return the values of a binary tree level by level, left to right, as an array of arrays.',
      examples: ['Tree 3 → (9, 20 → (15, 7))   gives   [[3], [9, 20], [15, 7]]'],
      starter: 'interface TreeNode { val: number; left: TreeNode | null; right: TreeNode | null }\n\nfunction levelOrder(root: TreeNode | null): number[][] {\n  \n}',
      tests: [[[tree], [[3], [9, 20], [15, 7]]], [[null], []], [[T(1)], [[1]]], [[T(1, T(2, T(4)), T(3))], [[1], [2, 3], [4]]]],
      hints: ['Breadth-first search visits nodes in exactly this order.', 'At the start of each round, the queue length is the number of nodes on the current level.'],
      solution: 'interface TreeNode { val: number; left: TreeNode | null; right: TreeNode | null }\n\nfunction levelOrder(root: TreeNode | null): number[][] {\n  const result: number[][] = [];\n  let level: TreeNode[] = root ? [root] : [];\n  while (level.length) {\n    result.push(level.map(n => n.val));\n    const next: TreeNode[] = [];\n    for (const n of level) {\n      if (n.left) next.push(n.left);\n      if (n.right) next.push(n.right);\n    }\n    level = next;\n  }\n  return result;\n}',
      complexity: 'O(n) time, O(width) space.',
      follow: ['Zigzag order (alternate directions per level).', 'Right-side view of the tree.'] },
    { id: 'islands', title: 'Number of islands', diff: 1, pattern: 'graphs', fn: 'numIslands',
      prompt: 'A grid contains "1" (land) and "0" (water). An island is land connected horizontally or vertically. Return the number of islands.',
      examples: ['Rows "11000", "11000", "00100", "00011" → 3'],
      starter: 'function numIslands(grid: string[][]): number {\n  \n}',
      tests: [[[G('11110', '11010', '11000', '00000')], 1], [[G('11000', '11000', '00100', '00011')], 3], [[G('0')], 0], [[G('101', '010', '101')], 5]],
      hints: ['Each time you find unvisited land, you have found one new island.', 'From that cell, flood-fill (DFS or BFS) to mark the entire island as visited.'],
      solution: 'function numIslands(grid: string[][]): number {\n  const rows = grid.length, cols = grid[0]?.length ?? 0;\n  const sink = (r: number, c: number): void => {\n    if (r < 0 || c < 0 || r >= rows || c >= cols || grid[r][c] !== "1") return;\n    grid[r][c] = "0";\n    sink(r + 1, c); sink(r - 1, c); sink(r, c + 1); sink(r, c - 1);\n  };\n  let count = 0;\n  for (let r = 0; r < rows; r++)\n    for (let c = 0; c < cols; c++)\n      if (grid[r][c] === "1") { count++; sink(r, c); }\n  return count;\n}',
      complexity: 'O(rows × cols) time, with O(rows × cols) worst-case recursion space.',
      follow: ['You may not modify the input.', 'The grid is enormous and arrives as a stream of rows (union-find).'] },
    { id: 'course-schedule', title: 'Course schedule', diff: 1, pattern: 'graphs', fn: 'canFinish',
      prompt: 'There are n courses numbered 0…n−1. Each pair [a, b] means you must take b before a. Return true if all courses can be finished.',
      examples: ['canFinish(2, [[1,0]]) → true', 'canFinish(2, [[1,0],[0,1]]) → false'],
      starter: 'function canFinish(n: number, prerequisites: number[][]): boolean {\n  \n}',
      tests: [[[2, [[1, 0]]], true], [[2, [[1, 0], [0, 1]]], false], [[4, [[1, 0], [2, 1], [3, 2]]], true], [[3, [[0, 1], [1, 2], [2, 0]]], false], [[1, []], true]],
      hints: ['This asks whether a directed graph has a cycle.', 'Repeatedly take any course with no remaining prerequisites (Kahn’s algorithm). If you cannot take them all, there is a cycle.'],
      solution: 'function canFinish(n: number, prerequisites: number[][]): boolean {\n  const next: number[][] = Array.from({ length: n }, () => []);\n  const indegree = new Array(n).fill(0);\n  for (const [a, b] of prerequisites) { next[b].push(a); indegree[a]++; }\n  const ready: number[] = [];\n  for (let i = 0; i < n; i++) if (indegree[i] === 0) ready.push(i);\n  let taken = 0;\n  while (ready.length) {\n    const course = ready.pop()!;\n    taken++;\n    for (const m of next[course]) if (--indegree[m] === 0) ready.push(m);\n  }\n  return taken === n;\n}',
      complexity: 'O(V + E) time and space.',
      follow: ['Return a valid order of courses.', 'How would you detect the cycle with DFS colouring instead?'] },
    { id: 'climb-stairs', title: 'Climbing stairs', diff: 0, pattern: 'dp', fn: 'climbStairs',
      prompt: 'You climb a staircase of n steps taking 1 or 2 steps at a time. Return the number of distinct ways to reach the top.',
      examples: ['climbStairs(3) → 3   (1+1+1, 1+2, 2+1)'],
      starter: 'function climbStairs(n: number): number {\n  \n}',
      tests: [[[1], 1], [[2], 2], [[3], 3], [[5], 8], [[10], 89], [[45], 1836311903]],
      hints: ['How could you have arrived at step n? From which steps?', 'ways(n) = ways(n − 1) + ways(n − 2). You only need the last two values.'],
      solution: 'function climbStairs(n: number): number {\n  let prev = 1, cur = 1;\n  for (let i = 2; i <= n; i++) [prev, cur] = [cur, prev + cur];\n  return cur;\n}',
      complexity: 'O(n) time, O(1) space. Plain recursion without memoization is O(2ⁿ).',
      follow: ['Steps of 1, 2 or 3 allowed.', 'Each step carries a cost, so find the cheapest path up.'] },
    { id: 'coin-change', title: 'Coin change', diff: 1, pattern: 'dp', fn: 'coinChange',
      prompt: 'Given coin denominations (unlimited supply of each) and an amount, return the fewest coins that make the amount, or -1 if impossible.',
      examples: ['coinChange([1,2,5], 11) → 3   (5 + 5 + 1)', 'coinChange([2], 3) → -1'],
      starter: 'function coinChange(coins: number[], amount: number): number {\n  \n}',
      tests: [[[[1, 2, 5], 11], 3], [[[2], 3], -1], [[[1], 0], 0], [[[1, 3, 4], 6], 2], [[[186, 419, 83, 408], 6249], 20]],
      hints: ['Greedy (largest coin first) fails: try coins [1,3,4] and amount 6.', 'Let dp[a] be the fewest coins for amount a. dp[a] = 1 + min(dp[a − coin]) over all coins.'],
      solution: 'function coinChange(coins: number[], amount: number): number {\n  const dp = new Array(amount + 1).fill(Infinity);\n  dp[0] = 0;\n  for (let a = 1; a <= amount; a++)\n    for (const coin of coins)\n      if (coin <= a) dp[a] = Math.min(dp[a], dp[a - coin] + 1);\n  return dp[amount] === Infinity ? -1 : dp[amount];\n}',
      complexity: 'O(amount × coins) time, O(amount) space.',
      follow: ['Count the number of combinations instead of the minimum.', 'Return which coins were used.'] },
    { id: 'subsets', title: 'All subsets', diff: 1, pattern: 'backtracking', fn: 'subsets', mode: 'nested',
      prompt: 'Given an array of distinct integers, return every possible subset (the power set), in any order.',
      examples: ['subsets([1,2,3]) → [[],[1],[2],[3],[1,2],[1,3],[2,3],[1,2,3]]'],
      starter: 'function subsets(nums: number[]): number[][] {\n  \n}',
      tests: [[[[1, 2, 3]], [[], [1], [2], [3], [1, 2], [1, 3], [2, 3], [1, 2, 3]]], [[[0]], [[], [0]]], [[[]], [[]]]],
      hints: ['For each number there are two choices: include it or not.', 'Recurse with a start index and save a copy of the current path on every call.'],
      solution: 'function subsets(nums: number[]): number[][] {\n  const result: number[][] = [];\n  const path: number[] = [];\n  const explore = (start: number): void => {\n    result.push([...path]);\n    for (let i = start; i < nums.length; i++) {\n      path.push(nums[i]);\n      explore(i + 1);\n      path.pop();\n    }\n  };\n  explore(0);\n  return result;\n}',
      complexity: 'O(n · 2ⁿ) time and space to copy all 2ⁿ subsets.',
      follow: ['What if the input contains duplicates and output must hold unique subsets?', 'Only subsets of size k.'] },
    { id: 'lru-cache', title: 'LRU cache', diff: 1, pattern: 'hashing', fn: 'LRUCache',
      call: '(capacity, ops) => { const c = new LRUCache(capacity); return ops.map(([op, ...a]) => op === "get" ? c.get(...a) : (c.put(...a), null)); }',
      prompt: 'Design a fixed-capacity cache with O(1) get(key) and put(key, value). Return -1 when missing, evict the least recently used key when full, and mark accessed keys recent.',
      examples: ['capacity 2: put(1,1), put(2,2), get(1) → 1, put(3,3) evicts key 2, get(2) → -1'],
      starter: 'class LRUCache {\n  constructor(private capacity: number) {}\n\n  get(key: number): number {\n    \n  }\n\n  put(key: number, value: number): void {\n    \n  }\n}',
      tests: [
        [[2, [['put', 1, 1], ['put', 2, 2], ['get', 1], ['put', 3, 3], ['get', 2], ['put', 4, 4], ['get', 1], ['get', 3], ['get', 4]]], [null, null, 1, null, -1, null, -1, 3, 4]],
        [[1, [['put', 2, 1], ['get', 2], ['put', 3, 2], ['get', 2], ['get', 3]]], [null, 1, null, -1, 2]],
        [[2, [['put', 1, 1], ['put', 2, 2], ['put', 1, 10], ['put', 3, 3], ['get', 2], ['get', 1]]], [null, null, null, null, -1, 10]]],
      hints: ['Pair a hash map for O(1) lookup with an ordered structure for O(1) promotion to most recent.', 'The classic answer is a hash map plus a doubly linked list. In JavaScript, a Map already remembers insertion order: delete and re-insert to refresh a key.'],
      solution: 'class LRUCache {\n  private map = new Map<number, number>();\n  constructor(private capacity: number) {}\n\n  get(key: number): number {\n    if (!this.map.has(key)) return -1;\n    const value = this.map.get(key)!;\n    this.map.delete(key);          // re-insert to mark as most recent\n    this.map.set(key, value);\n    return value;\n  }\n\n  put(key: number, value: number): void {\n    this.map.delete(key);\n    this.map.set(key, value);\n    if (this.map.size > this.capacity) {\n      const oldest = this.map.keys().next().value!;\n      this.map.delete(oldest);\n    }\n  }\n}',
      complexity: 'O(1) per operation, O(capacity) space.',
      follow: ['Implement it with a hash map and a doubly linked list, as you would in C#.', 'Make it thread-safe. Add a time-to-live per entry.'] },
    { id: 'trap-water', title: 'Trapping rain water', diff: 2, pattern: 'two-pointers', fn: 'trap',
      prompt: 'Each value is the height of a bar of width 1. Return how many units of water are trapped between the bars after rain.',
      examples: ['trap([0,1,0,2,1,0,1,3,2,1,2,1]) → 6'],
      starter: 'function trap(height: number[]): number {\n  \n}',
      tests: [[[[0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]], 6], [[[4, 2, 0, 3, 2, 5]], 9], [[[]], 0], [[[3, 0, 3]], 3], [[[1, 2, 3]], 0]],
      hints: ['Water above a bar = min(tallest bar to its left, tallest to its right) − its own height.', 'Use two pointers. The side with the smaller maximum is the limiting side, so its water can be settled immediately.'],
      solution: 'function trap(height: number[]): number {\n  let l = 0, r = height.length - 1, leftMax = 0, rightMax = 0, water = 0;\n  while (l < r) {\n    if (height[l] < height[r]) {\n      leftMax = Math.max(leftMax, height[l]);\n      water += leftMax - height[l];\n      l++;\n    } else {\n      rightMax = Math.max(rightMax, height[r]);\n      water += rightMax - height[r];\n      r--;\n    }\n  }\n  return water;\n}',
      complexity: 'O(n) time, O(1) space. The prefix/suffix-maximum version is O(n) space and easier to explain first.',
      follow: ['Solve it with a monotonic stack.', 'What about a 2D height map?'] }
  ];

  const bigO = [
    ['Array index / hash lookup', 'O(1)'], ['Binary search, balanced tree operation', 'O(log n)'], ['Single pass, two pointers, sliding window', 'O(n)'],
    ['Sorting, heap of n items', 'O(n log n)'], ['Nested loops over the input', 'O(n²)'], ['All subsets / all permutations', 'O(2ⁿ) / O(n!)']
  ];

  const design = {
    framework: [
      ['Requirements', '5 min', 'Functional: the 3–4 core features only. Non-functional: scale, latency, availability, consistency. Say what is out of scope.'],
      ['Estimates', '5 min', 'Users, requests per second, read:write ratio, and yearly storage. Round numbers to find what dominates.'],
      ['API and data model', '5 min', 'Main endpoints with inputs and outputs. Core entities, keys, and which store suits each.'],
      ['High-level design', '10 min', 'Draw the boxes: clients, load balancer, services, databases, caches, queues. Walk one request through end to end.'],
      ['Deep dives', '15 min', 'Dig into the two hardest parts, usually the hot path and storage. This is where seniority shows.'],
      ['Trade-offs and wrap-up', '5 min', 'Bottlenecks, failure modes, monitoring, and what you would change at 10× the scale.']
    ],
    blocks: [
      ['Load balancer', 'Spreads requests across stateless servers and removes unhealthy ones.'],
      ['Cache', 'Keeps hot data in memory (Redis). Decide key, expiry, invalidation, and what happens on a miss storm.'],
      ['CDN', 'Serves static and cacheable content from locations near the user.'],
      ['Message queue', 'Decouples producers from consumers, absorbs bursts, enables retries. Consumers must be idempotent.'],
      ['Replication', 'Copies of the data for read scaling and failover. Asynchronous replicas lag.'],
      ['Sharding / partitioning', 'Splits data across nodes by a key. Choose the key to avoid hot shards and cross-shard queries.'],
      ['Consistent hashing', 'Maps keys to nodes so that adding or removing a node moves only a small share of keys.'],
      ['SQL vs NoSQL', 'SQL: relations, transactions, flexible queries. NoSQL: simple access patterns at very large scale, tunable consistency.'],
      ['CAP in practice', 'During a network partition you choose consistency or availability. Say which each part of your system needs.'],
      ['Idempotency key', 'A client-supplied id that makes a retried write safe to apply once.']
    ],
    cases: [
      { id: 'url-shortener', title: 'URL shortener', prompt: 'Design a URL shortener that maps long URLs to short codes and redirects visitors in a read-heavy system.',
        req: ['Create a short link for a long URL, with optional custom aliases and expiry times.', 'Redirect a short link to its original URL with very low latency.', 'Non-functional: highly available redirects, links never collide, basic click analytics.', 'Out of scope: user accounts, link previews.'],
        est: ['100 M new links/month is ~40 writes/s. At a 100:1 read ratio, that gives ~4,000 redirects/s on average and higher peaks.', '500 bytes per record × 1.2 B links per year ≈ 600 GB per year.', 'A 7-character base-62 code gives 62⁷ ≈ 3.5 trillion combinations.'],
        api: ['POST /links { url, alias?, expiresAt? } → { code }', 'GET /{code} → 301/302 redirect', 'Table links(code PK, long_url, created_at, expires_at, owner_id)'],
        tiers: [['Browser'], ['CDN / edge', 'Load balancer'], ['Link service (stateless)'], ['Cache (Redis)', 'Key-value store', 'Analytics queue']],
        deep: [['Generating codes', 'Hashing the URL risks collisions and needs a check-and-retry. A counter encoded in base 62 guarantees uniqueness: give each server a pre-allocated ID range so there is no central bottleneck. Add randomness or encryption of the counter if codes must not be guessable.'], ['Fast redirects', 'Check cache before storage and backfill misses, since hot links dominate traffic. Pick 302 to count every click, or 301 so browsers cache the redirect and bypass your servers.'], ['Analytics without slowing redirects', 'Push click events to a queue, return immediately, and aggregate stats asynchronously.'], ['Storage', 'Access is a single key lookup, so a key-value or wide-column store partitioned by code scales horizontally. A relational database is fine at smaller scale.']],
        follow: ['How do you handle a link that suddenly goes viral?', 'How do expired links get removed?', 'How would you prevent abuse for phishing?'] },
      { id: 'rate-limiter', title: 'Rate limiter', prompt: 'Design a rate limiter that protects an API from too many requests per client, working correctly across many servers.',
        req: ['Throttle requests per client key (user, API key, or IP) per window, with different limits per endpoint.', 'Reject excess requests with 429 and a Retry-After header.', 'Non-functional: adds under a few milliseconds, works across all API servers, fails safely.', 'Out of scope: DDoS protection at the network layer.'],
        est: ['If the API serves 10,000 requests/s, the limiter runs 10,000 tiny read-modify-write checks/s.', 'State per client is tiny (a counter and a timestamp), so 10 M active clients fit in a few GB of memory.'],
        api: ['Middleware: allow(clientKey, rule) → { allowed, remaining, retryAfter }', 'Rules configuration: { endpoint, limit, window, algorithm }'],
        tiers: [['Client'], ['API gateway / middleware'], ['Rate limiter library'], ['Redis cluster', 'Rules config']],
        deep: [['Choosing the algorithm', 'Fixed windows allow boundary bursts, and sliding logs store too many timestamps. Sliding counters approximate cheaply, while token buckets allow controlled bursts as the usual default.'], ['Correctness across servers', 'Put counters in a shared store. Separate read-then-write steps race across servers, so check and decrement atomically via Redis Lua scripts or atomic increment with expiry.'], ['Latency and failure', 'Keep the counter store close to API servers. Pick the failure mode upfront: fail open to preserve availability, or fail closed on login and sensitive endpoints.'], ['Scale', 'Shard counters by client key. For very high volume, let each server hold a local batch of tokens and sync periodically, trading exactness for speed.']],
        follow: ['How would you rate-limit by cost rather than request count?', 'How do clients learn their remaining quota?', 'How do you limit a distributed attacker using many IPs?'] },
      { id: 'news-feed', title: 'Social news feed', prompt: 'Design the home feed of a social app: users follow others and see their recent posts, newest or most relevant first.',
        req: ['Publish posts, follow or unfollow accounts, and load a paginated home feed.', 'Non-functional goals: keep feed loads under 200 ms, stay highly available, and accept a few seconds of eventual consistency.', 'Out of scope: ranking model details, ads, direct messages.'],
        est: ['200 M daily users loading 5 feeds gives ~12,000 reads/s, while 20 M daily posts averages ~230 writes/s.', 'Reads dominate by about 50:1, so optimize the read path.', 'Typical users follow 200 accounts, whereas celebrities can have 50 M followers.'],
        api: ['POST /posts { text, media }', 'GET /feed?cursor= → { posts, nextCursor }', 'posts(id, author_id, created_at, body) · follows(follower_id, followee_id) · feed cache per user: list of post ids'],
        tiers: [['Mobile / web client'], ['CDN (media)', 'Load balancer'], ['Post service', 'Feed service', 'Fan-out workers'], ['Feed cache (Redis)', 'Post store', 'Graph store', 'Queue']],
        deep: [['Fan-out on write vs on read', 'Push-on-write copies post IDs into every follower cache for fast reads, though celebrity posts trigger millions of writes. Pull-on-read merges recent posts live. Use a hybrid: push normal accounts and pull celebrities.'], ['The feed cache', 'Cache only the latest ~500 post IDs per feed and hydrate bodies from a post cache. Skip inactive users and compute their feed when they return.'], ['Pagination', 'Use cursor (keyset) pagination on (created_at, id). Offset pagination shows duplicates and gaps as new posts arrive.'], ['Media', 'Upload media straight to object storage via pre-signed URLs and serve through a CDN so APIs touch metadata only.']],
        follow: ['How does an unfollow or a deleted post get removed from feeds?', 'How would ranking by relevance change the design?', 'What happens when the fan-out queue falls behind?'] },
      { id: 'chat', title: 'Real-time chat', prompt: 'Design a messaging service with one-to-one and small group chats, delivery to online users in real time, and history for offline users.',
        req: ['Real-time messaging, group chats up to a few hundred members, persistent history, and delivered/read receipts.', 'Non-functional: delivery under 500 ms, messages never lost, ordered within a conversation.', 'Out of scope: voice and video, end-to-end encryption details.'],
        est: ['50 M daily users, 40 messages each ≈ 2 B messages per day ≈ 23,000 messages/s on average.', '10 M concurrent connections at ~100,000 per box needs roughly 100 gateway servers.', '2 B × 200 bytes ≈ 400 GB of messages per day.'],
        api: ['WebSocket: send { conversationId, clientMsgId, body } · receive { message } · ack { messageId }', 'GET /conversations/{id}/messages?before=', 'messages(conversation_id, message_id, sender_id, body, sent_at) partitioned by conversation_id'],
        tiers: [['Clients (persistent WebSocket)'], ['Load balancer'], ['Chat gateways (hold connections)', 'Message service'], ['Session registry (Redis)', 'Message store', 'Queue / pub-sub', 'Push notifications']],
        deep: [['Connections and routing', 'Clients hold a WebSocket to a gateway. A session registry maps user → gateway. To deliver, the message service looks up the recipient’s gateway and forwards through pub/sub. In ASP.NET Core, SignalR with a Redis backplane implements this pattern.'], ['Never losing a message', 'Persist messages before acking the sender, using a clientMsgId for idempotent retries. Track recipient acks and resync missed messages on reconnect from the last seen ID.'], ['Ordering', 'Assign a monotonically increasing id per conversation on the server (not client timestamps). Order is guaranteed within a conversation, which is all users can perceive.'], ['Offline users and groups', 'If offline, store the message and trigger a push notification. Fan out small groups per member device, and switch huge channels to pull.']],
        follow: ['How do you show presence (online / typing) cheaply?', 'How does multi-device sync work?', 'What happens when a gateway server crashes?'] },
      { id: 'flash-sale', title: 'Flash-sale checkout', prompt: 'Design the checkout for an e-commerce flash sale: 1,000 units of an item, a million users clicking Buy within the same minute. It must never oversell and never double-charge.',
        req: ['Reserve inventory, take payment, create the order, and show accurate sold-out states.', 'Non-functional: never oversell, never double-charge, stay responsive under a 100× traffic spike, fair to users.', 'Out of scope: catalogue browsing, recommendations.'],
        est: ['1 M users in the first minute ≈ 17,000 requests/s at the edge, against 1,000 units: 99.9% of requests must be rejected cheaply.', 'The database only processes roughly as many writes as available units when upstream layers shed extra traffic.'],
        api: ['POST /checkout { itemId, quantity } with Idempotency-Key → { orderId, status }', 'GET /orders/{id}', 'inventory(item_id, available) · reservations(id, item_id, user_id, expires_at) · orders(id, user_id, status, idempotency_key UNIQUE)'],
        tiers: [['Clients'], ['CDN + waiting room', 'Rate limiter / gateway'], ['Checkout service', 'Payment worker'], ['Stock counter (Redis)', 'Orders DB (SQL)', 'Order queue', 'Payment provider']],
        deep: [['Never oversell', 'Run an atomic UPDATE inventory SET available = available - 1 WHERE item_id = @itemId AND available > 0 check and verify one row changed. Gate traffic in Redis with atomic decrements first so only winners hit the database.'], ['Shedding load', 'Serve the page from a CDN, put users in a waiting room or queue, rate-limit per user, and reject immediately once the counter hits zero. Protect the database so it only sees traffic it can handle.'], ['Reservation and payment', 'Successful decrements open a 10-minute reservation while payment runs through a background queue. Failed or expired payments release the lock and return stock.'], ['Never double-charge', 'Clients pass an Idempotency-Key with a unique constraint so retries return the first result. Use the outbox pattern to commit order rows and charge events together.']],
        follow: ['How do you keep bots from taking all the stock?', 'What if Redis and the database disagree about stock?', 'How do you test this before the real sale?'] },
      { id: 'savings-ledger', title: 'Savings and loan ledger', prompt: 'Design a savings-and-loan cooperative core ledger for deposits, withdrawals, loans, and instalments. Every balance must stay exact to the last rupiah.',
        req: ['Handle deposits, withdrawals, transfers, loan disbursements, instalments, balances, and statements.', 'Month-end jobs: interest on savings, late-payment penalties, and a report that reconciles with the bank.', 'Non-functional rules: money is never lost, every change is auditable, and retries never double-apply. Correctness outweighs raw throughput.', 'Out of scope: credit scoring, member onboarding (KYC).'],
        est: ['200,000 members × 30 monthly transactions equals ~6 M writes/month (~2–3 writes/s). Even 20× payday spikes fit comfortably on one SQL Server.', 'Double-entry means at least two entries per transaction: about 12 M rows a month, roughly 150 M a year. Fine for one table, as long as statements never scan it.', 'The hard parts are correctness, concurrency and the month-end batch, not scale.'],
        api: ['POST /transfers { fromAccountId, toAccountId, amount } with Idempotency-Key → { transactionId }', 'GET /accounts/{id}/statement?before=', 'accounts(id, member_id, type, balance, row_version) · transactions(id, kind, idempotency_key UNIQUE, created_at) · ledger_entries(id, transaction_id, account_id, amount)'],
        tiers: [['Member app', 'Teller web app'], ['API gateway'], ['Ledger service', 'Month-end batch worker'], ['SQL Server (source of truth)', 'Outbox / queue', 'Notification service']],
        deep: [['Double-entry, append-only', 'Every transfer posts balanced entries (+100,000 savings, −100,000 cash) summing to zero. Append reversing rows instead of editing history so total entries always net to zero.'], ['Balances under concurrency', 'Combine check and debit in one statement: UPDATE accounts SET balance = balance - @amount WHERE id = @id AND balance >= @amount. Zero affected rows means insufficient funds. Write ledger entries in that same transaction and verify balances nightly.'], ['Money types and rounding', 'Store amounts in DECIMAL(19,4) or whole-rupiah BIGINT, never float. Define one shared rounding rule so batches, statements, and reports always match.'], ['Retries and the month-end batch', 'A unique idempotency key on transactions ensures mobile retries return the first result. Run interest batches per account and period with a unique (account_id, period) key so crash reruns fill gaps only. Send notifications via an outbox so alerts fire only on committed writes.']],
        follow: ['A teller entered the same deposit twice. How is it corrected?', 'How do statements stay fast after five years of entries?', 'How would you reconcile the ledger with the bank statement every day?'] }
    ]
  };

  const behavioral = [
    { id: 'ownership', name: 'Ownership', looks: 'You acted beyond your job description, followed the problem to its root, and stayed until it was truly resolved.', qs: ['Tell me about a time you took on something outside your responsibilities.', 'Describe a problem you noticed that nobody had asked you to fix.', 'Tell me about a project you drove from start to finish.', 'When have you stayed with a problem long after others moved on?'] },
    { id: 'conflict', name: 'Conflict and disagreement', looks: 'You argued with data instead of ego, listened well, and backed the final call even when overruled.', qs: ['Tell me about a time you disagreed with a teammate or manager.', 'Describe a time you had to push back on a requirement.', 'Tell me about receiving feedback you did not agree with.', 'When did you change your mind after a disagreement?'] },
    { id: 'failure', name: 'Failure and learning', looks: 'A real failure with real consequences, owned without blame, and a specific change in how you work since.', qs: ['Tell me about your biggest professional mistake.', 'Describe a project that did not meet its goal.', 'Tell me about a time you missed a deadline.', 'What is a piece of critical feedback that changed how you work?'] },
    { id: 'ambiguity', name: 'Ambiguity', looks: 'You created clarity: found the right questions, made reasonable assumptions explicit, started small, and adjusted.', qs: ['Tell me about a time you had to work with unclear requirements.', 'Describe a decision you made without having all the information.', 'Tell me about starting something in an area completely new to you.', 'When did priorities change suddenly, and how did you respond?'] },
    { id: 'impact', name: 'Impact and results', looks: 'A measurable outcome that mattered to users or the business, and a clear line from your actions to that result.', qs: ['What accomplishment are you most proud of?', 'Tell me about a time you significantly improved a system or process.', 'Describe the most technically challenging problem you have solved.', 'Tell me about a time you delivered more than was expected.'] },
    { id: 'leadership', name: 'Leadership and influence', looks: 'You moved people without authority: persuaded with evidence, aligned different interests, and made others more effective.', qs: ['Tell me about a time you led without being the formal leader.', 'Describe how you convinced a team to adopt your idea.', 'Tell me about mentoring or teaching someone.', 'When have you raised the quality bar for your team?'] },
    { id: 'collaboration', name: 'Collaboration', looks: 'You worked across roles and teams, communicated early, and put the shared goal above your own preferences.', qs: ['Tell me about working with a difficult colleague.', 'Describe a project that depended on another team.', 'Tell me about a time you helped a struggling teammate.', 'How have you handled a teammate who was not delivering?'] },
    { id: 'customer', name: 'Customer focus and prioritization', looks: 'You started from the user’s problem, made deliberate trade-offs under constraints, and can explain what you chose not to do.', qs: ['Tell me about a time you had too much to do and how you prioritized.', 'Describe a trade-off between quality and speed that you made.', 'Tell me about a time you advocated for the user.', 'When did you say no to a request, and why?'] }
  ];

  const rapid = [
    { area: 'C#', track: 'csharp', qs: [
      ['What is the difference between a value type and a reference type?', 'Value types hold their data directly and copy on assignment, whereas reference types store a reference to a heap object so variables share one instance. Explain copy vs share semantics first, noting struct fields inside classes live on the heap.'],
      ['Explain async/await. What happens at an await?', "If the awaited task isn't done yet, the method returns an incomplete Task and frees the thread for other work until a continuation resumes it. If already complete, execution continues synchronously without yielding. Async scales I/O wait time rather than speeding up one call."],
      ['IEnumerable vs IQueryable?', 'IEnumerable runs lambdas in memory over C# objects. IQueryable wraps an expression tree that providers like EF Core translate into SQL. Calling ToList early pulls filtering back from the database into memory.'],
      ['What are the differences between an interface and an abstract class?', 'A class can implement many interfaces (capability contracts), yet inherit only one abstract class (shared base state, constructors, and methods). Use interfaces for capabilities and abstract classes for shared base logic.'],
      ['How does garbage collection work in .NET?', '.NET runs a generational tracing GC. Short-lived objects die cheaply in Gen 0, survivors promote to Gen 1 and Gen 2, and objects around 85 KB+ enter the LOH. Cut hot-path allocations instead of calling GC.Collect.'],
      ['What is the difference between record, class and struct?', 'A class is a reference type compared by reference. A struct is a copied value type. A record (class or struct) adds value-based equality and non-destructive with copies, fitting immutable DTOs and messages.']] },
    { area: 'ASP.NET Core', track: 'aspnet', qs: [
      ['Explain the middleware pipeline.', 'Requests pass through middleware in registration order, and responses return in reverse. Each component can act before and after calling next, or short-circuit. Order matters: exception handling first, then routing, authentication, authorization, and endpoints.'],
      ['Singleton, scoped, and transient: what is a captive dependency?', 'Singleton lives for the whole app, scoped lives per request, and transient is created on every resolution. A captive dependency happens when a longer-lived service holds a shorter-lived one, like a singleton keeping a scoped DbContext, causing stale state and concurrency bugs.'],
      ['How do you prevent the N+1 query problem in EF Core?', 'Project with Select to grab just the columns you need in one query, or use Include for related rows instead of lazy loading inside loops. Always check the generated SQL.'],
      ['Authentication vs authorization, and 401 vs 403?', "Authentication confirms who you are, while authorization checks what you're allowed to do. 401 means not signed in, and 403 means signed in without permission. Check record ownership too, not just roles."],
      ['How would you handle errors consistently in an API?', 'Validate at the boundary and return 400 ProblemDetails. Return 404 or 409 for expected errors, then log and return a generic 500 in one global handler.'],
      ['How do you make an endpoint safe to retry?', 'Make it idempotent. GET, PUT, and DELETE already are by design, while POST needs an idempotency key saved with a unique constraint so retries return the first result.']] },
    { area: 'SQL', track: 'sql', qs: [
      ['INNER JOIN vs LEFT JOIN?', 'INNER returns only matching pairs. LEFT returns every left row, with NULLs when no right row matches. Filtering the right table in WHERE turns a LEFT JOIN back into an inner join.'],
      ['What is an index and what does it cost?', 'A sorted B-tree that turns table scans into fast seeks. The trade-off is extra storage and slower writes. Composite indexes follow leftmost-prefix order, while covering indexes skip lookups.'],
      ['Explain ACID.', "Atomic (all or nothing), Consistent (constraints stay valid), Isolated (concurrent work doesn't corrupt data), and Durable (committed writes survive crashes)."],
      ['WHERE vs HAVING?', 'WHERE filters rows before grouping, while HAVING filters groups after aggregation. Execution runs FROM, WHERE, GROUP BY, HAVING, SELECT, ORDER BY.'],
      ['What are isolation levels?', 'Levels include read uncommitted, read committed, repeatable read, serializable, and snapshot. Stricter levels stop anomalies like phantoms at higher lock contention. SQL Server defaults to read committed with shared locks unless READ_COMMITTED_SNAPSHOT lets readers view committed snapshots without blocking.'],
      ['How do you investigate a slow query?', 'Inspect the actual execution plan and compare estimated vs actual rows. Check for scans, lookups, spills, non-sargable predicates, and stale stats before tweaking and re-measuring.'],
      ['Clustered vs nonclustered index in SQL Server?', 'A clustered index stores the actual table sorted by key, so each table gets just one (usually the primary key). A nonclustered index is a separate B-tree carrying key columns plus the clustered key. Reading extra columns adds key lookups per row unless included with INCLUDE.']] },
    { area: 'TypeScript', track: 'react', qs: [
      ['interface vs type?', 'Both describe object shapes. You can extend and merge interfaces, while type aliases also express unions, tuples, and mapped or conditional types. Pick one style for object shapes and use type for the rest.'],
      ['any vs unknown vs never?', 'any disables type checking. unknown accepts anything, but you must narrow it first before reading from it. never is the empty type for values that can never exist, which makes exhaustiveness checks work.'],
      ['What is a discriminated union and why use it?', "A union of object types that share a literal tag field. Checking that tag narrows the union automatically, so invalid states like having both data and an error at once can't happen."],
      ['Explain generics with an example.', 'Type parameters preserve relationships between inputs and outputs: function first<T>(items: T[]): T. Constrain with extends when the function body needs specific members.'],
      ['Does TypeScript check types at runtime?', 'No. Types are erased at compile time. Data crossing a boundary such as an API, storage, or user input still needs runtime validation, for example with a schema library.'],
      ['What does structural typing mean?', 'Compatibility comes from shape rather than type names. Any object with the required members fits there, unlike C# where declared names matter most.']] },
    { area: 'React', track: 'react', qs: [
      ['What triggers a re-render?', 'A component re-renders when its state changes, its parent re-renders, or a context it reads updates. Re-rendering just means React calls the function again. The DOM only changes where the output differs.'],
      ['What is useEffect for, and when should you not use it?', "Syncing with systems outside React like the network, subscriptions, or the DOM. Don't use it to compute values from props or state (calculate those during render) or to respond to user actions (use an event handler)."],
      ['Why are keys needed in lists?', 'They give elements a stable identity between renders so React matches, moves, or removes the right ones. Index keys break when items get reordered, inserted, or deleted.'],
      ['Controlled vs uncontrolled inputs?', 'In a controlled input, React state supplies value and handles edits via onChange as one source of truth. In an uncontrolled input, the DOM holds the value and you read it through a ref or form data.'],
      ['When do useMemo, useCallback and memo actually help?', "They help when profiling shows a slow render or when a memoized child needs stable props. Passing new objects or functions on every render breaks memo. Profile first, since moving state down often solves the problem without memoization. With React Compiler on, the build handles most of this for you, so manual useMemo and useCallback are rare."],
      ['How do you manage state in a large React app?', 'Classify it first. Keep server state in a query cache, URL state in the router, and local UI state in components. Only truly shared client state belongs in context or a store.']] },
    { area: 'CSS', track: 'css', qs: [
      ['Explain specificity.', 'When rules clash, the cascade checks origin and !important, inline styles, cascade layers, specificity as (ids, classes, elements), and source order last. One id beats any number of classes. Keep selectors flat and low.'],
      ['Flexbox vs Grid?', 'Flexbox lays out one dimension (a row or column) sized from content. Grid lays out two dimensions with explicit tracks. Use Grid for page structure and flexbox inside components.'],
      ['What does box-sizing: border-box do?', 'It makes width and height include padding and border, so a 300px element stays 300px regardless of padding.'],
      ['Why can z-index: 9999 appear behind z-index: 2?', "z-index only orders elements sharing one stacking context. An ancestor with transform, opacity, filter, or its own z-index creates a boundary child elements can't escape."],
      ['How do you center an element?', 'Set display: grid with place-items: center on the parent, or display: flex with justify-content and align-items centered. For a sized block element, margin-inline: auto centers horizontally.'],
      ['Why use Tailwind, and what are its downsides?', 'Fast UI building, a consistent scale, fewer invented class names, and small CSS bundles. Downsides include busy HTML markup, a learning curve, and needing components to avoid repeated classes. You still need CSS fundamentals.']] },
    { area: 'Web fundamentals', track: 'aspnet', qs: [
      ['What happens when you type a URL and press Enter?', 'The browser resolves DNS, opens a TLS connection (TCP for HTTP/1.1–2, QUIC for HTTP/3), and sends the request. It then parses HTML, fetches assets, builds DOM and CSSOM, lays out, paints, and runs scripts.'],
      ['What is CORS?', "CORS is a browser rule blocking pages from reading responses across origins unless the server sends Access-Control-Allow-* headers. It protects users, so it isn't server-side API security."],
      ['Cookies vs tokens in localStorage for auth?', "HttpOnly, Secure, SameSite cookies can't be read by JavaScript, limiting XSS exposure, though they need CSRF protection. Tokens in localStorage are convenient but wide open if XSS lands."],
      ['Explain XSS and CSRF.', "XSS runs an attacker's script inside your page, so escape output and set a Content Security Policy. CSRF tricks a logged-in user's browser into sending an authenticated request from another site, stopped with SameSite cookies and anti-forgery tokens."],
      ['What makes an API RESTful?', 'URLs identify resources, HTTP methods act as verbs, status codes report outcomes, requests stay stateless, and payloads use representations like JSON. Idempotency on GET, PUT, and DELETE matters for safe retries and caching.'],
      ['How does HTTP caching work?', 'Cache-Control sets how long a response stays fresh, while ETag or Last-Modified let clients revalidate with a 304. Browsers and CDNs serve fresh responses directly without hitting your origin server.']] },
    { area: 'Dart + Flutter', track: 'flutter', qs: [
      ['StatelessWidget vs StatefulWidget?', 'Both widgets are immutable configuration. StatelessWidget only runs build(), while StatefulWidget keeps a persistent State object for mutable fields and rebuilds on setState().'],
      ['Explain the widget, element and render object trees.', 'Widgets are cheap immutable descriptions rebuilt often. Elements are long-lived instances that match old widgets to new ones by type and key and hold State. Render objects compute layout and painting and update only when needed.'],
      ['What are keys for?', 'Keys preserve State identity when siblings of the same type reorder, insert, or vanish. Without keys, Flutter matches widgets by list position.'],
      ['Cubit vs Bloc, and how do they compare to Provider and Riverpod?', 'Cubit emits state straight from methods, whereas Bloc maps events to states with extra boilerplate. Provider injects mutable ChangeNotifier classes, while Riverpod is compile-safe and context-free with granular dependencies.'],
      ['How does layout work in Flutter?', 'Constraints go down, sizes go up, and the parent sets the position. Parents pass min and max sizes down, children choose sizes within those bounds, and parents place each child. Overflow and unbounded-height errors come from this rule.'],
      ['How do you keep a Flutter app smooth?', 'Frames get 16 ms at 60 Hz (8 ms at 120 Hz). Avoid extra rebuilds with const widgets, local state, and selectors, then paginate lists with builders. Offload heavy CPU work via compute() and profile with DevTools rather than guessing.']]},
    { area: 'Angular', track: 'angular', qs: [
      ['computed() vs linkedSignal() vs effect()?', 'computed() is lazy, cached read-only derived state. linkedSignal() gives you writable state that resets automatically when a source signal changes, avoiding effect loops. Use effect() only for external work like localStorage, canvas, or logging, never to copy signals.'],
      ['How does @Component({ imports }) work in modern Angular?', 'Components are standalone by default with no NgModule needed. Each component declares the directives, pipes, and child components used in its own template in imports, letting the compiler tree-shake unused code per component.'],
      ['What is the difference between element providers and environment injectors?', 'Dependency lookup walks up ElementInjector on ancestor host elements first, then EnvironmentInjector from route providers to root. Putting a service in @Component({ providers }) creates one instance per component instance, while @Service() shares a root singleton.'],
      ['When do you use switchMap vs exhaustMap vs concatMap?', 'switchMap cancels the previous in-flight inner observable and keeps only the latest, ideal for typeahead search. exhaustMap ignores new triggers while the current request runs, preventing double form submits or double charges. concatMap queues requests in order for sequential writes.'],
      ['How does zoneless OnPush change detection with Signals decide what to re-render?', 'Signals notify only the specific template views that read them during render. Unrelated parent and sibling views are skipped without Zone.js monkey-patching events or walking from the root down.'],
      ['How should an Angular client handle auth guards and server errors with ASP.NET Core?', 'Functional CanActivateFn and CanMatchFn guards handle UX redirects via RedirectCommand, while the ASP.NET Core API still enforces authorization policies on every endpoint. Interceptors attach tokens or XSRF headers in one spot and map RFC 9457 ProblemDetails into field-level errors.']]},
    { area: 'Go', track: 'go', qs: [
      ['Value receiver vs pointer receiver, and why avoid mixing them?', 'A value receiver gets a copy of the struct, so changes never reach the caller. A pointer receiver gets the address, letting you mutate fields and avoid copying large structs. Keep receivers consistent because *T methods don\'t satisfy interfaces on value T, and mixing copies locks or confuses callers.'],
      ['How do Go slice headers work, and what is the append() aliasing trap?', 'A slice header holds three words: a pointer to the backing array, length, and capacity. Slicing b := a[0:2] keeps the original capacity, so append(b, x) overwrites a[2] instead of allocating. Clamp capacity with a[0:2:2] or copy with slices.Clone first.'],
      ['Unbuffered vs buffered channels, and who should close a channel?', 'An unbuffered channel blocks until sender and receiver meet, giving you direct synchronization. A buffered channel accepts up to cap items before blocking senders. Always close from the sender side, because writing to a closed channel panics while receivers detect close via v, ok := <-ch.'],
      ['Why can returning a typed nil pointer as error make err != nil return true?', 'Interfaces store two words: a dynamic type and a data pointer. Returning a typed nil like var e *MyError = nil fills the type word, making err != nil true. Always return untyped nil when there is no error.'],
      ['Why pass context.Context as a parameter instead of storing it on a struct?', 'Context carries per-request cancellation, deadlines, and request metadata rather than object state. Passing ctx as the first argument ensures downstream *Context I/O stops when a client disconnects. Use context.WithoutCancel (Go 1.21+) for post-response audit work.'],
      ['How do you make a Go net/http server safe under load and shutdown?', 'Set explicit ReadHeaderTimeout, ReadTimeout, WriteTimeout, and IdleTimeout on http.Server instead of calling bare http.ListenAndServe. Cap worker concurrency with errgroup.SetLimit, listen for SIGINT or SIGTERM via signal.NotifyContext, and drain active requests with server.Shutdown(ctx).']]}
  ];

  const plan = [
    ['Week 1: Foundations', ['Finish the Beginner lessons in CS Fundamentals, C# and SQL', 'Solve the 7 easy coding problems, narrating out loud', 'Write your résumé using the impact formula', 'List 10 experiences that could become stories']],
    ['Week 2: Core patterns', ['Study hash map, two pointers, sliding window and stack patterns', 'Solve 5 medium problems (30 minutes each, timed)', 'Finish the Beginner lessons in ASP.NET Core, CSS, React, Angular and Flutter', 'Write 3 STAR stories in the story bank']],
    ['Week 3: Trees, graphs, and search', ['Study binary search, trees, graphs and intervals', 'Solve 5 more medium problems and re-solve any that needed hints', 'Finish the Intermediate lessons in C#, SQL and ASP.NET Core', 'Start Capstone 2 as your first portfolio app']],
    ['Week 4: DP, backtracking, and design basics', ['Study backtracking and dynamic programming', 'Solve the remaining problems including the hard one', 'Learn the system design framework and building blocks', 'First mock coding interview, graded with the rubric', 'Finish the Intermediate lessons in CSS, React, Angular and Flutter']],
    ['Week 5: System design', ['Work all 6 design cases: attempt first, then compare', 'Present one case out loud in 35 minutes, recorded', 'Advanced lessons: async, transactions, indexes, auth', 'Complete the story bank: every theme covered']],
    ['Week 6: Full-stack depth', ['Rapid-fire Q&A: rate every question, redo the shaky ones', 'Finish and deploy Capstone 2, then start Capstone 3', 'Mock system design interview', 'Mock behavioral interview']],
    ['Week 7: Mock loop', ['Two timed mock coding interviews', 'One full loop in a single day: coding, design, behavioral, rapid-fire', 'Review every rubric score below 3 and drill that area', 'Practise with another person at least once']],
    ['Week 8: Apply and sharpen', ['Apply broadly, request referrals, and book practice loops first', 'Re-solve 8 problems cold, 20 minutes each', 'Prepare questions to ask each interviewer', 'After each real interview, write down every question asked']]
  ];

  const hiring = [
    '**What interviews measure.** Big tech loops test four areas: coding, system design (mid-level+), behavioral stories, and stack depth. Each interviewer scores independently against a rubric.',
    '**Résumé bullets follow the impact formula.** Write each bullet as accomplished X, measured by Y, by doing Z. For instance, “Cut checkout API p95 latency from 900 ms to 180 ms by adding a covering index and output caching.”',
    '**No big-company name yet? Build proof.** Capstones 3 and 4 in this program are portfolio-grade: deployed, tested, measured. A real system with real numbers beats a list of technologies.',
    '**Referrals multiply your response rate.** Reach out to engineers at target companies with a specific, short message and a link to your work. Contribute to an open-source project they use.',
    '**Levels.** Junior: solves well-defined problems with clean code. Mid: owns features end to end and designs components. Senior: owns systems, handles ambiguity, and makes others better. Aim your stories and design depth at the level you are applying for.',
    '**Sequence your interviews.** Schedule less-preferred companies first as practice, and cluster final rounds so offers overlap.',
    '**Proof beats titles.** Shipped software, measured metrics, public writing, and open-source code give interviewers verifiable proof. Past company names earn the call, but proof clears the loop.',
    '**Remote and local hiring differ.** While algorithm prep sets your baseline, many remote and Indonesian teams run take-homes or pairing. Expect HR and team-lead rounds next.',
    '**Take-homes get graded like pull requests.** Read the brief twice, ask early questions, and respect the time box. A clear README with trade-offs, targeted tests, and tidy commits matters as much as features.',
    '**Know your salary target before the HR call.** On foreign remote offers, clarify whether you are staff or a contractor, plus currency and fees. Contractors normally report and pay tax themselves.'
  ];

  window.IV = { method, patterns, problems, bigO, design, behavioral, rapid, plan, hiring };
})();
