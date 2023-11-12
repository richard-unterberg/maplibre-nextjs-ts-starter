import { useCallback } from 'react'
import { MapRef } from 'react-map-gl'

import { AppConfig } from '@/lib/AppConfig'
import useMapContext from '@/src/map/useMapContext'
import useMapStore from '@/zustand/useMapStore'

export interface handleMapMoveProps {
  longitude: number
  latitude: number
  zoom: number
  duration?: number
  offset?: [number, number]
  fly?: boolean
  moveEndOnceCallback?: () => void
  mouseUpOnceCallback?: () => void
}

interface mapMoveData extends handleMapMoveProps {
  map: MapRef
  endAnimationCallback: () => void
}

const mapMove = ({
  map,
  latitude,
  longitude,
  zoom,
  duration = AppConfig.animationDuration,
  offset = [0, 0],
  fly = true,
  moveEndOnceCallback,
  mouseUpOnceCallback,
  endAnimationCallback,
}: mapMoveData) => {
  if (fly) {
    map.flyTo({
      center: [longitude, latitude],
      zoom,
      duration,
      offset,
    })
  } else {
    map.easeTo({
      center: [longitude, latitude],
      zoom,
      duration,
      offset,
    })
  }
  map.once('moveend', () => {
    if (moveEndOnceCallback) {
      moveEndOnceCallback()
    }
    endAnimationCallback()
  })
  if (mouseUpOnceCallback) {
    map.once('mouseup', mouseUpOnceCallback)
  }
}

const useMapActions = () => {
  const { map } = useMapContext()
  const setIsAnimating = useMapStore(state => state.setIsAnimating)

  const handleMapMove = useCallback(
    ({
      latitude,
      longitude,
      zoom,
      duration,
      fly,
      moveEndOnceCallback,
      mouseUpOnceCallback,
    }: handleMapMoveProps) => {
      if (map) {
        setIsAnimating(true)
        mapMove({
          map,
          latitude,
          longitude,
          zoom,
          duration,
          fly,
          moveEndOnceCallback,
          mouseUpOnceCallback,
          endAnimationCallback: () => setIsAnimating(false),
        })
      }
    },
    [map, setIsAnimating],
  )

  // useEffect(() => {
  //   const handleZoom = () => {
  //     if (!map) return

  //     setIsZoomOut(true)

  //     if (timerRef.current) {
  //       clearTimeout(timerRef.current)
  //     }
  //     const newTimer = setTimeout(() => {
  //       setIsZoomOut(false)
  //     }, 50)
  //     timerRef.current = newTimer
  //   }

  //   if (map) {
  //     map.on('move', handleZoom)
  //   }
  //   return () => {
  //     if (map) {
  //       map.off('move', handleZoom)
  //     }
  //     if (timerRef.current) {
  //       clearTimeout(timerRef.current)
  //     }
  //   }
  // }, [map, setIsZoomOut])

  return { handleMapMove }
}

export default useMapActions
