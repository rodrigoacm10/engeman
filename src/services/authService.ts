import { api } from '@/lib/api'
import {
  LoginCredentials,
  RegisterCredentials,
  AuthResponse,
} from '@/types/auth'

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>(
      '/api/auth/login',
      credentials,
    )
    return response.data
  },

  async register(credentials: RegisterCredentials): Promise<void> {
    await api.post('/api/auth/register', credentials)
  },
}
