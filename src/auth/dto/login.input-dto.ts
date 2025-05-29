export type LoginInput = {
  loginOrEmail:	string;
  password:	string;
}

export type LoginInputDto = LoginInput & {
  refreshToken: string;
  deviceName: string;
  ip: string;
}
