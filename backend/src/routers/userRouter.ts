import express from 'express'
import { isAdmin, isAuth } from '../utils'
import { adminDeleteUser, adminUpdateUser, getAllUsers, getSingleUser, signIn, signUp, updateProfile } from '../controllers/userController'

export const userRouter = express.Router()

userRouter.get('/:id', getSingleUser)

userRouter.get(
  '/',
  isAuth,
  isAdmin,
  getAllUsers
)

userRouter.post(
  '/signin',
  signIn
)

userRouter.post(
  '/signup',
  signUp
)

userRouter.put(
  '/profile',
  isAuth,
  updateProfile
)
userRouter.put(
  '/:id',
  isAuth,
  isAdmin,
  adminUpdateUser
)

userRouter.delete(
  '/:id',
  isAuth,
  isAdmin,
  adminDeleteUser
)
