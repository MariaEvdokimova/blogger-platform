import request from 'supertest';
import { Express } from 'express';
import { HttpStatus } from '../../../src/core/types/http-statuses';
import { BLOGS_PATH } from '../../../src/core/paths/paths';
import { BlogViewModels } from '../../../src/blogs/types/blog-view-model';

export const getBlogById = async (
  app: Express,
  blogId: string,
): Promise<BlogViewModels> => {
  const blogResponse = await request(app)
    .get(`${BLOGS_PATH}/${blogId}`)
    .expect(HttpStatus.Ok);

  return blogResponse.body;
}
