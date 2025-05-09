// @ts-ignore
import request from "supertest";
// @ts-ignore
import express from "express";
import { setupApp } from "../../../src/setup-app";
import { runDB } from "../../../src/db/mongo.db";
import { appConfig } from "../../../src/core/config/config";
import { clearDb } from "../../utils/clear-db";

describe('Comments API', () => {
  const app = express();
  setupApp(app);
 
  //const adminToken = generateBasicAuthToken();

  beforeAll(async () => {
    await runDB(appConfig.MONGO_URL);
    await clearDb(app);
});

  describe('GET /comments/:id', () => {
    it('✅ Should get comment by id', () => {
      // ...
    });
  });

  describe('PUT /comments/:id', () => {
    it('✅ Should update comment by id', () => {
      // ...
    });
  });

  describe('DELETE /comments/:id', () => {
    it('✅ Should delete comment by id', () => {
      // ...
    });
  });

});
