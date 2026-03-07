'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { PropertyCard } from '@/components/property/property-card'
import { Loader2, Search } from 'lucide-react'
import { useFavorites } from '@/hooks/favorites/use-favorites'

export default function FavoritesPage() {
  const { filters, card, loading } = useFavorites()

  return (
    <div className="container mx-auto py-8 px-4 flex flex-col gap-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#ff4e00] mb-2">
            Meus Favoritos
          </h1>
          <p className="text-gray-500">
            Imóveis que você marcou como favoritos.
          </p>
        </div>
      </div>

      <Card className="bg-white/50 backdrop-blur border-[#ff4e00]/10">
        <CardContent className="p-6">
          <div className="flex items-center space-x-2">
            <Search className="text-gray-400 w-5 h-5 shrink-0" />
            <Input
              placeholder="Buscar por nome, cidade ou estado..."
              value={filters.search}
              onChange={(e) => filters.setSearch(e.target.value)}
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
        ) : filters.filteredFavorites.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
            <h3 className="text-xl font-bold text-gray-500 mb-2">
              {filters.favorites.length === 0
                ? 'Nenhum imóvel favoritado'
                : 'Nenhum resultado encontrado'}
            </h3>
            <p className="text-gray-400">
              {filters.favorites.length === 0
                ? 'Você ainda não adicionou nenhum imóvel aos favoritos.'
                : 'Tente ajustar sua busca para encontrar o imóvel desejado.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filters.filteredFavorites.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                isFavorite={true}
                onToggleFavorite={() => card.handleToggleFavorite(property.id)}
                isTogglingFavorite={card.togglingFavorites.has(property.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
