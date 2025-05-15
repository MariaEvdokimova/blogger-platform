import { body } from "express-validator";

export const passwordValidation = body('password')	
.exists()
.withMessage('password id is required')
.isString()
.withMessage('password should be string')
.trim()
.isLength({ min: 6, max: 20 })
.withMessage('Length of password is not correct');
