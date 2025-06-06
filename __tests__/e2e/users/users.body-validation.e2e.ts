// @ts-ignore
import request from "supertest";
// @ts-ignore
import express from "express";

import { setupApp } from "../../../src/setup-app"
import { generateBasicAuthToken } from "../../utils/generate-admin-auth-token";
import { routersPaths } from "../../../src/core/paths/paths";
import { HttpStatus } from "../../../src/core/types/http-statuses";
import { dropDb, runDB, stopDb } from "../../../src/db/mongo.db";
import { ObjectId } from "mongodb";
import { MongoMemoryServer } from "mongodb-memory-server";


describe('Users API body validation check', () => {
  const app = express();
  setupApp(app);
 
  const adminToken = generateBasicAuthToken();

   beforeAll(async () => {
      const mongoServer = await MongoMemoryServer.create();
      await runDB(mongoServer.getUri());
    });
  
    beforeEach(async () => {
      await dropDb();
    });
  
    afterAll(async () => {
      await stopDb();
    });
  
    afterAll(done => {
      done();
    });

  it('❌ should not create user when incorrect body passed; POST /user', async () => {
    await request(app)
      .post(routersPaths.users)
      .send({
        login: "aaaaaa666",
        password: "string123",
        email: "example666@example.com"
      })
      .expect(HttpStatus.Unauthorized);

      const invalidDataSet1 = await request(app)
      .post(routersPaths.users)
      .set('Authorization', adminToken)
      .send({
        login: "a", //incorrect login
        password: "string123",
        email: "dkjfh" //incorrect email
      })
      .expect(HttpStatus.BadRequest);

      expect(invalidDataSet1.body.errorsMessages).toHaveLength(2);
      
      await request(app)
      .post(routersPaths.users)
      .set('Authorization', adminToken)
      .send({
        login: "aaaaaa666",
        password: "string123",
        email: "example666@example.com"
      })
      .expect(HttpStatus.Created);

      const invalidDataSet2 = await request(app)
      .post(routersPaths.users)
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
      .delete(`${routersPaths.users}/${nonExistentId}`)
      .set('Authorization', adminToken)
      .expect(HttpStatus.NotFound);
         
    });
})
