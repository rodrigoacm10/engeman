import { api } from '@/lib/api'
import { User, UserUpdateDTO } from '@/types/auth'

export const userService = {
  async getMe(): Promise<User> {
    const response = await api.get<User>('/api/user')
    return response.data
  },

  async updateProfile(data: UserUpdateDTO): Promise<User> {
    const response = await api.put<User>('/api/user/update', data)
    return response.data
  },
}
