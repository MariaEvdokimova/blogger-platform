import bcrypt from 'bcryptjs';
import { appConfig } from '../../core/config/config';

export const bcryptService = {
    async generateHash(password: string) {
        return bcrypt.hash( password, appConfig.COST_FACTOR);
    },

    async checkPassword(password: string, hash: string) {
      return bcrypt.compare(password, hash);
    },
}
