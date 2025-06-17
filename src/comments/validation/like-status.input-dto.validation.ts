import { body } from "express-validator"
import { LikeStatus } from "../domain/likes.entity";

export const likeStatusValidation = body('likeStatus')	
  .exists()
  .withMessage('like Status is required')
  .isString()
  .withMessage('like Status should be string')
  .trim()
  .isIn(Object.values(LikeStatus))
  .withMessage(`Like Status must be one of: ${Object.values(LikeStatus).join(', ')}`);
  