import dotenv from 'dotenv';

dotenv.config();

export const SETTINGS = {
  PORT: process.env.PORT || 5001,
  MONGO_URL: process.env.MONGO_URL || 'mongodb+srv://admin:admin@blogger-platform-dev-cl.vojnv73.mongodb.net/?retryWrites=true&w=majority&appName=blogger-platform-dev-cluster',
  DB_NAME: process.env.DB_NAME || 'test',
}
