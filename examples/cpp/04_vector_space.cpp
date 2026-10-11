// 04 Vector space: a 3D room; data = points in it (no calculation needed)
#include <iostream>
#include <vector>
#include "../../lib/zvect.hpp"
using namespace zv;

int main() {
  Vec p1 = {2, 3, 1};                    // one example point
  std::vector<Vec> points = {p1};

  // "Random point" button, 3 presses. A tiny repeatable random, so JS / Python / C++ print the same.
  unsigned long long seed = 7;
  auto rand = [&]() { seed = (seed * 16807ULL) % 2147483647ULL; return (double)(long long)(seed % 9) - 4; };  // whole number -4..4
  for (int i = 0; i < 3; ++i) { double x = rand(), y = rand(), z = rand(); points.push_back({x, y, z}); }

  for (size_t i = 0; i < points.size(); ++i)
    std::cout << "p" << (i + 1) << " = " << fmt(points[i]) << "   (" << points[i].size() << " numbers)\n";
  std::cout << "points in the room: " << points.size() << "\n";

  points.resize(1);                      // clear the random points: p1 and the room are still there
  std::cout << "after clearing: " << points.size() << " point, p1 = " << fmt(points[0]) << "\n";
}
