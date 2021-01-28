import mongoose from "mongoose";

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

const campgroudSchema = new mongoose.Schema<CampgroundDoc, CampgroundModel>({
  title: String,
  image: String,
  price: Number,
  description: String,
  location: String,
});

campgroudSchema.statics.build = (attrs: CampgroundAttrs): CampgroundDoc => {
  return new Campgroud(attrs);
};

const Campgroud = mongoose.model<CampgroundDoc, CampgroundModel>(
  "Campgroud",
  campgroudSchema
);

export { Campgroud };
