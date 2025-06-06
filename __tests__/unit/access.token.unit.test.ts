
import { JwtService } from '../../src/auth/adapters/jwt.service';
import { AuthService } from '../../src/auth/domain/auth.service';
import { container } from '../../src/composition-root';
import { ResultStatus } from '../../src/core/result/resultCode';

describe('UNIT', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('❌ should not verify noBearer auth', async () => {
      const authService = container.get(AuthService);
    const result = await authService.checkAccessToken('Basic gbfbfbbhf');

    expect(result.status).toBe(ResultStatus.Unauthorized);
  });

  it('❌ should not verify in jwtService', async () => {
    const authService = container.get(AuthService);
    const jwtService = container.get(JwtService);
    jest.spyOn(jwtService, 'verifyAcsessToken').mockResolvedValue(null) as jest.SpyInstance;

    const result = await authService.checkAccessToken('Bearer gbfbfbbhf');

    expect(result.status).toBe(ResultStatus.Unauthorized);
  });

  it('✅ should verify access token', async () => {
    const authService = container.get(AuthService);
    const jwtService = container.get(JwtService);
    jest.spyOn(jwtService, 'verifyAcsessToken').mockResolvedValue({ userId: '1' }) as jest.SpyInstance;

    const result = await authService.checkAccessToken('Bearer gbfbfbbhf');

    expect(result.status).toBe(ResultStatus.Success);
  });
});
