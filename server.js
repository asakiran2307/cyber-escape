/**
 * BLACKOUT PROTOCOL: Universal Node.js & Vercel Server Handler
 * Serves static assets and delegates /api/* to the Neon DB serverless router.
 */

const http = require("http");
const fs = require("fs");
const path = require("path");
const os = require("os");
const apiHandler = require("./api/index");

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8",
  ".md": "text/markdown; charset=utf-8"
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

async function requestHandler(req, res) {
  const rawPath = req.url || req.headers["x-forwarded-uri"] || req.headers["x-matched-path"] || "/";
  const url = new URL(rawPath, `http://${req.headers.host || "localhost"}`);
  let pathname = url.pathname;

  // 1. API routes delegation
  if (pathname.startsWith("/api/") || pathname === "/api") {
    return apiHandler(req, res);
  }

  // 2. Static file resolution
  let safePath = path.normalize(decodeURIComponent(pathname)).replace(/^(\.\.[\/\\])+/, "");
  if (safePath === "/" || safePath === "\\" || safePath === "") {
    safePath = "/index.html";
  }

  const filePath = path.join(__dirname, safePath);

  try {
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      const ext = path.extname(filePath).toLowerCase();
      const contentType = MIME_TYPES[ext] || "application/octet-stream";

      res.writeHead(200, {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=0, must-revalidate"
      });

      return fs.createReadStream(filePath).pipe(res);
    }

    // Fallback: If not found, serve index.html for SPA/root navigation
    const indexPath = path.join(__dirname, "index.html");
    if (fs.existsSync(indexPath)) {
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      return fs.createReadStream(indexPath).pipe(res);
    }

    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("404 Not Found");
  } catch (err) {
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.end("Internal Server Error: " + err.message);
  }
}

// Standalone execution for local development
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  const server = http.createServer(requestHandler);
  server.listen(PORT, () => {
    const localIp = getLocalIp();
    console.log("==================================================================");
    console.log("  CAMPUS CYBER ESCAPE: BLACKOUT PROTOCOL");
    console.log("  Neon PostgreSQL & Vercel Serverless Ready");
    console.log("==================================================================");
    console.log(`  Local Access:      http://localhost:${PORT}`);
    console.log(`  LAN Phone Access:  http://${localIp}:${PORT}`);
    console.log(`  API State Check:   http://localhost:${PORT}/api/state`);
    console.log("==================================================================");
  });
}

// Export for Vercel Serverless runtime
module.exports = requestHandler;
