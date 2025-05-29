import { jwtService } from "../../src/auth/adapters/jwt.service";

export async function generateBearerAuthToken( userId: string ) {
  const token = await jwtService.createAcsessToken ( userId);

  return `Bearer ${token}`
}
