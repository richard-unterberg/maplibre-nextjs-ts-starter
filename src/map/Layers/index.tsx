import { useCallback, useEffect, useMemo } from 'react'
import { GeoJSONSource, Layer, Source } from 'react-map-gl'

import useCategories from '@/hooks/useCategories'
import usePlaces from '@/hooks/usePlaces'
import { CATEGORY_ID } from '@/lib/constants'
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
import useMapStore from '@/zustand/useMapStore'
import useSettingsStore from '@/zustand/useSettingsStore'

const Layers = () => {
  const { placesGroupedByCategory, markerCategoryIDs, getPlaceById } = usePlaces()
  const { getCategoryById } = useCategories()
  const markerSize = useSettingsStore(state => state.markerSize)
  const { clusterRadius, setMarkerPopup } = useMapStore()
  const { map } = useMapContext()
  const { handleMapMove } = useMapActions()

  const categoryCluster = useMemo(
    () =>
      Object.entries(placesGroupedByCategory).map(catGroup => {
        const [category, places] = catGroup

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
    (event: mapboxgl.MapMouseEvent & mapboxgl.EventData, category: CATEGORY_ID) => {
      if (!map || !placesGroupedByCategory) return
      event.preventDefault()

      const clusters = map.queryRenderedFeatures(event.point, {
        layers: [`cluster-${category}`],
      })
      const markers = map.queryRenderedFeatures(event.point, {
        layers: [`marker-${category}`],
      })

      const mapboxSource = map.getSource(`source-${category}`) as GeoJSONSource

      if (clusters.length) {
        const clusterId = clusters[0]?.properties?.cluster_id
        mapboxSource.getClusterExpansionZoom(clusterId, (_err, zoom) => {
          // be save & return if zoom is undefined
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
    [getPlaceById, handleMapMove, map, setMarkerPopup, placesGroupedByCategory],
  )

  useEffect(() => {
    map &&
      markerCategoryIDs?.forEach(category => {
        map.on('click', `cluster-${category}`, e => onClick(e, category))
        map.on('click', `marker-${category}`, e => onClick(e, category))

        const catImage = getCategoryById(category)?.iconMedium || ''

        map?.loadImage(`${catImage}`, (error, image) => {
          if (!map.hasImage(`category-thumb-${category}`)) {
            if (!image || error) return
            map.addImage(`category-thumb-${category}`, image)
          }
        })
      })

    return () => {
      map &&
        markerCategoryIDs?.forEach(category => {
          map.off('click', `cluster-${category}`, e => onClick(e, category))
          map.off('click', `marker-${category}`, e => onClick(e, category))
          if (map.hasImage(`category-thumb-${category}`)) {
            map.removeImage(`category-thumb-${category}`)
          }
        })
    }
  }, [getCategoryById, map, markerCategoryIDs, onClick])

  return categoryCluster
}

export default Layers
