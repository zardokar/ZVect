# 22 One-hot: one 1 at the word's position, 0 everywhere else. Every pair of words is equally far apart.
import sys, os; sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "..", "lib"))
from zvect import cosine, distance, fmt

vocab = ["good", "bad", "great"]                        # V = 3 words, so a one-hot vector has 3 numbers
def one_hot(w): return [1 if x == w else 0 for x in vocab]

for w in vocab:
    print("one-hot(" + w + ") = " + fmt(one_hot(w)))
for a, b in [("good", "bad"), ("good", "great"), ("bad", "great")]:
    print(a + " vs " + b + ": cos " + fmt(cosine(one_hot(a), one_hot(b))) + ", dist " + fmt(distance(one_hot(a), one_hot(b))))
print("same word: cos " + fmt(cosine(one_hot("good"), one_hot("good"))) + ", dist " + fmt(distance(one_hot("good"), one_hot("good"))))

# A real vocabulary: 50,000 words -> 50,000 numbers per word, only one of them is 1
V = 50000
big = [0] * V
big[123] = 1                                            # some word at position 123
print("V = " + str(V) + ": ones = " + str(big.count(1)) + ", zeros = " + str(big.count(0)))
