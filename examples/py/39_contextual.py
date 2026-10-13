# 39 Static vs contextual embeddings (toy): a static model gives a word one row of its table in every sentence;
# a contextual model mixes that row with the rows of the sentence's words. Mixing rule (simplified attention, author's toy):
# score_j = (e . E[x_j]) / sqrt(d) ; a = softmax(score) ; c = sum_j a_j * E[x_j]. Table and numbers made up by the author.
import math
import os
import sys
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "..", "lib"))
from zvect import dot, cosine, fmt

table = {
    "bank": [2, 2, 0.5], "deposited": [3.5, 0, 0.5], "money": [4, 0.5, 0], "reached": [0.5, 1, 1], "river": [0.5, 4, 0],
    "apple": [2, 0.5, 2], "ate": [0, 1, 3.5], "released": [3.5, 1, 0], "phone": [4, 0, 1], "fruit": [0.5, 0.5, 4], "company": [4, 0.5, 0.5],
}
cases = [
    {"word": "bank", "senses": ["money", "river"], "sentences": [("I deposited money in the bank", ["deposited", "money", "bank"]),
                                                                 ("I reached Yamuna river bank", ["reached", "river", "bank"])]},
    {"word": "apple", "senses": ["fruit", "company"], "sentences": [("I ate an apple", ["ate", "apple"]),
                                                                   ("Apple released a phone", ["apple", "released", "phone"])]},
]


# the contextual vector of word in a sentence, and the weight of each word of the sentence
def contextualize(word, words):
    e = table[word]
    scores = [dot(e, table[w]) / math.sqrt(len(e)) for w in words]
    top = max(scores)
    ex = [math.exp(s - top) for s in scores]       # subtract the largest score first: same weights, no overflow
    total = 0.0
    for x in ex:
        total += x
    weights = [x / total for x in ex]
    c = [0.0, 0.0, 0.0]
    for j, w in enumerate(words):
        for i in range(3):
            c[i] += weights[j] * table[w][i]
    return c, weights


def sense_line(name, v, senses):
    parts = ["cos(" + name + ", " + s + ") " + fmt(cosine(v, table[s])) for s in senses]
    return "  ".join(parts)


for k in cases:
    e = table[k["word"]]
    print("word \"" + k["word"] + "\"")
    print("  static: e = " + fmt(e) + "  " + sense_line("e", e, k["senses"]) + "  (same row in every sentence)")
    got = []
    for text, words in k["sentences"]:
        c, weights = contextualize(k["word"], words)
        got.append(c)
        w = [x + " " + fmt(weights[j]) for j, x in enumerate(words)]
        print("  sentence \"" + text + "\"")
        print("    weights: " + ", ".join(w))
        print("    c = " + fmt(c) + "  " + sense_line("c", c, k["senses"]))
    print("  same word, two sentences: static cos " + fmt(cosine(e, e)) + ", contextual cos " + fmt(cosine(got[0], got[1])))
