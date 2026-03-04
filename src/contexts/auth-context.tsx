'use client'

import React, { createContext, ReactNode, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { destroyCookie, setCookie, parseCookies } from 'nookies'
import {
  LoginCredentials,
  RegisterCredentials,
  User,
  UserUpdateDTO,
} from '@/types/auth'
import { authService } from '@/services/authService'
import { userService } from '@/services/userService'
import { api } from '@/lib/api'
import { useQuery, useQueryClient } from '@tanstack/react-query'

interface AuthContextType {
  isAuthenticated: boolean
  user: User | null | undefined
  signIn: (credentials: LoginCredentials) => Promise<void>
  signUp: (credentials: RegisterCredentials) => Promise<void>
  signOut: () => void
  updateProfile: (data: UserUpdateDTO) => Promise<void>
  loading: boolean
}

export const AuthContext = createContext({} as AuthContextType)

export const TOKEN_COOKIE_NAME = 'engeman_auth_token'

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const queryClient = useQueryClient()

  // Initialize axios header if token exists
  useEffect(() => {
    const { [TOKEN_COOKIE_NAME]: token } = parseCookies()
    if (token) {
      api.defaults.headers.Authorization = `Bearer ${token}`
    }
  }, [])

  const { [TOKEN_COOKIE_NAME]: token } = parseCookies()

  const {
    data: user,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const { [TOKEN_COOKIE_NAME]: currentToken } = parseCookies()
      if (!currentToken) throw new Error('No token')
      api.defaults.headers.Authorization = `Bearer ${currentToken}`
      return await userService.getMe()
    },
    enabled: !!token,
    retry: false,
  })

  // Handle auto logout on error (invalid token)
  useEffect(() => {
    if (isError) {
      signOut()
    }
  }, [isError])

  const isAuthenticated = !!user || !!token
  const loading = !!token && isLoading

  async function signIn(credentials: LoginCredentials) {
    const { token } = await authService.login(credentials)

    setCookie(undefined, TOKEN_COOKIE_NAME, token, {
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })

    api.defaults.headers.Authorization = `Bearer ${token}`
    await queryClient.invalidateQueries({ queryKey: ['user'] })
    router.push('/')
  }

  async function signUp(credentials: RegisterCredentials) {
    await authService.register(credentials)
    router.push('/login')
  }

  async function updateProfile(data: UserUpdateDTO) {
    await userService.updateProfile(data)
    await queryClient.invalidateQueries({ queryKey: ['user'] })
  }

  function signOut() {
    destroyCookie(undefined, TOKEN_COOKIE_NAME, { path: '/' })
    delete api.defaults.headers.Authorization
    queryClient.removeQueries({ queryKey: ['user'] })
    router.push('/login')
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        signIn,
        signUp,
        signOut,
        updateProfile,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
