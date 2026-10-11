// 19 Search by dot: score every item with the dot product, keep the top 3 (higher = closer)
// axes: x = food, y = animal, z = vehicle
#include <iostream>
#include "../../lib/zvect.hpp"
using namespace zv;

int main() {
  std::vector<Item> items = {
    {"apple", {0.9, 0.1, 0.0}},
    {"banana", {0.95, 0.05, 0.0}},
    {"cat", {0.05, 0.9, 0.1}},
    {"horse", {0.1, 0.8, 0.5}},
    {"car", {0.0, 0.05, 0.95}},
  };
  Vec query = {0.7, 0.3, 0.0};

  std::cout << "top 3 by dot product (higher = closer):\n";
  Metric byDot = [](const Vec& a, const Vec& b) { return dot(a, b); };
  for (auto& [name, s] : topK(query, items, 3, byDot)) std::cout << "  " << name << " " << fmt(s) << "\n";
}
