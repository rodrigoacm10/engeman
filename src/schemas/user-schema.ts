import { z } from 'zod'

export const createUserSchema = z.object({
  name: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres').max(100),
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
  role: z.enum(['ADMIN', 'CORRETOR', 'CLIENTE'] as const),
})

export type CreateUserFormValues = z.infer<typeof createUserSchema>
