// 31 HNSW build: every point is on level 0; flip a coin with heads chance 1/M, heads = also on the next level, repeat.
// Count the points on each level and compare with the expected N * (1/M)^k.
#include <cmath>
#include <cstdio>
#include <iostream>
#include <vector>
#include "../../lib/zvect.hpp"

long long seed;
double rnd() { seed = (seed * 48271) % 2147483647; return double(seed) / 2147483647; }   // tiny repeatable random

int main() {
  const int N = 1000000;
  for (int M : {16, 2}) {
    seed = 7;
    for (int i = 0; i < 10; ++i) rnd();
    std::vector<long> count;
    for (int i = 0; i < N; ++i) {
      size_t level = 0;
      while (rnd() < 1.0 / M) level++;          // heads: one level up, flip again; tails: stop
      for (size_t k = 0; k <= level; ++k) { if (k == count.size()) count.push_back(0); count[k]++; }
    }
    std::cout << "M = " << M << ", N = " << N << ": " << count.size() << " levels\n";
    for (size_t k = 0; k < count.size() && k < 6; ++k) {
      std::cout << "  level " << k << ": " << count[k] << "   expected " << zv::fmt(N * std::pow(1.0 / M, double(k))) << "\n";
    }
  }
}
