# ZVect

เรียนเวกเตอร์ทีละขั้น ตั้งแต่ลูกศรแรกไปจนถึงการค้นหาด้วยความหมาย
ทุกบทมีภาพ 3 มิติที่หมุนได้ สูตรที่แทนค่าจากภาพสด ๆ และโค้ด JavaScript / C++ / Python ที่รันได้จริง

ไม่ใช้ framework และไม่มี dependency ใช้แค่ Node.js, HTML, CSS, Canvas และ MathML

## เริ่มใช้

```
npm start          # เปิด http://localhost:5173 (พาไปที่ /web/)
npm test           # unit test ของ lib
npm run check      # รันตัวอย่างทั้ง 3 ภาษา แล้วเทียบผลว่าตรงกัน
npm run zv -- dot 1,2,3 4,5,6    # เครื่องคิดเลขเวกเตอร์ที่แสดงทุกขั้นตอน
```

ต้องมี Node.js 18 ขึ้นไป ส่วน Python 3 และ g++ ใช้เฉพาะตอนรันตัวอย่างภาษานั้น

## เปิดบนเว็บ (GitHub Pages)

บทเรียนเป็นไฟล์ static ทั้งหมด จึงเปิดบน GitHub Pages ได้โดยไม่ต้อง build: <https://zardokar.github.io/ZVect/>
(หน้าแรกพาไปที่ `web/` ให้เอง และเก็บส่วน `#/ชื่อบท` ของลิงก์ไว้)

ตั้งค่าครั้งเดียว: GitHub → repo ZVect → **Settings → Pages** → Source: **Deploy from a branch** →
Branch: **main**, folder **/ (root)** → Save หลังจากนั้นทุกครั้งที่ push ขึ้น `main` เว็บจะอัปเดตเองภายในไม่กี่นาที

- ทุกลิงก์ในเว็บเป็นแบบ relative ทั้งในเครื่อง (`npm start`) และบน Pages ใช้ layout เดียวกัน: `web/`, `lib/`, `examples/`, `docs/outhtm/`
- `.nojekyll` ที่ root บอก GitHub Pages ให้เสิร์ฟไฟล์ตรง ๆ ไม่ผ่าน Jekyll
- Pages เปิดทุกไฟล์ที่ push ขึ้นไปให้อ่านผ่าน URL ได้ (รวม `checkpoints/` และ `docs/aimd/`) ส่วน `.dropzone/` ไม่ถูก push เพราะอยู่ใน `.gitignore`

## บทเรียน

เลขแบบ บท.หัวข้อ (1, 1.1, 1.2 …) หนึ่งหัวข้อมีเรื่องเดียว

| บท | หัวข้อ | เรื่อง | ไฟล์ |
|---|---|---|---|
| 1 พื้นฐานเวกเตอร์ | 1.1 | Vector: ลิสต์ของตัวเลข = ลูกศร | `01_vector` |
| | 1.2 | ความยาวของเวกเตอร์ (norm) | `16_length` |
| | 1.3 | Vector space: ห้อง 3 มิติ, ข้อมูล = จุดในห้อง, ปุ่มสุ่มจุด | `04_vector_space` |
| | 1.4 | บวก ลบ คูณ: สร้างเวกเตอร์ใหม่ทีละช่อง | `15_vector_ops` |
| | 1.5 | Matrix: เวกเตอร์หลายตัวเรียงเป็นแถว, ขนาด แถว × คอลัมน์ | `20_matrix` |
| 2 วัดว่าสองเวกเตอร์ใกล้กันแค่ไหน | 2.1 | Euclidean distance: ความยาวของ a − b | `11_distance` |
| | 2.2 | Dot product: คูณแล้วบวก, เงาของเวกเตอร์ | `02_dot_product` |
| | 2.3 | Cosine similarity: เทียบทิศโดยไม่สนความยาว, cosine distance = 1 − cos | `03_cosine` |
| 3 เปลี่ยนข้อความเป็นเวกเตอร์ | 3.1 | Token ID: เลขประจำคำเป็นแค่ป้ายชื่อ (good 6, bad 22, great 21) | `21_token_id` |
| | 3.2 | One-hot: เลข 1 ตัวเดียว ทุกคู่ห่างกันเท่ากัน | `22_one_hot` |
| | 3.3 | Bag of words: นับคำแล้วได้เวกเตอร์ (StatQuest) | `23_bag_of_words` |
| | 3.4 | Embedding matrix: one-hot × ตาราง = หยิบแถวของคำ | `12_embedding_matrix` |
| | 3.5 | ตารางมาจากการฝึก: เริ่มสุ่ม แล้วปรับทีละนิด (CBOW แบบย่อ) | `24_learn_table` |
| | 3.6 | Latent space: แกนที่มีความหมาย, king − man + woman | `05_latent_space` |
| 4 ค้นหาของที่ใกล้ที่สุด | 4.1 | ค้นด้วย cosine (top-3) | `06_similarity` |
| | 4.2 | ค้นด้วย distance | `18_search_distance` |
| | 4.3 | ค้นด้วย dot | `19_search_dot` |
| | 4.4 | เลือกวิธีวัด: เมื่อไหร่สามแบบตอบต่างกัน, normalize แล้วเหมือนกัน | `07_choose_metric` |
| 5 ค้นให้เร็วเมื่อข้อมูลเยอะ | 5.1 | มิติสูง: ระยะและ cosine บีบเข้าหากัน | `08_high_dimensions` |
| | 5.2 | Vector search: เดินกราฟสองชั้น (แนวคิด HNSW) | `13_vector_search` |
| | 5.3 | เวกเตอร์ 1 บิต: เทียบด้วย XOR + popcount | `17_binary_xor` |
| 6 ใช้งานจริง | 6.1 | Bi-Encoder: แปลงคำถามและเอกสารเป็นเวกเตอร์แยกกัน | `09_bi_encoder` |
| | 6.2 | Reranker: คัด top-k แล้วจัดอันดับใหม่ (จับคำปฏิเสธ) | `14_reranker` |
| | 6.3 | Classification: nearest centroid | `10_classification` |
| 7 เวกเตอร์ใน LLM | 7.1 | LLM input: แถวละ token แล้วบวกเวกเตอร์ตำแหน่ง | `25_llm_input` |
| | 7.2 | Attention: ให้คะแนนด้วย query · key | `26_attention` |

