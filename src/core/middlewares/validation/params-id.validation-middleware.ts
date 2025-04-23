import { param } from 'express-validator';

export const idValidation = param('id')
  .exists()
  .withMessage('ID is required')
  .isString()
  .withMessage('ID must be a string')
  .isMongoId()
  .withMessage('ID must be ObjectId type')

  export const blogIdValidation = param('blogId')
  .exists()
  .withMessage('ID is required')
  .isString()
  .withMessage('ID must be a string')
  .isMongoId()
  .withMessage('ID must be ObjectId type')  
