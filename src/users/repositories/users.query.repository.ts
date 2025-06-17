import { UserViewModel } from "../types/user-view-model";
import { PaginationQueryParamsDto } from "../../core/dto/pagination.input-dto";
import { EntityNotFoundError } from "../../core/errors/entity-not-found.error";
import { injectable } from "inversify";
import mongoose, { Types } from "mongoose";
import { UserDocument, UserModel } from "../domain/user.entity";

@injectable()
export class UsersQueryRepository {
  async findById( id: string ): Promise<UserViewModel | null> {
    this._checkObjectId(id);
    const user = await UserModel.findOne({ _id: new Types.ObjectId(id), deletedAt: null });
    
    return user ? this._mapToUserViewModel( user ) : null;
  }

  async getUsers( dto: PaginationQueryParamsDto ): Promise<UserDocument[]> {
    let filter: any = {};
    const { pageNumber, pageSize, sortBy, sortDirection, searchLoginTerm, searchEmailTerm } = dto;

    if (searchLoginTerm || searchEmailTerm) {
      filter = {
        $or: [
          { login: { $regex: searchLoginTerm, $options: 'i' } },
          { email: { $regex: searchEmailTerm, $options: 'i' } }
        ], 
        deletedAt: null
      };
    }

    return UserModel
      .find( filter )
      .sort({ [sortBy]: sortDirection })
      .skip( (pageNumber - 1 ) * pageSize)
      .limit( pageSize );     
  }

  async getUsersCount( searchLoginTerm: string | null, searchEmailTerm: string | null ): Promise<number> {
      let filter: any = {};

      if (searchLoginTerm || searchEmailTerm) {
        filter = {
          $or: [
            { login: { $regex: searchLoginTerm, $options: 'i' } },
            { email: { $regex: searchEmailTerm, $options: 'i' } }
          ], 
          deletedAt: null
        };
      }

      return UserModel.countDocuments(filter);
    }

   private _mapToUserViewModel(user: UserDocument): UserViewModel {
    return {
      id: user._id.toString(),
      login: user.login,
      email: user.email,
      createdAt: user.createdAt,
    };
  }

  async mapMeViewModel ( user: UserViewModel) {
    return { 
      email:	user.email,
      login:	user.login,
      userId:	user.id,
     }
  }

  async mapPaginationViewMdel (
      dto: {
        users: UserDocument[], 
        pageSize: number, 
        pageNumber: number, 
        usersCount: number,
      }
    ) {
      return {
        pagesCount: Math.ceil(dto.usersCount / dto.pageSize),
        page: dto.pageNumber,
        pageSize: dto.pageSize,
        totalCount: dto.usersCount,
        items: dto.users.map(this._mapToUserViewModel)
      };
    }
    
  private _checkObjectId(id: string): boolean | EntityNotFoundError {
    const isValidId = mongoose.isValidObjectId(id);
    if ( !isValidId ) {
      throw new EntityNotFoundError();
    }
    return isValidId;
  }
}
