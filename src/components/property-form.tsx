'use client'

import { useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Loader2, UploadCloud, Link as LinkIcon } from 'lucide-react'
import { isAxiosError } from 'axios'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Property } from '@/types/property'
import { propertyService } from '@/services/propertyService'
import { PropertyFormValues, propertySchema } from '@/schemas/property-schema'

interface PropertyFormProps {
  initialData?: Property | null
  onSuccess: () => void
  onCancel: () => void
}

export function PropertyForm({
  initialData,
  onSuccess,
  onCancel,
}: PropertyFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const form = useForm<PropertyFormValues>({
    resolver: zodResolver(propertySchema) as any,
    defaultValues: initialData
      ? {
          name: initialData.name,
          description: initialData.description,
          type: initialData.type,
          value: initialData.value,
          area: initialData.area,
          bedrooms: initialData.bedrooms,
          address: initialData.address,
          city: initialData.city,
          state: initialData.state,
          imageUrls: initialData.imageUrls,
        }
      : {
          name: '',
          description: '',
          type: 'CASA',
          value: 0,
          area: 0,
          bedrooms: 0,
          address: '',
          city: '',
          state: '',
          imageUrls: '',
        },
  })

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('Por favor, selecione apenas arquivos de imagem.')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('A imagem deve ter no máximo 5MB.')
      return
    }

    setIsUploading(true)
    try {
      const url = await propertyService.uploadImage(file)
      form.setValue('imageUrls', url, { shouldValidate: true })
      toast.success('Imagem enviada com sucesso!')
    } catch (error) {
      console.error('Upload falhou:', error)
      toast.error('Erro ao fazer upload da imagem.')
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const onSubmit = async (data: PropertyFormValues) => {
    setIsSubmitting(true)

    try {
      if (initialData) {
        await propertyService.updateProperty(initialData.id, data)
        toast.success('Imóvel atualizado com sucesso!')
      } else {
        await propertyService.createProperty(data)
        toast.success('Imóvel cadastrado com sucesso!')
      }
      onSuccess()
    } catch (error) {
      if (isAxiosError(error) && error.response) {
        toast.error(
          error.response.data?.message || 'Erro ao processar a requisição.',
        )
      } else {
        toast.error('Ocorreu um erro inesperado.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Título do Imóvel</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Apartamento no Centro" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="CASA">Casa</SelectItem>
                    <SelectItem value="TERRENO">Terreno</SelectItem>
                    <SelectItem value="APARTAMENTO">Apartamento</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="value"
            render={({ field: { value, onChange, ...restField } }) => {
              const displayValue = new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              }).format(value || 0)

              const handleCurrencyChange = (
                e: React.ChangeEvent<HTMLInputElement>,
              ) => {
                const rawValue = e.target.value.replace(/\D/g, '')
                const numericValue = Number(rawValue) / 100
                onChange(numericValue)
              }

              return (
                <FormItem>
                  <FormLabel>Valor (R$)</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="R$ 500.000,00"
                      value={displayValue}
                      onChange={handleCurrencyChange}
                      {...restField}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )
            }}
          />

          <FormField
            control={form.control}
            name="area"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Área (m²)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    placeholder="120"
                    onKeyDown={(e) => {
                      if (['-', '+', 'e', 'E'].includes(e.key)) {
                        e.preventDefault()
                      }
                    }}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="bedrooms"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quartos</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    placeholder="3"
                    onKeyDown={(e) => {
                      if (['-', '+', 'e', 'E'].includes(e.key)) {
                        e.preventDefault()
                      }
                    }}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cidade</FormLabel>
                <FormControl>
                  <Input placeholder="São Paulo" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Estado (UF)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="SP"
                    maxLength={2}
                    className="uppercase"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Endereço Completo</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Rua das Flores, 123 - Centro"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Descrição</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Descreva os diferenciais do imóvel..."
                    className="resize-none"
                    rows={4}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="md:col-span-2 space-y-4">
            <FormLabel>Imagem do Imóvel</FormLabel>

            <div className="flex flex-col sm:flex-row gap-4 items-start">
              <div className="flex-1 w-full">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  ref={fileInputRef}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  className="w-full flex justify-center items-center gap-2 h-10 border-dashed border-2 hover:bg-gray-50"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin text-[#ff4e00]" />{' '}
                      Enviando para Cloudinary...
                    </>
                  ) : (
                    <>
                      <UploadCloud className="h-4 w-4 text-gray-500" /> Escolher
                      e Enviar Arquivo
                    </>
                  )}
                </Button>
                <p className="text-xs text-gray-500 mt-1">
                  Máx 5MB. Envia diretamente para Cloudinary.
                </p>
              </div>

              <div className="flex-1 w-full">
                <FormField
                  control={form.control}
                  name="imageUrls"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="flex">
                          <div className="flex items-center justify-center p-2 bg-gray-100 border border-r-0 rounded-l-md text-gray-500">
                            <LinkIcon size={16} />
                          </div>
                          <Input
                            placeholder="Ou cole o link da imagem aqui..."
                            className="rounded-l-none"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {form.watch('imageUrls') && !form.formState.errors.imageUrls && (
              <div className="mt-2 w-full h-40 relative rounded-md overflow-hidden bg-gray-100 border flex items-center justify-center">
                <img
                  src={form.watch('imageUrls')}
                  alt="Preview do imóvel"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    ;(e.target as HTMLImageElement).src =
                      'https://via.placeholder.com/800x400?text=Erro+ao+carregar+imagem'
                  }}
                />
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button
            type="submit"
            className="bg-[#ff4e00] hover:bg-[#e64600]"
            disabled={isSubmitting || isUploading}
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {initialData ? 'Atualizar Imóvel' : 'Cadastrar Imóvel'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
