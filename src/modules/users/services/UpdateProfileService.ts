import AppError from '@shared/errors/AppError'
import { compare, hash } from 'bcryptjs'
import { getCustomRepository } from 'typeorm'
import User from '../typeorm/entities/User'
import UsersRepository from '../typeorm/repositories/UsersRepository'

interface IRequest {
  user_id: string
  name: string
  email: string
  password?: string
  old_password?: string
}

export default class UpdateProfileService {
  public async execute({ user_id, name, email, password, old_password }: IRequest): Promise<User> {
    const usersRepository = getCustomRepository(UsersRepository)

    const user = await usersRepository.findById(user_id)

    if (!user) throw new AppError('User not found')

    const userUpdateEmail = await usersRepository.findByEmail(email)

    // user mógłby próbować ustawić sobie jako email email innego usera
    // a co gdybyśmy zastosowali CONSTRAINT unique w DB? może wtedy nie trzeba tego robić?
    if (userUpdateEmail && userUpdateEmail.id !== user_id) throw new AppError('Email already in use')

    if (password && !old_password) throw new AppError('You must provide old password in order to change password')

    if (password && old_password) {
      const isOldPasswordValid = await compare(old_password, user.password)

      if (!isOldPasswordValid) throw new AppError('Old password is incorrect')

      user.password = await hash(password, 8)
    }

    user.name = name
    user.email = email

    await usersRepository.save(user)

    return user
  }
}
