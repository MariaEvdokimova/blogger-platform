export class SecurityDevice {
    userId: string;
    deviceName: string;
    ip: string;
    iat: number;
    exp: number;

  constructor(
    userId: string,
    deviceName: string,
    ip: string,
    iat: number = 0,
    exp: number = 0,
  ) {    
    this.userId = userId;
    this.deviceName = deviceName;
    this.ip = ip;
    this.iat = iat;
    this.exp = exp;
  }
}
