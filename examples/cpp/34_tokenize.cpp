// 34 Tokenization: cut text into tokens (characters or words), then look each token up in a vocabulary.
// Character vocabulary from the BPE clip: a-z = 1-26, ! @ # $ = 27-30. Word vocabulary = the unique words of a small
// training corpus, sorted like a dictionary. A token that is not in the vocabulary gets "?". ASCII text only.
#include <algorithm>
#include <iostream>
#include <set>
#include <sstream>
#include <string>
#include <vector>

const std::string CHARS = "abcdefghijklmnopqrstuvwxyz!@#$";
std::string charId(char ch) { auto i = CHARS.find(ch); return i == std::string::npos ? "?" : std::to_string(i + 1); }

std::vector<std::string> split(const std::string& s) {
  std::vector<std::string> out; std::istringstream in(s); std::string w;
  while (in >> w) out.push_back(w);
  return out;
}

int main() {
  std::vector<std::string> corpus = {"my dog eats fish", "i write code on my computer", "the app on my phone has a bug",
    "i want to eat noodles", "a robot dog that can bark", "pets like cats and dogs"};
  std::set<std::string> uniq;
  for (auto& line : corpus) for (auto& w : split(line)) uniq.insert(w);
  std::vector<std::string> words(uniq.begin(), uniq.end());          // std::set is already sorted
  auto wordId = [&](const std::string& w) {
    auto it = std::find(words.begin(), words.end(), w);
    return it == words.end() ? std::string("?") : std::to_string(it - words.begin() + 1);
  };

  std::cout << "char vocabulary: " << CHARS.size() << "\n";
  std::string text = "hello there you are amazing";
  size_t n = 0;
  for (auto& w : split(text)) {
    std::cout << w << " ->";
    for (char ch : w) { std::cout << " " << charId(ch); n++; }
    std::cout << "\n";
  }
  std::cout << "by character: " << n << " numbers (spaces get no number)\n";
  std::cout << "by word: " << split(text).size() << " numbers\n";

  std::cout << "word vocabulary: " << words.size() << " words\n";
  for (size_t i = 0; i < words.size(); i++) std::cout << (i ? " " : "") << words[i] << ":" << i + 1;
  std::cout << "\n";
  std::string s = "my dog eats fish";
  std::cout << s << " ->";
  for (auto& w : split(s)) std::cout << " " << wordId(w);
  std::cout << "\nzebra by character ->";
  for (char ch : std::string("zebra")) std::cout << " " << charId(ch);
  std::cout << "\nzebra by word -> " << wordId("zebra") << "  (not in the training corpus)\n";
}
