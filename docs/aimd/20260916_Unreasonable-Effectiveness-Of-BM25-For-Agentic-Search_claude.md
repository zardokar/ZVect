# The unreasonable effectiveness of BM25 for agentic search — Jo Kristian Bergum, Hornet.dev (AI Engineer World's Fair) - Claude Context
> Source: YouTube, AI Engineer, "The unreasonable effectiveness of BM25 for agentic search — Jo Kristian Bergum, Hornet.dev", 18:28, published 2026-09-16 · https://www.youtube.com/watch?v=fZH97QHHYjY · Generated: 2026-10-13
> Companion: 20260916_Unreasonable-Effectiveness-Of-BM25-For-Agentic-Search.html (Thai, iw mode `iwd`, 15 sections, 17 frames + 5 own SVG)

## Processing Notes
- Mode: `iwd`. Body: own-words deep analysis (standard YouTube license); slide text, numbers and query strings transcribed exactly.
- Frames used: 01_title, 02_about, 03_agentic-loop, 04_scoring-function, 05_user-changed, 06_browsecomp-loop, 07_floppy-context, 08_retrieval-quality, 09_trajectory, 10_query-workload, 11_which-bm25, 12_why-it-works, 13_bm25-plus-grep, 14_evals, 15_hornet-chart, 16_four-claims, 17_references.
- Own SVG diagrams: cycle, bars, bars, bars, bars.
- Transcript SHA-256 (in-page = decoded): `c6dda71a682bf14ff8eacb9469ea2c13c0c4695188ce1e0fa1ea8ca651503e3d`; kept in the session workspace only.

## TL;DR
Jo Kristian Bergum (CEO, Hornet.dev) argues that BM25 itself has not changed ("BM25 did not become magic. The user changed."): LLM agents such as GPT-5 bring general knowledge, write long and specific queries (operators, years, entities, quoted phrases) and re-query many times, which makes simple lexical tools (BM25, grep) much stronger in agentic search. Evidence comes from BrowseComp-Plus (830 questions, 100,195 web pages) and Pi-Serini, whose slide shows that "which BM25" matters: default k1=0.9, b=0.4 gives 64.0% answer accuracy, tuned k1=25, b=1 gives 82.0% on the same 100-query subset. The speaker never writes or reads a BM25 formula; the slides only show `score(query, document)`, the k1/b values and the metric name nDCG@10. This report displays every formula the slides refer to (textbook BM25, Lucene BM25, two IDF forms, NDCG) as author additions, clearly labelled, with worked substitutions using the clip's numbers.

