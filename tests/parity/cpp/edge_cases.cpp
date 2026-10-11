// Edge-case rules that must be identical in JS / Python / C++ (run by npm run check)
#include <iostream>
#include "../../../lib/zvect.hpp"
using namespace zv;

template <class F> void tryIt(const std::string& name, F f) {
  try { auto v = f(); std::cout << name << " = " << v << "\n"; }  // compute first, then print
  catch (const std::invalid_argument& e) { std::cout << name << " throws " << e.what() << "\n"; }
}

int main() {
  tryIt("add size mismatch", [] { return fmt(add({1, 2, 3}, {1, 2})); });
  tryIt("dot size mismatch", [] { return fmt(dot({1, 2}, {1, 2, 3})); });
  tryIt("mean empty", [] { return fmt(mean({})); });
  tryIt("mean ragged", [] { return fmt(mean({{1, 2}, {1, 2, 3}})); });
  tryIt("classify empty", [] { return classify({1, 0}, {}).first; });
  tryIt("encode empty table", [] { return fmt(encode("cat", {})); });
  std::cout << "cosine zero = " << fmt(cosine({0, 0, 0}, {1, 2, 3})) << "\n";
  std::cout << "normalize zero = " << fmt(normalize({0, 0})) << "\n";
  std::cout << "fmt tie 0.0625 = " << fmt(0.0625) << "\n";
  std::cout << "fmt tie 0.0375 = " << fmt(0.0375) << "\n";
  std::cout << "fmt -0 = " << fmt(-0.0) << "\n";
  std::cout << "classify tie = " << classify({1, 1}, {{"b", {1, 0}}, {"a", {0, 1}}}).first << "\n";
  std::cout << "topK tie = " << topK({1, 0}, {{"p", {1, 1}}, {"q", {1, 1}}}, 1)[0].first << "\n";
  std::map<std::string, Vec> T = {{"แมว", {0, 1}}, {"กิน", {1, 0}}, {"cat", {0, 1}}};
  std::cout << "encode thai = " << fmt(encode("แมว กิน", T)) << "\n";
  std::cout << "encode CAT = " << fmt(encode("CAT!!", T)) << "\n";
  std::cout << "encode unknown = " << fmt(encode("constructor toString", T)) << "\n";
  // near-zero: 1e-300 squared underflows to 0, so the lib treats it as a zero vector; 1e-150 still works
  std::cout << "cosine near-zero 1e-300 = " << fmt(cosine({1e-300, 0, 0}, {1, 2, 3})) << "\n";
  std::cout << "cosine tiny 1e-150 = " << fmt(cosine({1e-150, 0, 0}, {1, 2, 3})) << "\n";
  std::cout << "normalize near-zero = " << fmt(normalize({1e-300, 0})) << "\n";
  // on unit vectors dot == cosine and |a-b|^2 == 2 - 2cos
  Vec ua = normalize({3, 1, 0}), ub = normalize({3, 2, 0});
  std::cout << "unit dot = " << fmt(dot(ua, ub)) << " cosine = " << fmt(cosine({3, 1, 0}, {3, 2, 0})) << "\n";
  double du = distance(ua, ub);
  std::cout << "unit dist^2 = " << fmt(du * du) << " 2-2cos = " << fmt(2 - 2 * cosine(ua, ub)) << "\n";
}
