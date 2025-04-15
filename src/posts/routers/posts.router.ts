import { Router } from "express";
import { getPostHandler } from "./handlers/get-post.handler";
import { idValidation } from "../../core/middlewares/validation/params-id.validation-middleware";
import { inputValidationResultMiddleware } from "../../core/middlewares/validation/input-validtion-result.middleware";
import { postInputDtoValidation } from "../validation/post.input-dto.validation-middlewares";
import { superAdminGuardMiddleware } from "../../auth/middlewares/super-admin.guard-middleware";
import { getPostListHandler } from "./handlers/get-post-list.handler";
import { createPostHandler } from "./handlers/create-post.handler";
import { updatePostHandler } from "./handlers/update-post.handler";
import { deletePostHandler } from "./handlers/delete-post.handler";
import { paginationAndSortingValidation } from "../../core/middlewares/validation/query-pagination-sorting.validation-middlewares";
import { PostSortField } from "../types/sort";

export const postsRoute = Router({});

postsRoute
  .get('',
    paginationAndSortingValidation( PostSortField ), 
    getPostListHandler
  )

  .get(
    '/:id', 
    idValidation, 
    inputValidationResultMiddleware, 
    getPostHandler
  )

  .post(
    '', 
    superAdminGuardMiddleware,
    postInputDtoValidation,
    inputValidationResultMiddleware, 
    createPostHandler
  )

  .put(
    '/:id', 
    superAdminGuardMiddleware,
    idValidation, 
    postInputDtoValidation,
    inputValidationResultMiddleware, 
    updatePostHandler
  )

  .delete(
    '/:id', 
    superAdminGuardMiddleware,
    idValidation, 
    inputValidationResultMiddleware, 
    deletePostHandler
  )
