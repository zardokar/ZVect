# "How Knowledge Catalog's self-learning enrichment grounds enterprise AI agents" - Claude Context
> Source: YouTube, Google Cloud Tech, "How Knowledge Catalog's self-learning enrichment grounds enterprise AI agents", 4:55, published 2026-10-22 · https://www.youtube.com/watch?v=qeWzgLGSkls · Generated: 2026-10-24
> Companion: 20261022_How-Knowledge-Catalogs-Self-Learning-Enrichment-Grounds-Enterprise-AI-Agents.html (Thai, iw mode `iwd`, 5 sections, 12 frames + 9 own SVG)

## Processing Notes
- Mode: `iwd`. Body: own-words rewrite (standard YouTube license), every point and number kept.
- Frames used: P01, P02, P03, P04, P05, P06, P07, P08, P09, P10, P11, P12.
- Own SVG diagrams: flow, flow, compare, flow, layers, compare, cycle, algo, multiples.
- Transcript SHA-256 (in-page = decoded): `0b070432616a0cec61b7472f18acb7a25c3fb6c1a664838306d419a699275a15`; kept in the session workspace only.

## TL;DR
- A Google Cloud Tech demo (4:55, 2026-10-22) of **Knowledge Catalog / Knowledge Studio**. Without business context, a Gemini Enterprise agent spent multiple turns searching schemas, guessed that "premium" meant loyalty tier (Platinum/Gold), and returned valid SQL with a wrong answer: on screen $3,326.15 (Platinum) and $3,125.94 (Gold).
- The speaker frames grounding as "fundamentally an information retrieval problem". Knowledge Studio indexes the data estate into an interactive **context graph** of policy docs, BigQuery tables, enriched column metadata and golden query-answer pairs inferred from real workloads. With the Knowledge Catalog connector on, the same question returned "$88" in a single turn (on screen $88.13, 147 orders, $12,955.27).
- The graph also covers SAP catalogs, BigQuery, Spanner, dbt and Looker semantic models, "and many more". LookML metrics are indexed alongside physical tables.
- When definitions change, a self-learning **enrichment agent** crawls schemas and docs and mines real interaction traces from Gemini Enterprise and BigQuery agents. It turns chat feedback into knowledge candidates with confidence scores. Data stewards review diffs (inspect, edit, reject), and approved changes are published into an IAM-governed **context set** that every connected agent uses at once.
- Google's internal benchmark: "nearly" 4x accuracy, latency cut by 1/3 (slide: "up to 33%"), "up to" 75% fewer tokens. The clip description adds 67% fewer tool calls, which is not said or shown in the clip.
- Fact check: 6 claims, 6 confirmed, 0 partly, 0 not found, 0 contradicted. Several features are in Preview, and the benchmark is Google's own.

