// 16 Length (norm): |v| = sqrt(x² + y² + z²)
#include <iostream>
#include <cmath>
#include "../../lib/zvect.hpp"
using namespace zv;

int main() {
  Vec v = {3, 4, 0};
  double byHand = std::sqrt(3 * 3 + 4 * 4 + 0 * 0);
  std::cout << "|v|    = " << fmt(byHand) << " (by hand)\n";
  std::cout << "norm() = " << fmt(norm(v)) << " (lib)\n";
  std::cout << "|(1, 2, 2)| = " << fmt(norm(Vec{1, 2, 2})) << "\n";
  std::cout << "|(-3, 4, 0)| = " << fmt(norm(Vec{-3, 4, 0})) << " (sign does not change the length)\n";
}
