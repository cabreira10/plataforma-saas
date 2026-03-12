export interface ProspectLead {
  id: string
  nome: string
  categoria: string
  cidade: string
  endereco: string
  telefone: string | null
  whatsapp: string | null
  website: string | null
  rating: number | null
  reviews: number | null
  temSite: boolean
}

export interface ScrapingSession {
  id: string
  nicho: string
  cidade: string
  totalLeads: number
  leadsComSite: number
  criadoEm: string
  leads: ProspectLead[]
}
