import request from 'supertest';
import { app } from '../index.js';
import { auth } from '../config/firebase.js';

// Mock Firebase Auth
jest.mock('../config/firebase.js', () => ({
  auth: {
    createUser: jest.fn(),
    createCustomToken: jest.fn(),
  },
}));

describe('API Endpoints', () => {
  describe('User Routes', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    describe('POST /api/users/register', () => {
      it('should register a new user with valid data', async () => {
        const userData = {
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123'
        };

        auth.createUser.mockResolvedValueOnce({
          uid: 'test-uid',
          email: userData.email,
        });

        auth.createCustomToken.mockResolvedValueOnce('test-token');

        const res = await request(app)
          .post('/api/users/register')
          .send(userData);

        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('token');
        expect(res.body).toHaveProperty('_id');
        expect(res.body.email).toBe(userData.email);
      });

      it('should return 400 if required fields are missing', async () => {
        const res = await request(app)
          .post('/api/users/register')
          .send({ email: 'test@example.com' });

        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('message');
      });

      it('should handle duplicate email registration', async () => {
        auth.createUser.mockRejectedValueOnce({
          code: 'auth/email-already-exists'
        });

        const res = await request(app)
          .post('/api/users/register')
          .send({
            name: 'Test User',
            email: 'existing@example.com',
            password: 'password123'
          });

        expect(res.status).toBe(400);
        expect(res.body.message).toBe('User already exists');
      });
    });
  });
});