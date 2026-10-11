// 27 Brute force (exact k-NN): measure the query against every point; the work equals N.
#include <iostream>
#include <vector>
#include "../../lib/zvect.hpp"
using namespace zv;

// a tiny repeatable random (minstd), so JS / Python / C++ make the same points: x = x * 48271 mod (2^31 - 1)
std::vector<Vec> points(int n, long long seed) {
  auto rand = [&]() { seed = (seed * 48271) % 2147483647; return double(seed) / 2147483647; };
  for (int i = 0; i < 10; ++i) rand();              // the first numbers after a small seed are tiny; skip them
  std::vector<Vec> P;
  for (int i = 0; i < n; ++i) { double x = rand() * 8 - 4, y = rand() * 8 - 4, z = rand() * 8 - 4; P.push_back({x, y, z}); }
  return P;
}

int main() {
  Vec q = {1, 1, 1};
  for (int n : {10, 100, 1000}) {
    auto P = points(n, 7);
    size_t best = 0; int measured = 0;
    for (size_t i = 0; i < P.size(); ++i) {
      measured++;
      if (distance(q, P[i]) < distance(q, P[best])) best = i;
    }
    std::cout << "N = " << n << ": nearest = point " << best + 1 << " " << fmt(P[best]) << ", dist " << fmt(distance(q, P[best])) << ", measured " << measured << "\n";
  }
}
