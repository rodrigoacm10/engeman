import { useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../auth/use-auth'
import { useMemo, useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { PaginatedResponse, Property } from '@/types/property'
import { toast } from 'sonner'
import { userService } from '@/services/userService'

export function useFavorites() {
  const queryClient = useQueryClient()
  const { user } = useAuth()
  const [search, setSearch] = useState('')
  const [togglingFavorites, setTogglingFavorites] = useState<Set<number>>(
    new Set(),
  )

  const { data: favorites = [], isLoading: loading } = useQuery({
    queryKey: ['favorites'],
    queryFn: async () => {
      try {
        const data = await userService.getFavorites()
        const items = Array.isArray(data)
          ? data
          : (data as unknown as PaginatedResponse<Property>).content || []
        return items
      } catch (error) {
        toast.error('Não foi possível carregar seus favoritos.')
        throw error
      }
    },
    enabled: !!user,
  })

  const removeFavoriteMutation = useMutation({
    mutationFn: userService.removeFavorite,
    onSuccess: () => {
      toast.success('Imóvel removido dos favoritos.')
      queryClient.invalidateQueries({ queryKey: ['favorites'] })
    },
    onError: () => {
      toast.error('Ocorreu um erro ao remover dos favoritos.')
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
    setTogglingFavorites((prev) => new Set(prev).add(propertyId))
    removeFavoriteMutation.mutate(propertyId)
  }

  const filteredFavorites = useMemo(() => {
    if (!search.trim()) return favorites
    const lowerSearch = search.toLowerCase()
    return favorites.filter(
      (p) =>
        p.name.toLowerCase().includes(lowerSearch) ||
        p.city.toLowerCase().includes(lowerSearch) ||
        p.state.toLowerCase().includes(lowerSearch),
    )
  }, [favorites, search])

  return {
    filters: {
      search,
      setSearch,
      filteredFavorites,
      favorites,
    },
    card: {
      handleToggleFavorite,
      togglingFavorites,
    },
    loading,
  }
}
