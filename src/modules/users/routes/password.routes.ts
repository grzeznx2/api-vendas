import isAuthenticated from '@shared/http/middlewares/isAuthenticated'
import { celebrate, Segments } from 'celebrate'
import { Router } from 'express'
import Joi from 'joi'
import ForgotPasswordController from '../controllers/ForgotPasswordController'
import ResetPasswordController from '../controllers/ResetPasswordController'

const forgotPasswordController = new ForgotPasswordController()
const resetPasswordController = new ResetPasswordController()

const passwordRotuer = Router()

// localhost/password/forgot
passwordRotuer.post('/forgot', celebrate({ [Segments.BODY]: { email: Joi.string().email().required() } }), forgotPasswordController.create)

passwordRotuer.post(
  '/reset',
  celebrate({
    [Segments.BODY]: {
      token: Joi.string().uuid().required(),
      password: Joi.string().required(),
      password_confirmation: Joi.string().required().valid(Joi.ref('password')),
    },
  }),
  resetPasswordController.create
)

export default passwordRotuer
