# Let's build the GPT Tokenizer (Andrej Karpathy) — Claude Context
> Source: YouTube, Andrej Karpathy, "Let's build the GPT Tokenizer", 2:13:34, published 2024-02-20, https://www.youtube.com/watch?v=zduSFxRajkE · Generated: 2026-10-11
> Companion: docs/outhtm/20240220_Lets-Build-The-GPT-Tokenizer.html (Thai, own-words rewrite, 16 sections, 6 frames + 2 own SVGs)

## TL;DR
Karpathy builds a GPT-style byte-level BPE tokenizer from scratch in a notebook, then layers on what production tokenizers add: text → UTF-8 bytes (base vocab 256) → BPE merges (new ids 256, 257, …) until vocab_size → merges (ordered) + vocab (id → bytes) give encode/decode. Real systems add a regex pre-split (GPT-2, GPT-4 cl100k_base), special tokens (<|endoftext|> = 50256 in GPT-2), and sentencepiece (Llama 2) works on code points with byte fallback. Vocab size is a trade-off (high tens of thousands to ~100k). Many LLM oddities (spelling, arithmetic, non-English cost, trailing space, SolidGoldMagikarp, JSON vs YAML) trace back to tokenization. Recommendation: reuse GPT-4 tokens via tiktoken; if training your own, sentencepiece BPE with Meta's settings, carefully; the ideal is "tiktoken with training code" (minbpe is the prototype).

