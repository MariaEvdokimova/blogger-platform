// @ts-ignore
import request from 'supertest';
import { Express } from 'express';
import { HttpStatus } from '../../../src/core/types/http-statuses';
import { POSTS_PATH } from '../../../src/core/paths/paths';
import { PostViewModel } from '../../../src/posts/types/post-view-model';

export const getPostById  = async (
  app: Express, 
  postId: string
): Promise<PostViewModel> => {
  const getResponse = await request(app)
    .get(`${POSTS_PATH}/${postId}`)
    .expect(HttpStatus.Success);

  return getResponse.body;
}
