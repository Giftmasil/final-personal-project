import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  // Connect to the in-memory MongoDB server
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(uri);
  }
});

afterAll(async () => {
  // Only drop and close if there's an active connection
  if (mongoose.connection.readyState === 1) {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  }
  await mongoServer.stop();
});
