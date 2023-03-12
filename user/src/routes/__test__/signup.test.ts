import request from 'supertest';

import { app } from '../../app';

it('returns a 201 on successful signup', async () => {
  return await request(app)
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
});

it('returns a 400 with an invalid email', async () => {
  return await request(app)
    .post('/api/users/signup')
    .send({
      email: 'apparentlyNotAnEmail',
      password: 'password',
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
    .expect(400);
});

it('returns a 400 with an invalid password', async () => {
  return await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'p',
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
    .expect(400);
});

it('returns a 400 with missing email and password', async () => {
  return await request(app).post('/api/users/signup').send({}).expect(400);
});

it('not allow duplicate emails', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password',
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

  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password',
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
    .expect(400);
});

it('sets a cookie after successful signup', async () => {
  const response = await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password',
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

  expect(response.get('Set-Cookie')).toBeDefined();
});
