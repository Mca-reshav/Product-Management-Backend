const express = require("express");
const dotenv = require("dotenv");
const fs = require("fs");
const cors = require("cors");
const bodyParser = require("body-parser");

const envFile = `.env.${process.env.NODE_ENV || "development" || "test"}`;
if (fs.existsSync(envFile)) {
  dotenv.config({ path: envFile });
} else {
  console.error(`Environment file ${envFile} not found!`);
  process.exit(1);
}

require("./database/mongo.conn");
const { success, error } = require("./services/response.service");
const { logData } = require("./services/logger.service");
const routes = require("./routes/index.routes");

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

app.use((req, res, next) => {
  logData(req, res);
  next();
});

app.use("/web", routes);

process.on("uncaughtException", async (err) => {
  error(`Uncaught Exception: ${err.message}`);
  process.exit(1);
});

process.on("unhandledRejection", async (reason) => {
  const errorMessage =
    reason instanceof Error ? reason.stack || reason.message : reason;
  error(`Unhandled Rejection: ${errorMessage}`);
  process.exit(1);
});

app.listen(6001, async () => {
  success(true, `[SERVER] ${process.env.NODE_ENV} :: PORT: ${6001}`);
});

module.exports = app;
