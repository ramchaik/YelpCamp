import dotenv from "dotenv";
import ejsMate from "ejs-mate";
import express, { Express, NextFunction, Request, Response } from "express";
import session from "express-session";
import methodOverride from "method-override";
import mongoose from "mongoose";
import path from "path";
import { errorHandler } from "./middlewares/errorHandler";
import { campgroundRouter } from "./routes/campgrounds";
import { reviewRouter } from "./routes/reviews";
import { catchAsync } from "./utils/catchAsync";
import { ExpressError } from "./utils/ExpressError";
import { getSessionConfig } from "./utils/sessionConfig";

// runSeed();
dotenv.config();

mongoose.connect("mongodb://localhost:27017/yelp-camp", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", (err: any) => console.error.bind(console, "connection error: "));
db.once("open", () => {
  console.log("Database connected");
});

const app: Express = express();

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// to parse the body
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "../public")));

const sessionConfig = getSessionConfig();
app.use(session(sessionConfig));

const PORT = process.env.SERVER_PORT || 3000;

app.use("/campgrounds", campgroundRouter);
app.use("/campgrounds/:id/reviews", reviewRouter);

app.get(
  "/",
  catchAsync(async (req: Request, res: Response) => {
    res.render("home");
  })
);

app.all("*", (req: Request, res: Response, next: NextFunction) => {
  next(new ExpressError("Page Not Found ", 404));
});

// custom error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log("listening on port " + PORT);
});
