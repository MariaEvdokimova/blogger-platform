import bcrypt from 'bcryptjs';

import { UnauthorizedError } from "../../core/errors/unauthorized.error";
import { usersRepository } from "../../users/repositories/users.repository";
import { LoginInputDto } from "../dto/login.input-dto";

export const authService = {
  async checkCredentials ( dto: LoginInputDto ): Promise<void> {
    const user = await usersRepository.findByLoginOrEmail( dto.loginOrEmail );
    if (!user) { 
      throw new UnauthorizedError();
    }

    const isPasswordCorrect = await bcrypt.compare(dto.password, user.password);
    if ( !isPasswordCorrect ) { 
      throw new UnauthorizedError();
    }

    return;
  },
}
