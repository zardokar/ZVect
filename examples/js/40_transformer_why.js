// 40 Why the Transformer: in an RNN, information from an earlier token reaches a later one only through the hidden state,
// one step per token in between; attention connects the two directly (1 step). Toy "kept" = keep^steps (author's illustration).
// Sentences from Stanford CME295 Lecture 1 (~51:44); the inserted sentence is made up by the author.
import { fmt } from "../../lib/zvect.js";

const near = ["My", "teddy bear", "is", "so", "cute", ".", "It", "is", "3", "feet", "tall"];
const far = ["My", "teddy bear", "is", "so", "cute", ".", "We", "went", "to", "the", "park", "and", "played", "all", "day", ".",
  "It", "is", "3", "feet", "tall"];
const keep = 0.6;

for (const [name, tokens] of [["near", near], ["far", far]]) {
  const hops = Math.abs(tokens.indexOf("It") - tokens.indexOf("teddy bear"));
  console.log(name + ": " + tokens.length + " tokens");
  console.log("  RNN: It <- teddy bear takes " + hops + " steps, kept " + fmt(Math.pow(keep, hops)) +
    ", reading needs " + tokens.length + " steps in a row");
  console.log("  attention: 1 step, kept " + fmt(1) + ", one layer reads all " + tokens.length + " tokens at once");
}
