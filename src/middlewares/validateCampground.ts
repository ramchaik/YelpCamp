import { NextFunction, Request, Response } from "express";
import { campgroundSchema } from "../schemas";
import { ExpressError } from "../utils/ExpressError";

export const validateCampground = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error } = campgroundSchema.validate(req.body);

  if (error) {
    throw new ExpressError(error.details.map((e) => e.message).join(", "), 400);
  }

  next();
};
