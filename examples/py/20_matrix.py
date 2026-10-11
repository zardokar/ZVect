# 20 Matrix: many vectors stacked as rows. Shape = rows x columns. A_ij = row i, column j.
import sys, os; sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "..", "lib"))
from zvect import vec, fmt

A = [                    # 4 rows x 3 columns: one row = one vector
    vec(2, 3, 1),        # a1
    vec(-1, 2, 3),       # a2
    vec(3, -2, 2),       # a3
    vec(1, 1, -3),       # a4
]
def shape(M): return str(len(M)) + " rows x " + str(len(M[0])) + " columns"

print("shape of A = " + shape(A))
for i, row in enumerate(A):
    print("a" + str(i + 1) + " = " + fmt(row))
# the formula counts from 1, code counts from 0: A_23 is A[1][2]
print("A_23 (row 2, column 3) = " + fmt(A[1][2]))
print("column 1 (x of every row) = " + fmt([row[0] for row in A]))

# "Random row" button, pressed once. A tiny repeatable random, so JS / Python / C++ print the same.
seed = 7
def rand():
    global seed
    seed = (seed * 16807) % 2147483647
    return (seed % 9) - 4                # whole number -4..4
A.append(vec(rand(), rand(), rand()))
print("added a5 = " + fmt(A[4]) + " -> shape of A = " + shape(A))
