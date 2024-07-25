import request from 'supertest';
import app from '../src/app';
import { UserModel } from '../src/models/userModel';
import bcrypt from 'bcryptjs';
import { generateToken } from '../src/utils';

jest.mock('../src/models/userModel');
jest.mock('bcryptjs');
jest.mock('../src/utils');

const mockUser = {
  _id: '60c72b2f5f1b2c0015b2c7d4',
  name: 'John Doe',
  email: 'john@example.com',
  password: 'hashedPassword',
  isAdmin: false,
};

describe('GET /api/users/:id', () => {
  it('should return a user if found', async () => {
    (UserModel.findById as jest.Mock).mockResolvedValue(mockUser);

    const res = await request(app).get('/api/users/60c72b2f5f1b2c0015b2c7d4');

    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockUser);
  });

  it('should return 404 if user not found', async () => {
    (UserModel.findById as jest.Mock).mockResolvedValue(null);

    const res = await request(app).get('/api/users/60c72b2f5f1b2c0015b2c7d4');

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ message: 'User Not Found' });
  });
});

describe('POST /api/users/signin', () => {
  it('should return user data and token if credentials are valid', async () => {
    (UserModel.findOne as jest.Mock).mockResolvedValue(mockUser);
    (bcrypt.compareSync as jest.Mock).mockReturnValue(true);
    (generateToken as jest.Mock).mockReturnValue('fakeToken');

    const res = await request(app)
      .post('/api/users/signin')
      .send({ email: 'john@example.com', password: 'password123' });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      _id: mockUser._id,
      name: mockUser.name,
      email: mockUser.email,
      isAdmin: mockUser.isAdmin,
      token: 'fakeToken',
    });
  });

  it('should return 401 if email is invalid', async () => {
    (UserModel.findOne as jest.Mock).mockResolvedValue(null);

    const res = await request(app)
      .post('/api/users/signin')
      .send({ email: 'invalid@example.com', password: 'password123' });

    expect(res.status).toBe(401);
    expect(res.body).toEqual({ message: 'Invalid email, user not found' });
  });

  it('should return 401 if password is invalid', async () => {
    (UserModel.findOne as jest.Mock).mockResolvedValue(mockUser);
    (bcrypt.compareSync as jest.Mock).mockReturnValue(false);

    const res = await request(app)
      .post('/api/users/signin')
      .send({ email: 'john@example.com', password: 'wrongPassword' });

    expect(res.status).toBe(401);
    expect(res.body).toEqual({ message: 'Invalid password' });
  });
});
