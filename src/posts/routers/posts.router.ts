import { Router } from "express";
import { getPostHandler } from "./handlers/get-post.handler";
import { inputValidationResultMiddleware } from "../../core/middlewares/validation/input-validtion-result.middleware";
import { postInputDtoValidation } from "../validation/post.input-dto.validation-middlewares";
import { superAdminGuardMiddleware } from "../../auth/middlewares/super-admin.guard-middleware";
import { getPostListHandler } from "./handlers/get-post-list.handler";
import { createPostHandler } from "./handlers/create-post.handler";
import { updatePostHandler } from "./handlers/update-post.handler";
import { deletePostHandler } from "./handlers/delete-post.handler";
import { paginationAndSortingValidation } from "../../core/middlewares/validation/query-pagination-sorting.validation-middlewares";
import { PostSortField } from "../types/sort";
import { CommentSortField } from "../../comments/types/sort";
import { getPostCommentHandler } from "./handlers/get-post-comments.handler";
import { contentValidation } from "../../comments/validation/comment.input-dto.validation-middlewares";
import { accessTokenGuard } from "../../auth/routers/guards/access.token.guard";
import { createPostCommentHandler } from "./handlers/create-post-comment.handler";

export const postsRoute = Router({});

postsRoute
  .get('',
    paginationAndSortingValidation( PostSortField ),   
    inputValidationResultMiddleware, 
    getPostListHandler
  )

  .get(
    '/:id', 
    getPostHandler
  )

  .get(
    '/:postId/comments',
    paginationAndSortingValidation( CommentSortField ),   
    inputValidationResultMiddleware, 
    getPostCommentHandler
  )

  .post(
    '', 
    superAdminGuardMiddleware,
    postInputDtoValidation,
    inputValidationResultMiddleware, 
    createPostHandler
  )

  .post(
    '/:postId/comments',
    accessTokenGuard,
    contentValidation, 
    inputValidationResultMiddleware, 
    createPostCommentHandler
  )

  .put(
    '/:id', 
    superAdminGuardMiddleware,
    postInputDtoValidation,
    inputValidationResultMiddleware, 
    updatePostHandler
  )

  .delete(
    '/:id', 
    superAdminGuardMiddleware,
    deletePostHandler
  )
