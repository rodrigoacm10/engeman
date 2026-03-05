'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { propertyService } from '@/services/propertyService'
import { Property } from '@/types/property'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useAuth } from '@/hooks/use-auth'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { PropertyForm } from '@/components/property-form'
import { PropertyCard } from '@/components/property-card'
import { Loader2, Plus, Search } from 'lucide-react'

export default function MyPropertiesPage() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { user } = useAuth()
  const [search, setSearch] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
    if (user && user.role === 'CLIENTE') {
      toast.error('Você não tem permissão para acessar esta página.')
      router.push('/')
    }
  }, [user, router])

  const { data: properties = [], isLoading: loading } = useQuery({
    queryKey: ['userProperties'],
    queryFn: async () => {
      try {
        return await propertyService.getUserProperties()
      } catch (error) {
        toast.error('Não foi possível carregar seus imóveis.')
        throw error
      }
    },
    enabled: !!user && user.role !== 'CLIENTE',
  })

  const handleCloseDialog = () => {
    setIsDialogOpen(false)
  }

  const handleSuccess = () => {
    handleCloseDialog()
    queryClient.invalidateQueries({ queryKey: ['userProperties'] })
    queryClient.invalidateQueries({ queryKey: ['properties'] })
  }

  const filteredProperties = useMemo(() => {
    if (!search.trim()) return properties
    const lowerSearch = search.toLowerCase()
    return properties.filter(
      (p) =>
        p.name.toLowerCase().includes(lowerSearch) ||
        p.city.toLowerCase().includes(lowerSearch) ||
        p.state.toLowerCase().includes(lowerSearch),
    )
  }, [properties, search])

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#ff4e00] mb-2">
            Meus Imóveis
          </h1>
          <p className="text-gray-500">
            Gerencie todos os imóveis que você tem cadastrados na plataforma.
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              className="bg-[#ff4e00] hover:bg-[#e64600]"
              onClick={() => setIsDialogOpen(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Novo Imóvel
            </Button>
          </DialogTrigger>
          <DialogContent
            className="max-w-3xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <DialogHeader>
              <DialogTitle>Cadastrar Novo Imóvel</DialogTitle>
              <DialogDescription>
                Preencha os dados do imóvel abaixo. As informações serão
                publicadas imediatamente.
              </DialogDescription>
            </DialogHeader>
            <PropertyForm
              initialData={null}
              onSuccess={handleSuccess}
              onCancel={handleCloseDialog}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Card className="bg-white/50 backdrop-blur border-[#ff4e00]/10 mb-8">
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

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-10 h-10 animate-spin text-[#ff4e00]" />
        </div>
      ) : properties.length === 0 ? (
        <div className="bg-white rounded-xl border border-dashed border-gray-300 p-12 text-center">
          <h3 className="text-xl font-bold text-gray-700 mb-2">
            Você ainda não possui imóveis
          </h3>
          <p className="text-gray-500 mb-6">
            Comece agora mesmo a cadastrar suas propriedades para que os
            clientes possam visualizá-las.
          </p>
          <Button
            className="bg-[#ff4e00] hover:bg-[#e64600]"
            onClick={() => setIsDialogOpen(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Cadastrar meu primeiro Imóvel
          </Button>
        </div>
      ) : filteredProperties.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
          <h3 className="text-xl font-bold text-gray-500 mb-2">
            Nenhum resultado encontrado
          </h3>
          <p className="text-gray-400">
            Tente ajustar sua busca para encontrar o imóvel desejado.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      )}
    </div>
  )
}
