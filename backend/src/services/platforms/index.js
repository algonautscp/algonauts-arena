const {
  fetchSolvedProblems: fetchCodeforcesSolved,
} = require("./codeforces.service");

async function fetchSolvedProblems(platform, handle) {
  switch (platform) {
    case "CODEFORCES":
      return fetchCodeforcesSolved(handle);

    default:
      throw new Error(`Platform ${platform} not supported`);
  }
}

module.exports = {
  fetchSolvedProblems,
};
