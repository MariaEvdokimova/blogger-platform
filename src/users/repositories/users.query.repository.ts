import { ObjectId, WithId } from "mongodb";
import { userCollection } from "../../db/mongo.db";
import { UserViewModel } from "../types/user-view-model";
import { PaginationQueryParamsDto } from "../../core/dto/pagination.input-dto";
import { EntityNotFoundError } from "../../core/errors/entity-not-found.error";
import { User } from "../entities/user.entity";

export const usersQueryRepository = {
  async findById( id: string ): Promise<UserViewModel | null> {
    this._checkObjectId(id);
    const user = await userCollection.findOne({_id: new ObjectId(id)});
    
    return user ? this._mapToUserViewModel( user ) : null;
  },

  async findByIdOrFail(id: string): Promise<WithId<User>> {
    this._checkObjectId(id);
    
    const user = await userCollection.findOne({ _id: new ObjectId(id)});
    
    if ( !user ) {
      throw new EntityNotFoundError();
    }
    
    return user;
  },

  async getUsers( dto: PaginationQueryParamsDto ): Promise<WithId<User>[]> {
    let filter: any = {};
    const { pageNumber, pageSize, sortBy, sortDirection, searchLoginTerm, searchEmailTerm } = dto;

    if (searchLoginTerm || searchEmailTerm) {
      filter = {
        $or: [
          { login: { $regex: searchLoginTerm, $options: 'i' } },
          { email: { $regex: searchEmailTerm, $options: 'i' } }
        ]
      };
    }

    return userCollection
      .find( filter )
      .sort({ [sortBy]: sortDirection })
      .skip( (pageNumber - 1 ) * pageSize)
      .limit( pageSize )
      .toArray();
  },

  async getUsersCount( searchLoginTerm: string | null, searchEmailTerm: string | null ): Promise<number> {
      let filter: any = {};

      if (searchLoginTerm || searchEmailTerm) {
        filter = {
          $or: [
            { login: { $regex: searchLoginTerm, $options: 'i' } },
            { email: { $regex: searchEmailTerm, $options: 'i' } }
          ]
        };
      }

      return userCollection.countDocuments(filter);
    },

   _mapToUserViewModel(user: WithId<User>): UserViewModel {
    return {
      id: user._id.toString(),
      login: user.login,
      email: user.email,
      createdAt: user.createdAt,
    };
  },

  async mapMeViewModel ( user: UserViewModel) {
    return { 
      email:	user.email,
      login:	user.login,
      userId:	user.id,
     }
  },

  async mapPaginationViewMdel (
      dto: {
        users: WithId<User>[], 
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
    },
    
  _checkObjectId(id: string): boolean | EntityNotFoundError {
    const isValidId = ObjectId.isValid(id);
    if ( !isValidId ) {
      throw new EntityNotFoundError();
    }
    return isValidId;
  },
}
