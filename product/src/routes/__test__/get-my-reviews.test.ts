import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";

const createProduct = async () => {
  const adminId = new mongoose.Types.ObjectId().toHexString();

  const { body: product } = await request(app)
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
      rating: 0,
      countInStock: 12,
    });
  return product;
};

it("returns an empty array if the user does not have any review", async () => {
  const response = await request(app)
		.get("/api/products/myreviews")
		.set("Cookie", global.signin())
		.send({})
		.expect(200);

	expect(response.body.length).toBe(0)
});

it("returns 200 if the review has found", async () => {
  // Create a product
  const product = await createProduct();
	const userId = new mongoose.Types.ObjectId().toHexString();

  // Make a post request
  await request(app)
		.post(`/api/products/${product.id}/reviews`)
		.set("Cookie", global.signin(userId))
		.send({
			title: "Good Quality",
			rating: 5,
			comment:
				"Purus semper eget duis at tellus. Ut placerat orci nulla pellentesque dignissim enim.",
		})
		.expect(201);

  // Get my reviews
	const response = await request(app)
		.get("/api/products/myreviews")
		.set("Cookie", global.signin(userId))
		.send({})
		.expect(200);

  expect(response.body).toBeDefined();
  expect(response.body.length).toBe(1);
  expect(response.body[0].title).toEqual("Good Quality");
  expect(response.body[0].rating).toEqual(5);
  expect(response.body[0].comment).toEqual(
    "Purus semper eget duis at tellus. Ut placerat orci nulla pellentesque dignissim enim."
  );
});
