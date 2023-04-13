import mongoose from 'mongoose';
import type { PaymentAttrs, PaymentDoc, PaymentModel } from '../types/payment';

const paymentSchema = new mongoose.Schema(
  {
    orderId: {
      required: true,
      type: String
    },
    stripeId: {
      required: true,
      type: String
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

paymentSchema.statics.build = (attrs: PaymentAttrs) => {
  return new Payment(attrs);
};

const Payment = mongoose.model<PaymentDoc, PaymentModel>(
  'Payment',
  paymentSchema
);

export { Payment };
