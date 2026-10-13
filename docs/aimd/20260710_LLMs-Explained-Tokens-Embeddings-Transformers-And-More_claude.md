# LLMs Explained: Tokens, Embeddings, Transformers and More — Syntax (CJ) - Claude Context
> Source: YouTube, Syntax (speaker CJ), "LLMs Explained: Tokens, Embeddings, Transformers and More", 51:48, published 2026-07-10 · https://www.youtube.com/watch?v=YmLp8qe87A0 · Generated: 2026-10-12
> Companion: 20260710_LLMs-Explained-Tokens-Embeddings-Transformers-And-More.html (Thai, iw mode `iwd`, 17 sections, 9 frames + 2 own SVG)

## Processing Notes
- Mode: `iwd`. Body: own-words rewrite, complete, with fact-check and a check against the speaker's code (standard YouTube license).
- Frames used: 01_xor-weights, 02_bpe-merges, 03_transformer-block, 04_train-embeddings, 05_corpus, 06_qkv, 07_transformer-config, 08_top-p, 09_autoregressive.
- Own SVG diagrams: cycle, timeline.
- Transcript SHA-256 (in-page = decoded): `7e01b7fe4413c1461e468d073d2f7bc589f893131937b734b1e4d7ab2c8b345c`; kept in the session workspace only.

## TL;DR
Syntax (speaker CJ, 51:48) walks from keystroke to streamed answer by building a tiny LLM stack in code, with history at each step: rule-based chatbots (ELIZA 1966, PARRY 1972, ALICE 1995, SmarterChild 2001) → neural networks (McCulloch–Pitts 1943, perceptron 1958, Perceptrons/XOR 1969, backprop 1986; XOR demo: a model is a weights file, 3 numbers single-layer, 17 numbers 2-4-1) → BPE tokenization (Gage 1994, Sennrich et al. 2015; "the cat sat on the mat" → 7 merges, 6 tokens; Bee Movie → 2,088 tokens) → embeddings (Frege 1884, Firth 1957, word2vec 2013; own skip-gram on 107 sentences, 32 dims; queen↔king 0.92) → transformer (LSTM + Bahdanau attention → "Attention Is All You Need" 2017; Q/K/V self-attention, multi-head, feed forward, stacked blocks; "bank" gets different vectors by sentence) → own transformer writing children's stories (config vocab 392, ctx 32, emb 32, 2 heads, ff 128, 6 layers; speaker says 52,000 params) → softmax, temperature, top-p → autoregressive loop, context window → pre-training, fine-tuning, RLHF → tool calling via JSON + harness → Dartmouth 1956 and the speaker's view that LLMs are sophisticated pattern-matching autocomplete ("alien intelligence", "not necessarily" a fake human intelligence). Fact-check (33 rows): 17 confirmed, 10 partly, 2 not found, 4 contradicted — top-p definition wrong; 6-layer config has 102,792 params (52,000 matches the 2-layer default, 51,976); repo MAX_MERGES = 1000 not 10,000; word2vec window default 2, max 5, not "five or six".

