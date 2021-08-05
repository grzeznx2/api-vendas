import Customer from '@modules/customers/typeorm/entities/Entity'
import { EntityRepository, Repository } from 'typeorm'
import Order from '../entities/Order'

interface IProduct {
  product_id: string
  quantity: number
  price: number
}

interface IRequest {
  customer: Customer
  products: IProduct[]
}

@EntityRepository(Order)
export default class OrdersRepository extends Repository<Order> {
  public async findById(id: string): Promise<Order | undefined> {
    const order = this.findOne(id, {
      // robimy JOIN => zasiedlamy poniższe pola podczas wyszukiwania
      relations: ['order_products', 'customer'],
    })

    return order
  }

  //   normalnie jest metoda create, ale my chcemy własną
  public async createOrder({ customer, products }: IRequest): Promise<Order> {
    const order = this.create({
      customer,
      order_products: products,
    })

    await this.save(order)

    return order
  }
}
