// @ts-ignore
import request from "supertest";
// @ts-ignore
import express from "express";

import { setupApp } from "../../../src/setup-app"
import { dropDb, runDB, stopDb } from "../../../src/db/mongo.db"
import { routersPaths } from "../../../src/core/paths/paths";
import { HttpStatus } from "../../../src/core/types/http-statuses";
import { MongoMemoryServer } from "mongodb-memory-server";
import { UserInputDto } from "../../../src/users/dto/user.input-dto";
import { createUser } from "../../utils/users/create-user";
import { testSeeder } from "../../utils/auth/test.seeder";
import { container } from "../../../src/composition-root";
import { RateLimitRepository } from "../../../src/auth/repositories/rate-limit.repository";
import { JwtService } from "../../../src/auth/adapters/jwt.service";


describe('Security devices API', () => {
  const app = express();
  setupApp(app);

  beforeAll(async () => {
    const mongoServer = await MongoMemoryServer.create();
    await runDB(mongoServer.getUri());
    await dropDb();
  });

  afterAll(async () => {
    await dropDb();
    await stopDb();
  });

  afterAll(done => {
    done();
  });

  describe('🔐 Security Devices', () => {
    const newUser: UserInputDto = {
      login: "getDevices",
      password: "string123",
      email: "tesdevices@example.com"
    }

    let tokens1: any;
    let tokens2: any;
    let tokens3: any;
    let tokens4: any;

    beforeAll(async () => {
      const rateLimitRepository = container.get(RateLimitRepository);
      await createUser(app, newUser);
      
      tokens1 = await testSeeder.loginUser( app, newUser, 'LoginAgent/1.0' );
      tokens2 = await testSeeder.loginUser( app, newUser, 'LoginAgent/2.0' );
      tokens3 = await testSeeder.loginUser( app, newUser, 'LoginAgent/3.0' );
      tokens4 = await testSeeder.loginUser( app, newUser, 'LoginAgent/4.0' );

      jest.spyOn(rateLimitRepository, 'getAttemptsCountFromDate').mockResolvedValue( 0 );
    })

    it('✅ Should returns all devices with active sessions for current user; GET /security/devices', async () => {
      const response = await request(app)
        .get(routersPaths.securityDevives)
        .set('Cookie', [`refreshToken=${(tokens1).refreshToken}`])
        .send()
        .expect(HttpStatus.Success)

      expect(response.body).toHaveLength(4);
    })

    it('✅ Should delete device session by deviceId; DELETE /security/devices/{deviceId}', async () => {
    const jwtService = container.get(JwtService);
      const payloadToken2 = await jwtService.verifyRefresToken( tokens2.refreshToken );

      await request(app)
        .delete(`${routersPaths.securityDevives}/${payloadToken2!.deviceId}`)
        .set('Cookie', [`refreshToken=${(tokens2).refreshToken}`])
        .send()
        .expect(HttpStatus.NoContent)

      const response = await request(app)
        .get(routersPaths.securityDevives)
        .set('Cookie', [`refreshToken=${(tokens1).refreshToken}`])
        .send()
        .expect(HttpStatus.Success)

      expect(response.body).toHaveLength(3);

      // Проверяем, что удалённый deviceId больше не присутствует в списке устройств
      const deviceIds = response.body.map((device: any) => device.deviceId);
      expect(deviceIds).not.toContain(payloadToken2!.deviceId);

    })

    it('✅ Should delete device session by deviceId at logOut; DELETE /security/devices/{deviceId}', async () => {
    const jwtService = container.get(JwtService);
      const payloadToken3 = await jwtService.verifyRefresToken( tokens3.refreshToken );

      await request(app)
        .post(routersPaths.auth.logout)
        .set('Cookie', [`refreshToken=${(tokens3).refreshToken}`])
        .send()
        .expect(HttpStatus.NoContent)
      

      const response = await request(app)
        .get(routersPaths.securityDevives)
        .set('Cookie', [`refreshToken=${(tokens1).refreshToken}`])
        .send()
        .expect(HttpStatus.Success)

      expect(response.body).toHaveLength(2);

      // Проверяем, что удалённый deviceId больше не присутствует в списке устройств
      const deviceIds = response.body.map((device: any) => device.deviceId);
      expect(deviceIds).not.toContain(payloadToken3!.deviceId);

    })
    
    it('❌ Should NOT delete device session by wrong deviceId; DELETE /security/devices/{deviceId}', async () => {
    const jwtService = container.get(JwtService);
      const payloadToken3 = await jwtService.verifyRefresToken( tokens3.refreshToken );

      await request(app)
        .delete(`${routersPaths.securityDevives}/${payloadToken3!.deviceId}`)
        .set('Cookie', [`refreshToken=${(tokens1).refreshToken}`])
        .send()
        .expect(HttpStatus.NotFound)
    })

    it('❌ Should NOT delete device for Unauthorized user; DELETE /security/devices/{deviceId}', async () => {
    const jwtService = container.get(JwtService);
      const payloadToken3 = await jwtService.verifyRefresToken( tokens3.refreshToken );
      
      await request(app)
        .delete(`${routersPaths.securityDevives}/${payloadToken3!.deviceId}`)
        .set('Cookie', [`refreshToken=${(tokens2).refreshToken}`])
        .send()
        .expect(HttpStatus.Unauthorized)
    })
  })

})
