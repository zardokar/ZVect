# Training Your Own Embedding Model Is Not As Hard As You Think (EmbeddingGemma 2 fine-tuning) — Claude Context
> Source: YouTube, Prompt Engineering, "Training Your Own Embedding Model Is Not As Hard As You Think", 12:36, published 2026-10-08, https://www.youtube.com/watch?v=S7tFyREI19I · Generated: 2026-10-11
> Companion: docs/outhtm/20261008_Training-Your-Own-Embedding-Model-Is-Not-As-Hard-As-You-Think.html (Thai, own-words rewrite, every point and number)

## TL;DR
Off-the-shelf embedding models only know general data; fine-tuning on your own pairs is cheap. Unlike LLM fine-tuning there is no target vector — you only specify what should be close. Training data = (question, answering passage) pairs; MultipleNegativesRankingLoss supplies in-batch negatives for free; a no-duplicates batch sampler prevents false negatives; training and search prompts must match exactly; train only LoRA (<2% of weights). On Google's multimodal EmbeddingGemma 2 (A100, Unsloth notebook): ESC-50 sound top-1 24.5% → 65.8% (top-5 57.0 → 92.3) in ~7.5 min; own YouTube transcripts top-1 66.3% → 75.0% in <3 min. The model learns the given labels, not general hearing (10 held-out sounds did not improve). Side effect: general text search −3.6 nDCG@10 (59.2 → 55.6); image and voice search unchanged. Reload bug: the saved processor truncated audio to milliseconds.

## Key Concepts
- 0:00 EmbeddingGemma 2 = open model for multimodal retrieval; fine-tuning adapts it to your documents, product names, sounds. Demo: question → timestamped moment in the presenter's videos.
- 1:03 LLM fine-tune: input + exact target text. Embedding model outputs numbers meaningful only relative to each other (embedding space); no correct vector to write down; only "which things end up close".
- 2:03 Data: (customer question, help-center passage) pairs; no scores, no labelled wrong answers. Pulling pairs together alone is insufficient (collapse: everything at one spot).
- 2:27 In-batch negatives: batch of e.g. 32 pairs; own passage = positive, every other passage = negative; "multiple choice" mental model. Sentence Transformers: MultipleNegativesRankingLoss; same idea CLIP used for images+text.
- 3:33 Duplicate trap: two questions with the same passage in one batch → the copy is treated as wrong. Fix: no-duplicates batch sampler.
- 4:06 Prompt: short task prompt before queries; title + text format for documents; training format must equal production format.
- 4:37 LoRA: small trainable matrices next to frozen layers; <2% of weights in the presenter's runs; small adapter file.
- 5:11 Text, images, video, audio share the backbone → training on audio changes the parts serving photos and text; measure the cost.
- 5:33 Evaluate on unseen questions; split test by source (article / video / recording) to avoid leakage; question: general skill vs labels.
- 6:21 Notebook on Unsloth EmbeddingGemma 2 notebooks, A100 Colab. ESC-50: 50 everyday sounds; label → sentence ("the sound of a chainsaw"); classification becomes search.
- 7:11 Before: ~1 in 4 top-1 (24.5%); built-in classification prompt worse than writing the label as a query → prompting won't fix it.
- 7:35 Pairs = (label sentence, audio clip); duplicates matter (many clips per label). LoRA on audio encoder + backbone; ~7.5 min on A100. After: ~2 in 3 (65.8%) on unseen clips; some sounds from 0% to almost always (brushing_teeth 0→100%, toilet_flush 0→88% on slide).
- 8:35 Hold out 10 sounds entirely: trained sounds improve, held-out 10 do not → learns labels, not hearing; every label you care about must be in training data.
- 9:12 Cost: photo search and voice search unchanged; general text search −~4 points (slide: NanoBEIR nDCG@10 59.2 → 55.6; photo R@1 86.3 → 86.0; voice→photo R@1 95.0 → 96.0; R@5 99.0 → 99.0).
- 9:45 Bug: voice search dropped to ~0 after reload; adapter weights fine; saved processor cut every clip to a few ms. Fix: reuse the base model's processor (one line). Re-test after reloading audio adapters ("at least with the version I used").
- 10:25 Text: transcripts of 120 videos cut into short passages; Gemini 3.8 Flash writes one viewer-style question per passage (slide: 1,971 pairs); split by video. Before ~2 in 3, after <3 min training 3 in 4 (description: 66.3% → 75.0%); general text −~4 again.
- 11:34 Answer: yes, but learns labels not general skills and costs some general text search. Three things: pairs + no duplicates; test on unseen data split by source; check what else changed (shared backbone).

