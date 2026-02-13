function getAIAnalysis(profile) {
  const {
    username,
    repoCount,
    totalScore,
    documentationScore,
    consistencyScore,
    impactScore,
    structureScore,
    depthScore,
    languages,
  } = profile;

  let decision = "";
  let weaknesses = [];
  let improvements = [];
  let nextProject = "";

  /* ===== DECISION ===== */
  if (totalScore >= 85) decision = "Strong YES — Recruiter will shortlist";
  else if (totalScore >= 70) decision = "Maybe — Good for internship shortlist";
  else if (totalScore >= 50) decision = "Low — Needs stronger projects";
  else decision = "NO — Not recruiter ready";

  /* ===== WEAKNESSES ===== */
  if (documentationScore < 12)
    weaknesses.push("Poor README and documentation");

  if (consistencyScore < 10)
    weaknesses.push("Low commit consistency");

  if (impactScore < 8)
    weaknesses.push("Projects lack real-world impact");

  if (depthScore < 10)
    weaknesses.push("Limited technical depth");

  if (repoCount < 5)
    weaknesses.push("Too few strong repositories");

  if (weaknesses.length === 0)
    weaknesses.push("No major weaknesses detected");

  /* ===== IMPROVEMENTS ===== */
  if (documentationScore < 15)
    improvements.push(
      "Add detailed README with architecture, screenshots, and setup guide"
    );

  if (consistencyScore < 12)
    improvements.push("Maintain weekly consistent commits");

  if (impactScore < 12)
    improvements.push("Build real-world deployable projects with users");

  if (depthScore < 12)
    improvements.push("Add backend, database and scalable projects");

  /* ===== NEXT PROJECT ===== */
  if (totalScore < 60) {
    nextProject =
      "Build a full-stack production-ready project with authentication and deployment.";
  } else if (totalScore < 80) {
    nextProject =
      "Create a flagship AI or SaaS project that solves a real-world problem.";
  } else {
    nextProject =
      "Build a large-scale system design or AI product that can gain real users.";
  }

  return {
    decision,
    weaknesses,
    improvements,
    nextProject,
    score: totalScore,
    languages,
  };
}

module.exports = { getAIAnalysis };
