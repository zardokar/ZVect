// 03 Cosine similarity: compare DIRECTION only, ignore length
#include <iostream>
#include "../../lib/zvect.hpp"
using namespace zv;

int main() {
  Vec a = {1, 1, 0};
  std::cout << "same direction = " << fmt(cosine(a, {2, 2, 0})) << "\n";    //  1
  std::cout << "perpendicular  = " << fmt(cosine(a, {1, -1, 0})) << "\n";   //  0
  std::cout << "opposite       = " << fmt(cosine(a, {-1, -1, 0})) << "\n";  // -1

  // angle in degrees
  double deg = angle(a, {1, 0, 0}) * 180.0 / std::acos(-1.0);  // acos(-1) = pi
  std::cout << "angle(a,x) = " << fmt(deg) << " deg\n";
}
