import { Request, Response } from 'express'
import { classToClass } from 'class-transformer'
import ShowUserProfileService from '../services/ShowUserProfileService'
import UpdateProfileService from '../services/UpdateProfileService'

export default class ProfileController {
  public async show(req: Request, res: Response): Promise<Response> {
    const user_id = req.user.id

    const showUserProfile = new ShowUserProfileService()

    const user = await showUserProfile.execute({ user_id })

    return res.json(classToClass(user))
  }

  public async update(req: Request, res: Response): Promise<Response> {
    const user_id = req.user.id
    const { name, email, password, old_password } = req.body
    const updateProfile = new UpdateProfileService()

    const user = await updateProfile.execute({ user_id, name, email, password, old_password })

    return res.json(classToClass(user))
  }
}
