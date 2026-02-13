const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENAI_KEY,
});

async function generateAIReview(score, repoCount, username) {
  const prompt = `
Act like a senior software recruiter at Google.

You are reviewing GitHub profile of user "${username}".

GitHub Score: ${score}/100
Public repositories: ${repoCount}

Write an honest recruiter review:
- What impresses you
- What looks weak
- What must be improved to get hired
- Be direct and professional
- Max 120 words
`;

  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
  });

  return response.choices[0].message.content;
}

module.exports = { generateAIReview };
