# 21 Token ID: a word's number is a name tag, not a position. gap(a, b) = |id(a) - id(b)|
import sys, os; sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "..", "lib"))
from zvect import vec, distance, fmt

id_ = {"good": 6, "bad": 22, "great": 21}        # IDs from the clip ("This movie was good / bad / great")
# one number = a 1-number vector, so the gap is the Euclidean distance of lesson 2.1
def gap(ids, a, b): return distance(vec(ids[a]), vec(ids[b]))
pairs = [("good", "great"), ("bad", "great"), ("good", "bad")]

for a, b in pairs:
    print("gap(" + a + ", " + b + ") = " + fmt(gap(id_, a, b)))
print("by ID, closest to great: " + ("bad" if gap(id_, "bad", "great") < gap(id_, "good", "great") else "good") + "  (wrong: good and great mean almost the same)")

# Give the same words other numbers (here: alphabetical order). Meaning did not change, the "closeness" did.
abc = {"bad": 0, "good": 1, "great": 2}
for a, b in pairs:
    print("alphabetical IDs: gap(" + a + ", " + b + ") = " + fmt(gap(abc, a, b)))
