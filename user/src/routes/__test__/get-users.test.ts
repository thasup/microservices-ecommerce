import request from 'supertest';

import { app } from '../../app';

it('return 404 when users data is empty', async () => {
  await request(app).get('/api/users').send({}).expect(404);
});

it('return 200 when make a successful request', async () => {
  await request(app)
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
    })
    .expect(201);

  const { body: users } = await request(app)
    .get('/api/users')
    .send({})
    .expect(200);

  expect(users.length).toEqual(1);
  expect(users[0].email).toBeDefined();
});
