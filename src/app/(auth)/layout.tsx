import { GalleryVerticalEnd } from 'lucide-react'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a
            href="/"
            className="flex items-center gap-2 font-medium text-[#ff4e00]"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-[#ff4e00] text-white">
              <GalleryVerticalEnd className="size-6" />
            </div>
            <p className="font-bold">Engimob</p>
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-lg">{children}</div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <img
          src="/img-background.png"
          alt="Abstract Background"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.3] dark:grayscale"
        />
        <div className="absolute inset-0 bg-linear-to-t from-[#5e5f5d] to-transparent p-10 flex flex-col justify-end">
          <div className="space-y-2">
            <p className="text-lg font-medium text-white">
              "A melhor plataforma para gerenciar e trocar seus cards
              colecionáveis com segurança e praticidade."
            </p>
            <p className="text-sm text-[#ff4e00]">Equipe Engimob</p>
          </div>
        </div>
      </div>
    </div>
  )
}
