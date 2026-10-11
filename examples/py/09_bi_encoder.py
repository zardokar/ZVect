# 09 Bi-encoder: query and documents are encoded SEPARATELY into vectors,
# then compared with cosine. Docs are encoded once, ahead of time.
# toy encoder = average of word vectors. axes: x = food, y = animal, z = tech
# Part 2 asks the same question in Thai. Thai puts no spaces between words, so words() sees the whole
# sentence as ONE unknown word. A dictionary split (longest known word first) finds the words again.
import sys, os; sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "..", "lib"))
from zvect import encode, top_k, words, fmt
sys.stdout.reconfigure(encoding="utf-8")  # Thai text prints the same on every system

table = {
    "eat": [1, 0, 0], "rice": [1, 0, 0], "noodle": [1, 0, 0], "hungry": [0.9, 0.1, 0],
    "cat": [0, 1, 0], "dog": [0, 1, 0], "pet": [0, 1, 0], "bark": [0.1, 0.9, 0],
    "code": [0, 0, 1], "computer": [0, 0, 1], "phone": [0, 0, 1], "app": [0, 0, 1],
    "bug": [0, 0.5, 0.5],
}
docs = [
    "cat and dog are pets",
    "eat rice and noodle",
    "write code on a computer",
    "the phone app has a bug",
]
# Thai word -> the English word with the same meaning (so it gets the same vector)
thai = {"สัตว์เลี้ยง": "pet", "หิว": "hungry", "หมา": "dog", "แมว": "cat", "กิน": "eat", "ข้าว": "rice"}

def split_dict(text, d):
    """longest match: at each place take the longest dictionary word; unknown letters are kept together"""
    ch, out, unk, i = list(text), [], "", 0
    longest = max(len(w) for w in d)
    while i < len(ch):
        n = min(longest, len(ch) - i)
        while n > 0 and "".join(ch[i:i + n]) not in d:
            n -= 1
        if n == 0:
            unk += ch[i]; i += 1; continue
        if unk:
            out.append(unk); unk = ""
        out.append("".join(ch[i:i + n]))
        i += n
    if unk:
        out.append(unk)
    return out

doc_vecs = [(d, encode(d, table)) for d in docs]   # offline
q = encode("my pet is hungry", table)               # online
print("query = " + fmt(q))
for doc, s in top_k(q, doc_vecs, 2):
    print(fmt(s) + "  " + doc)

th = "สัตว์เลี้ยงของฉันหิว"                          # "my pet is hungry"
print("thai, split at spaces: " + " | ".join(words(th)) + "  -> " + fmt(encode(th, table)))
parts = split_dict(th, thai)
qth = encode(" ".join(thai[w] for w in parts if w in thai), table)
print("thai, split by dictionary: " + " | ".join(parts) + "  -> " + fmt(qth))
for doc, s in top_k(qth, doc_vecs, 2):
    print(fmt(s) + "  " + doc)
