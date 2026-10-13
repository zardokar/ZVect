# 41 Self-attention, the full formula: A = softmax(Q K^T / sqrt(d_k)), out = A V, with Q = X Wq, K = X Wk, V = X Wv.
# Formula from Stanford CME295 Lecture 1; the 5 tokens are the lecture's sentence, every number is made up by the author
# (Wq swaps dims 1 and 2, Wk = Wv = I). Also: no scaling (peakier weights) and the decoder's causal mask (later tokens get 0).
import math
import os
import sys
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "..", "lib"))
from zvect import fmt

tokens = ["A", "cute", "teddy bear", "is", "reading"]
X = [[0.2, 0.2, 0.1], [2.0, 0.4, 0.2], [0.6, 2.0, 0.4], [0.2, 0.2, 0.6], [0.4, 0.6, 2.0]]
Wq = [[0, 1, 0], [1, 0, 0], [0, 0, 1]]
Wk = [[1, 0, 0], [0, 1, 0], [0, 0, 1]]
Wv = [[1, 0, 0], [0, 1, 0], [0, 0, 1]]


def matmul(A, B):
    out = []
    for row in A:
        r = [0.0] * len(B[0])
        for k in range(len(row)):
            for j in range(len(r)):
                r[j] += row[k] * B[k][j]
        out.append(r)
    return out


def attend(scaled, causal):
    Q, K, V = matmul(X, Wq), matmul(X, Wk), matmul(X, Wv)
    div = math.sqrt(len(K[0])) if scaled else 1.0
    A = []
    for i in range(len(Q)):
        s = []
        for j in range(len(K)):
            d = 0.0
            for c in range(len(K[j])):
                d += Q[i][c] * K[j][c]
            s.append(-math.inf if causal and j > i else d / div)
        top = max(s)
        e = [0.0 if x == -math.inf else math.exp(x - top) for x in s]
        total = 0.0
        for x in e:
            total += x
        A.append([x / total for x in e])
    return A, matmul(A, V)


for title, scaled, causal in [("scaled by sqrt(d_k)", True, False), ("not scaled", False, False), ("scaled + causal mask", True, True)]:
    A, out = attend(scaled, causal)
    print(title)
    for i in range(len(tokens)):
        print("  " + tokens[i].ljust(11) + " weights " + fmt(A[i]) + "  out " + fmt(out[i]))
