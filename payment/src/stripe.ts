import Stripe from "stripe";

if (!process.env.STRIPE_KEY) {
  throw new Error("STRIPE_KEY must be defined");
}

// No pinned apiVersion: the SDK uses the version it was built against.
export const stripe = new Stripe(process.env.STRIPE_KEY);
