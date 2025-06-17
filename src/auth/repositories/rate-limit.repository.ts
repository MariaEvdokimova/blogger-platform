import { injectable } from "inversify";
import { RateLimitDocument, RateLimitModel } from "../domain/rate-limit.entity";

@injectable()
export class RateLimitRepository {  
  async save( attempt: RateLimitDocument ): Promise<RateLimitDocument> {
    return await attempt.save();
  }
  
  async getAttemptsCountFromDate( ip: string, url: string ): Promise<number> {
    const tenSecondsAgo = new Date(Date.now() - 10 * 1000); // текущая дата минус 10 секунд

    return RateLimitModel.countDocuments({ip, url, date: { $gte: tenSecondsAgo } });
  }
};
