import request from 'supertest';
import { Express } from 'express';
import { BlogInputDto } from "../../../src/blogs/dto/blog.input-dto";
import { Blog } from '../../../src/blogs/types/blog';
import { getBlogDto } from './get-blog-dto';
import { BLOGS_PATH } from '../../../src/core/paths/paths';
import { generateBasicAuthToken } from '../generate-admin-auth-token';
import { HttpStatus } from '../../../src/core/types/http-statuses';

export const createBlog = async (
  app: Express,
  blogDto?: BlogInputDto
): Promise<Blog> => {
  const defaultBlogData: BlogInputDto = getBlogDto();

  const testBlogData = { ...defaultBlogData, ...blogDto };

  const createdBlogResponse = await request(app)
    .post(BLOGS_PATH)
    .set('Authorization', generateBasicAuthToken())
    .send(testBlogData)
    .expect(HttpStatus.Created);

  return createdBlogResponse.body;
};
