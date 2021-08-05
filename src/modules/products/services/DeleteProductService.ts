import redisCache from '@shared/cache/RedisCache'
import AppError from '@shared/errors/AppError'
import { getCustomRepository } from 'typeorm'
import { ProductRepository } from '../typeorm/repositories/ProductsRepository'

interface IRequest {
  id: string
}

export class DeleteProductService {
  // funkcja zawsze zwraca Promise rozwiązacującą się produktem, ponieważ jeżeli nie znajdziemy produktu, to funkcja nie zwraca! (bo wyrzucamy Error)
  public async execute({ id }: IRequest): Promise<void> {
    const productsRespository = getCustomRepository(ProductRepository)
    // nigdzie nie oczekujemy na produkt, czyż więc produkt nie będzie zawsze true, bo będzie po prostu obietnicą?
    // a jednak oczekujemy - hurra!
    const product = await productsRespository.findOne(id)

    if (!product) throw new AppError('Product not found')

    // const redisCache = new RedisCache()

    await redisCache.invalidate('api-vendas-PRODUCT_LIST')

    await productsRespository.remove(product)
  }
}

export default DeleteProductService
