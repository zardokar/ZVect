// 35 BPE (Byte Pair Encoding): start from characters, merge the most frequent adjacent pair k times,
// then apply the merges in the same order to new text. Corpus and new sentence from the BPE clip.
// Every pair is counted; a tie goes to the pair seen first. Spaces and punctuation are characters. ASCII text only.
#include <algorithm>
#include <cctype>
#include <iostream>
#include <set>
#include <string>
#include <tuple>
#include <utility>
#include <vector>

using Toks = std::vector<std::string>;
std::string q(const std::string& t) { return "\"" + t + "\""; }

Toks merge(const Toks& toks, const std::string& a, const std::string& b) {
  Toks out;
  for (size_t i = 0; i < toks.size(); i++) {
    if (i + 1 < toks.size() && toks[i] == a && toks[i + 1] == b) { out.push_back(a + b); i++; } else out.push_back(toks[i]);
  }
  return out;
}
// most frequent adjacent pair; first seen wins a tie
std::tuple<std::string, std::string, int> topPair(const Toks& toks) {
  std::vector<std::pair<std::pair<std::string, std::string>, int>> seen;   // in the order pairs were first seen
  for (size_t i = 0; i + 1 < toks.size(); i++) {
    auto k = std::make_pair(toks[i], toks[i + 1]);
    auto it = std::find_if(seen.begin(), seen.end(), [&](auto& e) { return e.first == k; });
    if (it == seen.end()) seen.push_back({k, 1}); else it->second++;
  }
  if (seen.empty()) return {"", "", 0};          // nothing left to merge
  size_t best = 0;
  for (size_t i = 1; i < seen.size(); i++) if (seen[i].second > seen[best].second) best = i;
  return {seen[best].first.first, seen[best].first.second, seen[best].second};
}

int main() {
  const std::string CORPUS = "fred fed ted bread, and ted fed fred bread", NEW = "ted and fred are friends";
  const int K = 4;
  Toks toks;
  for (char c : CORPUS) toks.push_back(std::string(1, c));
  std::set<std::string> uniq(toks.begin(), toks.end());
  Toks vocab(uniq.begin(), uniq.end());
  auto letter = [](const std::string& s) { return std::isalnum((unsigned char)s[0]) != 0; };
  std::stable_sort(vocab.begin(), vocab.end(), [&](auto& x, auto& y) { return letter(x) && !letter(y); });   // letters first
  std::cout << "corpus: " << toks.size() << " characters, vocabulary: " << vocab.size() << "\n";
  std::vector<std::pair<std::string, std::string>> rules;
  for (int r = 1; r <= K; r++) {
    auto [a, b, n] = topPair(toks);
    if (n == 0) break;
    rules.push_back({a, b}); vocab.push_back(a + b);
    toks = merge(toks, a, b);
    std::cout << "round " << r << ": " << q(a) << " + " << q(b) << " -> " << q(a + b) << " seen " << n
              << " times, corpus now " << toks.size() << " tokens\n";
  }
  std::cout << "vocabulary:";
  for (size_t i = 0; i < vocab.size(); i++) std::cout << " " << q(vocab[i]) << ":" << i + 1;
  std::cout << "\n";

  Toks t;
  for (char c : NEW) t.push_back(std::string(1, c));
  for (auto& [a, b] : rules) t = merge(t, a, b);
  std::cout << NEW << " ->";
  for (auto& x : t) std::cout << " " << q(x);
  std::cout << "\nids:";
  for (auto& x : t) {
    auto it = std::find(vocab.begin(), vocab.end(), x);
    std::cout << " " << (it == vocab.end() ? std::string("?") : std::to_string(it - vocab.begin() + 1));
  }
  std::cout << "\n";
}
