'use client'

import { Suspense } from 'react'
import { PropertyType } from '@/types/property'
import { useHome } from '@/hooks/list/use-home'

import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { PropertyCard } from '@/components/property/property-card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Loader2 } from 'lucide-react'

function HomeContent() {
  const {
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
    favorites,
  } = useHome()

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
              onClick={clearFilters}
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
                  isFavorite={favorites.items.has(property.id)}
                  onToggleFavorite={favorites.handleToggle}
                  isTogglingFavorite={favorites.toggling.has(property.id)}
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
    </div>
  )
}

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
