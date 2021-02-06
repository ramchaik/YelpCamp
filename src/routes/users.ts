import { Router } from "express";
import passport from "passport";
import users from "../controllers/users";
import { catchAsync } from "../utils/catchAsync";

const router = Router({ mergeParams: true });

router
  .route("/register")
  .get(users.renderRegister)
  .post(catchAsync(users.register));

router
  .route("/login")
  .get(users.renderLogin)
  .post(
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/login",
    }),
    catchAsync(users.login)
  );

router.get("/logout", users.logout);

export { router as userRouter };
