import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

// An interface that describes the properties
// that are requried to create a new Product
interface ProductAttrs {
  id: string;
  title: string;
  price: number;
  image: string;
  colors?: string;
  sizes?: string;
  countInStock: number;
}

// An interface that describes the properties
// that a Product Model has
interface ProductModel extends mongoose.Model<ProductDoc> {
  build(attrs: ProductAttrs): ProductDoc;
}

// An interface that describes the properties
// that a Product Document has
export interface ProductDoc extends mongoose.Document {
  title: string;
  price: number;
  image: string;
  colors?: string;
  sizes?: string;
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
productSchema.plugin(updateIfCurrentPlugin);

productSchema.statics.build = (attrs: ProductAttrs) => {
  return new Product({
    _id: attrs.id,
    title: attrs.title,
    price: attrs.price,
    image: attrs.image,
    colors: attrs.colors,
    sizes: attrs.sizes,
    countInStock: attrs.countInStock,
  });
};

const Product = mongoose.model<ProductDoc, ProductModel>(
  "Product",
  productSchema
);

export { Product };
