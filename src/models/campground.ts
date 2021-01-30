import mongoose from "mongoose";
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
});

campgroundSchema.statics.build = (attrs: CampgroundAttrs): CampgroundDoc => {
  return new Campground(attrs);
};

const Campground = mongoose.model<CampgroundDoc, CampgroundModel>(
  "Campground",
  campgroundSchema
);

export { Campground };
