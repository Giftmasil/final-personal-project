import express from 'express'
import { googleKey, paypalKey, stripeKey } from '../controllers/keyControllers'

const keyRouter = express.Router()

keyRouter.get('/paypal', paypalKey)

keyRouter.get('/google', googleKey)

keyRouter.get('/stripe', stripeKey)

export default keyRouter
