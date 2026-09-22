/**
 * BLACKOUT PROTOCOL: Local Node.js Development Server
 * Serves static files and delegates /api/* to the Vercel serverless handler.
 */

const http = require("http");
const fs = require("fs");
const path = require("path");
const os = require("os");
const apiHandler = require("./api/index");

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = __dirname;

const MIME_TYPES = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "application/javascript",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".txt": "text/plain",
  ".md": "text/markdown"
};

function getLocalIp() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === "IPv4" && !iface.internal) {
        return iface.address;
      }
    }
  }
  return "localhost";
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);

  // Route API requests directly to serverless handler
  if (url.pathname.startsWith("/api/")) {
    return apiHandler(req, res);
  }

  // Static files
  let safePath = path.normalize(decodeURIComponent(url.pathname)).replace(/^(\.\.[\/\\])+/, "");
  if (safePath === "/" || safePath === "\\") safePath = "/index.html";

  const filePath = path.join(PUBLIC_DIR, safePath);

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("404 Not Found");
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || "application/octet-stream";

    res.writeHead(200, {
      "Content-Type": contentType,
      "Cache-Control": "no-cache"
    });

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  });
});

server.listen(PORT, () => {
  const localIp = getLocalIp();
  console.log("==================================================================");
  console.log("  CAMPUS CYBER ESCAPE: BLACKOUT PROTOCOL");
  console.log("  Neon PostgreSQL & Vercel Serverless Ready");
  console.log("==================================================================");
  console.log(`  Local Access:      http://localhost:${PORT}`);
  console.log(`  LAN Phone Access:  http://${localIp}:${PORT}`);
  console.log(`  API Status:        http://localhost:${PORT}/api/state`);
  console.log("==================================================================");
});
