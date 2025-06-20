// @ts-ignore
import request from "supertest";
// @ts-ignore
import express from "express";

import { setupApp } from "../../../src/setup-app"
import { UserInputDto } from "../../../src/users/dto/user.input-dto";
import { routersPaths } from "../../../src/core/paths/paths";
import { HttpStatus } from "../../../src/core/types/http-statuses";
import { createUser } from "../../utils/users/create-user";
import { MongoMemoryServer } from "mongodb-memory-server";
import { testSeeder } from "../../utils/auth/test.seeder";
import { delay } from "../../utils/delay";
import { appConfig } from "../../../src/core/config/config";
import mongoose from "mongoose";

describe('Auth API', () => {
  const app = express();
  setupApp(app);

  beforeAll(async () => {
    const mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri()); 
  });

  beforeEach(async () => {
    await mongoose.connection.db?.dropDatabase()
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase(); // Cleanup
    await mongoose.disconnect(); // Proper mongoose disconnect
  });

  it('✅ Should login; POST /auth/login', async () => {
    const newUser: UserInputDto = {
      login: "testauth",
      password: "string123",
      email: "testauth@example.com"
    }

    await createUser(app, newUser);
  
    const response = await request(app)
      .post(routersPaths.auth.login)
      .send({
        loginOrEmail: newUser.email,
        password: newUser.password
      })
      .expect(HttpStatus.Success)

    expect(response.body).toHaveProperty('accessToken');
      
    const setCookieHeader = response.headers['set-cookie'];
    expect(setCookieHeader).toBeDefined();
    })

    it('✅ Generate new pair of access and refresh tokens; POST /auth/refresh-token', async () => {
      const newUser: UserInputDto = {
        login: "refreshT",
        password: "123456789",
        email: "refreshT@example.com"
      }
      await createUser(app, newUser);
      const tokens = await testSeeder.loginUser( app, newUser );

      await delay( appConfig.JWT_TIME + 1000 ); //delay for generate diffrent tokens

      const response = await request(app)
      .post(routersPaths.auth.refreshToken)
      .set('Cookie', [`refreshToken=${(tokens).refreshToken}`])
      .send()
      .expect(HttpStatus.Success)
      
      expect(response.body).toHaveProperty('accessToken');
      expect(response.body.accessToken).not.toBe(tokens.accessToken);
      
      const setCookieHeader = response.headers['set-cookie'];
      expect(setCookieHeader).toBeDefined();
      
      //check that old refreshToken in blacklist repository
      //const isTokenBlacklisted = await blacklistRepository.isTokenBlacklisted( tokens.refreshToken);
      //expect(isTokenBlacklisted).toBe(true);
    })
  
     it('✅ Mark refreshToken as invalid; POST /auth/logout', async () => {
      const newUser: UserInputDto = {
        login: "logout",
        password: "123456789",
        email: "logout@example.com"
      }
      await createUser(app, newUser);
      const tokens = await testSeeder.loginUser( app, newUser );

      const response = await request(app)
      .post(routersPaths.auth.logout)
      .set('Cookie', [`refreshToken=${(tokens).refreshToken}`])
      .send()
      .expect(HttpStatus.NoContent)

      const setCookieHeader = response.headers['set-cookie'];
      expect(setCookieHeader).toBeDefined();
      const cookieArray = Array.isArray(setCookieHeader) ? setCookieHeader : [setCookieHeader];
      const clearedCookie = cookieArray.find((cookie: string) =>
        cookie.startsWith('refreshToken=') &&
        (cookie.includes('Max-Age=0') || /expires=Thu, 01 Jan 1970/i.test(cookie))
      );

      expect(clearedCookie).toBeDefined();

      //check that old refreshToken in blacklist repository
      //const isTokenBlacklisted = await blacklistRepository.isTokenBlacklisted( tokens.refreshToken);
      //expect(isTokenBlacklisted).toBe(true);
     })

     it('✅ Get information about current user; GET /auth/me', async () => {
       const newUser: UserInputDto = {
        login: "meUser",
        password: "123456789",
        email: "me@example.com"
      }
      await createUser(app, newUser);
      const tokens = await testSeeder.loginUser( app, newUser );

      const response = await request(app)
      .get(routersPaths.auth.me)
      .set('Authorization', `Bearer ${tokens.accessToken}`)
      .send()
      .expect(HttpStatus.Success)

      expect(response.body).toBeInstanceOf(Object);
      expect(response.body.email).toBe(newUser.email);
    })    
})
