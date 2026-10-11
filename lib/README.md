# lib/ — zvect

ไลบรารีเวกเตอร์ไฟล์เดียว ไม่มี dependency มีสามภาษาที่ใช้ API เดียวกัน
หน้าเว็บบทเรียนก็ import ไฟล์ `zvect.js` ตัวนี้ตรง ๆ

| ไฟล์ | ภาษา | ใช้ |
|---|---|---|
| `zvect.js` | JavaScript (Node 18+ / browser) | `import { cosine } from "./zvect.js"` |
| `zvect.py` | Python 3 (stdlib) | `from zvect import cosine` |
| `zvect.hpp` | C++17 header-only | `#include "zvect.hpp"` แล้วใช้ `zv::cosine(...)` |
| `MANIFEST.json` | — | version + sha256 ของทุกไฟล์ |

## เอาไปใช้ 3 แบบ

1. **คัดลอกไฟล์เดียว** ไปวางในโปรเจกต์ (ง่ายที่สุด)
2. **ดาวน์โหลดจาก GitHub** เช่น `https://raw.githubusercontent.com/zardokar/ZVect/main/lib/zvect.js`
   แล้วตรวจ sha256 กับ `MANIFEST.json`
3. **npm จาก git**: `npm install github:zardokar/ZVect` แล้ว `import { cosine } from "zvect"`

## ให้ AI session อื่นใช้

ส่ง `llms.txt` ที่ root ของ repo ให้ AI อ่าน ไฟล์นั้นมี API ทั้งหมด ลิงก์ raw และกติกาของ repo ในที่เดียว

## แก้ lib แล้วต้องทำอะไร

```
npm run manifest   # อัปเดต sha256
npm test           # unit test + ตรวจว่า MANIFEST ตรงกับไฟล์ + ไม่มี dependency
npm run check      # รันตัวอย่างทั้ง JS / Python / C++ แล้วเทียบผลว่าตรงกัน
```

เปลี่ยน `VERSION` ต้องแก้ให้ตรงกันทั้ง `package.json`, `zvect.js`, `zvect.py`, `zvect.hpp` (test จะจับให้)
