import { Order } from '@domain/entities/Order'

export interface IOrderRepository {
  save(order: Order): Promise<void>
  getActive(): Promise<Order[]>
  getById(id: string): Promise<Order | null>
  complete(id: string): Promise<void>
  delete(id: string): Promise<void>
}
