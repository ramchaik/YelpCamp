import { Request, Response, Router } from "express";
import { validateCampground } from "../middlewares/validate";
import { Campground } from "../models/campground";
import { catchAsync } from "../utils/catchAsync";

const router = Router();

router.get(
  "/",
  catchAsync(async (req: Request, res: Response) => {
    const campgrounds = await Campground.find();
    res.render("campgrounds/index", { campgrounds });
  })
);

router.get(
  "/new",
  catchAsync(async (req: Request, res: Response) => {
    res.render("campgrounds/new");
  })
);

router.get(
  "/:id/edit",
  catchAsync(async (req: Request, res: Response) => {
    const campground = await Campground.findById(req.params.id);
    res.render("campgrounds/edit", { campground });
  })
);

router.get(
  "/:id",
  catchAsync(async (req: Request, res: Response) => {
    const campground = await Campground.findById(req.params.id).populate(
      "reviews"
    );
    res.render("campgrounds/show", { campground });
  })
);

router.post(
  "",
  validateCampground,
  catchAsync(async (req: Request, res: Response) => {
    const campground = Campground.build({
      ...req.body.campground,
      price: parseInt(req.body.campground.price, 10),
    });
    await campground.save();

    res.redirect(`/campgrounds/${campground._id}`);
  })
);

router.put(
  "/:id",
  validateCampground,
  catchAsync(async (req: Request, res: Response) => {
    const campground = await Campground.findByIdAndUpdate(req.params.id, {
      ...req.body.campground,
    });
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

router.delete(
  "/:id",
  catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect("/campgrounds");
  })
);

export { router as campgroundRouter };
