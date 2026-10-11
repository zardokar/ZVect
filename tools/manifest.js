// manifest.js — builds the lib/MANIFEST.json object (version + sha256 of every lib file).
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const RAW = "https://raw.githubusercontent.com/zardokar/ZVect/main/lib/";
export const LIB_FILES = ["zvect.js", "zvect.py", "zvect.hpp"];

export function buildManifest() {
  const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
  return {
    name: "zvect",
    version: pkg.version,
    license: "ZVect Non-Commercial Study License (see LICENSE)",
    files: LIB_FILES.map((f) => {
      const buf = readFileSync(join(root, "lib", f));
      return { file: f, bytes: buf.length, sha256: createHash("sha256").update(buf).digest("hex"), raw: RAW + f };
    }),
  };
}

