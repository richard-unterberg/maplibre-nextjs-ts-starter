import { useCallback, useMemo } from 'react'

import useCategories from '@/hooks/useCategories'
import usePlaces from '@/hooks/usePlaces'
import { Place } from '@/lib/types/entityTypes'
import useMapActions from '@/map/useMapActions'
import useMapContext from '@/map/useMapContext'
import CategoryMarkerCluster from '@/src/map/Markers/CategoryMarkerCluster'
import useMapStore from '@/zustand/useMapStore'

const MarkersContainer = () => {
  const { placesGroupedByCategory } = usePlaces()
  const { map } = useMapContext()
  const markerPopup = useMapStore(state => state.markerPopup)
  const setMarkerPopup = useMapStore(state => state.setMarkerPopup)
  const clusterRadius = useMapStore(state => state.clusterRadius)

  const { getPlaceById } = usePlaces()
  const { handleMapMove } = useMapActions()
  const { getCategoryById } = useCategories()

  const mapBounds = useMemo(() => (map ? map.getMap().getBounds().toArray().flat() : []), [map])

  const handleMarkerClick = useCallback(
    (id: Place['id']) => {
      const place = getPlaceById(id)
      if (!place || !map || id === markerPopup) return

      setMarkerPopup(id)

      handleMapMove({
        latitude: place.latitude,
        longitude: place.longitude,
        zoom: map.getZoom(),
        offset: [0, -30],
        mouseUpOnceCallback: () => {
          setMarkerPopup(undefined)
        },
      })
    },
    [getPlaceById, handleMapMove, map, markerPopup, setMarkerPopup],
  )

  return (
    placesGroupedByCategory &&
    Object.entries(placesGroupedByCategory).map(catGroup => {
      const [category, places] = catGroup

      return (
        <CategoryMarkerCluster
          handleMapMove={handleMapMove}
          handleMarkerClick={handleMarkerClick}
          key={category}
          mapBounds={mapBounds}
          map={map}
          places={places}
          clusterRadius={clusterRadius}
          category={getCategoryById(parseFloat(category))}
        />
      )
    })
  )
}

export default MarkersContainer
