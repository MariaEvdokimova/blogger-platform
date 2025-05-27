import dotenv from 'dotenv';

dotenv.config();

export const appConfig = {
  PORT: process.env.PORT || 5001,
  MONGO_URL: process.env.MONGO_URL || 'mongodb+srv://admin:admin@blogger-platform-dev-cl.vojnv73.mongodb.net/?retryWrites=true&w=majority&appName=blogger-platform-dev-cluster',
  DB_NAME: process.env.DB_NAME || 'test',
  JWT_SECRET: process.env.JWT_SECRET as string,
  JWT_TIME: +process.env.JWT_TIME! as number,
  R_JWT_SECRET: process.env.R_JWT_SECRET as string,
  R_JWT_TIME: +process.env.R_JWT_TIME! as number,
  EMAIL: process.env.EMAIL as string,
  EMAIL_PASS: process.env.EMAIL_PASS as string,
  EMAIL_HOST: process.env.EMAIL_HOST as string,
  EMAIL_PORT: +process.env.EMAIL_PORT! as number,
  COST_FACTOR: +process.env.COST_FACTOR! as number,
}
