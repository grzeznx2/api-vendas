import { EntityRepository, Repository } from 'typeorm'
import UserToken from '../entities/UserTokens'

@EntityRepository(UserToken)
class UserTokensRepository extends Repository<UserToken> {
  public async findByToken(token: string): Promise<UserToken | undefined> {
    const userToken = await this.findOne({ where: { token } })

    return userToken
  }
  //   tutaj chyba wystarczyłoby Promise<UserToken>, ponieważ jeżeli już zwrócimy, to zawsze UserToken
  public async generate(user_id: string): Promise<UserToken> {
    const userToken = this.create({ user_id })

    await this.save(userToken)

    return userToken
  }
}

export default UserTokensRepository
