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
          src="https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=2574&auto=format&fit=crop"
          alt="Abstract Background"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.3] dark:grayscale"
        />
        <div className="absolute inset-0 bg-linear-to-t from-background/80 to-transparent p-10 flex flex-col justify-end">
          <blockquote className="space-y-2">
            <p className="text-lg font-medium text-white">
              "A melhor plataforma para gerenciar e trocar seus cards
              colecionáveis com segurança e praticidade."
            </p>
            <footer className="text-sm text-white/80">Equipe Cardplace</footer>
          </blockquote>
        </div>
      </div>
    </div>
  )
}
