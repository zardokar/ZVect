# OpenAI Embeddings and Vector Databases Crash Course — Adrian Twarog - Claude Context
> Source: YouTube, Adrian Twarog, "OpenAI Embeddings and Vector Databases Crash Course", 18:41, published 2023-06-30 · https://www.youtube.com/watch?v=ySus5ZS0b94 · Generated: 2026-10-19
> Companion: 20230630_OpenAI-Embeddings-And-Vector-Databases-Crash-Course.html (Thai, iw mode `iwd`, 12 sections, 9 frames + 14 own SVG)

## Processing Notes
- Mode: `iwd`. Body: own-words rewrite (standard YouTube license).
- Frames used: P01, S10, S11, S12, S17, S20, S42, S79, S85.
- Own SVG diagrams: flow, flow, plane, tree, flow, lanes, flow, bars, layers, compare, flow, flow, heatmap, flow.
- Transcript SHA-256 (in-page = decoded): `7e5273c880cc5665061b375daba3003865a555db9ba8bdf8a3252bb5454fd7a2`; kept in the session workspace only.

## TL;DR

- Hands-on 18:41 clip (June 2023): turn text into OpenAI embeddings with a plain HTTP POST (shown in Postman), store them in a SingleStore table as BLOBs, and rank rows with SQL `dot_product(...) ... order by score desc`. It ends with a small Node.js `fetch` function and a plan for PDF → chunks → vectors → search.
- Concepts covered: embedding = data turned into a vector whose closeness means similarity (dog/puppy toy on a 2D plot); a vector database holds embeddings and serves search, clustering, recommendations and classification (the clip only does search).
- Real numbers on screen: `text-embedding-ada-002` returns **1536** values (the speaker says "hundreds of dimensions"); docs table shows max input **8191** tokens (current API reference: 8,192); "Hello World" = 2 tokens; search scores 0.840 / 0.787 / 0.698 (= 0.6978…) (query "open AI") and 0.897 / 0.743 / 0.697 (= 0.6970…) (query "hello Earth").
- Fact check: 19 claims; 11 confirmed, 7 partly, 0 not found, 1 contradicted (HTTP has no PUSH method). Most "partly" items are true for 2023 but outdated (SingleStore `VECTOR` type since 8.5, `text-embedding-3-small` 5x cheaper, OpenAI managed vector stores, Postman Free single-user since March 2026).
- Writer-found issues in the source: a generic illustrative slide shows an embedding value of -248.6, which cannot occur in an OpenAI (unit-length) embedding; the Node.js `return data` sits inside a `.then` callback, so `createEmbedding` returns `Promise<void>` (VS Code's own tooltip says so on screen).

## Key Concepts

- **Embedding (0:31–1:28).** "Data like words that have been converted into an array of numbers known as a vector that contains patterns of relationships"; the numbers act as a multi-dimensional map to measure similarity. Toy picture (0:53): unlabeled 2D axes with dog and puppy circled together, wolf nearby, tea / coffee / milk in one corner, congress far away. Toy numbers (0:58): dog `[0.1, 0.51, 0.6, 0.2, 0.8...]`, puppy `[0.3, 0.5, 0.9, 0.8, 0.4...]` (illustrative, second values highlighted green). Speaker: "in reality the vector has hundreds of Dimensions" (1:04) - the model actually used has 1536.
- **Other modalities (0:46, 1:13–1:25).** Slide: Object → transformer → Vector → Task for IMAGE (`[1.3, 0.6, 1.2, -1.3, ...]`, object recognition, deduplication, scene detection, product search), TEXT "Happy Birthday" (`[0.3, -0.4, 1.2, 0.3, ...]`, translation, sentiment, QA, semantic search), AUDIO (`[1.2, -0.3, 0.7, -1.8, ...]`, anomaly detection, speech-to-text, music transcription, machinery malfunction). Sunflower image split into regions → row `-0.69 | -0.15 | -0.84 | 0.20 | 0.07 | -0.53 | 0.12` labelled green / flower / background. Speaker claims this is "how Google does similar image searches" (not confirmed for Google Images specifically).
- **Embedding-model slide (0:40).** DATA ("LOREM IPSUM…") → embedding model → box `-0.001, 0.006, -0.014, …, -248.6`. The slide is a generic illustration (it does not claim to be OpenAI); -248.6 is an illustrative slide value that cannot occur in an OpenAI (unit-length) embedding, where every component is in [-1, 1]. The 0:46 slide likewise shows values beyond 1 (1.3, -1.3, -1.8).
- **Vector database (1:28–2:08).** A database full of embeddings. Four uses: searching (rank by relevance to a query string), clustering (group similar strings), recommendations (items with related text), classification (label by most similar label). OpenAI provides the model but (in 2023) no storage.
- **Input sizes (6:05–7:35).** Single word (dog, cat), multi-word sentence ("open AI vectors and embeddings are easy"), and large chunks (a paragraph or a whole document section embedded together as ONE embedding) - "the strength of embeddings". Hedged numbers: max "8 000 tokens more or less" ≈ "around 30 000 letters or characters"; a contract page "can be up to about 3 000 characters" ⇒ "you could probably embed about 10 pages in a single request". The NDA (non-disclosure agreement) page request "takes just about as much time as a single word". Response size is ~33 KB regardless of input length (33.34 KB for "Hello World", 33.45 KB for a paragraph) because the vector length is fixed.
- **Search procedure (12:55–13:19), spoken as 3 steps:** (1) decide what to search for; (2) create an embedding of the search term; (3) search the database against the stored embeddings → list with the closest similarity at the top.
- **Score = dot product.** The speaker only calls the scores ratings of how similar each row is. Writer note: with OpenAI embeddings normalised to length 1, `dot_product` equals cosine similarity (SingleStore docs + OpenAI guide); the demo's score range is narrow (an unrelated row still scores ~0.70), so only ranks are meaningful.

## Implementation

All code below is copied from the frames (line breaks and quoting as on screen). The API key on screen is replaced by `sk-…`.

**1. HTTP request (Postman, 3:05–6:05).**
- Method `POST`, URL `https://api.openai.com/v1/embeddings`.
- Authorization: Bearer token (secret key created at the OpenAI API keys page, named "embeddings").
- Body → raw → JSON (frame 5:41):

```json
{
    "model": "text-embedding-ada-002",
    "input": "Hello World"
}
```

- Response (6:01, 200 OK, 708 ms, 33.34 KB): `{ "object": "list", "data": [ { "object": "embedding", "index": 0, "embedding": [ -0.00709195, 0.0035555244, -0.0069518937, -0.029055351, ... ] } ], "model": "text-embedding-ada-002-v2", "usage": { "prompt_tokens": 2, "total_tokens": 2 } }`. In the pretty view the embedding runs from line 8 to line 1543 = 1536 values.
- Paragraph example on screen at 6:44 (200 OK, 652 ms, 33.45 KB):

```json
{
    "model": "text-embedding-ada-002",
    "input": "Adrian Twarog is a designer and developer who makes websites and apps using platforms like React Native. I'm hoping to share some of the things I've learnt over the years about my career and hobbies for coding, user interface and experience!"
}
```

- OpenAI docs table on screen (6:53), "Second-generation models": `text-embedding-ada-002 | cl100k_base | MAX INPUT TOKENS 8191 | OUTPUT DIMENSIONS 1536`; a calculator beside it shows `8191 × 4 = 32,764`.

**2. SingleStore setup (7:35–9:25).** Free account; workspace "OpenAI Vector Database" (SQL editor shows `openai-workspace`), AWS (Google Cloud / Azure possible), region default US West, smallest size (screen: S-00 = 2 vCPUs, 16 GB RAM, 0.25 credits/hour, 182.5 CR est. per month), advanced settings default; database "OpenAI database" (screen: `openaidatabase`).

**3. Table (10:40, ran in 609 ms):**

```sql
CREATE TABLE IF NOT EXISTS myvectortable (
    text TEXT,
    vector BLOB
);
```

**4. Insert (11:28–12:55).** Line 1 before the vector was pasted:

```sql
INSERT INTO myvectortable (text, vector) VALUES ( "Hello World", JSON_ARRAY_PACK() )
```

After pasting, the statement is 1538 lines: line 1, lines 2–1537 = the 1536 numbers one per line, line 1538 = `]") )`. Last lines as on screen (they match lines 1536–1543 of the Postman response):

```sql
                0.00658902,
                -0.01254142,
                -0.033206116,
                0.012770603,
                -0.000052123287,
                -0.027425602,
                -0.012770603,
                -0.0014753676
            ]") )
```

Not readable on any frame: the end of line 1 after the paste (it must open the string, i.e. `JSON_ARRAY_PACK("[` …, to match the closing `]")`). Result: "1 row added". Two more rows inserted the same way: "OpenAI Vectors and Embeddings are Easy!" and the NDA page ("Document includes: any paper or other materials on which there is writing, marks, figures, symbols or perforations having a meaning for persons…"). Equivalent single-line form (writer's reconstruction): `INSERT INTO myvectortable (text, vector) VALUES ("Hello World", JSON_ARRAY_PACK("[-0.00709195, 0.0035555244, ...]"));`

**5. Search (13:44–15:10).** Query before the query vector is pasted:

```sql
select text, dot_product(vector, JSON_ARRAY_PACK("[]")) as score
from myvectortable
order by score desc
limit 5;
```

With the pasted vector the query is 1541 lines, ending `]")) as score` / `from myvectortable` / `order by score desc` / `limit 5;`. Results on screen:

| query | rank | text | score |
|---|---|---|---|
| open AI | 1 | OpenAI Vectors and Embeddings are Easy! | 0.840060293674469 |
| open AI | 2 | Hello World | 0.7874311804771423 |
| open AI | 3 | Document includes: any paper … | 0.6978901624679565 |
| hello Earth | 1 | Hello World | 0.8969387412071228 |
| hello Earth | 2 | OpenAI Vectors and Embeddings are Easy! | 0.7428184747695923 |
| hello Earth | 3 | Document includes: any paper … | 0.6970030069351196 |

Both runs: "258 ms, Showing 3 rows". "hello Earth" is kept as heard (14:39); it may be a deliberate near-synonym of "Hello World".

**6. Node.js (15:10–17:45), `index.js` lines 2–25 (line 1 empty; at 18:06 the plan comments were added as lines 1–9, so this code then starts at line 11), folder `openai-vectors-and-embeddings`:**

```javascript
// OpenAI URL and Headers
const openAiHeaders = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer sk-…`
}

async function createEmbedding(textToEmbed) {
    let response = await fetch(`https://api.openai.com/v1/embeddings`, {
        method: 'POST',
        headers: openAiHeaders,
        body: JSON.stringify({
            'model': 'text-embedding-ada-002',
            'input': textToEmbed
        }),
    });
    if (response.ok){
        response.json().then(data => {
            console.log(data);
            return data;
        });
    }
}

createEmbedding("Hello World")
```

Terminal (`node index.js`): `(node:33564) ExperimentalWarning: The Fetch API is an experimental feature. This feature could change at any time`, then `{ object: 'list', data: [ { object: 'embedding', index: 0, embedding: [Array] } ], model: 'text-embedding-ada-002-v2', usage: { prompt_tokens: 2, total_tokens: 2 } }`. A grey Copilot-style suggestion `async function getSimilarity(text1, text2) {` appeared at line 25 and was not accepted.

**Pitfall (writer-found): the function does not return the data.** `return data` returns from the `.then` callback; nothing awaits that promise, so `createEmbedding` resolves to `undefined` (VS Code tooltip on screen: `createEmbedding(textToEmbed: any): Promise<void>`). Corrected version (writer, not in the clip):

```javascript
async function createEmbedding(textToEmbed) {
    const response = await fetch('https://api.openai.com/v1/embeddings', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({ model: 'text-embedding-3-small', input: textToEmbed })
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const json = await response.json();
    return json.data[0].embedding;
}
```

**7. Plan for extension (17:53–18:08), comments added at the top of index.js:**

```javascript
// PDF library

// Read PDF

// Chunk PDFs into paragraphs

// Store as Vectors

// Search and return as part of queries
```

Hand drawing beside it: PDF → (parser, a smiling triangle) → stack of pages (chunks) → database. Spoken: import a PDF library, read PDFs, chunk them, store in a database to retrieve and search later; same for websites. No chunk size, overlap or library name is given.

Other pitfalls (fact-check / writer):
- The query must be embedded with the same model as the stored rows; switching models means re-embedding the table (implicit in the clip, never said).
- If vectors are shortened (`dimensions` parameter of text-embedding-3), re-normalise or dot ≠ cosine.
- The SQL scans every row (brute force). Large tables need SingleStore 8.5+ `VECTOR` type + ANN index.
- Storage: 1536 × float32 = 6,144 bytes per ada-002 vector.
- The 4 characters/token rule (and therefore "~30,000 characters" and "~10 pages") is English-only; Thai uses far more tokens per character.
- One request can carry an array of inputs: up to 8,192 tokens each and 300,000 tokens total (current reference); the clip sends one text per request.
- Copy-pasting vectors from Postman into SQL is a demo only.

## Quick Reference

| item | value in the clip | note |
|---|---|---|
| endpoint | `POST https://api.openai.com/v1/embeddings` | unchanged in 2026 |
| auth | `Authorization: Bearer <key>` + `Content-Type: application/json` | |
| required fields | `model`, `input` | optional now: `encoding_format`, `user`, `dimensions` (v3 models) |
| model | `text-embedding-ada-002` (response: `text-embedding-ada-002-v2`) | now "older model", $0.10 / 1M tokens |
| dimensions | 1536 | speaker said "hundreds" |
| tokenizer | `cl100k_base` | docs table 6:53 |
| max input | spoken "8 000 tokens more or less"; screen 8191 | current reference 8,192 per input, 300,000 per request |
| chars per token | spoken ~30,000 chars; screen 8191 × 4 = 32,764 | English rule of thumb |
| "Hello World" | 2 tokens; 708 ms / 535 ms in Postman | |
| SingleStore | workspace `openai-workspace`, db `openaidatabase`, AWS US West, S-00 | |
| table | `myvectortable (text TEXT, vector BLOB)` | now `VECTOR` type available |
| pack | `JSON_ARRAY_PACK("[…]")` | needed for BLOB |
| score | `dot_product(vector, JSON_ARRAY_PACK("[…]")) as score` | = cosine for unit vectors |
| order | `order by score desc limit 5` | brute force |
| best score, "open AI" | 0.840060293674469 (OpenAI Vectors and Embeddings are Easy!) | |
| best score, "hello Earth" | 0.8969387412071228 (Hello World) vs 0.7428184747695923 | |
| Node | built-in `fetch`, experimental warning | stable since Node 21 |

## Comparisons

The clip itself compares only two queries (table above). Writer comparison of the clip's 2023 stack with the state at 2026-10-19 (from the fact check):

| aspect | clip (2023-06) | now (2026-10) |
|---|---|---|
| cheapest model | text-embedding-ada-002, $0.0001 / 1K tokens | text-embedding-3-small, $0.02 / 1M tokens (5x cheaper), `dimensions` parameter |
| vector column | BLOB + JSON_ARRAY_PACK | SingleStore 8.5+ `VECTOR` type, JSON strings compared directly, ANN index |
| storage at OpenAI | none | managed `vector_store` + `file_search` (files only, since 2024-04-17) |
| Node fetch | experimental | stable since Node 21 |
| Postman sharing | Free plan could create a team | Free plan single-user since March 2026 |

## Fact Check

19 claims checked on 2026-10-19 by a separate agent: 11 confirmed, 7 partly, 0 not found, 1 contradicted.

| # | claim (time) | verdict | correct statement |
|---|---|---|---|
| 1 | "hundreds of dimensions" (1:04) | partly | ada-002 = 1536; 3-small 1536, 3-large 3072 by default |
| 2 | Google similar-image search works this way (1:10) | partly | no official Google Images source; true as a general method |
| 3 | uses: search, clustering, recommendations, classification (1:32) | confirmed | OpenAI also lists anomaly detection, diversity measurement |
| 4 | OpenAI does not store embeddings (2:03) | partly | true in 2023; vector stores since 2024-04-17 (files only) |
| 5 | team workspace, picked so it can be shared later (3:15–3:40) | partly | Free plan single-user, no teams since March 2026 |
| 6 | request type "get post push" (4:00) | contradicted | no PUSH in HTTP; probably PUT or an ASR error |
| 7 | URL /v1/embeddings, POST (4:05) | confirmed | |
| 8 | bearer token auth (4:50) | confirmed | |
| 9 | only model + input needed (5:06) | confirmed | input may be an array |
| 10 | ada-002 is the cheapest (5:12) | partly | true then; 3-small 5x cheaper since 2024-01-25 |
| 11 | max ~8000 tokens (6:50) | confirmed | 8,192 (screen 8191); 300,000 per request |
| 12 | ~30,000 characters (6:55) | confirmed | 8,192 × 4 ≈ 32,768, English only |
| 13 | ~3,000 chars/page ⇒ ~10 pages (7:02–7:07) | confirmed | arithmetic holds; page size is the speaker's estimate |
| 14 | SingleStore "real-time unified distributed SQL" (7:45) | confirmed | wording is vendor marketing |
| 15 | free, credit, unlimited databases (8:05) | partly | free Shared tier (1 workspace), $500 trial; "unlimited" not found |
| 16 | AWS / Google / Azure (8:20) | confirmed | |
| 17 | BLOB + JSON_ARRAY_PACK necessary (9:55 / 11:11) | partly | VECTOR type since 8.5 (2024-01-19) |
| 18 | DOT_PRODUCT score, desc order (13:30–14:20) | confirmed | equals cosine for unit vectors |
| 19 | plain fetch, no axios (16:10) | confirmed | Node 18+; stable in Node 21 |

ASR repairs used in the report: "chat gbt"/"Dali" = ChatGPT/DALL·E; "single store" = SingleStore; "barrier token" = bearer token; "dot underscore product" = DOT_PRODUCT; "Json underscore array underscore pack" = JSON_ARRAY_PACK; "sample.2" = Sample Data tab; "an amending" = an embedding; "as a rose" = as rows; "my Vector table" = `myvectortable`.

## Open Questions & Extension Ideas

Author notes for planning ZVect lessons (a Thai, zero-dependency web course: ch.1 vectors, ch.2 distance/dot/cosine, ch.3 tokens/BPE, ch.4 embeddings, ch.5 nearest search, ch.6 ANN/HNSW, ch.7 bi-encoder/ColBERT/reranker, ch.8 LLM input + attention, ch.9–10 Transformer). Nothing in this section is from the clip.

- **ch.1 (vectors).** The dog/puppy 2D plot (0:53) is a ready motif: draw arrows from the origin to each word (as in the report's own plane figure, positions read from the frame: dog (7.0, 7.0), puppy (7.3, 5.8), wolf (8.5, 8.1), tea (1.7, 3.6), coffee (1.5, 1.7), milk (3.4, 1.7), congress (8.6, 0.7) on a 0–10 scale). Use it to separate "point" from "arrow".
- **ch.2 (dot / cosine).** Worked example from the clip's toy numbers (writer-computed): dog·puppy = 0.03 + 0.255 + 0.54 + 0.16 + 0.32 = 1.305; ‖dog‖ = 1.1446, ‖puppy‖ = 1.3964; cos θ = 0.8165, θ ≈ 35.3°. Teach why `dot_product` alone works in the clip: OpenAI vectors have length 1, so the denominator is 1. A good exercise: normalise dog and puppy, then show dot = cos. Also use the -248.6 slide as a "spot the error" item (unit vectors cannot have components outside [-1, 1]).
- **ch.2 / ch.5 (score scale).** The demo's unrelated row still scores ~0.70 on both queries (0.6978901624679565 and 0.6970030069351196), while winners score 0.84 and 0.897. Good lesson: cosine scores of real embeddings are compressed; rank, do not threshold at 0.5.
- **ch.3 (tokens).** "Hello World" = 2 tokens (`prompt_tokens: 2`), tokenizer `cl100k_base`, limit 8191/8,192 tokens, 4 chars/token for English (8191 × 4 = 32,764 on screen). Contrast with Thai text (many more tokens per character) - a natural ZVect exercise with a BPE demo.
- **ch.4 (embeddings).** Fixed output length regardless of input: 33.34 KB vs 33.45 KB responses for 2 tokens vs a paragraph. Show "one text → one 1536-number vector" and the Object → Vector → Task slide (image / text / audio).
- **ch.5 (nearest search).** The clip's SQL is exact brute-force k-NN with k = 5: score every row, sort, take top 5. ZVect can implement the same in plain JS over a small array and reproduce the clip's ranking pattern. Mention the same-model rule for query and corpus.
- **ch.6 (ANN).** Bridge from the clip: its full scan is fine for 3 rows; SingleStore 8.5+ adds `VECTOR` + ANN indexes for large tables. Use it to motivate HNSW.
- **ch.7 (retrieval quality).** The clip's PDF plan (read → chunk into paragraphs → store → search) never defines chunk size or overlap; ZVect could add a chunking lesson before rerankers.
- **Code hygiene for any ZVect code sample:** return the embedding (`json.data[0].embedding`), read the key from an environment variable, handle `!response.ok`, send arrays of inputs in one request.
- Open question: the end of line 1 of the pasted INSERT is not visible on any frame; the closing `]") )` implies `JSON_ARRAY_PACK("[`.
- Open question: whether "hello Earth" (14:39) was the typed query or an ASR rendering of "hello world" cannot be settled from the frames read.

## Tags & Triggers

embeddings, vector database, OpenAI embeddings API, text-embedding-ada-002, 1536 dimensions, SingleStore, DOT_PRODUCT, JSON_ARRAY_PACK, BLOB vs VECTOR, cosine similarity, brute-force k-NN, Postman, Node.js fetch, chunking PDFs, ZVect ch.2 / ch.4 / ch.5

- How do I request an embedding from OpenAI with plain HTTP?
- How do I store and search embeddings in SingleStore with SQL?
- Why does dot product equal cosine similarity for OpenAI embeddings?
- What is the input limit of text-embedding-ada-002 and how many pages fit?
- What is wrong with returning data inside `.then` in an async function?

## References

- Adrian Twarog, "OpenAI Embeddings and Vector Databases Crash Course", YouTube, 2023-06-30: https://www.youtube.com/watch?v=ySus5ZS0b94
- OpenAI Embeddings API reference: https://developers.openai.com/api/reference/resources/embeddings/methods/create
- OpenAI, New and improved embedding model (2022-12-15): https://openai.com/index/new-and-improved-embedding-model/
- OpenAI, New embedding models and API updates (2024-01-25): https://openai.com/index/new-embedding-models-and-api-updates/
- OpenAI, Function calling and other API updates (2023-06-13): https://openai.com/index/function-calling-and-other-api-updates
- OpenAI Embeddings guide: https://developers.openai.com/api/docs/guides/embeddings.md
- OpenAI model page, text-embedding-ada-002: https://developers.openai.com/api/docs/models/text-embedding-ada-002.md
- OpenAI, What are tokens: https://help.openai.com/en/articles/4936856-what-are-tokens-and-how-to-count-them
- OpenAI community, New features in the Assistants API: https://community.openai.com/t/new-features-in-the-assistants-api/720539
- OpenAI community, Model shutdowns in 2026: https://community.openai.com/t/deprecation-notice-upcoming-model-shutdowns-in-2026/1379553
- OpenAI vector stores reference: https://developers.openai.com/api/reference/cli/resources/vector_stores/methods/create/index.md
- SingleStore DOT_PRODUCT: https://docs.singlestore.com/cloud/reference/sql-reference/vector-functions/dot-product/
- SingleStore vector data type (8.5): https://www.singlestore.com/blog/singlestore-vector-data-type-support/
- SingleStore pricing: https://singlestore.com/pricing
- SingleStore Helios free trial: https://docs.singlestore.com/cloud/developer-resources/try-singlestore-helios-for-free/sign-up-to-try-singlestore-helios.md
- MemSQL (Wikipedia mirror): https://wiki.krisyotam.com/content/wikipedia_en_all_nopic_2026-03/MemSQL
- SingleStore press release (secondary): https://www.fintechfutures.com/press-releases/singlestore-announces-key-innovations-for-world-s-only-unified-database-built-for-real-time
- Google Cloud Vertex AI Vector Search overview: https://docs.cloud.google.com/vertex-ai/docs/matching-engine/overview?hl=zh-cn
- Postman plans: https://learning.postman.com/docs/billing/about-plans
- MDN HTTP request methods: https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Methods
- Node.js 21 release: https://nodejs.org/en/blog/announcements/v21-release-announce

## Equations (LaTeX)
1. $$ \mathbf{a}\cdot\mathbf{b}=\sum_{i=1}^{n} a_i\, b_i $$
2. $$ \cos\theta=\frac{\mathbf{a}\cdot\mathbf{b}}{\lVert\mathbf{a}\rVert\,\lVert\mathbf{b}\rVert} $$
