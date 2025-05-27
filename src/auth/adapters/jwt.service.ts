import jwt from "jsonwebtoken";
import { appConfig } from "../../core/config/config";

type CreateTokenParams = {
  userId: string;
};

type verifyTokenParams = {
  token: string;
};

export const jwtService = {
  async createAcsessToken ({ userId }: CreateTokenParams ) : Promise<string> {
    return jwt.sign( { userId }, appConfig.JWT_SECRET, { expiresIn: `${appConfig.JWT_TIME}s` });
  },

  async createRefreshToken ({ userId }: CreateTokenParams ) : Promise<string> {
    return jwt.sign( { userId }, appConfig.R_JWT_SECRET, { expiresIn: `${appConfig.R_JWT_TIME}s` });
  },

  async verifyAcsessToken({ token }: verifyTokenParams ): Promise<{ userId: string } | null> {
    try {
      return jwt.verify(token, appConfig.JWT_SECRET) as { userId: string };
    } catch (error) {
      console.error("Token verify some error");
      return null;
    }
  },
  
  async verifyRefresToken({ token }: verifyTokenParams ): Promise<{ userId: string } | null> {
    try {
      return jwt.verify(token, appConfig.R_JWT_SECRET) as { userId: string };
    } catch (error) {
      console.error("Token verify some error");
      return null;
    }
  },

}