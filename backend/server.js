require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const csrf = require("csurf");
const rateLimit = require("express-rate-limit");

const app = express();

const apiLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 60,
});
app.use(cors());
app.use(apiLimiter);
app.use(
  cors({
    origin: "https://localhost:5000",
  })
);
app.use(helmet());
app.use(cookieParser());
app.use(express.json());
app.use(csrf({ cookie: true }));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const port = 3000;
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
