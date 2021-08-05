import AppError from '@shared/errors/AppError'
import { getCustomRepository } from 'typeorm'
import Product from '../typeorm/entities/Product'
import { ProductRepository } from '../typeorm/repositories/ProductsRepository'

interface IRequest {
  id: string
}

export class ShowProductService {
  // funkcja zawsze zwraca Promise rozwiązacującą się produktem, ponieważ jeżeli nie znajdziemy produktu, to funkcja nie zwraca! (bo wyrzucamy Error)
  public async execute({ id }: IRequest): Promise<Product> {
    const productsRespository = getCustomRepository(ProductRepository)
    // nigdzie nie oczekujemy na produkt, czyż więc produkt nie będzie zawsze true, bo będzie po prostu obietnicą?
    // a jednak oczekujemy - hurra!
    const product = await productsRespository.findOne(id)

    if (!product) throw new AppError('Product not found')

    return product
  }
}

export default ShowProductService
