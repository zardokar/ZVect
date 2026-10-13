// 40 Why the Transformer: in an RNN, information from an earlier token reaches a later one only through the hidden state,
// one step per token in between; attention connects the two directly (1 step). Toy "kept" = keep^steps (author's illustration).
// Sentences from Stanford CME295 Lecture 1 (~51:44); the inserted sentence is made up by the author.
#include <algorithm>
#include <cmath>
#include <cstdlib>
#include <iostream>
#include <string>
#include <utility>
#include <vector>
#include "../../lib/zvect.hpp"
using namespace zv;

using Tokens = std::vector<std::string>;

long indexOf(const Tokens& t, const std::string& w) {
  return std::find(t.begin(), t.end(), w) - t.begin();
}

int main() {
  Tokens near = {"My", "teddy bear", "is", "so", "cute", ".", "It", "is", "3", "feet", "tall"};
  Tokens far = {"My", "teddy bear", "is", "so", "cute", ".", "We", "went", "to", "the", "park", "and", "played", "all", "day", ".",
                "It", "is", "3", "feet", "tall"};
  const double keep = 0.6;
  std::vector<std::pair<std::string, Tokens>> cases = {{"near", near}, {"far", far}};
  for (auto& [name, tokens] : cases) {
    long hops = std::labs(indexOf(tokens, "It") - indexOf(tokens, "teddy bear"));
    std::cout << name << ": " << tokens.size() << " tokens\n";
    std::cout << "  RNN: It <- teddy bear takes " << hops << " steps, kept " << fmt(std::pow(keep, double(hops)))
              << ", reading needs " << tokens.size() << " steps in a row\n";
    std::cout << "  attention: 1 step, kept " << fmt(1.0) << ", one layer reads all " << tokens.size() << " tokens at once\n";
  }
}
