import { Router } from "express";
import { getBlogListHandler } from "./handlers/get-blog-list.handler";
import { updateBlogHandler } from "./handlers/update-blog.handler";
import { getBlogHandler } from "./handlers/get-blog.handler";
import { createBlogHandler } from "./handlers/create-blog.handler";
import { deleteBlogHandler } from "./handlers/delete-blog.handler";
import { inputValidationResultMiddleware } from "../../core/middlewares/validation/input-validtion-result.middleware";
import { blogInputDtoValidation } from "../validation/blog.input-dto.validation-middlewares";
import { superAdminGuardMiddleware } from "../../auth/middlewares/super-admin.guard-middleware";
import { paginationAndSortingValidation } from "../../core/middlewares/validation/query-pagination-sorting.validation-middlewares";
import { BlogSortField } from "../types/sort";
import { getBlogPostsHandler } from "./handlers/get-blog-posts.handler";
import { postInBlogInputDtoValidation } from "../validation/post-in-blog.input-dto.validation-middlewares";
import { createPostInBlogHandler } from "./handlers/create-post-in-blog.handler";
import { PostSortField } from "../../posts/types/sort";

export const blogsRouter = Router({});

blogsRouter
  .get('', 
    paginationAndSortingValidation( BlogSortField ),     
    inputValidationResultMiddleware, 
    getBlogListHandler
  )

  .get(
    '/:id', 
    getBlogHandler
  )

  .get(
    '/:blogId/posts',
    paginationAndSortingValidation( PostSortField ),
    inputValidationResultMiddleware, 
    getBlogPostsHandler
  )

  .post(
    '', 
    superAdminGuardMiddleware,
    blogInputDtoValidation, 
    inputValidationResultMiddleware, 
    createBlogHandler
  )
  
  .post(
    '/:blogId/posts',
    superAdminGuardMiddleware,
    postInBlogInputDtoValidation,
    inputValidationResultMiddleware, 
    createPostInBlogHandler
  )
  
  .put(
    '/:id', 
    superAdminGuardMiddleware,
    blogInputDtoValidation, 
    inputValidationResultMiddleware, 
    updateBlogHandler
  )
  
  .delete(
    '/:id', 
    superAdminGuardMiddleware,
    deleteBlogHandler
  )
