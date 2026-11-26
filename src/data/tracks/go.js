// @ts-check
// Go track (Go 1.27.4). Every lesson code sample is vetted, built, and tested by tools/verify-go.mjs.
// Inside these JS template literals any Go backtick (`) is escaped as \`.
export const track = {
  id: 'go', name: 'Go', lang: 'go',
  tagline: 'Typed, concurrent backend services in Go: slices, interfaces, errors, net/http, json/v2, goroutines, context, SQL, and pprof.',
  lessons: [
    // ---------------- Beginner ----------------
    {
      id: 'types', title: 'Packages, values, and zero values', level: 0, mins: 30,
      terms: [
        ['Exported (`Name`) vs unexported (`name`)', 'A capital first letter exports a symbol outside its package. Lowercase keeps it visible only inside the package, with no `public` or `private` keywords.'],
        ['Zero value', 'Every declared variable starts with a predictable default (`0`, `""`, `false`, or `nil`). Types like `bytes.Buffer` and `sync.Mutex` work right away without calling a constructor.'],
        ['`rune` vs `byte`', 'Go strings hold immutable UTF-8 bytes, so `len(s)` counts bytes rather than characters. A `rune` (`int32`) holds one Unicode code point when iterating text.']
      ],
      predict: {
        prompt: 'With `cafe := "café"`, what do `len(cafe)` and `len([]rune(cafe))` print?',
        options: ['`4` and `4`', '`5` and `4`', '`4` and `5`'],
        answer: 1,
        explain: 'A Go `string` is a read-only sequence of bytes (source literals are UTF-8), and `len` counts bytes. `é` (U+00E9) takes two bytes in UTF-8, so `len(cafe)` is `5`. Converting to `[]rune` decodes the code points, giving `4`. Indexing `cafe[3]` returns a single byte, not the character `é`, so use `for i, r := range cafe` when you need characters.'
      },
      why: "Go keeps its core rules small. Every `.go` file belongs to a named package, exported identifiers start with an uppercase letter, and declared variables start at known zero values like `0` or `\"\"`. Once you know those three rules, standard-library code is easy to read.",
      points: [
        "Every `.go` file belongs to a `package`. An executable entry point is `package main` with `func main()`, while library packages export only symbols starting with an uppercase letter.",
        "Use `:=` for initialized local values (`qty := 3`) and `var` when starting at the zero value (`var buf bytes.Buffer`). Go doesn't convert numeric types automatically, so write conversions like `float64(price)` yourself.",
        "Since Go 1.18, use `any` instead of `interface{}`. Since Go 1.21 and 1.22, use built-in `min`, `max`, and `cmp.Or(envPort, \"8080\")` for fallback values.",
        "`len(s)` counts UTF-8 bytes, not visible characters, so `len(\"é\")` is `2`. Looping with `range s` decodes Unicode `rune` values for you, and `strings.CutLast` (Go 1.27+) splits at the last separator without manual index arithmetic.",
        "Use `strings.Builder` instead of `+` inside loops so repeated appends don't allocate a new string on every pass."
      ],
      code: `
package main

import (
	"bytes"
	"cmp"
	"fmt"
	"strings"
)

func main() {
	// Zero value: bytes.Buffer and ints are ready without constructors
	var buf bytes.Buffer
	buf.WriteString("order-")

	qty := 3
	unitCents := 1999
	totalCents := qty * unitCents
	buf.WriteString(fmt.Sprintf("%d", totalCents))

	// cmp.Or returns the first non-zero argument (Go 1.22+)
	addr := cmp.Or("", ":8080")
	capQty := min(qty, 10)

	// len() counts UTF-8 bytes; strings.CutLast splits at final "/" (Go 1.27+)
	dir, file, ok := strings.CutLast("api/v2/products.go", "/")
	cafe := "café"
	fmt.Println(buf.String(), addr, capQty, len(cafe), len([]rune(cafe)), dir, file, ok)
}
`,
      practice: "Create a folder `shop-go`, run `go mod init shop`, and save this code as `main.go`. Run it with `go run .`, then inspect `strings.CutLast` documentation directly in your terminal with `go doc strings.CutLast` and add a check printing each rune index with `for i, r := range \"kopi ☕\"`.",
      teach: "Explain the difference between `:=` and `var` in Go, why `len(\"café\")` is `5` instead of `4`, and how Go decides what is visible outside a package without `public` or `private` keywords.",
      analogy: "A zero value is like moving into a swept apartment with working utilities. Counters start at `0`, booleans start at `false`, and `bytes.Buffer` accepts writes right away.",
      pitfalls: [
        "Expecting `len(str)` to count characters instead of UTF-8 bytes. Slicing text with accents or emoji by byte offset can split a character in half.",
        "Leaving unused local variables or unused imports in a file. Go fails compilation with an error instead of emitting a warning.",
        "Expecting `int` values to convert to `float64` automatically. Go requires explicit conversions like `float64(price)`."
      ],
      quiz: [
        { id: 'export-type-function-go', q: "How do you export a type or function from a Go package?", a: ["Add the `export` keyword", "Start its identifier with an uppercase letter", "Place it in `index.go`", "Tag it with `//go:export`"], c: 1, why: "Export visibility in Go is controlled solely by capitalization of the first letter." },
        { id: 'len-caf-return', q: "What does `len(\"café\")` return?", a: ["4", "5", "6", "Compile error"], c: 1, why: "`len` on a string returns the number of UTF-8 bytes; `'é'` encodes as 2 bytes, so `3 + 2 = 5`." },
        { id: 'happens-declare-var-buf', q: "What happens if you declare `var buf bytes.Buffer` and call `buf.WriteString(\"hi\")` without `new` or initialization?", a: ["Nil pointer panic", "Zero-value compile error", "It works immediately because `bytes.Buffer`'s zero value is an empty buffer ready to use", "It prints nothing"], c: 2, why: "Designing types whose zero values are ready to use is common in Go, as seen in `bytes.Buffer` and `sync.Mutex`." }
      ]
    },
    {
      id: 'collections', title: 'Arrays, slices, maps, and loops', level: 0, mins: 35, viz: 'goslices',
      terms: [
        ['Slice header (`ptr, len, cap`)', 'A three-word descriptor pointing into a backing array. Assigning or passing a slice copies that small header, not the elements.'],
        ['Full slice expression (`s[low:high:max]`)', 'Limits capacity to `cap = max - low`. Appending past `len` then allocates a new backing array instead of overwriting siblings.'],
        ['Comma-ok map lookup', '`v, ok := m[k]` tells a missing key (`ok == false`) apart from a key explicitly stored with value `0` (`ok == true`).']
      ],
      why: "Most Go programs store lists in slices and key-value data in maps. A slice is just a three-word view into an array, so appending to a sub-slice can overwrite data in the original slice. Maps have a different trap: reading a nil map returns the zero value, while writing to one crashes the program with a panic.",
      points: [
        "An array `[3]int` has a compile-time length and copies every element when assigned. A slice `[]int` is a three-word header (`ptr`, `len`, `cap`) pointing to a backing array.",
        "Preallocate when you know the size up front (`make([]int, 0, n)` or `make(map[string]int, n)`) so growth doesn't copy arrays or rehash maps repeatedly.",
        "An empty slice `[]int{}` encodes to `[]` in JSON, while a `nil` slice encodes to `null`. Reading a `nil` map returns its zero value, but writing to a `nil` map panics.",
        "Appending to a sub-slice while `len < cap` overwrites elements in the parent's array. Guard against that with `a[:2:2]` or `slices.Clone(a)` (`slices` / `maps`, Go 1.21+).",
        "Since Go 1.22, `for range` creates fresh `i` and `v` variables per iteration so closures and goroutines don't capture the final loop value. You can also write `for i := range 5` to loop `0` through `4`."
      ],
      predict: {
        prompt: "Read the slice operations in the code below. What does `fmt.Println(a, b)` output at the end?",
        options: [
          "`[10 20 30 40] [10 20 99]` because `append` always copies into a new slice",
          "`[10 20 99 40] [10 20 99]` because `b` had `cap = 4`, so `append` overwrote `a[2]` in place",
          "`[10 20 30 99] [10 20 99]` because `append` writes to the end of `a`",
          "Runtime panic: slice bounds out of range"
        ],
        answer: 1,
        explain: "`b := a[0:2]` points to the start of `a`'s backing array with `len = 2` and `cap = 4`. Because capacity remains, `append(b, 99)` overwrites index `2` inside `a`'s array. Clamp capacity with `a[0:2:2]` or call `slices.Clone` to isolate `b`."
      },
      code: `
package main

import (
	"fmt"
	"slices"
)

func main() {
	a := []int{10, 20, 30, 40}
	b := a[0:2]          // len=2, cap=4 (shares backing array with a)
	b = append(b, 99)    // overwrites index 2 in a because cap permits!
	fmt.Println(a, b)

	// Safe isolation: full-slice expression caps capacity at 2
	orig := []int{10, 20, 30, 40}
	safe := append(orig[0:2:2], 99)
	cloned := slices.Clone(orig)
	cloned[0] = -1
	fmt.Println("safe:", orig, safe, "cloned:", cloned)

	// Maps must be allocated before writes; comma-ok distinguishes missing vs zero
	stock := make(map[string]int, 4)
	stock["desk"] = 0
	if qty, ok := stock["desk"]; ok {
		fmt.Println("desk tracked with qty:", qty)
	}
	if _, ok := stock["chair"]; !ok {
		fmt.Println("chair missing")
	}

	// Go 1.22+: range over integers cleanly
	for i := range 3 {
		fmt.Printf("slot=%d ", i)
	}
	fmt.Println()
}
`,
      practice: "Open the Slice header visualizer on this lesson, step through both modes, then write a function `WithoutIndex(items []int, idx int) []int` in `main.go` that returns a copy with `items[idx]` removed without mutating the caller's original slice. Hint: verify `slices.Delete(slices.Clone(items), idx, idx+1)`.",
      teach: "Draw the three-word slice header (`ptr`, `len`, `cap`) and explain to a C# or JavaScript developer why appending to a Go sub-slice can overwrite the original slice.",
      analogy: "A slice is a sliding window over a strip of numbered tape. Two windows can overlap on the same strip, so writing past your window while tape slots remain ahead of it also changes what the other window shows.",
      pitfalls: [
        "Declaring `var counts map[string]int` and running `counts[\"a\"]++` right away. Writing to a nil map panics until you allocate it with `make` or `map[string]int{}`.",
        "Returning a small sub-slice from a 10 MB `[]byte`, such as a 10-byte token from an HTTP body. That tiny slice keeps the whole 10 MB array in memory until you copy it with `slices.Clone` or `bytes.Clone`.",
        "Writing manual `sort.Slice` loops when `slices.Sort` and `slices.Contains` are already built into the standard library."
      ],
      quiz: [
        { id: 'happens-write-nil-map', q: "What happens if you write to a `nil` map vs a `nil` slice?", a: ["Both work automatically", "Writing to a `nil` map panics; reading a `nil` map returns the zero value", "Both panic on `len()`", "`nil` maps allocate on first write"], c: 1, why: "A `nil` map reads as empty (`0`, `false`), but assigning `m[k] = v` panics until allocated with `make` or `{}`." },
        { id: 'protect-calling-append', q: "Why does `b := a[:2:2]` protect `a` when calling `append(b, x)`?", a: ["It freezes `a` as read-only", "It sets `cap(b) == len(b) == 2`, forcing `append` to allocate a new backing array", "It copies `a` deeply at compile time", "It shifts pointer ownership to GC"], c: 1, why: "With zero spare capacity in `b`, `append` cannot write into slot 2 of `a` and allocates fresh memory." },
        { id: 'go-22-change-range', q: "What did Go 1.22 change about `for i, v := range items`?", a: ["Loops always run concurrently", "Each iteration gets fresh per-iteration `i` and `v` variables instead of reusing one address across iterations", "Maps always iterate in sorted key order", "Slices become immutable inside loops"], c: 1, why: "Per-iteration scoping eliminates the classic closure/goroutine loop-variable capture bug." }
      ]
    },
    {
      id: 'structs', title: 'Structs, pointers, and methods', level: 0, mins: 30,
      terms: [
        ['Value vs pointer receiver', '`func (c Cart) Total()` gets a copy so caller data never changes. `func (c *Cart) Add(...)` gets a pointer, keeping edits and avoiding large struct copies.'],
        ['Struct embedding', 'Listing a type without a field name (`Logger` inside `Server`) exposes its fields and methods on the outer struct without inheritance.'],
        ['`omitzero` tag (Go 1.24+)', 'The `json:"discount,omitzero"` tag drops any zero-valued field when encoding JSON, including structs and `time.Time` where `omitempty` often failed.']
      ],
      predict: {
        prompt: 'Suppose `AddItem` had a value receiver, `func (o OrderConfig) AddItem(name string)`, with the same body. What would `cfg.ItemsCount()` print after `cfg.AddItem("Mechanical Keyboard")`?',
        options: ['`1`: methods always operate on the original struct', '`0`: the method appended to a copy of `cfg`', "A compile error: `append` isn't allowed inside a value receiver"],
        answer: 1,
        explain: 'A value receiver gets a copy of the struct. `append` stores the new slice header in `o.items` on that copy, and the copy is thrown away when the method returns, so `cfg.items` stays empty. A pointer receiver (`*OrderConfig`) works on the original, which is why mutating methods use one. Keep a single receiver kind per type for consistency.'
      },
      why: "Go has no classes or inheritance. Instead, you group data into structs, choose value or pointer receivers for methods, compose types by embedding, and add struct tags for JSON or SQL.",
      points: [
        "Go passes arguments by value (a copy). Pass `&x` (`*T`) when a function needs to change the caller's struct or avoid copying a large value. Pointer arithmetic isn't allowed.",
        "Keep one receiver kind per type: if any method mutates fields or the struct holds a `sync.Mutex` (which must never be copied), use pointer receivers `*T` on every method of `T`.",
        "Write field names in struct literals (`Product{ID: 1, Price: 25000}`). Positional literals break if someone adds or reorders fields later.",
        "Since Go 1.26, `new(expr)` accepts an initial value directly (`Timeout: new(30)` creates an `*int` pointing to `30`), so you don't need custom `ptr[T](v)` helper functions for optional fields.",
        "Use struct embedding only when the outer type should expose the inner type's API as its own. Use a named field (`store *OrderStore`) for internal collaborators."
      ],
      code: `
package main

import (
	"encoding/json/v2"
	"fmt"
	"time"
)

type AuditMeta struct {
	CreatedAt time.Time \`json:"createdAt"\`
}

func (a AuditMeta) AgeSummary() string { return "tracked" }

type OrderConfig struct {
	AuditMeta                 // embedded: promotes CreatedAt & AgeSummary()
	TimeoutSec *int           \`json:"timeoutSec,omitzero"\`
	Notes      string         \`json:"notes,omitzero"\`
	items      []string
}

// Pointer receiver mutates state and avoids copying OrderConfig
func (o *OrderConfig) AddItem(name string) {
	o.items = append(o.items, name)
}

func (o *OrderConfig) ItemsCount() int { return len(o.items) }

func main() {
	// Go 1.26+: new(expr) creates *int initialized to 30 directly
	cfg := OrderConfig{
		AuditMeta:  AuditMeta{CreatedAt: time.Now().UTC()},
		TimeoutSec: new(30),
	}
	cfg.AddItem("Mechanical Keyboard")

	raw, err := json.Marshal(cfg)
	if err != nil {
		panic(err)
	}
	fmt.Println(cfg.AgeSummary(), cfg.ItemsCount(), string(raw))
}
`,
      practice: "Update `OrderConfig` so `AddItem` ignores empty names and add an optional `MaxRetries *int` populated via `new(3)`. Try passing `OrderConfig` by value (`func addCopy(c OrderConfig)`) and verify the caller's slice count does not see changes unless `*OrderConfig` is used.",
      teach: "Explain when to choose a value receiver vs a pointer receiver on a Go struct, and contrast Go struct embedding against C# or Java class inheritance.",
      analogy: "Value passing hands someone a photocopy of a contract; pointer passing hands them the folder's locker key (`*T`) so edits change the shared original.",
      pitfalls: [
        "Mixing value and pointer receivers on one type. A value-receiver method can copy a `sync.Mutex`, and pointer methods don't match an interface satisfied only by `*T`.",
        "Using `omitempty` on a `time.Time` or struct field instead of Go 1.24's `omitzero`, because `omitempty` doesn't treat zero structs as empty.",
        "Calling `new(Type)` thinking Go requires constructors everywhere. Struct literals (`&Type{Field: val}`) or zero values are standard."
      ],
      quiz: [
        { id: 'method-use-pointer-receiver', q: "When MUST a method use a pointer receiver `*T` instead of value `T`?", a: ["Only for exported methods", "When the method mutates the receiver, avoids large copies, or the struct contains non-copyable state like `sync.Mutex`", "Only inside `package main`", "Whenever the struct implements JSON tags"], c: 1, why: "Value receivers operate on a copy, so mutations stay local and copying locks causes race bugs." },
        { id: 'timeout-new-30-go', q: "What does `Timeout: new(30)` do in Go 1.26+?", a: ["Allocates a slice of 30 ints", "Returns a `*int` pointing to the value `30` without needing a helper function", "Syntax error", "Allocates 30 empty bytes"], c: 1, why: "Go 1.26 extended built-in `new(expr)` to accept initial value expressions directly." },
        { id: 'prefer-named-field-store', q: "Why prefer a named field (`store *Repo`) over embedding (`*Repo`) for internal dependencies?", a: ["Named fields compile faster", "Embedding promotes every public method of `Repo` onto your outer type's API automatically", "Named fields allow nil pointers while embedding doesn't", "Go forbids embedding pointers"], c: 1, why: "Embed only when you deliberately want method promotion (`is-a` API extension); use named fields for collaborators." }
      ]
    },

    // ---------------- Intermediate ----------------
    {
      id: 'interfaces', title: 'Small interfaces and the nil trap', level: 1, mins: 35, viz: 'goiface',
      terms: [
        ['Implicit satisfaction', "A struct implements an interface by defining matching methods, with no `implements` keyword."],
        ['Consumer-defined interface', 'Define small 1–3 method interfaces in the caller package (`Notifier`) rather than mirroring every method next to the implementation.'],
        ['Interface `(type, value)` box', 'An interface variable holds two words: a dynamic type and a data pointer. It equals `nil` only when both words are `nil`.']
      ],
      why: "In C# and Java, a class lists the interfaces it implements. In Go, any type with matching methods satisfies an interface automatically, so callers usually define small 1–3 method interfaces (like `io.Reader`) right where they use them. Knowing that every interface holds two words, a type and a value pointer, explains why returning a typed nil pointer makes `err != nil` evaluate to `true`.",
      points: [
        "Keep interfaces small (1–3 methods) and define them where you call them: a handler defines `type ProductReader interface { Get(ctx context.Context, id string) (Product, error) }`, so concrete repositories never import the web layer.",
        "Accept interfaces and return structs: `func NewService(store ProductStore) *Service` stays easy to swap in tests while callers still see full concrete methods on `*Service`.",
        "Add a zero-cost compile-time check right next to implementations: `var _ Writer = (*MemoryLog)(nil)`.",
        "Watch out for the typed-nil trap: returning `var err *FieldError = nil` from a function returning `error` stores `(type=*FieldError, value=nil)`. Because the type word isn't `nil`, `err != nil` evaluates to `true`, so always return untyped `nil` directly.",
        "Always check type assertions with comma-ok (`w, ok := x.(Flusher)`) or a type switch. A bare `x.(T)` panics if the value has a different runtime type."
      ],
      predict: {
        prompt: "Look at `validateBroken(\"ok\")` below returning `error` when validation passes. What does `err1 != nil` print?",
        options: [
          "`false` because `fe` was never assigned and equals `nil`",
          "`true` because returning `*FieldError(nil)` sets the interface's type word",
          "Compile error: cannot return `*FieldError` as `error`",
          "Runtime panic on return"
        ],
        answer: 1,
        explain: "`fe` starts as a typed `nil` pointer (`*FieldError(nil)`). When `validateBroken` returns `fe` as `error`, Go sets the interface's dynamic type word to `*FieldError`, so `err1 != nil` is `true` even though its data pointer is `nil`. Returning untyped `nil` fixes it."
      },
      code: `
package main

import "fmt"

type LogWriter interface {
	WriteEntry(msg string)
}

type MemoryLog struct{ entries []string }

// Compile-time check guarantees *MemoryLog satisfies LogWriter
var _ LogWriter = (*MemoryLog)(nil)

func (m *MemoryLog) WriteEntry(msg string) {
	m.entries = append(m.entries, msg)
}

type FieldError struct{ Msg string }

func (f *FieldError) Error() string { return f.Msg }

func validateBroken(name string) error {
	var fe *FieldError // typed nil pointer
	if name == "" {
		fe = &FieldError{Msg: "empty name"}
		return fe
	}
	return fe // BUG when name != "": returns (*FieldError, nil) -> err != nil!
}

func validateFixed(name string) error {
	if name == "" {
		return &FieldError{Msg: "empty name"}
	}
	return nil // returns (nil, nil) -> err == nil cleanly
}

func main() {
	var log LogWriter = &MemoryLog{}
	log.WriteEntry("started")

	err1 := validateBroken("ok")
	err2 := validateFixed("ok")
	fmt.Println("broken err != nil:", err1 != nil, "| fixed err != nil:", err2 != nil)
}
`,
      practice: "Step through `VIZ.goiface`, then inspect `err1` in `main.go` with `%T` and `%v` (`fmt.Printf(\"%T %v\\n\", err1, err1)`). Notice how `err1` prints `<nil>` while its dynamic type is still `*main.FieldError`, and confirm returning `nil` directly clears both.",
      teach: "Explain why Go defines small interfaces in the consuming package instead of the implementing package, and demonstrate on paper what the two words inside an interface box hold when a typed-nil slips in.",
      analogy: "Think of an interface as a clear folder with a label on the tab (`*FieldError`) and a sheet inside (`nil`). Go considers the folder empty only when both the tab label and the sheet are missing. A folder with a label on its tab still counts as non-nil even when there's no sheet inside.",
      pitfalls: [
        "Creating huge Java-style `IUserService` interfaces before a second implementation or test seam even exists ('Don't design with interfaces, discover them').",
        "Returning typed nil pointers (`var err *MyErr`) or typed nil `*bytes.Buffer` wrapped as `io.Reader` / `error`.",
        "Using unchecked `v := x.(string)` instead of `v, ok := x.(string)`."
      ],
      quiz: [
        { id: 'go-interface-normally-defined', q: "Where should a Go interface normally be defined?", a: ["In a central `interfaces/` package", "In the implementing package right next to the struct", "In the consuming package, containing only the 1–3 methods that consumer calls", "Inside `go.mod`"], c: 2, why: "Consumer-side minimal interfaces decouple packages and avoid forced imports." },
        { id: 'var-io-writer-auditlog', q: "What does `var _ io.Writer = (*AuditLog)(nil)` do at run time?", a: ["Allocates a nil `AuditLog` on every import", "Zero runtime cost; it verifies at compile time that `*AuditLog` satisfies `io.Writer`", "Calls `Write` with `nil`", "Panics if `Write` isn't called"], c: 1, why: "Blank-identifier interface assertions are compile-time contracts with zero runtime work." },
        { id: 'interface-variable-equal-nil', q: "When is an interface variable equal to `nil`?", a: ["Whenever its underlying pointer is `nil`", "Only when BOTH its dynamic type descriptor and concrete value pointer are `nil`", "Whenever the struct has zero-valued fields", "Interfaces can never equal `nil`"], c: 1, why: "Typed-nil interface values hold a non-nil type word, causing `x != nil`." }
      ]
    },
    {
      id: 'errors', title: 'Errors as values: wrapping and errors.AsType', level: 1, mins: 30,
      terms: [
        ['Sentinel error (`ErrNotFound`)', 'An exported package-level error (`errors.New(...)`) representing an expected condition that callers match with `errors.Is`.'],
        ['Error wrapping (`%w`)', '`fmt.Errorf("loading order %s: %w", id, err)` adds caller context while keeping the original error inspectable further up the stack.'],
        ['`errors.AsType[T]` (Go 1.26+)', 'A generic, type-safe replacement for `var target T; errors.As(err, &target)` that pulls matching error structs without pre-declaring a variable.']
      ],
      predict: {
        prompt: 'If `reserveItem` wrapped with `%v` instead of `%w` (`fmt.Errorf("reserving item %q: %v", id, err)`), what would `errors.Is(err, ErrNotFound)` return for `"missing"`?',
        options: ['`true`: the message still contains the text of `ErrNotFound`', '`false`: `%v` only formats text, so the link to `ErrNotFound` is lost', 'It panics, because `errors.Is` requires a wrapped error'],
        answer: 1,
        explain: 'With `%w`, `fmt.Errorf` returns an error whose `Unwrap()` points at the original, and `errors.Is` walks that chain comparing values. `%v` just copies the message into a new string: it prints identically, but `errors.Is` and `errors.AsType` can no longer find `ErrNotFound`. Never compare error strings; wrap with `%w` whenever callers need to branch on the cause.'
      },
      why: "Go treats errors as ordinary return values instead of hidden exceptions unwinding the stack. Checking `err != nil` with early returns and wrapping context with `%w` shows you where and why an operation failed.",
      points: [
        "Check every error and return early (`if err != nil { return ..., fmt.Errorf(...: %w, err) }`). Don't discard errors with `_`, and avoid `else` after a return so normal code stays at the first indentation level.",
        "Follow the single-handling rule: log an error at the top boundary (such as an HTTP handler) OR wrap and return it. Doing both writes duplicate alerts for one failure at every layer.",
        "Start error strings with a lowercase letter and no trailing period (`\"opening config: permission denied\"`), because outer callers prepend context separated by colons.",
        "Use `errors.Is(err, ErrNotFound)` to match sentinels across wrapped chains, `errors.AsType[*ValidationError](err)` (Go 1.26+) to extract structured error types, and `errors.Join` when returning multiple errors at once.",
        "Wrap with `%w` internally when callers need to inspect the cause, and `%v` at external boundaries when hiding internal error types. Save `panic` for programmer bugs, not user input, missing rows, or network timeouts."
      ],
      code: `
package main

import (
	"errors"
	"fmt"
)

var ErrNotFound = errors.New("product not found")

type QuotaError struct {
	Limit int
	Got   int
}

func (q *QuotaError) Error() string {
	return fmt.Sprintf("quota exceeded: got %d, limit %d", q.Got, q.Limit)
}

func findStock(id string) error {
	if id == "missing" {
		return ErrNotFound
	}
	if id == "burst" {
		return &QuotaError{Limit: 10, Got: 14}
	}
	return nil
}

func reserveItem(id string) error {
	if err := findStock(id); err != nil {
		return fmt.Errorf("reserving item %q: %w", id, err)
	}
	return nil
}

func main() {
	if err := reserveItem("missing"); errors.Is(err, ErrNotFound) {
		fmt.Println("404:", err)
	}
	// Go 1.26+: type-safe errors.AsType[T] avoids declaring a var beforehand
	if err := reserveItem("burst"); err != nil {
		if qErr, ok := errors.AsType[*QuotaError](err); ok {
			fmt.Printf("429 limit=%d got=%d (%v)\\n", qErr.Limit, qErr.Got, err)
		}
	}
	combined := errors.Join(errors.New("name required"), errors.New("price must be positive"))
	fmt.Println("joined:", combined)
}
`,
      practice: "Write a multi-field validator using `errors.Join` that collects two failures (`name` empty and `price <= 0`). Wrap that joined error in a caller using `%w`, then confirm `errors.Is` and `errors.AsType` still match both errors inside the joined tree.",
      teach: "Explain why `err == sql.ErrNoRows` fails on wrapped errors while `errors.Is(err, sql.ErrNoRows)` succeeds, and explain the 'single handling rule' (why logging and returning the same error creates noisy logs).",
      analogy: "Wrapping errors with `%w` is like attaching sticky notes to a receipt as it passes from warehouse to shipping to billing. You still hold the original receipt underneath (`errors.Is`), plus the full chain of where it failed.",
      pitfalls: [
        "Comparing wrapped errors with `==` instead of `errors.Is(err, ErrFoo)`.",
        "Formatting with `%v` instead of `%w` when callers still need to match the underlying error.",
        "Logging an error inside a helper AND returning it so the caller logs it a second and third time.",
        "Capitalizing error messages (`\"Failed to save.\"`). When wrapped, `\"creating order: Failed to save.\"` reads inconsistently."
      ],
      quiz: [
        { id: 'prefer-errors-err-errnotfound', q: "Why prefer `errors.Is(err, ErrNotFound)` over `err == ErrNotFound`?", a: ["`==` fails to compile on errors", "`errors.Is` unwraps chains built with `%w` and `errors.Join`, whereas `==` checks only the outermost error", "`errors.Is` formats stack traces automatically", "`==` is deprecated in Go 1.27"], c: 1, why: "`errors.Is` walks `Unwrap()` trees so wrapped sentinel errors still match." },
        { id: 'according-go-single-handling', q: "According to Go's single handling rule, what should a repository function do when a DB query fails?", a: ["Log it at `slog.Error` and return `nil`", "Log it AND return the wrapped error", "Wrap it with context (`fmt.Errorf(\"...: %w\", err)`) and return it so the top boundary logs once", "Call `panic(err)`"], c: 2, why: "Return wrapped errors upward; let the boundary (HTTP handler / CLI `main`) decide the status code and log once." },
        { id: 'errors-astype-quotaerror-err', q: "What does `errors.AsType[*QuotaError](err)` (Go 1.26+) improve over `errors.As(err, &target)`?", a: ["Runs asynchronously", "Eliminates manual `var target *QuotaError` setup and checks target type statically at compile time", "Ignores wrapped errors", "Only checks sentinel values"], c: 1, why: "`errors.AsType[T]` uses generics to return `(T, bool)` with no pointer variable boilerplate." }
      ]
    },
    {
      id: 'http', title: 'Web APIs with net/http and json/v2', level: 1, mins: 40,
      splits: [['1 · Handlers & json/v2', '// ---------- Handlers'], ['2 · Security & middleware', '// ---------- Middleware'], ['3 · Server & timeouts', '// ---------- Server']],
      terms: [
        ['`ServeMux` patterns (Go 1.22+)', 'Supports HTTP methods and path variables directly in stdlib (`mux.HandleFunc("GET /products/{id}", h)` and `r.PathValue("id")`).'],
        ['`encoding/json/v2` (Go 1.27+)', 'Default JSON engine that rejects duplicate keys or invalid UTF-8, streams from `r.Body` via `json.UnmarshalRead`, and rejects unknown fields with `json.RejectUnknownMembers`.'],
        ['`os.Root` & `http.Server` timeouts', '`os.Root` locks file reads inside one directory (Go 1.24+), while read and write timeouts keep slow clients from tying up server sockets.']
      ],
      why: "Go's standard library gives you everything needed for a JSON HTTP API without reaching for a framework. Go 1.22 added method and path routing to `http.ServeMux`, Go 1.25 added `http.CrossOriginProtection`, and Go 1.27 ships `encoding/json/v2` with strict parsing enabled by default.",
      points: [
        "Register methods and path variables in stdlib: `mux.HandleFunc(\"GET /products/{id}\", ...)` reads `{id}` with `r.PathValue(\"id\")` and returns `405 Method Not Allowed` for wrong verbs.",
        "With `encoding/json/v2` (Go 1.27 default), duplicate keys and invalid UTF-8 fail automatically. Cap request size with `http.MaxBytesReader` first, then decode via `json.UnmarshalRead(r.Body, &req, json.RejectUnknownMembers(true))`.",
        "Wrap routes with `http.NewCrossOriginProtection().Handler(...)` (Go 1.25+) to defend against cross-origin browser writes, and open user-supplied asset paths with `os.OpenRoot(dir)` (Go 1.24+) so `../../etc/passwd` cannot escape `dir`.",
        "Middleware is a plain function wrapping `http.Handler` (`func(http.Handler) http.Handler`), so request order is obvious to read and debug.",
        "Always set `http.Server` timeouts (`ReadHeaderTimeout`, `ReadTimeout`, `WriteTimeout`, `IdleTimeout`), because bare `http.ListenAndServe` leaves all timeouts disabled."
      ],
      code: `
package main

import (
	"encoding/json/v2"
	"errors"
	"log/slog"
	"net/http"
	"os"
	"strconv"
	"sync"
	"time"
)

// ---------- Handlers & json/v2 ----------
type Product struct {
	ID    int    \`json:"id"\`
	Name  string \`json:"name"\`
	Price int    \`json:"price"\`
}

type ShopAPI struct {
	mu       sync.RWMutex
	products []Product
}

func (api *ShopAPI) getProduct(w http.ResponseWriter, r *http.Request) {
	id, err := strconv.Atoi(r.PathValue("id"))
	if err != nil {
		http.Error(w, "invalid product id", http.StatusBadRequest)
		return
	}
	api.mu.RLock()
	defer api.mu.RUnlock()
	for _, p := range api.products {
		if p.ID == id {
			w.Header().Set("Content-Type", "application/json")
			_ = json.MarshalWrite(w, p)
			return
		}
	}
	http.Error(w, "product not found", http.StatusNotFound)
}

func (api *ShopAPI) createProduct(w http.ResponseWriter, r *http.Request) {
	r.Body = http.MaxBytesReader(w, r.Body, 1<<20) // cap body at 1 MiB
	var in struct {
		Name  string \`json:"name"\`
		Price int    \`json:"price"\`
	}
	if err := json.UnmarshalRead(r.Body, &in, json.RejectUnknownMembers(true)); err != nil {
		http.Error(w, "invalid json payload", http.StatusBadRequest)
		return
	}
	if in.Name == "" || in.Price <= 0 {
		http.Error(w, "name and positive price required", http.StatusUnprocessableEntity)
		return
	}
	api.mu.Lock()
	p := Product{ID: len(api.products) + 1, Name: in.Name, Price: in.Price}
	api.products = append(api.products, p)
	api.mu.Unlock()

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	_ = json.MarshalWrite(w, p)
}

// ---------- Middleware & safety ----------
func logRequests(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		start := time.Now()
		next.ServeHTTP(w, r)
		slog.Info("http request", "method", r.Method, "path", r.URL.Path, "took", time.Since(start))
	})
}

func newHandler(api *ShopAPI) http.Handler {
	mux := http.NewServeMux()
	mux.HandleFunc("GET /products/{id}", api.getProduct)
	mux.HandleFunc("POST /products", api.createProduct)
	csrf := http.NewCrossOriginProtection()
	return logRequests(csrf.Handler(mux))
}

// ---------- Server & timeouts ----------
func main() {
	api := &ShopAPI{products: []Product{{ID: 1, Name: "Keyboard", Price: 800000}}}
	srv := &http.Server{
		Addr:              ":8080",
		Handler:           newHandler(api),
		ReadHeaderTimeout: 5 * time.Second,
		ReadTimeout:       10 * time.Second,
		WriteTimeout:      15 * time.Second,
		IdleTimeout:       60 * time.Second,
	}
	slog.Info("listening", "addr", srv.Addr)
	if err := srv.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
		slog.Error("server error", "err", err)
		os.Exit(1)
	}
}
`,
      practice: "Create a module with this code, run it, and test `GET /products/1`, `DELETE /products/1` (which returns `405`), and `POST /products` sending an unknown field `{\"name\":\"Lamp\",\"price\":200,\"admin\":true}` (rejected by `json.RejectUnknownMembers(true)`). Add a file-download endpoint guarded by `os.OpenRoot(\"./public\")`.",
      teach: "Walk through how `newHandler` wraps `http.ServeMux` inside middleware without reflection or DI containers, and explain why `ReadHeaderTimeout` and `MaxBytesReader` matter on public servers.",
      analogy: "Go middleware wraps `http.Handler` in nested layers. Requests pass through logging and CSRF checks, hit the matched route in `ServeMux`, and walk back out along the same chain.",
      pitfalls: [
        "Calling `http.ListenAndServe(\":8080\", mux)` in production. It uses a default `http.Server` with zero read or write timeouts.",
        "Checking user file paths with `filepath.Clean` and `strings.HasPrefix` instead of `os.OpenRoot`. String prefix checks are easy to bypass through symlinks or OS path quirks.",
        "Skipping `http.MaxBytesReader` before decoding JSON, which lets a caller upload gigabytes into server memory."
      ],
      quiz: [
        { id: 'go-22-happens-someone', q: "In Go 1.22+, what happens if someone sends `POST /products/1` when only `mux.HandleFunc(\"GET /products/{id}\", h)` is registered?", a: ["It runs `h` anyway", "404 Not Found", "405 Method Not Allowed automatically with an `Allow` header", "Compile panic"], c: 2, why: "Go 1.22+ `ServeMux` matches methods and returns 405 automatically when path matches but method differs." },
        { id: 'wrap-body-http-maxbytesreader', q: "Why wrap `r.Body` with `http.MaxBytesReader` before `json.UnmarshalRead`?", a: ["To compress JSON responses", "To cap incoming request bytes so oversized payloads cannot exhaust server memory", "To enable keep-alive", "It is required by `json/v2` to parse UTF-8"], c: 1, why: "`MaxBytesReader` enforces an upper bound on request body size at the stream level." },
        { id: 'os-openroot-dir-go', q: "How does `os.OpenRoot(dir)` (Go 1.24+) protect file-serving endpoints?", a: ["It encrypts files on disk", "It restricts file access and symlink resolution strictly beneath `dir`, rejecting `../` escapes", "It converts files to read-only", "It caches static assets in memory"], c: 1, why: "`os.Root` provides OS-level directory confinement against path-traversal attacks." }
      ]
    },
    {
      id: 'testing', title: 'Table-driven tests, httptest, and synctest', level: 1, mins: 40,
      splits: [['1 · shop.go', '// ---------- shop.go'], ['2 · shop_test.go', '// ---------- shop_test.go']],
      terms: [
        ['Table-driven test (`t.Run`)', 'Putting inputs, expected outputs, and case `name` values into a slice of structs so each row runs as an independent subtest.'],
        ['`httptest.NewTestServer` (Go 1.27+)', 'Starts an in-memory HTTP test server bound to `t` with no TCP sockets, working directly with `testing/synctest`.'],
        ['`testing/synctest` (Go 1.25–1.27)', 'Runs concurrent goroutines inside an isolated fake-clock bubble (`synctest.Test`, `synctest.Wait`, `synctest.Sleep`) so timer tests finish quickly without wall-clock sleeps.']
      ],
      why: "Go builds testing right into the `go` command (`go test ./...`). Features added in Go 1.24 through 1.27 (`t.Context()`, `b.Loop()`, `httptest.NewTestServer`, and `testing/synctest`) cut timer flakes and setup boilerplate from HTTP, async, and benchmark tests.",
      points: [
        "Name test files `<file>_test.go` after the source file they test, and pass named struct rows to `t.Run(tc.name, ...)`.",
        "Mark helper functions with `t.Helper()` so failure output points to the caller's test row instead of inside the helper.",
        "Use `t.Context()` (Go 1.24+) instead of `context.Background()` so test contexts cancel at teardown, and add `t.Parallel()` on tests that don't share mutable state.",
        "Test HTTP handlers without real ports: use `httptest.NewRecorder()` for single handlers, or `httptest.NewTestServer(t, handler)` (Go 1.27+) when exercising an `http.Client` against a router.",
        "Test background timers deterministically with `testing/synctest.Test` and `synctest.Sleep` (Go 1.25–1.27). Run `go test -race ./...` when CGO and `gcc` are present."
      ],
      code: `
// ---------- shop.go ----------
package main

import (
	"context"
	"encoding/json/v2"
	"net/http"
	"sync/atomic"
	"time"
)

func ApplyDiscount(priceCents int, vip bool) int {
	if priceCents <= 0 {
		return 0
	}
	if vip {
		return priceCents * 80 / 100
	}
	return priceCents
}

func NewPriceMux() http.Handler {
	mux := http.NewServeMux()
	mux.HandleFunc("GET /discount/{price}", func(w http.ResponseWriter, r *http.Request) {
		p := 1000
		if r.PathValue("price") == "200" {
			p = 200
		}
		_ = json.MarshalWrite(w, map[string]int{"price": ApplyDiscount(p, true)})
	})
	return mux
}

func DelayedBump(ctx context.Context, counter *atomic.Int64, delay time.Duration) {
	select {
	case <-time.After(delay):
		counter.Add(1)
	case <-ctx.Done():
	}
}

// ---------- shop_test.go ----------
package main

import (
	"encoding/json/v2"
	"net/http"
	"net/http/httptest"
	"sync/atomic"
	"testing"
	"testing/synctest"
	"time"
)

func TestApplyDiscount(t *testing.T) {
	t.Parallel()
	cases := []struct {
		name  string
		price int
		vip   bool
		want  int
	}{
		{name: "standard", price: 500, vip: false, want: 500},
		{name: "vip 20% off", price: 500, vip: true, want: 400},
		{name: "negative guards to zero", price: -10, vip: true, want: 0},
	}
	for _, tc := range cases {
		t.Run(tc.name, func(t *testing.T) {
			t.Parallel()
			if got := ApplyDiscount(tc.price, tc.vip); got != tc.want {
				t.Fatalf("ApplyDiscount(%d, %v) = %d; want %d", tc.price, tc.vip, got, tc.want)
			}
		})
	}
}

func TestPriceMuxInMemory(t *testing.T) {
	// Go 1.27+: in-memory test server tied to testing.TB (no real socket, auto-closed via t.Cleanup)
	srv := httptest.NewTestServer(t, NewPriceMux())
	client := srv.Client() // sets srv.URL and binds the in-memory transport

	req, err := http.NewRequestWithContext(t.Context(), http.MethodGet, srv.URL+"/discount/200", nil)
	if err != nil {
		t.Fatal(err)
	}
	resp, err := client.Do(req)
	if err != nil {
		t.Fatal(err)
	}
	defer resp.Body.Close()

	var body map[string]int
	if err := json.UnmarshalRead(resp.Body, &body); err != nil || body["price"] != 160 {
		t.Fatalf("unexpected response: err=%v body=%v", err, body)
	}
}

func TestDelayedBumpFakeClock(t *testing.T) {
	// Go 1.25–1.27: fake time bubble resolves a 5-second sleep instantaneously
	synctest.Test(t, func(t *testing.T) {
		var count atomic.Int64
		go DelayedBump(t.Context(), &count, 5*time.Second)
		synctest.Wait()
		if count.Load() != 0 {
			t.Fatal("bumped too early")
		}
		synctest.Sleep(5 * time.Second)
		synctest.Wait()
		if count.Load() != 1 {
			t.Fatalf("count = %d; want 1", count.Load())
		}
	})
}

func BenchmarkApplyDiscount(b *testing.B) {
	for b.Loop() { // Go 1.24+: prevents dead-code elimination automatically
		ApplyDiscount(12500, true)
	}
}
`,
      practice: "Save both sections as `shop.go` and `shop_test.go`, then run `go test -v -bench=. ./...`. Notice `TestDelayedBumpFakeClock` finishes in milliseconds despite sleeping 5 seconds! Add a second case to `TestPriceMuxInMemory` using table-driven `t.Run`.",
      teach: "Explain why `time.Sleep(50 * time.Millisecond)` inside unit tests creates CI flakiness, and how `testing/synctest` solves both speed and determinism without changing production code.",
      analogy: "Normal concurrency tests are like baking in a real oven and hoping your timer aligns with background kitchen noise. `testing/synctest` puts the goroutines inside a miniature soundproof bubble where you control the clock hand yourself.",
      pitfalls: [
        "Sleeping with `time.Sleep` to wait for a goroutine instead of synchronizing with `WaitGroup`, a channel, or `synctest`.",
        "Writing heavy tests for private helper functions while leaving public HTTP handlers or repository contracts untested.",
        "Naming test files after one function (`apply_discount_test.go`) instead of matching `shop.go` with `shop_test.go`."
      ],
      quiz: [
        { id: 'mark-helper-functions-inside', q: "Why mark helper functions inside tests with `t.Helper()`?", a: ["It speeds up execution", "Failure line numbers report the caller's test line instead of the helper's internal line", "It unlocks parallel subtests", "It auto-closes HTTP responses"], c: 1, why: "`t.Helper()` makes stack traces skip the utility wrapper and point straight to the failing case." },
        { id: 'key-benefit-testing-synctest', q: "What is the key benefit of `testing/synctest` + `synctest.Sleep`?", a: ["Runs tests across multiple machines", "Advances a fake deterministic clock inside an isolated bubble without sleeping in wall-clock time", "Replaces `go test -race`", "Mocks SQL servers"], c: 1, why: "`synctest` advances fake time immediately once bubble goroutines are durably blocked." },
        { id: 'prefer-loop-go-24', q: "Why prefer `for b.Loop()` (Go 1.24+) over `for i := 0; i < b.N; i++` in new benchmarks?", a: ["`b.Loop()` runs multiple threads", "It prevents dead-code optimization of calls inside the loop and excludes setup/teardown automatically", "`b.N` was removed in Go 1.27", "`b.Loop()` skips allocation tracking"], c: 1, why: "`b.Loop()` manages timer boundaries and keeps loop expressions alive." }
      ]
    },
    {
      id: 'generics', title: 'Generics, iterators, and stdlib utilities', level: 1, mins: 35,
      terms: [
        ['Type constraint (`comparable`, `~int`)', 'Restricts what types a generic parameter accepts: `comparable` allows `==` and `!=` (needed for map keys), and `~int` matches any defined type backed by `int`.'],
        ['Generic method (Go 1.27+)', 'Methods on concrete types can declare their own type parameters (`func (b Bucket[T]) Map[U any](...)`) to transform a container into another type `U`.'],
        ['Lazy iterator (`iter.Seq[T]`)', 'A Go 1.23+ yield function that works with `for x := range seq`, producing values one by one without allocating an intermediate slice.']
      ],
      why: "Go shipped without generics for over a decade, then added them in Go 1.18, followed by iterators (`iter.Seq`) in Go 1.23 and generic methods in Go 1.27. Use concrete types first, interfaces for behavior, and generics for reusable containers and collection helpers.",
      points: [
        "Reach for generics on data structures (`Stack[T]`, `Set[T]`), `slices` or `maps` algorithms, and repeated `any` assertions. Stick with a concrete type or interface when the code already reads clearly.",
        "Use `comparable` for map keys or equality (`func Unique[T comparable]`), `cmp.Ordered` (package `cmp`) for `<` and `>`, and `~` (`type Num interface { ~int | ~float64 }`) so defined types like `type Cents int` match.",
        "In Go 1.27+, a method on `Bucket[T]` can declare its own type parameter `[U any]` (`func (b Bucket[T]) Map[U any](fn func(T) U) Bucket[U]`), though interface methods still can't declare method-level type parameters.",
        "Iterators (`iter.Seq[T]`, Go 1.23+) work directly with `for v := range ...`, `slices.Collect`, and `maps.Keys`, letting callers `break` early without allocating an intermediate slice."
      ],
      code: `
package main

import (
	"fmt"
	"iter"
	"slices"
)

type Money interface{ ~int | ~int64 }

func Sum[T Money](vals []T) T {
	var total T
	for _, v := range vals {
		total += v
	}
	return total
}

type Bucket[T any] struct{ Items []T }

// Go 1.27+: methods can declare their own type parameters [U any]
func (b Bucket[T]) Map[U any](fn func(T) U) Bucket[U] {
	out := make([]U, 0, len(b.Items))
	for _, it := range b.Items {
		out = append(out, fn(it))
	}
	return Bucket[U]{Items: out}
}

// Lazy Go 1.23+ iterator: yields matching items one by one
func Evens(limit int) iter.Seq[int] {
	return func(yield func(int) bool) {
		for n := 0; n <= limit; n += 2 {
			if !yield(n) {
				return // caller used break or early return
			}
		}
	}
}

func main() {
	type Cents int64
	fmt.Println("sum:", Sum([]Cents{150, 250, 100}))

	labels := Bucket[int]{Items: []int{1, 2, 3}}.Map(func(n int) string {
		return fmt.Sprintf("item-%d", n)
	})
	evens := slices.Collect(Evens(8))
	fmt.Println("mapped:", labels.Items, "evens:", evens)
}
`,
      practice: "Add a generic method `(b Bucket[T]) Filter(keep func(T) bool) iter.Seq[T]` using `iter.Seq` so `for x := range b.Filter(...)` streams lazily and stops early if the caller runs `break`.",
      teach: "Explain the difference between `int` and `~int` in a Go constraint, when to use an interface (`io.Reader`) instead of generics (`[T any]`), and why `yield` returning `false` matters in `iter.Seq`.",
      analogy: "Interfaces describe what a value can do, like an electrical outlet accepting any matching plug. Generics preserve the container's element type, like a labeled crate (`[T]`) that remembers whether you packed shoes or books when you unpack it.",
      pitfalls: [
        "Adding `[T any]` parameters when a plain `[]Product` function is easier to read.",
        "Ignoring `if !yield(v) { return }` inside an `iter.Seq` generator. Calling `yield` again after the caller executes `break` panics at runtime.",
        "Trying to put a generic method onto an interface definition (interface methods remain non-generic in Go 1.27)."
      ],
      quiz: [
        { id: 'int-mean-inside-go', q: "What does `~int` mean inside a Go type constraint?", a: ["Only nullable ints", "`int` plus any custom defined type whose underlying type is `int` (such as `type UserID int`)", "Any unsigned integer", "Approximate integer precision"], c: 1, why: "`~` matches underlying types so type-safe domain aliases work with generic helpers." },
        { id: 'inside-iter-seq-iterator', q: "Inside an `iter.Seq[T]` iterator, what must happen when `yield(v)` returns `false`?", a: ["Call `panic`", "Stop producing values and return immediately, because the caller broke out of the `for range` loop", "Retry sending `v`", "Reset to index 0"], c: 1, why: "`yield` returning `false` signals `break` or early `return` from the consumer loop." },
        { id: 'go-27-generic-methods', q: "What can Go 1.27+ generic methods do, and what constraint remains?", a: ["Methods can declare type parameters (`func (s Set[T]) Map[U any](...)`), though interface methods cannot", "Interfaces can now declare generic methods too", "Generic functions are deprecated", "Methods can change the receiver type dynamically"], c: 0, why: "Go 1.27 allowed generic methods on concrete types while keeping interface method signatures non-generic." }
      ]
    },

    // ---------------- Advanced ----------------
    {
      id: 'goroutines', title: 'Goroutines, channels, and select', level: 2, mins: 40, viz: 'goroutine',
      terms: [
        ['Goroutine (`go fn()`)', 'A lightweight task (~2 KB initial stack) scheduled across OS threads by the Go runtime so thousands can run concurrently.'],
        ['Channel direction (`chan<-` / `<-chan`)', 'Constraining parameters to send-only or receive-only catches accidental reads or closes at compile time.'],
        ['`sync.WaitGroup.Go` (Go 1.25+)', 'Starts `f()` in a goroutine and handles `Add(1)` and `defer Done()` automatically for simple wait tasks.']
      ],
      why: "Go treats concurrency as a built-in language feature. Instead of locking shared memory manually everywhere, goroutines pass typed values through channels and wait on multiple events or cancellations using `select`.",
      points: [
        "Decide how every goroutine will exit before you type `go`. Fire-and-forget goroutines without cancellation or a `WaitGroup` stay allocated until the process exits.",
        "Share data by sending value copies over typed channels instead of sharing pointers to mutable structs. Specify channel direction (`chan<- T` send-only, `<-chan T` receive-only) in function parameters.",
        "Only the sender should call `close(ch)` when finished, letting receivers exit `v, ok := <-ch` or `for v := range ch`. Sending on a closed channel panics, while reading a closed channel returns zero values.",
        "Start with unbuffered channels (`make(chan T)`) so sender and receiver synchronize directly. Add bounded buffers (`make(chan T, n)`) only to smooth measured bursts.",
        "`select` waits on several channels at once. Always pair slow channel operations with `case <-ctx.Done():` so callers don't hang."
      ],
      predict: {
        prompt: "In `fetchWithTimeout` below, `slowJob` takes `200 ms`, while the context timeout is `30 ms`. What happens at runtime?",
        options: [
          "Returns `timeout`, and `slowJob` can drop its late result into the `cap=1` buffer and exit without hanging",
          "Panics on `close(ch)`",
          "`fetchWithTimeout` waits all 200 ms before checking `ctx.Done()`",
          "Deadlocks immediately"
        ],
        answer: 0,
        explain: "`select` runs whichever branch unblocks first (`<-ctx.Done()` at 30 ms). Making `ch := make(chan string, 1)` buffered lets `slowJob` deposit its late result and exit instead of staying blocked forever on an unbuffered `ch <-`."
      },
      code: `
package main

import (
	"context"
	"fmt"
	"sync"
	"time"
)

func produce(ctx context.Context, out chan<- string, jobs []string) {
	defer close(out) // sender owns and closes the channel
	for _, j := range jobs {
		select {
		case out <- "done:" + j:
		case <-ctx.Done():
			return
		}
	}
}

func fetchWithTimeout(parent context.Context) string {
	ctx, cancel := context.WithTimeout(parent, 30*time.Millisecond)
	defer cancel()

	// Buffer size 1 guarantees the worker can exit even after timeout!
	ch := make(chan string, 1)
	go func() {
		time.Sleep(200 * time.Millisecond)
		ch <- "late-result"
	}()

	select {
	case v := <-ch:
		return v
	case <-ctx.Done():
		return "timeout"
	}
}

func main() {
	ctx := context.Background()
	stream := make(chan string)

	var wg sync.WaitGroup
	wg.Go(func() { produce(ctx, stream, []string{"mail", "sms"}) }) // Go 1.25+

	for msg := range stream {
		fmt.Println(msg)
	}
	wg.Wait()
	fmt.Println("race check:", fetchWithTimeout(ctx))
}
`,
      practice: "Open `VIZ.goroutine` and trace unbuffered vs buffered vs `select` modes. Then modify `fetchWithTimeout` temporarily to `make(chan string)` (unbuffered!) and observe why the background goroutine would remain stuck in memory forever after timeout.",
      teach: "Explain why 'only the sender closes a channel', why `close(ch)` wakes up all blocked readers, and why buffer size 1 prevents a timeout leak in `select`.",
      analogy: "An unbuffered channel is like handing a baton in a relay race: the first runner can't leave until the next runner grabs it. A buffered channel is a counter with `N` trays where you can drop `N` orders without waiting until the counter fills.",
      pitfalls: [
        "Closing a channel from the receiver side or closing it twice, which immediately panics (`send on closed channel` or `close of closed channel`).",
        "Using an unbuffered result channel inside `select` with a timeout, so a late sender gets stuck forever if `ctx.Done()` wins first.",
        "Calling `time.After(...)` repeatedly inside a long-running `for { select { ... } }` loop. Each iteration allocates a new timer until it fires, whereas `time.NewTimer` plus `Reset` reuses one."
      ],
      quiz: [
        { id: 'call-close-ch-go', q: "Who should call `close(ch)` in Go?", a: ["The receiver once it reads one value", "The sender/producer side once it finishes producing", "WaitGroup calls it automatically", "Any goroutine using `recover`"], c: 1, why: "Only the sender knows when no more values will be written; sending after close panics." },
        { id: 'ch-make-chan-result', q: "Why does `ch := make(chan Result, 1)` prevent a leaked goroutine when paired with `select` + `<-ctx.Done()`?", a: ["Buffer 1 closes the channel on timeout", "The worker can deposit its result into the 1 buffer slot and exit even after the caller moved on", "Go skips scheduling unbuffered channels", "It doubles CPU speed"], c: 1, why: "With an unbuffered channel, a worker finishing after timeout would stay blocked forever on `ch <-`." },
        { id: 'wg-go-fn-go', q: "What does `wg.Go(fn)` (Go 1.25+) replace?", a: ["`select` statements", "`wg.Add(1); go func() { defer wg.Done(); fn() }()` for non-panicking fire-and-wait tasks", "`errgroup.WithContext` error handling", "Mutex locking"], c: 1, why: "`sync.WaitGroup.Go` removes manual `Add(1)` and `Done()` boilerplate for basic wait groups." }
      ]
    },
    {
      id: 'context', title: 'context.Context: deadlines, cancellation, and leaks', level: 2, mins: 35, viz: 'gocontext',
      terms: [
        ['`ctx` first-parameter rule', "Accept `ctx context.Context` as the first argument (`func Fetch(ctx context.Context, id string)`), and don't store `ctx` inside a struct field."],
        ['`defer cancel()`', 'Call `defer cancel()` right after every `context.WithTimeout`, `WithCancel`, or `WithDeadline` so timers detach as soon as the function returns.'],
        ['`context.WithoutCancel` (Go 1.21+)', 'Creates a child keeping request values and tracing while ignoring parent cancellation, useful for post-response audit or metrics writes.']
      ],
      predict: {
        prompt: '`reqCtx` has a `20 ms` timeout, `runQuery` needs `100 ms`, and `writeAudit` derives its context from `context.WithoutCancel(parent)`. What does `main` print?',
        options: ['`handler: aborted query: context deadline exceeded`, then the audit line with `req-42`', 'Only the handler line: the audit is skipped because `reqCtx` already expired', '`handler: aborted query: context canceled`, then the audit line with `<nil>`'],
        answer: 0,
        explain: 'After `20 ms` the deadline fires, `ctx.Done()` wins the `select`, and `ctx.Err()` is `context.DeadlineExceeded`, whose message is `context deadline exceeded` (`context.Canceled` comes from calling `cancel()` yourself). `context.WithoutCancel` keeps every value of its parent, such as the request ID, but drops the deadline and cancellation, so the audit gets its own fresh `50 ms` budget and prints `req-42`.'
      },
      why: "Slow clients disconnect and downstream calls stall. `context.Context` links an incoming HTTP request to every worker goroutine and SQL query below it so abandoned work stops instead of hogging threads and connections.",
      points: [
        "Pick the right context source: `r.Context()` in HTTP handlers, `t.Context()` in Go 1.24+ tests, `context.Background()` only at program entry points (`main`), and `context.TODO()` as a placeholder while wiring functions. Never pass `nil`.",
        "Don't snap the tree mid-request: calling `context.Background()` inside a service method detaches database queries (`db.QueryContext`) from client disconnects and handler timeouts.",
        "When post-response work like audit logging must finish after the response returns, wrap `r.Context()` with `context.WithoutCancel(ctx)` and a short `WithTimeout` so correlation values stay intact.",
        "Keep only request-scoped metadata in `context.WithValue`, using unexported key types (`type ctxKey struct{}`) so packages never collide on string names. Pass actual dependencies as typed function parameters."
      ],
      code: `
package main

import (
	"context"
	"fmt"
	"time"
)

type ctxKey string

const requestIDKey ctxKey = "requestID" // unexported type prevents cross-package collisions

func writeAudit(parent context.Context) {
	// Detaches cancellation while preserving requestID + adds a fresh cap
	auditCtx, cancel := context.WithTimeout(context.WithoutCancel(parent), 50*time.Millisecond)
	defer cancel()
	fmt.Println("audit log reqID=", auditCtx.Value(requestIDKey))
}

func runQuery(ctx context.Context) error {
	select {
	case <-time.After(100 * time.Millisecond):
		return nil
	case <-ctx.Done():
		return fmt.Errorf("aborted query: %w", ctx.Err()) // context.Canceled or DeadlineExceeded
	}
}

func main() {
	root := context.WithValue(context.Background(), requestIDKey, "req-42")
	reqCtx, cancel := context.WithTimeout(root, 20*time.Millisecond)
	defer cancel() // always free timers even if query returned early

	if err := runQuery(reqCtx); err != nil {
		fmt.Println("handler:", err)
	}
	writeAudit(reqCtx)
}
`,
      practice: "Step through `VIZ.gocontext` contrasting propagated vs detached `context.Background()`, then experiment with `context.WithCancelCause` + `context.Cause(ctx)` in `main.go` to attach a custom cancellation reason error.",
      teach: "Explain why storing `ctx` on a `Service` struct breaks concurrent HTTP requests, and why an audit log triggered right as an HTTP handler returns uses `context.WithoutCancel` instead of `context.Background()`.",
      analogy: "Think of `context.Context` as an emergency shut-off cord wired from the front door (`r.Context`) to every power tool downstream (`worker`, `db.QueryContext`). Pulling the cord stops every tool wired onto it, unless one worker plugged itself into a separate outlet (`context.Background`).",
      pitfalls: [
        "Forgetting `defer cancel()` after `context.WithTimeout`, which leaves an internal timer attached to the parent context until the parent finishes.",
        "Using plain strings (`\"userID\"`) for `context.WithValue` keys, so any two packages picking the same string overwrite each other.",
        "Storing `ctx` inside a struct field (`type Client struct { ctx context.Context }`) instead of passing `ctx` per call."
      ],
      quiz: [
        { id: 'ctx-never-stored-inside', q: "Why should `ctx` NEVER be stored inside a long-lived struct field?", a: ["It causes compile errors", "Different requests carry different deadlines/cancellations; storing one freezes stale or cancelled state onto the struct", "Interfaces forbid `Context` fields", "It forces heap escape on all ints"], c: 1, why: "Each operation has its own lifetime; passing `ctx` as the first parameter keeps concurrency boundaries clear." },
        { id: 'http-handler-starts-quick', q: "When an HTTP handler starts a quick fire-and-forget audit log that must finish AFTER the HTTP response is sent, which context constructor fits best?", a: ["`r.Context()` directly", "`context.WithoutCancel(r.Context())` paired with `WithTimeout`", "`nil`", "`context.Background()` inside the DB driver"], c: 1, why: "`WithoutCancel` keeps request-scoped values/tracing while ignoring the parent HTTP request's immediate cancellation on return." },
        { id: 'declare-context-keys-unexported', q: "Why declare context keys as unexported custom types (`type ctxKey struct{}`)?", a: ["Strings cannot be used as interface keys", "Even if two packages both use the same string name, distinct Go types never collide in `context.Value`", "Makes `Value()` O(1)", "Required by `context.Background()`"], c: 1, why: "`context.Value` compares keys by both type and value, so unexported struct/string key types guarantee uniqueness." }
      ]
    },
    {
      id: 'database', title: 'Relational data: database/sql, pgx, and sqlc', level: 2, mins: 40,
      terms: [
        ['`defer rows.Close()` & `rows.Err()`', 'Every `QueryContext` loop needs both. Forgetting `Close()` leaks pool connections, and skipping `rows.Err()` hides mid-stream network or cursor errors.'],
        ['`database/sql` pool controls', '`SetMaxOpenConns`, `SetMaxIdleConns`, `SetConnMaxLifetime`, and `SetConnMaxIdleTime` keep Postgres or SQL Server connection counts bounded.'],
        ['`pgx` & `sqlc` vs ORMs', 'Most Go services skip reflection ORMs (EF Core or GORM style) and use parameterized SQL with `database/sql`, `pgx.RowToStructByName`, or typed Go code generated by `sqlc`.']
      ],
      why: "Go libraries usually treat SQL directly as SQL instead of hiding queries behind an ORM. Learning `database/sql` connection lifetimes (`QueryContext`, `rows.Close`, `rows.Err`, transactions) carries over directly whether you use `database/sql`, `pgx`, or `sqlc`.",
      points: [
        "Always call `*Context` methods (`db.QueryContext`, `db.ExecContext`, `db.BeginTx`) so slow SQL queries cancel when the HTTP client disconnects.",
        "Call `defer rows.Close()` right after checking `err` on `QueryContext`. Never call `QueryContext` for statements that return no rows (use `ExecContext`, otherwise the connection leaks), and finish every scan loop by checking `if err := rows.Err(); err != nil`.",
        "Wrap multi-step writes in `BeginTx` with `defer func() { _ = tx.Rollback() }()`, then end with `return tx.Commit()`. Rolling back after commit returns `sql.ErrTxDone` harmlessly while guarding every early error return.",
        "Use Go 1.22+'s generic `sql.Null[T]` (`sql.Null[string]`) or pointer fields for NULL columns, and Go 1.27+'s `uuid.NewV7()` for time-ordered primary keys that keep B-tree indexes compact.",
        "Use parameterized `$1` or `@p1` queries directly with `database/sql`, native `pgx` for Postgres performance, or `sqlc` to generate typed Go functions from `.sql` files at build time."
      ],
      code: `
package main

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"time"
	"uuid"
)

var ErrProductNotFound = errors.New("product not found")

type StoreProduct struct {
	ID          uuid.UUID
	Name        string
	Description sql.Null[string] // Go 1.22+: generic nullable SQL column
	PriceCents  int64
}

func ConfigurePool(db *sql.DB) {
	db.SetMaxOpenConns(25)
	db.SetMaxIdleConns(10)
	db.SetConnMaxLifetime(5 * time.Minute)
	db.SetConnMaxIdleTime(1 * time.Minute)
}

func ListProducts(ctx context.Context, db *sql.DB, minPrice int64) ([]StoreProduct, error) {
	// Parameterized placeholder ($1 Postgres / ? MySQL / @p1 SQL Server) — never fmt.Sprintf!
	rows, err := db.QueryContext(ctx,
		"SELECT id, name, description, price_cents FROM products WHERE price_cents >= $1", minPrice)
	if err != nil {
		return nil, fmt.Errorf("querying products: %w", err)
	}
	defer rows.Close() // prevents connection leaks on early returns

	out := []StoreProduct{}
	for rows.Next() {
		var p StoreProduct
		if err := rows.Scan(&p.ID, &p.Name, &p.Description, &p.PriceCents); err != nil {
			return nil, fmt.Errorf("scanning product: %w", err)
		}
		out = append(out, p)
	}
	if err := rows.Err(); err != nil { // catches mid-stream read errors
		return nil, fmt.Errorf("iterating products: %w", err)
	}
	return out, nil
}

func DecrementStock(ctx context.Context, db *sql.DB, id uuid.UUID, qty int) error {
	tx, err := db.BeginTx(ctx, nil)
	if err != nil {
		return fmt.Errorf("begin tx: %w", err)
	}
	defer func() { _ = tx.Rollback() }() // no-op after Commit; safe rollback on every early error

	res, err := tx.ExecContext(ctx,
		"UPDATE products SET stock = stock - $1 WHERE id = $2 AND stock >= $1", qty, id)
	if err != nil {
		return fmt.Errorf("updating stock: %w", err)
	}
	affected, err := res.RowsAffected()
	if err != nil {
		return fmt.Errorf("rows affected: %w", err)
	}
	if affected == 0 {
		return ErrProductNotFound
	}
	return tx.Commit()
}

func main() {
	id := uuid.NewV7() // Go 1.27+: time-ordered UUID v7 preserves B-tree index locality
	fmt.Println("ready for parameterized DB calls, sample key:", id)
}
`,
      practice: "Connect `ListProducts` and `DecrementStock` to a real Postgres (`pgx/v5/stdlib`) or SQLite (`modernc.org/sqlite`) database in a scratch module, verify `ConfigurePool` limits active connections, and prove `rows.Close()` releases the connection even if scanning fails midway.",
      teach: "Explain why skipping `rows.Err()` after `for rows.Next()` can return incomplete results after a network drop without raising an error, and why `uuid.NewV7()` causes less B-tree index fragmentation than random UUIDv4.",
      analogy: "Checking out a connection from `*sql.DB` is like borrowing a library study room. Calling `defer rows.Close()` returns the key even if you leave early, and `rows.Err()` checks whether the printer jammed before you assume all pages printed.",
      pitfalls: [
        "Calling `db.QueryContext` for an `INSERT` or `UPDATE` and discarding the `*sql.Rows` result. Each call leaks one pooled connection until the database locks up.",
        "Interpolating `ORDER BY` or `WHERE` user input via `fmt.Sprintf` instead of parameterized placeholders (`$1`/`@p1`) and column allowlists.",
        "Forgetting `db.SetMaxOpenConns(...)`, letting Go's default unlimited setting overwhelm Postgres with thousands of sockets under load."
      ],
      quiz: [
        { id: 'check-rows-err-rows', q: "Why check `rows.Err()` after `for rows.Next() { ... }` finishes?", a: ["It closes the connection", "`rows.Next()` returns `false` both on normal EOF AND on a mid-iteration error; `rows.Err()` tells you which happened", "It commits the transaction", "It frees memory faster"], c: 1, why: "Without `rows.Err()`, network drops midway through reading rows look just like reaching the end of the result set." },
        { id: 'defer-func-tx-rollback', q: "Why is `defer func() { _ = tx.Rollback() }()` safe right after `db.BeginTx`?", a: ["It cancels `Commit()`", "If `tx.Commit()` already ran, `Rollback()` harmlessly returns `sql.ErrTxDone`; on any early failure return, it rolls back automatically", "It disables locks", "Go runs `defer` before `Commit()`"], c: 1, why: "This guarantees every error return path rolls back uncommitted work without repetitive rollback code." },
        { id: 'uuid-newv7-go-27', q: "Why does `uuid.NewV7()` (Go 1.27+) work better for SQL primary keys than random `uuid.NewV4()`?", a: ["v7 is shorter", "v7 embeds a timestamp prefix so new rows insert sequentially into B-tree pages with far less index fragmentation", "v4 cannot be indexed", "v7 encrypts row data"], c: 1, why: "Time-ordered UUIDv7 preserves B-tree locality and cache friendliness unlike purely random UUIDv4." }
      ]
    },

    // ---------------- Expert ----------------
    {
      id: 'concurrency', title: 'Worker pools, synchronization, and race safety', level: 3, mins: 40,
      terms: [
        ['Bounded worker pool', 'Fixed `N` workers reading from a job channel (or `errgroup.SetLimit(N)`) so work stays capped instead of launching an unbounded goroutine per item.'],
        ['`sync.Mutex` & `atomic.Int64`', 'Protects shared mutable structs (`Mutex` held briefly, never across I/O) or single counters (`atomic`), preventing concurrent map and field races.'],
        ['`goroutineleak` profile (Go 1.27+)', 'Standard `runtime/pprof` profile reporting goroutines blocked forever on channels or locks, available without build flags since Go 1.27.']
      ],
      why: "Spawning 50,000 goroutines to call an external API at once exhausts memory, file descriptors, and downstream connection pools. Production Go services cap worker concurrency, keep locks narrow, and catch wedged goroutines with the race detector and `goroutineleak` profiling.",
      points: [
        "Cap concurrency over user input or large batches using fixed workers or `golang.org/x/sync/errgroup` (`g.SetLimit(N)` with `errgroup.WithContext`).",
        "Keep `sync.Mutex` critical sections short and never perform network or disk I/O while holding a lock. Don't copy structs containing `sync.Mutex`, and never upgrade `RWMutex.RLock()` to `Lock()` while still holding the read lock because it deadlocks.",
        "For single counters or flags, use lock-free typed atomics (`atomic.Int64`, `atomic.Bool`). For expensive one-time lazy setup, use `sync.OnceValue(fn)` (Go 1.21+).",
        "Run concurrent tests with `go test -race ./...` (requires CGO and a C compiler) and `testing/synctest`. In Go 1.27+, check `/debug/pprof/goroutineleak` or `pprof.Lookup(\"goroutineleak\")` to detect goroutines stuck permanently."
      ],
      code: `
package main

import (
	"context"
	"errors"
	"fmt"
	"runtime/pprof"
	"sync"
	"sync/atomic"
	"time"
)

type PoolResult struct {
	Processed int64
	FirstErr  error
}

// ProcessBounded fans jobs out across N fixed workers and stops early on first error.
func ProcessBounded(ctx context.Context, jobs []int, workers int, fn func(context.Context, int) error) PoolResult {
	ctx, cancel := context.WithCancelCause(ctx)
	defer cancel(nil)

	ch := make(chan int)
	var processed atomic.Int64
	var once sync.Once
	var firstErr error
	var wg sync.WaitGroup

	for range max(1, workers) {
		wg.Go(func() {
			for j := range ch {
				if err := fn(ctx, j); err != nil {
					once.Do(func() {
						firstErr = err
						cancel(err) // signal peer workers to stop remaining work
					})
					return
				}
				processed.Add(1)
			}
		})
	}

enqueue:
	for _, j := range jobs {
		select {
		case ch <- j:
		case <-ctx.Done():
			break enqueue
		}
	}
	close(ch)
	wg.Wait()
	return PoolResult{Processed: processed.Load(), FirstErr: firstErr}
}

func main() {
	res := ProcessBounded(context.Background(), []int{1, 2, 3, 4, 5}, 2, func(ctx context.Context, id int) error {
		if id == 4 {
			return errors.New("item 4 rejected")
		}
		time.Sleep(5 * time.Millisecond)
		return nil
	})
	leakProf := pprof.Lookup("goroutineleak") // Go 1.27+ built-in pprof profile
	fmt.Printf("processed=%d err=%v leakProfCount=%d\\n", res.Processed, res.FirstErr, leakProf.Count())
}
`,
      practice: "Run this code and observe early worker cancellation when `id == 4` fails, then inspect `go doc golang.org/x/sync/errgroup` or check `/debug/pprof/goroutineleak` notes in Go 1.27. Experiment with changing `max(1, workers)` and verifying zero leaks (`leakProf.Count() == 0`).",
      teach: "Explain why two goroutines writing simultaneously to one `map` triggers a fatal Go runtime crash (`fatal error: concurrent map writes`), and explain why upgrading `RLock` to `Lock` without unlocking first deadlocks.",
      analogy: "A bounded worker pool is like opening 4 checkout lanes for 1,000 shoppers instead of letting all 1,000 shoppers behind the registers at once. Queue flow stays steady, the database keeps working, and closing the lane channel drains active items before exit.",
      pitfalls: [
        "Calling `wg.Add(1)` *inside* the launched goroutine instead of before `go` (`wg.Go` fixes this automatically).",
        "Holding a `sync.Mutex` while making an HTTP call or SQL query, serializing every request behind one slow upstream socket.",
        "Upgrading an `RLock()` directly to `Lock()`, which deadlocks permanently whenever other readers or queued writers exist."
      ],
      quiz: [
        { id: 'happens-go-two-goroutines', q: "What happens in Go if two goroutines modify a regular `map[string]int` at the same time without a lock?", a: ["Last write wins quietly", "The runtime immediately throws a fatal unrecoverable crash (`concurrent map writes`)", "Go auto-locks the map", "Returns an error value"], c: 1, why: "Go detects concurrent map writes at runtime and crashes right away instead of corrupting hash buckets." },
        { id: 'cap-concurrency-worker-pool', q: "Why cap concurrency with a worker pool or `errgroup.SetLimit(n)` instead of `for _, item := range items { go work(item) }`?", a: ["More than 10 goroutines fails to compile", "Unbounded fan-out spikes memory, file descriptors, and downstream DB connection pressure simultaneously", "Channels only hold 8 items", "`WaitGroup` caps at 64"], c: 1, why: "Bounded concurrency protects external dependencies and keeps memory predictable." },
        { id: 'pprof-lookup-goroutineleak-ga', q: "What does `pprof.Lookup(\"goroutineleak\")` (GA in Go 1.27+) help detect?", a: ["High CPU loops", "Goroutines permanently blocked on channels or locks that can never be unblocked", "Slow SQL queries", "Stack allocations"], c: 1, why: "Go 1.27 promoted the goroutine leak profile to general availability for catching wedged or leaked goroutines." }
      ]
    },
    {
      id: 'architecture', title: 'Graceful shutdown, slog, and explicit wiring', level: 3, mins: 45,
      splits: [['1 · Config & options', '// ---------- Config & Logger'], ['2 · Wiring & handlers', '// ---------- Wiring'], ['3 · Graceful shutdown', '// ---------- Shutdown']],
      terms: [
        ['Explicit wiring in `main`', 'Building dependencies (`db` -> `store` -> `handler` -> `server`) explicitly in `cmd/api/main.go` so startup relationships stay visible without reflection containers.'],
        ['`log/slog` & `NewMultiHandler` (Go 1.26+)', 'Structured JSON logger in stdlib; `slog.NewMultiHandler` sends logs to stdout and an error sink at once without external wrappers.'],
        ['`signal.NotifyContext` + `Shutdown`', 'Catches `SIGINT` and `SIGTERM`, stops accepting new connections, and finishes active handlers before closing database pools.']
      ],
      why: "Go services avoid implicit `init()` setup and framework containers. Wiring constructors in `main()`, validating config through functional options, emitting structured `slog` logs, and draining HTTP servers before closing database pools make deployments predictable.",
      points: [
        "Avoid `init()` functions and global state: `init()` runs automatically before `main()`, can't return errors, and couples tests together. Wire dependencies explicitly in `main()` (accept interfaces, return structs).",
        "Functional options (`func NewServer(addr string, opts ...Option) (*Server, error)`) keep defaults simple while surfacing config errors at startup instead of failing mid-request.",
        "Use `log/slog` (Go 1.21+) with consistent message strings and structured attributes (`slog.String(\"method\", r.Method)`). Use `slog.NewMultiHandler` (Go 1.26+) when writing to multiple log outputs.",
        "Shut down in order: listen for `SIGINT` and `SIGTERM` via `signal.NotifyContext(context.Background(), ...)`, drain HTTP handlers with `srv.Shutdown(shutCtx)` using a fresh timeout context, and only then run `defer db.Close()`. Run `govulncheck` and `golangci-lint` in CI."
      ],
      code: `
package main

import (
	"context"
	"errors"
	"io"
	"log/slog"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"
)

// ---------- Config & Logger ----------
type ServerOptions struct {
	addr         string
	readTimeout  time.Duration
	writeTimeout time.Duration
}

type Option func(*ServerOptions) error

func WithReadTimeout(d time.Duration) Option {
	return func(o *ServerOptions) error {
		if d <= 0 {
			return errors.New("read timeout must be positive")
		}
		o.readTimeout = d
		return nil
	}
}

func NewLogger(primary, audit io.Writer) *slog.Logger {
	h1 := slog.NewJSONHandler(primary, &slog.HandlerOptions{Level: slog.LevelInfo})
	h2 := slog.NewJSONHandler(audit, &slog.HandlerOptions{Level: slog.LevelError})
	// Go 1.26+: stdlib MultiHandler routes logs across handlers cleanly
	return slog.New(slog.NewMultiHandler(h1, h2))
}

// ---------- Wiring ----------
func NewConfiguredServer(addr string, handler http.Handler, opts ...Option) (*http.Server, error) {
	cfg := ServerOptions{addr: addr, readTimeout: 5 * time.Second, writeTimeout: 10 * time.Second}
	for _, opt := range opts {
		if err := opt(&cfg); err != nil {
			return nil, err
		}
	}
	return &http.Server{
		Addr:              cfg.addr,
		Handler:           handler,
		ReadHeaderTimeout: 3 * time.Second,
		ReadTimeout:       cfg.readTimeout,
		WriteTimeout:      cfg.writeTimeout,
	}, nil
}

// ---------- Shutdown ----------
func runApp(ctx context.Context, log *slog.Logger) error {
	mux := http.NewServeMux()
	mux.HandleFunc("GET /healthz", func(w http.ResponseWriter, r *http.Request) {
		_, _ = w.Write([]byte("ok"))
	})
	srv, err := NewConfiguredServer(":8080", mux, WithReadTimeout(5*time.Second))
	if err != nil {
		return err
	}

	errCh := make(chan error, 1)
	go func() {
		log.Info("server starting", "addr", srv.Addr)
		if err := srv.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
			errCh <- err
		}
		close(errCh)
	}()

	select {
	case err := <-errCh:
		return err
	case <-ctx.Done():
		shutCtx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()
		log.Info("draining in-flight requests")
		return srv.Shutdown(shutCtx)
	}
}

func main() {
	log := NewLogger(os.Stdout, io.Discard)
	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()

	// Ready for production signals; verify config & logger construction cleanly
	_ = log
	_ = ctx
	_ = runApp
}
`,
      practice: "Update `main()` to run `runApp(ctx, log)` temporarily, start it, hit `/healthz`, press Ctrl+C (`SIGINT`), and watch `draining in-flight requests` complete before exit. Run `govulncheck ./...` and `golangci-lint run ./...` to see static security & resource checks pass.",
      teach: "Explain why Go deploys prefer flat explicit wiring inside `main()` and ordered `server.Shutdown(ctx)` before `db.Close()` over global `init()` setup.",
      analogy: "Graceful shutdown works like closing a supermarket. First lock the entrance doors (`Shutdown` stops accepting new TCP connections), wait for shoppers at checkout to pay (active handlers finish), and then turn off the lights (`db.Close`).",
      pitfalls: [
        "Calling `db.Close()` before `srv.Shutdown(shutCtx)` finishes, causing active requests to fail mid-transaction during a rolling deploy.",
        "Passing the cancelled signal `ctx` into `srv.Shutdown(ctx)`. Because that context is already cancelled, `Shutdown` exits immediately without draining active requests unless you pass a fresh `WithTimeout(context.Background(), ...)`.",
        "Stashing high-cardinality user IDs inside log message templates (`slog.Info(\"failed \" + id)`) instead of keeping stable messages plus structured attributes (`slog.Info(\"request failed\", \"userId\", id)`)."
      ],
      quiz: [
        { id: 'pass-fresh-context-withtimeout', q: "Why pass a fresh `context.WithTimeout(context.Background(), 10*time.Second)` to `srv.Shutdown(...)` instead of the signal `ctx`?", a: ["`context.Background()` skips JSON logs", "The signal `ctx` is already cancelled, so passing it to `Shutdown` gives in-flight requests zero time to finish", "Go rejects signal contexts in `net/http`", "`Shutdown` ignores timeouts"], c: 1, why: "An already-done context makes `srv.Shutdown` return `context.Canceled` right away before draining handlers." },
        { id: 'order-resources-shut-down', q: "In which order should resources shut down on `SIGTERM`?", a: ["Close DB pool first, then HTTP server", "Stop HTTP listener and drain in-flight requests (`srv.Shutdown`), THEN close DB pools", "Cancel all requests with `os.Exit(1)` immediately", "Order makes no difference"], c: 1, why: "In-flight requests still need live DB connections until they finish writing responses." },
        { id: 'avoid-init-functions-reading', q: "Why avoid `init()` functions for reading config or opening databases?", a: ["`init()` runs at import time without caller control, cannot return errors, and makes tests order-dependent", "`init()` was removed in Go 1.25", "`init()` runs after `main()`", "`init()` disables garbage collection"], c: 0, why: "Explicit constructor calls inside `main()` make dependencies visible, testable, and easy to error-check." }
      ]
    },
    {
      id: 'profiling', title: 'Memory escapes, benchmarks, and pprof', level: 3, mins: 40,
      splits: [['1 · format.go', '// ---------- format.go'], ['2 · format_bench_test.go', '// ---------- format_bench_test.go']],
      terms: [
        ['Escape analysis (`-gcflags=-m`)', 'Determines at compile time whether a variable stays cheaply on the goroutine stack or moves to garbage-collected heap memory.'],
        ['`benchstat` statistical delta', 'Compares repeated benchmark runs (`-count=6`) to tell real CPU or byte wins (`B/op`, `allocs/op`) apart from run noise.'],
        ['Profile-Guided Optimization (PGO)', 'Feeds a production CPU profile (`default.pgo`) to `go build` so the compiler inlines and devirtualizes hot calls automatically.']
      ],
      why: "Guessing where Go code spends time or memory usually points at the wrong function. Inspect compiler escape decisions with `-gcflags=-m`, verify improvements across runs using `b.Loop()` and `benchstat`, and read CPU, heap, and `goroutineleak` traces in `pprof`.",
      points: [
        "Measure before optimizing: rule out external I/O waits first (`pprof` goroutines or `runtime/trace.FlightRecorder` in Go 1.25+), then inspect where bytes allocate (`alloc_objects`, `B/op`, `allocs/op`).",
        "Run `go build -gcflags=-m` to see why values escape to the heap: returning pointers, capturing variables in closures, boxing values into interfaces, or passing them to `any` formatting. Stack values free immediately on return.",
        "Common allocation wins: preallocate slices and maps (`make([]byte, 0, cap)`), replace `+` or `fmt.Sprintf` in loops with `strings.Builder` or `strconv.AppendInt`, and reuse temporary buffers via `sync.Pool` (calling `Reset()` before `Put()`).",
        "Benchmark with `b.Loop()` (Go 1.24+), `-benchmem -count=6`, and `benchstat`. Re-measure your baseline on the same Go toolchain version during upgrades, since Go 1.26's Green Tea GC and Go 1.27's size-specialized allocator change timings on their own.",
        "Feed a production CPU profile (`default.pgo`) to `go build` so PGO can optimize hot interfaces and inlining for your workload."
      ],
      code: `
// ---------- format.go ----------
package main

import (
	"strconv"
	"strings"
)

func BuildCSVNaive(ids []int) string {
	out := ""
	for i, id := range ids {
		if i > 0 {
			out += ","
		}
		out += strconv.Itoa(id)
	}
	return out
}

func BuildCSVFast(ids []int) string {
	if len(ids) == 0 {
		return ""
	}
	var b strings.Builder
	b.Grow(len(ids) * 6) // pre-size once to eliminate builder growth reallocations
	var tmp [20]byte      // stack scratch buffer avoids per-item strconv.Itoa heap strings
	for i, id := range ids {
		if i > 0 {
			b.WriteByte(',')
		}
		b.Write(strconv.AppendInt(tmp[:0], int64(id), 10))
	}
	return b.String()
}

// ---------- format_bench_test.go ----------
package main

import "testing"

func makeIDs(n int) []int {
	ids := make([]int, n)
	for i := range n {
		ids[i] = 1000 + i
	}
	return ids
}

func BenchmarkBuildCSVNaive(b *testing.B) {
	ids := makeIDs(200)
	b.ReportAllocs()
	for b.Loop() {
		_ = BuildCSVNaive(ids)
	}
}

func BenchmarkBuildCSVFast(b *testing.B) {
	ids := makeIDs(200)
	b.ReportAllocs()
	for b.Loop() {
		_ = BuildCSVFast(ids)
	}
}
`,
      practice: "Save both sections into a module, run `go test -bench=. -benchmem -count=5`, and compare `allocs/op` between `BuildCSVNaive` (`O(n)` string allocations!) and `BuildCSVFast` (`1 alloc/op`). Run `go build -gcflags=-m` to inspect which variables stay on the stack.",
      teach: "Explain what escape analysis does at compile time, why reducing `allocs/op` often helps latency more than clever micro-tweaks, and why you should re-baseline `benchstat` after upgrading Go versions.",
      analogy: "Stack memory is a whiteboard right beside your desk that erases for free as soon as a function returns. Heap memory is shared warehouse space cleared later by a night crew (the GC), so keeping values out of the heap cuts cleanup work.",
      pitfalls: [
        "Running a benchmark once without `-benchmem` or `-count` and trusting a noisy 3% difference.",
        "Putting slices back into a `sync.Pool` without `buf.Reset()`, which leaks old request data or keeps a giant 10 MB buffer in the pool.",
        "Polishing tiny allocations while 95% of request time sits waiting on an unindexed SQL query."
      ],
      quiz: [
        { id: 'go-build-gcflags-show', q: "What does `go build -gcflags=-m` show?", a: ["Mobile binary size", "Compiler escape analysis and inlining decisions showing which values stay on the stack vs move to the heap", "Database query plans", "Goroutine leak counts"], c: 1, why: "`-gcflags=-m` prints stack vs heap escape decisions right at build time." },
        { id: 'call-grow-estimatedbytes-strings', q: "Why call `b.Grow(estimatedBytes)` on `strings.Builder` on a hot path?", a: ["Compresses strings automatically", "Allocates the backing byte slice once up front, reducing `allocs/op` down toward 1", "Prevents UTF-8 validation", "Moves the builder onto the stack permanently"], c: 1, why: "One right-sized allocation avoids repeated doubling copies during `WriteString`." },
        { id: 're-run-baseline-benchmark', q: "Why re-run the baseline benchmark when comparing code across a Go toolchain upgrade (e.g. 1.26 -> 1.27)?", a: ["Old benchmark code won't run", "Runtime GC and allocator improvements (like Go 1.26 Green Tea GC and 1.27 size-specialized allocator) shift timings independently of your code change", "`benchstat` blocks mismatched filenames", "`b.Loop()` changed units"], c: 1, why: "Comparing old-toolchain baseline against new-toolchain change mixes toolchain gains with code gains." }
      ]
    }
  ]
};

export default track;
