require("dotenv").config();

const app = require("./server/app");

const port = Number(process.env.PORT || 8000);
const server = app.listen(port, () => {
  console.log(`Mesa RPG disponível em http://localhost:${port}`);
});

function shutdown() {
  server.close(() => process.exit(0));
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
