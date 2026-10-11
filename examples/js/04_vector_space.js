// 04 Vector space: a 3D room; data = points in it (no calculation needed)
import { vec, fmt } from "../../lib/zvect.js";

const p1 = vec(2, 3, 1);                 // one example point
const points = [p1];

// "Random point" button, 3 presses. A tiny repeatable random, so JS / Python / C++ print the same.
let seed = 7;
const rand = () => { seed = (seed * 16807) % 2147483647; return (seed % 9) - 4; };   // whole number -4..4
for (let i = 0; i < 3; i++) points.push(vec(rand(), rand(), rand()));

points.forEach((p, i) => console.log("p" + (i + 1) + " = " + fmt(p) + "   (" + p.length + " numbers)"));
console.log("points in the room: " + points.length);

points.length = 1;                       // clear the random points: p1 and the room are still there
console.log("after clearing: " + points.length + " point, p1 = " + fmt(points[0]));
