# Cosine Similarity, Clearly Explained!!! — Claude Context
> Source: YouTube, StatQuest with Josh Starmer, "Cosine Similarity, Clearly Explained!!!", 10:13, published 2023-01-29, https://www.youtube.com/watch?v=e9U0QAFbfLI · Generated: 2026-10-10
> Companion: docs/outhtm/20230129_Cosine-Similarity-Clearly-Explained.html (Thai, interpretive full-detail mode)

## TL;DR
A beginner explainer of cosine similarity for text. Phrases are turned into word-count tables; with two distinct words each phrase is a point on a 2D graph (x = count of "hello", y = count of "world"); lines from the origin to the points form an angle whose cosine is the similarity ("Hello, World!" vs "Hello!" -> 45 deg -> 0.71). The value depends entirely on the angle, not the line lengths ("Hello Hello Hello" still gives 0.71); identical phrases give 1 (0 deg), phrases with no words in common give 0 (90 deg), partial overlap gives a value between 0 and 1. A formula computes it directly from the count table and works in any number of dimensions ("I love Troll 2!" vs "I love Gymkata!", 5 words -> 0.58). All numbers check out.

## Key Concepts
- Opening: the channel's short jingle, this time about the cosine (lyrics not reproduced).
- Motivation: sentences about the 1990 hit movie Troll 2 (on screen: "I love Troll 2!", "I like Troll 2.", "I love Troll 2! I love it!!!", "Troll 2 is bad."); the first three are similar (positive), the last is from someone who does not like the movie. Easy by eye for a few sentences; for a month of Twitter traffic a computer is needed.
- Definition (as stated): cosine similarity is a relatively easy-to-calculate metric that tells how similar or different things are.
- Word-count table: one column per distinct word; "Hello, World!" -> hello 1, world 1; "Hello!" -> hello 1, world 0.
- Geometry: x-axis = number of times "hello" appears, y-axis = number of times "world" appears; points (1, 1) ("center of the graph") and (1, 0) (on the x-axis at 1); draw lines from the origin (0, 0); angle 45 deg; cos 45 deg = 0.71.
- Length invariance: "Hello Hello Hello" -> (3, 0), further out on the x-axis; angle still 45 deg; similarity still 0.71. "The cosine similarity is determined entirely by the angle between the lines and not by the lengths of the lines."
- Extremes: both phrases "Hello, World!" -> points on top of each other, angle 0 deg, similarity 1. "Hello" vs "World" (no words in common) -> 90 deg, similarity 0. Partial overlap but not identical -> between 0 and 1.
- The four-step geometric method (table, plot, angle, cosine) is tedious; a relatively simple formula computed quickly on a computer gives the value directly from the count table.
- The character Squatch says the equation looks complicated; the speaker says they will go through it one step at a time.
- Formula notation as explained: sigma = shorthand for adding up a bunch of stuff; i = index tracking the word being worked on, starting at 1 (the first word in the table, here "hello"); n = number of different words in the phrases (here 2); A and B = the two phrases (A = "Hello, World!", B = "Hello!"). Plugging in for i = 1 (hello) and i = 2 (world) gives 0.71, the same as cos 45 deg.
- More words -> more dimensions: with two words the points fit on a 2D graph (one word per axis); "I love Troll 2!" (A) vs "I love Gymkata!" (B) has five different words, so a 5-dimensional graph would be needed, and the speaker says he has no idea how to draw one; the formula avoids that and gives 0.58.
- Closing aside: Gymkata is described by the speaker as an awesome 1985 movie about a gymnast who uses the parallel bars to defeat his enemies "in Mortal Kombat" per the ASR caption (probably "mortal combat"; inference, not verified).

## Implementation
```
cosine(A, B) = sum_{i=1..n} A_i * B_i / ( sqrt(sum_{i=1..n} A_i^2) * sqrt(sum_{i=1..n} B_i^2) )
```
Steps for text (as in the video):
1. Build the vocabulary of distinct words across both phrases (n words).
2. Count each word in each phrase -> two count vectors A, B of length n.
3. Apply the formula.

