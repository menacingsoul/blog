import './globals.css'
import type { Metadata } from 'next'
import {Poppins } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'


const inter = Poppins({
  weight: '300',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Blog Files',
  description: 'A web journal app for your daily writing needs',
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
