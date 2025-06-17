import cors from 'cors';
import express from "express";
import { setupApp } from "./setup-app";
import { appConfig } from "./core/config/config";
import { runDb } from './db/db';

const bootstrap = async () => {
  const app = express();
  
  app.use(cors());
  app.set('trust proxy', true);
  setupApp(app);
  
  const PORT = appConfig.PORT;

  await runDb();
  
  app.listen( PORT, () => {
    console.log(`Example app listening on port ${ PORT }`);
  });

  return app;
}
  
bootstrap();
