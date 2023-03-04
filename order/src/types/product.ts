import type mongoose from 'mongoose';

// An interface that describes the properties
// that are requried to create a new Product
export interface ProductAttrs {
  id: string
  title: string
  price: number
  userId: string
  image: string
  colors?: string
  sizes?: string
  countInStock: number
  numReviews: number
  rating: number
  isReserved: boolean
}

// An interface that describes the properties
// that a Product Model has
export interface ProductModel extends mongoose.Model<ProductDoc> {
  build: (attrs: ProductAttrs) => ProductDoc
  findByEvent: (event: {
    id: string
    version: number
  }) => Promise<ProductDoc | null>
}

// An interface that describes the properties
// that a Product Document has
export interface ProductDoc extends mongoose.Document {
  title: string
  price: number
  userId: string
  image: string
  colors?: string
  sizes?: string
  countInStock: number
  numReviews: number
  rating: number
  isReserved: boolean
  version: number
  createdAt: string
  updatedAt: string
}
