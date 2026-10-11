# 14 Reranker: stage 1 = bi-encoder picks the top 3 fast (cosine on vectors made separately),
# stage 2 = a reranker reads query and document TOGETHER and re-orders those 3.
# toy reranker: count query words found in the doc, but not right after "no" / "not"; cosine breaks ties.
# Part 2 runs the same search in Thai: split by dictionary first (Thai has no spaces), turn each known Thai
# word into the English word with the same meaning, then reuse the same two stages. "ไม่" = "not".
import sys, os; sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "..", "lib"))
from zvect import encode, top_k, words, fmt
sys.stdout.reconfigure(encoding="utf-8")  # Thai text prints the same on every system

table = {
    "eat": [1, 0, 0], "rice": [1, 0, 0], "noodle": [1, 0, 0], "hungry": [0.9, 0.1, 0], "feed": [0.8, 0.2, 0],
    "cat": [0, 1, 0], "dog": [0, 1, 0], "pets": [0, 1, 0], "code": [0, 0, 1], "computer": [0, 0, 1],
}
docs = ["the dog is not hungry", "feed my hungry dog rice", "cat and dog are pets", "eat rice and noodle", "write code on a computer"]
thai_docs = ["หมาไม่หิว", "ให้ข้าวหมาที่หิว", "แมวกับหมาเป็นสัตว์เลี้ยง", "กินข้าวและก๋วยเตี๋ยว", "เขียนโค้ดบนคอมพิวเตอร์"]
thai = {
    "หมา": "dog", "หิว": "hungry", "ไม่": "not", "ข้าว": "rice", "แมว": "cat", "สัตว์เลี้ยง": "pets",
    "กิน": "eat", "ก๋วยเตี๋ยว": "noodle", "โค้ด": "code", "คอมพิวเตอร์": "computer",
}

def matches(query, doc):
    q, w, found = set(words(query)), words(doc), set()
    for i, x in enumerate(w):
        if x in q and not (i > 0 and w[i - 1] in ("no", "not")): found.add(x)
    return len(found)

def to_english(text):
    """longest match: at each place take the longest dictionary word; unknown letters are skipped here"""
    ch, out, i = list(text), [], 0
    longest = max(len(w) for w in thai)
    while i < len(ch):
        n = min(longest, len(ch) - i)
        while n > 0 and "".join(ch[i:i + n]) not in thai:
            n -= 1
        if n == 0:
            i += 1; continue
        out.append(thai["".join(ch[i:i + n])])
        i += n
    return " ".join(out)

def search(query, docs, show):
    """query and docs in English words; show[i] = how document i is printed"""
    stage1 = top_k(encode(query, table), [(i, encode(d, table)) for i, d in enumerate(docs)], 3)
    print("stage 1 (bi-encoder, cosine):")
    for i, s in stage1: print("  " + fmt(s) + "  " + show[i])
    stage2 = sorted(((i, matches(query, docs[i]), matches(query, docs[i]) + s) for i, s in stage1), key=lambda r: -r[2])
    print("stage 2 (rerank = matched words + cosine):")
    for i, m, s in stage2: print("  " + fmt(s) + "  " + show[i] + "  (matched " + str(m) + ")")

search("hungry dog", docs, docs)
print("thai: หมาหิว -> " + to_english("หมาหิว") + ", หมาไม่หิว -> " + to_english("หมาไม่หิว"))
search(to_english("หมาหิว"), [to_english(d) for d in thai_docs], thai_docs)
