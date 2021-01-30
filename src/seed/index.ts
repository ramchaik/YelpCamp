import mongoose from "mongoose";
import { Campground } from "../models/campground";
import { cities } from "./cities";
import { descriptors, places } from "./seedHelpers";

mongoose.connect("mongodb://localhost:27017/yelp-camp", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("error", (err: any) => console.error.bind(console, "connection error: "));

db.once("open", () => {
  console.log("Database connected for Seeding!");
});

const getRandomIndex = (range: number): number =>
  Math.floor(Math.random() * range);
const sample = (arr: any): any => arr[getRandomIndex(arr.length)];

const seedDB = async () => {
  await Campground.deleteMany({});

  for (let i = 0; i < 50; ++i) {
    const camp = Campground.build({
      title: `${sample(descriptors)} ${sample(places)}`,
      location: `${cities[getRandomIndex(1000)].city}, ${
        cities[getRandomIndex(1000)].state
      }`,
      price: 10,
      image: "https://source.unsplash.com/collection/483251",
      description: "Seed data",
    });

    await camp.save();
  }
};

export const runSeed = () =>
  seedDB().then(async () => {
    // await mongoose.connection.close();
    console.log("Seeding completed!");
  });
