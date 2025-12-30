const axios = require("axios");

const CODEFORCES_API =
  "https://codeforces.com/api/user.status?handle=";

// Rating → difficulty mapping (simple & good enough)
function mapRatingToDifficulty(rating) {
  if (!rating) return null;
  if (rating <= 1200) return "EASY";
  if (rating <= 1800) return "MEDIUM";
  return "HARD";
}

async function fetchSolvedProblems(handle) {
  const url = `${CODEFORCES_API}${handle}&status=OK`;

  const response = await axios.get(url);

  if (response.data.status !== "OK") {
    throw new Error("Failed to fetch Codeforces data");
  }

  const submissions = response.data.result;

  // Use Map to avoid duplicate problems
  const solvedMap = new Map();

  for (const sub of submissions) {
    if (sub.verdict !== "OK") continue;

    const problem = sub.problem;
    const contestId = sub.contestId;
    const index = problem.index;

    const problemUrl = `https://codeforces.com/problemset/problem/${contestId}/${index}`;

    if (!solvedMap.has(problemUrl)) {
      solvedMap.set(problemUrl, {
        platform: "CODEFORCES",
        problemUrl,
        difficulty: mapRatingToDifficulty(problem.rating),
        solvedAt: new Date(sub.creationTimeSeconds * 1000),
      });
    }
  }

  return Array.from(solvedMap.values());
}

module.exports = {
  fetchSolvedProblems,
};
