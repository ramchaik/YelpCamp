import flash from "connect-flash";
import dotenv from "dotenv";
import ejsMate from "ejs-mate";
import express, { Express, Request, Response } from "express";
import session from "express-session";
import methodOverride from "method-override";
import passport from "passport";
import LocalStrategy from "passport-local";
import path from "path";
import { connectToDatabase } from "./db/utils";
import { errorHandler } from "./middlewares/errorHandler";
import { handleNotFound } from "./middlewares/handleNotFound";
import { setupResLocals } from "./middlewares/setupResLocals";
import { User } from "./models/user";
import { campgroundRouter } from "./routes/campgrounds";
import { reviewRouter } from "./routes/reviews";
import { userRouter } from "./routes/users";
import { catchAsync } from "./utils/catchAsync";
import { getSessionConfig } from "./utils/sessionConfig";

// runSeed();
dotenv.config();

connectToDatabase();

const app: Express = express();
const PORT = process.env.SERVER_PORT || 3000;

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// to parse the body
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "../public")));

const sessionConfig = getSessionConfig();
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

// @ts-ignore
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(setupResLocals);

app.use("/", userRouter);
app.use("/campgrounds", campgroundRouter);
app.use("/campgrounds/:id/reviews", reviewRouter);

app.get(
  "/",
  catchAsync(async (_: Request, res: Response) => {
    res.render("home");
  })
);

app.all("*", handleNotFound);

// custom error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log("listening on port " + PORT);
});
