// 25 LLM input: one row per token (n x d), then add a position vector to each row: x_i = e_(t_i) + p_i
// Sentence and IDs from the clip; the 3-number rows and position vectors are made up so they can be drawn.
#include <algorithm>
#include <iostream>
#include <map>
#include <string>
#include <vector>
#include "../../lib/zvect.hpp"
using namespace zv;

std::map<std::string, int> id = {{"The", 791}, {"cat", 8415}, {"sat", 7731}, {"on", 389}, {"a", 264}, {"mat", 5634}};
std::map<std::string, Vec> E = {{"The", {0.1, 0.1, 0.1}}, {"cat", {0.9, 0.8, 0.0}}, {"sat", {0.2, 0.1, 0.9}},
                                {"on", {0.1, 0.4, 0.3}}, {"a", {0.1, 0.0, 0.2}}, {"mat", {0.3, 0.9, 0.2}}};
std::vector<Vec> P = {{0.0, 0.3, 0.0}, {0.3, 0.0, 0.0}, {0.0, 0.0, 0.3}, {0.3, 0.3, 0.0}, {0.0, 0.3, 0.3}, {0.3, 0.0, 0.3}};

std::vector<Vec> table(const std::vector<std::string>& tokens, bool withPos) {
  std::vector<Vec> X;
  for (size_t i = 0; i < tokens.size(); ++i) X.push_back(withPos ? add(E[tokens[i]], P[i]) : E[tokens[i]]);
  return X;
}
bool sameSet(const std::vector<Vec>& A, const std::vector<Vec>& B) {
  std::vector<std::string> a, b;
  for (auto& r : A) a.push_back(fmt(r));
  for (auto& r : B) b.push_back(fmt(r));
  std::sort(a.begin(), a.end()); std::sort(b.begin(), b.end());
  return a == b;
}

int main() {
  std::vector<std::string> s1 = {"The", "cat", "sat", "on", "a", "mat"};
  std::vector<std::string> s2 = {"The", "mat", "sat", "on", "a", "cat"};   // cat and mat swapped
  auto X = table(s1, true);
  std::cout << "tokens:";
  for (auto& t : s1) std::cout << " " << t;
  std::cout << "  IDs: ";
  for (size_t i = 0; i < s1.size(); ++i) std::cout << (i ? ", " : "") << id[s1[i]];
  std::cout << "\nshape of X = " << X.size() << " x " << X[0].size() << " (position added, shape unchanged)\n";
  for (size_t i = 0; i < X.size(); ++i) std::cout << "x" << i + 1 << " " << s1[i] << " = " << fmt(X[i]) << "\n";

  // Without positions the swapped sentence has the same rows, only reordered. With positions, cat's row changes.
  std::cout << "no position:   same set of rows after swap? " << (sameSet(table(s1, false), table(s2, false)) ? "true" : "false") << "\n";
  std::cout << "with position: same set of rows after swap? " << (sameSet(table(s1, true), table(s2, true)) ? "true" : "false") << "\n";
  std::cout << "cat at position 2 = " << fmt(table(s1, true)[1]) << ", cat at position 6 = " << fmt(table(s2, true)[5]) << "\n";
}
