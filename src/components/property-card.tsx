import { Property } from '@/types/property'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  MapPin,
  BedDouble,
  Ruler,
  Building,
  Star,
  User,
  MoreVertical,
  Edit2,
  Power,
  Trash2,
  Loader2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface PropertyCardProps {
  property: Property
  isFavorite?: boolean
  onToggleFavorite?: (propertyId: number) => void
  isTogglingFavorite?: boolean
  onEdit?: (property: Property) => void
  onToggleStatus?: (property: Property) => void
  onDelete?: (property: Property) => void
  isTogglingStatus?: boolean
}

export function PropertyCard({
  property,
  isFavorite = false,
  onToggleFavorite,
  isTogglingFavorite = false,
  onEdit,
  onToggleStatus,
  onDelete,
  isTogglingStatus = false,
}: PropertyCardProps) {
  const { user } = useAuth()
  const canManage =
    user?.role === 'ADMIN' ||
    (user?.role === 'CORRETOR' &&
      String(property.brokerName).trim().toLowerCase() ===
        String(user?.name).trim().toLowerCase())
  const showActionsMenu = canManage && !!(onEdit || onToggleStatus || onDelete)
  console.log('onEdit', onEdit)
  console.log('onToggleStatus', onToggleStatus)
  console.log('onDelete', onDelete)
  // const showActionsMenu = canManage && !!(onEdit || onToggleStatus || onDelete)

  console.log('property', property)
  console.log('user', user)
  console.log('canManage', canManage)
  console.log('showActionsMenu', showActionsMenu)

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow border-gray-200 relative group">
      <div className="h-48 bg-gray-200 relative overflow-hidden">
        {property.imageUrls ? (
          <img
            src={property.imageUrls}
            alt={property.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400">
            <Building size={48} opacity={0.2} />
          </div>
        )}

        <div className="absolute top-2 left-2 bg-[#ff4e00] text-white text-xs font-bold px-2 py-1 rounded shadow-sm z-10">
          {property.type}
        </div>

        {!property.active && (
          <div className="absolute top-2 left-20 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded shadow-sm z-10">
            Inativo
          </div>
        )}

        {onToggleFavorite && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 bg-white/80 hover:bg-white backdrop-blur-sm rounded-full w-8 h-8 shadow-sm z-10"
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

        {/* Actions Menu */}
        {showActionsMenu && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-12 bg-white/80 hover:bg-white backdrop-blur-sm rounded-full w-8 h-8 shadow-sm z-10 hidden group-hover:flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 data-[state=open]:flex data-[state=open]:opacity-100"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                }}
              >
                {isTogglingStatus ? (
                  <Loader2 className="w-4 h-4 text-gray-500 animate-spin" />
                ) : (
                  <MoreVertical className="w-4 h-4 text-gray-600" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 z-50 relative">
              {onEdit && (
                <DropdownMenuItem
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    onEdit(property)
                  }}
                  className="cursor-pointer font-medium"
                >
                  <Edit2 className="mr-2 h-4 w-4 text-blue-600" />
                  <span>Editar Imóvel</span>
                </DropdownMenuItem>
              )}
              {onToggleStatus && (
                <DropdownMenuItem
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    onToggleStatus(property)
                  }}
                  className="cursor-pointer font-medium"
                  disabled={isTogglingStatus}
                >
                  <Power
                    className={`mr-2 h-4 w-4 ${
                      property.active ? 'text-red-500' : 'text-green-600'
                    }`}
                  />
                  <span>
                    {property.active ? 'Desativar Imóvel' : 'Ativar Imóvel'}
                  </span>
                </DropdownMenuItem>
              )}
              {(onEdit || onToggleStatus) && onDelete && (
                <DropdownMenuSeparator />
              )}
              {onDelete && (
                <DropdownMenuItem
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    onDelete(property)
                  }}
                  className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50 font-medium"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  <span>Excluir Imóvel</span>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      <CardHeader className="pb-2">
        <CardTitle className="line-clamp-1" title={property.name}>
          {property.name}
        </CardTitle>

        <div
          className="flex items-start text-gray-500 text-sm mt-1"
          title={`${property.address}, ${property.city} - ${property.state}`}
        >
          <MapPin size={14} className="mr-1 mt-0.5 shrink-0" />
          <span className="line-clamp-2">
            {property.address} - {property.city}, {property.state}
          </span>
        </div>
      </CardHeader>

      <CardContent className="pb-4">
        <p className="text-2xl font-bold text-[#ff4e00] mb-2">
          {new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          }).format(property.value)}
        </p>

        <div
          className="flex items-center text-sm text-gray-500 mb-4"
          title="Corretor responsável"
        >
          <User size={14} className="mr-1 shrink-0 text-gray-400" />
          <span className="truncate">{property.brokerName}</span>
        </div>

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
