import Joi from "joi";

export const campgroundSchema = Joi.object({
  campground: Joi.object({
    title: Joi.string().required(),
    price: Joi.number().required().min(0),
    // image: Joi.string().required(),
    description: Joi.string().required(),
    location: Joi.string().required(),
  }).required(),
});

export const reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required(),
    body: Joi.string().required(),
  }).required(),
});
