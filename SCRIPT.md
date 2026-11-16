# Binary Search: Explainer Video Script

**Takeaway:** Binary search finds an item in a sorted list by checking the middle and throwing away half the list each step, so it needs only about log₂(n) checks: 20 checks for a million items.

**Format:** 1920×1080, 30 fps, about 60–90 s. Dark background, drawn in code (no generated images).
**Narration:** Kokoro `af_heart`. The text lives in `narration.json` (one key per scene), and each scene's length follows its audio (`src/durations.json`).
**Running example:** sorted array of 16 numbers, target **79**:
`[3, 8, 12, 15, 21, 27, 34, 42, 51, 57, 64, 73, 79, 85, 91, 98]` (79 is at index 12)

**Why 79:** it takes 4 checks, which is the worst case for 16 items (⌈log₂ 17⌉ = 4), so every step of the demo gets shown. An earlier draft used 73, which is found on the 2nd check: too lucky to teach from.

Trace (low/high inclusive, mid = ⌊(low+high)/2⌋):
| step | low | high | mid | a[mid] | decision |
|------|-----|------|-----|--------|----------|
| 1 | 0 | 15 | 7 | 42 | 42 < 79 → low = 8 |
| 2 | 8 | 15 | 11 | 73 | 73 < 79 → low = 12 |
| 3 | 12 | 15 | 13 | 85 | 85 > 79 → high = 12 |
| 4 | 12 | 12 | 12 | 79 | found ✓ |

**Narration rules:** conversational, one idea per scene, each scene ≤ ~12 s spoken. Numbers are spelled out in narration.json so Kokoro reads them naturally. Durations below are from `npm run narrate` (Kokoro `af_heart`, speed 1.0).

| scene | spoken |
|-------|--------|
| 1 Hook | 9.26 s |
| 2 Sorted is the key | 8.34 s |
| 3 First check | 9.73 s (scene lasts 10 s, its fallback minimum) |
| 4 Repeat | 11.14 s |
| 5 Why it's fast | 10.45 s |
| 6 Recap | 9.90 s |
| **total** | **58.8 s spoken, ≈ 59 s on screen** |

---

## Scene 1: Hook (`scene1`)
**Visual:** A long row of numbers runs off-screen. A pointer scans left to right one cell at a time while a "checks: N" counter ticks up fast.
**Narration:** "Say you're hunting for one number in a list of a thousand. If you check them one at a time, that could take a thousand tries. Luckily, there's a much faster way."

## Scene 2: Sorted is the key (`scene2`)
**Visual:** The row collapses into 16 cells that sort themselves into order. The target "79" appears above, and a "?" hovers over the row.
**Narration:** "Here's the catch: the list has to be sorted. So let's take sixteen numbers, smallest to largest, and look for seventy-nine. Where would you start?"

## Scene 3: First check (`scene3`)
**Visual:** `low` and `high` arrows sit under the ends, and the `mid` cell (42) glows yellow. A comparison bubble shows "42 < 79". The left half (indices 0–7, including mid) fades to grey, and `low` jumps to index 8.
**Narration:** "Start in the middle. That's forty-two. It's smaller than seventy-nine, and since the list is sorted, everything to its left is smaller too. So we toss that whole half."

## Scene 4: Repeat (`scene4`)
**Visual:** Three more rounds, each faster: 73 → discard left, 85 → discard right, 79 → turns green. A step counter goes 1 → 4. Each discarded part greys out (after 73: indices 8–11; after 85: indices 13–15). End card: "4 checks instead of up to 16".
**Narration:** "Now just repeat with what's left. Seventy-three? Too small, toss the left. Eighty-five? Too big, toss the right. Seventy-nine? Found it! Four checks, instead of up to sixteen."

## Scene 5: Why it's fast (`scene5`)
**Visual:** Bars shrink 16 → 8 → 4 → 2 → 1, with labels, in time with the narration. Then a chart: a linear line (n) against a flat curve (log₂ n). Then the big text "1,000,000 items → 20 checks".
**Narration:** "Every check cuts the list in half: sixteen, eight, four, two, one. So n items take about log base two of n checks. That's why a million items need only twenty."

## Scene 6: Recap (`scene6`)
**Visual:** Pseudocode types in on the left; the takeaway sentence sits on the right.
```
while low <= high:
    mid = (low + high) // 2
    if a[mid] == target: return mid
    if a[mid] <  target: low  = mid + 1
    else:                high = mid - 1
```
**Narration:** "So that's binary search. Start with a sorted list, check the middle, throw away the half you don't need, and repeat until you find it. Simple, and seriously fast."
