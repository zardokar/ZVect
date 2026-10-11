// 14 Reranker: stage 1 = bi-encoder picks the top 3 fast (cosine on vectors made separately),
// stage 2 = a reranker reads query and document TOGETHER and re-orders those 3.
// toy reranker: count query words found in the doc, but not right after "no" / "not"; cosine breaks ties.
#include <iostream>
#include <set>
#include "../../lib/zvect.hpp"
using namespace zv;

int matches(const std::string& query, const std::string& doc) {
  auto qw = words(query), w = words(doc);
  std::set<std::string> q(qw.begin(), qw.end()), found;
  for (size_t i = 0; i < w.size(); ++i)
    if (q.count(w[i]) && !(i > 0 && (w[i - 1] == "no" || w[i - 1] == "not"))) found.insert(w[i]);
  return (int)found.size();
}

int main() {
  std::map<std::string, Vec> table = {
    {"eat", {1, 0, 0}}, {"rice", {1, 0, 0}}, {"noodle", {1, 0, 0}}, {"hungry", {0.9, 0.1, 0}}, {"feed", {0.8, 0.2, 0}},
    {"cat", {0, 1, 0}}, {"dog", {0, 1, 0}}, {"pets", {0, 1, 0}}, {"code", {0, 0, 1}}, {"computer", {0, 0, 1}},
  };
  std::vector<std::string> docs = {"the dog is not hungry", "feed my hungry dog rice", "cat and dog are pets", "eat rice and noodle", "write code on a computer"};
  std::string query = "hungry dog";
  std::vector<Item> items;
  for (auto& d : docs) items.push_back({d, encode(d, table)});
  auto stage1 = topK(encode(query, table), items, 3);
  std::cout << "stage 1 (bi-encoder, cosine):\n";
  for (auto& [doc, s] : stage1) std::cout << "  " << fmt(s) << "  " << doc << "\n";
  std::vector<std::tuple<std::string, int, double>> stage2;
  for (auto& [doc, s] : stage1) stage2.push_back({doc, matches(query, doc), matches(query, doc) + s});
  std::stable_sort(stage2.begin(), stage2.end(), [](auto& x, auto& y) { return std::get<2>(x) > std::get<2>(y); });
  std::cout << "stage 2 (rerank = matched words + cosine):\n";
  for (auto& [doc, m, s] : stage2) std::cout << "  " << fmt(s) << "  " << doc << "  (matched " << m << ")\n";
}
