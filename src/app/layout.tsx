import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Engimob',
  description:
    'Plataforma de anúncios imobiliários para o desafio técnico Engeman.',
  icons: {
    icon: '/building.svg',
  },
}

import { AuthProvider } from '@/contexts/auth-context'
import { LayoutWrapper } from '@/components/layout-wrapper'
import { QueryProvider } from '@/providers/query-provider'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryProvider>
          <AuthProvider>
            <LayoutWrapper>{children}</LayoutWrapper>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
