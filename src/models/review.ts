import mongoose from "mongoose";
const Schema = mongoose.Schema;

interface ReviewAttrs {
  title: string;
  image: string;
  price: number;
  description: string;
  location: string;
}

export interface ReviewDoc extends mongoose.Document {
  title: string;
  image: string;
  price: number;
  description: string;
  location: string;
}

interface ReviewModel extends mongoose.Model<ReviewDoc> {
  build(attrs: ReviewAttrs): ReviewDoc;
}

const reviewSchema = new Schema<ReviewDoc, ReviewModel>({
  body: String,
  rating: Number,
});

reviewSchema.statics.build = (attrs: ReviewAttrs): ReviewDoc => {
  return new Review(attrs);
};

const Review = mongoose.model<ReviewDoc, ReviewModel>("Review", reviewSchema);

export { Review };
