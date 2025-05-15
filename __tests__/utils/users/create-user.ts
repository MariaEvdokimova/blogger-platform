import request from 'supertest';
import { Express } from 'express';
import { routersPaths } from '../../../src/core/paths/paths';
import { generateBasicAuthToken } from '../generate-admin-auth-token';
import { HttpStatus } from '../../../src/core/types/http-statuses';
import { UserInputDto } from '../../../src/users/dto/user.input-dto';
import { UserViewModel } from '../../../src/users/types/user-view-model';
import { getUserDto } from './get-user-dto';

export const createUser = async (
  app: Express,
  userDto?: UserInputDto
): Promise<UserViewModel> => {

  const testUserData = userDto ?? getUserDto({});
  
  const createdUserResponse = await request(app)
    .post(routersPaths.users)
    .set('Authorization', generateBasicAuthToken())
    .send(testUserData)
    .expect(HttpStatus.Created);

  return createdUserResponse.body;
};
