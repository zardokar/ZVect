# Vector Databases Are Dead. Use This Instead — Claude Context
> Source: YouTube, Devsplainers, "Vector Databases Are Dead. Use This Instead", 8:29, published 2026-10-08, https://www.youtube.com/watch?v=YLkSfz3EFGw · Generated: 2026-10-10
> Companion: docs/outhtm/20261008_Vector-Databases-Are-Dead-Use-This-Instead.html (Thai, interpretive full-detail mode, with an 18-claim fact-check)

## TL;DR
turbopuffer (vector DB vendor; search for Cursor, Notion, Anthropic) posted "RIP, vector database" (Sept 30, 2026): in v3 documents get plain IDs and the vector index is one index among keyword search and filters (not in production yet). The video compares three challengers with benchmarks and cost: (1) agentic search: FRAMES (824 q, 12,000 Wikipedia articles) agent 92.7% vs best of 18 pipelines 78.9% vs perfect retrieval 93%; 5+ article questions 62% vs 90%; ~3x cost, slowest of 20 134 s vs 54 s, 7% of questions = 37% of budget; LREC 2026: >3x input tokens, +50% time, a plain reranker ranks better. Inside the loop BM25 often beats vectors: EnterpriseRAG-Bench (~500k company docs) 68.8% vs 51.4%; vectors still help on BrowseComp-Plus (GPT-5 70.1% embedding vs 55.9% BM25) and Cursor (+12.5% over grep); OpenAI small embeddings $0.02/1M tokens. (2) MCP connectors: Microsoft federated Copilot connectors (live, user permissions, no index), Claude Marketplace (Sept 23, >2,000), ChatGPT sync admin-only, Slack bans bulk export since 2025; Glean's test: Claude Cowork $2.98/task vs Glean $0.58, >3x tokens; Glean added 182 MCP server templates on Sept 22. (3) Compiled folder (OKF): study ~100x build tokens, ~21x per query, no break-even, cited 40% vs 19%, 1 author 13 questions; OKF repo quiet. Verdict: vector DB demoted to one tool; default = agent with cheap search (keyword first, vectors for fuzzy meaning, live connectors); one-shot pipeline for simple high-volume; grep + notes for coding/small docs; pgvector under 10M vectors (update to 0.8.7); decide by hops per question and whether users can wait 2 minutes.

