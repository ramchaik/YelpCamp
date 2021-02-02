import { NextFunction, Request, Response, Router } from "express";
import { catchAsync } from "../utils/catchAsync";
import { User } from "../models/user";
import passport from "passport";

const router = Router({ mergeParams: true });

router.get("/register", async (req: Request, res: Response) => {
  res.render("users/register");
});

router.post(
  "/register",
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, username, password } = req.body;
      const registeredUser = await User.build({ email, username, password });

      req.login(registeredUser, (err) => {
        if (err) next(err);
        req.flash("success", "Welcome to Yelp Camp!");
        res.redirect("/campgrounds");
      });
    } catch (error) {
      req.flash("error", error.message);
      res.redirect("/register");
    }
  })
);

router.get("/login", (req: Request, res: Response) => {
  res.render("users/login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  catchAsync(async (req: Request, res: Response) => {
    req.flash("success", "Welcome back!");
    res.redirect("/campgrounds");
  })
);

router.get("/logout", (req: Request, res: Response) => {
  req.logout();
  req.flash("success", "Goodbye!");
  res.redirect("/campgrounds");
});

export { router as userRouter };
