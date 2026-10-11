# 25 LLM input: one row per token (n x d), then add a position vector to each row: x_i = e_(t_i) + p_i
# Sentence and IDs from the clip; the 3-number rows and position vectors are made up so they can be drawn.
import sys, os; sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "..", "lib"))
from zvect import add, fmt

id_ = {"The": 791, "cat": 8415, "sat": 7731, "on": 389, "a": 264, "mat": 5634}
E = {"The": [0.1, 0.1, 0.1], "cat": [0.9, 0.8, 0.0], "sat": [0.2, 0.1, 0.9], "on": [0.1, 0.4, 0.3], "a": [0.1, 0.0, 0.2], "mat": [0.3, 0.9, 0.2]}
P = [[0.0, 0.3, 0.0], [0.3, 0.0, 0.0], [0.0, 0.0, 0.3], [0.3, 0.3, 0.0], [0.0, 0.3, 0.3], [0.3, 0.0, 0.3]]

def table(tokens, with_pos):
    return [add(E[t], P[i]) if with_pos else E[t] for i, t in enumerate(tokens)]

s1 = ["The", "cat", "sat", "on", "a", "mat"]
s2 = ["The", "mat", "sat", "on", "a", "cat"]          # cat and mat swapped

X = table(s1, True)
print("tokens: " + " ".join(s1) + "  IDs: " + ", ".join(str(id_[t]) for t in s1))
print("shape of X = " + str(len(X)) + " x " + str(len(X[0])) + " (position added, shape unchanged)")
for i, row in enumerate(X):
    print("x" + str(i + 1) + " " + s1[i] + " = " + fmt(row))

# Without positions the swapped sentence has the same rows, only reordered. With positions, cat's row changes.
def same_set(A, B): return ",".join(sorted(fmt(r) for r in A)) == ",".join(sorted(fmt(r) for r in B))
print("no position:   same set of rows after swap? " + ("true" if same_set(table(s1, False), table(s2, False)) else "false"))
print("with position: same set of rows after swap? " + ("true" if same_set(table(s1, True), table(s2, True)) else "false"))
print("cat at position 2 = " + fmt(table(s1, True)[1]) + ", cat at position 6 = " + fmt(table(s2, True)[5]))
