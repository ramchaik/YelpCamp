import { NextFunction, Request, Response, Router } from "express";
import { catchAsync } from "../utils/catchAsync";
import { User } from "../models/user";
import passport from "passport";
import { ExpressReqWithSession } from "../types";

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
  catchAsync(async (req: ExpressReqWithSession, res: Response) => {
    req.flash("success", "Welcome back!");
    const redirectUrl = req.session.returnTo || "/campgrounds";
    delete req.session.returnTo;
    res.redirect(redirectUrl);
  })
);

router.get("/logout", (req: Request, res: Response) => {
  req.logout();
  req.flash("success", "Goodbye!");
  res.redirect("/campgrounds");
});

export { router as userRouter };
