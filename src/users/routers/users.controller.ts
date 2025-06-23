import { Request, Response } from "express";
import { UserInputDto } from "../dto/user.input-dto";
import { HttpStatus } from "../../core/types/http-statuses";
import { errorsHandler } from "../../core/errors/errors.handler";
import { UsersService } from "../application/users.service";
import { UsersQueryRepository } from "../repositories/users.query.repository";
import { setDefaultSortAandPagination } from "../../core/helpers/set-default-sort-and-pagination";
import { inject, injectable } from "inversify";

@injectable()
export class UsersController {
  constructor(
    @inject(UsersService) public usersService: UsersService,
    @inject(UsersQueryRepository) public usersQueryRepository: UsersQueryRepository
  ){}

  async createUser (
    req: Request< {}, {}, UserInputDto>,
    res: Response
  ){
    try {
      const createdUserId = await this.usersService.create( req.body );
      const userViewModel = await this.usersQueryRepository.findById( createdUserId );
  
      res.status(HttpStatus.Created).send(userViewModel);
  
    } catch (e: unknown) {
      console.log('e ', e)
      errorsHandler(e, res);
    }
  }

  async deleteUser (
    req: Request< {id: string},{},{} >,
    res: Response
  ){
    try {
      const id = req.params.id;
    
      await this.usersService.delete( id );
      
      res.status( HttpStatus.NoContent ).send();
    } catch ( e: unknown ) {
      errorsHandler(e, res);
    }
  }

  async getUserList (req: Request, res: Response) {
    try {
      const { pageNumber, pageSize, sortBy, sortDirection} = setDefaultSortAandPagination( req );   
      const searchLoginTerm = req.query.searchLoginTerm?.toString() || null;
      const searchEmailTerm = req.query.searchEmailTerm?.toString() || null;
  
      const users = await this.usersQueryRepository.getUsers( 
        { 
          pageNumber, 
          pageSize, 
          sortBy, 
          sortDirection, 
          searchLoginTerm, 
          searchEmailTerm
        } 
      );
      const usersCount = await this.usersQueryRepository.getUsersCount( searchLoginTerm, searchEmailTerm );
      const userListOutput = await this.usersQueryRepository.mapPaginationViewMdel(
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
}
