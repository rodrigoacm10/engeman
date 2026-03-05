import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { isAxiosError } from 'axios'
import { userService } from '@/services/userService'
import { CreateUserFormValues, createUserSchema } from '@/schemas/user-schema'

export function useCreateUser() {
  const form = useForm<CreateUserFormValues>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: 'CLIENTE',
    },
  })

  const createUserMutation = useMutation({
    mutationFn: userService.createUser,
    onSuccess: () => {
      toast.success('Usuário criado com sucesso!')
      form.reset()
    },
    onError: (error) => {
      if (isAxiosError(error) && error.response) {
        toast.error(error.response.data?.message || 'Erro ao criar usuário.')
      } else {
        toast.error('Ocorreu um erro inesperado. Tente novamente.')
      }
    },
  })

  const onCreateUser = (data: CreateUserFormValues) => {
    createUserMutation.mutate(data)
  }

  return {
    form,
    onCreateUser,
    isLoading: createUserMutation.isPending,
  }
}
