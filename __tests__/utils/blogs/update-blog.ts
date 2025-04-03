import request from 'supertest';
import { Express } from 'express';
import { HttpStatus } from '../../../src/core/types/http-statuses';
import { generateBasicAuthToken } from '../generate-admin-auth-token';
import { BlogInputDto } from '../../../src/blogs/dto/blog.input-dto';
import { getBlogDto } from './get-blog-dto';
import { BLOGS_PATH } from '../../../src/core/paths/paths';

export const updateBlog = async (
  app: Express,
  blogId: string,
  blogDto?: BlogInputDto,
): Promise<void> => {
  const defaulBlogData: BlogInputDto = getBlogDto();

  const testBlogData = { ...defaulBlogData, ...blogDto };

  const updatedBlogResponse = await request(app)
    .put(`${BLOGS_PATH}/${blogId}`)
    .set('Authorization', generateBasicAuthToken())
    .send(testBlogData)
    .expect(HttpStatus.NoContent);

  return updatedBlogResponse.body;
}
