import { Router } from "express";
import { loginAuthHandler } from "./handlers/login-auth.handler";
import { inputValidationResultMiddleware } from "../../core/middlewares/validation/input-validtion-result.middleware";
import { passwordValidation } from "../../users/validation/password.validation";
import { loginOrEmailValidation } from "../../users/validation/login-or-email.validation";
import { accessTokenGuard } from "./guards/access.token.guard";
import { getMeHandler } from "./handlers/get-me.handler";
import { routersPaths } from "../../core/paths/paths";
import { emailValidation } from "../../users/validation/email.validation";
import { loginValidation } from "../../users/validation/login.validation";
import { codeValidation } from "../validation/codeValidation";
import { registrationEmailResendingHandler } from "./handlers/registration-email-resending.handler";
import { registrationHandler } from "./handlers/registration.handler";
import { registrationConfirmationHandler } from "./handlers/registration-confirmation.handler";
import { refreshTokenHandler } from "./handlers/refresh-token.handler";
import { refreshTokenGuard } from "./guards/refresh.token.guard";
import { logoutAuthHandler } from "./handlers/logout-auth.handler";

export const authRouter = Router({});

authRouter
  .post(
    routersPaths.auth.login,
    passwordValidation,
    loginOrEmailValidation,
    inputValidationResultMiddleware,
    loginAuthHandler
  )

  .post(
    routersPaths.auth.refreshToken,
    refreshTokenGuard,
    refreshTokenHandler
  )

  .post(
    routersPaths.auth.registrationConfirmation,
    codeValidation,
    inputValidationResultMiddleware,
    registrationConfirmationHandler
  )

  .post(
    routersPaths.auth.registration,
    loginValidation,
    passwordValidation,
    emailValidation,
    inputValidationResultMiddleware,
    registrationHandler
  )
  
  .post(
    routersPaths.auth.registrationEmailResending,
    emailValidation,
    inputValidationResultMiddleware,
    registrationEmailResendingHandler
  )

  .post(
    routersPaths.auth.logout,
    refreshTokenGuard,
    logoutAuthHandler
  )

  .get(
    routersPaths.auth.me,
    accessTokenGuard,
    getMeHandler
  )
  