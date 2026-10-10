# Qdrant: Open Source Vector Search Engine and Vector Database (Andrey Vasnetsov) — Claude Context
> Source: YouTube, CMU Database Group, ML/DB Seminar Series 2023, talk 2023-09-11, published 2023-09-15, 62:38, https://www.youtube.com/watch?v=bU38Ovdh3NY · License: CC BY · Generated: 2026-10-10
> Companion: docs/outhtm/20230915_Qdrant-Open-Source-Vector-Search-Engine-CMU.html (Thai, FULL word-for-word translation of the whole talk incl. Q&A)

## TL;DR
Andrey Vasnetsov (Qdrant CTO/co-founder) explains Qdrant internals. Vector search is old; what is new is easy access to pre-trained encoders; Qdrant's job is production convenience/reliability. Qdrant: open source (Apache 2.0), Rust, 60+ external contributors (2023). He prefers "vector search engine" over "vector database": Qdrant follows BASE (like Elasticsearch), not ACID (like Postgres), and ideally should not be the primary store (full re-embedding on model change is routine). Hierarchy: collection -> shards (non-overlapping, movable, replicated; metadata via Raft) -> segments (each a self-contained mini collection; WAL at shard level). Many segments because (1) immutability enables big optimizations (compact layout, fewer cache misses, known statistics, exact allocation, fast load/mmap, compression) — possibly an order of magnitude better; (2) latency vs throughput (segment = unit of parallelism: many segments for low latency, one big segment for throughput). Updates via copy-on-write; index building via a proxy segment. Vector index specifics: approximate (result depends on insertion order) and any vector can be a result (no clean relevance cut-off). HNSW: proximity graph, greedy search, beam size trades precision vs speed; insertion ~2x search cost, CPU heavy, random + sequential access => needs RAM, hard to parallelize. Fix: search on compressed in-RAM vectors (binary quantization: 1 bit/dim, 32x, XOR + popcount; good for ~1,500-dim OpenAI vectors), then rescore e.g. top 100 with originals fetched in parallel via async I/O. Filtering: post-filtering (simple, may degrade to linear scan or incomplete results), pre-filtering (candidate generation can be expensive), Qdrant's in-place filtering during traversal (custom HNSW). Strict filters disconnect the graph; percolation threshold 1/k (k = avg links; 10 links -> 90% removed => disconnected); precision collapse plot. Fix: extra links built from indexed payload (subgraph per keyword value merged into main graph, deduplicated; overlapping intervals for numbers; geohash regions for geo), no search-time overhead, multi-field compatible; remaining precision loss is noise next to HNSW's approximation. Q&A: configure number of segments, not size; per-tenant (customer ID) payload-only subgraphs; dimension cost linear, graph search/build ~logarithmic; links stay within a segment, results merged across segments; segments random (no clustering); filter fields declared by the user as payload indexes; Postgres/pgvector vs Qdrant = ACID vs BASE trade-off, typical systems keep Postgres as source of truth plus search engines; extra links default = same count as original graph, HNSW heuristic prunes redundancy; DiskANN comparison (speaker unsure); time series works if a model maps it to vectors (user-event sequence models like word2vec); biggest unsolved problem: making billion-vector serving cheap.

