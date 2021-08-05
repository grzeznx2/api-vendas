import AppError from '@shared/errors/AppError'
import { getCustomRepository } from 'typeorm'
import Customer from '../typeorm/entities/Entity'
import CustomersRepository from '../typeorm/repositories/CustomersRespository'

interface IRequest {
  name: string
  email: string
  id: string
}

export default class UpdateCustomerService {
  public async execute({ name, email, id }: IRequest): Promise<Customer> {
    const customersRepository = getCustomRepository(CustomersRepository)

    const customer = await customersRepository.findById(id)

    if (!customer) throw new AppError('Customer does not exist')

    const emailInUse = await customersRepository.findByEmail(email)

    if (emailInUse && customer.email !== emailInUse.email) throw new AppError('Email already in use')

    customer.name = name
    customer.email = email

    await customersRepository.save(customer)

    return customer
  }
}
