'use client'

import { use, useState } from 'react'
import { useRouter } from 'next/navigation'
import { propertyService } from '@/services/propertyService'
import { Property } from '@/types/property'
import { Button } from '@/components/ui/button'
import { useQuery } from '@tanstack/react-query'
import { Card, CardContent } from '@/components/ui/card'
import {
  ArrowLeft,
  MapPin,
  BedDouble,
  Ruler,
  Home,
  Loader2,
  User,
} from 'lucide-react'
import Image from 'next/image'

export default function PropertyDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()

  const { data: property, isLoading } = useQuery({
    queryKey: ['property', id],
    queryFn: () => propertyService.getPropertyById(Number(id)),
    enabled: !!id,
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-10 w-10 animate-spin text-[#ff4e00]" />
      </div>
    )
  }

  if (!property) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <h2 className="text-2xl font-bold text-gray-700">
          Imóvel não encontrado
        </h2>
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="border-[#ff4e00] text-[#ff4e00] hover:bg-[#ff4e00]/10"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
      </div>
    )
  }

  const images = property.imageUrls ? property.imageUrls.split(',') : []

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="mb-6 text-gray-500 hover:text-[#ff4e00] hover:bg-[#ff4e00]/10"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Voltar
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="aspect-4/3 relative rounded-lg overflow-hidden border border-gray-200 shadow-sm bg-gray-100">
            {images.length > 0 ? (
              <Image
                src={images[0]}
                alt={property.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                <Home className="w-16 h-16 opacity-20" />
              </div>
            )}
            {!property.active && (
              <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-md">
                Inativo
              </div>
            )}
          </div>

          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {images.slice(1).map((img, index) => (
                <div
                  key={index}
                  className="aspect-square relative rounded-md overflow-hidden border border-gray-200"
                >
                  <Image
                    src={img}
                    alt={`${property.name} - imagem ${index + 2}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 25vw, 15vw"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col">
          <div className="mb-6">
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">
              {property.name}
            </h1>
            <p className="text-3xl font-bold text-[#ff4e00]">
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              }).format(property.value)}
            </p>
          </div>

          <Card className="mb-6 border-gray-200 shadow-sm">
            <CardContent className="p-0">
              <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-gray-200 border-b border-gray-200">
                <div className="p-4 flex flex-col items-center justify-center text-center">
                  <Home className="w-6 h-6 text-gray-400 mb-1" />
                  <span className="text-sm text-gray-500 font-medium">
                    {property.type}
                  </span>
                </div>
                <div className="p-4 flex flex-col items-center justify-center text-center">
                  <BedDouble className="w-6 h-6 text-gray-400 mb-1" />
                  <span className="text-sm font-bold text-gray-700">
                    {property.bedrooms}
                  </span>
                  <span className="text-xs text-gray-500 font-medium">
                    Quartos
                  </span>
                </div>
                <div className="p-4 flex flex-col items-center justify-center text-center">
                  <Ruler className="w-6 h-6 text-gray-400 mb-1" />
                  <span className="text-sm font-bold text-gray-700">
                    {property.area} m²
                  </span>
                  <span className="text-xs text-gray-500 font-medium">
                    Área
                  </span>
                </div>
                <div className="p-4 flex flex-col items-center justify-center text-center">
                  <MapPin className="w-6 h-6 text-gray-400 mb-1" />
                  <span
                    className="text-sm font-bold text-gray-700 truncate w-full px-2"
                    title={`${property.city} - ${property.state}`}
                  >
                    {property.city}
                  </span>
                  <span className="text-xs text-gray-500 font-medium">
                    {property.state}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#ff4e00] shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Endereço</h3>
                    <p className="text-gray-600">{property.address}</p>
                    <p className="text-gray-500 text-sm">
                      {property.city} - {property.state}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="mb-8 flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-3">Descrição</h3>
            <div className="prose prose-sm md:prose-base text-gray-600 max-w-none whitespace-pre-line">
              {property.description ||
                'Nenhuma descrição fornecida para este imóvel.'}
            </div>
          </div>

          <div className="mt-auto pt-6 border-t border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-[#ff4e00]/10 flex items-center justify-center border border-[#ff4e00]/20">
                <User className="w-6 h-6 text-[#ff4e00]" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">
                  Corretor Responsável
                </p>
                <p className="font-bold text-gray-900">
                  {property.brokerName || 'Não especificado'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
