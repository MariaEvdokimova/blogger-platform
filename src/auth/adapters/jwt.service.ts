import jwt from "jsonwebtoken";
import { appConfig } from "../../core/config/config";

export const jwtService = {
  async createToken ( userId: string ) : Promise<string> {
    return jwt.sign( { userId }, appConfig.JWT_SECRET, { expiresIn: `${appConfig.JWT_TIME}s` });
  },
  
  async verifyToken(token: string): Promise<{ userId: string } | null> {
    try {
      return jwt.verify(token, appConfig.JWT_SECRET) as { userId: string };
    } catch (error) {
      console.error("Token verify some error");
      return null;
    }
  },

}