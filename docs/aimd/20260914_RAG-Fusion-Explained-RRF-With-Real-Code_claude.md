# RAG Fusion Explained: Reciprocal Rank Fusion (RRF) With Real Code — IT AI Enthusiast (Mayank Chugh) - Claude Context
> Source: YouTube, IT AI Enthusiast (Mayank Chugh), "RAG Fusion Explained: Reciprocal Rank Fusion (RRF) With Real Code", 26:40, published 2026-09-14 · https://www.youtube.com/watch?v=BwgBU0CekFk · Generated: 2026-10-13
> Companion: 20260914_RAG-Fusion-Explained-RRF-With-Real-Code.html (Thai, iw mode `iwd`, 15 sections, 13 frames + 3 own SVG)

## Processing Notes
- Mode: `iwd`. Body: own-words deep analysis (standard YouTube license); equations, slide numbers and short code transcribed exactly.
- Frames used: 01_what-is, 02_problem, 03_flow, 04_query-prompt, 05_four-queries, 06_formula, 07_rrf-code, 08_four-friends, 09_case-study, 10_full-chain, 11_sample-output, 12_evidence, 13_takeaways.
- Own SVG diagrams: flow, bars, bars.
- Transcript SHA-256 (in-page = decoded): `cc3227d8fdb01983170dd48199e8ba8cb937925d43763a2235cbe71c8eea2505 (en:asr track)`; kept in the session workspace only.

## TL;DR
- Episode 5 of an "Advanced RAG" series (IT AI Enthusiast / Mayank Chugh): RAG Fusion = an LLM rewrites the user question into 4 query variants, each is retrieved separately from Chroma, the 4 ranked lists are fused with Reciprocal Rank Fusion (k = 60), deduplicated, and passed to the answering LLM.
- Formula on the slide: RRFscore(d) = Σ 1/(k + rank_r(d)), k = 60 "as in the original paper"; ranks only, no calibrated similarity scores, hence retriever-agnostic.
- Demo: Colab T4, 6 Singapore travel .txt files → 33 chunks (500/100), BAAI/bge-small-en-v1.5, Chroma, LLM fallback chain local Qwen3-4B-Instruct-2507 (4-bit) → Claude → GPT; question "Tell me about Singapore's nightlife scene?"; answer merges three distinct chunks (venues, alcohol/noise laws, Sentosa / Marina Bay light shows).
- Author checks: the notebook's `enumerate(docs)` starts at 0, so it computes 1/(k + rank − 1) (equivalent to k = 59). Paper claims: MAP 0.6051 on LETOR 3 correct, but not "the best of any method" (CombMNZ 0.6107, n.s.); the "4% to 5% on average" sentence is in the paper but summarises pilot + TREC (Table 2 alone averages about 3%); p < 0.05 vs every individual learner is correct.

## Key Concepts
**Equation 1 (slide ~13:30, exact):**
$$\mathrm{RRFscore}(d) = \sum \frac{1}{k + \mathrm{rank}_r(d)}$$
Video description variant (no subscript r): $$\mathrm{RRFscore}(d) = \sum \frac{1}{k + \mathrm{rank}(d)}$$
Slide labels: "THE CONSTANT K … k = 60: A constant that softens the influence of any single top-ranked result — same value the original RRF paper found near-optimal"; "SUM OVER EVERY RANKING (Query Variants): Each of the 4 query variants produces its own ranked list; a document scores across all of them, not just one."