## Implementation
1. Collect (query, positive) pairs; for classification, turn each label into a sentence and pair it with examples.
2. Split train/test by source (document / video / recording), never by passage.
3. Format inputs exactly as at inference: query `task: search result | query: {q}`, document `title: {title} | text: {content}` (model card; `title: none` if none).
4. Load EmbeddingGemma 2 (Unsloth), add LoRA adapters (text backbone; for audio also the audio encoder).
5. Loss: MultipleNegativesRankingLoss, batch e.g. 32; sampler: BatchSamplers.NO_DUPLICATES.
6. Train minutes on A100; evaluate top-1/top-5 (or R@k, nDCG@10) on the held-out split; also evaluate held-out labels to test generalisation.
7. Regression suite on other modalities/tasks (image search, voice→image, NanoBEIR text) with and without adapter.
8. After save/reload, re-run evals; for audio adapters reuse the base processor if results collapse.
Loss (general knowledge, not shown in the video): L_i = −log( exp(s(q_i,p_i)) / Σ_j exp(s(q_i,p_j)) ), s = scaled cosine; a duplicate p_j = p_i in the denominator is a false negative.

## Quick Reference
| Item | Value | Time |
|---|---|---|
| Model | EmbeddingGemma 2 (open, multimodal) | 0:00 |
| Pairs | (question, answering passage) | 2:03 |
| Batch example | 32 | 2:36 |
| Loss | MultipleNegativesRankingLoss | 3:22 |
| Sampler | no-duplicates | 3:54 |
| Prompt | task prompt for query; title + text for docs | 4:06 |
| LoRA share | < 2% of weights | 4:58 |
| Hardware | A100 (Colab), Unsloth notebook | 6:21 |
| ESC-50 top-1 | 24.5 → 65.8 (top-5 57.0 → 92.3, slide) | 7:11–8:15 |
| ESC-50 training time | ~7.5 min | 8:00 |
| Held-out 10 sounds | no improvement | 8:39 |
| Side effects | photo R@1 86.3→86.0; voice→photo R@1 95→96; R@5 99→99; NanoBEIR nDCG@10 59.2→55.6 | 9:12 |
| Text data | 120 videos; Gemini 3.8 Flash questions; 1,971 pairs (slide) | 10:25 |
| Text top-1 | 66.3 → 75.0 (description); <3 min training | 11:03 |

## Comparisons
| Aspect | LLM fine-tune | Embedding fine-tune |
|---|---|---|
| Target | exact text | none; relative closeness only |
| Example | input + answer | (query, positive) pair |
| Negatives | not needed | free in-batch (watch duplicates) |
| Prompt | template must match | task prompt / title-text must match |
When to choose: fine-tune embeddings when retrieval must know your names/docs/sounds and you have pairs; re-test general search after each fine-tune; all labels must be in training data.

## Open Questions & Extension Ideas
- How much of the text drop is recoverable by mixing general pairs into training?
- Would hard negatives (mined near-misses) beat in-batch negatives here?
- ZVect toy: show in-batch negatives on a 2D table (pull pairs together, push others apart) and the duplicate false-negative.

## Tags & Triggers
Tags: fine-tuning-embeddings, embeddinggemma-2, contrastive-learning, in-batch-negatives, multiple-negatives-ranking-loss, no-duplicates-sampler, false-negatives, lora, unsloth, esc-50, multimodal-embeddings, train-test-split-by-source, prompt-format
Triggers:
- How is fine-tuning an embedding model different from fine-tuning an LLM?
- What training data does an embedding fine-tune need?
- What are in-batch negatives and why do duplicates hurt?
- Does a fine-tuned embedding model generalise to unseen labels?
- What does fine-tuning a multimodal embedding model cost other modalities?

## References
- https://www.youtube.com/watch?v=S7tFyREI19I
- Colab: https://colab.research.google.com/drive/1xq-84DLZsqteEzL52Qb__47Y_yGckeyB
- https://unsloth.ai/docs/models/embeddinggemma-2 · https://huggingface.co/google/embeddinggemma-2
- https://github.com/karolpiczak/ESC-50 · https://sbert.net/docs/package_reference/sentence_transformer/losses.html

## Processing Notes
- License: standard YouTube → own-words rewrite; English ASR (304 lines) kept out of the repo. ASR says "Embedding Gemini 2"; slides/description say EmbeddingGemma 2.
- Fact-check 2026-10-11 (independent search agent): 8 claims — confirmed 7, partly 1 (model card: separate vision 170M / audio 300M encoders + 270M text backbone into a shared 768-d space, 740M total), not found 0, contradicted 0.
- Slide-only numbers: top-5, R@k, NanoBEIR, 1,971 pairs, brushing_teeth/toilet_flush gains. Description-only: 66.3% → 75.0%.
- 6 frames (slides), 2 own SVGs.
