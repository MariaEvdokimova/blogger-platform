import { UserInputDto } from "../dto/user.input-dto";
import { usersRepository } from "../repositories/users.repository";
import { bcryptService } from '../../auth/adapters/bcrypt.service';
import { ConfirmetionStatus, User } from "../entities/user.entity";

export const usersService = {
  async create( user: UserInputDto ): Promise<string> {
    const { login, email, password } = user;

    await usersRepository.doesExistByLoginOrEmail( login, email );

    const passwordHash = await bcryptService.generateHash( password );

    const newUser = new User( 
      login, 
      email, 
      passwordHash,
      {
        confirmationCode: '',
        isConfirmed: ConfirmetionStatus.confirmed,
      });
    return await usersRepository.create( newUser );
  },

  async delete ( id: string ): Promise<void> {
    await usersRepository.delete( id );
    return;
  },
}
