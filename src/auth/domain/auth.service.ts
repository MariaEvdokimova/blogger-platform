import { UnauthorizedError } from "../../core/errors/unauthorized.error";
import { UsersRepository } from "../../users/repositories/users.repository";
import { LoginInputDto } from "../dto/login.input-dto";
import { BcryptService } from '../adapters/bcrypt.service';
import { JwtService } from "../adapters/jwt.service";
import { WithId } from "mongodb";
import { ConfirmetionStatus, User } from "../../users/entities/user.entity";
import { UserInputDto } from "../../users/dto/user.input-dto";
import { NodemailerService } from "../adapters/nodemailer.service";
import { EmailExamples } from "../adapters/emailExamples";
import { RegistrationConfirmationInputDto } from "../dto/registration-confirmation.input-dto";
import { ValidationError } from "../../core/errors/validation.error";
import { RegistrationEmailResendingInputDto } from "../dto/registration-email-resending.input-dto";
import { add } from "date-fns/add";
import { Result } from "../../core/result/result.type";
import { ResultStatus } from "../../core/result/resultCode";
import { IdType } from "../../core/types/id";
import { UuidService } from "../../users/adapters/uuid.service";
import { EntityNotFoundError } from "../../core/errors/entity-not-found.error";
import { SecurityDevicesRepository } from "../../securityDevices/repositories/securityDevices.repository";
import { SecurityDevice } from "../../securityDevices/entities/securityDevices.entity";
import { PasswordRecoveryInputDto } from "../dto/password-recovery.input-dto";
import { NewPasswordInputDto } from "../dto/new-password.input-dto";
import { inject, injectable } from "inversify";

type SessionData = {
  userId: string;
  deviceId: string;
}

@injectable()
export class AuthService {
  constructor (
    @inject(JwtService) private jwtService: JwtService,
    @inject(SecurityDevicesRepository) private securityDevicesRepository: SecurityDevicesRepository,
    @inject(UsersRepository) private usersRepository: UsersRepository,
    @inject(UuidService) private uuidService: UuidService,
    @inject(NodemailerService) private nodemailerService: NodemailerService,
    @inject(EmailExamples) private emailExamples: EmailExamples,
    @inject(BcryptService) private bcryptService: BcryptService,
  ) {}

  async loginUser ( dto: LoginInputDto ): Promise<{ accessToken: string, refreshToken: string }> {
    const { loginOrEmail, password, refreshToken, deviceName, ip } = dto;

    // if ( refreshTokenOld ) {
    //   const isTokenInBlackList = await blacklistRepository.isTokenBlacklisted( refreshTokenOld );
    //   if ( !isTokenInBlackList ) {
    //     await blacklistRepository.addToBlacklist( refreshTokenOld );
    //   }
    // }
  
    const result = await this._checkCredentials( loginOrEmail, password );
    const userId = result._id.toString();
    
    let deviceId = '';

    if ( refreshToken ) {
      const payload = await this.jwtService.verifyRefresToken( refreshToken );
      if (payload) {
        const session = await this.securityDevicesRepository.findByIdAndUserId({ 
          id: payload.deviceId, 
          userId: payload.userId 
        }); 

      if ( session ) deviceId = payload.deviceId;
      }
    }

    if ( deviceId === '' ) {
      const newSession = new SecurityDevice(
        userId, 
        deviceName, 
        ip,
      );
      deviceId = await this.securityDevicesRepository.createSession( newSession );
    }
  
    const tokens = await this._createPairsOfTokens({ userId, deviceId });
    await this._updateSession ( tokens.refreshToken, deviceId );

    return tokens; 
  }

  async passwordRecovery ( dto: PasswordRecoveryInputDto ): Promise<Result<User | null>> {
    const { email } = dto;
    
    const user = await this.usersRepository.findByEmail( email );

    if ( !user ) {
      return {
        status: ResultStatus.BadRequest,
        data: null,
        extensions: [],
      }     
    }
      
    const code = this.uuidService.generate();

    this.nodemailerService.sendEmail(
      email,
      code,
      this.emailExamples.passwordRecoveryEmail
    )
    .catch(er => console.error('error in send email:', er));

    const expirationDate = add(new Date(), { hours: 1 });
    const resultUpdate = await this.usersRepository.updateConfirmation( user._id, expirationDate, code );

    if ( resultUpdate < 1 )  {
      return {
        status: ResultStatus.BadRequest,
        data: null,
        extensions: [],
      };
    }
     
    return {
      status: ResultStatus.Success,
      data: user,
      extensions: [],
    };
  }

  async newPassword ( dto: NewPasswordInputDto ): Promise<Result<User | null>> {
    const { newPassword, recoveryCode } = dto;
    
    const user = await this.usersRepository.findUserByConfirmationCode( recoveryCode );
    if ( !user 
      || user.emailConfirmation.expirationDate < new Date()
    ){
      throw new ValidationError( `Code incorrect`, 'recoveryCode' );
    }

    const passwordHash = await this.bcryptService.generateHash( newPassword );
    await this.usersRepository.updatePassword( user._id, passwordHash );

    return {
      status: ResultStatus.Success,
      data: user,
      extensions: [],
    };
  }

