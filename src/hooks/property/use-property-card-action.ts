import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { propertyService } from '@/services/propertyService'
import { toast } from 'sonner'
import { Property } from '@/types/property'

export function usePropertyCardAction(property: Property) {
  const queryClient = useQueryClient()
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isTogglingStatus, setIsTogglingStatus] = useState(false)

  const invalidateQueries = () => {
    queryClient.invalidateQueries({ queryKey: ['properties'] })
    queryClient.invalidateQueries({ queryKey: ['favorites'] })
    queryClient.invalidateQueries({ queryKey: ['userProperties'] })
    queryClient.invalidateQueries({ queryKey: ['property', property.id] })
    queryClient.invalidateQueries({
      queryKey: ['property', String(property.id)],
    })
  }

  const deleteMutation = useMutation({
    mutationFn: propertyService.deleteProperty,
    onSuccess: () => {
      toast.success('Imóvel excluído com sucesso.')
      invalidateQueries()
    },
    onError: () => {
      toast.error('Erro ao excluir imóvel.')
    },
    onSettled: () => {
      setIsDeleting(false)
      setIsDeleteDialogOpen(false)
    },
  })

  const toggleStatusMutation = useMutation({
    mutationFn: propertyService.togglePropertyStatus,
    onSuccess: (updatedProperty) => {
      toast.success(
        `Imóvel ${updatedProperty.active ? 'ativado' : 'desativado'} com sucesso!`,
      )
      invalidateQueries()
    },
    onError: () => {
      toast.error('Erro ao alterar status do imóvel.')
    },
    onSettled: () => {
      setIsTogglingStatus(false)
    },
  })

  return {
    editDialog: {
      isOpen: isEditDialogOpen,
      setIsOpen: setIsEditDialogOpen,
      handleSuccess: () => {
        setIsEditDialogOpen(false)
        invalidateQueries()
      },
      handleClose: () => {
        setIsEditDialogOpen(false)
      },
    },
    deleteAlert: {
      isOpen: isDeleteDialogOpen,
      setIsOpen: setIsDeleteDialogOpen,
      isDeleting,
      handleDelete: () => {
        setIsDeleting(true)
        deleteMutation.mutate(property.id)
      },
    },
    status: {
      isToggling: isTogglingStatus,
      handleToggle: () => {
        setIsTogglingStatus(true)
        toggleStatusMutation.mutate(property.id)
      },
    },
  }
}
