import { Campground } from "../models/campground";
import { Request, Response } from "express";
import { ExpressReqWithSession } from "../types";

const index = async (_: Request, res: Response) => {
  const campgrounds = await Campground.find();
  res.render("campgrounds/index", { campgrounds });
};

const renderNewForm = async (_: Request, res: Response) => {
  res.render("campgrounds/new");
};
const createCampground = async (req: ExpressReqWithSession, res: Response) => {
  const files = req.files as Express.Multer.File[];
  const campground = Campground.build({
    ...req.body.campground,
    author: req.user._id,
    price: parseInt(req.body.campground.price, 10),
    images: files.map((f: Express.Multer.File) => ({
      url: f.path,
      filename: f.filename,
    })),
  });
  await campground.save();

  req.flash("success", "Successfully made a new campground!");
  res.redirect(`/campgrounds/${campground._id}`);
};

const showCampground = async (req: Request, res: Response) => {
  const campground = await Campground.findById(req.params.id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("author");

  if (!campground) {
    req.flash("error", "Cannot find that campground!");
    return res.redirect("/campgrounds");
  }

  res.render("campgrounds/show", { campground });
};

const renderEditForm = async (req: Request, res: Response) => {
  const campground = await Campground.findById(req.params.id);
  if (!campground) {
    req.flash("error", "Cannot find that campground!");
    return res.redirect("/campgrounds");
  }

  res.render("campgrounds/edit", { campground });
};

const updateCampground = async (req: Request, res: Response) => {
  const files = req.files as Express.Multer.File[];
  const campground = await Campground.findByIdAndUpdate(req.params.id, {
    ...req.body.campground,
  });

  const imgs = files.map((f: Express.Multer.File) => ({
    url: f.path,
    filename: f.filename,
  }));
  campground.images.push(...imgs);

  await campground.save();

  req.flash("success", "Successfully updated the campground!");
  res.redirect(`/campgrounds/${campground._id}`);
};

const deleteCampground = async (req: Request, res: Response) => {
  const { id } = req.params;
  await Campground.findByIdAndDelete(id);
  req.flash("success", "Successfully deleted the campground!");
  res.redirect("/campgrounds");
};
export default {
  index,
  renderNewForm,
  createCampground,
  showCampground,
  renderEditForm,
  updateCampground,
  deleteCampground,
};
