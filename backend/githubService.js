const axios = require("axios");

const headers = {
  Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
};

async function getGithubData(username) {
  try {
    const userRes = await axios.get(
      `https://api.github.com/users/${username}`,
      { headers }
    );

    const repoRes = await axios.get(
      `https://api.github.com/users/${username}/repos?per_page=100`,
      { headers }
    );

    const repos = repoRes.data;

    // fetch readme for each repo
    for (let repo of repos) {
      try {
        const readme = await axios.get(
          `https://api.github.com/repos/${username}/${repo.name}/readme`,
          { headers }
        );

        repo.readme = Buffer.from(readme.data.content, "base64").toString();
      } catch {
        repo.readme = "";
      }
    }

    return {
      profile: userRes.data,
      repos,
    };
  } catch (err) {
    console.log("GitHub fetch error:", err.message);
    return null;
  }
}

module.exports = { getGithubData };
