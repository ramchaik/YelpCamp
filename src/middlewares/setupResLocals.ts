import { NextFunction, Request, Response } from "express";

export const setupResLocals = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
};
