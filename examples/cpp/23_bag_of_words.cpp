// 23 Bag of words: count each word -> a vector; compare two sentences with cosine (examples from StatQuest)
#include <algorithm>
#include <cmath>
#include <iostream>
#include <string>
#include <vector>
#include "../../lib/zvect.hpp"
using namespace zv;

int main() {
  std::vector<std::pair<std::string, std::string>> pairs = {
    {"Hello, World!", "Hello!"},
    {"Hello, World!", "Hello Hello Hello!"},
    {"Hello, World!", "Hello, World!"},
    {"Hello!", "World!"},
    {"I love Troll 2!", "I love Gymkata!"},
  };
  for (auto& [a, b] : pairs) {
    auto wa = words(a), wb = words(b);
    std::vector<std::string> vocab;                    // every different word, in the order first seen
    for (auto* ws : {&wa, &wb})
      for (auto& w : *ws) if (std::find(vocab.begin(), vocab.end(), w) == vocab.end()) vocab.push_back(w);
    auto count = [&](const std::vector<std::string>& ws) { Vec v; for (auto& x : vocab) v.push_back(double(std::count(ws.begin(), ws.end(), x))); return v; };
    Vec A = count(wa), B = count(wb);
    std::string list;
    for (size_t i = 0; i < vocab.size(); ++i) list += (i ? "," : "") + vocab[i];
    std::cout << a << " | " << b << "\n";
    std::cout << "  words " << list << "  A = " << fmt(A) << "  B = " << fmt(B) << "\n";
    std::cout << "  cos = " << fmt(cosine(A, B)) << "  angle = " << fmt(angle(A, B) * 180 / std::acos(-1.0)) << " deg\n";  // acos(-1) = pi
  }
}
