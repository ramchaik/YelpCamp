import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import path from "path";
import mongoose from "mongoose";
import { Campgroud } from "./models/campgroud";
import methodOverride from "method-override";
import { runSeed } from "./seed";

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

// runSeed();

const app: Express = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// to parse the body
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

const PORT = process.env.SERVER_PORT || 3000;

app.get("/", (req: Request, res: Response) => {
  res.render("home");
});

app.get("/campgrounds", async (req: Request, res: Response) => {
  const campgrounds = await Campgroud.find({});
  res.render("campgrounds/index", { campgrounds });
});

app.get("/campgrounds/new", async (req: Request, res: Response) => {
  res.render("campgrounds/new");
});

app.get("/campgrounds/:id/edit", async (req: Request, res: Response) => {
  const campground = await Campgroud.findById(req.params.id);
  res.render("campgrounds/edit", { campground });
});

app.get("/campgrounds/:id", async (req: Request, res: Response) => {
  const campground = await Campgroud.findById(req.params.id);
  res.render("campgrounds/show", { campground });
});

app.post("/campgrounds", async (req: Request, res: Response) => {
  const campground = Campgroud.build(req.body.campground);
  await campground.save();
  res.redirect(`/campgrounds/${campground._id}`);
});

app.put("/campgrounds/:id", async (req: Request, res: Response) => {
  const campground = await Campgroud.findByIdAndUpdate(req.params.id, {
    ...req.body.campground,
  });
  res.redirect(`/campgrounds/${campground._id}`);
});

app.delete("/campgrounds/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  await Campgroud.findByIdAndDelete(id);
  res.redirect("/campgrounds");
});

app.listen(PORT, () => {
  console.log("listening on port " + PORT);
});
