import { api } from '@/lib/api'
import { PaginatedResponse, Property, PropertyFilters } from '@/types/property'

export const propertyService = {
  async getProperties(
    filters?: PropertyFilters,
  ): Promise<PaginatedResponse<Property>> {
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
    return response.data
  },
}
