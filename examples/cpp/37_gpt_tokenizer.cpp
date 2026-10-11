// 37 GPT tokenizer (byte-level BPE): turn text into UTF-8 bytes (0-255), merge the most frequent adjacent pair
// k times with new ids 256, 257, ..., then encode new text (oldest rule first) and decode it back.
// From Karpathy's "Let's build the GPT Tokenizer". Ties go to the pair seen first. Sample text: author's choice.
// This file is saved as UTF-8, so the Thai strings below are already UTF-8 bytes.
#include <cstdio>
#include <iostream>
#include <map>
#include <string>
#include <utility>
#include <vector>

using Ids = std::vector<int>;
Ids utf8(const std::string& s) { Ids v; for (unsigned char c : s) v.push_back(c); return v; }
std::string join(const Ids& v) { std::string s; for (size_t i = 0; i < v.size(); i++) s += (i ? " " : "") + std::to_string(v[i]); return s; }
// number of UTF-8 bytes of the character that starts with byte b
int charLen(unsigned char b) { return b < 0x80 ? 1 : (b >> 5) == 6 ? 2 : (b >> 4) == 14 ? 3 : 4; }

Ids merge(const Ids& ids, int a, int b, int idx) {
  Ids out;
  for (size_t i = 0; i < ids.size(); i++) {
    if (i + 1 < ids.size() && ids[i] == a && ids[i + 1] == b) { out.push_back(idx); i++; } else out.push_back(ids[i]);
  }
  return out;
}
struct Pair { int a, b, n; };
// most frequent adjacent pair; first seen wins a tie
bool topPair(const Ids& ids, Pair& best) {
  std::vector<Pair> seen;                       // in the order pairs were first seen
  for (size_t i = 0; i + 1 < ids.size(); i++) {
    bool found = false;
    for (auto& p : seen) if (p.a == ids[i] && p.b == ids[i + 1]) { p.n++; found = true; break; }
    if (!found) seen.push_back({ids[i], ids[i + 1], 1});
  }
  if (seen.empty()) return false;
  best = seen[0];
  for (auto& p : seen) if (p.n > best.n) best = p;
  return true;
}

int main() {
  const std::string CORPUS = "แมวกินปลา แมวกินนม หมากินข้าว แมวนอน หมานอน", NEW = "แมวกินข้าว";
  const int K = 6;
  Ids data = utf8(CORPUS);
  int chars = 0;
  for (size_t i = 0; i < CORPUS.size(); i += charLen(CORPUS[i])) chars++;
  std::cout << "corpus: " << chars << " characters, " << data.size() << " bytes\n";
  std::string first = CORPUS.substr(0, charLen(CORPUS[0]));
  std::cout << "first character " << first << " -> bytes " << join(utf8(first)) << "\n";
  std::map<int, Ids> vocab;
  for (int i = 0; i < 256; i++) vocab[i] = {i};
  std::vector<std::vector<int>> rules;          // {a, b, new id}, in the order they were made
  Ids ids = data;
  for (int r = 0; r < K; r++) {
    Pair p;
    if (!topPair(ids, p)) break;
    int idx = 256 + r;
    rules.push_back({p.a, p.b, idx});
    vocab[idx] = vocab[p.a];
    vocab[idx].insert(vocab[idx].end(), vocab[p.b].begin(), vocab[p.b].end());
    ids = merge(ids, p.a, p.b, idx);
    std::cout << "merge " << r + 1 << ": (" << p.a << ", " << p.b << ") -> " << idx << " seen " << p.n
              << " times, bytes " << join(vocab[idx]) << "\n";
  }
  char ratio[32];
  std::snprintf(ratio, sizeof ratio, "%.2f", (double)data.size() / ids.size());
  std::cout << "corpus: " << data.size() << " bytes -> " << ids.size() << " tokens, ratio " << ratio << "\n";

  Ids t = utf8(NEW);
  while (t.size() >= 2) {
    std::vector<int> best;                      // the pair with the oldest rule (smallest new id)
    for (size_t i = 0; i + 1 < t.size(); i++)
      for (auto& rule : rules)
        if (t[i] == rule[0] && t[i + 1] == rule[1] && (best.empty() || rule[2] < best[2])) best = rule;
    if (best.empty()) break;
    t = merge(t, best[0], best[1], best[2]);
  }
  std::cout << NEW << ": " << utf8(NEW).size() << " bytes -> " << t.size() << " tokens: " << join(t) << "\n";
  std::string back;
  for (int i : t) for (int b : vocab[i]) back += (char)b;
  std::cout << "decode -> " << back << (back == NEW ? " (same as the input)" : " (different)") << "\n";
  std::cout << "token 256 alone = bytes " << join(vocab[256]) << " (not a whole character)\n";
}
