# 12 Embedding matrix: one row per word. one-hot x matrix = pick that word's row (a lookup).
# axes of a row: animal, pet, vehicle
import sys, os; sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "..", "lib"))
from zvect import add, scale, fmt

vocab = ["cat", "dog", "lion", "car", "bus"]
E = [                  # 5 words x 3 numbers
    [0.9, 0.9, 0.0],   # cat
    [0.9, 1.0, 0.0],   # dog
    [1.0, 0.2, 0.0],   # lion
    [0.0, 0.1, 0.9],   # car
    [0.1, 0.0, 1.0],   # bus
]
def one_hot(w): return [1 if x == w else 0 for x in vocab]
# h x E = sum of (h_i * row i); only the row with h_i = 1 survives
def times(h):
    acc = [0, 0, 0]
    for i, hi in enumerate(h):
        acc = add(acc, scale(E[i], hi))
    return acc

print("one-hot(dog) = " + fmt(one_hot("dog")))
print("one-hot(dog) x E = " + fmt(times(one_hot("dog"))))
print("row of dog (lookup by ID 1) = " + fmt(E[vocab.index("dog")]))
for w in vocab:
    same = fmt(times(one_hot(w))) == fmt(E[vocab.index(w)])
    print(w + ": one-hot x E " + ("==" if same else "!=") + " row " + str(vocab.index(w)))
