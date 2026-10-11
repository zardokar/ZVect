// Writes lib/MANIFEST.json. Run after editing anything in lib/:  npm run manifest
import { writeFileSync } from "node:fs";
import { buildManifest } from "./manifest.js";

writeFileSync(new URL("../lib/MANIFEST.json", import.meta.url), JSON.stringify(buildManifest(), null, 2) + "\n");
console.log("lib/MANIFEST.json written");