## Key Concepts
- 0:00 Vendor buried the vector DB; if your chatbot runs on a vector DB, do you rip it out? Three other ways; which to pick and when the vector DB is still right.
- 0:33 Vector DB = text as embeddings, returns closest chunks. turbopuffer filed documents at the address of their vector (library by topic): vector search fast, everything else painful. v3: plain IDs, vector index next to keyword search and filters; v3 not in production ("headline marketing"); runs search over 10B Notion documents.
- 1:23 Classic RAG pipeline: chunk, embed, paste closest chunks; one shot; turbopuffer CTO: a reranker doesn't decide none are good and search again; an agent can. Challenger 1: agentic search (search, read, find what's missing, search again).
- 1:57 PipesHub on FRAMES: 824 questions, 12,000 Wikipedia articles; agent 92.7%; best of 18 fixed pipelines 78.9; exact right articles 93 (agent a third of a point below); 5+ articles: pipeline 62%, agent 90. PipesHub sells such systems but published code and cost.
- 2:29 Agent ~3x cost per question; slowest of 20: 134 s vs 54 s; 7% of questions ate 37% of budget. LREC study: >3x input tokens, 50% more time, a plain reranker beat the agent at ranking. "The loop wins the hard questions, but you pay for every lap."
- 3:04 BM25 (exact-word ranking) often beats vectors inside the loop. EnterpriseRAG-Bench: half a million docs (Slack, Gmail, Jira, Confluence, GitHub): BM25 68.8%, vector 51.4; vectors lost even on questions written to favor them (public-text embeddings don't know code names, acronyms, ticket numbers). Reddit: "Customer IDs need equality, not a soulmate." Benchmark from Onyx (sells enterprise search).
- 3:52 Vectors still help: BrowseComp-Plus GPT-5 search agent 70.1% embedding vs 55.9 BM25, fewer searches (a BM25 vendor says that BM25 was badly tuned); Cursor +12.5% accuracy adding semantic search on top of grep. OpenAI small embeddings 2 cents per million tokens; the loop is the expensive part.
- 4:30 Challenger 2: MCP connectors (standard plug to ask apps like Notion or Salesforce). Microsoft federated Copilot connectors fetch live over MCP with your login/permissions; Microsoft indexes nothing. Claude Marketplace opened Sept 23 with >2,000 connectors and plugins. OpenAI: individual users can no longer sync apps into ChatGPT's index, only admins. Slack API terms banned bulk exports since 2025. Apps decide how much you can copy; the narrator doesn't expect more generosity.
- 5:18 Live access cost: federated query as fast as the slowest app; each app ranks its own results. Glean (sells an index) measured Claude Cowork on live connectors $2.98/task vs $0.58 for Glean, >3x tokens. Sept 22: Glean added 182 live MCP server templates.
- 5:46 Challenger 3 (the channel's own June video): Google's open knowledge format compiles knowledge into markdown files; the top comment suggested chunking and embedding them; four months later evidence sides with the comment. August study: ~100x tokens to build vs RAG (expected); ~21x tokens per query, no break-even; wiki cited better (40% vs 19%); one author, 13 questions: "a warning light". OKF repo: last commit Aug 21 from its only contributor; 88 issue comments since, zero maintainer replies. Idea lives on in LangChain's Open Wiki and Pinecone's Nexus.
- 7:09 Verdict: demoted from the center to one tool among several. Default for most new builds: agent with cheap search tools (keyword first, vectors for fuzzy meaning, live connectors for apps you don't own); one-shot pipeline still wins price/speed for simple high-volume lookups; coding agent or small docs: grep and a notes file; under 10M vectors turbopuffer's CTO says Postgres + pgvector is cheaper (update to 0.8.7 for a security fix); company data across apps: start with live connectors, add an index only where latency or ranking hurts; compile knowledge only when stable and valuable. Deciding questions: how many hops; can users wait 2 minutes. "Before you pay for another vector index, give your agent a keyword search tool."

## Implementation
No code in the video.

## Quick Reference
| Item | Value | Time |
|---|---|---|
| FRAMES | agent 92.7 / best pipeline 78.9 / perfect 93 | ~2:03 |
| FRAMES 5+ articles | pipeline 62 / agent 90 | ~2:23 |
| agent cost | ~3x; slowest 134 s vs 54 s; 7% q = 37% budget | ~2:33 |
| LREC 2026 | >3x tokens, +50% time, reranker better | ~2:49 |
| EnterpriseRAG-Bench | BM25 68.8 / vector 51.4 | ~3:27 |
| BrowseComp-Plus | embedding 70.1 / BM25 55.9 | ~3:56 |
| Cursor | +12.5% with semantic search | ~4:14 |
| Glean test | $2.98 vs $0.58 per task | ~5:29 |
| wiki vs RAG | ~100x build, ~21x per query, 40% vs 19% | ~6:17 |
| pgvector | < 10M vectors; 0.8.7 | ~7:38 |

## Comparisons
| Option | When (per video) | Trade-off |
|---|---|---|
| agent + cheap tools | default for new builds | ~3x cost, slow tail |
| one-shot pipeline | simple high-volume | one shot |
| grep + notes | coding agent / small docs | - |
| pgvector | < 10M vectors | - |
| live connectors | data across apps | slowest app; per-app ranking |
| compiled folder | stable, valuable knowledge | ~21x tokens per query |

## Corrections / verification
Fact-check by web search 2026-10-10 (several primary pages could not be fetched; mirrors/secondary sources used): 11 confirmed, 7 partly (two sub-points not found: the reranker quote and the 88 comments), none contradicted.
- Notion: source says "10B+ vectors", not documents.
- turbopuffer CTO reranker quote not found (may be in the cited CTO interview, not watched); the 10M pgvector threshold is from turbopuffer docs (via Sacra); the RIP post itself says Postgres under 1M vectors.
- PipesHub: only 92.7 vs 78.9 confirmed (page not fetchable); vendor test.
- LREC 2026: 3.3x input tokens, 1.5x time, reranking NDCG@10 49.5 vs agent 43.9 (confirmed).
- EnterpriseRAG-Bench: 511,962 docs, 68.8 vs 51.4 confirmed; fixed top-10 retrieval, synthetic company corpus; semantic category 44.8 vs 32.8.
- BrowseComp-Plus: 70.1 (Qwen3-Embedding-8B) vs 55.9 confirmed.
- Cursor 12.5% = average relative improvement (6.5-23.5%) on an internal benchmark.
- OpenAI text-embedding-3-small $0.02/1M confirmed. Microsoft federated connectors confirmed. Claude Marketplace Sept 23, 2026, >2,000 confirmed (news source). ChatGPT admin-only sync confirmed. Slack bulk-export ban (2025) confirmed.
- Glean: $2.98 vs $0.58 confirmed (Glean's own test), tokens 4.4M vs 1.3M; 182 MCP server templates in Sept 22 release notes (admin-enabled).
- Wiki study: 21x per query and no break-even confirmed; build cost raw 645x, ~97-115x cache-weighted; RAG 18.9%; v1 May 2026, v2 Aug 16.
- OKF: last commit Aug 21 and single maintainer per a third-party issue; "88 issue comments since then with zero maintainer replies" unverified.
- Confirmed: Pinecone Nexus curates documents into knowledge artifacts ahead of time (the video's "which compiles company data" refers to Nexus); LangChain's tool is spelled "OpenWiki" (CLI, codebase/personal knowledge).
- pgvector 0.8.7 security fix (IVFFlat index build overflow) per a secondary blog; official news page not fetched.
- ASR fixes: Turboroper = turbopuffer; rack = RAG; Pipeshop = PipesHub; grap = grep; claw marketplace = Claude Marketplace; cloth co-work = Claude Cowork; "58" = $0.58.

## Open Questions & Extension Ideas
- ZVect lesson idea "keyword vs vector": BM25 vs cosine on a tiny corpus with synonyms and exact IDs (pairs with the HNSW and ANN reports).

## Tags & Triggers
vector-database, rag, agentic-search, bm25, mcp, pgvector, turbopuffer, retrieval
- "Is the vector database dead?"
- "Agentic search vs RAG pipeline cost?"
- "BM25 vs vector search on company data?"
- "When to use pgvector, grep or MCP connectors?"

## Processing Notes
- Mode: interpretive full-detail (standard YouTube license, checked 2026-10-10). English ASR captions (190 lines, SHA-256 1bdbf810...bf33 incl. description), kept in the session workspace only.
- 15 frames captured, 10 used; 2 own SVGs. Fact-check via a web-search subagent (71 tool calls).

## References
- Devsplainers, "Vector Databases Are Dead. Use This Instead", YouTube, 2026-10-08, https://www.youtube.com/watch?v=YLkSfz3EFGw
- Sources cited in the video description (see HTML references).
