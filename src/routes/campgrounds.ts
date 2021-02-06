import { Router } from "express";
import campgrounds from "../controllers/campgrounds";
import { isAuthor } from "../middlewares/isAuthor";
import { isLoggedIn } from "../middlewares/isLoggedIn";
import { validateCampground } from "../middlewares/validate";
import { catchAsync } from "../utils/catchAsync";

const router = Router();

router.get("/", catchAsync(campgrounds.index));
router.get("/new", isLoggedIn, catchAsync(campgrounds.renderNewForm));
router.get("/:id", catchAsync(campgrounds.showCampground));
router.post(
  "/",
  isLoggedIn,
  validateCampground,
  catchAsync(campgrounds.createCampground)
);
router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(campgrounds.renderEditForm)
);
router.put(
  "/:id",
  isLoggedIn,
  isAuthor,
  validateCampground,
  catchAsync(campgrounds.updateCampground)
);
router.delete(
  "/:id",
  isLoggedIn,
  isAuthor,
  catchAsync(campgrounds.deleteCampground)
);

export { router as campgroundRouter };
