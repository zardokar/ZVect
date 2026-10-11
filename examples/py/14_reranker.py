# 14 Reranker: stage 1 = bi-encoder picks the top 3 fast (cosine on vectors made separately),
# stage 2 = a reranker reads query and document TOGETHER and re-orders those 3.
# toy reranker: count query words found in the doc, but not right after "no" / "not"; cosine breaks ties.
import sys, os; sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "..", "lib"))
from zvect import encode, top_k, words, fmt

table = {
    "eat": [1, 0, 0], "rice": [1, 0, 0], "noodle": [1, 0, 0], "hungry": [0.9, 0.1, 0], "feed": [0.8, 0.2, 0],
    "cat": [0, 1, 0], "dog": [0, 1, 0], "pets": [0, 1, 0], "code": [0, 0, 1], "computer": [0, 0, 1],
}
docs = ["the dog is not hungry", "feed my hungry dog rice", "cat and dog are pets", "eat rice and noodle", "write code on a computer"]

def matches(query, doc):
    q, w, found = set(words(query)), words(doc), set()
    for i, x in enumerate(w):
        if x in q and not (i > 0 and w[i - 1] in ("no", "not")): found.add(x)
    return len(found)

query = "hungry dog"
stage1 = top_k(encode(query, table), [(d, encode(d, table)) for d in docs], 3)
print("stage 1 (bi-encoder, cosine):")
for doc, s in stage1: print("  " + fmt(s) + "  " + doc)
stage2 = sorted(((doc, matches(query, doc), matches(query, doc) + s) for doc, s in stage1), key=lambda r: -r[2])
print("stage 2 (rerank = matched words + cosine):")
for doc, m, s in stage2: print("  " + fmt(s) + "  " + doc + "  (matched " + str(m) + ")")
