import { Request, Response } from "express";
import { errorsHandler } from "../../../core/errors/errors.handler";
import { setDefaultSortAandPagination } from "../../../core/helpers/set-default-sort-and-pagination";
import { usersQueryRepository } from "../../repositories/users.query.repository";
import { HttpStatus } from "../../../core/types/http-statuses";

export const getUserListHandler = async (req: Request, res: Response) => {
  try {
    const { pageNumber, pageSize, sortBy, sortDirection} = setDefaultSortAandPagination( req );   
    const searchLoginTerm = req.query.searchLoginTerm?.toString() || null;
    const searchEmailTerm = req.query.searchEmailTerm?.toString() || null;

    const users = await usersQueryRepository.getUsers( 
      { 
        pageNumber, 
        pageSize, 
        sortBy, 
        sortDirection, 
        searchLoginTerm, 
        searchEmailTerm
      } 
    );
    const usersCount = await usersQueryRepository.getUsersCount( searchLoginTerm, searchEmailTerm );
    const userListOutput = await usersQueryRepository.mapPaginationViewMdel(
          { 
            users,
            pageSize, 
            pageNumber, 
            usersCount 
          }
        );
    
    res.status(HttpStatus.Success).send(userListOutput);

  } catch (e: unknown) {
    errorsHandler(e, res);
  }
}
