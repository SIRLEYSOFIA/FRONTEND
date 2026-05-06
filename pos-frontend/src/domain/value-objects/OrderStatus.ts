export type OrderStatus = 'draft' | 'confirmed' | 'processing_payment' | 'paid' | 'cancelled'

export type PaymentMethod = 'cash' | 'card' | 'qr' | 'mixed'

export type PaymentStatus = 'idle' | 'pending' | 'processing' | 'approved' | 'failed'

export type UserRole = 'cashier' | 'supervisor' | 'admin'
