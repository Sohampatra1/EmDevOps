import type { Metadata } from 'next'
import './globals.css'
import { ClientLayout } from '@/components/client-layout'

export const metadata: Metadata = {
  title: '🇩🇪 Embedded DevOps EU Accelerator',
  description: 'Crack Embedded Software, Embedded Linux, and Embedded DevOps interviews in the EU within 90 days',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="grid-bg">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  )
}
