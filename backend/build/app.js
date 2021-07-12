"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
// import csrf from "csurf";
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const express_1 = __importDefault(require("express"));
const express_mongo_sanitize_1 = __importDefault(require("express-mongo-sanitize"));
const xss_clean_1 = __importDefault(require("xss-clean"));
const hpp_1 = __importDefault(require("hpp"));
const appError_js_1 = __importDefault(require("./utils/appError.js"));
const errorController_js_1 = __importDefault(require("./controller/errorController.js"));
const indexRoutes_js_1 = __importDefault(require("./routes/indexRoutes.js"));
const app = express_1.default();
const apiLimiter = express_rate_limit_1.default({
    windowMs: 1 * 60 * 1000,
    max: 60,
});
app.use(cors_1.default({ credentials: true }));
app.use(apiLimiter);
app.use(helmet_1.default());
app.use(cookie_parser_1.default());
// app.use(csrf({ cookie: true }));
app.use(express_1.default.urlencoded({ extended: false }));
app.use(express_1.default.json());
app.use(hpp_1.default());
app.use(express_mongo_sanitize_1.default());
app.use(xss_clean_1.default());
app.use("/public", express_1.default.static("./public"));
app.get("/", (req, res) => {
    res.send("Hello World");
});
app.use("/api/v1", indexRoutes_js_1.default);
app.all("*", (req, res, next) => {
    next(new appError_js_1.default(`Can't find ${req.originalUrl} on this server`, 404));
});
app.use(errorController_js_1.default);
exports.default = app;
