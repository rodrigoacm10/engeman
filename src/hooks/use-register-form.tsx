import { useState } from 'react'
import { useAuth } from './use-auth'
import { useMutation } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { useForm } from 'react-hook-form'
import { RegisterFormValues, registerSchema } from '@/schemas/register-schema'
import { zodResolver } from '@hookform/resolvers/zod'

export function useRegisterForm() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const { signUp } = useAuth()

  const registerMutation = useMutation({
    mutationFn: signUp,
    onError: (e) => {
      if (isAxiosError(e) && e.response) {
        setErrorMessage(
          e.response.data?.message ||
            'Erro ao registrar usuário. Verifique os dados fornecidos.',
        )
      } else {
        setErrorMessage('Ocorreu um erro inesperado. Tente novamente.')
      }
    },
  })

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  })

  function onSubmit(data: RegisterFormValues) {
    setErrorMessage(null)
    registerMutation.mutate(data)
  }

  const isLoading = registerMutation.isPending

  return {
    errorMessage,
    form,
    onSubmit,
    isLoading,
  }
}
