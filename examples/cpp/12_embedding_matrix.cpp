// 12 Embedding matrix: one row per word. one-hot x matrix = pick that word's row (a lookup).
// axes of a row: animal, pet, vehicle
#include <algorithm>
#include <iostream>
#include <string>
#include <vector>
#include "../../lib/zvect.hpp"
using namespace zv;

const std::vector<std::string> vocab = {"cat", "dog", "lion", "car", "bus"};
const std::vector<Vec> E = {   // 5 words x 3 numbers
  {0.9, 0.9, 0.0},             // cat
  {0.9, 1.0, 0.0},             // dog
  {1.0, 0.2, 0.0},             // lion
  {0.0, 0.1, 0.9},             // car
  {0.1, 0.0, 1.0},             // bus
};
size_t id(const std::string& w) { return std::find(vocab.begin(), vocab.end(), w) - vocab.begin(); }
Vec oneHot(const std::string& w) { Vec h; for (auto& x : vocab) h.push_back(x == w ? 1 : 0); return h; }
// h x E = sum of (h_i * row i); only the row with h_i = 1 survives
Vec times(const Vec& h) { Vec acc = {0, 0, 0}; for (size_t i = 0; i < h.size(); ++i) acc = add(acc, scale(E[i], h[i])); return acc; }

int main() {
  std::cout << "one-hot(dog) = " << fmt(oneHot("dog")) << "\n";
  std::cout << "one-hot(dog) x E = " << fmt(times(oneHot("dog"))) << "\n";
  std::cout << "row of dog (lookup by ID 1) = " << fmt(E[id("dog")]) << "\n";
  for (auto& w : vocab) {
    bool same = fmt(times(oneHot(w))) == fmt(E[id(w)]);
    std::cout << w << ": one-hot x E " << (same ? "==" : "!=") << " row " << id(w) << "\n";
  }
}
