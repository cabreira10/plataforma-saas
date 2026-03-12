import { Search, Loader2, MapPin } from 'lucide-react'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'

interface SearchFormProps {
  nicho: string
  cidade: string
  isSearching: boolean
  onNichoChange: (v: string) => void
  onCidadeChange: (v: string) => void
  onSearch: () => void
}

export function SearchForm({
  nicho,
  cidade,
  isSearching,
  onNichoChange,
  onCidadeChange,
  onSearch,
}: SearchFormProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') onSearch()
  }

  return (
    <div className="glass-card rounded-xl p-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_240px_auto]">
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Nicho / Palavra-chave</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Ex: Agências de marketing, Dentistas, Academias..."
              value={nicho}
              onChange={(e) => onNichoChange(e.target.value)}
              onKeyDown={handleKeyDown}
              className="pl-9"
              disabled={isSearching}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Localização</Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Ex: São Paulo, SP"
              value={cidade}
              onChange={(e) => onCidadeChange(e.target.value)}
              onKeyDown={handleKeyDown}
              className="pl-9"
              disabled={isSearching}
            />
          </div>
        </div>

        <div className="flex items-end">
          <Button
            onClick={onSearch}
            disabled={!nicho.trim() || isSearching}
            className="gap-2 w-full sm:w-auto"
          >
            {isSearching ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Buscando...
              </>
            ) : (
              <>
                <Search className="h-4 w-4" />
                Buscar leads
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
