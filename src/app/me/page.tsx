'use client'

import { useState, useEffect } from 'react'
import { Loader2, User as UserIcon, Mail, Shield } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { UserPlus } from 'lucide-react'
import { ProfileForm } from '@/components/profile-form'
import { CreateUserForm } from '@/components/create-user-form'

export default function MePage() {
  const { user, loading: authLoading } = useAuth()

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
            <ProfileForm />
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
              <CreateUserForm />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
