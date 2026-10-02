import type { Metadata } from 'next'
import { Figtree } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const figtree = Figtree({ subsets: ["latin"], variable: "--font-figtree" });

export const metadata: Metadata = {
  title: 'MStar',
  description: 'Financiamiento automotriz. MStar impulsa tu camino.',
  applicationName: 'MStar',
  icons: {
    icon: '/mstar-logo-clear.png',
    apple: '/mstar-logo-clear.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={figtree.variable} suppressHydrationWarning>
      <body className={`${figtree.className} antialiased`} suppressHydrationWarning>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
