import express, { Express } from "express";
import { routersPaths } from "./core/paths/paths";
import { blogsRouter } from "./blogs/routers/blogs.router";
import { postsRoute } from "./posts/routers/posts.router";
import { testingRouter } from "./testing/routers/testing.router";
import { setupSwagger } from "./core/swagger/setup-swagger";
import { authRouter } from "./auth/routers/auth.router";
import { usersRouter } from "./users/routers/users.router";
import { commentsRouter } from "./comments/routers/comments.router";
import cookieParser from "cookie-parser";
import { securityDevicesRouter } from "./securityDevices/routers/security-devices.router";
 
export const setupApp = (app: Express) => {
  
  app.use(cookieParser());
  app.use(express.json());
  app.use(routersPaths.common, authRouter);
  app.use(routersPaths.blogs, blogsRouter);
  app.use(routersPaths.posts, postsRoute);
  app.use(routersPaths.testing, testingRouter);
  app.use(routersPaths.users, usersRouter);
  app.use(routersPaths.comments, commentsRouter);
  app.use(routersPaths.securityDevives, securityDevicesRouter);

  setupSwagger(app);
  return app;
};
