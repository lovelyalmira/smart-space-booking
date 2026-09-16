import './globals.css'
import { Providers } from './providers'
import { Toaster } from '@/components/ui/sonner'

export const metadata = {
  title: 'Smart Space Booking — Coworking Reservation',
  description: 'Reservasi coworking space & workstation secara online. Smart Space Booking.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <head>
        <script dangerouslySetInnerHTML={{__html:'window.addEventListener("error",function(e){if(e.error instanceof DOMException&&e.error.name==="DataCloneError"&&e.message&&e.message.includes("PerformanceServerTiming")){e.stopImmediatePropagation();e.preventDefault()}},true);'}} />
      </head>
      <body>
        <Providers>{children}</Providers>
        <Toaster position="top-right" richColors closeButton />
      </body>
    </html>
  )
}