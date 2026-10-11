# Edge-case rules that must be identical in JS / Python / C++ (run by npm run check)
import sys, os; sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "..", "..", "lib"))
import zvect as zv

def try_it(name, f):
    try:
        print(name + " = " + f())
    except ValueError as e:
        print(name + " throws " + str(e))

try_it("add size mismatch", lambda: zv.fmt(zv.add([1, 2, 3], [1, 2])))
try_it("dot size mismatch", lambda: zv.fmt(zv.dot([1, 2], [1, 2, 3])))
try_it("mean empty", lambda: zv.fmt(zv.mean([])))
try_it("mean ragged", lambda: zv.fmt(zv.mean([[1, 2], [1, 2, 3]])))
try_it("classify empty", lambda: zv.classify([1, 0], {})[0])
try_it("encode empty table", lambda: zv.fmt(zv.encode("cat", {})))
print("cosine zero = " + zv.fmt(zv.cosine([0, 0, 0], [1, 2, 3])))
print("normalize zero = " + zv.fmt(zv.normalize([0, 0])))
print("fmt tie 0.0625 = " + zv.fmt(0.0625))
print("fmt tie 0.0375 = " + zv.fmt(0.0375))
print("fmt -0 = " + zv.fmt(-0.0))
print("classify tie = " + zv.classify([1, 1], {"b": [1, 0], "a": [0, 1]})[0])
print("topK tie = " + zv.top_k([1, 0], [("p", [1, 1]), ("q", [1, 1])], 1)[0][0])
T = {"แมว": [0, 1], "กิน": [1, 0], "cat": [0, 1]}
print("encode thai = " + zv.fmt(zv.encode("แมว กิน", T)))
print("encode CAT = " + zv.fmt(zv.encode("CAT!!", T)))
print("encode unknown = " + zv.fmt(zv.encode("constructor toString", T)))
# near-zero: 1e-300 squared underflows to 0, so the lib treats it as a zero vector; 1e-150 still works
print("cosine near-zero 1e-300 = " + zv.fmt(zv.cosine([1e-300, 0, 0], [1, 2, 3])))
print("cosine tiny 1e-150 = " + zv.fmt(zv.cosine([1e-150, 0, 0], [1, 2, 3])))
print("normalize near-zero = " + zv.fmt(zv.normalize([1e-300, 0])))
# on unit vectors dot == cosine and |a-b|^2 == 2 - 2cos
ua, ub = zv.normalize([3, 1, 0]), zv.normalize([3, 2, 0])
print("unit dot = " + zv.fmt(zv.dot(ua, ub)) + " cosine = " + zv.fmt(zv.cosine([3, 1, 0], [3, 2, 0])))
print("unit dist^2 = " + zv.fmt(zv.distance(ua, ub) ** 2) + " 2-2cos = " + zv.fmt(2 - 2 * zv.cosine(ua, ub)))
