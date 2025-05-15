import jwt from "jsonwebtoken";

type CreateTokenParams = {
  secret: string;
  time: number;
  userId: string;
};

type verifyTokenParams = {
  token: string;
  secret: string;
};

export const jwtService = {
  async createToken ({ 
      secret, 
      time, 
      userId 
    }: CreateTokenParams 
  ) : Promise<string> {
    return jwt.sign( { userId }, secret, { expiresIn: `${time}s` });
  },
  
  async verifyToken({ 
      token, 
      secret 
    }: verifyTokenParams
  ): Promise<{ userId: string } | null> {
    try {
      return jwt.verify(token, secret) as { userId: string };
    } catch (error) {
      console.error("Token verify some error");
      return null;
    }
  },

}