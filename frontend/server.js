const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 5173;
const ROOT = path.join(__dirname, "src");

const mime = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "application/javascript",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon"
};

const server = http.createServer((req, res) => {
  const requestPath = req.url.split("?")[0];
  let urlPath = requestPath === "/" ? "/pages/Home/index.html" : requestPath;
  if (urlPath === "/sign-in") {
    urlPath = "/pages/Auth/sign-in.html";
  }
  if (urlPath === "/profile") {
    urlPath = "/pages/User/profile.html";
  }
  if (urlPath === "/mechanic/home" || urlPath === "/mechanic/home/") {
    urlPath = "/pages/Mechanic/home.html";
  }
  const filePath = path.join(ROOT, urlPath);

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("Not found");
      return;
    }

    const ext = path.extname(filePath);
    res.writeHead(200, { "Content-Type": mime[ext] || "text/plain" });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`Frontend running at http://localhost:${PORT}`);
});
