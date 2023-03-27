import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { OrderStatus } from '@thasup-dev/common';
import type { OrderAttrs, OrderDoc, OrderModel } from '../types/order';

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(OrderStatus),
      default: OrderStatus.Created
    },
    paymentMethod: {
      type: String,
      required: true,
      default: 'stripe'
    },
    itemsPrice: {
      type: Number,
      required: true,
      default: 0.0
    },
    shippingPrice: {
      type: Number,
      required: true,
      default: 0.0
    },
    taxPrice: {
      type: Number,
      required: true,
      default: 0.0
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0.0
    },
    isPaid: {
      type: Boolean,
      default: false
    },
    paidAt: {
      type: Date
    }
  },
  {
    toJSON: {
      transform (doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      }
    },
    timestamps: true
  }
);

orderSchema.set('versionKey', 'version');

// @ts-ignore
orderSchema.plugin(updateIfCurrentPlugin);

orderSchema.statics.findByEvent = (event: { id: string, version: number }) => {
  return Order.findOne({
    id: event.id,
    version: event.version - 1
  });
};

orderSchema.statics.build = (attrs: OrderAttrs) => {
  return new Order({
    _id: attrs.id,
    userId: attrs.userId,
    status: attrs.status,
    version: attrs.version,
    paymentMethod: attrs.paymentMethod,
    itemsPrice: attrs.itemsPrice,
    shippingPrice: attrs.shippingPrice,
    taxPrice: attrs.taxPrice,
    totalPrice: attrs.totalPrice,
    isPaid: attrs.isPaid,
    paidAt: attrs.paidAt
  });
};

const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema);

export { Order };
