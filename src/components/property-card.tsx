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
import { useAuth } from '@/hooks/use-auth'
import { useRouter } from 'next/navigation'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

import { PropertyDialog } from '@/components/property-dialog'
import { PropertyDeleteDialog } from '@/components/property-delete-dialog'
import { usePropertyCardAction } from '@/hooks/use-property-card-action'

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
  const { user } = useAuth()
  const router = useRouter()
  const canManage =
    user?.role === 'ADMIN' ||
    (user?.role === 'CORRETOR' &&
      String(property.brokerName).trim().toLowerCase() ===
        String(user?.name).trim().toLowerCase())

  const showActionsMenu = canManage
  const { editDialog, deleteAlert, status } = usePropertyCardAction(property)

  return (
    <>
      <Card
        className="overflow-hidden hover:shadow-lg transition-all duration-300 border-gray-200 relative group cursor-pointer hover:scale-105"
        onClick={() => router.push(`/list/${property.id}`)}
      >
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
                  isFavorite
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-500'
                } ${isTogglingFavorite ? 'opacity-50' : ''}`}
              />
            </Button>
          )}

          {showActionsMenu && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    'absolute top-2 right-2 bg-white/80 hover:bg-white backdrop-blur-sm rounded-full w-8 h-8 shadow-sm z-10 flex items-center justify-center transition-all opacity-100 group-hover:opacity-100',
                    onToggleFavorite && 'right-12',
                  )}
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                  }}
                >
                  {status.isToggling ? (
                    <Loader2 className="w-4 h-4 text-gray-500 animate-spin" />
                  ) : (
                    <MoreVertical className="w-4 h-4 text-gray-600" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 z-50 relative">
                <DropdownMenuItem
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    editDialog.setIsOpen(true)
                  }}
                  className="cursor-pointer font-medium"
                >
                  <Edit2 className="mr-2 h-4 w-4 text-blue-600" />
                  <span>Editar Imóvel</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    status.handleToggle()
                  }}
                  className="cursor-pointer font-medium"
                  disabled={status.isToggling}
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
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    deleteAlert.setIsOpen(true)
                  }}
                  className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50 font-medium"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  <span>Excluir Imóvel</span>
                </DropdownMenuItem>
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

      {showActionsMenu && (
        <>
          <PropertyDialog
            open={editDialog.isOpen}
            onOpenChange={editDialog.setIsOpen}
            initialData={property}
            onSuccess={editDialog.handleSuccess}
            onCancel={editDialog.handleClose}
          />

          <PropertyDeleteDialog
            open={deleteAlert.isOpen}
            onOpenChange={deleteAlert.setIsOpen}
            propertyName={property.name}
            onDelete={deleteAlert.handleDelete}
            isDeleting={deleteAlert.isDeleting}
          />
        </>
      )}
    </>
  )
}
