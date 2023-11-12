import type { AppProps } from 'next/app'
import { Catamaran } from 'next/font/google'

// custom version of 'maplibre-gl/dist/maplibre-gl.css'
import '@/map/maplibre-custom.css'
import '@/theme/globals.css'

const catamaran = Catamaran({
  weight: ['400', '700', '900'],
  subsets: ['latin'],
  variable: '--font-catamaran',
})

const App = ({ Component, pageProps }: AppProps) => (
  <main className={`${catamaran.variable} font-sans text-dark`}>
    <Component {...pageProps} />
  </main>
)

export default App
