# 02 Dot product: multiply matching parts, then add them up
import sys, os; sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "..", "lib"))
from zvect import vec, dot, project, fmt

a = vec(1, 2, 3)
b = vec(4, 5, 6)
print("by hand = " + fmt(1 * 4 + 2 * 5 + 3 * 6))
print("dot(a,b) = " + fmt(dot(a, b)))

# perpendicular vectors -> dot = 0
print("dot(x,y) = " + fmt(dot(vec(1, 0, 0), vec(0, 1, 0))))

# shadow of b on a (projection)
print("proj b on a = " + fmt(project(b, a)))
