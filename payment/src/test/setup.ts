import jwt from 'jsonwebtoken';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

declare global {
  var signin: (userId?: string) => string[];
  var adminSignin: (userId?: string) => string[];
}

jest.mock('../NatsWrapper');
// jest.mock("../stripe");

process.env.STRIPE_KEY =
  'sk_test_51KYCbpCqypc6uabtqqhd5R6cl7nl25a1lNwQOIBNJlyFISVZbIwy9t50Zqvnl2fdKBTShQxMZ8cLCdXsBJKuDYhu00cwUU9fcm';

let mongo: any;

beforeAll(async () => {
  process.env.JWT_KEY = 'missiontothemoon';

  mongo = await MongoMemoryServer.create();
  const mongoURI = mongo.getUri();

  await mongoose.connect(mongoURI);
});

beforeEach(async () => {
  jest.clearAllMocks();
  const collections = await mongoose.connection.db.collections();

  for (const collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongo.stop();
});

global.signin = (userId?: string) => {
  // Build a JWT payload.  { id, email }
  const payload = {
    id: userId ?? new mongoose.Types.ObjectId().toHexString(),
    email: 'test@test.com',
    password: 'password',
    isAdmin: false
  };

  // Create the JWT!
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  // Build session Object. { jwt: MY_JWT }
  const session = { jwt: token };

  // Turn that session into JSON
  const sessionJSON = JSON.stringify(session);

  // Take JSON and encode it as base64
  const base64 = Buffer.from(sessionJSON).toString('base64');

  // return a string thats the cookie with the encoded data
  return [`session=${base64}`];
};

global.adminSignin = (userId?: string) => {
  // Build a JWT payload.  { id, email }
  const payload = {
    id: userId ?? new mongoose.Types.ObjectId().toHexString(),
    email: 'test@test.com',
    password: 'password',
    isAdmin: true
  };

  // Create the JWT!
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  // Build session Object. { jwt: MY_JWT }
  const session = { jwt: token };

  // Turn that session into JSON
  const sessionJSON = JSON.stringify(session);

  // Take JSON and encode it as base64
  const base64 = Buffer.from(sessionJSON).toString('base64');

  // return a string thats the cookie with the encoded data
  return [`session=${base64}`];
};
