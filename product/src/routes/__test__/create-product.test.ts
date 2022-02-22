import request from "supertest";
import { app } from "../../app";
import { Product } from "../../models/product";

it("has a route handler listening to /api/products for post requests", async () => {
  const response = await request(app).post("/api/products").send({});

  expect(response.status).not.toEqual(404);
});

it("can NOT access if the user is NOT signing in", async () => {
  const response = await request(app).post("/api/products").send({});

  expect(response.status).toEqual(401);
});

it("can NOT access if the user who signed in is NOT an admin", async () => {
  const response = await request(app)
    .post("/api/products")
    .set("Cookie", global.signin())
    .send({});

  expect(response.status).toEqual(401);
});

it("returns a status other than 401 if the user is signed in", async () => {
  const response = await request(app)
    .post("/api/products")
    .set("Cookie", global.adminSignin())
    .send({});

  expect(response.status).not.toEqual(401);
});

it("returns an error if an invalid title is provided", async () => {
  await request(app)
    .post("/api/products")
    .set("Cookie", global.adminSignin())
    .send({
      title: "",
      price: 10,
    })
    .expect(400);

  await request(app)
    .post("/api/products")
    .set("Cookie", global.adminSignin())
    .send({
      price: 10,
    })
    .expect(400);
});

it("returns an error if an invalid price is provided", async () => {
  await request(app)
    .post("/api/products")
    .set("Cookie", global.adminSignin())
    .send({
      title: "good",
      price: -10,
    })
    .expect(400);

  await request(app)
    .post("/api/products")
    .set("Cookie", global.adminSignin())
    .send({
      title: "good",
    })
    .expect(400);
});

it("creates a product with valid inputs", async () => {
  let products = await Product.find({});
  expect(products.length).toEqual(0);

  const title = "Sample Dress";

  await request(app)
    .post("/api/products")
    .set("Cookie", global.adminSignin())
    .send({
      title,
      price: 1990,
      userId: "6214a0227e0d2db80ddb0860",
      image: "./asset/sample.jpg",
      colors: "White,Black",
      sizes: "S,M,L",
      brand: "Uniqlo",
      category: "Dress",
      material: "Polyester 100%",
      description:
        "Turpis nunc eget lorem dolor. Augue neque gravida in fermentum et. Blandit libero volutpat sed cras ornare arcu dui vivamus. Amet venenatis urna cursus eget nunc scelerisque viverra mauris.",
      // reviews,
      numReviews: 0,
      rating: 5,
      countInStock: 12,
    })
    .expect(201);

  products = await Product.find({});
  expect(products.length).toEqual(1);
  expect(products[0].price).toEqual(1990);
  expect(products[0].title).toEqual(title);
});
