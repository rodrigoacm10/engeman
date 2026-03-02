'use client'

import React, { createContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { destroyCookie, setCookie, parseCookies } from 'nookies'
import { LoginCredentials, RegisterCredentials, User } from '@/types/auth'
import { authService } from '@/services/authService'
import { api } from '@/lib/api'

interface AuthContextType {
  isAuthenticated: boolean
  user: User | null
  signIn: (credentials: LoginCredentials) => Promise<void>
  signUp: (credentials: RegisterCredentials) => Promise<void>
  signOut: () => void
  loading: boolean
}

export const AuthContext = createContext({} as AuthContextType)

export const TOKEN_COOKIE_NAME = 'engeman_auth_token'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const isAuthenticated = !!user

  useEffect(() => {
    const { [TOKEN_COOKIE_NAME]: token } = parseCookies()

    if (token) {
      // Idealmente, a API tem uma rota `/me` para buscar os dados do usuário.
      // Como não foi listada nos requisitos explícitos do desafio, vamos apenas definir
      // um usuário fictício ou inferir a partir do JWT (não recomendado sem validação)
      // Para avançarmos nesse mock client-side, daremos um email genérico confirmando o token.
      setUser({ email: 'user@authenticated.com' })
      api.defaults.headers.Authorization = `Bearer ${token}`
    }

    setLoading(false)
  }, [])

  async function signIn(credentials: LoginCredentials) {
    const { token } = await authService.login(credentials)

    setCookie(undefined, TOKEN_COOKIE_NAME, token, {
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })

    api.defaults.headers.Authorization = `Bearer ${token}`
    setUser({ email: credentials.email })
    router.push('/')
  }

  async function signUp(credentials: RegisterCredentials) {
    await authService.register(credentials)
    router.push('/login')
  }

  function signOut() {
    destroyCookie(undefined, TOKEN_COOKIE_NAME, { path: '/' })
    setUser(null)
    delete api.defaults.headers.Authorization
    router.push('/login')
  }

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, signIn, signUp, signOut, loading }}
    >
      {children}
    </AuthContext.Provider>
  )
}
