import { M } from "../js/kit.js";
import { searchMount, AXIS_NAMES, VIEW } from "../js/search.js";

export default {
  slug: "search-dot",
  title: "ค้นด้วย dot: ทิศตรงและยาว ได้คะแนนมาก",
  en: "Search by dot",
  example: "19_search_dot",
  axisNames: AXIS_NAMES,
  view: VIEW,
  intro: `
    <p>ค้นแบบเดียวกับบท {#search-cosine} แต่ให้คะแนนด้วย <b>dot product</b> (บท {#dot-product}): คูณช่องที่ตรงกันแล้วบวก</p>
    <p>dot ดูทั้งทิศและความยาว <b>ยิ่งมากยิ่งใกล้</b> ของที่ยาวกว่าจึงได้เปรียบ</p>`,
  try: [
    "เลื่อน query ไปทางแกน vehicle: top-3 เปลี่ยนเป็นรถ",
    "ดู banana (ยาวกว่า apple นิดหน่อย): dot มักให้ของที่ยาวขึ้นอันดับต้น",
  ],
  steps: [
    ["ให้คะแนนหนึ่งชิ้น", "dot ของ query กับของชิ้นนั้น (บท {#dot-product})"],
    ["เลือก 3 อันดับแรก", "ทำขั้นตอน 1 กับทุกชิ้น แล้วเก็บ 3 ชิ้นที่คะแนนสูงสุด"],
  ],
  lines: [
    [M.math(M.v("q"), M.o("·"), M.v("d"), M.o("="), M.sum(M.i("i"), M.t("")), M.sub(M.i("q"), M.i("i")), M.sub(M.i("d"), M.i("i"))),
      "ให้คะแนนของหนึ่งชิ้น · <b>q</b> = query · <b>d</b> = ของในคลังหนึ่งชิ้น · คูณช่องที่ i ของทั้งสองแล้วบวกทุกช่อง · สูตรเดียวกับบท {#dot-product}"],
    [M.math(M.t("top-3"), M.o("="), M.t("3 items with the highest\u00a0"), M.v("q"), M.o("·"), M.v("d")),
      "ทำขั้นตอน 1 กับของทุกชิ้น แล้วเก็บ 3 ชิ้นที่คะแนนสูงสุด"],
  ],
  symbols: [["q", "query: เวกเตอร์ของสิ่งที่ค้น", "ลากด้วยแถบเลื่อน"], ["d", "document: เวกเตอร์ของของในคลังหนึ่งชิ้น", "ทำกับทุกชิ้น (9 ชิ้น)"], ["q · d", "คะแนนแบบ dot: ดูทั้งทิศและความยาว", "ยิ่งมากยิ่งใกล้ · คำนวณเร็วที่สุด (ไม่มีราก ไม่มีหาร)"], ["top-3", "3 ชิ้นที่ได้คะแนนดีที่สุด", "เส้นสีแดงในภาพ หนาสุด = อันดับ 1"]],
  notes: `
    <h2>dot ในระบบจริง</h2>
    <ul>
      <li>เร็วที่สุดในสามแบบ: แค่คูณแล้วบวก</li>
      <li>ถ้าเวกเตอร์ถูกย่อให้ยาว 1 แล้ว (normalize) dot จะเท่ากับ cosine (ดูบท {#choose-metric})</li>
      <li>คลิป Qdrant บอกว่าโมเดลส่วนใหญ่ใช้ dot product</li>
      <li>ใน Transformer คะแนน attention ก็เริ่มจาก dot ของ query กับ key</li>
    </ul>`,
  refs: [["metrics", "dot ดูทั้งทิศและขนาด เร็วที่สุด, ใช้ใน attention"], ["qdrant", "ฟังก์ชันระยะกำหนดโดยโมเดล ส่วนใหญ่ใช้ dot product (4:52)"]],
  mount(ui) {
    return searchMount(ui, "dot");
  },
};
