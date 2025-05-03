import { UserInputDto } from "../dto/user.input-dto";
import { usersRepository } from "../repositories/users.repository";
import { bcryptService } from '../../auth/adapters/bcrypt.service';

export const usersService = {
  async create( user: UserInputDto ): Promise<string> {
    const { login, email, password } = user;

    await usersRepository.existsFieldValue( 'login', login );
    await usersRepository.existsFieldValue( 'email', email );

    const passwordHash = await bcryptService.generateHash( password );

    const newUser = {
      login: login,
      password: passwordHash,
      email: email,
      createdAt: new Date(),
    };

    return await usersRepository.create( newUser );
  },

  async delete ( id: string ): Promise<void> {
    await usersRepository.delete( id );
    return;
  },
}
