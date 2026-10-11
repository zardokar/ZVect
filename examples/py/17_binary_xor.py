# 17 1-bit vectors (Qdrant talk, 25:25): 1 bit per dimension (here: positive -> 1), compare with XOR + popcount
import sys, os; sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "..", "lib"))
from zvect import vec, distance, fmt

p = vec(0.9, -0.2, 0.4, -0.7, 0.1, 0.3, -0.5, 0.8)
q = vec(0.7, 0.1, 0.5, -0.6, -0.2, 0.2, -0.4, 0.9)
def pack(v): return sum((1 if x > 0 else 0) << i for i, x in enumerate(v))   # dimension i -> bit i
def popcount(n): return bin(n).count("1")
def bits_text(n, d): return "".join(str((n >> i) & 1) for i in range(d))
P, Q = pack(p), pack(q)
print("bits p = " + bits_text(P, len(p)))
print("bits q = " + bits_text(Q, len(q)))
print("p XOR q = " + bits_text(P ^ Q, len(p)))
print("popcount(p XOR q) = " + str(popcount(P ^ Q)) + " of " + str(len(p)) + " dimensions differ")
print("full-precision distance(p, q) = " + fmt(distance(p, q)))
