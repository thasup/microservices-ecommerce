import type mongoose from 'mongoose';
import { type OrderStatus } from '@thasup-dev/common';

// An interface that describes the properties
// that are requried to create a new Order
export interface OrderAttrs {
  id: string
  userId: string
  status: OrderStatus
  version: number
  paymentMethod: string
  itemsPrice: number
  shippingPrice: number
  taxPrice: number
  totalPrice: number
  isPaid?: boolean
  paidAt?: Date
}

// An interface that describes the properties
// that a Order Model has
export interface OrderModel extends mongoose.Model<OrderDoc> {
  build: (attrs: OrderAttrs) => OrderDoc
  findByEvent: (event: { id: string, version: number }) => Promise<OrderDoc | null>
}

// An interface that describes the properties
// that a Order Document has
export interface OrderDoc extends mongoose.Document {
  userId: string
  status: OrderStatus
  version: number
  paymentMethod: string
  itemsPrice: number
  shippingPrice: number
  taxPrice: number
  totalPrice: number
  isPaid?: boolean
  paidAt?: Date
  createdAt: string
  updatedAt: string
}