  async refreshToken ( 
    userId: string, 
    deviceId: string
  ): Promise<{ accessToken: string, refreshToken: string }> {
    //await blacklistRepository.addToBlacklist( refreshTokenOld );
    const tokens = await this._createPairsOfTokens({ userId, deviceId });
    await this._updateSession ( tokens.refreshToken, deviceId );
    
    return tokens;
  }

  async registerUser ( dto: UserInputDto ): Promise<Result<User | null>>{
    const { login, email, password } = dto;
    
    await this.usersRepository.doesExistByLoginOrEmail( login, email );

    const passwordHash = await this.bcryptService.generateHash( password );
    const newUser = new User( login, email, passwordHash, {
        confirmationCode: this.uuidService.generate()
    });
    await this.usersRepository.create( newUser );

    this.nodemailerService.sendEmail(
      newUser.email,
      newUser.emailConfirmation.confirmationCode,
      this.emailExamples.registrationEmail
    )
    .catch(er => console.error('error in send email:', er));
    return {
      status: ResultStatus.Success,
      data: newUser,
      extensions: [],
    };
  }

  async registrationConfirmation ( dto: RegistrationConfirmationInputDto ): Promise<Result<User | null>> {
    const { code } = dto;

    const user = await this.usersRepository.findUserByConfirmationCode( code );
    if ( !user 
      || user.emailConfirmation.isConfirmed === ConfirmetionStatus.confirmed
      || user.emailConfirmation.confirmationCode !== code
      || user.emailConfirmation.expirationDate < new Date()
    ) {
      throw new ValidationError( `Code incorrect`, 'code' );
    }

    await this.usersRepository.updateConfirmationStatus( user._id );

    return {
      status: ResultStatus.Success,
      data: user,
      extensions: [],
    };
  }

  async registrationEmailResending ( dto: RegistrationEmailResendingInputDto): Promise<Result<User | null>> {
    const { email } = dto;
    const user = await this.usersRepository.findByLoginOrEmail( email );
    if ( !user ) {
      throw new ValidationError( 'user email doesnt exist', 'email');
    }
    if ( user.emailConfirmation.isConfirmed === ConfirmetionStatus.confirmed) {
      throw new ValidationError( 'email is already confirmed', 'email');
    }

    const newExpirationDate = add(new Date(), {
      hours: 1,
      minutes: 3
    });
    const newConfirmationCode = this.uuidService.generate();

    const resultUpdate = await this.usersRepository.updateConfirmation( user._id, newExpirationDate, newConfirmationCode);

    if ( resultUpdate < 1 )  {
      return {
        status: ResultStatus.BadRequest,
        data: null,
        extensions: [],
      };
    }

    this.nodemailerService.sendEmail(
      user.email,
      newConfirmationCode,
      this.emailExamples.registrationEmail
    )
    .catch(er => console.error('error in send email:', er));
    
    return {
      status: ResultStatus.Success,
      data: user,
      extensions: [],
    };
  }

  async logoutUser( userId: string, deviceId: string ): Promise<void> {
    //await blacklistRepository.addToBlacklist( refreshTokenOld );
    const deleteCount = await this.securityDevicesRepository.deleteById( userId, deviceId );
    if ( deleteCount < 1 ) {
      throw new EntityNotFoundError();
    }
    return;
  }

  async checkAccessToken (authHeader: string): Promise<Result<IdType | null>> {
    const [type, token] = authHeader.split(' ');

     if (type !== 'Bearer') {
        return {
        status: ResultStatus.Unauthorized,
        errorMessage: 'Unauthorized',
        data: null,
        extensions: [{ field: null, message: 'Not Bearer type' }],
      };
      }

    const result = await this.jwtService.verifyAcsessToken( token );

    if (!result) {
      return {
        status: ResultStatus.Unauthorized,
        errorMessage: 'Unauthorized',
        data: null,
        extensions: [{ field: null, message: 'Havent payload' }],
      };
    }

    return {
      status: ResultStatus.Success,
      data: { 
        id: result.userId
      },
      extensions: [],
    };
  }

  private async _checkCredentials ( 
    loginOrEmail: string,
    password: string
  ): Promise<WithId<User>> {

    const user = await this.usersRepository.findByLoginOrEmail( loginOrEmail );
    if (!user) { 
      throw new UnauthorizedError();
    }

    const isPasswordCorrect = await this.bcryptService.checkPassword(password, user.passwordHash);
    if ( !isPasswordCorrect ) { 
      throw new UnauthorizedError();
    }

    return user;
  }

  private async _createPairsOfTokens ( sessionData: SessionData): Promise<{ accessToken: string, refreshToken: string }> {
    const { userId } = sessionData;

    const accessToken =  await this.jwtService.createAcsessToken( userId );
    const refreshToken = await this.jwtService.createRefreshToken( sessionData );

    return { accessToken, refreshToken };
  }

  private async _updateSession ( refreshToken: string, deviceId: string ): Promise<void> {
    const payload = await this.jwtService.verifyRefresToken( refreshToken );
    if (payload && payload.iat && payload.exp) {
      await this.securityDevicesRepository.updateSession( deviceId, payload.iat, payload.exp );
      return;
    } 
      console.log('throw new Error');    
  }
}
