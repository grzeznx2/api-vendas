import Customer from '@modules/customers/typeorm/entities/Entity'
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import OrdersProducts from './OrdersProducts'

@Entity('orders')
export default class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string

  // 1:1
  // tylko 1 strona wskazuje na drugą stronę

  // M:M
  // konieczna tabela pośrednicząca, w której każdy wpis wksazuje na 2 strony
  // np. pytanie - kategoria
  // w takim przypadku musimy mieć tabelę pośredniczącą, w której każdy wpis wskazuje na pytanie i kategorię
  // pytanie nie mogłoby wskazywać na wiele kategorii (bo nie można przechowywyać tablic)
  // kategoria nie mogłaby wskazywać na wiele kategorii (bo nie można przechowywyać tablic)

  //  M:1
  //   wiele stron może wskazywać na drugą stronę, druga strona nie wskazuje nic
  //   jeden klient może mieć wiele zamówień
  //  jedno zamówienie należeć tylko do jednego klienta
  //   zamówienia "wskazują" na klienta, co jest logiczne, bo klient nie mógłby wskazywać na wiele zamówień
  @ManyToOne(() => Customer)
  //   JOIN customers ON orders.customer_id = customers.id
  @JoinColumn({ name: 'customer_id' })
  customer: Customer

  @OneToMany(() => OrdersProducts, order_products => order_products.order, { cascade: true })
  order_products: OrdersProducts[]

  @CreateDateColumn()
  created_at: Date

  @UpdateDateColumn()
  updated_at: Date
}
