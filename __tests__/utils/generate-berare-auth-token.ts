import { JwtService } from "../../src/auth/adapters/jwt.service";
import { container } from "../../src/composition-root";

const jwtService = container.get(JwtService);

export async function generateBearerAuthToken( userId: string ) {
  const token = await jwtService.createAcsessToken ( userId);

  return `Bearer ${token}`
}
