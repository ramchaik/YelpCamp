import { NextFunction, Request, Response } from "express";
import { ExpressError } from "../utils/ExpressError";

export const errorHandler = (
  err: ExpressError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Something went wrong";
  res.status(statusCode).render("error", { err });
};
