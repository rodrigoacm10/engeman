'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useAuth } from '@/hooks/use-auth'
import { propertyService } from '@/services/propertyService'

export function useProperties() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { user } = useAuth()

  const [search, setSearch] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
    if (user && user.role === 'CLIENTE') {
      toast.error('Você não tem permissão para acessar esta página.')
      router.push('/list')
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

  const handleOpenDialog = () => {
    setIsDialogOpen(true)
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

  return {
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
    user,
  }
}
