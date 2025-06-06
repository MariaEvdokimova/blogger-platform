import { randomUUID } from 'crypto';
import { injectable } from 'inversify';

@injectable()
export class UuidService {
  generate() {
    return randomUUID();
  }
};
