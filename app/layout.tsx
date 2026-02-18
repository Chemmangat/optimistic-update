import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '@chemmangat/optimistic-update',
  description: 'Lightweight React hook for optimistic UI updates with automatic rollback',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
