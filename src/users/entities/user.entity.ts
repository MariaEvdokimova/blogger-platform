import { add } from "date-fns/add";
import { uuidService } from "../adapters/uuid.service";

export enum ConfirmetionStatus {
  confirmed = 'confirmed',
  unconfirmed = 'unconfirmed',
 };

export class User {
  login: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
  emailConfirmation: {    
    expirationDate: Date;
    confirmationCode: string;
    isConfirmed: ConfirmetionStatus;
  }

  constructor(
    login: string, 
    email: string, 
    hash: string,
    emailConfirmation?: Partial<{      
      expirationDate: Date;
      confirmationCode: string;
      isConfirmed: ConfirmetionStatus;
    }>) {
      this.login = login
      this.email = email
      this.passwordHash = hash
      this.createdAt = new Date()
      this.emailConfirmation = {
          expirationDate: emailConfirmation?.expirationDate ?? add(new Date(), {
            hours: 1,
            minutes: 3
          }),
          confirmationCode: emailConfirmation?.confirmationCode ?? uuidService.generate(),
          isConfirmed: emailConfirmation?.isConfirmed ?? ConfirmetionStatus.unconfirmed
      }
  }
}
