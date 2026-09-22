/**
 * BLACKOUT PROTOCOL: Universal Node.js & Vercel Server Handler
 * Serves in-memory pre-cached static assets and delegates /api/* to the Neon DB serverless router.
 */

const http = require("http");
const fs = require("fs");
const path = require("path");
const os = require("os");
const apiHandler = require("./api/index");

// Explicit static asset map: Enables @vercel/nft to statically trace and bundle every asset
const STATIC_ASSETS = {
  "/index.html": {
    data: fs.readFileSync(path.join(__dirname, "index.html")),
    type: "text/html; charset=utf-8"
  },
  "/style.css": {
    data: fs.readFileSync(path.join(__dirname, "style.css")),
    type: "text/css; charset=utf-8"
  },
  "/blackout-app.js": {
    data: fs.readFileSync(path.join(__dirname, "blackout-app.js")),
    type: "application/javascript; charset=utf-8"
  },
  "/admin.js": {
    data: fs.readFileSync(path.join(__dirname, "admin.js")),
    type: "application/javascript; charset=utf-8"
  },
  "/cases.js": {
    data: fs.readFileSync(path.join(__dirname, "cases.js")),
    type: "application/javascript; charset=utf-8"
  },
  "/crypto.js": {
    data: fs.readFileSync(path.join(__dirname, "crypto.js")),
    type: "application/javascript; charset=utf-8"
  },
  "/qr-poster.js": {
    data: fs.readFileSync(path.join(__dirname, "qr-poster.js")),
    type: "application/javascript; charset=utf-8"
  }
};

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

  // Normalize root path
  if (pathname === "/" || pathname === "" || pathname === "\\") {
    pathname = "/index.html";
  }

  // 2. Direct in-memory lookup for pre-bundled static assets
  if (STATIC_ASSETS[pathname]) {
    const asset = STATIC_ASSETS[pathname];
    res.writeHead(200, {
      "Content-Type": asset.type,
      "Content-Length": asset.data.length,
      "Cache-Control": "public, max-age=0, must-revalidate"
    });
    return res.end(asset.data);
  }

  // 3. Fallback filesystem check for any additional assets (images, fonts, etc.)
  let safePath = path.normalize(decodeURIComponent(pathname)).replace(/^(\.\.[\/\\])+/, "").replace(/^[\\\/]+/, "");
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

    // 4. SPA HTML fallback ONLY for non-asset routes (no extension or .html)
    const ext = path.extname(pathname);
    if (!ext || ext === ".html") {
      const htmlAsset = STATIC_ASSETS["/index.html"];
      res.writeHead(200, {
        "Content-Type": "text/html; charset=utf-8",
        "Content-Length": htmlAsset.data.length
      });
      return res.end(htmlAsset.data);
    }

    // 5. Strict 404 for missing CSS/JS/images (never serve HTML for stylesheet/script requests!)
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("404 Not Found: " + pathname);
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
