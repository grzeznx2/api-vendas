import AppError from '@shared/errors/AppError'
import { getCustomRepository } from 'typeorm'
import Customer from '../typeorm/entities/Entity'
import CustomersRepository from '../typeorm/repositories/CustomersRespository'

interface IRequest {
  name: string
  email: string
}

export default class CreateCustomerService {
  public async execute({ name, email }: IRequest): Promise<Customer> {
    const customersRepository = getCustomRepository(CustomersRepository)

    const emailInUse = await customersRepository.findByEmail(email)

    if (emailInUse) throw new AppError('Email already in use')

    const customer = customersRepository.create({ name, email })

    await customersRepository.save(customer)

    return customer
  }
}
