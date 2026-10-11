# 35 BPE (Byte Pair Encoding): start from characters, merge the most frequent adjacent pair k times,
# then apply the merges in the same order to new text. Corpus and new sentence from the BPE clip.
# Every pair is counted; a tie goes to the pair seen first. Spaces and punctuation are characters. ASCII text only.
CORPUS = "fred fed ted bread, and ted fed fred bread"
NEW = "ted and fred are friends"
K = 4
def q(t): return '"' + t + '"'

def merge(toks, a, b):
    out, i = [], 0
    while i < len(toks):
        if i + 1 < len(toks) and toks[i] == a and toks[i + 1] == b:
            out.append(a + b); i += 2
        else:
            out.append(toks[i]); i += 1
    return out

def top_pair(toks):                            # most frequent adjacent pair; first seen wins a tie
    count = {}
    for i in range(len(toks) - 1):
        k = (toks[i], toks[i + 1])
        count[k] = count.get(k, 0) + 1          # dict keeps the order pairs were first seen
    best = None
    for k, n in count.items():
        if best is None or n > best[2]: best = (k[0], k[1], n)
    return best

toks = list(CORPUS)
def letter(c): return c.isascii() and c.isalnum()
vocab = sorted(set(toks), key=lambda c: (0 if letter(c) else 1, c))
print("corpus: " + str(len(toks)) + " characters, vocabulary: " + str(len(vocab)))
rules = []
for r in range(1, K + 1):
    best = top_pair(toks)
    if best is None: break                      # nothing left to merge
    a, b, n = best
    rules.append((a, b)); vocab.append(a + b)
    toks = merge(toks, a, b)
    print("round " + str(r) + ": " + q(a) + " + " + q(b) + " -> " + q(a + b) + " seen " + str(n) + " times, corpus now " + str(len(toks)) + " tokens")
print("vocabulary: " + " ".join(q(t) + ":" + str(i + 1) for i, t in enumerate(vocab)))

t = list(NEW)
for a, b in rules: t = merge(t, a, b)
print(NEW + " -> " + " ".join(q(x) for x in t))
print("ids: " + " ".join(str(vocab.index(x) + 1) if x in vocab else "?" for x in t))
