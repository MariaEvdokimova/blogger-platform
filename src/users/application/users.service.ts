import { UserInputDto } from "../dto/user.input-dto";
import { UsersRepository } from "../repositories/users.repository";
import { BcryptService } from '../../auth/adapters/bcrypt.service';
import { inject, injectable } from "inversify";
import { ConfirmetionStatus, UserModel } from "../domain/user.entity";
import { ValidationError } from "../../core/errors/validation.error";

@injectable()
export class UsersService {
  constructor(
    @inject(UsersRepository) public usersRepository: UsersRepository,
    @inject(BcryptService) public bcryptService: BcryptService
  ){}

  async create( user: UserInputDto ): Promise<string> {
    const { login, email, password } = user;

    const userFounded = await this.usersRepository.doesExistByLoginOrEmail( login, email );
    
    if ( userFounded ) {
      if ( userFounded.email === email ) {
        throw new ValidationError( `The email is not unique`, 'email' );
      } else {  
        throw new ValidationError( `The login is not unique`, 'login' );
      }
    }

    const passwordHash = await this.bcryptService.generateHash( password );

    const newUser = new UserModel();
    newUser.login = login;
    newUser.email = email;
    newUser.passwordHash = passwordHash;
    newUser.emailConfirmation.isConfirmed = ConfirmetionStatus.confirmed;

    return await this.usersRepository.save( newUser );
  }

  async delete ( id: string ): Promise<void> {
    const user = await this.usersRepository.findByIdOrFail( id );
    user.deletedAt = new Date();
    await this.usersRepository.save( user );
    return;
  }
}
