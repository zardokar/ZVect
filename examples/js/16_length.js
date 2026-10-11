// 16 Length (norm): |v| = sqrt(x² + y² + z²)
import { vec, norm, fmt } from "../../lib/zvect.js";

const v = vec(3, 4, 0);
const byHand = Math.sqrt(3 * 3 + 4 * 4 + 0 * 0);
console.log("|v|    = " + fmt(byHand) + " (by hand)");
console.log("norm() = " + fmt(norm(v)) + " (lib)");
console.log("|(1, 2, 2)| = " + fmt(norm(vec(1, 2, 2))));
console.log("|(-3, 4, 0)| = " + fmt(norm(vec(-3, 4, 0))) + " (sign does not change the length)");
