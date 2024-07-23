import express from 'express'
import { isAdmin, isAuth } from '../utils'
import { createNewOrder, deleteSingleOrder, deliverSingleOrder, findSingleUserOrders, getAllOrders, getAllOrdersSummary, getSingleOrder, payForOrderWithPayPal, payForOrderWithStripe } from '../controllers/orderController'

export const orderRouter = express.Router()

orderRouter.get(
  '/',
  isAuth,
  isAdmin,
  getAllOrders
)

orderRouter.get(
  '/summary',
  isAuth,
  isAdmin,
  getAllOrdersSummary
)

orderRouter.get(
  '/mine',
  isAuth,
  findSingleUserOrders
)

orderRouter.post(
  '/',
  isAuth,
  createNewOrder
)

orderRouter.get(
  '/:id',
  isAuth,
  getSingleOrder
)

orderRouter.post(
  '/:id/stripe-payment-intent',
  payForOrderWithStripe
)

orderRouter.put(
  '/:id/pay',
  isAuth,
  payForOrderWithPayPal
)

orderRouter.delete(
  '/:id',
  isAuth,
  isAdmin,
  deleteSingleOrder
)

orderRouter.put(
  '/:id/deliver',
  isAuth,
  isAdmin,
  deliverSingleOrder
)
