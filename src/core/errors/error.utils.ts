import { ValidationErrorType } from "../types/validationError";


export const createErrorMessages = (
  errors: ValidationErrorType[]
): { errorsMessages: ValidationErrorType[]} => {
  return { errorsMessages: errors };
}
