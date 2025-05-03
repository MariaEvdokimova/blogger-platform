// @ts-ignore
import request from "supertest";
// @ts-ignore
import express from "express";

import { setupApp } from "../../../src/setup-app"
import { clearDb } from "../../utils/clear-db";
import { runDB } from "../../../src/db/mongo.db"
import { UserInputDto } from "../../../src/users/dto/user.input-dto";
import { AUTH_PATH } from "../../../src/core/paths/paths";
import { HttpStatus } from "../../../src/core/types/http-statuses";
import { createUser } from "../../utils/users/create-user";
import { appConfig } from "../../../src/core/config/config";

describe('Auth API', () => {
  const app = express();
  setupApp(app);
 
  beforeAll(async () => {
    await runDB(appConfig.MONGO_URL);
    await clearDb(app);
  });

  it('✅ Should login; POST /auth/login', async () => {
    const newUser: UserInputDto = {
      login: "testauth",
      password: "string123",
      email: "testauth@example.com"
    }

    await createUser(app, newUser);
  
    await request(app)
      .post(`${AUTH_PATH}/login`)
      .send({
        loginOrEmail: "testauth",
        password: "string123"
      })
      .expect(HttpStatus.Success)
       
    })
  
})
