import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { isAxiosError } from 'axios'
import { useAuth } from '@/hooks/auth/use-auth'
import { ProfileFormValues, profileSchema } from '@/schemas/profile-schema'

export function useUpdateProfile() {
  const { user, updateProfile } = useAuth()

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: '',
      password: '',
    },
  })

  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name,
        password: '',
      })
    }
  }, [user, form])

  const updateMutation = useMutation({
    mutationFn: async (data: ProfileFormValues) => {
      const updateData = { ...data }
      if (!updateData.password) {
        delete updateData.password
      }
      await updateProfile(updateData)
    },
    onSuccess: () => {
      toast.success('Perfil atualizado com sucesso!')
      form.setValue('password', '')
    },
    onError: (error) => {
      if (isAxiosError(error) && error.response) {
        toast.error(error.response.data?.message || 'Erro ao atualizar perfil.')
      } else {
        toast.error('Ocorreu um erro inesperado. Tente novamente.')
      }
    },
  })

  const onSubmit = (data: ProfileFormValues) => {
    updateMutation.mutate(data)
  }

  return {
    form,
    onSubmit,
    isLoading: updateMutation.isPending,
  }
}
