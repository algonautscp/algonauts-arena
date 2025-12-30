require("dotenv").config();
const app = require("./app");

console.log("Node runtime:", process.version);

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


