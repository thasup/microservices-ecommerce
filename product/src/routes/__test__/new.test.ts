import request from "supertest";
import { app } from "../../app";

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

// it('creates a product with valid inputs', async () => {
//   let products = await Product.find({});
//   expect(products.length).toEqual(0);

//   const title = 'asldkfj';

//   await request(app)
//     .post('/api/products')
//     .set('Cookie', global.adminSignin())
//     .send({
//       title,
//       price: 20,
//     })
//     .expect(201);

//   products = await Product.find({});
//   expect(products.length).toEqual(1);
//   expect(products[0].price).toEqual(20);
//   expect(products[0].title).toEqual(title);
// });
