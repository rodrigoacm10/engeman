'use client'

import { useState, useEffect, useMemo } from 'react'
import { userService } from '@/services/userService'
import { Property, PaginatedResponse } from '@/types/property'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { PropertyCard } from '@/components/property-card'
import { Loader2, Search } from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '@/hooks/useAuth'

export default function FavoritesPage() {
  const { user } = useAuth()
  const [favorites, setFavorites] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [togglingFavorites, setTogglingFavorites] = useState<Set<number>>(
    new Set(),
  )

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user) return
      setLoading(true)
      try {
        const data = await userService.getFavorites()
        const items = Array.isArray(data)
          ? data
          : (data as unknown as PaginatedResponse<Property>).content || []
        setFavorites(items)
      } catch (error) {
        console.error('Failed to fetch favorites', error)
        toast.error('Não foi possível carregar seus favoritos.')
      } finally {
        setLoading(false)
      }
    }

    fetchFavorites()
  }, [user])

  const handleToggleFavorite = async (propertyId: number) => {
    setTogglingFavorites((prev) => new Set(prev).add(propertyId))

    try {
      await userService.removeFavorite(propertyId)
      setFavorites((prev) => prev.filter((p) => p.id !== propertyId))
      toast.success('Imóvel removido dos favoritos.')
    } catch (error) {
      console.error('Failed to remove favorite', error)
      toast.error('Ocorreu um erro ao remover dos favoritos.')
    } finally {
      setTogglingFavorites((prev) => {
        const newSet = new Set(prev)
        newSet.delete(propertyId)
        return newSet
      })
    }
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

  return (
    <div className="container mx-auto py-8 px-4 flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-extrabold text-[#ff4e00] mb-2">
          Meus Favoritos
        </h1>
        <p className="text-gray-500">Aqui estão os imóveis que você curtiu.</p>
      </div>

      <Card className="bg-white/50 backdrop-blur border-[#ff4e00]/10">
        <CardContent className="p-6">
          <div className="flex items-center space-x-2">
            <Search className="text-gray-400 w-5 h-5 shrink-0" />
            <Input
              placeholder="Buscar por nome, cidade ou estado..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-md"
            />
          </div>
        </CardContent>
      </Card>

      <div>
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-[#ff4e00]" />
          </div>
        ) : filteredFavorites.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
            <h3 className="text-xl font-bold text-gray-500 mb-2">
              {favorites.length === 0
                ? 'Nenhum imóvel favoritado'
                : 'Nenhum resultado encontrado'}
            </h3>
            <p className="text-gray-400">
              {favorites.length === 0
                ? 'Você ainda não adicionou nenhum imóvel aos favoritos.'
                : 'Tente ajustar sua busca para encontrar o imóvel desejado.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredFavorites.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                isFavorite={true}
                onToggleFavorite={() => handleToggleFavorite(property.id)}
                isTogglingFavorite={togglingFavorites.has(property.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
