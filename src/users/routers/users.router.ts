import { Router } from "express";
import { createUserHandler } from "./handlers/create-user.handler";
import { superAdminGuardMiddleware } from "../../auth/middlewares/super-admin.guard-middleware";
import { inputValidationResultMiddleware } from "../../core/middlewares/validation/input-validtion-result.middleware";
import { userInputDtoValidation } from "../validation/user.input-dto.validation-middlewares";
import { idValidation } from "../../core/middlewares/validation/params-id.validation-middleware";
import { deleteUserHandler } from "./handlers/delete-user.handler";
import { paginationAndSortingValidation } from "../../core/middlewares/validation/query-pagination-sorting.validation-middlewares";
import { UserSortField } from "../types/sort";
import { getUserListHandler } from "./handlers/get-user-list.handler";

export const usersRouter = Router({});

usersRouter
  .get(
    '',
    superAdminGuardMiddleware,
    paginationAndSortingValidation(UserSortField),
    getUserListHandler
  )
  
  .post(
    '', 
    superAdminGuardMiddleware,
    userInputDtoValidation,
    inputValidationResultMiddleware,
    createUserHandler
  )

  .delete(
    '/:id',    
    superAdminGuardMiddleware,
    idValidation,
    inputValidationResultMiddleware,
    deleteUserHandler
  )
