import { Request, Response, Router } from "express";
import campgrounds from "../controllers/campgrounds";
import { isAuthor } from "../middlewares/isAuthor";
import { isLoggedIn } from "../middlewares/isLoggedIn";
import { validateCampground } from "../middlewares/validate";
import { catchAsync } from "../utils/catchAsync";
import multer from "multer";
import { storage } from "../cloudinary";
const upload = multer({ storage });

const router = Router();

// .post(
//   isLoggedIn,
//   validateCampground,
//   catchAsync(campgrounds.createCampground)
// );
router
  .route("/")
  .get(catchAsync(campgrounds.index))
  .post(upload.array("image"), (req: Request, res: Response) => {
    console.log(req.files);

    res.send(req.body);
  });

router.get("/new", isLoggedIn, catchAsync(campgrounds.renderNewForm));

router
  .route("/:id")
  .get(catchAsync(campgrounds.showCampground))
  .put(isAuthor, validateCampground, catchAsync(campgrounds.updateCampground))
  .delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));

router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  catchAsync(campgrounds.renderEditForm)
);

export { router as campgroundRouter };
