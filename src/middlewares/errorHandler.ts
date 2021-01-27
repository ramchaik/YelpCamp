import { NextFunction, Request, Response } from "express";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { status = 500, message = "Something went wrong" } = err;
  res.status(status).send(message);
};
