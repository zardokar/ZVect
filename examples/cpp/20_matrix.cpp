// 20 Matrix: many vectors stacked as rows. Shape = rows x columns. A_ij = row i, column j.
#include <iostream>
#include <string>
#include "../../lib/zvect.hpp"
using namespace zv;

long long seed = 7;
double rnd() { seed = (seed * 16807) % 2147483647; return double(seed % 9 - 4); }   // whole number -4..4

std::string shape(const std::vector<Vec>& M) {
  return std::to_string(M.size()) + " rows x " + std::to_string(M[0].size()) + " columns";
}

int main() {
  std::vector<Vec> A = {   // 4 rows x 3 columns: one row = one vector
    {2, 3, 1},             // a1
    {-1, 2, 3},            // a2
    {3, -2, 2},            // a3
    {1, 1, -3},            // a4
  };
  std::cout << "shape of A = " << shape(A) << "\n";
  for (size_t i = 0; i < A.size(); ++i) std::cout << "a" << i + 1 << " = " << fmt(A[i]) << "\n";
  // the formula counts from 1, code counts from 0: A_23 is A[1][2]
  std::cout << "A_23 (row 2, column 3) = " << fmt(A[1][2]) << "\n";
  Vec col;
  for (const Vec& row : A) col.push_back(row[0]);
  std::cout << "column 1 (x of every row) = " << fmt(col) << "\n";

  // "Random row" button, pressed once. A tiny repeatable random, so JS / Python / C++ print the same.
  double x = rnd(), y = rnd(), z = rnd();  // in this order (C++ does not fix the order inside {...} calls)
  A.push_back({x, y, z});
  std::cout << "added a5 = " << fmt(A[4]) << " -> shape of A = " << shape(A) << "\n";
}
