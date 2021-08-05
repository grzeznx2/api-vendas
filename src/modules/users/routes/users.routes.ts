import { celebrate, Segments } from 'celebrate'
import { Router } from 'express'
import multer from 'multer'
import uploadConfig from '@config/upload'
import Joi from 'joi'
import UsersController from '../controllers/UsersController'
import isAuthenticated from '../../../shared/http/middlewares/isAuthenticated'
import UserAvatarController from '../controllers/UserAvatarController'

const usersRouter = Router()
const usersController = new UsersController()
const userAvatarController = new UserAvatarController()
const upload = multer(uploadConfig.multer)

usersRouter.get('/', isAuthenticated, usersController.index)
usersRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    },
  }),
  usersController.create
)

usersRouter.patch('/avatar', isAuthenticated, upload.single('avatar'), userAvatarController.update)

export default usersRouter
