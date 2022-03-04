import mongoose from "mongoose";
import request from "supertest";

import { app } from "../../app";
import { Product } from "../../models/product";

const buildProduct = async (qty?: number) => {
  const product = Product.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: "Sample Dress",
    price: 1990,
    userId: new mongoose.Types.ObjectId().toHexString(),
    image: "./asset/sample.jpg",
    colors: "White,Black",
    sizes: "S,M,L",
    countInStock: qty || 1,
  });
  await product.save();

  return product;
};

it("return 400 if the productId is not valid", async () => {
  await buildProduct();

  await request(app)
    .post(`/api/orders/${"notValidProductId"}/cart`)
    .set("Cookie", global.signin())
    .send({
      qty: 1,
      discount: "",
    })
    .expect(400);
});

it("returns 201 if the product is successfully added to cart", async () => {
  const productOne = await buildProduct();

  await request(app)
    .post(`/api/orders/${productOne.id}/cart`)
    .set("Cookie", global.signin())
    .send({
      qty: 1,
      discount: "FREE",
    })
    .expect(201);
});

it("has two product in cart", async () => {
  const productOne = await buildProduct();
  const productTwo = await buildProduct();

  const userId = new mongoose.Types.ObjectId().toHexString();

  const cartOne = await request(app)
    .post(`/api/orders/${productOne.id}/cart`)
    .set("Cookie", global.signin(userId))
    .send({
      qty: 1,
      discount: "",
    });

  const cartTwo = await request(app)
    .post(`/api/orders/${productTwo.id}/cart`)
    .set("Cookie", global.signin(userId))
    .send({
      qty: 1,
      discount: "",
    });

  expect(cartOne).toBeDefined();
  expect(cartTwo).toBeDefined();
});

it("allow many user to add the same product", async () => {
  const productOne = await buildProduct();

  const userOne = global.signin();
  const userTwo = global.signin();
  const userThree = global.signin();

  await request(app)
    .post(`/api/orders/${productOne.id}/cart`)
    .set("Cookie", userOne)
    .send({
      qty: 1,
      discount: "HOTDEAL",
    })
    .expect(201);

  await request(app)
    .post(`/api/orders/${productOne.id}/cart`)
    .set("Cookie", userTwo)
    .send({
      qty: 1,
      discount: "GRANDSALE",
    })
    .expect(201);

  await request(app)
    .post(`/api/orders/${productOne.id}/cart`)
    .set("Cookie", userThree)
    .send({
      qty: 1,
      discount: "",
    })
    .expect(201);
});

it("returns 400 if the user try to add the same product", async () => {
  const productOne = await buildProduct();

  const userOne = global.signin();

  await request(app)
    .post(`/api/orders/${productOne.id}/cart`)
    .set("Cookie", userOne)
    .send({
      qty: 1,
      discount: "",
    });

  const cart = await request(app)
    .post(`/api/orders/${productOne.id}/cart`)
    .set("Cookie", userOne)
    .send({
      qty: 1,
      discount: "GRANDSALE",
    })
    .expect(400);
});

it("returns 200 if the user change quantity of the product", async () => {
  const productOne = await buildProduct(2);

  const userOne = global.signin();

  await request(app)
    .post(`/api/orders/${productOne.id}/cart`)
    .set("Cookie", userOne)
    .send({
      qty: 1,
      discount: "",
    });

  const cart = await request(app)
    .post(`/api/orders/${productOne.id}/cart`)
    .set("Cookie", userOne)
    .send({
      qty: 2,
      discount: "GRANDSALE",
    })
    .expect(200);

  expect(cart).toBeDefined();
  expect(cart.body.qty).toEqual(2);
});

// it("returns 200 if the product is already added to cart by the same user", async () => {
//   const product = Product.build({
//     id: new mongoose.Types.ObjectId().toHexString(),
//     title: "Sample Dress",
//     price: 1990,
//     userId: new mongoose.Types.ObjectId().toHexString(),
//     image: "./asset/sample.jpg",
//     colors: "White,Black",
//     sizes: "S,M,L",
//     countInStock: 1,
//   });
//   await product.save();

//   await request(app)
//     .post("/api/orders")
//     .set("Cookie", global.signin())
//     .send({
//       address: "sunset villa",
//       city: "New York",
//       postalCode: "24341",
//       country: "USA",
//       paymentMethod: "stripe",
//     })
//     .expect(201);
// });

// it("emits an order created event", async () => {
//   const product = Product.build({
//     id: new mongoose.Types.ObjectId().toHexString(),
//     title: "Sample Dress",
//     price: 1990,
//     userId: new mongoose.Types.ObjectId().toHexString(),
//     image: "./asset/sample.jpg",
//     colors: "White,Black",
//     sizes: "S,M,L",
//     countInStock: 1,
//   });
//   await product.save();

//   // make a request to create an order
//   await request(app)
//     .post("/api/orders")
//     .set("Cookie", global.signin())
//     .send({
//       address: "sunset villa",
//       city: "New York",
//       postalCode: "24341",
//       country: "USA",
//       paymentMethod: "stripe",
//     })
//     .expect(201);

//   expect(natsWrapper.client.publish).toHaveBeenCalled();
// });
