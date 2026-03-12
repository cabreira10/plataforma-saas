export type TipoCampo = 'texto' | 'email' | 'numero' | 'telefone' | 'valor'
export type Moeda = 'BRL' | 'USD' | 'EUR'

export interface Stage {
  id: string
  nome: string
  ordem: number
}

export interface CrmField {
  id: string
  nome: string
  tipo: TipoCampo
  moeda?: Moeda
  ordem: number
  visivelKanban: boolean
}

export interface Lead {
  id: string
  nome: string
  etapaId: string
  valores: Record<string, string>
}

export type ConfirmActionType =
  | 'salvarEtapas'
  | 'removerEtapa'
  | 'salvarCampos'
  | 'removerCampo'
  | 'salvarLead'
  | 'removerLead'

export interface ConfirmAction {
  tipo: ConfirmActionType
  label?: string
  onConfirm: () => void
}
