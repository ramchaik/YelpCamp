import mongoose from "mongoose";
import { UserDoc } from "./user";
const Schema = mongoose.Schema;

interface ReviewAttrs {
  body: string;
  rating: number;
  author: string;
}

export interface ReviewDoc extends mongoose.Document {
  body: string;
  rating: number;
  author: UserDoc;
}

interface ReviewModel extends mongoose.Model<ReviewDoc> {
  build(attrs: ReviewAttrs): ReviewDoc;
}

const reviewSchema = new Schema<ReviewDoc, ReviewModel>({
  body: String,
  rating: Number,
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

reviewSchema.statics.build = (attrs: ReviewAttrs): ReviewDoc => {
  return new Review(attrs);
};

const Review = mongoose.model<ReviewDoc, ReviewModel>("Review", reviewSchema);

export { Review };