## Key Concepts
- 0:23 Host Andy Pavlo opens the ML-for-DB / DB-for-ML seminar series; asks for interactive questions; thanks Google.
- 1:40 Speaker background: Qdrant started ~3 years earlier as a pet project to solve his own day-job problems; reviews all code; ~10 years in search (web-scale search: indexing, storage, then query parsing and ranking, ML; vector search led to the idea).
- 3:02 Qdrant = vector similarity search engine ("vector database" per marketing); Apache 2.0; 60+ external contributors; Rust. Agenda: intro to vector search; architecture overview; vector-specific challenges and decisions.
- 4:52 Encoder (usually a neural net) -> dense vectors (embeddings); close vectors = similar objects (meaning for text, visual for images); similarity type and distance function defined by the model; majority use dot product. New: ready-to-use models and tools; next step: production convenience/reliability like search engines and databases.
- 7:05 Collection (like a table / MongoDB collection) -> shards (non-overlapping subsets, movable, replicable) -> segments (index + storage, can do everything a collection can on a subset). Raft consensus for metadata (locations, node status, configuration).
- 9:01 BASE (Basically Available, Soft state, Eventual consistency) vs ACID: Postgres (strict transactions, scale ~single machine) vs Elasticsearch (highly scalable, weaker consistency). Hence "search engine"; scalability/performance over transactional consistency; ideally not the primary store; re-embedding everything on encoder change is common.
- 11:01 Inside a shard: write-ahead log (data not lost once committed); second level: segments. Reasons: immutability (compact, fewer cache misses, precomputed histograms/distributions, exact allocation, no fragmentation, no deserialization / mmap, delta and variable-byte encoding; maybe an order of magnitude more efficient); latency vs throughput (concurrency of one request efficient only to a point; one segment per CPU core for low latency; one big segment for throughput).
- 14:36 Q&A: segment size not configured, number of segments is; one segment holding all data is possible for read-heavy apps; even sizes preferred, at least one appendable segment; segment count configurable at runtime, size not.
- 17:05 Segment management: illusion of full mutability; copy-on-write (copy to mutable segment, mark deleted in old); proxy segment wraps the segment being optimized and tracks modifications; at the end becomes optimized segment + small copy-on-write (mutable) segment. Storage implementations are configurable (at least three vector storages).
- 20:31 Vector index traits: approximate (not exact, not deterministic across rebuilds, insertion order) and any vector can be a result (no clear relevant/irrelevant line by score). These break traditional DB assumptions.
- 22:10 HNSW: proximity graph, greedy search until no improvement; no guarantee of absolute closest; beam size trades precision vs speed.
- 23:41 Challenges: insertion ~2x search cost, CPU-intensive (dedicated thread pool or another machine); random and sequential access (latency-bound, prefetch/block reads ineffective, needs RAM, poor on disk).
- 25:25 Compressed in-memory vectors for candidate selection; binary quantization (1 bit per dimension, 32x, compare with XOR + popcount, efficient for large vectors like OpenAI's ~1,500 dims); rescoring with originals can be parallelized (known offsets, async I/O, even slow network disks). Q&A: top 100 rescored; DiskANN comparison (different; not revolutionary; built in, no pre-quantization needed).
- 29:03 Filtering (e-commerce price < $100, near me): post-filtering vs pre-filtering problems; in-place filtering during traversal (custom HNSW), checks conditions only as needed.
- 32:06 Strict filters disconnect the graph; percolation theory: threshold 1/k; 10 connections -> removing 90% disconnects; precision-vs-filtered-fraction plot drops to ~zero, matches theory and depends on links per node.
- 33:48 Filters are on known payload; build extra links: subgraph per keyword value merged into main graph -> graph stays connected for that keyword condition. Q&A: still approximate but conditions guaranteed; vector unchanged, payload checked at each step; differs from post-filtering (exact result count, all satisfy filter); quantization affects only vector precision, not filtering.
- 38:03 Extra links don't increase search complexity (used only when original links are filtered out); multiple fields; merge and deduplicate -> small memory overhead. Query planning / cardinality estimation deferred.
- 39:47 Q&A: customer ID -> build HNSW only on payload subgraphs (per-user), keep full-scan ability, single collection (semi-segregation). Complexity: comparison linear in dimension (1,000 dims ~2x slower than 500); graph search/build ~logarithmic; insertion involves search; shards/segments limit index size. Links isolated to one segment; search each segment and merge (like text search engines). Segments random (coin toss), no clustering (model-dependent). Filter fields declared as payload indexes (e.g. price, category tag).
- 46:00 Payload type matters: overlapping intervals for numeric fields; geohash regions for geo; closes the precision gap from both sides; drop not noticeable vs HNSW approximation.
- 48:22 Summary: vector search only getting started; Qdrant is a search engine; vector index needs special treatment even for filtering. Out of scope: query planning and payload indexes, dynamic search limit per segment, quantization (binary, scalar, product).
- 50:31 Q&A: pgvector/Postgres vs Qdrant = ACID vs BASE; not for banking; mixed exact+approximate search = Qdrant's filterable queries; Postgres likely full scan when combining; search engines rarely source of truth (Postgres + Elasticsearch + Qdrant). Extra links: configurable, default same as original graph, dedup + HNSW pruning heuristic. DiskANN: (speaker unsure) flat graph, built from fully connected graph then pruned, no quantization; quantization + oversampling is index-agnostic. Time series: works with a model mapping to vectors; user-event sequence models (like word2vec predicting next word). Biggest unsolved problem: cheap billion-vector serving (memory, random access).

## Implementation
No code. Own calculations: percolation removal threshold 1 - 1/k: k=4 75%, 8 87.5%, 10 90%, 16 93.8%, 32 96.9%, 64 98.4%. Memory for 1M x 1,536-dim vectors: float32 6.14 GB, int8 1.54 GB, binary 192 MB.

## Quick Reference
| Item | Value | Time |
|---|---|---|
| Qdrant | Apache 2.0, Rust, 60+ contributors (2023) | ~3:02 |
| hierarchy | collection -> shard -> segment; Raft metadata | ~7:11 |
| design | BASE not ACID | ~9:13 |
| HNSW insert cost | ~2x search | ~23:51 |
| binary quantization | 1 bit/dim, 32x, XOR + popcount | ~25:43 |
| rescoring | e.g. top 100 with originals | ~27:15 |
| percolation | threshold 1/k; 10 links -> 90% | ~32:43 |
| quantization types (2023) | binary, scalar, product | ~50:11 |

## Comparisons
| Filtering | How | Problem |
|---|---|---|
| post | search then drop | linear scan or incomplete |
| pre | candidates first | candidate generation expensive |
| in-place | check during traversal | graph disconnects under strict filters -> payload links |

## Corrections / verification
- Slide defines p_c = 1/<k> as the fraction of nodes LEFT; removable fraction = 1 - 1/k (speaker's 10 -> 90% example matches).
- OpenAI 2023 embeddings (text-embedding-ada-002) are 1,536-dim (speaker: ~1,500).
- DiskANN (author's knowledge, not checked here): keeps PQ-compressed vectors in RAM and full vectors on SSD; Vamana graph built from a random graph with pruning. The speaker himself said he might be wrong.
- Facts are as of Sept 2023.

## Open Questions & Extension Ideas
- ZVect ANN lesson: in-place filtering and graph disconnection demo (threshold 1 - 1/k).

## Tags & Triggers
qdrant, vector-search-engine, hnsw, binary-quantization, filterable-hnsw, percolation, base-vs-acid, cmu-db-seminar
- "How does Qdrant work internally?"
- "Why immutable segments?"
- "How do binary quantization and rescoring work?"
- "In-place filtering and graph disconnection?"

## Processing Notes
- Mode: FULL word-for-word translation (CC BY, verified on the video page 2026-10-10). English ASR captions (1,354 lines, SHA-256 d902ec4c...d182 incl. description); the transcript is saved next to the build files. Translation done in 6 parallel segments with a shared glossary; fillers removed; ASR errors corrected; unintelligible spots marked.
- 23 slide frames captured, 10 used; 3 own SVGs.

## References
- CMU Database Group, "Qdrant: Open Source Vector Search Engine and Vector Database (Andrey Vasnetsov)", YouTube, 2023-09-15, https://www.youtube.com/watch?v=bU38Ovdh3NY (CC BY)
- Seminar page: https://db.cs.cmu.edu/seminar2023/#db1
