'use client'

import { useState, useEffect } from 'react'
import { propertyService } from '@/services/propertyService'
import { Property } from '@/types/property'
import { toast } from 'sonner'

// UI Components
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
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
import { Loader2, Plus, Edit2, Trash2, Power, Eye } from 'lucide-react'
import Link from 'next/link'

export default function MyPropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingProperty, setEditingProperty] = useState<Property | null>(null)

  // Deleção
  const [propertyToDelete, setPropertyToDelete] = useState<Property | null>(
    null,
  )
  const [isDeleting, setIsDeleting] = useState(false)

  // Status
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
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 hover:bg-gray-50">
                <TableHead className="w-[80px]">ID</TableHead>
                <TableHead>Título</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Localização</TableHead>
                <TableHead className="w-[100px] text-center">Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {properties.map((property) => (
                <TableRow key={property.id}>
                  <TableCell className="font-medium text-gray-500">
                    #{property.id}
                  </TableCell>
                  <TableCell>
                    <div className="font-medium line-clamp-1">
                      {property.name}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {property.type}
                    </span>
                  </TableCell>
                  <TableCell className="font-semibold text-gray-900">
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    }).format(property.value)}
                  </TableCell>
                  <TableCell className="text-gray-500">
                    {property.city}, {property.state}
                  </TableCell>
                  <TableCell className="text-center">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${property.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}
                    >
                      {property.active ? 'Ativo' : 'Inativo'}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Ver listagem pública"
                        asChild
                      >
                        <Link
                          href={`/?name=${encodeURIComponent(property.name)}`}
                        >
                          <Eye className="w-4 h-4 text-gray-500" />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Alterar Status"
                        onClick={() => handleToggleStatus(property)}
                        disabled={isToggling === property.id}
                      >
                        {isToggling === property.id ? (
                          <Loader2 className="w-4 h-4 animate-spin text-gray-500" />
                        ) : (
                          <Power
                            className={`w-4 h-4 ${property.active ? 'text-green-600' : 'text-gray-400'}`}
                          />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Editar"
                        onClick={() => handleOpenDialog(property)}
                      >
                        <Edit2 className="w-4 h-4 text-blue-600" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="hover:bg-red-50 hover:text-red-600"
                        title="Excluir"
                        onClick={() => setPropertyToDelete(property)}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Confirmação de Exclusão */}
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
