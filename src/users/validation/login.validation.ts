import { body } from "express-validator";

export const loginValidation = body('login')	
  .exists()
  .withMessage('Login id is required')
  .isString()
  .withMessage('Login should be string')
  .trim()
  .isLength({ min: 3, max: 10 })
  .withMessage('Length of login is not correct')
  .matches(/^[a-zA-Z0-9_-]*$/)
  .withMessage('Invalid login format');
