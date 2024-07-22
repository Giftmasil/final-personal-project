import express from 'express';
import { isAdmin, isAuth } from '../utils';
import { createNewProduct, deleteSingleProduct, getAdminDashboardDetails, getAllProducts, getProductCategories, getSingleProductById, getSingleProductBySlug, postNewReview, searchForProducts, updateSingleProduct } from '../controllers/productController';

export const productRouter = express.Router();

productRouter.get(
  '/',
  getAllProducts
);

productRouter.get(
  '/search',
  searchForProducts
);

productRouter.get(
  '/admin',
  isAuth,
  isAdmin,
  getAdminDashboardDetails
);

productRouter.get(
  '/categories',
  getProductCategories
);

productRouter.get(
  '/slug/:slug',
  getSingleProductBySlug
);

productRouter.get(
  '/:id',
  getSingleProductById
);

productRouter.post(
  '/',
  isAuth,
  isAdmin,
  createNewProduct
);

productRouter.put(
  '/:id',
  isAuth,
  isAdmin,
  updateSingleProduct
);

productRouter.delete(
  '/:id',
  isAuth,
  isAdmin,
  deleteSingleProduct
);

productRouter.post(
  '/:id/reviews',
  isAuth,
  postNewReview
);