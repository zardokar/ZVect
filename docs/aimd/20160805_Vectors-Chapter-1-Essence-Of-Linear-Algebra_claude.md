# Vectors | Chapter 1, Essence of Linear Algebra — Claude Context
> Source: YouTube, 3Blue1Brown (Grant Sanderson), "Vectors | Chapter 1, Essence of linear algebra", 9:51, published 2016-08-05, https://www.youtube.com/watch?v=fNk_zzaMoSs · Generated: 2026-10-10
> Companion: docs/outhtm/20160805_Vectors-Chapter-1-Essence-Of-Linear-Algebra.html (Thai, interpretive full-detail mode)

## TL;DR
The opening episode of Essence of Linear Algebra defines what a vector is from three related perspectives (physics: arrow with length and direction that can be moved; computer science: ordered list of numbers; mathematics: anything with sensible addition and multiplication by numbers) and fixes the picture used for the whole series: an arrow in a coordinate system with its tail at the origin, which corresponds one-to-one to a list of coordinates. It then defines the two operations every linear-algebra topic revolves around, vector addition (tip-to-tail, component-wise) and scalar multiplication (stretch/squish/flip, component-wise). The stated payoff of the subject is the ability to translate back and forth between the geometric and numeric views. Nothing in the video was found to be wrong.

## Key Concepts
- Physics-student view: a vector is an arrow; what defines it is its length and direction, so as long as those stay the same it can be moved around and is still the same vector. Plane vectors are 2D, space vectors are 3D.
- CS-student view: a vector is an ordered list of numbers; "vector" is roughly a fancy word for list; dimension = list length. Example: a house modeled as (square footage, price); order matters. On-screen example: 2,600 ft², $300,000.
- Mathematician's view: a vector can be anything with a sensible notion of adding two vectors and multiplying a vector by a number. The details are abstract; the speaker thinks it is healthy to ignore them until the last video of the series, favoring a more concrete setting meanwhile; he mentions the view now to hint that addition and multiplication by numbers play an important role throughout linear algebra.
- Convention for the series: think of an arrow in a coordinate system (e.g. the xy-plane) with its tail at the origin; in linear algebra vectors are almost always rooted at the origin (unlike the physics view). Understand a new concept geometrically first, then translate to numbers via coordinates.
- Coordinate system: worth walking through because it is where all of the important back and forth between the two perspectives happens. Focusing on 2D for the moment: x-axis (horizontal), y-axis (vertical), origin = intersection, "center of space and root of all vectors"; an arbitrary length is chosen to represent 1 and marked with ticks; ticks are extended to grid lines when conveying 2D space as a whole (common in the series), but here they would get in the way.
- Coordinates: instructions from tail (origin) to tip. First number: move along x (positive right, negative left); second: then move parallel to y (positive up, negative down). Written vertically in square brackets to distinguish vectors from points. Every pair gives exactly one vector and vice versa. On-screen example: (-2, 3).
- 3D: add a z-axis perpendicular to x and y; vectors correspond to ordered triplets (x, then parallel to y, then parallel to z); one-to-one again.
- The two operations: every topic in linear algebra centers around vector addition and multiplication by numbers; each is straightforward to define.
- Vector addition (example: one vector pointing up and a little right, the other right and down a bit): move the second vector's tail to the first vector's tip; the sum goes from the first tail to the second tip. This is "pretty much the only time" vectors leave the origin. Justification ("the way I like to think about it"): each vector is a step (movement with distance and direction); two steps in sequence equal one step along the sum. Analogy: 2 + 5 on the number line = two steps right then five steps right = seven steps right.
- Numeric addition: (1, 2) + (3, -1) seen as the path right 1, up 2, right 3, down 1; reorder to right (1 + 3), up (2 - 1); result (1 + 3, 2 + (-1)). In general: match up terms and add each.
- Scalar multiplication: x2 stretches to twice the length; x1/3 squishes to one third; a negative number such as -1.8 first flips the vector, then stretches by 1.8. This is "scaling"; numbers doing it are "scalars"; because scaling vectors is one of the main things numbers do in linear algebra, "scalar" is used pretty much interchangeably with "number". Numerically: multiply every component by the scalar (on-screen example 2·(3, 1)).
- Following videos will show topics revolving around these two operations; the last video covers how and why mathematicians think only about these operations, independent of how vectors are represented.
- Why it matters: it does not matter whether vectors are "really" arrows in space (as the speaker suggests thinking of them) with a nice numerical representation, or lists of numbers with a nice geometric interpretation; the usefulness of linear algebra has less to do with either view than with the ability to translate between them. Data analysts get a visual way to conceptualize many lists of numbers, which can seriously clarify patterns in data and give a global view of what certain operations do; physicists and graphics programmers get a numeric language for space and its manipulation that computers can crunch. The speaker's own animations: think about what happens in space, then have the computer represent it numerically to work out where to place pixels; doing that usually relies on a lot of linear-algebra understanding.
- Next episode: span, bases, linear dependence.

