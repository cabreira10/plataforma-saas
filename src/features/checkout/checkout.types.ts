export type CheckoutEventType =
  | 'checkout.clicked'
  | 'checkout.abandoned'
  | 'payment.approved'
  | 'payment.rejected'
  | 'payment.refunded'

export type PaymentMethod = 'pix' | 'credit_card' | 'boleto'

export type FilterTab = 'all' | CheckoutEventType

export interface CheckoutEvent {
  id: string
  event: CheckoutEventType
  customer: { name: string; email: string; phone?: string; cpf?: string }
  product: { name: string; id: string }
  value: number
  payment_method?: PaymentMethod
  installments?: number
  created_at: string
  checkout_id: string
  webhook_payload: object
}
