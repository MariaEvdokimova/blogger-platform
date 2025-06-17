// @ts-ignore
import request from 'supertest';
import express from "express";
import { setupApp } from "../../../src/setup-app";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { createPost } from "../../utils/posts/create-post";
import { UserInputDto } from "../../../src/users/dto/user.input-dto";
import { createUser } from "../../utils/users/create-user";
import { generateBearerAuthToken } from "../../utils/generate-berare-auth-token";
import { createComment } from "../../utils/comments/create-comment";
import { routersPaths } from "../../../src/core/paths/paths";
import { HttpStatus } from '../../../src/core/types/http-statuses';
import { LikeStatus } from '../../../src/comments/domain/likes.entity';

describe('Comments API', () => {
  const app = express();
  setupApp(app);
 
  //const adminToken = generateBasicAuthToken();

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
  
  describe('GET /comments/:id', () => {
    it('✅ Should get comment by id', async () => {
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

      const createdComment = await createComment ( app, createdPost, token, testCommentData )

      await request(app)
        .get(`${routersPaths.comments}/${ createdComment.id }`)
        .send()
        .expect(HttpStatus.Success);
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
  
  describe('PUT /comments/:commentId/like-status', () => {
    it('❌ should return error if auth credentials is incorrect; status 401', async () => {
      await request(app)
        .put(`${routersPaths.comments}/${ '68514c1c11d939ed1efeaf72' }/like-status`)
        .send()
        .expect(HttpStatus.Unauthorized);
      });

    it('❌ should return error if :id from uri param not found; status 404', async () => {
      const newUser: UserInputDto = {
        login: "userPutL",
        password: "123456789",
        email: "userPutL@gmail.com"
      }

      const createdUser = await createUser(app, newUser);
      const token = await generateBearerAuthToken( createdUser.id );

      await request(app)
        .put(`${routersPaths.comments}/${ '68514c1c11d939ed1efeaf72' }/like-status`)
        .set('Authorization', token)
        .send({likeStatus: "None"})
        .expect(HttpStatus.NotFound);
      });

    it(`✅ create comment then: like the comment by user 1; dislike the comment by user 1; 
      set none status by user 1; get the comment after each like by user 1; status 204`, async () => {
      const createdPost = await createPost(app);

      const newUser: UserInputDto = {
        login: "userLikes",
        password: "123456789",
        email: "userLikes@gmail.com"
      }

      const createdUser = await createUser(app, newUser);
      const token = await generateBearerAuthToken( createdUser.id );
      const testCommentData = { 
        content: "test comment string test comment string test comment string test comment string test comment string"
      };

      const createdComment = await createComment ( app, createdPost, token, testCommentData )
      
      await request(app)
        .put(`${routersPaths.comments}/${ createdComment.id }/like-status`)
        .set('Authorization', token)
        .send({likeStatus: LikeStatus.Like})
        .expect(HttpStatus.NoContent);
      
      const commentWithLike = await request(app)
        .get(`${routersPaths.comments}/${ createdComment.id }`)
        .set('Authorization', token)
        .send()
        .expect(HttpStatus.Success);
      
      expect(commentWithLike.body.likesInfo.myStatus).toEqual( LikeStatus.Like ); 
      expect(commentWithLike.body.likesInfo.likesCount).toEqual( 1 ); 
      expect(commentWithLike.body.likesInfo.dislikesCount).toEqual( 0 );       

      await request(app)
        .put(`${routersPaths.comments}/${ createdComment.id }/like-status`)
        .set('Authorization', token)
        .send({likeStatus: LikeStatus.Dislike})
        .expect(HttpStatus.NoContent);
      
      const commentWithDislike = await request(app)
        .get(`${routersPaths.comments}/${ createdComment.id }`)
        .set('Authorization', token)
        .send()
        .expect(HttpStatus.Success);
     
      expect(commentWithDislike.body.likesInfo.myStatus).toEqual( LikeStatus.Dislike ); 
      expect(commentWithDislike.body.likesInfo.likesCount).toEqual( 0 ); 
      expect(commentWithDislike.body.likesInfo.dislikesCount).toEqual( 1 );  

      await request(app)
        .put(`${routersPaths.comments}/${ createdComment.id }/like-status`)
        .set('Authorization', token)
        .send({likeStatus: LikeStatus.None})
        .expect(HttpStatus.NoContent);

      const commentWithNone = await request(app)
        .get(`${routersPaths.comments}/${ createdComment.id }`)
        .set('Authorization', token)
        .send()
        .expect(HttpStatus.Success);
          
      expect(commentWithNone.body.likesInfo.myStatus).toEqual( LikeStatus.None ); 
      expect(commentWithNone.body.likesInfo.likesCount).toEqual( 0 ); 
      expect(commentWithNone.body.likesInfo.dislikesCount).toEqual( 0 );  

      });
  });

});
