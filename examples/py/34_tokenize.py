# 34 Tokenization: cut text into tokens (characters or words), then look each token up in a vocabulary.
# Character vocabulary from the BPE clip: a-z = 1-26, ! @ # $ = 27-30. Word vocabulary = the unique words of a small
# training corpus, sorted like a dictionary. A token that is not in the vocabulary gets "?". ASCII text only.
CHARS = list("abcdefghijklmnopqrstuvwxyz!@#$")
def char_id(ch): return str(CHARS.index(ch) + 1) if ch in CHARS else "?"

CORPUS = ["my dog eats fish", "i write code on my computer", "the app on my phone has a bug",
          "i want to eat noodles", "a robot dog that can bark", "pets like cats and dogs"]
WORDS = sorted(set(" ".join(CORPUS).split()))
def word_id(w): return str(WORDS.index(w) + 1) if w in WORDS else "?"

print("char vocabulary: " + str(len(CHARS)))
text = "hello there you are amazing"
n = 0
for w in text.split():
    ids = [char_id(ch) for ch in w]
    n += len(ids)
    print(w + " -> " + " ".join(ids))
print("by character: " + str(n) + " numbers (spaces get no number)")
print("by word: " + str(len(text.split())) + " numbers")

print("word vocabulary: " + str(len(WORDS)) + " words")
print(" ".join(w + ":" + str(i + 1) for i, w in enumerate(WORDS)))
s = "my dog eats fish"
print(s + " -> " + " ".join(word_id(w) for w in s.split()))
print("zebra by character -> " + " ".join(char_id(ch) for ch in "zebra"))
print("zebra by word -> " + word_id("zebra") + "  (not in the training corpus)")
