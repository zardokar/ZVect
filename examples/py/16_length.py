# 16 Length (norm): |v| = sqrt(x² + y² + z²)
import sys, os; sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "..", "lib"))
import math
from zvect import vec, norm, fmt

v = vec(3, 4, 0)
by_hand = math.sqrt(3 * 3 + 4 * 4 + 0 * 0)
print("|v|    = " + fmt(by_hand) + " (by hand)")
print("norm() = " + fmt(norm(v)) + " (lib)")
print("|(1, 2, 2)| = " + fmt(norm(vec(1, 2, 2))))
print("|(-3, 4, 0)| = " + fmt(norm(vec(-3, 4, 0))) + " (sign does not change the length)")
