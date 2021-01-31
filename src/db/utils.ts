import mongoose from "mongoose";
let db = null;

const connectToDatabase = () => {
  mongoose.connect("mongodb://localhost:27017/yelp-camp", {
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
