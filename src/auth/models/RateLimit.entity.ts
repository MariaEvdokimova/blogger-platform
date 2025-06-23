import { RateLimitDocument, RateLimitModel } from "../domain/rate-limit.entity";
import { CreateRateLimitDto } from "../dto/rate-limit.create-dto";

export class RateLimitEntity {
  date: Date = new Date();
 
  constructor(
    public ip: string,
    public url: string,
  ){}
 
  static createRateLimit(dto: CreateRateLimitDto){
    return new RateLimitModel({
      ip: dto.ip,
      url: dto.url,
    }) as RateLimitDocument
  }
}