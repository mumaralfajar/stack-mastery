// Frontend "build a component" round: prompts with what interviewers check.
IV.ui = [
  ['Autocomplete search box', 'Fetch suggestions as the user types, show them in a list, select with mouse or keyboard.', 'Debounced requests; stale responses ignored or aborted; arrow keys, Enter and Escape work; loading, empty and error states; accessible combobox roles.'],
  ['Modal dialog', 'A reusable modal opened by a button, with a title, content and close actions.', 'Focus moves in and is trapped; Escape and backdrop click close it; focus returns to the trigger; body scroll is locked; uses `<dialog>` or correct ARIA.'],
  ['Data table', 'Render rows from an API with sortable columns, pagination and a filter box.', 'State kept minimal and derived; sort and page reflected in the URL; stable keys; loading and empty states; no re-fetch on every keystroke.'],
  ['Todo list with filters', 'Add, toggle, edit and delete items; filter by all / active / done; persist across reloads.', 'Immutable updates; derived filtered list; controlled inputs; a reducer or clean handlers; keyboard-friendly editing.'],
  ['Star rating', 'A five-star rating component usable as a form input.', 'Controlled and uncontrolled use; hover preview; keyboard support with arrow keys; radio-group semantics; typed props.'],
  ['Infinite scroll feed', 'Load pages of items as the user nears the bottom.', 'IntersectionObserver rather than scroll events; cursor pagination; no duplicate requests; virtualization discussed for long lists.'],
  ['Flutter: searchable product list', 'A screen that loads products from an API, filters them as the user types, and supports pull-to-refresh.', 'Loading, empty and error states; debounced search; logic in a cubit or bloc, not in the widget; `ListView.builder` with keys; no work started inside `build`.'],
  ['Flutter: cart with quantity steppers', 'A cart screen where each line has plus and minus buttons, a running total and a swipe-to-remove action.', 'Immutable state with `copyWith`; narrow rebuilds (`BlocSelector` or small widgets); keys on dismissible rows; a disabled minus at zero; semantics labels on icon buttons.']
];

