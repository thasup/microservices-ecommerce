import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import type { ProductAttrs, ProductDoc, ProductModel } from "../types/product";
import { reviewSchema } from "./review";

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
