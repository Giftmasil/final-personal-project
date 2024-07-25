import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import express, { NextFunction, Request, Response } from 'express';
import { userRouter } from './routers/userRouter';
import { orderRouter } from './routers/orderRouter';
import { productRouter } from './routers/productRouter';
import keyRouter from './routers/keyRouter';

dotenv.config();

const app = express();
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/users', userRouter);
app.use('/api/products', productRouter);
app.use('/api/orders', orderRouter);
app.use('/api/keys', keyRouter);

app.use(express.static(path.join(__dirname, '../../frontend/dist')));
app.get('*', (req: Request, res: Response) =>
  res.sendFile(path.join(__dirname, '../../frontend/dist/index.html'))
);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).send({ message: err.message });
  next();
});

export default app;
