import env from "dotenv";
env.config();
import mongoose from "mongoose";
import "./utils/redis";
process.on("uncaughtException", (error) => {
  console.log(error, error.message);
  console.log("Uncaught exception! shutting down...");
  process.exit(1);
});

import app from "./app";

const server = app.listen(process.env.PORT, () => {
  console.log(`app is listening on http://localhost:${process.env.PORT}`);
});

mongoose
  .connect(process.env.DB_CONNECTION, {
    useUnifiedTopology: true,
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false,
  })
  .then(() => console.log("Connected to mongoDB"));
// mongoose.set("debug", true);

process.on("unhandledRejection", (error: any) => {
  console.log(error.name, error.message);
  console.log("Unhandled rejection! shutting down...");
  server.close(() => process.exit(1));
});
