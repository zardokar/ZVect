# REFERENCE

แหล่งที่ไปอ่านหรือดูมา แล้วนำมาประกอบบทเรียนใน ZVect พร้อมบอกว่าเอาอะไรมาใช้ ตรงไหนแก้ และตรงไหนเราคำนวณเพิ่มเอง

กติกา:

- ตัวเลขทุกตัวในบทเรียนคำนวณใหม่ในเครื่องด้วย `lib/` ไม่ได้ลอกจากคลิป ถ้าตัวเลขในคลิปผิด จะบอกไว้ในหัวข้อ "แก้จากต้นฉบับ"
- ทุกแหล่งที่อ่านด้วย iw มีไฟล์สองชุด: รายงานภาษาไทย `docs/outhtm/` (เปิดจากปุ่ม "อ่านเพิ่ม" ในบทเรียนได้) และไฟล์บริบทภาษาอังกฤษ `docs/aimd/` สำหรับ AI session ถัดไป
- เลขบทในไฟล์นี้ใช้เลขแบบบท.หัวข้อ (ตั้งแต่ 2026-10-11, 7 บท 33 หัวข้อ): 1.1 Vector · 1.2 ความยาว · 1.3 Vector space · 1.4 บวก ลบ คูณ · 1.5 Matrix · 2.1 Euclidean distance · 2.2 Dot product · 2.3 Cosine · 3.1 Token ID · 3.2 One-hot · 3.3 Bag of words · 3.4 Embedding matrix · 3.5 ตารางมาจากการฝึก · 3.6 Latent space · 4.1 ค้นด้วย cosine · 4.2 ค้นด้วย distance · 4.3 ค้นด้วย dot · 4.4 เลือกวิธีวัด · 4.5 ค้นด้วยคำ vs ความหมาย · 5.1 ค้นทุกชิ้น (brute force) · 5.2 มิติสูง · 5.3 เวกเตอร์ 1 บิต (XOR + popcount) · 5.4 ANN แบบต้นไม้ · 5.5 ANN แบบกราฟชั้นเดียว · 5.6 HNSW กราฟหลายชั้น · 5.7 HNSW beam (efSearch) · 5.8 HNSW สร้างชั้นด้วยการโยนเหรียญ · 5.9 กรองระหว่างค้น · 6.1 Bi-Encoder · 6.2 Reranker (Cross-Encoder) · 6.3 Classification · 7.1 LLM input (embedding + ตำแหน่ง) · 7.2 Attention: query · key
- อ่านแหล่งใหม่เมื่อไหร่ ให้เพิ่มแถวในตารางด้านล่าง เพิ่มหัวข้อของแหล่งนั้น และเพิ่มแถวใน READING REGISTRY ของ checkpoint ล่าสุด

## ตาราง

