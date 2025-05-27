import { jwtService } from "../../src/auth/adapters/jwt.service";
import { appConfig } from "../../src/core/config/config"

export async function generateBearerAuthToken( userId: string ) {
  const token = await jwtService.createToken ( {
    secret: appConfig.JWT_SECRET, 
      time: appConfig.JWT_TIME,
    userId
  } );

  return `Bearer ${token}`
}
