import { Router } from "express";
import { inputValidationResultMiddleware } from "../../core/middlewares/validation/input-validtion-result.middleware";
import { postInputDtoValidation } from "../validation/post.input-dto.validation-middlewares";
import { superAdminGuardMiddleware } from "../../auth/middlewares/super-admin.guard-middleware";
import { paginationAndSortingValidation } from "../../core/middlewares/validation/query-pagination-sorting.validation-middlewares";
import { PostSortField } from "../types/sort";
import { CommentSortField } from "../../comments/types/sort";
import { contentValidation } from "../../comments/validation/comment.input-dto.validation-middlewares";
import { accessTokenGuard } from "../../auth/routers/guards/access.token.guard";
import { container } from "../../composition-root";
import { PostsController } from "./posts.controller";
import { likeStatusValidation } from "../../comments/validation/like-status.input-dto.validation";

const postsController = container.get(PostsController);
export const postsRoute = Router({});

postsRoute
  .get('',
    paginationAndSortingValidation( PostSortField ),   
    inputValidationResultMiddleware, 
    postsController.getPostList.bind(postsController)
  )

  .get(
    '/:id', 
    postsController.getPost.bind(postsController)
  )

  .get(
    '/:postId/comments',
    paginationAndSortingValidation( CommentSortField ),   
    inputValidationResultMiddleware, 
    postsController.getPostComments.bind(postsController)
  )

  .post(
    '', 
    superAdminGuardMiddleware,
    postInputDtoValidation,
    inputValidationResultMiddleware, 
    postsController.createPost.bind(postsController)
  )

  .put(
    '/:postId/like-status',
    accessTokenGuard,
    likeStatusValidation,
    inputValidationResultMiddleware,
    postsController.updateLikeStatus.bind(postsController)
  )

  .post(
    '/:postId/comments',
    accessTokenGuard,
    contentValidation, 
    inputValidationResultMiddleware, 
    postsController.createPostComment.bind(postsController)
  )

  .put(
    '/:id', 
    superAdminGuardMiddleware,
    postInputDtoValidation,
    inputValidationResultMiddleware, 
    postsController.updatePost.bind(postsController)
  )

  .delete(
    '/:id', 
    superAdminGuardMiddleware,
    postsController.deletePost.bind(postsController)
  )
