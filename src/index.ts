import cors from 'cors';
import express from "express";
import { setupApp } from "./setup-app";
import { SETTINGS } from "./core/settings/settings";
import { runDB } from "./db/mongo.db";

const bootstrap = async () => {
  const app = express();
  
  app.use(cors());
  
  setupApp(app);
  
  const PORT = SETTINGS.PORT;

  await runDB( SETTINGS.MONGO_URL );
  
  app.listen( PORT, () => {
    console.log(`Example app listening on port ${ PORT }`);
  });

  return app;
}
  
bootstrap();
