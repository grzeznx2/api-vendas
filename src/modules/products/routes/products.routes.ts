import { celebrate, Segments } from 'celebrate'
import { Router } from 'express'
import Joi from 'joi'
import ProductsController from '../controllers/ProductsController'

const productsController = new ProductsController()

const productsRouter = Router()

productsRouter.get('/', productsController.index)

productsRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      price: Joi.number().precision(2).required(),
      quantity: Joi.number().required(),
    },
  }),
  productsController.create
)

productsRouter.get('/:id', celebrate({ [Segments.PARAMS]: { id: Joi.string().uuid().required() } }), productsController.show)

productsRouter.put(
  '/:id',
  celebrate({
    [Segments.PARAMS]: { id: Joi.string().uuid().required() },
    [Segments.BODY]: {
      name: Joi.string().required(),
      price: Joi.number().precision(2).required(),
      quantity: Joi.number().required(),
    },
  }),
  productsController.update
)

productsRouter.delete('/:id', celebrate({ [Segments.PARAMS]: { id: Joi.string().uuid().required() } }), productsController.delete)

export default productsRouter
