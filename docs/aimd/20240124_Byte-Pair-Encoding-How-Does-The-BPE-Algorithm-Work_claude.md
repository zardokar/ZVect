# Byte Pair Encoding (BPE), Step by Step — Claude Context
> Source: YouTube, Raj Pulapakura, "Byte Pair Encoding - How does the BPE algorithm work? - Step by Step Guide", 14:33, published 2024-01-24, https://www.youtube.com/watch?v=BcxJk4WQVIw · Generated: 2026-10-11
> Companion: docs/outhtm/20240124_Byte-Pair-Encoding-How-Does-The-BPE-Algorithm-Work.html (Thai, rewritten in the author's own words with every point and number; the clip's counts were re-run in code)

## TL;DR
A slide-based walkthrough of character-level Byte Pair Encoding. Tokenization turns text into integers because machines only process numbers. Character tokenization has a small vocabulary (30 symbols on the slide; "maybe about 100" with uppercase and symbols) but long integer sequences; word tokenization has short sequences but a huge vocabulary (slide's last word id: zulu = 173248). Subword tokenization balances the two; named algorithms: BPE (GPT), WordPiece (BERT), Unigram Language Modeling (T5). BPE starts from all unique characters and repeats k times: count adjacent pairs, take the most frequent, add the merged symbol to the vocabulary, replace every occurrence. Worked example on "fred fed ted bread, and ted fed fred bread" (4 merges, 13-token vocabulary) and encoding of "ted and fred are friends" into 16 ids with 2 unknowns. Re-running the example in code: iteration-1 counts are right; two iteration-2 counts are overstated, merges 3-4 on the slides are not what strict max-count BPE picks, and one output id is a typo (fred_ should be 13, slide shows 7).

## Key Concepts
- 0:01 BPE is a subword tokenization algorithm used by many well-known NLP models including GPT.
- 0:18 Context: NLP is a subfield of ML, itself a subfield of AI; goal is human-level text understanding. Machines only understand numbers, so text must be converted to numbers (tokenization); the numbers are then used e.g. to predict sentiment or generate text.
- 0:59 Character tokenization. Slide vocabulary of 30: a-z = 1-26, ! = 27, @ = 28, # = 29, $ = 30. Uppercase and other symbols could be added; the point is the vocabulary stays relatively small, "might top out at about maybe 100". Encode by mapping each character: h = 8, e = 5, l = 12. Slide: "hello there you are amazing" -> 8,5,12,12,15 · 20,8,5,18,5 · 25,15,21 · 1,18,5 · 1,13,1,26,9,14,7 (spaces get no id on the slide; 23 ids). Called "pretty simple".
- 2:00 Word tokenization. Slide vocabulary: a = 1, ab = 2, abbreviation = 3, ..., jungle = 92382, ..., zulu = 173248 (alphabetical). Slide encoding: hello 86241, there 129041, you 164234, are 1324, amazing 914 (only the first two are spoken). Vocabulary is not all English words (wasteful; some never used); it is built from the unique words of the training corpus. The speaker says real training is "a bit more complicated" and defers it.
- 3:10 Trade-off. Character: small vocabulary (probably max ~100), long integer sequences. Word: very large vocabulary, short sequences. Smaller vocabulary is preferred (less memory) but long sequences make downstream models take much longer. Desired: small vocabulary and reasonably sized sequences.
- 4:28 Subword tokenization balances the two. A subword is a little piece of text, usually not a full word and not a single character; examples: "ly", "ence", "tion".
- 5:00 Three well-known subword algorithms: Byte-Pair Encoding (GPT), WordPiece (BERT), Unigram Language Modeling (T5; ASR "unagram"). Only BPE is covered. The description says the next video codes BPE in Python from scratch.
- 5:23 BPE (slide): start with a vocabulary of all individual characters in the corpus. Repeat: choose the two symbols most frequently adjacent in the training corpus (count all bigrams; ASR "biogram"), say "A" and "B"; add merged symbol "AB" to the vocabulary; replace every adjacent "A" "B" with "AB" in the corpus. Until k merges have been done.
- 6:44 Example corpus (slides, lowercase): "fred fed ted bread, and ted fed fred bread" (a tongue twister). Spaces and punctuation are treated as individual characters "in this example and most examples". Initial vocabulary on the slide: {a, b, d, e, f, n, r, t, space}; the speaker says the comma was forgotten and belongs there.
- 7:30 Iteration 1 counts (top four shown): "d_" 7, "ed" 6, "re" 4, "_f" 3. The speaker notes a real run must count all pairs, invites the viewer to verify, and says "I hope that's correct". Merge "d_" (7 occurrences). Vocabulary keeps "d" and space and adds "d_".
- 9:31 Iteration 2 counts (slide): "e"+"d_" 6, "re" 4, "d_"+"f" 4, "f"+"r" 3. Merge "ed_" (6 occurrences).
- 10:22 After 4 merges the merge rules (slide): d + _ -> d_; e + d_ -> ed_; f + r -> fr; fr + ed_ -> fred_. Vocabulary with ids: a 1, b 2, d 3, e 4, f 5, n 6, r 7, t 8, _ 9, d_ 10, ed_ 11, fr 12, fred_ 13.
- 11:05 Encoding "ted and fred are friends": apply the rules one by one in order (d_ occurs 3 times), then map tokens to ids. Spoken: t -> 8, ed_ -> 11, a -> 1. Slide output: 8 11 1 6 10 7 1 7 4 9 12 ? 4 6 3 ?.
- 12:53 "i" and "s" get "?" because they were never seen in training. The speaker calls this very rare: a real corpus would probably contain all characters; it happened only because the corpus was tiny; "you don't have to worry about this in a real world situation, at least for subword tokenization".
- 13:52 Outro (like/subscribe request; removed). Final word at 14:20 unintelligible in ASR.

## Implementation
Algorithm (character-level BPE, as taught):
1. tokens = list(corpus); vocab = sorted unique characters; rules = [].
2. Repeat k times: count Counter(zip(tokens, tokens[1:])); take the most frequent pair (a, b); append (a, b) to rules and a+b to vocab; replace every adjacent a, b (left to right, non-overlapping) with a+b.
3. Assign ids 1..N in vocabulary order.
4. Encode new text: tokens = list(text); apply every rule in training order; map tokens to ids; unseen tokens -> "?".

Author's Python (standard library only; not from the video), verified output in comments:
```python
from collections import Counter

def merge(tokens, a, b):
    out, i = [], 0
    while i < len(tokens):
        if i + 1 < len(tokens) and tokens[i] == a and tokens[i + 1] == b:
            out.append(a + b); i += 2
        else:
            out.append(tokens[i]); i += 1
    return out

def train(corpus, k):
    tokens = list(corpus); vocab = sorted(set(tokens)); rules = []
    for _ in range(k):
        (a, b), n = Counter(zip(tokens, tokens[1:])).most_common(1)[0]  # ties: first seen
        rules.append((a, b)); vocab.append(a + b); tokens = merge(tokens, a, b)
    return vocab, rules

def encode(text, vocab, rules):
    tokens = list(text)
    for a, b in rules:
        tokens = merge(tokens, a, b)
    ids = {t: i + 1 for i, t in enumerate(vocab)}
    return tokens, [ids.get(t, "?") for t in tokens]

VOCAB = ["a", "b", "d", "e", "f", "n", "r", "t", " ", "d ", "ed ", "fr", "fred "]
RULES = [("d", " "), ("e", "d "), ("f", "r"), ("fr", "ed ")]
encode("ted and fred are friends", VOCAB, RULES)[1]
# -> [8, 11, 1, 6, 10, 13, 1, 7, 4, 9, 12, '?', 4, 6, 3, '?']
train("fred fed ted bread, and ted fed fred bread", 4)[1]
# -> [('d', ' '), ('e', 'd '), ('ed ', 'f'), ('ed ', 'b')]
```

Token counts (author, by code): corpus 42 characters (10 unique incl. comma) -> 35 after d_ -> 29 after ed_ -> 27 after fr -> 25 after fred_ (slide rules). New sentence 24 characters -> 16 tokens (d_ 3 occurrences, ed_ 2, fr 2, fred_ 1).

Corrections found by running the example (the report keeps the speaker's text as said and lists these separately):
| Check | Video | Code | Verdict |
|---|---|---|---|
| iter 1: d_, ed, re, _f | 7, 6, 4, 3 | 7, 6, 4, 3 | match |
| iter 2: ed_, re | 6, 4 | 6, 4 | match |
| iter 2: d_ followed by f | 4 | 3 | overstated |
| iter 2: fr | 3 | 2 | overstated |
| merge 3 under strict counting | f + r | ed_ + f (3 vs fr 2) | differs |
| merge 4 under strict counting | fr + ed_ | ed_ + b (several ties at 2; first seen) | differs |
| id of fred_ in output | 7 | 13 (7 is r) | slide typo |
| tokens in new sentence | 16 | 16 | match |

General knowledge (author, not from the video): GPT-2 and later GPT tokenizers use byte-level BPE (base vocabulary of 256 byte values), so there are no unknown symbols; the video teaches the character-level variant.

## Quick Reference
| Item | Value | Time |
|---|---|---|
| character vocab on slide | 30: a-z 1-26, ! 27, @ 28, # 29, $ 30 | ~1:03 |
| character vocab with extras | "maybe about 100" | ~1:30 |
| word vocab on slide | a 1, ab 2, abbreviation 3, jungle 92382, zulu 173248 | ~2:04 |
| word ids on slide | hello 86241, there 129041, you 164234, are 1324, amazing 914 | ~2:27 |
| subword examples | ly, ence, tion | ~4:48 |
| algorithms | BPE (GPT), WordPiece (BERT), Unigram LM (T5) | ~5:00 |
| corpus | fred fed ted bread, and ted fed fred bread | ~6:44 |
| initial vocab | a b d e f n r t space (+ comma, forgotten) | ~7:13 |
| iter 1 top 4 | d_ 7, ed 6, re 4, _f 3 | ~7:37 |
| iter 2 top 4 (slide) | ed_ 6, re 4, d_f 4, fr 3 | ~9:37 |
| merge rules | d_, ed_, fr, fred_ | ~10:28 |
| final vocab | 13 tokens, ids 1-13 | ~10:58 |
| encoded sentence (slide) | 8 11 1 6 10 7 1 7 4 9 12 ? 4 6 3 ? | ~12:36 |

## Comparisons
| Aspect | Character | Word | Subword (BPE) |
|---|---|---|---|
| vocabulary size | small (30; ~100) | very large (173248 on slide) | set by k (example 9 + 4 = 13) |
| sequence length | long | short | in between |
| cost | slower models (more ids) | more memory | the balance |
When to choose (per video): subword when you want a small vocabulary without long sequences; it is what GPT, BERT and T5 use (different algorithms).

## Open Questions & Extension Ideas
- The video does not cover how ties are broken, how many merges real tokenizers use, or byte-level BPE.
- Word tokenization's "more complicated" training process is deferred and not covered here.
- Used in ZVect (2026-10-11): lesson 3.1 Tokenization (characters or words to vocabulary ids, four languages) and lesson 3.2 BPE (round slider, live pair counts, merge rules, encoding of a new sentence; all numbers computed live, not copied from the slides). Token ID moved to 3.3.
- Still a proposal: cite this video in ZVect 7.1 LLM input (tokenization precedes embedding).

## Tags & Triggers
tokenization, byte-pair-encoding, bpe, subword, wordpiece, unigram, vocabulary, token-id, merge-rules
- How does BPE work step by step?
- Character vs word vs subword tokenization trade-offs?
- How are BPE merge rules applied to new text, and in what order?
- Why do unknown tokens appear in a small BPE example?

## References
- Raj Pulapakura, YouTube, 2024-01-24, https://www.youtube.com/watch?v=BcxJk4WQVIw (timestamps ~m:ss).
- Articles linked in the video description (not read): "Word, Subword, and Character-Based Tokenization: Know the Difference"; "Byte-Pair Encoding: Subword-based tokenization algorithm" (towardsdatascience.com).

## Processing Notes
- License: standard YouTube license (no Creative Commons string on the watch page, checked 2026-10-11) -> own-words rewrite; transcript kept in the session workspace only, not in the repo.
- Transcript: English ASR, 351 lines, 14,470 chars, SHA-256 b5828b94...a84b (in-page hash = reassembled text). Slides used to fix ASR: "bite pair"/"by parent coding" = byte pair encoding, "unagram" = Unigram, "biogram" = bigram, "chorus" = corpus, "currencies" = occurrences, "ROS" = "r occurs".
- Frames: 15 candidates captured through the built-in browser console channel (prefixes FRA, FRB, FRC), 5 used, player bar cropped; 4 own SVGs. The owner's "Character tokenization" reference screenshot (WIP202610031) is the slide at ~1:55 of this video.
- Checks: counts re-run in Python (Section "Implementation"); no web fact-check (pre-cutoff source; the only claims beyond the example are the three algorithm-model pairs, which match the author's general knowledge).
