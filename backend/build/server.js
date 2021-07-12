"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const mongoose_1 = __importDefault(require("mongoose"));
require("./utils/redis.js");
process.on("uncaughtException", (error) => {
    console.log(error, error.message);
    console.log("Uncaught exception! shutting down...");
    process.exit(1);
});
const app_js_1 = __importDefault(require("./app.js"));
const server = app_js_1.default.listen(process.env.PORT, () => {
    console.log(`app is listening on http://localhost:${process.env.PORT}`);
});
mongoose_1.default
    .connect(process.env.DB_CONNECTION, {
    useUnifiedTopology: true,
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false,
})
    .then(() => console.log("Connected to mongoDB"));
// mongoose.set("debug", true);
process.on("unhandledRejection", (error) => {
    console.log(error.name, error.message);
    console.log("Unhandled rejection! shutting down...");
    server.close(() => process.exit(1));
});
