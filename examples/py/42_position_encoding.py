# 42 Sinusoidal position encoding. Pair i is a clock hand with angle theta_i = pos / 10000^(2i/d);
# PE = (sin theta_0, cos theta_0, sin theta_1, cos theta_1, ...). Close positions are similar (cosine), far ones less.
# Idea (clock hands at different speeds) from Stanford CME295 Lecture 1; formula from the 2017 paper; d = 8 chosen by the author.
import math
import os
import sys
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "..", "lib"))
from zvect import cosine, fmt

d = 8
base = 10000


def position(pos):
    out = []
    for i in range(0, d, 2):
        angle = pos / math.pow(base, i / d)
        out.append(math.sin(angle))
        out.append(math.cos(angle))
    return out


for pos in [0, 1, 10, 60]:
    print("PE(" + str(pos) + ") = " + fmt(position(pos)))
for k in [1, 5, 20]:
    print("cos(PE(10), PE(" + str(10 + k) + ")) = " + fmt(cosine(position(10), position(10 + k))) + "  (" + str(k) + " apart)")
