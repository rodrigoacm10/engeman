'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { propertyService } from '@/services/propertyService'
import { Property } from '@/types/property'
import { toast } from 'sonner'
import { useAuth } from '@/hooks/useAuth'

// UI Components
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { PropertyCard } from '@/components/property-card'
import { Loader2, Plus, Edit2, Trash2, Power, Eye } from 'lucide-react'
import Link from 'next/link'

export default function MyPropertiesPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingProperty, setEditingProperty] = useState<Property | null>(null)

  useEffect(() => {
    if (user && user.role === 'CLIENTE') {
      toast.error('Você não tem permissão para acessar esta página.')
      router.push('/')
    }
  }, [user, router])

  const [propertyToDelete, setPropertyToDelete] = useState<Property | null>(
    null,
  )
  const [isDeleting, setIsDeleting] = useState(false)

  const [isToggling, setIsToggling] = useState<number | null>(null)

  const fetchProperties = async () => {
    setLoading(true)
    try {
      const data = await propertyService.getUserProperties()
      setProperties(data)
    } catch (error) {
      console.error('Erro ao buscar imóveis:', error)
      toast.error('Não foi possível carregar seus imóveis.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProperties()
  }, [])

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
    fetchProperties() // Recarrega os dados
  }

  const handleDelete = async () => {
    if (!propertyToDelete) return

    setIsDeleting(true)
    try {
      await propertyService.deleteProperty(propertyToDelete.id)
      toast.success('Imóvel excluído com sucesso.')
      setProperties((prev) => prev.filter((p) => p.id !== propertyToDelete.id))
    } catch (error) {
      console.error(error)
      toast.error('Erro ao excluir imóvel.')
    } finally {
      setIsDeleting(false)
      setPropertyToDelete(null)
    }
  }

  const handleToggleStatus = async (property: Property) => {
    setIsToggling(property.id)
    try {
      const updatedProperty = await propertyService.togglePropertyStatus(
        property.id,
      )
      setProperties((prev) =>
        prev.map((p) => (p.id === updatedProperty.id ? updatedProperty : p)),
      )
      toast.success(
        `Imóvel ${updatedProperty.active ? 'ativado' : 'desativado'} com sucesso!`,
      )
    } catch (error) {
      console.error(error)
      toast.error('Erro ao alterar status do imóvel.')
    } finally {
      setIsToggling(null)
    }
  }

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
              onClick={() => handleOpenDialog()}
            >
              <Plus className="w-4 h-4 mr-2" />
              Novo Imóvel
            </Button>
          </DialogTrigger>
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
      </div>

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
            onClick={() => handleOpenDialog()}
          >
            <Plus className="w-4 h-4 mr-2" />
            Cadastrar meu primeiro Imóvel
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {properties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              onEdit={handleOpenDialog}
              onToggleStatus={handleToggleStatus}
              onDelete={setPropertyToDelete}
              isTogglingStatus={isToggling === property.id}
            />
          ))}
        </div>
      )}

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
              ) : null}
              Sim, Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
