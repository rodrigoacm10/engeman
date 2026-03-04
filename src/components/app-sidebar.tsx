'use client'

import { useState, useEffect } from 'react'

import { Home, User, Building, Heart, LogOut, ChevronUp } from 'lucide-react'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from '@/components/ui/sidebar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuth } from '@/hooks/use-auth'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  {
    title: 'Início',
    url: '/',
    icon: Home,
  },
  {
    title: 'Meu Perfil',
    url: '/me',
    icon: User,
  },
  {
    title: 'Meus Imóveis',
    url: '/properties',
    icon: Building,
    protected: true,
    roles: ['ADMIN', 'CORRETOR'],
  },
  {
    title: 'Favoritos',
    url: '/favorites',
    icon: Heart,
    protected: true,
  },
]

export function AppSidebar() {
  const { user, signOut, isAuthenticated, loading } = useAuth()
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    // collapsible="icon"
    <Sidebar className="border-r border-[#ff4e00]/10">
      <SidebarHeader className="p-4">
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-[#ff4e00] text-xl"
        >
          <div className="w-8 h-8 rounded bg-[#ff4e00] flex items-center justify-center text-white">
            <Building size={20} />
          </div>
          <span className="group-data-[collapsible=icon]:hidden">Engimob</span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-[#ff4e00]/60 font-semibold uppercase text-[10px]">
            Navegação
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive = pathname === item.url

                if (!mounted) {
                  if (item.protected) return null
                } else {
                  if (item.protected && !isAuthenticated) return null
                  if (item.roles && loading) return null
                  if (item.roles && user && !item.roles.includes(user.role))
                    return null
                }

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.title}
                      className={`hover:bg-[#ff4e00]/5 transition-colors ${isActive ? 'text-[#ff4e00] bg-[#ff4e00]/10' : 'text-gray-600'}`}
                    >
                      <Link href={item.url}>
                        <item.icon
                          className={isActive ? 'text-[#ff4e00]' : ''}
                        />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-2 border-t border-[#ff4e00]/5">
        <SidebarMenu>
          <SidebarMenuItem>
            {!mounted ? (
              <SidebarMenuButton
                disabled
                className="text-gray-400 hover:bg-transparent cursor-default"
              >
                <User />
                <span>Carregando...</span>
              </SidebarMenuButton>
            ) : isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton className="h-12 hover:bg-[#ff4e00]/5">
                    <div className="w-8 h-8 rounded-full bg-[#ff4e00] flex items-center justify-center text-white font-bold text-xs">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex flex-col items-start text-xs overflow-hidden group-data-[collapsible=icon]:hidden">
                      <span className="font-bold truncate w-full">
                        {user.name}
                      </span>
                      <span className="text-gray-400 truncate w-full">
                        {user.email}
                      </span>
                    </div>
                    <ChevronUp
                      className="ml-auto group-data-[collapsible=icon]:hidden"
                      size={14}
                    />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  side="top"
                  className="w-[--radix-dropdown-menu-trigger-width] min-w-56"
                >
                  <DropdownMenuItem asChild>
                    <Link href="/me" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      Meu Perfil
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={signOut}
                    className="text-red-500 cursor-pointer"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <SidebarMenuButton
                asChild
                className="text-[#ff4e00] hover:bg-[#ff4e00]/5"
              >
                <Link href="/login">
                  <User />
                  <span>Fazer Login</span>
                </Link>
              </SidebarMenuButton>
            )}
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
