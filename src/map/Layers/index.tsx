import type { GeoJSONSource, MapLayerMouseEvent, MapMouseEvent } from 'maplibre-gl'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Layer, Source } from 'react-map-gl/maplibre'

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
  const clusterRadius = useMapStore(state => state.clusterRadius)
  const setMarkerPopup = useMapStore(state => state.setMarkerPopup)
  const { map } = useMapContext()
  const { handleMapMove } = useMapActions()
  const [loadedCategoryImages, setLoadedCategoryImages] = useState<Record<string, true>>({})

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
        const imageId = `category-thumb-${category}`

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
            {loadedCategoryImages[imageId] && <Layer {...iconLayer(category, markerSize)} />}
            <Layer {...clusterCountBadgeLayer(category, markerSize)} />
            <Layer {...clusterCountLayer(category)} />
          </Source>
        )
      }),
    [clusterRadius, getCategoryById, loadedCategoryImages, markerSize, placesGroupedByCategory],
  )

  const onClick = useCallback(
    async (event: MapMouseEvent, category: CATEGORY_ID) => {
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
        const clusterId = clusters[0]?.properties?.cluster_id as number | undefined
        if (clusterId === undefined) return

        const zoom = await mapboxSource.getClusterExpansionZoom(clusterId)
        // be save & return if zoom is undefined
        if (!zoom) return

        handleMapMove({
          latitude: event.lngLat.lat,
          longitude: event.lngLat.lng,
          zoom: zoom + 0.5,
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
    if (!map || !markerCategoryIDs) return undefined

    let isMounted = true
    const clickHandlers: {
      category: CATEGORY_ID
      cluster: (event: MapLayerMouseEvent) => void
      marker: (event: MapLayerMouseEvent) => void
    }[] = []

    markerCategoryIDs.forEach(category => {
      const clusterClick = (event: MapLayerMouseEvent) => {
        void onClick(event, category)
      }
      const markerClick = (event: MapLayerMouseEvent) => {
        void onClick(event, category)
      }

      clickHandlers.push({ category, cluster: clusterClick, marker: markerClick })
      map.on('click', `cluster-${category}`, clusterClick)
      map.on('click', `marker-${category}`, markerClick)

      const catImage = getCategoryById(category)?.iconMedium
      const imageId = `category-thumb-${category}`
      if (!catImage) return

      if (map.hasImage(imageId)) {
        setLoadedCategoryImages(prev => ({ ...prev, [imageId]: true }))
        return
      }

      void map.loadImage(`/${catImage}`).then(image => {
        if (!isMounted || map.hasImage(imageId)) return
        map.addImage(imageId, image.data)
        setLoadedCategoryImages(prev => ({ ...prev, [imageId]: true }))
      })
    })

    return () => {
      isMounted = false

      clickHandlers.forEach(({ category, cluster, marker }) => {
        map.off('click', `cluster-${category}`, cluster)
        map.off('click', `marker-${category}`, marker)
        if (map.hasImage(`category-thumb-${category}`)) {
          map.removeImage(`category-thumb-${category}`)
        }
      })

      setLoadedCategoryImages({})
    }
  }, [getCategoryById, map, markerCategoryIDs, onClick])

  return categoryCluster
}

export default Layers
