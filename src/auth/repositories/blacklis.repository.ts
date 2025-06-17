/*import { injectable } from "inversify";
import { blacklistCollection } from "../../db/mongo.db";

@injectable()
export class BlacklistRepository {

  async addToBlacklist( refreshToken: string ): Promise<string> {
    const insertResult = await blacklistCollection.insertOne( {
      token: refreshToken,
      createdAt: new Date()
    } );
    return insertResult.insertedId.toString();
  }

  async isTokenBlacklisted(token: string): Promise<boolean> {
    const blacklistToken = await blacklistCollection.findOne({ token });
    return blacklistToken !== null;
  }
}
*/