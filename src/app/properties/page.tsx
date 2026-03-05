'use client'

import { useProperties } from '@/hooks/use-properties'
import { PropertyDialog } from '@/components/property-dialog'
import { PropertyCard } from '@/components/property-card'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Loader2, Plus, Search } from 'lucide-react'

export default function MyPropertiesPage() {
  const {
    properties,
    filteredProperties,
    loading,
    search,
    setSearch,
    isDialogOpen,
    setIsDialogOpen,
    handleOpenDialog,
    handleCloseDialog,
    handleSuccess,
  } = useProperties()

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

        <PropertyDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          initialData={null}
          onSuccess={handleSuccess}
          onCancel={handleCloseDialog}
          trigger={
            <Button
              className="bg-[#ff4e00] hover:bg-[#e64600]"
              onClick={handleOpenDialog}
            >
              <Plus className="w-4 h-4 mr-2" />
              Novo Imóvel
            </Button>
          }
        />
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
            onClick={handleOpenDialog}
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
