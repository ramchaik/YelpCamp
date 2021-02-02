import { Request, Response, Router } from "express";
import { isLoggedIn } from "../middlewares/isLoggedIn";
import { validateCampground } from "../middlewares/validate";
import { Campground } from "../models/campground";
import { catchAsync } from "../utils/catchAsync";

const router = Router();

router.get(
  "/",
  catchAsync(async (_: Request, res: Response) => {
    const campgrounds = await Campground.find();
    res.render("campgrounds/index", { campgrounds });
  })
);

router.get(
  "/new",
  isLoggedIn,
  catchAsync(async (_: Request, res: Response) => {
    res.render("campgrounds/new");
  })
);

router.get(
  "/:id/edit",
  isLoggedIn,
  catchAsync(async (req: Request, res: Response) => {
    const campground = await Campground.findById(req.params.id);
    if (!campground) {
      req.flash("error", "Cannot find that campground!");
      return res.redirect("/campgrounds");
    }

    res.render("campgrounds/edit", { campground });
  })
);

router.get(
  "/:id",
  catchAsync(async (req: Request, res: Response) => {
    const campground = await Campground.findById(req.params.id).populate(
      "reviews"
    );
    if (!campground) {
      req.flash("error", "Cannot find that campground!");
      return res.redirect("/campgrounds");
    }

    res.render("campgrounds/show", { campground });
  })
);

router.post(
  "",
  isLoggedIn,
  validateCampground,
  catchAsync(async (req: Request, res: Response) => {
    const campground = Campground.build({
      ...req.body.campground,
      price: parseInt(req.body.campground.price, 10),
    });
    await campground.save();

    req.flash("success", "Successfully made a new campground!");
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

router.put(
  "/:id",
  isLoggedIn,
  validateCampground,
  catchAsync(async (req: Request, res: Response) => {
    const campground = await Campground.findByIdAndUpdate(req.params.id, {
      ...req.body.campground,
    });
    req.flash("success", "Successfully updated the campground!");
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

router.delete(
  "/:id",
  isLoggedIn,
  catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted the campground!");
    res.redirect("/campgrounds");
  })
);

export { router as campgroundRouter };
