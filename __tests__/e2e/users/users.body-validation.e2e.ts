// @ts-ignore
import request from "supertest";
// @ts-ignore
import express from "express";

import { setupApp } from "../../../src/setup-app"
import { generateBasicAuthToken } from "../../utils/generate-admin-auth-token";
import { clearDb } from "../../utils/clear-db";
import { USERS_PATH } from "../../../src/core/paths/paths";
import { HttpStatus } from "../../../src/core/types/http-statuses";
import { runDB, stopDb } from "../../../src/db/mongo.db";
import { ObjectId } from "mongodb";
import { appConfig } from "../../../src/core/config/config";


describe('Users API body validation check', () => {
  const app = express();
  setupApp(app);
 
  const adminToken = generateBasicAuthToken();

  beforeAll(async () => {
    await runDB(appConfig.MONGO_URL);
    await clearDb(app);
  });

  afterAll(async () => {
    await stopDb();
  });

  it('❌ should not create user when incorrect body passed; POST /user', async () => {
    await request(app)
      .post(USERS_PATH)
      .send({
        login: "aaaaaa666",
        password: "string123",
        email: "example666@example.com"
      })
      .expect(HttpStatus.Unauthorized);

      const invalidDataSet1 = await request(app)
      .post(USERS_PATH)
      .set('Authorization', adminToken)
      .send({
        login: "a", //incorrect login
        password: "string123",
        email: "dkjfh" //incorrect email
      })
      .expect(HttpStatus.BadRequest);

      expect(invalidDataSet1.body.errorsMessages).toHaveLength(2);
      
      const correctDataSet2 = await request(app)
      .post(USERS_PATH)
      .set('Authorization', adminToken)
      .send({
        login: "aaaaaa666",
        password: "string123",
        email: "example666@example.com"
      })
      .expect(HttpStatus.Created);

      const invalidDataSet2 = await request(app)
      .post(USERS_PATH)
      .set('Authorization', adminToken)
      .send({
        login: "aaaaaa666", //the email address is not unique
        password: "string123",
        email: "example666@example.com"
      })
      .expect(HttpStatus.BadRequest);

      expect(invalidDataSet2.body.errorsMessages).toHaveLength(1);

    });

    it('❌ should not delete user when incorrect id; DELETE /users/:id', async () => {
      const nonExistentId = new ObjectId();

      const invalidDataSet1 = await request(app)
      .delete(`${USERS_PATH}/${nonExistentId}`)
      .set('Authorization', adminToken)
      .expect(HttpStatus.NotFound);
         
    });
})
