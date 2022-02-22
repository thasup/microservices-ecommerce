import mongoose from "mongoose";

// An interface that describes the properties
// that are requried to create a new Review
interface ReviewAttrs {
  _id: mongoose.Types.ObjectId;
  title: string;
  rating: number;
  comment: string;
  userId: string;
}

// An interface that describes the properties
// that a Review Model has
interface ReviewModel extends mongoose.Model<ReviewDoc> {
  build(attrs: ReviewAttrs): ReviewDoc;
}

// An interface that describes the properties
// that a Review Document has
interface ReviewDoc extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  title: string;
  rating: number;
  comment: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

// An interface that describes the properties
// that are requried to create a new Product
interface ProductAttrs {
  title: string;
  price: number;
  userId: string;
  image: string;
  colors?: string;
  sizes?: string;
  brand: string;
  category: string;
  material: string;
  description: string;
  reviews: number;
  numReviews: number;
  rating: number;
  countInStock: number;
}

// An interface that describes the properties
// that a Product Model has
interface ProductModel extends mongoose.Model<ProductDoc> {
  build(attrs: ProductAttrs): ProductDoc;
}

// An interface that describes the properties
// that a Product Document has
interface ProductDoc extends mongoose.Document {
  title: string;
  price: number;
  userId: string;
  image: string;
  colors?: string;
  sizes?: string;
  brand?: string;
  category: string;
  material?: string;
  description: string;
  reviews?: ReviewDoc;
  numReviews: number;
  rating: number;
  countInStock: number;
  createdAt: string;
  updatedAt: string;
}

const reviewSchema = new mongoose.Schema<ReviewDoc, ReviewModel>(
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
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

const productSchema = new mongoose.Schema<ProductDoc, ProductModel>(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    userId: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    colors: [
      {
        name: { type: String },
      },
    ],
    sizes: [
      {
        name: { type: String },
      },
    ],
    brand: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    material: {
      type: String,
    },
    description: {
      type: String,
      required: true,
    },
    reviews: reviewSchema,
    numReviews: {
      type: Number,
      required: true,
      default: 0,
    },
    rating: {
      type: Number,
      required: true,
      default: 0,
    },
    countInStock: {
      type: Number,
      required: true,
      default: 0,
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
  }
);

productSchema.statics.build = (attrs: ProductAttrs) => {
  return new Product(attrs);
};

const Product = mongoose.model<ProductDoc, ProductModel>(
  "Product",
  productSchema
);

export { Product };
