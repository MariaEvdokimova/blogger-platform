import { body } from "express-validator";

export const emailValidation = body('email')	
  .exists()
  .withMessage('email id is required')
  .isString()
  .withMessage('email should be string')
  .trim()
  .isLength({ min: 5, max: 500 })
  .withMessage('Length of email is not correct')
  .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
  .withMessage('Invalid email format');
  