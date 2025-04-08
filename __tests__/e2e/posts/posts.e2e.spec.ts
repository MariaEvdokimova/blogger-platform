// @ts-ignore
import request from "supertest";
// @ts-ignore
import express from "express";

import { setupApp } from "../../../src/setup-app"
import { generateBasicAuthToken } from "../../utils/generate-admin-auth-token";
import { clearDb } from "../../utils/clear-db";
import { createPost } from "../../utils/posts/create-post";
import { POSTS_PATH } from "../../../src/core/paths/paths";
import { HttpStatus } from "../../../src/core/types/http-statuses";
import { getPostById } from "../../utils/posts/get-post-by-id";
import { runDB } from "../../../src/db/mongo.db";
import { SETTINGS } from "../../../src/core/settings/settings";

describe('POST API', () => {
  const app = express();
  setupApp(app);
 
  const adminToken = generateBasicAuthToken();

  beforeAll(async () => {
    await runDB(SETTINGS.MONGO_URL);
    await clearDb(app);
  });

  it('✅ Should create post; POST /posts', async () => {
    await createPost(app);
  })

  it('✅ Should return post list; GET /posts', async () => {
    await createPost(app);

    const postListResponse = await request(app)
      .get(POSTS_PATH)
      .expect(HttpStatus.Ok);

    expect(postListResponse.body).toBeInstanceOf(Array);
    expect(postListResponse.body).toHaveLength(2);
  });
  
  it('✅ Should return post by id; GET /posts/:id', async () => {
    const createdPost = await createPost(app);

    const getPost = await getPostById(app, createdPost.id);

    expect(getPost).toEqual({
      ...createdPost,
      id: expect.any(String),
      title: expect.any(String),
    });
  });

  it('✅ Should update post by id; PUT /posts/:id', async () => {
    //

  })
  it('✅ Should delete post by id; DELETE /posts/:id', async () => {
    const createdPost = await createPost(app);
    
    await request(app)
      .delete(`${POSTS_PATH}/${createdPost.id}`)
      .set('Authorization', adminToken)
      .expect(HttpStatus.NoContent);

    await request(app)
      .get(`${POSTS_PATH}/${createdPost.id}`)
      .set('Authorization', adminToken)
      .expect(HttpStatus.NotFound);
  })

});