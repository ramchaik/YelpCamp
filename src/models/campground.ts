import mongoose from "mongoose";
import { Review, ReviewDoc } from "./review";
import { UserDoc } from "./user";
const Schema = mongoose.Schema;

interface CampgroundAttrs {
  title: string;
  image: string;
  price: number;
  description: string;
  location: string;
  author: string;
}

interface CampgroundDoc extends mongoose.Document {
  title: string;
  image: string;
  price: number;
  description: string;
  location: string;
  reviews: ReviewDoc[];
  author: UserDoc;
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
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
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