| ref | แหล่ง | เผยแพร่ / อ่าน | ใช้ในบท | รายงาน |
|---|---|---|---|---|
| yt:H6q1UWCCnKw | Byte Goose AI, "Vector Embeddings. How to choose the embedding model based on the task at hand. Semantic Search RAG." (20:57) <https://www.youtube.com/watch?v=H6q1UWCCnKw> | 2026-02-28 / 2026-10-10 | 3.6, 4.1–4.3, 5.2, 6.1, 6.2, 6.3, 7.1 (และไอเดียบท Matryoshka) | [HTML](docs/outhtm/20260228_How-To-Choose-An-Embedding-Model-By-Task.html) · [MD](docs/aimd/20260228_How-To-Choose-An-Embedding-Model-By-Task_claude.md) |
| yt:bU38Ovdh3NY | CMU Database Group, "Qdrant: Open Source Vector Search Engine and Vector Database (Andrey Vasnetsov)" (62:38, CC BY) <https://www.youtube.com/watch?v=bU38Ovdh3NY> | 2023-09-15 / 2026-10-10 | 2.2, 4.1–4.3, 4.4, 5.2, 5.3, 5.5–5.9, 6.1 (แหล่งหลักของบท 5.9) | [HTML](docs/outhtm/20230915_Qdrant-Open-Source-Vector-Search-Engine-CMU.html) · [MD](docs/aimd/20230915_Qdrant-Open-Source-Vector-Search-Engine-CMU_claude.md) |
| yt:YLkSfz3EFGw | Devsplainers, "Vector Databases Are Dead. Use This Instead" (8:29) <https://www.youtube.com/watch?v=YLkSfz3EFGw> | 2026-10-08 / 2026-10-10 | 4.1–4.3, 4.4, 4.5, 6.1 | [HTML](docs/outhtm/20261008_Vector-Databases-Are-Dead-Use-This-Instead.html) · [MD](docs/aimd/20261008_Vector-Databases-Are-Dead-Use-This-Instead_claude.md) |
| yt:c10w0Ptn_CU | Sefik Ilkin Serengil, "Approximate Nearest Neighbour From Scratch In Python: Build Your Own Vector Database" (19:06) <https://www.youtube.com/watch?v=c10w0Ptn_CU> | 2024-06-23 / 2026-10-10 | 2.2, 4.1–4.3, 5.1, 5.2, 5.4 (แหล่งหลักของบท 5.4 ANN แบบต้นไม้) | [HTML](docs/outhtm/20240623_Approximate-Nearest-Neighbour-From-Scratch-In-Python.html) · [MD](docs/aimd/20240623_Approximate-Nearest-Neighbour-From-Scratch-In-Python_claude.md) |
| yt:Lc4dzmSFb14 | Satyajit Das, "Vector Search and HNSW Explained Visually" (8:22) <https://www.youtube.com/watch?v=Lc4dzmSFb14> | 2026-05-30 / 2026-10-10 | 2.1, 4.1–4.3, 4.5, 5.1, 5.2, 5.5–5.8, 6.1 (แหล่งหลักของบท 5.5–5.8) | [HTML](docs/outhtm/20260530_Vector-Search-And-HNSW-Explained-Visually.html) · [MD](docs/aimd/20260530_Vector-Search-And-HNSW-Explained-Visually_claude.md) |
| yt:1Qex37vowTM | SOFAR, "Vector Embedding : Build LLM from scratch" (13:56) <https://www.youtube.com/watch?v=1Qex37vowTM> | 2026-06-15 / 2026-10-10 | 3.1, 3.5, 3.6, 4.1–4.3, 5.2, 6.1, 7.1, 7.2 | [HTML](docs/outhtm/20260615_Vector-Embedding-Build-LLM-From-Scratch.html) · [MD](docs/aimd/20260615_Vector-Embedding-Build-LLM-From-Scratch_claude.md) |
| yt:hVM8qGRTaOA | Under The Hood, "What Are Word Embeddings?" (19:32) <https://www.youtube.com/watch?v=hVM8qGRTaOA> | 2025-02-21 / 2026-10-10 | 1.5, 3.1–3.6, 6.1, 7.1, 7.2 (แหล่งหลักของบท 3.1 Token ID, 3.2 One-hot, 3.4 Embedding matrix, 3.5, 7.1) | [HTML](docs/outhtm/20250221_What-Are-Word-Embeddings.html) · [MD](docs/aimd/20250221_What-Are-Word-Embeddings_claude.md) |
| yt:NEreO2zlXDk | Colin Talks Tech, "A Beginner's Guide to Vector Embeddings" (8:29) <https://www.youtube.com/watch?v=NEreO2zlXDk> | 2023-06-08 / 2026-10-10 | 3.6, 4.1–4.3, 4.4, 6.1, 6.3 (และไอเดียบท outlier) | [HTML](docs/outhtm/20230608_A-Beginners-Guide-To-Vector-Embeddings.html) · [MD](docs/aimd/20230608_A-Beginners-Guide-To-Vector-Embeddings_claude.md) |
| yt:e9U0QAFbfLI | StatQuest, "Cosine Similarity, Clearly Explained!!!" (10:13) <https://www.youtube.com/watch?v=e9U0QAFbfLI> | 2023-01-29 / 2026-10-10 | 2.3, 3.3, 4.1–4.3, 6.1 (แหล่งหลักของบท 3.3 Bag of words) | [HTML](docs/outhtm/20230129_Cosine-Similarity-Clearly-Explained.html) · [MD](docs/aimd/20230129_Cosine-Similarity-Clearly-Explained_claude.md) |
| yt:fNk_zzaMoSs | 3Blue1Brown, "Vectors, Chapter 1, Essence of linear algebra" (9:51) <https://www.youtube.com/watch?v=fNk_zzaMoSs> | 2016-08-05 / 2026-10-10 | 1.1, 1.3, 1.4, 2.1 (และข้อเสนอเรื่องลำดับบท) | [HTML](docs/outhtm/20160805_Vectors-Chapter-1-Essence-Of-Linear-Algebra.html) · [MD](docs/aimd/20160805_Vectors-Chapter-1-Essence-Of-Linear-Algebra_claude.md) |
| yt:xTaDx3tbYMs | SH AI Academy, "Cosine Similarity vs. Euclidean Distance vs. Dot Product: Choosing the Right Metric for AI Search" (6:13) <https://www.youtube.com/watch?v=xTaDx3tbYMs> | 2025-09-23 / 2026-10-10 | 1.2, 1.5, 2.1, 2.2, 2.3, 4.1–4.3, 4.4, 5.2, 7.2 | [HTML](docs/outhtm/20250923_Cosine-Similarity-Vs-Euclidean-Distance-Vs-Dot-Product.html) · [MD](docs/aimd/20250923_Cosine-Similarity-Vs-Euclidean-Distance-Vs-Dot-Product_claude.md) |
| yt:lPTcTh5sRug | BlackBoard AI, "How AI Turns Words Into Vectors: Embeddings" (3:34) <https://www.youtube.com/watch?v=lPTcTh5sRug> | 2025-08-18 / 2026-10-10 | 1.5, 3.1, 3.2, 3.4, 3.5, 6.1 | [HTML](docs/outhtm/20250818_How-AI-Turns-Words-Into-Vectors-Embeddings.html) · [MD](docs/aimd/20250818_How-AI-Turns-Words-Into-Vectors-Embeddings_claude.md) |

## yt:xTaDx3tbYMs — Cosine vs Euclidean vs Dot

**เอามาใช้**

