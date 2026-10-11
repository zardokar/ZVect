// 11 Euclidean distance: how far apart two points are = the length of a - b
#include <iostream>
#include "../../lib/zvect.hpp"
using namespace zv;

int main() {
  Vec a = {1, 2, 2};
  Vec b = {4, 6, 2};
  std::cout << "a - b = " << fmt(sub(a, b)) << "\n";
  std::cout << "|a - b| = " << fmt(norm(sub(a, b))) << "\n";
  std::cout << "distance(a, b) = " << fmt(distance(a, b)) << "\n";
  std::cout << "distance(b, a) = " << fmt(distance(b, a)) << "\n";
  std::cout << "distance(a, a) = " << fmt(distance(a, a)) << "\n";

  // same direction, different length: the tips are still apart
  Vec c = scale(a, 2);
  std::cout << "c = 2a = " << fmt(c) << "   distance(a, c) = " << fmt(distance(a, c)) << "\n";
}
