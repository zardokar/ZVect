# A no nonsense intro to BM25 — Abhishek Thakur - Claude Context
> Source: YouTube, Abhishek Thakur, "A no nonsense intro to BM25", 15:45, published 2025-11-19 · https://www.youtube.com/watch?v=TW9vHU1GpU4 · Generated: 2026-10-13
> Companion: 20251119_A-No-Nonsense-Intro-To-BM25.html (Thai, iw mode `iwd`, 12 sections, 18 frames + 1 own SVG)

## Processing Notes
- Mode: `iwd`. Body: own-words deep analysis (standard YouTube license); slide equations, slide text and short code transcribed exactly.
- Frames used: 01_formula-slide, 02_idf-box, 03_bm25-main, 04_slide-labels, 05_schema-vespa, 06_schema-pyvespa, 07_rank-properties, 08_ui, 10_three-questions, 11_how-relevant, 12_three-factors, 13_deploy-to-files, 14_doc-sd, 15_results-default, 16_results-text-only, 17_results-url-only, 18_results-tuned, 19_results-tuned-scrolled.
- Own SVG diagrams: layers.
- Transcript SHA-256 (in-page = decoded): `bfd05fbe5fb546d732c8b45788700db9e302867ce90b4f2d587dbc1f91344c8a (en:asr track)`; kept in the session workspace only.

## TL;DR
Episode of a Vespa search-engine series. The speaker explains BM25 with three factors (term frequency, rarity, document length; long documents "slightly" penalised), walks through a formula slide (BM25 with k1, b, field_len/avg_field_len and the Lucene-style IDF log(1 + (N − n + 0.5)/(n + 0.5))), explains k1 and b in plain words (b typically 0.7–0.9; no k1 default given; "BM25 saturates": 50 vs 10 occurrences is not 5× the score), then shows Vespa usage (`index: enable-bm25`, `bm25(field)`, expression `bm25(text) + 0.1 * bm25(url)`) and four rank profiles on 4,012,059 documents, the last one with rank properties text k1 1.8 / b 0.40 and url k1 0.9 / b 0.30 ("arbitrary"). Results change per profile; the UI shows Vespa relevance scores per hit (top hit: default 32.7054, text-only 31.8371, URL-only 15.5547, tuned 41.257) but nothing measures quality.

## Key Concepts
Slide equations (transcribed exactly; base of log not stated):
$$\mathrm{BM25}(D,Q) = \sum_{i}^{n} IDF(q_i)\cdot\frac{f(q_i,D)\cdot(k_1+1)}{f(q_i,D)+k_1\cdot\left(1-b+b\cdot\frac{field\_len}{avg\_field\_len}\right)}$$
$$IDF(q_i) = \log\left(1+\frac{N-n(q_i)+0.5}{n(q_i)+0.5}\right)$$
Slide labels: D "Document D"; Q "Query containing n terms (tokens)"; q_i "Query term i"; IDF "how rare query term i is across all documents"; f(q_i, D) "number of occurrences (term frequency) of query term i in document D"; k1 "limits how much one query term can boost a document's score. Higher values let frequent terms increase the score more"; b "control the effect of the field length compared to the average field length. higher b favors short documents and penalizes long ones; lower b makes length matter less"; field_len "Length of document D"; avg_field_len "Average document length"; N "Total number of documents"; n(q_i) "Number of documents containing query term i".
Spoken: low k1 → seeing the term once is enough; high k1 → repeats boost more; b = 0 ignores length; b = 1 fully normalises; typical b 0.7 to 0.9.

Vespa schema slide (verbatim):
```
schema example {
  document example {
    field content type string {
      indexing: index | summary
      index: enable-bm25
    }
  }
  rank-profile default {
    first-phase {
      expression {
        bm25(content)
      }
    }
  }
}
```
pyvespa slide (key lines verbatim):
```python
Field(name="id", type="string", indexing=["summary"]),
Field(name="text", type="string", indexing=["index", "summary"], index="enable-bm25"),
Field(name="url", type="string", indexing=["index", "summary"]),
fieldsets=[FieldSet(name="default", fields=["text", "url"])],
RankProfile(name="bm25", functions=[Function(name="bm25texturl", expression="bm25(text) + 0.1 * bm25(url)")], first_phase="bm25texturl")
```
Intro slides (frames ~1:20–3:10): three questions ("How many times do those words appear in each document?", "Are they rare or common across the whole collection?", "Are we looking at a short, focused document or a huge blob of text?"); "python web framework" result page (1341 results; relevance 25.425 coruscatesolution.com, 25.1322 dmeitacademy.com) with "How relevant is this document to this query???"; summary "More matches => more score / Rarer words => more score / Very long documents => slight penalty so docs don't dominate just by being huge".
$$s(D) = \mathrm{bm25}(\text{text}) + 0.1\cdot\mathrm{bm25}(\text{url})$$

