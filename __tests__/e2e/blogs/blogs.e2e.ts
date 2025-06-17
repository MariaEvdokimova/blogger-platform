// @ts-ignore
import request from "supertest";
// @ts-ignore
import express from "express";

import { setupApp } from "../../../src/setup-app"
import { generateBasicAuthToken } from "../../utils/generate-admin-auth-token";
import { BlogInputDto } from "../../../src/blogs/dto/blog.input-dto";
import { getBlogDto } from "../../utils/blogs/get-blog-dto";
import { createBlog } from "../../utils/blogs/create-blog";
import { routersPaths } from "../../../src/core/paths/paths";
import { HttpStatus } from "../../../src/core/types/http-statuses";
import { getBlogById } from "../../utils/blogs/get-blog-by-id";
import { updateBlog } from "../../utils/blogs/update-blog";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

describe('Blogs API', () => {
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

  it('✅ Should create blog; POST /blogs', async () => {
    const newBlog: BlogInputDto = {
      ...getBlogDto(),
      name: 'new blog name',
    } 

    await createBlog(app, newBlog);
  })

  it('✅ Should return blog list; GET /blogs', async () => {
    await createBlog(app);
    await createBlog(app);

    const response = await request(app)
      .get(routersPaths.blogs)
      .expect(HttpStatus.Success)

    expect(response.body).toBeInstanceOf(Object);
    expect(response.body.items.length).toBeGreaterThanOrEqual(2);
    
  })
  it('✅ Should return blog by id; GET /blogs/:id', async () => {
    const createdBlog = await createBlog(app);

    const blog = await getBlogById(app, createdBlog.id);
    
    expect(blog).toEqual({
      ...createdBlog,
      id: expect.any(String),
      name: expect.any(String),
    });
    
  })
  it('✅ Should update blog by id; PUT /blogs/:id', async () => {
    const createdBlog = await createBlog(app);

    const blogUpdateData: BlogInputDto = {
      name: 'super new',
      description: 'super description',
      websiteUrl: 'https://developer.mozilla.org/'
    };

    await updateBlog(app, createdBlog.id, blogUpdateData);
    const blogResponse = await getBlogById(app, createdBlog.id);

    expect(blogResponse).toEqual({
      id: createdBlog.id,
      name: blogUpdateData.name,
      description: blogUpdateData.description,
      websiteUrl: blogUpdateData.websiteUrl,
      isMembership: false,
      createdAt: expect.any(String),
    });
    
  })
  it('✅ Should delete blog by id; DELETE /blogs/:id', async () => {
    const createdBlog = await createBlog(app);

    await request(app)
      .delete(`${routersPaths.blogs}/${createdBlog.id}`)
      .set('Authorization', adminToken)
      .expect(HttpStatus.NoContent);

    await request(app)
      .get(`${routersPaths.blogs}/${createdBlog.id}`)
      .set('Authorization', adminToken)
      .expect(HttpStatus.NotFound);
  })
});
