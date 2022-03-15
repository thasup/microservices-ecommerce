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

it("fetches all orders by admin", async () => {
  // Create three products
  const productOne = await buildProduct();
  const productTwo = await buildProduct();
  const productThree = await buildProduct();

  const userOneId = new mongoose.Types.ObjectId().toHexString();
  const userTwoId = new mongoose.Types.ObjectId().toHexString();

  const userOne = global.signin(userOneId);
  const userTwo = global.signin(userTwoId);
  const admin = global.adminSignin();

  const {
    jsonCartItems: jsonCartItemsUserOne,
    jsonShippingAddress: jsonShippingAddressUserOne,
    jsonPaymentMethod: jsonPaymentMethodUserOne,
  } = buildJSON(productOne, userOneId);

  const {
    jsonCartItems: jsonCartItemsUserTwoOrderOne,
    jsonShippingAddress: jsonShippingAddressUserTwoOrderOne,
    jsonPaymentMethod: jsonPaymentMethodUserTwoOrderOne,
  } = buildJSON(productTwo, userTwoId);

  const {
    jsonCartItems: jsonCartItemsUserTwoOrderTwo,
    jsonShippingAddress: jsonShippingAddressUserTwoOrderTwo,
    jsonPaymentMethod: jsonPaymentMethodUserTwoOrderTwo,
  } = buildJSON(productThree, userTwoId);

  // Create one order as User #1
  const { body: orderOneForUserOne } = await request(app)
    .post("/api/orders")
    .set("Cookie", userOne)
    .send({
      jsonCartItems: jsonCartItemsUserOne,
      jsonShippingAddress: jsonShippingAddressUserOne,
      jsonPaymentMethod: jsonPaymentMethodUserOne,
    })
    .expect(201);

  // Create two orders as User #2
  const { body: orderOneForUserTwo } = await request(app)
    .post("/api/orders")
    .set("Cookie", userTwo)
    .send({
      jsonCartItems: jsonCartItemsUserTwoOrderOne,
      jsonShippingAddress: jsonShippingAddressUserTwoOrderOne,
      jsonPaymentMethod: jsonPaymentMethodUserTwoOrderOne,
    })
    .expect(201);

  const { body: orderTwoForUserTwo } = await request(app)
    .post("/api/orders")
    .set("Cookie", userTwo)
    .send({
      jsonCartItems: jsonCartItemsUserTwoOrderTwo,
      jsonShippingAddress: jsonShippingAddressUserTwoOrderTwo,
      jsonPaymentMethod: jsonPaymentMethodUserTwoOrderTwo,
    })
    .expect(201);

  // Make request to get all orders by *ADMIN*
  const response = await request(app)
    .get("/api/orders")
    .set("Cookie", admin)
    .expect(200);

  // Make sure we got all orders for admin
  expect(response.body.length).toEqual(3);
  expect(response.body[0].id).toEqual(orderOneForUserOne.id);
  expect(response.body[1].id).toEqual(orderOneForUserTwo.id);
  expect(response.body[2].id).toEqual(orderTwoForUserTwo.id);
  expect(response.body[0].cart[0].productId).toEqual(productOne.id);
  expect(response.body[1].cart[0].productId).toEqual(productTwo.id);
  expect(response.body[2].cart[0].productId).toEqual(productThree.id);
});
