import './globals.css'
import type { Metadata } from 'next'
import React from 'react'
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
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5673721717655381"
     crossorigin="anonymous"></script>
      <body className={inter.className}>{children}</body>
    </html>
  </ClerkProvider>
  )
}
