import { Router } from "express";
import { accessTokenGuard } from "../../auth/routers/guards/access.token.guard";
import { getCommentHandler } from "./handlers/get-comment.handler";
import { updateCommentHandler } from "./handlers/update-comment.handler";
import { deleteCommentHandler } from "./handlers/delete-comment.handler";
import { contentValidation } from "../validation/comment.input-dto.validation-middlewares";
import { inputValidationResultMiddleware } from "../../core/middlewares/validation/input-validtion-result.middleware";


export const commentsRouter = Router({});

commentsRouter
  .get(
    '/:id',
    getCommentHandler
  )

  .put(
    '/:commentId',
    accessTokenGuard,
    contentValidation,
    inputValidationResultMiddleware,
    updateCommentHandler
  )
  
  .delete(
    '/:commentId',
    accessTokenGuard,
    deleteCommentHandler
  )
