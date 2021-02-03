import { Session } from "express-session";
import { Request } from "express";

export type ExpressReqWithSession = Request & {
  session: Session & { returnTo?: string };
  user?: any;
};
