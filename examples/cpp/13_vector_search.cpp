// 13 Vector search: a small 2-layer graph walk (the idea behind HNSW) instead of measuring every point.
// top layer = 3 hubs (one per group), bottom layer = each point linked to its M nearest points.
#include <iostream>
#include <set>
#include "../../lib/zvect.hpp"
using namespace zv;

std::vector<Vec> P = {
  {0.9, 0.1, 0.0}, {0.8, 0.2, 0.1}, {1.0, 0.0, 0.1}, {0.7, 0.1, 0.2}, {0.9, 0.3, 0.0}, {0.6, 0.2, 0.1}, {0.8, 0.0, 0.3}, {0.55, 0.45, 0.0},
  {0.1, 0.9, 0.0}, {0.2, 0.8, 0.1}, {0.0, 1.0, 0.1}, {0.1, 0.7, 0.2}, {0.3, 0.9, 0.0}, {0.2, 0.6, 0.1}, {0.0, 0.8, 0.3}, {0.4, 0.6, 0.05},
  {0.0, 0.1, 0.9}, {0.1, 0.2, 0.8}, {0.1, 0.0, 1.0}, {0.2, 0.1, 0.7}, {0.0, 0.3, 0.9}, {0.1, 0.2, 0.6}, {0.3, 0.0, 0.8}, {0.05, 0.4, 0.6},
};
std::string name(int i) { return std::string(1, "fat"[i / 8]) + std::to_string(i % 8 + 1); }  // f food, a animal, t tech
std::vector<int> HUBS = {0, 8, 16};

std::vector<std::vector<int>> graph(int M) {   // link each point to its M nearest, both ways
  std::vector<std::set<int>> nb(P.size());
  for (int i = 0; i < (int)P.size(); ++i) {
    std::vector<std::pair<double, int>> near;
    for (int j = 0; j < (int)P.size(); ++j) if (j != i) near.push_back({distance(P[i], P[j]), j});
    std::sort(near.begin(), near.end());
    for (int k = 0; k < M; ++k) { nb[i].insert(near[k].second); nb[near[k].second].insert(i); }
  }
  std::vector<std::vector<int>> out;
  for (auto& s : nb) out.push_back(std::vector<int>(s.begin(), s.end()));
  return out;
}

struct Walk { int cur; size_t count; std::vector<int> path; };
Walk walk(const Vec& q, const std::vector<std::vector<int>>& nb) {   // greedy walk
  std::map<int, double> seen;
  auto d = [&](int i) { if (!seen.count(i)) seen[i] = distance(q, P[i]); return seen[i]; };
  int cur = HUBS[0];
  for (int h : HUBS) if (d(h) < d(cur)) cur = h;   // top layer
  std::vector<int> path = {cur};
  for (;;) {                                       // bottom layer
    int best = cur;
    for (int j : nb[cur]) if (d(j) < d(best)) best = j;
    if (best == cur) break;
    cur = best; path.push_back(cur);
  }
  return {cur, seen.size(), path};
}

int main() {
  Vec q = {0.5, 0.7, 0.1};
  int b = 0;
  for (int i = 0; i < (int)P.size(); ++i) if (distance(q, P[i]) < distance(q, P[b])) b = i;
  std::cout << "query = " << fmt(q) << "\n";
  std::cout << "measure all 24 points -> " << name(b) << " " << fmt(distance(q, P[b])) << "\n";
  for (int M : {1, 2, 3}) {
    Walk r = walk(q, graph(M));
    std::string p;
    for (size_t k = 0; k < r.path.size(); ++k) p += (k ? " > " : "") + name(r.path[k]);
    std::cout << "graph M=" << M << ": measured " << r.count << " points, path " << p << " -> " << name(r.cur) << " "
              << fmt(distance(q, P[r.cur])) << (r.cur == b ? "  (same)" : "  (missed)") << "\n";
  }
}