## Key Concepts
- **Grounding as retrieval.** An agent answers correctly only if it first retrieves the right business definition. Valid SQL is not the same as a correct answer.
- **Context graph.** Nodes are assets (tables, columns, glossary terms, governed data products, policy documents, LookML metrics). Edges are verified relationships. You can search it in natural language and expand it visually. Table pages carry "Representative queries" normalized from query history (screen, 0:56).
- **Knowledge supply chain.** The path business meaning takes from sources to agents. Stewards check it visually instead of maintaining fragmented, stale documentation.
- **Enrichment agent.** It is configured per domain (demo: "Ecommerce Self-enrichment Task (US)", us-central1, 8 BigQuery resources, 1 GCS bucket). Task steps on screen are Define, Scope, Improve and Run. "Knowledge signals" (buckets, glossaries) are read for context but are not themselves enriched.
- **Confidence scores tied to evidence.** On screen, 100% means every claim traces to something the run read. 44-45% means the text goes further than the evidence. 32% means only one source (BigQuery's own profile), so the agent recommends adding a second source.
- **Auto-publish threshold.** It is set at 85% (High) in the demo. Per Google's blog, proposals at or above the threshold are auto-approved, and the rest become Change Requests.
- **Human-in-the-loop review.** A diff view with provenance shows author (the enrichment agent's service account), justification and approver. The demo run had 38 entries (High 22, Medium 2, Low 5, N/A 9), with 37 approved and 0 rejected.
- **Governed context set.** A curated, access-controlled slice of the context graph. IAM limits what agents and end users can discover and retrieve.
- **User memory vs enterprise context.** Gemini "may" remember a user's correction for that user's later chats. The point of the system is to push the change into shared enterprise context.

## Implementation
The clip is a product demo, not a method paper. The steps below map its design onto a buildable retrieval/agent stack (author's mapping, labelled as such) for an LLM or ZVect-style RAG system.

1. **Build a typed context index.** Store chunks of policy documents, table and column descriptions, metric definitions (LookML/dbt measures such as `${TABLE}.state`) and golden question-to-SQL pairs as separate typed records. Add edges such as `policy -> table`, `metric -> column` and `table -join- table`.
2. **Retrieve hybrid, then expand.** Use BM25 for exact identifiers (`loyaltytier`, `users`), embeddings for intent ("premium customer"), and fuse the two with RRF. Then follow edges one hop from the top policy or metric hits to pull the tables they govern. Put golden Q->SQL pairs into the prompt as few-shot examples.
3. **Answer with the definition visible.** Make the agent state which definition and source it applied (as the $88.13 answer listed "Segmentation Criteria Applied"). Compute AOV as `AOV = (1/N) * sum_{o=1..N} v_o`, where `v_o` is the sum of final item prices in order `o`. On screen, 12,955.27 / 147 = 88.13 and 7,486.96 / 98 = 76.40.
4. **Mine feedback into candidates.** Log turns in which users correct a definition. Have an LLM extract a structured candidate (entity, new text, cited evidence) and redact PII.
5. **Score by evidence.** Base confidence on the count and agreement of independent sources, not on model self-rating. Single-source claims stay low.
6. **Gate with a threshold plus review.** Auto-publish at or above a configured score (demo: 85%) and send the rest to a diff-review queue with approve/edit/reject. Store author, justification, approver and timestamp, and version every record.
7. **Publish with access control.** Tag records with ACL groups and **pre-filter** by the caller's groups before vector search, so that unauthorized context never reaches the prompt and top-k is not emptied by post-filtering.
8. **Regression-test definitions.** After a definition update, re-run the fixed question set and check that the numbers move in the direction the new rule implies.

Pitfalls visible on screen (author observations):
- The learned rule text shows `[AGE]` where the policy said 35 (possibly PII redaction; not explained in the clip). Test that redaction does not strip business-rule numbers.
- After learning, the answer changed to $76.40 on 98 orders (from $88.13 on 147), although the new rule is an OR of two criteria. The two tables are labelled differently ("Total Q4 Orders" vs "Total Orders Fulfilled"), and the first criterion is tagged "(Q3)". The clip does not reconcile these numbers.

## Quick Reference
| Item | Value | Source |
|---|---|---|
| Demo question | Q4 AOV for premium customers via BigQuery | clip 0:00 |
| Wrong answer (no catalog) | Platinum $3,326.15, Gold $3,125.94 (Platinum 4,940 orders) | screen 0:28 |
| Original premium rule | Email traffic, age 35+, at least 1 Complete order in the last 12 months (the $88.13 answer counts only orders of Oct 1-Dec 31, 2025) | screen 0:56, 1:28 |
| Grounded answer | "$88" in one turn; screen $88.13, 147 orders, $12,955.27 | clip 1:28 |
| Graph sources | SAP catalogs, BigQuery, Spanner, dbt, Looker semantic models, LookML metrics | clip 2:01 |
| Scale cited | a million enterprise agents | clip 2:39 |
| Crawled sources | Cloud Storage, Workspace, GitHub, SharePoint (+ Confluence on screen) | clip 2:56 |
| Traces mined | Gemini Enterprise and BigQuery agents | clip 3:18 |
| Auto-publish | score >= 85% (High) | screen 3:22 |
| Run review | 38 entries: High 22, Medium 2, Low 5, N/A 9; 37 approved, 0 rejected | screen 3:49 |
| Post-learning answer | $76.40, 98 orders, $7,486.96 | screen 4:25 |
| Benchmark (Google internal) | nearly 4x accuracy; latency -1/3 (slide: up to 33%); up to 75% fewer tokens | clip 4:38 |
| Tool calls | 67% fewer (clip description only) | description |

## Comparisons
| | Without Knowledge Catalog | With Knowledge Catalog connector |
|---|---|---|
| Turns | multiple (schema hunting) | single |
| Definition of "premium" | guessed (`loyaltytier`) | retrieved from the verified segmentation policy |
| Answer | $3,326.15 / $3,125.94 (wrong) | $88.13 |
| Explainability | none | lists the policy and the criteria applied |

User memory vs enterprise context: Gemini memory may keep the change for one user only. A published context set applies it to every agent connected to it, within IAM limits.

## Fact Check
| Claim | Verdict | Note |
|---|---|---|
| Context graph with NL search, column metadata, golden queries from workloads | confirmed | Knowledge Studio is in Preview. Enrichment yields descriptions, join relationships and golden queries. |
| Knowledge Catalog connector for Gemini Enterprise | confirmed | Release notes of 2 Oct 2026: "Knowledge Catalog integration (Preview)". |
| SAP, BigQuery, Spanner, dbt, Looker/LookML in one graph | confirmed | BigQuery/Spanner GA, SAP Preview. dbt import Preview 26 Aug, GA 24 Sep 2026. LookML in data products GA 5 Oct 2026. |
| Enrichment agent crawls GCS/Workspace/GitHub/SharePoint, mines traces, thresholds, human diff review | confirmed | Confluence is also supported and traces are PII-redacted. Above-threshold changes (e.g. 85%) are auto-approved, the rest become Change Requests. |
| IAM-governed context sets | confirmed | Agents retrieve only from sets they are authorised for. |
| Nearly 4x accuracy, latency -1/3, up to 75% fewer tokens | confirmed | Google's wording is "up to 33% lower latency". Internal benchmark only; no independent figure found. |

Counts: confirmed 6, partly 0, not found 0, contradicted 0 (checked 2026-10-24).

## Open Questions & Extension Ideas
- **Benchmark method is undisclosed.** What tasks were used, what was the baseline agent, and what does "accuracy" measure? Rebuild an A/B harness on your own questions that measures accuracy against reference answers, p50/p95 latency, tokens per answer and tool calls per answer, with and without the context layer.
- **Ablate the retrieval stack in ZVect.** Compare BM25 only, embeddings only, hybrid with RRF, and hybrid plus one-hop graph expansion. Find which component drives accuracy and which drives token savings.
- **Confidence calibration.** Do the 85% auto-publish scores actually correspond to correct entries? Log reviewer decisions and fit a calibration curve before you trust auto-publish.
- **Fine-tune or retrieve.** Definitions that change over time (the Q4 premium rule) belong in a versioned retrieval index, not in model weights. Approved candidates can still serve as clean SFT or preference data for stable knowledge, such as SQL style or join patterns.
- **Conflict handling.** What happens when two users teach contradictory rules, or when a mined rule conflicts with a policy document? Design a precedence rule (policy doc over chat-derived) and surface the conflict in review.
- **Redaction vs business facts.** Add tests showing that PII scrubbing keeps thresholds such as age 35.
- **Time-scoped rules.** The learned rule starts "in Q4". Store validity windows on records so that historical questions use the rule in force at that time.

## Tags & Triggers
tags: knowledge-catalog, knowledge-studio, context-graph, context-engineering, grounding, enterprise-agents, gemini-enterprise, bigquery, text-to-sql, rag, hybrid-search, human-in-the-loop, data-governance, iam
- Why does an agent write valid SQL but return the wrong answer?
- How does Google Cloud Knowledge Catalog ground enterprise agents?
- How do I turn chat feedback into governed knowledge for RAG?
- How should I set confidence thresholds for auto-publishing enrichment?
- How do I design an access-controlled context layer for agents?

## References
- Clip: "How Knowledge Catalog's self-learning enrichment grounds enterprise AI agents", Google Cloud Tech, 2026-10-22 - https://www.youtube.com/watch?v=qeWzgLGSkls (speaker per description: Manoj Gunti)
- Channel: Google Cloud Tech - https://goo.gle/GoogleCloudTech
- Explore Knowledge Catalog (description link) - https://g.dev/ai/always-on-context
- Google Cloud Blog, "Knowledge Catalog: self-learning context enrichment for AI agents" (22 Oct 2026) - https://cloud.google.com/blog/products/data-analytics/knowledge-catalog-self-learning-context-enrichment-for-ai-agents
- Knowledge Catalog for AI agents (docs) - https://docs.cloud.google.com/knowledge-catalog/docs/ai-overview
- Gemini Enterprise release notes - https://docs.cloud.google.com/gemini/enterprise/docs/release-notes
- "Introducing the Google Cloud Knowledge Catalog" (22 Apr 2026) - https://cloud.google.com/blog/products/data-analytics/introducing-the-google-cloud-knowledge-catalog
- Knowledge Catalog release notes - https://docs.cloud.google.com/knowledge-catalog/docs/release-notes

## Equations (LaTeX)
1. $$ \mathrm{AOV} = \frac{1}{N} \sum_{o=1}^{N} v_o $$
