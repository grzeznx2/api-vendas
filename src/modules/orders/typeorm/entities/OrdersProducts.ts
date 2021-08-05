import Product from '@modules/products/typeorm/entities/Product'
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import Order from './Order'

@Entity('orders_products')
export default class OrdersProducts {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column('decimal')
  price: number

  @Column('int')
  quantity: number

  // ?
  // jeden wpis może wskazywać tylko na jedno zamówienie i jeden produkt
  // jedno zamówienie może figurować tylko w jednym wpisie
  // jeden produkt może figurować w wielu wpisach

  @ManyToOne(() => Order, order => order.order_products)
  //   JOIN orders ON orders.id = orders_products.order_id
  @JoinColumn({ name: 'order_id' })
  order: Order

  @ManyToOne(() => Product, product => product.order_products)
  @JoinColumn({ name: 'product_id' })
  product: Product

  @Column()
  order_id: string

  @Column()
  product_id: string

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date
}
