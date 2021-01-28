import { NextFunction, Request, Response } from "express";
import Joi from "joi";
import { ExpressError } from "../utils/ExpressError";

export const validateCampground = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const campgroundSchema = Joi.object({
    campground: Joi.object({
      title: Joi.string().required(),
      price: Joi.number().required().min(0),
      image: Joi.string().required(),
      description: Joi.string().required(),
      location: Joi.string().required(),
    }).required(),
  });

  const { error } = campgroundSchema.validate(req.body);

  if (error) {
    throw new ExpressError(error.details.map((e) => e.message).join(", "), 400);
  }

  next();
};