## Key Concepts
- 0:00 Tokenization is the least favourite but necessary part; many oddities trace back to it. Previous video: Shakespeare, 65-character vocab, embedding table with 65 rows, row = trainable vector fed to the Transformer.
- 0:03 GPT-2 paper: vocab 50,257, context 1,024. Llama 2 paper: 2 trillion tokens; "token" appears 63 times.
- 0:04 List of oddities (spelling, string processing, non-English, arithmetic, GPT-2 Python, trailing whitespace warning, SolidGoldMagikarp, YAML over JSON).
- 0:05:50 tiktokenizer web app (GPT-2): sample text = 300 tokens; "tokenization" = 3642 + 1634; " is" 318; " at" 379; " the" 262; space is part of the following token. 127 one token, 677 → " 6" + "77"; 804 two tokens; 4-digit numbers split arbitrarily. "Egg" (2 tokens) vs " Egg" (1) vs "egg" vs "EGG": same concept, different ids. Korean needs many more tokens (tokenizer training data mostly English). Python indentation spaces each token 220 → wasteful.
- 0:12 cl100k_base (GPT-4): same text 185 tokens; vocab ~50k → ~100k, roughly double context per text; but bigger embedding table and softmax → sweet spot. GPT-4 groups runs of spaces (4-space indent → one 3-space token + " if"; 7 spaces → one token): deliberate, part of GPT-4's coding gain.
- 0:15 Python strings = sequences of Unicode code points; ~150,000 characters, 161 scripts, Unicode 15.1 (Sep 2023); ord("h") = 104. Code points as vocab: too large and the standard keeps changing.
- 0:18 UTF-8 (1–4 bytes, variable, ASCII-compatible; "UTF-8 Everywhere" manifesto) vs UTF-16/UTF-32 (many zeros for ASCII, wasteful). Raw bytes = vocab 256 → sequences too long for finite context → BPE to compress bytes; vocab size becomes a tunable hyperparameter.
- 0:22 Tokenization-free byte-level hierarchical Transformer paper (not named in the clip; matches MEGABYTE, 2023) — promising but not yet proven at scale by many groups.
- 0:23:30 Wikipedia BPE toy: aaabdaaabac (11 tokens, vocab 4) → Z=aa (9, vocab 5) → Y=ab (7, vocab 6) → X=ZY (5, vocab 7).
- 0:27 Blog paragraph: 533 code points → 616 UTF-8 bytes. get_stats over consecutive pairs; top pair (101, 32) = "e " 20 times; max(stats, key=stats.get). New id 256; merge() left-to-right, skip 2 on match, guard last index; toy [5,6,6,7,9,1] with (6,7)→99 → [5,6,99,9,1]; 616 → 596.
- 0:34:40 Training loop on the whole post: vocab_size 276 → 20 merges; copy list; merges dict (child1, child2) → new id; a binary forest; new tokens can merge again (20th merge on screen: (259, 256) → 275). 24,597 bytes → 19,438 tokens, compression 1.27X.
- 0:39:40 Tokenizer is a separate stage with its own training set, trained once; translation layer between raw text and tokens; LLM trained second, often on pre-tokenized data stored on disk. Language/code mix of the tokenizer training set decides merge density per language (more Japanese data → shorter Japanese sequences).
- 0:42:50 decode: vocab = {i: bytes([i])} for 0–255, then for each merge in insertion order vocab[idx] = vocab[p0] + vocab[p1] (dict order guaranteed since Python 3.7); join bytes; .decode("utf-8"). decode([128]) → UnicodeDecodeError "invalid start byte" (10000000 fits no UTF-8 pattern) → errors="replace" gives U+FFFD (OpenAI's code does the same).
- 0:48:50 encode: bytes → loop: stats = get_stats(ids); pair = min(stats, key=lambda p: merges.get(p, inf)) (earliest merge first); if pair not in merges: break; ids = merge(ids, pair, merges[pair]). Guard len(ids) < 2. Tests: encode→decode identity on training and unseen text; decode→encode is not an identity (not all token sequences are valid UTF-8). The merges dict is the tokenizer's only parameter set.
- 0:57 GPT-2 paper: avoid merges like "dog." "dog!" "dog?" → enforce top-down that some character categories never merge. encoder.py (really the tokenizer) uses the `regex` package pattern: 's|'t|'re|'ve|'m|'ll|'d| ?\p{L}+| ?\p{N}+| ?[^\s\p{L}\p{N}]+|\s+(?!\S)|\s+. re.findall splits text; each chunk is encoded independently and results concatenated, so merges never cross chunks. Issues: only ASCII apostrophe; no IGNORECASE (uppercase contractions split differently; code comment admits it); English-specific. \s+(?!\S) keeps the last space to prefix the next word (" you"). GPT-2 never merges runs of spaces in practice (all 220) → extra unpublished rules; GPT-2 training code never released (inference only).
- 1:11:40 tiktoken = official, inference-only. tiktoken_ext/openai_public.py: GPT-2 pattern (equivalent, faster form) and cl100k_base pattern: (?i:...) case-insensitive contractions, different whitespace handling, \p{N}{1,3} numbers up to 3 digits; vocab ~100k. Undocumented.
- 1:15 encoder.py: loads encoder.json (= our vocab, inverted) and vocab.bpe (= our merges); extra byte_encoder/byte_decoder layer is a spurious detail; bpe() loop identical in spirit.
- 1:18:40 Special tokens: GPT-2 encoder has 50,257 = 256 bytes + 50,000 merges + <|endoftext|> (50256), used to delimit documents; handled outside BPE by special-case code (tiktoken's Rust core), absent from encoder.py. Chat fine-tuning tokens (GPT-3.5-turbo <|im_start|>, <|im_end|>); tiktoken can be extended with custom special tokens. cl100k_base: ENDOFTEXT 100257, FIM_PREFIX 100258, FIM_MIDDLE 100259, FIM_SUFFIX 100260, ENDOFPROMPT 100276. Adding tokens = model surgery: add embedding row (small random init) and extend the final projection.
- 1:25:40 minbpe repo + exercise.md (4 steps to a GPT-4 tokenizer); match tiktoken's GPT-4 encoding, implement train (tiktoken has none). GPT-4's first merge: two spaces → 256. minbpe trained on the Taylor Swift Wikipedia page gives similar merges (e.g. "in" at 259) in different order; differences come from training data (GPT-4 likely had lots of Python).
- 1:28:50 sentencepiece (Llama, Mistral): trains and infers; BPE on code points; rare code points (character_coverage) → <unk> or byte_fallback to UTF-8 byte tokens. Toy: toy.txt, settings copied from Llama 2's tokenizer.model protobuf, model_type BPE, vocab_size 400; normalization turned off; "sentence" concept criticised; digit/whitespace splitting rules. Vocab order: <unk> 0, <s> 1, </s> 2 (pad −1 = unused), 256 byte tokens, merge parents, raw code-point tokens. Unseen Korean → byte tokens (ids shifted by 3); byte_fallback off → whole string becomes 0 (unk). Space shown as ▁; add_dummy_prefix makes "world" and " world" the same (Llama 2 uses it). Verdict: efficient but historical baggage, quirks, poor docs.
- 1:43:30 vocab_size appears only in the token embedding table and lm_head. Why not huge: compute, under-trained rare tokens, too much squashed per token. Typical: high tens of thousands to ~100k. Extending a pretrained vocab: resize embedding + lm_head, init small, often freeze base and train new params. Gist tokens: distil a long prompt into a few trained token embeddings (PEFT without touching weights).
- 1:49:50 Multimodal: keep the Transformer, tokenize images/video/audio; hard (discrete) vs soft tokens (autoencoder bottleneck); Sora "visual patches"; autoregressive vs diffusion.
- 1:51:40 Oddities explained: ".DefaultCellStyle" is one GPT-4 token → counts 3 "l" (true 4), reversal fails unless characters are listed first. Korean "hello how are you" 15 tokens vs English 5; "안녕하세요" 3 tokens. Arithmetic: arbitrary number chunks ("Integer tokenization is insane" blog: 4-digit splits 1+3, 2+2, 3+1); Llama 2 splits digits. GPT-2 Python spaces. "<|endoftext|>" in a prompt breaks GPT-4 output → special tokens as attack surface. Trailing space warning in gpt-3.5-turbo-instruct: " o" = 8840 vs lone space 220 → out of distribution. Partial token ".DefaultCellSta" → immediate stop sequence / flagged; tiktoken Rust has undocumented "unstable tokens" handling. SolidGoldMagikarp: odd embedding cluster; Reddit username frequent in tokenizer data but absent from LM data → embedding row never trained ("unallocated memory") → undefined behaviour. JSON 116 vs YAML 99 tokens for the same data.
- 2:10:20 Final recommendations (see TL;DR). "Eternal glory" to whoever removes tokenization.

## Implementation
```python
def get_stats(ids):
    counts = {}
    for pair in zip(ids, ids[1:]):
        counts[pair] = counts.get(pair, 0) + 1
    return counts

def merge(ids, pair, idx):
    out, i = [], 0
    while i < len(ids):
        if i + 1 < len(ids) and (ids[i], ids[i + 1]) == pair:
            out.append(idx); i += 2
        else:
            out.append(ids[i]); i += 1
    return out

def train(text, vocab_size):
    ids, merges = list(text.encode("utf-8")), {}
    for i in range(vocab_size - 256):
        stats = get_stats(ids)
        if not stats: break
        pair = max(stats, key=stats.get)          # ties: first seen (dict insertion order)
        merges[pair] = 256 + i
        ids = merge(ids, pair, 256 + i)
    vocab = {i: bytes([i]) for i in range(256)}
    for (a, b), idx in merges.items():            # insertion order matters
        vocab[idx] = vocab[a] + vocab[b]
    return merges, vocab

def encode(text, merges):
    ids = list(text.encode("utf-8"))
    while len(ids) >= 2:
        stats = get_stats(ids)
        pair = min(stats, key=lambda p: merges.get(p, float("inf")))
        if pair not in merges: break
        ids = merge(ids, pair, merges[pair])
    return ids

def decode(ids, vocab):
    return b"".join(vocab[i] for i in ids).decode("utf-8", errors="replace")
```
Regex pre-split (GPT-2): chunks = regex.findall(PAT, text); ids = concat(encode(chunk) for chunk in chunks). Special tokens are matched before BPE and mapped to reserved ids.

## Quick Reference
| Item | Value | Time |
|---|---|---|
| GPT-2 | vocab 50,257; context 1,024 | 0:03 |
| tiktokenizer | GPT-2 300 tokens → cl100k_base 185 | 0:06–0:13 |
| Unicode | ~150k chars, 161 scripts, v15.1 | 0:16 |
| Paragraph | 533 code points → 616 bytes; (101,32) ×20 → 596 | 0:27–0:34 |
| Training | vocab 276 = 20 merges; 24,597 → 19,438; 1.27X | 0:35–0:39 |
| decode 128 | invalid start byte → errors="replace" | 0:45 |
| cl100k regex | (?i:), \p{N}{1,3}, space runs | 1:13 |
| Special | <|endoftext|> 50256; cl100k 100257–100260, 100276 | 1:18–1:24 |
| sentencepiece toy | vocab 400; unk 0, bos 1, eos 2; 256 byte tokens | 1:31–1:39 |
| Vocab sizes | high 10ks to ~100k | 1:46 |
| Korean | 5 vs 15 tokens | 1:54 |
| JSON vs YAML | 116 vs 99 tokens | 2:09 |

## Comparisons
| | GPT-2 encoder.py | GPT-4 cl100k_base | sentencepiece (Llama 2) | minbpe |
|---|---|---|---|---|
| BPE over | UTF-8 bytes | UTF-8 bytes | code points (+ byte fallback / unk) | UTF-8 bytes |
| Vocab | 50,257 | ~100k | configurable (toy 400) | configurable |
| Pre-split | GPT-2 regex | new regex | own rules (digit split) | GPT-2/GPT-4 regex |
| Trainable | no (inference only) | tiktoken inference only | yes | yes (Python, slow) |

## Open Questions & Extension Ideas
- ZVect lesson 3.3 "GPT tokenizer (byte-level BPE)" playground: type text → UTF-8 bytes (Thai = 3 bytes per character, lead bytes 224, 184/185) → merge rounds with ids 256+ → compression ratio → decode round trip with errors="replace" → toggle regex pre-split.
- Unknowns in the clip: OpenAI's tokenizer training code and the exact rule that keeps GPT-2 space runs unmerged; why cl100k changed whitespace handling.
- Pair with NitMonk (YIR-KxNpSbA) for the token → embedding → attention half, and with the Raj Pulapakura BPE clip (character-level BPE).

## Tags & Triggers
Tags: tokenization, byte-level-bpe, bpe, utf-8, unicode, code-points, get-stats, merge, merges-table, vocab, encode-decode, errors-replace, compression-ratio, gpt2-regex, pre-tokenization, cl100k-base, tiktoken, special-tokens, endoftext, fim-tokens, model-surgery, minbpe, sentencepiece, byte-fallback, add-dummy-prefix, vocab-size, gist-tokens, multimodal-tokens, solidgoldmagikarp, trailing-whitespace, unstable-tokens, json-vs-yaml, karpathy
Triggers:
- How does the GPT tokenizer go from text to token ids?
- Byte-level BPE vs character BPE?
- Why do Thai / non-English texts use more tokens?
- What do the GPT-2 / GPT-4 split regexes do?
- What are special tokens and how do you add tokens to a model?
- Why do LLMs fail at spelling, arithmetic, or SolidGoldMagikarp?

## References
- https://www.youtube.com/watch?v=zduSFxRajkE
- https://github.com/karpathy/minbpe · https://tiktokenizer.vercel.app · https://github.com/openai/tiktoken · https://github.com/google/sentencepiece

## Processing Notes
- License: standard YouTube → own-words rewrite; code in the report rewritten by the author to behave like the clip's code, not copied from screen. Transcript: English ASR, 3,422 lines (sha256 prefix 2c43c5cbbcdbe8e2); not stored in the repo.
- ASR corrections checked against frames: 50,257; 1,024; 20th merge (259, 256) → 275 (ASR "25 and 259"); "2556" = 256; tiktokenizer.vercel.app (speaker rounded 24,597 / 19,438 to 24,000 / 19,000 — not an ASR error); minbpe; im_start. Tail after 2:12:50 is leftover outtakes, ignored.
- Published 2024 → inside the author's knowledge; no web fact-check. Author additions are labelled (MEGABYTE name, Thai UTF-8 byte facts, ZVect lesson link).
- 6 frames cropped (webcam removed): tiktokenizer cl100k 185; 20 merges; 1.27X + separate-stage diagram; openai_public.py cl100k special tokens; minbpe vs GPT-4 merges; JSON vs YAML. 2 own SVGs (pipeline, Wikipedia toy).
