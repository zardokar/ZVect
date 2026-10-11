# 27 Brute force (exact k-NN): measure the query against every point; the work equals N.
import sys, os; sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "..", "lib"))
from zvect import distance, fmt

# a tiny repeatable random (minstd), so JS / Python / C++ make the same points: x = x * 48271 mod (2^31 - 1)
def points(n, seed):
    def rand():
        nonlocal seed
        seed = (seed * 48271) % 2147483647
        return seed / 2147483647
    for _ in range(10):
        rand()                                   # the first numbers after a small seed are tiny; skip them
    P = []
    for _ in range(n):
        x = rand() * 8 - 4; y = rand() * 8 - 4; z = rand() * 8 - 4
        P.append([x, y, z])
    return P

def nearest(q, P):
    best, measured = 0, 0
    for i in range(len(P)):
        measured += 1
        if distance(q, P[i]) < distance(q, P[best]):
            best = i
    return best, measured

q = [1, 1, 1]
for n in [10, 100, 1000]:
    P = points(n, 7)
    best, measured = nearest(q, P)
    print("N = " + str(n) + ": nearest = point " + str(best + 1) + " " + fmt(P[best]) + ", dist " + fmt(distance(q, P[best])) + ", measured " + str(measured))