**Equation 2 (author's complete form, as in the paper):**
$$\mathrm{RRFscore}(d) = \sum_{r \in R} c_r(d), \qquad c_r(d) = \begin{cases} \dfrac{1}{k + \mathrm{rank}_r(d)} & d \in r \\ 0 & d \notin r \end{cases}$$
Single-list contributions at k = 60: 1/61 = 0.016393, 1/62 = 0.016129, 1/63 = 0.015873, 1/64 = 0.015625.

**Equation 3 (author, ceiling):** $\mathrm{RRFscore}_{\max} = \frac{n}{k+1}$; n = 4, k = 60 → 0.065574.

**Equation 4 (author, what the notebook computes):** with `rank` from `enumerate(docs)` (0-based), $c^{\text{code}}_r(d) = \frac{1}{k + \mathrm{rank}_r(d) - 1}$; rank 1 → 1/60 = 0.016667 instead of 1/61.

**Dedup (slide + speech ~14:59):** LangChain `Document` is not hashable → `dumps(doc)` as dict key, `loads` back; the same chunk from two queries counts once.

**Analogy slide "Think of It Like Asking Four Friends" (lists exact; numbers computed by the author):**
| friend | question | 1 | 2 | 3 |
|---|---|---|---|---|
| Friend 1 (foodie) | "Best spot for dinner?" | Tacos del Sol | Pizza Palace | Sushi Sakana |
| Friend 2 (local) | "Where should we eat tonight?" | Sushi Sakana | Tacos del Sol | Pizza Palace |
| Friend 3 (adventurer) | "Any hidden gem restaurants?" | Pizza Palace | Sushi Sakana | Tacos del Sol |
| Friend 4 (trendy) | "What's the top-rated must-try?" | Pizza Palace | Tacos del Sol | Sushi Sakana |

$$\mathrm{RRF}(\text{Pizza}) = \tfrac{1}{62} + \tfrac{1}{63} + \tfrac{1}{61} + \tfrac{1}{61} = 0.064789$$
$$\mathrm{RRF}(\text{Tacos}) = \tfrac{1}{61} + \tfrac{1}{62} + \tfrac{1}{63} + \tfrac{1}{62} = 0.064525$$
$$\mathrm{RRF}(\text{Sushi}) = \tfrac{1}{63} + \tfrac{1}{61} + \tfrac{1}{62} + \tfrac{1}{63} = 0.064269$$
k = 0: 17/6 = 2.8333, 7/3 = 2.3333, 13/6 = 2.1667. With the notebook's 0-based rank: 0.065856, 0.065583, 0.065318 (Pizza exceeds the true ceiling 4/61).

**Equation 8 (author's addition, not in the clip, weighted RRF):**
$$\mathrm{RRF}_w(d) = \sum_{r \in R} \frac{w_r}{k + \mathrm{rank}_r(d)}$$
Friend 1 weight 2, others 1: Tacos = Pizza = 2/61 + 2/62 + 1/63 = 0.080918 (exact tie), Sushi 0.080142. Elasticsearch 9.x RRF retriever: `weight` (default 1.0), score = Σ weight_i × rrf_score_i; LangChain EnsembleRetriever: weight / (rank + c), c = 60.

## Implementation
Notebook cells shown (verbatim key lines):
```python
prompt = ChatPromptTemplate(input_variables=['question'], messages=[
    SystemMessagePromptTemplate(prompt=PromptTemplate(input_variables=[],
        template='You are a helpful assistant that generates multiple search queries based on a single input query.')),
    HumanMessagePromptTemplate(prompt=PromptTemplate(input_variables=['question'],
        template='Generate multiple search queries related to: {question} \n OUTPUT (4 queries):')),
])
queries = generate_queries.invoke({"question": original_query})
# -> 1. Universal Studios Singapore ticket prices and booking options
#    2. Universal Studios Singapore attractions and ride reviews
#    3. Universal Studios Singapore near me and directions
#    4. Universal Studios Singapore holiday packages and family travel tips

from langchain_core.load import dumps, loads
def reciprocal_rank_fusion(results: list[list], k=60):
    # RRFscore(d) = sum over rankings r of 1 / (k + rank_r(d))
    # Cormack, Clarke & Buttcher, SIGIR'09
    fused_scores = {}
    for docs in results:
        for rank, doc in enumerate(docs):          # 0-based: use enumerate(docs, start=1) to match the formula
            doc_str = dumps(doc)
            if doc_str not in fused_scores:
                fused_scores[doc_str] = 0
            previous_score = fused_scores[doc_str]   # unused
            fused_scores[doc_str] += 1 / (rank + k)
    return [(loads(doc), score)
            for doc, score in sorted(fused_scores.items(), key=lambda x: x[1], reverse=True)]

ragfusion_chain = generate_queries | retriever.map() | reciprocal_rank_fusion

template = """Answer the question based only on the following context:
{context}

Question: {question}
"""
prompt = ChatPromptTemplate.from_template(template)
full_rag_fusion_chain = ({"context": ragfusion_chain, "question": itemgetter("question")}
                         | prompt | llm | StrOutputParser())
fusion_reply = full_rag_fusion_chain.invoke({"question": "Tell me about Singapore's nightlife scene?"})
```
Further cells (verbatim): `langchain.debug = True` · `ragfusion_chain.input_schema.model_json_schema()` · `ragfusion_chain.invoke({"question": original_query})`.
Schema printout of the full chain: `{'properties': {'question': {'title': 'Question'}}, 'required': ['question'], 'title': 'RunnableParallel<context,question>Input', 'type': 'object'}`.
Baseline printout for `chain.invoke("Tell me about Universal Studio Singapore")`: Universal Studios Singapore is on Sentosa Island within Resorts World Sentosa, the only Universal Studios park in Southeast Asia, notably smaller than Orlando or Hollywood; a full day is enough.
Notebook comment: `itemgetter("question")` rather than `RunnablePassthrough()` so the prompt gets the string, not the whole dict. Baseline chain: `{"context": retriever, "question": RunnablePassthrough()} | prompt | llm | StrOutputParser()`.
Setup: Colab T4; corpus Google Drive "My Drive/English", 6 docs joined; RecursiveCharacterTextSplitter 500/100 → 33 chunks; BAAI/bge-small-en-v1.5; Chroma persisted (`chroma_db`, SQLite); LLM fallback (LangChain `with_fallbacks`): local Qwen3-4B-Instruct-2507 4-bit → claude-sonnet-5 → gpt-5.6-sol (strings visible on screen); "neither fallback fired on this run".
Pitfalls (author): 0-based rank; dumps-based keys split identical text with different metadata; no tie-break rule; the case-study slide says "LLM: Gemini 2. Pro" while the run used Qwen (Gemini credit ran out mid-recording, per the speaker).

## Quick Reference
| item | value |
|---|---|
| formula | RRFscore(d) = Σ_r 1/(k + rank_r(d)) |
| k | 60 |
| query variants | 4 per question |
| chunks | 6 docs → 33 chunks (500 / 100) |
| embeddings / store | BAAI/bge-small-en-v1.5 / Chroma |
| LLM | Qwen3-4B-Instruct-2507 local → Claude → GPT |
| demo question | "Tell me about Singapore's nightlife scene?" |
| four friends, k = 60 | Pizza 0.064789, Tacos 0.064525, Sushi 0.064269 |
| ceiling, 4 lists, k = 60 | 4/61 = 0.065574 |
| paper LETOR 3 MAP | RRF 0.6051, CombMNZ 0.6107 |
| next episode | FlashRank |

## Comparisons
Vanilla RAG: one query → one retrieval → LLM (risk: relevant chunks never surface if the wording does not match). RAG Fusion: same question → 4 LLM variants → 4 retrievals → RRF → LLM (documents surfaced by more than one phrasing treated as most likely relevant).

Paper Table 3 (LETOR 3, MAP, 95% CI, RRF − method, p):
| method | MAP | CI | RRF − method | p |
|---|---|---|---|---|
| RRF | 0.6051 | 0.58–0.63 | – | – |
| CombMNZ | 0.6107 | 0.58–0.64 | −0.0056 | .2 |
| Condorcet | 0.5917 | 0.56–0.62 | 0.0134 | .004 |
| ListNet | 0.5846 | 0.56–0.61 | 0.0205 | .001 |
| LGD | 0.5837 | 0.56–0.61 | 0.0214 | .003 |
| AdaRank-MAP | 0.5778 | 0.55–0.61 | 0.0273 | .000 |
| RankSVM | 0.5737 | 0.55–0.60 | 0.0314 | .000 |
| RankBoost | 0.5622 | 0.53–0.59 | 0.0429 | .000 |
Relative gain over best individual learner: $\frac{0.6051 - 0.5846}{0.5846} = 3.5\%$.

Paper Table 2 (TREC, MAP): Robust RRF .3686 / best .3586 / Condorcet .3652 / CombMNZ .3575; TREC 3 .4350 / .4226 / .4256 / .4381; TREC 5 .3394 / .3165 / .3213 / .3237; TREC 9 .2830 / .3519 (.2801) / .2750 / .2671. Sign tests: RRF beat Condorcet 7/7 (p ≈ .008), CombMNZ 6/7 (p ≈ .04).
Paper Table 1 (pilot, TREC topics 351-400, 30 runs), MAP by k: 0 .2072, 10 .2123, 20 .2134, 30 .2139, 40 .2138, 50 .2144, 60 .2145, 70 .2146, 80 .2147, 90 .2145, 100 .2142, 500 .2098 (best individual .2016, Condorcet .2074, CombMNZ .2039).

## Fact Check
12 claims: confirmed 7, partly 3, contradicted 2.
- Confirmed: formula; k = 60 from the paper's pilot ("near-optimal", choice not critical); authors/venue; ranks-only / retriever-agnostic; MAP 0.6051 on LETOR 3; p < 0.05 vs every individual learner; 6 docs / 33 chunks / bge-small.
- Partly: "4-5% over Condorcet, CombMNZ and the best system on TREC 3, 5, 9, Robust" (the paper's "4% to 5% on average" sentence covers the pilot plus TREC; Table 2 alone averages about 3%: vs Condorcet +2.9%, vs CombMNZ +3.3%, vs best automatic run +3.5%; not uniform per collection); "fusing 7 rank-learning methods" (the paper's "seven" counts LETOR 3 sets of document-query pairs combined into one; Table 3 has 5 individual learners + 2 fusion baselines); the code comment's formula (0-based rank in the code).
- Contradicted: "best result of any method tested" (CombMNZ 0.6107); slide "LLM: Gemini 2. Pro" (run used Qwen3-4B-Instruct-2507).
Paper numbers read via WebFetch extraction of the PDF (Tables 1-3 asked twice, consistent).

## Open Questions & Extension Ideas
- A no-LLM variant: generate query variants by rule (original, stemmed, synonym-expanded, word-segmented) and fuse BM25 lists with RRF.
- Weight the original query's list higher than LLM variants (Equation 8) and measure.
- Deterministic tie-break and list depth (rank window) are unspecified in the clip.
- Evaluate on a labelled set; the demo has no quantitative evaluation (the speaker says so).

## Tags & Triggers
RAG Fusion, Reciprocal Rank Fusion, RRF, multi-query retrieval, LangChain, Chroma, BGE, Qwen fallback chain, SIGIR 2009, LETOR 3, CombMNZ, Condorcet.
Triggers: "what is RAG Fusion", "RRF formula k = 60", "reciprocal_rank_fusion LangChain code", "does RRF beat CombMNZ", "four friends RRF example".

## References
- IT AI Enthusiast (Mayank Chugh), "RAG Fusion Explained: Reciprocal Rank Fusion (RRF) With Real Code", YouTube, 2026-09-14, https://www.youtube.com/watch?v=BwgBU0CekFk
- Notebook: https://github.com/mayankchugh-learning/Advance_RAG/tree/main/RAGFusion
- Cormack, Clarke, Büttcher, "Reciprocal Rank Fusion outperforms Condorcet and individual Rank Learning Methods", SIGIR '09, https://cormack.uwaterloo.ca/cormacksigir09-rrf.pdf
- Elasticsearch RRF, https://www.elastic.co/docs/reference/elasticsearch/rest-apis/reciprocal-rank-fusion ; RRF retriever weight, https://www.elastic.co/docs/reference/elasticsearch/rest-apis/retrievers/rrf-retriever
- recompute.py (author's stdlib script, job folder)
