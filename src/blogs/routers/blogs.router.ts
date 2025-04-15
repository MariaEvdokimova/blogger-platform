import { Router } from "express";
import { getBlogListHandler } from "./handlers/get-blog-list.handler";
import { updateBlogHandler } from "./handlers/update-blog.handler";
import { getBlogHandler } from "./handlers/get-blog.handler";
import { createBlogHandler } from "./handlers/create-blog.handler";
import { deleteBlogHandler } from "./handlers/delete-blog.handler";
import { blogIdValidation, idValidation } from "../../core/middlewares/validation/params-id.validation-middleware";
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
    getBlogListHandler
  )

  .get(
    '/:id', 
    idValidation, 
    inputValidationResultMiddleware, 
    getBlogHandler
  )

  .get(
    '/:blogId/posts',
    blogIdValidation,
    paginationAndSortingValidation( PostSortField ),
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
    blogIdValidation,
    postInBlogInputDtoValidation,
    inputValidationResultMiddleware, 
    createPostInBlogHandler
  )
  
  .put(
    '/:id', 
    superAdminGuardMiddleware,
    idValidation, 
    blogInputDtoValidation, 
    inputValidationResultMiddleware, 
    updateBlogHandler
  )
  
  .delete(
    '/:id', 
    superAdminGuardMiddleware,
    idValidation, 
    inputValidationResultMiddleware,
    deleteBlogHandler
  )
