import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Udyam Assignment Form',
  description: 'Dynamic form renderer with validation and admin dashboard',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}