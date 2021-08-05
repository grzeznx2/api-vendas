import OrdersProducts from '@modules/orders/typeorm/entities/OrdersProducts'
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'

@Entity('products')
class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string

  // Product może występować w wielu OrdersProducts i figuruje tam pod polem 'product'
  @OneToMany(() => OrdersProducts, order_products => order_products.product)
  order_products: OrdersProducts[]

  @Column()
  name: string

  @Column('decimal')
  price: number

  @Column('int')
  quantity: number

  @CreateDateColumn()
  updated_at: Date

  @UpdateDateColumn()
  created_at: Date
}

export default Product
