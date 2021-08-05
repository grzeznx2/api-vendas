import redisCache from '@shared/cache/RedisCache'
import AppError from '@shared/errors/AppError'
import { getCustomRepository } from 'typeorm'
import Product from '../typeorm/entities/Product'
import { ProductRepository } from '../typeorm/repositories/ProductsRepository'

interface IRequest {
  name: string
  price: number
  quantity: number
}

export class CreateProductService {
  // funkcja zwraca Promise<Product>, ale czy nie powinniśmy uwzględnić błędu, jaki może się wydarzyć?
  public async execute({ name, price, quantity }: IRequest): Promise<Product> {
    const productsRespository = getCustomRepository(ProductRepository)
    const productExist = await productsRespository.findByName(name)

    // const redisCache = new RedisCache()

    if (productExist) throw new AppError('There is already a product with this name')

    const product = productsRespository.create({ name, price, quantity })

    await redisCache.invalidate('api-vendas-PRODUCT_LIST')

    await productsRespository.save(product)

    return product
  }
}

export default CreateProductService
