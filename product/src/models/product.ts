import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import { ReviewDoc, reviewSchema } from "./review";

interface ImageInterface {
  image1: string;
  image2?: string;
  image3?: string;
  image4?: string;
}

// An interface that describes the properties
// that are requried to create a new Product
interface ProductAttrs {
  title: string;
  price: number;
  userId: string;
  images: ImageInterface;
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
  isReserved: boolean;
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
  images: ImageInterface;
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
  isReserved: boolean;
  orderId?: string;
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
    images: {
      image1: { type: String, required: true },
      image2: { type: String },
      image3: { type: String },
      image4: { type: String },
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
    isReserved: {
      type: Boolean,
      required: true,
      default: false,
    },
    orderId: {
      type: String,
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

// @ts-ignore
productSchema.plugin(updateIfCurrentPlugin);

productSchema.statics.build = (attrs: ProductAttrs) => {
  return new Product(attrs);
};

const Product = mongoose.model<ProductDoc, ProductModel>(
  "Product",
  productSchema
);

export { Product };
