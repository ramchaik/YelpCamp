import {
  connectSrcUrls,
  fontSrcUrls,
  scriptSrcUrls,
  styleSrcUrls,
  __PROD__,
} from "./constants";

if (!__PROD__) {
  require("dotenv-safe").config();
}

import flash from "connect-flash";
import ejsMate from "ejs-mate";
import express, { Express, Request, Response } from "express";
import mongoSanitize from "express-mongo-sanitize";
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
import helmet from "helmet";

const { dbURI } = connectToDatabase();

const app: Express = express();
const PORT = process.env.SERVER_PORT || 3000;

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// to parse the body
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "../public")));
app.use(mongoSanitize());
app.use(helmet());

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: [],
      connectSrc: ["'self'", ...connectSrcUrls],
      scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
      styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
      workerSrc: ["'self'", "blob:"],
      childSrc: ["blob:"],
      objectSrc: [],
      imgSrc: [
        "'self'",
        "blob:",
        "data:",
        `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/`,
        "https://images.unsplash.com",
      ],
      fontSrc: ["'self'", ...fontSrcUrls],
    },
  })
);

const sessionConfig = getSessionConfig(dbURI);
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
