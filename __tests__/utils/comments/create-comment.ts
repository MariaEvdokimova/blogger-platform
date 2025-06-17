// @ts-ignore
import request from 'supertest';
import { HttpStatus } from '../../../src/core/types/http-statuses';
import { Express } from 'express';
import { CommentInputDto } from '../../../src/comments/dto/comment.input-dto';
import { routersPaths } from '../../../src/core/paths/paths';
import { PostViewModel } from '../../../src/posts/types/post-view-model';
import { CommentViewModel } from '../../../src/comments/types/comment-view-model';

export const createComment = async (
  app: Express,
  createdPost: PostViewModel,
  token: string,
  testCommentData: CommentInputDto,
): Promise<CommentViewModel> => {
  
  const createdCommentResponse = await request(app)
    .post(`${routersPaths.posts}/${ createdPost.id }/comments`)
    .set('Authorization', token)
    .send(testCommentData)
    .expect(HttpStatus.Created);

  return createdCommentResponse.body;
}