## Key Concepts
1. **Agentic search (slide 03, ~1:05-2:15)** = search inside an agent loop. Three parts: a capable model (chooses when to search, formulates queries), a harness (runs the loop, defines the tool contract e.g. `search(query)`, manages budgets: context, calls, cost; tool calling or "code mode"), a retrieval engine (ranks candidates cheaply, exposes results, handles repeated searches; "potentially over billion scaled document sets").
2. **BM25 is a scoring function (slide 04, ~2:15-3:32).** "Best Match 25"; speaker's story: experiment number 25 was the best (not confirmed). Slide: "Okapi/TREC-era lexical ranking from the 1990s"; `score(query, document)`: "Term rarity, term frequency, and document length normalization become one number." Serving is separate: inverted index + WAND (posting lists -> upper bounds -> skip candidates -> top-k heap). The function has not changed.
3. **The user changed (slide 05, ~3:32-4:53).** Single-shot baseline: "BM25 was the thing you beat" (short human query, one ranked list, nDCG@10). Agent loop: "BM25 is a interpretable primitive" (general knowledge in model, detailed queries, relevance feedback across turns).
4. **BrowseComp-Plus (slide 06, ~4:53-6:01).** 830 riddle-like multi-hop questions (spoken: "almost or exactly 830"), fixed corpus 100,195 web pages (spoken: "about 105,000 or 100,000"); one tool `search(query)` returning BM25 top-5 snippets; GPT-5 agent; judge scores the final answer.
5. **Floppy-disk context (slide 07, ~6:01-6:40).** Corpus 736M tokens; 1.44 MB floppy ~ practical context window ~350K-370K tokens at ~4 bytes/token; before context rot only ~0.05% of the corpus fits. Spoken: degradation "in my opinion around 350,000 tokens".
6. **Retrieval quality drives answer quality (slide 08, ~6:40-8:14).** Retriever A 55.9%, retriever B 70.1% (same agent loop), oracle evidence 93%. "Reasoning is not the bottleneck." Verified: A = BM25 (55.90%), B = Qwen3-Embedding-8B (70.12%), oracle = gpt-4.1 93.49% (BrowseComp-Plus Table 1).
7. **Query sessions (slide 09, ~8:14-8:44).** Example trajectory: search 1 `site:newsroom 2017 acquisition founder` (broad clue query), search 7 `"appointment" 2019 founder` (narrow after reading), search 24 `"person name" "role" "date"` (verify answer).
8. **Power-user queries (slide 10, ~8:44-9:44).** AOL human median 2 terms (`home depot`); GPT-5 median 10 terms (`site:snooker.org 2021 UK Championship final Zhao Xintong Brecel "frame" "scores"`); GPT-5 first-query mean 19 terms. Not read aloud.
9. **Which BM25? (slide 11, ~9:44-10:50).** BM25 has two hyperparameters (not named aloud). BrowseComp-Plus's BM25 baseline was "terrible" because its parameters did not suit long documents. Pi-Serini (arXiv:2605.10848, Table 3, gpt-5.4, 300 s timeout, same 100-query subset): default k1=0.9, b=0.4 -> 64.0%; tuned k1=25, b=1 -> 82.0% (+18 points); surfaced evidence recall 84.6% -> 95.7%.
10. **Why BM25 fits agents (slide 12, ~10:50-12:03).** EXACT (names / dates / IDs / phrases), CHEAP (no embedding inference; some embedding models ~8B parameters), EXPLAIN (matched terms become the next move).
11. **BM25 + grep (slide 13, ~12:03-14:53).** DR-DCI (Jimmy Lin's group, Waterloo; arXiv:2606.14885): BM25 imports candidates into a file-system workspace (vfs, progressive disclosure), the agent uses `rg / grep`, `read lines`, `cat / sed`, `count / verify`. Slide numbers: 61% DCI read + grep vs Qwen3 retrieval agent 45%; 73.3% DR-DCI + reset. Speaker calls it a "hack" that rides model improvements in coding/bash/tool use.
12. **Evaluation (slide 14, ~14:53-15:23).** Classic IR (one query, one ranked list, nDCG@10) is "kind of dead" for agents; measure task success (slide: success, recall, calls, latency, cost).
13. **Hornet performance (slide 15, ~15:23-16:35).** 100M web documents, single node, same hardware, anonymized engines A/B/C, top-100; x axis QPS; y axis unlabeled, speaker corrected to latency. Vendor data.
14. **Four claims (slide 16).** The new user; Which BM25? (parser / chunks / fields / k1 / b / top-k); why it is effective (exact, cheap, inspectable, steerable in the loop); BM25 + grep is all you need (retrieve, inspect, narrow, verify, repeat).

## Implementation
Equations displayed in the report (numbering as in the HTML). Origin: "slide" = on a slide of the talk; "author" = added by the report writer, not in the clip.

1. Slide 04 notation: `\mathrm{score}(\text{query}, \text{document})` (slide); text under it: "Term rarity, term frequency, and document length normalization become one number."
2. Textbook BM25 with (k1+1) (author; Robertson & Zaragoza 2009):
   `\mathrm{score}(D,Q)=\sum_{q\in Q}\mathrm{IDF}(q)\cdot\frac{\mathrm{tf}(q,D)\,(k_1+1)}{\mathrm{tf}(q,D)+k_1\left(1-b+b\frac{|D|}{\mathrm{avgdl}}\right)}`
3. Lucene IDF (author): `\mathrm{IDF}(q)=\ln\left(1+\frac{N-n(q)+0.5}{n(q)+0.5}\right)`; at N = 100,195: n=1 -> 11.1094, n=10 -> 9.1635, n=1000 -> 4.6066, n=50,097 -> 0.6932, n=N -> 0.0000.
4. Floppy (slide 07 gives 1.44 MB, ~4 bytes/token, 350K-370K; the division is the writer's): `\frac{1.44\,\text{MB}}{4\,\text{bytes/token}}\approx 360{,}000` tokens.
5. Corpus share (slide numbers): `350{,}000/736{,}000{,}000\approx0.048\%`, `370{,}000/736{,}000{,}000\approx0.050\%` (slide: ~0.05%).
6. Slide 08 gaps: `70.1-55.9=14.2`, `93-70.1=22.9`.
7. Slide 11 parameter sets (slide): `(k_1,b)_{\text{default}}=(0.9,0.4),\ (k_1,b)_{\text{tuned}}=(25,1)`.
8. Slide 11 gains: `82.0-64.0=+18.0`, `95.7-84.6=+11.1`.
9. Lucene >= 8 / Anserini / bm25s "lucene" (author): `\mathrm{score}(D,Q)=\sum_{q\in Q}\mathrm{IDF}(q)\cdot\frac{\mathrm{tf}(q,D)}{\mathrm{tf}(q,D)+k_1\left(1-b+b\frac{|D|}{\mathrm{avgdl}}\right)}` (same ranking within one query as eq. 2 at fixed k1; scale differs by k1+1).
10. RSJ IDF (author; bm25s "robertson"): `\ln\frac{N-n(q)+0.5}{n(q)+0.5}`; negative when n > N/2 (N = 100,195, n = N -> -12.2080); bm25s clips to 0 unless allow_negative.
11. Length factor: `L(D)=1-b+b\frac{|D|}{\mathrm{avgdl}}`.
12-13. At |D| = 2 avgdl: default `k_1 L = 0.9(1-0.4+0.4\cdot2)=1.26`; tuned `k_1 L = 25(1-1+1\cdot2)=50`.
14-15. One term, IDF = 2.0, tf = 3 (author's numbers): default `2.0\cdot3/(3+1.26)=1.4085`; tuned `2.0\cdot3/(3+50)=0.1132` (textbook form: 2.6761 and 2.9434).
16. Half-saturation: `\frac{tf}{tf+k_1L}=\frac12 \iff tf=k_1L` (k1=0.9: one occurrence already passes half; k1=25: needs tf=25 at average length).
17. `\mathrm{DCG@}k=\sum_{i=1}^{k}\frac{\mathrm{rel}_i}{\log_2(i+1)}` (author; slides 05 and 14 name nDCG@10 only; standard BEIR/trec_eval form descending from Jarvelin & Kekalainen 2002, whose original used log_b i).
18. `\mathrm{NDCG@}k=\mathrm{DCG@}k/\mathrm{IDCG@}k`.
19. Worked: relevant at ranks 1, 3, 10 of 3 relevant -> `\frac{1+0.5+0.289}{1+0.631+0.5}=\frac{1.789}{2.131}\approx0.840`; one relevant at rank 2 -> 0.6309.

TF part of eq. 9 (IDF omitted), recomputed (recompute.py section A):

| tf | default 1x avgdl | default 4x | tuned 1x | tuned 4x |
|---|---|---|---|---|
| 1 | 0.526 | 0.336 | 0.0385 | 0.0099 |
| 3 | 0.769 | 0.602 | 0.1071 | 0.0291 |
| 10 | 0.917 | 0.835 | 0.2857 | 0.0909 |
| 30 | 0.971 | 0.938 | 0.5455 | 0.2308 |
| 100 | 0.991 | 0.981 | 0.8000 | 0.5000 |

Rank-flip example (author's numbers, same IDF): S = tf 2, |D| = 0.5 avgdl; L = tf 12, |D| = 4 avgdl. default (0.9, 0.4): S 0.7353, L 0.8584 (L first); tuned (25, 1): S 0.1379, L 0.1071 (S first); Lucene default (1.2, 0.75): 0.7273 vs 0.7547 (L); bm25s default (1.5, 0.75): 0.6809 vs 0.7111 (L).

Playbook for a builder (author): (1) state the IDF form, TF form (with or without k1+1), k1, b, tokenizer/parser, chunking, fields and top-k whenever "BM25" is reported; (2) tune k1, b on your own question set, long documents may want large k1 and b near 1; (3) give agents a lexical tool whose matches are inspectable; (4) evaluate end-to-end task success, recall, number of calls, latency and cost, not only per-query nDCG@10.

## Quick Reference
| Item | Value | Origin |
|---|---|---|
| BM25 name | Best Match 25; Okapi/TREC-era (1990s) | slide 04, spoken ~2:35 |
| Default BM25 (Anserini) | k1=0.9, b=0.4 -> 64.0% | slide 11 |
| Tuned BM25 | k1=25, b=1 -> 82.0% (+18) | slide 11 |
| Surfaced evidence recall | 84.6% -> 95.7% (+11.1) | slide 11 |
| Pi-Serini setting | arXiv:2605.10848, Table 3, gpt-5.4, 300 s timeout, 100-query subset | slide 11 |
| BrowseComp-Plus | 830 questions, 100,195 pages, arXiv:2508.06600 | slide 06 |
| Retriever A / B / oracle | 55.9% / 70.1% / 93% | slide 08 |
| Corpus tokens | 736M; ~0.05% fits before context rot | slide 07 |
| Floppy | 1.44 MB ~ 350K-370K tokens at ~4 bytes/token | slide 07 |
| Query length | AOL 2 terms; GPT-5 median 10; first query mean 19 | slide 10 |
| DR-DCI | 61% (read + grep) vs 45% (Qwen3 agent); 73.3% with reset | slide 13 |
| Agentic eval metrics | success, recall, calls, latency, cost | slide 14 |
| Hornet chart | 100M web docs, top-100, one node, y = latency | slide 15 + Q&A |
| Lucene defaults | k1=1.2, b=0.75; Lucene >= 8 drops k1+1 | author (Lucene javadoc) |
| bm25s defaults | k1=1.5, b=0.75, delta=0.5, method="lucene" | author (bm25s source) |

## Comparisons
- Default (0.9, 0.4) vs tuned (25, 1): 64.0% vs 82.0% accuracy; 84.6% vs 95.7% recall; TF part at tf=3, average length 0.769 vs 0.107; length factor at 4x avgdl 2.2 vs 4.
- Human vs agent user: 2 vs 10 terms (median), one query vs dozens (slide 09 shows search 24), plain words vs site:/years/entities/quoted phrases, BM25 as baseline-to-beat vs interpretable primitive, nDCG@10 vs trajectory metrics.
- Textbook (k1+1) vs Lucene >= 8 form: identical ranking per query at fixed k1, score scale differs by k1+1. Lucene IDF never negative; RSJ IDF negative for n > N/2.

## Fact Check
16 claims: 11 confirmed, 3 partly confirmed, 2 not found.
- Confirmed: Okapi/TREC 1990s origin; 830 questions; 100,195 documents (spoken "105,000" is off); oracle ~93% (gpt-4.1 93.49%); 55.9/70.1 = BM25 / Qwen3-Embedding-8B; Pi-Serini 64.0 -> 82.0 and 84.6 -> 95.7 (abstract: +18.0, +11.1); Lucene >= 8 removed k1+1 (LegacyBM25Similarity javadoc, defaults k1=1.2, b=0.75); DR-DCI title/authors and 73.3%; AOL accidental release (2006-08-04, ~20M queries, 650K users); speaker is Hornet CEO; bm25s defaults to the Lucene method.
- Partly: "experiment number 25" origin (BM = Best Match confirmed, story not found); BM25 baseline "terrible" (BrowseComp-Plus does not state k1/b; Pi-Serini names (0.9, 0.4) as Anserini default); ~4 bytes per token (common rule of thumb, tokenizer dependent).
- Not found: DR-DCI slide's 61% / 45%; Hornet's 2 / 10 / 19 term statistics.

## Open Questions & Extension Ideas
- Which exact Lucene/Anserini version and analyzer did Pi-Serini use (stemming, stop words)? It changes tf and |D|.
- Does k1=25, b=1 transfer to short chunks (e.g. a Thai Q&A corpus of short report paragraphs)? Likely not; tune on a held-out set.
- Hornet's chart has no y-axis label and anonymized engines; an independent benchmark would be needed.
- For a no-LLM retrieval page: BM25 + an inspectable "matched terms" display gives the EXPLAIN property to human users too.
- The 61% / 45% DR-DCI numbers should be checked against the full paper.

## Tags & Triggers
BM25, Okapi BM25, k1, b, IDF, Lucene BM25Similarity, Anserini, Pyserini, bm25s, agentic search, BrowseComp-Plus, Pi-Serini, DR-DCI, grep, ripgrep, progressive disclosure, nDCG@10, Hornet, Jo Kristian Bergum.
Triggers: "which BM25 formula", "Lucene vs textbook BM25 k1+1", "BM25 parameters long documents", "BM25 for LLM agents", "BrowseComp-Plus BM25 baseline", "evaluate agentic search".

## References
- Talk: https://www.youtube.com/watch?v=fZH97QHHYjY (AI Engineer, 2026-09-16; recorded 2026-06-30)
- BrowseComp-Plus, arXiv:2508.06600
- Pi-Serini, arXiv:2605.10848
- Beyond Semantic Similarity ... Direct Corpus Interaction, arXiv:2605.05242 (slide only, not read)
- Towards Retrieving Interaction Spaces for Agentic Search, arXiv:2606.06880 (slide only, not read)
- DR-DCI, arXiv:2606.14885
- Lucene LegacyBM25Similarity javadoc 8.1.1: https://lucene.apache.org/core/8_1_1/misc/org/apache/lucene/search/similarity/LegacyBM25Similarity.html
- bm25s source: https://github.com/xhluca/bm25s
- Xapian BM25 notes: https://xapian.org/docs/bm25.html
- Robertson & Zaragoza (2009); Jarvelin & Kekalainen (2002)
- Recompute script: recompute.py (stdlib) in the job folder; output recompute.out
