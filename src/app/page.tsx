'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useDebounce } from 'use-debounce'
import { propertyService } from '@/services/propertyService'
import {
  Property,
  PropertyFilters,
  PropertyType,
  PaginatedResponse,
} from '@/types/property'

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Loader2, MapPin, BedDouble, Ruler, Building } from 'lucide-react'

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
  const [size] = useState(10)
  const [sort] = useState('id')

  const [data, setData] = useState<PaginatedResponse<Property> | null>(null)
  const [loading, setLoading] = useState(true)

  const updateUrlParams = useCallback(() => {
    const params = new URLSearchParams()

    if (debouncedName) params.set('name', debouncedName)
    if (type) params.set('type', type)
    if (minPrice) params.set('minPrice', minPrice)
    if (maxPrice) params.set('maxPrice', maxPrice)
    if (minBedrooms) params.set('minBedrooms', minBedrooms)
    params.set('page', page.toString())

    router.replace(`/?${params.toString()}`)
  }, [debouncedName, type, minPrice, maxPrice, minBedrooms, page, router])

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true)
      try {
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

        const response = await propertyService.getProperties(filters)
        setData(response)
      } catch (error) {
        console.error('Failed to fetch properties', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProperties()
    updateUrlParams()
  }, [
    debouncedName,
    type,
    minPrice,
    maxPrice,
    minBedrooms,
    page,
    size,
    sort,
    updateUrlParams,
  ])

  useEffect(() => {
    setPage(0)
  }, [debouncedName, type, minPrice, maxPrice, minBedrooms])

  return (
    <div className="container mx-auto py-8 px-4 flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-extrabold text-[#ff4e00] mb-2">
          Imóveis Disponíveis
        </h1>
        <p className="text-gray-500">Encontre o imóvel perfeito para você.</p>
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
                value={type}
                onValueChange={(val) => setType(val as PropertyType | '')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos os tipos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todostipos">Todos</SelectItem>
                  <SelectItem value="RESIDENCIAL">Residencial</SelectItem>
                  <SelectItem value="COMERCIAL">Comercial</SelectItem>
                  <SelectItem value="INDUSTRIAL">Industrial</SelectItem>
                  <SelectItem value="RURAL">Rural</SelectItem>
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
                <SelectTrigger>
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

          <div className="mt-4 flex justify-end">
            <Button
              variant="outline"
              onClick={() => {
                setName('')
                setType('')
                setMinPrice('')
                setMaxPrice('')
                setMinBedrooms('')
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
                <Card
                  key={property.id}
                  className="overflow-hidden hover:shadow-lg transition-shadow border-gray-200"
                >
                  <div className="h-48 bg-gray-200 relative">
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                      <Building size={48} opacity={0.2} />
                    </div>
                    <div className="absolute top-2 left-2 bg-[#ff4e00] text-white text-xs font-bold px-2 py-1 rounded">
                      {property.type}
                    </div>
                    {!property.active && (
                      <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                        Inativo
                      </div>
                    )}
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle className="line-clamp-1">
                      {property.name}
                    </CardTitle>
                    <div className="flex items-center text-gray-500 text-sm mt-1">
                      <MapPin size={14} className="mr-1" />
                      {property.city}, {property.state}
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
                        <BedDouble size={16} className="mr-1 text-gray-400" />
                        {property.bedrooms}
                      </div>
                      <div className="flex items-center" title="Área">
                        <Ruler size={16} className="mr-1 text-gray-400" />
                        {property.area} m²
                      </div>
                    </div>
                  </CardContent>
                </Card>
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
