// 01 Vector: a list of numbers = an arrow from the origin (0,0,0)
#include <iostream>
#include "../../lib/zvect.hpp"
using namespace zv;

int main() {
  Vec v = {3, 4, 0};                           // x=3, y=4, z=0
  std::cout << "v = " << fmt(v) << "\n";
  std::cout << "walk: x " << v[0] << ", then y " << v[1] << ", then z " << v[2] << "\n";
  std::cout << "dimensions = " << v.size() << "\n";
}
