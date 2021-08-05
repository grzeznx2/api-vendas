import AppError from '@shared/errors/AppError'
import { getCustomRepository } from 'typeorm'
import Order from '../typeorm/entities/Order'
import OrdersRepository from '../typeorm/repositories/OrdersRepository'

interface IRequest {
  id: string
}

export class ShowOrderService {
  // funkcja zwraca Promise<Product>, ale czy nie powinniśmy uwzględnić błędu, jaki może się wydarzyć?
  public async execute({ id }: IRequest): Promise<Order> {
    const ordersRespository = getCustomRepository(OrdersRepository)

    const order = await ordersRespository.findById(id)

    if (!order) throw new AppError('Order not found')

    return order
  }
}

export default ShowOrderService
