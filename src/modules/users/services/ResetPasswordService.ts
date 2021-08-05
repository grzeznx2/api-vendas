import AppError from '@shared/errors/AppError'
import { getCustomRepository } from 'typeorm'
import { isAfter, addHours } from 'date-fns'
import { hash } from 'bcryptjs'
import UsersRepository from '../typeorm/repositories/UsersRepository'
import UserTokensRepository from '../typeorm/repositories/UserTokensRepository'

interface IRequest {
  token: string
  password: string
}

export default class ResetPasswordService {
  public async execute({ token, password }: IRequest): Promise<void> {
    const usersRepository = getCustomRepository(UsersRepository)
    const userTokensRepository = getCustomRepository(UserTokensRepository)

    const userToken = await userTokensRepository.findByToken(token)

    if (!userToken) throw new AppError('User Token does not exist')

    const user = await usersRepository.findById(userToken.user_id)

    if (!user) throw new AppError('User does not exist')

    // wyrzucamy błąd, jeżeli token został utworzony więcej niż 2h temu
    const tokenCreatedAt = userToken.created_at
    const twoHoursAfterTokenCreation = addHours(tokenCreatedAt, 2)

    // jeżeli jest później, niż 2 h po utworzeniu tokenu
    if (isAfter(Date.now(), twoHoursAfterTokenCreation)) throw new AppError('Token expired')

    user.password = await hash(password, 8)

    // nie zapisujemy usera?
    await usersRepository.save(user)
  }
}
