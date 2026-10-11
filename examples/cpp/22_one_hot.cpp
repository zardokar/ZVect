// 22 One-hot: one 1 at the word's position, 0 everywhere else. Every pair of words is equally far apart.
#include <algorithm>
#include <iostream>
#include <string>
#include <vector>
#include "../../lib/zvect.hpp"
using namespace zv;

const std::vector<std::string> vocab = {"good", "bad", "great"};   // V = 3 words, so a one-hot vector has 3 numbers
Vec oneHot(const std::string& w) { Vec h; for (auto& x : vocab) h.push_back(x == w ? 1 : 0); return h; }

int main() {
  for (auto& w : vocab) std::cout << "one-hot(" << w << ") = " << fmt(oneHot(w)) << "\n";
  std::vector<std::pair<std::string, std::string>> pairs = {{"good", "bad"}, {"good", "great"}, {"bad", "great"}};
  for (auto& [a, b] : pairs)
    std::cout << a << " vs " << b << ": cos " << fmt(cosine(oneHot(a), oneHot(b))) << ", dist " << fmt(distance(oneHot(a), oneHot(b))) << "\n";
  std::cout << "same word: cos " << fmt(cosine(oneHot("good"), oneHot("good"))) << ", dist " << fmt(distance(oneHot("good"), oneHot("good"))) << "\n";

  // A real vocabulary: 50,000 words -> 50,000 numbers per word, only one of them is 1
  const int V = 50000;
  Vec big(V, 0.0);
  big[123] = 1;                                         // some word at position 123
  std::cout << "V = " << V << ": ones = " << std::count(big.begin(), big.end(), 1.0) << ", zeros = " << std::count(big.begin(), big.end(), 0.0) << "\n";
}
