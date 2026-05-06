import { create } from 'zustand'
import { Order, createOrder } from '@domain/entities/Order'
import { generateId } from '@shared/utils/generateId'

interface OrderState {
  orders: Order[]
  activeOrderId: string | null
  activeOrder: Order | null
  setOrders: (orders: Order[]) => void
  setActiveOrderId: (id: string) => void
  upsertOrder: (order: Order) => void
  removeOrder: (id: string) => void
  newOrder: (cashierId: string, shiftId: string) => Order
}

export const useOrderStore = create<OrderState>((set, get) => ({
  orders: [],
  activeOrderId: null,
  activeOrder: null,

  setOrders: (orders) => {
    const activeOrderId = orders.length > 0 ? orders[0].id : null
    set({
      orders,
      activeOrderId,
      activeOrder: orders.find((o) => o.id === activeOrderId) ?? null,
    })
  },

  setActiveOrderId: (id) => {
    const order = get().orders.find((o) => o.id === id) ?? null
    set({ activeOrderId: id, activeOrder: order })
  },

  upsertOrder: (order) => {
    const orders = get().orders
    const exists = orders.findIndex((o) => o.id === order.id)
    const updated = exists >= 0
      ? orders.map((o) => (o.id === order.id ? order : o))
      : [...orders, order]
    const activeOrderId = get().activeOrderId ?? order.id
    set({
      orders: updated,
      activeOrderId,
      activeOrder: updated.find((o) => o.id === activeOrderId) ?? null,
    })
  },

  removeOrder: (id) => {
    const orders = get().orders.filter((o) => o.id !== id)
    const activeOrderId = orders.length > 0 ? orders[0].id : null
    set({
      orders,
      activeOrderId,
      activeOrder: orders.find((o) => o.id === activeOrderId) ?? null,
    })
  },

  newOrder: (cashierId, shiftId) => {
    const order = createOrder({ id: generateId(), cashierId, shiftId })
    const orders = [...get().orders, order]
    set({ orders, activeOrderId: order.id, activeOrder: order })
    return order
  },
}))
