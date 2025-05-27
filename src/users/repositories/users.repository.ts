import { ObjectId, WithId } from "mongodb";
import { userCollection } from "../../db/mongo.db";
import { ValidationError } from "../../core/errors/validation.error";
import { EntityNotFoundError } from "../../core/errors/entity-not-found.error";
import { ConfirmetionStatus, User } from "../entities/user.entity";

export const usersRepository = {

  async doesExistByLoginOrEmail(
    login: string,
    email: string
  ): Promise<void> {
    const user = await userCollection.findOne({
      $or: [{ email }, { login }],
    });
    
    if ( user ) {
      if ( user.email === email ) {
        throw new ValidationError( `The email is not unique`, 'email' );
      } else {  
        throw new ValidationError( `The login is not unique`, 'login' );
      }
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

 async findUserByConfirmationCode ( code: string ): Promise<WithId<User> | null> {
    return userCollection.findOne({ "emailConfirmation.confirmationCode": code });
 },

 async updateConfirmationStatus ( id: ObjectId ): Promise<void> {
    userCollection.updateOne( 
      {
        _id: id
      }, 
      {
        $set: { 
          "emailConfirmation.isConfirmed": ConfirmetionStatus.confirmed
        }
      }
    );
    return;
  },
  
  async updateConfirmation ( id: ObjectId, expirationDate: Date, confirmationCode: string ): Promise<number> {
    const updatedResult = await userCollection.updateOne( 
      {
        _id: id
      }, 
      {
        $set: { 
          "emailConfirmation.expirationDate": expirationDate,
          "emailConfirmation.confirmationCode": confirmationCode,
        }
      }
    );
    return updatedResult.matchedCount;
  },

  _checkObjectId(id: string): boolean | EntityNotFoundError {
    const isValidId = ObjectId.isValid(id);
    if ( !isValidId ) {
      throw new EntityNotFoundError();
    }
    return isValidId;
  },
}
