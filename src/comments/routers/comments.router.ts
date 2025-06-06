import { Router } from "express";
import { accessTokenGuard } from "../../auth/routers/guards/access.token.guard";
import { contentValidation } from "../validation/comment.input-dto.validation-middlewares";
import { inputValidationResultMiddleware } from "../../core/middlewares/validation/input-validtion-result.middleware";
import { container } from "../../composition-root";
import { CommentsController } from "./comments.controller";

const commentsController = container.get(CommentsController);
export const commentsRouter = Router({});

commentsRouter
  .get(
    '/:id',
    commentsController.getComment.bind(commentsController)
  )

  .put(
    '/:commentId',
    accessTokenGuard,
    contentValidation,
    inputValidationResultMiddleware,
    commentsController.updateComment.bind(commentsController)
  )
  
  .delete(
    '/:commentId',
    accessTokenGuard,
    commentsController.deleteComment.bind(commentsController)
  )
