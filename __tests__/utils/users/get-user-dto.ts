import { UserInputDto } from "../../../src/users/dto/user.input-dto";


export const getUserDto = ( {login, email, password}: {
  login?: string, 
  email?: string, 
  password?: string
}): UserInputDto => {
  return {
    login: login ?? 'testUser',
    email: email ?? 'test-user@gmail.com',
    password: password ?? '123456789',
  }
};
