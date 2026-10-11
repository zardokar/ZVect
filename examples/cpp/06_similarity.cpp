// 06 Search by cosine: score every item with cosine, keep the top 3 (higher = closer)
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

  std::cout << "top 3 by cosine (higher = closer):\n";
  for (auto& [name, s] : topK(query, items, 3)) std::cout << "  " << name << " " << fmt(s) << "\n";
}
