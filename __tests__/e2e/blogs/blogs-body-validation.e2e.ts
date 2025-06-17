// @ts-ignore
import request from "supertest";
// @ts-ignore
import express from "express";

import { setupApp } from "../../../src/setup-app"
import { generateBasicAuthToken } from "../../utils/generate-admin-auth-token";
import { BlogInputDto } from "../../../src/blogs/dto/blog.input-dto";
import { getBlogDto } from "../../utils/blogs/get-blog-dto";
import { routersPaths } from "../../../src/core/paths/paths";
import { HttpStatus } from "../../../src/core/types/http-statuses";
import { createBlog } from "../../utils/blogs/create-blog";
import { getBlogById } from "../../utils/blogs/get-blog-by-id";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";


describe('Blogs API body validation check', () => {
  const app = express();
  setupApp(app);
 
  const correctTestBlogsData: BlogInputDto = getBlogDto();
 
  const adminToken = generateBasicAuthToken();

   beforeAll(async () => {
      //const mongoServer = await MongoMemoryServer.create();
      //await runDB(mongoServer.getUri());
      const mongoServer = await MongoMemoryServer.create();
      await mongoose.connect(mongoServer.getUri()); 
    });
  
    beforeEach(async () => {
      //await dropDb();
      await mongoose.connection.db?.dropDatabase()
    });
  
    afterAll(async () => {
      //await dropDb();
      //await stopDb();
      await mongoose.connection.dropDatabase(); // Cleanup
      await mongoose.disconnect(); // Proper mongoose disconnect
    });
  
  it('❌ should not create blog when incorrect body passed; POST /blogs', async () => {
    await request(app)
      .post(routersPaths.blogs)
      .send(correctTestBlogsData)
      .expect(HttpStatus.Unauthorized);

      const invalidDataSet1 = await request(app)
      .post(routersPaths.blogs)
      .set('Authorization', adminToken)
      .send({
        name: '         ',// empty string
        description: '       ',// empty string
        websiteUrl: 'eNf7vpWWtJWn2ME6etJ48A4D7' //incorrect web site url 
      })
      .expect(HttpStatus.BadRequest);

      expect(invalidDataSet1.body.errorsMessages).toHaveLength(3);
      
      const invalidDataSet2 = await request(app)
      .post(routersPaths.blogs)
      .set('Authorization', adminToken)
      .send({
        name: 33,// not a string
        description: 3456,// not a string
        websiteUrl: '     ' // emty string 
      })
      .expect(HttpStatus.BadRequest);

      expect(invalidDataSet2.body.errorsMessages).toHaveLength(3);

    // check empty blogs
    const blogsListResponse = await request(app).get(routersPaths.blogs)
    expect(blogsListResponse.body.items).toEqual([]);
    });

    it('❌ should not update blog when incorrect body passed; PUT /blogs/:id', async () => {
      const createdBlog = await createBlog(app, correctTestBlogsData);

      const invalidDataSet1 = await request(app)
      .put(`${routersPaths.blogs}/${createdBlog.id}`)
      .set('Authorization', adminToken)
      .send({
        name: 33,// not a string
        description: 3456,// not a string
        websiteUrl: 'skjkdjfhdskla' // wrong string 
      })
      .expect(HttpStatus.BadRequest);

      expect(invalidDataSet1.body.errorsMessages).toHaveLength(3);
      
      const invalidDataSet2 = await request(app)
      .put(`${routersPaths.blogs}/${createdBlog.id}`)
      .set('Authorization', adminToken)
      .send({
        name: '     ',// not a string
        description: 'deccription',
        websiteUrl: '     ' // emty string 
      })
      .expect(HttpStatus.BadRequest);

      expect(invalidDataSet2.body.errorsMessages).toHaveLength(2);

      const blogResponse = await getBlogById(app, createdBlog.id);

      expect(blogResponse).toEqual({
        ...createdBlog,
        id: createdBlog.id,
      });
      
    });

    it('❌ should not update blog when incorrect id; PUT /blogs/:id', async () => {
      await request(app)
      .put(`${routersPaths.blogs}/рпорарпл`)
      .set('Authorization', adminToken)
      .send({
        name: 'hjkjh',
        description: 'khjhgxfghj',
        websiteUrl: 'https://S8kLiHwPZQsNgCPhvBBcEa4E747ZdyOHh9mvTxu0wJN.ZeB2c'
      })
      .expect(HttpStatus.NotFound);
    });
}); 
