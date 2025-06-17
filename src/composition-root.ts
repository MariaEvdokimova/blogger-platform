import "reflect-metadata";
import { Container } from "inversify";

import { BcryptService } from "./auth/adapters/bcrypt.service";
import { CookieService } from "./auth/adapters/cookie.service";
import { EmailExamples } from "./auth/adapters/emailExamples";
import { JwtService } from "./auth/adapters/jwt.service";
import { NodemailerService } from "./auth/adapters/nodemailer.service";
import { AuthService } from "./auth/application/auth.service";
import { RateLimitRepository } from "./auth/repositories/rate-limit.repository";
import { AuthController } from "./auth/routers/auth.controller";
import { BlogsService } from "./blogs/application/blogs.service";
import { BlogsQueryRepository } from "./blogs/repositories/blogs.query.repository";
import { BlogsRepository } from "./blogs/repositories/blogs.repository";
import { BlogsController } from "./blogs/routers/blogs.controller";
import { CommentsService } from "./comments/application/comments.service";
import { CommentsQueryRepository } from "./comments/repositories/comments.query.repository";
import { CommentsRepository } from "./comments/repositories/comments.repository";
import { CommentsController } from "./comments/routers/comments.controller";
import { PostService } from "./posts/application/post.service";
import { PostsQueryRepository } from "./posts/repositories/posts.query.repository";
import { PostRepository } from "./posts/repositories/posts.repository";
import { PostsController } from "./posts/routers/posts.controller";
import { SecurityDevicesService } from "./securityDevices/application/securityDevices.service";
import { SecurityDevicesQueryRepository } from "./securityDevices/repositories/securityDevices.query.repository";
import { SecurityDevicesRepository } from "./securityDevices/repositories/securityDevices.repository";
import { SecurityDevicesController } from "./securityDevices/routers/security-devices.controller";
import { UuidService } from "./users/adapters/uuid.service";
import { UsersService } from "./users/application/users.service";
import { UsersQueryRepository } from "./users/repositories/users.query.repository";
import { UsersRepository } from "./users/repositories/users.repository";
import { UsersController } from "./users/routers/users.controller";
import { CommentLikesRepository } from "./comments/repositories/comment-likes.repository";
import { CommentsLikesQueryRepository } from "./comments/repositories/comment-likes.query.repository";

export const container = new Container();

container.bind(BcryptService).to(BcryptService).inSingletonScope();
container.bind(CookieService).to(CookieService).inSingletonScope();
container.bind(EmailExamples).to(EmailExamples).inSingletonScope();
container.bind(JwtService).to(JwtService).inSingletonScope();
container.bind(NodemailerService).to(NodemailerService).inSingletonScope();
container.bind(UuidService).to(UuidService).inSingletonScope();

container.bind(RateLimitRepository).to(RateLimitRepository);
container.bind(BlogsQueryRepository).to(BlogsQueryRepository);
container.bind(BlogsRepository).to(BlogsRepository);
container.bind(CommentsQueryRepository).to(CommentsQueryRepository);
container.bind(CommentsRepository).to(CommentsRepository);
container.bind(PostsQueryRepository).to(PostsQueryRepository);
container.bind(PostRepository).to(PostRepository);
container.bind(SecurityDevicesQueryRepository).to(SecurityDevicesQueryRepository);
container.bind(SecurityDevicesRepository).to(SecurityDevicesRepository);
container.bind(UsersQueryRepository).to(UsersQueryRepository);
container.bind(UsersRepository).to(UsersRepository);
container.bind(CommentLikesRepository).to(CommentLikesRepository);
container.bind(CommentsLikesQueryRepository).to(CommentsLikesQueryRepository);

container.bind(AuthService).to(AuthService);
container.bind(BlogsService).to(BlogsService);
container.bind(CommentsService).to(CommentsService);
container.bind(PostService).to(PostService);
container.bind(SecurityDevicesService).to(SecurityDevicesService);
container.bind(UsersService).to(UsersService);

container.bind(AuthController).to(AuthController);
container.bind(BlogsController).to(BlogsController);
container.bind(CommentsController).to(CommentsController);
container.bind(PostsController).to(PostsController);
container.bind(SecurityDevicesController).to(SecurityDevicesController);
container.bind(UsersController).to(UsersController);

/*
export const blacklistRepository = new BlacklistRepository();
export const rateLimitRepository = new RateLimitRepository();
export const blogsQueryRepository = new BlogsQueryRepository();
export const blogsRepository = new BlogsRepository();
export const commentsQueryRepository = new CommentsQueryRepository();
export const commentsRepository = new CommentsRepository();
export const postsQueryRepository = new PostsQueryRepository();
export const postRepository = new PostRepository();
export const securityDevicesQueryRepository = new SecurityDevicesQueryRepository();
export const securityDevicesRepository = new SecurityDevicesRepository();
export const usersQueryRepository = new UsersQueryRepository();
export const usersRepository = new UsersRepository();

export const bcryptService = new BcryptService();
export const cookieService = new CookieService();
export const emailExamples = new EmailExamples();
export const jwtService = new JwtService();
export const nodemailerService = new NodemailerService();
export const uuidService = new UuidService();

export const authService = new AuthService( jwtService, securityDevicesRepository, usersRepository, uuidService, nodemailerService, emailExamples, bcryptService);
export const blogsService = new BlogsService( blogsRepository, postRepository );
export const commentsService = new CommentsService( commentsRepository );
export const postService = new PostService( postRepository );
export const securityDevicesService = new SecurityDevicesService( securityDevicesRepository );
export const usersService = new UsersService( usersRepository, bcryptService );

export const authController = new AuthController(usersQueryRepository, authService, cookieService);
export const blogsController = new BlogsController( blogsService, blogsQueryRepository, postsQueryRepository );
export const commentsController = new CommentsController( commentsQueryRepository, commentsService);
export const postsController = new PostsController(postsQueryRepository, usersQueryRepository, commentsService, commentsQueryRepository, blogsQueryRepository, postService);
export const securityDevicesController = new SecurityDevicesController( securityDevicesService, securityDevicesQueryRepository);
export const usersController = new UsersController( usersService, usersQueryRepository);
*/