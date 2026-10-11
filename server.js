// server.js — serves the ZVect lessons. Node built-ins only, no framework.
// Run: npm start   (or: node server.js)   then open http://localhost:5173
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize, sep, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT) || 5173;
const HOST = process.env.HOST || "127.0.0.1"; // this computer only; set HOST=0.0.0.0 to share on the LAN

// URL prefix -> folder. Same layout as the repo, so the same relative links work here and on GitHub Pages
// (https://zardokar.github.io/ZVect/web/). Only these folders are served; "/" and "/web" redirect to "/web/".
const MOUNTS = [
  ["/web/", join(ROOT, "web")],
  ["/lib/", join(ROOT, "lib")],
  ["/examples/", join(ROOT, "examples")],
  ["/docs/outhtm/", join(ROOT, "docs", "outhtm")], // iw reports linked from lessons ("อ่านเพิ่ม")
];
const REDIRECT = { "/": "/web/", "/web": "/web/", "/index.html": "/web/" };
const SINGLE = { "/LICENSE": join(ROOT, "LICENSE"), "/llms.txt": join(ROOT, "llms.txt") };

const TYPES = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8", ".json": "application/json; charset=utf-8",
  ".py": "text/plain; charset=utf-8", ".cpp": "text/plain; charset=utf-8", ".hpp": "text/plain; charset=utf-8",
  ".txt": "text/plain; charset=utf-8", ".md": "text/plain; charset=utf-8", ".svg": "image/svg+xml", ".png": "image/png",
};

function resolve(urlPath) {
  if (SINGLE[urlPath]) return SINGLE[urlPath];
  for (const [prefix, dir] of MOUNTS) {
    if (!urlPath.startsWith(prefix)) continue;
    const rel = urlPath.slice(prefix.length) || "index.html";
    const file = normalize(join(dir, rel));
    return file.startsWith(dir + sep) || file === dir ? file : null; // block ../ escapes
  }
  return null;
}

const server = createServer(async (req, res) => {
  try {
    const urlPath = decodeURIComponent(new URL(req.url, "http://x").pathname);
    if (REDIRECT[urlPath]) {
      res.writeHead(302, { location: REDIRECT[urlPath] });
      return res.end();
    }
    let file = resolve(urlPath);
    if (file && (await stat(file).catch(() => null))?.isDirectory()) file = join(file, "index.html");
    const body = file && (await readFile(file).catch(() => null));
    if (!body) {
      res.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
      return res.end("404 not found: " + urlPath);
    }
    const headers = { "content-type": TYPES[extname(file)] || "application/octet-stream", "cache-control": "no-cache" };
    res.writeHead(200, headers);
    res.end(body);
  } catch (e) {
    res.writeHead(400, { "content-type": "text/plain; charset=utf-8" });
    res.end("bad request");
  }
});

server.listen(PORT, HOST, () => {
  console.log(`ZVect lessons: http://localhost:${PORT}`);
  console.log("Ctrl+C to stop");
});
