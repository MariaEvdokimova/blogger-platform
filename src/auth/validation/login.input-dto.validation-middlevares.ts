import { body } from "express-validator"

const loginOrEmailValidation = body('loginOrEmail')	
  .exists()
  .withMessage('login Or Email is required')
  .isString()
  .withMessage('login Or Email should be string')
  .trim()
  .isLength({ min: 1, max: 100 })
  .withMessage('Length of login Or Email is not correct');

const passwordValidation = body('password')	
  .exists()
  .withMessage('password is required')
  .isString()
  .withMessage('password should be string')
  .trim()
  .isLength({ min: 6, max: 20 })
  .withMessage('Length of password is not correct');

export const loginInputDtoValidation = [
  loginOrEmailValidation,
  passwordValidation,
]
