import request from 'supertest';
import app from '../src/app';
import { ProductModel } from '../src/models/productModel';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

jest.mock('../src/models/productModel');

const mockProduct = {
  _id: new mongoose.Types.ObjectId().toString(),
  name: 'Sample Product',
  slug: 'sample-product',
  image: 'https://example.com/sample-image.jpg',
  images: ['https://example.com/sample-image1.jpg', 'https://example.com/sample-image2.jpg'],
  brand: 'Sample Brand',
  category: 'Sample Category',
  description: 'Sample Description',
  price: 100,
  countInStock: 10,
  rating: 4.5,
  numReviews: 10,
  reviews: [],
  isFeatured: false,
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

describe('GET /api/products', () => {
  it('should return latest and featured products', async () => {
    (ProductModel.aggregate as jest.Mock).mockResolvedValueOnce([
      // Mocked latest products
      { _id: new mongoose.Types.ObjectId(), name: 'Latest Product 1', image: 'image1.jpg', price: 100, category: 'Category', brand: 'Brand', description: 'Description' },
      { _id: new mongoose.Types.ObjectId(), name: 'Latest Product 2', image: 'image2.jpg', price: 200, category: 'Category', brand: 'Brand', description: 'Description' }
    ]).mockResolvedValueOnce([
      // Mocked featured products
      { _id: new mongoose.Types.ObjectId(), name: 'Featured Product 1', banner: 'banner1.jpg', slug: 'featured-product-1' },
      { _id: new mongoose.Types.ObjectId(), name: 'Featured Product 2', banner: 'banner2.jpg', slug: 'featured-product-2' }
    ]);

    const res = await request(app).get('/api/products');

    expect(res.status).toBe(200);
    expect(res.body.latestProducts).toHaveLength(2);
    expect(res.body.featuredProducts).toHaveLength(2);
  });
});


describe('GET /api/products/categories', () => {
  it('should return product categories', async () => {
    (ProductModel.find as jest.Mock).mockReturnValue({
      distinct: jest.fn().mockResolvedValue(['Sample Category']),
    });

    const res = await request(app).get('/api/products/categories');

    expect(res.status).toBe(200);
    expect(res.body).toEqual(['Sample Category']);
  });
});

describe('GET /api/products/slug/:slug', () => {
  it('should return a product if found by slug', async () => {
    (ProductModel.findOne as jest.Mock).mockResolvedValue(mockProduct);

    const res = await request(app).get(`/api/products/slug/${mockProduct.slug}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockProduct);
  });

  it('should return 404 if product not found by slug', async () => {
    (ProductModel.findOne as jest.Mock).mockResolvedValue(null);

    const res = await request(app).get(`/api/products/slug/invalid-slug`);

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ message: 'Product Not Found' });
  });
});

describe('GET /api/products/:id', () => {
  it('should return a product if found', async () => {
    (ProductModel.findById as jest.Mock).mockResolvedValue(mockProduct);

    const res = await request(app).get(`/api/products/${mockProduct._id}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockProduct);
  });

  it('should return 404 if product not found', async () => {
    (ProductModel.findById as jest.Mock).mockResolvedValue(null);

    const res = await request(app).get(`/api/products/${new mongoose.Types.ObjectId().toString()}`);

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ message: 'Product Not Found' });
  });
});

describe('POST /api/products', () => {
  it('should create a new product', async () => {
    (ProductModel.create as jest.Mock).mockResolvedValue(mockProduct);

    const res = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${mockToken}`)
      .send({
        name: 'Sample Product',
        slug: 'sample-product',
        image: 'https://example.com/sample-image.jpg',
        brand: 'Sample Brand',
        category: 'Sample Category',
        description: 'Sample Description',
        price: 100,
        countInStock: 10,
      });

    expect(res.status).toBe(201);
    expect(res.body).toEqual({
      message: 'Product Created',
      product: mockProduct,
    });
  });
});

describe('PUT /api/products/:id', () => {
  it('should update an existing product', async () => {
    const updatedProduct = { ...mockProduct, name: 'Updated Product' };
    (ProductModel.findById as jest.Mock).mockResolvedValue({
      ...mockProduct,
      save: jest.fn().mockResolvedValue(updatedProduct),
    });

    const res = await request(app)
      .put(`/api/products/${mockProduct._id}`)
      .set('Authorization', `Bearer ${mockToken}`)
      .send({ name: 'Updated Product' });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      message: 'Product Updated',
      product: updatedProduct,
    });
  });

  it('should return 404 if product to update not found', async () => {
    (ProductModel.findById as jest.Mock).mockResolvedValue(null);

    const res = await request(app)
      .put(`/api/products/${mockProduct._id}`)
      .set('Authorization', `Bearer ${mockToken}`)
      .send({ name: 'Updated Product' });

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ message: 'Product Not Found' });
  });
});

describe('DELETE /api/products/:id', () => {
  it('should delete an existing product', async () => {
    (ProductModel.findById as jest.Mock).mockResolvedValue({
      ...mockProduct,
      deleteOne: jest.fn().mockResolvedValue(mockProduct),
    });

    const res = await request(app)
      .delete(`/api/products/${mockProduct._id}`)
      .set('Authorization', `Bearer ${mockToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      message: 'Product Deleted',
      product: mockProduct,
    });
  });

  it('should return 404 if product to delete not found', async () => {
    (ProductModel.findById as jest.Mock).mockResolvedValue(null);

    const res = await request(app)
      .delete(`/api/products/${mockProduct._id}`)
      .set('Authorization', `Bearer ${mockToken}`);

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ message: 'Product Not Found' });
  });
});

describe('POST /api/products/:id/reviews', () => {

  it('should return 400 if review already exists', async () => {
    (ProductModel.findById as jest.Mock).mockResolvedValue({
      ...mockProduct,
      reviews: [{ name: 'testuser', rating: 5, comment: 'Great product!', createdAt: new Date() }],
    });

    const res = await request(app)
      .post(`/api/products/${mockProduct._id}/reviews`)
      .set('Authorization', `Bearer ${mockToken}`)
      .send({ rating: 5, comment: 'Great product!' });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ message: 'You already submitted a review' });
  });

  it('should return 404 if product to review not found', async () => {
    (ProductModel.findById as jest.Mock).mockResolvedValue(null);

    const res = await request(app)
      .post(`/api/products/${mockProduct._id}/reviews`)
      .set('Authorization', `Bearer ${mockToken}`)
      .send({ rating: 5, comment: 'Great product!' });

    expect(res.status).toBe(404);
    expect(res.body).toEqual({ message: 'Product Not Found' });
  });
});
