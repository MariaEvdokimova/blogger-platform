import request from 'supertest';
import { Express } from 'express';
import { USERS_PATH } from '../../../src/core/paths/paths';
import { generateBasicAuthToken } from '../generate-admin-auth-token';
import { HttpStatus } from '../../../src/core/types/http-statuses';
import { UserInputDto } from '../../../src/users/dto/user.input-dto';
import { UserViewModel } from '../../../src/users/types/user-view-model';

export const createUser = async (
  app: Express,
  userDto: UserInputDto
): Promise<UserViewModel> => {

  const createdUserResponse = await request(app)
    .post(USERS_PATH)
    .set('Authorization', generateBasicAuthToken())
    .send(userDto)
    .expect(HttpStatus.Created);

  return createdUserResponse.body;
};
