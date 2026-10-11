# 23 Bag of words: count each word -> a vector; compare two sentences with cosine (examples from StatQuest)
import sys, os, math; sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "..", "lib"))
from zvect import words, cosine, angle, fmt

def bag(a, b):
    wa, wb = words(a), words(b)
    vocab = list(dict.fromkeys(wa + wb))               # every different word, in the order first seen
    def count(ws): return [ws.count(v) for v in vocab]
    return vocab, count(wa), count(wb)

pairs = [
    ("Hello, World!", "Hello!"),
    ("Hello, World!", "Hello Hello Hello!"),
    ("Hello, World!", "Hello, World!"),
    ("Hello!", "World!"),
    ("I love Troll 2!", "I love Gymkata!"),
]
for a, b in pairs:
    vocab, A, B = bag(a, b)
    print(a + " | " + b)
    print("  words " + ",".join(vocab) + "  A = " + fmt(A) + "  B = " + fmt(B))
    print("  cos = " + fmt(cosine(A, B)) + "  angle = " + fmt(angle(A, B) * 180 / math.pi) + " deg")
