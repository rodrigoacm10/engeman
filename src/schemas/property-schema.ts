import { z } from 'zod'

export const propertySchema = z.object({
  name: z
    .string()
    .min(10, 'Nome deve ter pelo menos 10 caracteres')
    .max(100, 'Máximo de 100 caracteres'),
  description: z.string().min(5, 'A descrição é obrigatória'),
  type: z.enum(['CASA', 'TERRENO', 'APARTAMENTO']),
  value: z.coerce.number().min(0, 'O valor não pode ser negativo'),
  area: z.coerce.number().min(0, 'A área não pode ser negativa'),
  bedrooms: z.coerce.number().min(0, 'Número de quartos não pode ser negativo'),
  address: z.string().min(5, 'O endereço é obrigatório'),
  city: z.string().min(2, 'A cidade é obrigatória'),
  state: z.string().length(2, 'O estado deve ter 2 letras (ex: SP)'),
  imageUrls: z
    .string()
    .url('A URL da imagem deve ser válida')
    .min(1, 'A imagem é obrigatória'),
})

export type PropertyFormValues = z.infer<typeof propertySchema>
