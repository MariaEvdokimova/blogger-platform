import { ObjectId, WithId } from "mongodb";
import { userCollection } from "../../db/mongo.db";
import { User } from "../types/user";
import { ValidationError } from "../../core/errors/validation.error";
import { EntityNotFoundError } from "../../core/errors/entity-not-found.error";

export const usersRepository = {
  async existsFieldValue( field: string, value: string ): Promise<void> {
    const result = await userCollection.findOne({ [field]: value });

    if ( !!result ) {
      throw new ValidationError( `The ${field} is not unique`, field );
    }

    return;
  },

  async findByLoginOrEmail( loginOrEmail: string ): Promise<WithId<User> | null> {
    return userCollection.findOne( {
      $or: [
        { login: loginOrEmail },
        { email: loginOrEmail }
      ]
    });
  },

  async create( newUser: User ): Promise<string> {
    const insertResult = await userCollection.insertOne( newUser );
    return insertResult.insertedId.toString();
  },

  async delete ( id: string ): Promise<void> {
    this._checkObjectId(id);
    
    const deleteResult = await userCollection.deleteOne({
      _id: new ObjectId(id),
    });

    if (deleteResult.deletedCount < 1) {
      throw new EntityNotFoundError();
    }

    return;
 },
  
  _checkObjectId(id: string): boolean | EntityNotFoundError {
    const isValidId = ObjectId.isValid(id);
    if ( !isValidId ) {
      throw new EntityNotFoundError();
    }
    return isValidId;
  },
}
