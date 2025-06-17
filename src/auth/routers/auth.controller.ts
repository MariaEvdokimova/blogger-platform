import { Request, Response } from "express";
import { HttpStatus } from "../../core/types/http-statuses";
import { UsersQueryRepository } from "../../users/repositories/users.query.repository";
import { errorsHandler } from "../../core/errors/errors.handler";
import { LoginInput } from "../dto/login.input-dto";
import { cookieConfig } from "../../core/types/cookie";
import { NewPasswordInputDto } from "../dto/new-password.input-dto";
import { PasswordRecoveryInputDto } from "../dto/password-recovery.input-dto";
import { RegistrationConfirmationInputDto } from "../dto/registration-confirmation.input-dto";
import { RegistrationEmailResendingInputDto } from "../dto/registration-email-resending.input-dto";
import { UserInputDto } from "../../users/dto/user.input-dto";
import { AuthService } from "../application/auth.service";
import { CookieService } from "../adapters/cookie.service";
import { inject, injectable } from "inversify";

@injectable()
export class AuthController {
  constructor(
    @inject(UsersQueryRepository) private usersQueryRepository: UsersQueryRepository,
    @inject(AuthService) private authService: AuthService,
    @inject(CookieService) private cookieService: CookieService
  ){}

  async getMe (
    req: Request, 
    res: Response
  ) {
    try {    
      const userId = req.user?.id as string;

      if (!userId) {
        res.sendStatus(HttpStatus.Unauthorized);
        return;
      }
      const user = await this.usersQueryRepository.findById(userId);
      if (!user) {
        res.sendStatus(HttpStatus.Unauthorized);
        return;
      }

      const meViewModel = await this.usersQueryRepository.mapMeViewModel( user );

      res.status(HttpStatus.Success).send( meViewModel );
  
    } catch (e: unknown) {
      errorsHandler(e, res);
    }
  }

  async loginAuth (
    req: Request<{}, {}, LoginInput>, 
    res: Response
  ) {
    try {    
      const ip = req.ip || '';
      const deviceName = req.headers['user-agent'] || 'Unknown device';
      const refreshToken= req.cookies[cookieConfig.refreshToken.name];
      const { loginOrEmail, password } = req.body;
      const tokens = await this.authService.loginUser({ loginOrEmail, password, refreshToken, deviceName, ip });
     
      this.cookieService.createRefreshTokenCookie( res, tokens.refreshToken );  
      res.status(HttpStatus.Success).send({ accessToken: tokens.accessToken });
      
    } catch (e: unknown) {
      errorsHandler(e, res);
    }
  }

  async logoutAuth (
  req: Request, 
  res: Response
){
  try {    
    //const refreshToken= req.cookies[cookieConfig.refreshToken.name];
    await this.authService.logoutUser( req.user!.id, req.deviceId! );
  
    this.cookieService.clearRefreshTokenCookie( res );
    res.status(HttpStatus.NoContent).send();
    
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
}

async newPassword (
  req: Request<{}, {}, NewPasswordInputDto>, 
  res: Response
) {
  try {    
    await this.authService.newPassword( req.body );
    res.status(HttpStatus.NoContent).send();
    
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
}

async passwordRecovery (
  req: Request<{}, {}, PasswordRecoveryInputDto>, 
  res: Response
) {
  try {    
    await this.authService.passwordRecovery( req.body );
    res.status(HttpStatus.NoContent).send();    
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
}

async refreshToken (
  req: Request, 
  res: Response
){
  try {    
    const userId = req.user?.id as string;
    if (!userId) {
      res.sendStatus(HttpStatus.Unauthorized);
      return;
    }
    
    const user = this.usersQueryRepository.findById(userId);
    if ( !user ) {
      res.sendStatus(HttpStatus.Unauthorized);
      return;
    }

    //const refreshToken= req.cookies[cookieConfig.refreshToken.name];
    const tokens = await this.authService.refreshToken( userId, req.deviceId! );
    
    this.cookieService.createRefreshTokenCookie( res, tokens.refreshToken );
    res.status(HttpStatus.Success).send({ accessToken: tokens.accessToken });
    
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
}

async registrationConfirmation (
  req: Request< {}, {}, RegistrationConfirmationInputDto >, 
  res: Response
){
  try {   
    await this.authService.registrationConfirmation( req.body );

    res.status(HttpStatus.NoContent).send();
 
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
}

async registrationEmailResending (
  req: Request< {}, {}, RegistrationEmailResendingInputDto>, 
  res: Response
){
  try {
    await this.authService.registrationEmailResending( req.body );
    res.status(HttpStatus.NoContent).send();
 
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
}

async registration (
  req: Request< {}, {}, UserInputDto>, 
  res: Response
){
  try {    
    await this.authService.registerUser( req.body );

    res.status(HttpStatus.NoContent).send(); 
    
  } catch (e: unknown) {
    errorsHandler(e, res);
  }
}

}
