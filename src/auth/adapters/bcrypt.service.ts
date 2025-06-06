import bcrypt from 'bcryptjs';
import { appConfig } from '../../core/config/config';
import { injectable } from 'inversify';

@injectable()
export class BcryptService {
    async generateHash(password: string) {
        return bcrypt.hash( password, appConfig.COST_FACTOR);
    }

    async checkPassword(password: string, hash: string) {
      return bcrypt.compare(password, hash);
    }
}
