export class CreateRateLimitDto {
  constructor(
    public ip: string,
    public url: string,
  ) {}
}
