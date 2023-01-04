import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";

const createProduct = (rating: number) => {
  const adminId = new mongoose.Types.ObjectId().toHexString();

  return request(app)
    .post("/api/products")
    .set("Cookie", global.adminSignin(adminId))
    .send({
      title: "Sample Dress",
      price: 99,
      userId: adminId,
      image1: "./asset/sample.jpg",
      colors: "White,Black",
      sizes: "S,M,L",
      brand: "Uniqlo",
      category: "Dress",
      material: "Polyester 100%",
      description:
        "Turpis nunc eget lorem dolor. Augue neque gravida in fermentum et. Blandit libero volutpat sed cras ornare arcu dui vivamus. Amet venenatis urna cursus eget nunc scelerisque viverra mauris.",
      numReviews: 0,
      rating: rating,
      countInStock: 12,
    });
};

it("return 404 if there are no product", async () => {
  await request(app)
    .get("/api/products/bestseller")
    .send()
    .expect(404);
});

it("can fetch a list of bestseller products", async () => {
  await createProduct(3);
  await createProduct(5);
  await createProduct(4);

  const response = await request(app)
    .get("/api/products/bestseller")
    .send()
    .expect(200);

  expect(response.body.length).toEqual(3);
  expect(response.body[0].rating).toEqual(5);
  expect(response.body[2].rating).toEqual(3);
});
