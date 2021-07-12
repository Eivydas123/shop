import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
// import csurf from "csurf";
import rateLimit from "express-rate-limit";
import express, { Request, Response, NextFunction, Application } from "express";
import mongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";
import hpp from "hpp";
import AppError from "./utils/appError";
import globalErrorHandler from "./controller/errorController";
import indexRoutes from "./routes/indexRoutes";

const app: Application = express();

const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 60,
});
app.use(cors({ credentials: true }));
app.use(apiLimiter);
app.use(helmet());

app.use(cookieParser());
// app.use(csurf({ cookie: true }));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(hpp());
app.use(mongoSanitize());
app.use(xss());
app.use("/public", express.static("./public"));

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World");
});
app.use("/api/v1", indexRoutes);

app.all("*", (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

export default app;
