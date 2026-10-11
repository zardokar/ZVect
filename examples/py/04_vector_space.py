# 04 Vector space: a 3D room; data = points in it (no calculation needed)
import sys, os; sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "..", "lib"))
from zvect import vec, fmt

p1 = vec(2, 3, 1)                        # one example point
points = [p1]

# "Random point" button, 3 presses. A tiny repeatable random, so JS / Python / C++ print the same.
seed = 7
def rand():                              # whole number -4..4
    global seed
    seed = (seed * 16807) % 2147483647
    return seed % 9 - 4
for _ in range(3):
    x = rand(); y = rand(); z = rand()
    points.append(vec(x, y, z))

for i, p in enumerate(points):
    print("p" + str(i + 1) + " = " + fmt(p) + "   (" + str(len(p)) + " numbers)")
print("points in the room: " + str(len(points)))

del points[1:]                           # clear the random points: p1 and the room are still there
print("after clearing: " + str(len(points)) + " point, p1 = " + fmt(points[0]))
