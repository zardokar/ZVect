# 01 Vector: a list of numbers = an arrow from the origin (0,0,0)
import sys, os; sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "..", "lib"))
from zvect import vec, fmt

v = vec(3, 4, 0)                               # x=3, y=4, z=0
print("v = " + fmt(v))
print("walk: x " + str(v[0]) + ", then y " + str(v[1]) + ", then z " + str(v[2]))
print("dimensions = " + str(len(v)))
