function calculateScore(data) {
  const repos = data.repos;

  let documentationScore = 0;
  let consistencyScore = 0;
  let impactScore = 0;
  let structureScore = 0;
  let depthScore = 0;

  let suggestions = [];
  let gapSuggestions = [];

  /* ===== WORLD CLASS BENCHMARK ===== */
  const world = {
    documentation: 18,
    consistency: 15,
    impact: 18,
    structure: 15,
    depth: 15,
  };

  /* ===== README QUALITY ===== */
  let goodReadme = repos.filter(r => r.readme && r.readme.length > 300);
  documentationScore = Math.min(20, goodReadme.length * 3);

  if (goodReadme.length < 3)
    suggestions.push(
      "Most repositories lack professional README documentation with setup steps and architecture."
    );

  /* ===== CONSISTENCY ===== */
  let recentRepos = repos.filter(r => {
    const pushed = new Date(r.pushed_at);
    const now = new Date();
    const diff = (now - pushed) / (1000 * 60 * 60 * 24);
    return diff < 30;
  });

  consistencyScore = Math.min(15, recentRepos.length * 2);

  if (recentRepos.length < 2)
    suggestions.push(
      "Your GitHub activity is inconsistent. Recruiters prefer weekly commits."
    );

  /* ===== IMPACT ===== */
  let totalStars = repos.reduce((acc, r) => acc + r.stargazers_count, 0);
  impactScore = Math.min(20, totalStars);

  if (totalStars < 5)
    suggestions.push(
      "Your projects lack real-world impact. Build deployable projects with users."
    );

  /* ===== STRUCTURE ===== */
  let structured = repos.filter(
    r =>
      r.readme &&
      (r.readme.toLowerCase().includes("install") ||
        r.readme.toLowerCase().includes("usage"))
  );

  structureScore = Math.min(15, structured.length * 2);

  if (structured.length < 3)
    suggestions.push(
      "Repositories are not structured professionally. Add setup and usage sections."
    );

  /* ===== DEPTH ===== */
  let languages = {};
  repos.forEach(r => {
    if (r.language) languages[r.language] = 1;
  });

  depthScore = Math.min(15, Object.keys(languages).length * 3);

  if (Object.keys(languages).length <= 2)
    suggestions.push(
      "Your GitHub shows limited technical depth. Add backend, database or AI projects."
    );

  /* ===== GAP ANALYSIS ===== */
  if (documentationScore < world.documentation)
    gapSuggestions.push(
      "World-class developers maintain detailed README with architecture diagrams and screenshots."
    );

  if (consistencyScore < world.consistency)
    gapSuggestions.push(
      "Top developers show consistent weekly contributions and active repos."
    );

  if (impactScore < world.impact)
    gapSuggestions.push(
      "World-class profiles have starred or widely used projects with real users."
    );

  if (depthScore < world.depth)
    gapSuggestions.push(
      "Top GitHub profiles show full-stack depth including backend and scalable systems."
    );

  if (structureScore < world.structure)
    gapSuggestions.push(
      "Top repositories follow clean architecture and modular structure."
    );

  const totalScore =
    documentationScore +
    consistencyScore +
    impactScore +
    structureScore +
    depthScore +
    20;

  const comparison = {
    documentation: { user: documentationScore, world: world.documentation },
    consistency: { user: consistencyScore, world: world.consistency },
    impact: { user: impactScore, world: world.impact },
    structure: { user: structureScore, world: world.structure },
    depth: { user: depthScore, world: world.depth },
  };

  if (suggestions.length === 0) {
  suggestions.push(
    "Your GitHub profile is strong. Focus on building one standout flagship project."
  );
  suggestions.push(
    "Maintain consistent commits and keep improving project documentation."
  );
}


  return {
    totalScore: Math.min(100, Math.floor(totalScore)),
    documentationScore,
    consistencyScore,
    impactScore,
    structureScore,
    depthScore,
    suggestions,
    gapSuggestions,
    comparison,
    repoCount: repos.length,
  };
}

module.exports = { calculateScore };
