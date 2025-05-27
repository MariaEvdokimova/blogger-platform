import { randomUUID } from 'crypto';

export const uuidService = {
  generate() {
    return randomUUID();
  }
};
