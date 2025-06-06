import cors from 'cors';
import express from "express";
import { setupApp } from "./setup-app";
import { appConfig } from "./core/config/config";
import { runDB } from "./db/mongo.db";

const bootstrap = async () => {
  const app = express();
  
  app.use(cors());
  app.set('trust proxy', true);
  setupApp(app);
  
  const PORT = appConfig.PORT;

  await runDB( appConfig.MONGO_URL );
  //await initIndexes();
  
  app.listen( PORT, () => {
    console.log(`Example app listening on port ${ PORT }`);
  });

  return app;
}
  
bootstrap();
