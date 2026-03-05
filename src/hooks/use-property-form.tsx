import { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { isAxiosError } from 'axios'

import { propertySchema, PropertyFormValues } from '@/schemas/property-schema'
import { Property } from '@/types/property'
import { propertyService } from '@/services/propertyService'

interface UsePropertyFormProps {
  initialData: Property | null | undefined
  onSuccess: () => void
}

export function usePropertyForm({
  initialData,
  onSuccess,
}: UsePropertyFormProps) {
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const form = useForm<PropertyFormValues>({
    resolver: zodResolver(propertySchema) as any,
    defaultValues: initialData
      ? {
          name: initialData.name,
          description: initialData.description,
          type: initialData.type,
          value: initialData.value,
          area: initialData.area,
          bedrooms: initialData.bedrooms,
          address: initialData.address,
          city: initialData.city,
          state: initialData.state,
          imageUrls: initialData.imageUrls,
        }
      : {
          name: '',
          description: '',
          type: 'CASA',
          value: 0,
          area: 0,
          bedrooms: 0,
          address: '',
          city: '',
          state: '',
          imageUrls: '',
        },
  })

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('Por favor, selecione apenas arquivos de imagem.')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('A imagem deve ter no máximo 5MB.')
      return
    }

    setIsUploading(true)
    try {
      const url = await propertyService.uploadImage(file)
      form.setValue('imageUrls', url, { shouldValidate: true })
      toast.success('Imagem enviada com sucesso!')
    } catch (error) {
      console.error('Upload falhou:', error)
      toast.error('Erro ao fazer upload da imagem.')
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const submitMutation = useMutation({
    mutationFn: async (data: PropertyFormValues) => {
      if (initialData) {
        await propertyService.updateProperty(initialData.id, data)
      } else {
        await propertyService.createProperty(data)
      }
    },
    onSuccess: () => {
      toast.success(
        initialData
          ? 'Imóvel atualizado com sucesso!'
          : 'Imóvel cadastrado com sucesso!',
      )
      onSuccess()
    },
    onError: (error) => {
      if (isAxiosError(error) && error.response) {
        toast.error(
          error.response.data?.message || 'Erro ao processar a requisição.',
        )
      } else {
        toast.error('Ocorreu um erro inesperado.')
      }
    },
  })

  const onSubmit = (data: PropertyFormValues) => {
    submitMutation.mutate(data)
  }

  const isLoadingSubmit = submitMutation.isPending

  return {
    form,
    handleImageUpload,
    onSubmit,
    isLoadingSubmit,
    isUploading,
    fileInputRef,
  }
}
