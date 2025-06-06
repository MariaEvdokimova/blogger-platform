import { Router } from "express";
import { inputValidationResultMiddleware } from "../../core/middlewares/validation/input-validtion-result.middleware";
import { blogInputDtoValidation } from "../validation/blog.input-dto.validation-middlewares";
import { superAdminGuardMiddleware } from "../../auth/middlewares/super-admin.guard-middleware";
import { paginationAndSortingValidation } from "../../core/middlewares/validation/query-pagination-sorting.validation-middlewares";
import { BlogSortField } from "../types/sort";
import { postInBlogInputDtoValidation } from "../validation/post-in-blog.input-dto.validation-middlewares";
import { PostSortField } from "../../posts/types/sort";
import { container } from "../../composition-root";
import { BlogsController } from "./blogs.controller";

const blogsController = container.get(BlogsController);
export const blogsRouter = Router({});

blogsRouter
  .get('', 
    paginationAndSortingValidation( BlogSortField ),     
    inputValidationResultMiddleware, 
    blogsController.getBlogList.bind(blogsController)
  )

  .get(
    '/:id', 
    blogsController.getBlog.bind(blogsController)
  )

  .get(
    '/:blogId/posts',
    paginationAndSortingValidation( PostSortField ),
    inputValidationResultMiddleware, 
    blogsController.getBlogPosts.bind(blogsController)
  )

  .post(
    '', 
    superAdminGuardMiddleware,
    blogInputDtoValidation, 
    inputValidationResultMiddleware, 
    blogsController.createBlog.bind(blogsController)
  )
  
  .post(
    '/:blogId/posts',
    superAdminGuardMiddleware,
    postInBlogInputDtoValidation,
    inputValidationResultMiddleware, 
    blogsController.createPostInBlog.bind(blogsController)
  )
  
  .put(
    '/:id', 
    superAdminGuardMiddleware,
    blogInputDtoValidation, 
    inputValidationResultMiddleware, 
    blogsController.updateBlog.bind(blogsController)
  )
  
  .delete(
    '/:id', 
    superAdminGuardMiddleware,
    blogsController.deleteBlog.bind(blogsController)
  )
