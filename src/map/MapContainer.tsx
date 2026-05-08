import { throttle } from 'lodash'
import dynamic from 'next/dynamic'
import { useCallback, useMemo } from 'react'
import type { ErrorEvent, ViewState, ViewStateChangeEvent } from 'react-map-gl/maplibre'
import Map from 'react-map-gl/maplibre'

import SpaceBackground from '@/frontend/components/globe/SpaceBackground'
import useDetectScreen from '@/hooks/useDetectScreen'
import MapContextProvider from '@/src/map/MapContextProvider'
import MapControls from '@/src/map/MapControls'
import useMapContext from '@/src/map/useMapContext'
import useMapStore from '@/zustand/useMapStore'

/** error handle */
const onMapError = (evt: ErrorEvent) => {
  const { error } = evt
  throw new Error(`Map error: ${error.message}`)
}

// bundle splitting
const Popups = dynamic(() => import('@/src/map/Popups'))
const SettingsBox = dynamic(() => import('@/frontend/components/layout/SettingsBox'))
const TopBar = dynamic(() => import('@/frontend/components/layout/TopBar'))

const MapInner = () => {
  const setViewState = useMapStore(state => state.setViewState)
  const setThrottledViewState = useMapStore(state => state.setThrottledViewState)
  const isMapGlLoaded = useMapStore(state => state.isMapGlLoaded)
  const setIsMapGlLoaded = useMapStore(state => state.setIsMapGlLoaded)

  const { setMap } = useMapContext()
  const { viewportWidth, viewportHeight, viewportRef } = useDetectScreen()

  const throttledSetViewState = useMemo(
    () => throttle((state: ViewState) => setThrottledViewState(state), 50),
    [setThrottledViewState],
  )

  const forceGlobe = useCallback((e: any) => {
    const map = e.target

    requestAnimationFrame(() => {
      map.setProjection?.({ type: 'globe' })

      map.setFog?.({
        range: [-1, 2],
        color: 'rgba(0,0,0,0)',
        'high-color': '#020617',
        'space-color': 'rgba(0,0,0,0)',
        'horizon-blend': 0.08,
        'star-intensity': 0,
      })
    })
  }, [])

  const onLoad = useCallback(
    (e: any) => {
      forceGlobe(e)
      setIsMapGlLoaded(true)
    },
    [forceGlobe, setIsMapGlLoaded],
  )

  const onMapMove = useCallback(
    (evt: ViewStateChangeEvent) => {
      throttledSetViewState(evt.viewState)
      setViewState(evt.viewState)
    },
    [setViewState, throttledSetViewState],
  )

  return (
    <div className="absolute inset-0 overflow-hidden bg-black space-bg" ref={viewportRef}>
      <SpaceBackground />

      <div className="relative z-10 h-full w-full">
        <Map
          initialViewState={{
            longitude: 0,
            latitude: 20,
            zoom: 1.1,
            pitch: 0,
            bearing: 0,
          }}
          ref={e => setMap && setMap(e || undefined)}
          onError={e => onMapError(e)}
          onLoad={onLoad}
          onStyleData={forceGlobe}
          onMove={onMapMove}
          style={{ width: viewportWidth, height: viewportHeight }}
          mapStyle="https://tiles.openfreemap.org/styles/liberty"
          projection={{ type: 'globe' } as any}
          renderWorldCopies={false}
          dragRotate={true}
        >
          <Popups />
          <MapControls />
          <SettingsBox />
          <TopBar />
        </Map>
      </div>

      {!isMapGlLoaded && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-black text-white">
          Loading Map...
        </div>
      )}
    </div>
  )
}

// context pass through
const MapContainer = () => (
  <MapContextProvider>
    <MapInner />
  </MapContextProvider>
)

export default MapContainer
