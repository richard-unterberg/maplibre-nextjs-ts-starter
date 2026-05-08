import { useCallback, useEffect, useMemo } from 'react'
import { Layer, Source } from 'react-map-gl/maplibre'

import useCategories from '@/hooks/useCategories'
import usePlaces from '@/hooks/usePlaces'
import {
  clusterBelowLayer,
  clusterCountBadgeLayer,
  clusterCountLayer,
  clusterLayer,
  iconLayer,
  markerLayer,
} from '@/map/Layers/layers'
import useMapActions from '@/map/useMapActions'
import useMapContext from '@/map/useMapContext'
import { CATEGORY_ID } from '@/shared/constants/constants'
import useMapStore from '@/zustand/useMapStore'
import useSettingsStore from '@/zustand/useSettingsStore'

const Layers = () => {
  const { placesGroupedByCategory, markerCategoryIDs, getPlaceById } = usePlaces()
  const { getCategoryById } = useCategories()
  const markerSize = useSettingsStore(state => state.markerSize)
  const clusterRadius = useMapStore(state => state.clusterRadius)
  const setMarkerPopup = useMapStore(state => state.setMarkerPopup)
  const { map } = useMapContext()
  const { handleMapMove } = useMapActions()

  const categoryCluster = useMemo(
    () =>
      Object.entries(placesGroupedByCategory).map(([category, places]) => {
        const features: GeoJSON.Feature<GeoJSON.Point>[] = places.map(place => ({
          type: 'Feature',
          properties: {
            id: place.id,
            category,
          },
          geometry: {
            type: 'Point',
            coordinates: [place.longitude, place.latitude],
          },
        }))

        const collection: GeoJSON.FeatureCollection<GeoJSON.Point> = {
          type: 'FeatureCollection',
          features,
        }

        const catColor = getCategoryById(parseFloat(category))?.color || 'red'

        return (
          <Source
            key={`${category}${clusterRadius}`}
            id={`source-${category}`}
            type="geojson"
            data={collection}
            clusterMaxZoom={17}
            clusterRadius={clusterRadius}
            cluster
          >
            <Layer {...markerLayer(category, markerSize, catColor)} />
            <Layer {...clusterBelowLayer(category, markerSize, catColor)} />
            <Layer {...clusterLayer(category, markerSize, catColor)} />
            <Layer {...iconLayer(category, markerSize)} />
            <Layer {...clusterCountBadgeLayer(category, markerSize)} />
            <Layer {...clusterCountLayer(category)} />
          </Source>
        )
      }),
    [clusterRadius, getCategoryById, markerSize, placesGroupedByCategory],
  )

  const onClick = useCallback(
    (event: any, category: CATEGORY_ID) => {
      if (!map || !placesGroupedByCategory) return

      event.preventDefault?.()

      const clusters = map.queryRenderedFeatures(event.point, {
        layers: [`cluster-${category}`],
      })

      const markers = map.queryRenderedFeatures(event.point, {
        layers: [`marker-${category}`],
      })

      const mapSource = map.getSource(`source-${category}`) as any

      if (clusters.length) {
        const clusterId = clusters[0]?.properties?.cluster_id

        mapSource?.getClusterExpansionZoom?.(clusterId, (_err: unknown, zoom: number) => {
          if (!zoom) return

          handleMapMove({
            latitude: event.lngLat.lat,
            longitude: event.lngLat.lng,
            zoom: zoom + 0.5,
          })
        })

        return
      }

      const markerId = markers[0]?.properties?.id
      const place = getPlaceById(markerId)

      if (!place) return

      setMarkerPopup(place.id)

      handleMapMove({
        latitude: place.latitude,
        longitude: place.longitude,
        fly: false,
        zoom: map.getZoom(),
        offset: [0, -30],
        mouseUpOnceCallback: () => {
          setMarkerPopup(undefined)
        },
      })
    },
    [getPlaceById, handleMapMove, map, placesGroupedByCategory, setMarkerPopup],
  )

  useEffect(() => {
    if (!map) return

    const handlers: {
      category: CATEGORY_ID
      clusterHandler: (e: any) => void
      markerHandler: (e: any) => void
    }[] = []

    markerCategoryIDs?.forEach(category => {
      const clusterHandler = (e: any) => onClick(e, category)
      const markerHandler = (e: any) => onClick(e, category)

      handlers.push({ category, clusterHandler, markerHandler })

      map.on('click', `cluster-${category}`, clusterHandler)
      map.on('click', `marker-${category}`, markerHandler)

      const catImage = getCategoryById(category)?.iconMedium || ''

      if (catImage) {
        map
          .loadImage(catImage)
          .then(image => {
            if (!map.hasImage(`category-thumb-${category}`)) {
              map.addImage(`category-thumb-${category}`, image.data)
            }
          })
          .catch(() => {
            // ignore missing image
          })
      }
    })

    return () => {
      handlers.forEach(({ category, clusterHandler, markerHandler }) => {
        map.off('click', `cluster-${category}`, clusterHandler)
        map.off('click', `marker-${category}`, markerHandler)

        if (map.hasImage(`category-thumb-${category}`)) {
          map.removeImage(`category-thumb-${category}`)
        }
      })
    }
  }, [getCategoryById, map, markerCategoryIDs, onClick])

  return <>{categoryCluster}</>
}

export default Layers
