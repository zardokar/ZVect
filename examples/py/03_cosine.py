# 03 Cosine similarity: compare DIRECTION only, ignore length
import sys, os; sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "..", "lib"))
import math
from zvect import vec, cosine, angle, fmt

a = vec(1, 1, 0)
print("same direction = " + fmt(cosine(a, vec(2, 2, 0))))    #  1
print("perpendicular  = " + fmt(cosine(a, vec(1, -1, 0))))   #  0
print("opposite       = " + fmt(cosine(a, vec(-1, -1, 0))))  # -1

# angle in degrees
deg = math.degrees(angle(a, vec(1, 0, 0)))
print("angle(a,x) = " + fmt(deg) + " deg")
