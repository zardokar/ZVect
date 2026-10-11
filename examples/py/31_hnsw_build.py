# 31 HNSW build: every point is on level 0; flip a coin with heads chance 1/M, heads = also on the next level, repeat.
# Count the points on each level and compare with the expected N * (1/M)^k.
import sys, os; sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "..", "lib"))
from zvect import fmt
def minstd(seed):                               # tiny repeatable random, same in JS / Python / C++
    state = [seed]
    def r():
        state[0] = (state[0] * 48271) % 2147483647
        return state[0] / 2147483647
    for _ in range(10):
        r()
    return r

N = 1000000
for M in [16, 2]:
    r, count = minstd(7), []
    for _ in range(N):
        level = 0
        while r() < 1 / M:                      # heads: one level up, flip again; tails: stop
            level += 1
        for k in range(level + 1):
            if k == len(count): count.append(0)
            count[k] += 1
    print("M = " + str(M) + ", N = " + str(N) + ": " + str(len(count)) + " levels")
    for k, c in enumerate(count[:6]):
        print("  level " + str(k) + ": " + str(c) + "   expected " + fmt(N * (1 / M) ** k))
