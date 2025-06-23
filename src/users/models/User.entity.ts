import { add } from "date-fns/add";
import { ConfirmetionStatus, UserDocument, UserModel } from "../domain/user.entity";
import { CreateUserDto } from "../dto/user.create-dto";

export class UserEntity {
  createdAt: Date = new Date();
  deletedAt: Date | null = null;
 
  constructor(
    public login: string,
    public email: string,
    public passwordHash: string,
    public emailConfirmation: {
      expirationDate: Date | null;
      confirmationCode: string;
      isConfirmed: ConfirmetionStatus;
    }
  ){}
 
  static createUser(dto: CreateUserDto){
    return new UserModel({
      login: dto.login,
      email: dto.email,
      passwordHash: dto.passwordHash,
      emailConfirmation: {
        expirationDate: null,
        confirmationCode: dto?.confirmationCode ?? '',
        isConfirmed: dto?.isConfirmed ?? ConfirmetionStatus.unconfirmed
      }
    }) as UserDocument
  }

  markAsDeleted(): void {
    this.deletedAt = new Date();
  }

  updateEmailConfirmationCode( code: string ): void {
    const expirationDate = add(new Date(), { hours: 1 });

    this.emailConfirmation.expirationDate = expirationDate;
    this.emailConfirmation.confirmationCode = code;
  }

  updatePasswordHash( passwordHash: string ): void {
    this.passwordHash = passwordHash;
  }

  updateEmailConfirmed (): void {
    this.emailConfirmation.isConfirmed = ConfirmetionStatus.confirmed;
  }

}
