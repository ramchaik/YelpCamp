import { NextFunction, Request, Response } from "express";
import { Campground } from "../models/campground";
import { ExpressReqWithSession } from "../types";

export const isAuthor = async (
  req: ExpressReqWithSession,
  res: Response,
  next: NextFunction
) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);

  if (!campground.author.equals(req.user._id)) {
    req.flash("error", "You do not have permission to do that!");
    return res.redirect(`/campgrounds/${id}`);
  }

  next();
};
