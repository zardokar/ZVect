// 08 High dimensions: with many dimensions, every point is almost the same distance away
// 200 random points in [0, 1]^d and one random query; how spread out are the distances?
#include <algorithm>
#include <iostream>
#include "../../lib/zvect.hpp"
using namespace zv;

// tiny seeded random numbers (same in JS / Python / C++): x = x * 48271 mod (2^31 - 1)
long long seed = 7;
double rand01() { seed = (seed * 48271) % 2147483647; return seed / 2147483647.0; }
// the first few numbers after a small seed are tiny, so start() throws 10 away
void start(long long s) { seed = s; for (int i = 0; i < 10; i++) rand01(); }
Vec point(int d) { Vec v(d); for (auto& x : v) x = rand01(); return v; }

int main() {
  for (int d : {2, 10, 100, 1000}) {
    start(7);
    Vec q = point(d);
    std::vector<double> ds, cs;
    for (int i = 0; i < 200; i++) { Vec p = point(d); ds.push_back(distance(q, p)); cs.push_back(cosine(q, p)); }
    double lo = *std::min_element(ds.begin(), ds.end()), hi = *std::max_element(ds.begin(), ds.end());
    std::cout << "d=" << d << "  distance " << fmt(lo) << " .. " << fmt(hi) << "  spread " << fmt((hi - lo) / lo)
              << "  cosine " << fmt(*std::min_element(cs.begin(), cs.end())) << " .. " << fmt(*std::max_element(cs.begin(), cs.end())) << "\n";
  }
}
