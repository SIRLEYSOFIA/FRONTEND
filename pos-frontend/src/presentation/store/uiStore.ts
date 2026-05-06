import { create } from 'zustand'
import { Payment } from '@domain/entities/Payment'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface Toast {
  id: string
  message: string
  type: ToastType
}

interface UIState {
  isPaymentModalOpen: boolean
  isDiscountModalOpen: boolean
  discountTargetItemId: string | null // null = order-level discount
  completedPayment: Payment | null
  toasts: Toast[]
  openPaymentModal: () => void
  closePaymentModal: () => void
  openDiscountModal: (itemId?: string) => void
  closeDiscountModal: () => void
  setCompletedPayment: (payment: Payment | null) => void
  addToast: (message: string, type?: ToastType) => void
  removeToast: (id: string) => void
}

export const useUIStore = create<UIState>((set, get) => ({
  isPaymentModalOpen: false,
  isDiscountModalOpen: false,
  discountTargetItemId: null,
  completedPayment: null,
  toasts: [],

  openPaymentModal: () => set({ isPaymentModalOpen: true }),
  closePaymentModal: () => set({ isPaymentModalOpen: false }),

  openDiscountModal: (itemId) =>
    set({ isDiscountModalOpen: true, discountTargetItemId: itemId ?? null }),
  closeDiscountModal: () =>
    set({ isDiscountModalOpen: false, discountTargetItemId: null }),

  setCompletedPayment: (payment) => set({ completedPayment: payment }),

  addToast: (message, type = 'info') => {
    const id = `toast-${Date.now()}`
    set({ toasts: [...get().toasts, { id, message, type }] })
    setTimeout(() => get().removeToast(id), 4000)
  },

  removeToast: (id) =>
    set({ toasts: get().toasts.filter((t) => t.id !== id) }),
}))
