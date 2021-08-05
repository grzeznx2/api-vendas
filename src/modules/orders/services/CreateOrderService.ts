import CustomersRepository from '@modules/customers/typeorm/repositories/CustomersRespository'
import { ProductRepository } from '@modules/products/typeorm/repositories/ProductsRepository'
import AppError from '@shared/errors/AppError'
import { getCustomRepository } from 'typeorm'
import Order from '../typeorm/entities/Order'
import OrdersRepository from '../typeorm/repositories/OrdersRepository'

interface IProduct {
  id: string
  quantity: number
}

interface IRequest {
  customer_id: string
  products: IProduct[]
}

export class CreateOrderService {
  // funkcja zwraca Promise<Product>, ale czy nie powinniśmy uwzględnić błędu, jaki może się wydarzyć?
  public async execute({ customer_id, products }: IRequest): Promise<Order> {
    const ordersRespository = getCustomRepository(OrdersRepository)
    const customersRepository = getCustomRepository(CustomersRepository)
    const productsRepository = getCustomRepository(ProductRepository)

    // sprawdzamy, czy jest taki użytkownik
    const customerExists = await customersRepository.findById(customer_id)

    if (!customerExists) throw new AppError('Could not find any customer with provided id')

    // sprawdzamy, czy są produkty o podanych id
    const existsProducts = await productsRepository.findAllByIds(products)

    if (existsProducts.length === 0) throw new AppError('Could not find any products with provided ids')

    // sprawdzamy, czy któreś znaleziono produkt na podstawie każdego podanego id
    const existsProductsIds = existsProducts.map(product => product.id)

    const checkInexistentProducts = products.filter(product => !existsProductsIds.includes(product.id))

    if (checkInexistentProducts.length > 0) throw new AppError(`Could not find product ${checkInexistentProducts[0].id}`)

    // sprawdzamy, czy dla wszystkich produktów mamy wystarczającą ilość
    const quantityAvailable = products.filter(product => existsProducts.filter(p => p.id === product.id)[0].quantity < product.quantity)

    if (quantityAvailable.length > 0) throw new AppError(`The quantity ${quantityAvailable[0].quantity} is not available for ${quantityAvailable[0].id}`)

    // przygotowujemy produkty do zamówienia
    // On2!
    const serializedProducts = products.map(product => ({
      product_id: product.id,
      quantity: product.quantity,
      price: existsProducts.filter(p => p.id === product.id)[0].price,
    }))

    // wysyłamy zamówienie
    const order = await ordersRespository.createOrder({ customer: customerExists, products: serializedProducts })

    // aktualizujemy ilość produktów (prawdopodobnie powinno być w transakcji z powyższym!)
    const { order_products } = order
    const updatedProductQuantity = order_products.map(product => ({
      id: product.product_id,
      quantity: existsProducts.filter(p => p.id === product.product_id)[0].quantity - product.quantity,
    }))

    await productsRepository.save(updatedProductQuantity)

    return order
  }
}

export default CreateOrderService
