import { api } from '@/lib/api'
import { User, UserUpdateDTO, UserCreateDTO } from '@/types/auth'
import { Property } from '@/types/property'

export const userService = {
  async getMe(): Promise<User> {
    const response = await api.get<User>('/api/user')
    return response.data
  },

  async updateProfile(data: UserUpdateDTO): Promise<User> {
    const response = await api.put<User>('/api/user/update', data)
    return response.data
  },

  async createUser(data: UserCreateDTO): Promise<User> {
    const response = await api.post<User>('/api/user/create', data)
    return response.data
  },

  async getFavorites(): Promise<Property[]> {
    const response = await api.get<Property[]>('/api/user/favorites')
    return response.data
  },

  async addFavorite(propertyId: number): Promise<void> {
    await api.post(`/api/user/favorites/${propertyId}`)
  },

  async removeFavorite(propertyId: number): Promise<void> {
    await api.delete(`/api/user/favorites/${propertyId}`)
  },
}
