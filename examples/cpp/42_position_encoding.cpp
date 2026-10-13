// 42 Sinusoidal position encoding. Pair i is a clock hand with angle theta_i = pos / 10000^(2i/d);
// PE = (sin theta_0, cos theta_0, sin theta_1, cos theta_1, ...). Close positions are similar (cosine), far ones less.
// Idea (clock hands at different speeds) from Stanford CME295 Lecture 1; formula from the 2017 paper; d = 8 chosen by the author.
#include <cmath>
#include <iostream>
#include "../../lib/zvect.hpp"
using namespace zv;

const int d = 8;
const double base = 10000;

Vec position(int pos) {
  Vec out;
  for (int i = 0; i < d; i += 2) {
    double angle = pos / std::pow(base, double(i) / d);
    out.push_back(std::sin(angle));
    out.push_back(std::cos(angle));
  }
  return out;
}

int main() {
  for (int pos : {0, 1, 10, 60}) {
    std::cout << "PE(" << pos << ") = " << fmt(position(pos)) << "\n";
  }
  for (int k : {1, 5, 20}) {
    std::cout << "cos(PE(10), PE(" << 10 + k << ")) = " << fmt(cosine(position(10), position(10 + k))) << "  (" << k << " apart)\n";
  }
}
