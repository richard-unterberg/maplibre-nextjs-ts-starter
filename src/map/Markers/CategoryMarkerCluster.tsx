import { memo, useCallback, useMemo } from 'react'
import { MapRef } from 'react-map-gl'
import useSupercluster from 'use-supercluster'

import useAppTheme from '@/hooks/useTheme'
import { AppConfig } from '@/lib/AppConfig'
import { Bound, Category, Place } from '@/lib/types/entityTypes'
import Marker from '@/src/map/Markers/Marker'
import { handleMapMoveProps } from '@/src/map/useMapActions'
import useMapStore from '@/zustand/useMapStore'
import useSettingsStore from '@/zustand/useSettingsStore'

interface CategoryClusterProps {
  places: Place[]
  category?: Category
  mapBounds: number[]
  map?: MapRef
  clusterRadius: number
  handleMapMove: (props: handleMapMoveProps) => void
  handleMarkerClick: (id: Place['id']) => void
}

const MemoizedMarker = memo(Marker)

const CategoryMarkerCluster = ({
  places,
  category,
  mapBounds,
  map,
  clusterRadius,
  handleMapMove,
  handleMarkerClick,
}: CategoryClusterProps) => {
  const { color: themeColor } = useAppTheme()
  const throttledViewState = useMapStore(state => state.throttledViewState)
  const markerSize = useSettingsStore(state => state.markerSize)

  /**
   * array of Bound objects representing the places as GeoJSON points.
   * @type {Bound[]}
   */
  const points: Bound[] = useMemo(
    () =>
      places.map(place => ({
        type: 'Feature',
        properties: { cluster: false, id: place.id, category: place.category },
        geometry: {
          type: 'Point',
          coordinates: [place.longitude, place.latitude],
        },
      })),
    [places],
  )

  /**
   * Calculates and returns clusters and supercluster using the given points, map bounds, and cluster radius.
   * @returns An object containing clusters and supercluster.
   */
  const { clusters, supercluster } = useSupercluster({
    points,
    bounds: mapBounds as [number, number, number, number],
    zoom: throttledViewState ? throttledViewState.zoom : 12,
    options: {
      radius: clusterRadius * 2,
      maxZoom: 16,
    },
  })

  /**
   * filtered clusters based on the current map view.
   * @returns {Bound[]}
   */
  const displayedItems = useMemo(() => {
    const { deadzone } = AppConfig.map
    if (!throttledViewState?.longitude) {
      return []
    }

    const mapElement = map && map.getMap().getContainer()
    if (!mapElement) {
      return []
    }

    const { width, height } = mapElement.getBoundingClientRect()

    const lngLat1 = map.getMap().unproject([-deadzone, -deadzone]).toArray()
    const lngLat2 = map
      .getMap()
      .unproject([width + deadzone, height + deadzone])
      .toArray()

    const minLng = Math.min(lngLat1[0], lngLat2[0])
    const maxLng = Math.max(lngLat1[0], lngLat2[0])
    const minLat = Math.min(lngLat1[1], lngLat2[1])
    const maxLat = Math.max(lngLat1[1], lngLat2[1])

    const filtered = clusters.filter(cluster => {
      const [longitude, latitude] = cluster.geometry.coordinates
      return longitude >= minLng && longitude <= maxLng && latitude >= minLat && latitude <= maxLat
    })

    return filtered
  }, [clusters, map, throttledViewState?.longitude])

  interface handleClusterClickProps {
    clusterId: number
    latitude: number
    longitude: number
  }

  const handleClusterClick = useCallback(
    ({ clusterId, latitude, longitude }: handleClusterClickProps) => {
      if (!supercluster) return
      const expansionZoom = Math.min(supercluster.getClusterExpansionZoom(clusterId), 14)

      handleMapMove({
        latitude,
        longitude,
        zoom: expansionZoom,
      })
    },
    [handleMapMove, supercluster],
  )

  return displayedItems.map(cluster => {
    if (!cluster || !category) return null
    const [longitude, latitude] = cluster.geometry.coordinates
    const { cluster: isCluster, point_count, id, cluster_id: clusterId } = cluster.properties

    if (isCluster) {
      return (
        <MemoizedMarker
          key={`c-c${clusterId}c${category.id}`}
          markerSize={markerSize}
          latitude={latitude}
          longitude={longitude}
          clusterId={clusterId}
          handleClusterClick={handleClusterClick}
          pointCount={point_count}
          color={themeColor('mapBg')}
          category={category}
        />
      )
    }
    return (
      <MemoizedMarker
        key={`c-v${id}c${category.id}`}
        markerId={id}
        markerSize={markerSize}
        latitude={latitude}
        longitude={longitude}
        clusterId={clusterId}
        handleMarkerClick={handleMarkerClick}
        category={category}
        color={themeColor('mapBg')}
      />
    )
  })
}

export default CategoryMarkerCluster
