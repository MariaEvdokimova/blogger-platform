import { Response } from "express";
import { cookieConfig } from '../../core/types/cookie'
import { routersPaths } from '../../core/paths/paths'

export const cookieService = {
  createRefreshTokenCookie ( res: Response, token: string ){
    res.cookie(cookieConfig.refreshToken.name, token, {
      httpOnly: cookieConfig.refreshToken.httpOnly, 
      secure: cookieConfig.refreshToken.secure,
      path: routersPaths.common,
      maxAge: cookieConfig.refreshToken.maxAge
    })
  },
  
  clearRefreshTokenCookie( res: Response ){
    res.clearCookie(cookieConfig.refreshToken.name, {
      httpOnly: cookieConfig.refreshToken.httpOnly,
      secure: cookieConfig.refreshToken.secure,
      path: routersPaths.common,
    });
  }
}
