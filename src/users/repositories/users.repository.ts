import { ObjectId, WithId } from "mongodb";
import { userCollection } from "../../db/mongo.db";
import { User } from "../types/user";
import { ValidationError } from "../../core/errors/validation.error";

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
    const deleteResult = await userCollection.deleteOne({
      _id: new ObjectId(id),
    });

    if (deleteResult.deletedCount < 1) {
      throw new Error('Driver not exist');
    }

    return;
 },
}
