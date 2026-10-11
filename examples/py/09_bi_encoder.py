# 09 Bi-encoder: query and documents are encoded SEPARATELY into vectors,
# then compared with cosine. Docs are encoded once, ahead of time.
# toy encoder = average of word vectors. axes: x = food, y = animal, z = tech
import sys, os; sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "..", "lib"))
from zvect import encode, top_k, fmt

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

doc_vecs = [(d, encode(d, table)) for d in docs]   # offline
q = encode("my pet is hungry", table)               # online
print("query = " + fmt(q))
for doc, s in top_k(q, doc_vecs, 2):
    print(fmt(s) + "  " + doc)
