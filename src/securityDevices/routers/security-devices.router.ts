import { Router } from "express";
import { routersPaths } from "../../core/paths/paths";
import { getDevicesHandler } from "./handlers/get-devices.handler";
import { deleteDevicesHandler } from "./handlers/delete-devices.handler";
import { deleteDeviceByIdHandler } from "./handlers/delete-device-by-id.handler";
import { refreshTokenGuard } from "../../auth/routers/guards/refresh.token.guard";

export const securityDevicesRouter = Router({});

securityDevicesRouter
  .get(
    '',
    refreshTokenGuard,
    getDevicesHandler
  )
  
  .delete(
    '',
    refreshTokenGuard,
    deleteDevicesHandler
  )

  .delete(
    '/:deviceId',
    refreshTokenGuard,
    deleteDeviceByIdHandler
  )
