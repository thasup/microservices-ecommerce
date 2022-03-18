import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";

import { Product, ProductDoc } from "../../models/product";

const buildProduct = async () => {
  const product = Product.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "Sample Dress",
    price: 1990,
    userId: new mongoose.Types.ObjectId().toHexString(),
    image: "./asset/sample.jpg",
    colors: "White,Black",
    sizes: "S,M,L",
    countInStock: 1,
    numReviews: 0,
    rating: 0,
    isReserved: false,
  });
  await product.save();

  return product;
};

const buildJSON = (product: ProductDoc, userId: string) => {
  const jsonCartItems = JSON.stringify([
    {
      userId: userId,
      title: product.title,
      qty: 1,
      color: "white",
      size: "M",
      image: product.image,
      price: product.price,
      countInStock: product.countInStock,
      discount: 1,
      productId: product.id,
    },
  ]);

  const jsonShippingAddress = JSON.stringify({
    address: "sunset villa",
    city: "New York",
    postalCode: "44205",
    country: "USA",
  });

  const jsonPaymentMethod = JSON.stringify("stripe");

  return { jsonCartItems, jsonShippingAddress, jsonPaymentMethod };
};

it("fetches the order by the user itself", async () => {
  // Create a product
  const product = await buildProduct();

  const userId = new mongoose.Types.ObjectId().toHexString();
  const user = global.signin(userId);

  const { jsonCartItems, jsonShippingAddress, jsonPaymentMethod } = buildJSON(
    product,
    userId
  );

  // make a request to build an order with this product
  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({
      jsonCartItems: jsonCartItems,
      jsonShippingAddress: jsonShippingAddress,
      jsonPaymentMethod: jsonPaymentMethod,
    })
    .expect(201);

  // make request to fetch the order by the *USER* itself
  const { body: fetchedOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set("Cookie", user)
    .send()
    .expect(200);

  expect(fetchedOrder.id).toEqual(order.id);
});

it("fetches the order by admin", async () => {
  // Create a product
  const product = await buildProduct();

  const userId = new mongoose.Types.ObjectId().toHexString();
  const user = global.signin(userId);
  const admin = global.adminSignin();

  const { jsonCartItems, jsonShippingAddress, jsonPaymentMethod } = buildJSON(
    product,
    userId
  );

  // make a request to build an order with this product
  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({
      jsonCartItems: jsonCartItems,
      jsonShippingAddress: jsonShippingAddress,
      jsonPaymentMethod: jsonPaymentMethod,
    })
    .expect(201);

  // make request to fetch the order by *ADMIN*
  const { body: fetchedOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set("Cookie", admin)
    .send()
    .expect(200);

  expect(fetchedOrder.id).toEqual(order.id);
});

it("returns an error if one user tries to fetch another users order", async () => {
  // Create a product
  const product = await buildProduct();

  const userId = new mongoose.Types.ObjectId().toHexString();
  const user = global.signin(userId);
  const anotherUser = global.signin();

  const { jsonCartItems, jsonShippingAddress, jsonPaymentMethod } = buildJSON(
    product,
    userId
  );

  // make a request to build an order with this product
  const { body: order } = await request(app)
    .post("/api/orders")
    .set("Cookie", user)
    .send({
      jsonCartItems: jsonCartItems,
      jsonShippingAddress: jsonShippingAddress,
      jsonPaymentMethod: jsonPaymentMethod,
    })
    .expect(201);

  // make request to fetch the order by *ANOTHER USER*
  await request(app)
    .get(`/api/orders/${order.id}`)
    .set("Cookie", anotherUser)
    .send()
    .expect(401);
});