- บท 4.1–4.3 Similarity search: เพิ่ม dot เป็น metric ที่สาม และตารางเรียงอันดับสามแบบเทียบกัน
- บท 4.4 เลือก metric: แนวคิด "ความยาวของเวกเตอร์มีความหมายไหม" (decision framework) และตารางตัวอย่างงาน
- บท 2.2 Dot product: ตัวอย่าง attention = query · key
- บท 7.2 Attention: query · key ด้วยเวกเตอร์บนสไลด์ (~3:44) ใช้ค่าที่แก้แล้ว 0.70 / 0.23 และบอกไว้ใต้สูตรว่าสไลด์พิมพ์ผิด
- บท 1.5 Matrix: `batch_cosine` ที่รับตารางแถวละเวกเตอร์ (ตัวอย่างว่าเก็บเป็นตารางแล้วคำนวณทีละหลายแถวได้)
- บท 5.2 มิติสูง: หัวข้อ curse of dimensionality

**แก้จากต้นฉบับ**

- ค่า attention ในสไลด์เขียนไว้ 0.69 และ 0.15 ที่ถูกคือ **0.70** และ **0.23** (ลำดับยังเหมือนเดิม)
- ตารางสรุปในคลิปมีแถว Dot Product ซ้ำสองครั้งและไม่มีแถว Euclidean
- คลิปบอกว่า cosine ทนต่อมิติสูงกว่า distance ซึ่งจริงแค่บางส่วน: ทดลองแล้ว cosine ก็บีบเข้าหากันเหมือนกัน (บท 5.2)
- ตารางตัวอย่างงานในบท 4.4 เขียนให้แคบลงกว่าคลิป: "รูปภาพใช้ distance" ใช้กับ feature ดิบ (pixel, color histogram) ส่วน image embedding รุ่นใหม่มักใช้ cosine

**เราคำนวณหรือเพิ่มเอง (ไม่ได้มาจากคลิป)**

- ตัวอย่าง A = (3, 1, 0), B = (6, 2, 0), C = (3, 2, 0) ที่ทำให้ cosine กับ dot เลือก B แต่ distance เลือก C (คลิปพูดถึงตัวอย่างแบบนี้แต่ไม่แสดงตัวเลข)
- เอกลักษณ์บนเวกเตอร์ยาว 1: â · b̂ = cos θ และ ‖â − b̂‖² = 2 − 2 cos θ ทำให้สาม metric เรียงเหมือนกันหลัง normalize (ตรวจใน `tests/parity/*/edge_cases.*`)
- query ตัวอย่างในบท 4.1–4.3 (0.5, 0.2, 0.1) ที่ทำให้ทั้งสามแบบได้อันดับ 1 คนละตัว (apple, rice, banana) เลือกจากการค้นทุกจุดบนตารางของ slider ให้แต่ละแบบชนะขาดอย่างน้อย 0.015
- การทดลองบท 5.2: 200 จุดสุ่มใน [0, 1]^d กับ query หนึ่งจุด ใช้ตัวสุ่ม minstd (x · 48271 mod 2³¹ − 1, seed 7, ทิ้ง 10 ตัวแรก) เพื่อให้ JS / Python / C++ ได้ผลตรงกันทุกตัวอักษร
  ตัวเลขจึงต่างจากตารางในรายงาน iw ซึ่งใช้ `random.seed(7)` ของ Python แต่แนวโน้มเหมือนกัน:

  | d | spread ในรายงาน iw (Python random) | spread ในบท 5.2 (minstd) |
  |---|---|---|
  | 2 | 37.33 | 13.056 |
  | 10 | 2.20 | 1.857 |
  | 100 | 0.38 | 0.381 |
  | 1000 | 0.085 | 0.098 |

## yt:lPTcTh5sRug — Embeddings

**เอามาใช้**

- บท 6.1 Bi-Encoder: ลิงก์ "อ่านเพิ่ม" ไปส่วน Embedding matrix เพราะตาราง `table` ในบทนั้นคือ embedding matrix ขนาดเล็ก (คำ → เวกเตอร์)
- บท 1.5 Matrix: ขนาด 50,000 × 300 แถวละคำ · บท 3.1 Token ID: Vocabulary mapping King → 0 … ใช้เลขเป็นที่อยู่ของแถว · บท 3.2 One-hot: 'cat' → [1, 0, 0, 0], 50,000+ ช่อง, ทุกคำต่างกันเท่ากัน
- บท 3.4 Embedding matrix: หยิบแถวด้วย ID และสี่ขั้นตอน (vocabulary & ID → matrix → lookup → learn & adjust) · บท 3.5: เริ่มสุ่ม → ทายผิด (คำที่ถูกคือ crown) → ปรับแถวของ queen ทีละนิด ซ้ำเป็นล้านครั้ง

**เราคำนวณหรือเพิ่มเอง**

- one-hot สองคำใด ๆ มี cos = 0 และระยะ = √2 เสมอ จึงไม่มีความหมายเรื่องความคล้าย
- lookup ด้วย ID ให้ผลเท่ากับ one-hot × matrix (แค่ไม่ต้องคูณศูนย์)
- ไอเดียบทเรียน "One-hot vs Embedding" ทำแล้วเป็นบท 3.2 One-hot และ 3.4 Embedding matrix (2026-10-11, `WIP202610026`)

