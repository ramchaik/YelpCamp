import mongoose from "mongoose";

interface CampgroundAttrs {
  title: string;
  price: string;
  description: string;
  location: string;
}

interface CampgroundDoc extends mongoose.Document {
  title: string;
  price: string;
  description: string;
  location: string;
}

interface CampgroundModel extends mongoose.Model<CampgroundDoc> {
  build(attrs: CampgroundAttrs): CampgroundDoc;
}

const campgroudSchema = new mongoose.Schema<CampgroundDoc, CampgroundModel>({
  title: String,
  price: String,
  description: String,
  location: String,
});

campgroudSchema.statics.build = (attrs: CampgroundAttrs) => {
  return new Campgroud(attrs);
};

const Campgroud = mongoose.model<CampgroundDoc, CampgroundModel>(
  "Campgroud",
  campgroudSchema
);

export { Campgroud };
