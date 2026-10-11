# 07 Choose a metric: cosine, distance and dot can pick different winners
# A = query, B = 2·A (same direction, longer), C = close to A but a different direction
import sys, os; sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "..", "lib"))
from zvect import cosine, distance, dot, normalize, fmt

A, B, C = [3, 1, 0], [6, 2, 0], [3, 2, 0]

def show(title, q, b, c):
    print(title)
    print("  B  cos " + fmt(cosine(q, b)) + "  dist " + fmt(distance(q, b)) + "  dot " + fmt(dot(q, b)))
    print("  C  cos " + fmt(cosine(q, c)) + "  dist " + fmt(distance(q, c)) + "  dot " + fmt(dot(q, c)))

show("raw (cos and dot pick B, distance picks C):", A, B, C)
show("normalized (all three pick B):", normalize(A), normalize(B), normalize(C))

# on unit vectors: |a - b|^2 = 2 - 2 cos
d = distance(normalize(A), normalize(C))
print("dist^2 = " + fmt(d * d) + "  2 - 2cos = " + fmt(2 - 2 * cosine(A, C)))
