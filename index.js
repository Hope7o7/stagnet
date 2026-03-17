const express = require("express");
const https   = require("https");
const app     = express();
app.use(express.json());

const FIREBASE_URL = "stag-net-d07a5-default-rtdb.firebaseio.com";
const FIREBASE_AUTH = "P0jxa57CpMO4mSWesLY5CgsitP8oGht55GoA0hle";

app.put("/data", (req, res) => {
  const body = JSON.stringify(req.body);
  const options = {
    hostname: FIREBASE_URL,
    path: `/stag-net/data.json?auth=${FIREBASE_AUTH}`,
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(body)
    }
  };
  const fbReq = https.request(options, fbRes => {
    let data = "";
    fbRes.on("data", chunk => data += chunk);
    fbRes.on("end", () => {
      console.log("Firebase:", data);
      res.send("OK");
    });
  });
  fbReq.on("error", e => {
    console.error(e);
    res.status(500).send("Error");
  });
  fbReq.write(body);
  fbReq.end();
});
const http = require("http");
setInterval(() => {
  http.get("http://stagnet.onrender.com/ping", (res) => {
    console.log("Keep-alive ping:", res.statusCode);
  }).on("error", (e) => {
    console.error("Ping error:", e.message);
  });
}, 14 * 60 * 1000); // every 14 minutes

app.get("/ping", (req, res) => res.send("pong"));

app.listen(3000, () => console.log("Relay running"));
