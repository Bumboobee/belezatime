const hpp = require("hpp");
const cors = require("cors");
const morgan = require("morgan");
const express = require("express");
const AppError = require("./utils/appError");
const cookiePaser = require("cookie-parser");

const helmet = require("helmet");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");

const userRouter = require("./routes/userRoutes");
const serviceRouter = require("./routes/serviceRoutes");
const appointmentRouter = require("./routes/appointmentRoutes");
const globalErrorHandler = require("./controllers/errorController");

const app = express();
const currentVersion = 1;

app.use(cors());
app.options("*", cors());

app.use(
  helmet.contentSecurityPolicy({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

const limiter = rateLimit({
  max: 2000,
  windowMs: 60 * 60 * 80000,
  message: "Too many requests from this IP, please try again in an hour!",
});

app.use("/api", limiter);
app.use(express.json({ limit: "9000kb" }));
app.use(express.urlencoded({ extended: true, limit: "9000kb" }));
app.use(cookiePaser());
app.use(mongoSanitize());
app.use(xss());

app.use(
  hpp({
    whitelist: ["duration", "price"],
  })
);

app.get("/", (req, res) => {
  res.status(200).json({
    status: "online",
    message: `Bem vindo(a) à API do ${process.env.APP_NAME}!`,
    environment: process.env.NODE_ENV || "development",
    currentVersion,
    timestamp: new Date(),
    uptime: process.uptime(),
  });
});

app.use(`/api/v${currentVersion}/users`, userRouter);
app.use(`/api/v${currentVersion}/services`, serviceRouter);
app.use(`/api/v${currentVersion}/appointments`, appointmentRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
