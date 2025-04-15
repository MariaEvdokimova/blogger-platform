import { body } from "express-validator"

const titleValidation = body('title')	
  .exists()
  .withMessage('Title is required')
  .isString()
  .withMessage('Title should be string')
  .trim()
  .isLength({ min: 1, max: 30 })
  .withMessage('Length of title is not correct');

const shortDescriptionValidation = body('shortDescription')	
  .exists()
  .withMessage('Short Description is required')
  .isString()
  .withMessage('Short description should be string')
  .trim()
  .isLength({ min: 1, max: 100 })
  .withMessage('Length of short description is not correct');

const contentValidation = body('content')	
  .exists()
  .withMessage('Content is required')
  .isString()
  .withMessage('Content should be string')
  .trim()
  .isLength({ min: 1, max: 1000 })
  .withMessage('Length of content is not correct');

export const postInBlogInputDtoValidation = [
  titleValidation,
  shortDescriptionValidation,
  contentValidation, 
]
