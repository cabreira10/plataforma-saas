import type { CrmField, Moeda } from '../types/crm.types'

export function formatPhone(digits: string): string {
  const d = digits.slice(0, 11)
  if (d.length <= 10) {
    return d.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3').replace(/-$/, '')
  }
  return d.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3').replace(/-$/, '')
}

const moedaSymbol: Record<Moeda, string> = {
  BRL: 'R$',
  USD: 'US$',
  EUR: '€',
}

export function formatDisplayValue(campo: CrmField, value: string): string {
  if (!value) return '-'
  if (campo.tipo === 'valor') {
    const centavos = parseInt(value, 10) || 0
    const num = centavos / 100
    const sym = moedaSymbol[campo.moeda ?? 'BRL']
    return `${sym} ${num.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }
  if (campo.tipo === 'telefone') {
    return formatPhone(value)
  }
  return value
}

export function isValidEmail(v: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
}

export function getInputProps(campo: CrmField): {
  type: string
  inputMode: React.HTMLAttributes<HTMLInputElement>['inputMode']
  placeholder: string
} {
  switch (campo.tipo) {
    case 'email':
      return { type: 'email', inputMode: 'email', placeholder: 'exemplo@email.com' }
    case 'numero':
      return { type: 'text', inputMode: 'numeric', placeholder: '0' }
    case 'telefone':
      return { type: 'text', inputMode: 'tel', placeholder: '(11) 99999-9999' }
    case 'valor':
      return { type: 'text', inputMode: 'numeric', placeholder: '0,00' }
    default:
      return { type: 'text', inputMode: 'text', placeholder: '' }
  }
}

export function processInputValue(campo: CrmField, raw: string): string {
  switch (campo.tipo) {
    case 'numero':
      return raw.replace(/\D/g, '')
    case 'telefone':
      return raw.replace(/\D/g, '').slice(0, 11)
    case 'valor':
      return raw.replace(/\D/g, '')
    default:
      return raw
  }
}

export function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}
