import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";
import { natsWrapper } from "../../NatsWrapper";
import { Product } from "../../models/product";

it("returns a 404 if the provided id does NOT exist", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .patch(`/api/products/${id}`)
    .set("Cookie", global.adminSignin())
    .send({
      title: "Sample Skirt",
      price: 690,
    })
    .expect(404);
});

it("returns a 401 if the user is NOT signing in", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .patch(`/api/products/${id}`)
    .send({
      title: "Sample Skirt",
      price: 690,
    })
    .expect(401);
});

it("returns a 401 if the user is NOT authenticated as an admin", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app)
    .patch(`/api/products/${id}`)
    .set("Cookie", global.signin())
    .send({
      title: "Sample Skirt",
      price: 690,
    })
    .expect(401);
});

it("returns a 400 if the admin user provides an invalid title or price", async () => {
  const cookie = global.adminSignin();

  const response = await request(app)
    .post("/api/products")
    .set("Cookie", cookie)
    .send({
      title: "Sample Dress",
      price: 1990,
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

  await request(app)
    .patch(`/api/products/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "",
      price: 1990,
    })
    .expect(400);

  await request(app)
    .patch(`/api/products/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "Sample Dress",
      price: -10,
    })
    .expect(400);
});

it("updates the product provided valid inputs as an admin user", async () => {
  const cookie = global.adminSignin();

  const response = await request(app)
    .post("/api/products")
    .set("Cookie", cookie)
    .send({
      title: "Sample Dress",
      price: 1990,
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

  await request(app)
    .patch(`/api/products/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "New Sample Cloth",
      price: 1790,
    })
    .expect(200);

  const productResponse = await request(app)
    .get(`/api/products/${response.body.id}`)
    .send();

  expect(productResponse.body.title).toEqual("New Sample Cloth");
  expect(productResponse.body.price).toEqual(1790);
});

it("publishes an event", async () => {
  const cookie = global.adminSignin();

  const response = await request(app)
    .post("/api/products")
    .set("Cookie", cookie)
    .send({
      title: "Sample Dress",
      price: 1990,
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

  await request(app)
    .patch(`/api/products/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      title: "Sample Dress 2",
      price: 590,
      userId: "6214a0227e0d2db80ddb0860",
      image1: "./asset/sample.jpg",
      colors: "White,Black",
      sizes: "S,M,L,XL",
      brand: "Uniqlo",
      category: "Dress",
      material: "Cotton 100%",
      description:
        "Turpis nunc eget lorem dolor. Augue neque gravida in fermentum et. Blandit libero volutpat sed cras ornare arcu dui vivamus. Amet venenatis urna cursus eget nunc scelerisque viverra mauris.",
      // reviews,
      numReviews: 0,
      rating: 4.5,
      countInStock: 6,
    })
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalledTimes(2);
});

it("rejects updates if the product is reserved", async () => {
  const cookie = global.adminSignin();

  // Create a product
  const response = await request(app)
    .post("/api/products")
    .set("Cookie", cookie)
    .send({
      title: "Sample Dress",
      price: 1990,
      userId: "6214a0227e0d2db80ddb0860",
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
      countInStock: 1,
    });

  const product = await Product.findById(response.body.id);
  product!.set({ orderId: new mongoose.Types.ObjectId().toHexString() });
  await product!.save();

  // Reject an update when product has an orderId (being reserved)
  await request(app)
    .patch(`/api/products/${response.body.id}`)
    .set("Cookie", cookie)
    .send({
      price: 1790,
    })
    .expect(400);
});
