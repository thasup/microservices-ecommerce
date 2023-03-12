import type mongoose from 'mongoose';

export interface ShippingAddressAttrs {
  address: string
  city: string
  postalCode: string
  country: string
}

// An interface that describes the properties
// that are requried to create a new User
export interface UserAttrs {
  email: string
  password: string
  isAdmin: boolean
  name: string
  image?: string
  gender: string
  age: number
  bio?: string
  shippingAddress?: ShippingAddressAttrs
}

// An interface that describes the properties
// that a User Model has
export interface UserModel extends mongoose.Model<UserDoc> {
  build: (attrs: UserAttrs) => UserDoc
}

// An interface that describes the properties
// that a User Document has
export interface UserDoc extends mongoose.Document {
  email: string
  password: string
  isAdmin: boolean
  name: string
  image?: string
  gender: string
  age: number
  bio?: string
  shippingAddress?: ShippingAddressAttrs
  version: number
  createdAt: string
  updatedAt: string
}
