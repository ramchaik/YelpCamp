import mongoose from "mongoose";
import { __PROD__ } from "../constants";
let db = null;

const connectToDatabase = () => {
  const dbURI = __PROD__
    ? process.env.DB_URI
    : "mongodb://localhost:27017/yelp-camp";

  mongoose.connect(dbURI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  });

  db = mongoose.connection;

  db.on("error", (_: any) => console.error.bind(console, "connection error: "));

  db.once("open", () => {
    console.log("Database connected");
  });

  return db;
};

export { connectToDatabase, db };
