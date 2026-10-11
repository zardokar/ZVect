// 33 Keyword search vs meaning: an inverted index (word -> documents) finds the same words;
// a vector search (mean of word vectors, cosine) finds similar meaning. The word vectors are a made-up toy table.
#include <algorithm>
#include <iostream>
#include <map>
#include <set>
#include <string>
#include <vector>
#include "../../lib/zvect.hpp"
using namespace zv;

std::vector<std::string> docs = {"Cancel anytime", "Cancellation policy", "Order cancellation timeline", "End your membership today",
  "Pause your plan", "Manage billing", "Sourdough bread recipe", "Ticket ZV-1042 login error"};
std::map<std::string, Vec> table = {   // axes: leave, money, food
  {"cancel", {1, 0.2, 0}}, {"cancellation", {1, 0.3, 0}}, {"end", {0.9, 0, 0}}, {"membership", {0.7, 0.4, 0}}, {"subscription", {0.7, 0.5, 0}},
  {"pause", {0.8, 0.3, 0}}, {"plan", {0.5, 0.6, 0}}, {"order", {0.3, 0.6, 0.2}}, {"policy", {0.3, 0.5, 0}}, {"billing", {0.2, 1, 0}},
  {"manage", {0.1, 0.5, 0}}, {"sourdough", {0, 0, 1}}, {"bread", {0, 0.1, 1}}, {"recipe", {0, 0.1, 0.9}}, {"quit", {1, 0.1, 0}}, {"stop", {0.9, 0.1, 0}},
};
std::vector<std::string> unique(const std::vector<std::string>& ws) {   // keep the first copy of each word, in order
  std::vector<std::string> out;
  for (auto& w : ws) if (std::find(out.begin(), out.end(), w) == out.end()) out.push_back(w);
  return out;
}

int main() {
  std::map<std::string, std::vector<int>> index;   // inverted index: word -> documents that contain it
  for (int i = 0; i < (int)docs.size(); ++i) for (auto& w : unique(words(docs[i]))) index[w].push_back(i);

  for (std::string q : {"cancel my subscription", "ZV-1042"}) {
    std::cout << "query: " << q << "\n";
    std::map<int, int> hits;
    for (auto& w : unique(words(q))) {
      auto it = index.find(w);
      std::string list;
      if (it != index.end()) for (size_t k = 0; k < it->second.size(); ++k) list += (k ? " | " : "") + docs[it->second[k]];
      std::cout << "  index[" << w << "] = " << (list.empty() ? "-" : list) << "\n";
      if (it != index.end()) for (int i : it->second) hits[i]++;
    }
    std::vector<std::pair<int, int>> kw(hits.begin(), hits.end());
    std::sort(kw.begin(), kw.end(), [](auto& a, auto& b) { return a.second > b.second || (a.second == b.second && a.first < b.first); });
    std::string ks;
    for (size_t k = 0; k < kw.size(); ++k) ks += (k ? " | " : "") + docs[kw[k].first];
    std::cout << "  keyword: " << (ks.empty() ? "nothing" : ks) << "\n";
    Vec qv = encode(q, table);
    std::vector<std::pair<int, double>> top;
    for (int i = 0; i < (int)docs.size(); ++i) { double s = cosine(qv, encode(docs[i], table)); if (s > 0) top.push_back({i, s}); }
    std::sort(top.begin(), top.end(), [](auto& a, auto& b) { return a.second > b.second || (a.second == b.second && a.first < b.first); });
    if (top.size() > 3) top.resize(3);
    std::string ms;
    for (size_t k = 0; k < top.size(); ++k) ms += (k ? " | " : "") + docs[top[k].first] + " " + fmt(top[k].second);
    std::cout << "  meaning: " << (ms.empty() ? "nothing (no known word)" : ms) << "\n";
  }
}
