// 18 Search by distance: score every item with Euclidean distance, keep the 3 smallest (lower = closer)
// axes: x = food, y = animal, z = vehicle
import { topK, distance, fmt } from "../../lib/zvect.js";

const items = [
  { id: "apple", v: [0.9, 0.1, 0.0] },
  { id: "banana", v: [0.95, 0.05, 0.0] },
  { id: "cat", v: [0.05, 0.9, 0.1] },
  { id: "horse", v: [0.1, 0.8, 0.5] },
  { id: "car", v: [0.0, 0.05, 0.95] },
];
const query = [0.7, 0.3, 0.0];

console.log("top 3 by distance (lower = closer):");
const negDist = (a, b) => -distance(a, b);              // topK keeps the highest, so rank by -distance
for (const r of topK(query, items, 3, negDist)) console.log("  " + r.id + " " + fmt(-r.score));
