import cors from 'cors'
import path from 'path'
import dotenv from 'dotenv'
import express, { NextFunction, Request, Response } from 'express'
import mongoose from 'mongoose'
const PORT: number = Number(process.env.PORT) || 4000 
import { userRouter } from './routers/userRouter'
import { orderRouter } from './routers/orderRouter'
import { productRouter } from './routers/productRouter'
import keyRouter from './routers/keyRouter'

dotenv.config()

const app = express()
app.use(cors())


app.use(express.json())
app.use(express.urlencoded({ extended: true }))


const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://localhost/tsmernamazona'
mongoose.set('strictQuery', true)
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('connected to mongodb')
  })
  .catch(() => {
    console.log('error mongodb')
  })



app.use('/api/users', userRouter)
app.use('/api/products', productRouter)
app.use('/api/orders', orderRouter)
app.use('/api/keys', keyRouter)


app.use(express.static(path.join(__dirname, '../../frontend/dist')))
app.get('*', (req: Request, res: Response) =>
  res.sendFile(path.join(__dirname, '../../frontend/dist/index.html'))
)

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).send({ message: err.message })
  next()
})


app.listen(PORT, () => {
  console.log(`server started at http://localhost:${PORT}`)
})
