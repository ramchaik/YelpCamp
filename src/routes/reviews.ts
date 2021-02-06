import { Router } from "express";
import reviews from "../controllers/reviews";
import { isLoggedIn } from "../middlewares/isLoggedIn";
import { isReviewAuthor } from "../middlewares/isReviewAuthor";
import { validateReview } from "../middlewares/validate";
import { catchAsync } from "../utils/catchAsync";

const router = Router({ mergeParams: true });

router.post("/", isLoggedIn, validateReview, catchAsync(reviews.createReview));
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  catchAsync(reviews.deleteReview)
);

export { router as reviewRouter };
