// 30 HNSW beam (efSearch): on the bottom layer keep the ef closest points found so far instead of one.
// Top layer: start at the closest of 3 hubs. Wider beam = more points measured, fewer misses.
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

std::vector<int> HUBS = {0, 8, 16};

struct Result { int best; std::vector<int> keep; size_t measured; };
Result search(const Vec& q, const std::vector<std::vector<int>>& nb, size_t ef) {
  std::map<int, double> seen;
  auto d = [&](int i) { if (!seen.count(i)) seen[i] = distance(q, P[i]); return seen[i]; };
  auto byD = [&](int a, int b) { double da = d(a), db = d(b); return da < db || (da == db && a < b); };
  int start = HUBS[0];
  for (int h : HUBS) if (d(h) < d(start)) start = h;          // top layer
  std::set<int> visited = {start};
  std::vector<int> cand = {start}, keep = {start};            // bottom layer: beam of width ef
  while (!cand.empty()) {
    std::sort(cand.begin(), cand.end(), byD);
    int c = cand.front(); cand.erase(cand.begin());           // closest point not expanded yet
    if (d(c) > d(keep.back())) break;                         // farther than the worst kept: stop
    for (int e : nb[c]) {
      if (visited.count(e)) continue;
      visited.insert(e);
      if (keep.size() < ef || d(e) < d(keep.back())) {
        cand.push_back(e); keep.push_back(e); std::sort(keep.begin(), keep.end(), byD);
        if (keep.size() > ef) keep.pop_back();
      }
    }
  }
  return {keep[0], keep, seen.size()};
}

int main() {
  auto nb = graph(2);
  Vec q = {0.5, 0.7, 0.1};
  int b = 0;
  for (int i = 0; i < (int)P.size(); ++i) if (distance(q, P[i]) < distance(q, P[b])) b = i;
  std::cout << "query = " << fmt(q) << ", true nearest = " << name(b) << "\n";
  for (size_t ef : {1, 2, 4, 8}) {
    auto r = search(q, nb, ef);
    std::string s;
    for (size_t k = 0; k < r.keep.size(); ++k) s += (k ? " " : "") + name(r.keep[k]);
    std::cout << "ef = " << ef << ": answer " << name(r.best) << ", kept " << s << ", measured " << r.measured << " of " << P.size()
              << (r.best == b ? "  (found it)" : "  (missed)") << "\n";
  }
}
