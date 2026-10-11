# 18 Search by distance: score every item with Euclidean distance, keep the 3 smallest (lower = closer)
# axes: x = food, y = animal, z = vehicle
import sys, os; sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "..", "lib"))
from zvect import top_k, distance, fmt

items = [
    ("apple", [0.9, 0.1, 0.0]),
    ("banana", [0.95, 0.05, 0.0]),
    ("cat", [0.05, 0.9, 0.1]),
    ("horse", [0.1, 0.8, 0.5]),
    ("car", [0.0, 0.05, 0.95]),
]
query = [0.7, 0.3, 0.0]

print("top 3 by distance (lower = closer):")
neg_dist = lambda a, b: -distance(a, b)                  # top_k keeps the highest, so rank by -distance
for name, s in top_k(query, items, 3, neg_dist):
    print("  " + name + " " + fmt(-s))
