import './globals.css'
import { Providers } from './providers'
import AuthGate from '@/components/AuthGate'
export const metadata = { title: 'Namma Kannada', description: 'Different regions. Same heart. One Kannada.', appleWebApp: { capable: true, title: 'Namma Kannada', statusBarStyle: 'black-translucent' }, icons: { apple: '/icons/icon-192.png' } }
export const viewport = { width: 'device-width', initialScale: 1, viewportFit: 'cover', themeColor: '#8e1015' }
export default function RootLayout({ children }: { children: React.ReactNode }) {
 return (
  <html lang="en" suppressHydrationWarning>
   <body><Providers><AuthGate>{children}</AuthGate></Providers></body>
  </html>
 )
}
