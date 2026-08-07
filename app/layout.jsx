import { Analytics } from '@vercel/analytics/next'
import { Inter, Cascadia_Code } from 'next/font/google'
import 'maplibre-gl/dist/maplibre-gl.css'
import './globals.css'
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  fallback: ['system-ui', 'sans-serif'],
})

const cascadia = Cascadia_Code({
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
  fallback: ['Cascadia Code', 'Consolas', 'monospace'],
})

export const metadata = {
  title: 'TripNest — Smart Travel Itinerary Planner',
  description:
    'Plan your dream trip smarter, faster and stress-free. Discover destinations, compare travel packages, generate intelligent itineraries and calculate budgets with TripNest.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0f1729' },
  ],
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${cascadia.variable} bg-background`}>
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