Worked values (checked with ZVect's `words` + counting + `cosine`):
| A | B | vectors | cosine | angle |
|---|---|---|---|---|
| Hello, World! | Hello! | (1,1), (1,0) | 0.707 | 45.0 |
| Hello, World! | Hello Hello Hello! | (1,1), (3,0) | 0.707 | 45.0 |
| Hello, World! | Hello, World! | (1,1), (1,1) | 1.000 | 0.0 |
| Hello! | World! | (1,0), (0,1) | 0.000 | 90.0 |
| I love Troll 2! | I love Gymkata! | i,love,troll,2,gymkata: (1,1,1,1,0), (1,1,0,0,1) | 0.577 | 54.7 |

On-screen arithmetic: (1x1 + 1x0) / (sqrt(1^2+1^2) * sqrt(1^2+0^2)) = 0.71; (1x1)+(1x1)+(1x0)+(1x0)+(0x1) / (sqrt(1^2+1^2+1^2+1^2+0^2) * sqrt(1^2+1^2+0^2+0^2+1^2)) = 0.58.

```js
import { words, cosine, fmt } from "./lib/zvect.js";
const vocab = (ps) => [...new Set(ps.flatMap((p) => words(p)))];
const counts = (p, V) => V.map((w) => words(p).filter((x) => x === w).length);
const V = vocab(["I love Troll 2!", "I love Gymkata!"]);
console.log(fmt(cosine(counts("I love Troll 2!", V), counts("I love Gymkata!", V)))); // 0.577
```

## Quick Reference
| Item | Value | Time |
|---|---|---|
| hello/world table | (1,1) vs (1,0) | ~2:01 |
| angle -> value | 45 deg -> 0.71 | ~3:06 |
| Hello Hello Hello | (3,0), still 0.71 | ~3:39 |
| identical | 0 deg -> 1 | ~4:34 |
| no common words | 90 deg -> 0 | ~5:11 |
| partial overlap | between 0 and 1 | ~5:46 |
| formula | sum A_i B_i / (sqrt sum A_i^2 * sqrt sum B_i^2) | ~6:20 |
| 5-word example | 0.58 | ~8:56 |

## Comparisons
| Aspect | Four-step geometric method | Formula |
|---|---|---|
| Steps | table -> plot -> angle -> cosine | plug counts in |
| Speed | tedious (per the video) | computed super quickly on a computer |
| Dimensions | easy for 2 words | more than two words (5 in the video's example) |
| Hello, World! vs Hello! | 0.71 | 0.71 |

## Corrections / verification
- No errors: 0.71 = 1/sqrt(2) = 0.707; 0.58 = 2 / (2 * sqrt(3)) = 0.577.
- Supplement (not in the video): the 0-to-1 range holds because word counts are non-negative; general vectors give -1 to 1. Word counts measure shared words, not sentiment: on the video's own sentences, "Troll 2 is bad." vs "I love Troll 2!" = 0.50, "I like Troll 2." = 0.75, "I love Troll 2! I love it!!!" = 0.905.

## Open Questions & Extension Ideas
- ZVect lesson 3 could use the Hello / Hello Hello Hello presets directly.
- A "counts as vectors" mini-lesson (type two sentences, see the count table and the cosine) would sit before the planned One-hot vs Embedding lesson (WIP202610018) and motivate embeddings via the sentiment failure above.

## Tags & Triggers
cosine-similarity, bag-of-words, word-counts, text-similarity, statquest, vector-angle
- "How is cosine similarity computed from text?"
- "Why does a longer phrase in the same direction give the same cosine?"
- "Why is cosine of word counts between 0 and 1?"
- "Can word counts tell positive from negative reviews?"

## Processing Notes
- Mode: interpretive full-detail (standard YouTube license, checked 2026-10-10). Sponsor read (~0:22-0:36, garbled in ASR) and self-promotion (~9:30-10:11) removed. Intro jingle and the "always be curious" catchphrase mentioned briefly.
- Captions: English ASR only (222 lines, SHA-256 43b31dc6...f743d in-page); terms and numbers checked against frames (ASR "stat Quest", "Jim Kata" = Gymkata). Transcript kept in the session workspace only.
- 14 frames captured (2,000-char console chunks), 8 kept.

## References
- StatQuest with Josh Starmer, "Cosine Similarity, Clearly Explained!!!", YouTube, 2023-01-29, https://www.youtube.com/watch?v=e9U0QAFbfLI (timestamps as ~m:ss).
