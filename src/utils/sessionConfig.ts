import { SessionOptions } from "express-session";
import { __PROD__ } from "../constants";

export const getSessionConfig = (): SessionOptions => {
  const WEEK_IN_MS = 1000 * 60 * 60 * 24 * 7;

  const sessionConfig: SessionOptions = {
    name: "session",
    secret: "thisisnotagoodsecret!",
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      secure: __PROD__,
      expires: new Date(Date.now() + WEEK_IN_MS),
      maxAge: WEEK_IN_MS,
    },
  };

  return sessionConfig;
};
