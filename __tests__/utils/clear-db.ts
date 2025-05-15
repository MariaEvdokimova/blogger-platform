// @ts-ignore
import request from 'supertest';
import { Express } from 'express';
import { routersPaths } from '../../src/core/paths/paths';
import { HttpStatus } from '../../src/core/types/http-statuses';

export async function clearDb(app: Express) {
  await request(app)
    .delete(routersPaths.testing)
    .expect(HttpStatus.NoContent);
  return;
}
