// 17 1-bit vectors (Qdrant talk, 25:25): 1 bit per dimension (here: positive -> 1), compare with XOR + popcount
#include <iostream>
#include <string>
#include "../../lib/zvect.hpp"
using namespace zv;

int main() {
  Vec p = {0.9, -0.2, 0.4, -0.7, 0.1, 0.3, -0.5, 0.8};
  Vec q = {0.7, 0.1, 0.5, -0.6, -0.2, 0.2, -0.4, 0.9};
  auto pack = [](const Vec& v) { unsigned n = 0; for (size_t i = 0; i < v.size(); ++i) if (v[i] > 0) n |= 1u << i; return n; };  // dimension i -> bit i
  auto popcount = [](unsigned n) { int c = 0; while (n) { c += n & 1u; n >>= 1; } return c; };
  auto bitsText = [](unsigned n, size_t d) { std::string s; for (size_t i = 0; i < d; ++i) s += ((n >> i) & 1u) ? '1' : '0'; return s; };
  unsigned P = pack(p), Q = pack(q);
  std::cout << "bits p = " << bitsText(P, p.size()) << "\n";
  std::cout << "bits q = " << bitsText(Q, q.size()) << "\n";
  std::cout << "p XOR q = " << bitsText(P ^ Q, p.size()) << "\n";
  std::cout << "popcount(p XOR q) = " << popcount(P ^ Q) << " of " << p.size() << " dimensions differ\n";
  std::cout << "full-precision distance(p, q) = " << fmt(distance(p, q)) << "\n";
}
