'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useDebounce } from 'use-debounce'
import { propertyService } from '@/services/propertyService'
import { userService } from '@/services/userService'
import { useAuth } from '@/hooks/use-auth'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Property, PropertyFilters, PropertyType } from '@/types/property'

import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { PropertyCard } from '@/components/property-card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { PropertyForm } from '@/components/property-form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Loader2, Trash2 } from 'lucide-react'

function HomeContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [name, setName] = useState(searchParams.get('name') || '')
  const [debouncedName] = useDebounce(name, 500)
  const [type, setType] = useState<PropertyType | ''>(
    (searchParams.get('type') as PropertyType) || '',
  )
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '')
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '')
  const [minBedrooms, setMinBedrooms] = useState(
    searchParams.get('minBedrooms') || '',
  )

  const [page, setPage] = useState(Number(searchParams.get('page')) || 0)
  const [size, setSize] = useState(Number(searchParams.get('size')) || 10)
  const [sort, setSort] = useState(searchParams.get('sort') || 'id')

  const queryClient = useQueryClient()
  const { user } = useAuth()
  const [togglingFavorites, setTogglingFavorites] = useState<Set<number>>(
    new Set(),
  )

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingProperty, setEditingProperty] = useState<Property | null>(null)
  const [propertyToDelete, setPropertyToDelete] = useState<Property | null>(
    null,
  )
  const [isDeleting, setIsDeleting] = useState(false)
  const [isToggling, setIsToggling] = useState<number | null>(null)

  const { data: favoritesList } = useQuery({
    queryKey: ['favorites'],
    queryFn: userService.getFavorites,
    enabled: !!user,
  })

  const favorites = new Set(favoritesList?.map((f) => f.id) || [])

  const toggleFavoriteMutation = useMutation({
    mutationFn: async (propertyId: number) => {
      const isCurrentlyFavorite = favorites.has(propertyId)
      if (isCurrentlyFavorite) {
        await userService.removeFavorite(propertyId)
      } else {
        await userService.addFavorite(propertyId)
      }
      return { propertyId, isCurrentlyFavorite }
    },
    onSuccess: ({ isCurrentlyFavorite }) => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] })
      if (isCurrentlyFavorite) {
        toast.success('Imóvel removido dos favoritos.')
      } else {
        toast.success('Imóvel adicionado aos favoritos.')
      }
    },
    onError: () => {
      toast.error('Ocorreu um erro ao atualizar os favoritos.')
    },
    onSettled: (_, __, propertyId) => {
      setTogglingFavorites((prev) => {
        const newSet = new Set(prev)
        newSet.delete(propertyId)
        return newSet
      })
    },
  })

  const handleToggleFavorite = async (propertyId: number) => {
    if (!user) {
      toast.error('Você precisa estar logado para favoritar imóveis.')
      router.push('/login')
      return
    }
    setTogglingFavorites((prev) => new Set(prev).add(propertyId))
    toggleFavoriteMutation.mutate(propertyId)
  }

  const handleOpenDialog = (property?: Property) => {
    setEditingProperty(property || null)
    setIsDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setEditingProperty(null)
  }

  const handleSuccess = () => {
    handleCloseDialog()
    queryClient.invalidateQueries({ queryKey: ['properties'] })
  }

  const deleteMutation = useMutation({
    mutationFn: propertyService.deleteProperty,
    onSuccess: () => {
      toast.success('Imóvel excluído com sucesso.')
      queryClient.invalidateQueries({ queryKey: ['properties'] })
    },
    onError: () => {
      toast.error('Erro ao excluir imóvel.')
    },
    onSettled: () => {
      setIsDeleting(false)
      setPropertyToDelete(null)
    },
  })

  const handleDelete = async () => {
    if (!propertyToDelete) return
    setIsDeleting(true)
    deleteMutation.mutate(propertyToDelete.id)
  }

  const toggleStatusMutation = useMutation({
    mutationFn: propertyService.togglePropertyStatus,
    onSuccess: (updatedProperty) => {
      toast.success(
        `Imóvel ${updatedProperty.active ? 'ativado' : 'desativado'} com sucesso!`,
      )
      queryClient.invalidateQueries({ queryKey: ['properties'] })
    },
    onError: () => {
      toast.error('Erro ao alterar status do imóvel.')
    },
    onSettled: () => {
      setIsToggling(null)
    },
  })

  const handleToggleStatus = async (property: Property) => {
    setIsToggling(property.id)
    toggleStatusMutation.mutate(property.id)
  }

  const filters: PropertyFilters = {
    name: debouncedName || undefined,
    type: type || undefined,
    minPrice: minPrice ? Number(minPrice) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
    minBedrooms: minBedrooms ? Number(minBedrooms) : undefined,
    page,
    size,
    sort,
  }

  const { data, isLoading: loading } = useQuery({
    queryKey: ['properties', filters],
    queryFn: () => propertyService.getProperties(filters),
  })

  const updateUrlParams = useCallback(() => {
    const params = new URLSearchParams()

    if (debouncedName) params.set('name', debouncedName)
    if (type) params.set('type', type)
    if (minPrice) params.set('minPrice', minPrice)
    if (maxPrice) params.set('maxPrice', maxPrice)
    if (minBedrooms) params.set('minBedrooms', minBedrooms)
    params.set('page', page.toString())
    params.set('size', size.toString())
    params.set('sort', sort)

    router.replace(`/?${params.toString()}`)
  }, [
    debouncedName,
    type,
    minPrice,
    maxPrice,
    minBedrooms,
    page,
    size,
    sort,
    router,
  ])

  useEffect(() => {
    updateUrlParams()
  }, [updateUrlParams])

  useEffect(() => {
    setPage(0)
  }, [debouncedName, type, minPrice, maxPrice, minBedrooms, size, sort])

  return (
    <div className="container mx-auto py-8 px-4 flex flex-col gap-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#ff4e00] mb-2">
            Imóveis Disponíveis
          </h1>
          <p className="text-gray-500">Encontre o imóvel perfeito para você.</p>
        </div>
      </div>

      <Card className="bg-white/50 backdrop-blur border-[#ff4e00]/10">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                Busca por Nome
              </label>
              <Input
                placeholder="Ex: Apartamento Centro"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                Tipo de Imóvel
              </label>
              <Select
                value={type || 'all'}
                onValueChange={(val) =>
                  setType(val === 'all' ? '' : (val as PropertyType))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Todos os tipos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="CASA">Casa</SelectItem>
                  <SelectItem value="TERRENO">Terreno</SelectItem>
                  <SelectItem value="APARTAMENTO">Apartamento</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                Preço Mínimo (R$)
              </label>
              <Input
                type="number"
                placeholder="Ex: 100000"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                Preço Máximo (R$)
              </label>
              <Input
                type="number"
                placeholder="Ex: 500000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                Mín. Quartos
              </label>
              <Select value={minBedrooms} onValueChange={setMinBedrooms}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Qualquer" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1+</SelectItem>
                  <SelectItem value="2">2+</SelectItem>
                  <SelectItem value="3">3+</SelectItem>
                  <SelectItem value="4">4+</SelectItem>
                  <SelectItem value="5">5+</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-t border-gray-100 pt-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <label className="text-sm font-semibold text-gray-700 whitespace-nowrap">
                  Ordenar por
                </label>
                <Select value={sort} onValueChange={setSort}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Ordenar por" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="id">Mais Recentes</SelectItem>
                    <SelectItem value="name">Nome (A-Z)</SelectItem>
                    <SelectItem value="value">Valor Menor-Maior</SelectItem>
                    <SelectItem value="area">Menor Área</SelectItem>
                    <SelectItem value="bedrooms">Menos Quartos</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-sm font-semibold text-gray-700 whitespace-nowrap">
                  Itens por página
                </label>
                <Select
                  value={size.toString()}
                  onValueChange={(v) => setSize(Number(v))}
                >
                  <SelectTrigger className="w-[80px]">
                    <SelectValue placeholder="Qtd" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              variant="outline"
              onClick={() => {
                setName('')
                setType('')
                setMinPrice('')
                setMaxPrice('')
                setMinBedrooms('')
                setSort('id')
                setSize(10)
              }}
              className="text-gray-500 hover:text-[#ff4e00]"
            >
              Limpar Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      <div>
        {loading && !data ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-[#ff4e00]" />
          </div>
        ) : data?.content.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
            <h3 className="text-xl font-bold text-gray-500 mb-2">
              Nenhum imóvel encontrado
            </h3>
            <p className="text-gray-400">
              Tente ajustar seus filtros para ver mais resultados.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {data?.content.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  isFavorite={favorites.has(property.id)}
                  onToggleFavorite={handleToggleFavorite}
                  isTogglingFavorite={togglingFavorites.has(property.id)}
                  onEdit={handleOpenDialog}
                  onToggleStatus={handleToggleStatus}
                  onDelete={setPropertyToDelete}
                  isTogglingStatus={isToggling === property.id}
                />
              ))}
            </div>

            {data && data.totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-10">
                <Button
                  variant="outline"
                  disabled={page === 0}
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                >
                  Anterior
                </Button>
                <div className="text-sm font-medium text-gray-500">
                  Página <span className="text-gray-900">{page + 1}</span> de{' '}
                  <span className="text-gray-900">{data.totalPages}</span>
                </div>
                <Button
                  variant="outline"
                  disabled={page >= data.totalPages - 1}
                  onClick={() =>
                    setPage((p) => Math.min(data.totalPages - 1, p + 1))
                  }
                >
                  Próxima
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingProperty ? 'Editar Imóvel' : 'Cadastrar Novo Imóvel'}
            </DialogTitle>
            <DialogDescription>
              Preencha os dados do imóvel abaixo. As informações serão
              publicadas imediatamente.
            </DialogDescription>
          </DialogHeader>
          <PropertyForm
            initialData={editingProperty}
            onSuccess={handleSuccess}
            onCancel={handleCloseDialog}
          />
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!propertyToDelete}
        onOpenChange={(open) => !open && setPropertyToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza absoluta?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso excluirá permanentemente o
              imóvel
              <span className="font-bold text-gray-900 mx-1">
                {propertyToDelete?.name}
              </span>
              dos nossos servidores.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault()
                handleDelete()
              }}
              className="bg-red-600 hover:bg-red-700"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4 mr-2" />
              )}
              Excluir Imóvel
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

import { Suspense } from 'react'

export default function Home() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center py-20 min-h-screen">
          <Loader2 className="w-10 h-10 animate-spin text-[#ff4e00]" />
        </div>
      }
    >
      <HomeContent />
    </Suspense>
  )
}
