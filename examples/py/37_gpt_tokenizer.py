# 37 GPT tokenizer (byte-level BPE): turn text into UTF-8 bytes (0-255), merge the most frequent adjacent pair
# k times with new ids 256, 257, ..., then encode new text (oldest rule first) and decode it back.
# From Karpathy's "Let's build the GPT Tokenizer". Ties go to the pair seen first. Sample text: author's choice.
import sys
sys.stdout.reconfigure(encoding="utf-8")  # Thai text prints the same on every system
CORPUS = "แมวกินปลา แมวกินนม หมากินข้าว แมวนอน หมานอน"
NEW = "แมวกินข้าว"
K = 6
def utf8(s): return list(s.encode("utf-8"))

def merge(ids, a, b, idx):
    out, i = [], 0
    while i < len(ids):
        if i + 1 < len(ids) and ids[i] == a and ids[i + 1] == b:
            out.append(idx); i += 2
        else:
            out.append(ids[i]); i += 1
    return out

def top_pair(ids):                             # most frequent adjacent pair; first seen wins a tie
    count = {}
    for pair in zip(ids, ids[1:]):
        count[pair] = count.get(pair, 0) + 1    # dict keeps the order pairs were first seen
    if not count: return None
    best = max(count, key=count.get)            # max keeps the first of equal counts
    return best[0], best[1], count[best]

data = utf8(CORPUS)
print("corpus: " + str(len(CORPUS)) + " characters, " + str(len(data)) + " bytes")
print("first character " + CORPUS[0] + " -> bytes " + " ".join(str(b) for b in utf8(CORPUS[0])))
vocab = {i: [i] for i in range(256)}
rules = []                                      # (a, b, new id), in the order they were made
ids = data
for r in range(K):
    p = top_pair(ids)
    if p is None: break
    a, b, n = p
    idx = 256 + r
    rules.append((a, b, idx)); vocab[idx] = vocab[a] + vocab[b]
    ids = merge(ids, a, b, idx)
    print("merge " + str(r + 1) + ": (" + str(a) + ", " + str(b) + ") -> " + str(idx) + " seen " + str(n) + " times, bytes " + " ".join(str(x) for x in vocab[idx]))
print("corpus: " + str(len(data)) + " bytes -> " + str(len(ids)) + " tokens, ratio " + f"{len(data) / len(ids):.2f}")

def encode(text):
    t = utf8(text)
    while len(t) >= 2:
        best = None                             # the pair with the oldest rule (smallest new id)
        for i in range(len(t) - 1):
            for a, b, idx in rules:
                if t[i] == a and t[i + 1] == b and (best is None or idx < best[2]): best = (a, b, idx)
        if best is None: break
        t = merge(t, *best)
    return t

out = encode(NEW)
print(NEW + ": " + str(len(utf8(NEW))) + " bytes -> " + str(len(out)) + " tokens: " + " ".join(str(i) for i in out))
back = bytes(b for i in out for b in vocab[i]).decode("utf-8", errors="replace")
print("decode -> " + back + (" (same as the input)" if back == NEW else " (different)"))
print("token 256 alone = bytes " + " ".join(str(x) for x in vocab[256]) + " (not a whole character)")
