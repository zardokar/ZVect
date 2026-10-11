// 26 Attention starts with query . key: score_j = q . k_j ; the key with the highest score gets the most attention.
// Vectors from the SH AI Academy slide (~3:44). The slide printed 0.69 and 0.15; the real values are 0.70 and 0.23.
#include <iostream>
#include <string>
#include <vector>
#include "../../lib/zvect.hpp"
using namespace zv;

std::vector<std::pair<std::string, Vec>> keys = {{"key1", {0.2, 0.7, 0.4}}, {"key2", {0.9, 0.1, 0.2}}};

void attend(const Vec& q) {
  std::cout << "query = " << fmt(q) << "\n";
  std::string best; double bestScore = 0; bool first = true;
  for (auto& [name, k] : keys) {
    double byHand = q[0] * k[0] + q[1] * k[1] + q[2] * k[2];
    std::cout << "  q . " << name << " = " << fmt(byHand) << " (by hand) = " << fmt(dot(q, k)) << " (lib)\n";
    if (first || dot(q, k) > bestScore) { best = name; bestScore = dot(q, k); first = false; }
  }
  std::cout << "  most attention: " << best << "\n";
}

int main() {
  attend({0.1, 0.8, 0.3});    // the slide's query
  attend({0.9, 0.2, 0.1});    // a query toward dim 1: key2 wins
}
