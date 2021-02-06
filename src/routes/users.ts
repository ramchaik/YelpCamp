import { Router } from "express";
import passport from "passport";
import users from "../controllers/users";
import { catchAsync } from "../utils/catchAsync";

const router = Router({ mergeParams: true });

router.get("/register", users.renderRegister);
router.post("/register", catchAsync(users.register));
router.get("/login", users.renderLogin);
router.post(
  "/login",
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  catchAsync(users.login)
);
router.get("/logout", users.logout);

export { router as userRouter };
