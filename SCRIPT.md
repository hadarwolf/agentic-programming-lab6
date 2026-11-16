# Binary Search: Explainer Video Script

**Takeaway:** Binary search finds an item in a sorted list by checking the middle and throwing away half the list each step, so it needs only about log₂(n) checks: 20 checks for a million items.

**Format:** 1920×1080, 30 fps, about 60–90 s. Dark background, drawn in code (no generated images).
**Narration:** Kokoro `af_heart`. The text lives in `narration.json` (one key per scene), and each scene's length follows its audio (`src/durations.json`).
**Running example:** sorted array of 16 numbers, target **73**:
`[3, 8, 12, 15, 21, 27, 34, 42, 51, 57, 64, 73, 79, 85, 91, 98]` (73 is at index 11)

Trace (low/high inclusive, mid = ⌊(low+high)/2⌋):
| step | low | high | mid | a[mid] | decision |
|------|-----|------|-----|--------|----------|
| 1 | 0 | 15 | 7 | 42 | 42 < 73 → low = 8 |
| 2 | 8 | 15 | 11 | 73 | found ✓ |

> Note: that's only 2 checks, which is too lucky for the demo. **Decide in the lab:** either pick a target that takes 4 checks (e.g. **79**: mids 42 → 73 → 85 → 79), or keep 73 and say "lucky". Draft below assumes target **79**.

Trace for 79:
| step | low | high | mid | a[mid] | decision |
|------|-----|------|-----|--------|----------|
| 1 | 0 | 15 | 7 | 42 | 42 < 79 → low = 8 |
| 2 | 8 | 15 | 11 | 73 | 73 < 79 → low = 12 |
| 3 | 12 | 15 | 13 | 85 | 85 > 79 → high = 12 |
| 4 | 12 | 12 | 12 | 79 | found ✓ |

---

## Scene 1: Hook (`scene1`)
**Visual:** A long row of numbers runs off-screen. A pointer scans left to right one cell at a time while a "checks: N" counter ticks up fast.
**Narration:** "Say you're looking for one number in a list of a thousand. Checking them one by one could take a thousand steps."

## Scene 2: Sorted is the key (`scene2`)
**Visual:** The row collapses into 16 cells that sort themselves into order. The target "79" appears above.
**Narration:** "But if the list is sorted, there's a much smarter way."

## Scene 3: First check (`scene3`)
**Visual:** `low` and `high` arrows sit under the ends, and the `mid` cell (42) glows yellow. A comparison bubble shows "42 < 79". The left half, including mid, fades to grey.
**Narration:** "Look at the middle element. Forty-two is smaller than seventy-nine, and since the list is sorted, everything to its left is smaller too. So we throw that whole half away."

## Scene 4: Repeat (`scene4`)
**Visual:** Three more rounds, each faster: 73 → discard left, 85 → discard right, 79 → turns green. A step counter goes 1 → 4. End card: "4 checks instead of 16".
**Narration:** "Repeat on what's left. Seventy-three: too small. Eighty-five: too big. Seventy-nine: found it, in four checks instead of sixteen."

## Scene 5: Why it's fast (`scene5`)
**Visual:** Bars shrink 16 → 8 → 4 → 2 → 1, with labels. Then a chart: a linear line (n) against a flat curve (log₂ n). Then the big text "1,000,000 items → 20 checks".
**Narration:** "Every check cuts the list in half. So n items need only about log base two of n checks. For a million items, that's just twenty."

## Scene 6: Recap (`scene6`)
**Visual:** Pseudocode types in on the left; the takeaway sentence sits on the right.
```
while low <= high:
    mid = (low + high) // 2
    if a[mid] == target: return mid
    if a[mid] <  target: low  = mid + 1
    else:                high = mid - 1
```
**Narration:** "Sorted list, check the middle, throw away half, repeat. That's binary search."
