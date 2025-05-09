// @ts-ignore
import request from "supertest";
// @ts-ignore
import express from "express";

import { setupApp } from "../../../src/setup-app"
import { generateBasicAuthToken } from "../../utils/generate-admin-auth-token";
import { clearDb } from "../../utils/clear-db";
import { createPost } from "../../utils/posts/create-post";
import { AUTH_PATH, POSTS_PATH } from "../../../src/core/paths/paths";
import { HttpStatus } from "../../../src/core/types/http-statuses";
import { getPostById } from "../../utils/posts/get-post-by-id";
import { runDB } from "../../../src/db/mongo.db";
import { appConfig } from "../../../src/core/config/config";
import { PostInputDto } from "../../../src/posts/dto/post.input-dto";
import { createUser } from "../../utils/users/create-user";
import { UserInputDto } from "../../../src/users/dto/user.input-dto";
import { generateBearerAuthToken } from "../../utils/generate-berare-auth-token";

describe('POST API', () => {
  const app = express();
  setupApp(app);
 
  const adminToken = generateBasicAuthToken();

  beforeAll(async () => {
    await runDB(appConfig.MONGO_URL);
    await clearDb(app);
  });

  it('✅ Should create post; POST /posts', async () => {
    await createPost(app);
  })

  it('✅ Should return post list; GET /posts', async () => {
    await createPost(app);

    const postListResponse = await request(app)
      .get(POSTS_PATH)
      .expect(HttpStatus.Success);

    expect(postListResponse.body).toBeInstanceOf(Object);
    expect(postListResponse.body.items).toHaveLength(2);
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
    const createdPost = await createPost(app);
    const getPost = await getPostById(app, createdPost.id);

    const postUpdateData: PostInputDto = {
      title: 'new update post title',
      shortDescription: 'new update post Description',
      content: 'new update post content',
      blogId: getPost.blogId, 
    };

    await request(app)
      .put(`${POSTS_PATH}/${createdPost.id}`)
      .set('Authorization', adminToken)
      .send( postUpdateData )
      .expect(HttpStatus.NoContent);

    const getUpdatedPost = await getPostById(app, createdPost.id);

      expect(getUpdatedPost).toEqual({
        id: createdPost.id,
        title: postUpdateData.title,
        shortDescription: postUpdateData.shortDescription,
        content: postUpdateData.content,
        blogId: postUpdateData.blogId, 
        blogName: expect.any(String),
        createdAt: expect.any(String),
      })
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

  it('✅ Should create comment for post; POST /:postId/comments', async () => {
    const createdPost = await createPost(app);
    
    const newUser: UserInputDto = {
      login: "userPostCm",
      password: "123456789",
      email: "userPostComment@gmail.com"
    }

    const createdUser = await createUser(app, newUser);

    const token = await generateBearerAuthToken( createdUser.id );
    /* await request(app)
      .post(`${AUTH_PATH}/login`)
      .send({
        loginOrEmail: newUser.login,
        password: newUser.password
      })
      .expect(HttpStatus.Success)
*/
    const testCommentData = { 
      content: "test comment string test comment string test comment string test comment string test comment string"
    };

    await request(app)
      .post(`${POSTS_PATH}/${ createdPost.id }/comments`)
      .set('Authorization', token)
      .send(testCommentData)
      .expect(HttpStatus.Created);

    const createdCommentResponse = await request(app)
      .get(`${POSTS_PATH}/${ createdPost.id }/comments`)
      .set('Authorization', token)
      .expect(HttpStatus.Success);

    expect(createdCommentResponse.body.items[0].content).toEqual( testCommentData.content ); 
  })

});
