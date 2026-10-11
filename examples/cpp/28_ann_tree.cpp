// 28 ANN with a random-split tree (Annoy-style, as in the Serengil clip):
// split by the line halfway between two random points, repeat until a group has <= 5 points; walk down to search.
#include <cmath>
#include <functional>
#include <iostream>
#include <memory>
#include <string>
#include <vector>
#include "../../lib/zvect.hpp"
using namespace zv;

const size_t LEAF = 5;
std::function<double()> minstd(long long seed) {   // tiny repeatable random, same in JS / Python / C++
  auto s = std::make_shared<long long>(seed);
  auto r = [s]() { *s = (*s * 48271) % 2147483647; return double(*s) / 2147483647; };
  for (int i = 0; i < 10; ++i) r();
  return r;
}
std::vector<Vec> makePoints(int n, long long seed) {   // n points in [0, 100), two decimals
  auto r = minstd(seed);
  std::vector<Vec> P;
  for (int i = 0; i < n; ++i) { double x = std::floor(r() * 10000) / 100, y = std::floor(r() * 10000) / 100; P.push_back({x, y}); }
  return P;
}
// normal n = v1 - v2, constant c = n . (v1 + v2) / 2 ; right if n . v > c, else left
struct Plane { Vec n; double c; };
Plane plane(const Vec& v1, const Vec& v2) { Vec n = sub(v1, v2); return {n, dot(n, scale(add(v1, v2), 0.5))}; }
bool right(const Plane& h, const Vec& v) { return dot(h.n, v) > h.c; }

struct Node { bool split = false; Plane h; std::vector<int> value; std::unique_ptr<Node> left, rightN; };
std::unique_ptr<Node> build(const std::vector<Vec>& P, std::vector<int> vs, std::function<double()>& r) {
  auto node = std::make_unique<Node>();
  node->value = vs;
  if (vs.size() <= LEAF) return node;
  size_t i = 0, j = 0;
  while (i == j) { i = size_t(std::floor(r() * vs.size())); j = size_t(std::floor(r() * vs.size())); }
  Plane h = plane(P[vs[i]], P[vs[j]]);
  std::vector<int> L, R;
  for (int v : vs) (right(h, P[v]) ? R : L).push_back(v);
  if (L.empty() || R.empty()) return node;
  node->split = true; node->h = h;
  node->left = build(P, L, r); node->rightN = build(P, R, r);
  return node;
}

int main() {
  auto P = makePoints(1000, 42);
  auto r = minstd(1);
  std::vector<int> all;
  for (int i = 0; i < int(P.size()); ++i) all.push_back(i);
  auto tree = build(P, all, r);
  for (Vec q : {Vec{50, 50}, Vec{30, 30}}) {
    const Node* t = tree.get();
    std::vector<size_t> sizes;
    while (t->split) { sizes.push_back(t->value.size()); t = right(t->h, q) ? t->rightN.get() : t->left.get(); }
    int best = t->value[0], truth = 0;
    for (int v : t->value) if (distance(q, P[v]) < distance(q, P[best])) best = v;
    for (int v = 0; v < int(P.size()); ++v) if (distance(q, P[v]) < distance(q, P[truth])) truth = v;
    std::string s;
    for (size_t k = 0; k < sizes.size(); ++k) s += (k ? " > " : "") + std::to_string(sizes[k]);
    std::cout << "query " << fmt(q) << ": " << sizes.size() << " steps, group sizes " << s << " > " << t->value.size() << "\n";
    std::cout << "  tree answer " << fmt(P[best]) << " dist " << fmt(distance(q, P[best])) << " | true nearest " << fmt(P[truth]) << " dist " << fmt(distance(q, P[truth])) << "\n";
    std::cout << "  measured " << sizes.size() + t->value.size() << " instead of " << P.size() << (best == truth ? "  (found the true nearest)" : "  (missed)") << "\n";
  }
}
