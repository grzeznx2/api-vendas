import isAuthenticated from '@shared/http/middlewares/isAuthenticated'
import { celebrate, Segments } from 'celebrate'
import { Router } from 'express'
import Joi from 'joi'
import OrdersController from '../controllers/OrdersController'

const ordersController = new OrdersController()

const ordersRouter = Router()

ordersRouter.use(isAuthenticated)

ordersRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      customer_id: Joi.string().uuid().required(),
      products: Joi.required(),
    },
  }),
  ordersController.create
)

ordersRouter.get('/:id', celebrate({ [Segments.PARAMS]: { id: Joi.string().uuid().required() } }), ordersController.show)

export default ordersRouter
