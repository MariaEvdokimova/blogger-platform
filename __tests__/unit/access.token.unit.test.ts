
import { authService } from '../../src/auth/domain/auth.service';
import { jwtService } from '../../src/auth/adapters/jwt.service';
import { ResultStatus } from '../../src/core/result/resultCode';

describe('UNIT', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  const checkAccessTokenUseCase = authService.checkAccessToken;

  it('❌ should not verify noBearer auth', async () => {
    const result = await checkAccessTokenUseCase('Basic gbfbfbbhf');

    expect(result.status).toBe(ResultStatus.Unauthorized);
  });

  it('❌ should not verify in jwtService', async () => {
    jest.spyOn(jwtService, 'verifyToken').mockResolvedValue(null);

    const result = await checkAccessTokenUseCase('Bearer gbfbfbbhf');

    expect(result.status).toBe(ResultStatus.Unauthorized);
  });

  it('✅ should verify access token', async () => {
    jest.spyOn(jwtService, 'verifyToken').mockResolvedValue({ userId: '1' });

    const result = await checkAccessTokenUseCase('Bearer gbfbfbbhf');

    expect(result.status).toBe(ResultStatus.Success);
  });
});
