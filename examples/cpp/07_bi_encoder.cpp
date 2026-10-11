// 07 Bi-encoder: query and documents are encoded SEPARATELY into vectors,
// then compared with cosine. Docs are encoded once, ahead of time.
// toy encoder = average of word vectors. axes: x = food, y = animal, z = tech
#include <iostream>
#include "../../lib/zvect.hpp"
using namespace zv;

int main() {
  std::map<std::string, Vec> table = {
    {"eat", {1, 0, 0}}, {"rice", {1, 0, 0}}, {"noodle", {1, 0, 0}}, {"hungry", {0.9, 0.1, 0}},
    {"cat", {0, 1, 0}}, {"dog", {0, 1, 0}}, {"pet", {0, 1, 0}}, {"bark", {0.1, 0.9, 0}},
    {"code", {0, 0, 1}}, {"computer", {0, 0, 1}}, {"phone", {0, 0, 1}}, {"app", {0, 0, 1}},
    {"bug", {0, 0.5, 0.5}},
  };
  std::vector<std::string> docs = {
    "cat and dog are pets",
    "eat rice and noodle",
    "write code on a computer",
    "the phone app has a bug",
  };

  std::vector<Item> docVecs;
  for (auto& d : docs) docVecs.push_back({d, encode(d, table)});  // offline
  Vec q = encode("my pet is hungry", table);                      // online
  std::cout << "query = " << fmt(q) << "\n";
  for (auto& [doc, s] : topK(q, docVecs, 2)) std::cout << fmt(s) << "  " << doc << "\n";
}
