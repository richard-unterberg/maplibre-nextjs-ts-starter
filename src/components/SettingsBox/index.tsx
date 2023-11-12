import { ChangeEvent, useCallback, useEffect, useMemo } from 'react'
import tw from 'tailwind-styled-components'

import CategoryColorBg from '@/components/CategoryColorBg'
import usePlaces from '@/hooks/usePlaces'
import { AppConfig } from '@/lib/AppConfig'
import useMapActions from '@/map/useMapActions'
import useMapStore from '@/zustand/useMapStore'
import useSettingsStore from '@/zustand/useSettingsStore'

const StyledSettingsBox = tw.div`
  absolute
  left-5
  top-5
  w-80
  p-3
`

const SettingsBox = () => {
  const selectedCategory = useMapStore(state => state.selectedCategory)
  const clusterRadius = useMapStore(state => state.clusterRadius)
  const markersCount = useSettingsStore(state => state.markersCount)
  const markerSize = useSettingsStore(state => state.markerSize)
  const setMarkerSize = useSettingsStore(state => state.setMarkerSize)
  const setClusterRadius = useMapStore(state => state.setClusterRadius)
  const markerJSXRendering = useSettingsStore(state => state.markerJSXRendering)
  const setMarkerJSXRendering = useSettingsStore(state => state.setMarkerJSXRendering)
  const setMarkersCount = useSettingsStore(state => state.setMarkersCount)

  const { rawPlaces, getCatPlaces, allPlacesBounds } = usePlaces()
  const { handleMapMove } = useMapActions()

  const currentMaxCounting = useMemo(
    () => (!selectedCategory ? rawPlaces.length : getCatPlaces(selectedCategory.id).length),
    [getCatPlaces, rawPlaces.length, selectedCategory],
  )

  const handleLegacyJSXRendering = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (!allPlacesBounds) return
      if (!e.target.checked) {
        setMarkerJSXRendering(false)
        return
      }
      handleMapMove({
        latitude: allPlacesBounds.latitude,
        longitude: allPlacesBounds.longitude,
        zoom: allPlacesBounds.zoom,
        duration: 300,
        fly: false,
        moveEndOnceCallback: () => setMarkerJSXRendering(true),
      })
    },
    [allPlacesBounds, handleMapMove, setMarkerJSXRendering],
  )

  useEffect(() => {
    if (markersCount > currentMaxCounting) {
      setMarkersCount(currentMaxCounting)
    }
  }, [currentMaxCounting, markersCount, setMarkersCount])

  return (
    <StyledSettingsBox style={{ marginTop: AppConfig.ui.barHeight }}>
      <CategoryColorBg className="z-10" />
      <div className={`z-20 relative ${selectedCategory ? 'text-white' : 'text-dark'}`}>
        <p className="text-lg">
          <span className="font-bold">Marker Data: </span>
          {markersCount} / {currentMaxCounting} items
        </p>
        <input
          type="range"
          min={5}
          onChange={e => setMarkersCount(parseFloat(e.target.value))}
          max={currentMaxCounting}
          value={markersCount}
          step={1}
          className="w-full"
        />
        <p className="text-lg">
          <span className="font-bold">Marker Size: </span>
          {`${markerSize}px`}
        </p>
        <input
          type="range"
          min={AppConfig.ui.mapIconSizeSmall}
          onChange={e => {
            // todo: outsource this to own handler
            const newMarkerSize = parseFloat(e.target.value)
            setMarkerSize(newMarkerSize)

            // Set clusterRadius to the new marker size only if it's smaller than the current clusterRadius
            if (newMarkerSize > clusterRadius) {
              setClusterRadius(newMarkerSize)
            }
          }}
          max={AppConfig.ui.mapIconSizeBig}
          value={markerSize}
          step={1}
          className="w-full"
        />
        <p className="text-lg">
          <span className="font-bold">Cluster Radius: </span>
          {`${clusterRadius}px`}
        </p>
        <input
          type="range"
          min={markerSize}
          onChange={e => {
            setClusterRadius(parseFloat(e.target.value))
          }}
          max={200}
          value={clusterRadius}
          step={1}
          className="w-full"
        />
        <p className="text-lg">
          <span className="font-bold">
            Marker Renderering: {markerJSXRendering ? 'JSX ⚠️' : 'Web GL'}
          </span>
        </p>
        <label className="flex gap-3 items-start" htmlFor="markerJSXRendering">
          <input
            className="mt-1"
            id="markerJSXRendering"
            type="checkbox"
            checked={markerJSXRendering}
            onChange={e => handleLegacyJSXRendering(e)}
          />
          <span>
            <b>Enable.</b> - Experimental - If enabled, markers and clusters are rendered in react.
            Performance may vary depending on your device. If you experience performance issues,
            higher cluster radius and lower marker count.
          </span>
        </label>
      </div>
    </StyledSettingsBox>
  )
}

export default SettingsBox
