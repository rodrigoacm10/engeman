export type PropertyType = 'RESIDENCIAL' | 'COMERCIAL' | 'INDUSTRIAL' | 'RURAL'

export interface Property {
  id: number
  name: string
  description: string
  type: PropertyType
  value: number
  area: number
  bedrooms: number
  address: string
  city: string
  state: string
  active: boolean
  brokerId: number
  brokerName: string
  imageUrls: string
}

export interface PropertyFilters {
  name?: string
  type?: PropertyType | ''
  minPrice?: number
  maxPrice?: number
  minBedrooms?: number
  page?: number
  size?: number
  sort?: string
}

export interface PaginatedResponse<T> {
  content: T[]
  pageable: any
  totalElements: number
  totalPages: number
  size: number
  number: number
}
