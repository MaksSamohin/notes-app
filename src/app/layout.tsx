'use client'
import { Roboto_Mono } from 'next/font/google'
import './globals.css'
const roboto_mono = Roboto_Mono({
  subsets: ['latin'],
  display: 'swap',
})
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={roboto_mono.className}>{children}</body>
    </html>
  )
}
