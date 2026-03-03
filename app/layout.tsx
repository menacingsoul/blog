import './globals.css'
import type { Metadata } from 'next'
import React from 'react'
import { Poppins } from 'next/font/google'
import { Analytics } from "@vercel/analytics/react"
import { ThemeProvider } from '@/components/theme-provider'
import AuthProvider from '@/components/AuthProvider'
import { LoadingProvider } from '@/components/LoadingProvider'

const poppins = Poppins({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'BlogVerse — Where Ideas Find Their Voice',
  description: 'Join BlogVerse and become part of a thriving community of writers, thinkers, and creators. Share your perspective and connect with readers worldwide.',
  keywords: ['blog', 'writing', 'community', 'articles', 'blogging platform'],
  openGraph: {
    title: 'BlogVerse',
    description: 'A web blogging platform for everyone',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={poppins.className}>
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <LoadingProvider>
              {children}
            </LoadingProvider>
            <Analytics />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
