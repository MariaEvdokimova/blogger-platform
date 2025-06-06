import { UserInputDto } from "../dto/user.input-dto";
import { UsersRepository } from "../repositories/users.repository";
import { BcryptService } from '../../auth/adapters/bcrypt.service';
import { ConfirmetionStatus, User } from "../entities/user.entity";
import { inject, injectable } from "inversify";

@injectable()
export class UsersService {
  constructor(
    @inject(UsersRepository) public usersRepository: UsersRepository,
    @inject(BcryptService) public bcryptService: BcryptService
  ){}

  async create( user: UserInputDto ): Promise<string> {
    const { login, email, password } = user;

    await this.usersRepository.doesExistByLoginOrEmail( login, email );

    const passwordHash = await this.bcryptService.generateHash( password );

    const newUser = new User( 
      login, 
      email, 
      passwordHash,
      {
        confirmationCode: '',
        isConfirmed: ConfirmetionStatus.confirmed,
      });
    return await this.usersRepository.create( newUser );
  }

  async delete ( id: string ): Promise<void> {
    await this.usersRepository.delete( id );
    return;
  }
}
