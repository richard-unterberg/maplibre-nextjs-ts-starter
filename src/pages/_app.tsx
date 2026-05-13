import type { AppProps } from 'next/app'

// custom version of 'maplibre-gl/dist/maplibre-gl.css'
import '@/map/maplibre-custom.css'
import '@/theme/globals.css'

const App = ({ Component, pageProps }: AppProps) => (
  <main className="font-sans text-dark">
    <Component {...pageProps} />
  </main>
)

export default App
