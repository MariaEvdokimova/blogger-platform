import jwt, { JwtPayload } from "jsonwebtoken";
import { appConfig } from "../../core/config/config";
import { injectable } from "inversify";

type CreateRefreshTokenParams = {
  userId: string;
  deviceId: string;
};

interface AccessTokenPayload extends JwtPayload {
  userId: string;
}

interface refreshTokenPayload extends JwtPayload {
  userId: string;
  deviceId: string;
}

interface VerifiedRefreshTokenPayload { 
  userId: string;
  deviceId: string;
  iat?: number;
  exp?: number;
}

@injectable()
export class JwtService {
  async createAcsessToken ( userId: string ) : Promise<string> {
    return jwt.sign( { userId }, appConfig.JWT_SECRET, { expiresIn: `${appConfig.JWT_TIME}s` });
  }

  async createRefreshToken ({ userId, deviceId }: CreateRefreshTokenParams ) : Promise<string> {
    return jwt.sign( 
      { userId, deviceId }, 
      appConfig.R_JWT_SECRET, 
      { expiresIn: `${appConfig.R_JWT_TIME}s` }
    );
  }

  async verifyAcsessToken( token: string ): Promise<{ userId: string } | null> {
    try {
      return jwt.verify(token, appConfig.JWT_SECRET) as AccessTokenPayload;
    } catch (error) {
      console.error("Acsess Token verify some error");
      return null;
    }
  }
  
  async verifyRefresToken( token: string ): Promise< VerifiedRefreshTokenPayload | null> {
    try {
      const payload = jwt.verify(token, appConfig.R_JWT_SECRET) as refreshTokenPayload;
      return {
        userId: payload.userId,
        deviceId: payload.deviceId,
        iat: payload.iat,
        exp: payload.exp,
      }
    } catch (error) {
      console.log("Refres Token verify some error ", error);
      return null;
    }
  }
}
