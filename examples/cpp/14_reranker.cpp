// 14 Reranker: stage 1 = bi-encoder picks the top 3 fast (cosine on vectors made separately),
// stage 2 = a reranker reads query and document TOGETHER and re-orders those 3.
// toy reranker: count query words found in the doc, but not right after "no" / "not"; cosine breaks ties.
// Part 2 runs the same search in Thai: split by dictionary first (Thai has no spaces), turn each known Thai
// word into the English word with the same meaning, then reuse the same two stages. "ไม่" = "not".
// Windows console: run "chcp 65001" first so the Thai text shows.
#include <iostream>
#include <algorithm>
#include <set>
#include "../../lib/zvect.hpp"
using namespace zv;

std::map<std::string, Vec> table = {
  {"eat", {1, 0, 0}}, {"rice", {1, 0, 0}}, {"noodle", {1, 0, 0}}, {"hungry", {0.9, 0.1, 0}}, {"feed", {0.8, 0.2, 0}},
  {"cat", {0, 1, 0}}, {"dog", {0, 1, 0}}, {"pets", {0, 1, 0}}, {"code", {0, 0, 1}}, {"computer", {0, 0, 1}},
};
std::map<std::string, std::string> thai = {
  {"หมา", "dog"}, {"หิว", "hungry"}, {"ไม่", "not"}, {"ข้าว", "rice"}, {"แมว", "cat"}, {"สัตว์เลี้ยง", "pets"},
  {"กิน", "eat"}, {"ก๋วยเตี๋ยว", "noodle"}, {"โค้ด", "code"}, {"คอมพิวเตอร์", "computer"},
};

int matches(const std::string& query, const std::string& doc) {
  auto qw = words(query), w = words(doc);
  std::set<std::string> q(qw.begin(), qw.end()), found;
  for (size_t i = 0; i < w.size(); ++i)
    if (q.count(w[i]) && !(i > 0 && (w[i - 1] == "no" || w[i - 1] == "not"))) found.insert(w[i]);
  return (int)found.size();
}
// UTF-8 text -> one string per character (Thai letters are 3 bytes each)
std::vector<std::string> chars(const std::string& s) {
  std::vector<std::string> out;
  for (size_t i = 0; i < s.size();) {
    unsigned char c = s[i];
    size_t n = c < 0x80 ? 1 : c < 0xE0 ? 2 : c < 0xF0 ? 3 : 4;
    out.push_back(s.substr(i, n));
    i += n;
  }
  return out;
}
// longest match: at each place take the longest dictionary word; unknown letters are skipped here
std::string toEnglish(const std::string& text) {
  auto ch = chars(text);
  size_t longest = 0;
  for (auto& [w, e] : thai) longest = std::max(longest, chars(w).size());
  std::string out;
  for (size_t i = 0; i < ch.size();) {
    auto piece = [&](size_t n) { std::string s; for (size_t k = 0; k < n; ++k) s += ch[i + k]; return s; };
    size_t n = std::min(longest, ch.size() - i);
    while (n > 0 && !thai.count(piece(n))) --n;
    if (n == 0) { ++i; continue; }
    out += (out.empty() ? "" : " ") + thai[piece(n)];
    i += n;
  }
  return out;
}
// query and docs in English words; show[i] = how document i is printed
void search(const std::string& query, const std::vector<std::string>& docs, const std::vector<std::string>& show) {
  std::vector<Item> items;
  for (size_t i = 0; i < docs.size(); ++i) items.push_back({std::to_string(i), encode(docs[i], table)});
  auto stage1 = topK(encode(query, table), items, 3);
  std::cout << "stage 1 (bi-encoder, cosine):\n";
  for (auto& [id, s] : stage1) std::cout << "  " << fmt(s) << "  " << show[std::stoi(id)] << "\n";
  std::vector<std::tuple<int, int, double>> stage2;
  for (auto& [id, s] : stage1) { int i = std::stoi(id); stage2.push_back({i, matches(query, docs[i]), matches(query, docs[i]) + s}); }
  std::stable_sort(stage2.begin(), stage2.end(), [](auto& x, auto& y) { return std::get<2>(x) > std::get<2>(y); });
  std::cout << "stage 2 (rerank = matched words + cosine):\n";
  for (auto& [i, m, s] : stage2) std::cout << "  " << fmt(s) << "  " << show[i] << "  (matched " << m << ")\n";
}

int main() {
  std::vector<std::string> docs = {"the dog is not hungry", "feed my hungry dog rice", "cat and dog are pets", "eat rice and noodle", "write code on a computer"};
  std::vector<std::string> thaiDocs = {"หมาไม่หิว", "ให้ข้าวหมาที่หิว", "แมวกับหมาเป็นสัตว์เลี้ยง", "กินข้าวและก๋วยเตี๋ยว", "เขียนโค้ดบนคอมพิวเตอร์"};
  search("hungry dog", docs, docs);
  std::cout << "thai: หมาหิว -> " << toEnglish("หมาหิว") << ", หมาไม่หิว -> " << toEnglish("หมาไม่หิว") << "\n";
  std::vector<std::string> en;
  for (auto& d : thaiDocs) en.push_back(toEnglish(d));
  search(toEnglish("หมาหิว"), en, thaiDocs);
}
