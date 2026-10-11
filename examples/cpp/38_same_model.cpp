// 38 Same model for the question and the documents (toy): two tables trained with the same rule from different random
// starts. Inside each model cat is near dog, but cat in model A and cat in model B are unrelated vectors.
// Training rule = 24_learn_table (c = (e_left + e_right) / 2 ; e_w <- e_w + eta * (c - e_w)); context rows start random too.
#include <array>
#include <iostream>
#include <map>
#include <string>
#include <vector>
#include "../../lib/zvect.hpp"
using namespace zv;

std::vector<std::array<std::string, 3>> windows = {{"pet", "cat", "sleeps"}, {"pet", "dog", "sleeps"}, {"drive", "car", "fast"}, {"drive", "bus", "fast"}};
std::vector<std::string> ctxWords = {"pet", "sleeps", "drive", "fast"};
std::vector<std::string> vocab = {"cat", "dog", "car", "bus"};
const double eta = 0.3;
const int passes = 5;

// a tiny repeatable random (minstd), so JS / Python / C++ make the same tables: x = x * 48271 mod (2^31 - 1)
std::map<std::string, Vec> train(long long seed) {
  auto next = [&]() {
    seed = (seed * 48271) % 2147483647;
    return seed;
  };
  for (int i = 0; i < 10; ++i) {
    next();                                       // the first numbers after a small seed are tiny; skip them
  }
  auto row = [&]() {
    Vec v;
    for (int i = 0; i < 3; ++i) {
      v.push_back(double(next() % 17 - 8) / 2);   // -4 .. 4 in steps of 0.5
    }
    return v;
  };
  std::map<std::string, Vec> ctx;
  std::map<std::string, Vec> E;
  for (auto& w : ctxWords) {
    ctx[w] = row();
  }
  for (auto& w : vocab) {
    E[w] = row();
  }
  for (int p = 0; p < passes; ++p) {
    for (auto& [l, w, r] : windows) {
      Vec c = mean({ctx[l], ctx[r]});
      E[w] = add(E[w], scale(sub(c, E[w]), eta));
    }
  }
  return E;
}

int main() {
  std::map<std::string, std::map<std::string, Vec>> model = {{"A", train(16)}, {"B", train(18)}};   // only the random start differs
  for (std::string m : {"A", "B"}) {
    auto& E = model[m];
    std::cout << "inside " << m << ": cos(cat,dog) " << fmt(cosine(E["cat"], E["dog"])) << "  cos(car,bus) " << fmt(cosine(E["car"], E["bus"]))
              << "  cos(cat,car) " << fmt(cosine(E["cat"], E["car"])) << "\n";
  }
  std::cout << "cat in A = " << fmt(model["A"]["cat"]) << "   cat in B = " << fmt(model["B"]["cat"]) << "\n";
  std::cout << "same word, two models: cos(cat_A, cat_B) = " << fmt(cosine(model["A"]["cat"], model["B"]["cat"])) << "\n";

  // search: documents are stored by one model, the question is turned into a vector by one model
  std::cout << "question \"cat\"\n";
  for (auto [q, d] : std::vector<std::pair<std::string, std::string>>{{"A", "A"}, {"B", "A"}, {"B", "B"}, {"A", "B"}}) {
    std::vector<Item> docs;
    for (auto& w : vocab) {
      docs.push_back({w, model[d][w]});
    }
    auto ranked = topK(model[q]["cat"], docs, 4);
    std::cout << "  question by " << q << ", documents by " << d << ": ";
    for (size_t i = 0; i < ranked.size(); ++i) {
      std::cout << (i ? ", " : "") << ranked[i].first << " " << fmt(ranked[i].second);
    }
    std::cout << "  -> top-1 " << ranked[0].first << (q == d ? "  (same model)" : "  (mixed: meaningless)") << "\n";
  }
}
