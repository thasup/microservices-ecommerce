import mongoose from "mongoose";

// An interface that describes the properties
// that are requried to create a new Cart
export interface CartAttrs {
  userId: string;
  title: string;
  qty: number;
  image: string;
  price: number;
  countInStock: number;
  discount: number;
  productId: string;
}

// An interface that describes the properties
// that a Cart Model has
interface CartModel extends mongoose.Model<CartDoc> {
  build(attrs: CartAttrs): CartDoc;
}

// An interface that describes the properties
// that a Cart Document has
export interface CartDoc extends mongoose.Document {
  userId: string;
  title: string;
  qty: number;
  image: string;
  price: number;
  countInStock: number;
  discount: number;
  productId: string;
  createdAt: string;
  updatedAt: string;
}

export const cartSchema = new mongoose.Schema<CartDoc, CartModel>(
  {
    userId: { type: String, required: true },
    title: { type: String, required: true },
    qty: { type: Number, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    countInStock: { type: Number, required: true },
    discount: { type: Number, default: 1 },
    productId: { type: String, required: true },
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

cartSchema.statics.build = (attrs: CartAttrs) => {
  return new Cart(attrs);
};

const Cart = mongoose.model<CartDoc, CartModel>("Cart", cartSchema);

export { Cart };
