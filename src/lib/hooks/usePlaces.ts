import { FitBoundsOptions, fitBounds } from '@math.gl/web-mercator'
import { useCallback, useMemo, useRef } from 'react'

import useCategories from '@/hooks/useCategories'
import useDetectScreen from '@/hooks/useDetectScreen'
import { apiPlaces } from '@/lib/api/placesMock'
import { CATEGORY_ID } from '@/lib/constants'
import { Place } from '@/lib/types/entityTypes'
import useMapStore from '@/zustand/useMapStore'
import useSettingsStore from '@/zustand/useSettingsStore'

const limitPlacesLength = (arr: Place[], length: number) => {
  if (arr.length > length) {
    return arr.slice(0, length)
  }
  return arr
}

/** hook to use the places from a cached api request */
const usePlaces = () => {
  const selectedCategory = useMapStore(state => state.selectedCategory)
  const markersCount = useSettingsStore(state => state.markersCount)
  const { viewportWidth, viewportHeight } = useDetectScreen()
  const { categories } = useCategories()

  // use api call here
  const { current: rawPlaces } = useRef(apiPlaces)

  /** returns places by id input */
  const getCatPlaces = useCallback(
    (id: CATEGORY_ID) => rawPlaces.filter(place => place.category === id),
    [rawPlaces],
  )

  /** this mostly internally used memo contains the limiter - remove it in your application on demand */
  const markerData = useMemo(
    () =>
      limitPlacesLength(
        !selectedCategory ? apiPlaces : getCatPlaces(selectedCategory.id),
        markersCount,
      ),
    [getCatPlaces, markersCount, selectedCategory],
  )

  /** get unique category ids for all markers */
  const markerCategoryIDs = useMemo(
    () => (markerData ? [...new Set(markerData.map(x => x.category))] : undefined),
    [markerData],
  )

  /** returns category objects for all markers */
  const markerCategories = useMemo(
    () =>
      markerCategoryIDs ? markerCategoryIDs.map((key: CATEGORY_ID) => categories[key]) : undefined,
    [categories, markerCategoryIDs],
  )

  /** returns places by selected category from store */
  const catPlaces = useMemo(
    () => markerData.filter(place => place.category === selectedCategory?.id),

    [selectedCategory, markerData],
  )

  /** record of places grouped by category ID */
  const placesGroupedByCategory = useMemo(() => {
    // Initialize an empty object to store the grouped places
    const group: Record<CATEGORY_ID, Place[]> = {} as Record<CATEGORY_ID, Place[]>

    // Group the places by category
    markerData.forEach(place => {
      const { category } = place
      if (!group[category]) {
        group[category] = []
      }
      group[category].push(place)
    })

    return group
  }, [markerData])

  /** get place object by id input */
  const getPlaceById = useCallback(
    (id: Place['id']) => rawPlaces.find(place => place.id === id),
    [rawPlaces],
  )

  const getPlacesBounds = useCallback(
    (places: Place[], options?: FitBoundsOptions) => {
      if (!viewportWidth || !viewportHeight) return undefined

      const lat = places.map(p => p.latitude)
      const lng = places.map(p => p.longitude)

      const bounds: FitBoundsOptions['bounds'] = [
        [Math.min.apply(null, lng), Math.min.apply(null, lat)],
        [Math.max.apply(null, lng), Math.max.apply(null, lat)],
      ]

      if (bounds[0][0] === Infinity || bounds[0][1] === Infinity) return undefined

      return fitBounds({
        bounds,
        width: viewportWidth,
        height: viewportHeight,
        padding: {
          bottom: 100,
          left: 50,
          right: 50,
          // Specifying the top padding, but getting the bottom one
          top: 150,
        },
        options,
      } as FitBoundsOptions)
    },
    [viewportHeight, viewportWidth],
  )

  // calc bounds of all input markers
  const catPlacesBounds = useMemo(() => {
    if (!viewportWidth || !viewportHeight || !selectedCategory) return undefined

    return getPlacesBounds(catPlaces)
  }, [catPlaces, getPlacesBounds, selectedCategory, viewportHeight, viewportWidth])

  // calc bounds of all selected category markers
  const allPlacesBounds = useMemo(() => {
    if (!markerData) return undefined

    return getPlacesBounds(markerData)
  }, [markerData, getPlacesBounds])

  const currentBounds = useMemo(
    () => (selectedCategory ? catPlacesBounds : allPlacesBounds),

    [selectedCategory, catPlacesBounds, allPlacesBounds],
  )

  return {
    rawPlaces,
    markerData,
    catPlaces,
    markerCategoryIDs,
    markerCategories,
    allPlacesBounds,
    currentBounds,
    placesGroupedByCategory,
    getCatPlaces,
    getPlaceById,
  } as const
}

export default usePlaces
