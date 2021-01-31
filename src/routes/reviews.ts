import { Request, Response, Router } from "express";
import { validateReview } from "../middlewares/validate";
import { Campground } from "../models/campground";
import { Review } from "../models/review";
import { catchAsync } from "../utils/catchAsync";

const router = Router({ mergeParams: true });

router.post(
  "/",
  validateReview,
  catchAsync(async (req: Request, res: Response) => {
    const campground = await Campground.findById(req.params.id);
    const review = Review.build(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash("success", "Created a new review!");
    res.redirect(`/campgrounds/${campground._id}`);
  })
);

router.delete(
  "/:reviewId",
  catchAsync(async (req: Request, res: Response) => {
    const { id, reviewId } = req.params;
    // @ts-ignore
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Successfully deleted the review!");
    res.redirect(`/campgrounds/${id}`);
  })
);

export { router as reviewRouter };
