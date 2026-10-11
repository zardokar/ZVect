# 36 Late interaction (ColBERT idea): keep ONE VECTOR PER TOKEN instead of one per sentence.
# score(q, d) = sum over query tokens of the best dot with any document token (MaxSim, then sum).
# Compared with the bi-encoder of lesson 09 (average of word vectors, then cosine). Toy vectors, axes: food, animal, tech.
import sys, os; sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "..", "lib"))
from zvect import encode, words, normalize, dot, fmt

table = {
    "eat": [1, 0, 0], "rice": [1, 0, 0], "noodle": [1, 0, 0], "fish": [0.5, 0.5, 0],
    "cat": [0, 1, 0], "dog": [0, 1, 0], "pet": [0, 1, 0], "pets": [0, 1, 0], "bark": [0.1, 0.9, 0],
    "code": [0, 0, 1], "computer": [0, 0, 1], "phone": [0, 0, 1], "app": [0, 0, 1], "robot": [0, 0.2, 0.8], "bug": [0, 0.5, 0.5],
}
docs = [
    "cat and dog are pets", "eat rice and noodle", "write code on a computer", "the phone app has a bug",
    "my dog likes fish", "a robot pet that can bark", "my cat likes fish and rice and my phone app has a bug",
]
def tokens(text):  # one unit vector per known word
    return [normalize(table[w]) for w in words(text) if w in table]
def late(q, d):
    dt = tokens(d)
    return sum(max(dot(t, u) for u in dt) for t in tokens(q))

query = "eat rice and fix a bug"
print("query: " + query)
bi, li = (float("-inf"), 0), (float("-inf"), 0)
for i, d in enumerate(docs):
    c, s = dot(encode(query, table), encode(d, table)), late(query, d)
    print("d" + str(i + 1) + "  cos " + fmt(c) + "  late " + fmt(s) + "  " + d)
    if c > bi[0] + 1e-9: bi = (c, i)
    if s > li[0] + 1e-9: li = (s, i)
print("bi-encoder picks d" + str(bi[1] + 1) + ", late interaction picks d" + str(li[1] + 1))
