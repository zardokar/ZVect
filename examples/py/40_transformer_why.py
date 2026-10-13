# 40 Why the Transformer: in an RNN, information from an earlier token reaches a later one only through the hidden state,
# one step per token in between; attention connects the two directly (1 step). Toy "kept" = keep^steps (author's illustration).
# Sentences from Stanford CME295 Lecture 1 (~51:44); the inserted sentence is made up by the author.
import os
import sys
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "..", "lib"))
from zvect import fmt

near = ["My", "teddy bear", "is", "so", "cute", ".", "It", "is", "3", "feet", "tall"]
far = ["My", "teddy bear", "is", "so", "cute", ".", "We", "went", "to", "the", "park", "and", "played", "all", "day", ".",
       "It", "is", "3", "feet", "tall"]
keep = 0.6

for name, tokens in [("near", near), ("far", far)]:
    hops = abs(tokens.index("It") - tokens.index("teddy bear"))
    print(name + ": " + str(len(tokens)) + " tokens")
    print("  RNN: It <- teddy bear takes " + str(hops) + " steps, kept " + fmt(keep ** hops)
          + ", reading needs " + str(len(tokens)) + " steps in a row")
    print("  attention: 1 step, kept " + fmt(1) + ", one layer reads all " + str(len(tokens)) + " tokens at once")
