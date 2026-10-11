// 32 Filtering during the search: keep only the points that pass a filter, walk only on them.
// With k links per point the graph falls apart when fewer than about 1/k of the points pass (Qdrant talk).
#include <cmath>
#include <cstdio>
#include <iostream>
#include <set>
#include <string>
#include <vector>

long long seed;
double rnd() { seed = (seed * 48271) % 2147483647; return double(seed) / 2147483647; }   // tiny repeatable random
void start(long long s) { seed = s; for (int i = 0; i < 10; ++i) rnd(); }

const int N = 2000;
std::vector<double> keepU;                        // point i passes the filter if keepU[i] < kept fraction

std::vector<std::set<int>> makeGraph(int k) {     // random links: each point adds k/2 links (both ways) -> about k per point
  start(5);
  std::vector<std::set<int>> nb(N);
  for (int i = 0; i < N; ++i) for (int t = 0; t < k / 2; ++t) {
    int j = int(std::floor(rnd() * N));
    if (j == i) j = (j + 1) % N;
    nb[i].insert(j); nb[j].insert(i);
  }
  return nb;
}
int largestShare(const std::vector<std::set<int>>& nb, double f) {   // share of the kept points in the largest group
  std::vector<bool> kept(N), seen(N);
  int keptCount = 0, big = 0;
  for (int i = 0; i < N; ++i) if (keepU[i] < f) { kept[i] = true; keptCount++; }
  for (int s = 0; s < N; ++s) {
    if (!kept[s] || seen[s]) continue;
    int size = 0; std::vector<int> stack = {s}; seen[s] = true;
    while (!stack.empty()) { int x = stack.back(); stack.pop_back(); size++; for (int y : nb[x]) if (kept[y] && !seen[y]) { seen[y] = true; stack.push_back(y); } }
    if (size > big) big = size;
  }
  return int(std::floor(100.0 * big / keptCount + 0.5));
}

int main() {
  start(9);
  for (int i = 0; i < N; ++i) keepU.push_back(rnd());
  for (int k : {4, 8, 16}) {
    auto nb = makeGraph(k);
    char head[64]; std::snprintf(head, sizeof head, "%.2f", 100.0 / k);
    std::cout << "k = " << k << " (1/k = " << head << "%): ";
    const char* names[] = {"50", "25", "12.5", "6.25"};
    double fs[] = {0.5, 0.25, 0.125, 0.0625};
    for (int t = 0; t < 4; ++t) std::cout << (t ? ", " : "") << names[t] << "% kept -> " << largestShare(nb, fs[t]) << "%";
    std::cout << "\n";
  }
}
