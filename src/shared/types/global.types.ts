export type Nullable<T> = T | null

export type Optional<T> = T | undefined

export type AsyncFn<T = void> = () => Promise<T>

export type ID = string

export interface PaginatedResponse<T> {
  data: T[]
  count: number
  page: number
  pageSize: number
  totalPages: number
}

export interface ApiError {
  message: string
  code?: string
  status?: number
}

export type Status = 'idle' | 'loading' | 'success' | 'error'

export interface SelectOption<T = string> {
  value: T
  label: string
  disabled?: boolean
}

export type Currency = 'BRL' | 'USD' | 'EUR'

export const CURRENCIES: SelectOption<Currency>[] = [
  { value: 'BRL', label: 'BRL — Real Brasileiro' },
  { value: 'USD', label: 'USD — Dólar Americano' },
  { value: 'EUR', label: 'EUR — Euro' },
]

export type Language = 'pt-BR' | 'en'

export const LANGUAGES: SelectOption<Language>[] = [
  { value: 'pt-BR', label: 'Português (BR)' },
  { value: 'en', label: 'English' },
]
