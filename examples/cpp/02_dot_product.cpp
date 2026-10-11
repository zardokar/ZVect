// 02 Dot product: multiply matching parts, then add them up
#include <iostream>
#include "../../lib/zvect.hpp"
using namespace zv;

int main() {
  Vec a = {1, 2, 3};
  Vec b = {4, 5, 6};
  std::cout << "by hand = " << fmt(1 * 4 + 2 * 5 + 3 * 6) << "\n";
  std::cout << "dot(a,b) = " << fmt(dot(a, b)) << "\n";

  // perpendicular vectors -> dot = 0
  std::cout << "dot(x,y) = " << fmt(dot({1, 0, 0}, {0, 1, 0})) << "\n";

  // shadow of b on a (projection)
  std::cout << "proj b on a = " << fmt(project(b, a)) << "\n";
}
