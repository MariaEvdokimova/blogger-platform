import { EntityNotFoundError } from "../../core/errors/entity-not-found.error";
import { injectable } from "inversify";
import { UserDocument, UserModel } from "../domain/user.entity";
import mongoose, { Types } from "mongoose";

@injectable()
export class UsersRepository {

  async save( user: UserDocument ): Promise<string> {
    const insertResult = await user.save();
    return insertResult._id.toString();
  }
  
  async doesExistByLoginOrEmail(
    login: string,
    email: string
  ): Promise< UserDocument | null> {
    return UserModel.findOne({
      $or: [{ email }, { login }],
      deletedAt: null
    });
  }

  async findByLoginOrEmail( loginOrEmail: string ): Promise<UserDocument | null> {
    return UserModel.findOne( {
      $or: [
        { login: loginOrEmail },
        { email: loginOrEmail }
      ], 
      deletedAt: null
    });
  }
  
  async findByEmail( email: string ): Promise<UserDocument | null> {
    return UserModel.findOne({ email, deletedAt: null });
  }

  async findByIdOrFail(id: string): Promise<UserDocument> {
    this._checkObjectId(id);
     
    const user = await UserModel.findOne({ _id: new Types.ObjectId(id), deletedAt: null });
     
    if ( !user ) {
      throw new EntityNotFoundError();
    }
     
    return user;
  }

  async findUserByConfirmationCode ( code: string ): Promise<UserDocument | null> {
    return UserModel.findOne({ "emailConfirmation.confirmationCode": code, deletedAt: null });
  }

  private _checkObjectId(id: string): boolean | EntityNotFoundError {
    const isValidId = mongoose.isValidObjectId(id);
    if ( !isValidId ) {
      throw new EntityNotFoundError();
    }
    return isValidId;
  }
}
