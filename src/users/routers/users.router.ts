import { Router } from "express";
import { createUserHandler } from "./handlers/create-user.handler";
import { superAdminGuardMiddleware } from "../../auth/middlewares/super-admin.guard-middleware";
import { inputValidationResultMiddleware } from "../../core/middlewares/validation/input-validtion-result.middleware";
import { deleteUserHandler } from "./handlers/delete-user.handler";
import { paginationAndSortingValidation } from "../../core/middlewares/validation/query-pagination-sorting.validation-middlewares";
import { UserSortField } from "../types/sort";
import { getUserListHandler } from "./handlers/get-user-list.handler";
import { passwordValidation } from "../validation/password.validation";
import { loginValidation } from "../validation/login.validation";
import { emailValidation } from "../validation/email.validation";

export const usersRouter = Router({});

usersRouter
  .get(
    '',
    superAdminGuardMiddleware,
    paginationAndSortingValidation(UserSortField),
    inputValidationResultMiddleware, 
    getUserListHandler
  )
  
  .post(
    '', 
    superAdminGuardMiddleware,
    passwordValidation,
    loginValidation,
    emailValidation,
    inputValidationResultMiddleware,
    createUserHandler
  )

  .delete(
    '/:id',    
    superAdminGuardMiddleware,
    deleteUserHandler
  )
