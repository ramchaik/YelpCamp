import mongoose from "mongoose";
import { Review, ReviewDoc } from "./review";
import { UserDoc } from "./user";
const Schema = mongoose.Schema;

interface IImages {
  url: string;
  filename: string;
}

interface ImageDoc extends mongoose.Document {
  url: string;
  filename: string;
}

interface ImageModel extends mongoose.Model<ImageDoc> {}

interface IGeoJSON {
  type: "Point";
  coordinates: number[];
}

interface CampgroundAttrs {
  title: string;
  images: IImages[];
  price: number;
  description: string;
  location: string;
  geometry: IGeoJSON;
  author: string;
}

interface CampgroundDoc extends mongoose.Document {
  title: string;
  images: IImages[];
  price: number;
  description: string;
  geometry: IGeoJSON;
  location: string;
  reviews: ReviewDoc[];
  author: UserDoc;
}

interface CampgroundModel extends mongoose.Model<CampgroundDoc> {
  build(attrs: CampgroundAttrs): CampgroundDoc;
}

const ImageSchema = new Schema<ImageDoc, ImageModel>({
  url: String,
  filename: String,
});

ImageSchema.virtual("thumbnail").get(function () {
  return this.url.replace("/upload", "/upload/w_200");
});

const campgroundSchema = new Schema<CampgroundDoc, CampgroundModel>({
  title: String,
  images: [ImageSchema],
  price: Number,
  description: String,
  location: String,
  geometry: {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
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
