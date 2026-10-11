# 15 Add, subtract, scale: make new vectors from the ones you have (the result still has 3 numbers)
import sys, os; sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "..", "lib"))
from zvect import vec, add, sub, scale, fmt

a = vec(2, 0, 1)
b = vec(0, 1, 2)
print("a + b = " + fmt(add(a, b)))
print("a - b = " + fmt(sub(a, b)))
print("2 * a = " + fmt(scale(a, 2)))

# every 3D vector = a mix of the 3 basis vectors e1, e2, e3
e1, e2, e3 = vec(1, 0, 0), vec(0, 1, 0), vec(0, 0, 1)
v = add(add(scale(e1, 2), scale(e2, 3)), scale(e3, 1))
print("2e1 + 3e2 + 1e3 = " + fmt(v))