## yt:fNk_zzaMoSs — 3Blue1Brown, Vectors (Essence of Linear Algebra บทที่ 1)

**โหมดรายงาน:** แปลแบบตีความ ครบทุกรายละเอียด (license มาตรฐานของ YouTube)

**เอามาใช้ / เสนอให้ใช้**

- บท 1.1 Vector: สามมุมมองของเวกเตอร์ (ลูกศร, รายการตัวเลข, สิ่งที่บวกและคูณได้) และพิกัดเป็น "คำสั่งเดิน" จากหางไปหัว
- บท 1.3 Vector space: เวกเตอร์คือลิสต์ตัวเลขที่บอกตำแหน่ง (พิกัด = คำสั่งเดิน)
- บท 1.4 บวก ลบ คูณ: การบวกแบบหางต่อหัวพร้อมเหตุผลแบบ "ก้าวเดิน" และการคูณด้วย scalar
- ลำดับบท: คลิปสอนการบวกและการคูณด้วย scalar ก่อนเรื่องอื่น เดิม ZVect สอน dot ก่อนการบวก ตั้งแต่ 2026-10-10 (`WIP202610020`) ปรับเป็น Vector space บท 1.3, บวก ลบ คูณ บท 1.4 (แยกออกมา 2026-10-11) แล้ว Dot product บท 2.2 ตามลำดับนี้

**แก้จากต้นฉบับ:** ไม่พบจุดผิด

**เราคำนวณหรือเพิ่มเอง:** (1, 2) + (3, −1) = (4, 1), 2·(3, 1) = (6, 2), −1.8·(3, 1) = (−5.4, −1.8) ตรงกับภาพในคลิป; การสลับลำดับในตัวอย่างบ้านเปลี่ยนความหมาย

## yt:e9U0QAFbfLI — StatQuest, Cosine Similarity

**โหมดรายงาน:** แปลแบบตีความ ครบทุกรายละเอียด (license มาตรฐานของ YouTube; ตัดช่วงผู้สนับสนุนและโปรโมตตัวเอง)

**เอามาใช้ / เสนอให้ใช้**

- บท 2.3 Cosine: ตัวอย่าง "Hello, World!" / "Hello!" / "Hello Hello Hello" (45°, 0.71) ใช้เป็นชุดตั้งค่าได้ และย้ำว่าค่าขึ้นกับมุมเท่านั้น
- บท 4.1–4.3 Similarity search: โจทย์ "tweet ทั้งเดือน" อธิบายว่าทำไมต้องให้คอมพิวเตอร์จัดอันดับ
- บท 3.3 Bag of words: ตารางนับคำ, กราฟ hello / world (45° → 0.71), "Hello Hello Hello" ยังได้ 0.71, ตัวอย่าง 5 คำ → 0.58, สูตรแบบ ∑ (ทำแล้ว 2026-10-11, `WIP202610026`)

**แก้จากต้นฉบับ:** ไม่พบจุดผิด (0.71 = 1/√2, 0.58 = 2/(2·√3))

**เราคำนวณหรือเพิ่มเอง:** ช่วง 0 ถึง 1 เป็นจริงเพราะจำนวนคำติดลบไม่ได้; การนับคำวัดคำที่ใช้ร่วมกัน ไม่ใช่ความรู้สึก
("Troll 2 is bad." กับ "I love Troll 2!" ได้ 0.50) คำนวณด้วย `words` + `cosine` ของ lib

## yt:NEreO2zlXDk — Colin Talks Tech, A Beginner's Guide to Vector Embeddings

**โหมดรายงาน:** แปลแบบตีความ ครบทุกรายละเอียด (license มาตรฐานของ YouTube) คลิปเปิดบทความของ Pinecone และเดโม Colorful Vectors บน Hugging Face

**เอามาใช้ / เสนอให้ใช้**

- บท 3.6 Latent space: เดโมสี RGB เป็นตัวอย่างแกนที่มีความหมาย
- บท 4.1–4.3 / 4.4: KNN = top-k ตามระยะ; ตารางสีแสดงว่า distance กับ cosine เรียงต่างกัน
- บท 6.1 Bi-Encoder: บอตถามตอบใช้โมเดลเดียวกันกับเอกสารและคำถาม
- ไอเดียบทใหม่: outlier (ระยะจาก centroid) จากตัวอย่างตรวจจับการโกง

**แก้จากต้นฉบับ:** ไม่พบข้อผิดใหญ่ มีข้อความที่ควรเข้าใจให้ตรง: embedding จริงมีหลายร้อยถึงหลายพันมิติ; metadata มักเก็บแยกจากเวกเตอร์;
การค้นด้วย embedding หาความหมาย ไม่ใช่แค่ keyword; เดโมสีใช้ค่า RGB ที่กำหนดตรง ๆ

**เราคำนวณหรือเพิ่มเอง:** อันดับเพื่อนบ้านของ Malachite ด้วยค่า RGB บนจอ (distance และ cosine)

## yt:hVM8qGRTaOA — Under The Hood, What Are Word Embeddings?

**โหมดรายงาน:** แปลแบบตีความ ครบทุกรายละเอียด (license มาตรฐานของ YouTube)

**เอามาใช้ / เสนอให้ใช้**

