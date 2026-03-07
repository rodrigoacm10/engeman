'use client'

import { SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import { usePathname } from 'next/navigation'
import { Building } from 'lucide-react'

const routeTitles: Record<string, string> = {
  '/': 'Início',
  '/me': 'Meu Perfil',
  '/properties': 'Meus Imóveis',
  '/favorites': 'Favoritos',
  '/login': 'Entrar',
  '/register': 'Criar Conta',
}

export function AppHeader() {
  const pathname = usePathname()

  const getPageTitle = (path: string) => {
    if (routeTitles[path]) return routeTitles[path]
    if (path.split('/').length === 2 && path !== '/')
      return 'Detalhes do Imóvel'
    return 'Engimob'
  }

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 bg-white sticky top-0 z-10">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1 text-[#ff4e00]" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <div className="flex items-center gap-2 md:hidden">
          <Building className="text-[#ff4e00]" size={20} />
          <span className="font-bold text-[#ff4e00]">Engimob</span>
          <Separator orientation="vertical" className="mx-2 h-4" />
        </div>
        <h1 className="text-sm font-semibold text-gray-700 tracking-tight">
          {getPageTitle(pathname)}
        </h1>
      </div>
    </header>
  )
}
