import { api } from '@/lib/api'
import {
  PaginatedResponse,
  Property,
  PropertyFilters,
  PropertyCreateDTO,
  PropertyUpdateDTO,
} from '@/types/property'

export const propertyService = {
  async getProperties(
    filters?: PropertyFilters,
  ): Promise<PaginatedResponse<Property>> {
    // Remove undefined ou chaves vazias para não sujar a URL
    const params: Record<string, string | number> = {}
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          params[key] = value
        }
      })
    }

    const response = await api.get<PaginatedResponse<Property>>(
      '/api/property',
      {
        params,
      },
    )

    console.log('[GET] /api/property', response.data)
    return response.data
  },

  async getUserProperties(): Promise<Property[]> {
    const response = await api.get<Property[]>(
      '/api/property/getUserProperties',
    )
    console.log('[GET] /api/property/getUserProperties', response.data)
    return response.data
  },

  async getPropertyById(id: number): Promise<Property> {
    const response = await api.get<Property>(`/api/property/${id}`)
    console.log(`[GET] /api/property/${id}`, response.data)
    return response.data
  },

  async createProperty(data: PropertyCreateDTO): Promise<Property> {
    console.log('DATA -> [POST] /api/property', data)
    const response = await api.post<Property>('/api/property', data)
    console.log('RESPONSE -> [POST] /api/property', response.data)
    return response.data
  },

  async updateProperty(id: number, data: PropertyUpdateDTO): Promise<Property> {
    const response = await api.put<Property>(`/api/property/${id}`, data)
    console.log('[PUT] /api/property', response.data)
    return response.data
  },

  async deleteProperty(id: number): Promise<void> {
    await api.delete(`/api/property/${id}`)
    console.log('[DELETE] /api/property', id)
  },

  async togglePropertyStatus(id: number): Promise<Property> {
    const response = await api.patch<Property>(`/api/property/status/${id}`)
    console.log('[PATCH] /api/property/status', response.data)
    return response.data
  },

  async uploadImage(file: File): Promise<string> {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET

    if (!cloudName || !uploadPreset) {
      throw new Error(
        'Configurações do Cloudinary não encontradas no ambiente.',
      )
    }

    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', uploadPreset)

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData,
      },
    )

    if (!response.ok) {
      throw new Error('Falha ao fazer upload da imagem.')
    }

    const data = await response.json()
    return data.secure_url
  },
}
