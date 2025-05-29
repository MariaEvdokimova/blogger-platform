import { UnauthorizedError } from "../../core/errors/unauthorized.error";
import { usersRepository } from "../../users/repositories/users.repository";
import { LoginInputDto } from "../dto/login.input-dto";
import { bcryptService } from '../adapters/bcrypt.service';
import { jwtService } from "../adapters/jwt.service";
import { WithId } from "mongodb";
import { ConfirmetionStatus, User } from "../../users/entities/user.entity";
import { UserInputDto } from "../../users/dto/user.input-dto";
import { nodemailerService } from "../adapters/nodemailer.service";
import { emailExamples } from "../adapters/emailExamples";
import { RegistrationConfirmationInputDto } from "../dto/registration-confirmation.input-dto";
import { ValidationError } from "../../core/errors/validation.error";
import { RegistrationEmailResendingInputDto } from "../dto/registration-email-resending.input-dto";
import { add } from "date-fns/add";
import { Result } from "../../core/result/result.type";
import { ResultStatus } from "../../core/result/resultCode";
import { IdType } from "../../core/types/id";
import { uuidService } from "../../users/adapters/uuid.service";
import { EntityNotFoundError } from "../../core/errors/entity-not-found.error";
import { securityDevicesRepository } from "../../securityDevices/repositories/securityDevices.repository";
import { SecurityDevice } from "../../securityDevices/entities/securityDevices.entity";

type SessionData = {
  userId: string;
  deviceId: string;
}

export const authService = {
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
      const payload = await jwtService.verifyRefresToken( refreshToken );
      if (payload) {
        const session = await securityDevicesRepository.findByIdAndUserId({ 
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
      deviceId = await securityDevicesRepository.createSession( newSession );
    }
  
    const tokens = await this._createPairsOfTokens({ userId, deviceId });
    await this._updateSession ( tokens.refreshToken, deviceId );

    return tokens; 
  },

  async refreshToken ( 
    userId: string, 
    deviceId: string
  ): Promise<{ accessToken: string, refreshToken: string }> {
    //await blacklistRepository.addToBlacklist( refreshTokenOld );
    const tokens = await this._createPairsOfTokens({ userId, deviceId });
    await this._updateSession ( tokens.refreshToken, deviceId );
    
    return tokens;
  },

  async registerUser ( dto: UserInputDto ): Promise<Result<User | null>>{
    const { login, email, password } = dto;
    
    await usersRepository.doesExistByLoginOrEmail( login, email );

    const passwordHash = await bcryptService.generateHash( password );
    const newUser = new User( login, email, passwordHash);
    await usersRepository.create( newUser );

    nodemailerService.sendEmail(
      newUser.email,
      newUser.emailConfirmation.confirmationCode,
      emailExamples.registrationEmail
    )
    .catch(er => console.error('error in send email:', er));
    return {
      status: ResultStatus.Success,
      data: newUser,
      extensions: [],
    };
  },

  async registrationConfirmation ( dto: RegistrationConfirmationInputDto ): Promise<Result<User | null>> {
    const { code } = dto;

    const user = await usersRepository.findUserByConfirmationCode( code );
    if ( !user 
      || user.emailConfirmation.isConfirmed === ConfirmetionStatus.confirmed
      || user.emailConfirmation.confirmationCode !== code
      || user.emailConfirmation.expirationDate < new Date()
    ) {
      throw new ValidationError( `Code incorrect`, 'code' );
    }

    await usersRepository.updateConfirmationStatus( user._id );

    return {
      status: ResultStatus.Success,
      data: user,
      extensions: [],
    };
  },

  async registrationEmailResending ( dto: RegistrationEmailResendingInputDto): Promise<Result<User | null>> {
    const { email } = dto;
    const user = await usersRepository.findByLoginOrEmail( email );
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
    const newConfirmationCode = uuidService.generate();

    const resultUpdate = await usersRepository.updateConfirmation( user._id, newExpirationDate, newConfirmationCode);

    if ( resultUpdate < 1 )  {
      return {
        status: ResultStatus.BadRequest,
        data: null,
        extensions: [],
      };
    }

    nodemailerService.sendEmail(
      user.email,
      newConfirmationCode,
      emailExamples.registrationEmail
    )
    .catch(er => console.error('error in send email:', er));
    
    return {
      status: ResultStatus.Success,
      data: user,
      extensions: [],
    };
  },

  async logoutUser( userId: string, deviceId: string ): Promise<void> {
    //await blacklistRepository.addToBlacklist( refreshTokenOld );
    const deleteCount = await securityDevicesRepository.deleteById( userId, deviceId );
    if ( deleteCount < 1 ) {
      throw new EntityNotFoundError();
    }
    return;
  },

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

    const result = await jwtService.verifyAcsessToken( token );

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
  },

  async _checkCredentials ( 
    loginOrEmail: string,
    password: string
  ): Promise<WithId<User>> {

    const user = await usersRepository.findByLoginOrEmail( loginOrEmail );
    if (!user) { 
      throw new UnauthorizedError();
    }

    const isPasswordCorrect = await bcryptService.checkPassword(password, user.passwordHash);
    if ( !isPasswordCorrect ) { 
      throw new UnauthorizedError();
    }

    return user;
  },

  async _createPairsOfTokens ( sessionData: SessionData): Promise<{ accessToken: string, refreshToken: string }> {
    const { userId } = sessionData;

    const accessToken =  await jwtService.createAcsessToken( userId );
    const refreshToken = await jwtService.createRefreshToken( sessionData );

    return { accessToken, refreshToken };
  },

  async _updateSession ( refreshToken: string, deviceId: string ): Promise<void> {
    const payload = await jwtService.verifyRefresToken( refreshToken );
    if (payload && payload.iat && payload.exp) {
      await securityDevicesRepository.updateSession( deviceId, payload.iat, payload.exp );
      return;
    } 
      console.log('throw new Error');    
  },
}
