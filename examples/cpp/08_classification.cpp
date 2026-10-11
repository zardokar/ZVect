// 08 Classification: average each class into a centroid,
// then a new point gets the label of the most similar centroid
#include <iostream>
#include "../../lib/zvect.hpp"
using namespace zv;

int main() {
  std::vector<std::pair<std::string, std::vector<Vec>>> train = {
    {"food", {{0.9, 0.1, 0.0}, {0.8, 0.0, 0.1}, {1.0, 0.2, 0.0}}},
    {"animal", {{0.1, 0.9, 0.0}, {0.0, 1.0, 0.1}, {0.2, 0.8, 0.1}}},
    {"tech", {{0.0, 0.1, 0.9}, {0.1, 0.0, 1.0}, {0.0, 0.2, 0.8}}},
  };

  std::vector<Item> centroids;
  for (auto& [label, pts] : train) centroids.push_back({label, mean(pts)});
  for (auto& [label, c] : centroids) std::cout << label << " centroid " << fmt(c) << "\n";

  for (Vec x : std::vector<Vec>{{0.7, 0.2, 0.1}, {0.1, 0.3, 0.9}, {0.4, 0.5, 0.0}}) {
    auto [label, score] = classify(x, centroids);
    std::cout << fmt(x) << " -> " << label << " " << fmt(score) << "\n";
  }
}
