import { Router } from "express";
import { inputValidationResultMiddleware } from "../../core/middlewares/validation/input-validtion-result.middleware";
import { passwordValidation } from "../../users/validation/password.validation";
import { loginOrEmailValidation } from "../../users/validation/login-or-email.validation";
import { accessTokenGuard } from "./guards/access.token.guard";
import { routersPaths } from "../../core/paths/paths";
import { emailValidation } from "../../users/validation/email.validation";
import { loginValidation } from "../../users/validation/login.validation";
import { codeValidation } from "../validation/codeValidation";
import { refreshTokenGuard } from "./guards/refresh.token.guard";
import { rateLimitMiddleware } from "../middlewares/rate-limit.middleware";
import { container } from "../../composition-root";
import { AuthController } from "./auth.controller";
import { recoveryCodeValidation } from "../../users/validation/recovery-code.validation";
import { newPasswordValidation } from "../../users/validation/new-password.validation";

const authController = container.get(AuthController);
export const authRouter = Router({});

authRouter
  .post(
    routersPaths.auth.login,
    rateLimitMiddleware,
    passwordValidation,
    loginOrEmailValidation,
    inputValidationResultMiddleware,
    authController.loginAuth.bind(authController)
  )

  .post(
    routersPaths.auth.passwordRecovery,
    rateLimitMiddleware,    
    emailValidation,
    inputValidationResultMiddleware,
    authController.passwordRecovery.bind(authController)
  )

  .post(
    routersPaths.auth.newPassword,
    rateLimitMiddleware,
    newPasswordValidation,    
    //recoveryCodeValidation,
    inputValidationResultMiddleware,
    authController.newPassword.bind(authController)
  )

  .post(
    routersPaths.auth.refreshToken,
    refreshTokenGuard,
    authController.refreshToken.bind(authController)
  )

  .post(
    routersPaths.auth.registrationConfirmation,
    rateLimitMiddleware,
    codeValidation,
    inputValidationResultMiddleware,
    authController.registrationConfirmation.bind(authController)
  )

  .post(
    routersPaths.auth.registration,
    rateLimitMiddleware,
    loginValidation,
    passwordValidation,
    emailValidation,
    inputValidationResultMiddleware,
    authController.registration.bind(authController)
  )
  
  .post(
    routersPaths.auth.registrationEmailResending,
    rateLimitMiddleware,
    emailValidation,
    inputValidationResultMiddleware,
    authController.registrationEmailResending.bind(authController)
  )

  .post(
    routersPaths.auth.logout,
    refreshTokenGuard,
    authController.logoutAuth.bind(authController)
  )

  .get(
    routersPaths.auth.me,
    accessTokenGuard,
    authController.getMe.bind(authController)
  )
  