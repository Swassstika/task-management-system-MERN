// C:/Users/Hp/task-management-system/task-management-system-backend/tests/auth.test.js

const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const User = require('../models/User');

// Dummy user data for testing
const dummyUser = {
  email: 'test@example.com',
  password: 'testpassword',
  name: 'Test User',
};

describe('Authentication Endpoints', () => {
  beforeAll(async () => {
    // Connect to the MongoDB test database
    const MONGODB_URI = 'mongodb://localhost:27017/task_management_test';
    await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  });

  afterAll(async () => {
    // Disconnect from the MongoDB test database
    await mongoose.connection.close();
  });

  let token;

  it('should register a new user', async () => {
    const response = await request(app).post('/auth/register').send(dummyUser);
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('token');
    token = response.body.token;
  });

  it('should not register a duplicate user', async () => {
    const response = await request(app).post('/auth/register').send(dummyUser);
    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('message', 'User already exists');
  });

  it('should log in an existing user', async () => {
    const response = await request(app).post('/auth/login').send(dummyUser);
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('token');
    token = response.body.token;
  });

  it('should not log in with incorrect credentials', async () => {
    const response = await request(app).post('/auth/login').send({
      email: 'wrongemail@example.com',
      password: 'wrongpassword',
    });
    expect(response.statusCode).toBe(401);
    expect(response.body).toHaveProperty('message', 'Invalid credentials');
  });
});
