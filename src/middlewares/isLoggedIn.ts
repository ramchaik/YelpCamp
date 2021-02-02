import { NextFunction, Request, Response } from "express";

export const isLoggedIn = (req: Request, res: Response, next: NextFunction) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "You must be logged in fist!");
    return res.redirect("/");
  }

  next();
};
