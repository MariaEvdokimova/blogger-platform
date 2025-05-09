import { UnauthorizedError } from "../../core/errors/unauthorized.error";
import { usersRepository } from "../../users/repositories/users.repository";
import { LoginInputDto } from "../dto/login.input-dto";
import { bcryptService } from '../adapters/bcrypt.service';
import { jwtService } from "../adapters/jwt.service";
import { WithId } from "mongodb";
import { User } from "../../users/types/user";

export const authService = {
  async loginUser ( dto: LoginInputDto ): Promise<{ accessToken: string } | null> {
    const { loginOrEmail, password } = dto;
  
    const result = await this._checkCredentials( loginOrEmail, password );
    const accessToken =  await jwtService.createToken( result._id.toString() );

    return { accessToken }; 
  },

  async _checkCredentials ( 
    loginOrEmail: string,
    password: string
  ): Promise<WithId<User>> {
    const user = await usersRepository.findByLoginOrEmail( loginOrEmail );
    if (!user) { 
      throw new UnauthorizedError();
    }

    const isPasswordCorrect = await bcryptService.checkPassword(password, user.password);
    if ( !isPasswordCorrect ) { 
      throw new UnauthorizedError();
    }

    return user;
  },
}
