import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { PropertyForm } from '@/components/property-form'
import { Property } from '@/types/property'

interface PropertyDialogProps {
  trigger?: React.ReactNode
  open: boolean
  onOpenChange: (open: boolean) => void
  initialData: Property | null
  onSuccess: () => void
  onCancel: () => void
}

export function PropertyDialog({
  trigger,
  open,
  onOpenChange,
  initialData,
  onSuccess,
  onCancel,
}: PropertyDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent
        className="max-w-3xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <DialogHeader>
          <DialogTitle>
            {initialData ? 'Editar Imóvel' : 'Cadastrar Novo Imóvel'}
          </DialogTitle>
          <DialogDescription>
            Preencha os dados do imóvel abaixo. As informações serão publicadas
            imediatamente.
          </DialogDescription>
        </DialogHeader>
        <PropertyForm
          initialData={initialData}
          onSuccess={onSuccess}
          onCancel={onCancel}
        />
      </DialogContent>
    </Dialog>
  )
}