## Implementation
Component-wise definitions (2D or 3D, any length n):
1. add(a, b)[i] = a[i] + b[i] for i in 0..n-1 (sizes must match).
2. scale(a, k)[i] = k * a[i].
3. Geometric reading: add = tip-to-tail; scale by k > 0 stretches (k > 1) or squishes (0 < k < 1); k < 0 flips then stretches by |k|.

Worked values (computed, not stated as results in the video except the coordinate sums):
| expression | result |
|---|---|
| (1, 2) + (3, -1) | (4, 1) |
| 2 · (3, 1) | (6, 2) |
| (1/3) · (3, 1) | (1, 1/3) |
| -1.8 · (3, 1) | (-5.4, -1.8) |

ZVect code (own, uses lib/zvect.js):
```js
import { add, scale, fmt } from "./lib/zvect.js";
console.log(fmt(add([1, 2], [3, -1])));   // [4.000, 1.000]
console.log(fmt(scale([3, 1], 2)));       // [6.000, 2.000]
console.log(fmt(scale([3, 1], -1.8)));    // [-5.400, -1.800]
```

## Quick Reference
| Term | Meaning in the video | Example |
|---|---|---|
| vector (physics) | arrow; length + direction; movable | ~0:30 |
| vector (CS) | ordered list; dimension = length | house = (sq ft, price) |
| vector (math) | anything with sensible + and scalar x | postponed to last episode |
| origin | axis intersection; root of all vectors | (0, 0) |
| coordinates | walking instructions tail -> tip | (-2, 3) |
| notation | vertical column in square brackets | — |
| one-to-one | each list <-> exactly one vector (2D and 3D) | — |
| z-axis | perpendicular to x and y | triplets |
| addition | tip-to-tail; component-wise | (1,2)+(3,-1)=(4,1) |
| exception | addition is ~the only time vectors leave the origin | ~5:12 |
| scaling | stretch / squish / flip | x2, x1/3, x-1.8 |
| scalar | a number that scales; ~synonym for number | 2, 1/3, -1.8 |
| payoff | translating between geometric and numeric views | ~8:42 |
| next | span, bases, linear dependence | ~9:27 |

## Comparisons
| Aspect | Physics | CS | Math |
|---|---|---|---|
| A vector is | arrow in space | ordered list of numbers | anything with + and scalar x |
| Defined by | length, direction | entries and their order | the operations |
| Position | free to move | — | — |
| Tied to a representation | — | — | no: thought of independently of representation (last episode, ~8:22) |
| In this series | combined: arrow rooted at origin <-> list | (same) | postponed |

## Corrections / verification
- No errors found. Coordinate sums and the on-screen 2·(3, 1) checked by computation.
- The one-to-one correspondence holds once axes and unit length are fixed (the next episode's topic of bases makes that dependence explicit).

## Open Questions & Extension Ideas
- ZVect lesson order: the video teaches addition and scalar multiplication before anything else; ZVect currently teaches dot product (lesson 2) before addition (lesson 4). Candidate for the topic regroup (WIP202610020): move add/scale to lesson 2.
- A "steps" animation for tip-to-tail (four-step path reordered into horizontal then vertical) would fit ZVect lesson 4.
- Commutativity (v + w = w + v) is not stated in the video; showing both tip-to-tail orders ending at the same point is a natural extension.

## Tags & Triggers
linear-algebra, vector, vector-addition, scalar-multiplication, coordinates, 3blue1brown, essence-of-linear-algebra
- "What is a vector, arrow vs list of numbers?"
- "Why is vector addition tip-to-tail?"
- "What does multiplying a vector by a negative number do?"
- "What order should vector lessons be taught in?"

## Processing Notes
- Mode: interpretive full-detail (standard YouTube license, checked 2026-10-10); every point of the video kept in order; own wording; no sentence-by-sentence rendering. The transcript (manual English track, 157 lines, SHA-256 2232b7ce...b62 in-page) was read in the session workspace and not saved.
- 11 frames captured in the built-in browser via 2,000-char console chunks; 8 kept (01 physics, 02 house list, 05 (-2,3), 06 3D, 07 tip-to-tail, 08 numeric sum, 10 -1.8v, 11 2·(3,1)); 3 near-duplicates dropped. Own SVG diagrams: overview flow, addition path, scaling.

## References
- 3Blue1Brown, "Vectors | Chapter 1, Essence of linear algebra", YouTube, 2016-08-05, https://www.youtube.com/watch?v=fNk_zzaMoSs (timestamps as ~m:ss).
