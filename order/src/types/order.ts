import type mongoose from 'mongoose';
import { type OrderStatus } from '@thasup-dev/common';

export interface CartAttrs {
  userId: string
  title: string
  qty: number
  color: string
  size: string
  image: string
  price: number
  countInStock: number
  discount: number
  productId: string
}

interface ShippingAddressAttrs {
  address: string
  city: string
  postalCode: string
  country: string
}

// An interface that describes the properties
// that are requried to create a new Order
export interface OrderAttrs {
  userId: string
  status: OrderStatus
  expiresAt: Date
  cart?: CartAttrs[]
  shippingAddress?: ShippingAddressAttrs
  paymentMethod: string
  itemsPrice: number
  shippingPrice: number
  taxPrice: number
  totalPrice: number
  isPaid?: boolean
  paidAt?: Date
  isDelivered?: boolean
  deliveredAt?: Date
}

// An interface that describes the properties
// that a Order Model has
export interface OrderModel extends mongoose.Model<OrderDoc> {
  build: (attrs: OrderAttrs) => OrderDoc
}

// An interface that describes the properties
// that a Order Document has
export interface OrderDoc extends mongoose.Document {
  userId: string
  status: OrderStatus
  expiresAt: Date
  cart?: CartAttrs[]
  shippingAddress?: ShippingAddressAttrs
  paymentMethod: string
  itemsPrice: number
  shippingPrice: number
  taxPrice: number
  totalPrice: number
  isPaid?: boolean
  paidAt?: Date
  isDelivered?: boolean
  deliveredAt?: Date
  version: number
  createdAt: string
  updatedAt: string
}
