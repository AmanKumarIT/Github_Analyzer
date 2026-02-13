const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { getGithubData } = require("./githubService");
const { calculateScore } = require("./scorer");
const { getAIAnalysis } = require("./aiEvaluator");

const app = express();

/* ===== MIDDLEWARE ===== */
app.use(cors());
app.use(express.json());

/* ===== HEALTH CHECK ===== */
app.get("/", (req, res) => {
  res.send("GitHub Portfolio Analyzer AI API running...");
});

/* ===== ANALYZE ROUTE ===== */
app.post("/analyze", async (req, res) => {
  try {
    const { profileUrl } = req.body;

    if (!profileUrl)
      return res.status(400).json({ error: "GitHub profile link required" });

    if (!profileUrl.includes("github.com"))
      return res.status(400).json({ error: "Invalid GitHub profile link" });

    /* ===== EXTRACT USERNAME ===== */
    const parts = profileUrl.split("github.com/");
    let username = parts[1];

    if (!username)
      return res.status(400).json({ error: "Invalid GitHub profile" });

    username = username.replace("/", "").trim();

    console.log("Analyzing GitHub:", username);

    /* ===== FETCH GITHUB DATA ===== */
    const githubData = await getGithubData(username);

    if (!githubData)
      return res.status(404).json({ error: "GitHub user not found" });

    /* ===== CALCULATE SCORE ===== */
    const scoreData = calculateScore(githubData);

    /* ===== PREPARE AI PROFILE SUMMARY ===== */
    const aiProfile = {
      username,
      repoCount: scoreData.repoCount,
      totalScore: scoreData.totalScore,
      documentationScore: scoreData.documentationScore,
      consistencyScore: scoreData.consistencyScore,
      impactScore: scoreData.impactScore,
      structureScore: scoreData.structureScore,
      depthScore: scoreData.depthScore,
      languages: githubData.repos
        .map(r => r.language)
        .filter(Boolean)
        .join(", "),
    };

    /* ===== AI ANALYSIS (SAFE FALLBACK) ===== */
    let aiReview = "";
    try {
      aiReview = await getAIAnalysis(aiProfile);
    } catch (err) {
      console.log("AI analysis failed:", err.message);
      aiReview =
        "AI recruiter review currently unavailable. Check API key or internet.";
    }

    /* ===== FINAL RESPONSE ===== */
    res.json({
      success: true,
      username,
      ...scoreData,
      aiReview,
    });
  } catch (err) {
    console.log("Server error:", err.message);
    res.status(500).json({
      error: "Server failed to analyze GitHub profile",
    });
  }
});

/* ===== START SERVER ===== */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
