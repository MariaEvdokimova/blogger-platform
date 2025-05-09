import {body} from "express-validator";

export const loginOrEmailValidation = body("loginOrEmail")
  .exists()
  .withMessage('login Or Email is required')
  .isString()
  .trim()
  .isLength({min: 1, max: 500})
  .withMessage('login Or Email is not correct');
