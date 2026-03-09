'use client'

import React, { createContext, ReactNode, useEffect, useState } from 'react'
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

  const [currentToken, setCurrentToken] = useState<string | null>(null)

  useEffect(() => {
    const { [TOKEN_COOKIE_NAME]: token } = parseCookies()
    if (token) {
      setCurrentToken(token)
    }
  }, [])

  useEffect(() => {
    if (currentToken) {
      api.defaults.headers.Authorization = `Bearer ${currentToken}`
    } else {
      delete api.defaults.headers.Authorization
    }
  }, [currentToken])

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
    enabled: !!currentToken,
    retry: false,
  })

  useEffect(() => {
    if (isError) {
      signOut()
    }
  }, [isError])

  const isAuthenticated = !!user || !!currentToken
  const loading = !!currentToken && isLoading

  async function signIn(credentials: LoginCredentials) {
    const { token } = await authService.login(credentials)

    setCookie(undefined, TOKEN_COOKIE_NAME, token, {
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })

    setCurrentToken(token)
    api.defaults.headers.Authorization = `Bearer ${token}`
    await queryClient.invalidateQueries({ queryKey: ['user'] })
    router.push('/list')
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
    setCurrentToken(null)
    delete api.defaults.headers.Authorization
    queryClient.removeQueries({ queryKey: ['user'] })
    window.location.href = '/login'
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
