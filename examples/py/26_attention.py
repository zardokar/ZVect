# 26 Attention starts with query . key: score_j = q . k_j ; the key with the highest score gets the most attention.
# Vectors from the SH AI Academy slide (~3:44). The slide printed 0.69 and 0.15; the real values are 0.70 and 0.23.
import sys, os; sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "..", "lib"))
from zvect import dot, fmt

keys = [("key1", [0.2, 0.7, 0.4]), ("key2", [0.9, 0.1, 0.2])]

def attend(q):
    print("query = " + fmt(q))
    best = None
    for name, k in keys:
        by_hand = q[0] * k[0] + q[1] * k[1] + q[2] * k[2]
        print("  q . " + name + " = " + fmt(by_hand) + " (by hand) = " + fmt(dot(q, k)) + " (lib)")
        if best is None or dot(q, k) > best[1]:
            best = (name, dot(q, k))
    print("  most attention: " + best[0])

attend([0.1, 0.8, 0.3])       # the slide's query
attend([0.9, 0.2, 0.1])       # a query toward dim 1: key2 wins
