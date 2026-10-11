// 05 Latent space: each word is a point; similar meaning = nearby.
// Real models learn hundreds of unnamed axes; here we name 3 by hand:
// x = royal, y = gender (+male / -female), z = adult
#include <iostream>
#include "../../lib/zvect.hpp"
using namespace zv;

int main() {
  std::vector<Item> W = {
    {"king", {0.9, 0.9, 0.9}},   {"queen", {0.9, -0.9, 0.9}},
    {"man", {0.1, 0.9, 0.9}},    {"woman", {0.1, -0.9, 0.9}},
    {"prince", {0.8, 0.9, 0.2}}, {"princess", {0.8, -0.9, 0.2}},
    {"boy", {0.1, 0.9, 0.1}},    {"girl", {0.1, -0.9, 0.1}},
  };
  auto get = [&](const std::string& w) { for (auto& [id, v] : W) if (id == w) return v; return Vec{}; };

  // king - man + woman = ?
  Vec x = add(sub(get("king"), get("man")), get("woman"));
  std::cout << "king - man + woman = " << fmt(x) << "\n";

  std::vector<Item> items;
  for (auto& it : W) if (it.first != "king" && it.first != "man" && it.first != "woman") items.push_back(it);
  // topK = sort by cosine, keep the best k (more in the Similarity search lesson)
  for (auto& [word, s] : topK(x, items, 2)) std::cout << word << " " << fmt(s) << "\n";
}
