import { body } from "express-validator"

const nameValidation = body('name')	
  .exists()
  .withMessage('Name id is required')
  .isString()
  .withMessage('Name should be string')
  .trim()
  .isLength({ min: 1, max: 15 })
  .withMessage('Length of name is not correct');

const descriptionValidation = body('description')	
  .exists()
  .withMessage('Description id is required')
  .isString()
  .withMessage('Description should be string')
  .trim()
  .isLength({ min: 1, max: 500 })
  .withMessage('Length of description is not correct');

const websiteUrlValidation = body('websiteUrl')	
  .exists()
  .withMessage('Web site Url is required')
  .isString()
  .withMessage('Web site Url should be string')
  .trim()
  .isLength({ min: 1, max: 100 })
  .withMessage('Length of Web site Url is not correct')
  .matches(/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/)
  .withMessage('Invalid Web site Url format');

export const blogInputDtoValidation = [
  nameValidation,
  descriptionValidation,
  websiteUrlValidation,
]
