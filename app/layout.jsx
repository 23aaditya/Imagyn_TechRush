import { Analytics } from '@vercel/analytics/next'
import { Plus_Jakarta_Sans, Inter } from 'next/font/google'
import 'maplibre-gl/dist/maplibre-gl.css'
import './globals.css'

const fontHeading = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
})

const fontSans = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

export const metadata = {
  title: 'TripNest — Smart Travel Itinerary Planner & Night Atlas',
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
    { media: '(prefers-color-scheme: dark)', color: '#11100E' },
  ],
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${fontHeading.variable} ${fontSans.variable} bg-background`} suppressHydrationWarning>
      <body className="font-sans antialiased" suppressHydrationWarning>
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
