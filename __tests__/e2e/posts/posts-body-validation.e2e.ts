// @ts-ignore
import request from "supertest";
// @ts-ignore
import express from "express";

import { setupApp } from "../../../src/setup-app"
import { generateBasicAuthToken } from "../../utils/generate-admin-auth-token";
import { routersPaths } from "../../../src/core/paths/paths";
import { HttpStatus } from "../../../src/core/types/http-statuses";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";


describe('Posts API body validation check', () => {
  const app = express();
  setupApp(app);
  
  const adminToken = generateBasicAuthToken();

   beforeAll(async () => {
      const mongoServer = await MongoMemoryServer.create();
      await mongoose.connect(mongoServer.getUri());
    });
  
    beforeEach(async () => {
      await mongoose.connection.db?.dropDatabase()
    });
  
    afterAll(async () => {
      await mongoose.connection.dropDatabase(); // Cleanup
      await mongoose.disconnect(); // Proper mongoose disconnect
    });

  it('❌ should not create post when incorrect body passed; POST /posts', async () => {
    await request(app)
      .post(routersPaths.posts)
      .send({})
      .expect(HttpStatus.Unauthorized);

    const invalidDataSet1 = await request(app)
    .post(routersPaths.posts)
    .set('Authorization', adminToken)
    .send({
      title: '    ', //empty string
      shortDescription: 567, // not a string
      content: '   ', //empty string 
    })
    .expect(HttpStatus.BadRequest);

    // + Blog id is required
    expect(invalidDataSet1.body.errorsMessages).toHaveLength(4);

    // check not posts
    const postListResponse = await request(app)
      .get(routersPaths.posts)
      .set('Authorization', adminToken);

    expect(postListResponse.body.items).toEqual([]);
  });
});
