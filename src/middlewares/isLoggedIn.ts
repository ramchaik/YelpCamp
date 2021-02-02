import { NextFunction, Response } from "express";
import { ExpressReqWithSession } from "../types";

export const isLoggedIn = (
  req: ExpressReqWithSession,
  res: Response,
  next: NextFunction
) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash("error", "You must be logged in fist!");
    return res.redirect("/login");
  }

  next();
};
