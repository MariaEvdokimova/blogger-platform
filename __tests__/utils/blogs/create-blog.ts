import request from 'supertest';
import { Express } from 'express';
import { BlogInputDto } from "../../../src/blogs/dto/blog.input-dto";
import { getBlogDto } from './get-blog-dto';
import { BLOGS_PATH } from '../../../src/core/paths/paths';
import { generateBasicAuthToken } from '../generate-admin-auth-token';
import { HttpStatus } from '../../../src/core/types/http-statuses';
import { BlogViewModels } from '../../../src/blogs/types/blog-view-model';

export const createBlog = async (
  app: Express,
  blogDto?: BlogInputDto
): Promise<BlogViewModels> => {
  const defaultBlogData: BlogInputDto = getBlogDto();

  const testBlogData = { ...defaultBlogData, ...blogDto };

  const createdBlogResponse = await request(app)
    .post(BLOGS_PATH)
    .set('Authorization', generateBasicAuthToken())
    .send(testBlogData)
    .expect(HttpStatus.Created);

  return createdBlogResponse.body;
};
