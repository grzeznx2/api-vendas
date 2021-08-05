import AppError from '@shared/errors/AppError'
import { compare, hash } from 'bcryptjs'
import { sign, Secret } from 'jsonwebtoken'
import { getCustomRepository } from 'typeorm'
import authConfig from '@config/auth'
import User from '../typeorm/entities/User'
import UsersRepository from '../typeorm/repositories/UsersRepository'

interface IRequest {
  email: string
  password: string
}

interface IResponse {
  user: User
  token: string
}

// Login
class CreateSessionsService {
  public async execute({ email, password }: IRequest): Promise<IResponse> {
    const usersRepository = getCustomRepository(UsersRepository)

    const user = await usersRepository.findByEmail(email)

    if (!user) {
      throw new AppError('Incorrect email or password', 401)
    }

    const passwordConfirmed = await compare(password, user.password)

    if (!passwordConfirmed) {
      throw new AppError('Incorrect email or password', 401)
    }

    // po zalogowaniu zwracamy userowi token, który będzie musiał następnie okazywać
    const token = sign({}, authConfig.jwt.secret as Secret, {
      subject: user.id,
      expiresIn: authConfig.jwt.expiresIn,
    })

    return {
      user,
      token,
    }
  }
}

export default CreateSessionsService
