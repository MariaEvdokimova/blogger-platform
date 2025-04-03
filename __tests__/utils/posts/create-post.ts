// @ts-ignore
import request from 'supertest';
import { HttpStatus } from '../../../src/core/types/http-statuses';
import { Express } from 'express';
import { generateBasicAuthToken } from '../generate-admin-auth-token';
import { PostInputDto } from '../../../src/posts/dto/post.input-dto';
import { Post } from '../../../src/posts/types/post';
import { createBlog } from '../blogs/create-blog';
import { getPostDto } from './get-post-dto';
import { POSTS_PATH } from '../../../src/core/paths/paths';

export const createPost = async (
  app: Express,
  postDto?: PostInputDto,
): Promise<Post> => {
  const blog = await createBlog(app);

  const defaultPostData = getPostDto(blog.id);

  const testPostData = { ...defaultPostData, ...postDto };

  const createdPostResponse = await request(app)
    .post(POSTS_PATH)
    .set('Authorization', generateBasicAuthToken())
    .send(testPostData)
    .expect(HttpStatus.Created);

  return createdPostResponse.body;
}
