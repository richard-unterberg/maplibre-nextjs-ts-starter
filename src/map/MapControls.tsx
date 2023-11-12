import { FullscreenControl, GeolocateControl, NavigationControl, ScaleControl } from 'react-map-gl'

import useAppTheme from '@/hooks/useTheme'
import { AppConfig } from '@/lib/AppConfig'

const MapControls = () => {
  const { space } = useAppTheme()

  return (
    <>
      <NavigationControl
        position="top-right"
        style={{
          marginTop: `calc(${AppConfig.ui.barHeight}px + ${space(4)}`,
          marginRight: space(4),
        }}
      />
      <GeolocateControl position="top-right" style={{ marginRight: space(4) }} />
      <FullscreenControl position="top-right" style={{ marginRight: space(4) }} />
      <ScaleControl position="bottom-right" />
    </>
  )
}

export default MapControls
