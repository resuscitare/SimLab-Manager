import '@/index.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'SimLab Manager',
  description: 'Sistema de gerenciamento do SimLab',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}
