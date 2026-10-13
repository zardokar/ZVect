// 43 One transformer block: X + PE -> 2-head self-attention -> concat x W_O -> add & layer norm -> FFN (ReLU) -> add & norm.
// Every stage keeps n x d_model (5 x 4) except the FFN hidden layer (5 x 8). Structure from Stanford CME295 Lecture 1;
// sizes, input rows and random weights (minstd seeds) chosen by the author, so the numbers carry no meaning.
#include <algorithm>
#include <cmath>
#include <iostream>
#include <string>
#include <utility>
#include <vector>
#include "../../lib/zvect.hpp"
using namespace zv;

using Mat = std::vector<Vec>;
const Mat X = {{0.2, 0.2, 0.1, 0.0}, {2.0, 0.4, 0.2, 0.1}, {0.6, 2.0, 0.4, 0.2}, {0.2, 0.2, 0.6, 0.1}, {0.4, 0.6, 2.0, 0.3}};
const int dModel = 4;
const int heads = 2;
const int dK = 2;
const int dFF = 8;
const long long seed = 7;
const double span = 0.8;

Mat seeded(long long s, int rows, int cols) {
  long long state = s;
  for (int i = 0; i < 10; ++i) {
    state = (state * 48271) % 2147483647;   // minstd; the first 10 numbers are thrown away
  }
  Mat M;
  for (int r = 0; r < rows; ++r) {
    Vec row;
    for (int c = 0; c < cols; ++c) {
      state = (state * 48271) % 2147483647;
      row.push_back((double(state) / 2147483647 * 2 - 1) * span);
    }
    M.push_back(row);
  }
  return M;
}

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

Mat addm(const Mat& A, const Mat& B) {
  Mat out = A;
  for (size_t i = 0; i < A.size(); ++i) {
    for (size_t j = 0; j < A[i].size(); ++j) {
      out[i][j] += B[i][j];
    }
  }
  return out;
}

Mat norm(const Mat& A) {
  Mat out;
  for (auto& row : A) {
    double mean = 0;
    for (double x : row) {
      mean += x;
    }
    mean /= row.size();
    double v = 0;
    for (double x : row) {
      v += (x - mean) * (x - mean);
    }
    v /= row.size();
    Vec r;
    for (double x : row) {
      r.push_back((x - mean) / std::sqrt(v + 0.00001));
    }
    out.push_back(r);
  }
  return out;
}

Mat head(const Mat& X0, int h) {
  long long s = seed + 10 * h;
  Mat Q = matmul(X0, seeded(s + 1, dModel, dK));
  Mat K = matmul(X0, seeded(s + 2, dModel, dK));
  Mat V = matmul(X0, seeded(s + 3, dModel, dK));
  Mat A;
  for (size_t i = 0; i < Q.size(); ++i) {
    Vec sc;
    for (size_t j = 0; j < K.size(); ++j) {
      double d = 0;
      for (int c = 0; c < dK; ++c) {
        d += Q[i][c] * K[j][c];
      }
      sc.push_back(d / std::sqrt(double(dK)));
    }
    double top = *std::max_element(sc.begin(), sc.end());
    Vec e;
    double total = 0;
    for (double x : sc) {
      e.push_back(std::exp(x - top));
    }
    for (double x : e) {
      total += x;
    }
    for (auto& x : e) {
      x /= total;
    }
    A.push_back(e);
  }
  return matmul(A, V);
}

int main() {
  Mat X0 = X;
  for (size_t p = 0; p < X.size(); ++p) {
    for (int i = 0; i < dModel; ++i) {
      double angle = double(p) / std::pow(10000.0, double(i - i % 2) / dModel);
      X0[p][i] += i % 2 == 0 ? std::sin(angle) : std::cos(angle);
    }
  }
  std::vector<Mat> outs;
  for (int h = 0; h < heads; ++h) {
    outs.push_back(head(X0, h));
  }
  Mat concat;
  for (size_t i = 0; i < X0.size(); ++i) {
    Vec r = outs[0][i];
    r.insert(r.end(), outs[1][i].begin(), outs[1][i].end());
    concat.push_back(r);
  }
  Mat mha = matmul(concat, seeded(seed + 101, heads * dK, dModel));
  Mat norm1 = norm(addm(X0, mha));
  Mat hidden = matmul(norm1, seeded(seed + 102, dModel, dFF));
  for (auto& row : hidden) {
    for (auto& x : row) {
      x = std::max(0.0, x);
    }
  }
  Mat ffn = matmul(hidden, seeded(seed + 103, dFF, dModel));
  Mat out = norm(addm(norm1, ffn));
  std::vector<std::pair<std::string, Mat>> stages = {{"X + PE", X0}, {"concat", concat}, {"x W_O", mha}, {"add & norm", norm1}, {"FFN hidden", hidden}, {"FFN out", ffn}, {"block out", out}};
  for (auto& [name, M] : stages) {
    std::string n = name;
    n.resize(11, ' ');
    std::cout << n << M.size() << " x " << M[0].size() << "  teddy bear row " << fmt(M[2]) << "\n";
  }
}
