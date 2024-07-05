import './globals.css'
import type { Metadata } from 'next'
import {Poppins } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'


const inter = Poppins({
  weight: '300',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Blog Verse',
  description: 'A web blogging app for everyone',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  </ClerkProvider>
  )
}
