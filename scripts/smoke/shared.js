const http = require("http");

const request = (server, path) =>
  new Promise((resolve, reject) => {
    const address = server.address();
    if (!address || typeof address !== "object") {
      reject(new Error("Server address unavailable"));
      return;
    }

    const options = {
      hostname: "127.0.0.1",
      port: address.port,
      path,
      method: "GET"
    };

    const req = http.request(options, (res) => {
      let body = "";
      res.setEncoding("utf8");
      res.on("data", (chunk) => {
        body += chunk;
      });
      res.on("end", () => {
        resolve({
          statusCode: res.statusCode || 0,
          body
        });
      });
    });

    req.on("error", reject);
    req.end();
  });

module.exports = { request };
