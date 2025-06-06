import { add } from "date-fns/add";

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
  };

  constructor(
    login: string, 
    email: string, 
    hash: string,
    emailConfirmation?: Partial<{      
      expirationDate: Date;
      confirmationCode: string;
      isConfirmed: ConfirmetionStatus;
    }>,
  ) {
    this.login = login
    this.email = email
    this.passwordHash = hash
    this.createdAt = new Date()
    
    this.emailConfirmation = {
        expirationDate: emailConfirmation?.expirationDate ?? add(new Date(), {
          hours: 1,
          minutes: 3
        }),
        confirmationCode: emailConfirmation?.confirmationCode ?? '',
        isConfirmed: emailConfirmation?.isConfirmed ?? ConfirmetionStatus.unconfirmed
    }
  }
}
