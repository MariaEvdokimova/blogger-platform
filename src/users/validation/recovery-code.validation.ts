import { body } from "express-validator";

export const recoveryCodeValidation = body('recoveryCode')	
.exists()
.withMessage('recoveryCode id is required')
.isString()
.withMessage('recoveryCode should be string')
.trim()
.isLength({ min: 6, max: 20 })
.withMessage('Length of recoveryCode is not correct');
