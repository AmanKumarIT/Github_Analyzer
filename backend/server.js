const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { getGithubData } = require("./githubService");
const { calculateScore } = require("./scorer");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("GitHub Analyzer API running...");
});

/* ================= ANALYZE ================= */
app.post("/analyze", async (req, res) => {
  try {
    const { profileUrl } = req.body;

    if (!profileUrl)
      return res.status(400).json({ error: "GitHub link required" });

    if (!profileUrl.includes("github.com"))
      return res.status(400).json({ error: "Invalid GitHub link" });

    const parts = profileUrl.split("github.com/");
    let username = parts[1];

    if (!username)
      return res.status(400).json({ error: "Invalid GitHub profile" });

    username = username.replace("/", "").trim();

    console.log("Analyzing:", username);

    const githubData = await getGithubData(username);

    if (!githubData)
      return res.status(404).json({ error: "GitHub user not found" });

    const scoreData = calculateScore(githubData);

    res.json({
      success: true,
      username,
      ...scoreData,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ error: "Server error" });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log("Server running on port", PORT));
