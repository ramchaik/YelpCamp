import { NextFunction, Request, Response } from "express";
import { ExpressError } from "../utils/ExpressError";

export const handleNotFound = (
  _: Request,
  __: Response,
  next: NextFunction
) => {
  next(new ExpressError("Page Not Found ", 404));
};
