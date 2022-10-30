import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

// An interface that describes the properties
// that are requried to create a new Product
export interface ProductAttrs {
  id: string;
  title: string;
  price: number;
  userId: string;
  image: string;
  colors?: string;
  sizes?: string;
  countInStock: number;
  numReviews: number;
  rating: number;
  isReserved: boolean;
}

// An interface that describes the properties
// that a Product Model has
interface ProductModel extends mongoose.Model<ProductDoc> {
  build(attrs: ProductAttrs): ProductDoc;
  findByEvent(event: {
    id: string;
    version: number;
  }): Promise<ProductDoc | null>;
}

// An interface that describes the properties
// that a Product Document has
export interface ProductDoc extends mongoose.Document {
  title: string;
  price: number;
  userId: string;
  image: string;
  colors?: string;
  sizes?: string;
  countInStock: number;
  numReviews: number;
  rating: number;
  isReserved: boolean;
  version: number;
  createdAt: string;
  updatedAt: string;
}

export const productSchema = new mongoose.Schema<ProductDoc, ProductModel>(
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
    userId: { type: String, required: true },
    image: {
      type: String,
      required: true,
    },
    colors: { type: String },
    sizes: { type: String },
    countInStock: {
      type: Number,
      required: true,
      default: 1,
    },
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
    isReserved: {
      type: Boolean,
      required: true,
      default: false,
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

productSchema.set("versionKey", "version");

// @ts-ignore
productSchema.plugin(updateIfCurrentPlugin);

productSchema.statics.findByEvent = (event: {
  id: string;
  version: number;
}) => {
  return Product.findOne({
    _id: event.id,
    version: event.version - 1,
  });
};

productSchema.statics.build = (attrs: ProductAttrs) => {
  return new Product({
    _id: attrs.id,
    title: attrs.title,
    price: attrs.price,
    userId: attrs.userId,
    image: attrs.image,
    colors: attrs.colors,
    sizes: attrs.sizes,
    countInStock: attrs.countInStock,
    numReviews: attrs.numReviews,
    rating: attrs.rating,
    isReserved: attrs.isReserved,
  });
};

const Product = mongoose.model<ProductDoc, ProductModel>(
  "Product",
  productSchema
);

export { Product };
