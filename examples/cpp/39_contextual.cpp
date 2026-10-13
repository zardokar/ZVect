// 39 Static vs contextual embeddings (toy): a static model gives a word one row of its table in every sentence;
// a contextual model mixes that row with the rows of the sentence's words. Mixing rule (simplified attention, author's toy):
// score_j = (e . E[x_j]) / sqrt(d) ; a = softmax(score) ; c = sum_j a_j * E[x_j]. Table and numbers made up by the author.
#include <algorithm>
#include <cmath>
#include <iostream>
#include <map>
#include <string>
#include <utility>
#include <vector>
#include "../../lib/zvect.hpp"
using namespace zv;

std::map<std::string, Vec> table = {
  {"bank", {2, 2, 0.5}}, {"deposited", {3.5, 0, 0.5}}, {"money", {4, 0.5, 0}}, {"reached", {0.5, 1, 1}}, {"river", {0.5, 4, 0}},
  {"apple", {2, 0.5, 2}}, {"ate", {0, 1, 3.5}}, {"released", {3.5, 1, 0}}, {"phone", {4, 0, 1}}, {"fruit", {0.5, 0.5, 4}}, {"company", {4, 0.5, 0.5}},
};
using Sentence = std::pair<std::string, std::vector<std::string>>;
struct Case {
  std::string word;
  std::vector<std::string> senses;
  std::vector<Sentence> sentences;
};
std::vector<Case> cases = {
  {"bank", {"money", "river"}, {{"I deposited money in the bank", {"deposited", "money", "bank"}}, {"I reached Yamuna river bank", {"reached", "river", "bank"}}}},
  {"apple", {"fruit", "company"}, {{"I ate an apple", {"ate", "apple"}}, {"Apple released a phone", {"apple", "released", "phone"}}}},
};

// the contextual vector of word in a sentence (c), and the weight of each word of the sentence
Vec contextualize(const std::string& word, const std::vector<std::string>& words, std::vector<double>& weights) {
  const Vec& e = table[word];
  std::vector<double> scores;
  for (auto& w : words) {
    scores.push_back(dot(e, table[w]) / std::sqrt(double(e.size())));
  }
  double top = *std::max_element(scores.begin(), scores.end());
  double total = 0;
  weights.clear();
  for (double s : scores) {
    weights.push_back(std::exp(s - top));         // subtract the largest score first: same weights, no overflow
    total += weights.back();
  }
  for (auto& x : weights) {
    x /= total;
  }
  Vec c(3, 0.0);
  for (size_t j = 0; j < words.size(); ++j) {
    for (int i = 0; i < 3; ++i) {
      c[i] += weights[j] * table[words[j]][i];
    }
  }
  return c;
}

std::string senseLine(const std::string& name, const Vec& v, const std::vector<std::string>& senses) {
  std::string out;
  for (size_t i = 0; i < senses.size(); ++i) {
    out += (i ? "  " : "") + std::string("cos(") + name + ", " + senses[i] + ") " + fmt(cosine(v, table[senses[i]]));
  }
  return out;
}

int main() {
  for (auto& k : cases) {
    const Vec e = table[k.word];
    std::cout << "word \"" << k.word << "\"\n";
    std::cout << "  static: e = " << fmt(e) << "  " << senseLine("e", e, k.senses) << "  (same row in every sentence)\n";
    std::vector<Vec> got;
    for (auto& [text, words] : k.sentences) {
      std::vector<double> weights;
      Vec c = contextualize(k.word, words, weights);
      got.push_back(c);
      std::string w;
      for (size_t j = 0; j < words.size(); ++j) {
        w += (j ? ", " : "") + words[j] + " " + fmt(weights[j]);
      }
      std::cout << "  sentence \"" << text << "\"\n";
      std::cout << "    weights: " << w << "\n";
      std::cout << "    c = " << fmt(c) << "  " << senseLine("c", c, k.senses) << "\n";
    }
    std::cout << "  same word, two sentences: static cos " << fmt(cosine(e, e)) << ", contextual cos " << fmt(cosine(got[0], got[1])) << "\n";
  }
}
