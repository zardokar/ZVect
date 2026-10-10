# How to Choose an Embedding Model by Task — Claude Context
> Source: YouTube, Byte Goose AI (podcast "Generative AI Futures"), "Vector Embeddings. How to choose the embedding model based on the task at hand. Semantic Search RAG.", 20:57, published 2026-02-28, https://www.youtube.com/watch?v=H6q1UWCCnKw · Generated: 2026-10-10
> Companion: docs/outhtm/20260228_How-To-Choose-An-Embedding-Model-By-Task.html (Thai, rewritten in the author's own words with every point and number, plus an 11-claim fact-check)

## TL;DR
Two hosts argue the embedding model sets the ceiling of a retrieval system: if text lands in the wrong place in vector space, prompt work downstream cannot fix it. They walk through: baseline RAG (e.g. 512-token chunks, bi-encoder, cosine top-k) vs advanced RAG with a reranker (faithfulness said to rise 0.347 -> 0.797; in the source paper 0.347 is the no-retrieval baseline, basic RAG is 0.621); bi-encoders (independent, fast) vs cross-encoders (joint attention, precise, expensive), used as candidate selection (~10,000) then rerank (10-100); MTEB rank does not transfer to specialised domains; a five-step clinical RAG playbook; the numeracy gap (EmbedNum-1K: 13 models, 1,000 synthetic financial questions, 54% average, ~62% on "0.x" decimals, LLM-based embedders ~5 points better) and the need for hybrid systems with symbolic solvers or metadata filters; Vertex AI options and the RAM cost of 3072 dims; model picks by task (classification, edge, multilingual, hybrid); MRL truncation; when to fine-tune (contrastive learning, hard negatives, false negatives); closing on GraphRAG.

## Key Concepts
- 0:00 Embedding choice sets the ceiling of intelligence and accuracy; developers tune prompts for weeks while the bottleneck is the latent-space representation; wrongly clustered concepts cannot be separated downstream.
- 1:15 Sources: the numeracy study, surveys of LLMs as text embedders, Vertex AI docs, clinical RAG playbooks.
- 1:55 Static, context-blind models (word2vec: "bank" has one coordinate) vs transformer models (BERT-style encoders or LLM decoder stacks). An embedding is a translation layer into a continuous high-dimensional space where distance = semantic similarity.
- 2:38 Baseline RAG: chunk (e.g. 512 tokens), bi-encoder, vector DB, embed query, cosine top-k, pass to LLM.
- 3:14 Claim: basic RAG faithfulness ~0.347 ("hallucinating or misreading over 60% of the time"); advanced RAG with better chunking and a reranker ~0.797.
- 4:04 Bi-encoders embed query and document separately and compare (dot product); millions of documents in milliseconds. Cross-encoders feed both into attention together; "quadratic, O(n^2)". A bi-encoder compresses the document into one fixed vector before seeing the query and loses word-level relations (apple/fruit vs the company). Standard pipeline: bi-encoder for ~top 10,000 candidates, cross-encoder for the top 10-100.
- 5:35 Generic leaderboards like MTEB mask operational requirements; #1 on general English data does not mean it survives a specialised domain.
- 6:00 Clinical RAG, prompt "get all the conditions of the patient"; errors can change treatment.
- 6:26 Step 1 chunking: naive 512-token splits can separate "not" from "pregnant" (semantic leakage); clinical playbook: 500-800 tokens, 10-20% overlap, preserve section headers ([ASSESSMENT], past medical history) because status depends on the header.
- 7:23 Step 2 model: generic embeddings miss jargon ("stat" = immediately). Playbook recommends gemini-embedding-001 on Google Cloud for its dimensionality (ASR "372"; actual max 3072); hosts claim a generic 768-dim model clusters CHF, cardiomyopathy and CAD too tightly.
- 8:19 Step 3 retrieval: expand the query (patient diagnosis, chronic illnesses, active problems); recall over precision; top 20-40 chunks.
- 9:02 Step 4 rerank + negation: affirmative bias; "denies diabetes", "rule out pneumonia" get retrieved; use a cross-encoder reranker or an LLM verifier to drop negated/unconfirmed diagnoses.
- 9:55 Step 5 structured summarisation: FHIR or strict JSON schema; confirmed/active/resolved status; ICD codes.
- 10:36 Numeracy blind spot ("2 mm instead of 20"). Study: 13 models, 1,000 synthetic financial questions (Alice owns 20% vs 5%, query "over 15%"); 54% average; best on single decimals like 0.8 (~62%); crashes on four-digit integers and percentages; tokenizer splits digits; LLM-based embedders (Mistral, Qwen) ~5 points above encoder-based (explained by broader pre-training).
- 12:30 Bigger data or models do not close the gap; handle it in the application layer; dense-only retrieval for numeric queries is unsound; build hybrids with symbolic solvers or structured metadata filtering.
- 13:30 Vertex AI: gemini-embedding-001 (unified, multilingual, up to 3072 dims, costly: 100M docs at 3072 float32 need huge vector-DB RAM); text-embedding-005 (768, English + code, much cheaper); text-multilingual-embedding-002 (768); open models from Model Garden (E5 family); multimodalembedding@001 (text, image, video in one space).
- 15:00 Classification/clustering need linear separability; encoder-only models like RoBERTa or Qwen3 0.6B often beat large generic or multimodal models.
- 15:22 Edge: EmbeddingGemma 300M, under 200 MB RAM, sub-22 ms latency.
- 15:42 MRL front-loads important information into early dimensions; truncate 1024 -> 256; hosts say the loss prioritises the first 256 dims, keeping most accuracy.
- 16:32 Qwen3-Embedding-8B called state of the art for multilingual; BGE-M3 gives dense, sparse and multi-vector (late interaction) in one pass, handling hybrid retrieval at the model level.
- 17:06 Fine-tuning for niche vocabularies (aerospace, materials science): contrastive learning; hard negative mining; false negatives; human annotation is expensive; LLM synthetic annotation drifts over epochs. Consensus: off-the-shelf for general domains; fine-tune with hard negatives only for highly technical, high-stakes domains.
- 18:44 Recap: reranking needed to push faithfulness from the low 30s to nearly 80%; header-preserving chunking; negation verifiers; 54% numeracy; Gemini high-dim vs 768-dim cost and MRL. Best public-leaderboard model is rarely best for a constrained deployment.
- 20:00 Outlook: GraphRAG, fusing embeddings with knowledge graphs; embedding spaces that encode multi-hop reasoning and entity relations.

## Implementation
No code in the video. Author's arithmetic (not in the video): 100M x 3072 x 4 bytes = 1,228.8 GB raw vectors; 768 dims = 307.2 GB; 256 dims = 102.4 GB (index and metadata extra).

## Quick Reference
| Item | Value | Time |
|---|---|---|
| baseline chunk | ~512 tokens, cosine top-k | ~2:43 |
| faithfulness | 0.347 -> 0.797 (paper: 0.347 no retrieval, 0.621 basic RAG) | ~3:28 |
| two-stage | ~10,000 candidates -> rerank 10-100 | ~5:20 |
| clinical chunk | 500-800 tokens, 10-20% overlap, keep headers | ~6:53 |
| clinical retrieval | query expansion, top 20-40 | ~8:36 |
| numeracy | 13 models, 1,000 q, 54%, ~62% decimals, LLM +5 | ~10:50 |
| gemini-embedding-001 | up to 3072 dims | ~13:40 |
| text-embedding-005 / multilingual-002 | 768 dims | ~14:16 |
| EmbeddingGemma | 300M (308M), <200 MB, <22 ms | ~15:22 |
| MRL | 1024 -> 256 | ~15:58 |

## Comparisons
| Task | Model (per video) | Reason / trade-off |
|---|---|---|
| complex semantics, medical | gemini-embedding-001 | separation vs RAM cost |
| English + code, budget | text-embedding-005 | cheaper, less granular |
| multilingual on Vertex | text-multilingual-embedding-002 | multilingual |
| text + image + video | multimodalembedding@001 | shared space |
| classification | RoBERTa, Qwen3 0.6B | stable class margins |
| edge | EmbeddingGemma 300M | small, fast |
| multilingual SOTA | Qwen3-Embedding-8B | per hosts |
| hybrid retrieval | BGE-M3 | dense + sparse + multi-vector |

## Corrections / verification
Fact-check by web search 2026-10-10: 7 confirmed, 4 partly, none wrong.
- gemini-embedding-001: 3072 default, 128-3072 via output_dimensionality, recommended 768/1536/3072 (ASR "372", "30 or 72").
- Vertex lineup confirmed; multimodalembedding@001 default 1408 dims; E5 = multilingual E5 small/large (docs pages not fetched; search snippets).
- Numeracy study is EmbedNum-1K in "Revealing the Numeracy Gap" (Deng, Duan, Tang, Yang; Findings of EACL 2026; arXiv 2509.05691); 0.54 average, 0.62 for "0.x", LLM-based 0.56 vs encoder 0.51; a table row reportedly averages 51.9% (unverified).
- Faithfulness paper: Maharjan & Yadav 2026 (arXiv 2601.15457), CDC policy documents: no retrieval 0.347, basic RAG 0.621, advanced RAG + cross-encoder 0.797. The video mislabels 0.347 as basic RAG; "over 60% hallucination" is the hosts' reading of the score.
- Qwen3-Embedding 0.6B/4B/8B; 8B #1 MTEB multilingual 70.58 (2025-06-05).
- EmbeddingGemma 308M, <200 MB quantised, MRL 768->128, 100+ languages; "<22 ms on EdgeTPU" (overview) vs "<15 ms for 256 tokens" (launch blog).
- BGE-M3 dense/sparse/multi-vector, 100+ languages, 8,192 tokens confirmed.
- MRL (Kusupati et al. 2022) sums losses over nested sizes; 1024->256 is illustrative.
- Cross-encoder O(n^2) is attention over combined length; real cost is one forward pass per pair, no precomputation (SBERT: ~65 h vs ~5 s for 10k sentences, from memory).
- MTEB (Muennighoff et al. 2022) and RAGAS faithfulness (Es et al. 2023) confirmed from memory.
- ASR fixes: by encoder/benccoder = bi-encoder; word tuve = word2vec; R/AG/drag/RE = RAG; MTB = MTEB; Quinn/Quen = Qwen; Burke = BERT; FHI = FHIR; Matrioska = Matryoshka; numerousy = numeracy; Embeddum 1K = EmbedNum-1K; EI family = E5; coderon = encoder-only; elite interaction = late interaction; epox = epochs.
- On-screen slides are a separate deck not synced to the audio; frames in the HTML are placed by topic with their own timestamps.

## Open Questions & Extension Ideas
- ZVect lesson idea: "Matryoshka truncation" demo (cut dimensions, watch cosine change; toy vectors are not MRL-trained, so demo only).
- Numeracy gap fits lesson 6 (similarity search): numeric constraints belong in filters.

## Tags & Triggers
embedding-model, rag, reranker, cross-encoder, numeracy, vertex-ai, matryoshka, bge-m3, fine-tuning
- "How do I choose an embedding model for my task?"
- "Bi-encoder vs cross-encoder?"
- "Why are embeddings bad at numbers?"
- "gemini-embedding-001 vs text-embedding-005?"
- "How does Matryoshka truncation work?"

## Processing Notes
- Mode: rewritten in the author's own words, every point and number kept, not a word-for-word translation (standard YouTube license, checked 2026-10-10). English ASR captions (634 lines, SHA-256 b27eeba7...afbe incl. description), kept in the session workspace only.
- 44 thumbnails scanned, 9 hi-res frames captured, 5 used; 5 own SVGs. Fact-check via a web-search subagent (23 tool calls).

## References
- Byte Goose AI, YouTube, 2026-02-28, https://www.youtube.com/watch?v=H6q1UWCCnKw
- arXiv 2509.05691 (EmbedNum-1K), arXiv 2601.15457 (RAG faithfulness), ai.google.dev embeddings and EmbeddingGemma docs, Vertex AI embeddings docs, huggingface.co Qwen3-Embedding-8B and BAAI/bge-m3, arXiv 2205.13147 (MRL), 1908.10084 (SBERT), 2210.07316 (MTEB), 2309.15217 (RAGAS).
