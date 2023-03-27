import type mongoose from 'mongoose';

export interface PaymentAttrs {
  orderId: string
  stripeId: string
}

export interface PaymentDoc extends mongoose.Document {
  orderId: string
  stripeId: string
  createdAt: string
  updatedAt: string
}

export interface PaymentModel extends mongoose.Model<PaymentDoc> {
  build: (attrs: PaymentAttrs) => PaymentDoc
}