## Implementation
deploy_app.py profile 4 (verbatim key lines):
```python
RankProfile(
    name="bm25_comb_tuned",
    functions=[Function(name="bm25texturl_tuned", expression="bm25(text) + 0.1 * bm25(url)")],
    first_phase="bm25texturl_tuned",
    rank_properties=[
        ("bm25(text).k1", "1.8"),
        ("bm25(text).b", "0.40"),
        ("bm25(url).k1", "0.9"),
        ("bm25(url).b", "0.30"),
    ],
),
```
Four profiles (UI names): bm25_text_only, bm25_url_only, bm25 (text + url default) = bm25(text) + 0.1·bm25(url), bm25_comb_tuned = same with the rank properties above. End of deploy_app.py (~10:25): `vespa_docker = VespaDocker()`, `app = vespa_docker.deploy(application_package=package)`, `package.to_files(root="./vespa_app")`. Generated vespa_app/schemas/doc.sd (~10:40): fields id (summary), text and url (`indexing: index | summary`, `index: enable-bm25`), `fieldset default { fields: text, url }`, `rank-profile bm25_text_only { function bm25text() { expression { bm25(text) ...`.
Result lists for "chicago deep dish pizza" (1469 total, 10 shown):
| profile | latency on screen | #1 | #2 | #3 / #4 |
|---|---|---|---|---|
| bm25 (default) | 5.000 ms | livefar.com 32.7054 | zerogeographytravel.com 31.6851 | 31.6246 (URL not visible) |
| bm25_text_only | 8.000 ms | livefar.com 31.8371 | cleverwood.com 31.1591 | 30.8215 |
| bm25_url_only | 8.000 ms | zerogeographytravel.com 15.5547 | wsbt.com casserole 10.7989 | 10.6414 |
| bm25_comb_tuned | 8.000 ms (9.000 ms at ~14:27) | livefar.com 41.257 | zerogeographytravel.com 37.2295 | pizzarecs.com 37.1951 / cleverwood.com 36.6936 |
Writer inference (assumes per-field scores equal across profiles with default k1, b): $$32.7054 = 31.8371 + 0.1\cdot\mathrm{bm25}(\text{url}) \Rightarrow \mathrm{bm25}(\text{url})\approx 8.683$$ for livefar.com; $$31.6851 = \mathrm{bm25}(\text{text}) + 0.1\cdot 15.5547 \Rightarrow \mathrm{bm25}(\text{text})\approx 30.1296$$ for zerogeographytravel.com. URL field got `enable-bm25` in deploy_app.py. UI: "Indexed documents: 4012059", query "chicago deep dish pizza", latency "about 5 ms or less" (spoken).

Writer derivations and substitutions (not in the clip), with i = IDF, t = f, θ = field_len/avg_field_len:
$$s_i = i\cdot\frac{t(k_1+1)}{t+k_1(1-b+b\theta)},\qquad \lim_{t\to\infty}s_i = i\,(k_1+1),\qquad k_1=0 \Rightarrow s_i=i$$
$$L = 1-b+b\theta:\quad b=0\Rightarrow L=1;\quad b=1\Rightarrow L=\theta$$
$$s_{t=10}=\frac{10\cdot2.2}{10+1.2}=1.9643,\quad s_{t=50}=\frac{50\cdot2.2}{50+1.2}=2.1484,\quad \frac{s_{t=50}}{s_{t=10}}\approx1.094$$
(k1 1.2, b 0.75, θ 1, IDF 1.)
IDF at N = 4,012,059 (ln): n 1 → 14.7994; 100 → 10.5947; 10,000 → 5.9944; 1,000,000 → 1.3893; N/2 → 0.6931; N → 0.0000 (RSJ without +1 would give −15.898).
$$IDF(n=1)=\ln\left(1+\frac{4{,}012{,}059-1+0.5}{1+0.5}\right)=\ln 2{,}674{,}706.7\approx14.80$$
TF part, text field, default (1.2, 0.75) vs tuned (1.8, 0.40): θ = 1: tf 1/3/10 → 1.000/1.571/1.964 vs 1.000/1.750/2.373; θ = 4: 0.449/0.957/1.583 vs 0.565/1.207/2.006. b sweep (tf 1, k1 1.2): θ 4 → 1.000 (b 0), 0.604 (b 0.4), 0.449 (b 0.75), 0.379 (b 1).

