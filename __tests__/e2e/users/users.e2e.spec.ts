// @ts-ignore
import request from "supertest";
// @ts-ignore
import express from "express";

import { setupApp } from "../../../src/setup-app"
import { generateBasicAuthToken } from "../../utils/generate-admin-auth-token";
import { clearDb } from "../../utils/clear-db";
import { runDB } from "../../../src/db/mongo.db"
import { SETTINGS } from "../../../src/core/settings/settings";
import { UserInputDto } from "../../../src/users/dto/user.input-dto";
import { USERS_PATH } from "../../../src/core/paths/paths";
import { HttpStatus } from "../../../src/core/types/http-statuses";
import { createUser } from "../../utils/users/create-user";

describe('Users API', () => {
  const app = express();
  setupApp(app);
 
  const adminToken = generateBasicAuthToken();

  beforeAll(async () => {
    await runDB(SETTINGS.MONGO_URL);
    await clearDb(app);
  });

  it('✅ Should create user; POST /users', async () => {
    const newUser: UserInputDto = {
      login: "aaaaaa999",
      password: "string123",
      email: "example999@example.com"
    }

    await request(app)
      .post(USERS_PATH)
      .set('Authorization', generateBasicAuthToken())
      .send(newUser)
      .expect(HttpStatus.Created);
  });

  it('✅ Should return user list; GET /users', async () => {
    const newUser: UserInputDto = {
      login: "aaaaaa123",
      password: "string123",
      email: "example123@example.com"
    }

    await createUser(app, newUser);
  
    const response = await request(app)
      .get(USERS_PATH)
      .set('Authorization', generateBasicAuthToken())
      .expect(HttpStatus.Ok)
  
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body.items.length).toBeGreaterThanOrEqual(1);
      
    })

    it('✅ Should delete user by id; DELETE /users/:id', async () => {
      const newUser: UserInputDto = {
        login: "aaaaaa333",
        password: "string333",
        email: "example333@example.com"
      }
      const createdUser = await createUser(app, newUser);
  
      await request(app)
        .delete(`${USERS_PATH}/${createdUser.id}`)
        .set('Authorization', adminToken)
        .expect(HttpStatus.NoContent);
  
      await request(app)
        .get(USERS_PATH)
        .set('Authorization', adminToken)
        .expect(HttpStatus.Ok);
    })   
})
