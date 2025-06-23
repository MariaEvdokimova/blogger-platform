// @ts-ignore
import request from "supertest";
// @ts-ignore
import express from "express";

import { setupApp } from "../../../src/setup-app"
import { generateBasicAuthToken } from "../../utils/generate-admin-auth-token";
import { createPost } from "../../utils/posts/create-post";
import { routersPaths } from "../../../src/core/paths/paths";
import { HttpStatus } from "../../../src/core/types/http-statuses";
import { getPostById } from "../../utils/posts/get-post-by-id";
import { PostInputDto } from "../../../src/posts/dto/post.input-dto";
import { createUser } from "../../utils/users/create-user";
import { UserInputDto } from "../../../src/users/dto/user.input-dto";
import { generateBearerAuthToken } from "../../utils/generate-berare-auth-token";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { createBlog } from "../../utils/blogs/create-blog";
import { LikeStatus } from "../../../src/posts/domain/likes.entity";

describe('POST API', () => {
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

  it('✅ Should create post; POST /posts', async () => {
    await createPost(app);
  })

  it('✅ Should return post list; GET /posts', async () => {
    await createPost(app);

    const postListResponse = await request(app)
      .get(routersPaths.posts)
      .expect(HttpStatus.Success);

    expect(postListResponse.body).toBeInstanceOf(Object);
    expect(postListResponse.body.items).toHaveLength(1);
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
      .put(`${routersPaths.posts}/${createdPost.id}`)
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
        extendedLikesInfo: expect.any(Object),
      })
    })

  it('✅ Should delete post by id; DELETE /posts/:id', async () => {
    const createdPost = await createPost(app);
    
    await request(app)
      .delete(`${routersPaths.posts}/${createdPost.id}`)
      .set('Authorization', adminToken)
      .expect(HttpStatus.NoContent);

    await request(app)
      .get(`${routersPaths.posts}/${createdPost.id}`)
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

    const testCommentData = { 
      content: "test comment string test comment string test comment string test comment string test comment string"
    };

    await request(app)
      .post(`${routersPaths.posts}/${ createdPost.id }/comments`)
      .set('Authorization', token)
      .send(testCommentData)
      .expect(HttpStatus.Created);

    const createdCommentResponse = await request(app)
      .get(`${routersPaths.posts}/${ createdPost.id }/comments`)
      .set('Authorization', token)
      .expect(HttpStatus.Success);

    expect(createdCommentResponse.body.items[0].content).toEqual( testCommentData.content ); 
  })

  it(`✅ create post then: like the post by user 1, user 2, user 3, user 4. get the post after each like by user 1. 
    NewestLikes should be sorted in descending; status 204; used additional methods: POST => /blogs, POST => /posts, 
    GET => /posts/:id; PUT -> "/posts/:postId/like-status":`, async () => {
      const createdBlog = await createBlog(app);
          
      const createdPost = await request(app)
        .post(`${routersPaths.blogs}/${createdBlog.id}/posts`)
        .set('Authorization', adminToken)
        .send({content:"new post content",shortDescription:"description",title:"post title"})
        .expect(HttpStatus.Created);
//====== users1======
      const user1: UserInputDto = {
        login: "userLike1",
        password: "123456789",
        email: "userLike1@gmail.com"
      }
      const createdUser1 = await createUser(app, user1);
      const token1 = await generateBearerAuthToken( createdUser1.id );

      await request(app)
        .put(`${routersPaths.posts}/${ createdPost.body.id }/like-status`)
        .set('Authorization', token1)
        .send({likeStatus: LikeStatus.Like})
        .expect(HttpStatus.NoContent);
      
      const postWithLike1 = await request(app)
        .get(`${routersPaths.posts}/${ createdPost.body.id }`)
        .set('Authorization', token1)
        .send()
        .expect(HttpStatus.Success);

    //  console.log('postWithLike1 ', postWithLike1.body.extendedLikesInfo.newestLikes);

//=========user2=====================      
      const user2: UserInputDto = {
        login: "userLike2",
        password: "123456789",
        email: "userLike2@gmail.com"
      }
      const createdUser2 = await createUser(app, user2);
      const token2 = await generateBearerAuthToken( createdUser2.id );
          
      await request(app)
        .put(`${routersPaths.posts}/${ createdPost.body.id }/like-status`)
        .set('Authorization', token2)
        .send({likeStatus: LikeStatus.Like})
        .expect(HttpStatus.NoContent);
      
      const postWithLike2 = await request(app)
        .get(`${routersPaths.posts}/${ createdPost.body.id }`)
        .set('Authorization', token2)
        .send()
        .expect(HttpStatus.Success);

    //  console.log('postWithLike2 ', postWithLike2.body.extendedLikesInfo.newestLikes);

// =====================user3 

      const user3: UserInputDto = {
        login: "userLike3",
        password: "123456789",
        email: "userLike3@gmail.com"
      }
      const createdUser3 = await createUser(app, user3);
      const token3 = await generateBearerAuthToken( createdUser3.id );
      
      await request(app)
        .put(`${routersPaths.posts}/${ createdPost.body.id }/like-status`)
        .set('Authorization', token3)
        .send({likeStatus: LikeStatus.Like})
        .expect(HttpStatus.NoContent);
      
      const postWithLike3 = await request(app)
        .get(`${routersPaths.posts}/${ createdPost.body.id }`)
        .set('Authorization', token2)
        .send()
        .expect(HttpStatus.Success);

   //  console.log('postWithLike3 ', postWithLike3.body.extendedLikesInfo.newestLikes);

 //========user4================     
      const user4: UserInputDto = {
        login: "userLike4",
        password: "123456789",
        email: "userLike4@gmail.com"
      }
      const createdUser4 = await createUser(app, user4);
      const token4 = await generateBearerAuthToken( createdUser4.id );

      await request(app)
        .put(`${routersPaths.posts}/${ createdPost.body.id }/like-status`)
        .set('Authorization', token4)
        .send({likeStatus: LikeStatus.Like})
        .expect(HttpStatus.NoContent);
      
      const postWithLike4 = await request(app)
        .get(`${routersPaths.posts}/${ createdPost.body.id }`)
        .set('Authorization', token4)
        .send()
        .expect(HttpStatus.Success);

     // console.log('postWithLike4 ', postWithLike4.body.extendedLikesInfo.newestLikes);

//====== users======  
  })

  describe('PUT /posts/:postId/like-status', () => {
  it(`✅ PUT -> "/posts/:postId/like-status": create post then: like the post by user 1; dislike the post by user 1; 
    set 'none' status by user 1; get the post after each like by user 1; status 204; used additional methods: 
    POST => /blogs, POST => /posts, GET => /posts/:id;`, async () => {
      const createdBlog = await createBlog(app);
          
      const createdPost = await request(app)
        .post(`${routersPaths.blogs}/${createdBlog.id}/posts`)
        .set('Authorization', adminToken)
        .send({content:"new post content",shortDescription:"description",title:"post title"})
        .expect(HttpStatus.Created);
//====== users like======
      const user: UserInputDto = {
        login: "setLike",
        password: "123456789",
        email: "setLike@gmail.com"
      }
      const createdUser = await createUser(app, user);
      const token = await generateBearerAuthToken( createdUser.id );

      await request(app)
        .put(`${routersPaths.posts}/${ createdPost.body.id }/like-status`)
        .set('Authorization', token)
        .send({likeStatus: LikeStatus.Like})
        .expect(HttpStatus.NoContent);
      
      const postWithLike = await request(app)
        .get(`${routersPaths.posts}/${ createdPost.body.id }`)
        .set('Authorization', token)
        .send()
        .expect(HttpStatus.Success);

      console.log('postWithLike ', postWithLike.body.extendedLikesInfo.newestLikes);

//=========user dislike=====================      
        
      await request(app)
        .put(`${routersPaths.posts}/${ createdPost.body.id }/like-status`)
        .set('Authorization', token)
        .send({likeStatus: LikeStatus.Dislike})
        .expect(HttpStatus.NoContent);
      
      const postWithDislike= await request(app)
        .get(`${routersPaths.posts}/${ createdPost.body.id }`)
        .set('Authorization', token)
        .send()
        .expect(HttpStatus.Success);

      console.log('postWithDislike ', postWithDislike.body.extendedLikesInfo.newestLikes);

   })
  })

});
