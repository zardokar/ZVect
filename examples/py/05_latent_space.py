# 05 Latent space: each word is a point; similar meaning = nearby.
# Real models learn hundreds of unnamed axes; here we name 3 by hand:
# x = royal, y = gender (+male / -female), z = adult
import sys, os; sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "..", "lib"))
from zvect import add, sub, top_k, fmt

W = {
    "king": [0.9, 0.9, 0.9],   "queen": [0.9, -0.9, 0.9],
    "man": [0.1, 0.9, 0.9],    "woman": [0.1, -0.9, 0.9],
    "prince": [0.8, 0.9, 0.2], "princess": [0.8, -0.9, 0.2],
    "boy": [0.1, 0.9, 0.1],    "girl": [0.1, -0.9, 0.1],
}

# king - man + woman = ?
x = add(sub(W["king"], W["man"]), W["woman"])
print("king - man + woman = " + fmt(x))

items = [(w, v) for w, v in W.items() if w not in ("king", "man", "woman")]
# topK = sort by cosine, keep the best k (more in the Similarity search lesson)
for word, score in top_k(x, items, 2):
    print(word + " " + fmt(score))
