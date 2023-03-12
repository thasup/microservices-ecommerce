import type mongoose from 'mongoose';

// An interface that describes the properties
// that are requried to create a new Review
export interface ReviewAttrs {
  title: string
  rating: number
  comment: string
  userId: string
  productTitle?: string
  productId?: string
}

// An interface that describes the properties
// that a Review Model has
export interface ReviewModel extends mongoose.Model<ReviewDoc> {
  build: (attrs: ReviewAttrs) => ReviewDoc
}

// An interface that describes the properties
// that a Review Document has
export interface ReviewDoc extends mongoose.Document {
  title: string
  rating: number
  comment: string
  userId: string
  productTitle?: string
  productId?: string
  createdAt: string
  updatedAt: string
}
