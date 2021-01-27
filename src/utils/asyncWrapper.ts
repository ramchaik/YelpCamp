import { Request, Response, NextFunction } from "express";

export const asyncError = (fn: any) =>
  function (req: Request, res: Response, next: NextFunction) {
    fn(req, res, next).catch((err: any) => next(err));
  };
