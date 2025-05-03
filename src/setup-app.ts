import express, { Express } from "express";
import { AUTH_PATH, BLOGS_PATH, COMMENTS_PATH, POSTS_PATH, TESTING_PATH, USERS_PATH } from "./core/paths/paths";
import { blogsRouter } from "./blogs/routers/blogs.router";
import { postsRoute } from "./posts/routers/posts.router";
import { testingRouter } from "./testing/routers/testing.router";
import { setupSwagger } from "./core/swagger/setup-swagger";
import { authRouter } from "./auth/routers/auth.router";
import { usersRouter } from "./users/routers/users.router";
import { commentsRouter } from "./comments/routers/comments.router";
 
export const setupApp = (app: Express) => {
  
  app.use(express.json());
  app.use(AUTH_PATH, authRouter);
  app.use(BLOGS_PATH, blogsRouter);
  app.use(POSTS_PATH, postsRoute);
  app.use(TESTING_PATH, testingRouter);
  app.use(USERS_PATH, usersRouter);
  app.use(COMMENTS_PATH, commentsRouter);

  setupSwagger(app);
  return app;
};
