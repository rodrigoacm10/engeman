import { useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useDebounce } from 'use-debounce'
import { propertyService } from '@/services/propertyService'
import { userService } from '@/services/userService'
import { useAuth } from '@/hooks/use-auth'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { PropertyFilters, PropertyType } from '@/types/property'

export function useHome() {
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

  const clearFilters = () => {
    setName('')
    setType('')
    setMinPrice('')
    setMaxPrice('')
    setMinBedrooms('')
    setSort('id')
    setSize(10)
  }

  return {
    filters: { name, type, minPrice, maxPrice, minBedrooms },
    actions: {
      setName,
      setType,
      setMinPrice,
      setMaxPrice,
      setMinBedrooms,
      clearFilters,
    },
    pagination: { page, size, sort, setPage, setSize, setSort },
    data,
    loading,
    favorites: {
      items: favorites,
      toggling: togglingFavorites,
      handleToggle: handleToggleFavorite,
    },
  }
}