## Key Concepts
- 0:00 Shannon's 1950 next-letter guessing game with his wife Betty: given enough context the next letter is "often nearly certain"; language has deep statistical structure; LLMs are statistical models of language predicting what comes next ("pretty much" what an LLM does), but much machinery comes before the prediction.
- 1:54 Chatbot history: Turing 1950 (Turing test); ELIZA 1966 (Weizenbaum, MIT; pattern matching, Rogerian therapist, rule-based; secretary anecdote; "delusional thinking" quote); PARRY 1972 (Colby, Stanford; anger/fear/mistrust states; psychiatrists could not tell it from patients; ELIZA–PARRY connected); ALICE 1995 (41,000 handwritten patterns); SmarterChild 2001 (AIM). All rules/scripts/templates/decision trees → "a completely different mechanism" from ChatGPT.
- 4:21 Rule-based chatbot code: greeting list; strip special characters; "I feel X" → "Why do you feel X?" with I→you; "my X" → "Tell me more about your X"; random catch-all ("Please go on"). Black-box framing: input → process → output; replace the box with an LLM.
- 7:41 Model = neural network: neurons in layers (input, hidden, output), weights on connections. History: McCulloch & Pitts 1943 (on-off logic gates, thought experiment); Rosenblatt perceptron 1958 (Navy press conference, NYT "embryo … conscious of its existence"); Minsky & Papert "Perceptrons" 1969 (single layer cannot do XOR; multi-layer could but no training method); Rumelhart, Hinton, Williams 1986 backprop (predict, measure error, propagate backward, adjust, repeat "billions of times"); every modern network uses "some variant".
- 10:27 XOR demo: single-layer fails after 5,000 iterations; multi-layer loss very low by ~800 iterations; outputs rounded to 0/1/1/0. Training writes a weights file in .data: "a model is literally just a file with weight values". Single layer = 2 weights + 1 bias = 3 numbers; hidden layer of 4: 2×4 weights + 4 biases + 4 weights + 1 bias = 17. Training loop: compute output, error, derivative (delta), adjust; epochs default 5,000; weights start random; multi-layer has output delta and hidden delta.
- 15:35 Tokenization: token = smallest unit; "the" one token; "tokenization" might be "token" + "ization"; a space often part of a token; newline a token; emoji might be several. BPE: Gage 1994 compression (merge most frequent pair, repeat); Sennrich, Haddow & Birch (ASR "Alexander"; actually Alexandra) 2015, Edinburgh, vocabularies for NMT; one algorithm for English, Japanese, code, emoji. Token count sets cost (per-token pricing) and what fits in the context window.
- 17:55 Tokenizer code: "the cat sat on the mat" → merges a+t→at ×3, t+h→th ×2, th+e→the ×2, c+at→cat, s+at→sat, o+n→on, m+at→mat; vocabulary 6 unique tokens. Max merges 3 → "at" and "the" become tokens, rest single letters. Steps: regex pre-split (BPE never merges across word boundaries; GPT-2/4 use a complex regex) → word frequencies as weights → loop up to max merges (speaker: set to 10,000) choosing the most frequent weighted pair. Bee Movie script → 2,088 tokens; max merges ~1,000 → "according" split into 4 tokens. Token IDs = index in vocabulary, arbitrary, no meaning.
- 21:37 Embeddings: Frege 1884 context principle; Firth 1957 "You shall know a word by the company it keeps" = distributional semantics, "the thesis behind every embedding model". word2vec 2013 (Mikolov, Google): predict words from neighbours; king − man + woman ≈ queen emerged from statistics. Vector = list of numbers = point in high-dimensional space; word2vec "used 300 dimensions"; GPT-3 largest 12,288. Similar words are near (happy/joyful vs happy/refrigerator). Cosine similarity: speaker says 1 identical, 0 completely unrelated. Modern LLM embeddings are "direct descendants" of word2vec scaled to context.
- 24:39 Embedding training demo: pairwise similarity queen↔king 0.92, cat↔dog 0.73, king↔cat 0.47, queen↔cat 0.42, king↔dog 0.34, queen↔dog 0.33; analogies king−man+woman=queen (0.84), queen−woman+man=king (0.86), prince−boy+girl=princess, kitten−cat+dog=puppy. Corpus ~107 parallel sentences ("the king is a man who rules" / "the queen is a woman who rules"). Skip-gram (CBOW mentioned): pairs within window (speaker: "five or six") → 3,970 pairs; weights file = vocab × dim (32) initialised random; each epoch pull co-occurring pairs together, push never-co-occurring apart; analogy = look up, subtract/add, nearest word. Modern models embed sentences/paragraphs at massive scale.
- 30:48 Transformer history: 2016 Google translation on LSTMs (sequential, slow); attention from Bahdanau, Cho, Bengio 2014 (look back at the input instead of one fixed-size vector) bolted onto LSTMs; 2017 Uszkoreit proposed attention only; 8 equal-contribution authors; "Attention Is All You Need"; cited 100,000+; all authors left Google; 15 pages, free to read.
- 32:33 Transformer block: mostly matrix multiplication; intelligence is in billions of trained numbers that start random. Block = attention (tokens exchange information) + feed forward (each token alone). Self-attention: query (what this token looks for), key (what each token offers), value (what is passed on); compare every query with every key, score, mix values; same shape out. "Bank of the river was muddy" vs "I went to the bank to deposit money" → different vectors. Multi-head: several Q/K/V sets in parallel; heads specialise emergently (pronouns, tenses, position); outputs combined. Feed forward: small two-layer network per token. Stack dozens to hundreds of blocks; early layers "tend to" capture syntax, middle meaning, late reasoning (speaker).
- 35:14 Own transformer: children's stories (30+ short stories, 4–5 sentences each); trained on a MacBook CPU (~14 cores) for over 1.5 h; "once upon a time" → "a" → "small"; other temperature/top-p → "a young". Output is a probability distribution over the vocabulary. Weights file: vocab, context length 32, merges, separate embedding + positional weights, per-block Q/K/V + feed-forward weights. Speaker: embedding 32, six layers, 52,000 parameters; contrasts gpt-oss-120b ("120 billion"). Code per block: Q/K/V by matrix multiply, Q·K scores → weights → times V → attention output; add input (prompt + position) and pass through feed forward; same size through every block; final probabilities. Speaker admits not understanding every intricacy: "it's not magic, it's just math".
- 41:37 Logits → softmax (sum to 1) → sample. Temperature: low predictable, high creative; 0 → same token every time; 1.5 much more random. Top-p: speaker says 1 = every token, 0.2 = "only the top 20% of tokens". Screen (~42:40): there 0.30, the 0.16, a 0.12, in 0.09, they 0.07, day 0.06, king 0.05, one 0.04, she 0.03, was 0.03, boy 0.02, on 0.01 with cumulative column 0.30, 0.46, 0.58, 0.67, 0.74, 0.80, ….
- 42:54 Autoregressive generation: append the token and rerun everything; no plan. Production models see system prompt + full conversation history + latest message; no memory between requests. Context window: toy 32 tokens; modern 100,000 to millions; long chats "might" degrade or hallucinate; later messages may weigh more in attention.
- 44:45 Full picture recap. Pre-training on web-scale data: Common Crawl (since 2008, petabytes), Wikipedia, Reddit, GitHub, books, papers, news, and copyrighted material companies "won't necessarily admit" using → "a really fancy autocomplete". Fine-tuning on curated Q&A pairs → chatbot-like. RLHF: hired humans rank responses; good/bad defined by the company and raters.
- 47:24 Tool calling: tool list and descriptions in context; models fine-tuned to emit structured tool calls (a JSON object); a harness (code editor, desktop app) executes and appends the result to history. Mixture of experts and thinking modes mentioned, not covered.
- 48:36 Dartmouth 1956: McCarthy, Minsky, Rochester, Shannon; ~10 people; Rockefeller $7,500; eight weeks; "first time the term artificial intelligence was ever used"; proposal quote. Transformer may not be the final architecture (description cites Mamba, xLSTM, Jamba, JEPA). Speaker's opinion: LLMs are "the most sophisticated pattern matching autocomplete things we've ever built", no true understanding; trained only on text, which is not how the brain runs; AI "probably better described as alien intelligence".

