import mongoose from 'mongoose';
import { appConfig } from '../core/config/config';

export async function runDb() {
  try {
    await mongoose.connect(`${appConfig.MONGO_URL}/${appConfig.DB_NAME}`);
    console.log('Connected successfully to mongoDB server');
  } catch (error) {
    console.log("Can't connect to mongo server", error);
    await mongoose.disconnect();
  }
}
