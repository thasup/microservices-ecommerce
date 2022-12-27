import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";
import { User } from "../../models/user";

const createUser = async (email?: string) => {
  const { body: user } = await request(app)
    .post("/api/users/signup")
    .send({
      email: email || "test@test.com",
      password: "password",
      isAdmin: true,
      name: "Geralt of Rivia",
      gender: "male",
      age: 45,
      bio: "I'm the witcher!",
      shippingAddress: {
        address: "Crossroad Inn",
        city: "Novigrad",
        postalCode: "9999",
        country: "Temaria",
      },
    });

  return user;
};

it("return 404 when the user data is not found", async () => {
  // Create a user
  await createUser();

  const anotherUserId = new mongoose.Types.ObjectId().toHexString();

  // Make an update request
  await request(app)
    .patch(`/api/users/${anotherUserId}`)
    .send({
      age: 60,
      bio: "I'm retired from witcher career",
    })
    .expect(404);
});

it("return 400 with an invalid age", async () => {
  // Create a user
  const user = await createUser();

  // Make an update request
  await request(app)
    .patch(`/api/users/${user.id}`)
    .send({
      age: 0,
    })
    .expect(400);
});

it("return 400 with an invalid email", async () => {
  // Create a user
  const user = await createUser();

  // Make an update request
  await request(app)
    .patch(`/api/users/${user.id}`)
    .send({
      email: "gg",
    })
    .expect(400);
});

it("return 400 with an invalid password", async () => {
  // Create a user
  const user = await createUser();

  // Make an update request
  await request(app)
    .patch(`/api/users/${user.id}`)
    .send({
      password: 0,
    })
    .expect(400);
});

it("return 200 when make a request to edit profile information", async () => {
  // Create a user
  const user = await createUser();

  // Make an update request
  await request(app)
    .patch(`/api/users/${user.id}`)
    .send({
      email: user.email,
      isAdmin: user.isAdmin,
      name: "Geralt of Rivia the glorious",
      image: "https://joeschmoe.io/api/v1/male/geralt",
      gender: "female",
      age: 60,
      bio: "I'm retired from witcher career",
      jsonShippingAddress: user.shippingAddress,
    })
    .expect(200);

  // Find the updated user
  const updatedUser = await User.findById(user.id);

  expect(updatedUser).toBeDefined();
  expect(updatedUser!.name).toEqual("Geralt of Rivia the glorious");
  expect(updatedUser!.image).toEqual("https://joeschmoe.io/api/v1/male/geralt");
  expect(updatedUser!.gender).toEqual("female");
  expect(updatedUser!.age).toEqual(60);
  expect(updatedUser!.bio).toEqual("I'm retired from witcher career");
});

it("return 400 when make a request to edit an email with invalid password", async () => {
  // Create a user
  const user = await createUser();

  // Make an update request
  await request(app)
    .patch(`/api/users/${user.id}`)
    .send({
      email: "test2@test.com",
      password: "wrongPassword",
      isAdmin: user.isAdmin,
      name: user.name,
      image: user.image,
      gender: user.gender,
      age: user.age,
      bio: user.bio,
      jsonShippingAddress: user.shippingAddress,
    })
    .expect(400);
});

it("return 200 when make a request to edit an email", async () => {
  // Create a user
  const user = await createUser();

  // Make an update request
  await request(app)
    .patch(`/api/users/${user.id}`)
    .send({
      email: "test2@test.com",
      password: "password",
      isAdmin: user.isAdmin,
      name: user.name,
      image: user.image,
      gender: user.gender,
      age: user.age,
      bio: user.bio,
      jsonShippingAddress: user.shippingAddress,
    })
    .expect(200);

  // Find the updated user
  const updatedUser = await User.findById(user.id);

  expect(updatedUser).toBeDefined();
  expect(updatedUser!.email).toEqual("test2@test.com");
});

it("return 200 when make a request to edit the password", async () => {
  // Create a user
  const user = await createUser();

  // Make an update request
  await request(app)
    .patch(`/api/users/${user.id}`)
    .send({
      email: "test2@test.com",
      password: "password",
      newPassword: "newPassword",
      isAdmin: user.isAdmin,
      name: user.name,
      image: user.image,
      gender: user.gender,
      age: user.age,
      bio: user.bio,
      jsonShippingAddress: user.shippingAddress,
    })
    .expect(200);

  // Find the updated user
  const updatedUser = await User.findById(user.id);

  expect(updatedUser).toBeDefined();
  expect(updatedUser!.password).not.toEqual(user.password);
});

it("return 200 when make a request to edit the address", async () => {
  // Create a user
  const user = await createUser();

  // Make an update request
  await request(app)
    .patch(`/api/users/${user.id}`)
    .send({
      jsonShippingAddress: JSON.stringify({
        address: "under the oak tree",
        city: "Valen",
        postalCode: "8888",
        country: "the Northern Kingdom",
      }),
    })
    .expect(200);

  // Find the updated user
  const updatedUser = await User.findById(user.id);

  expect(updatedUser).toBeDefined();
  expect(updatedUser!.shippingAddress?.address).toEqual("under the oak tree");
  expect(updatedUser!.shippingAddress?.city).toEqual("Valen");
  expect(updatedUser!.shippingAddress?.postalCode).toEqual("8888");
  expect(updatedUser!.shippingAddress?.country).toEqual("the Northern Kingdom");
});
