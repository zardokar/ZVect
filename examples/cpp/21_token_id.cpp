// 21 Token ID: a word's number is a name tag, not a position. gap(a, b) = |id(a) - id(b)|
#include <iostream>
#include <map>
#include <string>
#include <vector>
#include "../../lib/zvect.hpp"
using namespace zv;

using Ids = std::map<std::string, double>;
// one number = a 1-number vector, so the gap is the Euclidean distance of lesson 2.1
double gap(const Ids& ids, const std::string& a, const std::string& b) { return distance(Vec{ids.at(a)}, Vec{ids.at(b)}); }

int main() {
  Ids id = {{"good", 6}, {"bad", 22}, {"great", 21}};   // IDs from the clip ("This movie was good / bad / great")
  std::vector<std::pair<std::string, std::string>> pairs = {{"good", "great"}, {"bad", "great"}, {"good", "bad"}};

  for (auto& [a, b] : pairs) std::cout << "gap(" << a << ", " << b << ") = " << fmt(gap(id, a, b)) << "\n";
  std::cout << "by ID, closest to great: " << (gap(id, "bad", "great") < gap(id, "good", "great") ? "bad" : "good")
            << "  (wrong: good and great mean almost the same)\n";

  // Give the same words other numbers (here: alphabetical order). Meaning did not change, the "closeness" did.
  Ids abc = {{"bad", 0}, {"good", 1}, {"great", 2}};
  for (auto& [a, b] : pairs) std::cout << "alphabetical IDs: gap(" << a << ", " << b << ") = " << fmt(gap(abc, a, b)) << "\n";
}
