# 11 Euclidean distance: how far apart two points are = the length of a - b
import sys, os; sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "..", "lib"))
from zvect import vec, sub, norm, distance, scale, fmt

a = vec(1, 2, 2)
b = vec(4, 6, 2)
print("a - b = " + fmt(sub(a, b)))
print("|a - b| = " + fmt(norm(sub(a, b))))
print("distance(a, b) = " + fmt(distance(a, b)))
print("distance(b, a) = " + fmt(distance(b, a)))
print("distance(a, a) = " + fmt(distance(a, a)))

# same direction, different length: the tips are still apart
c = scale(a, 2)
print("c = 2a = " + fmt(c) + "   distance(a, c) = " + fmt(distance(a, c)))
