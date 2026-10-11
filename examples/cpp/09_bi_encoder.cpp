// 09 Bi-encoder: query and documents are encoded SEPARATELY into vectors,
// then compared with cosine. Docs are encoded once, ahead of time.
// toy encoder = average of word vectors. axes: x = food, y = animal, z = tech
// Part 2 asks the same question in Thai. Thai puts no spaces between words, so words() sees the whole
// sentence as ONE unknown word. A dictionary split (longest known word first) finds the words again.
// Windows console: run "chcp 65001" first so the Thai text shows.
#include <iostream>
#include <algorithm>
#include "../../lib/zvect.hpp"
using namespace zv;

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
// longest match: at each place take the longest dictionary word; unknown letters are kept together
std::vector<std::string> splitDict(const std::string& text, const std::map<std::string, std::string>& d) {
  auto ch = chars(text);
  std::vector<std::string> out;
  std::string unk;
  size_t longest = 0;
  for (auto& [w, e] : d) longest = std::max(longest, chars(w).size());
  for (size_t i = 0; i < ch.size();) {
    auto piece = [&](size_t n) { std::string s; for (size_t k = 0; k < n; ++k) s += ch[i + k]; return s; };
    size_t n = std::min(longest, ch.size() - i);
    while (n > 0 && !d.count(piece(n))) --n;
    if (n == 0) { unk += ch[i]; ++i; continue; }
    if (!unk.empty()) { out.push_back(unk); unk.clear(); }
    out.push_back(piece(n));
    i += n;
  }
  if (!unk.empty()) out.push_back(unk);
  return out;
}
std::string join(const std::vector<std::string>& xs) {
  std::string s;
  for (size_t i = 0; i < xs.size(); ++i) s += (i ? " | " : "") + xs[i];
  return s;
}

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
  // Thai word -> the English word with the same meaning (so it gets the same vector)
  std::map<std::string, std::string> thai = {
    {"สัตว์เลี้ยง", "pet"}, {"หิว", "hungry"}, {"หมา", "dog"}, {"แมว", "cat"}, {"กิน", "eat"}, {"ข้าว", "rice"},
  };

  std::vector<Item> docVecs;
  for (auto& d : docs) docVecs.push_back({d, encode(d, table)});  // offline
  Vec q = encode("my pet is hungry", table);                      // online
  std::cout << "query = " << fmt(q) << "\n";
  for (auto& [doc, s] : topK(q, docVecs, 2)) std::cout << fmt(s) << "  " << doc << "\n";

  std::string th = "สัตว์เลี้ยงของฉันหิว";                          // "my pet is hungry"
  std::cout << "thai, split at spaces: " << join(words(th)) << "  -> " << fmt(encode(th, table)) << "\n";
  auto parts = splitDict(th, thai);
  std::string en;
  for (auto& w : parts) if (thai.count(w)) en += thai[w] + " ";
  Vec qth = encode(en, table);
  std::cout << "thai, split by dictionary: " << join(parts) << "  -> " << fmt(qth) << "\n";
  for (auto& [doc, s] : topK(qth, docVecs, 2)) std::cout << fmt(s) << "  " << doc << "\n";
}
