import { Router } from "express";
import { loginAuthHandler } from "./handlers/login-auth.handler";
import { inputValidationResultMiddleware } from "../../core/middlewares/validation/input-validtion-result.middleware";
import { passwordValidation } from "../../users/validation/password.validation";
import { loginOrEmailValidation } from "../../users/validation/login-or-email.validation";
import { accessTokenGuard } from "./guards/access.token.guard";
import { getMeHandler } from "./handlers/get-me.handler";

export const authRouter = Router({});

authRouter
  .post(
    '/login',
    passwordValidation,
    loginOrEmailValidation,
    inputValidationResultMiddleware,
    loginAuthHandler
  )

  .get(
    '/me',
    accessTokenGuard,
    getMeHandler
  )
  