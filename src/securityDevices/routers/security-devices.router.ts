import { Router } from "express";
import { refreshTokenGuard } from "../../auth/routers/guards/refresh.token.guard";
import { container } from "../../composition-root";
import { SecurityDevicesController } from "./security-devices.controller";

const securityDevicesController = container.get(SecurityDevicesController);
export const securityDevicesRouter = Router({});

securityDevicesRouter
  .get(
    '',
    refreshTokenGuard,
    securityDevicesController.getDevices.bind(securityDevicesController)
  )
  
  .delete(
    '',
    refreshTokenGuard,
    securityDevicesController.deleteDevices.bind(securityDevicesController)
  )

  .delete(
    '/:deviceId',
    refreshTokenGuard,
    securityDevicesController.deleteDeviceById.bind(securityDevicesController)
  )
