import dynamic from 'next/dynamic'
import Head from 'next/head'

// import MapContainer from '@/map/MapContainer'

const MapContainer = dynamic(() => import('@/src/map/MapContainer'), { ssr: false })

const HomePage = () => (
  <div className="absolute overflow-hidden inset-0 bg-mapBg">
    <Head>
      <title>Map</title>
    </Head>
    <MapContainer />
  </div>
)

export default HomePage
