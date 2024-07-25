import mongoose from 'mongoose';
import dotenv from 'dotenv';
import app from './app';

dotenv.config();

const PORT: number = Number(process.env.PORT) || 4000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/tsmernamazona';

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('connected to mongodb');
    app.listen(PORT, () => {
      console.log(`server started at http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.log('error mongodb', error);
  });
