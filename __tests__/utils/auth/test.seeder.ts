import request from 'supertest';
import { Express } from 'express';
import { add } from "date-fns/add";
import { getCollections } from "../../../src/db/mongo.db";
import { ConfirmetionStatus } from "../../../src/users/entities/user.entity";
import { UserInputDto } from "../../../src/users/dto/user.input-dto";
import { routersPaths } from '../../../src/core/paths/paths';
import { HttpStatus } from '../../../src/core/types/http-statuses';
import { container } from '../../../src/composition-root';
import { UuidService } from '../../../src/users/adapters/uuid.service';

const uuidService = container.get(UuidService);

type RegisterUserPayloadType = {
  login: string,
  password: string,
  email: string,
  code?: string,
  expirationDate?: Date,
  confirmetionStatus?: ConfirmetionStatus
}

export type RegisterUserResultType = {
  id: string,
  login: string,
  email: string,
  passwordHash: string,
  createdAt: Date,
  emailConfirmation: {
    confirmationCode: string,
    expirationDate: Date,
    isConfirmed: ConfirmetionStatus
  }
}

export const testSeeder = {
  createUserDto() {
    return {
      login: 'testUser',
      email: 'test-user@gmail.com',
      password: '123456789'
    }
  },

  async insertUser(
    {
      login,
      password,
      email,
      code,
      expirationDate,
      confirmetionStatus
    }: RegisterUserPayloadType
  ): Promise<RegisterUserResultType> {
        
  jest.spyOn(uuidService, 'generate').mockImplementation(() => '00000000-0000-0000-0000-000000000000');

    const newUser = {
      login,
      email,
      passwordHash: password,
      createdAt: new Date(),
      emailConfirmation: {
        confirmationCode: code ?? uuidService.generate(),
        expirationDate: expirationDate ?? add(new Date(), {
          minutes: 30,
        }),
        isConfirmed: confirmetionStatus ?? ConfirmetionStatus.unconfirmed
      }
    };

    const res = await getCollections().userCollection.insertOne(newUser)
      return {
        id: res.insertedId.toString(),
        ...newUser
      }
    },

    async loginUser( 
      app: Express, 
      user: UserInputDto,
      userAgent = 'DefaultUserAgent/1.0'
    ){
            
    const response = await request(app)
      .post(routersPaths.auth.login)
      .set('User-Agent', userAgent)
      .send({
      loginOrEmail: user.email,
      password: user.password
      })
      .expect(HttpStatus.Success)

    expect(response.body).toHaveProperty('accessToken');
            
    const setCookieHeader = response.headers['set-cookie'];
    const cookieArray = Array.isArray(setCookieHeader) ? setCookieHeader : [setCookieHeader];
    const refreshTokenCookie = cookieArray.find(cookie => cookie.startsWith('refreshToken='));
    const refreshToken = refreshTokenCookie.split(';')[0].split('=')[1];
    
    return { accessToken: response.body.accessToken, refreshToken}
  }
}
