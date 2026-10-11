// 01 Vector: a list of numbers = an arrow from the origin (0,0,0)
import { vec, fmt } from "../../lib/zvect.js";

const v = vec(3, 4, 0);                        // x=3, y=4, z=0
console.log("v = " + fmt(v));
console.log("walk: x " + v[0] + ", then y " + v[1] + ", then z " + v[2]);
console.log("dimensions = " + v.length);
