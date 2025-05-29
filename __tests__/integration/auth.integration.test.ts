import { MongoMemoryServer } from 'mongodb-memory-server';
import { dropDb, runDB, stopDb } from '../../src/db/mongo.db';
import { nodemailerService } from '../../src/auth/adapters/nodemailer.service';
import { authService } from '../../src/auth/domain/auth.service'
import { testSeeder } from '../utils/auth/test.seeder';
import { ResultStatus } from '../../src/core/result/resultCode';
import { ValidationError } from '../../src/core/errors/validation.error';
import { ConfirmetionStatus } from '../../src/users/entities/user.entity';

describe('AUTH-INTEGRATION', () => {
  beforeAll(async () => {
    const mongoServer = await MongoMemoryServer.create();
    await runDB(mongoServer.getUri());
  });

  beforeEach(async () => {
    await dropDb();
  });

  beforeEach(() => {
    spy.mockClear();
  });

  afterAll(async () => {
    await dropDb();
    await stopDb();
  });

  afterAll(done => done());

  let spy: jest.SpyInstance;

  describe('User Registration', () => {
    spy = jest.spyOn(nodemailerService, 'sendEmail').mockResolvedValue();

    it('✅ should register user with correct data', async () => {
      const { login, password, email } = testSeeder.createUserDto();

      const result = await authService.registerUser({login, password, email});

      expect(result.status).toBe(ResultStatus.Success);
      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('❌ should not register user twice', async () => {
      const { login, password, email } = testSeeder.createUserDto();
      await testSeeder.insertUser({ login, password, email });

      await expect(
        authService.registerUser({ login, password, email })
      ).rejects.toBeInstanceOf(ValidationError);
    });
  });

  describe('Confirm email', () => {
    it('❌ should not confirm email if user does not exist', async () => {
      await expect(
        authService.registrationConfirmation({ code: 'bnfgndflkgmk'})
      ).rejects.toBeInstanceOf(ValidationError);
    });

    it('❌ should not confirm email which is confirmed', async () => {
      const code = 'test';

      const { login, password, email } = testSeeder.createUserDto();
      await testSeeder.insertUser({
        login,
        password,
        email,
        code,
        confirmetionStatus: ConfirmetionStatus.confirmed,
      });

      await expect(
        authService.registrationConfirmation({code})
      ).rejects.toBeInstanceOf(ValidationError);
    });
    
    it('❌ should not confirm email with expired code', async () => {
      const code = 'test';

      const { login, password, email } = testSeeder.createUserDto();
      await testSeeder.insertUser({
        login,
        password,
        email,
        code,
        expirationDate: new Date(),
      });

      await expect(
        authService.registrationConfirmation({code})
      ).rejects.toBeInstanceOf(ValidationError);
    });

    it('✅ confirm user', async () => {
      const code = '123e4567-e89b-12d3-a456-426614174000';

      const { login, password, email } = testSeeder.createUserDto();
      await testSeeder.insertUser({ login, password, email, code });

      const result = await authService.registrationConfirmation({code});

      expect(result.status).toBe(ResultStatus.Success);
    });
  });

  describe('Registration Email Resending', () => {
    spy = jest.spyOn(nodemailerService, 'sendEmail').mockResolvedValue();

    it('❌ should not resend message if email is already confirmed', async () => {
      const { login, password, email } = testSeeder.createUserDto();
      await testSeeder.insertUser({ 
        login, 
        password, 
        email,
        confirmetionStatus: ConfirmetionStatus.confirmed 
      });

      await expect(
        authService.registrationEmailResending({ email })
      ).rejects.toBeInstanceOf(ValidationError);
    });

    it('✅ should resend email with confirmation code', async () => {
      const { login, password, email } = testSeeder.createUserDto();
      await testSeeder.insertUser({ 
        login, 
        password, 
        email
      });

      const result = await authService.registrationEmailResending({ email });

      expect(result.status).toBe(ResultStatus.Success);
      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });

});