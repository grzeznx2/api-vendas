import { getCustomRepository } from 'typeorm'
import Customer from '../typeorm/entities/Entity'
import CustomersRepository from '../typeorm/repositories/CustomersRespository'

interface IPaginateCustomer {
  from: number
  to: number
  per_page: number
  total: number
  current_page: number
  prev_page: number | null
  next_page: number | null
  data: Customer[]
}

export default class ListCustomerService {
  public async execute(): Promise<IPaginateCustomer> {
    const customersRepository = getCustomRepository(CustomersRepository)

    const customers = await customersRepository.createQueryBuilder().paginate()

    return customers as IPaginateCustomer
  }
}
// export default class ListCustomerService {
//   public async execute(): Promise<Customer[]> {
//     const customersRepository = getCustomRepository(CustomersRepository)

//     const customers = await customersRepository.find()

//     return customers
//   }
// }
