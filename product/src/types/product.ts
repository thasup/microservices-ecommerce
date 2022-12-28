import mongoose from "mongoose";
import type { ReviewDoc } from "./review";

export interface ImageInterface {
  image1: string;
  image2?: string;
  image3?: string;
  image4?: string;
}

// An interface that describes the properties
// that are requried to create a new Product
export interface ProductAttrs {
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
export interface ProductModel extends mongoose.Model<ProductDoc> {
  build(attrs: ProductAttrs): ProductDoc;
}

// An interface that describes the properties
// that a Product Document has
export interface ProductDoc extends mongoose.Document {
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