เลขหน้าไฟล์ (`01_`…`26_`) คือลำดับที่เขียนไฟล์ ไม่ใช่ลำดับบท ลำดับบทกำหนดใน `GROUPS` ของ `web/js/app.js`

## โครงสร้าง

```
lib/          ไลบรารีเวกเตอร์ (zvect.js / zvect.py / zvect.hpp) + MANIFEST.json  ← เอาไปใช้ที่นี่
examples/     ตัวอย่างของแต่ละบท js/ py/ cpp/ (ไฟล์เดียวกับแท็บโค้ดในเว็บ)
web/          หน้าเว็บบทเรียน: js/scene3d.js (3D renderer), lessons/*.js, css/
tools/        check-examples.js, make-manifest.js, zv.js
tests/        node:test
docs/         APPROVALS.md (กติกาเรื่อง dependency), outhtm/ + aimd/ (สรุปคลิปที่อ่านมา)
REFERENCE.md  แหล่งที่อ่านมาและใช้ประกอบบทเรียน
checkpoints/  สถานะงานและ WIP ledger สำหรับ AI session ถัดไป
index.html    หน้าแรกของ GitHub Pages (พาไปที่ web/)
server.js     เว็บเซิร์ฟเวอร์ด้วย node:http (layout เดียวกับ GitHub Pages)
llms.txt      คู่มือสั้นสำหรับ AI ที่จะเอา lib ไปใช้
```

## เอา lib ไปใช้

ดู [lib/README.md](lib/README.md) หรือเปิดหน้า "เอา lib ไปใช้" ในเว็บ
ถ้าจะให้ AI session อื่นใช้ ส่ง [llms.txt](llms.txt) ให้มันอ่าน

## กติกาของ repo

1. **ไม่ใช้ framework และไม่มี dependency** ถ้าจำเป็นต้องมีบันทึกอนุญาตพร้อมวันเวลาใน [docs/APPROVALS.md](docs/APPROVALS.md) ก่อน
2. **Dark theme เท่านั้น** ห้ามเพิ่ม light theme
3. ตัวอย่างและความรู้ต้อง **สั้นและง่าย** และแต่ละบทใช้เฉพาะสิ่งที่บทก่อนหน้าสอนไปแล้ว
4. แก้ `lib/` แล้วต้องรัน `npm run manifest`, `npm test`, `npm run check` ให้ผ่าน

## สำหรับ AI session (read first)

- **Authoritative checkpoint:** walk `checkpoints/checkpoint.zvect.ver*.md` by version number and read the
  latest in full, **§6 (WIP) first**. Current: `checkpoints/checkpoint.zvect.ver001.md` (2026-10-10).
- Checkpoints are written in English. Shorthand: `upckp` = append an entry to §5b of the latest
  checkpoint and update the WIP tables · `newckp` = cut the next version · `hz` = write a handoff into
  `.dropzone/hzup_claude/` (git-ignored).
- Never run `git` write commands for the owner; he commits and pushes himself.

## License

ใช้ศึกษาและทดลองได้ ห้ามใช้เชิงพาณิชย์โดยไม่ได้รับอนุญาต ดู [LICENSE](LICENSE)
