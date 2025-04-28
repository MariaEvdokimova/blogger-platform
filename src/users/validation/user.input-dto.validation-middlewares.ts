import { body } from "express-validator";

const loginValidation = body('login')	
  .exists()
  .withMessage('Login id is required')
  .isString()
  .withMessage('Login should be string')
  .trim()
  .isLength({ min: 3, max: 10 })
  .withMessage('Length of login is not correct')
  .matches(/^[a-zA-Z0-9_-]*$/)
  .withMessage('Invalid login format');
  
const passwordValidation = body('password')	
.exists()
.withMessage('password id is required')
.isString()
.withMessage('password should be string')
.trim()
.isLength({ min: 6, max: 20 })
.withMessage('Length of password is not correct');

const emailValidation = body('email')	
  .exists()
  .withMessage('email id is required')
  .isString()
  .withMessage('email should be string')
  .trim()
  .isLength({ min: 5, max: 100 })
  .withMessage('Length of email is not correct')
  .matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
  .withMessage('Invalid email format');

export const userInputDtoValidation = [
  loginValidation,
  passwordValidation,
  emailValidation,
]
