// 41 Self-attention, the full formula: A = softmax(Q K^T / sqrt(d_k)), out = A V, with Q = X Wq, K = X Wk, V = X Wv.
// Formula from Stanford CME295 Lecture 1; the 5 tokens are the lecture's sentence, every number is made up by the author
// (Wq swaps dims 1 and 2, Wk = Wv = I). Also: no scaling (peakier weights) and the decoder's causal mask (later tokens get 0).
#include <algorithm>
#include <cmath>
#include <iostream>
#include <limits>
#include <string>
#include <tuple>
#include <vector>
#include "../../lib/zvect.hpp"
using namespace zv;

using Mat = std::vector<Vec>;
const std::vector<std::string> tokens = {"A", "cute", "teddy bear", "is", "reading"};
const Mat X = {{0.2, 0.2, 0.1}, {2.0, 0.4, 0.2}, {0.6, 2.0, 0.4}, {0.2, 0.2, 0.6}, {0.4, 0.6, 2.0}};
const Mat Wq = {{0, 1, 0}, {1, 0, 0}, {0, 0, 1}};
const Mat Wk = {{1, 0, 0}, {0, 1, 0}, {0, 0, 1}};
const Mat Wv = {{1, 0, 0}, {0, 1, 0}, {0, 0, 1}};

Mat matmul(const Mat& A, const Mat& B) {
  Mat out;
  for (auto& row : A) {
    Vec r(B[0].size(), 0.0);
    for (size_t k = 0; k < row.size(); ++k) {
      for (size_t j = 0; j < r.size(); ++j) {
        r[j] += row[k] * B[k][j];
      }
    }
    out.push_back(r);
  }
  return out;
}

std::pair<Mat, Mat> attend(bool scaled, bool causal) {
  Mat Q = matmul(X, Wq), K = matmul(X, Wk), V = matmul(X, Wv);
  const double div = scaled ? std::sqrt(double(K[0].size())) : 1.0;
  const double NEG = -std::numeric_limits<double>::infinity();
  Mat A;
  for (size_t i = 0; i < Q.size(); ++i) {
    Vec s;
    for (size_t j = 0; j < K.size(); ++j) {
      double d = 0;
      for (size_t c = 0; c < K[j].size(); ++c) {
        d += Q[i][c] * K[j][c];
      }
      s.push_back(causal && j > i ? NEG : d / div);
    }
    double top = *std::max_element(s.begin(), s.end());
    Vec e;
    double total = 0;
    for (double x : s) {
      e.push_back(x == NEG ? 0.0 : std::exp(x - top));
      total += e.back();
    }
    for (auto& x : e) {
      x /= total;
    }
    A.push_back(e);
  }
  return {A, matmul(A, V)};
}

int main() {
  std::vector<std::tuple<std::string, bool, bool>> runs = {{"scaled by sqrt(d_k)", true, false}, {"not scaled", false, false}, {"scaled + causal mask", true, true}};
  for (auto& [title, scaled, causal] : runs) {
    auto [A, out] = attend(scaled, causal);
    std::cout << title << "\n";
    for (size_t i = 0; i < tokens.size(); ++i) {
      std::string t = tokens[i];
      t.resize(11, ' ');
      std::cout << "  " << t << " weights " << fmt(A[i]) << "  out " << fmt(out[i]) << "\n";
    }
  }
}