## Implementation
Toy transformer configuration and parameter count (from the screen and the repo, read via raw.githubusercontent.com on 2026-10-12):
```
config: type decoder-transformer, vocabSize 392, contextLen 32, embDim 32, numHeads 2, ffDim 128, numLayers 6
file:   transformer-weights-e2000-l6-d32-h2-ff128-ctx32.json   (written at runtime into .data/, not in the repo)
params = 2*V*D + V + C*D + 2*D + L*(4*D^2 + 2*D*F + 9*D + F)   # untied in/out embeddings, from weight-layout.ts
V=392, D=32, C=32, F=128:  L=6 -> 102,792   L=2 (code default) -> 51,976 (~ the "52,000" spoken)
```
Top-p as defined by Holtzman et al. 2019 (nucleus): sort probabilities, keep the smallest prefix whose cumulative sum >= p, renormalise, sample. With the on-screen distribution, p = 0.2 keeps {there}; p = 0.5 keeps {there, the, a} (cumulative 0.58).
```python
def top_p_filter(probs, p):            # probs: list of (token, prob) sorted descending
    kept, total = [], 0.0
    for tok, pr in probs:
        kept.append((tok, pr)); total += pr
        if total >= p: break
    return [(t, pr / total) for t, pr in kept]
```
XOR network sizes: single layer 2 weights + 1 bias = 3; 2-4-1 = 8 + 4 + 4 + 1 = 17 (repo's weights.md says 21, inconsistent with its own list).
BPE trainer as described: regex pre-split on spaces → word frequencies → repeat up to max merges: count every adjacent pair weighted by word frequency, merge the best pair in all words. Repo constant MAX_MERGES = 1000 (speaker said 10,000).
Skip-gram as described: (center, context) pairs within a window (repo: default 2, max 5; speaker said "five or six"); embeddings vocab × 32 random init; each epoch pull pair vectors together, push non-co-occurring words apart (negative pairs); analogy = a − b + c then nearest word by cosine.

## Quick Reference
| Item | Value | Time |
|---|---|---|
| Shannon game | 1950 (paper 1951) | 0:20 |
| ELIZA / PARRY / ALICE / SmarterChild | 1966 / 1972 / 1995, 41,000 patterns / 2001 | 2:15–3:45 |
| XOR | single layer fails at 5,000 iters; 2-4-1 low loss ~800 iters; 3 vs 17 numbers | 10:40–12:47 |
| BPE | Gage 1994; Sennrich, Haddow, Birch 2015 | 16:35–17:00 |
| Tokenizer demo | 7 merges, 6 tokens; Bee Movie 2,088 tokens | 18:00, 20:56 |
| word2vec | 2013; "300 dims"; GPT-3 12,288 | 22:45–23:50 |
| Embedding demo | 107 sentences, 3,970 pairs, 32 dims, queen↔king 0.92 | 25:00–28:20 |
| Attention Is All You Need | 2017, 8 authors, 100k+ citations, 15 pages | 31:41–32:20 |
| Toy transformer | vocab 392, ctx 32, emb 32, 2 heads, ff 128, 6 layers; >1.5 h on CPU | 35:45–37:47 |
| Params | said 52,000; repo formula 102,792 (6 layers) | 39:00 |
| gpt-oss-120b | said 120B; card 117B total, 5.1B active | 39:21 |
| Temperature | 0 same token; 1.5 very random | 42:00 |
| Context window | 100,000 to millions | 44:00 |
| Common Crawl | since 2008, petabytes | 45:40 |
| Dartmouth | 1956, $7,500, 8 weeks, ~10 people | 48:40 |

## Comparisons
| Topic | Old | New | Difference (as said) |
|---|---|---|---|
| Chatbots | rules/templates (ELIZA … SmarterChild) | LLM | "a completely different mechanism" |
| Networks | single-layer perceptron | multi-layer + backprop | XOR solvable |
| Translation ~2016 | LSTM + bolted-on attention | attention-only transformer | sequential LSTM is slow |
| Embeddings | word2vec, one vector per word | self-attention, context-dependent vector | "bank" example |
| Training | pre-training | fine-tuning → RLHF | autocomplete → chatbot |

## Fact Check
33 rows (A1–A25 + 8 repo checks): 17 confirmed, 10 partly, 2 not found, 4 contradicted (subagent web check + repo read via raw.githubusercontent.com, 2026-10-12; github.com tree pages refused; weights JSON not in the repo; repo may have changed after recording).
- Contradicted: top-p "top 20% of tokens" (nucleus = smallest set with cumulative probability ≥ p); 52,000 params for the 6-layer config (102,792; 2-layer = 51,976); word2vec window "five or six" (repo default 2, max 5); max merges 10,000 (repo 1000).
- Partly: ALICE 41,000 is a later category count; SmarterChild 17M+ users, no daily figure; 1958 perceptron demo ran on an IBM 704 (Mark I hardware later); word2vec paper tests 20–1000 dims; cosine 1 = same direction, 0 = orthogonal, min −1; gpt-oss-120b 117B total / 5.1B active; Dartmouth asked $13,500, got $7,500, term coined in the 1955 proposal; temperature 0 not deterministic in practice (repo min 0.1); "late layers = reasoning" unsupported (Tenney 2019 shows syntax → semantics ordering); toy config layers option 1–6 default 2.
- Not found: 3,970 pairs (runtime); Bee Movie 2,088 (user input).
- Confirmed: Shannon/Betty 1950 (secondary), Turing 1950, ELIZA 1966 + quote, PARRY 1972 (psychiatrists 48% = chance; ELIZA–PARRY 18 Sep 1972, RFC 439 Jan 1973), McCulloch–Pitts 1943, Perceptrons 1969, backprop Nature 1986, BPE 1994/2015, Frege, Firth, GPT-3 12,288, GNMT LSTM + Bahdanau 2014, Uszkoreit/8 equal/250k+ citations/all left Google/15 pages, context windows to millions, Common Crawl, XOR 2-4-1 = 17, corpus 107 sentences and 32 dims.

## Open Questions & Extension Ideas
- Author note: the speaker's positional-embedding explanation ("turns the prompt into a list of every possible token") does not match the standard design (token IDs → embedding rows + position vectors; output = scores over the vocabulary).
- Author note: "dot product of query times key gives us the value" is a slip; he then describes scores → weights → mix values.
- Teaching ideas: model-as-weights-file (count XOR numbers); BPE merge trace on a one-line corpus; top-p worked example on a real distribution; parameter-count formula from a config.

## Tags & Triggers
llm, history-of-ai, chatbot, eliza, neural-network, xor, backpropagation, tokenization, bpe, embeddings, word2vec, skip-gram, transformer, self-attention, multi-head-attention, positional-embedding, softmax, temperature, top-p, autoregressive, context-window, fine-tuning, rlhf, tool-calling, fact-checked
- "How does an LLM go from prompt to answer?"
- "Is a model just a weights file?"
- "What exactly is top-p?"
- "How many parameters does a small transformer have?"
- "How does tool calling work?"

## References
- Syntax (CJ), "LLMs Explained: Tokens, Embeddings, Transformers and More", YouTube, 2026-07-10, https://www.youtube.com/watch?v=YmLp8qe87A0
- Code: https://github.com/w3cj/how-llms-work (read via raw.githubusercontent.com/w3cj/how-llms-work/main: src/routes/train-transformer/weight-layout.ts, train.ts, transformer.ts; src/server/lib/bpe.ts; src/routes/train-embed/train.ts, corpus.ts; src/schemas/*; src/routes/neural-net/train.ts, weights.md)
- Fact-check: https://arxiv.org/abs/1706.03762 ; https://arxiv.org/abs/1904.09751 ; https://arxiv.org/abs/1301.3781 ; https://arxiv.org/abs/1508.07909 ; https://arxiv.org/abs/1409.0473 ; https://arxiv.org/abs/1609.08144 ; https://arxiv.org/abs/2005.14165 ; https://arxiv.org/abs/1905.05950 ; https://www.nature.com/articles/323533a0 ; https://en.wikipedia.org/wiki/ELIZA ; https://en.wikipedia.org/wiki/PARRY ; https://www.rfc-editor.org/rfc/rfc439.html ; https://en.wikipedia.org/wiki/Perceptron ; https://en.wikipedia.org/wiki/Dartmouth_workshop ; https://resource.rockarch.org/?p=22217 ; https://huggingface.co/openai/gpt-oss-120b ; https://commoncrawl.org/overview ; https://thinkingmachines.ai/blog/defeating-nondeterminism-in-llm-inference/ ; https://computerhistory.org/blog/smarterchild-a-chatbot-buddy-from-2001/ ; https://en.wikipedia.org/wiki/Cosine_similarity
