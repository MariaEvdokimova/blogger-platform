// @ts-ignore
import request from "supertest";
// @ts-ignore
import express from "express";

import { setupApp } from "../../../src/setup-app"
import { generateBasicAuthToken } from "../../utils/generate-admin-auth-token";
import { dropDb, runDB, stopDb } from "../../../src/db/mongo.db"
import { UserInputDto } from "../../../src/users/dto/user.input-dto";
import { routersPaths } from "../../../src/core/paths/paths";
import { HttpStatus } from "../../../src/core/types/http-statuses";
import { createUser } from "../../utils/users/create-user";
import { MongoMemoryServer } from "mongodb-memory-server";

describe('Users API', () => {
  const app = express();
  setupApp(app);
 
  const adminToken = generateBasicAuthToken();

   beforeAll(async () => {
      const mongoServer = await MongoMemoryServer.create();
      await runDB(mongoServer.getUri());
    });
  
    beforeEach(async () => {
      await dropDb();
    });
  
    afterAll(async () => {
      await stopDb();
    });
  
    afterAll(done => {
      done();
    });

  it('shouldn`t create user without authorization; POST /users', async () => {
    await request(app)
      .post(routersPaths.users)
      .send({
        login: '',
      })
      .expect(HttpStatus.Unauthorized);
  });
  it('✅ Should create user; POST /users', async () => {
    const newUser: UserInputDto = {
      login: "aaaaaa999",
      password: "string123",
      email: "example999@example.com"
    }

    await request(app)
      .post(routersPaths.users)
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
      .get(routersPaths.users)
      .set('Authorization', generateBasicAuthToken())
      .expect(HttpStatus.Success)
  
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
        .delete(`${routersPaths.users}/${createdUser.id}`)
        .set('Authorization', adminToken)
        .expect(HttpStatus.NoContent);
  
      await request(app)
        .get(routersPaths.users)
        .set('Authorization', adminToken)
        .expect(HttpStatus.Success);
    })   
})
