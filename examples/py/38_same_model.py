# 38 Same model for the question and the documents (toy): two tables trained with the same rule from different random
# starts. Inside each model cat is near dog, but cat in model A and cat in model B are unrelated vectors.
# Training rule = 24_learn_table (c = (e_left + e_right) / 2 ; e_w <- e_w + eta * (c - e_w)); context rows start random too.
import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "..", "lib"))
from zvect import add, sub, scale, mean, cosine, top_k, fmt

windows = [("pet", "cat", "sleeps"), ("pet", "dog", "sleeps"), ("drive", "car", "fast"), ("drive", "bus", "fast")]
ctx_words = ["pet", "sleeps", "drive", "fast"]
vocab = ["cat", "dog", "car", "bus"]
eta = 0.3
passes = 5


# a tiny repeatable random (minstd), so JS / Python / C++ make the same tables: x = x * 48271 mod (2^31 - 1)
def train(seed):
    def nxt():
        nonlocal seed
        seed = (seed * 48271) % 2147483647
        return seed

    for _ in range(10):
        nxt()                                       # the first numbers after a small seed are tiny; skip them

    def row():
        return [((nxt() % 17) - 8) / 2 for _ in range(3)]      # -4 .. 4 in steps of 0.5

    ctx = {w: row() for w in ctx_words}
    E = {w: row() for w in vocab}
    for _ in range(passes):
        for l, w, r in windows:
            c = mean([ctx[l], ctx[r]])
            E[w] = add(E[w], scale(sub(c, E[w]), eta))
    return E


model = {"A": train(16), "B": train(18)}   # same sentences, same rule; only the random start (seed) differs
for m in ["A", "B"]:
    E = model[m]
    print("inside " + m + ": cos(cat,dog) " + fmt(cosine(E["cat"], E["dog"])) + "  cos(car,bus) " + fmt(cosine(E["car"], E["bus"])) +
          "  cos(cat,car) " + fmt(cosine(E["cat"], E["car"])))
print("cat in A = " + fmt(model["A"]["cat"]) + "   cat in B = " + fmt(model["B"]["cat"]))
print("same word, two models: cos(cat_A, cat_B) = " + fmt(cosine(model["A"]["cat"], model["B"]["cat"])))

# search: documents are stored by one model, the question is turned into a vector by one model
print("question \"cat\"")
for q, d in [("A", "A"), ("B", "A"), ("B", "B"), ("A", "B")]:
    docs = [(w, model[d][w]) for w in vocab]
    ranked = top_k(model[q]["cat"], docs, 4)
    listed = ", ".join(i + " " + fmt(s) for i, s in ranked)
    print("  question by " + q + ", documents by " + d + ": " + listed +
          "  -> top-1 " + ranked[0][0] + ("  (same model)" if q == d else "  (mixed: meaningless)"))
