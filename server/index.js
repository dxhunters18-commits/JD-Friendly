const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "JD Friendly server is running!",
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "JD Friendly API is healthy!",
  });
});

app.listen(PORT, () => {
  console.log(`JD Friendly server running on http://localhost:${PORT}`);
});