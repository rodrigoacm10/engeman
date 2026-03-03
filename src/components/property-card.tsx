import { Property } from '@/types/property'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MapPin, BedDouble, Ruler, Building, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface PropertyCardProps {
  property: Property
  isFavorite?: boolean
  onToggleFavorite?: (propertyId: number) => void
  isTogglingFavorite?: boolean
}

export function PropertyCard({
  property,
  isFavorite = false,
  onToggleFavorite,
  isTogglingFavorite = false,
}: PropertyCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow border-gray-200 relative">
      <div className="h-48 bg-gray-200 relative">
        <div className="absolute inset-0 flex items-center justify-center text-gray-400">
          <Building size={48} opacity={0.2} />
        </div>

        <div className="absolute top-2 left-2 bg-[#ff4e00] text-white text-xs font-bold px-2 py-1 rounded shadow-sm">
          {property.type}
        </div>

        {!property.active && (
          <div className="absolute top-2 left-20 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded shadow-sm">
            Inativo
          </div>
        )}

        {onToggleFavorite && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 bg-white/80 hover:bg-white backdrop-blur-sm rounded-full w-8 h-8 shadow-sm"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              onToggleFavorite(property.id)
            }}
            disabled={isTogglingFavorite}
            title={
              isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'
            }
          >
            <Star
              className={`w-4 h-4 ${
                isFavorite ? 'fill-yellow-400 text-yellow-400' : 'text-gray-500'
              } ${isTogglingFavorite ? 'opacity-50' : ''}`}
            />
          </Button>
        )}
      </div>

      <CardHeader className="pb-2">
        <CardTitle className="line-clamp-1" title={property.name}>
          {property.name}
        </CardTitle>
        <div className="flex items-center text-gray-500 text-sm mt-1">
          <MapPin size={14} className="mr-1 shrink-0" />
          <span className="truncate">
            {property.city}, {property.state}
          </span>
        </div>
      </CardHeader>

      <CardContent className="pb-4">
        <p className="text-2xl font-bold text-[#ff4e00] mb-4">
          {new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          }).format(property.value)}
        </p>
        <div className="flex gap-4 text-sm text-gray-600 border-t pt-4">
          <div className="flex items-center" title="Quartos">
            <BedDouble size={16} className="mr-1 text-gray-400 shrink-0" />
            {property.bedrooms}
          </div>
          <div className="flex items-center" title="Área">
            <Ruler size={16} className="mr-1 text-gray-400 shrink-0" />
            {property.area} m²
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
