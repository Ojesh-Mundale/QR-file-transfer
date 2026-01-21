const express = require("express");
const multer = require("multer");
const cors = require("cors");
const os = require("os");

const app = express();
app.use(cors({
  exposedHeaders: ['Content-Disposition', 'X-File-Name']
}));

// Multer in-memory storage (TEMP ONLY)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// TEMP session store (RAM)
const sessions = {};

/**
 * MOBILE → UPLOAD FILE
 */
app.post("/upload/:session", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded");
  }

  if (!sessions[req.params.session]) {
    sessions[req.params.session] = [];
  }
  sessions[req.params.session].push(req.file);

  res.json({ success: true });
});

/**
 * PC → FETCH FILE
 */
app.get("/file/:session", (req, res) => {
  const files = sessions[req.params.session];

  if (!files || files.length === 0) {
    return res.sendStatus(404);
  }

  const file = files.shift(); // Get and remove the first file

  res.setHeader("Content-Type", file.mimetype);
  res.setHeader(
    "Content-Disposition",
    `inline; filename="${file.originalname}"`
  );
  res.setHeader("X-File-Name", file.originalname);

  res.send(file.buffer);

  // If no more files, delete the session
  if (files.length === 0) {
    delete sessions[req.params.session];
  }
});

/**
 * GET PC IP
 */
app.get("/ip", (req, res) => {
  const interfaces = os.networkInterfaces();
  let ip = "localhost";

  for (const iface of Object.values(interfaces)) {
    for (const config of iface) {
      if (config.family === "IPv4" && !config.internal) {
        ip = config.address;
        break;
      }
    }
    if (ip !== "localhost") break;
  }

  res.json({ ip });
});

/**
 * NETWORK-ENABLED LISTEN
 */
app.listen(5000, "0.0.0.0", () => {
  console.log("✅ Backend running on http://0.0.0.0:5000");
});
