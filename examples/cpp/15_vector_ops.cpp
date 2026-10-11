// 15 Add, subtract, scale: make new vectors from the ones you have (the result still has 3 numbers)
#include <iostream>
#include "../../lib/zvect.hpp"
using namespace zv;

int main() {
  Vec a = {2, 0, 1};
  Vec b = {0, 1, 2};
  std::cout << "a + b = " << fmt(add(a, b)) << "\n";
  std::cout << "a - b = " << fmt(sub(a, b)) << "\n";
  std::cout << "2 * a = " << fmt(scale(a, 2)) << "\n";

  // every 3D vector = a mix of the 3 basis vectors e1, e2, e3
  Vec e1 = {1, 0, 0}, e2 = {0, 1, 0}, e3 = {0, 0, 1};
  Vec v = add(add(scale(e1, 2), scale(e2, 3)), scale(e3, 1));
  std::cout << "2e1 + 3e2 + 1e3 = " << fmt(v) << "\n";
}
