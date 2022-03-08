import mongoose from "mongoose";
import request from "supertest";
import { OrderStatus } from "@thasup-dev/common";

import { app } from "../../app";
import { Product, ProductDoc } from "../../models/product";
import { natsWrapper } from "../../NatsWrapper";

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
    orderId: undefined,
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

it("returns an error if some product in cart does not exist", async () => {
  // @ts-ignore
  const product: ProductDoc = {
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "Sample Dress",
    price: 1990,
    userId: new mongoose.Types.ObjectId().toHexString(),
    image: "./asset/sample.jpg",
    colors: "White,Black",
    sizes: "S,M,L",
    countInStock: 1,
    isReserved: false,
    orderId: undefined,
  };

  const userId = new mongoose.Types.ObjectId().toHexString();

  const { jsonCartItems, jsonShippingAddress, jsonPaymentMethod } = buildJSON(
    product,
    userId
  );

  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin(userId))
    .send({
      jsonCartItems: jsonCartItems,
      jsonShippingAddress: jsonShippingAddress,
      jsonPaymentMethod: jsonPaymentMethod,
    })
    .expect(404);
});

it("returns an error if the product is already reserved", async () => {
  // Only one product
  const product = await buildProduct();

  const userOneId = new mongoose.Types.ObjectId().toHexString();
  const userTwoId = new mongoose.Types.ObjectId().toHexString();

  const {
    jsonCartItems: jsonCartItemsUserOne,
    jsonShippingAddress: jsonShippingAddressUserOne,
    jsonPaymentMethod: jsonPaymentMethodUserOne,
  } = buildJSON(product, userOneId);

  const {
    jsonCartItems: jsonCartItemsUserTwo,
    jsonShippingAddress: jsonShippingAddressUserTwo,
    jsonPaymentMethod: jsonPaymentMethodUserTwo,
  } = buildJSON(product, userTwoId);

  // Reserved the product
  const { body: userOneOrder } = await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin(userOneId))
    .send({
      jsonCartItems: jsonCartItemsUserOne,
      jsonShippingAddress: jsonShippingAddressUserOne,
      jsonPaymentMethod: jsonPaymentMethodUserOne,
    })
    .expect(201);

  const updatedProduct = await Product.findById(product.id);
  updatedProduct!.set({
    isReserved: true,
    countInStock:
      product.countInStock - JSON.parse(jsonCartItemsUserOne)[0].qty,
    orderId: userOneOrder.id,
  });
  await updatedProduct!.save();

  const { body: userTwoOrder } = await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin(userTwoId))
    .send({
      jsonCartItems: jsonCartItemsUserTwo,
      jsonShippingAddress: jsonShippingAddressUserTwo,
      jsonPaymentMethod: jsonPaymentMethodUserTwo,
    })
    .expect(400);

  console.log();

  expect(updatedProduct?.isReserved).toEqual(true);
  expect(updatedProduct?.countInStock).toEqual(0);
  expect(updatedProduct?.orderId).toEqual(userOneOrder.id);
});

it("reserves a product", async () => {
  const product = await buildProduct();
  const userId = new mongoose.Types.ObjectId().toHexString();

  const { jsonCartItems, jsonShippingAddress, jsonPaymentMethod } = buildJSON(
    product,
    userId
  );

  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin(userId))
    .send({
      jsonCartItems: jsonCartItems,
      jsonShippingAddress: jsonShippingAddress,
      jsonPaymentMethod: jsonPaymentMethod,
    })
    .expect(201);
});

it("emits an order created event", async () => {
  const product = await buildProduct();
  const userId = new mongoose.Types.ObjectId().toHexString();

  const { jsonCartItems, jsonShippingAddress, jsonPaymentMethod } = buildJSON(
    product,
    userId
  );

  await request(app)
    .post("/api/orders")
    .set("Cookie", global.signin(userId))
    .send({
      jsonCartItems: jsonCartItems,
      jsonShippingAddress: jsonShippingAddress,
      jsonPaymentMethod: jsonPaymentMethod,
    })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
