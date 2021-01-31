import { SessionOptions } from "express-session";

export const getSessionConfig = (): SessionOptions => {
  const WEEK_IN_MS = 1000 * 60 * 60 * 24 * 7;

  const sessionConfig: SessionOptions = {
    secret: "thisisnotagoodsecret!",
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      expires: new Date(Date.now() + WEEK_IN_MS),
      maxAge: WEEK_IN_MS,
    },
  };

  return sessionConfig;
};
