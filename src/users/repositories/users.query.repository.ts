import { ObjectId, WithId } from "mongodb";
import { userCollection } from "../../db/mongo.db";
import { User } from "../types/user";
import { UserViewModel } from "../types/user-view-model";
import { PaginationQueryParamsDto } from "../../core/dto/pagination.input-dto";
import { mapToUserViewModel } from "../routers/mappers/map-to-user-view-model.util";
import { EntityNotFoundError } from "../../core/errors/entity-not-found.error";

export const usersQueryRepository = {
  async FindById( id: string ): Promise<WithId<User> | null> {
    return userCollection.findOne({_id: new ObjectId(id)});
  },

  async findByIdOrFail(id: string): Promise<WithId<User>> {
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

  async mapToUserViewModel(user: WithId<User>): Promise<UserViewModel> {
    return {
      id: user._id.toString(),
      login: user.login,
      email: user.email,
      createdAt: user.createdAt,
    };
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
        items: dto.users.map(mapToUserViewModel)
      };
    },
}
