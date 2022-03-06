import request from "supertest";
import { app } from "../../app";

const createProduct = () => {
  return request(app)
    .post("/api/products")
    .set("Cookie", global.adminSignin())
    .send({
      title: "sample",
      price: 20,
      userId: "6214a0227e0d2db80ddb0860",
      image1: "./asset/sample.jpg",
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
    });
};

it("can fetch a list of products", async () => {
  await createProduct();
  await createProduct();
  await createProduct();

  const response = await request(app).get("/api/products").send().expect(200);

  expect(response.body.length).toEqual(3);
});
