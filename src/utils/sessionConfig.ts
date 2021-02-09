import session, { SessionOptions, Store } from "express-session";
import { __PROD__ } from "../constants";
import connectMongo from "connect-mongo";

const MongoDBStore = connectMongo(session);

const createStore = (url: string): Store => {
  const store = new MongoDBStore({
    url,
    secret: "thisisnotagoodsecret!",
    touchAfter: 24 * 60 * 60,
  });

  store.on("error", (e) => {
    console.log("Session Store error: ", e);
  });

  return store;
};
export const getSessionConfig = (uri: string): SessionOptions => {
  const WEEK_IN_MS = 1000 * 60 * 60 * 24 * 7;

  const sessionConfig: SessionOptions = {
    store: createStore(uri),
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
