import { useState } from 'react'
import { useAuth } from './use-auth'
import { useMutation } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { LoginFormValues, loginSchema } from '@/schemas/login-schema'

export function useLoginForm() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const { signIn } = useAuth()

  const loginMutation = useMutation({
    mutationFn: signIn,
    onError: (e) => {
      if (isAxiosError(e) && e.response) {
        setErrorMessage(e.response.data?.message || 'Credenciais inválidas.')
      } else {
        setErrorMessage('Ocorreu um erro inesperado. Tente novamente.')
      }
    },
  })

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  function onSubmit(data: LoginFormValues) {
    setErrorMessage(null)
    loginMutation.mutate(data)
  }

  const isLoading = loginMutation.isPending

  return {
    errorMessage,
    form,
    onSubmit,
    isLoading,
  }
}
