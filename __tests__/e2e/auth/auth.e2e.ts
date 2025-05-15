// @ts-ignore
import request from "supertest";
// @ts-ignore
import express from "express";

import { setupApp } from "../../../src/setup-app"
import { dropDb, runDB, stopDb } from "../../../src/db/mongo.db"
import { UserInputDto } from "../../../src/users/dto/user.input-dto";
import { routersPaths } from "../../../src/core/paths/paths";
import { HttpStatus } from "../../../src/core/types/http-statuses";
import { createUser } from "../../utils/users/create-user";
import { MongoMemoryServer } from "mongodb-memory-server";

describe('Auth API', () => {
  const app = express();
  setupApp(app);

  beforeAll(async () => {
    const mongoServer = await MongoMemoryServer.create();
    await runDB(mongoServer.getUri());
  });

  beforeEach(async () => {
    await dropDb();
  });

  afterAll(async () => {
    await dropDb();
    await stopDb();
  });

  afterAll(done => {
    done();
  });

  it('✅ Should login; POST /auth/login', async () => {
    const newUser: UserInputDto = {
      login: "testauth",
      password: "string123",
      email: "testauth@example.com"
    }

    await createUser(app, newUser);
  
    await request(app)
      .post(routersPaths.auth.login)
      .send({
        loginOrEmail: "testauth",
        password: "string123"
      })
      .expect(HttpStatus.Success)
       
    })
  
})
