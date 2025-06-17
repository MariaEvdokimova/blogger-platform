import { MongoMemoryServer } from 'mongodb-memory-server';
import { testSeeder } from '../utils/auth/test.seeder';
import { ResultStatus } from '../../src/core/result/resultCode';
import { ValidationError } from '../../src/core/errors/validation.error';
import { NodemailerService } from '../../src/auth/adapters/nodemailer.service';
import { container } from '../../src/composition-root';
import { AuthService } from '../../src/auth/application/auth.service';
import { ConfirmetionStatus } from '../../src/users/domain/user.entity';
import mongoose from 'mongoose';

describe('AUTH-INTEGRATION', () => {

  let spy: jest.SpyInstance;

  beforeAll(async () => {
    const mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri()); 
  });

  beforeEach(async () => {
    await mongoose.connection.db?.dropDatabase()
  });

  beforeEach(() => {
    const nodemailerService = container.get(NodemailerService);
    spy = jest.spyOn(nodemailerService, 'sendEmail').mockResolvedValue();
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase(); // Cleanup
    await mongoose.disconnect(); // Proper mongoose disconnect
  });

  afterAll(done => done());

  describe('User Registration', () => {

    it('✅ should register user with correct data', async () => {
      const authService = container.get(AuthService);
      const { login, password, email } = testSeeder.createUserDto();

      const result = await authService.registerUser({login, password, email});

      expect(result.status).toBe(ResultStatus.Success);
      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('❌ should not register user twice', async () => {
      const authService = container.get(AuthService);
      const { login, password, email } = testSeeder.createUserDto();
      await testSeeder.insertUser({ login, password, email });

      await expect(
        authService.registerUser({ login, password, email })
      ).rejects.toBeInstanceOf(ValidationError);
    });
  });

  describe('Confirm email', () => {
    it('❌ should not confirm email if user does not exist', async () => {
      const authService = container.get(AuthService);
      await expect(
        authService.registrationConfirmation({ code: 'bnfgndflkgmk'})
      ).rejects.toBeInstanceOf(ValidationError);
    });

    it('❌ should not confirm email which is confirmed', async () => {
      const authService = container.get(AuthService);
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
      const authService = container.get(AuthService);
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
      const authService = container.get(AuthService);
      const code = '123e4567-e89b-12d3-a456-426614174000';

      const { login, password, email } = testSeeder.createUserDto();
      await testSeeder.insertUser({ login, password, email, code });

      const result = await authService.registrationConfirmation({code});

      expect(result.status).toBe(ResultStatus.Success);
    });
  });

  describe('Registration Email Resending', () => {
   // const nodemailerService = container.get(NodemailerService);
   // spy = jest.spyOn(nodemailerService, 'sendEmail').mockResolvedValue();

    it('❌ should not resend message if email is already confirmed', async () => {
      const authService = container.get(AuthService);
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
      const authService = container.get(AuthService);
      const { login, password, email } = testSeeder.createUserDto();
      await testSeeder.insertUser({ 
        login, 
        password, 
        email
      });

      const result = await authService.registrationEmailResending({ email });

      expect(result.status).toBe(ResultStatus.Success);
      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledTimes(2);
    });
  });

  describe('Password recovery via Email confirmation', () => {
      const authService = container.get(AuthService);
    //const nodemailerService = container.get(NodemailerService);
    //spy = jest.spyOn(nodemailerService, 'sendEmail').mockResolvedValue();

    it('❌ should not resend message if email not in DB', async () => {
      const result = await authService.passwordRecovery({ email: 'foo@gmail.com' });
      expect( result.status ).toBe( ResultStatus.BadRequest )
    });

    it('✅ should resend email with confirmation code', async () => {
      const { login, password, email } = testSeeder.createUserDto();
      await testSeeder.insertUser({ 
        login, 
        password, 
        email
      });

      const result = await authService.passwordRecovery({ email });

      expect(result.status).toBe(ResultStatus.Success);
      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledTimes(3);
    });
  });

  
  describe('Confirm Password recovery. Change password', () => {
    const authService = container.get(AuthService);
    //const nodemailerService = container.get(NodemailerService);
    //spy = jest.spyOn(nodemailerService, 'sendEmail').mockResolvedValue();

    it('❌ should not update password if recoveryCode is incorrect', async () => {
      await expect(
        authService.newPassword({ newPassword: '1234567', recoveryCode: '1234567' })
      ).rejects.toBeInstanceOf(ValidationError);
    });
    
    it('❌ should not update password if recoveryCode is expired', async () => {
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
        authService.newPassword({ newPassword: '1234567', recoveryCode: code })
      ).rejects.toBeInstanceOf(ValidationError);
    });

    it('✅ should update password with confirmation code', async () => {
      const code = '123e4567-e89b-12d3-a456-426614174000';

      const { login, password, email } = testSeeder.createUserDto();
      await testSeeder.insertUser({ login, password, email, code });

      const result = await authService.newPassword({ newPassword: '1234567', recoveryCode: code });

      expect(result.status).toBe(ResultStatus.Success);
      
    });
  });
});