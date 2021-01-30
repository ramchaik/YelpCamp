import { NextFunction, Request, Response } from "express";
import Joi from "joi";
import { campgroundSchema, reviewSchema } from "../schemas";
import { ExpressError } from "../utils/ExpressError";

const validate = (schema: Joi.ObjectSchema<any>) => (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { error } = schema.validate(req.body);

  if (error) {
    throw new ExpressError(error.details.map((e) => e.message).join(", "), 400);
  }

  next();
};

const validateCampground = validate(campgroundSchema);
const validateReview = validate(reviewSchema);

export { validateCampground, validateReview };
