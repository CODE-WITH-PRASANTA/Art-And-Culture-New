const http = require("http");

function request(options, postData = null) {
  return new Promise((resolve) => {
    const headers = { ...(options.headers || {}) };
    let payload = null;

    if (postData) {
      payload = typeof postData === "object" ? JSON.stringify(postData) : String(postData);
      headers["Content-Length"] = Buffer.byteLength(payload);
      if (!headers["Content-Type"]) {
        headers["Content-Type"] = "application/json";
      }
    }

    const req = http.request({ ...options, headers }, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        let json;
        try {
          json = JSON.parse(data);
        } catch (e) {
          json = data;
        }
        resolve({ status: res.statusCode, data: json });
      });
    });

    req.on("error", (err) => {
      console.error("Seed request error:", err.message);
      resolve({ status: 500, error: err.message });
    });

    if (payload) {
      req.write(payload);
    }
    req.end();
  });
}

async function seedData() {
  console.log("Seeding initial Art and Culture shop data...");
  const res = await request({
    hostname: "localhost",
    port: 5000,
    path: "/",
    method: "GET",
  });
  console.log("Server response:", res.data);
}

if (require.main === module) {
  seedData();
}

module.exports = { seedData };
