import { Analytics } from '@vercel/analytics/next'
import 'maplibre-gl/dist/maplibre-gl.css'
import './globals.css'

const fontHeadingClass = "font-heading-var"
const fontSansClass = "font-sans-var"

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
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#11100E' },
  ],
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="bg-background" suppressHydrationWarning>
      <body className="font-sans antialiased" suppressHydrationWarning>
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
