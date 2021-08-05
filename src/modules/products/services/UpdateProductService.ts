import redisCache from '@shared/cache/RedisCache'
import AppError from '@shared/errors/AppError'
import { getCustomRepository } from 'typeorm'
import Product from '../typeorm/entities/Product'
import { ProductRepository } from '../typeorm/repositories/ProductsRepository'

interface IRequest {
  id: string
  name: string
  price: number
  quantity: number
}

export class UpdateProductService {
  public async execute({ id, name, price, quantity }: IRequest): Promise<Product> {
    const productsRespository = getCustomRepository(ProductRepository)
    // nigdzie nie oczekujemy na produkt, czyż więc produkt nie będzie zawsze true, bo będzie po prostu obietnicą?
    const product = await productsRespository.findOne(id)

    if (!product) throw new AppError('Product not found')

    // musimy sprawdzić, czy nazwa jakiej chcemy użyć, nie figuruje już w DB
    const nameInUse = await productsRespository.findByName(name)

    if (nameInUse) throw new AppError('There is already product with this name')

    // const redisCache = new RedisCache()

    await redisCache.invalidate('api-vendas-PRODUCT_LIST')

    product.name = name
    product.price = price
    product.quantity = quantity

    await productsRespository.save(product)

    return product
  }
}

export default UpdateProductService
