import { body } from "express-validator";

export const codeValidation = body('code')	
.exists()
.withMessage('code is required')
.isString()
.withMessage('code should be string')
.trim()
.isLength({ min: 1 })
.withMessage('Length of code is not correct');
