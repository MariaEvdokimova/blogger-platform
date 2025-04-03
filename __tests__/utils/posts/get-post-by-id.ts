// @ts-ignore
import request from 'supertest';
import { Express } from 'express';
import { HttpStatus } from '../../../src/core/types/http-statuses';
import { generateBasicAuthToken } from '../generate-admin-auth-token';
import { Post } from '../../../src/posts/types/post';
import { POSTS_PATH } from '../../../src/core/paths/paths';

export const getPostById  = async (
  app: Express, 
  postId: string
): Promise<Post> => {
  const getResponse = await request(app)
    .get(`${POSTS_PATH}/${postId}`)
    .expect(HttpStatus.Ok);

  return getResponse.body;
}
