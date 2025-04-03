import express, { Express } from "express";
import { BLOGS_PATH, POSTS_PATH, TESTING_PATH } from "./core/paths/paths";
import { blogsRouter } from "./blogs/routers/blogs.router";
import { postsRoute } from "./posts/routers/posts.router";
import { testingRouter } from "./testing/routers/testing.router";
import { setupSwagger } from "./core/swagger/setup-swagger";
 
export const setupApp = (app: Express) => {
  app.use(express.json());
 
  app.get("/", (_, res) => {
    res.status(200).send("Hello world!");
  });

  app.use(BLOGS_PATH, blogsRouter);
  app.use(POSTS_PATH, postsRoute);
  app.use(TESTING_PATH, testingRouter);

  setupSwagger(app);
  return app;
};