- แหล่งหลักของบท 3.1 Token ID (good 6, bad 22, great 21; เลขเหมาะกับของที่มีลำดับเท่านั้น), 3.2 One-hot, 3.3 (bag of words, unigram / bigram / n-gram), 3.4 Embedding matrix (ตาราง lookup 8 × 3, one-hot × matrix = แถว), 3.5 (CBOW หน้าต่าง 3, fox + over → jumps, skip-gram) และ 1.5 Matrix (แถว = จำนวนคำ คอลัมน์ = จำนวนมิติ)
- บท 3.6 Latent space: ตัวอย่าง 1 มิติ (อายุ) → 2 มิติ (อายุ, royalty), king − man + woman และ Beijing + Japan − China ≈ Tokyo
- บท 6.1 Bi-Encoder: `table` คือ embedding matrix ขนาดเล็ก
- บท 7.1 LLM input: "The cat sat on a mat" (ID 791, 8415, 7731, 389, 264, 5634) → ตาราง 6 × d, ชั้น embedding ฝึกพร้อมโมเดล, บวกเวกเตอร์ตำแหน่งแล้วขนาดไม่เปลี่ยน (ทำแล้ว 2026-10-11)
- บท 7.2 Attention: attention เป็นชั้นแรกของ decoder block และให้บริบท

**แก้จากต้นฉบับ:** ไม่พบจุดผิด

**เราคำนวณหรือเพิ่มเอง:** ระยะเลข token |good − great| = 15 เทียบ |bad − great| = 1; one-hot cos 0 ระยะ √2;
bag of words ของ "This movie was good" กับ "This movie was bad" ได้ cosine 0.75; one-hot × matrix = แถว
· ปุ่ม "แจกเลขใหม่" ในบท 3.1 และเลขเรียงตามตัวอักษรในโค้ดตัวอย่าง (bad 0, good 1, great 2) · กติกาฝึกย่อของบท 3.5 (c = ค่าเฉลี่ยคำรอบข้าง, e ← e + 0.3 (c − e), คำรอบข้างตรึงไว้) และประโยคฝึก 4 ประโยค · ตัวเลข 3 ตัวของแถวและของเวกเตอร์ตำแหน่งในบท 7.1 — ผู้จัดทำแต่งเองทั้งหมด ไม่ใช่การฝึกจริง

## yt:1Qex37vowTM — SOFAR, Vector Embedding : Build LLM from scratch

**โหมดรายงาน:** แปลแบบตีความ ครบทุกรายละเอียด (license มาตรฐานของ YouTube)

**เอามาใช้ / เสนอให้ใช้**

- บท 3.6 Latent space: ตารางน้ำหนัก cat/lion/dog/blue/sandwich บนแกน animal, human, pet, edible เป็นตัวอย่าง "แกนที่มีความหมาย" ที่เข้าใจง่าย
- บท 4.1–4.3 Similarity search: "ความต่างของน้ำหนักน้อย = คล้าย" คือ distance
- บท 3.1 Token ID: เลขประจำคำ (cat 23, lion 50, dog 150) ไม่มีความหมาย, การจับคู่คำกับเลขคือ vocabulary · บท 3.5: สุ่ม → ทาย → error → gradient → ปรับ, Word2Vec 3 ล้านคำ × 300, king–queen 0.651 vs king–man 0.229
- บท 7.1 / 7.2: ลำดับขั้นใน GPT (tokenization → embedding → positional → contextual → self-attention) และขนาดของ GPT-1/2/3
- บท 5.2 มิติสูง: ขนาดมิติของ GPT-1 (768), GPT-2 (768–1,600), GPT-3 (12,288) เทียบกับ Word2Vec (300)
- บท 6.1 Bi-Encoder: คำที่ไม่มีในคลังคำ (`KeyError: 'Bill_Gates'`) ตรงกับที่ `encode()` ของ ZVect ข้ามคำที่ไม่รู้จัก

**แก้จากต้นฉบับ** (ใส่ไว้ในกล่องแยก ไม่ได้แก้เนื้อหาของผู้สอน)

- "เขียนคุณลักษณะ 768 อย่าง" เป็นภาพช่วยเข้าใจ มิติในโมเดลจริงเป็นค่าที่เรียนมาระหว่างฝึก และมักตีความทีละมิติไม่ได้
- king กับ queen "65%" คือ cosine similarity 0.651 ไม่ใช่เปอร์เซ็นต์หรือความน่าจะเป็น
- ผลที่ผู้สอนเรียกว่า "เริ่ม hallucinate" คือคำที่คะแนนต่ำกว่าในรายการ `most_similar` ไม่ได้สร้างคำตอบขึ้นเอง
- "มิติยิ่งสูงยิ่งดี": ผู้สอนบอกว่ามีข้อแม้แต่ไม่ได้อธิบาย ผู้จัดทำเสริมเรื่องข้อมูล การคำนวณ และระยะห่างที่บีบเข้าหากันในมิติสูง (บท 5.2)

**เราคำนวณหรือเพิ่มเอง:** ใช้ 4 มิติจากตารางบนจอ คำนวณด้วย lib ของ ZVect ได้ distance / cosine:
cat–dog 0.141 / 0.997, cat–lion 0.415 / 0.965, dog–lion 0.539 / 0.950, cat–sandwich 1.379 / 0.332;
โค้ด Python + gensim ที่ทำซ้ำการทดลองในคลิป (ผู้จัดทำเขียนเอง ยังไม่ได้รันในเครื่อง)

