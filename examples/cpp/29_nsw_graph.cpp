// 29 ANN with a one-layer neighbour graph: link each point to its M nearest, then walk greedily from a start point:
// step to the neighbour closest to q while it is closer; stop when no neighbour is closer.
#include <algorithm>
#include <iostream>
#include <map>
#include <set>
#include <string>
#include <vector>
#include "../../lib/zvect.hpp"
using namespace zv;

std::vector<Vec> P = {
  {0.9, 0.1, 0.0}, {0.8, 0.2, 0.1}, {1.0, 0.0, 0.1}, {0.7, 0.1, 0.2}, {0.9, 0.3, 0.0}, {0.6, 0.2, 0.1}, {0.8, 0.0, 0.3}, {0.55, 0.45, 0.0},
  {0.1, 0.9, 0.0}, {0.2, 0.8, 0.1}, {0.0, 1.0, 0.1}, {0.1, 0.7, 0.2}, {0.3, 0.9, 0.0}, {0.2, 0.6, 0.1}, {0.0, 0.8, 0.3}, {0.4, 0.6, 0.05},
  {0.0, 0.1, 0.9}, {0.1, 0.2, 0.8}, {0.1, 0.0, 1.0}, {0.2, 0.1, 0.7}, {0.0, 0.3, 0.9}, {0.1, 0.2, 0.6}, {0.3, 0.0, 0.8}, {0.05, 0.4, 0.6},
};
std::string name(int i) { return std::string(1, "fat"[i / 8]) + std::to_string(i % 8 + 1); }  // f food, a animal, t tech

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

int main() {
  auto nb = graph(2);
  Vec q = {0.2, 0.75, 0.1};
  int b = 0;
  for (int i = 0; i < (int)P.size(); ++i) if (distance(q, P[i]) < distance(q, P[b])) b = i;
  std::cout << "query = " << fmt(q) << ", true nearest = " << name(b) << "\n";
  for (int start : {8, 0, 16}) {               // a1, f1, t1
    std::map<int, double> seen;                // every point we measured
    auto d = [&](int i) { if (!seen.count(i)) seen[i] = distance(q, P[i]); return seen[i]; };
    int cur = start;
    d(cur);
    std::vector<int> path = {cur};
    for (;;) {                                 // greedy walk
      int best = cur;
      for (int j : nb[cur]) if (d(j) < d(best)) best = j;
      if (best == cur) break;
      cur = best; path.push_back(cur);
    }
    std::string s;
    for (size_t k = 0; k < path.size(); ++k) s += (k ? " -> " : "") + name(path[k]);
    std::cout << "start " << name(start) << ": path " << s << ", measured " << seen.size() << " of " << P.size()
              << (cur == b ? "  (found it)" : "  (stopped at the wrong point)") << "\n";
  }
}
