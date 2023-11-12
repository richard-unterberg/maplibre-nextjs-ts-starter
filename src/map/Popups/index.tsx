import { useCallback } from 'react'

import usePlaces from '@/hooks/usePlaces'
import PopupItem from '@/src/map/Popups/PopupItem'
import useMapActions from '@/src/map/useMapActions'
import useMapStore from '@/zustand/useMapStore'

const PopupsContainer = () => {
  const markerPopup = useMapStore(state => state.markerPopup)
  const setMarkerPopup = useMapStore(state => state.setMarkerPopup)
  const { markerData } = usePlaces()
  const { currentBounds } = usePlaces()
  const { handleMapMove } = useMapActions()

  const handleBackToCluster = useCallback(() => {
    setMarkerPopup(undefined)

    if (!currentBounds) return

    handleMapMove({
      latitude: currentBounds.latitude,
      longitude: currentBounds.longitude,
      zoom: currentBounds.zoom,
      fly: false,
      mouseUpOnceCallback: () => setMarkerPopup(undefined),
    })
  }, [currentBounds, handleMapMove, setMarkerPopup])

  return (
    <>
      {markerPopup && <div className="bg-dark opacity-30 absolute inset-0 pointer-events-none" />}
      {markerData.map(place =>
        place.id === markerPopup ? (
          <PopupItem key={place.id} handleBackToCluster={handleBackToCluster} place={place} />
        ) : null,
      )}
    </>
  )
}

export default PopupsContainer
