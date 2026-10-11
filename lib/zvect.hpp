// zvect.hpp — tiny vector library for learning. Header-only, C++17, std only.
// A vector is std::vector<double>. Same API and same rules as zvect.js and zvect.py.
// Rules: size mismatch / empty list / empty table -> throws std::invalid_argument.
// License: see LICENSE (non-commercial).
#pragma once
#include <algorithm>
#include <cmath>
#include <cstdio>
#include <functional>
#include <limits>
#include <map>
#include <stdexcept>
#include <string>
#include <utility>
#include <vector>

namespace zv {

using Vec = std::vector<double>;
inline const char* VERSION = "0.1.0";

inline void same(const Vec& a, const Vec& b) {
  if (a.size() != b.size())
    throw std::invalid_argument("size mismatch: " + std::to_string(a.size()) + " vs " + std::to_string(b.size()));
}

// ---------- basics ----------
inline Vec add(const Vec& a, const Vec& b) { same(a, b); Vec r(a.size()); for (size_t i = 0; i < a.size(); ++i) r[i] = a[i] + b[i]; return r; }
inline Vec sub(const Vec& a, const Vec& b) { same(a, b); Vec r(a.size()); for (size_t i = 0; i < a.size(); ++i) r[i] = a[i] - b[i]; return r; }
inline Vec scale(const Vec& a, double k)   { Vec r(a.size()); for (size_t i = 0; i < a.size(); ++i) r[i] = a[i] * k; return r; }

// ---------- products & lengths ----------
inline double dot(const Vec& a, const Vec& b) { same(a, b); double s = 0; for (size_t i = 0; i < a.size(); ++i) s += a[i] * b[i]; return s; }
inline double norm(const Vec& a) { return std::sqrt(dot(a, a)); }
inline Vec normalize(const Vec& a) { double n = norm(a); return n == 0 ? Vec(a.size(), 0.0) : scale(a, 1.0 / n); }
inline double distance(const Vec& a, const Vec& b) { return norm(sub(a, b)); }

// ---------- angles & similarity ----------
inline double cosine(const Vec& a, const Vec& b) { double n = norm(a) * norm(b); return n == 0 ? 0 : dot(a, b) / n; }
inline double angle(const Vec& a, const Vec& b) { return std::acos(std::clamp(cosine(a, b), -1.0, 1.0)); }
inline Vec project(const Vec& b, const Vec& a) { double aa = dot(a, a); return aa == 0 ? Vec(a.size(), 0.0) : scale(a, dot(a, b) / aa); }

// ---------- many vectors ----------
inline Vec mean(const std::vector<Vec>& list) {
  if (list.empty()) throw std::invalid_argument("empty list");
  Vec out(list[0].size(), 0.0);
  for (const auto& v : list) { same(out, v); for (size_t i = 0; i < v.size(); ++i) out[i] += v[i]; }
  return scale(out, 1.0 / list.size());
}

using Item = std::pair<std::string, Vec>;      // (id, vector)
using Scored = std::pair<std::string, double>; // (id, score)
using Metric = std::function<double(const Vec&, const Vec&)>;

// items -> (id, score) best first (ties keep input order)
inline std::vector<Scored> topK(const Vec& q, const std::vector<Item>& items, size_t k = 3, Metric metric = cosine) {
  std::vector<Scored> s;
  for (const auto& [id, v] : items) s.push_back({id, metric(q, v)});
  std::stable_sort(s.begin(), s.end(), [](const Scored& x, const Scored& y) { return x.second > y.second; });
  if (s.size() > k) s.resize(k);
  return s;
}

// centroids in order -> (label, score) (ties: first label wins)
inline Scored classify(const Vec& x, const std::vector<Item>& centroids, Metric metric = cosine) {
  if (centroids.empty()) throw std::invalid_argument("no centroids");
  Scored best{"", -std::numeric_limits<double>::infinity()};
  for (const auto& [label, c] : centroids) { double s = metric(x, c); if (s > best.second) best = {label, s}; }
  return best;
}

// ---------- printing (same output in JS / Python / C++) ----------
inline std::string fmt(double x) { char b[64]; std::snprintf(b, sizeof b, "%.3f", x + 0.0); return b; }
inline std::string fmt(const Vec& v) {
  std::string s = "[";
  for (size_t i = 0; i < v.size(); ++i) s += (i ? ", " : "") + fmt(v[i]);
  return s + "]";
}

// ---------- toy bi-encoder ----------
// Words = runs of [a-z0-9] or any non-ASCII byte (UTF-8, so Thai works). Only A-Z is lower-cased.
inline std::vector<std::string> words(const std::string& text) {
  std::vector<std::string> out;
  std::string w;
  for (unsigned char ch : text) {
    if (ch >= 'A' && ch <= 'Z') ch = ch - 'A' + 'a';
    bool keep = ch >= 0x80 || (ch >= 'a' && ch <= 'z') || (ch >= '0' && ch <= '9');
    if (keep) w += (char)ch;
    else if (!w.empty()) { out.push_back(w); w.clear(); }
  }
  if (!w.empty()) out.push_back(w);
  return out;
}

// Unknown words are skipped. Returns a unit vector, or a zero vector if no word is known.
inline Vec encode(const std::string& text, const std::map<std::string, Vec>& table) {
  if (table.empty()) throw std::invalid_argument("empty table");
  std::vector<Vec> found;
  for (const auto& w : words(text)) { auto it = table.find(w); if (it != table.end()) found.push_back(it->second); }
  if (found.empty()) return Vec(table.begin()->second.size(), 0.0);
  return normalize(mean(found));
}

}  // namespace zv
