import mongoose from "mongoose";

// An interface that describes the properties
// that are requried to create a new Review
interface ReviewAttrs {
  title: string;
  rating: number;
  comment: string;
  userId: string;
  productTitle?: string;
  productId?: string;
}

// An interface that describes the properties
// that a Review Model has
interface ReviewModel extends mongoose.Model<ReviewDoc> {
  build(attrs: ReviewAttrs): ReviewDoc;
}

// An interface that describes the properties
// that a Review Document has
export interface ReviewDoc extends mongoose.Document {
  title: string;
  rating: number;
  comment: string;
  userId: string;
  productTitle?: string;
  productId?: string;
  createdAt: string;
  updatedAt: string;
}

export const reviewSchema = new mongoose.Schema<ReviewDoc, ReviewModel>(
  {
    title: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    productTitle: {
      type: String,
      required: false,
    },
    productId: {
      type: String,
      required: false,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
    timestamps: true,
  }
);

reviewSchema.statics.build = (attrs: ReviewAttrs) => {
  return new Review(attrs);
};

const Review = mongoose.model<ReviewDoc, ReviewModel>("Review", reviewSchema);

export { Review };