// C# solutions for the interview problems. Every one is compiled and run against the same
// test cases as the TypeScript judge by tools/verify.mjs.
IV.cs = {
  'two-sum': `
public static int[] TwoSum(int[] nums, int target)
{
    var seen = new Dictionary<int, int>();           // value -> index
    for (int i = 0; i < nums.Length; i++)
    {
        if (seen.TryGetValue(target - nums[i], out int j)) return [j, i];
        seen[nums[i]] = i;
    }
    return [];
}`,
  'group-anagrams': `
public static List<List<string>> GroupAnagrams(string[] words)
{
    var groups = new Dictionary<string, List<string>>();
    foreach (var w in words)
    {
        var key = new string(w.Order().ToArray());
        if (!groups.TryGetValue(key, out var list)) groups[key] = list = new List<string>();
        list.Add(w);
    }
    return groups.Values.ToList();
}`,
  'top-k-frequent': `
public static int[] TopKFrequent(int[] nums, int k)
{
    var count = new Dictionary<int, int>();
    foreach (int n in nums) count[n] = count.GetValueOrDefault(n) + 1;

    var heap = new PriorityQueue<int, int>();        // min-heap by frequency
    foreach (var (value, freq) in count)
    {
        heap.Enqueue(value, freq);
        if (heap.Count > k) heap.Dequeue();          // evict the least frequent
    }

    var result = new int[heap.Count];
    for (int i = result.Length - 1; i >= 0; i--) result[i] = heap.Dequeue();
    return result;
}`,
  'valid-palindrome': `
public static bool IsPalindrome(string s)
{
    int l = 0, r = s.Length - 1;
    while (l < r)
    {
        if (!char.IsAsciiLetterOrDigit(s[l])) l++;
        else if (!char.IsAsciiLetterOrDigit(s[r])) r--;
        else if (char.ToLowerInvariant(s[l++]) != char.ToLowerInvariant(s[r--])) return false;
    }
    return true;
}`,
  'container-water': `
public static int MaxArea(int[] heights)
{
    int l = 0, r = heights.Length - 1, best = 0;
    while (l < r)
    {
        best = Math.Max(best, Math.Min(heights[l], heights[r]) * (r - l));
        if (heights[l] < heights[r]) l++; else r--;
    }
    return best;
}`,
  'longest-substring': `
public static int LengthOfLongestSubstring(string s)
{
    var last = new Dictionary<char, int>();          // char -> last index seen
    int left = 0, best = 0;
    for (int right = 0; right < s.Length; right++)
    {
        if (last.TryGetValue(s[right], out int prev) && prev >= left) left = prev + 1;
        last[s[right]] = right;
        best = Math.Max(best, right - left + 1);
    }
    return best;
}`,
  'best-trade': `
public static int MaxProfit(int[] prices)
{
    int low = int.MaxValue, best = 0;
    foreach (int p in prices)
    {
        low = Math.Min(low, p);
        best = Math.Max(best, p - low);
    }
    return best;
}`,
  'valid-brackets': `
public static bool IsValid(string s)
{
    var pair = new Dictionary<char, char> { [')'] = '(', [']'] = '[', ['}'] = '{' };
    var stack = new Stack<char>();
    foreach (char c in s)
    {
        if (pair.TryGetValue(c, out char open))
        {
            if (stack.Count == 0 || stack.Pop() != open) return false;
        }
        else stack.Push(c);
    }
    return stack.Count == 0;
}`,
  'daily-temperatures': `
public static int[] DailyTemperatures(int[] temps)
{
    var answer = new int[temps.Length];
    var stack = new Stack<int>();                    // indices still waiting
    for (int i = 0; i < temps.Length; i++)
    {
        while (stack.Count > 0 && temps[i] > temps[stack.Peek()])
        {
            int j = stack.Pop();
            answer[j] = i - j;
        }
        stack.Push(i);
    }
    return answer;
}`,
  'search-rotated': `
public static int SearchRotated(int[] nums, int target)
{
    int lo = 0, hi = nums.Length - 1;
    while (lo <= hi)
    {
        int mid = lo + (hi - lo) / 2;
        if (nums[mid] == target) return mid;
        if (nums[lo] <= nums[mid])                   // left half is sorted
        {
            if (nums[lo] <= target && target < nums[mid]) hi = mid - 1; else lo = mid + 1;
        }
        else                                         // right half is sorted
        {
            if (nums[mid] < target && target <= nums[hi]) lo = mid + 1; else hi = mid - 1;
        }
    }
    return -1;
}`,
  'reverse-list': `
// public class ListNode { public int Val { get; set; } public ListNode? Next { get; set; } }
public static ListNode? ReverseList(ListNode? head)
{
    ListNode? prev = null, cur = head;
    while (cur != null)
    {
        var next = cur.Next;                         // save before overwriting
        cur.Next = prev;
        prev = cur;
        cur = next;
    }
    return prev;
}`,
  'merge-intervals': `
public static int[][] MergeIntervals(int[][] intervals)
{
    var sorted = intervals.OrderBy(i => i[0]).Select(i => new[] { i[0], i[1] });
    var merged = new List<int[]>();
    foreach (var cur in sorted)
    {
        if (merged.Count > 0 && cur[0] <= merged[^1][1])
            merged[^1][1] = Math.Max(merged[^1][1], cur[1]);
        else merged.Add(cur);
    }
    return merged.ToArray();
}`,
  'tree-depth': `
// public class TreeNode { public int Val { get; set; } public TreeNode? Left { get; set; } public TreeNode? Right { get; set; } }
public static int MaxDepth(TreeNode? root) =>
    root is null ? 0 : 1 + Math.Max(MaxDepth(root.Left), MaxDepth(root.Right));`,
  'level-order': `
public static List<List<int>> LevelOrder(TreeNode? root)
{
    var result = new List<List<int>>();
    var queue = new Queue<TreeNode>();
    if (root != null) queue.Enqueue(root);
    while (queue.Count > 0)
    {
        int size = queue.Count;                      // nodes on this level
        var level = new List<int>(size);
        for (int i = 0; i < size; i++)
        {
            var node = queue.Dequeue();
            level.Add(node.Val);
            if (node.Left != null) queue.Enqueue(node.Left);
            if (node.Right != null) queue.Enqueue(node.Right);
        }
        result.Add(level);
    }
    return result;
}`,
  'islands': `
public static int NumIslands(char[][] grid)
{
    int rows = grid.Length, cols = rows == 0 ? 0 : grid[0].Length, count = 0;

    void Sink(int r, int c)
    {
        if (r < 0 || c < 0 || r >= rows || c >= cols || grid[r][c] != '1') return;
        grid[r][c] = '0';
        Sink(r + 1, c); Sink(r - 1, c); Sink(r, c + 1); Sink(r, c - 1);
    }

    for (int r = 0; r < rows; r++)
        for (int c = 0; c < cols; c++)
            if (grid[r][c] == '1') { count++; Sink(r, c); }
    return count;
}`,
  'course-schedule': `
public static bool CanFinish(int n, int[][] prerequisites)
{
    var next = new List<int>[n];
    for (int i = 0; i < n; i++) next[i] = new List<int>();
    var indegree = new int[n];
    foreach (var p in prerequisites) { next[p[1]].Add(p[0]); indegree[p[0]]++; }

    var ready = new Queue<int>();
    for (int i = 0; i < n; i++) if (indegree[i] == 0) ready.Enqueue(i);

    int taken = 0;
    while (ready.Count > 0)
    {
        int course = ready.Dequeue();
        taken++;
        foreach (int m in next[course])
            if (--indegree[m] == 0) ready.Enqueue(m);
    }
    return taken == n;
}`,
  'climb-stairs': `
public static int ClimbStairs(int n)
{
    int prev = 1, cur = 1;
    for (int i = 2; i <= n; i++) (prev, cur) = (cur, prev + cur);
    return cur;
}`,
  'coin-change': `
public static int CoinChange(int[] coins, int amount)
{
    var dp = new int[amount + 1];
    Array.Fill(dp, amount + 1);                      // stands for "infinity"
    dp[0] = 0;
    for (int a = 1; a <= amount; a++)
        foreach (int coin in coins)
            if (coin <= a) dp[a] = Math.Min(dp[a], dp[a - coin] + 1);
    return dp[amount] > amount ? -1 : dp[amount];
}`,
  'subsets': `
public static List<List<int>> Subsets(int[] nums)
{
    var result = new List<List<int>>();
    var path = new List<int>();

    void Explore(int start)
    {
        result.Add(new List<int>(path));             // record a copy
        for (int i = start; i < nums.Length; i++)
        {
            path.Add(nums[i]);                       // choose
            Explore(i + 1);                          // explore
            path.RemoveAt(path.Count - 1);           // un-choose
        }
    }

    Explore(0);
    return result;
}`,
  'lru-cache': `
public class LRUCache(int capacity)
{
    private readonly Dictionary<int, LinkedListNode<(int Key, int Value)>> _map = new();
    private readonly LinkedList<(int Key, int Value)> _order = new();   // front = most recent

    public int Get(int key)
    {
        if (!_map.TryGetValue(key, out var node)) return -1;
        _order.Remove(node);                         // O(1): we hold the node
        _order.AddFirst(node);
        return node.Value.Value;
    }

    public void Put(int key, int value)
    {
        if (_map.Remove(key, out var existing)) _order.Remove(existing);
        _map[key] = _order.AddFirst((key, value));
        if (_map.Count > capacity)
        {
            var oldest = _order.Last!;
            _order.RemoveLast();
            _map.Remove(oldest.Value.Key);
        }
    }
}`,
  'trap-water': `
public static int Trap(int[] height)
{
    int l = 0, r = height.Length - 1, leftMax = 0, rightMax = 0, water = 0;
    while (l < r)
    {
        if (height[l] < height[r])
        {
            leftMax = Math.Max(leftMax, height[l]);
            water += leftMax - height[l];
            l++;
        }
        else
        {
            rightMax = Math.Max(rightMax, height[r]);
            water += rightMax - height[r];
            r--;
        }
    }
    return water;
}`
};
