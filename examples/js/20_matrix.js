// 20 Matrix: many vectors stacked as rows. Shape = rows x columns. A_ij = row i, column j.
import { vec, fmt } from "../../lib/zvect.js";

const A = [              // 4 rows x 3 columns: one row = one vector
  vec(2, 3, 1),          // a1
  vec(-1, 2, 3),         // a2
  vec(3, -2, 2),         // a3
  vec(1, 1, -3),         // a4
];
const shape = (M) => M.length + " rows x " + M[0].length + " columns";

console.log("shape of A = " + shape(A));
A.forEach((row, i) => console.log("a" + (i + 1) + " = " + fmt(row)));
// the formula counts from 1, code counts from 0: A_23 is A[1][2]
console.log("A_23 (row 2, column 3) = " + fmt(A[1][2]));
console.log("column 1 (x of every row) = " + fmt(A.map((row) => row[0])));

// "Random row" button, pressed once. A tiny repeatable random, so JS / Python / C++ print the same.
let seed = 7;
const rand = () => { seed = (seed * 16807) % 2147483647; return (seed % 9) - 4; };   // whole number -4..4
A.push(vec(rand(), rand(), rand()));
console.log("added a5 = " + fmt(A[4]) + " -> shape of A = " + shape(A));
