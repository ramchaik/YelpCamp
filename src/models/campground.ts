import mongoose from "mongoose";
import { Review, ReviewDoc } from "./review";
const Schema = mongoose.Schema;

interface CampgroundAttrs {
  title: string;
  image: string;
  price: number;
  description: string;
  location: string;
}

interface CampgroundDoc extends mongoose.Document {
  title: string;
  image: string;
  price: number;
  description: string;
  location: string;
  reviews: ReviewDoc[];
}

interface CampgroundModel extends mongoose.Model<CampgroundDoc> {
  build(attrs: CampgroundAttrs): CampgroundDoc;
}

const campgroundSchema = new Schema<CampgroundDoc, CampgroundModel>({
  title: String,
  image: String,
  price: Number,
  description: String,
  location: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

campgroundSchema.statics.build = (attrs: CampgroundAttrs): CampgroundDoc => {
  return new Campground(attrs);
};

campgroundSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await Review.deleteMany({
      _id: {
        $in: doc.reviews,
      },
    });
  }
});

const Campground = mongoose.model<CampgroundDoc, CampgroundModel>(
  "Campground",
  campgroundSchema
);

export { Campground };
