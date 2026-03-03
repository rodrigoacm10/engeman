export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  name: string
  email: string
  password: string
}

export interface AuthResponse {
  token: string
}

export type UserRole = 'USER' | 'ADMIN'

export interface User {
  id: number
  name: string
  email: string
  role: UserRole
}

export interface UserUpdateDTO {
  name?: string
  password?: string
}
