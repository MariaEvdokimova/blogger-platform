import { Router } from "express";
import { superAdminGuardMiddleware } from "../../auth/middlewares/super-admin.guard-middleware";
import { inputValidationResultMiddleware } from "../../core/middlewares/validation/input-validtion-result.middleware";
import { paginationAndSortingValidation } from "../../core/middlewares/validation/query-pagination-sorting.validation-middlewares";
import { UserSortField } from "../types/sort";
import { passwordValidation } from "../validation/password.validation";
import { loginValidation } from "../validation/login.validation";
import { emailValidation } from "../validation/email.validation";
import { container } from "../../composition-root";
import { UsersController } from "./users.controller";

const usersController = container.get(UsersController);
export const usersRouter = Router({});

usersRouter
  .get(
    '',
    superAdminGuardMiddleware,
    paginationAndSortingValidation(UserSortField),
    inputValidationResultMiddleware, 
    usersController.getUserList.bind(usersController)
  )
  
  .post(
    '', 
    superAdminGuardMiddleware,
    passwordValidation,
    loginValidation,
    emailValidation,
    inputValidationResultMiddleware,
    usersController.createUser.bind(usersController)
  )

  .delete(
    '/:id',    
    superAdminGuardMiddleware,
    usersController.deleteUser.bind(usersController)
  )
