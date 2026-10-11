// Runs every lesson example (examples/) and every edge-case probe (tests/parity/)
// in JS, Python and C++, and checks the outputs are identical.
// Run: npm run check      (Python / g++ are optional; missing ones are skipped)
import { execFileSync } from "node:child_process";
import { readdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const SUITES = [join(root, "examples"), join(root, "tests", "parity")];

const run = (cmd, args) => execFileSync(cmd, args, { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).replace(/\r\n/g, "\n");
const tryRun = (cmd, args) => { try { return run(cmd, args); } catch (e) { return "ERROR: " + (e.stderr || e.message).toString().trim().split("\n")[0]; } };
const find = (names) => names.find((n) => { try { run(n, ["--version"]); return true; } catch { return false; } });

const py = find(["python3", "python", "py"]);
const cxx = find(["g++", "clang++"]);
console.log(`node ${process.version} | python: ${py ?? "SKIP (not found)"} | c++: ${cxx ?? "SKIP (not found)"}\n`);

let bad = 0;
for (const suite of SUITES) {
  for (const f of readdirSync(join(suite, "js")).filter((f) => f.endsWith(".js")).sort()) {
    const name = f.replace(/\.js$/, "");
    const want = tryRun(process.execPath, [join(suite, "js", f)]);
    const got = {};
    if (py) got.python = tryRun(py, [join(suite, "py", name + ".py")]);
    if (cxx) {
      const exe = join(tmpdir(), "zvect_" + name + (process.platform === "win32" ? ".exe" : ""));
      const built = tryRun(cxx, ["-std=c++17", join(suite, "cpp", name + ".cpp"), "-o", exe]);
      got["c++"] = built.startsWith("ERROR") ? "compile " + built : tryRun(exe, []);
    }
    const diffs = Object.entries(got).filter(([, out]) => out !== want).map(([k]) => k);
    const broken = want.startsWith("ERROR") ? "  (js failed: " + want + ")" : "";
    console.log((diffs.length || broken ? "DIFF " : "OK   ") + name + (diffs.length ? "  (" + diffs.join(", ") + " differ from js)" : "") + broken);
    for (const k of diffs) if (got[k].startsWith("ERROR") || got[k].startsWith("compile")) console.log("       " + k + ": " + got[k]);
    bad += diffs.length + (broken ? 1 : 0);
  }
}
console.log(bad ? `\nFAIL: ${bad} mismatch(es)` : "\nPASS: all languages print the same output");
process.exit(bad ? 1 : 0);
