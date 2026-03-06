import axios from 'axios'
import { parseCookies } from 'nookies'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL
export const TOKEN_COOKIE_NAME = 'engeman_auth_token'

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const cookies = parseCookies()
  const token = cookies[TOKEN_COOKIE_NAME]

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
