import { injectable } from "inversify";
import { rateLimitCollection } from "../../db/mongo.db";

@injectable()
export class RateLimitRepository {  
  async setAttempt(ip: string, url: string) {
    await rateLimitCollection.insertOne({ 
      ip, 
      url, 
      date: new Date()
    });
  }
  
  async getAttemptsCountFromDate( ip: string, url: string ): Promise<number> {
    const tenSecondsAgo = new Date(Date.now() - 10 * 1000); // текущая дата минус 10 секунд

    return rateLimitCollection.countDocuments({ip, url, date: { $gte: tenSecondsAgo } });
  }
};
