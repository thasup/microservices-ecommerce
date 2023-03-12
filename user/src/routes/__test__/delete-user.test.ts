import mongoose from 'mongoose';
import request from 'supertest';

import { app } from '../../app';
import { User } from '../../models/user';
import type { UserDoc } from '../../types/user';

const createUser = async (): Promise<UserDoc> => {
  const { body: user } = await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password',
      isAdmin: true,
      name: 'Geralt of Rivia',
      gender: 'male',
      age: 45,
      bio: "I'm the witcher!",
      shippingAddress: {
        address: 'Crossroad Inn',
        city: 'Novigrad',
        postalCode: '9999',
        country: 'Temaria'
      }
    });
  return user;
};

it('return 404 when the user data is not found', async () => {
  const anotherUserId = new mongoose.Types.ObjectId().toHexString();

  // Make a delete request
  await request(app).delete(`/api/users/${anotherUserId}`).send({}).expect(404);
});

it('return 200 when make a successful request', async () => {
  // Create a user
  const user = await createUser();

  // Make a delete request
  await request(app).delete(`/api/users/${user.id as string}`).send({}).expect(200);

  // Find the deleted user
  const deletedUser = await User.findById(user.id);

  expect(deletedUser).toEqual(null);
});
