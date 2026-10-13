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

### ดัชนี tag

| tag | ref |
|---|---|
| `agent-search` | yt:YLkSfz3EFGw |
| `alpaca-format` | yt:4JofSJIrjwU |
| `ann` | yt:Lc4dzmSFb14 · yt:c10w0Ptn_CU · yt:wyWFLIlgmAw |
| `annoy` | yt:c10w0Ptn_CU |
| `asymmetric-quantization` | yt:6iCmnd0k3fs |
| `attention` | yt:YIR-KxNpSbA · yt:hVM8qGRTaOA · yt:xTaDx3tbYMs · yt:YmLp8qe87A0 · yt:114i2Kz-LZA |
| `autoregressive` | yt:YmLp8qe87A0 |
| `backpropagation` | yt:YmLp8qe87A0 |
| `bag-of-words` | yt:e9U0QAFbfLI · yt:hVM8qGRTaOA · yt:Q6TBHDgWCDQ |
| `best-first-search` | yt:wyWFLIlgmAw |
| `bi-encoder` | yt:H6q1UWCCnKw |
| `binary-quantization` | yt:6iCmnd0k3fs · yt:bU38Ovdh3NY |
| `bm25` | yt:YLkSfz3EFGw |
| `bpe` | yt:BcxJk4WQVIw · yt:YIR-KxNpSbA · yt:zduSFxRajkE · yt:YmLp8qe87A0 · yt:114i2Kz-LZA |
| `brute-force` | yt:Lc4dzmSFb14 · yt:c10w0Ptn_CU |
| `byte-fallback` | yt:zduSFxRajkE |
| `byte-level-bpe` | yt:zduSFxRajkE |
| `cbow` | yt:hVM8qGRTaOA · yt:Q6TBHDgWCDQ |
| `centroids` | yt:aiNQ4I8YaD0 |
| `chatbot` | yt:YmLp8qe87A0 |
| `chunking` | yt:xTzUn3G9YA0 |
| `colbert` | yt:6iCmnd0k3fs · yt:8LPgGU34RoE · yt:aiNQ4I8YaD0 · yt:xTzUn3G9YA0 |
| `context-window` | yt:YmLp8qe87A0 |
| `contextual-embeddings` | yt:YIR-KxNpSbA · yt:izbifbq3-eI · yt:Q6TBHDgWCDQ |
| `contrastive-learning` | yt:S7tFyREI19I |
| `cosine` | yt:e9U0QAFbfLI · yt:xTaDx3tbYMs · yt:Q6TBHDgWCDQ |
| `cross-attention` | yt:114i2Kz-LZA |
| `cross-encoder` | yt:H6q1UWCCnKw |
| `data-recipes` | yt:4JofSJIrjwU |
| `dense-retrieval` | yt:xTzUn3G9YA0 |
| `distributional-hypothesis` | yt:Q6TBHDgWCDQ |
| `dot-product` | yt:xTaDx3tbYMs |
| `ef-construction` | yt:wyWFLIlgmAw |
| `efsearch` | yt:Lc4dzmSFb14 · yt:wyWFLIlgmAw |
| `eliza` | yt:YmLp8qe87A0 |
| `embedding-dimensions` | yt:1Qex37vowTM · yt:YIR-KxNpSbA |
| `embedding-matrix` | yt:YIR-KxNpSbA · yt:hVM8qGRTaOA · yt:lPTcTh5sRug · yt:my5wFNQpFO0 |
| `embedding-model-choice` | yt:H6q1UWCCnKw · yt:Q6TBHDgWCDQ |
| `embeddinggemma-2` | yt:S7tFyREI19I |
| `embeddings` | yt:1Qex37vowTM · yt:H6q1UWCCnKw · yt:NEreO2zlXDk · yt:S7tFyREI19I · yt:YIR-KxNpSbA · yt:hVM8qGRTaOA · yt:lPTcTh5sRug · yt:my5wFNQpFO0 · yt:izbifbq3-eI · yt:Q6TBHDgWCDQ · yt:YmLp8qe87A0 |
| `encoder-decoder` | yt:114i2Kz-LZA |
| `epochs` | yt:4JofSJIrjwU |
| `euclidean` | yt:xTaDx3tbYMs |
| `evaluation` | yt:S7tFyREI19I |
| `fact-checked` | yt:6iCmnd0k3fs · yt:8LPgGU34RoE · yt:H6q1UWCCnKw · yt:S7tFyREI19I · yt:YIR-KxNpSbA · yt:YLkSfz3EFGw · yt:Q6TBHDgWCDQ · yt:wyWFLIlgmAw · yt:YmLp8qe87A0 · yt:114i2Kz-LZA · yt:4JofSJIrjwU |
| `feed-forward` | yt:114i2Kz-LZA |
| `filtering` | yt:bU38Ovdh3NY |
| `fine-tuning` | yt:YmLp8qe87A0 · yt:4JofSJIrjwU |
| `fine-tuning-embeddings` | yt:S7tFyREI19I |
| `gguf` | yt:4JofSJIrjwU |
| `high-dimensions` | yt:xTaDx3tbYMs |
| `hindi` | yt:YIR-KxNpSbA |
| `history-of-ai` | yt:YmLp8qe87A0 · yt:114i2Kz-LZA |
| `hnsw` | yt:Lc4dzmSFb14 · yt:bU38Ovdh3NY · yt:wyWFLIlgmAw |
| `hybrid-search` | yt:YLkSfz3EFGw |
| `hyperplane` | yt:c10w0Ptn_CU |
| `in-batch-negatives` | yt:S7tFyREI19I |
| `in-browser` | yt:6iCmnd0k3fs |
| `index-artifacts` | yt:aiNQ4I8YaD0 |
| `instruction-tuning` | yt:4JofSJIrjwU |
| `inverted-index` | yt:Lc4dzmSFb14 |
| `ivf` | yt:aiNQ4I8YaD0 |
| `k-means` | yt:aiNQ4I8YaD0 |
| `keyword-search` | yt:Lc4dzmSFb14 · yt:YLkSfz3EFGw |
| `king-queen-analogy` | yt:izbifbq3-eI |
| `knn` | yt:NEreO2zlXDk · yt:c10w0Ptn_CU · yt:wyWFLIlgmAw |
| `label-smoothing` | yt:114i2Kz-LZA |
| `late-interaction` | yt:6iCmnd0k3fs · yt:8LPgGU34RoE · yt:xTzUn3G9YA0 |
| `latent-space` | yt:1Qex37vowTM · yt:NEreO2zlXDk · yt:hVM8qGRTaOA · yt:Q6TBHDgWCDQ |
| `layer-norm` | yt:114i2Kz-LZA |
| `learning-rate` | yt:4JofSJIrjwU |
| `linear-algebra` | yt:fNk_zzaMoSs |
| `llama-3-1` | yt:4JofSJIrjwU |
| `llm-internals` | yt:1Qex37vowTM · yt:YIR-KxNpSbA · yt:hVM8qGRTaOA · yt:zduSFxRajkE · yt:izbifbq3-eI · yt:YmLp8qe87A0 |
| `llm-quirks` | yt:zduSFxRajkE |
| `local-llm` | yt:4JofSJIrjwU |
| `local-minimum` | yt:wyWFLIlgmAw |
| `lookup-table` | yt:6iCmnd0k3fs |
| `lora` | yt:S7tFyREI19I · yt:4JofSJIrjwU |
| `lstm` | yt:114i2Kz-LZA |
| `masked-attention` | yt:114i2Kz-LZA |
| `matryoshka` | yt:H6q1UWCCnKw |
| `maxsim` | yt:6iCmnd0k3fs · yt:8LPgGU34RoE · yt:xTzUn3G9YA0 |
| `metric-choice` | yt:xTaDx3tbYMs |
| `minbpe` | yt:zduSFxRajkE |
| `mixed-precision` | yt:aiNQ4I8YaD0 |
| `mteb` | yt:Q6TBHDgWCDQ |
| `multi-head-attention` | yt:YmLp8qe87A0 · yt:114i2Kz-LZA |
| `multilingual` | yt:H6q1UWCCnKw |
| `multimodal-embeddings` | yt:S7tFyREI19I |
| `multivector` | yt:6iCmnd0k3fs · yt:8LPgGU34RoE · yt:xTzUn3G9YA0 |
| `n-gram` | yt:hVM8qGRTaOA · yt:Q6TBHDgWCDQ |
| `negation` | yt:H6q1UWCCnKw |
| `neural-network` | yt:YmLp8qe87A0 |
| `next-token` | yt:YIR-KxNpSbA · yt:izbifbq3-eI · yt:YmLp8qe87A0 |
| `nf4` | yt:4JofSJIrjwU |
| `normalization` | yt:xTaDx3tbYMs |
| `nsw` | yt:wyWFLIlgmAw |
| `numeracy-gap` | yt:H6q1UWCCnKw |
| `offline-search` | yt:8LPgGU34RoE |
| `ollama` | yt:4JofSJIrjwU |
| `one-hot` | yt:hVM8qGRTaOA · yt:lPTcTh5sRug · yt:my5wFNQpFO0 · yt:Q6TBHDgWCDQ |
| `outliers` | yt:NEreO2zlXDk |
| `overfitting` | yt:4JofSJIrjwU |
| `percolation` | yt:bU38Ovdh3NY |
| `plaid` | yt:aiNQ4I8YaD0 |
| `pleias-rag` | yt:6iCmnd0k3fs |
| `polysemy` | yt:izbifbq3-eI |
| `positional-encoding` | yt:hVM8qGRTaOA · yt:YmLp8qe87A0 · yt:114i2Kz-LZA |
| `pre-tokenization` | yt:zduSFxRajkE |
| `pylate-rs` | yt:6iCmnd0k3fs |
| `qdrant` | yt:8LPgGU34RoE · yt:bU38Ovdh3NY |
| `qdrant-edge` | yt:8LPgGU34RoE |
| `qlora` | yt:4JofSJIrjwU |
| `quantization` | yt:6iCmnd0k3fs · yt:aiNQ4I8YaD0 · yt:bU38Ovdh3NY · yt:4JofSJIrjwU |
| `query-key-value` | yt:114i2Kz-LZA |
| `rag` | yt:6iCmnd0k3fs · yt:H6q1UWCCnKw · yt:xTzUn3G9YA0 · yt:wyWFLIlgmAw · yt:4JofSJIrjwU |
| `rag-vs-fine-tuning` | yt:4JofSJIrjwU |
| `ragatouille` | yt:xTzUn3G9YA0 |
| `random-projection-tree` | yt:c10w0Ptn_CU |
| `recall` | yt:aiNQ4I8YaD0 |
| `reranking` | yt:8LPgGU34RoE · yt:H6q1UWCCnKw |
| `rescoring` | yt:bU38Ovdh3NY |
| `residual` | yt:114i2Kz-LZA |
| `retrieve-then-rerank` | yt:8LPgGU34RoE |
| `rlhf` | yt:YmLp8qe87A0 |
| `rnn` | yt:114i2Kz-LZA |
| `scalar-multiplication` | yt:fNk_zzaMoSs |
| `scaled-dot-product` | yt:114i2Kz-LZA |
| `scifact` | yt:6iCmnd0k3fs |
| `self-attention` | yt:114i2Kz-LZA |
| `sentencepiece` | yt:zduSFxRajkE |
| `similarity-metrics` | yt:NEreO2zlXDk · yt:e9U0QAFbfLI · yt:xTaDx3tbYMs |
| `skip-gram` | yt:hVM8qGRTaOA · yt:my5wFNQpFO0 · yt:Q6TBHDgWCDQ · yt:YmLp8qe87A0 |
| `skip-list` | yt:wyWFLIlgmAw |
| `small-world` | yt:wyWFLIlgmAw |
| `softmax` | yt:YIR-KxNpSbA · yt:my5wFNQpFO0 · yt:YmLp8qe87A0 |
| `special-tokens` | yt:zduSFxRajkE |
| `stanford` | yt:114i2Kz-LZA |
| `static-embeddings` | yt:Q6TBHDgWCDQ |
| `subword` | yt:BcxJk4WQVIw |
| `synthetic-data` | yt:4JofSJIrjwU |
| `temperature` | yt:YIR-KxNpSbA · yt:YmLp8qe87A0 |
| `tf-idf` | yt:Q6TBHDgWCDQ |
| `tiktoken` | yt:zduSFxRajkE |
| `token-efficiency` | yt:zduSFxRajkE |
| `token-id` | yt:YIR-KxNpSbA · yt:hVM8qGRTaOA · yt:lPTcTh5sRug · yt:izbifbq3-eI |
| `token-vs-embedding` | yt:izbifbq3-eI |
| `tokenization` | yt:BcxJk4WQVIw · yt:YIR-KxNpSbA · yt:zduSFxRajkE · yt:izbifbq3-eI · yt:YmLp8qe87A0 · yt:114i2Kz-LZA |
| `tokens` | yt:izbifbq3-eI |
| `tool-calling` | yt:YmLp8qe87A0 |
| `top-p` | yt:YmLp8qe87A0 |
| `training-embeddings` | yt:1Qex37vowTM · yt:YIR-KxNpSbA · yt:lPTcTh5sRug · yt:my5wFNQpFO0 |
| `training-loss` | yt:4JofSJIrjwU |
| `transformer` | yt:YmLp8qe87A0 · yt:114i2Kz-LZA |
| `unsloth` | yt:4JofSJIrjwU |
| `unsloth-studio` | yt:4JofSJIrjwU |
| `utf-8` | yt:zduSFxRajkE |
| `vector-addition` | yt:fNk_zzaMoSs |
| `vector-basics` | yt:fNk_zzaMoSs · yt:izbifbq3-eI |
| `vector-database` | yt:YIR-KxNpSbA · yt:YLkSfz3EFGw · yt:bU38Ovdh3NY |
| `vector-search` | yt:Lc4dzmSFb14 · yt:c10w0Ptn_CU · yt:wyWFLIlgmAw |
| `vocab-size` | yt:zduSFxRajkE |
| `vocabulary` | yt:BcxJk4WQVIw · yt:lPTcTh5sRug · yt:zduSFxRajkE |
| `vram` | yt:4JofSJIrjwU |
| `webgpu` | yt:6iCmnd0k3fs |
| `word-counts` | yt:e9U0QAFbfLI |
| `word-embeddings` | yt:hVM8qGRTaOA · yt:Q6TBHDgWCDQ |
| `word2vec` | yt:1Qex37vowTM · yt:hVM8qGRTaOA · yt:my5wFNQpFO0 · yt:Q6TBHDgWCDQ · yt:YmLp8qe87A0 · yt:114i2Kz-LZA |
| `xor` | yt:YmLp8qe87A0 |

## ตาราง

| ref | แหล่ง | เผยแพร่ / อ่าน | ใช้ในบท | รายงาน |
|---|---|---|---|---|
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