Variants (docs):
- IDF term of IIR eq. (84) ((84) itself is the RSV_d sum): $$\mathrm{idf}_t=\log\frac{N}{df_t}$$  IDF term of IIR eq. (85) (RSJ; (85) is the RSV_d sum): $$\mathrm{idf}_t=\log\left(\frac{N-df_t+0.5}{df_t+0.5}\right)$$
- Lucene BM25Similarity: $$\mathrm{idf}=\ln\left(1+\frac{\mathrm{docCount}-\mathrm{docFreq}+0.5}{\mathrm{docFreq}+0.5}\right)$$ (= slide IDF with natural log; Vespa page same, N per content node)
- Lucene ≥ 8 (LUCENE-8563): $$s_i = IDF(q_i)\cdot\frac{f(q_i,D)}{f(q_i,D)+k_1\left(1-b+b\cdot\frac{field\_len}{avg\_field\_len}\right)}$$ scores divided by k1+1 (2.2 at k1 1.2); order preserved within one field, NOT when summing fields with different similarities — relevant to profile 4 (text k1 1.8 → factor 2.8; url k1 0.9 → factor 1.9). Vespa's docs print the (k1+1) form; we did not verify Vespa's code.
- Vespa rank properties: `bm25(fieldname).k1` default 1.2, `bm25(fieldname).b` default 0.75, `bm25(fieldname).averageFieldLength` (auto per field per content node; 100 for streaming search).

## Quick Reference
| item | value | origin |
|---|---|---|
| IDF | log(1 + (N − n + 0.5)/(n + 0.5)) | slide |
| b typical | 0.7–0.9 | speech |
| k1 typical | not given (Vespa/Lucene default 1.2) | docs |
| tuned text | k1 1.8, b 0.40 ("arbitrary") | screen |
| tuned url | k1 0.9, b 0.30 | screen |
| expression | bm25(text) + 0.1·bm25(url) | slide + screen |
| docs indexed | 4012059 | UI |
| 50 vs 10 | 1.094× (k1 1.2, b 0.75) | writer |
| ceiling per term | IDF·(k1+1) | writer |

## Comparisons
Profiles: text-only changed the 2nd result vs default; URL-only removed the first result seen before and put a URL containing "chicago deep dish pizza" first; tuned changed the 3rd result. Parameter sources: slide (b 0.7–0.9, (k1+1) form, Lucene IDF) vs Vespa docs (1.2/0.75, (k1+1) form) vs Lucene ≥ 8 (1.2/0.75, no k1+1) vs IIR (1.2–2/0.75, log N/df or RSJ).

## Fact Check
11 claims: 7 confirmed (slide formula = Vespa page and IIR eq. 86 shape; IDF = Lucene javadoc; b = 0/1 meaning; k1 low/high meaning; saturation 50 vs 10; rank-property names; Lucene 8 removed k1+1), 4 partly (BM25 in many engines confirmed, hybrid/RAG use not checked against a public source; N is per content node in Vespa; b typical 0.7–0.9 vs common default 0.75 inside it, Xapian 0.5; "slightly penalizes" depends on b — at defaults a 4× longer doc keeps 0.449 of the TF part).

## Open Questions & Extension Ideas
- The demo shows Vespa relevance scores per hit but never judges quality; tuning should be done on a held-out question set.
- For ZVect's Q&A page: per-field weighting body + w·title is directly analogous to bm25(text) + 0.1·bm25(url); decide the (k1+1) form explicitly because fields with different k1 are summed.
- The relevance scores on screen are never explained by the speaker; the per-field scores can be partly back-solved (see Implementation).

## Tags & Triggers
BM25, Vespa, enable-bm25, rank profile, rank properties, k1, b, IDF, saturation, length normalization, pyvespa, hybrid search.
Triggers: "how to enable BM25 in Vespa", "set k1 and b per field in Vespa", "what is the IDF in Vespa/Lucene BM25", "why does BM25 saturate".

## References
- Abhishek Thakur, "A no nonsense intro to BM25", YouTube, 2025-11-19, https://www.youtube.com/watch?v=TW9vHU1GpU4 (repo https://github.com/abhishekkrthakur/search, not opened)
- Vespa BM25, https://docs.vespa.ai/en/ranking/bm25.html ; rank feature configuration, https://docs.vespa.ai/en/reference/rank-feature-configuration.html
- Lucene BM25Similarity 9.10, https://lucene.apache.org/core/9_10_0/core/org/apache/lucene/search/similarities/BM25Similarity.html ; Lucene 8.1 MIGRATE, https://lucene.apache.org/core/8_1_0/MIGRATE.html
- IIR 11.4.3, https://nlp.stanford.edu/IR-book/html/htmledition/okapi-bm25-a-non-binary-model-1.html ; Xapian BM25 notes, https://xapian.org/docs/bm25.html
- Writer's recompute: recompute_redo.py (job folder); recompute_bm25_a.py (BM25 board).
