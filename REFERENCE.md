# REFERENCE

แหล่งที่ไปอ่านหรือดูมา แล้วนำมาประกอบบทเรียนใน ZVect พร้อมบอกว่าเอาอะไรมาใช้ ตรงไหนแก้ และตรงไหนเราคำนวณเพิ่มเอง

กติกา:

- ตัวเลขทุกตัวในบทเรียนคำนวณใหม่ในเครื่องด้วย `lib/` ไม่ได้ลอกจากคลิป ถ้าตัวเลขในคลิปผิด จะบอกไว้ในหัวข้อ "แก้จากต้นฉบับ"
- ทุกแหล่งที่อ่านด้วย iw มีไฟล์สองชุด: รายงานภาษาไทย `docs/outhtm/` (เปิดจากปุ่ม "อ่านเพิ่ม" ในบทเรียนได้) และไฟล์บริบทภาษาอังกฤษ `docs/aimd/` สำหรับ AI session ถัดไป
- เลขบทในไฟล์นี้ใช้เลขแบบบท.หัวข้อ สร้างด้วย `npm run reindex` จาก `web/data/chapters.json` (10 บท 43 หัวข้อ; ประวัติการเลื่อนเลขอยู่ใน checkpoint): 1.1 Vector · 1.2 ความยาว · 1.3 Vector space · 1.4 บวก ลบ คูณ · 1.5 Matrix · 2.1 Euclidean distance · 2.2 Dot product · 2.3 Cosine · 3.1 Tokenization · 3.2 BPE · 3.3 Tokenizer ของ GPT (byte-level BPE) · 3.4 Token ID · 4.1 One-hot · 4.2 Bag of words · 4.3 Embedding matrix · 4.4 ตารางมาจากการฝึก · 4.5 Latent space · 4.6 ใช้ model เดียวกัน · 4.7 Static กับ contextual · 5.1 ค้นด้วย cosine · 5.2 ค้นด้วย distance · 5.3 ค้นด้วย dot · 5.4 เลือกวิธีวัด · 5.5 ค้นด้วยคำ vs ความหมาย · 6.1 ค้นทุกชิ้น (brute force) · 6.2 มิติสูง · 6.3 เวกเตอร์ 1 บิต (XOR + popcount) · 6.4 ANN แบบต้นไม้ · 7.1 ANN แบบกราฟชั้นเดียว · 7.2 HNSW กราฟหลายชั้น · 7.3 HNSW beam (efSearch) · 7.4 HNSW สร้างชั้นด้วยการโยนเหรียญ · 7.5 กรองระหว่างค้น · 8.1 Bi-Encoder · 8.2 Late interaction (ColBERT) · 8.3 Reranker (Cross-Encoder) · 8.4 Classification · 9.1 LLM input (embedding + ตำแหน่ง) · 9.2 Attention: query · key · 10.1 Transformer มาจากไหน · 10.2 Self-attention เต็มสูตร · 10.3 ตำแหน่งแบบ sin / cos · 10.4 Transformer block
- อ่านแหล่งใหม่เมื่อไหร่ ให้เพิ่มแถวในตารางด้านล่าง เพิ่มหัวข้อของแหล่งนั้น (พร้อมบรรทัด `tags:` และแถวใน "ดัชนี tag") และเพิ่มแถวใน READING REGISTRY ของ checkpoint ล่าสุด
- tag ใช้ตัวพิมพ์เล็กคั่นด้วย `-` ใช้คำเดิมซ้ำเมื่อเรื่องเดียวกัน (ดูรายการในดัชนี) tag `zvect-x-y` ไม่ใช้ในไฟล์นี้ บทที่ใช้อยู่ในบรรทัด `ใช้ในบท:` แล้ว

## วิธีค้นแบบประหยัด token (สำหรับ AI session)

1. อ่านแค่ส่วนนี้ถึงท้าย "ดัชนี tag" ก่อน (ไม่ต้องอ่านทั้งไฟล์)
2. หา ref จากกลุ่มหัวข้อหรือ tag แล้วกระโดดไปที่หัวข้อของแหล่งนั้น: `grep -n "^## yt:<ref>" REFERENCE.md` หรือ `grep -n "tags:.*<tag>" REFERENCE.md`
3. แต่ละหัวข้อของแหล่งมีบรรทัด `tags:` และ `ใช้ในบท:` อยู่ใต้หัวข้อทันที อ่านเฉพาะหัวข้อนั้น ถ้าต้องการรายละเอียดเต็มค่อยเปิด `docs/aimd/<ชื่อ>_claude.md` (อังกฤษ สั้นกว่ารายงาน HTML มาก)

### กลุ่มหัวข้อ

| กลุ่ม | ref |
|---|---|
| RAG / Multivector | yt:6iCmnd0k3fs · yt:xTzUn3G9YA0 · yt:8LPgGU34RoE · yt:H6q1UWCCnKw · yt:wyWFLIlgmAw |
| ColBERT / late interaction | yt:xTzUn3G9YA0 · yt:aiNQ4I8YaD0 · yt:8LPgGU34RoE · yt:6iCmnd0k3fs |
| Embeddings | yt:my5wFNQpFO0 · yt:hVM8qGRTaOA · yt:YIR-KxNpSbA · yt:S7tFyREI19I · yt:lPTcTh5sRug · yt:NEreO2zlXDk · yt:1Qex37vowTM · yt:H6q1UWCCnKw · yt:izbifbq3-eI · yt:Q6TBHDgWCDQ |
| Tokenization | yt:zduSFxRajkE · yt:izbifbq3-eI · yt:BcxJk4WQVIw · yt:YIR-KxNpSbA · yt:hVM8qGRTaOA · yt:lPTcTh5sRug |
| วัดความใกล้ (metrics) | yt:xTaDx3tbYMs · yt:e9U0QAFbfLI · yt:fNk_zzaMoSs |
| ค้นเร็ว / ANN / vector DB | yt:Lc4dzmSFb14 · yt:c10w0Ptn_CU · yt:bU38Ovdh3NY · yt:YLkSfz3EFGw · yt:wyWFLIlgmAw |
| Quantization / precision | yt:bU38Ovdh3NY · yt:6iCmnd0k3fs · yt:aiNQ4I8YaD0 · yt:4JofSJIrjwU |
| ภายใน LLM (attention, token ถัดไป) | yt:YIR-KxNpSbA · yt:zduSFxRajkE · yt:hVM8qGRTaOA · yt:1Qex37vowTM · yt:xTaDx3tbYMs · yt:YmLp8qe87A0 |
| LLM - Stanford (CME295: Transformer เต็มสูตร) | yt:114i2Kz-LZA |
| Fine-tuning / LoRA (ฝึก model ต่อ, เทียบกับ RAG) | yt:4JofSJIrjwU · yt:S7tFyREI19I · yt:YmLp8qe87A0 |
| TabFM / foundation model สำหรับตาราง (zero-shot, in-context) | yt:5YJGDElbCDY · yt:8vW6gi5vRes · yt:XwYPRLMLcNs · yt:78_sbNNJe3Q · yt:tYO_bgB4Ti0 · yt:Xym8FGDcl34 |
| Sentiment analysis | yt:5HQCNAsSO-s |
| LSA / LSI (SVD บน term-document) | yt:hB51kkus-Rc · yt:Fy0bF7u6W20 · yt:NWb_4O3ssbA · yt:YX4xRIQ84Z0 · yt:OXJdfpEFmF8 · yt:M1duqgg8-IM · yt:bzNch-dBCN8 |
| TF-IDF | yt:zLMEnNbdh4Q · yt:OymqCnh-APA · yt:TBUpxFw8oIA · yt:RPMYV-eb6lI |
| BM25 / ค้นด้วยคำ (keyword ranking) | yt:ruBm9WywevM · yt:TW9vHU1GpU4 · yt:fZH97QHHYjY · yt:XvKiTfd6Xvo |
| Hybrid search / RRF / reranking | yt:BwgBU0CekFk · yt:1qQCuWiRIfA · yt:7WEtNxVh1vo · yt:VWA15n6uiS4 |
| LLM - พื้นฐาน การใช้ผ่าน API และวิธีเล่าให้เข้าใจง่าย | yt:-f_i_a13IKc · yt:YHNi88FaGug |
| SFT / curate ข้อมูล / ประเมินการแปล (ไทย-อังกฤษ) | arxiv:2609.34770 |
| Visualization (Transformer และ visual analytics) | yt:TFUc41G2ikY · yt:ECR4oAwocjs · yt:uboTKqPNU5Y · yt:nZYHazugVNA · yt:-jeck0yrT_Q |

### ดัชนี tag

| tag | ref |
|---|---|
| `20-newsgroups` | yt:OXJdfpEFmF8 |
| `ablation` | arxiv:2609.34770 |
| `absa` | yt:5HQCNAsSO-s |
| `adult-income` | yt:8vW6gi5vRes |
| `agent-search` | yt:YLkSfz3EFGw · yt:fZH97QHHYjY |
| `agents` | yt:5YJGDElbCDY · yt:YHNi88FaGug |
| `alpaca-format` | yt:4JofSJIrjwU |
| `ann` | yt:Lc4dzmSFb14 · yt:c10w0Ptn_CU · yt:wyWFLIlgmAw |
| `annoy` | yt:c10w0Ptn_CU |
| `anserini` | yt:fZH97QHHYjY |
| `apache-spark` | yt:OXJdfpEFmF8 |
| `approximate-matching` | yt:nZYHazugVNA |
| `arc-diagram` | yt:uboTKqPNU5Y |
| `arxiv` | arxiv:2609.34770 |
| `asymmetric-quantization` | yt:6iCmnd0k3fs |
| `attention` | yt:YIR-KxNpSbA · yt:hVM8qGRTaOA · yt:xTaDx3tbYMs · yt:YmLp8qe87A0 · yt:114i2Kz-LZA · yt:-f_i_a13IKc · yt:TFUc41G2ikY · yt:ECR4oAwocjs · yt:uboTKqPNU5Y |
| `attention-graph` | yt:uboTKqPNU5Y |
| `attention-is-not-explanation` | yt:XwYPRLMLcNs |
| `autoregressive` | yt:YmLp8qe87A0 |
| `backpropagation` | yt:YmLp8qe87A0 |
| `bag-of-words` | yt:e9U0QAFbfLI · yt:hVM8qGRTaOA · yt:Q6TBHDgWCDQ · yt:5HQCNAsSO-s · yt:hB51kkus-Rc · yt:zLMEnNbdh4Q |
| `beir` | yt:XvKiTfd6Xvo |
| `benchmarking` | yt:Xym8FGDcl34 |
| `bert` | yt:uboTKqPNU5Y |
| `best-first-search` | yt:wyWFLIlgmAw |
| `bge` | yt:BwgBU0CekFk |
| `bi-encoder` | yt:H6q1UWCCnKw · yt:VWA15n6uiS4 |
| `bike-sharing` | yt:78_sbNNJe3Q |
| `binary-quantization` | yt:6iCmnd0k3fs · yt:bU38Ovdh3NY |
| `bm25` | yt:YLkSfz3EFGw · yt:ruBm9WywevM · yt:TW9vHU1GpU4 · yt:fZH97QHHYjY · yt:XvKiTfd6Xvo · yt:7WEtNxVh1vo |
| `bm25-b` | yt:ruBm9WywevM · yt:TW9vHU1GpU4 · yt:fZH97QHHYjY |
| `bm25-k1` | yt:ruBm9WywevM · yt:TW9vHU1GpU4 · yt:fZH97QHHYjY |
| `bm25s` | yt:fZH97QHHYjY · yt:XvKiTfd6Xvo |
| `bootstrap-ci` | yt:Xym8FGDcl34 |
| `bpe` | yt:BcxJk4WQVIw · yt:YIR-KxNpSbA · yt:zduSFxRajkE · yt:YmLp8qe87A0 · yt:114i2Kz-LZA |
| `browsecomp-plus` | yt:fZH97QHHYjY |
| `brute-force` | yt:Lc4dzmSFb14 · yt:c10w0Ptn_CU |
| `byte-fallback` | yt:zduSFxRajkE |
| `byte-level-bpe` | yt:zduSFxRajkE |
| `cbow` | yt:hVM8qGRTaOA · yt:Q6TBHDgWCDQ |
| `centering` | yt:hB51kkus-Rc |
| `centroids` | yt:aiNQ4I8YaD0 |
| `chain-of-thought` | yt:YHNi88FaGug |
| `chatbot` | yt:YmLp8qe87A0 |
| `chroma` | yt:BwgBU0CekFk · yt:7WEtNxVh1vo |
| `chunk-dedup` | yt:1qQCuWiRIfA |
| `chunking` | yt:xTzUn3G9YA0 · yt:TBUpxFw8oIA |
| `class-imbalance` | yt:8vW6gi5vRes |
| `cluster-width` | yt:-jeck0yrT_Q |
| `cohen-kappa` | arxiv:2609.34770 |
| `cohere-rerank` | yt:XvKiTfd6Xvo · yt:VWA15n6uiS4 |
| `colbert` | yt:6iCmnd0k3fs · yt:8LPgGU34RoE · yt:aiNQ4I8YaD0 · yt:xTzUn3G9YA0 |
| `collection-frequency` | yt:TBUpxFw8oIA |
| `column-attention` | yt:8vW6gi5vRes · yt:XwYPRLMLcNs |
| `combmnz` | yt:BwgBU0CekFk |
| `cometkiwi` | arxiv:2609.34770 |
| `computesvd` | yt:OXJdfpEFmF8 |
| `concept-strength` | yt:M1duqgg8-IM |
| `condorcet` | yt:BwgBU0CekFk |
| `confusion-matrix` | yt:tYO_bgB4Ti0 |
| `context-window` | yt:YmLp8qe87A0 · yt:YHNi88FaGug |
| `contextual-embeddings` | yt:YIR-KxNpSbA · yt:izbifbq3-eI · yt:Q6TBHDgWCDQ |
| `contrastive-learning` | yt:S7tFyREI19I |
| `corenlp` | yt:OXJdfpEFmF8 |
| `cosine` | yt:e9U0QAFbfLI · yt:xTaDx3tbYMs · yt:Q6TBHDgWCDQ · yt:M1duqgg8-IM · yt:bzNch-dBCN8 · yt:zLMEnNbdh4Q |
| `countvectorizer` | yt:Fy0bF7u6W20 · yt:NWb_4O3ssbA · yt:OXJdfpEFmF8 |
| `covariance-vs-xtx` | yt:YX4xRIQ84Z0 |
| `critical-reading` | yt:XwYPRLMLcNs · yt:Xym8FGDcl34 |
| `cross-attention` | yt:114i2Kz-LZA |
| `cross-encoder` | yt:H6q1UWCCnKw · yt:XvKiTfd6Xvo · yt:VWA15n6uiS4 |
| `data-recipes` | yt:4JofSJIrjwU |
| `data-selection` | arxiv:2609.34770 |
| `debugging` | yt:RPMYV-eb6lI |
| `deerwester-1990` | yt:bzNch-dBCN8 |
| `dense-retrieval` | yt:xTzUn3G9YA0 |
| `dimensionality-reduction` | yt:hB51kkus-Rc · yt:bzNch-dBCN8 |
| `distillation` | arxiv:2609.34770 |
| `distributional-hypothesis` | yt:Q6TBHDgWCDQ |
| `document-frequency` | yt:TBUpxFw8oIA · yt:RPMYV-eb6lI |
| `document-term-matrix` | yt:hB51kkus-Rc |
| `dodrio` | yt:uboTKqPNU5Y |
| `dot-product` | yt:xTaDx3tbYMs |
| `dr-dci` | yt:fZH97QHHYjY |
| `edge-threshold` | yt:uboTKqPNU5Y |
| `ef-construction` | yt:wyWFLIlgmAw |
| `efsearch` | yt:Lc4dzmSFb14 · yt:wyWFLIlgmAw |
| `eliza` | yt:YmLp8qe87A0 |
| `embedding-dimensions` | yt:1Qex37vowTM · yt:YIR-KxNpSbA |
| `embedding-matrix` | yt:YIR-KxNpSbA · yt:hVM8qGRTaOA · yt:lPTcTh5sRug · yt:my5wFNQpFO0 |
| `embedding-model-choice` | yt:H6q1UWCCnKw · yt:Q6TBHDgWCDQ |
| `embeddinggemma-2` | yt:S7tFyREI19I |
| `embeddings` | yt:1Qex37vowTM · yt:H6q1UWCCnKw · yt:NEreO2zlXDk · yt:S7tFyREI19I · yt:YIR-KxNpSbA · yt:hVM8qGRTaOA · yt:lPTcTh5sRug · yt:my5wFNQpFO0 · yt:izbifbq3-eI · yt:Q6TBHDgWCDQ · yt:YmLp8qe87A0 · yt:ECR4oAwocjs |
| `emotion-detection` | yt:5HQCNAsSO-s |
| `encoder-decoder` | yt:114i2Kz-LZA · yt:-f_i_a13IKc |
| `encoding-matrix` | yt:Fy0bF7u6W20 · yt:NWb_4O3ssbA |
| `ensemble` | yt:78_sbNNJe3Q |
| `ensemble-retriever` | yt:7WEtNxVh1vo |
| `epochs` | yt:4JofSJIrjwU |
| `euclidean` | yt:xTaDx3tbYMs |
| `evaluation` | yt:S7tFyREI19I · yt:8vW6gi5vRes · yt:fZH97QHHYjY · yt:XvKiTfd6Xvo · arxiv:2609.34770 |
| `exemplar-view` | yt:-jeck0yrT_Q |
| `explanation-flow` | yt:-f_i_a13IKc |
| `f1` | yt:8vW6gi5vRes · yt:tYO_bgB4Ti0 |
| `fact-checked` | yt:6iCmnd0k3fs · yt:8LPgGU34RoE · yt:H6q1UWCCnKw · yt:S7tFyREI19I · yt:YIR-KxNpSbA · yt:YLkSfz3EFGw · yt:Q6TBHDgWCDQ · yt:wyWFLIlgmAw · yt:YmLp8qe87A0 · yt:114i2Kz-LZA · yt:4JofSJIrjwU · yt:5YJGDElbCDY · yt:8vW6gi5vRes · yt:XwYPRLMLcNs · yt:78_sbNNJe3Q · yt:tYO_bgB4Ti0 · yt:Xym8FGDcl34 · yt:5HQCNAsSO-s · yt:hB51kkus-Rc · yt:Fy0bF7u6W20 · yt:NWb_4O3ssbA · yt:YX4xRIQ84Z0 · yt:OXJdfpEFmF8 · yt:M1duqgg8-IM · yt:bzNch-dBCN8 · yt:zLMEnNbdh4Q · yt:OymqCnh-APA · yt:TBUpxFw8oIA · yt:RPMYV-eb6lI · yt:ruBm9WywevM · yt:TW9vHU1GpU4 · yt:fZH97QHHYjY · yt:XvKiTfd6Xvo · yt:BwgBU0CekFk · yt:1qQCuWiRIfA · yt:7WEtNxVh1vo · yt:VWA15n6uiS4 · yt:-f_i_a13IKc · yt:YHNi88FaGug · arxiv:2609.34770 |
| `feature-explorer` | yt:-jeck0yrT_Q |
| `feed-forward` | yt:114i2Kz-LZA |
| `few-shot` | yt:YHNi88FaGug |
| `filtering` | yt:bU38Ovdh3NY |
| `fine-tuning` | yt:YmLp8qe87A0 · yt:4JofSJIrjwU |
| `fine-tuning-embeddings` | yt:S7tFyREI19I |
| `fiqa` | yt:XvKiTfd6Xvo |
| `force-layout` | yt:uboTKqPNU5Y |
| `frozen-weights` | yt:XwYPRLMLcNs |
| `full-fine-tuning` | arxiv:2609.34770 |
| `gemba` | arxiv:2609.34770 |
| `generative-ai` | yt:-f_i_a13IKc |
| `gguf` | yt:4JofSJIrjwU |
| `gpt-2` | yt:TFUc41G2ikY |
| `gradient-boosting` | yt:Xym8FGDcl34 |
| `graph-query` | yt:nZYHazugVNA · yt:-jeck0yrT_Q |
| `grep` | yt:fZH97QHHYjY |
| `head-overview` | yt:uboTKqPNU5Y |
| `high-dimensions` | yt:xTaDx3tbYMs |
| `hindi` | yt:YIR-KxNpSbA |
| `history-of-ai` | yt:YmLp8qe87A0 · yt:114i2Kz-LZA |
| `hnsw` | yt:Lc4dzmSFb14 · yt:bU38Ovdh3NY · yt:wyWFLIlgmAw |
| `hornet` | yt:fZH97QHHYjY |
| `hybrid-search` | yt:YLkSfz3EFGw · yt:TW9vHU1GpU4 · yt:XvKiTfd6Xvo · yt:BwgBU0CekFk · yt:7WEtNxVh1vo · yt:VWA15n6uiS4 |
| `hyperplane` | yt:c10w0Ptn_CU |
| `idf-log-base` | yt:zLMEnNbdh4Q |
| `idiom` | yt:5HQCNAsSO-s |
| `ifd` | arxiv:2609.34770 |
| `in-batch-negatives` | yt:S7tFyREI19I |
| `in-browser` | yt:6iCmnd0k3fs · yt:TFUc41G2ikY |
| `in-context-learning` | yt:5YJGDElbCDY · yt:8vW6gi5vRes · yt:XwYPRLMLcNs · yt:78_sbNNJe3Q · yt:Xym8FGDcl34 · yt:-f_i_a13IKc |
| `index-artifacts` | yt:aiNQ4I8YaD0 |
| `inference-cost` | yt:tYO_bgB4Ti0 |
| `information-retrieval` | yt:zLMEnNbdh4Q |
| `instruction-tuning` | yt:4JofSJIrjwU · yt:-f_i_a13IKc · arxiv:2609.34770 |
| `interaction-design` | yt:nZYHazugVNA · yt:-jeck0yrT_Q |
| `intuition` | yt:OymqCnh-APA |
| `inverse-document-frequency` | yt:OXJdfpEFmF8 · yt:zLMEnNbdh4Q · yt:OymqCnh-APA · yt:TBUpxFw8oIA · yt:RPMYV-eb6lI · yt:TW9vHU1GpU4 · yt:fZH97QHHYjY |
| `inverted-index` | yt:Lc4dzmSFb14 · yt:RPMYV-eb6lI |
| `ivf` | yt:aiNQ4I8YaD0 |
| `javascript` | yt:RPMYV-eb6lI |
| `jax` | yt:tYO_bgB4Ti0 |
| `k-60` | yt:1qQCuWiRIfA |
| `k-means` | yt:aiNQ4I8YaD0 |
| `keyword-extraction` | yt:RPMYV-eb6lI |
| `keyword-search` | yt:Lc4dzmSFb14 · yt:YLkSfz3EFGw · yt:ruBm9WywevM · yt:TW9vHU1GpU4 · yt:fZH97QHHYjY · yt:7WEtNxVh1vo |
| `king-queen-analogy` | yt:izbifbq3-eI |
| `knn` | yt:NEreO2zlXDk · yt:c10w0Ptn_CU · yt:wyWFLIlgmAw |
| `l2-normalization` | yt:YX4xRIQ84Z0 · yt:zLMEnNbdh4Q · yt:OymqCnh-APA |
| `label-smoothing` | yt:114i2Kz-LZA |
| `langchain` | yt:BwgBU0CekFk · yt:7WEtNxVh1vo · yt:VWA15n6uiS4 |
| `late-interaction` | yt:6iCmnd0k3fs · yt:8LPgGU34RoE · yt:xTzUn3G9YA0 |
| `latent-space` | yt:1Qex37vowTM · yt:NEreO2zlXDk · yt:hVM8qGRTaOA · yt:Q6TBHDgWCDQ · yt:M1duqgg8-IM · yt:bzNch-dBCN8 |
| `layer-norm` | yt:114i2Kz-LZA |
| `learning-rate` | yt:4JofSJIrjwU |
| `lemmatization` | yt:OXJdfpEFmF8 |
| `length-normalization` | yt:ruBm9WywevM · yt:TW9vHU1GpU4 |
| `letor-3` | yt:BwgBU0CekFk |
| `lexicon-based` | yt:5HQCNAsSO-s |
| `linear-algebra` | yt:fNk_zzaMoSs |
| `linked-views` | yt:nZYHazugVNA · yt:-jeck0yrT_Q |
| `live-coding` | yt:RPMYV-eb6lI |
| `llama-3-1` | yt:4JofSJIrjwU |
| `llm` | yt:-f_i_a13IKc · yt:YHNi88FaGug |
| `llm-as-judge` | arxiv:2609.34770 |
| `llm-internals` | yt:1Qex37vowTM · yt:YIR-KxNpSbA · yt:hVM8qGRTaOA · yt:zduSFxRajkE · yt:izbifbq3-eI · yt:YmLp8qe87A0 |
| `llm-quirks` | yt:zduSFxRajkE |
| `local-llm` | yt:4JofSJIrjwU |
| `local-minimum` | yt:wyWFLIlgmAw |
| `log-base` | yt:OymqCnh-APA |
| `log10` | yt:TBUpxFw8oIA |
| `lookup-table` | yt:6iCmnd0k3fs |
| `lora` | yt:S7tFyREI19I · yt:4JofSJIrjwU |
| `lsa` | yt:hB51kkus-Rc · yt:Fy0bF7u6W20 · yt:NWb_4O3ssbA · yt:YX4xRIQ84Z0 · yt:OXJdfpEFmF8 · yt:M1duqgg8-IM · yt:bzNch-dBCN8 |
| `lsi` | yt:M1duqgg8-IM · yt:bzNch-dBCN8 |
| `lstm` | yt:114i2Kz-LZA |
| `lucene` | yt:ruBm9WywevM · yt:TW9vHU1GpU4 · yt:fZH97QHHYjY · yt:XvKiTfd6Xvo |
| `machine-translation` | arxiv:2609.34770 |
| `masked-attention` | yt:114i2Kz-LZA |
| `matmul-popover` | yt:TFUc41G2ikY · yt:ECR4oAwocjs |
| `matrix-rank` | yt:M1duqgg8-IM |
| `matryoshka` | yt:H6q1UWCCnKw |
| `maxsim` | yt:6iCmnd0k3fs · yt:8LPgGU34RoE · yt:xTzUn3G9YA0 |
| `metric-choice` | yt:xTaDx3tbYMs |
| `metricx` | arxiv:2609.34770 |
| `min-df` | yt:NWb_4O3ssbA |
| `minbpe` | yt:zduSFxRajkE |
| `mixed-precision` | yt:aiNQ4I8YaD0 |
| `mteb` | yt:Q6TBHDgWCDQ |
| `multi-head-attention` | yt:YmLp8qe87A0 · yt:114i2Kz-LZA |
| `multi-query` | yt:BwgBU0CekFk · yt:1qQCuWiRIfA · yt:7WEtNxVh1vo |
| `multilingual` | yt:H6q1UWCCnKw |
| `multimodal` | yt:-f_i_a13IKc |
| `multimodal-embeddings` | yt:S7tFyREI19I |
| `multivector` | yt:6iCmnd0k3fs · yt:8LPgGU34RoE · yt:xTzUn3G9YA0 |
| `n-gram` | yt:hVM8qGRTaOA · yt:Q6TBHDgWCDQ |
| `naive-bayes` | yt:5HQCNAsSO-s |
| `natural-log` | yt:RPMYV-eb6lI |
| `ndcg` | yt:fZH97QHHYjY · yt:XvKiTfd6Xvo |
| `negation` | yt:H6q1UWCCnKw · yt:5HQCNAsSO-s · yt:NWb_4O3ssbA |
| `neural-network` | yt:YmLp8qe87A0 · yt:-f_i_a13IKc |
| `next-token` | yt:YIR-KxNpSbA · yt:izbifbq3-eI · yt:YmLp8qe87A0 · yt:-f_i_a13IKc · yt:YHNi88FaGug |
| `nf4` | yt:4JofSJIrjwU |
| `non-commercial-license` | yt:5YJGDElbCDY |
| `normalization` | yt:xTaDx3tbYMs |
| `nsw` | yt:wyWFLIlgmAw |
| `numeracy-gap` | yt:H6q1UWCCnKw |
| `numpy` | yt:bzNch-dBCN8 · yt:XvKiTfd6Xvo |
| `offline-search` | yt:8LPgGU34RoE |
| `ollama` | yt:4JofSJIrjwU |
| `one-hot` | yt:hVM8qGRTaOA · yt:lPTcTh5sRug · yt:my5wFNQpFO0 · yt:Q6TBHDgWCDQ |
| `openai-api` | yt:YHNi88FaGug |
| `orthonormal` | yt:M1duqgg8-IM |
| `outliers` | yt:NEreO2zlXDk |
| `overfitting` | yt:4JofSJIrjwU |
| `p5-js` | yt:RPMYV-eb6lI |
| `parameter-count` | yt:8vW6gi5vRes |
| `partial-derivatives` | yt:ruBm9WywevM |
| `pca` | yt:hB51kkus-Rc |
| `per-field-weights` | yt:TW9vHU1GpU4 |
| `percolation` | yt:bU38Ovdh3NY |
| `plaid` | yt:aiNQ4I8YaD0 |
| `pleias-rag` | yt:6iCmnd0k3fs |
| `pmi` | yt:TBUpxFw8oIA |
| `polarity` | yt:5HQCNAsSO-s |
| `polo-club` | yt:TFUc41G2ikY · yt:ECR4oAwocjs · yt:uboTKqPNU5Y · yt:nZYHazugVNA · yt:-jeck0yrT_Q |
| `polysemy` | yt:izbifbq3-eI |
| `positional-encoding` | yt:hVM8qGRTaOA · yt:YmLp8qe87A0 · yt:114i2Kz-LZA · yt:ECR4oAwocjs |
| `postgres` | yt:5YJGDElbCDY |
| `ppmi` | yt:TBUpxFw8oIA |
| `pre-tokenization` | yt:zduSFxRajkE |
| `pretraining` | yt:-f_i_a13IKc |
| `prompting` | yt:-f_i_a13IKc · yt:YHNi88FaGug |
| `pylate-rs` | yt:6iCmnd0k3fs |
| `pytorch` | yt:tYO_bgB4Ti0 |
| `pyvespa` | yt:TW9vHU1GpU4 |
| `qdrant` | yt:8LPgGU34RoE · yt:bU38Ovdh3NY |
| `qdrant-edge` | yt:8LPgGU34RoE |
| `qlora` | yt:4JofSJIrjwU |
| `quantization` | yt:6iCmnd0k3fs · yt:aiNQ4I8YaD0 · yt:bU38Ovdh3NY · yt:4JofSJIrjwU |
| `query-by-sketch` | yt:nZYHazugVNA |
| `query-folding` | yt:M1duqgg8-IM · yt:bzNch-dBCN8 |
| `query-key-value` | yt:114i2Kz-LZA · yt:ECR4oAwocjs |
| `rag` | yt:6iCmnd0k3fs · yt:H6q1UWCCnKw · yt:xTzUn3G9YA0 · yt:wyWFLIlgmAw · yt:4JofSJIrjwU · yt:XvKiTfd6Xvo · yt:1qQCuWiRIfA · yt:7WEtNxVh1vo · yt:VWA15n6uiS4 |
| `rag-fusion` | yt:BwgBU0CekFk |
| `rag-vs-fine-tuning` | yt:4JofSJIrjwU |
| `ragatouille` | yt:xTzUn3G9YA0 |
| `random-projection-tree` | yt:c10w0Ptn_CU |
| `rank-bm25` | yt:7WEtNxVh1vo |
| `rank-fusion` | yt:BwgBU0CekFk · yt:1qQCuWiRIfA |
| `rank-profile` | yt:TW9vHU1GpU4 |
| `recall` | yt:aiNQ4I8YaD0 |
| `reranking` | yt:8LPgGU34RoE · yt:H6q1UWCCnKw · yt:XvKiTfd6Xvo · yt:7WEtNxVh1vo · yt:VWA15n6uiS4 |
| `rescoring` | yt:bU38Ovdh3NY |
| `residual` | yt:114i2Kz-LZA |
| `retrieve-then-rerank` | yt:8LPgGU34RoE · yt:VWA15n6uiS4 |
| `rlhf` | yt:YmLp8qe87A0 · yt:-f_i_a13IKc |
| `rmsnorm` | yt:8vW6gi5vRes |
| `rnn` | yt:114i2Kz-LZA · yt:-f_i_a13IKc |
| `row-compression` | yt:5YJGDElbCDY · yt:8vW6gi5vRes · yt:XwYPRLMLcNs |
| `rowmatrix` | yt:OXJdfpEFmF8 |
| `rrf` | yt:XvKiTfd6Xvo · yt:BwgBU0CekFk · yt:1qQCuWiRIfA · yt:VWA15n6uiS4 |
| `rule-based` | yt:5HQCNAsSO-s |
| `sankey` | yt:TFUc41G2ikY |
| `sarcasm` | yt:5HQCNAsSO-s |
| `saturation` | yt:TW9vHU1GpU4 |
| `scala` | yt:OXJdfpEFmF8 |
| `scalar-multiplication` | yt:fNk_zzaMoSs |
| `scaled-dot-product` | yt:114i2Kz-LZA |
| `scifact` | yt:6iCmnd0k3fs |
| `scikit-learn` | yt:78_sbNNJe3Q · yt:hB51kkus-Rc · yt:Fy0bF7u6W20 · yt:NWb_4O3ssbA · yt:YX4xRIQ84Z0 · yt:zLMEnNbdh4Q |
| `self-attention` | yt:114i2Kz-LZA · yt:TFUc41G2ikY |
| `sentencepiece` | yt:zduSFxRajkE |
| `sentiment-analysis` | yt:5HQCNAsSO-s |
| `sft` | arxiv:2609.34770 |
| `shakespeare` | yt:TBUpxFw8oIA |
| `shap` | yt:Xym8FGDcl34 |
| `sigir-2009` | yt:BwgBU0CekFk |
| `sign-ambiguity` | yt:Fy0bF7u6W20 · yt:NWb_4O3ssbA · yt:YX4xRIQ84Z0 · yt:OXJdfpEFmF8 |
| `similarity-metrics` | yt:NEreO2zlXDk · yt:e9U0QAFbfLI · yt:xTaDx3tbYMs |
| `simulated-ui` | yt:XwYPRLMLcNs |
| `skip-gram` | yt:hVM8qGRTaOA · yt:my5wFNQpFO0 · yt:Q6TBHDgWCDQ · yt:YmLp8qe87A0 |
| `skip-list` | yt:wyWFLIlgmAw |
| `slp3` | yt:TBUpxFw8oIA |
| `small-world` | yt:wyWFLIlgmAw |
| `smooth-idf` | yt:YX4xRIQ84Z0 · yt:zLMEnNbdh4Q · yt:OymqCnh-APA |
| `soft-intersection` | yt:-jeck0yrT_Q |
| `softmax` | yt:YIR-KxNpSbA · yt:my5wFNQpFO0 · yt:YmLp8qe87A0 · yt:YHNi88FaGug · yt:TFUc41G2ikY |
| `spam` | yt:tYO_bgB4Ti0 |
| `spambase` | yt:tYO_bgB4Ti0 |
| `spark-mllib` | yt:OXJdfpEFmF8 |
| `special-tokens` | yt:zduSFxRajkE |
| `stanford` | yt:114i2Kz-LZA |
| `static-embeddings` | yt:Q6TBHDgWCDQ |
| `stop-words` | yt:NWb_4O3ssbA · yt:OymqCnh-APA · yt:RPMYV-eb6lI |
| `stopwordsremover` | yt:OXJdfpEFmF8 |
| `storytelling` | yt:-f_i_a13IKc |
| `streaming` | yt:YHNi88FaGug |
| `structural-causal-model` | yt:78_sbNNJe3Q |
| `structured-output` | yt:YHNi88FaGug |
| `subword` | yt:BcxJk4WQVIw |
| `svd` | yt:hB51kkus-Rc · yt:M1duqgg8-IM · yt:bzNch-dBCN8 |
| `svm` | yt:5HQCNAsSO-s |
| `synthetic-data` | yt:4JofSJIrjwU · yt:5YJGDElbCDY · yt:78_sbNNJe3Q · arxiv:2609.34770 |
| `synthetic-eval-set` | yt:XvKiTfd6Xvo |
| `synthetic-prior` | yt:Xym8FGDcl34 |
| `system-prompt` | yt:YHNi88FaGug |
| `t-sne` | yt:-jeck0yrT_Q |
| `tabarena` | yt:78_sbNNJe3Q |
| `tabfm` | yt:5YJGDElbCDY · yt:8vW6gi5vRes · yt:XwYPRLMLcNs · yt:78_sbNNJe3Q · yt:tYO_bgB4Ti0 |
| `tabfm-auto` | yt:5YJGDElbCDY |
| `tabicl` | yt:78_sbNNJe3Q · yt:tYO_bgB4Ti0 · yt:Xym8FGDcl34 |
| `tabpfn` | yt:78_sbNNJe3Q · yt:Xym8FGDcl34 |
| `tabular-foundation-model` | yt:5YJGDElbCDY · yt:8vW6gi5vRes · yt:XwYPRLMLcNs · yt:78_sbNNJe3Q · yt:tYO_bgB4Ti0 · yt:Xym8FGDcl34 |
| `target-leakage` | yt:5YJGDElbCDY |
| `temperature` | yt:YIR-KxNpSbA · yt:YmLp8qe87A0 · yt:YHNi88FaGug · yt:TFUc41G2ikY · yt:ECR4oAwocjs |
| `term-document-matrix` | yt:bzNch-dBCN8 · yt:TBUpxFw8oIA |
| `term-frequency` | yt:zLMEnNbdh4Q · yt:OymqCnh-APA · yt:TBUpxFw8oIA |
| `term-frequency-saturation` | yt:ruBm9WywevM |
| `text-embedding-3-small` | yt:XvKiTfd6Xvo |
| `tf-idf` | yt:Q6TBHDgWCDQ · yt:YX4xRIQ84Z0 · yt:bzNch-dBCN8 · yt:zLMEnNbdh4Q · yt:OymqCnh-APA · yt:TBUpxFw8oIA · yt:RPMYV-eb6lI · yt:ruBm9WywevM · yt:7WEtNxVh1vo |
| `tf-idf-variants` | yt:OymqCnh-APA |
| `tfidfvectorizer` | yt:YX4xRIQ84Z0 |
| `thai` | yt:RPMYV-eb6lI · yt:-f_i_a13IKc · arxiv:2609.34770 |
| `thesaurus` | yt:M1duqgg8-IM |
| `tie-break` | yt:1qQCuWiRIfA |
| `tiktoken` | yt:zduSFxRajkE · yt:YHNi88FaGug |
| `titanic` | yt:78_sbNNJe3Q |
| `token-efficiency` | yt:zduSFxRajkE |
| `token-id` | yt:YIR-KxNpSbA · yt:hVM8qGRTaOA · yt:lPTcTh5sRug · yt:izbifbq3-eI |
| `token-vs-embedding` | yt:izbifbq3-eI |
| `tokenization` | yt:BcxJk4WQVIw · yt:YIR-KxNpSbA · yt:zduSFxRajkE · yt:izbifbq3-eI · yt:YmLp8qe87A0 · yt:114i2Kz-LZA · yt:YHNi88FaGug |
| `tokens` | yt:izbifbq3-eI · yt:YHNi88FaGug |
| `tool-calling` | yt:YmLp8qe87A0 · yt:YHNi88FaGug |
| `top-k` | yt:TFUc41G2ikY |
| `top-n` | yt:VWA15n6uiS4 |
| `top-p` | yt:YmLp8qe87A0 · yt:TFUc41G2ikY |
| `topic-encoded-data` | yt:Fy0bF7u6W20 |
| `topic-loadings` | yt:NWb_4O3ssbA · yt:YX4xRIQ84Z0 |
| `topic-words` | yt:hB51kkus-Rc · yt:NWb_4O3ssbA · yt:OXJdfpEFmF8 |
| `toy-example` | yt:hB51kkus-Rc · yt:Fy0bF7u6W20 · yt:zLMEnNbdh4Q |
| `training-embeddings` | yt:1Qex37vowTM · yt:YIR-KxNpSbA · yt:lPTcTh5sRug · yt:my5wFNQpFO0 |
| `training-loss` | yt:4JofSJIrjwU |
| `transformer` | yt:YmLp8qe87A0 · yt:114i2Kz-LZA · yt:-f_i_a13IKc · yt:TFUc41G2ikY · yt:ECR4oAwocjs |
| `transformer-explainer` | yt:TFUc41G2ikY · yt:ECR4oAwocjs |
| `truncated-svd` | yt:hB51kkus-Rc · yt:Fy0bF7u6W20 · yt:NWb_4O3ssbA · yt:YX4xRIQ84Z0 · yt:M1duqgg8-IM |
| `two-stage-retrieval` | yt:VWA15n6uiS4 |
| `typhoon` | yt:-f_i_a13IKc |
| `uncentered` | yt:Fy0bF7u6W20 |
| `unsloth` | yt:4JofSJIrjwU |
| `unsloth-studio` | yt:4JofSJIrjwU |
| `utf-8` | yt:zduSFxRajkE |
| `vector-addition` | yt:fNk_zzaMoSs |
| `vector-basics` | yt:fNk_zzaMoSs · yt:izbifbq3-eI |
| `vector-database` | yt:YIR-KxNpSbA · yt:YLkSfz3EFGw · yt:bU38Ovdh3NY |
| `vector-search` | yt:Lc4dzmSFb14 · yt:c10w0Ptn_CU · yt:wyWFLIlgmAw · yt:7WEtNxVh1vo |
| `vector-semantics` | yt:TBUpxFw8oIA |
| `vespa` | yt:TW9vHU1GpU4 |
| `visual-analytics` | yt:nZYHazugVNA · yt:-jeck0yrT_Q |
| `visualization` | yt:TFUc41G2ikY · yt:ECR4oAwocjs · yt:uboTKqPNU5Y · yt:nZYHazugVNA · yt:-jeck0yrT_Q |
| `vocab-size` | yt:zduSFxRajkE · arxiv:2609.34770 |
| `vocabulary` | yt:BcxJk4WQVIw · yt:lPTcTh5sRug · yt:zduSFxRajkE |
| `vram` | yt:4JofSJIrjwU |
| `webgpu` | yt:6iCmnd0k3fs |
| `weighted-rrf` | yt:1qQCuWiRIfA · yt:7WEtNxVh1vo |
| `word-counts` | yt:e9U0QAFbfLI |
| `word-embeddings` | yt:hVM8qGRTaOA · yt:Q6TBHDgWCDQ |
| `word2vec` | yt:1Qex37vowTM · yt:hVM8qGRTaOA · yt:my5wFNQpFO0 · yt:Q6TBHDgWCDQ · yt:YmLp8qe87A0 · yt:114i2Kz-LZA |
| `worked-example` | yt:1qQCuWiRIfA |
| `xgboost` | yt:XwYPRLMLcNs |
| `xor` | yt:YmLp8qe87A0 |
| `zero-shot` | yt:5YJGDElbCDY · yt:XwYPRLMLcNs · yt:78_sbNNJe3Q · yt:YHNi88FaGug |

## ตาราง

| ref | แหล่ง | เผยแพร่ / อ่าน | ใช้ในบท | รายงาน |
|---|---|---|---|---|
| yt:-jeck0yrT_Q | Polo Club of Data Science @ Georgia Tech, "VIGOR: Interactive Visual Exploration of Graph Query Results" (3:50) <https://www.youtube.com/watch?v=-jeck0yrT_Q> | 2017-08-09 / 2026-10-13 | ยังไม่ใช้ (เสนอ: 10.2, 4.5; แผน visualizer) | [HTML](docs/outhtm/20170809_Vigor-Graph-Query-Results.html) · [MD](docs/aimd/20170809_Vigor-Graph-Query-Results_claude.md) |
| yt:nZYHazugVNA | Duen Horng "Polo" Chau, "GRAPHITE: A Visual Query System for Large Graphs" (3:10) <https://www.youtube.com/watch?v=nZYHazugVNA> | 2009-03-22 / 2026-10-13 | ยังไม่ใช้ (เสนอ: 7.1–7.4 ภาพ query / result สองหน้าต่าง; 10.4 เลือก head ด้วยแท็บจัดอันดับ) | [HTML](docs/outhtm/20090322_Graphite-Visual-Query-System.html) · [MD](docs/aimd/20090322_Graphite-Visual-Query-System_claude.md) |
| yt:uboTKqPNU5Y | Polo Club of Data Science @ Georgia Tech, "Dodrio: Exploring Transformer Models with Interactive Visualization (Demo Video)" (1:59) <https://www.youtube.com/watch?v=uboTKqPNU5Y> | 2022-11-05 / 2026-10-13 | ยังไม่ใช้ (เสนอ: 10.2, 10.4) | [HTML](docs/outhtm/20221105_Dodrio-Demo.html) · [MD](docs/aimd/20221105_Dodrio-Demo_claude.md) |
| yt:ECR4oAwocjs | Polo Club of Data Science @ Georgia Tech, "Transformers Explained Visually: Learn How LLM Transformer Models Work" (1:28) <https://www.youtube.com/watch?v=ECR4oAwocjs> | 2024-06-21 / 2026-10-13 | ยังไม่ใช้ (เสนอ: 10.2, 10.3, 10.4) | [HTML](docs/outhtm/20240621_Transformer-Explainer-Visual.html) · [MD](docs/aimd/20240621_Transformer-Explainer-Visual_claude.md) |
| yt:TFUc41G2ikY | Polo Club of Data Science @ Georgia Tech, "[Demo Video] Transformer Explainer: Learning LLM Transformers with Interactive Visual Explanation" (3:24) <https://www.youtube.com/watch?v=TFUc41G2ikY> | 2025-04-07 / 2026-10-13 | ยังไม่ใช้ (เสนอ: 10.2, 10.4; LLM manual G3; แผน visualizer) | [HTML](docs/outhtm/20250407_Transformer-Explainer-Demo.html) · [MD](docs/aimd/20250407_Transformer-Explainer-Demo_claude.md) |
| arxiv:2609.34770 | Chay-intr, Harnchang, Thabua, Viriyayudhakorn, Theeramunkong, "Reference-Grounded Data Curation for Instruction-Following Thai-English Machine Translation" (paper, arXiv 2609.34770v2, AACL-IJCNLP 2026 Main) <https://arxiv.org/abs/2609.34770> | 2026-09-28 / 2026-10-13 | ยังไม่ใช้ (เสนอ: 4.3 กล่องตัวอย่าง vocab × dimension; LLM manual G2, G5, G12) | [HTML](docs/outhtm/20260928_Reference-Grounded-Data-Curation-For-Instruction-Following-Thai-English-Machine-Translation.html) · [MD](docs/aimd/20260928_Reference-Grounded-Data-Curation-For-Instruction-Following-Thai-English-Machine-Translation_claude.md) |
| yt:YHNi88FaGug | Harish Neel AI, "LLM Fundamentals Crash Course For Beginners 2026 (Tokens, Prompting, APIs & Tool Calls)" (1:13:43) <https://www.youtube.com/watch?v=YHNi88FaGug> | 2026-08-13 / 2026-10-13 | ยังไม่ใช้ (เสนอ: 3.1, 3.4 กล่อง "ลองนับ token จริง"; LLM manual G3, G7) | [HTML](docs/outhtm/20260813_LLM-Fundamentals-Crash-Course.html) · [MD](docs/aimd/20260813_LLM-Fundamentals-Crash-Course_claude.md) |
| yt:-f_i_a13IKc | mikelopster, "LLM (Generative AI) คืออะไร ?" (1:02:23, ภาษาไทย) <https://www.youtube.com/watch?v=-f_i_a13IKc> | 2024-03-28 / 2026-10-13 | ยังไม่ใช้ (เสนอ: 10.1 และข้อความนำของบทเรียน; LLM manual G1, G2) | [HTML](docs/outhtm/20240328_LLM-Generative-AI-What-Is-It.html) · [MD](docs/aimd/20240328_LLM-Generative-AI-What-Is-It_claude.md) |
| yt:VWA15n6uiS4 | Harish Neel AI, "RAG Tutorial 2026 #17: RAG Reranking and Next Steps!" (28:52) <https://www.youtube.com/watch?v=VWA15n6uiS4> | 2025-09-11 / 2026-10-13 | ยังไม่ใช้ (เสนอ: 8.3 ลิงก์อ่านเพิ่ม; LLM manual G6) | [HTML](docs/outhtm/20250911_RAG-Reranking.html) · [MD](docs/aimd/20250911_RAG-Reranking_claude.md) |
| yt:7WEtNxVh1vo | Harish Neel AI, "RAG Tutorial 2026 #16: Hybrid Search combining Vector and Keyword Search" (27:42) <https://www.youtube.com/watch?v=7WEtNxVh1vo> | 2025-09-10 / 2026-10-13 | ยังไม่ใช้ (เสนอ: 5.5 และบทใหม่ hybrid; LLM manual G6) | [HTML](docs/outhtm/20250910_Hybrid-Search-Vector-Keyword.html) · [MD](docs/aimd/20250910_Hybrid-Search-Vector-Keyword_claude.md) |
| yt:1qQCuWiRIfA | Harish Neel AI, "RAG Tutorial 2026 #15: Reciprocal Rank Fusion for Enhanced RAG Performance" (12:59) <https://www.youtube.com/watch?v=1qQCuWiRIfA> | 2025-09-08 / 2026-10-13 | ยังไม่ใช้ (เสนอ: บทใหม่ hybrid ต่อจาก 5.5; LLM manual G6) | [HTML](docs/outhtm/20250908_Reciprocal-Rank-Fusion-For-RAG-Worked-Example.html) · [MD](docs/aimd/20250908_Reciprocal-Rank-Fusion-For-RAG-Worked-Example_claude.md) |
| yt:BwgBU0CekFk | IT AI Enthusiast (Mayank Chugh), "RAG Fusion Explained: Reciprocal Rank Fusion (RRF) With Real Code" (26:40) <https://www.youtube.com/watch?v=BwgBU0CekFk> | 2026-09-14 / 2026-10-13 | ยังไม่ใช้ (เสนอ: บทใหม่ hybrid ต่อจาก 5.5; LLM manual G6) | [HTML](docs/outhtm/20260914_RAG-Fusion-Explained-RRF-With-Real-Code.html) · [MD](docs/aimd/20260914_RAG-Fusion-Explained-RRF-With-Real-Code_claude.md) |
| yt:XvKiTfd6Xvo | Dave Ebbelaar, "The Complete Guide to Hybrid Search in RAG (BM25 + Embeddings + Reranker)" (59:17) <https://www.youtube.com/watch?v=XvKiTfd6Xvo> | 2026-05-14 / 2026-10-13 | ยังไม่ใช้ (เสนอ: 5.5, 8.3 และบทใหม่ hybrid; LLM manual G6, G5) | [HTML](docs/outhtm/20260514_Complete-Guide-To-Hybrid-Search-In-RAG.html) · [MD](docs/aimd/20260514_Complete-Guide-To-Hybrid-Search-In-RAG_claude.md) |
| yt:fZH97QHHYjY | AI Engineer (Jo Kristian Bergum, Hornet.dev), "The unreasonable effectiveness of BM25 for agentic search" (18:28) <https://www.youtube.com/watch?v=fZH97QHHYjY> | 2026-09-16 / 2026-10-13 | ยังไม่ใช้ (เสนอ: 5.5; LLM manual G6, G5) | [HTML](docs/outhtm/20260916_Unreasonable-Effectiveness-Of-BM25-For-Agentic-Search.html) · [MD](docs/aimd/20260916_Unreasonable-Effectiveness-Of-BM25-For-Agentic-Search_claude.md) |
| yt:TW9vHU1GpU4 | Abhishek Thakur, "A no nonsense intro to BM25" (15:45) <https://www.youtube.com/watch?v=TW9vHU1GpU4> | 2025-11-19 / 2026-10-13 | ยังไม่ใช้ (เสนอ: 5.5 และบทใหม่ BM25 / hybrid; LLM manual G6) | [HTML](docs/outhtm/20251119_A-No-Nonsense-Intro-To-BM25.html) · [MD](docs/aimd/20251119_A-No-Nonsense-Intro-To-BM25_claude.md) |
| yt:ruBm9WywevM | ritvikmath, "BM25 : The Most Important Text Metric in Data Science" (18:11) <https://www.youtube.com/watch?v=ruBm9WywevM> | 2023-09-18 / 2026-10-13 | ยังไม่ใช้ (เสนอ: 5.5 และบทใหม่ BM25 / hybrid; LLM manual G6) | [HTML](docs/outhtm/20230918_BM25-The-Most-Important-Text-Metric-In-Data-Science.html) · [MD](docs/aimd/20230918_BM25-The-Most-Important-Text-Metric-In-Data-Science_claude.md) |
| yt:RPMYV-eb6lI | The Coding Train, "Coding Challenge #40.3: TF-IDF" (32:02) <https://www.youtube.com/watch?v=RPMYV-eb6lI> | 2016-10-12 / 2026-10-13 | ยังไม่ใช้ (เสนอ: บทใหม่ TF-IDF ต่อจาก 4.2 ขั้น "ลองเขียน"; ใช้ต่อกับ LLM manual G6) | [HTML](docs/outhtm/20161012_Coding-Challenge-40-3-TF-IDF.html) · [MD](docs/aimd/20161012_Coding-Challenge-40-3-TF-IDF_claude.md) |
| yt:TBUpxFw8oIA | From Languages to Information (Stanford slides), "Vector 5 TF IDF" (5:33) <https://www.youtube.com/watch?v=TBUpxFw8oIA> | 2021-07-19 / 2026-10-13 | ยังไม่ใช้ (เสนอ: บทใหม่ TF-IDF ต่อจาก 4.2; LLM manual G9) | [HTML](docs/outhtm/20210719_Vector-5-TF-IDF.html) · [MD](docs/aimd/20210719_Vector-5-TF-IDF_claude.md) |
| yt:OymqCnh-APA | ritvikmath, "TFIDF : Data Science Concepts" (7:54) <https://www.youtube.com/watch?v=OymqCnh-APA> | 2020-11-11 / 2026-10-13 | ยังไม่ใช้ (เสนอ: บทใหม่ TF-IDF ต่อจาก 4.2 เฉพาะส่วนอธิบายแนวคิด) | [HTML](docs/outhtm/20201111_TFIDF-Data-Science-Concepts.html) · [MD](docs/aimd/20201111_TFIDF-Data-Science-Concepts_claude.md) |
| yt:zLMEnNbdh4Q | DataMListic, "Term Frequency Inverse Document Frequency (TF-IDF) Explained" (8:59) <https://www.youtube.com/watch?v=zLMEnNbdh4Q> | 2022-09-06 / 2026-10-13 | ยังไม่ใช้ (เสนอ: บทใหม่ TF-IDF ต่อจาก 4.2) | [HTML](docs/outhtm/20220906_TF-IDF-Explained.html) · [MD](docs/aimd/20220906_TF-IDF-Explained_claude.md) |
| yt:bzNch-dBCN8 | Francisco Iacobelli, "LSA" (14:51) <https://www.youtube.com/watch?v=bzNch-dBCN8> | 2019-11-17 / 2026-10-13 | ยังไม่ใช้ (เสนอ: 4.5, 5.5 และบทใหม่ LSA; LLM manual G6) | [HTML](docs/outhtm/20191117_Latent-Semantic-Analysis-Lsa.html) · [MD](docs/aimd/20191117_Latent-Semantic-Analysis-Lsa_claude.md) |
| yt:M1duqgg8-IM | Polo Club of Data Science @ Georgia Tech, "Latent Semantic Indexing - Explained with Examples - Georgia Tech CSE6242" (13:55) <https://www.youtube.com/watch?v=M1duqgg8-IM> | 2020-03-31 / 2026-10-13 | ยังไม่ใช้ (เสนอ: 4.5, 5.5 และบทใหม่ LSA; LLM manual G6) | [HTML](docs/outhtm/20200331_Latent-Semantic-Indexing-Explained.html) · [MD](docs/aimd/20200331_Latent-Semantic-Indexing-Explained_claude.md) |
| yt:OXJdfpEFmF8 | Databricks Academy (Joshua Cook), "Latent Semantic Analysis with Apache Spark (5/5)" (6:51) <https://www.youtube.com/watch?v=OXJdfpEFmF8> | 2019-05-16 / 2026-10-13 | ยังไม่ใช้ (เสนอ: 3.1, 4.5 และบทใหม่ LSA) | [HTML](docs/outhtm/20190516_LSA-With-Apache-Spark-Part-5.html) · [MD](docs/aimd/20190516_LSA-With-Apache-Spark-Part-5_claude.md) |
| yt:YX4xRIQ84Z0 | Databricks Academy (Joshua Cook), "Improving the LSA with a TFIDF (4/5)" (5:24) <https://www.youtube.com/watch?v=YX4xRIQ84Z0> | 2019-04-22 / 2026-10-13 | ยังไม่ใช้ (เสนอ: 4.2, 4.5 และบทใหม่ LSA / TF-IDF) | [HTML](docs/outhtm/20190422_Improving-LSA-With-TF-IDF-Part-4.html) · [MD](docs/aimd/20190422_Improving-LSA-With-TF-IDF-Part-4_claude.md) |
| yt:NWb_4O3ssbA | Databricks Academy (Joshua Cook), "A Second LSA (3/5)" (5:41) <https://www.youtube.com/watch?v=NWb_4O3ssbA> | 2019-04-22 / 2026-10-13 | ยังไม่ใช้ (เสนอ: 4.2, 4.5, 8.3, 8.4 และบทใหม่ LSA) | [HTML](docs/outhtm/20190422_LSA-Two-Childrens-Books-Part-3.html) · [MD](docs/aimd/20190422_LSA-Two-Childrens-Books-Part-3_claude.md) |
| yt:Fy0bF7u6W20 | Databricks Academy (Joshua Cook), "A Trivial Implementation of LSA using Scikit Learn (2/5)" (5:46) <https://www.youtube.com/watch?v=Fy0bF7u6W20> | 2019-05-16 / 2026-10-13 | ยังไม่ใช้ (เสนอ: 4.2, 4.5 และบทใหม่ LSA; ชุดทดสอบ SVD ของไลบรารี) | [HTML](docs/outhtm/20190516_Trivial-LSA-With-Scikit-Learn.html) · [MD](docs/aimd/20190516_Trivial-LSA-With-Scikit-Learn_claude.md) |
| yt:hB51kkus-Rc | Databricks Academy (Joshua Cook), "Introduction to Latent Semantic Analysis (1/5)" (3:24) <https://www.youtube.com/watch?v=hB51kkus-Rc> | 2019-04-22 / 2026-10-13 | ยังไม่ใช้ (เสนอ: 4.2, 4.5 และบทใหม่ LSA) | [HTML](docs/outhtm/20190422_Introduction-To-Latent-Semantic-Analysis.html) · [MD](docs/aimd/20190422_Introduction-To-Latent-Semantic-Analysis_claude.md) |
| yt:5HQCNAsSO-s | IBM Technology (Martin Keen), "What is Sentiment Analysis?" (10:04) <https://www.youtube.com/watch?v=5HQCNAsSO-s> | 2024-06-19 / 2026-10-13 | ยังไม่ใช้ (เสนอ: 4.2, 8.3, 8.4) | [HTML](docs/outhtm/20240619_What-Is-Sentiment-Analysis.html) · [MD](docs/aimd/20240619_What-Is-Sentiment-Analysis_claude.md) |
| yt:Xym8FGDcl34 | PyData, "Nicolas Makaroff - AI Scientist - Hands-On with Tabular Foundation Models - Pydata London 26" (88:23) <https://www.youtube.com/watch?v=Xym8FGDcl34> | 2026-06-19 / 2026-10-13 | ยังไม่ใช้ (เสนอ: กล่องเทียบ model อย่างยุติธรรม; LLM manual G5) | [HTML](docs/outhtm/20260619_Hands-On-Tabular-Foundation-Models-PyData-London.html) · [MD](docs/aimd/20260619_Hands-On-Tabular-Foundation-Models-PyData-London_claude.md) |
| yt:tYO_bgB4Ti0 | MASTER 2 SISE DATA SCIENCE, "TabFM – Tabular Foundation Model pour le classement (tabfm[jax] / Python)" (18:11, ภาษาฝรั่งเศส) <https://www.youtube.com/watch?v=tYO_bgB4Ti0> | 2026-07-17 / 2026-10-13 | ยังไม่ใช้ (เสนอ: LLM manual G3) | [HTML](docs/outhtm/20260717_TabFM-Hands-On-Spam-Jax.html) · [MD](docs/aimd/20260717_TabFM-Hands-On-Spam-Jax_claude.md) |
| yt:78_sbNNJe3Q | Omar Kamal, "TabFM: Google's Zero-Shot Tabular AI (no training, no tuning!)" (7:57) <https://www.youtube.com/watch?v=78_sbNNJe3Q> | 2026-07-07 / 2026-10-13 | ยังไม่ใช้ (เสนอ: 10.2, 10.4; LLM manual G3) | [HTML](docs/outhtm/20260707_TabFM-Zero-Shot-Tabular-Explainer.html) · [MD](docs/aimd/20260707_TabFM-Zero-Shot-Tabular-Explainer_claude.md) |
| yt:XwYPRLMLcNs | AI with Surya, "Google Just Released TabFM and It Breaks Everything We Know About ML" (7:16) <https://www.youtube.com/watch?v=XwYPRLMLcNs> | 2026-07-18 / 2026-10-13 | ยังไม่ใช้ (เสนอ: 10.2 กล่องเตือน) | [HTML](docs/outhtm/20260718_TabFM-Ui-Walkthrough-And-Claims.html) · [MD](docs/aimd/20260718_TabFM-Ui-Walkthrough-And-Claims_claude.md) |
| yt:8vW6gi5vRes | Dr. Data Science, "TabFM Explained: Google's New Foundation Model for Tabular Data" (15:40) <https://www.youtube.com/watch?v=8vW6gi5vRes> | 2026-07-05 / 2026-10-13 | ยังไม่ใช้ (เสนอ: 10.2, 10.4; LLM manual G3, G5) | [HTML](docs/outhtm/20260705_TabFM-Explained-Architecture-And-ICL.html) · [MD](docs/aimd/20260705_TabFM-Explained-Architecture-And-ICL_claude.md) |
| yt:5YJGDElbCDY | Prompt Engineering, "Google's GPT-3 Moment for Databases & Spreadsheets (TabFM)" (10:57) <https://www.youtube.com/watch?v=5YJGDElbCDY> | 2026-10-11 / 2026-10-13 | ยังไม่ใช้ (เสนอ: 4.5, 10.2 เป็นกล่องข้างบท; LLM manual G1, G5, G7) | [HTML](docs/outhtm/20261011_TabFM-Zero-Shot-Tabular-Model.html) · [MD](docs/aimd/20261011_TabFM-Zero-Shot-Tabular-Model_claude.md) |
| yt:4JofSJIrjwU | Tech With Tim, "How to Fine-Tune any AI Model Locally (FULL Tutorial)" (41:06) <https://www.youtube.com/watch?v=4JofSJIrjwU> | 2026-07-27 / 2026-10-13 | ยังไม่ใช้ (เสนอ: 1.5, 4.4, 6.3 และหัวข้อ RAG ที่เสนอไว้ใน WIP202610036) | [HTML](docs/outhtm/20260727_How-To-Fine-Tune-Any-AI-Model-Locally.html) · [MD](docs/aimd/20260727_How-To-Fine-Tune-Any-AI-Model-Locally_claude.md) |
| yt:114i2Kz-LZA | Stanford Online (Afshine & Shervine Amidi), "Stanford CME295 Transformers & LLMs, Autumn 2026, Lecture 1 - Transformers" (1:44:28) <https://www.youtube.com/watch?v=114i2Kz-LZA> | 2026-09-28 / 2026-10-12 | 10.1–10.4 (เสนอ: 3.1, 3.2, 4.1, 4.4, 4.7, 9.1, 9.2) | [HTML](docs/outhtm/20260928_Stanford-CME295-Lecture-1-Transformers.html) · [MD](docs/aimd/20260928_Stanford-CME295-Lecture-1-Transformers_claude.md) |
| yt:YmLp8qe87A0 | Syntax (CJ), "LLMs Explained: Tokens, Embeddings, Transformers and More" (51:48) <https://www.youtube.com/watch?v=YmLp8qe87A0> | 2026-07-10 / 2026-10-12 | 10.1–10.4 (เสนอ: 3.2, 4.4, 4.5, 4.7, 9.1, 9.2) | [HTML](docs/outhtm/20260710_LLMs-Explained-Tokens-Embeddings-Transformers-And-More.html) · [MD](docs/aimd/20260710_LLMs-Explained-Tokens-Embeddings-Transformers-And-More_claude.md) |
| yt:wyWFLIlgmAw | AI Is All You Need, "HNSW Explained from Scratch, The Vector Search Algorithm Behind RAG" (61:04) <https://www.youtube.com/watch?v=wyWFLIlgmAw> | 2026-06-28 / 2026-10-12 | ยังไม่ใช้ (เสนอ: 6.1, 7.1–7.4) | [HTML](docs/outhtm/20260628_HNSW-Explained-From-Scratch.html) · [MD](docs/aimd/20260628_HNSW-Explained-From-Scratch_claude.md) |
| yt:Q6TBHDgWCDQ | Thu Vu, "Learn Text Embeddings in 20 Minutes (full guide for beginners)" (19:56) <https://www.youtube.com/watch?v=Q6TBHDgWCDQ> | 2026-05-23 / 2026-10-12 | 4.7, 10.1 (เสนอ: 4.1, 4.2, 4.4, 4.5, 4.6, 5.4) | [HTML](docs/outhtm/20260523_Learn-Text-Embeddings-In-20-Minutes.html) · [MD](docs/aimd/20260523_Learn-Text-Embeddings-In-20-Minutes_claude.md) |
| yt:izbifbq3-eI | Annie Sexton, "Tokens vs Embeddings – what are they + how are they different?" (6:52) <https://www.youtube.com/watch?v=izbifbq3-eI> | 2025-05-29 / 2026-10-11 | 4.7 (เสนอ: 3.4, 4.3, 4.5, 9.1, 9.2 และการแยกบท Token / Embedding) | [HTML](docs/outhtm/20250529_Tokens-Vs-Embeddings.html) · [MD](docs/aimd/20250529_Tokens-Vs-Embeddings_claude.md) |
| yt:zduSFxRajkE | Andrej Karpathy, "Let's build the GPT Tokenizer" (2:13:34) <https://www.youtube.com/watch?v=zduSFxRajkE> | 2024-02-20 / 2026-10-11 | 3.3 (แหล่งหลักของบท 3.3 Tokenizer ของ GPT) | [HTML](docs/outhtm/20240220_Lets-Build-The-GPT-Tokenizer.html) · [MD](docs/aimd/20240220_Lets-Build-The-GPT-Tokenizer_claude.md) |
| yt:S7tFyREI19I | Prompt Engineering, "Training Your Own Embedding Model Is Not As Hard As You Think" (12:36) <https://www.youtube.com/watch?v=S7tFyREI19I> | 2026-10-08 / 2026-10-11 | ยังไม่ใช้ (เสนอ: 4.4, 8.1) | [HTML](docs/outhtm/20261008_Training-Your-Own-Embedding-Model-Is-Not-As-Hard-As-You-Think.html) · [MD](docs/aimd/20261008_Training-Your-Own-Embedding-Model-Is-Not-As-Hard-As-You-Think_claude.md) |
| yt:6iCmnd0k3fs | Vishal Bakshi, "multivector-rag-demo (coded by Opus 5.5 Extra)" (39:22) <https://www.youtube.com/watch?v=6iCmnd0k3fs> | 2026-09-30 / 2026-10-11 | ยังไม่ใช้ (เสนอ: 9.3 RAG, 6.3, 8.2) | [HTML](docs/outhtm/20260930_Multivector-RAG-Demo-Coded-By-Opus-5-5-Extra.html) · [MD](docs/aimd/20260930_Multivector-RAG-Demo-Coded-By-Opus-5-5-Extra_claude.md) |
| yt:YIR-KxNpSbA | NitMonk, "How Tokens, Vectors & Embeddings Actually Work — Self-Attention Deep Dive" (39:56, ภาษาฮินดี) <https://www.youtube.com/watch?v=YIR-KxNpSbA> | 2026-08-03 / 2026-10-11 | 4.7, 10.2 (เสนอ: 3.4, 4.3, 9.1, 9.2) | [HTML](docs/outhtm/20260803_How-Tokens-Vectors-And-Embeddings-Actually-Work.html) · [MD](docs/aimd/20260803_How-Tokens-Vectors-And-Embeddings-Actually-Work_claude.md) |
| yt:8LPgGU34RoE | HiDevs, "Build ColBERT Search Locally with Qdrant Edge (Step-by-Step)" (16:52) <https://www.youtube.com/watch?v=8LPgGU34RoE> | 2026-07-31 / 2026-10-11 | ยังไม่ใช้ (เสนอ: 8.2, 8.3) | [HTML](docs/outhtm/20260731_Build-ColBERT-Search-Locally-With-Qdrant-Edge.html) · [MD](docs/aimd/20260731_Build-ColBERT-Search-Locally-With-Qdrant-Edge_claude.md) |
| yt:aiNQ4I8YaD0 | Vishal Bakshi, "Exploring Precision in ColBERT Indexing and Retrieval" (18:42) <https://www.youtube.com/watch?v=aiNQ4I8YaD0> | 2025-05-25 / 2026-10-11 | ยังไม่ใช้ (เสนอ: 6.3, WIP k-means) | [HTML](docs/outhtm/20250525_Exploring-Precision-In-ColBERT-Indexing-And-Retrieval.html) · [MD](docs/aimd/20250525_Exploring-Precision-In-ColBERT-Indexing-And-Retrieval_claude.md) |
| yt:my5wFNQpFO0 | Google for Developers, "Machine Learning Crash Course: Embeddings" (2:36) <https://www.youtube.com/watch?v=my5wFNQpFO0> | 2024-09-09 / 2026-10-11 | ยังไม่ใช้ (เสนอ: 4.1, 4.3, 4.4) | [HTML](docs/outhtm/20240909_Machine-Learning-Crash-Course-Embeddings.html) · [MD](docs/aimd/20240909_Machine-Learning-Crash-Course-Embeddings_claude.md) |
| yt:xTzUn3G9YA0 | Prompt Engineering, "Supercharge Your RAG with Contextualized Late Interactions" (17:44) <https://www.youtube.com/watch?v=xTzUn3G9YA0> | 2024-03-22 / 2026-10-11 | 8.2 (แหล่งหลักของบท 8.2 Late interaction) | [HTML](docs/outhtm/20240322_Supercharge-Your-RAG-With-Contextualized-Late-Interactions.html) · [MD](docs/aimd/20240322_Supercharge-Your-RAG-With-Contextualized-Late-Interactions_claude.md) |
| yt:BcxJk4WQVIw | Raj Pulapakura, "Byte Pair Encoding - How does the BPE algorithm work? - Step by Step Guide" (14:33) <https://www.youtube.com/watch?v=BcxJk4WQVIw> | 2024-01-24 / 2026-10-11 | 3.1, 3.2, 3.3 (แหล่งหลักของบท 3.1 Tokenization และ 3.2 BPE; บท 3.3 ต่อยอดจาก 3.2) | [HTML](docs/outhtm/20240124_Byte-Pair-Encoding-How-Does-The-BPE-Algorithm-Work.html) · [MD](docs/aimd/20240124_Byte-Pair-Encoding-How-Does-The-BPE-Algorithm-Work_claude.md) |
| yt:H6q1UWCCnKw | Byte Goose AI, "Vector Embeddings. How to choose the embedding model based on the task at hand. Semantic Search RAG." (20:57) <https://www.youtube.com/watch?v=H6q1UWCCnKw> | 2026-02-28 / 2026-10-10 | 4.5–4.7, 5.1–5.3, 6.2, 8.1, 8.3, 8.4, 9.1 (และไอเดียบท Matryoshka) | [HTML](docs/outhtm/20260228_How-To-Choose-An-Embedding-Model-By-Task.html) · [MD](docs/aimd/20260228_How-To-Choose-An-Embedding-Model-By-Task_claude.md) |
| yt:bU38Ovdh3NY | CMU Database Group, "Qdrant: Open Source Vector Search Engine and Vector Database (Andrey Vasnetsov)" (62:38, CC BY) <https://www.youtube.com/watch?v=bU38Ovdh3NY> | 2023-09-15 / 2026-10-10 | 2.2, 4.6, 5.1–5.3, 5.4, 6.2, 6.3, 7.1–7.5, 8.1 (แหล่งหลักของบท 7.5) | [HTML](docs/outhtm/20230915_Qdrant-Open-Source-Vector-Search-Engine-CMU.html) · [MD](docs/aimd/20230915_Qdrant-Open-Source-Vector-Search-Engine-CMU_claude.md) |
| yt:YLkSfz3EFGw | Devsplainers, "Vector Databases Are Dead. Use This Instead" (8:29) <https://www.youtube.com/watch?v=YLkSfz3EFGw> | 2026-10-08 / 2026-10-10 | 5.1–5.3, 5.4, 5.5, 8.1 | [HTML](docs/outhtm/20261008_Vector-Databases-Are-Dead-Use-This-Instead.html) · [MD](docs/aimd/20261008_Vector-Databases-Are-Dead-Use-This-Instead_claude.md) |
| yt:c10w0Ptn_CU | Sefik Ilkin Serengil, "Approximate Nearest Neighbour From Scratch In Python: Build Your Own Vector Database" (19:06) <https://www.youtube.com/watch?v=c10w0Ptn_CU> | 2024-06-23 / 2026-10-10 | 2.2, 5.1–5.3, 6.1, 6.2, 6.4 (แหล่งหลักของบท 6.4 ANN แบบต้นไม้) | [HTML](docs/outhtm/20240623_Approximate-Nearest-Neighbour-From-Scratch-In-Python.html) · [MD](docs/aimd/20240623_Approximate-Nearest-Neighbour-From-Scratch-In-Python_claude.md) |
| yt:Lc4dzmSFb14 | Satyajit Das, "Vector Search and HNSW Explained Visually" (8:22) <https://www.youtube.com/watch?v=Lc4dzmSFb14> | 2026-05-30 / 2026-10-10 | 2.1, 5.1–5.3, 5.5, 6.1, 6.2, 7.1–7.4, 8.1 (แหล่งหลักของบท 7.1–7.4) | [HTML](docs/outhtm/20260530_Vector-Search-And-HNSW-Explained-Visually.html) · [MD](docs/aimd/20260530_Vector-Search-And-HNSW-Explained-Visually_claude.md) |
| yt:1Qex37vowTM | SOFAR, "Vector Embedding : Build LLM from scratch" (13:56) <https://www.youtube.com/watch?v=1Qex37vowTM> | 2026-06-15 / 2026-10-10 | 3.4, 4.4–4.7, 5.1–5.3, 6.2, 8.1, 9.1, 9.2, 10.4 | [HTML](docs/outhtm/20260615_Vector-Embedding-Build-LLM-From-Scratch.html) · [MD](docs/aimd/20260615_Vector-Embedding-Build-LLM-From-Scratch_claude.md) |
| yt:hVM8qGRTaOA | Under The Hood, "What Are Word Embeddings?" (19:32) <https://www.youtube.com/watch?v=hVM8qGRTaOA> | 2025-02-21 / 2026-10-10 | 1.5, 3.4, 4.1–4.6, 8.1, 9.1, 9.2, 10.1, 10.3 (แหล่งหลักของบท 3.4 Token ID, 4.1 One-hot, 4.3 Embedding matrix, 4.4, 9.1) | [HTML](docs/outhtm/20250221_What-Are-Word-Embeddings.html) · [MD](docs/aimd/20250221_What-Are-Word-Embeddings_claude.md) |
| yt:NEreO2zlXDk | Colin Talks Tech, "A Beginner's Guide to Vector Embeddings" (8:29) <https://www.youtube.com/watch?v=NEreO2zlXDk> | 2023-06-08 / 2026-10-10 | 4.5–4.6, 5.1–5.3, 5.4, 8.1, 8.4 (แหล่งหลักของบท 4.6; และไอเดียบท outlier) | [HTML](docs/outhtm/20230608_A-Beginners-Guide-To-Vector-Embeddings.html) · [MD](docs/aimd/20230608_A-Beginners-Guide-To-Vector-Embeddings_claude.md) |
| yt:e9U0QAFbfLI | StatQuest, "Cosine Similarity, Clearly Explained!!!" (10:13) <https://www.youtube.com/watch?v=e9U0QAFbfLI> | 2023-01-29 / 2026-10-10 | 2.3, 4.2, 5.1–5.3, 8.1 (แหล่งหลักของบท 4.2 Bag of words) | [HTML](docs/outhtm/20230129_Cosine-Similarity-Clearly-Explained.html) · [MD](docs/aimd/20230129_Cosine-Similarity-Clearly-Explained_claude.md) |
| yt:fNk_zzaMoSs | 3Blue1Brown, "Vectors, Chapter 1, Essence of linear algebra" (9:51) <https://www.youtube.com/watch?v=fNk_zzaMoSs> | 2016-08-05 / 2026-10-10 | 1.1, 1.3, 1.4, 2.1 (และข้อเสนอเรื่องลำดับบท) | [HTML](docs/outhtm/20160805_Vectors-Chapter-1-Essence-Of-Linear-Algebra.html) · [MD](docs/aimd/20160805_Vectors-Chapter-1-Essence-Of-Linear-Algebra_claude.md) |
| yt:xTaDx3tbYMs | SH AI Academy, "Cosine Similarity vs. Euclidean Distance vs. Dot Product: Choosing the Right Metric for AI Search" (6:13) <https://www.youtube.com/watch?v=xTaDx3tbYMs> | 2025-09-23 / 2026-10-10 | 1.2, 1.5, 2.1, 2.2, 2.3, 5.1–5.3, 5.4, 6.2, 9.2, 10.2 | [HTML](docs/outhtm/20250923_Cosine-Similarity-Vs-Euclidean-Distance-Vs-Dot-Product.html) · [MD](docs/aimd/20250923_Cosine-Similarity-Vs-Euclidean-Distance-Vs-Dot-Product_claude.md) |
| yt:lPTcTh5sRug | BlackBoard AI, "How AI Turns Words Into Vectors: Embeddings" (3:34) <https://www.youtube.com/watch?v=lPTcTh5sRug> | 2025-08-18 / 2026-10-10 | 1.5, 3.4, 4.1, 4.3, 4.4, 4.6, 8.1 | [HTML](docs/outhtm/20250818_How-AI-Turns-Words-Into-Vectors-Embeddings.html) · [MD](docs/aimd/20250818_How-AI-Turns-Words-Into-Vectors-Embeddings_claude.md) |

## yt:xTaDx3tbYMs — Cosine vs Euclidean vs Dot

tags: `similarity-metrics` `cosine` `euclidean` `dot-product` `normalization` `metric-choice` `high-dimensions` `attention`  
ใช้ในบท: 1.2, 1.5, 2.1, 2.2, 2.3, 5.1–5.3, 5.4, 6.2, 9.2, 10.2

**เอามาใช้**

- บท 5.1–5.3 Similarity search: เพิ่ม dot เป็น metric ที่สาม และตารางเรียงอันดับสามแบบเทียบกัน
- บท 5.4 เลือก metric: แนวคิด "ความยาวของเวกเตอร์มีความหมายไหม" (decision framework) และตารางตัวอย่างงาน
- บท 2.2 Dot product: ตัวอย่าง attention = query · key
- บท 9.2 Attention: query · key ด้วยเวกเตอร์บนสไลด์ (~3:44) ใช้ค่าที่แก้แล้ว 0.70 / 0.23 และบอกไว้ใต้สูตรว่าสไลด์พิมพ์ผิด
- บท 1.5 Matrix: `batch_cosine` ที่รับตารางแถวละเวกเตอร์ (ตัวอย่างว่าเก็บเป็นตารางแล้วคำนวณทีละหลายแถวได้)
- บท 6.2 มิติสูง: หัวข้อ curse of dimensionality

**แก้จากต้นฉบับ**

- ค่า attention ในสไลด์เขียนไว้ 0.69 และ 0.15 ที่ถูกคือ **0.70** และ **0.23** (ลำดับยังเหมือนเดิม)
- ตารางสรุปในคลิปมีแถว Dot Product ซ้ำสองครั้งและไม่มีแถว Euclidean
- คลิปบอกว่า cosine ทนต่อมิติสูงกว่า distance ซึ่งจริงแค่บางส่วน: ทดลองแล้ว cosine ก็บีบเข้าหากันเหมือนกัน (บท 6.2)
- ตารางตัวอย่างงานในบท 5.4 เขียนให้แคบลงกว่าคลิป: "รูปภาพใช้ distance" ใช้กับ feature ดิบ (pixel, color histogram) ส่วน image embedding รุ่นใหม่มักใช้ cosine

**เราคำนวณหรือเพิ่มเอง (ไม่ได้มาจากคลิป)**

- ตัวอย่าง A = (3, 1, 0), B = (6, 2, 0), C = (3, 2, 0) ที่ทำให้ cosine กับ dot เลือก B แต่ distance เลือก C (คลิปพูดถึงตัวอย่างแบบนี้แต่ไม่แสดงตัวเลข)
- เอกลักษณ์บนเวกเตอร์ยาว 1: â · b̂ = cos θ และ ‖â − b̂‖² = 2 − 2 cos θ ทำให้สาม metric เรียงเหมือนกันหลัง normalize (ตรวจใน `tests/parity/*/edge_cases.*`)
- query ตัวอย่างในบท 5.1–5.3 (0.5, 0.2, 0.1) ที่ทำให้ทั้งสามแบบได้อันดับ 1 คนละตัว (apple, rice, banana) เลือกจากการค้นทุกจุดบนตารางของ slider ให้แต่ละแบบชนะขาดอย่างน้อย 0.015
- การทดลองบท 6.2: 200 จุดสุ่มใน [0, 1]^d กับ query หนึ่งจุด ใช้ตัวสุ่ม minstd (x · 48271 mod 2³¹ − 1, seed 7, ทิ้ง 10 ตัวแรก) เพื่อให้ JS / Python / C++ ได้ผลตรงกันทุกตัวอักษร
  ตัวเลขจึงต่างจากตารางในรายงาน iw ซึ่งใช้ `random.seed(7)` ของ Python แต่แนวโน้มเหมือนกัน:

  | d | spread ในรายงาน iw (Python random) | spread ในบท 6.2 (minstd) |
  |---|---|---|
  | 2 | 37.33 | 13.056 |
  | 10 | 2.20 | 1.857 |
  | 100 | 0.38 | 0.381 |
  | 1000 | 0.085 | 0.098 |

## yt:lPTcTh5sRug — Embeddings

tags: `embeddings` `embedding-matrix` `one-hot` `token-id` `vocabulary` `training-embeddings`  
ใช้ในบท: 1.5, 3.4, 4.1, 4.3, 4.4, 4.6, 8.1

**เอามาใช้**

- บท 8.1 Bi-Encoder: ลิงก์ "อ่านเพิ่ม" ไปส่วน Embedding matrix เพราะตาราง `table` ในบทนั้นคือ embedding matrix ขนาดเล็ก (คำ → เวกเตอร์)
- บท 1.5 Matrix: ขนาด 50,000 × 300 แถวละคำ · บท 3.4 Token ID: Vocabulary mapping King → 0 … ใช้เลขเป็นที่อยู่ของแถว · บท 4.1 One-hot: 'cat' → [1, 0, 0, 0], 50,000+ ช่อง, ทุกคำต่างกันเท่ากัน
- บท 4.3 Embedding matrix: หยิบแถวด้วย ID และสี่ขั้นตอน (vocabulary & ID → matrix → lookup → learn & adjust) · บท 4.4: เริ่มสุ่ม → ทายผิด (คำที่ถูกคือ crown) → ปรับแถวของ queen ทีละนิด ซ้ำเป็นล้านครั้ง

**เราคำนวณหรือเพิ่มเอง**

- one-hot สองคำใด ๆ มี cos = 0 และระยะ = √2 เสมอ จึงไม่มีความหมายเรื่องความคล้าย
- lookup ด้วย ID ให้ผลเท่ากับ one-hot × matrix (แค่ไม่ต้องคูณศูนย์)
- ไอเดียบทเรียน "One-hot vs Embedding" ทำแล้วเป็นบท 4.1 One-hot และ 4.3 Embedding matrix (2026-10-11, `WIP202610026`)

## yt:fNk_zzaMoSs — 3Blue1Brown, Vectors (Essence of Linear Algebra บทที่ 1)

tags: `vector-basics` `vector-addition` `scalar-multiplication` `linear-algebra`  
ใช้ในบท: 1.1, 1.3, 1.4, 2.1 (และข้อเสนอเรื่องลำดับบท)

**โหมดรายงาน:** แปลแบบตีความ ครบทุกรายละเอียด (license มาตรฐานของ YouTube)

**เอามาใช้ / เสนอให้ใช้**

- บท 1.1 Vector: สามมุมมองของเวกเตอร์ (ลูกศร, รายการตัวเลข, สิ่งที่บวกและคูณได้) และพิกัดเป็น "คำสั่งเดิน" จากหางไปหัว
- บท 1.3 Vector space: เวกเตอร์คือลิสต์ตัวเลขที่บอกตำแหน่ง (พิกัด = คำสั่งเดิน)
- บท 1.4 บวก ลบ คูณ: การบวกแบบหางต่อหัวพร้อมเหตุผลแบบ "ก้าวเดิน" และการคูณด้วย scalar
- ลำดับบท: คลิปสอนการบวกและการคูณด้วย scalar ก่อนเรื่องอื่น เดิม ZVect สอน dot ก่อนการบวก ตั้งแต่ 2026-10-10 (`WIP202610020`) ปรับเป็น Vector space บท 1.3, บวก ลบ คูณ บท 1.4 (แยกออกมา 2026-10-11) แล้ว Dot product บท 2.2 ตามลำดับนี้

**แก้จากต้นฉบับ:** ไม่พบจุดผิด

**เราคำนวณหรือเพิ่มเอง:** (1, 2) + (3, −1) = (4, 1), 2·(3, 1) = (6, 2), −1.8·(3, 1) = (−5.4, −1.8) ตรงกับภาพในคลิป; การสลับลำดับในตัวอย่างบ้านเปลี่ยนความหมาย

## yt:e9U0QAFbfLI — StatQuest, Cosine Similarity

tags: `similarity-metrics` `cosine` `bag-of-words` `word-counts`  
ใช้ในบท: 2.3, 4.2, 5.1–5.3, 8.1 (แหล่งหลักของบท 4.2 Bag of words)

**โหมดรายงาน:** แปลแบบตีความ ครบทุกรายละเอียด (license มาตรฐานของ YouTube; ตัดช่วงผู้สนับสนุนและโปรโมตตัวเอง)

**เอามาใช้ / เสนอให้ใช้**

- บท 2.3 Cosine: ตัวอย่าง "Hello, World!" / "Hello!" / "Hello Hello Hello" (45°, 0.71) ใช้เป็นชุดตั้งค่าได้ และย้ำว่าค่าขึ้นกับมุมเท่านั้น
- บท 5.1–5.3 Similarity search: โจทย์ "tweet ทั้งเดือน" อธิบายว่าทำไมต้องให้คอมพิวเตอร์จัดอันดับ
- บท 4.2 Bag of words: ตารางนับคำ, กราฟ hello / world (45° → 0.71), "Hello Hello Hello" ยังได้ 0.71, ตัวอย่าง 5 คำ → 0.58, สูตรแบบ ∑ (ทำแล้ว 2026-10-11, `WIP202610026`)

**แก้จากต้นฉบับ:** ไม่พบจุดผิด (0.71 = 1/√2, 0.58 = 2/(2·√3))

**เราคำนวณหรือเพิ่มเอง:** ช่วง 0 ถึง 1 เป็นจริงเพราะจำนวนคำติดลบไม่ได้; การนับคำวัดคำที่ใช้ร่วมกัน ไม่ใช่ความรู้สึก
("Troll 2 is bad." กับ "I love Troll 2!" ได้ 0.50) คำนวณด้วย `words` + `cosine` ของ lib

## yt:NEreO2zlXDk — Colin Talks Tech, A Beginner's Guide to Vector Embeddings

tags: `embeddings` `latent-space` `knn` `outliers` `similarity-metrics`  
ใช้ในบท: 4.5–4.6, 5.1–5.3, 5.4, 8.1, 8.4 (แหล่งหลักของบท 4.6; และไอเดียบท outlier)

**โหมดรายงาน:** แปลแบบตีความ ครบทุกรายละเอียด (license มาตรฐานของ YouTube) คลิปเปิดบทความของ Pinecone และเดโม Colorful Vectors บน Hugging Face

**เอามาใช้ / เสนอให้ใช้**

- บท 4.5 Latent space: เดโมสี RGB เป็นตัวอย่างแกนที่มีความหมาย
- บท 5.1–5.3 / 5.4: KNN = top-k ตามระยะ; ตารางสีแสดงว่า distance กับ cosine เรียงต่างกัน
- บท 8.1 Bi-Encoder: บอตถามตอบใช้โมเดลเดียวกันกับเอกสารและคำถาม
- บท 4.6 ใช้ model เดียวกัน (2026-10-11, `WIP202610041`): ขั้นตอน embed เอกสารก่อน → embed คำถามด้วย model เดียวกัน → หาที่ใกล้สุด (~5:25)
  · ร่วมกับ BlackBoard AI / SOFAR (ตารางเริ่มสุ่มแล้วฝึก), Under The Hood (ความหมายของมิติขึ้นกับข้อมูลที่ฝึก), Byte Goose AI (768 vs 3072 มิติ, EmbeddingGemma)
  และ Qdrant (เปลี่ยน encoder แล้ว embed ใหม่ทั้งหมด) · ตาราง A / B (seed 16 / 18) ผู้จัดทำฝึกเอง
- ไอเดียบทใหม่: outlier (ระยะจาก centroid) จากตัวอย่างตรวจจับการโกง

**แก้จากต้นฉบับ:** ไม่พบข้อผิดใหญ่ มีข้อความที่ควรเข้าใจให้ตรง: embedding จริงมีหลายร้อยถึงหลายพันมิติ; metadata มักเก็บแยกจากเวกเตอร์;
การค้นด้วย embedding หาความหมาย ไม่ใช่แค่ keyword; เดโมสีใช้ค่า RGB ที่กำหนดตรง ๆ

**เราคำนวณหรือเพิ่มเอง:** อันดับเพื่อนบ้านของ Malachite ด้วยค่า RGB บนจอ (distance และ cosine)

## yt:hVM8qGRTaOA — Under The Hood, What Are Word Embeddings?

tags: `embeddings` `word-embeddings` `token-id` `one-hot` `bag-of-words` `n-gram` `embedding-matrix` `word2vec` `cbow` `skip-gram` `latent-space` `positional-encoding` `attention` `llm-internals`  
ใช้ในบท: 1.5, 3.4, 4.1–4.6, 8.1, 9.1, 9.2, 10.1, 10.3 (แหล่งหลักของบท 3.4 Token ID, 4.1 One-hot, 4.3 Embedding matrix, 4.4, 9.1)

**โหมดรายงาน:** แปลแบบตีความ ครบทุกรายละเอียด (license มาตรฐานของ YouTube)

**เอามาใช้ / เสนอให้ใช้**

- แหล่งหลักของบท 3.4 Token ID (good 6, bad 22, great 21; เลขเหมาะกับของที่มีลำดับเท่านั้น), 4.1 One-hot, 4.2 (bag of words, unigram / bigram / n-gram), 4.3 Embedding matrix (ตาราง lookup 8 × 3, one-hot × matrix = แถว), 4.4 (CBOW หน้าต่าง 3, fox + over → jumps, skip-gram) และ 1.5 Matrix (แถว = จำนวนคำ คอลัมน์ = จำนวนมิติ)
- บท 4.5 Latent space: ตัวอย่าง 1 มิติ (อายุ) → 2 มิติ (อายุ, royalty), king − man + woman และ Beijing + Japan − China ≈ Tokyo
- บท 8.1 Bi-Encoder: `table` คือ embedding matrix ขนาดเล็ก
- บท 9.1 LLM input: "The cat sat on a mat" (ID 791, 8415, 7731, 389, 264, 5634) → ตาราง 6 × d, ชั้น embedding ฝึกพร้อมโมเดล, บวกเวกเตอร์ตำแหน่งแล้วขนาดไม่เปลี่ยน (ทำแล้ว 2026-10-11)
- บท 9.2 Attention: attention เป็นชั้นแรกของ decoder block และให้บริบท

**แก้จากต้นฉบับ:** ไม่พบจุดผิด

**เราคำนวณหรือเพิ่มเอง:** ระยะเลข token |good − great| = 15 เทียบ |bad − great| = 1; one-hot cos 0 ระยะ √2;
bag of words ของ "This movie was good" กับ "This movie was bad" ได้ cosine 0.75; one-hot × matrix = แถว
· ปุ่ม "แจกเลขใหม่" ในบท 3.4 และเลขเรียงตามตัวอักษรในโค้ดตัวอย่าง (bad 0, good 1, great 2) · กติกาฝึกย่อของบท 4.4 (c = ค่าเฉลี่ยคำรอบข้าง, e ← e + 0.3 (c − e), คำรอบข้างตรึงไว้) และประโยคฝึก 4 ประโยค · ตัวเลข 3 ตัวของแถวและของเวกเตอร์ตำแหน่งในบท 9.1 — ผู้จัดทำแต่งเองทั้งหมด ไม่ใช่การฝึกจริง

## yt:1Qex37vowTM — SOFAR, Vector Embedding : Build LLM from scratch

tags: `embeddings` `word2vec` `latent-space` `embedding-dimensions` `training-embeddings` `llm-internals`  
ใช้ในบท: 3.4, 4.4–4.7, 5.1–5.3, 6.2, 8.1, 9.1, 9.2, 10.4

**โหมดรายงาน:** แปลแบบตีความ ครบทุกรายละเอียด (license มาตรฐานของ YouTube)

**เอามาใช้ / เสนอให้ใช้**

- บท 4.5 Latent space: ตารางน้ำหนัก cat/lion/dog/blue/sandwich บนแกน animal, human, pet, edible เป็นตัวอย่าง "แกนที่มีความหมาย" ที่เข้าใจง่าย
- บท 5.1–5.3 Similarity search: "ความต่างของน้ำหนักน้อย = คล้าย" คือ distance
- บท 3.4 Token ID: เลขประจำคำ (cat 23, lion 50, dog 150) ไม่มีความหมาย, การจับคู่คำกับเลขคือ vocabulary · บท 4.4: สุ่ม → ทาย → error → gradient → ปรับ, Word2Vec 3 ล้านคำ × 300, king–queen 0.651 vs king–man 0.229
- บท 9.1 / 9.2: ลำดับขั้นใน GPT (tokenization → embedding → positional → contextual → self-attention) และขนาดของ GPT-1/2/3
- บท 6.2 มิติสูง: ขนาดมิติของ GPT-1 (768), GPT-2 (768–1,600), GPT-3 (12,288) เทียบกับ Word2Vec (300)
- บท 8.1 Bi-Encoder: คำที่ไม่มีในคลังคำ (`KeyError: 'Bill_Gates'`) ตรงกับที่ `encode()` ของ ZVect ข้ามคำที่ไม่รู้จัก

**แก้จากต้นฉบับ** (ใส่ไว้ในกล่องแยก ไม่ได้แก้เนื้อหาของผู้สอน)

- "เขียนคุณลักษณะ 768 อย่าง" เป็นภาพช่วยเข้าใจ มิติในโมเดลจริงเป็นค่าที่เรียนมาระหว่างฝึก และมักตีความทีละมิติไม่ได้
- king กับ queen "65%" คือ cosine similarity 0.651 ไม่ใช่เปอร์เซ็นต์หรือความน่าจะเป็น
- ผลที่ผู้สอนเรียกว่า "เริ่ม hallucinate" คือคำที่คะแนนต่ำกว่าในรายการ `most_similar` ไม่ได้สร้างคำตอบขึ้นเอง
- "มิติยิ่งสูงยิ่งดี": ผู้สอนบอกว่ามีข้อแม้แต่ไม่ได้อธิบาย ผู้จัดทำเสริมเรื่องข้อมูล การคำนวณ และระยะห่างที่บีบเข้าหากันในมิติสูง (บท 6.2)

**เราคำนวณหรือเพิ่มเอง:** ใช้ 4 มิติจากตารางบนจอ คำนวณด้วย lib ของ ZVect ได้ distance / cosine:
cat–dog 0.141 / 0.997, cat–lion 0.415 / 0.965, dog–lion 0.539 / 0.950, cat–sandwich 1.379 / 0.332;
โค้ด Python + gensim ที่ทำซ้ำการทดลองในคลิป (ผู้จัดทำเขียนเอง ยังไม่ได้รันในเครื่อง)

## yt:Lc4dzmSFb14 — Satyajit Das, Vector Search and HNSW Explained Visually

tags: `vector-search` `brute-force` `inverted-index` `keyword-search` `ann` `hnsw` `efsearch`  
ใช้ในบท: 2.1, 5.1–5.3, 5.5, 6.1, 6.2, 7.1–7.4, 8.1 (แหล่งหลักของบท 7.1–7.4)

**ใช้ในบทชุดใหม่ (2026-10-11, `WIP202610027`):** 6.1 ค้นทุกชิ้น (อ่านทีละชิ้น ~1M ครั้ง, ข้อมูล 2 เท่า = ช้า 2 เท่า) · 5.5 inverted index และตัวอย่าง cancel (#15, #103, #588) ที่พลาด "End your membership today" · 7.1 กราฟเพื่อนบ้านเดินแบบ greedy (1.43 → 0.95 → 0.52), วนในซอย · 7.2 ชั้นทางด่วน / ถนนหลัก / ซอย · 7.3 beam = efSearch, ตัวอย่าง beam แคบ / กว้างบนจอ · 7.4 โยนเหรียญ ~1/M, ตัวอย่าง Pause billing (หัว หัว ก้อย → ชั้น 2), ตาราง N × (1/M)^k (คำนวณในไฟล์สรุป)

**โหมดรายงาน:** แปลแบบตีความ ครบทุกรายละเอียด (license มาตรฐานของ YouTube, caption อัตโนมัติ)

**เอามาใช้ / เสนอให้ใช้**

- บท 5.1–5.3 Similarity search: บทนี้วนเทียบทุกรายการ ซึ่งคือ brute force ในคลิป ใช้ประโยค "embeddings solve meaning, not speed" อธิบายว่าทำไมระบบใหญ่ต้องมี index
- บท 6.2 มิติสูง: เหตุผลที่การค้นหาแบบประมาณต้องยอมแลก recall
- บท 8.1 Bi-Encoder: ขั้น embed คำถาม → ค้นเวกเตอร์ใกล้สุด → (กรอง/rerank) → LLM ตรงกับบอท help center ในคลิป
- ไอเดียบทใหม่ "ค้นหาแบบประมาณ (ANN)": brute force เทียบกับ greedy walk บนกราฟเพื่อนบ้าน นับจำนวนการคำนวณระยะ (คู่กับ c10w0Ptn_CU)

**แก้จากต้นฉบับ** (ใส่ไว้ในกล่องแยก ไม่ได้แก้เนื้อหาของผู้สอน)

- คำที่ caption อัตโนมัติฟังผิด: "F search" = efSearch, "F construction" = efConstruction, "Enduracers membership" = End your membership, "meaning bits matching" น่าจะเป็น "meaning beats matching"
- "M = จำนวนเพื่อนบ้านต่อบทความ": ในหลายไลบรารีชั้น 0 เก็บได้มากกว่า M (มักเป็น 2M) จากความรู้ของผู้จัดทำ ยังไม่ได้เปิดเอกสารต้นฉบับของ HNSW ตรวจ (ขออนุญาตเปิด arxiv.org ไม่ทัน)
- ระยะบนจอ (1.43, 0.95, 0.52, 1.10 …) คลิปไม่ได้บอกที่มา ควรอ่านเป็นตัวเลขประกอบภาพ

**เราคำนวณหรือเพิ่มเอง:** จำนวนบทความที่คาดว่าจะถึงชั้น k ขึ้นไป = N × (1/M)^k ด้วยค่าตัวอย่าง M = 16, N = 1,000,000:
62,500 / 3,906 / 244 / 15 / 0.95 สำหรับชั้น 1–5

## yt:c10w0Ptn_CU — Sefik Ilkin Serengil, Approximate Nearest Neighbour From Scratch In Python

tags: `vector-search` `ann` `annoy` `random-projection-tree` `hyperplane` `knn` `brute-force`  
ใช้ในบท: 2.2, 5.1–5.3, 6.1, 6.2, 6.4 (แหล่งหลักของบท 6.4 ANN แบบต้นไม้)

**ใช้ในบทชุดใหม่ (2026-10-11, `WIP202610027`):** 6.4 ANN แบบต้นไม้ (สูตรเส้นแบ่ง n = v₁ − v₂, c = n · กึ่งกลาง, ฝั่ง > c = ขวา, กลุ่มละ ≤ 5, 1,000 จุด, 9 ขั้น vs 1,000 ครั้ง, Annoy) · 6.1 k-NN เทียบครบ 1,000 จุด · ผลทดลอง 500 ต้น 74.6% (คำนวณในไฟล์สรุป) · บทนี้สุ่มจุดและเส้นเอง (seed 1) จึงได้ 8 ขั้นที่ (50, 50) และพลาดที่ (30, 30)

**โหมดรายงาน:** แปลแบบตีความ ครบทุกรายละเอียด (license มาตรฐานของ YouTube, caption อัตโนมัติ)

**เอามาใช้ / เสนอให้ใช้**

- บท 2.2 Dot product: บอกฝั่งของ hyperplane ด้วยเครื่องหมายของ n · v − c
- บท 5.1–5.3 Similarity search: ต่อยอดจาก brute force (k-NN) ไปสู่ต้นไม้ hyperplane
- บท 6.2 มิติสูง: วิธีเดียวกันใช้ได้ในหลายมิติ แม้จะวาดดูไม่ได้
- ไอเดียบทใหม่ "ค้นหาแบบประมาณ (ANN)": วาดเส้นแบ่งทีละขั้นใน 2 มิติ นับขั้นเทียบ brute force และแสดงกรณีที่ต้นไม้ต้นเดียวพลาด (คู่กับรายงาน HNSW)

**แก้จากต้นฉบับ** (ใส่ไว้ในกล่องแยก ไม่ได้แก้เนื้อหาของผู้สอน)

- caption อัตโนมัติฟังผิดหลายคำ เช่น "from Secret" = from scratch, "17.3" = 17.035 (บนจอ), "is1 times" = 111 เท่า (บนจอ 1000 / 9)
- "111 เท่า" นับจำนวนขั้นเทียบกับจำนวนเวกเตอร์ ไม่รวมการเทียบระยะในใบและต้นทุนสร้างต้นไม้ (ผู้สอนระบุเงื่อนไข "ถ้าสร้างต้นไม้ไว้ก่อน")
- ใบของต้นไม้ต้นเดียวไม่รับประกันว่ามีเพื่อนบ้านใกล้สุดจริง
- `np.dot` ของเวกเตอร์ 1 มิติสองตัวคือ dot product ไม่ใช่การคูณเมทริกซ์

**เราคำนวณหรือเพิ่มเอง:** เขียนโค้ดเทียบเท่าใน Python ล้วนแล้วรัน (1,000 จุด, seed 42, เป้าหมาย (50, 50), leaf 5):
ขั้นเฉลี่ย 9.6 (5–15); ต้นไม้ต้นเดียวมีเพื่อนบ้านใกล้สุดจริงในใบ 74.6% (500 ต้น) และ 70.3% (300 คำถามสุ่ม);
ป่า 10 ต้น 100% จาก 300 คำถาม ด้วยผู้สมัครเฉลี่ย 13.7 ตัว

## yt:YLkSfz3EFGw — Devsplainers, Vector Databases Are Dead. Use This Instead

tags: `vector-database` `keyword-search` `bm25` `hybrid-search` `agent-search` `fact-checked`  
ใช้ในบท: 5.1–5.3, 5.4, 5.5, 8.1

**ใช้ในบทชุดใหม่ (2026-10-11, `WIP202610027`):** 5.5 ค้นด้วยคำ vs ความหมาย (BM25 68.8% vs เวกเตอร์ 51.4%, รหัส / ตัวย่อ / เลข ticket, BrowseComp-Plus 70.1 vs 55.9, Cursor +12.5%, keyword ก่อน) · เอกสาร 8 ชิ้นและตารางเวกเตอร์คำในบทนั้นผู้จัดทำแต่งเอง

**โหมดรายงาน:** แปลแบบตีความ ครบทุกรายละเอียด (license มาตรฐานของ YouTube, caption อัตโนมัติ) พร้อมตรวจข้อเท็จจริง 18 ข้อด้วยการค้นเว็บ

**เอามาใช้ / เสนอให้ใช้**

- บท 5.1–5.3 Similarity search: "ใกล้ในความหมาย" ไม่ใช่ทุกอย่าง ค่าที่ต้องตรงเป๊ะ (เลขลูกค้า, เลข ticket) ควรค้นด้วยคำหรือ filter
- บท 5.4 เลือก metric: ต่อยอดเป็น "เลือกวิธีค้น" (BM25, vector, filter, ถามแอปตรง)
- บท 8.1 Bi-Encoder: embedding จากข้อความสาธารณะไม่รู้จักชื่อรหัสภายในองค์กร
- ไอเดียบทใหม่ "keyword กับ vector": เทียบ BM25 กับ cosine บนชุดเอกสารเล็กที่มีทั้งคำพ้องความหมายและรหัสเฉพาะ

**ผลตรวจข้อเท็จจริง** (ใส่ไว้ในกล่องแยก ไม่ได้แก้เนื้อหาของผู้เล่า): ยืนยัน 11 ข้อ บางส่วน 7 ข้อ ไม่พบข้อที่ขัดกับแหล่งตรง ๆ จุดที่ควรรู้:

- Notion บน turbopuffer คือ "10B+ vectors" ไม่ใช่ 10 พันล้านเอกสาร
- เกณฑ์ pgvector ต่ำกว่า 10 ล้านเวกเตอร์มาจากเอกสารของ turbopuffer (ตามที่ Sacra รายงาน) ไม่พบเป็นคำพูดของ CTO และโพสต์ "RIP" เองพูดถึง 1 ล้าน
- 12.5% ของ Cursor เป็นค่าเฉลี่ยแบบสัมพัทธ์บน benchmark ภายใน
- ต้นทุนสร้าง wiki "100 เท่า" เป็นค่าหลังถ่วงด้วย prompt caching (ค่าดิบ 645 เท่า)
- PipesHub ยืนยันได้แค่ตัวเลขหลัก 92.7% เทียบ 78.9% เพราะเปิดหน้าเว็บไม่ได้
- หลายแหล่งเปิดตรงไม่ได้ในงานนี้ จึงใช้สำเนาหรือแหล่งรอง (ระบุไว้ในรายงาน)

**เราคำนวณหรือเพิ่มเอง:** ไม่มีการคำนวณใหม่ มีตารางตรวจข้อเท็จจริงพร้อมแหล่งที่อ่าน

## yt:bU38Ovdh3NY — CMU Database Group, Qdrant (Andrey Vasnetsov)

tags: `vector-database` `qdrant` `hnsw` `filtering` `percolation` `quantization` `binary-quantization` `rescoring`  
ใช้ในบท: 2.2, 4.6, 5.1–5.3, 5.4, 6.2, 6.3, 7.1–7.5, 8.1 (แหล่งหลักของบท 7.5)

**ใช้ในบทชุดใหม่ (2026-10-11, `WIP202610027`):** 7.1–7.2 greedy ไม่รับประกันตัวใกล้สุด, ใส่จุด ~2 เท่าของการค้น, ต้องใช้ RAM · 7.3 beam แลกความแม่นกับความเร็ว · 7.5 กรองระหว่างเดิน, กรองเข้มแล้วกราฟขาด (ขีด 1/k, 10 เส้น → 90%), เส้นเสริมต่อค่า payload · กราฟสุ่ม 2,000 จุดในบท 7.5 ผู้จัดทำสร้างเอง

**โหมดรายงาน:** แปลคำต่อคำฉบับเต็มทั้งการบรรยายและถามตอบ (Creative Commons Attribution, ตรวจในหน้าคลิป) พร้อมสรุปเชิงลึกด้านบน
· transcript ภาษาอังกฤษเก็บไว้ใน `.dropzone/iw_temp/20261010_2013/transcript_bU38Ovdh3NY.txt`

**เอามาใช้ / เสนอให้ใช้**

- บท 6.3: binary quantization เหลือ 1 บิตต่อมิติ (เล็กลง 32 เท่า) เทียบด้วย bitwise XOR + popcount แล้ว rescore top 100 (25:25–27:15)
  เป็นหัวข้อของตัวเอง (แยกจาก Distance 2026-10-11); กฎตัดบิต "บวก = 1" ผู้จัดทำเลือกเอง (คลิปไม่ได้บอกวิธีตัด) และชื่อ Hamming distance เป็นความรู้ทั่วไป
- บท 2.2 และ 5.4: "ฟังก์ชันระยะกำหนดโดยโมเดล แต่ส่วนใหญ่ใช้ dot product"
- บท 5.1–5.3: "ทุกเวกเตอร์อาจเป็นผลลัพธ์ได้ ขีดเส้นจากคะแนนอย่างเดียวไม่ได้" ใช้เป็นข้อควรระวังเรื่อง threshold
- บท 6.2: การเทียบเวกเตอร์ช้าลงเชิงเส้นตามจำนวนมิติ และ binary quantization สำหรับเวกเตอร์ราว 1,500 มิติ
- บท 8.1: Qdrant สมมติว่า embedding มาจากโมเดลภายนอก
- ไอเดียบท ANN: filter ระหว่างเดินกราฟ และกราฟขาดตาม percolation (สัดส่วนที่ตัดได้ 1 − 1/k)

**แก้จากต้นฉบับ** (ใส่ไว้ในกล่องแยก ไม่ได้แก้คำแปล)

- ค่าวิกฤต 1/k บนสไลด์คือสัดส่วน node ที่เหลือ ไม่ใช่ที่ตัดออก (ตัวอย่าง 10 ลิงก์ → 90% ของผู้บรรยายตรงกับการอ่านนี้)
- โมเดล OpenAI ปี 2023 ให้ 1,536 มิติ (ผู้บรรยายพูดว่าราว 1,500)
- คำอธิบาย DiskANN ที่ผู้บรรยายบอกเองว่าอาจผิด: ตามความรู้ของผู้จัดทำ DiskANN ใช้ PQ ใน RAM และกราฟ Vamana เริ่มจากกราฟสุ่ม (ยังไม่ได้ตรวจกับเอกสาร)

**เราคำนวณหรือเพิ่มเอง:** เกณฑ์ percolation 1 − 1/k สำหรับ k = 4–64; หน่วยความจำของเวกเตอร์ 1 ล้านตัว × 1,536 มิติ: float32 6.14 GB, int8 1.54 GB, binary 192 MB

## yt:H6q1UWCCnKw — Byte Goose AI, How to choose the embedding model based on the task

tags: `embeddings` `embedding-model-choice` `multilingual` `matryoshka` `bi-encoder` `cross-encoder` `reranking` `rag` `negation` `numeracy-gap` `fact-checked`  
ใช้ในบท: 4.5–4.7, 5.1–5.3, 6.2, 8.1, 8.3, 8.4, 9.1 (และไอเดียบท Matryoshka)

**โหมดรายงาน:** เรียบเรียงใหม่ด้วยคำของผู้จัดทำ ครบทุกประเด็นและตัวเลข (license มาตรฐานของ YouTube, caption อัตโนมัติ) ไม่ใช่คำแปลคำต่อคำ พร้อมตรวจข้อเท็จจริง 11 ข้อด้วยการค้นเว็บ
· ไม่ได้เก็บ transcript ไว้ใน repo (เก็บเฉพาะใน workspace ของ session)

**เอามาใช้ / เสนอให้ใช้**

- บท 4.5 Latent space: ตัวอย่าง "bank" ที่ word2vec ให้พิกัดเดียว เทียบ transformer ที่ดูบริบท และ "ถ้าโมเดลวางสองแนวคิดไว้ใกล้กัน ปลายทางแก้ไม่ได้"
- บท 5.1–5.3 Similarity search: numeracy gap ("ถือหุ้น 20%" กับ "5%" อาจได้เวกเตอร์ใกล้กัน) ค่าที่ต้องเทียบเชิงตัวเลขควรใช้ filter
- บท 6.2 High dimensions: ต้นทุน RAM ตามจำนวนมิติ และ Matryoshka (MRL) ที่ตัดมิติท้ายทิ้ง
- บท 8.1 Bi-Encoder: bi-encoder อัดเอกสารเป็นเวกเตอร์เดียวก่อนเห็นคำถาม ต่างจาก cross-encoder · affirmative bias กับคำปฏิเสธ
- บท 8.4 Classification: linear separability

**ใช้ในบทชุดหลายภาษา (WIP202610029, 2026-10-11)**

- บท 8.1 Bi-Encoder (4 ภาษา): ชื่อโมเดลหลายภาษาที่ผู้ดำเนินรายการเลือก (Qwen3-Embedding-8B, text-multilingual-embedding-002) · BGE-M3 (ค้นแบบผสม) และ EmbeddingGemma (อุปกรณ์เล็ก) ระบุว่าคลิปยกไว้ใช้งานอื่น ส่วน "กว่า 100 ภาษา" มาจากการตรวจทาน · tokenizer ตัดตัวเลขเป็นชิ้น (โยงกับเรื่องตัดคำ) · คลิปไม่มีตัวเลขความแม่นแยกภาษา ตัวเลขในบทมาจากตารางของเล่นและเขียนกำกับไว้
- บท 8.3 Reranker (4 ภาษา): faithfulness เขียนตามคลิป 0.347 → 0.797 พร้อมค่าตรวจทาน 0.621 = RAG พื้นฐาน (RAG ขั้นสูงมีทั้งการตัดเอกสารที่ดีขึ้นและ cross-encoder) · negation verifier · ตำแหน่งคำปฏิเสธแต่ละภาษาเป็นความรู้ทั่วไป
- บท 9.1 LLM input: static (Word2Vec ให้ bank พิกัดเดียว) ยังไม่รู้บริบท
- ไอเดียบทใหม่ "ตัด vector แบบ Matryoshka" (เวกเตอร์ของเล่นไม่ได้ฝึกแบบ MRL ใช้สาธิตเท่านั้น)

**แก้จากต้นฉบับ** (ใส่ไว้ในกล่องแยก ไม่ได้แก้เนื้อหาของผู้ดำเนินรายการ)

- gemini-embedding-001 มี 3072 มิติ (caption ได้ยินเป็น "372" และ "30 or 72")
- ค่า 0.347 ในงานวิจัยต้นทางคือ LLM ที่ไม่มีการค้นเลย RAG พื้นฐานได้ 0.621 และ RAG ขั้นสูง + cross-encoder ได้ 0.797 (เอกสารนโยบายสาธารณสุขของ CDC ไม่ใช่ข้อมูลคลินิก)
- งานวิจัยเรื่องตัวเลขชื่อ EmbedNum-1K ("Revealing the Numeracy Gap", Findings of EACL 2026)
- EmbeddingGemma มี 308M พารามิเตอร์ · ตัวเลข latency มีสองค่าในเอกสาร Google (<22 ms และ <15 ms ที่ 256 tokens)
- MRL รวม loss ของหลายความยาว ไม่ได้เน้นเฉพาะ 256 มิติ

**เราคำนวณหรือเพิ่มเอง:** เวกเตอร์ดิบของเอกสาร 100 ล้านชิ้นแบบ float32: 3072 มิติ 1,228.8 GB, 1024 มิติ 409.6 GB, 768 มิติ 307.2 GB, 256 มิติ 102.4 GB (ยังไม่รวม index)

## yt:xTzUn3G9YA0 — Prompt Engineering, Supercharge Your RAG with Contextualized Late Interactions (ColBERTv2)

tags: `colbert` `late-interaction` `maxsim` `multivector` `rag` `chunking` `dense-retrieval` `ragatouille`  
ใช้ในบท: 8.2 (แหล่งหลักของบท 8.2 Late interaction)

**โหมดรายงาน:** เรียบเรียงใหม่ด้วยคำของผู้จัดทำ ครบทุกประเด็นและตัวเลข (license มาตรฐานของ YouTube, caption อัตโนมัติ) ไม่ใช่คำแปลคำต่อคำ
ตัวเลขบางตัวอ่านจากภาพบนจอ (34,104 embeddings, MaxSim + Σ ในรูปของเปเปอร์, 4096 มิติของ SFR-Embedding-Mistral) และกำกับไว้ · ไม่ได้เก็บ transcript ไว้ใน repo

**เอามาใช้ / เสนอให้ใช้**

- บท 8.2 Late interaction (ใหม่): dense ใช้เวกเตอร์เดียวต่อ chunk และ chunk ยาวเสียข้อมูล · ColBERT ตัดเป็น token, เวกเตอร์ทุก token (contextualized), ทุก token ของคำถามเทียบทุก token ของเอกสารแล้วรวม · MaxSim + Σ จากรูปบนจอ · 219 passages → ราว 34,104 embeddings (ต้นทุนการเก็บ)
- ข้อเสนอบท 9.3 RAG (ยังไม่ทำ): chunk 256 / 512, ตัวอย่างที่ dense ดึงหน้าสารบัญมาปน

**แก้จากต้นฉบับ** (ใส่ไว้ในส่วนที่ 7 ของรายงาน)

- ผลเทียบเป็นคำถามสองข้อบนเอกสารเดียว ไม่ใช่การวัดผล (chunk และจำนวนผลของแต่ละฝั่งไม่เท่ากัน) ผู้สอนเองใช้คำว่า "น่าจะ / ผมคิดว่า / อาจ"
- คลิปไม่ได้พูดถึงต้นทุนที่เก็บหนึ่งเวกเตอร์ต่อ token

**เราคำนวณหรือเพิ่มเอง:** บท 8.2 ใช้เวกเตอร์คำของเล่น 3 มิติจากพจนานุกรม (ไม่ขึ้นกับบริบท) เอกสาร d1–d6 ชุดเดียวกับบท 8.1 และเพิ่ม d7 เป็น chunk ยาวหลายเรื่อง ·
ตัวอย่าง "กินข้าวแล้วแก้บั๊ก" (bi-encoder เลือก d2, late interaction เลือก d7) และ "แมวกับแอป" (d6 กับ d7) ผู้จัดทำหาโดยคำนวณ

## yt:BcxJk4WQVIw — Raj Pulapakura, Byte Pair Encoding (BPE) step by step

tags: `tokenization` `bpe` `subword` `vocabulary`  
ใช้ในบท: 3.1, 3.2, 3.3 (แหล่งหลักของบท 3.1 Tokenization และ 3.2 BPE; บท 3.3 ต่อยอดจาก 3.2)

**โหมดรายงาน:** เรียบเรียงใหม่ด้วยคำของผู้จัดทำ ครบทุกประเด็นและตัวเลข (license มาตรฐานของ YouTube, caption อัตโนมัติ) ไม่ใช่คำแปลคำต่อคำ
ตรวจตัวเลขของตัวอย่างด้วยการรันโค้ด (ไม่ได้ค้นเว็บ) · ไม่ได้เก็บ transcript ไว้ใน repo · ภาพ "Character tokenization" ที่เจ้าของโปรเจกต์ส่งมา (WIP202610031) คือสไลด์ที่ ~1:55 ของคลิปนี้

**เอามาใช้ / เสนอให้ใช้**

- บท 3.1 Tokenization (ใหม่): เครื่องเข้าใจแต่ตัวเลข การแปลงข้อความเป็นเลขคือ tokenization · คลังตัวอักษร a–z = 1–26, ! @ # $ = 27–30 (ภาพ hello there you are amazing → 23 เลข ช่องว่างไม่ได้เลข) · คลังคำสร้างจากคำไม่ซ้ำในข้อความฝึก เรียงแบบพจนานุกรม · ข้อแลก: ตัวอักษร = คลังเล็ก เลขยาว, คำ = คลังใหญ่ เลขสั้น, subword = ทางกลาง
- บท 3.2 BPE (ใหม่): ขั้นตอนเริ่มจากตัวอักษร → นับคู่ที่ติดกัน → รวมคู่ที่บ่อยที่สุด → แทนในข้อความ ทำ k รอบ · ข้อความฝึก fred fed ted bread, and ted fed fred bread · ใช้กฎตามลำดับกับ ted and fred are friends · i, s เป็น ? · BPE (GPT) / WordPiece (BERT) / Unigram (T5)
- บท 9.1 LLM input: ขั้น tokenization ก่อน embedding (ยังไม่ได้แก้บท)

**แก้จากต้นฉบับ** (ใส่ไว้ในกล่องแยกในรายงาน และในหัวข้อ "สรุปจากแหล่ง" ของบท 3.2)

- รอบ 2: d␣ ตามด้วย f นับได้ 3 (สไลด์ 4) และ f + r นับได้ 2 (สไลด์ 3)
- ถ้านับทุกคู่ กฎข้อ 3–4 คือ ed␣ + f และ ed␣ + b ไม่ใช่ fr และ fred␣ ตามสไลด์ (เสมอกันหลายคู่ที่ 2 ครั้ง เลือกคู่ที่เจอก่อน)
- ผลลัพธ์สุดท้าย: fred␣ ควรได้ 13 ตามคลังของสไลด์ (สไลด์เขียน 7 ซึ่งเป็นเลขของ r)
- คลังเริ่มต้นในสไลด์ไม่มีจุลภาค (ผู้สอนบอกเอง)

**เราคำนวณหรือเพิ่มเอง:** บท 3.1 ใช้ประโยค 6 ชุด × 4 ภาษาของบท 8.1 เป็นข้อความฝึก (คลังตัวอักษร 192 ตัว = 30 ตัวของสไลด์ + อักษรไทยครบชุด ก … ๛ + ตัวอื่นเรียงตามรหัส, คลังคำ 100 คำ ตัดด้วยพจนานุกรมของเล่นของบท 8.1; ข้อความที่พิมพ์เองแสดงเฉพาะภาษาที่พิมพ์; วิธีตัดคำภาษาไทยจริงเป็นความรู้ทั่วไป) · บท 3.2 นับสดทุกรอบ เมื่อเสมอเลือกคู่ที่เจอก่อน และเรียงคลังเริ่มต้นแบบตัวอักษรก่อน แล้วช่องว่าง เครื่องหมาย (a = 1 … t = 8, ␣ = 9 ตรงกับสไลด์ จุลภาค = 10) · byte-level BPE ของ GPT-2 และการตัดที่ช่องว่างก่อนรวมคู่เป็นความรู้ทั่วไป

## yt:6iCmnd0k3fs — Vishal Bakshi, multivector-rag-demo (coded by Opus 5.5 Extra)

tags: `rag` `multivector` `colbert` `maxsim` `late-interaction` `pylate-rs` `in-browser` `quantization` `binary-quantization` `asymmetric-quantization` `lookup-table` `scifact` `pleias-rag` `webgpu` `fact-checked`  
ใช้ในบท: ยังไม่ใช้ (เสนอ: 9.3 RAG, 6.3, 8.2)

**โหมดรายงาน:** เรียบเรียงใหม่ด้วยคำของผู้จัดทำ ครบทุกประเด็นและตัวเลข (license มาตรฐานของ YouTube, caption อัตโนมัติ) ตาราง 3 ชุดบนจอถอดเป็น HTML · ตรวจข้อเท็จจริง 7 ข้อด้วยการค้นเว็บ (ยืนยัน 3 · บางส่วน 4)

**เสนอให้ใช้ (ยังไม่ได้แก้บท)**

- ข้อเสนอบท 9.3 RAG (`WIP202610036`): เส้นทางครบ ค้น (pylate-rs + ColBERT 33M ในเบราว์เซอร์) → MaxSim → ส่ง passage ให้ Pleias-RAG-350M ตอบ · ตาราง MaxSim ต่อ token ของคำถาม "What does the cavern represent?" (cavern 7.25 vs 3.59–4.71)
- บท 6.3 เวกเตอร์ 1 บิต: asymmetric quantization คำถาม float × เอกสาร ±1 → q · d = 2 × Σ(q ที่บิต 1) − Σq และตาราง lookup 256 ช่องต่อไบต์ (32 × 12 × 256 = 98,304) · ตาราง SciFact (FP32 74.18 · int8 74.51 · FP32×binary 70.56 · binary×binary 60.16; 533 / 133 / 16.7 MB)
- บท 8.2 Late interaction: คำถามถูกเติม [MASK] จนครบ 32 token และคอลัมน์ token พิเศษ + [MASK] ได้คะแนนราว 82% ของคะแนนรวม

**แก้จากต้นฉบับ** (ในกล่องแยกของรายงาน)

- ASR: "Pilate RS" = pylate-rs, "372" = 3,072 (32 × 96), "98,34" = 98,304, "play us" = Pleias
- ผู้สอนพูด 3,418 ส่วน บนจอ 3,417 (3,418 คือความยาวของ offsets)
- บล็อก Mixedbread เก็บคำถามเป็น int8 ไม่ใช่ float · model card ของ Pleias อ้างว่าดีกว่า SLM ≤ 4B ส่วนใหญ่ ไม่ได้อ้างชนะโมเดล ~7B · Reason-ModernColBERT 150M ไม่ใช่ ~100M

**เราคำนวณหรือเพิ่มเอง:** 5,224,596 = 435,383 × 12 ไบต์ (41,796,768 บิต) · สัดส่วนคอลัมน์ Other 26 ≈ 201.26 / 246.41 ≈ 82% · ตัวอย่าง 4 มิติของสูตร asymmetric (q · d = 1.1) · ขนาดเล็กลงราว 32 เท่า (533 / 16.7)

## yt:aiNQ4I8YaD0 — Vishal Bakshi, Exploring Precision in ColBERT Indexing and Retrieval

tags: `colbert` `plaid` `mixed-precision` `quantization` `centroids` `ivf` `k-means` `recall` `index-artifacts`  
ใช้ในบท: ยังไม่ใช้ (เสนอ: 6.3, WIP k-means)

**โหมดรายงาน:** เรียบเรียงใหม่ด้วยคำของผู้จัดทำ ครบทุกประเด็นและตัวเลข (license มาตรฐานของ YouTube, caption แบบพิมพ์เอง) ตัวเลขบนจอตรวจกับภาพนิ่ง ไม่ได้ค้นเว็บ (คลิปปี 2025)

**เสนอให้ใช้ (ยังไม่ได้แก้บท)**

- บท 6.3 / หัวข้อ quantization: ตัวอย่างจริงว่าเปลี่ยน precision แล้ว recall แทบเท่าเดิม (0.130349 vs 0.129939) แต่ passage ที่ดึงได้ centroid และ ivf.pid เปลี่ยน
- `WIP202610028` k-means / IVF: centroid 16,384 ตัว, ivf.pid เก็บ mapping passage → centroid (963,143 vs 975,457) เป็นแหล่งที่พูดถึง centroid / IVF ของ ColBERT (PLAID) แต่ไม่ได้สอนวิธี k-means

**แก้จากต้นฉบับ** (ในกล่องแยกของรายงาน)

- ตัวนับ 388 นับสองทิศ ถ้าทุกคำถามมี 10 passage ทั้งสองฝั่ง ต่อฝั่งคือ 194 / 2,710 ≈ 7.2% (ผู้สอนคิด 14.3%)
- ผู้สอนพูดว่า centroid "ราว 8,000" บนจอคือ 16,384 (1,572,864 ค่า = 16,384 × 96)
- คลิปไม่ได้รัน precision เดียวกันซ้ำ จึงยังแยกผลของ precision ออกจากความไม่ deterministic ไม่ได้

**เราคำนวณหรือเพิ่มเอง:** 7.2% ต่อฝั่ง · FP32 เร็วกว่า 2.57 เท่า (180 / 70 วินาที)

## yt:8LPgGU34RoE — HiDevs, Build ColBERT Search Locally with Qdrant Edge

tags: `colbert` `late-interaction` `maxsim` `multivector` `qdrant` `qdrant-edge` `offline-search` `retrieve-then-rerank` `reranking` `fact-checked`  
ใช้ในบท: ยังไม่ใช้ (เสนอ: 8.2, 8.3)

**โหมดรายงาน:** เรียบเรียงใหม่ด้วยคำของผู้จัดทำ ครบทุกประเด็นและตัวเลข (license มาตรฐานของ YouTube, caption อัตโนมัติ) · ตรวจข้อเท็จจริง 5 ข้อด้วยการค้นเว็บ (ยืนยัน 4 · บางส่วน 1)

**เสนอให้ใช้ (ยังไม่ได้แก้บท)**

- บท 8.2 Late interaction: รูป "หนึ่งเวกเตอร์ต่อเอกสาร vs หนึ่งเวกเตอร์ต่อ token" และตาราง MaxSim (best match per query token → summed) · โค้ด Qdrant `MultiVectorConfig(comparator=MultiVectorComparator.MaxSim)`
- บท 8.3 Reranker: รูปแบบ retrieve-then-rerank (ค้นเร็วด้วยเวกเตอร์เดียว → rerank ด้วย ColBERT) ซึ่งเอกสาร Qdrant ยืนยัน
- ข้อเสนอบท 9.3 RAG: ค้นแบบออฟไลน์ในเครื่อง 24 passage ~1.5 ms

**แก้จากต้นฉบับ** (ในกล่องแยกของรายงาน)

- นิยาม ColBERT ที่อ่านจากสรุป AI ของหน้าค้นหา: เปเปอร์บอกเร็วกว่า BERT reranker ราวร้อยเท่า ไม่ได้อ้างว่าเร็วเท่า keyword search
- คำบรรยายปนเรื่อง "noise ในการฝึกโมเดล" กับการทำ index · ผล "apple" เป็นความหมายผลไม้ แต่คำบรรยายพูด "company" · "n documents → single vector" ที่ถูกคือหนึ่งเวกเตอร์ต่อเอกสาร
- การแยก apple ผลไม้ / บริษัท มาจาก encoder ที่ดูบริบท ไม่ใช่จาก late interaction เอง

**เราคำนวณหรือเพิ่มเอง:** ไม่มีการคำนวณใหม่ · ตัวเลขผลค้นอ่านจากจอ (28.0645 / 8.5872 / 7.5303; 32 token vector ต่อคำถาม)

## yt:my5wFNQpFO0 — Google for Developers, Machine Learning Crash Course: Embeddings

tags: `embeddings` `word2vec` `skip-gram` `one-hot` `embedding-matrix` `softmax` `training-embeddings`  
ใช้ในบท: ยังไม่ใช้ (เสนอ: 4.1, 4.3, 4.4)

**โหมดรายงาน:** เรียบเรียงใหม่ด้วยคำของผู้จัดทำ ครบทุกประเด็น (license มาตรฐานของ YouTube, caption แบบพิมพ์เอง) คลิปสั้น 2:36 ไม่ได้ค้นเว็บ

**เสนอให้ใช้ (ยังไม่ได้แก้บท)**

- บท 4.4 ตารางมาจากการฝึก: โครงข่าย word2vec (one-hot → embedding layer ไม่มี activation → ชั้นซ่อน (ใช้ได้) → softmax) และคู่ฝึก skip-gram
- บท 4.1 One-hot / 4.3 Embedding matrix: "น้ำหนักชั้น 1 → 2 คือ embedding matrix" หยิบน้ำหนักของคำ = เวกเตอร์ของคำ
- บท 4.5 Latent space: sail ใกล้ ship, how ไกล ("tend to / likely")

**แก้จากต้นฉบับ** (ในกล่องแยกของรายงาน): word2vec ต้นฉบับไม่มีชั้นซ่อนแบบ nonlinear (คลิปบอกว่า "ใช้ได้" จึงไม่ขัด) · softmax เต็มคือเหตุที่ช้า (ความรู้ทั่วไป)

**เราคำนวณหรือเพิ่มเอง:** ตัวอย่างคู่ skip-gram ของประโยค "the ship can sail far" ด้วยหน้าต่าง 1 คำ (ผู้จัดทำเลือก)

## yt:YIR-KxNpSbA — NitMonk, How Tokens, Vectors & Embeddings Actually Work (ภาษาฮินดี)

tags: `embeddings` `tokenization` `bpe` `token-id` `embedding-matrix` `embedding-dimensions` `training-embeddings` `vector-database` `attention` `contextual-embeddings` `next-token` `softmax` `temperature` `llm-internals` `hindi` `fact-checked`  
ใช้ในบท: 4.7, 10.2 (เสนอ: 3.4, 4.3, 9.1, 9.2)

**โหมดรายงาน:** เรียบเรียงใหม่ด้วยคำของผู้จัดทำ ครบทุกประเด็นและตัวเลข (license มาตรฐานของ YouTube) อ่านจาก caption ภาษาฮินดีอัตโนมัติ ใช้คำแปลอังกฤษอัตโนมัติช่วย ตัดช่วงทำอาหาร 3 ช่วงตามบทของคลิป · ตรวจข้อเท็จจริง 5 ข้อ (ยืนยัน 4 · บางส่วน 1)

**เสนอให้ใช้ (ยังไม่ได้แก้บท)**

- บท 3.4 Token ID: ตาราง cat / dog / tiger / lion (ขา ขน หาง ขนาด สัตว์เลี้ยง ดุร้าย) แสดงว่าเลข ID ไม่มีความหมาย ตัวเลขที่มีความหมายมาจากคุณสมบัติ
- บท 3.1: กฎ 1 token ≈ 4 ตัวอักษร (ภาษาอังกฤษ) และราคาคิดตาม token · "I love AI Agents" → 2, 891, 15, 4402
- บท 4.3 / 9.1: token ID = ที่อยู่, เวกเตอร์ = ตัวเลขที่ที่อยู่นั้น, embedding matrix = lookup table · บท 9.2: bank / apple ได้เวกเตอร์ต่างกันหลัง attention
- ไอเดียบทใหม่: เลือก token ถัดไป (softmax + temperature, milk 93%)

**แก้จากต้นฉบับ** (ในส่วนที่ 8 ของรายงาน)

- จำนวนแถวของ embedding matrix = ขนาดคลังคำ (~100k / ~200k) ไม่ใช่จำนวน token ที่ ChatGPT รับได้ (context window)
- BPE ไม่ได้ "แก้ตัวเลข" ตัวเลขมาจากการฝึก · attention ในคลิปไม่มี Q / K / V · softmax ไม่ได้กำหนดจำนวน token · temperature ของ API OpenAI อยู่ที่ 0–2
- คำแปลอัตโนมัติ "पेट" = pet ไม่ใช่ท้อง

**เราคำนวณหรือเพิ่มเอง:** ระยะ Euclidean ของคุณสมบัติ 6 อย่าง: cat–dog 1.000, tiger–lion 1.000, dog–tiger 1.732, cat–tiger 2.449, dog–lion 2.449, cat–lion 3.317 · ด้วย ID อย่างเดียว dog ห่าง cat เท่ากับห่าง tiger (1)

## yt:S7tFyREI19I — Prompt Engineering, Training Your Own Embedding Model Is Not As Hard As You Think

tags: `embeddings` `fine-tuning-embeddings` `contrastive-learning` `in-batch-negatives` `lora` `multimodal-embeddings` `embeddinggemma-2` `evaluation` `fact-checked`  
ใช้ในบท: ยังไม่ใช้ (เสนอ: 4.4, 8.1)

**โหมดรายงาน:** เรียบเรียงใหม่ด้วยคำของผู้จัดทำ ครบทุกประเด็นและตัวเลข (license มาตรฐานของ YouTube, caption อัตโนมัติ) ตัวเลขบางตัวจากสไลด์ / คำอธิบายคลิป · ตรวจข้อเท็จจริง 8 ข้อ (ยืนยัน 7 · บางส่วน 1)

**เสนอให้ใช้ (ยังไม่ได้แก้บท)**

- บท 4.4 ตารางมาจากการฝึก: แนวคิด "ไม่มีเวกเตอร์คำตอบที่ถูก บอกได้แค่อะไรควรใกล้อะไร" และ in-batch negatives (ดึงคู่เข้า ดันคู่อื่นออก) พร้อมกับดักข้อความซ้ำ (false negative)
- บท 8.1 Bi-Encoder: fine-tune ด้วยคู่ (คำถาม, ข้อความ) และ prompt ตอนฝึก = ตอนค้น
- ไอเดียบทใหม่: ผลข้างเคียงของ fine-tune (เรียนป้าย ไม่ใช่ทักษะทั่วไป; ข้อความทั่วไป −3.6 NanoBEIR)

**แก้จากต้นฉบับ:** ไม่พบจุดผิด · ASR ได้ยิน "Embedding Gemini 2" = EmbeddingGemma 2 · model card ระบุ encoder ภาพ / เสียงแยก แต่เข้าปริภูมิร่วม (ตรงกับสไลด์)

**เราคำนวณหรือเพิ่มเอง:** สูตร loss ของ MultipleNegativesRankingLoss (ความรู้ทั่วไป) และกราฟก่อน–หลังรวมทุกตัวเลขของคลิป

## yt:zduSFxRajkE — Andrej Karpathy, Let's build the GPT Tokenizer

tags: `tokenization` `bpe` `byte-level-bpe` `utf-8` `vocabulary` `pre-tokenization` `tiktoken` `special-tokens` `sentencepiece` `byte-fallback` `minbpe` `vocab-size` `llm-internals` `llm-quirks` `token-efficiency`  
ใช้ในบท: 3.3 (แหล่งหลักของบท 3.3 Tokenizer ของ GPT)

**โหมดรายงาน:** เรียบเรียงใหม่ด้วยคำของผู้จัดทำ ครบทุกประเด็นและตัวเลข แบ่งเป็นขั้นตอน 16 ส่วน (license มาตรฐานของ YouTube, caption อังกฤษอัตโนมัติ 3,422 บรรทัด) โค้ดในรายงานเขียนใหม่ให้ทำงานแบบเดียวกับในคลิป · ภาพนิ่ง 6 ภาพ + SVG วาดเอง 2 ภาพ · ผู้ตรวจอิสระเทียบกับ transcript และภาพ แก้ครบทุกข้อ · ไม่ได้เก็บ transcript ไว้ใน repo

**เอามาใช้**

- บท 3.3 Tokenizer ของ GPT (ใหม่): ข้อความ → ไบต์ UTF-8 (คลังตั้งต้น 256) → get_stats → merge ด้วยเลขใหม่ 256 + i ทำ k รอบ → encode ใช้กฎที่เลขน้อยสุดก่อน → decode ด้วย errors="replace" · ตัวเลขในหัวข้อ "สรุปจากแหล่ง": 533 code point → 616 ไบต์, (101, 32) = "e␣" 20 ครั้ง → 596, 20 merges 24,597 → 19,438 = 1.27 เท่า · regex ของ GPT-2 แบ่งก่อนรวม (ปุ่มในบท) · ภาษาอื่นใช้ token มากกว่า (เกาหลี 15 vs 5)

**เสนอให้ใช้ (ยังไม่ได้แก้บท)**

- บท 3.4 / 9.1: ขนาดคลังโผล่แค่ตาราง embedding กับ lm_head, ข้อแลกของคลังใหญ่ (คำนวณแพง, token หายากฝึกไม่พอ) · การเพิ่ม special token = เพิ่มแถว
- ไอเดียบทใหม่: ความแปลกของ LLM จาก tokenization (สะกดคำ, เลขคณิต, ช่องว่างท้าย, SolidGoldMagikarp = แถว embedding ที่ไม่เคยถูกฝึก) และ JSON 116 vs YAML 99 token

**แก้จากต้นฉบับ:** ไม่พบจุดผิดของผู้สอน · caption: "50,2 57" = 50,257, "1,24" = 1,024, merge ที่ 20 บนจอคือ (259, 256) → 275, "2556" = 256, "MBP" = minbpe (24,000 / 19,000 ผู้สอนพูดปัดเอง ค่าบนจอ 24,597 / 19,438)

**เราคำนวณหรือเพิ่มเอง:** ข้อความตัวอย่างของบท 3.3 (ไทย / อังกฤษ / ผสม) และตัวอย่าง `37_gpt_tokenizer` (แมวกินปลา … 121 ไบต์ → 58 token หลัง 6 รอบ = 2.09 เท่า) · ตัวอักษรไทยใช้ 3 ไบต์ ขึ้นต้น 224, 184 / 185 · สระบน ล่าง วรรณยุกต์ของไทยเป็น \p{M} regex ของ GPT-2 จึงตัดแยก · ชื่อเปเปอร์ MEGABYTE (คลิปไม่ได้เอ่ย)

## yt:izbifbq3-eI — Annie Sexton, Tokens vs Embeddings

tags: `tokens` `tokenization` `embeddings` `token-id` `token-vs-embedding` `vector-basics` `king-queen-analogy` `contextual-embeddings` `polysemy` `llm-internals` `next-token`  
ใช้ในบท: 4.7 (เสนอ: 3.4, 4.3, 4.5, 9.1, 9.2 และการแยกบท Token / Embedding)

**โหมดรายงาน:** เรียบเรียงใหม่ด้วยคำของผู้จัดทำ ครบทุกประเด็นและตัวเลข 7 ส่วน (license มาตรฐานของ YouTube, caption อังกฤษอัตโนมัติ 171 บรรทัด) · สไลด์ 7 ภาพ + SVG วาดเอง 2 ภาพ ·
ผู้ตรวจอิสระเทียบกับ transcript และสไลด์: 0 ต้องแก้ 5 ควรแก้ แก้ครบ · ไม่ยกเนื้อเพลงที่คลิปอ้างถึง · ไม่ได้เก็บ transcript ไว้ใน repo

**เสนอให้ใช้ (ยังไม่ได้แก้บท)**

- แยกบท 3 เป็นบท Token และบท Embedding: คลิปแยกสองคำนี้ชัดเจน (token = เลขตัวเดียว เป็นแค่ ID · embedding = เวกเตอร์ที่ตำแหน่งมีความหมาย)
- บท 3.4 Token ID: เลข token ใกล้กันไม่ได้แปลว่าคำเกี่ยวกัน · ประโยค fox → [464, 2068, 1051, 4414, 12898, 1168, 262, 13660, 3290, 13]
- บท 4.3 Embedding matrix: token ชี้ไปที่ embedding หนึ่งตัว · prompt → token → embedding → ทายส่วนถัดไป
- บท 4.5 Latent space: king (1, 9) − man (1, 0) = (0, 9) ไม่มีคำ · + woman (9, 0) = (9, 9) = queen (เลขจำนวนเต็ม คิดในใจได้)
- บท 9.1 / 9.2: embedding ตั้งต้นเป็นแค่จุดเริ่ม ปรับตามบริบท (train ฝึก / รถไฟ, she = Annie) · นิยาม "เวกเตอร์ที่ช่วยทายคำรอบข้างได้ดีที่สุดโดยเฉลี่ย" · embedding บอกตำแหน่งของความหมายเมื่อเทียบกัน

**แก้จากต้นฉบับ:** ไม่พบจุดผิดของตัวเลข · ภาพแบบง่ายที่ติดป้ายในรายงาน: คำ = token (จริงเป็น subword), "หลายร้อยมิติ" (LLM ใหญ่มักหลายพัน), ไม่บอก tokenizer ของเลขบนสไลด์ · ASR "09" / "99" = (0, 9) / (9, 9)

**เราคำนวณหรือเพิ่มเอง:** ภาพระนาบ 2 มิติของ king / queen / man / woman พร้อมการอ่านแกน (ความเป็นผู้หญิง / ความเป็นราชวงศ์) เป็นของผู้จัดทำ

## yt:Q6TBHDgWCDQ — Thu Vu, Learn Text Embeddings in 20 Minutes

tags: `embeddings` `word-embeddings` `one-hot` `bag-of-words` `n-gram` `tf-idf` `distributional-hypothesis` `word2vec` `cbow` `skip-gram` `contextual-embeddings` `static-embeddings` `latent-space` `cosine` `embedding-model-choice` `mteb` `fact-checked`  
ใช้ในบท: 4.7, 10.1 (เสนอ: 4.1, 4.2, 4.4, 4.5, 4.6, 5.4)

**โหมดรายงาน:** iwd (ลึก วิเคราะห์) เรียบเรียงใหม่ด้วยคำของผู้จัดทำ ครบทุกประเด็น 8 ส่วน (license มาตรฐานของ YouTube, caption อังกฤษอัตโนมัติ 483 บรรทัด) · ภาพจากคลิป 7 ภาพ + SVG วาดเอง 3 ภาพ ·
ตรวจข้อเท็จจริง 10 ข้อ (ยืนยัน 7 · บางส่วน 3 · ขัดแย้ง 0) · ผู้ตรวจอิสระ: 3 ต้องแก้ (นับผลตรวจผิด, เนื้อหาผู้จัดทำไม่ติดป้าย, อ้างว่าคลิปแนะนำ) แก้ครบ · ไม่ได้เก็บ transcript ไว้ใน repo

**เสนอให้ใช้ (ยังไม่ได้แก้บท)**

- บท 4.1 One-hot: คลังคำ 100,000 คำ = เวกเตอร์ 100,000 ช่องต่อคำ · ID และ one-hot "ไม่มีความหมาย"
- บท 4.2 Bag of words: "Her dog bit the owner" / "The dog bit her owner" ได้เวกเตอร์เดียวกัน · "Meal was bad" / "Food is awful" ความหมายเดียวกันแต่เวกเตอร์ต่างกัน · fine สองความหมาย · n-gram และ TF-IDF เป็นรุ่นปรับปรุง
- บท 4.4 ตารางมาจากการฝึก: CBOW กับ skip-gram (หน้าต่าง 3 คำ) · hidden layer ขนาด = ขนาด embedding · ตัวอย่างบวก/ลบ (apricot) · เก็บ weight เป็น embedding
- บท 4.5 Latent space: ค่าแต่ละช่องไม่มีความหมายในตัว ความสัมพันธ์สำคัญ · ลดมิติ 32 → 2 เห็นกลุ่ม king / queen และ cat / dog · ตัวอย่าง ong choy (แนวคิด distributional ยุค 1950s)
- บท 4.6 ใช้ model เดียวกัน: ใช้ model สำเร็จรูปผ่าน API (ada-002 1,536 มิติ) · Anthropic ไม่มี embedding model ของตัวเอง
- บท 5.4 เลือกวิธีวัด: เดโมรายงานเป็น cosine distance (Amsterdam 0.175 < Paris 0.224) ยิ่งน้อยยิ่งใกล้
- static กับ contextual embedding (bank): ทำแล้วเป็นบท 4.7

**แก้จากต้นฉบับ:** สไลด์ bag of words ที่ ~1:58 มีเลข 1 ผิดช่อง (ควรเป็น 0 1 0 0 0 1 1 1) · ตัวอย่าง ong choy มาจากตำรา Jurafsky & Martin (คลิปไม่อ้าง) · skip-gram เล่าแบบ softmax ทั้งคลังคำปนกับ negative sampling · ada-002 มีรุ่นใหม่กว่าแล้ว (text-embedding-3-small 1,536 / -3-large 3,072) · Google เรื่อง embedding ในการค้นหา ยืนยันบางส่วน

**เราคำนวณหรือเพิ่มเอง:** นับ bag of words ใหม่ · อ่านค่า cosine distance จากหน้าจอ notebook (0.17454…, 0.22435…) · ผังวงจรชีวิต, CBOW vs skip-gram, static vs contextual (SVG ของผู้จัดทำ)

## yt:wyWFLIlgmAw — AI Is All You Need, HNSW Explained from Scratch

tags: `hnsw` `nsw` `ann` `knn` `rag` `small-world` `skip-list` `efsearch` `ef-construction` `local-minimum` `best-first-search` `vector-search` `fact-checked`  
ใช้ในบท: ยังไม่ใช้ (เสนอ: 6.1, 7.1–7.4)

**โหมดรายงาน:** iwd (ลึก วิเคราะห์) เรียบเรียงใหม่ด้วยคำของผู้จัดทำ ครบทุกประเด็น 9 ส่วน (license มาตรฐานของ YouTube, caption อังกฤษอัตโนมัติ 1,193 บรรทัด) · ภาพหน้าโน้ตของผู้สอน 7 ภาพ + SVG วาดเอง 3 ภาพ ·
ตรวจข้อเท็จจริง 9 ข้อ (ยืนยัน 2 · บางส่วน 6 · ขัดแย้ง 1) · ผู้ตรวจอิสระ: 1 ต้องแก้ 6 ควรแก้ แก้ครบ · ไม่ได้เก็บ transcript ไว้ใน repo

**เสนอให้ใช้ (ยังไม่ได้แก้บท)**

- บท 6.1 ค้นทุกชิ้น: KNN เทียบทุกชิ้น vs ANN เมื่อเอกสารเป็นพันล้าน
- บท 7.1 ANN แบบกราฟชั้นเดียว: ตัวอย่าง NSW จุด A(1,1) … E(9,1) คำถาม Q(8.5,1.2) เส้นทาง A → C → E · การสร้างด้วย M = 2 · six degrees (50^6 = 15.6 พันล้าน)
- บท 7.2 / 7.3 HNSW และ beam: กราฟ 5 จุด A10 B6 C8 D7 E2 · ef = 1 และ 2 หยุดที่ B (6) ส่วน ef = 5 เจอ E (2) เป็นตัวอย่าง local minimum ที่พร้อมใช้ · ตัวอย่างค้นสามชั้น N1(30) → … → N10(5)
- บท 7.4 HNSW สร้างชั้นด้วยการโยนเหรียญ: skip list p = 1/2 · P(ชั้นสูงสุด = l) = (1/2)^(l+1) กับ P(อยู่ในชั้น l) = p^l · HNSW p = 1/M, level = floor(−ln(U)/ln(M)) · Mmax = M, Mmax0 = 2M

**แก้จากต้นฉบับ:** six degrees ไม่ได้มาจาก game theory (Karinthy 1929, Milgram 1967) · การค้นเป็น best-first ไม่ใช่ breadth-first · ef = 1 / 2 ผู้สอนพูดว่าได้ D (7) แต่หน้าโน้ตและ algorithm ได้ B (6) · ระยะถึง Q ของ A–D บนหน้าโน้ตเป็นระยะจาก E · เหตุผลของ mL = 1/ln(M) ในบทความคือลดการซ้อนกันของเพื่อนบ้านระหว่างชั้น · ตาราง skip list บนหน้าโน้ตเขียน 19 ซ้ำแทน 25

**เราคำนวณหรือเพิ่มเอง:** ระยะจริงถึง Q (A 7.50 · B 6.55 · C 3.51 · D 2.62 · E 0.54) · รัน search_layer กับตัวอย่าง 5 จุด · โค้ด search_layer ใน _claude.md · ผังเส้นทางค้น, ระนาบ NSW, จำนวนจุดต่อชั้น (SVG ของผู้จัดทำ)

## yt:YmLp8qe87A0 — Syntax (CJ), LLMs Explained: Tokens, Embeddings, Transformers and More

tags: `llm-internals` `history-of-ai` `chatbot` `eliza` `neural-network` `xor` `backpropagation` `tokenization` `bpe` `embeddings` `word2vec` `skip-gram` `transformer` `attention` `multi-head-attention` `positional-encoding` `softmax` `temperature` `top-p` `next-token` `autoregressive` `context-window` `fine-tuning` `rlhf` `tool-calling` `fact-checked`  
ใช้ในบท: 10.1–10.4 (เสนอ: 3.2, 4.4, 4.5, 4.7, 9.1, 9.2)

**โหมดรายงาน:** iwd (ลึก วิเคราะห์) เรียบเรียงใหม่ด้วยคำของผู้จัดทำ ครบทุกประเด็น 17 ส่วน (license มาตรฐานของ YouTube, caption อังกฤษอัตโนมัติ 1,577 บรรทัด) · ภาพจากคลิป 9 ภาพ + SVG วาดเอง 2 ภาพ ·
ตรวจข้อเท็จจริง 33 ข้อ รวมการอ่านโค้ดของผู้สอนใน repo (ยืนยัน 17 · บางส่วน 10 · ไม่พบ 2 · ขัดแย้ง 4) · ผู้ตรวจอิสระ: 1 ต้องแก้ 8 ควรแก้ 7 ข้อย่อย แก้ครบ · ไม่ได้เก็บ transcript ไว้ใน repo

**เสนอให้ใช้ (ยังไม่ได้แก้บท)**

- บท 3.2 BPE: ตัวอย่าง "the cat sat on the mat" รวม 7 ขั้น (a+t → at ×3, t+h → th ×2, th+e → the ×2, c+at, s+at, o+n, m+at) ได้ 6 token · จำกัดการรวม 3 ครั้งได้ at กับ the · regex แบ่งคำก่อน เพราะ BPE ไม่รวมข้ามคำ
- บท 4.4 ตารางมาจากการฝึก: skip-gram ดึงคู่ที่อยู่ใกล้กันให้ใกล้ ผลักคู่ที่ไม่เคยอยู่ด้วยกันให้ห่าง · corpus ประโยคคู่ขนาน king / queen / prince / princess
- บท 4.5 Latent space: king − man + woman = queen และ queen − woman + man = king, prince − boy + girl = princess, kitten − cat + dog = puppy
- บท 4.7 Static กับ contextual: ประโยค "Bank of the river was muddy" กับ "I went to the bank to deposit money" (self-attention ให้เวกเตอร์ต่างกัน)
- บท 9.1 / 9.2 LLM input และ attention: query / key / value, multi-head, feed forward, ซ้อน block · positional embedding
- ไอเดียหัวข้อใหม่ (`WIP202610023`): "model คือไฟล์ weight" (XOR 3 กับ 17 ตัวเลข, สูตรนับพารามิเตอร์) · softmax + temperature + top-p (ตัวอย่างความน่าจะเป็นบนจอ there 0.30 …) · วงวน autoregressive + context window

**แก้จากต้นฉบับ:** top-p 0.2 ไม่ใช่ "token บนสุด 20%" แต่เป็นชุดที่ความน่าจะเป็นรวมถึง 0.2 · config บนจอ 6 ชั้นมี 102,792 พารามิเตอร์ (52,000 ตรงกับแบบ 2 ชั้น 51,976) · repo: MAX_MERGES = 1000 (พูดว่า 10,000) และหน้าต่าง word2vec ค่าเริ่มต้น 2 สูงสุด 5 (พูดว่าห้าหรือหก) · cosine 0 = ตั้งฉาก ค่าต่ำสุด −1 · temperature 0 ไม่ deterministic ในระบบจริง · gpt-oss-120b = 117B · "ชั้นท้ายจับการให้เหตุผล" ไม่มีหลักฐาน · Dartmouth: คำว่า AI มาจากข้อเสนอปี 1955 · ชื่อ Alexandra Birch

**เราคำนวณหรือเพิ่มเอง:** สูตรนับพารามิเตอร์จาก weight-layout.ts (2VD + V + CD + 2D + L(4D² + 2DF + 9D + F)) · ตัวอย่าง top-p จากค่าความน่าจะเป็นบนจอ · อ่านค่าบนจอ (merge 7 ขั้น, ความคล้าย 0.92 / 0.73 …, analogy 0.84 / 0.86, config) · ผังวงจรสร้าง token และเส้นเวลา (SVG ของผู้จัดทำ)

## yt:114i2Kz-LZA — Stanford Online, CME295 Lecture 1 - Transformers

tags: `transformer` `self-attention` `attention` `query-key-value` `scaled-dot-product` `multi-head-attention` `positional-encoding` `encoder-decoder` `cross-attention` `masked-attention` `feed-forward` `residual` `layer-norm` `label-smoothing` `tokenization` `bpe` `word2vec` `rnn` `lstm` `stanford` `history-of-ai` `fact-checked`  
ใช้ในบท: 10.1–10.4 (เสนอ: 3.1, 3.2, 4.1, 4.4, 4.7, 9.1, 9.2)

**โหมดรายงาน:** iwd (ลึก วิเคราะห์) เรียบเรียงใหม่ด้วยคำของผู้จัดทำ ครบทุกประเด็น 13 ส่วน (license มาตรฐานของ YouTube, คำบรรยายอังกฤษที่ทำด้วยคน 1,768 บรรทัด) · สไลด์ 9 ภาพ + SVG วาดเอง 2 ภาพ ·
ตรวจข้อเท็จจริง 16 ข้อ (ยืนยัน 12 · บางส่วน 4 · ขัดแย้ง 0) · ผู้ตรวจอิสระ 2 คน (แบ่งครึ่งคาบ): 2 ต้องแก้ 18 ควรแก้ 15 ข้อย่อย แก้ครบ · ไม่ได้เก็บ transcript ไว้ใน repo

**เสนอให้ใช้ (ยังไม่ได้แก้บท)**

- บท 10 LLM - Stanford (Transformer ทฤษฎี) ทำแล้วเป็น 10.1–10.4 จากแหล่งนี้: ลำดับเหตุผล one-hot → word2vec → RNN / LSTM → attention → self-attention · สูตร softmax(QKᵀ/√d_k)V พร้อมขนาดเมทริกซ์ · position แบบ sin/cos (เปรียบนาฬิกา) · multi-head + W_O · residual, layer norm, mask · encoder / decoder / cross-attention
- บท 3.1 / 3.2: ข้อดีข้อเสียของ token ระดับคำ ตัวอักษร คำย่อย · token พิเศษ [UNK] [BOS] [EOS] padding · คลังคำ LLM หลักแสน
- บท 4.1 One-hot: ทุกคู่ตั้งฉาก (teddy bear, soft, book) · บท 4.4: word2vec ทายคำถัดไป V = 6, hidden (0.2, 0.9), p(cute) = 0.4
- บท 4.7: bank ริมแม่น้ำ / ธนาคาร และลำดับคำ "the child is hugging the Teddy bear" · บท 9.1 / 9.2: position embedding, query / key / value

**แก้จากต้นฉบับ:** ไม่พบข้อผิด · "พารามิเตอร์ส่วนใหญ่อยู่ใน feed forward" จริงในระดับ encoder layer แต่ทั้ง model base ราว 39% · ไม่พบหลักฐานเรื่อง tweet ของ ChatGPT ที่พิมพ์ผิด · ค่า h = 8, d_model = 512, d_ff = 2048, label smoothing 0.1 มาจากบทความ ผู้สอนไม่ได้บอก

**เราคำนวณหรือเพิ่มเอง:** สัดส่วนพารามิเตอร์ feed forward กับ attention จากค่าในบทความ · โค้ด self-attention พร้อม mask ใน _claude.md · ผังสถาปัตยกรรมและเส้นเวลา (SVG ของผู้จัดทำ)

## yt:4JofSJIrjwU — Tech With Tim, How to Fine-Tune any AI Model Locally (Unsloth Studio)

tags: `fine-tuning` `lora` `qlora` `quantization` `nf4` `unsloth` `unsloth-studio` `llama-3-1` `synthetic-data` `data-recipes` `instruction-tuning` `alpaca-format` `epochs` `learning-rate` `training-loss` `overfitting` `gguf` `ollama` `rag` `rag-vs-fine-tuning` `vram` `local-llm` `fact-checked`  
ใช้ในบท: ยังไม่ใช้ (เสนอ: 1.5, 4.4, 6.3 และหัวข้อ RAG ที่เสนอไว้ใน WIP202610036)

**โหมดรายงาน:** iwd (ลึก วิเคราะห์) เรียบเรียงใหม่ด้วยคำของผู้จัดทำ ครบทุกประเด็น 15 ส่วน (license มาตรฐานของ YouTube, คำบรรยายอังกฤษ en-CA ที่ทำด้วยคน 905 บรรทัด) · ภาพจากคลิป 9 ภาพ + SVG วาดเอง 2 ภาพ ·
ตรวจข้อเท็จจริง 15 ข้อ (ยืนยัน 4 · บางส่วน 9 · ไม่พบ 0 · ขัดแย้ง 2) · ผู้ตรวจอิสระ 2 คน (แบ่งครึ่ง): 5 ต้องแก้ 20 ควรแก้ 16 ข้อย่อย แก้ครบ · ตัดโฆษณา HeyGen (~5:40–7:03) · ไม่ได้เก็บ transcript ไว้ใน repo

**เสนอให้ใช้ (ยังไม่ได้แก้บท)**

- บท 1.5 Matrix: LoRA คือ W + B·A ที่ A ย่อ B ขยายกลับ · ตัวอย่างนับพารามิเตอร์ 4096×16 + 16×4096 = 131,072 เทียบกับ 4096×4096 ≈ 16.8 ล้าน · rank 16 บน Llama 3.1 8B ≈ 41.9 ล้าน ≈ 0.52%
- บท 6.3 Binary / quantization: เลขหน่วยความจำ 8.03 พันล้าน × 2 ไบต์ ≈ 16 GB → 4-bit ราว 4–5.6 GB (embedding กับชั้น output มักเก็บ 16-bit) · ไฟล์จริง 5.98 GB
- บท 4.4 ตารางมาจากการฝึก: กราฟ loss ที่ลดลง, learning rate (warm-up แล้วลด), epoch และ overfitting (loss ต่ำกว่า 0.2 ตามเอกสาร Unsloth)
- หัวข้อ RAG (`WIP202610036`): ตาราง prompting / RAG / fine-tuning และผลงานวิจัย Ovadia 2023, Gekhman 2024 ว่า RAG ใส่ความรู้ใหม่ได้ดีกว่า fine-tuning แบบ unsupervised

**แก้จากต้นฉบับ:** Unsloth ไม่ได้สร้างโดยวิศวกร NVIDIA (ผู้ก่อตั้ง Daniel และ Michael Han; Data Recipes ใช้ NVIDIA NeMo Data Designer) · model ที่ฝึกแล้วตอบ alone = sama ผิด (ที่ถูก sendiri / sendirian) · ตาราง VRAM ของ Unsloth: 8B QLoRA 6 GB, LoRA 22 GB (สไลด์ ~10 / ~20 GB) · loss 0.0582 ของ checkpoint บนหน้า Export ต่ำจนเอกสาร Unsloth ถือว่าน่าจะ overfitting · Unsloth เขียนว่า fine-tuning ทำได้ "mostly" ทุกอย่างที่ RAG ทำ ไม่ใช่ "ทั้งหมด"

**เราคำนวณหรือเพิ่มเอง:** จำนวนพารามิเตอร์ LoRA และขนาด adapter (≈ 84 MB) · หน่วยความจำ 16-bit กับ 4-bit · ผัง workflow และกราฟแท่งหน่วยความจำ (SVG ของผู้จัดทำ) · โค้ด Unsloth แบบ Python และสคริปต์ตรวจคำศัพท์ใน _claude.md

## yt:5YJGDElbCDY — Prompt Engineering, Google's GPT-3 Moment for Databases & Spreadsheets (TabFM)

tags: `tabfm` `tabular-foundation-model` `zero-shot` `in-context-learning` `row-compression` `synthetic-data` `tabfm-auto` `agents` `target-leakage` `postgres` `non-commercial-license` `fact-checked`  
ใช้ในบท: ยังไม่ใช้ (เสนอ: 4.5, 10.2 เป็นกล่องข้างบท; LLM manual G1, G5, G7)

**โหมดรายงาน:** iwd (ลึก วิเคราะห์) เรียบเรียงใหม่ด้วยคำของผู้จัดทำ ครบทุกประเด็น 9 ส่วน (license มาตรฐานของ YouTube; คำบรรยายอังกฤษอัตโนมัติ; ตัดช่วงโฆษณาของผู้สนับสนุน (Neon) แล้วแจ้งไว้ท้ายรายงาน) · ภาพจากคลิป 6 ภาพ + SVG วาดเอง 2 ภาพ ·
ตรวจข้อเท็จจริง 13 ข้อด้วยการค้นเว็บ (ยืนยัน 8 · บางส่วน 2 · ไม่พบ 2 · ขัดแย้ง 0 · ยังไม่ได้ตรวจ 1) · สร้างโดย Sonnet worker · ผู้ตรวจอิสระ (Opus): PASS หลังแก้ข้อที่พบ · ไม่ได้เก็บ transcript ไว้ใน repo

**เสนอให้ใช้ (ยังไม่ได้แก้บท)**

- ไม่ใช้กับหน้า Q&A และไลบรารีค้นของ ZVect: TabFM ทำงานกับตาราง (แถว × คอลัมน์) ไม่ใช่ตัวฝังข้อความ น้ำหนักเป็น non-commercial และ model ใหญ่เกินกว่าจะส่งไปกับเว็บแบบ zero-dependency
- กล่องข้างบท 4.5 Latent space ("นอกเหนือจากข้อความ"): row compression คือบีบแต่ละแถวของตารางเป็นเวกเตอร์ตัวเดียว แล้วให้ Transformer ทำ in-context learning บนเวกเตอร์เหล่านั้น เป็นตัวอย่างที่ชัดของการฝังสิ่งที่ไม่ใช่ข้อความ
- กล่องข้างบท 10.2 Self-attention: alternating row / column attention คือ attention บนตาราง 2 มิติ (ต่อยอดจาก CME295)
- LLM manual G1 pre-training: ฝึกด้วยตารางสังเคราะห์จาก random causal graph ล้วน ๆ เป็นตัวอย่าง pre-training ที่ไม่ใช้ข้อมูลจริงเลย · G7 agents: LLM agent ครอบ model ที่แช่แข็งไว้ (TabFM-Auto) · G5 evaluation: target leakage กับกฎวันตัด (ฝึกบน branch ที่ restore กลับไปก่อนช่วงทำนาย) · ตัวอย่างการอ่าน license (โค้ด Apache-2.0 แต่น้ำหนัก non-commercial)
- คำเตือนที่ควรใส่เมื่ออ้าง: "zero training" ยังมีงบ context (ค่าเริ่มต้น 500 features / 100 context rows, สูงสุด 10 classes)

**แก้จากต้นฉบับ:** ไม่พบข้อผิดใหญ่ ข้อที่ควรเข้าใจให้ตรง: AUC 0.60 เทียบ 0.52 และ 0.50 บนสไลด์เป็นข้อมูลสังเคราะห์ของผู้พูดเอง ไม่ใช่ benchmark · "branch ได้ในราว 1 วินาที" เอกสารบอกแค่ "instantly" ไม่มีตัวเลข · ไม่พบโค้ด TabFM-Auto สาธารณะ (ตามที่ผู้พูดว่า) · ASR "TabFusion (Auto)" = TabFM(-Auto)

**เราคำนวณหรือเพิ่มเอง:** ค่าเริ่มต้น (500 features, 100 context rows, 10 classes) และขนาด model (ราว 400 ล้านตาม paper กับ weights 1.1.0; ราว 1.64 พันล้านสำหรับ weights 1.0.x) มาจากการตรวจ README / Hugging Face ไม่ได้อยู่ในคลิป · ผัง flow และกราฟแท่ง (SVG ของผู้จัดทำ)

## yt:8vW6gi5vRes — Dr. Data Science, TabFM Explained: Google's New Foundation Model for Tabular Data

tags: `tabfm` `tabular-foundation-model` `in-context-learning` `row-compression` `column-attention` `rmsnorm` `adult-income` `f1` `class-imbalance` `evaluation` `parameter-count` `fact-checked`  
ใช้ในบท: ยังไม่ใช้ (เสนอ: 10.2, 10.4; LLM manual G3, G5)

**โหมดรายงาน:** iwd (ลึก วิเคราะห์) เรียบเรียงใหม่ด้วยคำของผู้จัดทำ ครบทุกประเด็น 8 ส่วน (license มาตรฐานของ YouTube; คำบรรยายอังกฤษอัตโนมัติ; ตัดผู้พูดออกจากภาพสไลด์) · ภาพจากคลิป 4 ภาพ + SVG วาดเอง 3 ภาพ ·
ตรวจข้อเท็จจริง 13 ข้อด้วยการค้นเว็บ (ยืนยัน 6 · บางส่วน 4 · ไม่พบ 0 · ขัดแย้ง 2 · ยังไม่ได้ตรวจ 1) · สร้างโดย Sonnet worker · ผู้ตรวจอิสระ (Opus): PASS หลังแก้ข้อที่พบ · ไม่ได้เก็บ transcript ไว้ใน repo

**เสนอให้ใช้ (ยังไม่ได้แก้บท)**

- บท 10.2 Self-attention (กล่องข้างบท "attention บนตาราง"): attention แบบสลับแถว / คอลัมน์, เหตุผลที่คอลัมน์ต้อง permutation invariant, row compression = หนึ่งเวกเตอร์ต่อแถว; ใช้ภาพจากบล็อกเป็นแค่คำอธิบาย แล้ววาด SVG เอง
- บท 10.4 Transformer block / LLM manual G3: ICL คือ "dataset เป็น prompt" ไม่มีการปรับน้ำหนัก (แนวเดียวกับ few-shot prompting)
- LLM manual G5 evaluation: ข้อมูลไม่สมดุลทำให้ accuracy หลอกตา (majority class ราว 76%) ใช้ precision / recall / F1; เป็นตัวอย่างงานจริงสำหรับกล่อง metric
- เป็นคลิปที่เหมาะกับบท Transformer มากที่สุดในชุด TabFM 3 คลิปแรก แต่ห้ามลอกตัวเลขโดยไม่ใส่กล่องแก้

**แก้จากต้นฉบับ:** จำนวนพารามิเตอร์ "ราว 1.64 พันล้าน" ถูกสำหรับ weights v1.0.x (ไฟล์ classification 6.56 GB ที่ fp32) แต่ paper และ v1.1.0 (ไฟล์ 821 MB) คือราว 400 ล้าน ต้องบอกรุ่นเสมอ · "Google ไม่เปิดเผยวิธีสร้างข้อมูลฝึก" ไม่ตรงกับบล็อกที่บอกว่าเป็นตารางสังเคราะห์จาก structural causal model · "นำตัวอย่างไปเทียบกับ pre-training data ทั้งหมด" ไม่ใช่: context ของ ICL คือแถวที่ผู้ใช้ส่งเท่านั้น · "train 5–10 นาที" ไม่มีการ train เวลานั้นคือ fit + predict (ไม่บอกขนาด test set) · "accuracy เกิน 80%" จริงเฉพาะที่ 500 แถว ส่วน majority class ราว 76% ทำให้ 0.780 ที่ 50 แถวใกล้ baseline

**เราคำนวณหรือเพิ่มเอง:** ตัวเลข Adult Income ที่อ่านจากสไลด์: accuracy 0.780 / 0.804 / 0.816 / 0.837 และ F1 0.413 / 0.564 / 0.571 / 0.636 ที่ 50 / 100 / 200 / 500 แถว; เวลา A100 293.65 → 681.63 วินาที (fit + predict) · โครงสร้างที่อ่านจาก module ที่พิมพ์ในคลิป (cell embedder 256 มิติ, column embedder แบบ SetTransformer, RMSNorm, decoder MLP) · ผัง flow และกราฟแท่ง F1 / เวลา (SVG ของผู้จัดทำ)

## yt:XwYPRLMLcNs — AI with Surya, Google Just Released TabFM and It Breaks Everything We Know About ML

tags: `tabfm` `tabular-foundation-model` `zero-shot` `in-context-learning` `column-attention` `row-compression` `xgboost` `frozen-weights` `simulated-ui` `attention-is-not-explanation` `critical-reading` `fact-checked`  
ใช้ในบท: ยังไม่ใช้ (เสนอ: 10.2 กล่องเตือน)

**โหมดรายงาน:** iwd (ลึก วิเคราะห์) เรียบเรียงใหม่ด้วยคำของผู้จัดทำ ครบทุกประเด็น 7 ส่วน (license มาตรฐานของ YouTube; คำบรรยายอังกฤษอัตโนมัติ; ภาพหน้าจอ UI ตัดผู้พูดออก) · ภาพจากคลิป 5 ภาพ + SVG วาดเอง 1 ภาพ ·
ตรวจข้อเท็จจริง 11 ข้อด้วยการค้นเว็บ (ยืนยัน 3 · บางส่วน 5 · ไม่พบ 0 · ขัดแย้ง 1 · ยังไม่ได้ตรวจ 2) · สร้างโดย Sonnet worker · ผู้ตรวจอิสระ (Opus): PASS หลังแก้ข้อที่พบ · ไม่ได้เก็บ transcript ไว้ใน repo

**เสนอให้ใช้ (ยังไม่ได้แก้บท)**

- บท 10.2 Self-attention: กล่องเตือน "heat map ของ attention ไม่ใช่คำอธิบาย" พร้อมการทดสอบว่าแถว softmax ต้องรวมเป็น 1 และ Q·K ตารางเดียวอธิบาย model หลายหัว 24 block ไม่ได้
- ประโยคเดียวสำหรับ manual: "ICL = prompt คือ dataset"; โค้ด 6 บรรทัดเป็นตัวอย่างของ "ไม่มีขั้นฝึก" (ต้องระบุรุ่น เพราะ API ของ 1.0.0 กับ 1.1.0 ต่างกัน)
- เป็นแหล่งที่อ่อนที่สุดของชุด (น้ำเสียงโฆษณา UI จำลอง) ใช้เป็นตัวอย่าง "อ่านอย่างระวัง" ได้ดี ไม่ใช้เป็นแหล่งข้อเท็จจริง; ไม่เกี่ยวกับหน้า Q&A

**แก้จากต้นฉบับ:** UI "Google TabFM Engine" เป็นของผู้พูดเอง ไม่ใช่ของ Google และแท็บ scaling curve ติดป้าย "Simulated - Illustrative" · "cross-attention matrix" ที่แสดงแถวแรกรวม 4.571 (แถว softmax ต้องรวม 1) จึงใช้เป็นคำอธิบายผลทำนายไม่ได้ · 18.4 ms เป็นเวลาใน sandbox ของเขา · "ไม่ต้องรอเปิด GPU" ได้เพียงบางส่วน (README รองรับ CPU หรือ GPU, Google ไม่ให้เวลา CPU) · "ชนะ XGBoost ที่จูนหนัก": บล็อกเขียนว่า "heavily tuned supervised algorithms" ไม่ระบุ XGBoost · โค้ดบนสไลด์ใช้ API ของ 1.0.0 (`tabfm_v1_0_0.load()`) · ในเดโม คำถามที่ t3 ทำนายความเสี่ยงสูงแต่แถว context ที่ attention สูงสุดเป็นความเสี่ยงต่ำ · ASR "Low Res" = low risk

**เราคำนวณหรือเพิ่มเอง:** ตรวจโครงสร้างสามขั้น (8 CLS tokens, ICL 24 blocks, SwiGLU) กับบล็อกและ model card 1.0.0 · ผัง flow (SVG ของผู้จัดทำ)

## yt:78_sbNNJe3Q — Omar Kamal, TabFM: Google's Zero-Shot Tabular AI (no training, no tuning!)

tags: `tabfm` `tabular-foundation-model` `zero-shot` `in-context-learning` `tabpfn` `tabicl` `tabarena` `structural-causal-model` `synthetic-data` `ensemble` `scikit-learn` `titanic` `bike-sharing` `fact-checked`  
ใช้ในบท: ยังไม่ใช้ (เสนอ: 10.2, 10.4; LLM manual G3)

**โหมดรายงาน:** iwd (ลึก วิเคราะห์) เรียบเรียงใหม่ด้วยคำของผู้จัดทำ ครบทุกประเด็น 10 ส่วน (license มาตรฐานของ YouTube; คำบรรยายอังกฤษอัตโนมัติ; ไม่ใช่คลิปของ Google (คำอธิบายเขียนว่า "Not an officially supported Google product")) · ภาพจากคลิป 7 ภาพ + SVG วาดเอง 3 ภาพ ·
ตรวจข้อเท็จจริง 17 ข้อด้วยการค้นเว็บ (ยืนยัน 11 · บางส่วน 2 · ไม่พบ 4 · ขัดแย้ง 0) · สร้างโดย Sonnet worker · ผู้ตรวจอิสระ (Opus): PASS หลังแก้ข้อที่พบ · ไม่ได้เก็บ transcript ไว้ใน repo

**เสนอให้ใช้ (ยังไม่ได้แก้บท)**

- คลิปอธิบาย TabFM ได้ตรงและสะอาดที่สุดของชุด: ICL บนตาราง, สถาปัตยกรรม 3 ขั้น, สูตร ensemble, โค้ด scikit-learn, ข้อจำกัด
- กล่องข้างบท 10.2 / 10.4 (หน้า Transformer): "แถว → เวกเตอร์หนึ่งตัว" (row compression) และ in-context learning โดยไม่ปรับน้ำหนัก
- LLM manual G3 inference: context = ข้อมูลฝึก ดังนั้นต้นทุนตอนทำนายโตตามความยาว context
- ข้อจำกัดที่ต้องบอกตรง ๆ: TabFM ใช้กับตาราง ไม่ใช่ข้อความ จึงแทนระบบค้น (BM25 + TF-IDF/SVD + RRF) ของหน้า Q&A ไม่ได้ จุดเชื่อมเดียวคือ SVD (TabFM-Ensemble เพิ่มองค์ประกอบ SVD) และแนวคิด "embedding ของหนึ่งแถว"

**แก้จากต้นฉบับ:** คำอธิบายคลิปเขียนว่า "TabFM is Apache-2.0" จริงเฉพาะโค้ด น้ำหนักเริ่มต้นเป็น non-commercial (คลิปไม่ได้บอก) · "หน่วยวินาทีบน GPU" และ "RTX 4090" ไม่พบหลักฐาน; รายละเอียดการ preprocess (ตรวจวันที่อัตโนมัติ, impute, ตัด outlier) ไม่พบใน README · ASR "Tab SEAL" / "TabSEO" = TabICL, "Tabularina" = TabArena

**เราคำนวณหรือเพิ่มเอง:** ตัวเลขบนสไลด์เป็นผลรันครั้งเดียวของผู้พูดเอง ไม่ใช่ benchmark: Titanic accuracy 0.803 / 0.789 / 0.776 และ AUC 0.852 / 0.802 / 0.842 (TabFM / HistGB / LogReg); Bike Sharing RMSE 562 / 667 / 814 และ R2 0.918 / 0.884 / 0.828 (TabFM / HistGB / Ridge) · ผัง flow และกราฟ (SVG ของผู้จัดทำ)

## yt:tYO_bgB4Ti0 — MASTER 2 SISE DATA SCIENCE, TabFM – Tabular Foundation Model pour le classement (ภาษาฝรั่งเศส)

tags: `tabfm` `tabular-foundation-model` `jax` `pytorch` `tabicl` `spam` `spambase` `confusion-matrix` `f1` `inference-cost` `fact-checked`  
ใช้ในบท: ยังไม่ใช้ (เสนอ: LLM manual G3)

**โหมดรายงาน:** iwd (ลึก วิเคราะห์) เรียบเรียงใหม่ด้วยคำของผู้จัดทำ ครบทุกประเด็น 10 ส่วน (license มาตรฐานของ YouTube; คำบรรยายฝรั่งเศสอัตโนมัติ (เสียงต้นฉบับ) แปลเป็นรายงานภาษาไทย) · ภาพจากคลิป 4 ภาพ + SVG วาดเอง 2 ภาพ ·
ตรวจข้อเท็จจริง 15 ข้อด้วยการค้นเว็บ (ยืนยัน 10 · บางส่วน 2 · ไม่พบ 3 · ขัดแย้ง 0) · สร้างโดย Sonnet worker · ผู้ตรวจอิสระ (Opus): PASS หลังแก้ข้อที่พบ · ไม่ได้เก็บ transcript ไว้ใน repo

**เสนอให้ใช้ (ยังไม่ได้แก้บท)**

- LLM manual G3 inference: ตัวอย่างวัดจริงว่าต้นทุนจ่ายตอน predict ไม่ใช่ตอน fit (context ถูกอ่านซ้ำทุกครั้ง): 100 แถวฝึก / 4,501 แถวทดสอบ บน CPU ใช้ fit เป็นวินาที แต่ predict ราว 1.5 ชั่วโมง (การรันครั้งเดียวของผู้สอน)
- ข้อสังเกต "ข้อมูลฝึกน้อยก็ใช้ได้เพราะ context คือชุดฝึก" ใช้เทียบกับ G9 chunking ได้ในเชิงแนวคิด
- ไม่มีอะไรสำหรับหน้า Q&A ที่ค้นด้วยข้อความ

**แก้จากต้นฉบับ:** ผู้สอนติดตั้ง 1.0.1 จาก GitHub (PyPI มีแค่ 1.0.0 ในวันนั้น) แล้ว backend PyTorch ยังล้มเหลวโดยไม่ทราบสาเหตุ (changelog บอกว่า 1.0.1 แก้การโหลด checkpoint ของ PyTorch) ส่วน JAX ใช้ได้ · ASR ได้ยิน F1 เป็น "081 82" ผิด ค่าที่ถูกอ่านจากจอ · "TabFM-Ensemble ยังไม่มีในตอนนั้น" ได้เพียงบางส่วน (README ไม่มี class ensemble, บล็อกอธิบาย TabFM-Ensemble เป็นชุดประเมิน) · คำอธิบายคลิปว่า 55 features แต่ Spambase มี 57

**เราคำนวณหรือเพิ่มเอง:** ตัวเลขที่อ่านจากจอ (ไม่ได้พูด): TabFM F1 0.8858 (confusion matrix [[2643, 78], [303, 1477]]), TabICL F1 0.8883 ([[2635, 86], [289, 1491]]); 100 + 4,501 = 4,601 แถว = UCI Spambase · Elo ของบล็อก (classification) ที่อ่านจากภาพ: TabFM-Ensemble 1815, TabFM 1727, AutoGluon 1.5 extreme 1666, TabPFN-3 1639, TabICLv2 1576 · ผัง flow (SVG ของผู้จัดทำ)

## yt:Xym8FGDcl34 — PyData, Hands-On with Tabular Foundation Models (Nicolas Makaroff, PyData London 26; ไม่ใช่เรื่อง TabFM)

tags: `tabular-foundation-model` `tabpfn` `tabicl` `in-context-learning` `synthetic-prior` `benchmarking` `bootstrap-ci` `shap` `gradient-boosting` `critical-reading` `fact-checked`  
ใช้ในบท: ยังไม่ใช้ (เสนอ: กล่องเทียบ model อย่างยุติธรรม; LLM manual G5)

**โหมดรายงาน:** iwd (ลึก วิเคราะห์) เรียบเรียงใหม่ด้วยคำของผู้จัดทำ ครบทุกประเด็น 13 ส่วน (license มาตรฐานของ YouTube; คำบรรยายอังกฤษอัตโนมัติ; ภาพสไลด์และ notebook ตัดกล้องผู้พูดออก; ตัดช่วงคูปอง / QR ออกโดยตั้งใจ) · ภาพจากคลิป 6 ภาพ + SVG วาดเอง 2 ภาพ ·
ตรวจข้อเท็จจริง 19 ข้อด้วยการค้นเว็บ (ยืนยัน 8 · บางส่วน 7 · ไม่พบ 3 · ขัดแย้ง 1) · สร้างโดย Sonnet worker · ผู้ตรวจอิสระ (Opus): PASS หลังแก้ข้อที่พบ · ไม่ได้เก็บ transcript ไว้ใน repo

**เสนอให้ใช้ (ยังไม่ได้แก้บท)**

- ไม่ใช่เรื่อง TabFM (เผยแพร่ก่อนบล็อก TabFM 11 วัน, ไม่มี TabFM ในสไลด์ใดเลย) เป็นเวิร์กช็อป tabular foundation model ทั่วไปของวิทยากร Neuralk (ปารีส) 2 คน: TabPFN / TabICL / Seldon ของบริษัท; เป็นพื้นหลัง: TFM คืออะไร, 3 เสาหลัก (prior, architecture, context), ข้อจำกัดที่พูดตรง ๆ
- LLM manual G5 evaluation (และกล่องในบท 10): โปรโตคอลเทียบ model อย่างยุติธรรมจาก notebook 2 (หลาย seed, bootstrap CI, เทียบรายคู่ต่อ fold, ไม่ใช้ accuracy กับข้อมูลไม่สมดุล) ใช้กับการเทียบคุณภาพการค้นของเราเอง (BM25 กับ SVD กับ RRF) ได้ด้วย
- ตัวอย่างอ่านอย่างวิพากษ์: สไลด์ที่ขัดกับสไลด์อีกแผ่นของผู้พูดเอง (เพดาน 10k แถว vs 1M แถว) และตัวเลขของ vendor
- "dataset คือ prompt" และ "fit ไม่ทำอะไร ต้นทุนจ่ายตอน predict" สนับสนุนประเด็น G3 เดียวกับคลิป TabFM อื่น; ไม่มีอะไรสำหรับหน้า Q&A

**แก้จากต้นฉบับ:** ห้ามลอกสไลด์ "open-weights TFM รับ context ราว 10,000 แถว": ขัดกับสไลด์ landscape ของผู้พูดเอง (TabICL v2 "1M-row ICL"), abstract ของ TabICLv2 และ changelog ของ Prior Labs (TabPFN-3 ถึง 1M แถว) · win rate ราว 90% และ API 1M แถว / 1,000 classes เป็นคำกล่าวอ้างของ vendor ตรวจไม่ได้ · "prior สังเคราะห์ล้วนจึงไม่มี leakage" จริงกับตระกูล TabPFN แต่ไม่ใช่ model ที่ใช้ข้อมูลจริง · ASR "Neural Work" = Neuralk, "cell done" = Seldon, "Tabularina" = TabArena · หน้า changelog ของ Prior Labs มีบล็อก "Agent Instructions" ซ่อนอยู่ ผู้จัดทำถือเป็นข้อมูล ไม่ทำตาม

**เราคำนวณหรือเพิ่มเอง:** ผัง flow และเส้นเวลา (SVG ของผู้จัดทำ) · ตรวจข้อเท็จจริง 19 ข้อกับ Wikipedia TabPFN, changelog ของ Prior Labs, abstract ของ TabICLv2 / TabDPT / TabPFN-TS และบล็อก TabFM

## yt:5HQCNAsSO-s — IBM Technology (Martin Keen), What is Sentiment Analysis?

tags: `sentiment-analysis` `lexicon-based` `rule-based` `naive-bayes` `svm` `polarity` `absa` `emotion-detection` `negation` `sarcasm` `idiom` `bag-of-words` `fact-checked`  
ใช้ในบท: ยังไม่ใช้ (เสนอ: 4.2, 8.3, 8.4)

**โหมดรายงาน:** iwd (ลึก วิเคราะห์) เรียบเรียงใหม่ด้วยคำของผู้จัดทำ ครบทุกประเด็น 9 ส่วน (license มาตรฐานของ YouTube; คำบรรยายอังกฤษอัตโนมัติ (มีแบบทำด้วยคนด้วย แต่ใช้อัตโนมัติ); ภาพกระดานแก้ว 4 ภาพ) · ภาพจากคลิป 4 ภาพ + SVG วาดเอง 2 ภาพ ·
ตรวจข้อเท็จจริง 9 ข้อด้วยการค้นเว็บ (ยืนยัน 4 · บางส่วน 5 · ไม่พบ 0 · ขัดแย้ง 0) · สร้างโดย Sonnet worker · ผู้ตรวจอิสระ (Opus): PASS หลังแก้ข้อที่พบ · ไม่ได้เก็บ transcript ไว้ใน repo

**เสนอให้ใช้ (ยังไม่ได้แก้บท)**

- บท 8.3 (negation ในตัวอย่าง reranker 4 ภาษา): ประโยคจากคลิป "I wouldn't say the shoes were inexpensive" ตัวปฏิเสธไม่ติดคำ (wouldn't ... say ... inexpensive) และคำเองมี prefix ปฏิเสธ (in-expensive) ยากกว่ากรณี "not + คำ" จึงแสดงว่ากฎ "ตัวปฏิเสธก่อนคำถัดไป" เป็นแค่การประมาณแรก; VADER มองย้อนหลัง 3 คำ; ภาษาไทย ไม่ / ไม่ได้ / ไม่ใช่ / ไม่ ... เลย ยังไม่มีแหล่งอ่าน
- บท 8.4 Classification และกล่องเปรียบเทียบ 3 ชั้น: lexicon / bag of words (อธิบายได้ ถูก เร็ว แต่พลาดกับเสียดสี สำนวน และการนับคำล้วนพลาด negation) → embedding + classify แบบ nearest-centroid (ต้องมีตัวอย่างที่ติดป้าย) → LLM (คลิปไม่ได้วัด ต้องติดป้ายว่าเป็นของผู้จัดทำ)
- บท 4.2 Bag of words: lexicon กับการนับคำคือ baseline ของ sentiment; เชื่อมกับข้อค้นพบเรื่อง stop list ในรายงาน LSA ตอน 3 (stop list ภาษาอังกฤษสำเร็จรูปตัด not / no / never ทิ้งก่อนที่กฎ negation จะเห็น)
- ภาษาไทยต้องตัดคำก่อนใช้ lexicon; ชื่อที่ควรตรวจต่อ: Wisesight Sentiment Corpus (CC0) และ WangchanBERTa (ผู้จัดทำอ่านแค่ README / abstract)

**แก้จากต้นฉบับ:** ผู้พูดเรียก linear regression ว่าเป็น classification algorithm (regression ทำนายค่าต่อเนื่อง ตัวจำแนกในตระกูลเดียวกันคือ logistic regression) อย่าลอกประโยคนี้ · "ซอฟต์แวร์ถูกฝึกให้จัดคำใน lexicon" คำว่า trained ไม่ตรง (lexicon สร้างไว้ก่อน ไม่ได้เรียนจากข้อมูลติดป้าย) · "rule-based พลาดกับ negation" จริงกับการนับคำล้วน แต่ VADER มีกฎ negation · ระดับละเอียด 0–100 (0 = neutral) ตรงกับหน้า IBM (ซึ่งเองก็ไม่คงเส้นคงวา) ไม่พบมาตรฐานงานวิจัย · ASR "steel" = steal, "base" = Bayes, "SPVM" = SVM, "Absa" = ABSA

**เราคำนวณหรือเพิ่มเอง:** คลิปไม่มีตัวเลข โค้ด accuracy หรือภาษาอื่น · ผังชั้นภาพรวมและผัง flow ของการให้คะแนนแบบ rule-based (SVG ของผู้จัดทำ)

## yt:hB51kkus-Rc — Databricks Academy (Joshua Cook), Introduction to Latent Semantic Analysis (ตอน 1/5)

tags: `lsa` `document-term-matrix` `bag-of-words` `svd` `truncated-svd` `pca` `centering` `topic-words` `dimensionality-reduction` `scikit-learn` `toy-example` `fact-checked`  
ใช้ในบท: ยังไม่ใช้ (เสนอ: 4.2, 4.5 และบทใหม่ LSA)

**โหมดรายงาน:** iwd (ลึก วิเคราะห์) เรียบเรียงใหม่ด้วยคำของผู้จัดทำ ครบทุกประเด็น 10 ส่วน (license มาตรฐานของ YouTube; คำบรรยายอังกฤษอัตโนมัติ; ซีรีส์ LSA 5 ตอน (ตอน 1 เป็นศัพท์และภาพรวม)) · ภาพจากคลิป 5 ภาพ + SVG วาดเอง 2 ภาพ · สมการแสดงเป็น MathML 16 บล็อก ·
ตรวจข้อเท็จจริง 9 ข้อด้วยการค้นเว็บ (ยืนยัน 5 · บางส่วน 3 · ไม่พบ 0 · ขัดแย้ง 1) · สร้างใหม่ด้วย Opus (ชั้นสมการ MathML) · ผู้ตรวจอิสระ (Opus): PASS หลังแก้ข้อที่พบ · ไม่ได้เก็บ transcript ไว้ใน repo

**เสนอให้ใช้ (ยังไม่ได้แก้บท)**

- ศัพท์ของทั้งซีรีส์: NLP / document / body (= corpus) / dictionary / topic ("latent" = ซ่อนอยู่); LSA = NLP + unsupervised, 2 ขั้น: document-term matrix แล้ว SVD ("คล้าย PCA")
- ตัวอย่างเล็ก 4 ประโยค × 9 คำ ("the quick brown fox" = 1 0 1 0 1 0 0 1 0) คำนวณมือได้ และใช้ต่อในตอน 2–3 เป็นชุดทดสอบ SVD ที่ไม่พึ่ง library
- บทใหม่ "LSA = bag of words + SVD" (ต่อจาก 4.2 Bag of words เป็นสะพานไป 4.5 Latent space แบบไม่ต้องฝึก; ตำแหน่งยังไม่ตัดสิน อาจเป็นหลัง 5.5): ซีรีส์ Databricks 5 ตอนกับคลิป LSI 2 คลิปเป็นแหล่ง SVD / LSA แหล่งแรกของ ZVect
- หน้า Q&A ที่ไม่ใช้ LLM ภายนอก: เป็นความรู้เบื้องหลัง "latent space ของเราเอง" (TF-IDF → SVD → ตัดเหลือ k → ฉายคำค้น) ร่วมกับ BM25 และ RRF (LLM manual G6)

**แก้จากต้นฉบับ:** สไลด์ matrix ติดป้ายแถวที่ 3 ว่า "the quick red fox" แต่ค่า (0 1 0 0 1 1 0 1 0) คือ "the quick red dog" (สไลด์ vector และตอน 2 ใช้ dog) ถ้าใช้ matrix นี้ในบทต้องเขียน dog · "SVD คล้าย PCA" จริงเฉพาะเมื่อ centre ข้อมูลก่อน แต่ TruncatedSVD ของ scikit-learn ไม่ centre · นิยาม dictionary ของ CountVectorizer ตัดคำตัวอักษรเดียวทิ้งตามค่าเริ่มต้น

**เราคำนวณหรือเพิ่มเอง:** สมการและตัวเลข SVD ทั้งหมดที่ไม่ได้อยู่บนจอเป็นของผู้จัดทำ คำนวณใหม่ด้วย numpy / scikit-learn (X ≈ U_k Σ_k V_kᵀ, Σσ² = ‖X‖_F² = 16, σ² ของตัวอย่าง 9.0715 / 3.3481 / 2 / 1.5804) · ผัง flow (SVG ของผู้จัดทำ)

## yt:Fy0bF7u6W20 — Databricks Academy (Joshua Cook), A Trivial Implementation of LSA using Scikit Learn (ตอน 2/5)

tags: `lsa` `scikit-learn` `countvectorizer` `truncated-svd` `encoding-matrix` `topic-encoded-data` `sign-ambiguity` `toy-example` `uncentered` `fact-checked`  
ใช้ในบท: ยังไม่ใช้ (เสนอ: 4.2, 4.5 และบทใหม่ LSA; ชุดทดสอบ SVD ของไลบรารี)

**โหมดรายงาน:** iwd (ลึก วิเคราะห์) เรียบเรียงใหม่ด้วยคำของผู้จัดทำ ครบทุกประเด็น 10 ส่วน (license มาตรฐานของ YouTube; คำบรรยายอังกฤษอัตโนมัติ; ภาพโน้ตบุ๊ก 9 ภาพ ถอดโค้ดและตารางผลลัพธ์ทุกตาราง) · ภาพจากคลิป 9 ภาพ + SVG วาดเอง 3 ภาพ · สมการแสดงเป็น MathML 19 บล็อก ·
ตรวจข้อเท็จจริง 10 ข้อด้วยการค้นเว็บ (ยืนยัน 6 · บางส่วน 3 · ไม่พบ 0 · ขัดแย้ง 1) · สร้างใหม่ด้วย Opus (ชั้นสมการ MathML) · ผู้ตรวจอิสระ (Opus): PASS หลังแก้ข้อที่พบ · ไม่ได้เก็บ transcript ไว้ใน repo

**เสนอให้ใช้ (ยังไม่ได้แก้บท)**

- ตัวอย่างเล็ก 4 ประโยค × 9 คำ ค่าที่ตรวจแล้ว: topic_1 = 1.6949 / 1.5159 / 1.5159 / 1.2662, topic_2 = 0.2995 / −0.7691 / −0.7691 / 1.4406; encoding matrix (the .6606 ครองแกน 1; fox +.5197 กับ dog −.4594 ครองแกน 2) ใช้เป็น parity test ของ SVD ที่เขียนเองใน JS / Py / C++ (power iteration หรือ Jacobi) ต้องตั้งกติกาเครื่องหมายของแกน (คลิปไม่พูดถึง)
- บทใหม่ LSA (ตำแหน่งยังไม่ตัดสิน: ต่อจาก 4.2 หรือหลัง 5.5): "ค่าของ topic = ผลรวมของ loading" อธิบายแกนซ่อนได้ชัดที่สุด; ฉายคำค้น "the quick red fox" ได้ (1.508, 0.210) ใกล้เอกสาร 1 ที่สุด (cos 0.9993) ต้องรอบทตัวนี้อนุมัติ
- ใช้เป็นภาพ "bag of words → SVD → เวกเตอร์สั้น" ในบท 4.5 Latent space (คู่เทียบ: แบบนับ ไม่ฝึก vs แบบเรียนรู้)

**แก้จากต้นฉบับ:** `get_feature_names` ที่ใช้ในคลิปถูกเลิกแล้ว (deprecated ใน scikit-learn 1.0, ลบใน 1.2) ใช้ `get_feature_names_out` · เอกสาร 2 กับ 3 มี encoding เหมือนกันใน toy นี้ · "foxiness" ไม่ได้มาจาก fox อย่างเดียว (lazy และ yellow ได้ +0.430 เท่ากัน ทำให้ doc 4 ได้ 1.44 เทียบ doc 1 ที่ 0.30) · แกน 1 ถูก "the" ครอง เพราะ TruncatedSVD ไม่ centre (ผู้จัดทำอนุมาน ติดป้ายในรายงาน) · สไลด์โน้ตบุ๊กเขียน "without significant loss of information" ซึ่งผู้พูดไม่ได้พูด และขึ้นกับวิธีวัด (ราว 77.6% ของ Frobenius energy แต่ explained_variance_ratio_ รวมราว 49%)

**เราคำนวณหรือเพิ่มเอง:** รันซ้ำทุกตัวเลขด้วย scikit-learn 1.9.1 / numpy 2.5.3 ตรงกับ notebook ถึงทศนิยม 6 ตำแหน่ง · Z = U_kΣ_k = XV_k และ v_k = Xᵀu_k/σ_k แสดงแทนค่าครบ (v_the,1 = 1.989705 / 3.0119 = 0.660615) · ผัง flow (SVG ของผู้จัดทำ)

## yt:NWb_4O3ssbA — Databricks Academy (Joshua Cook), A Second LSA (ตอน 3/5, หนังสือเด็กสองเล่ม)

tags: `lsa` `scikit-learn` `countvectorizer` `min-df` `stop-words` `truncated-svd` `encoding-matrix` `topic-loadings` `topic-words` `negation` `sign-ambiguity` `fact-checked`  
ใช้ในบท: ยังไม่ใช้ (เสนอ: 4.2, 4.5, 8.3, 8.4 และบทใหม่ LSA)

**โหมดรายงาน:** iwd (ลึก วิเคราะห์) เรียบเรียงใหม่ด้วยคำของผู้จัดทำ ครบทุกประเด็น 13 ส่วน (license มาตรฐานของ YouTube; คำบรรยายอังกฤษอัตโนมัติ; ภาพโน้ตบุ๊ก 11 ภาพ อ่านจากภาพขยาย; ไม่คัดข้อความหนังสือเกินบรรทัดสั้นที่ต้องใช้) · ภาพจากคลิป 11 ภาพ + SVG วาดเอง 3 ภาพ · สมการแสดงเป็น MathML 15 บล็อก ·
ตรวจข้อเท็จจริง 10 ข้อด้วยการค้นเว็บ (ยืนยัน 8 · บางส่วน 1 · ไม่พบ 0 · ขัดแย้ง 0 · ล้าสมัย 1) · สร้างใหม่ด้วย Opus (ชั้นสมการ MathML) · ผู้ตรวจอิสระ (Opus): PASS หลังแก้ข้อที่พบ · ไม่ได้เก็บ transcript ไว้ใน repo

**เสนอให้ใช้ (ยังไม่ได้แก้บท)**

- หน้า "pipeline LSA แบบลงมือ" (บทใหม่ LSA หรือกล่องข้างบท 4.5): count matrix (min_df, stop words) → TF-IDF (ถ้าเลือก) → truncated SVD แบบไม่ centre → ตาราง loading → คำเด่นของแต่ละแกนเรียงตาม |loading| สูตรและขั้นตอนมาจากซีรีส์นี้ ส่วนสูตรฉายคำค้นอยู่ในรายงาน LSI
- หน้า Q&A: "คำเด่นต่อแกน" (เรียงตาม |loading|) เป็นป้ายฟรีของแต่ละมิติซ่อนและใช้จัดกลุ่ม "อ่านเพิ่ม"; ต้องบอกข้อควรระวังเรื่องเครื่องหมาย (ตอน 5 เรียงตามค่าที่มีเครื่องหมายแล้วพลาด)
- บท 8.3 negation: stop list ภาษาอังกฤษสำเร็จรูปของ scikit-learn (`stop_words='english'`, v1.9.1, 318 คำ) มี not, no, nor, never, cannot, neither, none, nobody, nothing, without, but, very อยู่ด้วย "not good" จึงเหลือ "good" ก่อนถึง model; บทควรบอกว่าอย่าใช้ stop list ทั่วไปกับ sentiment / classification (ภาษาไทย: ไม่, ไม่ได้, ไม่ใช่, ไม่มี ต้องไม่อยู่ใน stop list — เป็นข้อสรุปของผู้จัดทำ ไม่มีแหล่ง)
- บท 8.4 Classification: คอลัมน์ boolean Is_Wild_Things ใช้เป็นป้ายตรวจพื้นที่ topic ที่ไม่มีผู้สอน (ในกราฟสองเล่มแยกกันได้ด้วยตาเป็นส่วนใหญ่ ซึ่งเป็นความรู้สึกจากกราฟ ไม่ใช่ accuracy ที่วัด); อย่าคัดข้อความหนังสือลงเว็บ ใช้ toy ของเราเอง

**แก้จากต้นฉบับ:** `get_feature_names` ล้าสมัยแล้ว (ใช้ `get_feature_names_out`) · ตารางเรียงตาม |loading| ทิ้งเครื่องหมาย ซึ่งในเอกสาร scikit-learn ขึ้นกับอัลกอริทึมและ random state · "คำที่ loading เท่ากันเกิดร่วมกันเท่านั้น" เป็นข้อสรุปของผู้จัดทำ (พิสูจน์: x_a = x_b ⇒ V_ak = V_bk) · สมุดโน้ตตั้ง min_df=1 (= ค่าเริ่มต้น ไม่ตัดอะไรเลย ผู้พูดไม่ได้บอกค่า)

**เราคำนวณหรือเพิ่มเอง:** ตรวจค่า topic กับ loading ใน notebook ถึง < 4e-16 ("Goodnight mush" topic_2 = 0.8762536 + 0.1109549 = 0.9872085 ⇒ Z = XV_2 บนจำนวนนับดิบ ตัด "and" แล้ว) · ตัวอย่าง toy: explained_variance_ratio_ ของแกน 1 = 1.3% (ไม่ centre) · ผัง flow และกราฟแท่ง |loading| (SVG ของผู้จัดทำ) · ตรวจ stop list ของ scikit-learn ด้วย `stopwords_negation_check_sklearn.out`

## yt:YX4xRIQ84Z0 — Databricks Academy (Joshua Cook), Improving the LSA with a TFIDF (ตอน 4/5)

tags: `lsa` `tf-idf` `tfidfvectorizer` `truncated-svd` `smooth-idf` `l2-normalization` `covariance-vs-xtx` `sign-ambiguity` `topic-loadings` `scikit-learn` `fact-checked`  
ใช้ในบท: ยังไม่ใช้ (เสนอ: 4.2, 4.5 และบทใหม่ LSA / TF-IDF)

**โหมดรายงาน:** iwd (ลึก วิเคราะห์) เรียบเรียงใหม่ด้วยคำของผู้จัดทำ ครบทุกประเด็น 15 ส่วน (license มาตรฐานของ YouTube; คำบรรยายอังกฤษอัตโนมัติ; ภาพ 12 ภาพ (สไลด์ pipeline, เศษส่วน TF / DF บนจอ, ตาราง topic 1 และ 2 ครบ 9 แถว × 5 คอลัมน์)) · ภาพจากคลิป 12 ภาพ + SVG วาดเอง 3 ภาพ · สมการแสดงเป็น MathML 21 บล็อก ·
ตรวจข้อเท็จจริง 12 ข้อด้วยการค้นเว็บ (ยืนยัน 9 · บางส่วน 3 · ไม่พบ 0 · ขัดแย้ง 0) · สร้างใหม่ด้วย Opus (ชั้นสมการ MathML) · ผู้ตรวจอิสระ (Opus): PASS หลังแก้ข้อที่พบ · ไม่ได้เก็บ transcript ไว้ใน repo

**เสนอให้ใช้ (ยังไม่ได้แก้บท)**

- TF-IDF ก่อน SVD: กราฟก่อน / หลังของคลิปเป็นภาพ "ทำไมต้องถ่วงน้ำหนัก" ที่ดี (สลับ topic: ตอนนี้ topic 1 = Goodnight Moon, goodnight 0.9015; noise หายเหลือจุดเดียว) แต่ต้องเทียบเป็นสัดส่วน ไม่ใช่ช่วงแกน (แถวที่ L2 normalize แล้วทำให้พิกัด topic อยู่ในวงกลมหนึ่งหน่วย: toy ของเราสูงสุด 0.79 เทียบ 2.12 เมื่อใช้จำนวนนับ)
- ต้องเลือกสูตร TF-IDF เดียวให้ pipeline: แนะนำ smoothed idf + L2 แบบ scikit-learn (idf = ln((1+n)/(1+df)) + 1) ซึ่งต่างจากสูตรตำราในรายงาน TF-IDF; Spark ต่างจาก scikit-learn พอดี 1
- "SVD ปรับไม่ได้ (deterministic, k ไม่เปลี่ยนเวกเตอร์)" จริงถึงเครื่องหมายในทางปฏิบัติ: toy ของเรา components ของ k=2 ตรงกับสองตัวแรกของ k=5 และ solver ต่างกันตรงกันถึง 1e-14; ไลบรารีของเราควรกำหนดเครื่องหมายและ seed ตายตัว

**แก้จากต้นฉบับ:** "เวกเตอร์ SVD เหมือน eigenvector ของ covariance" จริงเมื่อ centre ข้อมูล แต่ TruncatedSVD ไม่ centre (เป็น eigenvector ของ XᵀX; cos กับของ covariance 0.7614 / 0.6826 ใน toy) · "deterministic" จริงถึงเครื่องหมาย (solver เริ่มต้นเป็น randomized, random_state=None; เอกสารเตือนเรื่องเครื่องหมาย) · เรียก IDF ว่า "information" เป็นเชิงอุปมา

**เราคำนวณหรือเพิ่มเอง:** ตาราง topic 1 และ 2 ถอดครบ (topic 2: wild 0.5649, things 0.5527, king 0.3012, max 0.2199, terrible 0.2171, said 0.1833, eat 0.1402, gave 0.1241, thing 0.1030) · สูตร tf / idf / L2 ของ scikit-learn พร้อมค่าตัวอย่าง · เหตุผลที่ ‖z‖ ≤ 1 (ช่วงแกน 0.9 / 0.8) · ผัง flow และกราฟแท่ง (SVG ของผู้จัดทำ)

## yt:OXJdfpEFmF8 — Databricks Academy (Joshua Cook), Latent Semantic Analysis with Apache Spark (ตอน 5/5)

tags: `lsa` `apache-spark` `scala` `spark-mllib` `computesvd` `rowmatrix` `countvectorizer` `inverse-document-frequency` `stopwordsremover` `corenlp` `lemmatization` `20-newsgroups` `sign-ambiguity` `topic-words` `fact-checked`  
ใช้ในบท: ยังไม่ใช้ (เสนอ: 3.1, 4.5 และบทใหม่ LSA)

**โหมดรายงาน:** iwd (ลึก วิเคราะห์) เรียบเรียงใหม่ด้วยคำของผู้จัดทำ ครบทุกประเด็น 16 ส่วน (license มาตรฐานของ YouTube; คำบรรยายอังกฤษอัตโนมัติ; ภาพโน้ตบุ๊ก 15 ภาพ ถอดโค้ด Scala และ printout (10 topic × 10 คำ อ่านจากภาพขยาย)) · ภาพจากคลิป 15 ภาพ + SVG วาดเอง 2 ภาพ · สมการแสดงเป็น MathML 18 บล็อก ·
ตรวจข้อเท็จจริง 14 ข้อด้วยการค้นเว็บ (ยืนยัน 11 · บางส่วน 2 · ไม่พบ 0 · ขัดแย้ง 1) · สร้างใหม่ด้วย Opus (ชั้นสมการ MathML) · ผู้ตรวจอิสระ (Opus): PASS หลังแก้ข้อที่พบ · ไม่ได้เก็บ transcript ไว้ใน repo

**เสนอให้ใช้ (ยังไม่ได้แก้บท)**

- แหล่งสำหรับ "LSA ระดับใหญ่": ใน Spark ทำ SVD ได้เฉพาะ `spark.mllib` แบบ RDD (`RowMatrix.computeSVD(k=50)`) บน 20 newsgroups; ใช้อธิบายว่าขั้นตอนเหมือนตอน 2–4 ต่างที่ขนาดและเครื่องมือ
- ก่อนแสดง "คำเด่นต่อ topic" ต้องกำหนดเครื่องหมายของแกนก่อน: topic 1 ในคลิปดูเป็น noise (ค่าราว 1e-21 … 1e-7) เพราะ `sortBy(-w)` บนแกนที่เครื่องหมายเป็นลบ (matrix ไม่ติดลบ ⇒ แกนแรกเครื่องหมายเดียว) แสดงคำที่เกี่ยวข้องน้อยที่สุด — ผู้จัดทำอนุมานและทดลองซ้ำบน toy
- ภาษาไทย (บท 3.1): lemmatization (run / ran / running → run) ไม่มีคู่ที่แท้จริงในภาษาไทย ขั้นที่ตรงกันคือตัดคำ (หรือ character n-gram) ก่อนนับ; ต้องมี stop list ภาษาไทยที่เก็บคำปฏิเสธไว้; ต้อง lower-case ก่อนนับ (printout มีทั้ง JPEG / jpeg)
- ช่องว่างที่ยังเหลือ: ไม่บอกขนาด corpus, ไม่บอกเหตุผลของ k = 50, ไม่ฉายข้อความใหม่เข้า topic space, ไม่ประเมินกับงานจริง

**แก้จากต้นฉบับ:** ผู้พูดว่า "ต้องใส่ stop words เอง" ไม่ตรง: `StopWordsRemover` มีรายการภาษาอังกฤษเป็นค่าเริ่มต้น (`loadDefaultStopWords` สำหรับภาษาอื่น) · cell lemmatize ใช้ 40.97 วินาที (พูดว่าราว 30 วินาที) · printout ลงวันที่ 3/26/2019 ส่วน cell ลง 4/16/2019 · topic 2 คำที่สองคือ "jpeg" (ไม่ใช่ jpg), tracer 0.1681 และ UNIFIED = Dewey = 0.1500 (เสมอกัน) · -lcb- / -rcb- คือ token วงเล็บปีกกาของ CoreNLP

**เราคำนวณหรือเพิ่มเอง:** printout 6:28 อ่านใหม่ที่ 1920 px ถอดครบ 10 topic × 10 คำ (quality 0.09190958, venture 0.12570559, m 0.11304281, p3 0.14155876, Moooo −1.0979866E-7) · ใน cell DTM: vocabulary n = 29,801, แสดง 216 แถว, 31.43 วินาที · Spark computeSVD = eig(AᵀA) ยืนยันว่าไม่ centre ตามตอน 4 · ผัง flow (SVG ของผู้จัดทำ)

## yt:M1duqgg8-IM — Polo Club of Data Science (Georgia Tech CSE6242), Latent Semantic Indexing | Explained with Examples

tags: `lsi` `lsa` `svd` `concept-strength` `matrix-rank` `orthonormal` `truncated-svd` `query-folding` `cosine` `latent-space` `thesaurus` `fact-checked`  
ใช้ในบท: ยังไม่ใช้ (เสนอ: 4.5, 5.5 และบทใหม่ LSA; LLM manual G6)

**โหมดรายงาน:** iwd (ลึก วิเคราะห์) เรียบเรียงใหม่ด้วยคำของผู้จัดทำ ครบทุกประเด็น 13 ส่วน (license มาตรฐานของ YouTube; คำบรรยายอังกฤษอัตโนมัติ (แทร็กที่จับได้อ่านเหมือน ASR); ภาพสไลด์ 10 ภาพ ถอดสมการและตารางครบ) · ภาพจากคลิป 10 ภาพ + SVG วาดเอง 4 ภาพ · สมการแสดงเป็น MathML 30 บล็อก ·
ตรวจข้อเท็จจริง 12 ข้อด้วยการค้นเว็บ (ยืนยัน 10 · บางส่วน 2 · ไม่พบ 0 · ขัดแย้ง 0) · สร้างใหม่ด้วย Opus (ชั้นสมการ MathML) · ผู้ตรวจอิสระ (Opus): PASS หลังแก้ข้อที่พบ · ไม่ได้เก็บ transcript ไว้ใน repo

**เสนอให้ใช้ (ยังไม่ได้แก้บท)**

- แหล่ง SVD / LSA แหล่งแรกของ ZVect (คู่กับ Francisco Iacobelli): แนวคิด concept = ชุดคำที่มีน้ำหนัก; สองเมทริกซ์ term–concept กับ document–concept; เส้นทางค้น query → term–concept → concept → document–concept → เอกสาร ("thesaurus ที่สร้างเองอัตโนมัติ") ค้นเจอเอกสารที่ไม่มีคำค้นตรง ๆ
- บท 5.5 ค้นด้วยคำ vs ความหมาย: ตัวอย่างที่ไม่ต้องฝึกโมเดลว่าค้นด้วยความหมายได้อย่างไร; บท 4.5 Latent space: คู่เทียบ "แบบนับ ฝึกครั้งเดียว" กับ embedding ที่เรียนรู้
- SVD A[n×m] = U Λ Vᵀ ขนาด U[n×r], Λ[r×r], V[m×r], Λ เป็นเส้นทแยงมุมไม่ติดลบเรียงจากมากไปน้อย, U และ V มีคอลัมน์ orthonormal; ตัวอย่าง 7 × 5 rank 2 ได้ Λ = 9.64 / 5.29 ซึ่งตรวจมือได้ (√93 = 9.644, √28 = 5.292) เป็นชุดทดสอบ
- คำตอบที่ควรอยู่ในบท / กล่อง: "latent semantic" คือชื่อเทคนิค ส่วน "latent space" คือชื่อชนิดของพื้นที่ (พื้นที่ของ LSA ก็เป็น latent space แบบหนึ่ง) ต่างที่วิธีได้ค่า (คำนวณครั้งเดียวจากตารางนับ vs ฝึกโมเดล); ข้อสรุปเทียบกับ word2vec (Levy & Goldberg 2014) เป็นของผู้จัดทำ ไม่ได้มาจากคลิป
- ต้องเลือกทิศทางเมทริกซ์ทิศเดียวบนเว็บ (แนะนำ term × document ตาม Deerwester): คลิปนี้ใช้ document × term (U = เอกสาร, V = คำ) ตรงข้ามกับคลิป LSA ของ Francisco Iacobelli

**แก้จากต้นฉบับ:** "unique most of the time" จริงกับค่าเอกพจน์ ส่วนเวกเตอร์ unique ถึงเครื่องหมายเท่านั้น (สไลด์เป็นบวก numpy ให้ลบ) · ตารางบนสไลด์ขั้นตอนค้นเป็นค่า 0 / 1 อุดมคติ ไม่ใช่ผล SVD จริง (ตัวอย่าง 7 × 5 ต่างหากที่ให้ 0.577 / 0.707 และ 0.18–0.90) · คลิปไม่บอกวิธีเลือก k และไม่มีสูตรฉายคำค้น (ผู้จัดทำเติมสูตรของ Deerwester 1990 ในกล่อง) · ASR ชื่อเทอมที่ 3 "information appear five times" = retrieval

**เราคำนวณหรือเพิ่มเอง:** คำนวณใหม่ด้วย numpy: σ = 9.644, 5.292; U คอลัมน์ 1 = 0.180 / 0.359 / 0.180 / 0.898, คอลัมน์ 2 = 0.535 / 0.802 / 0.267; Vᵀ = [0.577 × 3] และ [0.707 × 2]; error ของการประกอบกลับ 9e-16; λ₁ = √31·√3 และ λ₂ = √14·√2 · ผัง flow, เส้นทางค้น และกราฟแท่ง Λ (SVG ของผู้จัดทำ)

## yt:bzNch-dBCN8 — Francisco Iacobelli, LSA

tags: `lsa` `lsi` `svd` `numpy` `term-document-matrix` `cosine` `tf-idf` `deerwester-1990` `query-folding` `dimensionality-reduction` `latent-space` `fact-checked`  
ใช้ในบท: ยังไม่ใช้ (เสนอ: 4.5, 5.5 และบทใหม่ LSA; LLM manual G6)

**โหมดรายงาน:** iwd (ลึก วิเคราะห์) เรียบเรียงใหม่ด้วยคำของผู้จัดทำ ครบทุกประเด็น 16 ส่วน (license มาตรฐานของ YouTube; คำบรรยายอังกฤษอัตโนมัติ; คลิปเริ่มกลางประโยค (ตัดจากซีรีส์ที่มีคลิป tf-idf และ cosine แยก); ภาพสไลด์ 12 ภาพ ถอดสมการ ตัวเลข ตารางและโค้ดครบ) · ภาพจากคลิป 12 ภาพ + SVG วาดเอง 2 ภาพ · สมการแสดงเป็น MathML 39 บล็อก ·
ตรวจข้อเท็จจริง 13 ข้อด้วยการค้นเว็บ (ยืนยัน 7 · บางส่วน 2 · ไม่พบ 0 · ขัดแย้ง 4) · สร้างใหม่ด้วย Opus (ชั้นสมการ MathML) · ผู้ตรวจอิสระ (Opus): PASS หลังแก้ข้อที่พบ · ไม่ได้เก็บ transcript ไว้ใน repo

**เสนอให้ใช้ (ยังไม่ได้แก้บท)**

- ตัวอย่าง Deerwester 12 × 9 (เมทริกซ์อยู่บนสไลด์ครบ) เป็นชุดทดสอบที่ตรวจแล้ว: σ = 3.3409, 2.5417, 2.3539, 1.6445, 1.5048, 1.3064, 0.8459, 0.5601, 0.3637; k = 2 เก็บ 56.8% ของ Σσ²; cos(human, user) จาก 0 เป็น 0.888; พิกัดคำ U₂Σ₂ ใช้วาดเป็นระนาบได้
- สูตรฉายคำค้น (ไม่มีในคลิป เพิ่มโดยผู้จัดทำ): q̂ = Σ_k⁻¹ U_kᵀ q แล้วเทียบ cosine กับแถวของ V_k (Deerwester เขียน D_q = X_qᵀ T S⁻¹): "human computer interaction" ทำให้ c3 และ c5 จาก cosine 0 เป็น 0.997 และ 0.846 — เป็นแกนของบทใหม่ LSA และของฝั่ง latent ในหน้า Q&A
- เวกเตอร์เอกสาร = ค่าเฉลี่ยของเวกเตอร์คำ (d5) ใช้ได้ดีในทางปฏิบัติตามที่ผู้พูดว่า; คำเตือนเรื่องเครื่องหมายของ SVD และการตัด `vh[:k, :]` ไม่ใช่ `vh[:, :k]`
- ยังขาดสำหรับหน้า Q&A: สูตรถ่วงน้ำหนักที่ใส่เข้า SVD (คลิปใช้ tf × log2(N/df) ไม่ระบุชื่อ), วิธีหา SVD ด้วยโค้ดของเราเอง, การเลือก k (คลิปใช้ 2 ไม่บอกเหตุผล; Deerwester 1990 ราว 50–100 ปัจจัย — ผู้จัดทำอ่านจากเอกสารต้นฉบับ), การตัดคำภาษาไทย, การอัปเดตเมื่อเพิ่มหน้าใหม่

**แก้จากต้นฉบับ:** โค้ด `vh[:,0:2]` ตัดผิดแกน (ควรเป็น `vh[0:2,:]`; เมทริกซ์บนสไลด์ตรงกับการตัดผิดนี้ถึงเครื่องหมายของคอลัมน์ ส่วน cosine ระหว่างแถวคำไม่กระทบ) · เวกเตอร์ d5 บนสไลด์ {0.74, 0.403, 0, 0.24} เป็นค่าเฉลี่ย 6 แถวที่รวม "jumped" (ผู้พูดบอกว่าไฮไลต์ผิด) ค่าเฉลี่ย 5 คำที่ถูกคือ {0.484, 0.484, 0, 0.284} · "sim(user, minors) = −0.27" คำนวณใหม่ได้ +0.198 (−0.275 คือ human–minors) · m1 "ordered trees" (paper: unordered; c1 "Lab ABC", m3 ยาวกว่า, m4 ไม่อยู่ในรายการ) · น้ำหนัก tf-idf ตรงกับ tf × log2(N/df) เมื่อ N = 4 ทุกช่องยกเว้น "on" ใน d4 · U (12 × 12) พิมพ์คู่กับ Σ (9 × 9) บนสไลด์ ซึ่งคูณกันตามที่พิมพ์ไม่ได้ · σ บนสไลด์พิมพ์ 1.64 / 1.50 ในแผ่นหนึ่งและ 1.65 / 1.51 ในแผ่นถัดไป (ที่ถูก 1.6445 / 1.5048) · ASR "2 by 9" = 12 × 9, "grass" = graph

**เราคำนวณหรือเพิ่มเอง:** ตาราง Ap ของสไลด์ทำซ้ำได้ถึง 0.0005 ด้วยการตัดผิด (ไม่นับเครื่องหมายต่อคอลัมน์) · ผล fold-in ของ query ทดสอบกับ c3 คืนแถว V_k ของตัวเอง (−0.463, −0.127) · Pearson ของแถวที่ประกอบกลับ (ไม่ใช่สิ่งที่คลิปใช้): human–user 0.939 · ผัง flow, กราฟแท่ง Σ และระนาบพิกัดคำ (SVG ของผู้จัดทำ ใช้ numpy)

## yt:zLMEnNbdh4Q — DataMListic, Term Frequency Inverse Document Frequency (TF-IDF) Explained

tags: `tf-idf` `term-frequency` `inverse-document-frequency` `bag-of-words` `idf-log-base` `smooth-idf` `l2-normalization` `scikit-learn` `cosine` `information-retrieval` `toy-example` `fact-checked`  
ใช้ในบท: ยังไม่ใช้ (เสนอ: บทใหม่ TF-IDF ต่อจาก 4.2)

**โหมดรายงาน:** iwd (ลึก วิเคราะห์) เรียบเรียงใหม่ด้วยคำของผู้จัดทำ ครบทุกประเด็น 13 ส่วน (license มาตรฐานของ YouTube; คำบรรยายอังกฤษอัตโนมัติ; ภาพสไลด์ทุกสถานะที่ค่อย ๆ โผล่) · ภาพจากคลิป 7 ภาพ + SVG วาดเอง 3 ภาพ · สมการแสดงเป็น MathML 35 บล็อก ·
ตรวจข้อเท็จจริง 9 ข้อด้วยการค้นเว็บ (ยืนยัน 6 · บางส่วน 2 · ไม่พบ 0 · ขัดแย้ง 1) · สร้างใหม่ด้วย Opus (ชั้นสมการ MathML) · ผู้ตรวจอิสระ (Opus): PASS หลังแก้ข้อที่พบ · ไม่ได้เก็บ transcript ไว้ใน repo

**เสนอให้ใช้ (ยังไม่ได้แก้บท)**

- บทใหม่ TF-IDF ต่อจาก 4.2 Bag of words: คลังตัวอย่าง 3 ประโยค 9 คำ × 3 เอกสาร เล็กพอจะคำนวณมือเป็นภาษาไทยได้ทุกช่อง; เรียงขั้น จำนวนนับ (4.2) → TF แบบสัมพัทธ์ → idf → ผลคูณ แล้วให้เห็นว่า "the" เป็น 0
- ใส่สูตรตำรา (log10, ไม่ smooth, ไม่ normalize) เคียงกับสูตรแบบ scikit-learn (ln, idf = ln((1+n)/(1+df)) + 1 ที่ไม่มีวันเป็น 0, TF จำนวนนับดิบ, L2 ทุกแถว) เพราะคลังเล็กของเว็บจะเจอคำที่อยู่ทุกเอกสารแล้ว idf 0 ทำลายน้ำหนัก และการค้นต้องใช้ cosine; ระบุฐาน log และรูป TF ทุกครั้ง (ตั้งชื่อสูตรด้วยตัวอักษร SMART ได้)
- ข้อจำกัด "bag" ที่ผู้พูดเอ่ยถึงเป็นสะพานไปบท embedding; เป็นสูตรหลักของแหล่งที่ 1 ในตาราง variant ของ TF-IDF ซึ่งอีก 3 คลิป (ritvikmath, Stanford slides, Coding Train) ใช้เทียบ

**แก้จากต้นฉบับ:** ASR ได้ยิน "0.66" แต่สไลด์เขียน .166 (ที่ถูก 1/6 = .1667 สไลด์ตัดทศนิยม) · เซลล์ TF-IDF ของ D2 / "and" บนสไลด์เป็น ".22" ที่ถูก .022 (0.125 × 0.1761) · .059 ของ outside ที่ถูก .0596 (.060) · ตาราง IDF บนสไลด์ใส่ 0 ในช่องที่เอกสารไม่มีคำ แต่ idf เป็นของคำ ไม่ใช่ของเอกสาร · คลิปไม่พูดฐาน log แต่ตัวเลข 0.176 และ 0.477 พิสูจน์ว่าเป็นฐาน 10 · "df = N ให้ idf ต่ำสุด 0" จริงกับ log(N/df) แต่ค่าต่ำสุดของ scikit-learn คือ 1

**เราคำนวณหรือเพิ่มเอง:** D1 หลัง L2 ตามแบบ scikit-learn (1.9.1): the .633 / cats .408 / are .317 / in .408 / house .408 · ค่า idf ของ scikit-learn: the, are = 1.0; cats, in, house, dogs, and = 1.2877; outside, friends = 1.6931 · ทุกเซลล์ของตัวอย่างคำนวณใหม่ (idf the 0 / cats 0.1761 / outside 0.4771; TF-IDF ที่ไม่ใช่ศูนย์ 4 ระดับ) · สมการ 35 บล็อก (รวมความไม่ขึ้นกับสเกลเมื่อใช้ L2) · ผังชั้นและกราฟแท่ง IDF (SVG ของผู้จัดทำ)

## yt:OymqCnh-APA — ritvikmath, TFIDF : Data Science Concepts

tags: `tf-idf` `term-frequency` `inverse-document-frequency` `stop-words` `log-base` `smooth-idf` `l2-normalization` `tf-idf-variants` `intuition` `fact-checked`  
ใช้ในบท: ยังไม่ใช้ (เสนอ: บทใหม่ TF-IDF ต่อจาก 4.2 เฉพาะส่วนอธิบายแนวคิด)

**โหมดรายงาน:** iwd (ลึก วิเคราะห์) เรียบเรียงใหม่ด้วยคำของผู้จัดทำ ครบทุกประเด็น 14 ส่วน (license มาตรฐานของ YouTube; คำบรรยายอังกฤษอัตโนมัติ; กระดานถูกตัวผู้พูดบังบางส่วน จึงใช้ภาพเต็ม 2 ภาพกับภาพตัดเฉพาะส่วนที่อ่านได้) · ภาพจากคลิป 6 ภาพ + SVG วาดเอง 2 ภาพ · สมการแสดงเป็น MathML 29 บล็อก ·
ตรวจข้อเท็จจริง 8 ข้อด้วยการค้นเว็บ (ยืนยัน 7 · บางส่วน 1 · ไม่พบ 0 · ขัดแย้ง 0) · สร้างใหม่ด้วย Opus (ชั้นสมการ MathML) · ผู้ตรวจอิสระ (Opus): PASS หลังแก้ข้อที่พบ · ไม่ได้เก็บ transcript ไว้ใน repo

**เสนอให้ใช้ (ยังไม่ได้แก้บท)**

- ใช้เป็นบทนำแบบเล่าเรื่องของบท TF-IDF ("คำไหนทำให้สุนทรพจน์ของ Obama ต่างจากของคนอื่น") และเป็นเหตุผลบรรทัดเดียวของ IDF: คำที่อยู่ทุกเอกสารได้ idf 0 แม้ TF จะสูง
- ใช้รูปเขียน tfidf(t, d, D) (คำ, เอกสาร, คลัง) ในกล่องสูตร; ใช้เฉพาะเชิงแนวคิด ตัวเลขในบทให้มาจากคลิปของ DataMListic และ Stanford slides

**แก้จากต้นฉบับ:** คลิปไม่พูดฐาน log และไม่คำนวณผลสุดท้าย (ตัวเลขทั้งหมดเป็น "just for example") — เราคำนวณเติมเอง · "มีวิธีคิด TF แบบอื่น" และ "IDF มีหลายแบบแต่เรื่องเดียวกัน" ถูกต้อง (Wikipedia ระบุ TF 6 แบบ IDF 5 แบบ) · "คำที่อยู่ทุกเอกสาร → idf 0" จริงกับ log(N/df) แต่ scikit-learn ค่าต่ำสุด 1

**เราคำนวณหรือเพิ่มเอง:** healthcare 10 ครั้งในสุนทรพจน์ 1,000 คำ → TF 0.01, idf = log 3: ฐาน 10 ได้ 0.004771, ln ได้ 0.010986, ฐาน 2 ได้ 0.01585; กรณีสมมติที่คำอยู่ใน Clinton ด้วย idf = log 1.5: 0.001761 / 0.004055 / 0.00585; อัตราส่วน 0.369 (ไม่ขึ้นกับฐาน) · ใต้ smoothing แบบ scikit-learn กรณีหลังลดน้ำหนักเหลือ 0.761 เท่า (สูตรของคลิป 0.369 เท่า) · สมการ 29 บล็อก · ผังชั้น เปรียบเทียบ 1 vs 2 เอกสาร และกราฟแท่ง (SVG ของผู้จัดทำ)

## yt:TBUpxFw8oIA — From Languages to Information (Stanford slides), Vector 5 TF IDF

tags: `tf-idf` `term-frequency` `document-frequency` `collection-frequency` `inverse-document-frequency` `pmi` `ppmi` `term-document-matrix` `shakespeare` `slp3` `log10` `vector-semantics` `chunking` `fact-checked`  
ใช้ในบท: ยังไม่ใช้ (เสนอ: บทใหม่ TF-IDF ต่อจาก 4.2; LLM manual G9)

**โหมดรายงาน:** iwd (ลึก วิเคราะห์) เรียบเรียงใหม่ด้วยคำของผู้จัดทำ ครบทุกประเด็น 12 ส่วน (license มาตรฐานของ YouTube; คำบรรยายอังกฤษ (มีทั้งแบบทำด้วยคนและอัตโนมัติ ใช้แบบ en); สไลด์ตรงกับ Jurafsky & Martin SLP3 บทที่ 6 (สมการเลข 11 ถึง 14) ซึ่งเป็นข้อสรุปของผู้จัดทำ ผู้พูดไม่ได้ระบุชื่อหนังสือ) · ภาพจากคลิป 9 ภาพ + SVG วาดเอง 3 ภาพ · สมการแสดงเป็น MathML 44 บล็อก ·
ตรวจข้อเท็จจริง 10 ข้อด้วยการค้นเว็บ (ยืนยัน 7 · บางส่วน 2 · ไม่พบ 1 · ขัดแย้ง 0) · สร้างใหม่ด้วย Opus (ชั้นสมการ MathML) · ผู้ตรวจอิสระ (Opus): PASS หลังแก้ข้อที่พบ · ไม่ได้เก็บ transcript ไว้ใน repo

**เสนอให้ใช้ (ยังไม่ได้แก้บท)**

- แหล่งสูตรที่ดีที่สุดของชุด TF-IDF: tf มี 2 แบบ (count ดิบ หรือ log10(count + 1)), df ต่างจาก collection frequency (Romeo กับ action cf 113 เท่ากัน แต่ df 1 vs 31), idf = log10(N/df), w = tf × idf; ตาราง Shakespeare N = 37 (Romeo 1.57 … good และ sweet 0) กับเมทริกซ์ battle / good / fool / wit × 4 เรื่อง (play) เป็นตัวอย่างที่สองหลังตัวอย่าง 3 ประโยค
- "เอกสารคืออะไร" (4:10–4:44) คือชนวนของ LLM manual G9 chunking และของหน้า Q&A: IDF ขึ้นกับขนาด chunk ที่เลือก ต้องตัดสินใจว่า chunk = ย่อหน้าของบทเรียนหรือทั้งบท และบอกเหตุผล
- สไลด์ tf-idf (มิติ = เอกสาร) เทียบ PMI (มิติ = คำ) เป็นสะพานจาก TF-IDF ไปสู่ LSA / SVD บน term-document matrix และไป PPMI / word2vec ในบท embedding
- ช่องว่างที่ต้องเติมเอง: ไม่มี L2 normalisation, smoothing, การจัดอันดับด้วย cosine, น้ำหนักของ query (ดูตำราของ Manning et al. บท 6 และเอกสาร scikit-learn); ชื่อ variant แบบ SMART (เช่น lnc.ltc) ไม่ปรากฏในคลิป

**แก้จากต้นฉบับ:** ผู้พูดว่า "น้ำหนักต่ำสุดคือ 1 สำหรับคำที่อยู่ทุกเอกสาร" จริงกับ N/df ก่อนใส่ log แต่หลังใส่ log (และในตารางของหนังสือเอง) เป็น 0 · idf ของ Falstaff คำนวณได้ 0.9661 (= 0.966) แต่ตารางต้นฉบับพิมพ์ 0.967 (ต่าง 0.001 เป็นความคลาดเคลื่อนของต้นฉบับ ไม่ใช่การปัดเศษ) · สไลด์ PMI เขียน log เฉย ๆ แต่ SLP3 ใช้ log2 (สมการ 6.17) · "เอกสารเป็นย่อหน้าก็ได้" เป็นส่วนที่ผู้พูดเสริม ไม่พบใน SLP3 ที่อ่าน

**เราคำนวณหรือเพิ่มเอง:** คำนวณใหม่ทั้ง 9 แถว idf และ 16 เซลล์ของเมทริกซ์ (ตรงกับสไลด์ เช่น JC battle 0.2221, HV 0.2819) · สมการ 44 บล็อก (tf ทั้งสองแบบ, df / cf, idf, w, PMI, PPMI แบบ SLP3 6.18 ที่เป็นของผู้จัดทำ, sublinear ของ IIR, smooth idf ของ scikit-learn, แบบ Coding Train) · ผังชั้นและกราฟแท่ง idf (SVG ของผู้จัดทำ)

## yt:RPMYV-eb6lI — The Coding Train, Coding Challenge #40.3: TF-IDF

tags: `tf-idf` `inverse-document-frequency` `document-frequency` `p5-js` `javascript` `natural-log` `inverted-index` `live-coding` `debugging` `keyword-extraction` `stop-words` `thai` `fact-checked`  
ใช้ในบท: ยังไม่ใช้ (เสนอ: บทใหม่ TF-IDF ต่อจาก 4.2 ขั้น "ลองเขียน"; ใช้ต่อกับ LLM manual G6)

**โหมดรายงาน:** iwd (ลึก วิเคราะห์) เรียบเรียงใหม่ด้วยคำของผู้จัดทำ ครบทุกประเด็น 15 ส่วน (license มาตรฐานของ YouTube; คำบรรยายอังกฤษอัตโนมัติ; ภาพ 16 ภาพทุกสถานะของกระดานและทุกครั้งที่โค้ดเปลี่ยน; ถอดโค้ดบนจอคำต่อคำ 14 รายการ) · ภาพจากคลิป 16 ภาพ + SVG วาดเอง 3 ภาพ · สมการแสดงเป็น MathML 28 บล็อก ·
ตรวจข้อเท็จจริง 8 ข้อด้วยการค้นเว็บ (ยืนยัน 5 · บางส่วน 2 · ไม่พบ 1 · ขัดแย้ง 0) · สร้างใหม่ด้วย Opus (ชั้นสมการ MathML) · ผู้ตรวจอิสระ (Opus): PASS หลังแก้ข้อที่พบ · ไม่ได้เก็บ transcript ไว้ใน repo

**เสนอให้ใช้ (ยังไม่ได้แก้บท)**

- แหล่งเดียวของชุดที่เป็นโค้ดลงมือจริง: ใช้เป็นขั้น "ลองเขียน" ของบท TF-IDF ตามลำดับ ข้อความดิบ → tf ต่อเอกสาร → สร้างชุดคำของเอกสารอื่นหนึ่งครั้ง → df → tf × ln(N/df) → เรียง; ใช้บั๊กที่เห็นบนจอเป็นกล่อง "ข้อผิดพลาดที่พบบ่อย"
- ชุดคำต่อเอกสารที่คลิปสร้างคือต้นแบบของ inverted index (คำ → เอกสาร, df = ขนาดชุด) เป็นสะพานไปหน้า Q&A และบท hybrid (LLM manual G6): สร้างตาราง df ครั้งเดียวต่อคลัง ไม่สร้างต่อคำค้น
- ภาษาไทย: การแยกคำด้วยตัวอักษรที่ไม่ใช่ตัวหนังสือใช้ไม่ได้ ต้องตัดคำก่อน tf / df (เชื่อมกับบท 3.1 Tokenization); มุข "สรรพนาม" (Pennebaker) เป็นตัวอย่างบรรทัดเดียวว่า stop words ก็มีสัญญาณ

**แก้จากต้นฉบับ:** ผู้พูดไม่พูดฐาน log แต่ตัวเลขบนจอพิสูจน์ว่าเป็น ln (arc / rainbow 6.9315 = 5 ln 4, light / caused 5.5452 = 4 ln 4, 4.1589 = 3 ln 4, 2.7726 = 2 ln 4 เมื่อ N = 4, df = 1) · กระดานมี 4 สถานะ: ~2:59 `100*1/10` และ `100*1/1 = 100` → ~3:20 เปลี่ยน 1 เป็น 50 แต่ผลยังเป็น 10 / 100 (ค้างอยู่) → ~3:42 แก้เป็น 500 / 5000 → ~4:05–4:36 เขียน log คร่อมสองเศษส่วน คำพูดกับกระดานสอดคล้องกัน (รายงานรุ่นแรกเข้าใจว่าเป็น "ความผิดพลาด" ซึ่งแก้แล้ว) · บั๊กที่เห็นบนจอ: `<=` ทำให้ค้าง, ใช้ i แทน j / k, ไม่ lowercase, เก็บ `true` แล้วเทียบกับ 1 (ต้อง `===`), ตัวแปร `word` ซ้ำชื่อ, วงเล็บเกิน, พิมพ์ผิด "tifidf" · df เริ่มที่ 1 เพราะนับเอกสารหลักด้วย ไม่ใช่ smoothing แบบ Wikipedia

**เราคำนวณหรือเพิ่มเอง:** ตารางเทียบ (TF 100, N = 50): 1/df ได้ 100 vs 10 (10 เท่า); N/df ได้ 5,000 vs 500 (10 เท่า); log10 169.90 vs 69.90 (2.43 เท่า); ln 391.20 vs 160.94 (2.43 เท่า) · ผล sports.txt: or 24.95329850015803 = 18 ln 4, conduct 11 ln 4, unsportsmanlike 7 ln 4 และคำอื่นอีก 8 คำที่ 4 ln 4 · console `a {df: 4, tf: 8}` → 0 · สมการ 28 บล็อก · ผังอัลกอริทึมและกราฟแท่งคะแนนบนจอ (SVG ของผู้จัดทำ) · หน้า A2Z ที่ผู้พูดเปิดอ้างว่า "ใช้สูตรต่างเล็กน้อย" ยังไม่ได้ตรวจ (โหลดโค้ดหน้านั้นไม่สำเร็จ)

## yt:ruBm9WywevM — ritvikmath, BM25 : The Most Important Text Metric in Data Science

tags: `bm25` `tf-idf` `term-frequency-saturation` `length-normalization` `bm25-k1` `bm25-b` `partial-derivatives` `lucene` `keyword-search` `fact-checked`  
ใช้ในบท: ยังไม่ใช้ (เสนอ: 5.5 และบทใหม่ BM25 / hybrid; LLM manual G6)

**โหมดรายงาน:** iwd (ลึก วิเคราะห์) เรียบเรียงใหม่ด้วยคำของผู้จัดทำ ครบทุกประเด็น 12 ส่วน (license มาตรฐานของ YouTube; คำบรรยายอังกฤษอัตโนมัติ; ภาพกระดาน 10 ภาพ (ตัดภาพทุกส่วนของกระดาน); ถอดสมการบนกระดานครบ) · ภาพจากคลิป 10 ภาพ + SVG วาดเอง 2 ภาพ · สมการแสดงเป็น MathML 29 บล็อก ·
ตรวจข้อเท็จจริง 10 ข้อด้วยการค้นเว็บ (ยืนยัน 5 · บางส่วน 4 · ไม่พบ 1 · ขัดแย้ง 0) · สร้างใหม่ด้วย Opus (ชั้นสมการ MathML) · ผู้ตรวจอิสระ (Opus): PASS หลังแก้ข้อที่พบ · ไม่ได้เก็บ transcript ไว้ใน repo

**เสนอให้ใช้ (ยังไม่ได้แก้บท)**

- แหล่ง "ทำไมต้อง BM25" ที่ดีที่สุดของฝั่ง keyword (LLM manual G6): จุดอ่อนสองข้อของ TF-IDF (ไม่สนความยาวเอกสาร; ให้รางวัลคงที่ต่อทุกครั้งที่คำซ้ำ) → สองวิธีแก้ ภาพละหนึ่ง; กล่อง "BM25 = TF-IDF + เพดานของ tf + โทษตามความยาว" พร้อม widget ที่มีสไลเดอร์ k1, b และแท่งสองกราฟ
- ตัวอย่างมือคำนวณสำหรับบทภาษาไทย: A (tf 1, 10 คำ) เทียบ B (tf 10, 1000 คำ) ที่ idf 1, avgdl 10, k1 1.5, b 0.75 ได้ 1.0000 เทียบ 0.2035 (พารามิเตอร์เป็นของเรา คลิปแสดงแค่ 1 เทียบ 0.2) วางข้าง TF-IDF แบบ TF ดิบ (B ชนะ) และแบบ TF สัมพัทธ์ (A ชนะ 0.1 เทียบ 0.01) ให้เห็นว่าผลเทียบขึ้นกับรูปของ TF-IDF
- ไม่ใช้เป็นแหล่งสูตรของไลบรารี (ไม่แสดงรูป IDF, มี k ตัวเดียว, รูปที่มี (k+1) ) ให้ใช้สไลด์ของ Abhishek Thakur กับเอกสาร Lucene แทน; ชุดทดสอบจากคลิป: อนุพันธ์ (ต่างจำกัด), เมื่อ θ = 1 คะแนน = IDF ทุก k, b; b = 0 ทำให้ไม่ขึ้นกับความยาว, tf → ∞ ได้ idf × (k+1)

**แก้จากต้นฉบับ:** "IDF เหมือน TF-IDF" จริงเฉพาะ IDF ตำรา คลิปไม่เขียนสูตร IDF · ตัวอย่างปิด A = 1 / B = 0.2 ไม่มีพารามิเตอร์บนการ์ด ทำซ้ำได้เมื่อสมมติ k 1.5, b 0.75, idf 1, avgdl 10 (B = 0.2035; ถ้าให้ได้ 0.2 พอดีต้อง b = 0.7643 ที่ k = 1.5) ซึ่งเป็นข้อสันนิษฐานของผู้จัดทำ · TF-IDF ชอบ B ก็ต่อเมื่อใช้ TF ดิบ · เรื่อง "25 = เวอร์ชันที่ 25" ไม่พบแหล่งปฐมภูมิ (Xapian ระบุว่า BM11 และ BM15 เป็นขั้นกลางที่ BM25 ผสมด้วย b) · Lucene 8 ตัด (k1+1) ออกจากตัวเศษ (อันดับเดิม ต่างแค่สเกล)

**เราคำนวณหรือเพิ่มเอง:** อนุพันธ์บนกระดานตรวจด้วยต่างจำกัด (0.207407 และ −0.266667 ที่ k 1.5, b 0.75, t 3, θ 2) · ความอิ่มตัวที่ k 1.5, b 0.75, idf 1, θ 1: tf 1 / 2 / 5 / 10 / 50 / 100 ได้ 1.000 / 1.429 / 1.923 / 2.174 / 2.427 / 2.463 (ขีดจำกัด 2.5) · ผลของความยาว θ 0.1 / 0.5 / 1 / 2 / 10 / 100 ได้ 1.681 / 1.290 / 1.000 / 0.690 / 0.198 / 0.022 · สมการ 29 บล็อก (รวมอนุพันธ์ทีละขั้นตามกฎผลหาร, IIR 84–86, IDF ของ Lucene) · ผังชั้น เทียบ A / B กราฟแท่ง และกราฟเส้นความอิ่มตัว / ความยาว (SVG ของผู้จัดทำ)

## yt:TW9vHU1GpU4 — Abhishek Thakur, A no nonsense intro to BM25

tags: `bm25` `vespa` `rank-profile` `bm25-k1` `bm25-b` `inverse-document-frequency` `lucene` `saturation` `length-normalization` `per-field-weights` `pyvespa` `keyword-search` `hybrid-search` `fact-checked`  
ใช้ในบท: ยังไม่ใช้ (เสนอ: 5.5 และบทใหม่ BM25 / hybrid; LLM manual G6)

**โหมดรายงาน:** iwd (ลึก วิเคราะห์) เรียบเรียงใหม่ด้วยคำของผู้จัดทำ ครบทุกประเด็น 12 ส่วน (license มาตรฐานของ YouTube; คำบรรยายอังกฤษอัตโนมัติ; ภาพ 18 ภาพ (สไลด์สูตร, schema ของ Vespa, โค้ด rank profile, UI, รายการผลที่มีคะแนน); ถอดโค้ดบนจอคำต่อคำ) · ภาพจากคลิป 18 ภาพ + SVG วาดเอง 1 ภาพ · สมการแสดงเป็น MathML 21 บล็อก ·
ตรวจข้อเท็จจริง 11 ข้อด้วยการค้นเว็บ (ยืนยัน 7 · บางส่วน 4 · ไม่พบ 0 · ขัดแย้ง 0) · สร้างใหม่ด้วย Opus (ชั้นสมการ MathML) · ผู้ตรวจอิสระ (Opus): PASS หลังแก้ข้อที่พบ · ไม่ได้เก็บ transcript ไว้ใน repo

**เสนอให้ใช้ (ยังไม่ได้แก้บท)**

- แหล่งสูตรหลักของไลบรารี: สไลด์ที่ใช้ IDF แบบ Lucene = ln(1 + (N − n + 0.5)/(n + 0.5)) (รูปที่เสนอให้ ZVect ใช้) พร้อมความหมายภาษาง่ายของ k1 (ต่ำ = ครั้งเดียวก็พอ, สูง = ซ้ำแล้วได้เพิ่ม) และ b (0 = ไม่สนความยาว, 1 = เต็ม); ค่าเริ่มต้นที่เขียนลงสเปก k1 1.2, b 0.75 (Vespa, Lucene, Elasticsearch) โดยความยาวนับเป็น token ของฟิลด์นั้น (ตัดคำไทยก่อน) และ N, n, avgdl มาจากคลังของเราเอง
- ถ่วงน้ำหนักตามฟิลด์: `bm25(text) + 0.1 * bm25(url)` ใช้กับหน้า Q&A ได้ด้วย (เนื้อหาบท + หัวข้อ: เนื้อหา + w × หัวข้อ, ปรับ w ด้วยชุดคำถามของเราเอง); BM25F เป็นรูปที่เป็นหลักการกว่า แต่ผลรวมถ่วงน้ำหนักของ bm25 สองตัวพอสำหรับรุ่นแรก
- ข้อควรระวังสำหรับ G6: เมื่อรวมคะแนน BM25 รายฟิลด์ที่ k1 ต่างกัน รูปที่มี (k1+1) กับรูปแบบ Lucene 8 เปลี่ยนน้ำหนักสัมพัทธ์ของฟิลด์ (ตัวคูณ 2.8 เทียบ 1.9) เนื้อหาต้องบอกว่าใช้รูปไหน · การปรับ k1 / b ในเดโมพิสูจน์เพียงว่าลำดับเปลี่ยน; ให้จูนด้วยชุดคำถามของเราเอง ไม่ใช่ด้วยความรู้สึก
- ชุดทดสอบของไลบรารี: ตาราง IDF ที่ N = 10 (n = 1, 3, 5, 6, 10: ตำรา 2.3026 / 1.2040 / 0.6931 / 0.5108 / 0.0000; RSJ 1.8458 / 0.7621 / 0.0000 / −0.3677 / −3.0445; Lucene 1.9924 / 1.1451 / 0.6931 / 0.5261 / 0.0465) และที่ N = 4,012,059

**แก้จากต้นฉบับ:** ผู้พูดบอก b ทั่วไป 0.7–0.9 (ค่าเริ่มต้นจริงในระบบคือ 0.75; Xapian ใช้ 0.5) · "BM25 ลงโทษเอกสารยาวเล็กน้อย" ขึ้นกับ b: ที่ b 0.75 เอกสารยาว 10 เท่าของค่าเฉลี่ยเหลือ 0.198 ของคะแนนที่ tf 1 · N ใน Vespa เป็นสถิติต่อ content node (ไม่เป็นปัญหากับเว็บไซต์เดียว) · การใช้ BM25 ใน hybrid / RAG ไม่ได้ตรวจกับแหล่งสาธารณะ · รายงานรุ่นแรกเขียนว่า "ไม่มีคะแนนในเดโม" ซึ่งผิด: ภาพผลลัพธ์ของแต่ละ profile มีคะแนนของ Vespa (ผลอันดับ 1 ของค่าเริ่มต้น 32.7054, text อย่างเดียว 31.8371, url อย่างเดียว 15.5547, profile ที่จูนแล้ว 41.257; 1469 hits) · ASR "BM35" / "PM25" = BM25, "VP" / "Vesper" = Vespa

**เราคำนวณหรือเพิ่มเอง:** ตาราง tf ที่ k1 1.2, b 0.75, idf 1, θ 1: tf 1 / 2 / 5 / 10 / 50 ได้ 1.000 / 1.375 / 1.774 / 1.964 / 2.148 (50 เทียบ 10 อัตราส่วน 1.094) · k1 0.3 เทียบ 3 ที่ tf 20 ได้ 1.281 เทียบ 3.478; k1 0 = ไบนารี 1.0 · IDF ที่ N = 4,012,059: n 1 → 14.7994, 100 → 10.5947, 10,000 → 5.9944, 1,000,000 → 1.3893, N/2 → 0.6931, N → 0.0000 · เอกสาร 200 ฉบับสุ่ม: ลำดับเท่ากันไม่ว่ามี (k1+1) หรือไม่ ต่างกันที่คะแนนคูณ k1+1 พอดี (2.2) · สมการ 21 บล็อก · ผังชั้น เทียบค่าเริ่มต้น / ที่จูน กราฟแท่ง IDF และความอิ่มตัว (SVG ของผู้จัดทำ)

## yt:fZH97QHHYjY — AI Engineer (Jo Kristian Bergum, Hornet.dev), The unreasonable effectiveness of BM25 for agentic search

tags: `bm25` `bm25-k1` `bm25-b` `inverse-document-frequency` `lucene` `anserini` `bm25s` `agent-search` `browsecomp-plus` `dr-dci` `grep` `ndcg` `evaluation` `keyword-search` `hornet` `fact-checked`  
ใช้ในบท: ยังไม่ใช้ (เสนอ: 5.5; LLM manual G6, G5)

**โหมดรายงาน:** iwd (ลึก วิเคราะห์) เรียบเรียงใหม่ด้วยคำของผู้จัดทำ ครบทุกประเด็น 15 ส่วน (license มาตรฐานของ YouTube; คำบรรยายอังกฤษอัตโนมัติ; ภาพ 17 ภาพ = สไลด์ทั้งหมด 01–17 (สไลด์ 18 เป็นหน้าติดต่อ จึงไม่แสดง); ถอดข้อความสไลด์ ตัวเลข และสตริงคำค้นคำต่อคำ) · ภาพจากคลิป 17 ภาพ + SVG วาดเอง 5 ภาพ · สมการแสดงเป็น MathML 19 บล็อก ·
ตรวจข้อเท็จจริง 16 ข้อด้วยการค้นเว็บ (ยืนยัน 11 · บางส่วน 3 · ไม่พบ 2 · ขัดแย้ง 0) · สร้างใหม่ด้วย Opus (ชั้นสมการ MathML) · ผู้ตรวจอิสระ (Opus): PASS หลังแก้ข้อที่พบ · ไม่ได้เก็บ transcript ไว้ใน repo

**เสนอให้ใช้ (ยังไม่ได้แก้บท)**

- เป็นการบรรยาย ไม่ใช่บทเรียน และไม่มีสูตรพูดหรือบนสไลด์: ใช้เฉพาะข้อโต้แย้ง "BM25 อันไหน" กับเรื่องความไวต่อ k1, b (สไลด์ k1 0.9, b 0.4 → 64.0% เทียบ k1 25, b 1 → 82.0%; อีกชุด 84.6 → 95.7) ไม่ใช่แหล่งสูตร (ใช้เอกสาร Lucene / ภาพของ Abhishek Thakur)
- ประโยคเดียวที่ควรใส่ในบท: ชื่อเดียวกันแต่ k1 / b / รูป IDF ต่างกัน — ระบุค่าเริ่มต้นของ ZVect ให้ชัด (เสนอ k1 1.2, b 0.75, IDF = ln(1 + …))
- คำเตือนสำหรับ G9 chunking: b = 1, k1 = 25 ที่จูนไว้ใช้กับเอกสารยาว ส่วน chunk ของเราสั้น ให้เริ่มจากค่าเริ่มต้นแล้วจูนกับชุดคำถามแยกของเราเอง
- หน้า Q&A: คำเฉพาะ / รหัสต้องจับแบบตรงตัว (ฝั่ง keyword ของ hybrid) และอธิบายได้ (ไฮไลต์คำที่ตรงในข้อความ "อ่านเพิ่ม"); G5 evaluation: การวัด nDCG แบบคำค้นเดียวยังใช้ได้กับหน้า Q&A คงที่ (ไม่มีวงวน agent) แต่ใส่ข้อสังเกตของผู้พูดไว้

**แก้จากต้นฉบับ:** ผู้พูดพูด "105,000" เอกสารซึ่งคลาดเคลื่อน ที่ถูกคือ 100,195 · "BM25 baseline แย่" ใน BrowseComp-Plus: ไม่ระบุ k1 / b; Pi-Serini ระบุ (0.9, 0.4) เป็นค่าเริ่มต้นของ Anserini · "experiment number 25" ไม่พบแหล่ง (BM = Best Match ยืนยัน) · ราว 4 ไบต์ต่อ token เป็นกฎคร่าว ๆ ที่ขึ้นกับ tokenizer · สถิติจำนวนคำค้นของ Hornet (2 / 10 / 19 คำ) และสไลด์ DR-DCI 61% เทียบ 45% ไม่พบแหล่ง · แผนภูมิ Hornet (100 ล้านเอกสาร, 1 node) เป็นข้ออ้างของผลิตภัณฑ์เขา และเขาแก้แกน y เองเป็น latency ไม่ใช่ QPS · พูด "BM35" ครั้งเดียว (3:03) · ASR "GPD5" = GPT-5, "GP" = grep

**เราคำนวณหรือเพิ่มเอง:** Lucene ตั้งแต่ 8 ตัด (k1+1) ออก (ค่าเริ่มต้น k1 1.2, b 0.75; อันดับเท่าเดิม ต่างแค่สเกล) · ครึ่งอิ่มตัวที่ tf = k1·L · สไลด์ floppy: 1.44 MB / 4 ไบต์ต่อ token ≈ 360K token; 350K–370K / 736M ≈ 0.048–0.050% · DCG / NDCG@k และตัวอย่างมือคำนวณ 1.789 / 2.131 · สมการ 19 บล็อก · ผังวงจรและกราฟแท่ง (SVG ของผู้จัดทำ)

## yt:XvKiTfd6Xvo — Dave Ebbelaar, The Complete Guide to Hybrid Search in RAG (BM25 + Embeddings + Reranker)

tags: `hybrid-search` `bm25` `bm25s` `lucene` `rrf` `reranking` `cross-encoder` `cohere-rerank` `text-embedding-3-small` `numpy` `ndcg` `beir` `fiqa` `synthetic-eval-set` `rag` `evaluation` `fact-checked`  
ใช้ในบท: ยังไม่ใช้ (เสนอ: 5.5, 8.3 และบทใหม่ hybrid; LLM manual G6, G5)

**โหมดรายงาน:** iwd (ลึก วิเคราะห์) เรียบเรียงใหม่ด้วยคำของผู้จัดทำ ครบทุกประเด็น 18 ส่วน (license มาตรฐานของ YouTube; คำบรรยายอังกฤษอัตโนมัติ; ภาพ 23 ภาพ (โค้ด, หน้า docs ที่โชว์ในคลิป: bm25.md ~17:52, embeddings.md ~34:40, rrf.md ~37:55, ndcg.md ~50:10, ตาราง NDCG); ตัดโฆษณา 2 ช่วง (22:09–23:39 และ 58:29–59:00)) · ภาพจากคลิป 23 ภาพ + SVG วาดเอง 4 ภาพ · สมการแสดงเป็น MathML 41 บล็อก ·
ตรวจข้อเท็จจริง 15 ข้อด้วยการค้นเว็บ (ยืนยัน 8 · บางส่วน 5 · ไม่พบ 0 · ขัดแย้ง 2) · สร้างใหม่ด้วย Opus (ชั้นสมการ MathML) · ผู้ตรวจอิสระ (Opus): PASS หลังแก้ข้อที่พบ · ไม่ได้เก็บ transcript ไว้ใน repo

**เสนอให้ใช้ (ยังไม่ได้แก้บท)**

- LLM manual G6: hybrid ครบวงในราว 100 บรรทัด (ตัดคำ → BM25 → dense → RRF k = 60 → rerank → NDCG@10) ตรงกับขั้นของหน้า Q&A ยกเว้น rerank; ใช้ BM25 ด้วย bm25s ที่ index ใน 1–2 วินาที ไม่ต้องมีฐานข้อมูล และ dense ด้วย numpy dot product สำหรับต่ำกว่าราว 1 ล้าน chunk
- กล่องในบท "fusion ไม่ได้ชนะ retriever เดี่ยวที่ดีที่สุดเสมอ": NDCG@10 ×100 บน 50 คำถามสุ่ม (seed 42): BM25 28.01, dense 40.06, RRF 33.72, RRF + rerank 47.71 — ในข้อมูลนี้ RRF ต่ำกว่า dense เดี่ยว ๆ (ผู้พูดว่า RRF "อยู่ตรงกลาง")
- สูตรประเมินที่ยืมได้สำหรับ Q&A (G5): คู่คำถาม–เอกสารที่เกี่ยวข้อง + NDCG@10; สร้างคำถามสังเคราะห์จากแต่ละย่อหน้าด้วย LLM ตอนสร้างข้อมูลเท่านั้น (กติกา "ไม่ใช้ LLM ภายนอกตอนรัน" ยังเดิม)
- ไลบรารีของเรา: ระบุว่าอันดับเท่ากันไม่ว่ามี (k1+1) หรือไม่; ความเสี่ยงหลักของการพอร์ตคือ tokenization (สูตรภาษาอังกฤษ = lowercase + ตัดเครื่องหมาย + stop words; ภาษาไทยต้องมีตัวตัดคำ)

**แก้จากต้นฉบับ:** รูปใน docs/rrf.md: #406219 ถูกพิมพ์ 0.0246 แต่จากอันดับของรูปเองคือ 1/63 + 1/64 = 0.031498 (≈ 0.0315) ไม่มีอันดับจำนวนเต็มใดให้ 0.0246; ลำดับไม่เปลี่ยน · docs/bm25.md เขียนสูตรมี (k1+1) แต่โค้ดรันรูป Lucene ที่ไม่มี · ที่ว่า "k1 = 1.5, b = 0.75 มาจาก paper BM25 ต้นฉบับ" ไม่ตรง (ค่าเริ่มต้นของ Lucene / Elasticsearch คือ k1 = 1.2) · "cosine อยู่ใน [0, 1]" ที่ถูกคือ [−1, 1] · ที่ผู้พูดจำว่า 1,700 query คือแถว qrels 1,706 แถว (query ที่มีลิงก์ 648) · 350 MB สำหรับ 56,000 เอกสาร: จริง 354 MB / 57,638 เอกสาร · รูป docs ว่าการตัดคำทิ้ง where / should / my แต่โทเค็นบนจอเก็บ where / should / my (ทิ้งแค่ "I") — กระทบข้ออ้างเรื่อง stop list · BM25 บน FiQA ใน BEIR = 0.236 nDCG@10 (ต่างจาก 28.01 ที่นี่เพราะสุ่มตัวอย่างต่างกัน) · ASR "BEAR" = BEIR, "RLs" = qrels

**เราคำนวณหรือเพิ่มเอง:** คำนวณเอาต์พุต RRF สดจาก 4-rrf.py ใหม่ (~43:10): 32833 (อันดับ 2 + 2) = 0.032258; 497993 = dense 4 + BM25 6 = 0.030777; 376148 = BM25 1 + dense 29 = 0.027629 (อันดับที่ไม่เห็นบนจอสรุปจากที่เหลือพอดี ติดป้ายในรายงาน) ใช้เป็นชุดทดสอบ RRF ของไลบรารี (อันดับเริ่มที่ 1, ไม่มีในลิสต์ = 0, k = 60, candidate_k = 50) · ตัวอย่างหนึ่งเทอมจาก docs: 10.2838 เทียบ Lucene 4.1135 (อัตราส่วน k1+1) · สมการ 41 บล็อก (bm25s ทุกแบบ: lucene / robertson / atire / bm25l / bm25+, cosine, NDCG) · ผังชั้นและกราฟแท่ง (SVG ของผู้จัดทำ)

## yt:BwgBU0CekFk — IT AI Enthusiast (Mayank Chugh), RAG Fusion Explained: Reciprocal Rank Fusion (RRF) With Real Code

tags: `rag-fusion` `rrf` `multi-query` `langchain` `chroma` `bge` `sigir-2009` `letor-3` `combmnz` `condorcet` `rank-fusion` `hybrid-search` `fact-checked`  
ใช้ในบท: ยังไม่ใช้ (เสนอ: บทใหม่ hybrid ต่อจาก 5.5; LLM manual G6)

**โหมดรายงาน:** iwd (ลึก วิเคราะห์) เรียบเรียงใหม่ด้วยคำของผู้จัดทำ ครบทุกประเด็น 15 ส่วน (license มาตรฐานของ YouTube; คำบรรยายอังกฤษอัตโนมัติ; ภาพ 13 ภาพ (รวมโค้ด RRF ของ notebook ถอดคำต่อคำ)) · ภาพจากคลิป 13 ภาพ + SVG วาดเอง 3 ภาพ · สมการแสดงเป็น MathML 19 บล็อก ·
ตรวจข้อเท็จจริง 12 ข้อด้วยการค้นเว็บ (ยืนยัน 7 · บางส่วน 3 · ไม่พบ 0 · ขัดแย้ง 2) · สร้างใหม่ด้วย Opus (ชั้นสมการ MathML) · ผู้ตรวจอิสระ (Opus): PASS หลังแก้ข้อที่พบ · ไม่ได้เก็บ transcript ไว้ใน repo

**เสนอให้ใช้ (ยังไม่ได้แก้บท)**

- เรื่องเล่า "ทำไมต้อง fuse" (หลายอันดับของคลังเดียวกัน, RRF ใช้แค่อันดับ, ไม่ผูกกับ retriever ใด) และสูตรตัวอักษรกับ k = 60 "ตาม paper"; ไม่ใช่แหล่งตัวเลข (ใช้ตัวอย่างของ Harish Neel คลิป #15 กับตัวอย่างของ Elasticsearch)
- หน้า Q&A: เรา fuse 2 ลิสต์ (BM25 กับ TF-IDF + SVD) ไม่ใช่ 4 query ที่ LLM เขียน — ฟังก์ชัน RRF ตัวเดียวกัน (ลิสต์ของ id, k = 60); ส่วน multi-query ต้องใช้ LLM จึงอยู่นอกขอบเขตของหน้าที่ไม่ใช้ LLM แต่มีคู่ที่ไม่ใช้ LLM คือ query หลายแบบที่สร้างด้วยกฎ (ต้นฉบับ / stem หรือขยายคำพ้อง / ตัดคำไทย) จัดอันดับด้วย BM25 แล้ว fuse — ต้องถามเจ้าของก่อนทำ
- กฎการกำจัดซ้ำที่ควรลอก: key = id ที่คงที่ของ chunk ไม่ใช่เอกลักษณ์ของ object; อ้าง paper โดยตรง (Cormack, Clarke, Buettcher, SIGIR 2009, หน้า 758–759) อย่าลอกข้ออ้างจากคลิป

**แก้จากต้นฉบับ:** โค้ด notebook ใช้ `enumerate(docs)` ที่เริ่ม 0 จึงคำนวณ 1/(k + rank − 1) (เท่ากับ k = 59) ทั้งที่คอมเมนต์อ้างสูตรใน paper (rank เริ่ม 1) · "ดีกว่า Condorcet, CombMNZ และระบบที่ดีที่สุดราว 4–5% บน TREC": ประโยค "4% to 5% on average" มีใน paper แต่รวมการทดลองนำร่อง ส่วนตาราง 2 ล้วน ๆ เฉลี่ยราว 3% (เทียบ Condorcet +2.9%, CombMNZ +3.3%, ระบบอัตโนมัติที่ดีที่สุด +3.5%) และไม่สม่ำเสมอต่อชุดข้อมูล · "ผลดีที่สุดของทุกวิธีที่ทดสอบ" ผิด: CombMNZ ได้ 0.6107 สูงกว่า RRF 0.6051 (LETOR 3 MAP) · สไลด์ "LLM: Gemini 2. Pro" แต่ที่รันจริงคือ Qwen3-4B-Instruct-2507 · "fuse วิธี rank-learning 7 วิธี" ที่ paper นับ 7 คือชุดคู่เอกสาร–คำค้นของ LETOR 3 ที่รวมกัน · ASR "rack" = RAG, "RF" = RRF, "TRC 359" = TREC 3, 5, 9 · ตัวเลขจาก paper อ่านผ่านสรุปของเครื่องมืออ่านเว็บ (PDF เต็มเปิดตรงไม่ได้) ควรเปิด PDF ตรวจก่อนอ้าง

**เราคำนวณหรือเพิ่มเอง:** ผลปรับปรุงของ RRF บน LETOR 3 เทียบวิธีเดี่ยวที่ดีที่สุด (ListNet 0.5846) = 3.5% (0.0205 MAP) · Table 1 ของ paper (ทดลอง k): k 0 → .2072, k 60 → .2145, k 80 → .2147 (สูงสุด), k 500 → .2098 · Table 3 LETOR 3: RRF 0.6051, CombMNZ 0.6107, Condorcet 0.5917, ListNet 0.5846 · สมการ 19 บล็อก · ผัง flow และกราฟแท่ง MAP (SVG ของผู้จัดทำ) · 4 query ที่ LLM เขียนอ่านได้จาก notebook (ราคาตั๋ว / จุดท่องเที่ยว / ใกล้ฉัน / แพ็กเกจวันหยุด)

## yt:1qQCuWiRIfA — Harish Neel | AI, RAG Tutorial 2026 #15: Reciprocal Rank Fusion for Enhanced RAG Performance

tags: `rrf` `rank-fusion` `multi-query` `rag` `worked-example` `k-60` `weighted-rrf` `tie-break` `chunk-dedup` `fact-checked`  
ใช้ในบท: ยังไม่ใช้ (เสนอ: บทใหม่ hybrid ต่อจาก 5.5; LLM manual G6)

**โหมดรายงาน:** iwd (ลึก วิเคราะห์) เรียบเรียงใหม่ด้วยคำของผู้จัดทำ ครบทุกประเด็น 13 ส่วน (license มาตรฐานของ YouTube; คำบรรยายอังกฤษอัตโนมัติ; ภาพ 12 ภาพ ตัดกล้องผู้พูดออก; ตัดการโปรโมตคอร์สท้ายคำอธิบาย) · ภาพจากคลิป 12 ภาพ + SVG วาดเอง 2 ภาพ · สมการแสดงเป็น MathML 40 บล็อก ·
ตรวจข้อเท็จจริง 7 ข้อด้วยการค้นเว็บ (ยืนยัน 4 · บางส่วน 2 · ไม่พบ 0 · ขัดแย้ง 1) · สร้างใหม่ด้วย Opus (ชั้นสมการ MathML) · ผู้ตรวจอิสระ (Opus): PASS หลังแก้ข้อที่พบ · ไม่ได้เก็บ transcript ไว้ใน repo

**เสนอให้ใช้ (ยังไม่ได้แก้บท)**

- แหล่งที่ดีที่สุดสำหรับบท RRF ที่คำนวณมือได้: ตาราง 7 แถวของสองลิสต์ (X, Y, Z, W, V กับ Y, X, A, B, Z) ที่ k = 0 เทียบ k = 60 เคียงกัน (ลำดับเดิม ช่องว่างต่างกัน) พร้อมข้อโต้แย้ง "k = 0 แรงเกินไป" และตัวอย่าง P / Q ที่ k พลิกผู้ชนะ; ทุกตัวเลขคำนวณใหม่ตรงกัน
- กรณีขอบที่ต้องกำหนดในไลบรารีก่อนเขียนโค้ด (คลิปไม่พูด): (ก) รายการอยู่ในลิสต์เดียวได้แค่พจน์เดียว; (ข) เสมอ — X = Y และ W = B เสมอทุก k และเส้นตัดอันดับที่ 5 ตกกลางคู่ W / B จึงต้องมีกติกา tie-break ที่แน่นอน (เสนอ: อันดับเดี่ยวที่ดีที่สุด แล้วค่อย id ที่น้อยกว่า) พร้อมทดสอบ; (ค) k = 60 ตามค่าเริ่มต้นของ Elasticsearch, Azure, LangChain และ pilot ของ paper แต่ลิสต์ 2 ชุดชุดละราว 10 รายการที่ k = 60 ทำให้คะแนนเกือบแบน (อัตราส่วน 1.016) จึงเสี่ยงเสมอ; (ง) อันดับเริ่มที่ 1; (จ) ตัดความยาวลิสต์ (เสนอ top 50–100)
- รุ่นถ่วงน้ำหนัก (ไม่อยู่ในคลิป): LangChain ใช้ weight/(rank + c), Azure คูณก่อน RRF, Elasticsearch ถ่วงเท่ากัน (มี `weight` ค่าเริ่มต้น 1.0 ใน 9.x); ถ่วง (2, 1) ทำลายการเสมอของ X / Y; หน้า Q&A เริ่มจากน้ำหนักเท่ากัน แล้วมีปุ่มถ่วง BM25 กับลิสต์ latent เป็นทางเลือก
- ชุดทดสอบของไลบรารี: (1) ตาราง 7 แถวทั้ง k; (2) ตัวอย่าง Elasticsearch k = 1 (0.8333 / 0.5833 / 0.5 / 0.45 / 0.2); (3) การรันโค้ด 3 ลิสต์ที่ประกอบกลับจาก log (0.0487 / 0.0476 / 0.0474 / 0.0315 / 0.0310 ตรงกับจอ); (4) four friends ทั้ง k = 60 และ k = 0 กับกรณีถ่วงที่ Tacos = Pizza พอดี; (5) P / Q พลิก; (6) ถ่วง (2, 1) และ (1, 2); (7) อันดับ 0-based เทียบ 1-based (k 59 เทียบ 60) เป็น regression test

**แก้จากต้นฉบับ:** ASR เขียน "K=0" ตรงที่ผู้พูดหมายถึง 60 ตอนสรุป, "dog X / dog C" = chunk X / Z, "0.003" และ "K equals five" เป็นการพูดพลาด · "ผลิตภัณฑ์ส่วนใหญ่ใช้ k = 60 เสมอ" ได้เพียงบางส่วน (Elasticsearch ค่าเริ่มต้น 60 ปรับได้ ต่ำสุด 1; paper ตรึง 60 ใน pilot) · สไลด์ "RRF Calculation (Simple Version)" และ "Real-World Issue" ถูกถอดแล้ว

**เราคำนวณหรือเพิ่มเอง:** ทุกแถวของตารางสองตาราง (k = 0 และ k = 60 ครบ 7 chunk) แสดงเป็นการแทนค่า รวมสูตรโทษและอัตราส่วน · สูตรถ่วงน้ำหนัก RRF_w = Σ w_r/(k + rank) เป็นของผู้จัดทำ · สมการ 40 บล็อก · ผัง flow และกราฟแท่งคะแนน k = 60 (SVG ของผู้จัดทำ)

## yt:7WEtNxVh1vo — Harish Neel | AI, RAG Tutorial 2026 #16: Hybrid Search combining Vector and Keyword Search

tags: `hybrid-search` `bm25` `rank-bm25` `tf-idf` `weighted-rrf` `ensemble-retriever` `langchain` `chroma` `reranking` `multi-query` `rag` `keyword-search` `vector-search` `fact-checked`  
ใช้ในบท: ยังไม่ใช้ (เสนอ: 5.5 และบทใหม่ hybrid; LLM manual G6)

**โหมดรายงาน:** iwd (ลึก วิเคราะห์) เรียบเรียงใหม่ด้วยคำของผู้จัดทำ ครบทุกประเด็น 15 ส่วน (license มาตรฐานของ YouTube; คำบรรยายอังกฤษอัตโนมัติ; ภาพ 12 ภาพ (สไลด์ปัญหา, BM25, "why both", weighted RRF, ทุก cell ของ notebook); ตัดการโปรโมตคอร์สและท้ายคลิป) · ภาพจากคลิป 12 ภาพ + SVG วาดเอง 6 ภาพ · สมการแสดงเป็น MathML 49 บล็อก ·
ตรวจข้อเท็จจริง 13 ข้อด้วยการค้นเว็บ (ยืนยัน 8 · บางส่วน 4 · ไม่พบ 1 · ขัดแย้ง 0) · สร้างใหม่ด้วย Opus (ชั้นสมการ MathML) · ผู้ตรวจอิสระ (Opus): PASS หลังแก้ข้อที่พบ · ไม่ได้เก็บ transcript ไว้ใน repo

**เสนอให้ใช้ (ยังไม่ได้แก้บท)**

- บท 5.5 ค้นด้วยคำ vs ความหมาย: คลิปเพิ่ม (ก) ตัวอย่างล้มเหลวทั้งสองทิศเป็นคู่ (คำตรง "API key authentication" ที่ vector พลาด; car / automobile และ "space exploration company" ที่ keyword พลาด SpaceX) (ข) hybrid ที่รวมสองฝั่ง (ค) ขั้น fusion แบบถ่วงน้ำหนักที่คำนวณมือได้ — เสนอกล่องท้าย 5.5 หรือบทสั้น "ค้นแบบผสม (hybrid)" พร้อมตาราง 7 แถว ถ่วง 0.7 / 0.3 เคียงน้ำหนักเท่ากัน และ widget สไลเดอร์ (น้ำหนัก, k) ที่จัดอันดับ X … B ใหม่แบบสด
- หน้า Q&A (LLM manual G6): ท่อ query → ลิสต์ BM25 + ลิสต์ latent → weighted RRF (k = 60) → chunk บนสุด → คำตอบแบบ extractive; ค่าที่ต้องกำหนดก่อนเขียน: น้ำหนักเท่ากันก่อน (เดโมของคลิปเองใช้ 0.5 / 0.5) แล้วมีปุ่มถ่วง, กติกา tie-break, ตัดแต่ละลิสต์ top 50, กำจัดซ้ำด้วย id ของ chunk
- ภาษาไทย: BM25Retriever ตั้งต้นแยกคำด้วยช่องว่าง จึงต้องตัดคำก่อน; ตัวอย่าง "Tesla's" ≠ "Tesla" ทำให้ตัวอย่าง TF บนสไลด์พลิก (B ชนะ 1.2093 เทียบ 0.8525) เป็นเหตุผลในห้องเรียนที่หนักแน่นที่สุดว่าต้องตัดคำก่อน BM25
- ชุดทดสอบ: ตาราง weighted RRF 0.7 / 0.3 กับน้ำหนักเท่ากัน, คุณสมบัติ "เอกสารที่อยู่ในสองลิสต์ได้ราว 1.5 เท่า", ขนาดการรวม (k_vec + k_bm25 − ซ้ำ), คลัง 18 chunk ของคลิปสำหรับ BM25Okapi (token แยกด้วยช่องว่าง, k1 1.5, b 0.75)

**แก้จากต้นฉบับ:** ถ่วง 0.7 / 0.3 ที่ตัวเศษ ไม่ใช่ตัวคูณของคะแนนดิบ และไม่มี alpha / min-max ในแหล่งนี้ (Weaviate relativeScoreFusion ใช้ alpha + min-max แต่คลิปไม่สอน) · "จำกัดไว้ 2 chunk" ตอน 14:29 คือ `test_docs[:2]` ใน cell ไม่ใช่การพูดพลาด · RRF เองไม่ตัดลิสต์: ลิสต์ 50 สองชุดให้ 50–100 chunk ที่ไม่ซ้ำ "ราว 30" บนสไลด์จึงหมายถึงการตัดที่ไม่ได้ระบุ · IDF ของ rank_bm25 คือรูป Robertson–Spärck Jones ไม่มี +1 พร้อมค่าพื้น epsilon (ไม่ใช่รูป Lucene) · "accuracy เพิ่มอย่างน้อย 70%" เป็นเรื่องเล่า ไม่มีตัวชี้วัด; ข้ออ้าง Google / Amazon "keyword search" ย่อเกินไป; ที่ Microsoft Copilot ใช้ hybrid ได้เพียงบางส่วน · ASR "Cybert truck" = Cybertruck, "jarens" = jargon, "coher/go here" = Cohere

**เราคำนวณหรือเพิ่มเอง:** BM25Okapi บน 18 chunk ของคลิปทำซ้ำทุก printout: "Tesla" ได้ 2.5052 / 1.9684 / 1.6035 (ที่ผู้พูดว่า "เกือบเสมอ" ถูกแยกด้วยการ normalise ความยาว); "space exploration company" ตรงเฉพาะคำ "company" (1.8147 เทียบ 1.4364 เสมอ) · ลำดับที่พิมพ์ของ query 2 ทำซ้ำได้ด้วย RRF 0.5 / 0.5 ถ้าลิสต์ vector ที่มองไม่เห็นคือ [Tesla Cybertruck production, Cybertruck reservations] (0.016133 / 0.016129 / 0.008197) · ทั้ง 10 cell ต่อลิสต์และ 7 ผลรวมของตารางถ่วงน้ำหนักคำนวณซ้ำได้ (ส่วนที่ถูกกล้องบังเติมแล้ว) · สมการ 49 บล็อก · ผัง flow และกราฟแท่งคะแนน (SVG ของผู้จัดทำ 6 ภาพ)

## yt:VWA15n6uiS4 — Harish Neel | AI, RAG Tutorial 2026 #17: RAG Reranking and Next Steps!

tags: `reranking` `cross-encoder` `bi-encoder` `rag` `hybrid-search` `rrf` `cohere-rerank` `langchain` `two-stage-retrieval` `retrieve-then-rerank` `top-n` `fact-checked`  
ใช้ในบท: ยังไม่ใช้ (เสนอ: 8.3 ลิงก์อ่านเพิ่ม; LLM manual G6)

**โหมดรายงาน:** iwd (ลึก วิเคราะห์) เรียบเรียงใหม่ด้วยคำของผู้จัดทำ ครบทุกประเด็น 7 ส่วน (license มาตรฐานของ YouTube; คำบรรยายอังกฤษอัตโนมัติ; ตัดการโปรโมตคอร์สท้ายคำอธิบาย; ผลลัพธ์ก่อน / หลัง rerank อ่านจากภาพ) · ภาพจากคลิป 5 ภาพ + SVG วาดเอง 4 ภาพ ·
ตรวจข้อเท็จจริง 12 ข้อด้วยการค้นเว็บ (ยืนยัน 6 · บางส่วน 3 · ไม่พบ 2 · ขัดแย้ง 1) · สร้างโดย Sonnet worker · ผู้ตรวจอิสระ (Opus): PASS หลังแก้ข้อที่พบ · ไม่ได้เก็บ transcript ไว้ใน repo

**เสนอให้ใช้ (ยังไม่ได้แก้บท)**

- ไม่ซ้ำกับบท 8.3 (bi-encoder vs cross-encoder, ตัวอย่าง negation 4 ภาษา และต้นทุน O(n) มีแล้ว) ของใหม่ในคลิป: (ก) ตำแหน่งของ reranker ในท่อ hybrid เต็ม (multi-query → hybrid → RRF → RRF ข้าม query → rerank → LLM) พร้อมบันไดจำนวน 50 → 35 → 25 → 10 (ตัวเลขสมมติ ต้องติดป้าย "ตัวอย่างสมมติ"); (ข) ตัวอย่าง faucet ตอบว่าทำไมไม่เอา top 10 หลัง RRF เลย (คะแนนความคล้ายของ chunk ที่ตอบตรงกับ chunk ที่แค่เกี่ยวข้องใกล้เกินจะเชื่อลำดับ); (ค) กฎ "ไม่จำเป็นเมื่อเหลือ 5–10 chunk หรือคลังเล็ก"; (ง) ตารางก่อน / หลังบนคลังเล็กพร้อมคำเตือนว่ารันครั้งเดียวไม่พิสูจน์อะไร
- หน้า Q&A ไม่ใช้ reranker แบบ neural แต่ใช้แนวสองขั้นได้: ขั้น 1 = BM25 + ลิสต์ latent รวมด้วย RRF (top ราว 25) ขั้น 2 = ตัวให้คะแนนใหม่แบบเบาที่ไม่พึ่ง dependency (เช่นโบนัสวลีตรง / ความใกล้ หรือ cross-encoder ของเล่นจาก 8.3) เฉพาะ chunk เหล่านั้นเพื่อเลือกประโยคของคำตอบ; ข้ามขั้น 2 เมื่อลิสต์ที่ fuse แล้วไม่เกินจำนวนที่จะแสดง
- ใช้ figure ผังท่อ (SVG ของเรา) เป็นต้นแบบถ้าเขียนกล่องเรื่องท่อ; ส่วนโค้ด LangChain + Cohere ราว 10 นาทีไม่มีคุณค่าต่อ ZVect นอกจากตารางก่อน / หลัง

**แก้จากต้นฉบับ:** "tsvector เป็น extension ของ Postgres" ผิด: tsvector เป็นชนิดข้อมูลในตัวของ PostgreSQL (pgvector ต่างหากที่เป็น extension) และ `ts_rank` ไม่มี IDF จึงไม่ใช่ BM25 · อย่าเอา 0.78 (cosine ของ bi-encoder) มาเทียบกับ 0.12 (relevance ของ cross-encoder) เป็นตัวเลขเดียวกัน คนละสเกล · ตารางก่อน / หลังบนจอมีป้าย "Top 3" แต่แสดง 5 แถว และผู้พูดเอ่ยแค่ Gigafactory 2 → 4 กับ revenue 3 → 2 ไม่เอ่ยว่า chunk ราคาหุ้นหลุด top 5 และ energy storage +40% เข้า · "reranker โอเพนซอร์สดีกว่า Cohere" และ "reranker อยู่ระหว่าง embedding กับ LLM" ไม่พบแหล่ง · rerank-english-v3.0 ไม่ใช่รุ่นเดียวของ Cohere (มี rerank-v3.5, rerank-v4.0 ตามมา) · trial key ของ Cohere: Rerank 10 req/นาที, 1,000 calls/เดือน

**เราคำนวณหรือเพิ่มเอง:** ผัง pipeline, กราฟแท่งคะแนน faucet และรูปเปรียบเทียบ bi / cross-encoder 2 รูป (SVG ของผู้จัดทำ) · ตรวจกับเอกสาร SBERT, Cohere, README ของ pgvector และเอกสาร PostgreSQL ผ่านสรุปของเครื่องมืออ่านเว็บ

## yt:-f_i_a13IKc — mikelopster, LLM (Generative AI) คืออะไร ?

tags: `llm` `generative-ai` `neural-network` `encoder-decoder` `transformer` `attention` `rnn` `next-token` `in-context-learning` `prompting` `pretraining` `instruction-tuning` `rlhf` `multimodal` `explanation-flow` `storytelling` `thai` `typhoon` `fact-checked`  
ใช้ในบท: ยังไม่ใช้ (เสนอ: 10.1 และข้อความนำของบทเรียน; LLM manual G1, G2)

**โหมดรายงาน:** iwd (ลึก วิเคราะห์) เรียบเรียงใหม่ด้วยคำของผู้จัดทำ ครบทุกประเด็น 13 ส่วน (license มาตรฐานของ YouTube; คำบรรยายภาษาไทยที่ทำด้วยคน; ภาพกระดานและสไลด์ 7 ภาพ; ช่วงที่ฟังไม่ชัดทำเครื่องหมาย [ฟังไม่ชัด] ในรายงาน) · ภาพจากคลิป 7 ภาพ + SVG วาดเอง 3 ภาพ ·
ตรวจข้อเท็จจริง 12 ข้อด้วยการค้นเว็บ (ยืนยัน 5 · บางส่วน 6 · ไม่พบ 1 · ขัดแย้ง 0) · สร้างโดย Sonnet worker · ผู้ตรวจอิสระ (Opus): 15 ควรแก้ 6 nit แก้ครบ PASS (คำตัดสินข้อ Bard เปลี่ยนจากขัดแย้งเป็นไม่พบ) · ไม่ได้เก็บ transcript ไว้ใน repo

**เสนอให้ใช้ (ยังไม่ได้แก้บท)**

- แม่แบบ "flow การเล่าให้เข้าใจง่าย" 15 ขั้น (ส่วนสุดท้ายของรายงาน; เป็นการอ่านของผู้จัดทำ ไม่ใช่คำพูดของผู้พูด) สำหรับข้อความนำของบทเรียนและของแต่ละตอนใน LLM manual: ชื่อที่คนรู้จัก → คำถามเดียวที่ผู้เรียนรู้สึกได้ → ตัวอย่างเดียวที่ใช้ตลอดบท เพิ่มชิ้นทีละชิ้น → ตั้งชื่อหลังเห็นภาพ → สูตรหลังตัวอย่าง (สูตรคือประโยคเดียวที่เขียนเป็นสัญลักษณ์) → ลองเอง + คำถามค้างไว้ → สรุปตามลำดับเดิม; ควรลองกับ 1 บทเรียนและ 1 ตอนของ manual ก่อนใช้จริง และเทียบกับข้อความปัจจุบัน
- ลำดับ Encoder → Decoder → vector → weight vector ("พจนานุกรม") → คะแนน 0.1 / 0.4 / 0.5 → "cat" เป็นบทนำสำเร็จรูปของ 10.1 แต่ต้องใส่ข้อแก้: Transformer ต้นฉบับเป็น encoder-decoder ส่วน LLM สมัยนี้ส่วนมากเป็น decoder-only และ Encoder → weight → Decoder เป็นภาพประกอบ
- ภาพรวมภาษาไทยของ Pretrained → Instruct → RLHF → Multimodal สำหรับ LLM manual G1 (pre-training) และ G2 (post-training) ใช้ร่วมกับข้อแก้จากการตรวจ: ขั้นมนุษย์ของ InstructGPT คือจัดอันดับคำตอบเพื่อฝึก reward model ไม่ใช่การกดปุ่มแล้ว model อัปเดตทันที, GPT-4 ไม่เปิดเผยขนาด (1.4 ล้านล้านเป็นตัวเลขของผู้พูด), ตัวเลขพารามิเตอร์ "Bard 300 ล้าน" ไม่พบในแหล่งที่อ่าน
- อุปมาที่ใช้ซ้ำได้ในภาษาไทย: พจนานุกรม (weight), ส่งไปโรงเรียน (ฝึกใหม่), "รู้เยอะแต่ไม่รู้ถูกผิด" (pretrained), ทารกร้องไห้แล้วได้นม (reward); Typhoon-7B (SCB 10X, ฐาน Mistral-7B, Apache 2.0) เป็นตัวอย่าง model เปิดภาษาไทยสำหรับขั้น "ลองเอง"
- ไม่ครอบคลุม: inference (sampling, logits, KV cache) = G3, evaluation = G5 และสูตร attention; ต้องใช้แหล่งอื่นคู่กัน

**แก้จากต้นฉบับ:** "Bard 300+ ล้านพารามิเตอร์" ไม่พบในแหล่งที่อ่าน (Google บอกว่า Bard เริ่มด้วย LaMDA รุ่นเบา ไม่ระบุขนาด; LaMDA ที่เล็กสุดในรายงานคือ 2 พันล้าน) · ภาพ Encoder → weight vector → Decoder ภาพเดียวเป็นภาพประกอบ ไม่ใช่โครงสร้างจริงของ LLM · ขั้นมนุษย์ใน InstructGPT คือจัดอันดับเพื่อฝึก reward model ไม่ใช่การกด "bad response" · GPT-4 "ราว 1.4 ล้านล้าน" เป็นตัวเลขของผู้พูดเอง OpenAI ไม่เปิดเผยขนาด · "unsupervised" ที่ผู้พูดพูดตรงกับ "self-supervised" บนภาพที่เขาโชว์ · ASR อ่านชื่อ model ตัวหนึ่งเป็น "DALL-E 2" น่าจะเป็น Dolly 2 · หน้า Sora ของ OpenAI (อ่าน 2026-10-13) บอกว่าไม่มีให้ใช้แล้วตั้งแต่ 2026-04-26

**เราคำนวณหรือเพิ่มเอง:** Quick reference ตัวเลข: GPT-2 1.5 พันล้าน / GPT-3 175 พันล้านพารามิเตอร์ (ยืนยันจาก Wikipedia) · Typhoon-7B (Mistral-7B ฐาน, Apache 2.0, SCB 10X) ตรวจกับบล็อกของ SCB 10X · ตาราง 3 ขั้น Pretrained / Instruct / RL ในรายงาน · แม่แบบ flow 15 ขั้นพร้อมนาทีในคลิป (ส่วนที่ 13 ของรายงาน) · ผังลำดับ แท่ง และผัง flow (SVG ของผู้จัดทำ 3 ภาพ)

## yt:YHNi88FaGug — Harish Neel | AI, LLM Fundamentals Crash Course For Beginners 2026

tags: `llm` `tokens` `tokenization` `context-window` `next-token` `temperature` `softmax` `prompting` `zero-shot` `few-shot` `chain-of-thought` `system-prompt` `structured-output` `tool-calling` `agents` `openai-api` `streaming` `tiktoken` `fact-checked`  
ใช้ในบท: ยังไม่ใช้ (เสนอ: 3.1, 3.4 กล่อง "ลองนับ token จริง"; LLM manual G3, G7)

**โหมดรายงาน:** iwd (ลึก วิเคราะห์) เรียบเรียงใหม่ด้วยคำของผู้จัดทำ ครบทุกประเด็น 12 ส่วน (license มาตรฐานของ YouTube; คำบรรยายอังกฤษอัตโนมัติอย่างเดียว; ภาพสไลด์และโค้ด 7 ภาพ; ตัดโฆษณาคอร์สและคำชวน subscribe) · ภาพจากคลิป 7 ภาพ + SVG วาดเอง 4 ภาพ · สมการแสดงเป็น MathML 4 บล็อก ·
ตรวจข้อเท็จจริง 17 ข้อด้วยการค้นเว็บ (ยืนยัน 7 · บางส่วน 6 · ไม่พบ 1 · ขัดแย้ง 3) · สร้างโดย Sonnet worker · ผู้ตรวจอิสระ (Opus): PASS หลังแก้ข้อที่พบ · ไม่ได้เก็บ transcript ไว้ใน repo

**เสนอให้ใช้ (ยังไม่ได้แก้บท)**

- แหล่ง "ใช้ LLM แบบประยุกต์" ระดับเริ่มต้นสำหรับ LLM manual (ผู้พูดข้าม internal ตั้งใจ): ใช้ส่วน API, structured output, payload และ tool call (ส่วนที่ 9–12 ของรายงาน) เป็นตอน "ใช้ LLM ผ่าน API" ภาษาไทย พร้อมผัง tool call 5 ขั้นของเรา และเปรียบเทียบ Pydantic; ถ้า manual ต้องไม่ผูกกับผู้ให้บริการ ให้เขียนใหม่รอบ "รายการ message + tools + call id" ไม่ใช้ชื่อฟิลด์ของ OpenAI
- กล่อง "ลองนับ token จริง" ใน 3.1 / 3.4 ใช้ตัวเลขที่เรารัน tiktoken เอง: "Hello" = 9906 และ "hello" = 15339 (cl100k_base; o200k_base ได้ 13225 / 24912), "unhappiness" = 3 token (un, h, appiness), `{"key": "value"}` = 6 token (5 ถ้าไม่มีช่องว่าง); ห้ามคัดค่าบนสไลด์ (2 และ 9 token)
- G3 inference: ไม่ขยายเป็นบทเรื่อง sampling เต็มเรื่อง เพราะมีแต่ temperature (ไม่มี top-p / top-k ไม่มีสูตร); ใช้ตัวอย่างสมมติของผู้พูด (40% / 20% / 15%) เป็นภาพเปิด โดยระบุว่าเป็นตัวเลขที่ผู้พูดตั้งขึ้น แล้วจับคู่กับ Transformer Explainer และ CME295 สำหรับ logits → softmax → temperature; สูตร softmax แบบมี T ในรายงานเป็นของผู้จัดทำ
- G7 agents: เป็นชั้นฐานเท่านั้น (tool call รอบเดียว ไม่มีวนหลายรอบ ไม่มี memory / planning / จัดการ error); G9 chunking ผู้พูดเลื่อนไปตอนหลังของคอร์ส และ G10 prompt injection ไม่พูดถึงเลย ทั้งที่ tool call คือจุดเริ่ม
- หน้า Q&A แบบค้นอย่างเดียว: รายงานมีคู่ถาม-ตอบสะอาดสำหรับ token คืออะไร · context window · ตั้ง temperature เท่าไร · few-shot กี่ตัวอย่าง · ขอ JSON อย่างไรให้เชื่อถือได้ · tool call ทำงานอย่างไร · แหล่งถัดไปสำหรับ G1 / G2 / G3 ตามที่คลิปชี้เอง: Karpathy "Deep Dive into LLMs like ChatGPT" (ยังไม่ได้อ่าน)

**แก้จากต้นฉบับ:** สไลด์เขียน "unhappiness" = 2 token และ `{"key": "value"}` = 9 token แต่ tiktoken (cl100k_base, o200k_base) ได้ 3 และ 6 token · id 9906 เป็นของ "Hello" (H ใหญ่) ไม่ใช่ "hello" · "model never plans ahead" ขัดกับงานวิจัยของ Anthropic ที่พบว่า Claude เลือกคำสัมผัสก่อนเขียนบรรทัด (ควรอ่านเป็นว่าสร้างทีละ token ไม่ใช่ไม่มีการเตรียมภายใน) · `output_text` ที่ผู้พูดว่าเอาเนื้อหาแรกของ item แรก ขัดกับเอกสารที่คลิปเปิดเองซึ่งบอกว่ารวมข้อความทั้งหมด · temperature 0 deterministic จริงในหลักการ แต่เวลา serve จริงอาจต่างได้ · บาง model ของ GPT-5 ไม่รับ parameter temperature · ขั้นต่ำ max_output_tokens ที่ 16 เห็นเฉพาะใน error บนจอ ไม่พบในเอกสาร · ชื่อบทบอก OpenAI, Anthropic, Gemini แต่โชว์โค้ด OpenAI อย่างเดียว

**เราคำนวณหรือเพิ่มเอง:** ผล tiktoken ทั้งหมด (cl100k_base และ o200k_base, รัน 2026-10-13) พร้อมสคริปต์ · 0.75 × 1,000 = 750 คำ; 128,000 × 0.75 = 96,000 คำ ÷ 320 คำต่อหน้า ≈ 300 หน้า (สมมติ 320 คำต่อหน้า) · สูตร softmax แบบมี temperature (ผู้พูดไม่ได้ให้สูตร) · เลขตัวอย่างแอปเปิล 10 − 4 × 1.5 − 2 × 1.5 = 1 (คำตอบสุดท้ายในคลิปจับไม่ได้) · สมการ 4 บล็อกเป็น MathML · ผัง flow แท่งความน่าจะเป็น เปรียบเทียบ JSON และผัง tool call (SVG ของผู้จัดทำ 4 ภาพ)

## arxiv:2609.34770 — Chay-intr et al., Reference-Grounded Data Curation for Instruction-Following Thai-English Machine Translation (RGDC, ChindaMT)

tags: `thai` `machine-translation` `sft` `instruction-tuning` `synthetic-data` `data-selection` `ifd` `distillation` `llm-as-judge` `evaluation` `cohen-kappa` `cometkiwi` `metricx` `gemba` `vocab-size` `full-fine-tuning` `ablation` `arxiv` `fact-checked`  
ใช้ในบท: ยังไม่ใช้ (เสนอ: 4.3 กล่องตัวอย่าง vocab × dimension; LLM manual G2, G5, G12)

**โหมดรายงาน:** iwd (ลึก วิเคราะห์) เรียบเรียงใหม่ด้วยคำของผู้จัดทำ ครบทุกประเด็น 15 ส่วน (license: arXiv non-exclusive distribution 1.0 ไม่ใช่ CC จึงเรียบเรียงใหม่ ไม่แปลทั้งฉบับ; อ่าน arXiv HTML v2 ทั้งฉบับรวมภาคผนวก A-P และตาราง 1-18 (v1 2026-09-28, v2 2026-10-05; ชื่อไฟล์ใช้วันที่ v1); ภาพ 1 เป็นกล่องลำดับงาน จึงวาดใหม่เป็น SVG ไม่ฝังภาพ; เทียบกับโค้ดในโฟลเดอร์ ChindaMT ของเจ้าของ) · ไม่ฝังภาพ + SVG วาดเอง 5 ภาพ · สมการแสดงเป็น MathML 44 บล็อก ·
ตรวจข้อเท็จจริง 15 ข้อที่ไม่ใช่ผลของเปเปอร์เอง (ยืนยัน 9 · บางส่วน 6 · ไม่พบ 0 · ขัดแย้ง 0) · สร้างโดย Opus (ทั้งรายงานและชั้นสมการ) · ผู้ตรวจอิสระ (Opus) ตรวจเนื้อหา และตรวจชั้นสมการอีกรอบ (แก้ 9 จาก 9 ข้อ) PASS · ไม่ได้เก็บข้อความต้นฉบับของเปเปอร์ไว้ใน repo

**เสนอให้ใช้ (ยังไม่ได้แก้บท)**

- G2 post-training: แหล่งเปิดเดียวที่ดีที่สุดสำหรับหัวข้อ SFT ในตอนนี้ เพราะเห็นครบ: ข้อมูลรูปแบบ Alpaca, คิด loss เฉพาะ output, packing, cutoff 1,024, full fine-tune 1 epoch (lr 2e-5, batch 64), ไม่มี RL / DPO พร้อมตัวเลข ablation ต่อชิ้นส่วนที่ 4B (ตัด Rules ออกเสีย 12.63 / 9.53 LC; ตัด IFD ออกเสีย 8.24 เฉพาะ Plain ในโดเมน; ตัดตัวกรอง all-pass ออกเสียราว 1.09 / 1.06) ไม่ใช่แหล่งของ LoRA (G8)
- IFD คืออัตราส่วนของ cross-entropy สองค่า จึงเป็นขั้นต่อจากเรื่อง loss ใน LLM manual; ข้อมูลฝึกเป็นคำแปลที่ LLM ขนาด 35B สร้างใหม่ ไม่ใช่ reference จึงเป็นตัวอย่างชัดของ synthetic data = distillation ซึ่ง manual ควรพูดตรง ๆ
- G5 การประเมิน: ชุดครบในเปเปอร์เดียว: rubric เขียนไว้พร้อมลำดับความสำคัญและโทษหนัก, WR กับ LC% (GLM คุมความยาว), judge 3 ตระกูล, Cohen's kappa (ผู้ประเมินด้วยกัน 0.73, คนกับ judge 0.41, เหลือ 0.18 เมื่อสองระบบใกล้กัน), QE ไม่ใช้ reference (CometKiwi) เทียบแบบใช้ reference (MetricX-24 ช่วง 0 ถึง 25), GEMBA, bootstrap SE; เสนอเป็น "เปเปอร์ประเมินหนึ่งฉบับ" ของแผน และบทเรียน "ทำไม judge ตระกูลเดียวกันต้องมีการ cross-check" ใช้ตาราง 17
- G12 ตัวตัดคำไทย: tokenizer ของ Qwen3.5 มี vocab 248,320 (อ่านจาก config.json ในโฟลเดอร์ของเจ้าของ ไม่ใช่จากเปเปอร์) ตาราง embedding 248,320 × 1,024 ≈ 254 ล้านค่า (0.8B) และ × 2,560 ≈ 636 ล้านค่า (4B) เป็นตัวอย่างจริงของ "vocab × มิติ" ในหัวข้อ embedding; เปเปอร์ไม่พูดถึงต้นทุน token ของภาษาไทย ข้อเสนอคือวัด token ต่ออักษรไทยด้วย tokenizer.json ในเครื่อง (ไทยที่เว้นวรรคกับไม่เว้น) ซึ่งต้องให้เจ้าของตัดสินใจเรื่อง dependency
- ไม่ใช้กับหน้า Q&A ที่ต้องไม่เรียก LLM ภายนอกและค้นอย่างเดียว; งานที่เป็นไปได้ตอน build ที่ต้องมีคนตรวจ: ร่างศัพท์ EN → TH ของบทเรียน หรือแปลคำค้นอังกฤษเป็นไทยครั้งเดียวเก็บเป็นข้อมูลคงที่สำหรับ BM25 ข้ามภาษา; ถ้าคัดตัวอย่างจากชุด Grounded มาลงเว็บต้องให้เครดิตและใช้ CC-BY-SA 4.0 (น้ำหนักและโค้ดเป็น Apache-2.0)

**แก้จากต้นฉบับ:** ขอบ IFD: เปเปอร์ว่าทิ้ง IFD ตั้งแต่ 1 ขึ้นไป แต่โค้ด (src/cherry/data_by_IFD.py) ทิ้งเฉพาะที่มากกว่า 1 · prompt ฝึกถูกทำให้หลากหลาย (7 คำเปิด × 9 รูปแบบ input × 8 cue) ซึ่งเปเปอร์ไม่เล่า และ prompt ตอนประเมิน (Rules อยู่ก่อนต้นฉบับ) ไม่ตรงกับแม่แบบฝึกใด ทั้งที่เปเปอร์บอกว่าตรงกับรูปแบบฝึก · เปเปอร์ว่า IFD ไม่ต้องมี scorer เพิ่ม แต่ฝึก scorer ขนาด 1B และใช้ Qwen3.5-4B ตัวเดียวคัดทุกฐาน · cross-judge สลับลำดับคำตอบของแต่ละคู่ด้วย seed 42 ในโค้ด เปเปอร์บอกแค่ "prompt เหมือนกัน" · ตัวอย่าง pre-experience 40,683 มากกว่า 20 × 1,000 ซึ่งสอดคล้องกับโค้ดที่วนต่อไฟล์ pool · kappa รวมในตาราง 6 (0.73) ไม่ใช่ค่าเฉลี่ยของ 0.74 กับ 0.70 · "1B FP32" จริงคือรัน bf16 โดยเก็บบล็อกที่ฝึกเป็น float32

**เราคำนวณหรือเพิ่มเอง:** สมการ 44 บล็อก (4 ตัวพิมพ์ในเปเปอร์ · 31 ตัวนิยามเป็นคำในเปเปอร์แล้วเรากำกับเป็นสูตร · 9 ตัวเป็นนิยามมาตรฐานที่เรากำกับว่าเสริมเอง เช่น perplexity, SE ของค่าเฉลี่ย, softmax ที่มี temperature, NEFTune, Cohen's kappa) พร้อมตารางสัญลักษณ์ · คำนวณตรวจใหม่: Quality / MtX Mean ของตาราง 4 ตรงทั้ง 22 แถว; ตาราง 5 เทียบกับค่าเฉลี่ยของตาราง 17 ตรง 20 จาก 22 ช่อง (อีก 2 ช่องต่างกัน 0.1); 2B สองชุดรวม 3,495,918 เทียบ 2C 3,495,704 (ต่าง 214 ที่ยังอธิบายไม่ได้); ขั้น 2A ถึง 2B ลดลง 4,003; binomial SE ตรงกับตาราง 16 · ผังลำดับงานและกราฟแท่ง 4 ภาพ (SVG ของผู้จัดทำ) · ส่วนเทียบเปเปอร์กับโค้ดและตัวเลข vocab / embedding มาจากไฟล์ในโฟลเดอร์ ChindaMT ของเจ้าของ

## yt:TFUc41G2ikY — Polo Club of Data Science, [Demo Video] Transformer Explainer

tags: `transformer` `visualization` `transformer-explainer` `attention` `self-attention` `temperature` `top-k` `top-p` `softmax` `gpt-2` `in-browser` `matmul-popover` `sankey` `polo-club`  
ใช้ในบท: ยังไม่ใช้ (เสนอ: 10.2, 10.4; LLM manual G3; แผน visualizer)

**โหมดรายงาน:** เรียบเรียงใหม่ด้วยคำของผู้จัดทำ ครบทุกประเด็นและตัวเลข 7 ส่วน (license มาตรฐานของ YouTube; ไม่มี caption track และไม่มีเสียงบรรยาย; รายงานมาจากกล่อง caption ที่ซ้อนในคลิปและหน้าจอของเครื่องมือ; ภาพ 9 ภาพ) · ภาพจากคลิป 9 ภาพ + SVG วาดเอง 1 ภาพ · สมการแสดงเป็น MathML 10 บล็อก ·
ไม่ได้ค้นเว็บ ตัวเลขบนจออ่านจากภาพนิ่ง 1,000 px (ค่าที่ไม่แน่ใจ 2 จุดระบุไว้ในรายงาน) · สร้างโดย Sonnet worker · ผู้ตรวจอิสระ (Opus): PASS ข้อควรแก้และ nit ที่เห็นพ้องแก้ครบ 5 จาก 5 · คลิปไม่มี transcript ที่ใช้ได้ จึงไม่มีอะไรเก็บไว้ใน repo

**เสนอให้ใช้ (ยังไม่ได้แก้บท)**

- ข้อมูลอ้างอิงภาพของ visualizer ที่ใช้ซ้ำได้ (Canvas + HTML): แถว token ที่พิมพ์ชื่อซ้ำทุกขั้น, ริบบิ้น Q (น้ำเงิน) K (แดง) V (เขียว) แล้วรวมที่ Out, เมทริกซ์ attention 6×6 เป็นจุดม่วงเข้มอ่อน, มุมมอง 3 ขั้น (Dot product → Scaling · Mask → Softmax · Dropout) พร้อมคำอธิบายใต้เมทริกซ์และ legend min..max, แถบความน่าจะเป็น, การ์ดสูตร, popover คูณเมทริกซ์ที่พิมพ์ขนาดใต้ทุกก้อน
- 10.2 Self-attention: `attention.js` (matmul, softmaxRows, causalMask, attention) ป้อนเมทริกซ์ 3 ขั้นลำดับเดียวกับบทได้; สูตรบนจอ S = QKᵀ/√d_k + M และ M = 0 ที่ที่ attend ได้ −∞ ที่ที่ถูกบัง (นิยาม M เป็นของผู้จัดทำ)
- ช่องว่าง G3: ZVect ยังไม่มีอะไรแสดง temperature / top-k / top-p; คลิปนี้เป็นแม่แบบ: แถบเลื่อน T เปลี่ยนแท่งความน่าจะเป็นทันที และการ์ดสูตร logit ÷ T → กรอง top-k หรือ top-p → softmax → เปอร์เซ็นต์; ตัวเลขบนจอ (logit −136.68 ÷ 0.8 = −170.85; top-k 5 ให้ create 20.87%) ใช้ตรวจเท่านั้น ให้คำนวณใหม่ด้วย helper ของเรา (softmaxWithTemperature / topK / topP) ไม่คัด
- 10.4 Transformer block: `tblock.js` (layerNorm, encoderBlock) ป้อนมุมมอง residual / Add & Norm และ popover MLP ที่พิมพ์ขนาด (n, 3072) × (3072, 768) + (768) = (n, 768)

**แก้จากต้นฉบับ:** ไม่มีคำบรรยายให้แก้ · ค่าที่อ่านจากจอและไม่แน่ใจ: legend ของ Softmax · Dropout (−1.0 ถึง 1.0) · 0.35 ÷ (0.35 + 0.13 + 0.08) คิดมือได้ราว 62.5% ส่วนการ์ดแสดง 62.39% (ต่างเพราะการแสดงสองตำแหน่ง) · Dropout ใช้ตอนฝึกเท่านั้น (ตามคำอธิบายบนจอ) · ปุ่มลูกศรข้างชื่อบล็อกว่าสลับบล็อกเป็นการอ่านของผู้จัดทำ

**เราคำนวณหรือเพิ่มเอง:** สมการ 10 บล็อกเป็น MathML พร้อมตารางสัญลักษณ์ และกำกับว่าอะไร "แสดงบนจอ" อะไรเป็นของผู้จัดทำ (เช่น Attention(Q, K, V) ที่ประกอบเอง, นิยามของ mask M) · แผนที่ "ZVect reuse" ไปยัง attention.js และ tblock.js · ผัง flow (SVG ของผู้จัดทำ)

## yt:ECR4oAwocjs — Polo Club of Data Science, Transformers Explained Visually

tags: `transformer` `visualization` `transformer-explainer` `embeddings` `positional-encoding` `query-key-value` `attention` `temperature` `matmul-popover` `polo-club`  
ใช้ในบท: ยังไม่ใช้ (เสนอ: 10.2, 10.3, 10.4)

**โหมดรายงาน:** เรียบเรียงใหม่ด้วยคำของผู้จัดทำ ครบทุกประเด็นและตัวเลข 6 ส่วน (license มาตรฐานของ YouTube; แทร็ก ASR มีแต่ "[music]" จึงสร้างจากกล่อง caption ในคลิป หน้าจอ และรายการบทในคำอธิบายคลิป; ภาพ 7 ภาพ) · ภาพจากคลิป 7 ภาพ + SVG วาดเอง 1 ภาพ · สมการแสดงเป็น MathML 5 บล็อก ·
ไม่ได้ค้นเว็บ ตัวเลขบนจออ่านจากภาพนิ่ง (id ของ token "the" อ่านได้ 1276 หรือ 617 ระบุไว้ในรายงาน) · สร้างโดย Sonnet worker · ผู้ตรวจอิสระ (Opus): PASS ข้อควรแก้และ nit ที่เห็นพ้องแก้ครบ 5 จาก 5 · คลิปไม่มี transcript ที่ใช้ได้ จึงไม่มีอะไรเก็บไว้ใน repo

**เสนอให้ใช้ (ยังไม่ได้แก้บท)**

- 10.3 ตำแหน่งแบบ sin / cos: แถบ positional encoding สีน้ำเงิน / แดง (ค่าบวกลบ) ข้างแถบ token embedding สีเทา และตาราง "token + ตำแหน่ง = input" (token → id + position = ผลรวม) ใช้เป็นภาพประกอบของบทได้ ตรงกับ 9.1 LLM input
- 10.2 / 10.4: popover "Weight Multiplication" แสดงขนาด (8, 768) × (768, 2304) + (2304) = (8, 2304) พร้อมสูตรรายช่อง Σ E·W + b และผลลัพธ์แบ่งสามส่วนสี Q | K | V; ของเรา (n, d) × (d, 3d) + (3d) = (n, 3d) ที่ขนาดเล็กทำภาพเดียวกันได้จาก `attention.js`
- แถบ Temperature ที่เปลี่ยนรายการความน่าจะเป็นทันที (T = 0.6: visualize 29.48, create 12.17, see 7.41 เปอร์เซ็นต์) เป็นของคู่กับคลิปรุ่น 2025 สำหรับ G3; ตัวเลขใช้ตรวจเท่านั้น

**แก้จากต้นฉบับ:** ไม่มีคำบรรยายให้แก้ · id ของ token "the" ตัวที่สองอ่านจากจอได้ 617 ส่วนตัวแรก 1276 ภาพไม่ชัดพอจะยืนยัน · รายงานรุ่นแรกเขียนว่าคลิปนี้เป็นรุ่นก่อนรุ่น 2025 ซึ่งเป็นข้อสันนิษฐานของผู้จัดทำ คลิปไม่ได้บอก (แก้เป็นการสันนิษฐานแล้ว)

**เราคำนวณหรือเพิ่มเอง:** สมการ 5 บล็อกเป็น MathML (ผลรวม x = e + pe, สูตรช่องแรก, สูตรทั่วไป Σ E·W + b, QKV = E W + b พร้อมขนาด, QKV = [Q | K | V] ที่เป็นการอ่านของผู้จัดทำ) · แผน reuse กับ attention.js · ผัง flow (SVG ของผู้จัดทำ)

## yt:uboTKqPNU5Y — Polo Club of Data Science, Dodrio: Exploring Transformer Models with Interactive Visualization

tags: `visualization` `attention` `bert` `dodrio` `attention-graph` `head-overview` `arc-diagram` `edge-threshold` `force-layout` `polo-club`  
ใช้ในบท: ยังไม่ใช้ (เสนอ: 10.2, 10.4)

**โหมดรายงาน:** เรียบเรียงใหม่ด้วยคำของผู้จัดทำ ครบทุกประเด็นและตัวเลข 5 ส่วน (license มาตรฐานของ YouTube; ไม่มี caption track และไม่มีเสียงบรรยาย; รายงานมาจากกล่อง caption ในคลิปและหน้าจอ; ภาพ 10 ภาพ) · ภาพจากคลิป 10 ภาพ + SVG วาดเอง 1 ภาพ · สมการแสดงเป็น MathML 1 บล็อก ·
ไม่ได้ค้นเว็บ ตัวเลขบนจออ่านจากภาพนิ่ง (ค่า ManyBody / threshold ของสองฉากต่างกัน ระบุไว้ในรายงาน) · สร้างโดย Sonnet worker · ผู้ตรวจอิสระ (Opus): PASS ข้อควรแก้และ nit ที่เห็นพ้องแก้ครบ 5 จาก 5 · คลิปไม่มี transcript ที่ใช้ได้ จึงไม่มีอะไรเก็บไว้ใน repo

**เสนอให้ใช้ (ยังไม่ได้แก้บท)**

- ไม่ใช่ภาพ forward pass แต่เป็นแดชบอร์ดวิเคราะห์ attention ของ BERT: กริด layer × head, กราฟ attention รัศมี (token บนวงกลม ลูกศรคือ attention), เลย์เอาต์ Force / Radial / Grid, แถบเลื่อนตัดเส้น attention ต่ำกว่า threshold, ส่วนโค้ง (arc) เหนือแถว token — ใช้เป็นข้อมูลอ้างอิงภาพของ visualizer
- 10.2: เมทริกซ์ n × n จาก `attention.js` (softmaxRows) คือข้อมูลเข้าของมุมมองรัศมีและส่วนโค้งโดยตรง (เส้น = ช่องที่เกิน threshold); `causalMask` ตรงกับ "ลูกศรชี้ไปหา token ก่อนหน้าเท่านั้น"
- 10.4: กริด layer × head ต้องมีหลาย head แต่ `tblock.js` มี 2 head จึงแสดงเป็นกริด 1 × 2 หรือกริดเล็ก; hover แล้วเน้นสีเดียวกันทุกมุมมองเป็นแนวคิดที่ควรเอาไป

**แก้จากต้นฉบับ:** ไม่มีคำบรรยายให้แก้ · ชื่อ "Comparison View" มาจากเปเปอร์ Dodrio ไม่ใช่จากคลิป (คลิปมีแต่ปุ่ม Show Comparison) · ฟังก์ชันของไอคอนเล็กสองตัวใต้ชื่อแถวในมุมมองนั้นคลิปไม่ได้บอก

**เราคำนวณหรือเพิ่มเอง:** สมการ 1 บล็อก: เส้น i → j ถูกวาดเมื่อ a_ij > τ โดย τ คือ slider Edge Threshold (0.04 ที่ 0:54 และ 0.02 ที่ 1:14); ความหมายของ a_ij เป็นการอ่านของผู้จัดทำ · แผน reuse กับ attention.js และ tblock.js · ผัง flow (SVG ของผู้จัดทำ)

## yt:nZYHazugVNA — Duen Horng "Polo" Chau, GRAPHITE: A Visual Query System for Large Graphs

tags: `visualization` `visual-analytics` `graph-query` `query-by-sketch` `approximate-matching` `linked-views` `interaction-design` `polo-club`  
ใช้ในบท: ยังไม่ใช้ (เสนอ: 7.1–7.4 ภาพ query / result สองหน้าต่าง; 10.4 เลือก head ด้วยแท็บจัดอันดับ)

**โหมดรายงาน:** เรียบเรียงใหม่ด้วยคำของผู้จัดทำ ครบทุกประเด็นและตัวเลข 7 ส่วน (license มาตรฐานของ YouTube; คำบรรยายอังกฤษอัตโนมัติคุณภาพต่ำ (64 บรรทัด) แก้เทียบกับข้อความบนจอ; เสียงมีแค่ต้นและท้ายคลิป ส่วนกลางเป็นงานบนจอเงียบ; ภาพ 9 ภาพ) · ภาพจากคลิป 9 ภาพ + SVG วาดเอง 1 ภาพ ·
ไม่ได้ค้นเว็บ ตัวเลขและชื่อบนจอตรวจกับภาพนิ่ง (ชื่อที่อ่านจากพิกเซลเล็กอาจคลาดเล็กน้อย ระบุไว้ในรายงาน) · สร้างโดย Sonnet worker · ผู้ตรวจอิสระ (Opus) PASS: 8 ควรแก้ (แก้ 7 บางส่วน 1) · 7 nit (แก้ 6 ไม่แก้ 1) · ไม่ได้เก็บ transcript ไว้ใน repo

**เสนอให้ใช้ (ยังไม่ได้แก้บท)**

- ไม่ใช่เนื้อหา Transformer และไม่มีทฤษฎี; คุณค่าคือแบบการโต้ตอบของ visual analytics สำหรับ visualizer: หน้าต่างสองบาน (ซ้าย Query ที่ผู้ใช้วาด ขวา Match ที่ระบบหาเจอ) ใช้รูปแบบ node เดียวกันเพื่อให้ตามองเทียบได้, legend เป็นรหัสสีเดียว, หน้าต่างเลือกค่าที่ค้นหาได้จากรายการยาว, ผลทีละอันในแท็บจัดอันดับ 0–14 แทนกราฟพันกัน
- ไอเดียที่เอาไปใช้: โหนดสีขาว (ไม่มี attribute) ใน Match เป็นโหนดสะพานที่ query ไม่มี — ใช้วาด token ที่ model ข้ามหรือตำแหน่งที่ถูก mask เป็นวงกลมโปร่ง; ซ้าย = token ที่ถาม + เวกเตอร์ Q ขวา = key ที่ตรงเรียงอันดับ; แท็บจัดอันดับสำหรับเลือก head
- คำเตือนในบทเรียน: คำว่า query ใน Graphite คือแบบกราฟที่ผู้ใช้วาด ไม่ใช่เวกเตอร์ Query ของ Transformer (9.2) ห้ามปนกัน; ข้อสรุปของคลิปที่ว่าแท็บเรียงตาม "สำคัญเชิงประจักษ์" มาจาก ASR และคลิปไม่เคยสลับแท็บ

**แก้จากต้นฉบับ:** ASR แย่มาก (หลายช่วงอ่านไม่ออก) ซ่อมโดยเทียบกับข้อความบนจอ · สีของ legend ไม่คงที่ระหว่างสองเทค (ส้ม / เหลืองสลับกัน) ต้องอ่านจาก legend ในภาพนั้นเสมอ · ช่อง Number of Matches เป็น 20 ในฉากเปิดและ 10 ในฉากเดโม · ชื่อผู้เขียนคนหนึ่งบนจอพิมพ์ตกตัวอักษร (อ่านได้ว่า "Reinhard Mnner" น่าจะเป็น Männer) · ว่าแท็บใดคืออันดับ 1 คลิปไม่ได้บอก · ฟังก์ชันของลูกศรกับมือบนแถบเครื่องมือเป็นการอนุมานจากรูปไอคอน

**เราคำนวณหรือเพิ่มเอง:** ตารางผู้เขียน ข้อมูลเดโม (DBLP ผู้เขียนมากกว่า 350,000 คน; 1.9 ล้านความสัมพันธ์ร่วมเขียน) และตารางเปรียบเทียบ exact กับ close match อ่านจากภาพและคำพูดของคลิป · คำอธิบายผลลัพธ์ตัวอย่าง (Philip S. Yu ตรงกลาง) · ผัง flow ของขั้นตอนการโต้ตอบ (SVG ของผู้จัดทำ) · ไม่มีสมการ

## yt:-jeck0yrT_Q — Polo Club of Data Science, VIGOR: Interactive Visual Exploration of Graph Query Results

tags: `visualization` `visual-analytics` `graph-query` `linked-views` `exemplar-view` `soft-intersection` `feature-explorer` `t-sne` `cluster-width` `interaction-design` `polo-club`  
ใช้ในบท: ยังไม่ใช้ (เสนอ: 10.2, 4.5; แผน visualizer)

**โหมดรายงาน:** เรียบเรียงใหม่ด้วยคำของผู้จัดทำ ครบทุกประเด็นและตัวเลข 9 ส่วน (license มาตรฐานของ YouTube; ไม่มี caption track และไม่มีเสียงบรรยาย; รายงานมาจากกล่อง caption สีเหลืองบนดำ หน้าจอ และคำอธิบายคลิป; ภาพ 14 ภาพ; เวลาของ caption เป็นเวลาของภาพที่สุ่ม (ห่างกัน 7 ถึง 13 วินาที) ไม่ใช่เวลาที่ caption เริ่มจริง) · ภาพจากคลิป 14 ภาพ + SVG วาดเอง 1 ภาพ ·
ไม่ได้ค้นเว็บ ตัวเลขบนจอตรวจกับภาพนิ่ง (ข้อความ Cypher และชื่อผู้เขียนที่อ่านจากพิกเซลเล็กอาจคลาดเล็กน้อย ระบุไว้ในรายงาน) · สร้างโดย Sonnet worker · ผู้ตรวจอิสระ (Opus): รอบแรก FAIL (1 ต้องแก้ 7 ควรแก้ 6 nit) แก้ครบแล้ว PASS · คลิปไม่มี transcript ที่ใช้ได้ จึงไม่มีอะไรเก็บไว้ใน repo

**เสนอให้ใช้ (ยังไม่ได้แก้บท)**

- แบบมุมมองที่เชื่อมกัน: ไฮไลต์สีเดียว (เหลือง) ตามทุกมุมมองเมื่อ hover หรือเลือก node; ตัวนับข้างชื่อ pane; ค่าตัวกรองแสดงบน node พร้อมปุ่ม x; ชุดควบคุมจัดกลุ่มมีป้ายที่ขอบล่างของ pane; แผงฟีเจอร์ที่เทียบหลายกลุ่มเป็นสองสี — เป็นต้นแบบของ LinkedSelection, ScopeCounter / chips, ControlDock, ProjectionScatter และ SelectionStatsPanel ในรายการองค์ประกอบของ visualizer
- 10.2: เมื่อ hover token แล้วแถวและคอลัมน์ของ token นั้นสว่างพร้อมกันในเมทริกซ์คะแนน เมทริกซ์ softmax และ Out (LinkedSelection); ตัวนับแบบ "6 token, head 3" และ slider ตัดน้ำหนักต่ำ
- 4.5 Latent space: แผนที่ 2 มิติของผลลัพธ์ (t-SNE) กับเส้นกลุ่มสี และ slider ความกว้างกลุ่ม (Cluster Width) ที่รวมกลุ่มเล็กเป็นกลุ่มใหญ่ ใช้เป็นต้นแบบของภาพ "แผนที่ embedding" ที่เลือกจุดแล้วเน้นสีได้ (ใช้ PCA / SVD ของเราเอง)
- ข้อควรระวัง: เป็นเดโมวิจัยที่แน่นมาก ให้เอาแนวคิด (ไฮไลต์เดียว ตัวนับ chips dock) ไม่เอาความหนาแน่น และใช้ 6 ถึง 12 token เพื่อให้ป้ายอ่านออก

**แก้จากต้นฉบับ:** ตัวนับ "Fusion Graph (211 Nodes ...)" ไม่เปลี่ยนเมื่อกรองด้วย Exemplar (Embedded Results เปลี่ยนเป็น 17 ผลลัพธ์) และเป็น 23 Nodes เฉพาะขั้น soft-intersection โดยคลิปไม่บอกสาเหตุ · การที่กราฟหดเมื่อเลือกกลุ่มเป็นการอนุมานจากภาพ ไม่มี caption ยืนยัน · ว่าปุ่มฟันเฟืองสลับชุดควบคุมเป็นการอนุมาน (ภาพไม่เห็นการกด) · "4 VAST 2014 Mini Challenges" (3:03) คลิปไม่อธิบาย · ตัวเลข 11,000 เหตุการณ์ของ Symantec และผลการทดลองเทียบฐานข้อมูลกราฟมาจากคำอธิบายคลิป ไม่ได้พูดในคลิป และไม่มีตัวเลขผลทดลอง

**เราคำนวณหรือเพิ่มเอง:** ข้อความ Cypher ที่อ่านจากจอ (ฉบับแก้แล้วหลังการตรวจ) · ตารางตัวนับตามเวลา · คำอธิบายแผงเปรียบเทียบสองกลุ่ม (2:37; แกนแท่งเปลี่ยนจาก 0–8 เป็น 0–22 อันดับเปลี่ยน) · ผัง flow ของขั้นตอนการโต้ตอบ (SVG ของผู้จัดทำ) · ไม่มีสมการ

## การตรวจตัวเลขและข้อเท็จจริง

ตัวเลขที่เราคำนวณเองในไฟล์นี้ทำด้วยการคำนวณในเครื่อง ส่วน yt:YLkSfz3EFGw ตรวจข้อเท็จจริงด้วยการค้นเว็บเมื่อ 2026-10-10 (แหล่งที่อ่านระบุไว้ในส่วนที่ 8 ของรายงาน)
และ yt:Lc4dzmSFb14 ยังไม่ได้เปิดเอกสารต้นฉบับของ HNSW ตรวจ
yt:H6q1UWCCnKw ตรวจข้อเท็จจริง 11 ข้อด้วยการค้นเว็บเมื่อ 2026-10-10 (ส่วนที่ 12 ของรายงาน) หน้าเอกสาร Vertex AI บางหน้าเปิดตรงไม่ได้ จึงใช้ข้อความจากผลค้นหา
yt:BcxJk4WQVIw ตรวจตัวเลขของตัวอย่างด้วยการรัน BPE ในเครื่อง (ส่วนที่ 12 ของรายงาน และตัวอย่าง `35_bpe` ทั้งสามภาษา) ไม่ได้ค้นเว็บ
yt:xTzUn3G9YA0 ไม่ได้ค้นเว็บ (คลิปปี 2024) ตัวเลขบนจออ่านจากภาพนิ่ง และผู้ตรวจอิสระเทียบรายงานกับ transcript และภาพ
yt:6iCmnd0k3fs, yt:8LPgGU34RoE, yt:YIR-KxNpSbA, yt:S7tFyREI19I ตรวจข้อเท็จจริงด้วยการค้นเว็บ (ผู้ตรวจแยก) เมื่อ 2026-10-11 รวม 25 ข้อ: ยืนยัน 18 · บางส่วน 7 · ไม่พบ 0 · ขัดแย้ง 0 (ตารางอยู่ในส่วนท้ายของแต่ละรายงาน)
yt:aiNQ4I8YaD0 และ yt:my5wFNQpFO0 ไม่ได้ค้นเว็บ (อยู่ในช่วงความรู้ของผู้จัดทำ) ตัวเลขบนจอตรวจกับภาพนิ่ง · ทุกรายงานชุดนี้ผ่านผู้ตรวจความตรงของความหมาย (fidelity) แยกคนละคน และแก้ตามข้อที่พบแล้ว
yt:zduSFxRajkE ไม่ได้ค้นเว็บ (คลิปปี 2024 อยู่ในช่วงความรู้ของผู้จัดทำ) ตัวเลขบนจอตรวจกับภาพนิ่ง 6 ภาพ ผู้ตรวจอิสระเทียบรายงานกับ transcript (5 ต้องแก้, 7 ควรแก้, แก้ครบ) และตัวเลขของบท 3.3 นับสดด้วยโค้ด (`37_gpt_tokenizer` ทั้งสามภาษาพิมพ์ผลเหมือนกัน)
yt:izbifbq3-eI ไม่ได้ค้นเว็บ (คลิปปี 2025 อยู่ในช่วงความรู้ของผู้จัดทำ) ตัวเลขทุกตัวเทียบกับสไลด์ ผู้ตรวจอิสระเทียบรายงานกับ transcript และสไลด์ (0 ต้องแก้, 5 ควรแก้, แก้ครบ)
yt:4JofSJIrjwU ตรวจข้อเท็จจริง 15 ข้อด้วยการค้นเว็บ (ผู้ตรวจแยก) เมื่อ 2026-10-13: ยืนยัน 4 · บางส่วน 9 · ไม่พบ 0 · ขัดแย้ง 2 (ตารางอยู่ในรายงาน) เอกสาร Unsloth อ่านจาก unsloth.ai/docs เพราะ docs.unsloth.ai เปิดตรงไม่ได้ ตัวเลข LoRA และหน่วยความจำคำนวณในเครื่อง
