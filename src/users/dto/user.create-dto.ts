import { ConfirmetionStatus } from "../domain/user.entity";

export class CreateUserDto {
  constructor(
    public login: string,
    public email: string,
    public passwordHash: string,
    public confirmationCode?: string,
    public isConfirmed?: ConfirmetionStatus,
  ) {}
}
