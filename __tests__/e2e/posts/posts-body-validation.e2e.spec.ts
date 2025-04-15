// @ts-ignore
import request from "supertest";
// @ts-ignore
import express from "express";

import { setupApp } from "../../../src/setup-app"
import { generateBasicAuthToken } from "../../utils/generate-admin-auth-token";
import { clearDb } from "../../utils/clear-db";
import { POSTS_PATH } from "../../../src/core/paths/paths";
import { HttpStatus } from "../../../src/core/types/http-statuses";
import { runDB, stopDb } from "../../../src/db/mongo.db";
import { SETTINGS } from "../../../src/core/settings/settings";


describe('Posts API body validation check', () => {
  const app = express();
  setupApp(app);
  
  const adminToken = generateBasicAuthToken();

  beforeAll(async () => {
    await runDB(SETTINGS.MONGO_URL);
    await clearDb(app);
  });

  afterAll(async () => {
    await stopDb();
  });

  it('❌ should not create post when incorrect body passed; POST /posts', async () => {
    await request(app)
      .post(POSTS_PATH)
      .send({})
      .expect(HttpStatus.Unauthorized);

    const invalidDataSet1 = await request(app)
    .post(POSTS_PATH)
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
      .get(POSTS_PATH)
      .set('Authorization', adminToken);

    expect(postListResponse.body.items).toEqual([]);
  });
});
