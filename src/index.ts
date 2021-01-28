import dotenv from "dotenv";
import ejsMate from "ejs-mate";
import express, { Express, Request, Response } from "express";
import methodOverride from "method-override";
import mongoose from "mongoose";
import path from "path";
import { errorHandler } from "./middlewares/errorHandler";
import { Campgroud } from "./models/campgroud";
import { runSeed } from "./seed";
import { catchAsync } from "./utils/catchAsync";
import { ExpressError } from "./utils/ExpressError";

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

const PORT = process.env.SERVER_PORT || 3000;

app.get(
  "/",
  catchAsync(async (req: Request, res: Response) => {
    res.render("home");
  })
);

app.get(
  "/campgrounds",
  catchAsync(async (req: Request, res: Response) => {
    const campgrounds = await Campgroud.find();
    res.render("campgrounds/index", { campgrounds });
  })
);

app.get(
  "/campgrounds/new",
  catchAsync(async (req: Request, res: Response) => {
    res.render("campgrounds/new");
  })
);

app.get(
  "/campgrounds/:id/edit",
  catchAsync(async (req: Request, res: Response) => {
    const campground = await Campgroud.findById(req.params.id);
    res.render("campgrounds/edit", { campground });
  })
);

app.get(
  "/campgrounds/:id",
  catchAsync(async (req: Request, res: Response) => {
    const campground = await Campgroud.findById(req.params.id);
    res.render("campgrounds/show", { campground });
  })
);

app.post(
  "/campgrounds",
  catchAsync(async (req: Request, res: Response) => {
    if (!req.body.campground) {
      throw new ExpressError("Invalid Campground data", 400);
    }

    const campground = Campgroud.build({
      ...req.body.campground,
      price: parseInt(req.body.campground.price, 10),
    });
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

app.put(
  "/campgrounds/:id",
  catchAsync(async (req: Request, res: Response) => {
    const campground = await Campgroud.findByIdAndUpdate(req.params.id, {
      ...req.body.campground,
    });
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

app.delete(
  "/campgrounds/:id",
  catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    await Campgroud.findByIdAndDelete(id);
    res.redirect("/campgrounds");
  })
);

app.all("*", (req, res, next) => {
  next(new ExpressError("Page Not Found ", 404));
});

// custom error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log("listening on port " + PORT);
});
