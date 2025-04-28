import { Router } from "express";
import { loginAuthHandler } from "./handlers/login-auth.handler";
import { loginInputDtoValidation } from "../validation/login.input-dto.validation-middlevares";
import { inputValidationResultMiddleware } from "../../core/middlewares/validation/input-validtion-result.middleware";

export const authRouter = Router({});

authRouter
  .post(
    '',
    loginInputDtoValidation,
    inputValidationResultMiddleware,
    loginAuthHandler
  )
  