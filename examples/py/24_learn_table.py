# 24 Learning the table (toy): rows start random, each step moves a word's row a little toward its context.
# c = (e_left + e_right) / 2 ; e_w <- e_w + eta * (c - e_w). A simplified rule to see the idea, not real word2vec.
import sys, os; sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "..", "lib"))
from zvect import add, sub, scale, mean, cosine, fmt

ctx = {"pet": [-0.5, 3.5, 0.5], "sleeps": [0.5, 2.5, -0.5], "drive": [3.5, 0, 0.5], "fast": [2.5, 1, -0.5]}
windows = [("pet", "cat", "sleeps"), ("pet", "dog", "sleeps"), ("drive", "car", "fast"), ("drive", "bus", "fast")]
E = {"cat": [-2, -1, 2], "dog": [2, -2, -1], "car": [-1, 2, -2], "bus": [1, 1, 2]}   # "random" start rows
eta = 0.3

def one_pass():                         # every window once
    for l, w, r in windows:
        c = mean([ctx[l], ctx[r]])      # context = mean of the left and right rows
        E[w] = add(E[w], scale(sub(c, E[w]), eta))

def report(n):
    print("after " + str(n) + " passes: cos(cat,dog) " + fmt(cosine(E["cat"], E["dog"])) +
          "  cos(car,bus) " + fmt(cosine(E["car"], E["bus"])) + "  cos(cat,car) " + fmt(cosine(E["cat"], E["car"])))

report(0)
done = 0
for n in [1, 5, 20]:
    while done < n:
        one_pass(); done += 1
    report(n)
print("cat row now = " + fmt(E["cat"]) + "  (context of cat = " + fmt(mean([ctx["pet"], ctx["sleeps"]])) + ")")
