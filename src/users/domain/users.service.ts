import bcrypt from 'bcryptjs';

import { UserInputDto } from "../dto/user.input-dto";
import { usersRepository } from "../repositories/users.repository";

export const usersService = {
  async create( user: UserInputDto ): Promise<string> {

    await usersRepository.existsFieldValue( 'login', user.login );
    await usersRepository.existsFieldValue( 'email', user.email );

    const passwordHash = await this._generateHash( user.password );

    const newUser = {
      login: user.login,
      password: passwordHash,
      email: user.email,
      createdAt: new Date(),
    };

    return await usersRepository.create( newUser );
  },

  async delete ( id: string ): Promise<void> {
    await usersRepository.delete( id );
    return;
  },

  async _generateHash ( password: string ) {
    return bcrypt.hash( password, 10);
  },
}
