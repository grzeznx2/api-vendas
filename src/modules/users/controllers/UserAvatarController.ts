import { Request, Response } from 'express'
import UpdateUserAvatarService from '../services/UpdateUserAvatarService'

class UserAvatarController {
  public async update(request: Request, res: Response): Promise<Response> {
    const updateUserAvatar = new UpdateUserAvatarService()

    // czy można rozwiązać to inaczej, niż dodoawać 'as string'?
    const user = await updateUserAvatar.execute({ user_id: request.user.id, avatarFilename: request.file?.filename as string })

    return res.json(user)
  }
}

export default UserAvatarController
