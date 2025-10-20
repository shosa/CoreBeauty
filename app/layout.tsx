import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'CoreBeauty - Gestione Professionale',
  description: 'App professionale per la gestione di centri estetici',
  manifest: '/manifest.json',
  themeColor: '#e91e63',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    viewportFit: 'cover',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'CoreBeauty',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="it">
      <head>
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Icons"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
