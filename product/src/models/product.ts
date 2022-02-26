import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import { ReviewDoc, reviewSchema } from "./review";

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
  reviews?: Array<ReviewDoc>;
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
  reviews?: Array<ReviewDoc>;
  numReviews: number;
  rating: number;
  countInStock: number;
  version: number;
  createdAt: string;
  updatedAt: string;
}

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
    colors: { type: String },
    sizes: { type: String },
    brand: {
      type: String,
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
    reviews: [reviewSchema],
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
      default: 1,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
    timestamps: true,
  }
);

productSchema.set("versionKey", "version");
productSchema.plugin(updateIfCurrentPlugin);

productSchema.statics.build = (attrs: ProductAttrs) => {
  return new Product(attrs);
};

const Product = mongoose.model<ProductDoc, ProductModel>(
  "Product",
  productSchema
);

export { Product };
