// 07 Choose a metric: cosine, distance and dot can pick different winners
// A = query, B = 2·A (same direction, longer), C = close to A but a different direction
#include <iostream>
#include "../../lib/zvect.hpp"
using namespace zv;

void show(const std::string& title, const Vec& q, const Vec& b, const Vec& c) {
  std::cout << title << "\n";
  std::cout << "  B  cos " << fmt(cosine(q, b)) << "  dist " << fmt(distance(q, b)) << "  dot " << fmt(dot(q, b)) << "\n";
  std::cout << "  C  cos " << fmt(cosine(q, c)) << "  dist " << fmt(distance(q, c)) << "  dot " << fmt(dot(q, c)) << "\n";
}

int main() {
  Vec A = {3, 1, 0}, B = {6, 2, 0}, C = {3, 2, 0};

  show("raw (cos and dot pick B, distance picks C):", A, B, C);
  show("normalized (all three pick B):", normalize(A), normalize(B), normalize(C));

  // on unit vectors: |a - b|^2 = 2 - 2 cos
  double d = distance(normalize(A), normalize(C));
  std::cout << "dist^2 = " << fmt(d * d) << "  2 - 2cos = " << fmt(2 - 2 * cosine(A, C)) << "\n";
}
