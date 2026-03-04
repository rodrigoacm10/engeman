'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2, User as UserIcon, Mail, Shield, Save } from 'lucide-react'
import { isAxiosError } from 'axios'
import { toast } from 'sonner'

import { useAuth } from '@/hooks/use-auth'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { userService } from '@/services/userService'
import { UserPlus, Plus } from 'lucide-react'
import { ProfileFormValues, profileSchema } from '@/schemas/profile-schema'
import { CreateUserFormValues, createUserSchema } from '@/schemas/user-schema'

export default function MePage() {
  const { user, updateProfile, loading: authLoading } = useAuth()
  const queryClient = useQueryClient()

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: '',
      password: '',
    },
  })

  const createUserForm = useForm<CreateUserFormValues>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: 'CLIENTE',
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

  const createUserMutation = useMutation({
    mutationFn: userService.createUser,
    onSuccess: () => {
      toast.success('Usuário criado com sucesso!')
      createUserForm.reset()
    },
    onError: (error) => {
      if (isAxiosError(error) && error.response) {
        toast.error(error.response.data?.message || 'Erro ao criar usuário.')
      } else {
        toast.error('Ocorreu um erro inesperado. Tente novamente.')
      }
    },
  })

  function onSubmit(data: ProfileFormValues) {
    updateMutation.mutate(data)
  }

  function onCreateUser(data: CreateUserFormValues) {
    createUserMutation.mutate(data)
  }

  const isLoading = updateMutation.isPending
  const isCreatingUser = createUserMutation.isPending

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-[#ff4e00]" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="container mx-auto py-10 px-4 max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-extrabold text-[#ff4e00]">Minha Conta</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Dados Atuais</CardTitle>
            <CardDescription>Informações da sua conta.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <UserIcon className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-xs text-gray-400 uppercase font-bold">
                  Nome
                </p>
                <p className="font-medium">{user.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-xs text-gray-400 uppercase font-bold">
                  E-mail
                </p>
                <p className="font-medium">{user.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Shield className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-xs text-gray-400 uppercase font-bold">
                  Nível de Acesso
                </p>
                <p className="font-medium">{user.role}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Editar Perfil</CardTitle>
            <CardDescription>
              Atualize seu nome ou altere sua senha.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome Completo</FormLabel>
                      <FormControl>
                        <Input placeholder="Seu nome" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nova Senha (opcional)</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="••••••••"
                          {...field}
                        />
                      </FormControl>
                      <CardDescription>
                        Deixe em branco para manter a senha atual.
                      </CardDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full bg-[#ff4e00] hover:bg-[#e64600] text-white"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="mr-2 h-4 w-4" />
                  )}
                  Salvar Alterações
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>

      {user.role === 'ADMIN' && (
        <div className="mt-12">
          <div className="flex items-center gap-3 mb-6">
            <UserPlus className="h-8 w-8 text-[#ff4e00]" />
            <h2 className="text-3xl font-extrabold text-[#ff4e00]">
              Gerenciar Usuários
            </h2>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Criar Novo Usuário</CardTitle>
              <CardDescription>
                Adicione um novo usuário ao sistema com um cargo específico.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...createUserForm}>
                <form
                  onSubmit={createUserForm.handleSubmit(onCreateUser)}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                  <FormField
                    control={createUserForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome Completo</FormLabel>
                        <FormControl>
                          <Input placeholder="Nome do usuário" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={createUserForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>E-mail</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="email@exemplo.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={createUserForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Senha</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="••••••••"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={createUserForm.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nível de Acesso</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione um cargo" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="ADMIN">Administrador</SelectItem>
                            <SelectItem value="CORRETOR">Corretor</SelectItem>
                            <SelectItem value="CLIENTE">Cliente</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="md:col-span-2 bg-[#ff4e00] hover:bg-[#e64600] text-white"
                    disabled={isCreatingUser}
                  >
                    {isCreatingUser ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Plus className="mr-2 h-4 w-4" />
                    )}
                    Criar Usuário
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
