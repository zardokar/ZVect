// 36 Late interaction (ColBERT idea): keep ONE VECTOR PER TOKEN instead of one per sentence.
// score(q, d) = sum over query tokens of the best dot with any document token (MaxSim, then sum).
// Compared with the bi-encoder of lesson 09 (average of word vectors, then cosine). Toy vectors, axes: food, animal, tech.
#include <algorithm>
#include <iostream>
#include <limits>
#include <map>
#include <string>
#include <vector>
#include "../../lib/zvect.hpp"
using namespace zv;

const std::map<std::string, Vec> table = {
  {"eat", {1, 0, 0}}, {"rice", {1, 0, 0}}, {"noodle", {1, 0, 0}}, {"fish", {0.5, 0.5, 0}},
  {"cat", {0, 1, 0}}, {"dog", {0, 1, 0}}, {"pet", {0, 1, 0}}, {"pets", {0, 1, 0}}, {"bark", {0.1, 0.9, 0}},
  {"code", {0, 0, 1}}, {"computer", {0, 0, 1}}, {"phone", {0, 0, 1}}, {"app", {0, 0, 1}}, {"robot", {0, 0.2, 0.8}}, {"bug", {0, 0.5, 0.5}},
};
std::vector<Vec> tokens(const std::string& text) {   // one unit vector per known word
  std::vector<Vec> out;
  for (const auto& w : words(text)) { auto it = table.find(w); if (it != table.end()) out.push_back(normalize(it->second)); }
  return out;
}
double late(const std::string& q, const std::string& d) {
  auto dt = tokens(d);
  double sum = 0;
  for (const auto& t : tokens(q)) { double best = -std::numeric_limits<double>::infinity(); for (const auto& u : dt) best = std::max(best, dot(t, u)); sum += best; }
  return sum;
}

int main() {
  std::vector<std::string> docs = {
    "cat and dog are pets", "eat rice and noodle", "write code on a computer", "the phone app has a bug",
    "my dog likes fish", "a robot pet that can bark", "my cat likes fish and rice and my phone app has a bug"};
  std::string query = "eat rice and fix a bug";
  std::cout << "query: " << query << "\n";
  double bs = -1e18, ls = -1e18; size_t bi = 0, li = 0;
  for (size_t i = 0; i < docs.size(); i++) {
    double c = dot(encode(query, table), encode(docs[i], table)), s = late(query, docs[i]);
    std::cout << "d" << i + 1 << "  cos " << fmt(c) << "  late " << fmt(s) << "  " << docs[i] << "\n";
    if (c > bs + 1e-9) { bs = c; bi = i; }
    if (s > ls + 1e-9) { ls = s; li = i; }
  }
  std::cout << "bi-encoder picks d" << bi + 1 << ", late interaction picks d" << li + 1 << "\n";
}
