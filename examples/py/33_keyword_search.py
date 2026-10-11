# 33 Keyword search vs meaning: an inverted index (word -> documents) finds the same words;
# a vector search (mean of word vectors, cosine) finds similar meaning. The word vectors are a made-up toy table.
import sys, os; sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "..", "lib"))
from zvect import words, encode, cosine, fmt

docs = ["Cancel anytime", "Cancellation policy", "Order cancellation timeline", "End your membership today",
        "Pause your plan", "Manage billing", "Sourdough bread recipe", "Ticket ZV-1042 login error"]
table = {                  # axes: leave, money, food
    "cancel": [1, 0.2, 0], "cancellation": [1, 0.3, 0], "end": [0.9, 0, 0], "membership": [0.7, 0.4, 0], "subscription": [0.7, 0.5, 0],
    "pause": [0.8, 0.3, 0], "plan": [0.5, 0.6, 0], "order": [0.3, 0.6, 0.2], "policy": [0.3, 0.5, 0], "billing": [0.2, 1, 0],
    "manage": [0.1, 0.5, 0], "sourdough": [0, 0, 1], "bread": [0, 0.1, 1], "recipe": [0, 0.1, 0.9], "quit": [1, 0.1, 0], "stop": [0.9, 0.1, 0],
}

index = {}                 # inverted index: word -> documents that contain it
for i, d in enumerate(docs):
    for w in dict.fromkeys(words(d)):
        index.setdefault(w, []).append(i)

for q in ["cancel my subscription", "ZV-1042"]:
    print("query: " + q)
    hits = {}
    for w in dict.fromkeys(words(q)):
        lst = index.get(w, [])
        print("  index[" + w + "] = " + (" | ".join(docs[i] for i in lst) if lst else "-"))
        for i in lst: hits[i] = hits.get(i, 0) + 1
    kw = [docs[i] for i, _ in sorted(hits.items(), key=lambda t: (-t[1], t[0]))]
    print("  keyword: " + (" | ".join(kw) if kw else "nothing"))
    qv = encode(q, table)
    top = sorted([(i, cosine(qv, encode(d, table))) for i, d in enumerate(docs)], key=lambda t: (-t[1], t[0]))
    top = [t for t in top if t[1] > 0][:3]
    print("  meaning: " + (" | ".join(docs[i] + " " + fmt(s) for i, s in top) if top else "nothing (no known word)"))
