"""zvect.py — tiny vector library for learning. Standard library only.
A vector is a plain list of floats. Same API and same rules as zvect.js and zvect.hpp.
Rules: size mismatch / empty list / empty table -> raises ValueError.
License: see LICENSE (non-commercial)."""
import math
import re

VERSION = "0.1.0"

def _same(a, b):
    if len(a) != len(b):
        raise ValueError(f"size mismatch: {len(a)} vs {len(b)}")

# ---------- basics ----------
def vec(*xs): return list(xs)                                        # vec(1,2,3) -> [1,2,3]
def add(a, b): _same(a, b); return [x + y for x, y in zip(a, b)]    # a + b
def sub(a, b): _same(a, b); return [x - y for x, y in zip(a, b)]    # a - b
def scale(a, k): return [x * k for x in a]                          # k * a

# ---------- products & lengths ----------
def dot(a, b): _same(a, b); return sum(x * y for x, y in zip(a, b))  # Σ a_i * b_i
def norm(a): return math.sqrt(dot(a, a))                             # |a|

def normalize(a):                                         # a / |a|  (zero stays zero)
    n = norm(a)
    return [0.0] * len(a) if n == 0 else scale(a, 1 / n)

def distance(a, b): return norm(sub(a, b))                # |a - b|

# ---------- angles & similarity ----------
def cosine(a, b):                                         # (a·b) / (|a||b|), 0 if a zero vector
    n = norm(a) * norm(b)
    return 0.0 if n == 0 else dot(a, b) / n

def angle(a, b):                                          # θ in radians
    return math.acos(max(-1.0, min(1.0, cosine(a, b))))

def project(b, a):                                        # projection of b onto a
    aa = dot(a, a)
    return [0.0] * len(a) if aa == 0 else scale(a, dot(a, b) / aa)

# ---------- many vectors ----------
def mean(vectors):                                        # centroid
    if not vectors:
        raise ValueError("empty list")
    for v in vectors:
        _same(vectors[0], v)
    return [sum(col) / len(vectors) for col in zip(*vectors)]

def top_k(query, items, k=3, metric=cosine):
    """items: [(id, vector)] -> [(id, score)] best first (ties keep input order)"""
    scored = [(i, metric(query, v)) for i, v in items]
    return sorted(scored, key=lambda t: t[1], reverse=True)[:k]

def classify(x, centroids, metric=cosine):
    """centroids: {label: vector} -> (label, score) (ties: first label wins)"""
    if not centroids:
        raise ValueError("no centroids")
    best = (None, -math.inf)
    for label, c in centroids.items():
        s = metric(x, c)
        if s > best[1]:
            best = (label, s)
    return best

# ---------- printing (same output in JS / Python / C++) ----------
def fmt(x):
    if isinstance(x, (list, tuple)):
        return "[" + ", ".join(f"{v + 0.0:.3f}" for v in x) + "]"
    return f"{x + 0.0:.3f}"

# ---------- toy bi-encoder ----------
# Words = runs of [a-z0-9] or any non-ASCII letter (so Thai works). Only A-Z is lower-cased.
_SEP = re.compile(r"[\x00-\x2f\x3a-\x60\x7b-\x7f]+")
_UPPER = str.maketrans("ABCDEFGHIJKLMNOPQRSTUVWXYZ", "abcdefghijklmnopqrstuvwxyz")

def words(text):
    return [w for w in _SEP.split(text.translate(_UPPER)) if w]

def encode(text, table):
    """table: {word: vector}. Unknown words are skipped.
    Returns a unit vector, or a zero vector if no word is known."""
    if not table:
        raise ValueError("empty table")
    known = [w for w in words(text) if w in table]
    if not known:
        return [0.0] * len(next(iter(table.values())))
    return normalize(mean([table[w] for w in known]))
