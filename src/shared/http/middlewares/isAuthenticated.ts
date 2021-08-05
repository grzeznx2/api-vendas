import { NextFunction, Request, Response } from 'express'
import { verify } from 'jsonwebtoken'
import authConfig from '@config/auth'
import AppError from '@shared/errors/AppError'

interface ITokenPayload {
  iat: number
  exp: number
  sub: string
}

export default function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  const { authorization } = req.headers

  if (!authorization) {
    throw new AppError('JWT Token is missing')
  }

  try {
    const authString = authorization.substring(7)
    /*
    decodedToken: {
      iat: 22342342
      exp: 23423424
      sub: '9j87d2qr-453-e4f5ef-234c53r' //stworzone z id
    }
    */
    const decodedToken = verify(authString, authConfig.jwt.secret)

    const { sub } = decodedToken as ITokenPayload

    req.user = {
      id: sub,
    }

    return next()
  } catch (error) {
    throw new AppError('Invalid JWT token')
  }
}
