'use client'

import React, { createContext, useState, useEffect, ReactNode } from 'react'
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

interface AuthContextType {
  isAuthenticated: boolean
  user: User | null
  signIn: (credentials: LoginCredentials) => Promise<void>
  signUp: (credentials: RegisterCredentials) => Promise<void>
  signOut: () => void
  updateProfile: (data: UserUpdateDTO) => Promise<void>
  loading: boolean
}

export const AuthContext = createContext({} as AuthContextType)

export const TOKEN_COOKIE_NAME = 'engeman_auth_token'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const { [TOKEN_COOKIE_NAME]: token } = parseCookies()
  const isAuthenticated = !!user || !!token

  useEffect(() => {
    async function loadUser() {
      const { [TOKEN_COOKIE_NAME]: token } = parseCookies()

      if (token) {
        try {
          api.defaults.headers.Authorization = `Bearer ${token}`
          const userData = await userService.getMe()
          setUser(userData)
        } catch (error) {
          console.error('Failed to fetch user data:', error)
          // Se o token for inválido, podemos deslogar
          signOut()
        }
      }

      setLoading(false)
    }

    loadUser()
  }, [])

  async function signIn(credentials: LoginCredentials) {
    const { token } = await authService.login(credentials)

    setCookie(undefined, TOKEN_COOKIE_NAME, token, {
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })

    api.defaults.headers.Authorization = `Bearer ${token}`
    const userData = await userService.getMe()
    setUser(userData)
    router.push('/')
  }

  async function signUp(credentials: RegisterCredentials) {
    await authService.register(credentials)
    router.push('/login')
  }

  async function updateProfile(data: UserUpdateDTO) {
    const updatedUser = await userService.updateProfile(data)
    setUser(updatedUser)
  }

  function signOut() {
    destroyCookie(undefined, TOKEN_COOKIE_NAME, { path: '/' })
    setUser(null)
    delete api.defaults.headers.Authorization
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
