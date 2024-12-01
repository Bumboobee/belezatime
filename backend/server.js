const dotenv = require("dotenv");
const mongoose = require("mongoose");
dotenv.config({ path: "./config.env" });

process.on("uncaughException", (err) => {
  console.log(err.name, err.message);

  process.exit(1);
});

const app = require("./app");

mongoose
  .connect(
    process.env.NODE_ENV === "development"
      ? process.env.MONGODB_CONNECTION_STRING_DEV
      : process.env.MONGODB_CONNECTION_STRING_PROD,
    {
      dbName: process.env.MONGODB_NAME,
    }
  )
  .then(() => console.log("Connected to MongoDB"));

const server = app.listen(process.env.SERVER_PORT || 3000, () => {
  console.log(`Server is runing in port ${process.env.SERVER_PORT}`);
});

process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);

  server.close(() => {
    process.exit(1);
  });
});