## yt:Lc4dzmSFb14 — Satyajit Das, Vector Search and HNSW Explained Visually

**ใช้ในบทชุดใหม่ (2026-10-11, `WIP202610027`):** 5.1 ค้นทุกชิ้น (อ่านทีละชิ้น ~1M ครั้ง, ข้อมูล 2 เท่า = ช้า 2 เท่า) · 4.5 inverted index และตัวอย่าง cancel (#15, #103, #588) ที่พลาด "End your membership today" · 5.5 กราฟเพื่อนบ้านเดินแบบ greedy (1.43 → 0.95 → 0.52), วนในซอย · 5.6 ชั้นทางด่วน / ถนนหลัก / ซอย · 5.7 beam = efSearch, ตัวอย่าง beam แคบ / กว้างบนจอ · 5.8 โยนเหรียญ ~1/M, ตัวอย่าง Pause billing (หัว หัว ก้อย → ชั้น 2), ตาราง N × (1/M)^k (คำนวณในไฟล์สรุป)

**โหมดรายงาน:** แปลแบบตีความ ครบทุกรายละเอียด (license มาตรฐานของ YouTube, caption อัตโนมัติ)

**เอามาใช้ / เสนอให้ใช้**

- บท 4.1–4.3 Similarity search: บทนี้วนเทียบทุกรายการ ซึ่งคือ brute force ในคลิป ใช้ประโยค "embeddings solve meaning, not speed" อธิบายว่าทำไมระบบใหญ่ต้องมี index
- บท 5.2 มิติสูง: เหตุผลที่การค้นหาแบบประมาณต้องยอมแลก recall
- บท 6.1 Bi-Encoder: ขั้น embed คำถาม → ค้นเวกเตอร์ใกล้สุด → (กรอง/rerank) → LLM ตรงกับบอท help center ในคลิป
- ไอเดียบทใหม่ "ค้นหาแบบประมาณ (ANN)": brute force เทียบกับ greedy walk บนกราฟเพื่อนบ้าน นับจำนวนการคำนวณระยะ (คู่กับ c10w0Ptn_CU)

**แก้จากต้นฉบับ** (ใส่ไว้ในกล่องแยก ไม่ได้แก้เนื้อหาของผู้สอน)

- คำที่ caption อัตโนมัติฟังผิด: "F search" = efSearch, "F construction" = efConstruction, "Enduracers membership" = End your membership, "meaning bits matching" น่าจะเป็น "meaning beats matching"
- "M = จำนวนเพื่อนบ้านต่อบทความ": ในหลายไลบรารีชั้น 0 เก็บได้มากกว่า M (มักเป็น 2M) จากความรู้ของผู้จัดทำ ยังไม่ได้เปิดเอกสารต้นฉบับของ HNSW ตรวจ (ขออนุญาตเปิด arxiv.org ไม่ทัน)
- ระยะบนจอ (1.43, 0.95, 0.52, 1.10 …) คลิปไม่ได้บอกที่มา ควรอ่านเป็นตัวเลขประกอบภาพ

**เราคำนวณหรือเพิ่มเอง:** จำนวนบทความที่คาดว่าจะถึงชั้น k ขึ้นไป = N × (1/M)^k ด้วยค่าตัวอย่าง M = 16, N = 1,000,000:
62,500 / 3,906 / 244 / 15 / 0.95 สำหรับชั้น 1–5

## yt:c10w0Ptn_CU — Sefik Ilkin Serengil, Approximate Nearest Neighbour From Scratch In Python

**ใช้ในบทชุดใหม่ (2026-10-11, `WIP202610027`):** 5.4 ANN แบบต้นไม้ (สูตรเส้นแบ่ง n = v₁ − v₂, c = n · กึ่งกลาง, ฝั่ง > c = ขวา, กลุ่มละ ≤ 5, 1,000 จุด, 9 ขั้น vs 1,000 ครั้ง, Annoy) · 5.1 k-NN เทียบครบ 1,000 จุด · ผลทดลอง 500 ต้น 74.6% (คำนวณในไฟล์สรุป) · บทนี้สุ่มจุดและเส้นเอง (seed 1) จึงได้ 8 ขั้นที่ (50, 50) และพลาดที่ (30, 30)

**โหมดรายงาน:** แปลแบบตีความ ครบทุกรายละเอียด (license มาตรฐานของ YouTube, caption อัตโนมัติ)

**เอามาใช้ / เสนอให้ใช้**

- บท 2.2 Dot product: บอกฝั่งของ hyperplane ด้วยเครื่องหมายของ n · v − c
- บท 4.1–4.3 Similarity search: ต่อยอดจาก brute force (k-NN) ไปสู่ต้นไม้ hyperplane
- บท 5.2 มิติสูง: วิธีเดียวกันใช้ได้ในหลายมิติ แม้จะวาดดูไม่ได้
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

**ใช้ในบทชุดใหม่ (2026-10-11, `WIP202610027`):** 4.5 ค้นด้วยคำ vs ความหมาย (BM25 68.8% vs เวกเตอร์ 51.4%, รหัส / ตัวย่อ / เลข ticket, BrowseComp-Plus 70.1 vs 55.9, Cursor +12.5%, keyword ก่อน) · เอกสาร 8 ชิ้นและตารางเวกเตอร์คำในบทนั้นผู้จัดทำแต่งเอง

**โหมดรายงาน:** แปลแบบตีความ ครบทุกรายละเอียด (license มาตรฐานของ YouTube, caption อัตโนมัติ) พร้อมตรวจข้อเท็จจริง 18 ข้อด้วยการค้นเว็บ

**เอามาใช้ / เสนอให้ใช้**

- บท 4.1–4.3 Similarity search: "ใกล้ในความหมาย" ไม่ใช่ทุกอย่าง ค่าที่ต้องตรงเป๊ะ (เลขลูกค้า, เลข ticket) ควรค้นด้วยคำหรือ filter
- บท 4.4 เลือก metric: ต่อยอดเป็น "เลือกวิธีค้น" (BM25, vector, filter, ถามแอปตรง)
- บท 6.1 Bi-Encoder: embedding จากข้อความสาธารณะไม่รู้จักชื่อรหัสภายในองค์กร
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

**ใช้ในบทชุดใหม่ (2026-10-11, `WIP202610027`):** 5.5–5.6 greedy ไม่รับประกันตัวใกล้สุด, ใส่จุด ~2 เท่าของการค้น, ต้องใช้ RAM · 5.7 beam แลกความแม่นกับความเร็ว · 5.9 กรองระหว่างเดิน, กรองเข้มแล้วกราฟขาด (ขีด 1/k, 10 เส้น → 90%), เส้นเสริมต่อค่า payload · กราฟสุ่ม 2,000 จุดในบท 5.9 ผู้จัดทำสร้างเอง

**โหมดรายงาน:** แปลคำต่อคำฉบับเต็มทั้งการบรรยายและถามตอบ (Creative Commons Attribution, ตรวจในหน้าคลิป) พร้อมสรุปเชิงลึกด้านบน
· transcript ภาษาอังกฤษเก็บไว้ใน `.dropzone/iw_temp/20261010_2013/transcript_bU38Ovdh3NY.txt`

**เอามาใช้ / เสนอให้ใช้**

- บท 5.3: binary quantization เหลือ 1 บิตต่อมิติ (เล็กลง 32 เท่า) เทียบด้วย bitwise XOR + popcount แล้ว rescore top 100 (25:25–27:15)
  เป็นหัวข้อของตัวเอง (แยกจาก Distance 2026-10-11); กฎตัดบิต "บวก = 1" ผู้จัดทำเลือกเอง (คลิปไม่ได้บอกวิธีตัด) และชื่อ Hamming distance เป็นความรู้ทั่วไป
- บท 2.2 และ 4.4: "ฟังก์ชันระยะกำหนดโดยโมเดล แต่ส่วนใหญ่ใช้ dot product"
- บท 4.1–4.3: "ทุกเวกเตอร์อาจเป็นผลลัพธ์ได้ ขีดเส้นจากคะแนนอย่างเดียวไม่ได้" ใช้เป็นข้อควรระวังเรื่อง threshold
- บท 5.2: การเทียบเวกเตอร์ช้าลงเชิงเส้นตามจำนวนมิติ และ binary quantization สำหรับเวกเตอร์ราว 1,500 มิติ
- บท 6.1: Qdrant สมมติว่า embedding มาจากโมเดลภายนอก
- ไอเดียบท ANN: filter ระหว่างเดินกราฟ และกราฟขาดตาม percolation (สัดส่วนที่ตัดได้ 1 − 1/k)

**แก้จากต้นฉบับ** (ใส่ไว้ในกล่องแยก ไม่ได้แก้คำแปล)

- ค่าวิกฤต 1/k บนสไลด์คือสัดส่วน node ที่เหลือ ไม่ใช่ที่ตัดออก (ตัวอย่าง 10 ลิงก์ → 90% ของผู้บรรยายตรงกับการอ่านนี้)
- โมเดล OpenAI ปี 2023 ให้ 1,536 มิติ (ผู้บรรยายพูดว่าราว 1,500)
- คำอธิบาย DiskANN ที่ผู้บรรยายบอกเองว่าอาจผิด: ตามความรู้ของผู้จัดทำ DiskANN ใช้ PQ ใน RAM และกราฟ Vamana เริ่มจากกราฟสุ่ม (ยังไม่ได้ตรวจกับเอกสาร)

**เราคำนวณหรือเพิ่มเอง:** เกณฑ์ percolation 1 − 1/k สำหรับ k = 4–64; หน่วยความจำของเวกเตอร์ 1 ล้านตัว × 1,536 มิติ: float32 6.14 GB, int8 1.54 GB, binary 192 MB

## yt:H6q1UWCCnKw — Byte Goose AI, How to choose the embedding model based on the task

**โหมดรายงาน:** เรียบเรียงใหม่ด้วยคำของผู้จัดทำ ครบทุกประเด็นและตัวเลข (license มาตรฐานของ YouTube, caption อัตโนมัติ) ไม่ใช่คำแปลคำต่อคำ พร้อมตรวจข้อเท็จจริง 11 ข้อด้วยการค้นเว็บ
· ไม่ได้เก็บ transcript ไว้ใน repo (เก็บเฉพาะใน workspace ของ session)

**เอามาใช้ / เสนอให้ใช้**

- บท 3.6 Latent space: ตัวอย่าง "bank" ที่ word2vec ให้พิกัดเดียว เทียบ transformer ที่ดูบริบท และ "ถ้าโมเดลวางสองแนวคิดไว้ใกล้กัน ปลายทางแก้ไม่ได้"
- บท 4.1–4.3 Similarity search: numeracy gap ("ถือหุ้น 20%" กับ "5%" อาจได้เวกเตอร์ใกล้กัน) ค่าที่ต้องเทียบเชิงตัวเลขควรใช้ filter
- บท 5.2 High dimensions: ต้นทุน RAM ตามจำนวนมิติ และ Matryoshka (MRL) ที่ตัดมิติท้ายทิ้ง
- บท 6.1 Bi-Encoder: bi-encoder อัดเอกสารเป็นเวกเตอร์เดียวก่อนเห็นคำถาม ต่างจาก cross-encoder · affirmative bias กับคำปฏิเสธ
- บท 6.3 Classification: linear separability

**ใช้ในบทชุดหลายภาษา (WIP202610029, 2026-10-11)**

- บท 6.1 Bi-Encoder (4 ภาษา): ชื่อโมเดลหลายภาษาที่ผู้ดำเนินรายการเลือก (Qwen3-Embedding-8B, text-multilingual-embedding-002) · BGE-M3 (ค้นแบบผสม) และ EmbeddingGemma (อุปกรณ์เล็ก) ระบุว่าคลิปยกไว้ใช้งานอื่น ส่วน "กว่า 100 ภาษา" มาจากการตรวจทาน · tokenizer ตัดตัวเลขเป็นชิ้น (โยงกับเรื่องตัดคำ) · คลิปไม่มีตัวเลขความแม่นแยกภาษา ตัวเลขในบทมาจากตารางของเล่นและเขียนกำกับไว้
- บท 6.2 Reranker (4 ภาษา): faithfulness เขียนตามคลิป 0.347 → 0.797 พร้อมค่าตรวจทาน 0.621 = RAG พื้นฐาน (RAG ขั้นสูงมีทั้งการตัดเอกสารที่ดีขึ้นและ cross-encoder) · negation verifier · ตำแหน่งคำปฏิเสธแต่ละภาษาเป็นความรู้ทั่วไป
- บท 7.1 LLM input: static (Word2Vec ให้ bank พิกัดเดียว) ยังไม่รู้บริบท
- ไอเดียบทใหม่ "ตัด vector แบบ Matryoshka" (เวกเตอร์ของเล่นไม่ได้ฝึกแบบ MRL ใช้สาธิตเท่านั้น)

**แก้จากต้นฉบับ** (ใส่ไว้ในกล่องแยก ไม่ได้แก้เนื้อหาของผู้ดำเนินรายการ)

- gemini-embedding-001 มี 3072 มิติ (caption ได้ยินเป็น "372" และ "30 or 72")
- ค่า 0.347 ในงานวิจัยต้นทางคือ LLM ที่ไม่มีการค้นเลย RAG พื้นฐานได้ 0.621 และ RAG ขั้นสูง + cross-encoder ได้ 0.797 (เอกสารนโยบายสาธารณสุขของ CDC ไม่ใช่ข้อมูลคลินิก)
- งานวิจัยเรื่องตัวเลขชื่อ EmbedNum-1K ("Revealing the Numeracy Gap", Findings of EACL 2026)
- EmbeddingGemma มี 308M พารามิเตอร์ · ตัวเลข latency มีสองค่าในเอกสาร Google (<22 ms และ <15 ms ที่ 256 tokens)
- MRL รวม loss ของหลายความยาว ไม่ได้เน้นเฉพาะ 256 มิติ

**เราคำนวณหรือเพิ่มเอง:** เวกเตอร์ดิบของเอกสาร 100 ล้านชิ้นแบบ float32: 3072 มิติ 1,228.8 GB, 1024 มิติ 409.6 GB, 768 มิติ 307.2 GB, 256 มิติ 102.4 GB (ยังไม่รวม index)

## การตรวจตัวเลขและข้อเท็จจริง

ตัวเลขที่เราคำนวณเองในไฟล์นี้ทำด้วยการคำนวณในเครื่อง ส่วน yt:YLkSfz3EFGw ตรวจข้อเท็จจริงด้วยการค้นเว็บเมื่อ 2026-10-10 (แหล่งที่อ่านระบุไว้ในส่วนที่ 8 ของรายงาน)
และ yt:Lc4dzmSFb14 ยังไม่ได้เปิดเอกสารต้นฉบับของ HNSW ตรวจ
yt:H6q1UWCCnKw ตรวจข้อเท็จจริง 11 ข้อด้วยการค้นเว็บเมื่อ 2026-10-10 (ส่วนที่ 12 ของรายงาน) หน้าเอกสาร Vertex AI บางหน้าเปิดตรงไม่ได้ จึงใช้ข้อความจากผลค้นหา
