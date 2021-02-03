import { NextFunction, Response } from "express";
import { Review } from "../models/review";
import { ExpressReqWithSession } from "../types";

export const isReviewAuthor = async (
  req: ExpressReqWithSession,
  res: Response,
  next: NextFunction
) => {
  const { reviewId, id } = req.params;
  const review = await Review.findById(reviewId);

  if (!review.author.equals(req.user._id)) {
    req.flash("error", "You do not have permission to do that!");
    return res.redirect(`/campgrounds/${id}`);
  }

  next();
};
