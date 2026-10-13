# 43 One transformer block: X + PE -> 2-head self-attention -> concat x W_O -> add & layer norm -> FFN (ReLU) -> add & norm.
# Every stage keeps n x d_model (5 x 4) except the FFN hidden layer (5 x 8). Structure from Stanford CME295 Lecture 1;
# sizes, input rows and random weights (minstd seeds) chosen by the author, so the numbers carry no meaning.
import math
import os
import sys
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "..", "lib"))
from zvect import fmt

X = [[0.2, 0.2, 0.1, 0.0], [2.0, 0.4, 0.2, 0.1], [0.6, 2.0, 0.4, 0.2], [0.2, 0.2, 0.6, 0.1], [0.4, 0.6, 2.0, 0.3]]
d_model = 4
heads = 2
d_k = 2
d_ff = 8
seed = 7
span = 0.8


def seeded(s, rows, cols):
    state = s
    for _ in range(10):
        state = (state * 48271) % 2147483647        # minstd; the first 10 numbers are thrown away
    M = []
    for _ in range(rows):
        row = []
        for _ in range(cols):
            state = (state * 48271) % 2147483647
            row.append(((state / 2147483647) * 2 - 1) * span)
        M.append(row)
    return M


def matmul(A, B):
    out = []
    for row in A:
        r = [0.0] * len(B[0])
        for k in range(len(row)):
            for j in range(len(r)):
                r[j] += row[k] * B[k][j]
        out.append(r)
    return out


def add(A, B):
    return [[x + B[i][j] for j, x in enumerate(row)] for i, row in enumerate(A)]


def norm(A):
    out = []
    for row in A:
        mean = 0.0
        for x in row:
            mean += x
        mean /= len(row)
        v = 0.0
        for x in row:
            v += (x - mean) * (x - mean)
        v /= len(row)
        out.append([(x - mean) / math.sqrt(v + 0.00001) for x in row])
    return out


def head(X0, h):
    s = seed + 10 * h
    Q = matmul(X0, seeded(s + 1, d_model, d_k))
    K = matmul(X0, seeded(s + 2, d_model, d_k))
    V = matmul(X0, seeded(s + 3, d_model, d_k))
    A = []
    for i in range(len(Q)):
        sc = []
        for j in range(len(K)):
            d = 0.0
            for c in range(d_k):
                d += Q[i][c] * K[j][c]
            sc.append(d / math.sqrt(d_k))
        top = max(sc)
        e = [math.exp(x - top) for x in sc]
        total = 0.0
        for x in e:
            total += x
        A.append([x / total for x in e])
    return matmul(A, V)


def pe(p, i):
    angle = p / math.pow(10000, (i - (i % 2)) / d_model)
    return math.sin(angle) if i % 2 == 0 else math.cos(angle)


X0 = [[x + pe(p, i) for i, x in enumerate(row)] for p, row in enumerate(X)]
outs = [head(X0, h) for h in range(heads)]
concat = [outs[0][i] + outs[1][i] for i in range(len(X0))]
mha = matmul(concat, seeded(seed + 101, heads * d_k, d_model))
norm1 = norm(add(X0, mha))
hidden = [[max(0.0, x) for x in row] for row in matmul(norm1, seeded(seed + 102, d_model, d_ff))]
ffn = matmul(hidden, seeded(seed + 103, d_ff, d_model))
out = norm(add(norm1, ffn))
for name, M in [("X + PE", X0), ("concat", concat), ("x W_O", mha), ("add & norm", norm1), ("FFN hidden", hidden), ("FFN out", ffn), ("block out", out)]:
    print(name.ljust(11) + str(len(M)) + " x " + str(len(M[0])) + "  teddy bear row " + fmt(M[2]))
