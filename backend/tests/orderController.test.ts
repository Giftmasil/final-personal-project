import request from 'supertest';
import app from '../src/app';
import { OrderModel } from '../src/models/orderModel';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

jest.mock('../src/models/orderModel');

const mockOrder = {
  _id: new mongoose.Types.ObjectId().toString(),
  orderItems: [
    {
      name: 'Product 1',
      quantity: 2,
      image: 'image1.jpg',
      price: 100,
      product: 'product1Id'
    }
  ],
  shippingAddress: {
    fullName: 'John Doe',
    address: '123 Main St',
    city: 'New York',
    postalCode: '10001',
    country: 'USA'
  },
  user: 'userId',
  paymentMethod: 'PayPal',
  itemsPrice: 200,
  shippingPrice: 20,
  taxPrice: 20,
  totalPrice: 240,
  isPaid: false,
  isDelivered: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

const mockToken = jwt.sign(
  {
    _id: 'someuserid',
    name: 'testuser',
    email: 'test@example.com',
    isAdmin: true,
  },
  process.env.JWT_SECRET || 'somethingsecret',
  {
    expiresIn: '30d',
  }
);

describe('GET /api/orders/:id', () => {
  it('should return an order if found', async () => {
    (OrderModel.findById as jest.Mock).mockResolvedValue(mockOrder);

    const res = await request(app)
      .get(`/api/orders/${mockOrder._id}`)
      .set('Authorization', `Bearer ${mockToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockOrder);
  });

  it('should return 404 if order not found', async () => {
    (OrderModel.findById as jest.Mock).mockResolvedValue(null);

    const res = await request(app)
      .get(`/api/orders/${mockOrder._id}`)
      .set('Authorization', `Bearer ${mockToken}`);

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ message: 'Order Not Found' });
  });
});

describe('POST /api/orders', () => {
  it('should create a new order if orderItems are provided', async () => {
    const newOrder = { ...mockOrder, _id: new mongoose.Types.ObjectId().toString() };
    (OrderModel.create as jest.Mock).mockResolvedValue(newOrder);

    const res = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${mockToken}`)
      .send(mockOrder);

    expect(res.status).toBe(201);
    expect(res.body).toEqual({
      message: 'Order Created',
      order: newOrder
    });
  });

  it('should return 400 if orderItems are empty', async () => {
    const res = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${mockToken}`)
      .send({ ...mockOrder, orderItems: [] });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ message: 'Cart is empty' });
  });
});

describe('DELETE /api/orders/:id', () => {
    it('should delete an order if found', async () => {
      (OrderModel.findByIdAndDelete as jest.Mock).mockResolvedValue(mockOrder);
  
      const res = await request(app)
        .delete(`/api/orders/${mockOrder._id}`)
        .set('Authorization', `Bearer ${mockToken}`);
  
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ message: 'Order Deleted', order: mockOrder });
    });
  
    it('should return 404 if order not found', async () => {
      (OrderModel.findByIdAndDelete as jest.Mock).mockResolvedValue(null);
  
      const res = await request(app)
        .delete(`/api/orders/${mockOrder._id}`)
        .set('Authorization', `Bearer ${mockToken}`);
  
      expect(res.status).toBe(404);
      expect(res.body).toEqual({ message: 'Order Not Found' });
    });
  });
  