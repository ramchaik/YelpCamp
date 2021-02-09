import { SessionOptions } from "express-session";
import { Request } from "express";

export type ExpressReqWithSession = Request & {
  session: SessionOptions & { returnTo?: string };
  user?: any;
};
